import React, { useState } from 'react';
import { Menu, X, MessageSquare, ChevronDown, Award, Shield, User, Landmark, HelpCircle, FileText, Send, Clock, Briefcase, Users, GraduationCap, HeartHandshake, Home, Tag, Globe, Plane, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICE_CONTACTS } from '../data/travelData';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileRoutesOpen, setMobileRoutesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const handleLinkClick = (view: string, data?: any) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    onNavigate(view, data);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 text-slate-800 shadow-md border-b border-slate-200 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-20 sm:h-24 items-center gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => handleLinkClick('home')}>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2 font-display relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <Plane className="w-7 h-7 text-indigo-600 group-hover:text-orange-500 transition-colors" />
              </motion.div>
              Fly<span className="text-orange-600 font-extrabold relative">high</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center space-x-3 xl:space-x-5 font-sans font-semibold text-sm">
            <button 
              onClick={() => handleLinkClick('home')}
              className="relative px-3.5 py-2.5 rounded-lg transition-all text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer group"
            >
              <span>Home</span>
              {currentView === 'home' ? (
                <motion.div 
                  layoutId="activeUnderline" 
                  className="absolute bottom-1 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600/50 group-hover:w-2/3 transition-all duration-200" />
              )}
            </button>

            {/* Routes Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('routes')}
                onMouseEnter={() => setActiveDropdown('routes')}
                className="relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <span>Corridors</span> 
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                {currentView.startsWith('route-') ? (
                  <motion.div 
                    layoutId="activeUnderline" 
                    className="absolute bottom-1 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" 
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600/50 group-hover:w-2/3 transition-all duration-200" />
                )}
              </button>
              {activeDropdown === 'routes' && (
                <div 
                  className="absolute left-0 mt-1 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button onClick={() => handleLinkClick('route-ca-in')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-semibold transition-colors">
                    <Globe className="w-4 h-4 text-indigo-500" /> Canada to India Flights
                  </button>
                  <button onClick={() => handleLinkClick('route-in-ca')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-semibold transition-colors">
                    <Globe className="w-4 h-4 text-indigo-500" /> India to Canada Flights
                  </button>
                  <button onClick={() => handleLinkClick('route-us-in')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-semibold transition-colors">
                    <Globe className="w-4 h-4 text-indigo-500" /> USA to India Flights
                  </button>
                  <button onClick={() => handleLinkClick('route-in-us')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-semibold transition-colors">
                    <Globe className="w-4 h-4 text-indigo-500" /> India to USA Flights
                  </button>
                  <button onClick={() => handleLinkClick('route-au-in')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-semibold transition-colors">
                    <Globe className="w-4 h-4 text-indigo-500" /> Australia to India Flights
                  </button>
                  <button onClick={() => handleLinkClick('route-in-au')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-semibold transition-colors">
                    <Globe className="w-4 h-4 text-indigo-500" /> India to Australia Flights
                  </button>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('services')}
                onMouseEnter={() => setActiveDropdown('services')}
                className="relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <span>Specialty Travel</span> 
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                {currentView.startsWith('service-') ? (
                  <motion.div 
                    layoutId="activeUnderline" 
                    className="absolute bottom-1 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" 
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600/50 group-hover:w-2/3 transition-all duration-200" />
                )}
              </button>
              {activeDropdown === 'services' && (
                <div 
                  className="absolute left-0 mt-1 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button onClick={() => handleLinkClick('service-business')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-semibold transition-colors">
                    <Briefcase className="w-4 h-4 text-indigo-500" /> Business-Class Deals
                  </button>
                  <button onClick={() => handleLinkClick('service-lastminute')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-orange-600 flex items-center gap-2 font-semibold transition-colors">
                    <Clock className="w-4 h-4 text-orange-500" /> Last-Minute Bookings
                  </button>
                  <button onClick={() => handleLinkClick('service-group')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 font-medium transition-colors">
                    <Users className="w-4 h-4 text-emerald-500" /> Family & Group Bookings
                  </button>
                  <button onClick={() => handleLinkClick('service-student')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-medium transition-colors">
                    <GraduationCap className="w-4 h-4 text-indigo-500" /> Student Travel Specials
                  </button>
                  <button onClick={() => handleLinkClick('service-senior')} className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-2 font-medium transition-colors">
                    <HeartHandshake className="w-4 h-4 text-rose-500" /> Senior Citizen Assistance
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => handleLinkClick('deals')}
              className="relative px-3.5 py-2.5 rounded-lg transition-all text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer group font-semibold"
            >
              <span>All Deals</span>
              {currentView === 'deals' ? (
                <motion.div 
                  layoutId="activeUnderline" 
                  className="absolute bottom-1 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600/50 group-hover:w-2/3 transition-all duration-200" />
              )}
            </button>

            <button 
              onClick={() => handleLinkClick('blog')}
              className="relative px-3.5 py-2.5 rounded-lg transition-all text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer group font-semibold"
            >
              <span>Travel Blog</span>
              {currentView === 'blog' ? (
                <motion.div 
                  layoutId="activeUnderline" 
                  className="absolute bottom-1 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600/50 group-hover:w-2/3 transition-all duration-200" />
              )}
            </button>

            <button 
              onClick={() => handleLinkClick('about')}
              className="relative px-3.5 py-2.5 rounded-lg transition-all text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer group font-semibold"
            >
              <span>About</span>
              {currentView === 'about' ? (
                <motion.div 
                  layoutId="activeUnderline" 
                  className="absolute bottom-1 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600/50 group-hover:w-2/3 transition-all duration-200" />
              )}
            </button>

            <button 
              onClick={() => handleLinkClick('contact')}
              className="relative px-3.5 py-2.5 rounded-lg transition-all text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer group font-semibold"
            >
              <span>Contact</span>
              {currentView === 'contact' ? (
                <motion.div 
                  layoutId="activeUnderline" 
                  className="absolute bottom-1 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600/50 group-hover:w-2/3 transition-all duration-200" />
              )}
            </button>
          </div>

          {/* Desktop Call-to-Actions (WhatsApp + Admin Portal CRM + Saffron Get Quote) */}
          <div className="hidden xl:flex items-center space-x-4">
            {/* WhatsApp Link instead of call link */}
            <a 
              href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20am%20visiting%20your%20website%20and%20looking%20for%20special%20unlisted%20consolidator%20flight%20quotes%20to%20India.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-150 bg-emerald-50/40 px-3.5 py-1.5 rounded-xl hover:bg-emerald-50/70"
            >
              <div className="bg-emerald-500 p-2 rounded-lg text-white">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight">
                <p className="text-[9px] text-slate-400 font-sans uppercase tracking-wider font-bold">WhatsApp Support</p>
                <p className="font-mono text-[11px] font-extrabold text-slate-800">Quick Connect</p>
              </div>
            </a>

            {/* Professional Standalone CRM access link */}
            <button 
              onClick={() => handleLinkClick('admin-crm')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5 cursor-pointer transition-all ${currentView === 'admin-crm' ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'}`}
            >
              🔐 CRM Portal
            </button>

            <button 
              onClick={() => handleLinkClick('quote-form')}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all hover:shadow-md hover:shadow-orange-600/10 cursor-pointer text-center"
              id="nav-get-quote-btn"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button (NO Call/Phone button inside Mobile Header!) */}
          <div className="flex xl:hidden items-center space-x-2">
            {/* WhatsApp option for mobile view */}
            <a 
              href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20want%20to%20request%20a%20private%20flight%20quote%20to%20India.`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100"
              aria-label="Chat on WhatsApp Support"
            >
              <MessageSquare className="w-5 h-5" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle Navigation Drawer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (No call buttons in phone drawer!) */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 max-h-[85vh] overflow-y-auto">
          <div className="px-4 pt-4 pb-6 space-y-2.5">
            
            {/* Simple buttons for core pages */}
            <button onClick={() => handleLinkClick('home')} className="w-full text-left py-2.5 px-3 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-500" /> Home
            </button>
            <button onClick={() => handleLinkClick('deals')} className="w-full text-left py-2.5 px-3 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" /> All Flight Deals
            </button>
            
            {/* Admin CRM direct link inside mobile drawer */}
            <button onClick={() => handleLinkClick('admin-crm')} className="w-full text-left py-2.5 px-3 rounded-xl bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 text-sm font-bold flex items-center gap-2 border border-indigo-100">
              <ShieldAlert className="w-4 h-4 text-indigo-500" /> Administrative CRM Control
            </button>

            {/* Corridors List (Dropdown/Accordion) */}
            <div className="border-t border-slate-100 pt-3">
              <button 
                onClick={() => setMobileRoutesOpen(!mobileRoutesOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 hover:text-slate-700 cursor-pointer"
              >
                <span>Routes & Corridors</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${mobileRoutesOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {mobileRoutesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-1 pl-2 pb-2">
                      <button onClick={() => handleLinkClick('route-ca-in')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> Canada to India Flights
                      </button>
                      <button onClick={() => handleLinkClick('route-in-ca')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> India to Canada Flights
                      </button>
                      <button onClick={() => handleLinkClick('route-us-in')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> USA to India Flights
                      </button>
                      <button onClick={() => handleLinkClick('route-in-us')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> India to USA Flights
                      </button>
                      <button onClick={() => handleLinkClick('route-au-in')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> Australia to India Flights
                      </button>
                      <button onClick={() => handleLinkClick('route-in-au')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> India to Australia Flights
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services List (Dropdown/Accordion) */}
            <div className="border-t border-slate-100 pt-3">
              <button 
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 hover:text-slate-700 cursor-pointer"
              >
                <span>Specialty Travel Services</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {mobileServicesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-1 pl-2 pb-2">
                      <button onClick={() => handleLinkClick('service-business')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Business-Class Deals
                      </button>
                      <button onClick={() => handleLinkClick('service-lastminute')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-orange-500" /> Last-Minute Options
                      </button>
                      <button onClick={() => handleLinkClick('service-group')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-500" /> Family & Group Booking
                      </button>
                      <button onClick={() => handleLinkClick('service-student')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Student Fare specials
                      </button>
                      <button onClick={() => handleLinkClick('service-senior')} className="text-left py-2 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                        <HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> Senior Travel Assistance
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1 bg-slate-50/40 rounded-xl p-2.5">
              <button onClick={() => handleLinkClick('blog')} className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Travel Blog
              </button>
              <button onClick={() => handleLinkClick('about')} className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-2">
                <Landmark className="w-4 h-4 text-orange-500" /> About Us
              </button>
              <button onClick={() => handleLinkClick('contact')} className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" /> Contact Us
              </button>
            </div>

            {/* WhatsApp Link inside Mobile Header - REMOVED PHONE/CALL ENTIRELY */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <a 
                href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20am%20chatting%20from%20your%20website%20and%20want%20to%20get%20unlisted%20consolidator%20rates.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-sm transition-colors shadow-sm"
              >
                <MessageSquare className="w-4.5 h-4.5" /> Chat on WhatsApp
              </a>
              <button 
                onClick={() => handleLinkClick('quote-form')}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-bold text-sm text-center transition-colors shadow-sm"
              >
                Request Custom Fare Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
