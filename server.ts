import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing with request size limit
app.use(express.json({ limit: "5mb" }));

// In-memory lead storage to simulate a database (CRM-ready)
const leads: any[] = [];
const callbacks: any[] = [];
const fareAlerts: any[] = [];

// Simple spam control (limit consecutive requests)
const ipRequestHistory: Record<string, number[]> = {};
const rateLimitMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  
  if (!ipRequestHistory[ip]) {
    ipRequestHistory[ip] = [];
  }
  
  // Clean entries older than 1 minute
  ipRequestHistory[ip] = ipRequestHistory[ip].filter(t => now - t < 60000);
  
  if (ipRequestHistory[ip].length >= 30) {
    res.status(429).json({ error: "Too many requests. Please try again in a minute." });
    return;
  }
  
  ipRequestHistory[ip].push(now);
  next();
};

app.use("/api/", rateLimitMiddleware);

// --- API Endpoints ---

// 1. Submit Flight Enquiry / Lead
app.post("/api/enquiry", (req, res) => {
  try {
    const {
      name, email, phone, origin, destination,
      departDate, returnDate, tripType,
      adults = 1, children = 0, infants = 0,
      cabin = "Economy", flexibleDates = "exact",
      preferredContact = "email", message, consent,
      source = "direct"
    } = req.body;

    if (!name || !email || !phone || !origin || !destination || !departDate) {
      res.status(400).json({ error: "Missing required fields for flight enquiry." });
      return;
    }

    if (!consent) {
      res.status(400).json({ error: "Consent checkbox is required to process enquiry." });
      return;
    }

    const leadId = `FDI-${Math.floor(100000 + Math.random() * 900000)}`;
    const newLead = {
      leadId,
      source,
      name,
      email,
      phone,
      origin,
      destination,
      departDate,
      returnDate,
      tripType,
      travellers: { adults, children, infants },
      cabin,
      flexibleDates,
      preferredContact,
      message,
      consent,
      specialtyData: req.body.specialtyData || null,
      createdAt: new Date().toISOString(),
      status: "new"
    };

    leads.push(newLead);

    // Mock Send Email to Travel Specialist
    console.log(`[EMAIL SEND OUT] Target: specialist@flightdeskinternational.com | Subject: NEW LEAD ${leadId} from ${name}`);
    console.log(`Route: ${origin} -> ${destination} | Cabin: ${cabin} | Contact: ${preferredContact} (${phone})`);

    res.status(201).json({
      success: true,
      message: "Your travel enquiry was received successfully.",
      leadId,
      lead: newLead
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error." });
  }
});

// 2. Schedule callback
app.post("/api/callback", (req, res) => {
  try {
    const { name, phone, date, timeSlot, timezone = "EST", language = "English", source = "callback-widget" } = req.body;

    if (!name || !phone || !date || !timeSlot) {
      res.status(400).json({ error: "Missing required details for callback scheduler." });
      return;
    }

    const callbackId = `CB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCallback = {
      callbackId,
      name,
      phone,
      date,
      timeSlot,
      timezone,
      language,
      source,
      createdAt: new Date().toISOString(),
      status: "scheduled"
    };

    callbacks.push(newCallback);

    console.log(`[CALLBACK SCHEDULED] Ref: ${callbackId} | Target: ${name} (${phone}) on ${date} @ ${timeSlot} (${timezone})`);

    res.status(201).json({
      success: true,
      message: "Callback scheduled successfully.",
      callbackId,
      callback: newCallback
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error." });
  }
});

// 3. Fare Alert subscription
app.post("/api/fare-alert", (req, res) => {
  try {
    const { origin, destination, travelMonth, email, currency = "CAD" } = req.body;

    if (!origin || !destination || !travelMonth || !email) {
      res.status(400).json({ error: "Missing required details for fare alert subscription." });
      return;
    }

    const alertId = `FA-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAlert = {
      alertId,
      origin,
      destination,
      travelMonth,
      email,
      currency,
      createdAt: new Date().toISOString()
    };

    fareAlerts.push(newAlert);

    console.log(`[FARE ALERT SIGNUP] Ref: ${alertId} | Route: ${origin} -> ${destination} for ${travelMonth} | Email: ${email}`);

    res.status(201).json({
      success: true,
      message: "Subscribed to fare alerts successfully.",
      alertId
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error." });
  }
});

// 4. Server-side Gemini AI Travel Assistant
// Lazy client initialization inside the route to prevent load-time crash if GEMINI_API_KEY is not defined.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured on the server.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user' | 'model', content: string }

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid request payload. 'messages' array is required." });
      return;
    }

    // Attempt to grab Gemini client
    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      console.warn("Gemini Client initialization failed:", err.message);
      res.json({
        reply: "Hello! I am the Flight Desk AI Travel Specialist. Our AI server is currently running in trial mode without a valid API key. However, you can still call us directly at 1-800-413-3932 or click the WhatsApp button to chat with our live human specialists instantly!",
        offlineMode: true
      });
      return;
    }

    // Build the chat request parameter for GoogleGenAI
    // The model will be gemini-3.5-flash as recommended for basic/conversational Q&A tasks
    const systemInstruction = `You are the Flight Desk International AI Travel specialist. 
Your tone is helpful, highly professional, warm, and focused on generating qualified enquiries.
Explain travel route guidelines (USA to India, Canada to India, Australia to India).
Keep responses informative and concise. Highlight that our agency has access to phone-exclusive, offline promotional inventories with major airlines that are not published online.
Whenever possible, politely encourage the traveler to request a direct callback, call our toll-free support line at 1-800-413-3932, or submit our simple enquiry form to get an exact custom quote with taxes included.
Do not make up fake prices, fake flight availabilities, or claim you are issuing tickets directly. Focus on customized human-assisted routing and baggage support.
Keep your answer relatively brief (under 120 words) for optimal readability.`;

    // Map message roles to Gemini format
    // gemini-3.5-flash content parts structure: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      reply: response.text || "I am here to help you coordinate your international journey. Please let me know your departure and destination cities!",
      offlineMode: false
    });
  } catch (error: any) {
    console.error("Gemini route error:", error);
    res.json({
      reply: "Thank you for reaching out! It looks like our AI system is experiencing a temporary network lag. To get an immediate custom flight quote or live help, please call our 24/7 travel experts at 1-800-413-3932 or reach us via WhatsApp!",
      offlineMode: true
    });
  }
});

// 5. CRM Portal: Fetch all enquiries, callbacks, and alerts (Secured via simple access code)
app.get("/api/admin/leads", (req, res) => {
  try {
    const { code } = req.query;
    const ACCESS_CODE = "1234"; // Customizable simple default access code requested by user

    if (code !== ACCESS_CODE) {
      res.status(401).json({ error: "Unauthorized. Invalid access code." });
      return;
    }

    res.json({
      success: true,
      leads: leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      callbacks: callbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      fareAlerts: fareAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch CRM leads." });
  }
});

// 6. CRM Portal: Update Lead / Callback Status
app.post("/api/admin/leads/status", (req, res) => {
  try {
    const { code, type, id, status } = req.body;
    const ACCESS_CODE = "1234";

    if (code !== ACCESS_CODE) {
      res.status(401).json({ error: "Unauthorized. Invalid access code." });
      return;
    }

    if (!type || !id || !status) {
      res.status(400).json({ error: "Missing type, id, or status parameter." });
      return;
    }

    if (type === "enquiry") {
      const idx = leads.findIndex(l => l.leadId === id);
      if (idx !== -1) {
        leads[idx].status = status;
        res.json({ success: true, message: `Enquiry ${id} status updated to ${status}.`, lead: leads[idx] });
        return;
      }
    } else if (type === "callback") {
      const idx = callbacks.findIndex(c => c.callbackId === id);
      if (idx !== -1) {
        callbacks[idx].status = status;
        res.json({ success: true, message: `Callback ${id} status updated to ${status}.`, callback: callbacks[idx] });
        return;
      }
    }

    res.status(404).json({ error: "Entry not found." });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update status." });
  }
});

// --- Vite & Client App Static Serving ---

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local development URL: http://localhost:${PORT}`);
  });
}

setupServer();
