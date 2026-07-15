# Project Plan - Flight Desk International

Flight Desk International is a high-performance international flight deals and enquiry website designed for travel routes between North America, Australia, and India. This plan details the phased execution.

## Core Milestones

### Phase 1: Planning and Architecture
- Create metadata, design system, content models, and SEO plan.
- Establish typescript, tailwind styles, and routing structures.

### Phase 2: Content Seed & Models
- Build structured dataset for flight deals, routes, FAQs, testimonials, and blog articles in `/src/data/travelData.ts` to keep the codebase CMS-ready.

### Phase 3: Server Setup (Express Backend)
- Configure `server.ts` to bind on port 3000 and 0.0.0.0.
- Implement server-side routing:
  - `POST /api/enquiry`: Record flight enquiries, send email placeholder, store leads.
  - `POST /api/callback`: Callback scheduler endpoint.
  - `POST /api/fare-alert`: Subscribe to price alerts.
  - `POST /api/ai/assistant`: Chat endpoint integrating Gemini (`gemini-3.5-flash`) as an AI travel advisor for live route planning, fare advice, and enquiry conversion.
- Support Vite dev server middleware in development and static asset serving in production.

### Phase 4: Main Layout & Navigation
- Responsive top header (desktop layout with menus, mobile hamburger accordion drawer).
- Custom announcement bar and sticky mobile action bar.

### Phase 5: Homepage Sections
- Premium Hero section with active airport connections.
- Interactive Search/Enquiry Form supporting Round Trip, One Way, and Multi-City.
- Filterable and sortable flight deals showcase.
- Route connection explorer map/visual.
- Trust strip, Testimonials, Deal Categories, FAQ Accordion, and Footer.

### Phase 6: Sub-views & Interactive Popups
- Custom hash/state router for 27+ pages/routes:
  - Route Pages (e.g. Canada to India, India to Canada, USA to India, USA to USA, Australia to India)
  - Travel Services (Last-Minute, Business-Class, Group, Student, Senior Assistance, Multi-City)
  - Resources & Legal (About, Contact, Blog, Individual Articles, Privacy, Terms, Cancellation, Refunds, Disclaimer, Thank-You)
- Ten-second delayed Enquiry Popup with dismissal storage (`sessionStorage`) and responsive layouts.

### Phase 7: Verification & Testing
- Automated linter checks, TypeScript compile checks, manual verification of visual flow on all screens.
