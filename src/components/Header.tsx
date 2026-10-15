import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { UserRole } from '../types/project';
import { 
  Plus, 
  RotateCcw, 
  ShieldCheck, 
  LogOut, 
  Sliders, 
  Users, 
  ChevronDown, 
  Lock,
  Building2 
} from 'lucide-react';

interface HeaderProps {
  onNewProject: () => void;
  currentView: 'list' | 'detail' | 'admin';
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNewProject, 
  currentView, 
  onNavigateHome,
  onNavigateAdmin 
}) => {
  const { currentUser, users, login, logout, activeProject, resetToDemoData } = useProjectContext();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Zone 1, 2, 3 conforming to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-xs">
              AT
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 block">
                ApexTrack
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block -mt-1">
                Luxury Fit-Out & Architectural Ops
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links / Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
            <button
              onClick={onNavigateHome}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'list' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              Projects
            </button>

            <button
              onClick={onNavigateAdmin}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'admin' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Control Panel</span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                {users.length}
              </span>
            </button>

            {currentView === 'detail' && activeProject && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>/</span>
                <span className="font-mono text-slate-600">{activeProject.code}</span>
                <span>/</span>
                <span className="text-slate-800 font-medium truncate max-w-[160px]">{activeProject.name}</span>
              </div>
            )}
          </nav>

          {/* Zone 3: Primary Action & User Profile Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={resetToDemoData}
              title="Reset to default multi-role demo projects and users"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onNewProject}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>

            {/* User Session Profile & Switcher */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer text-left"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-md object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {currentUser.avatarInitials}
                    </div>
                  )}

                  <div className="hidden lg:block text-xs leading-tight">
                    <span className="font-bold text-slate-900 block truncate max-w-[130px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                    <div className="p-2 border-b border-slate-100 mb-1">
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{currentUser.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{currentUser.title}</div>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigateAdmin();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      <span>Admin Control Panel</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />
                    <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1 block">
                      Quick Switch Persona:
                    </span>

                    <div className="max-h-40 overflow-y-auto space-y-0.5 pr-1">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            login(u.id);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1 rounded-md text-[11px] flex items-center justify-between cursor-pointer ${
                            currentUser.id === u.id
                              ? 'bg-blue-50 text-blue-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{u.name}</span>
                          <span className="text-[9px] uppercase font-mono text-slate-400">
                            {u.role.replace('_', ' ')}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Quick Role & Permission Banner */}
      {currentUser && (
        <div className="bg-slate-50/90 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Signed In As:</span>
              <strong className="text-slate-900">{currentUser.name}</strong>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-mono text-[11px] uppercase">{currentUser.role.replace('_', ' ')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 hidden sm:inline">1-Click Switch:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg">
                {users.slice(0, 5).map((u) => {
                  const isSelected = currentUser.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => login(u.id)}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                      title={`${u.name} (${u.title})`}
                    >
                      {u.avatarInitials} · {u.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
