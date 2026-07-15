export interface FlightDeal {
  id: string;
  originCountry: 'USA' | 'Canada' | 'Australia' | 'India';
  originCity: string;
  originCode: string;
  destCity: string;
  destCode: string;
  sampleFare: number;
  currency: 'USD' | 'CAD' | 'AUD' | 'INR';
  cabin: 'Economy' | 'Premium Economy' | 'Business' | 'First Class';
  tripType: 'One Way' | 'Round Trip';
  isFeatured?: boolean;
}

export interface FAQItem {
  id: string;
  category: 'booking' | 'payment' | 'baggage' | 'general';
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  route: string;
  rating: number;
  content: string;
  date: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
}

export const FLIGHT_DEALS: FlightDeal[] = [
  // USA TO INDIA ROUTES
  { id: 'u-1', originCountry: 'USA', originCity: 'New York', originCode: 'JFK', destCity: 'Hyderabad', destCode: 'HYD', sampleFare: 1099, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'u-2', originCountry: 'USA', originCity: 'Dallas', originCode: 'DFW', destCity: 'Delhi', destCode: 'DEL', sampleFare: 998, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'u-3', originCountry: 'USA', originCity: 'New York', originCode: 'JFK', destCity: 'Delhi', destCode: 'DEL', sampleFare: 980, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'u-4', originCountry: 'USA', originCity: 'Boston', originCode: 'BOS', destCity: 'Delhi', destCode: 'DEL', sampleFare: 1099, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-5', originCountry: 'USA', originCity: 'Miami', originCode: 'MIA', destCity: 'Delhi', destCode: 'DEL', sampleFare: 1090, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-6', originCountry: 'USA', originCity: 'Kansas City', originCode: 'MCI', destCity: 'Delhi', destCode: 'DEL', sampleFare: 989, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-7', originCountry: 'USA', originCity: 'Chicago', originCode: 'ORD', destCity: 'Ahmedabad', destCode: 'AMD', sampleFare: 980, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'u-8', originCountry: 'USA', originCity: 'Dallas', originCode: 'DFW', destCity: 'Ahmedabad', destCode: 'AMD', sampleFare: 989, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-9', originCountry: 'USA', originCity: 'New York', originCode: 'JFK', destCity: 'Ahmedabad', destCode: 'AMD', sampleFare: 970, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-10', originCountry: 'USA', originCity: 'Boston', originCode: 'BOS', destCity: 'Ahmedabad', destCode: 'AMD', sampleFare: 999, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-11', originCountry: 'USA', originCity: 'Miami', originCode: 'MIA', destCity: 'Ahmedabad', destCode: 'AMD', sampleFare: 999, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-12', originCountry: 'USA', originCity: 'Kansas City', originCode: 'MCI', destCity: 'Ahmedabad', destCode: 'AMD', sampleFare: 998, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-13', originCountry: 'USA', originCity: 'New York', originCode: 'JFK', destCity: 'Chennai', destCode: 'MAA', sampleFare: 980, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-14', originCountry: 'USA', originCity: 'Boston', originCode: 'BOS', destCity: 'Chennai', destCode: 'MAA', sampleFare: 989, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-15', originCountry: 'USA', originCity: 'Miami', originCode: 'MIA', destCity: 'Chennai', destCode: 'MAA', sampleFare: 980, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-16', originCountry: 'USA', originCity: 'Kansas City', originCode: 'MCI', destCity: 'Chennai', destCode: 'MAA', sampleFare: 990, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-17', originCountry: 'USA', originCity: 'Atlanta', originCode: 'ATL', destCity: 'Chennai', destCode: 'MAA', sampleFare: 999, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-18', originCountry: 'USA', originCity: 'Chicago', originCode: 'ORD', destCity: 'Chennai', destCode: 'MAA', sampleFare: 999, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'u-19', originCountry: 'USA', originCity: 'Boston', originCode: 'BOS', destCity: 'Hyderabad', destCode: 'HYD', sampleFare: 795, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'u-20', originCountry: 'USA', originCity: 'Atlanta', originCode: 'ATL', destCity: 'Hyderabad', destCode: 'HYD', sampleFare: 899, currency: 'USD', cabin: 'Economy', tripType: 'Round Trip' },

  // CANADA TO INDIA ROUTES
  { id: 'c-1', originCountry: 'Canada', originCity: 'Toronto', originCode: 'YYZ', destCity: 'Pune', destCode: 'PNQ', sampleFare: 1199, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'c-2', originCountry: 'Canada', originCity: 'Vancouver', originCode: 'YVR', destCity: 'Amritsar', destCode: 'ATQ', sampleFare: 998, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'c-3', originCountry: 'Canada', originCity: 'Edmonton', originCode: 'YEG', destCity: 'Kochi', destCode: 'COK', sampleFare: 1095, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'c-4', originCountry: 'Canada', originCity: 'Montreal', originCode: 'YUL', destCity: 'Hyderabad', destCode: 'HYD', sampleFare: 989, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'c-5', originCountry: 'Canada', originCity: 'Calgary', originCode: 'YYC', destCity: 'Delhi', destCode: 'DEL', sampleFare: 1099, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'c-6', originCountry: 'Canada', originCity: 'Ottawa', originCode: 'YOW', destCity: 'Mumbai', destCode: 'BOM', sampleFare: 1070, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip' },

  // INDIA TO CANADA ROUTES
  { id: 'ic-1', originCountry: 'India', originCity: 'Delhi', originCode: 'DEL', destCity: 'Toronto', destCode: 'YYZ', sampleFare: 986, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'ic-2', originCountry: 'India', originCity: 'Delhi', originCode: 'DEL', destCity: 'Vancouver', destCode: 'YVR', sampleFare: 875, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'ic-3', originCountry: 'India', originCity: 'Delhi', originCode: 'DEL', destCity: 'Edmonton', destCode: 'YEG', sampleFare: 1095, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'ic-4', originCountry: 'India', originCity: 'Hyderabad', originCode: 'HYD', destCity: 'Montreal', destCode: 'YUL', sampleFare: 1125, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'ic-5', originCountry: 'India', originCity: 'Delhi', originCode: 'DEL', destCity: 'Calgary', destCode: 'YYC', sampleFare: 985, currency: 'CAD', cabin: 'Economy', tripType: 'Round Trip' },

  // AUSTRALIA TO INDIA ROUTES
  { id: 'a-1', originCountry: 'Australia', originCity: 'Sydney', originCode: 'SYD', destCity: 'Delhi', destCode: 'DEL', sampleFare: 899, currency: 'AUD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },
  { id: 'a-2', originCountry: 'Australia', originCity: 'Melbourne', originCode: 'MEL', destCity: 'Mumbai', destCode: 'BOM', sampleFare: 879, currency: 'AUD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'a-3', originCountry: 'Australia', originCity: 'Brisbane', originCode: 'BNE', destCity: 'Hyderabad', destCode: 'HYD', sampleFare: 940, currency: 'AUD', cabin: 'Economy', tripType: 'Round Trip' },
  { id: 'a-4', originCountry: 'Australia', originCity: 'Perth', originCode: 'PER', destCity: 'Delhi', destCode: 'DEL', sampleFare: 780, currency: 'AUD', cabin: 'Economy', tripType: 'Round Trip', isFeatured: true },

  // BUSINESS CLASS SELECTION (Promo items)
  { id: 'b-1', originCountry: 'USA', originCity: 'San Francisco', originCode: 'SFO', destCity: 'Delhi', destCode: 'DEL', sampleFare: 2999, currency: 'USD', cabin: 'Business', tripType: 'Round Trip', isFeatured: true },
  { id: 'b-2', originCountry: 'Canada', originCity: 'Toronto', originCode: 'YYZ', destCity: 'Mumbai', destCode: 'BOM', sampleFare: 3499, currency: 'CAD', cabin: 'Business', tripType: 'Round Trip', isFeatured: true },
  { id: 'b-3', originCountry: 'Australia', originCity: 'Sydney', originCode: 'SYD', destCity: 'Delhi', destCode: 'DEL', sampleFare: 2899, currency: 'AUD', cabin: 'Business', tripType: 'Round Trip' }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'How do I request a flight quotation?',
    answer: 'You can submit your flight requirements using our website forms, schedule a callback, contact us directly via WhatsApp, or call our toll-free support line. An experienced travel specialist will evaluate your request and contact you with custom route and fare options.'
  },
  {
    id: 'faq-2',
    category: 'booking',
    question: 'Are displayed fares guaranteed?',
    answer: 'No. Displayed fares are sample promotional rates based on historic deals. Fares fluctuate constantly depending on airline seat availability, seasonality, and ticketing rules. Contact an agent to confirm live availability and lock in the final fare.'
  },
  {
    id: 'faq-3',
    category: 'general',
    question: 'Can you help with one-way and round-trip travel?',
    answer: 'Absolutely. We arrange both simple one-way and comprehensive round-trip itineraries, aligning with your timeline and luggage requirements across multiple airlines.'
  },
  {
    id: 'faq-4',
    category: 'booking',
    question: 'Do you assist with multi-city itineraries?',
    answer: 'Yes, our travel agents specialize in complex, multi-city itineraries. You can define up to six distinct flight legs in our multi-city planner, and we will structure options to reduce layover times and costs.'
  },
  {
    id: 'faq-5',
    category: 'general',
    question: 'Can I request business-class options?',
    answer: 'Yes. We offer phone-exclusive discount fares on Premium Economy, Business Class, and First Class cabins, including flat-bed configurations and luxury lounge access benefits.'
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Can you assist families and large groups?',
    answer: 'Yes, we specialize in group bookings for families, religious tours, students, corporate teams, and weddings. Group travel of 10 or more passengers often qualifies for special locked-in rates and flexible payment structures.'
  },
  {
    id: 'faq-7',
    category: 'general',
    question: 'What information is needed for a quotation?',
    answer: 'To prepare a personalized quotation, we need the traveler name, contact details (phone and email), departure/arrival airports, target travel dates, preferred cabin class, number of passengers, and any airline or luggage preferences.'
  },
  {
    id: 'faq-8',
    category: 'booking',
    question: 'Are taxes included in advertised prices?',
    answer: 'Advertised promotional prices typically show sample base fares. When you receive a formal quotation from our agent, it will clearly break down all applicable government taxes, fuel surcharges, and agency ticketing fees.'
  },
  {
    id: 'faq-9',
    category: 'general',
    question: 'How quickly will an agent contact me?',
    answer: 'During our business hours, a dedicated travel specialist will typically call or email you within 15 to 30 minutes of submitting your enquiry.'
  },
  {
    id: 'faq-10',
    category: 'booking',
    question: 'Can I request wheelchair or meal assistance?',
    answer: 'Yes. We register special service requests with airlines on your behalf, including wheelchair assistance, special dietary meals (vegetarian, halal, kosher, diabetic, etc.), and infant bassinet reservations.'
  },
  {
    id: 'faq-11',
    category: 'payment',
    question: 'How are cancellations and refunds handled?',
    answer: 'Cancellations and refunds are strictly governed by individual airline fare rules. Most promotional fares are highly restrictive and may be non-refundable or subject to standard change fees. Contact your assigned agent immediately if your plans change.'
  },
  {
    id: 'faq-12',
    category: 'booking',
    question: 'Is submitting an enquiry the same as confirming a booking?',
    answer: 'No. Submitting an enquiry or requesting a callback is completely non-binding and creates no financial or ticketing obligation. A booking is only confirmed once you review the detailed itinerary with an agent, accept the final price, and complete the payment process.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Gurpreet Singh',
    location: 'Brampton, ON',
    route: 'Toronto (YYZ) to Amritsar (ATQ)',
    rating: 5,
    content: 'Excellent personalized service! I was trying to find flights to Amritsar for my parents during the festive peak. The agent arranged a customized itinerary with a shorter connection in London. Saved us over $300 per ticket compared to online booking sites.',
    date: 'June 2026'
  },
  {
    id: 'test-2',
    name: 'Anjali Sharma',
    location: 'Chicago, IL',
    route: 'Chicago (ORD) to Ahmedabad (AMD)',
    rating: 5,
    content: 'Very helpful and professional staff. I had a multi-city route covering Delhi and Ahmedabad. They coordinated the baggage rules perfectly across code-shared airlines. Highly recommend their senior citizen travel assistance, my mother felt very supported.',
    date: 'May 2026'
  },
  {
    id: 'test-3',
    name: 'David Miller',
    location: 'Sydney, NSW',
    route: 'Sydney (SYD) to Mumbai (BOM)',
    rating: 5,
    content: 'Booked Business Class tickets for my business tour. The prices they secured were unmatched, and they arranged a complimentary seat assignment and meal request instantly. Fast and responsive customer service via WhatsApp.',
    date: 'April 2026'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b-1',
    slug: 'flexible-canada-india-flight-options',
    title: 'How to Find Flexible Canada to India Flight Options',
    summary: 'Navigating peak seasons, baggage allowances, and flight layovers when traveling between Canada and India. Discover core travel secrets.',
    content: `Traveling between Canada and India is an exciting but often complex journey, especially during peak festive periods (Diwali, winter breaks) or the summer travel rush. Securing affordable fares while balancing travel comfort requires a strategic approach.

### 1. Identify Alternative Origins and Destinations
If Toronto (YYZ) to Delhi (DEL) is showing unusually high pricing, consider routing through adjacent airports. For instance, departing from Montreal (YUL) or connecting into Pune (PNQ) or Hyderabad (HYD) instead of Delhi can unlock hidden promotional inventories.

### 2. Prioritize Baggage Allowance
Many international travelers carry significant cargo when visiting family. When comparing flight options, do not look solely at the base fare. An ticket that is $50 cheaper might charge $150 for an extra piece of luggage. Travel agents have access to special ethnic and student fare structures that include an additional baggage piece free of charge.

### 3. Choose the Right Connection Layovers
Ultra-short layovers (under 90 minutes) are highly risky when transferring luggage. Conversely, excessively long layovers exhaust families traveling with children or elders. Aim for a sweet spot of 2.5 to 4 hours in intermediate hubs like London, Dubai, Doha, or Munich.

Contact a Flyhigh specialist today to explore unpublished, phone-exclusive fares matching your travel dates!`,
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop',
    date: 'July 10, 2026',
    readTime: '4 min read'
  },
  {
    id: 'b-2',
    slug: 'direct-vs-connecting-flights-india',
    title: 'Choosing Between Direct and Connecting Flights to India',
    summary: 'A comprehensive comparison of flight comfort, layover hubs, luggage transfers, and overall costs to help you plan smart.',
    content: `When planning your flight to India, one of the first major decisions is choosing between a non-stop direct flight or a flight with one or more connections. Here is an objective assessment to guide your next booking.

### Direct Flights (Non-Stop)
**Pros:**
* **Time Savings:** Reduces travel time by 4 to 8 hours.
* **Reduced Stress:** Avoid running between gates in foreign hub airports.
* **Less Luggage Risk:** Checked bags stay secure on a single aircraft.

**Cons:**
* **Higher Fares:** Airlines charge a premium for the convenience of non-stop routes.
* **Physical Exhaustion:** Sitting on a plane for 14-16 hours straight can be physically taxing.

### Connecting Flights (One-Stop)
**Pros:**
* **Budget Friendly:** Connecting flights are almost always more cost-effective.
* **Break the Journey:** Walk around, stretch, and relax at intermediate world-class hubs like Doha, Dubai, or Singapore.
* **More Airline Selection:** Dozens of premium carriers operate connecting services.

**Cons:**
* **Longer Travel Duration:** Layovers extend travel times.
* **Missed Connections:** Flights delays on the first leg can cause gate disruptions on the second.

Consult with our travel planners to evaluate the best flight options customized to your physical comfort and financial budget.`,
    category: 'Route Analysis',
    image: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=600&auto=format&fit=crop',
    date: 'June 22, 2026',
    readTime: '5 min read'
  }
];

export const AIRPORTS = [
  { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Pearson International' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', name: 'Vancouver International' },
  { code: 'YYC', city: 'Calgary', country: 'Canada', name: 'Calgary International' },
  { code: 'YEG', city: 'Edmonton', country: 'Canada', name: 'Edmonton International' },
  { code: 'YUL', city: 'Montreal', country: 'Canada', name: 'Trudeau International' },
  { code: 'YOW', city: 'Ottawa', country: 'Canada', name: 'Macdonald-Cartier International' },
  
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy International' },
  { code: 'ORD', city: 'Chicago', country: 'USA', name: 'O\'Hare International' },
  { code: 'SFO', city: 'San Francisco', country: 'USA', name: 'San Francisco International' },
  { code: 'DFW', city: 'Dallas', country: 'USA', name: 'Dallas/Fort Worth International' },
  { code: 'BOS', city: 'Boston', country: 'USA', name: 'Logan International' },
  { code: 'MIA', city: 'Miami', country: 'USA', name: 'Miami International' },
  { code: 'ATL', city: 'Atlanta', country: 'USA', name: 'Hartsfield-Jackson International' },
  { code: 'MCI', city: 'Kansas City', country: 'USA', name: 'Kansas City International' },

  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Kingsford Smith' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', name: 'Melbourne Airport' },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', name: 'Brisbane Airport' },
  { code: 'PER', city: 'Perth', country: 'Australia', name: 'Perth Airport' },

  { code: 'DEL', city: 'Delhi', country: 'India', name: 'Indira Gandhi International' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj' },
  { code: 'AMD', city: 'Ahmedabad', country: 'India', name: 'Sardar Vallabhbhai Patel' },
  { code: 'ATQ', city: 'Amritsar', country: 'India', name: 'Sri Guru Ram Dass Jee' },
  { code: 'HYD', city: 'Hyderabad', country: 'India', name: 'Rajiv Gandhi International' },
  { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai International' },
  { code: 'COK', city: 'Kochi', country: 'India', name: 'Cochin International' },
  { code: 'PNQ', city: 'Pune', country: 'India', name: 'Pune Airport' },
  { code: 'BLR', city: 'Bengaluru', country: 'India', name: 'Kempegowda International' },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhash Chandra Bose' }
];

export const OFFICE_CONTACTS = {
  tollFree: '1-800-413-3932',
  whatsapp: '+1 (416) 555-0199',
  email: 'enquiries@flyhigh.ca',
  workingHours: 'Mon - Sun: 24/7 (Human Travel Specialists Active)',
  canadaOffice: 'Suite 302, 7900 Hurontario St, Brampton, ON L6Y 0P6, Canada',
  usaOffice: 'Empire State Building, 350 5th Ave, New York, NY 10118, USA',
  australiaOffice: 'Level 35, One International Towers, 100 Barangaroo Ave, Sydney, NSW 2000, Australia',
  indiaOffice: 'Unit 405, S.G. Highway, Ahmedabad, Gujarat 380054, India'
};
