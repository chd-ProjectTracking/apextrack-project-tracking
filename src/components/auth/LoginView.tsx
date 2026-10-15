import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { UserProfile } from '../../types/project';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Users 
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { users, login } = useProjectContext();
  const [selectedEmail, setSelectedEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [loginMode, setLoginMode] = useState<'quick' | 'credentials'>('quick');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find((u) => u.email.toLowerCase() === selectedEmail.toLowerCase());
    if (found) {
      login(found.id);
    } else {
      alert(`No user found with email "${selectedEmail}". Please select from the team directory.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Subtle architectural grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-full text-xs text-slate-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Classic Home Interior Decoration LLC · Dubai, UAE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ApexTrack Enterprise
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Multi-role project tracking for procurement estimation, site supervision, project management, and Operations & CEO review workflows.
          </p>
        </div>

        {/* Login Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 text-xs">
            <button
              onClick={() => setLoginMode('quick')}
              className={`flex-1 py-2 font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMode === 'quick'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>1-Click Team Persona Login</span>
            </button>
            <button
              onClick={() => setLoginMode('credentials')}
              className={`flex-1 py-2 font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMode === 'credentials'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Email Sign-In</span>
            </button>
          </div>

          <div className="p-6">
            {loginMode === 'quick' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span>Select an authorized team profile to sign in:</span>
                  <span className="font-mono text-[11px]">{users.length} Authorized Users</span>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {users.map((user) => {
                    return (
                      <button
                        key={user.id}
                        onClick={() => login(user.id)}
                        className="w-full p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 text-left transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {user.avatarInitials}
                            </div>
                          )}

                          <div className="text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {user.name}
                              </span>
                              <span className="text-[10px] font-mono uppercase font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {user.role.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="text-slate-500 block mt-0.5 text-[11px]">{user.title}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                            <span>Sign In</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. rana@ranaalkassim.com"
                      value={selectedEmail}
                      onChange={(e) => setSelectedEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer transition-colors"
                  >
                    Authenticate & Access Cockpit
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500">
                  Tip: Switch to "1-Click Team Persona Login" above to instantly test any role.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Security & Architecture Note */}
        <div className="text-center text-[11px] text-slate-500">
          Role-Based Access Control (RBAC) active · Session encrypted & saved locally
        </div>
      </div>
    </div>
  );
};
