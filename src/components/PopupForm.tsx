import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, MessageSquare, ShieldCheck, Mail, User, Clock, ArrowRight } from 'lucide-react';
import { OFFICE_CONTACTS, AIRPORTS } from '../data/travelData';

interface PopupFormProps {
  onSuccess: (leadId: string, leadData: any) => void;
}

export default function PopupForm({ onSuccess }: PopupFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [tripType, setTripType] = useState<'Round Trip' | 'One Way'>('Round Trip');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'email'>('phone');
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [activeSearchField, setActiveSearchField] = useState<'from' | 'to' | null>(null);
  const [airportQuery, setAirportQuery] = useState('');
  const [filteredAirports, setFilteredAirports] = useState<any[]>([]);

  const modalRef = useRef<HTMLDivElement>(null);
  const airportSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (airportSearchRef.current && !airportSearchRef.current.contains(event.target as Node)) {
        setActiveSearchField(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!airportQuery) {
      setFilteredAirports(AIRPORTS.slice(0, 10));
      return;
    }
    const q = airportQuery.toLowerCase();
    const filtered = AIRPORTS.filter(ap => 
      ap.code.toLowerCase().includes(q) || 
      ap.city.toLowerCase().includes(q) || 
      ap.country.toLowerCase().includes(q) || 
      ap.name.toLowerCase().includes(q)
    );
    setFilteredAirports(filtered.slice(0, 10));
  }, [airportQuery]);

  const handleSelectAirport = (airportCode: string, city: string) => {
    const value = `${city} (${airportCode})`;
    if (activeSearchField === 'from') {
      setFromCity(value);
    } else if (activeSearchField === 'to') {
      setToCity(value);
    }
    setActiveSearchField(null);
    setAirportQuery('');
  };

  useEffect(() => {
    // Check if user has already dismissed or completed enquiry in this session
    const dismissed = sessionStorage.getItem('fdi-popup-dismissed');
    const submitted = sessionStorage.getItem('fdi-lead-submitted');
    
    if (dismissed || submitted) return;

    // Trigger popup exactly 10 seconds after mount
    const timer = setTimeout(() => {
      setIsOpen(true);
      // Lock scrolling
      document.body.style.overflow = 'hidden';
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('fdi-popup-dismissed', 'true');
    document.body.style.overflow = 'unset';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !fromCity.trim() || !toCity.trim()) {
      setErrorMsg('Please fill in all required travel information.');
      return;
    }

    if (!consent) {
      setErrorMsg('You must agree to our contact policy.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      email,
      phone,
      origin: fromCity,
      destination: toCity,
      departDate,
      tripType,
      cabin: 'Economy',
      preferredContact,
      consent,
      source: '10s-delayed-popup'
    };

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed.');
      }

      sessionStorage.setItem('fdi-lead-submitted', 'true');
      setIsOpen(false);
      document.body.style.overflow = 'unset';
      onSuccess(data.leadId, data.lead);
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity">
      {/* Container Card */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="relative bg-slate-900 border border-slate-800 text-white rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row shadow-2xl transition-all scale-100"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full z-10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Promo graphics (left side on desktop) */}
        <div className="hidden md:flex md:w-5/12 bg-slate-950 p-8 flex-col justify-between relative overflow-hidden border-r border-slate-800">
          {/* Subtle design element */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <span className="text-xs bg-orange-500/20 text-orange-400 font-extrabold uppercase px-2.5 py-1 rounded-full border border-orange-500/30">
              ✈ Private Fares
            </span>
            <h3 id="popup-title" className="text-xl font-bold tracking-tight text-white mt-4 font-display">
              Need Help Securing a Better Fare?
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              We compare unpublished, offline rates across multiple airline ticketing queues to find optimized routing options.
            </p>
          </div>

          <div className="relative z-10 mt-8 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] text-slate-300 font-medium">15-Minute Agent Callbacks</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] text-slate-300 font-medium">100% Free & Non-Binding</span>
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-slate-500 border-t border-slate-800 pt-4">
            Authorized Travel Agency Assistance
          </div>
        </div>

        {/* Column 2: Form (right side on desktop, full-width on mobile) */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-center">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Quick Flight Enquiry</p>
          
          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-500 p-2.5 rounded-xl mb-4">
              ❌ {errorMsg}
            </p>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Origin & Destination */}
            <div className="grid grid-cols-2 gap-2 relative">
              <div className="relative">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">From</label>
                <input
                  type="text"
                  placeholder="e.g., YYZ or Toronto"
                  required
                  value={fromCity}
                  onChange={(e) => {
                    setFromCity(e.target.value);
                    setAirportQuery(e.target.value);
                  }}
                  onFocus={() => {
                    setActiveSearchField('from');
                    setAirportQuery(fromCity);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">To</label>
                <input
                  type="text"
                  placeholder="e.g., DEL or Delhi"
                  required
                  value={toCity}
                  onChange={(e) => {
                    setToCity(e.target.value);
                    setAirportQuery(e.target.value);
                  }}
                  onFocus={() => {
                    setActiveSearchField('to');
                    setAirportQuery(toCity);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Suggestions dropdown */}
              {activeSearchField && (
                <div 
                  ref={airportSearchRef}
                  className="absolute left-0 right-0 top-full mt-1 bg-slate-850 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 max-h-48 overflow-y-auto"
                >
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
                    Select Airport / City
                  </p>
                  <div className="space-y-1">
                    {filteredAirports.map((ap) => (
                      <button
                        key={ap.code}
                        type="button"
                        onClick={() => handleSelectAirport(ap.code, ap.city)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-700 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="font-bold text-slate-200 group-hover:text-white">
                          {ap.city} ({ap.code})
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ap.country}
                        </span>
                      </button>
                    ))}
                    {filteredAirports.length === 0 && (
                      <p className="text-[10px] text-slate-500 px-2.5 py-1">No matches found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Depart Date & Trip Type */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Depart Date</label>
                <input
                  type="date"
                  required
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Trip Type</label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Round Trip">Round Trip</option>
                  <option value="One Way">One Way</option>
                </select>
              </div>
            </div>

            {/* Name, Phone, Contact */}
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <select
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-sans"
                >
                  <option value="phone">Callback preferred</option>
                  <option value="whatsapp">WhatsApp preferred</option>
                  <option value="email">Email preferred</option>
                </select>
              </div>
            </div>

            {/* Consent Policy Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="popup-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-slate-700 accent-blue-600"
              />
              <label htmlFor="popup-consent" className="text-[10px] text-slate-400 leading-snug">
                I authorize Flyhigh to share custom routes and call me back regarding my itinerary.
              </label>
            </div>

            {/* Actions: Request Quote */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs uppercase font-extrabold tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-1"
            >
              {isSubmitting ? 'Submitting...' : 'Request Secret Fares ➔'}
            </button>

            {/* Multi-ctas (Call Now, WhatsApp) */}
            <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-800">
              <a 
                href={`tel:${OFFICE_CONTACTS.tollFree}`}
                className="text-orange-400 font-bold hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> Speak with Agent
              </a>
              <a 
                href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-500 font-bold hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Live
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
