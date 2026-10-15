import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Headphones, 
  Cpu, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface TechnicalSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalSupportModal: React.FC<TechnicalSupportModalProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('User Permissions & Access');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Critical'>('Normal');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const ticketId = `IT-${Date.now().toString().slice(-6)}`;
    setSubmittedTicket(ticketId);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
        {/* Luxury Brand Header */}
        <div className="bg-[#FAF8F5] border-b border-[#E8E2D8] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-[#8B6F4E] font-bold text-sm uppercase">
                THE DESIGN ADDRESS
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-arabic text-xs text-slate-500">عنوان الإبداع للتصميم</span>
            </div>
            <div className="text-[11px] text-[#A3835E] font-medium tracking-wide">
              by Rana Al Kassim
            </div>
            <div className="text-[10px] tracking-widest uppercase text-slate-400 pt-1 font-semibold">
              DESIGNING BEYOND POSSIBILITIES
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* IT Specialist Business Card Representation */}
          <div className="bg-white border-2 border-[#E8E2D8] rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-48 h-48 -mr-12 -mb-12">
              {/* Fan / Sunburst Motif SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#8B6F4E]">
                <circle cx="50" cy="50" r="40" />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              {/* Left col: Name & Title */}
              <div className="border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F4E] mb-1">
                    Technical Support & Systems Administration
                  </div>
                  <h3 className="text-xl font-serif font-extrabold text-slate-900 tracking-tight">
                    SYED ALI
                  </h3>
                  <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
                    IT SPECIALIST
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#8B6F4E] shrink-0" />
                    <span className="font-medium text-slate-800">The Design Address L.L.C</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8B6F4E] shrink-0 mt-0.5" />
                    <span>Umm Suqeim Service Road, Al Barsha 2, Dubai, U.A.E., P.O. Box: 57369</span>
                  </div>
                </div>
              </div>

              {/* Right col: Direct Contact Links */}
              <div className="space-y-3 flex flex-col justify-center">
                <a
                  href="tel:+971502484339"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#8B6F4E]/10 group-hover:bg-[#8B6F4E] text-[#8B6F4E] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Direct Mobile</span>
                    <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-[#8B6F4E]">
                      +971 50 248 4339
                    </span>
                  </div>
                </a>

                <a
                  href="tel:+97143966200"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#8B6F4E]/10 group-hover:bg-[#8B6F4E] text-[#8B6F4E] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Office Landline</span>
                    <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-[#8B6F4E]">
                      +971 4 396 6200
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:it@chd-ranaalkassim.com"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#8B6F4E]/10 group-hover:bg-[#8B6F4E] text-[#8B6F4E] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Support Email</span>
                    <span className="font-mono text-xs font-bold text-[#8B6F4E]">
                      it@chd-ranaalkassim.com
                    </span>
                  </div>
                </a>

                <a
                  href="https://ranaalkassim.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#8B6F4E]/10 group-hover:bg-[#8B6F4E] text-[#8B6F4E] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Official Portal</span>
                    <span className="font-mono text-xs font-medium text-slate-700 group-hover:text-[#8B6F4E]">
                      https://ranaalkassim.com
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Ticket Submission or Success Confirmation */}
          {submittedTicket ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Support Request Dispatched</h4>
              <p className="text-emerald-700 text-xs">
                Ticket <strong className="font-mono">#{submittedTicket}</strong> has been logged for Syed Ali (IT Specialist) at <span className="font-mono font-bold">it@chd-ranaalkassim.com</span>.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-blue-600" />
                  Direct Technical Support Request
                </span>
                <span className="text-[10px] text-slate-400">Routes to Syed Ali</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white cursor-pointer"
                  >
                    <option value="User Permissions & Access">User Permissions & Access</option>
                    <option value="AI Addons & Calculation">AI Addons & Calculation</option>
                    <option value="4K Video Walkthrough Upload">4K Video Walkthrough Upload</option>
                    <option value="System Backup & Export">System Backup & Export</option>
                    <option value="General Technical Inquiry">General Technical Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Immediate Response)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Permission elevation request for new procurement lead"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Details & Remarks</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please describe the issue or inquiry in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to IT Helpdesk</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
