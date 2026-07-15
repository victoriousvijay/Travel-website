import React, { useState } from 'react';
import { Plane, ArrowRight, Clock, Star, Landmark, Globe, MapPin, Navigation } from 'lucide-react';
import { AIRPORTS } from '../data/travelData';

interface RouteConnection {
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  duration: string;
  avgStops: string;
  highlights: string;
}

const CORRIDORS: Record<string, RouteConnection[]> = {
  Canada: [
    { fromCity: 'Toronto', fromCode: 'YYZ', toCity: 'Amritsar', toCode: 'ATQ', duration: '17h (1 stop)', avgStops: '1 Stop', highlights: 'Popular family choice; high luggage allowances.' },
    { fromCity: 'Vancouver', fromCode: 'YVR', toCity: 'Delhi', toCode: 'DEL', duration: '14.5h (Non-stop)', avgStops: 'Non-stop', highlights: 'Direct service; daily schedule.' },
    { fromCity: 'Calgary', fromCode: 'YYC', toCity: 'Mumbai', toCode: 'BOM', duration: '18h (1 stop)', avgStops: '1 Stop', highlights: 'Seamless transfers via London/Frankfurt.' },
    { fromCity: 'Toronto', fromCode: 'YYZ', toCity: 'Hyderabad', toCode: 'HYD', duration: '19h (1 stop)', avgStops: '1 Stop', highlights: 'Premium cabins with competitive pricing.' }
  ],
  USA: [
    { fromCity: 'New York', fromCode: 'JFK', toCity: 'Delhi', toCode: 'DEL', duration: '14h (Non-stop)', avgStops: 'Non-stop', highlights: 'Daily operations; premium airline alliances.' },
    { fromCity: 'San Francisco', fromCode: 'SFO', toCity: 'Hyderabad', toCode: 'HYD', duration: '18h (1 stop)', avgStops: '1 Stop', highlights: 'Optimized for business & tech corridors.' },
    { fromCity: 'Chicago', fromCode: 'ORD', toCity: 'Ahmedabad', toCode: 'AMD', duration: '17h (1 stop)', avgStops: '1 Stop', highlights: 'Frequent flights with double baggage benefits.' },
    { fromCity: 'Dallas', fromCode: 'DFW', toCity: 'Delhi', toCode: 'DEL', duration: '19h (1 stop)', avgStops: '1 Stop', highlights: 'Comfortable layover schedules in Doha/Dubai.' }
  ],
  Australia: [
    { fromCity: 'Sydney', fromCode: 'SYD', toCity: 'Delhi', toCode: 'DEL', duration: '12.5h (Non-stop)', avgStops: 'Non-stop', highlights: 'Direct operations; top-rated alliance carrier.' },
    { fromCity: 'Melbourne', fromCode: 'MEL', toCity: 'Mumbai', toCode: 'BOM', duration: '14h (1 stop)', avgStops: '1 Stop', highlights: 'Fast transfers via Singapore or Bangkok.' },
    { fromCity: 'Perth', fromCode: 'PER', toCity: 'Delhi', toCode: 'DEL', duration: '11h (1 stop)', avgStops: '1 Stop', highlights: 'Short transit time; highly economical.' }
  ],
  India: [
    { fromCity: 'Delhi', fromCode: 'DEL', toCity: 'Toronto', toCode: 'YYZ', duration: '15h (Non-stop)', avgStops: 'Non-stop', highlights: 'Excellent for students and returning families.' },
    { fromCity: 'Mumbai', fromCode: 'BOM', toCity: 'Vancouver', toCode: 'YVR', duration: '18h (1 stop)', avgStops: '1 Stop', highlights: 'Double baggage allowance with premium partners.' },
    { fromCity: 'Ahmedabad', fromCode: 'AMD', toCity: 'New York', toCode: 'JFK', duration: '19h (1 stop)', avgStops: '1 Stop', highlights: 'Easy single-terminal connection transfers.' }
  ]
};

interface RouteExplorerProps {
  onPrefillRoute: (from: string, to: string) => void;
}

export default function RouteExplorer({ onPrefillRoute }: RouteExplorerProps) {
  const [selectedRegion, setSelectedRegion] = useState<'Canada' | 'USA' | 'Australia' | 'India'>('Canada');
  const [customOrigin, setCustomOrigin] = useState<string>('');
  const [customDest, setCustomDest] = useState<string>('');

  // Group all airports from travelData
  const canadaAirports = AIRPORTS.filter(ap => ap.country === 'Canada');
  const usaAirports = AIRPORTS.filter(ap => ap.country === 'USA');
  const ausAirports = AIRPORTS.filter(ap => ap.country === 'Australia');
  const indiaAirports = AIRPORTS.filter(ap => ap.country === 'India');

  const handleAirportClick = (ap: typeof AIRPORTS[0]) => {
    if (ap.country === 'India') {
      setCustomDest(`${ap.city} (${ap.code})`);
    } else {
      setCustomOrigin(`${ap.city} (${ap.code})`);
    }
  };

  const handleApplyCustomRoute = () => {
    if (customOrigin && customDest) {
      onPrefillRoute(customOrigin, customDest);
    }
  };

  return (
    <div id="route-explorer-container" className="w-full bg-grid-glow border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
      {/* Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-blue-500/20 text-blue-400 font-extrabold uppercase px-2.5 py-1 rounded-full border border-blue-500/30 tracking-widest">
              Global Corridor Map
            </span>
            <span className="text-[10px] bg-orange-500/20 text-orange-400 font-extrabold uppercase px-2.5 py-1 rounded-full border border-orange-500/30 tracking-widest">
              All Airports Listed
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Serviceable Terminals & Optimized Corridors
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Select departure and arrival terminals to plan baggage handoffs, secure seat selections, and access secret private pricing pools.
          </p>
        </div>

        {/* Region Toggles */}
        <div className="flex gap-1 border border-slate-800 bg-slate-950 p-1 rounded-xl self-start lg:self-auto shrink-0 shadow-inner">
          {(['Canada', 'USA', 'Australia', 'India'] as const).map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedRegion === reg ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left is airport list, Right is Connection Mapping */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Interactive Airport Terminal List */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mb-3">
              <Globe className="w-4 h-4 text-blue-400" />
              Serviceable Terminals & Hubs (Select to Configure)
            </span>
            
            {/* Bento Grid of Countries */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Canada */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
                <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest border-b border-slate-800/60 pb-1.5 mb-2 flex items-center justify-between">
                  <span>Canada</span>
                  <span className="text-slate-500 font-normal font-mono">[{canadaAirports.length}]</span>
                </p>
                <div className="space-y-1.5">
                  {canadaAirports.map(ap => (
                    <button
                      key={ap.code}
                      onClick={() => handleAirportClick(ap)}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-center justify-between border border-transparent hover:border-slate-700/60"
                    >
                      <div className="truncate pr-1">
                        <p className="font-bold text-slate-200 group-hover:text-white">{ap.city}</p>
                        <p className="text-[9px] text-slate-500 truncate">{ap.name}</p>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-900/40 shrink-0">
                        {ap.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* USA */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
                <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest border-b border-slate-800/60 pb-1.5 mb-2 flex items-center justify-between">
                  <span>USA</span>
                  <span className="text-slate-500 font-normal font-mono">[{usaAirports.length}]</span>
                </p>
                <div className="space-y-1.5">
                  {usaAirports.map(ap => (
                    <button
                      key={ap.code}
                      onClick={() => handleAirportClick(ap)}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-center justify-between border border-transparent hover:border-slate-700/60"
                    >
                      <div className="truncate pr-1">
                        <p className="font-bold text-slate-200 group-hover:text-white">{ap.city}</p>
                        <p className="text-[9px] text-slate-500 truncate">{ap.name}</p>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-900/40 shrink-0">
                        {ap.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Australia */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
                <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest border-b border-slate-800/60 pb-1.5 mb-2 flex items-center justify-between">
                  <span>Australia</span>
                  <span className="text-slate-500 font-normal font-mono">[{ausAirports.length}]</span>
                </p>
                <div className="space-y-1.5">
                  {ausAirports.map(ap => (
                    <button
                      key={ap.code}
                      onClick={() => handleAirportClick(ap)}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-center justify-between border border-transparent hover:border-slate-700/60"
                    >
                      <div className="truncate pr-1">
                        <p className="font-bold text-slate-200 group-hover:text-white">{ap.city}</p>
                        <p className="text-[9px] text-slate-500 truncate">{ap.name}</p>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-900/40 shrink-0">
                        {ap.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* India */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
                <p className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest border-b border-slate-800/60 pb-1.5 mb-2 flex items-center justify-between">
                  <span>India</span>
                  <span className="text-slate-500 font-normal font-mono">[{indiaAirports.length}]</span>
                </p>
                <div className="space-y-1.5">
                  {indiaAirports.map(ap => (
                    <button
                      key={ap.code}
                      onClick={() => handleAirportClick(ap)}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-center justify-between border border-transparent hover:border-slate-700/60"
                    >
                      <div className="truncate pr-1">
                        <p className="font-bold text-slate-200 group-hover:text-white">{ap.city}</p>
                        <p className="text-[9px] text-slate-500 truncate">{ap.name}</p>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-orange-400 bg-orange-950/30 px-1.5 py-0.5 rounded border border-orange-900/40 shrink-0">
                        {ap.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick interactive route form from custom terminal selections */}
          {(customOrigin || customDest) && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Departure Node</span>
                  <p className="text-sm font-semibold text-slate-200">{customOrigin || 'Select Non-India Airport above'}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mt-3" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Arrival Node</span>
                  <p className="text-sm font-semibold text-slate-200">{customDest || 'Select India Airport above'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCustomOrigin('');
                    setCustomDest('');
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Clear Nodes
                </button>
                <button
                  onClick={handleApplyCustomRoute}
                  disabled={!customOrigin || !customDest}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Configure Custom Corridor
                </button>
              </div>
            </div>
          )}

          {/* Popular Corridors for selected departure region */}
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mb-4">
              <Navigation className="w-4 h-4 text-orange-400" />
              Pre-Optimized {selectedRegion} Flight Corridors
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CORRIDORS[selectedRegion].map((conn, idx) => (
                <div 
                  key={idx}
                  className="group border border-slate-800 hover:border-blue-900/60 bg-slate-950/40 hover:bg-slate-950/80 p-5 rounded-2xl transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-bold text-white">{conn.fromCity}</p>
                        <span className="font-mono text-[10px] text-blue-400 font-bold">{conn.fromCode}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-1 transition-transform" />
                      <div>
                        <p className="text-sm font-bold text-white">{conn.toCity}</p>
                        <span className="font-mono text-[10px] text-orange-400 font-bold">{conn.toCode}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onPrefillRoute(`${conn.fromCity} (${conn.fromCode})`, `${conn.toCity} (${conn.toCode})`)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Select
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-900 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{conn.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-orange-400" />
                      <span className="truncate">{conn.avgStops}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Dynamic Visual Air Corridor Node Graphic */}
        <div className="lg:col-span-4 bg-slate-950/60 rounded-3xl p-6 flex flex-col justify-between border border-slate-800/80 min-h-[400px] relative overflow-hidden">
          {/* Glowing Map Dot Ring */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-950 to-slate-950"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Air Corridor Routing</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-mono">Securing Fares</span>
            </span>
          </div>

          {/* Graphical Airpath visual container */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center py-8">
            <div className="w-full flex justify-between items-center max-w-[280px] relative">
              
              {/* Departure Node */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex flex-col items-center justify-center font-bold font-mono text-sm tracking-tight text-white shadow-xl shadow-blue-500/5 hover:border-slate-700 transition-colors">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none mb-0.5">DEP</span>
                  <span className="text-blue-400 leading-none">
                    {customOrigin ? customOrigin.split('(')[1]?.replace(')', '') : selectedRegion === 'India' ? 'DEL' : selectedRegion === 'Canada' ? 'YYZ' : selectedRegion === 'USA' ? 'JFK' : 'SYD'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-300 mt-2 truncate max-w-[80px]">
                  {customOrigin ? customOrigin.split('(')[0].trim() : selectedRegion === 'India' ? 'Delhi' : selectedRegion === 'Canada' ? 'Toronto' : selectedRegion === 'USA' ? 'New York' : 'Sydney'}
                </p>
              </div>

              {/* Connection flight path vector line */}
              <div className="flex-1 px-2 relative flex flex-col items-center">
                <span className="text-[9px] bg-slate-900/90 text-orange-400 font-mono border border-slate-800/80 px-2 py-0.5 rounded-full mb-1">
                  Luggage Ok
                </span>
                <div className="w-full h-0.5 border-t-2 border-dashed border-slate-800 relative">
                  <Plane className="w-4 h-4 text-orange-500 absolute -top-1.5 left-[45%] animate-pulse rotate-45" />
                </div>
                <span className="text-[9px] text-slate-500 font-semibold mt-1">
                  1-Stop Hubs
                </span>
              </div>

              {/* Arrival Node */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex flex-col items-center justify-center font-bold font-mono text-sm tracking-tight text-white shadow-xl shadow-orange-500/5 hover:border-slate-700 transition-colors">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none mb-0.5">ARR</span>
                  <span className="text-orange-400 leading-none">
                    {customDest ? customDest.split('(')[1]?.replace(')', '') : selectedRegion === 'India' ? 'YYZ' : 'DEL'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-300 mt-2 truncate max-w-[80px]">
                  {customDest ? customDest.split('(')[0].trim() : selectedRegion === 'India' ? 'Toronto' : 'Delhi'}
                </p>
              </div>

            </div>
          </div>

          {/* Bottom tips context */}
          <div className="relative z-10 border-t border-slate-900 pt-4 text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
            <Landmark className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <span>
              <strong>Luggage Transfer & Elder Care:</strong> We coordinate with our partner airlines to guarantee that senior citizen care is provided, wheelchair requests are locked, and bags automatically clear transiting customs where applicable.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
