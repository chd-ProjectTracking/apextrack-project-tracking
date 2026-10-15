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

function AppContent() {
  const { activeProject, selectProject, currentUser } = useProjectContext();
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'admin'>('detail');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ApexTrack Enterprise</span>
            <span>·</span>
            <span>Multi-Tier Procurement, Site Supervision & Executive Sign-Off</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Classic Home Interior Decoration LLC · Rana Al Kassim Architecture</span>
            <span>·</span>
            <span>Dubai, UAE</span>
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
