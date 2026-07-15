# Testing Checklist - Flight Desk International

Use this checklist to perform quality gates, verify functionality, and assure high performance under stress/traffic.

## Operational Verifications

### 1. Form Validation & Submissions
- [ ] Round-trip date ranges: departure date must be prior to return date.
- [ ] Autocomplete searches for airport inputs: verifies code, city name, and matches cleanly.
- [ ] Submitting hero form successfully logs lead in backend database-ready endpoint and returns a clear confirmation page with dynamic lead reference ID.
- [ ] Multi-city form lets users dynamically add/remove up to 6 flight segments, checking each segment's date sequence.
- [ ] Callback scheduler prevents selecting past dates and shows clear timezone options.

### 2. 10-Second Enquiry Popup
- [ ] Hydration trigger fires modal exactly 10 seconds after opening/refreshing.
- [ ] Dismissing popup hides it for the entire session (`sessionStorage` flag is set correctly).
- [ ] Popup locks body scrolling while open and traps tab focus correctly (accessibility standard).
- [ ] Modal does not show on the "Thank You" or confirmation views.

### 3. Sticky Bottom Mobile Conversion Bar
- [ ] Sticky footer bar with **Call Now**, **WhatsApp**, and **Enquire** visible exclusively on screen widths under 768px.
- [ ] Safely clears system bottom notch heights (iPhone Safe Area adjustments).

### 4. Code Compliance
- [ ] `npm run build` succeeds completely.
- [ ] Linter is checked and errors are fixed (`npm run lint`).
- [ ] No API keys are visible in the client-side network panel or source files.
