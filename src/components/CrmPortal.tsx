import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Phone, MessageSquare, Mail, Key, RefreshCw, 
  CheckCircle, Clock, Calendar, Users, Globe, Briefcase, 
  UserCheck, AlertTriangle, GraduationCap, HeartHandshake, Eye,
  ClipboardList, CheckCircle2, ChevronRight, Filter, LogOut
} from 'lucide-react';

type CrmTab = 
  | 'all' 
  | 'canada' 
  | 'usa' 
  | 'australia' 
  | 'business' 
  | 'lastminute' 
  | 'group' 
  | 'student' 
  | 'senior' 
  | 'callbacks' 
  | 'alerts';

export default function CrmPortal() {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<CrmTab>('all');
  
  // Data lists
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Read saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('fdi_crm_code');
    if (savedCode === '1234') {
      setIsAuthorized(true);
      fetchLeads('1234');
    }
  }, []);

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === '1234') {
      setIsAuthorized(true);
      localStorage.setItem('fdi_crm_code', '1234');
      setErrorMsg('');
      fetchLeads('1234');
    } else {
      setErrorMsg('Invalid access code. Please use 1234.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('fdi_crm_code');
    setAccessCode('');
  };

  const fetchLeads = async (codeToUse: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/leads?code=${codeToUse}`);
      const data = await response.json();
      if (data.success) {
        setEnquiries(data.leads || []);
        setCallbacks(data.callbacks || []);
        setAlerts(data.fareAlerts || []);
      } else {
        setErrorMsg(data.error || 'Failed to authenticate.');
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error('CRM load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (type: 'enquiry' | 'callback', id: string, newStatus: string) => {
    const code = localStorage.getItem('fdi_crm_code') || '';
    try {
      const response = await fetch('/api/admin/leads/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type, id, status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setActionSuccess(`Updated reference ${id} to ${newStatus}`);
        setTimeout(() => setActionSuccess(''), 3000);
        fetchLeads(code);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Structured Actions Helper
  const getCallHref = (phone: string) => {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  };

  const getWhatsAppHref = (lead: any, type: 'enquiry' | 'callback') => {
    const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
    let msg = '';
    if (type === 'enquiry') {
      msg = `Hi ${lead.name},\n\nGreetings from Flyhigh! Regarding your specialized flight enquiry (Ref: ${lead.leadId}) from ${lead.origin} to ${lead.destination} on ${lead.departDate}.\n\nWe have prepared our private consolidator flight rates with unpublished airline deals for your review.\n\nAre you free for a quick call or chat to finalize your booking?`;
    } else {
      msg = `Hi ${lead.name},\n\nregarding your requested specialist callback (Ref: ${lead.callbackId}) scheduled on ${lead.date} at ${lead.timeSlot}. Let me know when you are ready to connect!`;
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const getEmailHref = (lead: any) => {
    const subject = `Flight Quotation Options: ${lead.origin} to ${lead.destination} (Ref: ${lead.leadId})`;
    const body = `Dear ${lead.name},\n\nThank you for reaching out to Flyhigh!\n\nOur specialists have received your inquiry for travel from ${lead.origin} to ${lead.destination} departing on ${lead.departDate}.\n\nWe are currently querying our private GDS databases for offline airline discounts. We will follow up shortly with a customized quote.\n\nBest regards,\nFlyhigh Support Team`;
    return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Filter lists based on selected CRM category tab
  const getFilteredEnquiries = () => {
    if (activeTab === 'all') return enquiries;
    if (activeTab === 'canada') return enquiries.filter(l => l.source === 'route-ca-in' || l.source === 'route-in-ca');
    if (activeTab === 'usa') return enquiries.filter(l => l.source === 'route-us-in' || l.source === 'route-in-us');
    if (activeTab === 'australia') return enquiries.filter(l => l.source === 'route-au-in' || l.source === 'route-in-au');
    if (activeTab === 'business') return enquiries.filter(l => l.source === 'service-business');
    if (activeTab === 'lastminute') return enquiries.filter(l => l.source === 'service-lastminute');
    if (activeTab === 'group') return enquiries.filter(l => l.source === 'service-group');
    if (activeTab === 'student') return enquiries.filter(l => l.source === 'service-student');
    if (activeTab === 'senior') return enquiries.filter(l => l.source === 'service-senior');
    return [];
  };

  // Counting helpers
  const countCanada = enquiries.filter(l => l.source === 'route-ca-in' || l.source === 'route-in-ca').length;
  const countUsa = enquiries.filter(l => l.source === 'route-us-in' || l.source === 'route-in-us').length;
  const countAustralia = enquiries.filter(l => l.source === 'route-au-in' || l.source === 'route-in-au').length;
  const countBusiness = enquiries.filter(l => l.source === 'service-business').length;
  const countLastminute = enquiries.filter(l => l.source === 'service-lastminute').length;
  const countGroup = enquiries.filter(l => l.source === 'service-group').length;
  const countStudent = enquiries.filter(l => l.source === 'service-student').length;
  const countSenior = enquiries.filter(l => l.source === 'service-senior').length;

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white border border-slate-200 shadow-xl rounded-3xl p-8 text-center font-sans">
        <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5 border border-indigo-100">
          <Key className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 font-display">Administrative Access Required</h1>
        <p className="text-xs text-slate-500 mt-2 mb-6">Please enter the secure CRM portal key to access live client entries and dispatch deals.</p>
        
        <form onSubmit={handleAuthorize} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter Administrative Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-800 transition-colors"
            />
          </div>
          {errorMsg && <p className="text-red-600 text-xs font-semibold">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/10 transition-all active:scale-[0.98] cursor-pointer"
          >
            Authenticate Portal
          </button>
        </form>
        
        <div className="mt-8 border-t border-slate-100 pt-4 text-[10px] text-slate-400">
          Flyhigh • Secure Admin CRM Module (Use code 1234)
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* CRM Header Dashboard */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-display">
              <ShieldCheck className="w-6 h-6 text-indigo-600" /> Admin Lead CRM Portal
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Categorized travel routing engines, private ethnic discounts, and client dispatch logs.</p>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => fetchLeads(localStorage.getItem('fdi_crm_code') || '')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} /> Force Database Sync
          </button>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Exit CRM
          </button>
        </div>
      </div>

      {/* CRM Category Filter Tabs (Enquiry forms are separated into specific CRM lists!) */}
      <div className="mb-6">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-2.5">
          <Filter className="w-3 h-3 text-slate-400" /> Categorized Lead Channels
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2 border-b border-slate-200 pb-5">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'all' ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold">All ({enquiries.length})</div>
            <div className={`text-[9px] ${activeTab === 'all' ? 'text-indigo-200' : 'text-slate-400'}`}>Leads Pool</div>
          </button>

          <button
            onClick={() => setActiveTab('canada')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'canada' ? 'bg-red-600 border-red-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">🍁 Canada ({countCanada})</div>
            <div className={`text-[9px] ${activeTab === 'canada' ? 'text-red-200' : 'text-slate-400'}`}>Corridors</div>
          </button>

          <button
            onClick={() => setActiveTab('usa')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'usa' ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">🗽 USA ({countUsa})</div>
            <div className={`text-[9px] ${activeTab === 'usa' ? 'text-blue-200' : 'text-slate-400'}`}>Corridors</div>
          </button>

          <button
            onClick={() => setActiveTab('australia')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'australia' ? 'bg-teal-600 border-teal-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">🦘 Aus ({countAustralia})</div>
            <div className={`text-[9px] ${activeTab === 'australia' ? 'text-teal-200' : 'text-slate-400'}`}>Corridors</div>
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'business' ? 'bg-indigo-900 border-indigo-900 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">💼 Business ({countBusiness})</div>
            <div className={`text-[9px] ${activeTab === 'business' ? 'text-indigo-200' : 'text-slate-400'}`}>Cabin Deals</div>
          </button>

          <button
            onClick={() => setActiveTab('lastminute')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'lastminute' ? 'bg-amber-600 border-amber-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">⏳ Urgent ({countLastminute})</div>
            <div className={`text-[9px] ${activeTab === 'lastminute' ? 'text-amber-200' : 'text-slate-400'}`}>24/48 Hours</div>
          </button>

          <button
            onClick={() => setActiveTab('group')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'group' ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">👨‍👩‍👦 Group ({countGroup})</div>
            <div className={`text-[9px] ${activeTab === 'group' ? 'text-emerald-200' : 'text-slate-400'}`}>Multi-Pax</div>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'student' ? 'bg-violet-600 border-violet-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">🎓 Student ({countStudent})</div>
            <div className={`text-[9px] ${activeTab === 'student' ? 'text-violet-200' : 'text-slate-400'}`}>Luggage Flex</div>
          </button>

          <button
            onClick={() => setActiveTab('senior')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'senior' ? 'bg-pink-600 border-pink-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">👴 Seniors ({countSenior})</div>
            <div className={`text-[9px] ${activeTab === 'senior' ? 'text-pink-200' : 'text-slate-400'}`}>Assist Active</div>
          </button>

          <button
            onClick={() => setActiveTab('callbacks')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'callbacks' ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">📞 Callback ({callbacks.length})</div>
            <div className={`text-[9px] ${activeTab === 'callbacks' ? 'text-cyan-100' : 'text-slate-400'}`}>Scheduled</div>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${activeTab === 'alerts' ? 'bg-rose-600 border-rose-600 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className="text-xs uppercase font-extrabold flex items-center justify-center gap-1">🔔 Alerts ({alerts.length})</div>
            <div className={`text-[9px] ${activeTab === 'alerts' ? 'text-rose-100' : 'text-slate-400'}`}>Subscribed</div>
          </button>
        </div>
      </div>

      {/* Action status message popup banner */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {actionSuccess}
        </div>
      )}

      {/* CRM Main Leads Render Frame */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" /> Analyzing flight database queries and Ethnic rates...
        </div>
      ) : (
        <div>
          {activeTab !== 'callbacks' && activeTab !== 'alerts' && (
            <div className="space-y-4">
              {getFilteredEnquiries().length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
                  <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">No client enquiries found in this folder list.</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Once a user submits an enquiry from the corresponding corridor page or specialty widget, it will instantly generate a live CRM record in this folder.
                  </p>
                </div>
              ) : (
                getFilteredEnquiries().map((lead) => {
                  const isSpecial = ['service-business', 'service-lastminute', 'service-group', 'service-student', 'service-senior'].includes(lead.source);
                  const isCanada = lead.source === 'route-ca-in' || lead.source === 'route-in-ca';
                  const isUsa = lead.source === 'route-us-in' || lead.source === 'route-in-us';
                  const isAustralia = lead.source === 'route-au-in' || lead.source === 'route-in-au';
                  
                  return (
                    <div key={lead.leadId} className="bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
                      
                      {/* Meta Header */}
                      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3.5 mb-4 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
                            {lead.leadId}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Recorded: {new Date(lead.createdAt).toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                          {/* Categorized Source Badge */}
                          {lead.source === 'service-business' && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-bold">
                              💼 Premium Business Cabin
                            </span>
                          )}
                          {lead.source === 'service-lastminute' && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full font-bold">
                              ⏳ Urgent (24-48h Departure)
                            </span>
                          )}
                          {lead.source === 'service-group' && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">
                              👨‍👩‍👧‍👦 Family & Group Booking
                            </span>
                          )}
                          {lead.source === 'service-student' && (
                            <span className="text-[10px] bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-full font-bold">
                              🎓 Student Luggage Flex
                            </span>
                          )}
                          {lead.source === 'service-senior' && (
                            <span className="text-[10px] bg-pink-50 text-pink-700 border border-pink-100 px-2.5 py-1 rounded-full font-bold">
                              👴 Seniors Special Care
                            </span>
                          )}
                          
                          {/* Corridor Specific Labels */}
                          {isCanada && (
                            <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full font-bold">
                              🍁 Canada Corridor Entry
                            </span>
                          )}
                          {isUsa && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full font-bold">
                              🗽 USA Corridor Entry
                            </span>
                          )}
                          {isAustralia && (
                            <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full font-bold">
                              🦘 Australia Corridor Entry
                            </span>
                          )}
                          
                          {/* General Fallback Label */}
                          {!isSpecial && !isCanada && !isUsa && !isAustralia && (
                            <span className="text-[10px] bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-full font-bold">
                              ✈ General Route Form
                            </span>
                          )}

                          {/* Status Select Action dropdown */}
                          <select
                            value={lead.status || 'new'}
                            onChange={(e) => updateStatus('enquiry', lead.leadId, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-1 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="new">🆕 New</option>
                            <option value="contacted">☎ Contacted</option>
                            <option value="sent-quotes">✉ Quotes Sent</option>
                            <option value="booked">🎉 Booked</option>
                            <option value="closed">❌ Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Main Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600">
                        {/* Traveler Coordinate Card */}
                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-indigo-500" /> Traveler Info
                          </h4>
                          <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                          <p className="text-slate-500 mt-1">{lead.email}</p>
                          <p className="text-slate-900 font-bold mt-1.5 font-mono">{lead.phone}</p>
                          <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-semibold mt-2.5 px-2 py-0.5 rounded-md">
                            Prefers: {lead.preferredContact || 'WhatsApp'}
                          </span>
                        </div>

                        {/* Route & Cabin specs card */}
                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-blue-500" /> Travel Details
                          </h4>
                          <p className="font-extrabold text-indigo-600 text-sm flex items-center gap-1">
                            {lead.origin} ➔ {lead.destination}
                          </p>
                          <p className="text-slate-700 mt-1 font-semibold">{lead.tripType || 'One Way'}</p>
                          <p className="text-slate-500 mt-0.5">{lead.cabin || 'Economy'} Class</p>
                          <p className="text-slate-400 mt-1">Dates Flexibility: <strong className="text-slate-600">{lead.flexibleDates || 'Exact Dates'}</strong></p>
                        </div>

                        {/* Calendar & Pax details */}
                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-orange-500" /> Flight Dates
                          </h4>
                          <p className="text-slate-800 mt-1 font-bold flex items-center gap-1.5">
                            🛫 Depart: {lead.departDate}
                          </p>
                          {lead.returnDate && (
                            <p className="text-slate-800 mt-1 font-bold flex items-center gap-1.5">
                              🛬 Return: {lead.returnDate}
                            </p>
                          )}
                          <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-slate-500 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> 
                            <span>Adults: <strong>{lead.travellers?.adults || 1}</strong>, Kids: <strong>{lead.travellers?.children || 0}</strong></span>
                          </div>
                        </div>

                        {/* Notes and Live Template dispatch coordinates */}
                        <div className="flex flex-col justify-between">
                          <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100/60">
                            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                              Message Notes
                            </h4>
                            <p className="text-[11px] text-slate-600 italic line-clamp-3">
                              "{lead.message || 'No specific requests detailed.'}"
                            </p>
                          </div>

                          {/* Interactive Call Email or WhatsApp action links prepared with details they entered in form */}
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <a
                              href={getCallHref(lead.phone)}
                              className="py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-center text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                              title="Direct Voice Call"
                            >
                              <Phone className="w-3.5 h-3.5" /> Call
                            </a>
                            
                            <a
                              href={getWhatsAppHref(lead, 'enquiry')}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-center text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                              title="Send formatted WhatsApp template summarizing flight"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                            </a>

                            <a
                              href={getEmailHref(lead)}
                              className="py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-center text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                              title="Send formatted Ethnic fare summary email"
                            >
                              <Mail className="w-3.5 h-3.5" /> Email
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Specialized Context Data */}
                      {lead.specialtyData && (
                        <div className="mt-4 pt-3.5 border-t border-slate-100 bg-slate-50/50 rounded-2xl p-3.5 border border-slate-100">
                          <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Private Airline Criteria Check
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
                            {lead.source === 'service-business' && (
                              <>
                                <div>
                                  <span className="text-slate-400">Carrier Preference:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.preferredAirline || 'No Airline Specifics'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Lounge Access Code:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.loungeAccess ? 'Required ✓' : 'Not Requested'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Cabin Preference:</span>{' '}
                                  <strong className="text-indigo-600">{lead.specialtyData.cabinPreference || 'Business Seat'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Chauffeur Service:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.limoService ? 'Requested ✓' : 'Not Requested'}</strong>
                                </div>
                              </>
                            )}

                            {lead.source === 'service-lastminute' && (
                              <>
                                <div>
                                  <span className="text-slate-400">Urgency Timeline:</span>{' '}
                                  <strong className="text-amber-600 font-extrabold">{lead.specialtyData.urgency || 'Departure within 24 Hrs'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Transit Layover Stops:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.maxStops || 'Any routing'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Transit Visa:</span>{' '}
                                  <strong className="text-indigo-600 font-bold">{lead.specialtyData.hasTransitVisa || 'Yes'}</strong>
                                </div>
                              </>
                            )}

                            {lead.source === 'service-group' && (
                              <>
                                <div>
                                  <span className="text-slate-400">Estimated PAX Size:</span>{' '}
                                  <strong className="text-emerald-600 font-extrabold">{lead.specialtyData.groupSize || '10+'} Passengers</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Group Trip Event:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.eventType || 'Family Vacation'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Names Status:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.namesFinalized ? 'Names finalized ✓' : 'Tentative Booking'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Group Coordinator:</span>{' '}
                                  <strong className="text-indigo-600 font-bold">{lead.specialtyData.groupLeader || 'Lead Agent'}</strong>
                                </div>
                              </>
                            )}

                            {lead.source === 'service-student' && (
                              <>
                                <div>
                                  <span className="text-slate-400">University/College:</span>{' '}
                                  <strong className="text-indigo-600 font-bold">{lead.specialtyData.universityName || 'Not Disclosed'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Double Luggage Flex:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.extraBaggage || '2-Bags Checked'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Semester Flexibility:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.flexibleReturn || 'Yes'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Admission Checked:</span>{' '}
                                  <strong className="text-emerald-600">{lead.specialtyData.studentIdCheck ? 'Verified ✓' : 'Pending'}</strong>
                                </div>
                              </>
                            )}

                            {lead.source === 'service-senior' && (
                              <>
                                <div>
                                  <span className="text-slate-400">Wheelchair Assistance:</span>{' '}
                                  <strong className="text-pink-600 font-extrabold">{lead.specialtyData.wheelchairLevel || 'Full Assistance'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Escort Companion:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.companionTraveling ? 'Accompanied ✓' : 'Traveling Solo'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Medical Layover:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.medicalSupport ? 'Required ✓' : 'No'}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Special Dietary Code:</span>{' '}
                                  <strong className="text-slate-800">{lead.specialtyData.dietaryPreference || 'HNML Requested'}</strong>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* CALLBACKS RENDERING */}
          {activeTab === 'callbacks' && (
            <div className="space-y-4">
              {callbacks.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">No callbacks requested currently.</p>
                </div>
              ) : (
                callbacks.map((cb) => (
                  <div key={cb.callbackId} className="bg-white border border-slate-200 hover:border-cyan-400 rounded-3xl p-5 shadow-sm transition-all">
                    <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 mb-3 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-lg">
                          {cb.callbackId}
                        </span>
                        <span className="text-slate-400">Received: {new Date(cb.createdAt).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={cb.status || 'scheduled'}
                          onChange={(e) => updateStatus('callback', cb.callbackId, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-2.5 py-1 text-slate-800 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="scheduled">⏰ Scheduled</option>
                          <option value="contacted">☎ Contacted</option>
                          <option value="no-answer">⚠️ No Answer</option>
                          <option value="completed">🎉 Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs items-center">
                      <div>
                        <p className="font-bold text-slate-900 text-base">{cb.name}</p>
                        <p className="text-indigo-600 font-bold font-mono mt-1 text-sm">{cb.phone}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-slate-800 font-bold flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-orange-500" /> {cb.date}
                        </p>
                        <p className="text-slate-500 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Slot: <strong>{cb.timeSlot}</strong> ({cb.timezone || 'EST'})
                        </p>
                        <p className="text-slate-400">Preferred Dialect: {cb.language || 'English'}</p>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <a
                          href={getCallHref(cb.phone)}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Now
                        </a>
                        <a
                          href={getWhatsAppHref(cb, 'callback')}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ACTIVE ALERTS SUBS RENDERING */}
          {activeTab === 'alerts' && (
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
                  <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">No active promotional subscription alerts.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.alertId} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs shadow-sm">
                    <div>
                      <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg mr-2 font-extrabold">
                        {alert.alertId}
                      </span>
                      <span className="font-black text-slate-800 text-sm">{alert.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded text-indigo-700 font-bold uppercase">
                        {alert.origin} ➔ {alert.destination}
                      </span>
                      <span className="text-slate-500">Depart Month: <strong>{alert.travelMonth}</strong> ({alert.currency})</span>
                    </div>

                    <a
                      href={`mailto:${alert.email}?subject=Exclusive Fare Update: ${alert.origin} to ${alert.destination}&body=Dear Valued Client,\n\nWe have unlocked unpublished promotional airline fares for your routes during ${alert.travelMonth}!\n\nPlease contact our specialists at +1-800-413-3932 or WhatsApp us back to block these offline tickets.`}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-[11px] uppercase font-bold tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Send Offer Email
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
