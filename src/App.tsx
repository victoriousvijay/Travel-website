import React, { useState, useEffect, useRef } from 'react';
import { Plane, Phone, MessageSquare, Check, ChevronDown, ShieldCheck, Clock, Compass, Users, Award, FileText, Scale, HelpCircle, Send } from 'lucide-react';

// Custom Components
import Navigation from './components/Navigation';
import AnnouncementBar from './components/AnnouncementBar';
import SearchWidget from './components/SearchWidget';
import DealsGrid from './components/DealsGrid';
import PopupForm from './components/PopupForm';
import StickyActionBar from './components/StickyActionBar';
import AIAssistantModal from './components/AIAssistantModal';
import Cursor from './components/Cursor';
import SubViews from './components/SubViews';
import CrmPortal from './components/CrmPortal';

// Seed Data & Configs
import { FLIGHT_DEALS, FAQS, TESTIMONIALS, BLOG_POSTS, OFFICE_CONTACTS } from './data/travelData';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [viewData, setViewData] = useState<any>(null);
  
  // Dynamic Route prefills
  const [prefillFrom, setPrefillFrom] = useState('');
  const [prefillTo, setPrefillTo] = useState('');

  // FAQ accordion active state
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  // Success enquiry lead states
  const [leadSuccess, setLeadSuccess] = useState<{ leadId: string; lead: any } | null>(null);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    setViewData(data || null);
    setLeadSuccess(null);
  };

  const handlePrefillRoute = (from: string, to: string) => {
    setPrefillFrom(from);
    setPrefillTo(to);
    handleNavigate('quote-form');
  };

  const handleEnquirySuccess = (leadId: string, lead: any) => {
    setViewData({ leadId, lead });
    handleNavigate('thank-you', { leadId, lead });
  };

  const toggleFaq = (id: string) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white relative overflow-x-clip">
      
      {/* 2. Top Headers (Announcements + Responsive Navigation) */}
      <header className="sticky top-0 w-full z-50 shadow-md">
        <AnnouncementBar />
        <Navigation currentView={currentView} onNavigate={handleNavigate} />
      </header>

      {/* 3. Main View Router */}
      <main className="flex-grow">
        
        {currentView === 'home' || currentView === 'quote-form' ? (
          /* HOMEPAGE VIEW OR FORM DIRECT PATH */
          <div className="w-full">
            
            {/* HERO SECTION */}
            <section className="relative bg-grid-glow text-white pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden border-b border-slate-800">
              {/* Background Glows */}
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="max-w-3xl mx-auto">
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5" /> Premium Flight Assistance
                  </span>
                  
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-6 font-display leading-none text-white">
                    Affordable Flights to India, <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Planned Around You</span>
                  </h1>
                  
                  <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed max-w-xl mx-auto">
                    Compare flexible transoceanic travel options and speak with experienced flight specialists to coordinate personalized itineraries and baggage rules.
                  </p>
                </div>

                {/* Hero Form / Search Widget container */}
                <div className="mt-12 relative overflow-visible">
                  <SearchWidget 
                    initialOrigin={prefillFrom} 
                    initialDestination={prefillTo} 
                    onSuccess={handleEnquirySuccess} 
                  />
                </div>
              </div>
            </section>

            {/* TRUST STRIP SECTION */}
            <section className="bg-slate-950 text-slate-400 py-6 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>Personalized Travel Assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>15-Minute Callback Windows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-400" />
                    <span>Multi-piece Baggage Coordinated</span>
                  </div>
                </div>
              </div>
            </section>

            {/* FLIGHT DEALS SHOWCASE SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 font-display">
                  Explore Popular Corridor Flight Deals
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Unpublished consolidator rates secured through our private airline inventories. Click deal to prefill query.
                </p>
              </div>

              <DealsGrid onSelectDeal={(deal) => handlePrefillRoute(deal.originCity, deal.destCity)} />
            </section>

            {/* DEAL CATEGORIES & SPECIALTIES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 font-display">
                  Tailored Travel Deals & Specializations
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  We align flight configurations to support families, seniors, students, and corporate cohorts perfectly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Last minute */}
                <div 
                  onClick={() => handleNavigate('service-lastminute')}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Urgent</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 font-display">Last-Minute Deals</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Emergency travel or sudden business shifts? Our consultants check real-time airline lists to secure near-term seats quickly.
                  </p>
                  <span className="text-xs text-blue-600 font-semibold group-hover:underline mt-4 block">Read details ➔</span>
                </div>

                {/* Business Class */}
                <div 
                  onClick={() => handleNavigate('service-business')}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">Premium</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 font-display">Business-Class Tariffs</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Arrive fully refreshed. We compare deep business discounts with major alliances to coordinate lie-flat seating configurations and lounges.
                  </p>
                  <span className="text-xs text-blue-600 font-semibold group-hover:underline mt-4 block">Read details ➔</span>
                </div>

                {/* Senior assistance */}
                <div 
                  onClick={() => handleNavigate('service-senior')}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Assisted</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 font-display">Senior Citizen Assistance</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    We arrange physical wheelchair airport escorts, vegetarian dietary meal mapping, and easy single-terminal transfers for parents.
                  </p>
                  <span className="text-xs text-blue-600 font-semibold group-hover:underline mt-4 block">Read details ➔</span>
                </div>

                {/* Family & Group bookings */}
                <div 
                  onClick={() => handleNavigate('service-group')}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Groups</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 font-display">Family & Group Travel</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Securing locked-in flight contracts and seat-row assignments for weddings, tour groups, or cohorts of 10+ travelers seamlessly.
                  </p>
                  <span className="text-xs text-blue-600 font-semibold group-hover:underline mt-4 block">Read details ➔</span>
                </div>

                {/* Student fare specials */}
                <div 
                  onClick={() => handleNavigate('service-student')}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Students</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 font-display">Student Travel Specials</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Heading abroad? We coordinate academic fare options with three-piece luggage allowances and zero penalty flight rescheduling parameters.
                  </p>
                  <span className="text-xs text-blue-600 font-semibold group-hover:underline mt-4 block">Read details ➔</span>
                </div>

                {/* Callback Scheduler Widget preview */}
                <div 
                  onClick={() => handleNavigate('callback-scheduler')}
                  className="group bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-blue-500/30">Priority</span>
                    <h3 className="text-lg font-bold text-white mt-4 font-display">Scheduler Callback</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Choose your specific time window, timezone, and preferred language (English, Hindi, or Punjabi), and our specialists call you directly.
                    </p>
                  </div>
                  <span className="text-xs text-orange-400 font-bold group-hover:underline mt-4 block">Schedule callback ➔</span>
                </div>

              </div>
            </section>

            {/* WHY CHOOSE US & CORE STRENGTHS */}
            <section className="bg-slate-950 text-white py-16 sm:py-24 border-y border-slate-800 relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                      Travel Crafted Around You
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-4 font-display">
                      Why Travelers Secure Fares Through Our Consultancy
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed">
                      In the era of cold, fully automated search booking platforms, fly with us provides human-assisted travel configurations. We represent you, negotiating code-shared rules and cabin classes across major global airlines.
                    </p>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 mt-1">
                          <Compass className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Complex Routing & Layover Optimization</h4>
                          <p className="text-xs text-slate-400 mt-0.5 leading-normal">We configure connections with suitable transit times to clear baggage smoothly.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-orange-500/10 p-2.5 rounded-xl border border-orange-500/20 mt-1">
                          <Users className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Dedicated Multi-Piece Luggage Support</h4>
                          <p className="text-xs text-slate-400 mt-0.5 leading-normal">Ethnic and promotional airline rates containing expanded checked luggage allowances.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl relative">
                    <h3 className="text-lg font-bold font-display text-blue-400">Human-Assisted Flight Consultation</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Our expert agents hold credentials across global travel distribution systems, letting us query unpublished promotional inventories directly from airline fare queues.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800 text-center">
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">100%</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Custom Setup</p>
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">24/7</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Agent Access</p>
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">15m</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Callback Speed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
              <span className="text-[10px] bg-blue-100 text-blue-800 px-3.5 py-1 rounded-full font-bold uppercase tracking-widest">
                Seamless Flow
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 font-display mt-4">
                How our Consultation Process Works
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
                No financial obligation. Simply share parameters and compare specialized route options easily.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-left">
                {/* Step 1 */}
                <div className="border border-slate-100 bg-white p-5 rounded-2xl relative shadow-sm">
                  <span className="text-2xl font-bold font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">1</span>
                  <h3 className="text-sm font-bold mt-4 text-slate-900">Define Travel Parameters</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Submit your origin, destination, targets, and passenger details via our simple quotation forms.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="border border-slate-100 bg-white p-5 rounded-2xl relative shadow-sm">
                  <span className="text-2xl font-bold font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">2</span>
                  <h3 className="text-sm font-bold mt-4 text-slate-900">Agent Analyzes Inventories</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Our specialists examine multiple consolidator databases to structure optimal routing comfortable layouts.
                  </p>
                </div>
                {/* Step 3 */}
                <div className="border border-slate-100 bg-white p-5 rounded-2xl relative shadow-sm">
                  <span className="text-2xl font-bold font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">3</span>
                  <h3 className="text-sm font-bold mt-4 text-slate-900">Compare custom Quotes</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Review pricing options breaking down government taxes, fuel metrics, and baggage allowances carefully.
                  </p>
                </div>
                {/* Step 4 */}
                <div className="border border-slate-100 bg-white p-5 rounded-2xl relative shadow-sm">
                  <span className="text-2xl font-bold font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">4</span>
                  <h3 className="text-sm font-bold mt-4 text-slate-900">Secure Authorized Ticketing</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Approve your preferred itinerary and complete booking through our secure, fully encrypted ticketing systems.
                  </p>
                </div>
              </div>
            </section>

            {/* CABIN FEATURE SECTION */}
            <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden border-y border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-900 to-slate-900"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-4">
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                      Business Premium Special
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
                      Premium Cabin Layouts at Deep Consolidator Prices
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Whether organizing high-level corporate retreats or coordinating comfortable flights for elderly parents, our consultants query deep private deals across Star Alliance, Oneworld, and SkyTeam carriers.
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-slate-300">
                      <li className="flex items-center gap-1.5">✓ 180° Fully Lie-flat Seating layouts verified</li>
                      <li className="flex items-center gap-1.5">✓ Specialized Vegetarian/Ethnic meal mappings</li>
                      <li className="flex items-center gap-1.5">✓ Dual baggage check-in privileges guaranteed</li>
                    </ul>
                    <div className="pt-4 flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleNavigate('service-business')}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                      >
                        Explore Cabin Deals
                      </button>
                      <a 
                        href={`tel:${OFFICE_CONTACTS.tollFree}`}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
                      >
                        <Phone className="w-4 h-4 text-orange-400" /> Talk to Premium Coordinator
                      </a>
                    </div>
                  </div>

                  <div className="rounded-3xl overflow-hidden shadow-2xl relative h-64 sm:h-96 w-full border border-slate-800">
                    <img 
                      src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop" 
                      alt="Luxury Cabin Premium flat-bed seating" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* TESTIMONIALS CAROUSEL */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="text-center mb-12">
                <span className="text-[10px] bg-blue-100 text-blue-800 px-3.5 py-1 rounded-full font-bold uppercase tracking-widest">
                  Verified Reviews
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-4 font-display">
                  What Travelers Say About Our Help
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Read physical experiences logged by clients securing Brampton, Chicago, and Sydney India deals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map(t => (
                  <div key={t.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 text-orange-400 mb-3">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i} className="text-sm">★</span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{t.content}"
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-[11px]">
                      <div>
                        <p className="font-bold text-slate-950">{t.name}</p>
                        <p className="text-slate-400 font-medium">{t.location}</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-mono px-2 py-0.5 rounded uppercase font-semibold">
                        {t.route}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FARE ALERT SUBSCRIPTION WIDGET */}
            <section className="bg-slate-100 py-16 border-y border-slate-200">
              <div className="max-w-xl mx-auto px-4 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">Subscribe to secret Price Drops</h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-normal">
                  Define your corridor parameters and receive immediate emails when promotional flight quotas are refreshed!
                </p>

                {leadSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl mt-6 text-center">
                    <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-emerald-800">Alert activation confirmed!</p>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setLeadSuccess({ leadId: 'alert', lead: {} });
                    }} 
                    className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-800"
                  >
                    <input
                      type="text"
                      placeholder="Origin"
                      required
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Destination"
                      required
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl uppercase tracking-wider py-2.5"
                    >
                      Subscribe Alerts
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* RESOURCE ARTICLES INDEX */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="text-center mb-12">
                <span className="text-[10px] bg-blue-100 text-blue-800 px-3.5 py-1 rounded-full font-bold uppercase tracking-widest">
                  Travel Insights
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-4 font-display">
                  Travel Resources & Guidelines
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Read vetted layover guides, ethnic cabin rules, and luggage packing advice before ticketing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {BLOG_POSTS.map(post => (
                  <div 
                    key={post.id}
                    onClick={() => handleNavigate(`blog-post-${post.slug}`, post)}
                    className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <img src={post.image} alt={post.title} referrerPolicy="no-referrer" className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-1 rounded uppercase font-extrabold tracking-widest">{post.category}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition-colors font-display leading-snug">{post.title}</h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{post.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS (ACCORDION ACCESSIBLE) */}
            <section className="bg-slate-50 border-t border-slate-200 py-16 sm:py-24">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-3.5 py-1 rounded-full font-bold uppercase tracking-widest">
                    FAQ
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-4 font-display">
                    Frequently Answered flight Questions
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">
                    Understanding flight allocations, layover visabilities, cancellations, and booking configurations.
                  </p>
                </div>

                <div className="space-y-3 font-sans">
                  {FAQS.map(faq => (
                    <div 
                      key={faq.id} 
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 text-left font-bold text-slate-900 text-xs sm:text-sm flex justify-between items-center transition-colors hover:bg-slate-50/50"
                        aria-expanded={activeFaqId === faq.id}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaqId === faq.id ? 'rotate-180 text-blue-500' : ''}`} />
                      </button>

                      {activeFaqId === faq.id && (
                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FINAL CALL TO CONVERSION CTA */}
            <section className="bg-slate-900 text-white py-16 sm:py-20 border-t border-slate-800 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-900 to-slate-900"></div>
              
              <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-4">
                <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
                  Still Looking for the Right International Fare?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Avoid physical fatigue and high automated fees. Speak with our 24/7 dedicated travel coordinators to locking unpublished ticketing quotas.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                  <a 
                    href={`tel:${OFFICE_CONTACTS.tollFree}`}
                    className="px-8 py-3.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-white text-xs uppercase font-extrabold tracking-wider transition-all hover:scale-102 flex items-center justify-center gap-1.5 shadow-lg shadow-orange-950/20"
                  >
                    <Phone className="w-4 h-4" /> Call Travel Specialist
                  </a>
                  <a 
                    href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white text-xs uppercase font-extrabold tracking-wider transition-all hover:scale-102 border border-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Us
                  </a>
                  <button 
                    onClick={() => handleNavigate('callback-scheduler')}
                    className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all border border-slate-700 text-white"
                  >
                    Schedule a Callback
                  </button>
                </div>
              </div>
            </section>

          </div>
        ) : currentView === 'admin-crm' ? (
          /* STANDALONE SECURE CRM VIEW */
          <div className="w-full bg-slate-50 py-12">
            <CrmPortal />
          </div>
        ) : (
          /* INTERNAL SUBVIEWS ROUTER PANEL */
          <div className="w-full bg-slate-50 py-8">
            <SubViews 
              currentView={currentView} 
              viewData={viewData} 
              onNavigate={handleNavigate} 
              onPrefillRoute={handlePrefillRoute}
            />
          </div>
        )}

      </main>

      {/* 4. FOOTER COMPONENT */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 sm:py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top segment: Logo & general coords */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
            <div className="md:col-span-2 space-y-4">
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2 font-display">
                <span>Flyhigh</span>
              </span>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Flyhigh operates as a private travel agency and consolidator flight consultancy. Fares displayed are subject to airline ticketing schedules and active inventory. No booking created automatically.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Travel Corridors</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><button onClick={() => handleNavigate('route-ca-in')} className="hover:text-white transition-colors cursor-pointer text-left">Canada to India Flights</button></li>
                <li><button onClick={() => handleNavigate('route-us-in')} className="hover:text-white transition-colors cursor-pointer text-left">USA to India Flights</button></li>
                <li><button onClick={() => handleNavigate('route-au-in')} className="hover:text-white transition-colors cursor-pointer text-left">Australia to India Flights</button></li>
                <li><button onClick={() => handleNavigate('route-in-ca')} className="hover:text-white transition-colors cursor-pointer text-left">India to Canada Flights</button></li>
              </ul>
            </div>

            {/* Specialties & Support */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Specialty Travel</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><button onClick={() => handleNavigate('service-business')} className="hover:text-white transition-colors cursor-pointer text-left">Business-Class Cabin deals</button></li>
                <li><button onClick={() => handleNavigate('service-senior')} className="hover:text-white transition-colors cursor-pointer text-left">Senior Assistance registration</button></li>
                <li><button onClick={() => handleNavigate('service-student')} className="hover:text-white transition-colors cursor-pointer text-left">Student Baggage specials</button></li>
                <li><button onClick={() => handleNavigate('service-lastminute')} className="hover:text-white transition-colors cursor-pointer text-left">Last-minute Options</button></li>
              </ul>
            </div>
          </div>

          {/* Legal and compliance strip */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-[11px] text-slate-500">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Flyhigh. All rights reserved.
            </p>

            {/* Legal sublinks */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => handleNavigate('legal-privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => handleNavigate('legal-terms')} className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</button>
              <span>•</span>
              <button onClick={() => handleNavigate('legal-cancellation')} className="hover:text-white transition-colors cursor-pointer">Cancellations</button>
              <span>•</span>
              <button onClick={() => handleNavigate('legal-refunds')} className="hover:text-white transition-colors cursor-pointer">Refunds</button>
              <span>•</span>
              <button onClick={() => handleNavigate('legal-disclaimer')} className="hover:text-white transition-colors cursor-pointer">Disclaimer</button>
            </div>
          </div>

        </div>
      </footer>

      {/* 5. TEN-SECOND DELAYED ENQUIRY POPUP FORM */}
      <PopupForm onSuccess={handleEnquirySuccess} />

      {/* 6. MOBILE STICKY ACTION BAR */}
      <StickyActionBar onEnquireClick={() => handlePrefillRoute('Toronto', 'Delhi')} />

      {/* 7. FLOATING SERVER-SIDE AI TRAVEL ADVISOR (GEMINI POWERED) */}
      <AIAssistantModal />

      {/* 8. MODERN SMOOTH 3D CUSTOM CURSOR */}
      <Cursor />

    </div>
  );
}
