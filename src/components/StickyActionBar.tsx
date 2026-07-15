import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { OFFICE_CONTACTS } from '../data/travelData';

interface StickyActionBarProps {
  onEnquireClick: () => void;
}

export default function StickyActionBar({ onEnquireClick }: StickyActionBarProps) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Hide action bar when virtual keyboard is open on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 550) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isKeyboardOpen) return null;

  return (
    <>
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes wave-hand {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-14deg); }
          75% { transform: rotate(14deg); }
        }
        @keyframes wiggle-badge {
          0%, 100%, 50% { transform: scale(1); }
          10%, 30% { transform: scale(1.08) rotate(-4deg); }
          20%, 40% { transform: scale(1.08) rotate(4deg); }
        }
        @keyframes pulse-banner {
          0%, 100% { transform: scale(1) translateX(-50%); opacity: 0.95; }
          50% { transform: scale(1.05) translateX(-50%); opacity: 1; }
        }
        .animate-float {
          animation: float-gentle 4s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave-hand 1.2s ease-in-out infinite;
          transform-origin: bottom right;
        }
        .animate-wiggle {
          animation: wiggle-badge 2.5s ease-in-out infinite;
        }
        .animate-banner-pulse {
          animation: pulse-banner 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 animate-float font-sans">
        <div className="bg-slate-900/95 border border-slate-700/60 shadow-2xl rounded-2xl p-2.5 flex items-center justify-between gap-2.5 backdrop-blur-md">
          
          {/* Left Side: WhatsApp Bubble */}
          <div className="flex flex-col items-center flex-shrink-0 relative">
            <a
              href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20am%20interested%20in%20requesting%20a%20personalized%20flight%20quote%20to%20India.`}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg relative animate-wiggle active:scale-90 transition-transform"
              title="WhatsApp US"
            >
              <MessageSquare className="w-5.5 h-5.5 text-white fill-white/10" />
              
              {/* Red Badge "1" */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-slate-900 text-[10px] font-black text-white rounded-full flex items-center justify-center shadow-md">
                1
              </span>
            </a>
            {/* White Capsule below */}
            <span className="mt-1 bg-white border border-slate-300 text-[9px] font-black text-slate-900 px-1.5 py-0.5 rounded-full shadow-xs leading-none uppercase">
              US/CA
            </span>
          </div>

          {/* Middle: CALL NOW Pill Button */}
          <a
            href={`tel:${OFFICE_CONTACTS.tollFree}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full py-2 px-3.5 flex items-center justify-between shadow-lg active:scale-95 transition-all overflow-hidden relative border border-blue-500/30"
          >
            {/* Left: circular phone container */}
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
              <Phone className="w-3.5 h-3.5 text-white fill-white/15 animate-pulse" />
            </div>
            
            {/* Center Text */}
            <div className="flex-1 text-left min-w-0">
              <span className="block text-[8px] uppercase tracking-widest font-black text-blue-200 leading-none">
                INSTANT BOOKING
              </span>
              <span className="block text-[11px] font-black text-white truncate leading-tight">
                Call: {OFFICE_CONTACTS.tollFree}
              </span>
            </div>

            {/* Right: Waving Hand */}
            <span className="text-lg ml-1 select-none animate-wave flex-shrink-0">
              👋
            </span>
          </a>

          {/* Right Side: Chat / Enquiry Agent Bubble */}
          <div className="flex flex-col items-center flex-shrink-0 relative">
            {/* Speech bubble badge text "We Are Here!" */}
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md animate-banner-pulse whitespace-nowrap border border-emerald-400">
              We Are Here!
              {/* Arrow pointer */}
              <span className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rotate-45 border-r border-b border-emerald-400"></span>
            </span>

            <button
              onClick={onEnquireClick}
              className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-400 active:scale-90 transition-transform relative"
              title="Agent Enquiry"
            >
              {/* Agent avatar icon */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="9" cy="10" r="1" fill="currentColor"/>
                <circle cx="15" cy="10" r="1" fill="currentColor"/>
                <path d="M8 14c1.5 2 4.5 2 6 0" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="mt-1 bg-slate-800 text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none border border-slate-700/50">
              Agent
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
