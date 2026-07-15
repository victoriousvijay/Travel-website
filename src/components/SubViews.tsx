import React, { useState } from 'react';
import { 
  Calendar, Phone, MessageSquare, Clock, MapPin, Award, 
  CheckCircle2, ShieldCheck, Mail, ArrowLeft, Bookmark, 
  Heart, ChevronRight, AlertTriangle, Scale, Globe, Users
} from 'lucide-react';
import { FAQS, TESTIMONIALS, BLOG_POSTS, OFFICE_CONTACTS, AIRPORTS } from '../data/travelData';

// ---------------------------------------------------------------------------------------------
// NESTED COMPONENT: SPECIALTY ENQUIRY FORM FOR SPECIFIC CHANNELS
// ---------------------------------------------------------------------------------------------
interface SpecialtyFormProps {
  serviceType: 'service-business' | 'service-lastminute' | 'service-group' | 'service-student' | 'service-senior';
  onNavigate: (view: string, data?: any) => void;
  onPrefillRoute: (from: string, to: string) => void;
}

export function SpecialtyForm({ serviceType, onNavigate, onPrefillRoute }: SpecialtyFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('one-way');
  const [cabin, setCabin] = useState('Economy');
  const [preferredContact, setPreferredContact] = useState('WhatsApp');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [activeAirportField, setActiveAirportField] = useState<'origin' | 'destination' | null>(null);
  const [airportQuery, setAirportQuery] = useState('');
  const [filteredAirports, setFilteredAirports] = useState<any[]>([]);
  const airportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
    setFilteredAirports(filtered);
  }, [airportQuery]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (airportRef.current && !airportRef.current.contains(e.target as Node)) {
        setActiveAirportField(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Business specific fields
  const [preferredAirline, setPreferredAirline] = useState('');
  const [cabinPreference, setCabinPreference] = useState<'Business' | 'First'>('Business');
  const [loungeAccess, setLoungeAccess] = useState(false);
  const [limoService, setLimoService] = useState(false);

  // Last-minute specific fields
  const [urgency, setUrgency] = useState('Immediate < 24 hrs');
  const [hasTransitVisa, setHasTransitVisa] = useState('Yes');
  const [maxStops, setMaxStops] = useState('Any routing');

  // Group specific fields
  const [groupSize, setGroupSize] = useState(10);
  const [eventType, setEventType] = useState('Family Vacation');
  const [namesFinalized, setNamesFinalized] = useState(false);
  const [groupLeader, setGroupLeader] = useState('');

  // Student specific fields
  const [universityName, setUniversityName] = useState('');
  const [extraBaggage, setExtraBaggage] = useState('2 checked bags (standard)');
  const [studentIdCheck, setStudentIdCheck] = useState(true);
  const [flexibleReturn, setFlexibleReturn] = useState('Yes');

  // Senior citizen specific fields
  const [wheelchairLevel, setWheelchairLevel] = useState('Terminal Wheelchair Support');
  const [medicalSupport, setMedicalSupport] = useState(false);
  const [dietaryPreference, setDietaryPreference] = useState('Hindu Vegetarian (HNML)');
  const [companionTraveling, setCompanionTraveling] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !origin || !destination || !departDate) {
      setErrorMsg('Please populate all mandatory fields (*).');
      return;
    }
    if (!consent) {
      setErrorMsg('You must check the contact authorize check.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const specialtyData: Record<string, any> = {};
      if (serviceType === 'service-business') {
        specialtyData.preferredAirline = preferredAirline;
        specialtyData.cabinPreference = cabinPreference;
        specialtyData.loungeAccess = loungeAccess;
        specialtyData.limoService = limoService;
      } else if (serviceType === 'service-lastminute') {
        specialtyData.urgency = urgency;
        specialtyData.hasTransitVisa = hasTransitVisa;
        specialtyData.maxStops = maxStops;
      } else if (serviceType === 'service-group') {
        specialtyData.groupSize = Number(groupSize);
        specialtyData.eventType = eventType;
        specialtyData.namesFinalized = namesFinalized;
        specialtyData.groupLeader = groupLeader || name;
      } else if (serviceType === 'service-student') {
        specialtyData.universityName = universityName;
        specialtyData.extraBaggage = extraBaggage;
        specialtyData.studentIdCheck = studentIdCheck;
        specialtyData.flexibleReturn = flexibleReturn;
      } else if (serviceType === 'service-senior') {
        specialtyData.wheelchairLevel = wheelchairLevel;
        specialtyData.medicalSupport = medicalSupport;
        specialtyData.dietaryPreference = dietaryPreference;
        specialtyData.companionTraveling = companionTraveling;
      }

      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          origin,
          destination,
          departDate,
          returnDate: tripType === 'round-trip' ? returnDate : '',
          tripType: tripType === 'round-trip' ? 'Round Trip' : 'One Way',
          cabin: serviceType === 'service-business' ? cabinPreference : cabin,
          preferredContact,
          message,
          consent,
          source: serviceType,
          specialtyData
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onNavigate('thank-you', { leadId: data.leadId, lead: data.lead });
      } else {
        setErrorMsg(data.error || 'Failed to submit enquiry.');
      }
    } catch (err: any) {
      setErrorMsg('Network transmission failure. Please call 1-800-413-3932 directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    switch (serviceType) {
      case 'service-business': return '💼 Query Private Business Class Tariffs';
      case 'service-lastminute': return '⏳ 24/48-Hour Assured Seat Query';
      case 'service-group': return '👨‍👩‍👧‍👦 Unified Group Ticketing & Seat Reservation';
      case 'service-student': return '🎓 Secure Flex Student Baggage Fare Code';
      case 'service-senior': return '👴 Senior Citizen Assisted Flight Request';
    }
  };

  const getFormSubtitle = () => {
    switch (serviceType) {
      case 'service-business': return 'Secure lie-flat options at corporate consolidator discounts.';
      case 'service-lastminute': return 'Priority checks in direct airline computer systems.';
      case 'service-group': return 'Lock flexible pricing and row seating blocks (10+ Pax).';
      case 'service-student': return 'Register academic verification to unlock double luggage.';
      case 'service-senior': return 'Pre-register terminal wheelchair, dietary codes, and direct routes.';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm">
      <div className="border-b border-slate-100 pb-3 mb-5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">{getFormTitle()}</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">{getFormSubtitle()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core details row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Rahul Sharma"
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address *</label>
            <input 
              type="email" 
              required
              placeholder="e.g. rahul@example.com"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number *</label>
            <input 
              type="tel" 
              required
              placeholder="e.g. +1 (416) 555-0199"
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>
        </div>

        {/* Origin and destination coordinates */}
        <div ref={airportRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Origin City/Airport *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Toronto (YYZ)"
              value={origin} 
              onChange={e => {
                setOrigin(e.target.value);
                setAirportQuery(e.target.value);
              }}
              onFocus={() => {
                setActiveAirportField('origin');
                setAirportQuery(origin);
              }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Destination City/Airport *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Delhi (DEL)"
              value={destination} 
              onChange={e => {
                setDestination(e.target.value);
                setAirportQuery(e.target.value);
              }}
              onFocus={() => {
                setActiveAirportField('destination');
                setAirportQuery(destination);
              }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Autocomplete suggestions panel */}
          {activeAirportField && (
            <div className="absolute left-0 right-0 top-[58px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-3 max-h-56 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 px-1">
                Select Airport Listing
              </p>
              {filteredAirports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {filteredAirports.map(ap => (
                    <button
                      key={ap.code}
                      type="button"
                      onClick={() => {
                        const val = `${ap.city} (${ap.code})`;
                        if (activeAirportField === 'origin') {
                          setOrigin(val);
                        } else {
                          setDestination(val);
                        }
                        setActiveAirportField(null);
                      }}
                      className="flex items-center justify-between p-2 text-left hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                          {ap.city} ({ap.code})
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {ap.name}
                        </div>
                      </div>
                      <div className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                        {ap.country}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No matching airports found.</p>
              )}
            </div>
          )}
        </div>

        {/* Date coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Trip Schedule</label>
            <div className="flex bg-slate-100 rounded-xl overflow-hidden p-0.5 border border-slate-200">
              <button 
                type="button"
                onClick={() => setTripType('one-way')}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${tripType === 'one-way' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                One Way
              </button>
              <button 
                type="button"
                onClick={() => setTripType('round-trip')}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${tripType === 'round-trip' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Round Trip
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Depart Date *</label>
            <input 
              type="date" 
              required
              min={todayStr}
              value={departDate} 
              onChange={e => setDepartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
            />
          </div>

          {tripType === 'round-trip' ? (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Return Date *</label>
              <input 
                type="date" 
                required={tripType === 'round-trip'}
                min={departDate || todayStr}
                value={returnDate} 
                onChange={e => setReturnDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cabin Seating</label>
              <select 
                value={cabin} 
                onChange={e => setCabin(e.target.value)}
                disabled={serviceType === 'service-business'}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
                <option value="First">First Class</option>
              </select>
            </div>
          )}

          {tripType === 'round-trip' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-semibold">Base Seating</label>
              <select 
                value={cabin} 
                onChange={e => setCabin(e.target.value)}
                disabled={serviceType === 'service-business'}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer disabled:bg-slate-100"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
                <option value="First">First Class</option>
              </select>
            </div>
          )}
        </div>

        {/* ----------------- SPECIALTY FIELDS AREA ----------------- */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mt-2">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> Specialty Traveler Configurations
          </div>

          {/* Business fields */}
          {serviceType === 'service-business' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Desired Cabin Tier</label>
                <select 
                  value={cabinPreference} 
                  onChange={e => setCabinPreference(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="Business">Business Class Seating</option>
                  <option value="First">First Class Private Suites</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Preferred Airline (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Air India, Qatar, Emirates"
                  value={preferredAirline} 
                  onChange={e => setPreferredAirline(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input 
                  type="checkbox" 
                  id="lounge"
                  checked={loungeAccess} 
                  onChange={e => setLoungeAccess(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="lounge" className="font-semibold text-slate-700 cursor-pointer text-xs">Lounge Access Required</label>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input 
                  type="checkbox" 
                  id="limo"
                  checked={limoService} 
                  onChange={e => setLimoService(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="limo" className="font-semibold text-slate-700 cursor-pointer text-xs">Chauffeur Limo Required</label>
              </div>
            </div>
          )}

          {/* Last-minute fields */}
          {serviceType === 'service-lastminute' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Departure Urgency Scale</label>
                <select 
                  value={urgency} 
                  onChange={e => setUrgency(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="Immediate < 24 hrs">Immediate Depart (&lt; 24 Hours)</option>
                  <option value="Next 24-48 hrs">Urgent Depart (24-48 Hours)</option>
                  <option value="This week">This Week departures</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Transit Visa Ready?</label>
                <select 
                  value={hasTransitVisa} 
                  onChange={e => setHasTransitVisa(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="Yes">Yes, Passport holds Transit / Layover Visas</option>
                  <option value="No">No, I require Visa-Free or direct transit paths</option>
                  <option value="Help me check">Need Specialist help verifying transit laws</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Layover Stops Tolerance</label>
                <select 
                  value={maxStops} 
                  onChange={e => setMaxStops(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="Any routing">Show Any Routing (Lowest Cost)</option>
                  <option value="Max 1 stop">Max 1 Layover Stop</option>
                  <option value="Direct only">Strictly Direct / Non-Stop Flight</option>
                </select>
              </div>
            </div>
          )}

          {/* Group fields */}
          {serviceType === 'service-group' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Est. Headcount (Pax)</label>
                <input 
                  type="number" 
                  min="10"
                  required
                  placeholder="e.g. 15"
                  value={groupSize} 
                  onChange={e => setGroupSize(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Group Classification</label>
                <select 
                  value={eventType} 
                  onChange={e => setEventType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="Family Vacation">Family Gathering / Vacation</option>
                  <option value="Wedding / Celebration">Wedding Party / Ceremonial</option>
                  <option value="Corporate Travel">Corporate Meeting / Incentive</option>
                  <option value="Student Cohort">Student Cohort / University Group</option>
                  <option value="Religious Tour">Religious Pilgrimage / Tour Group</option>
                  <option value="Other">Other Multi-passenger Tour</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Passenger Names Status</label>
                <select 
                  value={namesFinalized ? 'final' : 'tentative'} 
                  onChange={e => setNamesFinalized(e.target.value === 'final')}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="tentative">Names are tentative (Hold quote only)</option>
                  <option value="final">Names are finalized (Ready to book blocks)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Secondary Contact / Leader</label>
                <input 
                  type="text" 
                  placeholder="Leader or coordinator name"
                  value={groupLeader} 
                  onChange={e => setGroupLeader(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Student fields */}
          {serviceType === 'service-student' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Target University & Campus City</label>
                <input 
                  type="text" 
                  placeholder="e.g. York University, Toronto"
                  value={universityName} 
                  onChange={e => setUniversityName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Baggage Preference</label>
                <select 
                  value={extraBaggage} 
                  onChange={e => setExtraBaggage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="2 checked bags (standard)">2 Bags Checked (Standard limits)</option>
                  <option value="3 checked bags (extra request)">3 Bags Checked Student Special (Recommended)</option>
                  <option value="Oversized luggage">Oversized baggage / Special supplies</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Flexible Return Allowed?</label>
                <select 
                  value={flexibleReturn} 
                  onChange={e => setFlexibleReturn(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="Yes">Yes, require low/no change penalty rules</option>
                  <option value="No">No, travel is strictly fixed dates</option>
                  <option value="Not sure">Not sure yet (Check fare clauses)</option>
                </select>
              </div>
            </div>
          )}

          {/* Senior citizen fields */}
          {serviceType === 'service-senior' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 font-semibold text-orange-600">Wheelchair Assist</label>
                <select 
                  value={wheelchairLevel} 
                  onChange={e => setWheelchairLevel(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer font-semibold text-orange-600"
                >
                  <option value="Terminal Wheelchair Support">Terminal Wheelchair Support</option>
                  <option value="Full Boarding Assist (Cabin Chair)">Full Cabin Boarding Support</option>
                  <option value="None required">No physical mobility assistance needed</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Dietary Special Meal Code</label>
                <select 
                  value={dietaryPreference} 
                  onChange={e => setDietaryPreference(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
                >
                  <option value="Hindu Vegetarian (HNML)">Hindu Vegetarian (HNML) - Standard</option>
                  <option value="Jain Vegetarian (JNML)">Jain Strict Indian Vegetarian (JNML)</option>
                  <option value="Diabetic Special (DBML)">Diabetic Special (DBML)</option>
                  <option value="Regular Vegetarian meal">Regular International Veg meal</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input 
                  type="checkbox" 
                  id="medical"
                  checked={medicalSupport} 
                  onChange={e => setMedicalSupport(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="medical" className="font-semibold text-slate-700 cursor-pointer text-xs">Long Layover Support</label>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input 
                  type="checkbox" 
                  id="companion"
                  checked={companionTraveling} 
                  onChange={e => setCompanionTraveling(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="companion" className="font-semibold text-slate-700 cursor-pointer text-xs">Companion Traveling</label>
              </div>
            </div>
          )}
        </div>

        {/* Preferred Contact Mode Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-bold text-indigo-600">Preferred Contact Mode *</label>
          <select
            value={preferredContact}
            onChange={e => setPreferredContact(e.target.value)}
            className="w-full sm:w-1/2 bg-indigo-50 border border-indigo-200 text-xs rounded-xl px-3 py-2 text-indigo-900 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="WhatsApp">🟢 Prefer WhatsApp Message</option>
            <option value="Phone Call">📞 Prefer Direct Voice Call</option>
            <option value="Email">✉ Prefer Structured Email Quotation</option>
          </select>
        </div>

        {/* Message and Comments */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Special Requirements or Flight Layout Requests (Optional)</label>
          <textarea 
            rows={2}
            placeholder="Please detail preferred airlines, layover gates, specific times, or immigration requirements."
            value={message} 
            onChange={e => setMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
          />
        </div>

        {/* Consent and Submit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
          <div className="flex items-start gap-2 max-w-lg">
            <input 
              type="checkbox" 
              required
              id="consent-checkbox"
              checked={consent} 
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0"
            />
            <label htmlFor="consent-checkbox" className="text-[10px] text-slate-400 leading-normal">
              I authorize Flight Desk India to contact me regarding this enquiry via call, email, or WhatsApp. Fares are subject to availability.
            </label>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm hover:shadow shrink-0 font-display"
          >
            {isSubmitting ? 'Transmitting details...' : 'Submit Specialist Enquiry ➔'}
          </button>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-xs font-semibold text-center mt-2">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// NESTED COMPONENT: INTEGRATED CORRIDOR-SPECIFIC ENQUIRY FORM WITH DROPDOWNS
// ---------------------------------------------------------------------------------------------
interface CorridorFormProps {
  corridorKey: string;
  originList: string[];
  destList: string[];
  onNavigate: (view: string, data?: any) => void;
}

export function CorridorEnquiryForm({ corridorKey, originList, destList, onNavigate }: CorridorFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [selectedOrigin, setSelectedOrigin] = useState(originList[0] || '');
  const [customOrigin, setCustomOrigin] = useState('');
  const [selectedDest, setSelectedDest] = useState(destList[0] || '');
  const [customDest, setCustomDest] = useState('');
  
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('one-way');
  const [cabin, setCabin] = useState('Economy');
  const [flexibleDates, setFlexibleDates] = useState('Exact Dates');
  const [preferredContact, setPreferredContact] = useState('WhatsApp');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !departDate) {
      setErrorMsg('Please populate all mandatory fields (*).');
      return;
    }
    if (!consent) {
      setErrorMsg('You must authorize contact consent.');
      return;
    }

    const finalOrigin = selectedOrigin === 'other' ? customOrigin : selectedOrigin;
    const finalDest = selectedDest === 'other' ? customDest : selectedDest;

    if (!finalOrigin || !finalDest) {
      setErrorMsg('Please specify both your origin and destination cities.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          origin: finalOrigin,
          destination: finalDest,
          departDate,
          returnDate: tripType === 'round-trip' ? returnDate : '',
          tripType: tripType === 'round-trip' ? 'Round Trip' : 'One Way',
          cabin,
          flexibleDates,
          preferredContact,
          message,
          consent,
          source: corridorKey
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onNavigate('thank-you', { leadId: data.leadId, lead: data.lead });
      } else {
        setErrorMsg(data.error || 'Failed to submit flight inquiry.');
      }
    } catch (err) {
      setErrorMsg('Network issue. Please call support directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-md">
      <div className="border-b border-slate-100 pb-3 mb-5">
        <h3 className="text-base sm:text-lg font-bold text-indigo-900 font-display flex items-center gap-2">
          ✈ Direct Corridor Priority Fare Request
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Enter your dates and route preferences below. Our routing specialists check unpublished consolidator blocks directly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core contact row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Gurpreet Singh"
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address *</label>
            <input 
              type="email" 
              required
              placeholder="e.g. gurpreet@example.com"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number *</label>
            <input 
              type="tel" 
              required
              placeholder="e.g. +1 (647) 555-0144"
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
            />
          </div>
        </div>

        {/* Origin / Destination with drop downs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Departure Airport / City *</label>
            <select
              value={selectedOrigin}
              onChange={e => {
                setSelectedOrigin(e.target.value);
                if (e.target.value !== 'other') setCustomOrigin('');
              }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
            >
              {originList.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="other">✍ Other City... (Type Below)</option>
            </select>
            {selectedOrigin === 'other' && (
              <input
                type="text"
                required
                placeholder="Type Origin City Name"
                value={customOrigin}
                onChange={e => setCustomOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Destination Airport / City *</label>
            <select
              value={selectedDest}
              onChange={e => {
                setSelectedDest(e.target.value);
                if (e.target.value !== 'other') setCustomDest('');
              }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
            >
              {destList.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="other">✍ Other City... (Type Below)</option>
            </select>
            {selectedDest === 'other' && (
              <input
                type="text"
                required
                placeholder="Type Destination City Name"
                value={customDest}
                onChange={e => setCustomDest(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 mt-2"
              />
            )}
          </div>
        </div>

        {/* Date coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Trip Type</label>
            <div className="flex bg-slate-100 rounded-xl overflow-hidden p-0.5 border border-slate-200">
              <button 
                type="button"
                onClick={() => setTripType('one-way')}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${tripType === 'one-way' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                One Way
              </button>
              <button 
                type="button"
                onClick={() => setTripType('round-trip')}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${tripType === 'round-trip' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Round Trip
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Depart Date *</label>
            <input 
              type="date" 
              required
              min={todayStr}
              value={departDate} 
              onChange={e => setDepartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
            />
          </div>

          {tripType === 'round-trip' ? (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Return Date *</label>
              <input 
                type="date" 
                required={tripType === 'round-trip'}
                min={departDate || todayStr}
                value={returnDate} 
                onChange={e => setReturnDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cabin Class</label>
              <select 
                value={cabin} 
                onChange={e => setCabin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
                <option value="First">First Class</option>
              </select>
            </div>
          )}

          {tripType === 'round-trip' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cabin Class</label>
              <select 
                value={cabin} 
                onChange={e => setCabin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
                <option value="First">First Class</option>
              </select>
            </div>
          )}
        </div>

        {/* Date flexibility & contact choice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Date Flexibility</label>
            <select
              value={flexibleDates}
              onChange={e => setFlexibleDates(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
            >
              <option value="Exact Dates">Strictly Exact Dates Only</option>
              <option value="± 1 Day">Flexible ± 1 Day</option>
              <option value="± 3 Days">Flexible ± 3 Days</option>
              <option value="± 7 Days">Flexible ± 7 Days (Best discounts)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1 font-bold">Preferred Contact Mode *</label>
            <select
              value={preferredContact}
              onChange={e => setPreferredContact(e.target.value)}
              className="w-full bg-indigo-50 border border-indigo-200 text-xs rounded-xl px-3 py-2 text-indigo-900 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="WhatsApp">🟢 Prefer WhatsApp Message</option>
              <option value="Phone Call">📞 Prefer Direct Voice Call</option>
              <option value="Email">✉ Prefer Structured Email Quotation</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-semibold">Special Requests (Airlines, Transit Hubs, Layover preferences)</label>
          <textarea 
            rows={2}
            placeholder="e.g. Prefer Air India direct flights, require wheelchair support, or specify meal requests."
            value={message} 
            onChange={e => setMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
          />
        </div>

        {/* Consent checkbox and Submit */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
          <div className="flex items-start gap-2 max-w-lg">
            <input 
              type="checkbox" 
              required
              id="corridor-consent-check"
              checked={consent} 
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer shrink-0"
            />
            <label htmlFor="corridor-consent-check" className="text-[10px] text-slate-400 leading-normal">
              I authorize Flight Desk India to process my flight query and coordinate custom offline ethnic consolidator fares.
            </label>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm shrink-0 font-display"
          >
            {isSubmitting ? 'Comparing GDS rates...' : 'Submit Priority Query ➔'}
          </button>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-xs font-semibold text-center mt-2">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// MAIN COMPONENT EXPORT
// ---------------------------------------------------------------------------------------------
interface SubViewsProps {
  currentView: string;
  viewData?: any;
  onNavigate: (view: string, data?: any) => void;
  onPrefillRoute: (from: string, to: string) => void;
}

export default function SubViews({ currentView, viewData, onNavigate, onPrefillRoute }: SubViewsProps) {
  
  // --- Callback Scheduler Sub-state ---
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbDate, setCbDate] = useState('');
  const [cbTimeSlot, setCbTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [cbLanguage, setCbLanguage] = useState('English');
  const [cbSubmitted, setCbSubmitted] = useState(false);
  const [cbRef, setCbRef] = useState('');

  // --- Fare Alert Sub-state ---
  const [faOrigin, setFaOrigin] = useState('');
  const [faDest, setFaDest] = useState('');
  const [faMonth, setFaMonth] = useState('October');
  const [faEmail, setFaEmail] = useState('');
  const [faSubmitted, setFaSubmitted] = useState(false);

  // --- General Contact Form State ---
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cbName || !cbPhone || !cbDate) return;

    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cbName,
          phone: cbPhone,
          date: cbDate,
          timeSlot: cbTimeSlot,
          language: cbLanguage
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCbRef(data.callbackId);
        setCbSubmitted(true);
      }
    } catch (err) {}
  };

  const handleFareAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faOrigin || !faDest || !faEmail) return;

    try {
      const res = await fetch('/api/fare-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: faOrigin,
          destination: faDest,
          travelMonth: faMonth,
          email: faEmail
        })
      });
      if (res.ok) {
        setFaSubmitted(true);
      }
    } catch (err) {}
  };

  const handleGeneralContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  // ---------------------------------------------------------------------------------------------
  // VIEW: ABOUT US
  // ---------------------------------------------------------------------------------------------
  if (currentView === 'about') {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 font-display">About Flight Desk India</h1>
        <p className="text-slate-500 mt-2 text-sm">Empowering travelers with custom flight configurations and human-assisted unpublished rates.</p>
        
        <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            Flight Desk India is a premium independent travel consultancy specializing in transoceanic flight coordination between North America, Australia, and India. While standard online flight booking sites rely solely on automated search algorithms, we understand that true travel satisfaction requires custom human configuration.
          </p>
          <p>
            By working with certified airline consolidators, GDS terminal systems, and private corporate tariffs, our team secures flight itineraries that are not available to the public online. We take the stress out of complex routing, luggage policies, transit regulations, wheelchair requests, and special meal assignments.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="border border-slate-100 rounded-2xl p-4 text-center bg-slate-50">
              <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Unpublished Inventories</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">Access private, telephone-only offline airline rates.</p>
            </div>
            <div className="border border-slate-100 rounded-2xl p-4 text-center bg-slate-50">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">24/7 Human Dispatch</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">Live coordinators actively checking routes and Layover Visas.</p>
            </div>
            <div className="border border-slate-100 rounded-2xl p-4 text-center bg-slate-50">
              <ShieldCheck className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Secure GDS Issuance</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">Accurate passenger records verified by human experts.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------------------------
  // VIEW: TRAVEL BLOG INDEX
  // ---------------------------------------------------------------------------------------------
  if (currentView === 'blog') {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 text-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 font-display">International Travel Insights & Resource Center</h1>
        <p className="text-slate-500 mt-2 text-sm">Actionable tips, baggage guidelines, and layover reviews by veteran travel coordinators.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {BLOG_POSTS.map(post => (
            <div 
              key={post.id}
              onClick={() => onNavigate(`blog-post-${post.slug}`, post)}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between"
            >
              <div>
                <img src={post.image} alt={post.title} referrerPolicy="no-referrer" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition-colors font-display leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-3 border-t border-slate-100 text-slate-400 text-[10px] flex justify-between items-center">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------------------------
  // VIEW: INDIVIDUAL BLOG POST READER
  // ---------------------------------------------------------------------------------------------
  if (currentView.startsWith('blog-post-')) {
    const post = BLOG_POSTS.find(p => `blog-post-${p.slug}` === currentView) || BLOG_POSTS[0];

    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 text-slate-800 font-sans">
        <button 
          onClick={() => onNavigate('blog')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-semibold mb-6 text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resources
        </button>

        <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full">
          {post.category}
        </span>
        
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-4 leading-tight font-display">{post.title}</h1>
        
        <div className="flex items-center gap-4 text-slate-400 text-xs mt-4 pb-6 border-b border-slate-100">
          <span>Date: {post.date}</span>
          <span>•</span>
          <span>Read time: {post.readTime}</span>
        </div>

        <img src={post.image} alt={post.title} referrerPolicy="no-referrer" className="w-full h-72 object-cover rounded-3xl mt-6 shadow-sm" />

        {/* Dynamic formatted markdown content (literal parsed) */}
        <div className="mt-8 text-sm sm:text-base text-slate-600 leading-relaxed space-y-6">
          {post.content.split('\n\n').map((para, pIdx) => {
            if (para.startsWith('###')) {
              return <h3 key={pIdx} className="text-lg sm:text-xl font-bold text-slate-900 font-display mt-8 mb-2">{para.replace('###', '').trim()}</h3>;
            }
            if (para.startsWith('*')) {
              return (
                <ul key={pIdx} className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  {para.split('\n').map((item, iIdx) => (
                    <li key={iIdx}>{item.replace('*', '').trim()}</li>
                  ))}
                </ul>
              );
            }
            return <p key={pIdx}>{para}</p>;
          })}
        </div>

        {/* CTA box at article bottom */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mt-12 border border-slate-800 text-center relative overflow-hidden">
          <h3 className="text-lg font-bold font-display">Securing Private, Offline Flight Tariffs</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Our consultants compare active consolidator inventories across multiple airline ticketing interfaces to coordinate personalized itineraries.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button 
              onClick={() => onNavigate('quote-form')}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs uppercase font-extrabold"
            >
              Request Custom Fare Quote ➔
            </button>
            <a 
              href={`tel:${OFFICE_CONTACTS.tollFree}`}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs uppercase font-extrabold flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-orange-400" /> Speak with Specialist
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------------------------
  // SPECIALTY TRAVEL: BUSINESS CLASS
  // ---------------------------------------------------------------------------------------------
  if (currentView === 'service-business') {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 font-display">Premium Business & First-Class Flight Options</h1>
        <p className="text-slate-500 mt-1 text-sm">Securing corporate contracts and consolidator rates for premium cabin seating.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <img 
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop" 
            alt="Business Class Cabin" 
            referrerPolicy="no-referrer"
            className="rounded-3xl h-64 w-full object-cover shadow-sm" 
          />
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display leading-tight">Elevated Comfort on Long-Haul Corridors</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Long transoceanic flights can be physically exhausting. Our corporate consultants secure deep business discounts with major carriers, ensuring you receive lie-flat seating configurations, luxury lounge access, priority airport check-ins, and double baggage capacities.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-1.5 text-blue-600">✓ Fully flat-bed seating options secured</li>
              <li className="flex items-center gap-1.5 text-blue-600">✓ Dedicated airline lounge access privileges</li>
              <li className="flex items-center gap-1.5 text-blue-600">✓ Expanded baggage allowances automatically coordinated</li>
            </ul>
          </div>
        </div>

        {/* INTEGRATED BUSINESS ENQUIRY FORM */}
        <div className="mt-12">
          <SpecialtyForm serviceType="service-business" onNavigate={onNavigate} onPrefillRoute={onPrefillRoute} />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------------------------
  // OTHER SPECIALTY SERVICES (Integrated Custom Form in each section)
  // ---------------------------------------------------------------------------------------------
  const SERVICE_DETAILS: Record<string, { title: string; subtitle: string; img: string; text: string; list: string[] }> = {
    'service-lastminute': {
      title: 'Urgent & Last-Minute Flight Booking Assistance',
      subtitle: 'Securing remaining seats on urgent timelines with personalized routing checks.',
      img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop',
      text: 'Need to travel urgently due to unexpected circumstances? Online portals often spike prices on remaining cabin tickets. Our specialists query multiple airline booking channels, check transit visas, and coordinate short-layover routes so you reach your destination safely and without unnecessary stress.',
      list: ['Immediate check of immediate 24-48 hour flight departures', 'Accurate layover visa validation on short transits', 'Ethical seat-block checks directly in GDS reservation systems']
    },
    'service-group': {
      title: 'Family & Group Flight Bookings',
      subtitle: 'Coordinating pricing, seating arrangements, and luggage allowances for 10+ travelers.',
      img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop',
      text: 'Coordinating international journeys for families, wedding parties, religious tours, corporate teams, or student cohorts can be logistically challenging. We establish a single dedicated agent to handle group ticketing, lock in fixed pricing, negotiate flexible deposit rates, and secure unified seat blocks with carriers.',
      list: ['Fixed fare contracts for groups of 10 or more passengers', 'Flexible passenger name editing up to ticketing deadline', 'Unified baggage allotments and seat row maps coordinated safely']
    },
    'service-student': {
      title: 'Student Flight Specials',
      subtitle: 'Extra baggage allowances, date change flexibility, and student discounts secured.',
      img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
      text: 'Moving abroad for higher education is a major milestone. We coordinate with partner airlines to secure student fare structures that feature double checked-baggage options (ideal for packing domestic supplies) and low-cost date changes to accommodate university semester shifts.',
      list: ['Coordinating 3-piece baggage options on select student airlines', 'Low change penalties for student ticket semester rescheduling', 'Helpful advice for first-time transoceanic travelers']
    },
    'service-senior': {
      title: 'Senior Citizen Travel Assistance',
      subtitle: 'Wheelchair registration, dietary requests, and stress-free layovers planned around seniors.',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      text: 'We take pride in planning stress-free transoceanic travel for elderly parents and grandparents. Our agents actively register wheelchair requests, book special dietary vegetarian meals, choose airlines with comfortable cabins, and schedule optimal connection hubs to avoid physical exhaustion.',
      list: ['Guaranteed physical wheelchair airport assistance registration', 'Accurate dietary meal mapping (e.g. Jain or Hindu veg meal codes)', 'Safe, well-spaced connection hubs (avoiding terminal changes)']
    }
  };

  if (SERVICE_DETAILS[currentView]) {
    const srv = SERVICE_DETAILS[currentView];
    const serviceKey = currentView as 'service-lastminute' | 'service-group' | 'service-student' | 'service-senior';

    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">{srv.title}</h1>
        <p className="text-slate-500 mt-1 text-sm">{srv.subtitle}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-10">
          <img src={srv.img} alt={srv.title} referrerPolicy="no-referrer" className="rounded-3xl h-64 w-full object-cover shadow-sm" />
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display leading-tight">Configured and Assisted Around You</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{srv.text}</p>
            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              {srv.list.map((li, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-blue-600">✓ {li}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* INTEGRATED SPECIALTY ENQUIRY FORM */}
        <div className="mt-12">
          <SpecialtyForm serviceType={serviceKey} onNavigate={onNavigate} onPrefillRoute={onPrefillRoute} />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------------------------
  // DYNAMIC ROUTE PAGES: Canada/USA/Australia to India (and vice-versa)
  // ---------------------------------------------------------------------------------------------
  const ROUTE_PAGE_DETAILS: Record<string, { title: string; origin: string; dest: string; originList: string[]; destList: string[]; text: string }> = {
    'route-ca-in': {
      title: 'Affordable Flight Deals from Canada to India',
      origin: 'Toronto (YYZ) or Vancouver (YVR)',
      dest: 'Amritsar, Delhi, Hyderabad, Mumbai, Kochi, Pune',
      originList: ['Toronto', 'Vancouver', 'Calgary', 'Montreal', 'Edmonton', 'Ottawa'],
      destList: ['Delhi', 'Mumbai', 'Ahmedabad', 'Amritsar', 'Hyderabad', 'Kochi'],
      text: 'Explore premium flight options connecting Canadian gateways with India. We coordinate luggage rules, child bassinet support, and transfer connections through hubs like London, Frankfurt, Munich, Dubai, or Doha.'
    },
    'route-in-ca': {
      title: 'Affordable Flight Deals from India to Canada',
      origin: 'Delhi, Mumbai, Ahmedabad, Hyderabad',
      dest: 'Toronto, Vancouver, Montreal, Calgary',
      originList: ['Delhi', 'Mumbai', 'Ahmedabad', 'Hyderabad', 'Amritsar'],
      destList: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton'],
      text: 'Return flights and immigration journeys from India to Canadian cities. We specialize in securing ethnic fare codes with double baggage allowances, perfect for student resettlements or returning families.'
    },
    'route-us-in': {
      title: 'Affordable Flight Deals from USA to India',
      origin: 'New York (JFK), Chicago (ORD), San Francisco (SFO)',
      dest: 'Hyderabad, Delhi, Ahmedabad, Chennai, Bengaluru',
      originList: ['New York', 'Chicago', 'San Francisco', 'Dallas', 'Boston', 'Miami', 'Atlanta'],
      destList: ['Hyderabad', 'Delhi', 'Ahmedabad', 'Chennai', 'Kochi', 'Bengaluru'],
      text: 'Connecting major American metros with popular Indian destinations. Compare direct operations with Air India or premium one-stop services with Emirates, Qatar Airways, Etihad, or Lufthansa.'
    },
    'route-in-us': {
      title: 'Affordable Flight Deals from India to USA',
      origin: 'Delhi, Mumbai, Bengaluru, Hyderabad',
      dest: 'New York, San Francisco, Chicago, Dallas',
      originList: ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai'],
      destList: ['New York', 'San Francisco', 'Chicago', 'Dallas', 'Boston', 'Atlanta'],
      text: 'Safe transoceanic routes returning to the United States. We actively plan layover times in European or Middle Eastern hubs, ensuring easy customs clearance and baggage transfers.'
    },
    'route-au-in': {
      title: 'Affordable Flight Deals from Australia to India',
      origin: 'Sydney (SYD), Melbourne (MEL), Perth (PER)',
      dest: 'Delhi, Mumbai, Hyderabad, Chennai, Kochi',
      originList: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
      destList: ['Delhi', 'Mumbai', 'Hyderabad', 'Chennai', 'Kochi', 'Ahmedabad'],
      text: 'Securing consolidator flight options between Australia and India. Save hours of search with hand-planned direct or quick layover routes transiting via Singapore, Bangkok, or Kuala Lumpur.'
    },
    'route-in-au': {
      title: 'Affordable Flight Deals from India to Australia',
      origin: 'Delhi, Mumbai, Kochi, Ahmedabad',
      dest: 'Sydney, Melbourne, Perth, Brisbane',
      originList: ['Delhi', 'Mumbai', 'Kochi', 'Ahmedabad', 'Hyderabad', 'Chennai'],
      destList: ['Sydney', 'Melbourne', 'Perth', 'Brisbane'],
      text: 'Immigration, student, and family visits to Australia from major Indian airport hubs. We configure comfortable connections to avoid exhausting intermediate transfers.'
    }
  };

  if (ROUTE_PAGE_DETAILS[currentView]) {
    const r = ROUTE_PAGE_DETAILS[currentView];
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">{r.title}</h1>
        <p className="text-slate-500 mt-1 text-sm">{r.text}</p>

        {/* Airport Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Popular Origin Metros</h4>
            <div className="flex flex-wrap gap-1.5">
              {r.originList.map(item => (
                <button 
                  key={item}
                  onClick={() => onPrefillRoute(item, r.destList[0])}
                  className="bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-slate-400" /> {item}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Popular Destinations</h4>
            <div className="flex flex-wrap gap-1.5">
              {r.destList.map(item => (
                <button 
                  key={item}
                  onClick={() => onPrefillRoute(r.originList[0], item)}
                  className="bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-slate-400" /> {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ panel for Route */}
        <div className="mt-12 border-t border-slate-100 pt-10">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">Route Advisory & Baggage Checklist</h3>
          <div className="mt-6 space-y-4 font-sans">
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
              <p className="font-bold text-slate-900 text-xs sm:text-sm">Do consolidator rates include checked baggage allowances?</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Yes, virtually all long-haul international fares we secure to India include standard 2-piece checked baggage allotments (typically 23kg per bag). When traveling with students, we actively register student status certificates with carriers to request an extra 3rd piece where available.
              </p>
            </div>
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
              <p className="font-bold text-slate-900 text-xs sm:text-sm">How do I verify baggage allocations across code-shared airlines?</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                If your journey consists of multiple airlines (e.g. Air Canada connecting to Air India, or United to Qatar), baggage rules are governed by the Most Significant Carrier (MSC) rule. Our specialists verify this at the reservation stage so you avoid unexpected fees at check-in.
              </p>
            </div>
          </div>
        </div>

        {/* INTEGRATED CORRIDOR-SPECIFIC PRIORITY FARE FORM */}
        <div className="mt-12 pt-10 border-t border-slate-100">
          <h3 className="text-lg sm:text-xl font-bold text-slate-950 mb-6 font-display">🔍 Get Private Offline Quote for this Route</h3>
          <CorridorEnquiryForm 
            corridorKey={currentView}
            originList={r.originList}
            destList={r.destList}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------------------------
  // LEGAL POLICY PAGES: Privacy, Terms, Cancellations, Refunds, Disclaimers
  // ---------------------------------------------------------------------------------------------
  const LEGAL_TITLES: Record<string, { title: string; desc: string }> = {
    'legal-privacy': {
      title: '🔒 Privacy Policy & Data Security',
      desc: 'How Flight Desk India protects, stores, and handles traveler enquiry data securely.'
    },
    'legal-terms': {
      title: '⚖ Terms and Conditions of Service',
      desc: 'The regulatory guidelines, ticketing restrictions, and agency terms of Flight Desk India.'
    },
    'legal-refunds': {
      title: '💵 Refund Policy',
      desc: 'Understanding airline consolidator fare rules and processing refund requests safely.'
    },
    'legal-cancellation': {
      title: '❌ Cancellation Policy',
      desc: 'Ticketing cancellation procedures, airline penalties, and agency rules.'
    },
    'legal-disclaimer': {
      title: '📝 Disclaimer of Warranties',
      desc: 'Clarifications on promotional pricing, GDS databases, and travel agent representations.'
    }
  };

  if (LEGAL_TITLES[currentView]) {
    const lg = LEGAL_TITLES[currentView];
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-slate-800 font-sans">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">{lg.title}</h1>
        <p className="text-slate-500 mt-1 text-sm">{lg.desc}</p>

        <div className="mt-8 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800 uppercase tracking-wider">1. General Provisions</p>
          <p>
            Flyhigh operates as an independent travel consultancy and flight-assistance booking coordinator. By submitting an enquiry, requesting callbacks, or discussing flight layouts with our agents, you acknowledge that no ticket is issued automatically, and all pricing offers are subject to active airline verification.
          </p>

          <p className="font-semibold text-slate-800 uppercase tracking-wider">2. Data Confidentiality & Consent</p>
          <p>
            We enforce robust server-side security measures to prevent data leakage of traveler credentials. Your name, email, and phone coordinates are solely processed to build custom flight layout quotations and provide immediate travel callbacks. We never resell lists or leak contact details to spam centers.
          </p>

          <p className="font-semibold text-slate-800 uppercase tracking-wider">3. Ticketing Fare Restrictions</p>
          <p>
            Promotional offline and consolidator fares are highly restrictive. Cancellations, refunds, route modifications, and date change allowances are governed strictly by the issuing airline carrier’s internal terms. Flight Desk India holds no authority to override airline-imposed penalties.
          </p>

          <div className="bg-slate-50 p-4 border-l-4 border-orange-500 rounded-r-xl">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-xs">Customer Advisory Warning</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Always inspect baggage specifications, layover transit hubs, and visa requirements prior to authorizing payment for any finalized travel itinerary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------------------------
  // VIEW: THANK-YOU & ENQUIRY CONFIRMATION PAGE
  // ---------------------------------------------------------------------------------------------
  if (currentView === 'thank-you') {
    const lead = viewData?.lead || {};
    
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-slate-800 font-sans text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl border-t-8 border-t-orange-600">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-scale" />
          
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Your Enquiry Was Received Successfully!</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Our expert travel consultants have received your route requirements. We are currently querying consolidator databases for optimized fares.
          </p>

          {/* Lead Details Block */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 my-6 text-left space-y-3 font-sans">
            <div className="flex justify-between items-center border-b border-slate-200/50 pb-2 mb-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Enquiry Reference</span>
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                {viewData?.leadId || 'FDI-Pending'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Traveler Name</span>
                <span className="font-bold text-slate-800">{lead.name || 'Valued Client'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Contact Phone</span>
                <span className="font-bold text-slate-800">{lead.phone || 'Provided'}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Route Origin</span>
                <span className="font-bold text-slate-800 text-ellipsis overflow-hidden block">{lead.origin || 'Custom'}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Route Destination</span>
                <span className="font-bold text-slate-800 text-ellipsis overflow-hidden block">{lead.destination || 'Custom'}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            🕒 Expect a phone callback or WhatsApp message within 15 minutes during standard operational hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back to Home
            </button>
            <a 
              href={`tel:${OFFICE_CONTACTS.tollFree}`}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-white" /> Call Specialist Now
            </a>
            <a 
              href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hi Customer Support, I have just submitted a flight enquiry on Flyhigh (Ref: ${viewData?.leadId || 'Pending'}). Here are my details:\n\n` +
                `- Name: ${lead.name || 'Valued Client'}\n` +
                `- Phone: ${lead.phone || 'Provided'}\n` +
                `- Route: ${lead.origin || 'Custom'} to ${lead.destination || 'Custom'}\n` +
                `- Cabin: ${lead.cabin || 'Economy'}\n` +
                `- Dates: ${lead.departDate || 'Any'}\n\n` +
                `Please check your private offline consolidator rates for this route. Thank you!`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-white" /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
