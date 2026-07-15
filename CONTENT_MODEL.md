# Content Model - Flight Desk International

To ensure the website is completely admin-ready, all dynamic and promotional content is modeled as structured data rather than hardcoded in JSX.

## Data Structures

### 1. Flight Deal (`FlightDeal`)
Represents an origin-to-destination promotional route.
```typescript
interface FlightDeal {
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
```

### 2. FAQ Item (`FAQItem`)
```typescript
interface FAQItem {
  id: string;
  category: 'booking' | 'payment' | 'baggage' | 'general';
  question: string;
  answer: string;
}
```

### 3. Testimonial (`Testimonial`)
```typescript
interface Testimonial {
  id: string;
  name: string;
  location: string;
  route: string;
  rating: number;
  content: string;
  date: string;
}
```

### 4. Blog Post (`BlogPost`)
```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown supported
  category: string;
  image: string;
  date: string;
  readTime: string;
}
```

### 5. Lead Form Payload (`LeadEnquiry`)
Logged server-side and routed to database/analytics layers.
```typescript
interface LeadEnquiry {
  leadId: string;
  source: string; // e.g., 'hero-form', '10s-popup', 'deal-card', 'callback-scheduler'
  name: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  tripType: 'Round Trip' | 'One Way' | 'Multi-City';
  travellers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabin: 'Economy' | 'Premium Economy' | 'Business' | 'First Class';
  flexibleDates: string; // e.g. 'exact', '3-days', '7-days', 'month'
  preferredContact: 'phone' | 'whatsapp' | 'email';
  message?: string;
  consent: boolean;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  createdAt: string;
  status: 'new' | 'assigned' | 'contacted' | 'closed';
}
```
