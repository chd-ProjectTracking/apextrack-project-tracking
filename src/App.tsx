/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectProvider, useProjectContext } from './context/ProjectContext';
import { Header } from './components/Header';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { AdminControlPanel } from './components/admin/AdminControlPanel';
import { LoginView } from './components/auth/LoginView';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { TechnicalSupportModal } from './components/support/TechnicalSupportModal';
import { Headphones, Mail, Phone, Globe } from 'lucide-react';

function AppContent() {
  const { activeProject, selectProject, currentUser } = useProjectContext();
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'admin'>('detail');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // If user is logged out, show friendly luxury Login View
  if (!currentUser) {
    return <LoginView />;
  }

  const handleSelectProject = (projectId: string) => {
    selectProject(projectId);
    setCurrentView('detail');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation conforming to Top Bar Contract */}
      <Header
        onNewProject={() => setIsNewProjectModalOpen(true)}
        currentView={currentView}
        onNavigateHome={() => setCurrentView('list')}
        onNavigateAdmin={() => setCurrentView('admin')}
        onOpenSupport={() => setIsSupportModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'admin' ? (
          <AdminControlPanel onBackToProjects={() => setCurrentView('list')} />
        ) : currentView === 'list' || !activeProject ? (
          <ProjectList
            onSelectProject={handleSelectProject}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          />
        ) : (
          <ProjectDetail
            project={activeProject}
            onBackToList={() => setCurrentView('list')}
          />
        )}
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      {/* Technical Support Modal */}
      <TechnicalSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Luxury Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-serif font-bold text-slate-900 tracking-wide">
              The Design Address by Rana Al Kassim
            </span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="text-slate-500">Luxury Architecture & Turnkey Fit-Out Project Tracking</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#8B6F4E] font-medium transition-colors cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-[#8B6F4E]" />
              <span>IT Support: IT@chd-ranaalkassim.com</span>
            </button>

            <span className="text-slate-300">·</span>

            <a
              href="tel:+97143966200"
              className="hover:text-slate-900 transition-colors"
            >
              +971 4 396 6200
            </a>

            <span className="text-slate-300">·</span>

            <a
              href="https://ranaalkassim.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>ranaalkassim.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}
