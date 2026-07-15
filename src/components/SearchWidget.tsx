import React, { useState, useEffect, useRef } from 'react';
import { Plane, Calendar, Users, ArrowLeftRight, Search, Plus, Trash2, Mail, Phone, User, Check, ShieldCheck, ChevronDown } from 'lucide-react';
import { AIRPORTS, OFFICE_CONTACTS } from '../data/travelData';

interface SearchWidgetProps {
  initialOrigin?: string;
  initialDestination?: string;
  onSuccess: (leadId: string, leadData: any) => void;
}

interface Segment {
  id: string;
  from: string;
  to: string;
  date: string;
}

export default function SearchWidget({ initialOrigin = '', initialDestination = '', onSuccess }: SearchWidgetProps) {
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip');
  
  // Single route inputs
  const [fromCity, setFromCity] = useState(initialOrigin);
  const [toCity, setToCity] = useState(initialDestination);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  // Autocomplete state
  const [activeSearchField, setActiveSearchField] = useState<'from' | 'to' | null>(null);
  const [airportQuery, setAirportQuery] = useState('');
  const [filteredAirports, setFilteredAirports] = useState(AIRPORTS);

  // Multi-city segments
  const [segments, setSegments] = useState<Segment[]>([
    { id: '1', from: '', to: '', date: '' },
    { id: '2', from: '', to: '', date: '' }
  ]);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);
  const [activeSegmentField, setActiveSegmentField] = useState<'from' | 'to' | null>(null);

  // Traveler selector states
  const [showTravelers, setShowTravelers] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First Class'>('Economy');
  
  // Contact details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'whatsapp' | 'phone'>('phone');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const travelerRef = useRef<HTMLDivElement>(null);
  const airportSearchRef = useRef<HTMLDivElement>(null);

  // Handle external clicks for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (travelerRef.current && !travelerRef.current.contains(event.target as Node)) {
        setShowTravelers(false);
      }
      if (airportSearchRef.current && !airportSearchRef.current.contains(event.target as Node)) {
        setActiveSearchField(null);
        setActiveSegmentIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update filtered list when typing
  useEffect(() => {
    if (!airportQuery) {
      setFilteredAirports(AIRPORTS.slice(0, 12));
      return;
    }
    const q = airportQuery.toLowerCase();
    const filtered = AIRPORTS.filter(ap => 
      ap.code.toLowerCase().includes(q) || 
      ap.city.toLowerCase().includes(q) || 
      ap.country.toLowerCase().includes(q) || 
      ap.name.toLowerCase().includes(q)
    );
    setFilteredAirports(filtered);
  }, [airportQuery]);

  // Set today as minimum departure date
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSelectAirport = (airportCode: string, city: string) => {
    const value = `${city} (${airportCode})`;
    
    if (tripType !== 'multi-city') {
      if (activeSearchField === 'from') {
        setFromCity(value);
      } else if (activeSearchField === 'to') {
        setToCity(value);
      }
    } else if (activeSegmentIndex !== null && activeSegmentField) {
      const updated = [...segments];
      if (activeSegmentField === 'from') updated[activeSegmentIndex].from = value;
      else if (activeSegmentField === 'to') updated[activeSegmentIndex].to = value;
      setSegments(updated);
    }
    
    setAirportQuery('');
    setActiveSearchField(null);
    setActiveSegmentIndex(null);
  };

  const handleSwapAirports = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  // Multi-city segment controls
  const handleAddSegment = () => {
    if (segments.length >= 6) return;
    const lastSeg = segments[segments.length - 1];
    setSegments([
      ...segments,
      { id: Date.now().toString(), from: lastSeg.to, to: '', date: '' }
    ]);
  };

  const handleRemoveSegment = (index: number) => {
    if (segments.length <= 2) return;
    setSegments(segments.filter((_, idx) => idx !== index));
  };

  const validateForm = () => {
    if (!name.trim()) return "Full name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return "A valid email address is required.";
    if (!phone.trim()) return "Phone number is required.";
    if (!consent) return "You must consent to our privacy policy to proceed.";

    if (tripType !== 'multi-city') {
      if (!fromCity) return "Departure airport is required.";
      if (!toCity) return "Arrival destination is required.";
      if (!departDate) return "Departure date is required.";
      if (tripType === 'round-trip') {
        if (!returnDate) return "Return date is required.";
        if (new Date(returnDate) < new Date(departDate)) {
          return "Return date must be after departure date.";
        }
      }
    } else {
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (!seg.from) return `Segment ${i + 1} departure airport is required.`;
        if (!seg.to) return `Segment ${i + 1} arrival airport is required.`;
        if (!seg.date) return `Segment ${i + 1} travel date is required.`;
        if (i > 0 && new Date(seg.date) < new Date(segments[i-1].date)) {
          return `Segment ${i + 1} date must be after Segment ${i} date.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      return;
    }

    setIsSubmitting(true);

    // Build lead payload
    const leadPayload = {
      name,
      email,
      phone,
      origin: tripType !== 'multi-city' ? fromCity : segments.map(s => s.from).join(' | '),
      destination: tripType !== 'multi-city' ? toCity : segments.map(s => s.to).join(' | '),
      departDate: tripType !== 'multi-city' ? departDate : segments[0].date,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      tripType: tripType === 'round-trip' ? 'Round Trip' : tripType === 'one-way' ? 'One Way' : 'Multi-City',
      adults,
      children,
      infants,
      cabin,
      preferredContact,
      message,
      consent,
      source: 'web-hero-search-widget'
    };

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit enquiry.');
      }

      onSuccess(resData.leadId, resData.lead);
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-visible text-slate-800">
      {/* Search Tabs */}
      <div className="flex border-b border-slate-200 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`pb-4 px-4 text-sm sm:text-base font-bold transition-colors flex items-center gap-2 border-b-2 ${tripType === 'round-trip' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <ArrowLeftRight className="w-4 h-4" /> Round Trip
        </button>
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`pb-4 px-4 text-sm sm:text-base font-bold transition-colors flex items-center gap-2 border-b-2 ${tripType === 'one-way' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Plane className="w-4 h-4 rotate-45" /> One Way
        </button>
        <button
          type="button"
          onClick={() => setTripType('multi-city')}
          className={`pb-4 px-4 text-sm sm:text-base font-bold transition-colors flex items-center gap-2 border-b-2 ${tripType === 'multi-city' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Plus className="w-4 h-4" /> Multi-City
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative overflow-visible">
        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" role="alert">
            {errorMsg}
          </div>
        )}

        {/* Airport Inputs Row (for Round trip & One-way) */}
        {tripType !== 'multi-city' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {/* From */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">From</label>
              <div className="relative">
                <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Departure city or airport"
                  value={fromCity}
                  onChange={(e) => {
                    setFromCity(e.target.value);
                    setAirportQuery(e.target.value);
                  }}
                  onFocus={() => {
                    setActiveSearchField('from');
                    setAirportQuery(fromCity);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-sans text-sm h-12"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%-14px)] z-10 hidden lg:block">
              <button
                type="button"
                onClick={handleSwapAirports}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full border-4 border-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
                title="Swap Locations"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">To</label>
              <div className="relative">
                <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 rotate-90" />
                <input
                  type="text"
                  placeholder="Destination city or airport"
                  value={toCity}
                  onChange={(e) => {
                    setToCity(e.target.value);
                    setAirportQuery(e.target.value);
                  }}
                  onFocus={() => {
                    setActiveSearchField('to');
                    setAirportQuery(toCity);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-sans text-sm h-12"
                />
              </div>
            </div>

            {/* Depart Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Depart Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="date"
                  min={todayStr}
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-sans text-sm h-12"
                />
              </div>
            </div>

            {/* Return Date */}
            <div className={tripType === 'one-way' ? 'opacity-40 pointer-events-none' : ''}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Return Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="date"
                  min={departDate || todayStr}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  disabled={tripType === 'one-way'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-sans text-sm h-12"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Multi City Builder */
          <div className="space-y-4">
            {segments.map((seg, index) => (
              <div key={seg.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="md:col-span-1 text-slate-500 font-mono font-semibold text-xs py-2 uppercase text-center md:text-left">
                  Leg {index + 1}
                </div>
                
                <div className="md:col-span-4 relative">
                  <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Departure</label>
                  <input
                    type="text"
                    placeholder="Origin"
                    value={seg.from}
                    onChange={(e) => {
                      const updated = [...segments];
                      updated[index].from = e.target.value;
                      setSegments(updated);
                      setAirportQuery(e.target.value);
                    }}
                    onFocus={() => {
                      setActiveSegmentIndex(index);
                      setActiveSegmentField('from');
                      setAirportQuery(seg.from);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-600 text-slate-800 h-10"
                  />
                </div>

                <div className="md:col-span-4 relative">
                  <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Destination</label>
                  <input
                    type="text"
                    placeholder="Arrival"
                    value={seg.to}
                    onChange={(e) => {
                      const updated = [...segments];
                      updated[index].to = e.target.value;
                      setSegments(updated);
                      setAirportQuery(e.target.value);
                    }}
                    onFocus={() => {
                      setActiveSegmentIndex(index);
                      setActiveSegmentField('to');
                      setAirportQuery(seg.to);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-600 text-slate-800 h-10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    min={index > 0 && segments[index-1].date ? segments[index-1].date : todayStr}
                    value={seg.date}
                    onChange={(e) => {
                      const updated = [...segments];
                      updated[index].date = e.target.value;
                      setSegments(updated);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-2 text-sm focus:outline-none focus:border-indigo-600 text-slate-800 h-10"
                  />
                </div>

                <div className="md:col-span-1 flex justify-center md:justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveSegment(index)}
                    disabled={segments.length <= 2}
                    className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Remove Segment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSegment}
              disabled={segments.length >= 6}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-500 font-bold uppercase tracking-wider py-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Segment ({segments.length}/6)
            </button>
          </div>
        )}

        {/* Airport Autocomplete Suggestion Panel */}
        {(activeSearchField !== null || activeSegmentIndex !== null) && (
          <div 
            ref={airportSearchRef} 
            className="absolute left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 max-h-72 overflow-y-auto"
            style={{
              top: tripType === 'multi-city' ? 'auto' : '68px'
            }}
          >
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 px-2 flex items-center gap-1">
              <Search className="w-3.5 h-3.5" /> Airport Suggestions
            </p>
            {filteredAirports.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {filteredAirports.map(ap => (
                  <div
                    key={ap.code}
                    onClick={() => handleSelectAirport(ap.code, ap.city)}
                    className="flex justify-between items-center px-3 py-2 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">{ap.city}, {ap.country}</p>
                      <p className="text-xs text-slate-400 font-medium">{ap.name}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                      {ap.code}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 px-2 py-4 text-center">No airports match your criteria. Please type to search manually.</p>
            )}
          </div>
        )}

        {/* Travelers & Cabin Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative" ref={travelerRef}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Travelers & Cabin</label>
            <button
              type="button"
              onClick={() => setShowTravelers(!showTravelers)}
              className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 text-left text-sm h-12 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                {adults + children + infants} Traveler{adults + children + infants > 1 ? 's' : ''}, {cabin}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showTravelers && (
              <div className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-40 text-slate-800">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-4">Cabin Class</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {['Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setCabin(cls as any)}
                      className={`text-xs font-bold px-2 py-2 rounded-lg border text-center transition-colors cursor-pointer ${cabin === cls ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-4">Passengers</p>
                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Adults</p>
                      <p className="text-[10px] text-slate-400 font-medium">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer text-slate-600"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-mono font-bold text-sm text-slate-800">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(9, adults + 1))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer text-slate-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Children</p>
                      <p className="text-[10px] text-slate-400 font-medium">Age 2-11</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer text-slate-600"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-mono font-bold text-sm text-slate-800">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(9, children + 1))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer text-slate-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Infants</p>
                      <p className="text-[10px] text-slate-400 font-medium">In lap, under 2</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer text-slate-600"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-mono font-bold text-sm text-slate-800">{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants(Math.min(adults, infants + 1))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer text-slate-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Flexible dates</label>
            <select
              value={preferredContact === 'whatsapp' ? 'whatsapp' : preferredContact}
              onChange={(e) => {}}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-sans text-sm h-12 cursor-pointer"
            >
              <option value="exact">Exact Dates Only</option>
              <option value="3-days">± 3 Days flexibility</option>
              <option value="7-days">± 7 Days flexibility</option>
              <option value="month">Flexible travel month</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Preferred Contact Method</label>
            <div className="grid grid-cols-3 gap-2 h-12">
              {(['phone', 'whatsapp', 'email'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPreferredContact(m)}
                  className={`text-xs capitalize font-bold rounded-xl border flex items-center justify-center gap-1 transition-colors cursor-pointer ${preferredContact === m ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact info (Name, Email, Phone) */}
        <div className="border-t border-slate-200 pt-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Your Contact Information for Personalized Quote</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm h-12 font-sans"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm h-12 font-sans"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm h-12 font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes Message */}
        <div>
          <textarea
            placeholder="Special requests? (e.g. wheelchair, dietary meal preferences, specific baggage requirements, preferred transit hubs...)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm h-20 font-sans resize-none"
          />
        </div>

        {/* Consent, Warning and Submission */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <div className="flex items-start gap-2.5 max-w-lg">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 accent-indigo-600 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
            />
            <label htmlFor="consent" className="text-xs text-slate-500 leading-normal font-medium">
              I authorize Flyhigh to contact me regarding this enquiry via call, email, or WhatsApp. Fares are subject to availability.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg shadow-orange-600/10 cursor-pointer"
            id="search-widget-submit"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              "Request Custom Fare Quote"
            )}
          </button>
        </div>

        <div className="text-center text-[10px] text-slate-500 mt-2 flex items-center justify-center gap-1.5 flex-wrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Non-binding enquiry. Fares secured safely from our authorized pricing systems. No booking created automatically.</span>
        </div>
      </form>
    </div>
  );
}
