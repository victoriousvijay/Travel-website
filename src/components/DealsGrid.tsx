import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, MessageSquare, Share2, Clipboard, ChevronDown, Check, ArrowRight, Tag, Globe, X } from 'lucide-react';
import { FLIGHT_DEALS, OFFICE_CONTACTS, AIRPORTS } from '../data/travelData';

const DESTINATION_IMAGES: Record<string, string> = {
  DEL: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop', // Delhi (Lotus Temple/Red Fort)
  BOM: 'https://images.unsplash.com/photo-1529253123713-1041132c2bc1?q=80&w=600&auto=format&fit=crop', // Mumbai
  AMD: 'https://images.unsplash.com/photo-1600664901390-301130986321?q=80&w=600&auto=format&fit=crop', // Ahmedabad
  ATQ: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=600&auto=format&fit=crop', // Amritsar (Golden Temple)
  HYD: 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?q=80&w=600&auto=format&fit=crop', // Hyderabad (Charminar)
  MAA: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop', // Chennai
  COK: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=600&auto=format&fit=crop', // Kochi (Kerala backwaters)
  PNQ: 'https://images.unsplash.com/photo-1569974498991-d3c12a504f9f?q=80&w=600&auto=format&fit=crop', // Pune
  BLR: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600&auto=format&fit=crop', // Bengaluru
  CCU: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600&auto=format&fit=crop', // Kolkata
  YYZ: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=600&auto=format&fit=crop', // Toronto
  YVR: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=600&auto=format&fit=crop', // Vancouver
  YUL: 'https://images.unsplash.com/photo-1519112232436-9923c6192a53?q=80&w=600&auto=format&fit=crop', // Montreal
  YYC: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=600&auto=format&fit=crop', // Calgary
  YEG: 'https://images.unsplash.com/photo-1504812850383-71a393e8e217?q=80&w=600&auto=format&fit=crop', // Edmonton
  default: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop' // Flight
};

interface DealsGridProps {
  currentCountryFilter?: 'USA' | 'Canada' | 'Australia' | 'India' | 'All';
  onSelectDeal: (deal: any) => void;
}

export default function DealsGrid({ currentCountryFilter = 'All', onSelectDeal }: DealsGridProps) {
  const [originCountry, setOriginCountry] = useState<string>(currentCountryFilter);
  const [cabin, setCabin] = useState<string>('All');
  const [currency, setCurrency] = useState<'USD' | 'CAD' | 'AUD' | 'INR'>('CAD');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'fare-low' | 'fare-high' | 'popular'>('popular');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [copiedDealId, setCopiedDealId] = useState<string | null>(null);
  const [selectedDealForPopup, setSelectedDealForPopup] = useState<any | null>(null);

  // Mobile specific search and autocomplete states
  const [hasSearchedMobile, setHasSearchedMobile] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [filteredAirportsMobile, setFilteredAirportsMobile] = useState<any[]>([]);
  const [showAirportDropdownMobile, setShowAirportDropdownMobile] = useState(false);

  useEffect(() => {
    if (!mobileSearchQuery) {
      setFilteredAirportsMobile([]);
      return;
    }
    const q = mobileSearchQuery.toLowerCase();
    const filtered = AIRPORTS.filter(ap => 
      ap.code.toLowerCase().includes(q) || 
      ap.city.toLowerCase().includes(q) || 
      ap.country.toLowerCase().includes(q) || 
      ap.name.toLowerCase().includes(q)
    );
    setFilteredAirportsMobile(filtered.slice(0, 10));
  }, [mobileSearchQuery]);

  // Sync prop filter changes
  useEffect(() => {
    setOriginCountry(currentCountryFilter);
    if (currentCountryFilter === 'USA') setCurrency('USD');
    else if (currentCountryFilter === 'Canada') setCurrency('CAD');
    else if (currentCountryFilter === 'Australia') setCurrency('AUD');
    else if (currentCountryFilter === 'India') setCurrency('INR');
  }, [currentCountryFilter]);

  // Adjust currency automatically on origin country filter click
  const handleCountryFilterChange = (country: string) => {
    setOriginCountry(country);
    if (country === 'USA') setCurrency('USD');
    else if (country === 'Canada') setCurrency('CAD');
    else if (country === 'Australia') setCurrency('AUD');
    else if (country === 'India') setCurrency('INR');
  };

  // Convert prices based on currency selected (simplified rate mapping to maintain consistent ratios)
  const getConvertedFare = (fare: number, fromCurr: string) => {
    if (fromCurr === currency) return Math.round(fare);
    
    // Rates to base CAD
    const toCAD: Record<string, number> = { CAD: 1, USD: 1.36, AUD: 0.91, INR: 0.016 };
    // Rates from base CAD
    const fromCAD: Record<string, number> = { CAD: 1, USD: 0.74, AUD: 1.1, INR: 61.5 };
    
    const amountInCAD = fare * (toCAD[fromCurr] || 1);
    return Math.round(amountInCAD * (fromCAD[currency] || 1));
  };

  // Filtering
  const filteredDeals = FLIGHT_DEALS.filter(deal => {
    const matchesCountry = originCountry === 'All' || deal.originCountry === originCountry;
    const matchesCabin = cabin === 'All' || deal.cabin === cabin;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      deal.originCity.toLowerCase().includes(query) ||
      deal.originCode.toLowerCase().includes(query) ||
      deal.destCity.toLowerCase().includes(query) ||
      deal.destCode.toLowerCase().includes(query);

    return matchesCountry && matchesCabin && matchesSearch;
  });

  // Sorting
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    const fareA = getConvertedFare(a.sampleFare, a.currency);
    const fareB = getConvertedFare(b.sampleFare, b.currency);
    
    if (sortBy === 'fare-low') return fareA - fareB;
    if (sortBy === 'fare-high') return fareB - fareA;
    
    // Default popular: featured items first
    const featA = a.isFeatured ? 1 : 0;
    const featB = b.isFeatured ? 1 : 0;
    return featB - featA;
  });

  const handleShareDeal = (deal: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `fly with us Special Deal: ${deal.originCity} (${deal.originCode}) to ${deal.destCity} (${deal.destCode}) - Starting at ${currency} ${getConvertedFare(deal.sampleFare, deal.currency)}! Call ${OFFICE_CONTACTS.tollFree} for details.`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedDealId(deal.id);
      setTimeout(() => setCopiedDealId(null), 2000);
    }
  };

  return (
    <div className="w-full text-slate-800 font-sans">
      {/* Desktop View (hidden md:block) */}
      <div className="hidden md:block">
        {/* Filters bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Origin Country Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">Corridor:</span>
            {['All', 'Canada', 'USA', 'Australia', 'India'].map(c => (
              <button
                key={c}
                onClick={() => handleCountryFilterChange(c)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${originCountry === c ? 'bg-blue-600 border-blue-500 text-white shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'}`}
              >
                {c === 'All' ? (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>All Routes</span>
                  </>
                ) : c}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cities/airports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Selects: Cabin, Currency, Sort */}
          <div className="flex gap-2.5 w-full md:w-auto overflow-x-auto scrollbar-none">
            {/* Cabin */}
            <select
              value={cabin}
              onChange={(e) => setCabin(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none text-slate-700 h-9 cursor-pointer"
            >
              <option value="All">All Cabins</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
            </select>

            {/* Currency Toggle */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none text-slate-700 h-9 font-mono cursor-pointer"
              title="Display Currency"
            >
              <option value="CAD">CAD ($)</option>
              <option value="USD">USD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none text-slate-700 h-9 cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="fare-low">Lowest Fare</option>
              <option value="fare-high">Highest Fare</option>
            </select>
          </div>
        </div>

        {/* Grid List of Deals */}
        {sortedDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDeals.map(deal => {
              const fareConverted = getConvertedFare(deal.sampleFare, deal.currency);
              const imageUrl = DESTINATION_IMAGES[deal.destCode] || DESTINATION_IMAGES.default;
              
              return (
                <div 
                  key={deal.id}
                  onClick={() => setSelectedDealForPopup(deal)}
                  className="group relative bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer overflow-hidden animate-scale"
                >
                  {/* Visual Banner Area (gradient-free, clean image) */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img 
                      src={imageUrl} 
                      alt={deal.destCity} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                    />
                    
                    {/* Badge Row on Image */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {deal.isFeatured && (
                        <span className="bg-orange-600 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                          Best Fare
                        </span>
                      )}
                      <span className="bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md">
                        {deal.cabin}
                      </span>
                    </div>
                  </div>

                  {/* Card Body with Elegant Layout */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Destination Header Row */}
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                            {deal.destCity} ({deal.destCode})
                          </h3>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold px-2.5 py-0.5 rounded-lg whitespace-nowrap">
                          Unpublished
                        </span>
                      </div>

                      {/* Origin & Route Detail */}
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-4">
                        <span>From: <strong className="text-slate-800 font-bold">{deal.originCity} ({deal.originCode})</strong></span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                          {deal.tripType === 'One Way' ? 'One-Way' : 'Roundtrip'}
                        </span>
                      </div>

                      {/* Pricing Box */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider block">Exclusive Rate</span>
                          <p className="text-xl font-bold font-mono text-slate-900 flex items-baseline gap-1">
                            <span className="text-xs font-sans text-blue-600 font-bold">{currency}</span>
                            <span>{currency === 'INR' ? '₹' : '$'}{fareConverted.toLocaleString()}*</span>
                          </p>
                        </div>
                        <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-700 font-bold uppercase px-2 py-1 rounded-lg">
                          2x Bags Incl.
                        </span>
                      </div>
                    </div>

                    {/* Direct action buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDealForPopup(deal);
                        }}
                        className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        Request Fare
                      </button>

                      <a
                        href={`tel:${OFFICE_CONTACTS.tollFree}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors border border-slate-800 cursor-pointer text-center whitespace-nowrap"
                      >
                        <Phone className="w-3 h-3 text-orange-400" /> Call Agent
                      </a>
                    </div>

                    {/* Card Footer: WhatsApp and Share */}
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 pt-3.5 mt-4 text-[11px] font-semibold">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDealForPopup(deal);
                        }}
                        className="text-emerald-600 hover:text-emerald-500 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Agent
                      </button>

                      <button
                        onClick={(e) => handleShareDeal(deal, e)}
                        className="text-slate-400 hover:text-blue-500 p-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy Deal details to share"
                      >
                        {copiedDealId === deal.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500 animate-scale" />
                            <span className="text-emerald-600 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Tag className="w-8 h-8 text-slate-300 mb-3 animate-pulse" />
            <p className="text-base font-semibold text-slate-800">No flight deals matched your active filters.</p>
            <p className="text-xs text-slate-400 mt-1">Try relaxing your search parameters or query keywords.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setOriginCountry('All');
                setCabin('All');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile View (block md:hidden) - Dynamic scrolling, simplified vertical height, horizontal swipe format */}
      <div className="block md:hidden space-y-6">
        {/* Country Category Buttons / Box Selectors */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
            Select Departure Corridor
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'All', name: 'All Routes', flag: '🌍' },
              { id: 'Canada', name: 'Canada', flag: '🇨🇦' },
              { id: 'USA', name: 'USA', flag: '🇺🇸' },
              { id: 'Australia', name: 'Australia', flag: '🇦🇺' },
              { id: 'India', name: 'India', flag: '🇮🇳' }
            ].map(item => {
              const isActive = originCountry === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleCountryFilterChange(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-xs font-bold' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <span className="text-base">{item.flag}</span>
                  <span className="text-xs leading-none whitespace-nowrap">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Swipeable Horizontal Corridor Cards */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Available Deals ({sortedDeals.length})
            </p>
            <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 animate-pulse">
              Swipe Left/Right ➔
            </span>
          </div>

          {sortedDeals.length > 0 ? (
            <div className="flex flex-row overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-thin">
              {sortedDeals.map(deal => {
                const fareConverted = getConvertedFare(deal.sampleFare, deal.currency);
                const imageUrl = DESTINATION_IMAGES[deal.destCode] || DESTINATION_IMAGES.default;
                
                return (
                  <div 
                    key={deal.id}
                    onClick={() => setSelectedDealForPopup(deal)}
                    className="w-[85vw] max-w-[320px] flex-shrink-0 snap-center bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    {/* Clean Image Area */}
                    <div className="relative h-36 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                      <img 
                        src={imageUrl} 
                        alt={deal.destCity} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                      {/* Badge row */}
                      <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
                        {deal.isFeatured && (
                          <span className="bg-orange-600 text-white text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                            Best Fare
                          </span>
                        )}
                        <span className="bg-slate-900/85 text-slate-200 text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                          {deal.cabin}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Header details */}
                        <div className="flex justify-between items-start gap-1">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">
                              {deal.destCity} ({deal.destCode})
                            </h3>
                            <p className="text-[10px] text-slate-500 font-medium">
                              From {deal.originCity} ({deal.originCode}) • {deal.tripType === 'One Way' ? 'One-Way' : 'Roundtrip'}
                            </p>
                          </div>
                          <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-150 font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                            Unpublished
                          </span>
                        </div>

                        {/* Fare details */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 my-3 flex justify-between items-center">
                          <div>
                            <span className="text-[8px] uppercase text-slate-400 font-bold block">Special Fare</span>
                            <p className="text-base font-bold font-mono text-slate-900 flex items-baseline gap-0.5">
                              <span className="text-[10px] font-sans text-blue-600 font-bold">{currency}</span>
                              <span>{currency === 'INR' ? '₹' : '$'}{fareConverted.toLocaleString()}*</span>
                            </p>
                          </div>
                          <span className="text-[8px] bg-blue-50 text-blue-700 font-bold uppercase px-1.5 py-0.5 rounded">
                            2 Bags Incl.
                          </span>
                        </div>
                      </div>

                      {/* Call-to-actions */}
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDealForPopup(deal);
                          }}
                          className="w-full py-2 bg-orange-600 text-white font-bold text-[11px] rounded-lg text-center cursor-pointer whitespace-nowrap"
                        >
                          Request Fare
                        </button>
                        <a
                          href={`tel:${OFFICE_CONTACTS.tollFree}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-2 bg-slate-900 text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap text-center"
                        >
                          <Phone className="w-2.5 h-2.5 text-orange-400" /> Call Agent
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center">
              <p className="text-xs font-semibold text-slate-500">No matching corridor deals found.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setOriginCountry('All');
                  setCabin('All');
                }}
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Filter / Search panel placed strictly at the BOTTOM of the section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            Search & Filter Panel
          </p>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search destination cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Cabin */}
            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Cabin</label>
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] font-bold focus:outline-none text-slate-700 cursor-pointer h-9"
              >
                <option value="All">All</option>
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] font-bold focus:outline-none text-slate-700 cursor-pointer h-9 font-mono"
              >
                <option value="CAD">CAD</option>
                <option value="USD">USD</option>
                <option value="AUD">AUD</option>
                <option value="INR">INR</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] font-bold focus:outline-none text-slate-700 cursor-pointer h-9"
              >
                <option value="popular">Popular</option>
                <option value="fare-low">Low Fare</option>
                <option value="fare-high">High Fare</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing disclaimer */}
      <p className="text-[11px] text-slate-400 mt-8 text-center italic">
        * Sample promotional fare. Subject to availability, travel dates, taxes, airline rules, and change without notice. Contact our travel agency specialists to lock in final seat fares.
      </p>

      {/* Selected Deal Connect Popup Modal */}
      {selectedDealForPopup && (() => {
        const fareConverted = getConvertedFare(selectedDealForPopup.sampleFare, selectedDealForPopup.currency);
        const whatsappMsg = `Hi! I'm interested in booking the exclusive unpublished flight deal from ${selectedDealForPopup.originCity} (${selectedDealForPopup.originCode}) to ${selectedDealForPopup.destCity} (${selectedDealForPopup.destCode}) in ${selectedDealForPopup.cabin} class.\n\n` +
          `• Class: ${selectedDealForPopup.cabin}\n` +
          `• Routing: ${selectedDealForPopup.originCode} ➔ ${selectedDealForPopup.destCode}\n` +
          `• Trip Type: ${selectedDealForPopup.tripType}\n` +
          `• Promotional Rate: ${currency === 'INR' ? '₹' : '$'}${fareConverted.toLocaleString()} ${currency}*\n\n` +
          `Could you please verify current seat availability and lock in this special rate for me?`;
        
        const encodedMsg = encodeURIComponent(whatsappMsg);
        const whatsappUrl = `https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}?text=${encodedMsg}`;

        return (
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[150] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedDealForPopup(null)}
          >
            <div 
              className="relative bg-white border border-slate-100 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl p-6 sm:p-8 text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedDealForPopup(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon / Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest">
                    Unpublished Fare Lock
                  </span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1.5">Exclusive Flight Deal</h3>
                </div>
              </div>

              {/* Flight Summary */}
              <div className="bg-slate-50 border border-slate-150/80 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Departure</p>
                    <p className="text-sm font-bold text-slate-800">{selectedDealForPopup.originCity} ({selectedDealForPopup.originCode})</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Destination</p>
                    <p className="text-sm font-bold text-slate-800">{selectedDealForPopup.destCity} ({selectedDealForPopup.destCode})</p>
                  </div>
                </div>

                <div className="h-px bg-slate-200 my-2.5" />

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                  <div>• Cabin: <strong className="text-slate-800 font-bold">{selectedDealForPopup.cabin}</strong></div>
                  <div>• Trip: <strong className="text-slate-800 font-bold">{selectedDealForPopup.tripType}</strong></div>
                  <div>• Bags: <strong className="text-slate-800 font-bold">2 Checked Bags</strong></div>
                  <div>• Taxes: <strong className="text-slate-800 font-bold">All Included</strong></div>
                </div>

                <div className="mt-4 bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Special Negotiated Price</span>
                    <p className="text-lg font-extrabold text-slate-900 font-mono leading-none mt-0.5">
                      <span className="text-xs font-sans text-blue-600 font-bold mr-0.5">{currency}</span>
                      {currency === 'INR' ? '₹' : '$'}{fareConverted.toLocaleString()}*
                    </p>
                  </div>
                  <span className="text-[8px] bg-emerald-600 text-white font-black uppercase px-2 py-1 rounded-md">
                    Guaranteed Rate
                  </span>
                </div>
              </div>

              {/* Call to action explanation */}
              <p className="text-xs text-slate-500 leading-relaxed mb-6 text-center">
                This is a consolidator rate not visible to the public. To secure this fare before seats are sold out, speak directly with our live specialists.
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                {/* WhatsApp Option */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-center"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-100" /> Chat live via WhatsApp
                </a>

                {/* Call Option */}
                <a
                  href={`tel:${OFFICE_CONTACTS.tollFree}`}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4 text-orange-100" /> Call Toll-Free Specialist
                </a>

                {/* Custom search pre-fill (original onSelectDeal behavior) */}
                <button
                  onClick={() => {
                    onSelectDeal(selectedDealForPopup);
                    setSelectedDealForPopup(null);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Fill Detailed Booking Request Form
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
