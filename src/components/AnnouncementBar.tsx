import React, { useState } from 'react';
import { Megaphone, X, Phone } from 'lucide-react';
import { OFFICE_CONTACTS } from '../data/travelData';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-orange-600 text-white text-xs sm:text-sm py-2 px-4 flex justify-between items-center z-40 relative font-sans">
      <div className="flex-1 flex justify-center items-center gap-2 flex-wrap text-center">
        <span className="bg-orange-800 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
          <Megaphone className="w-3 h-3" /> Exclusive
        </span>
        <span className="font-medium">
          Phone-Exclusive Flight Deals Available! Save up to 30% with unpublished airline inventory.
        </span>
        <a 
          href={`tel:${OFFICE_CONTACTS.tollFree}`} 
          className="underline font-mono font-bold hover:text-slate-100 flex items-center gap-1 ml-1"
        >
          <Phone className="w-3.5 h-3.5 inline" /> {OFFICE_CONTACTS.tollFree}
        </a>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-orange-700 rounded-md transition-colors text-white/80 hover:text-white"
        aria-label="Dismiss Promotion Bar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
