import React, { useState } from 'react';
import { Project } from '../types/project';
import { useProjectContext } from '../context/ProjectContext';
import { RoleBanner } from './RoleBanner';
import { OverviewTab } from './tabs/OverviewTab';
import { ProcurementTab } from './tabs/ProcurementTab';
import { SiteSupervisionTab } from './tabs/SiteSupervisionTab';
import { SiteMediaTab } from './tabs/SiteMediaTab';
import { ProjectManagementTab } from './tabs/ProjectManagementTab';
import { OperationsReviewTab } from './tabs/OperationsReviewTab';
import { CeoReviewTab } from './tabs/CeoReviewTab';
import { CommentsTab } from './tabs/CommentsTab';
import { AuditTrailTab } from './tabs/AuditTrailTab';
import { AiAddonsTab } from './tabs/AiAddonsTab';

import { AddProcurementItemModal } from './modals/AddProcurementItemModal';
import { AddSiteLogModal } from './modals/AddSiteLogModal';
import { AddMilestoneModal } from './modals/AddMilestoneModal';
import { AddRiskModal } from './modals/AddRiskModal';
import { SubmitOpsReviewModal } from './modals/SubmitOpsReviewModal';

import { formatCurrency, formatDate, getStatusLabel } from '../utils/formatters';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  DollarSign, 
  HardHat, 
  Camera, 
  ShieldAlert, 
  FileCheck, 
  FileSignature, 
  MessageSquare, 
  History,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBackToList: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBackToList }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modal states
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);
  const [isSiteLogModalOpen, setIsSiteLogModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isSubmitOpsModalOpen, setIsSubmitOpsModalOpen] = useState(false);

  const commentsCount = project.comments.length;
  const photosCount = project.media?.photos?.length || 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'ai', label: 'AI Intelligence Suite', icon: Sparkles },
    { id: 'procurement', label: 'Procurement (BoQ)', icon: DollarSign },
    { id: 'site', label: 'Site Supervision', icon: HardHat },
    { id: 'media', label: `Photos & 4K Video (${photosCount})`, icon: Camera },
    { id: 'pm', label: 'Milestones & PM', icon: Clock },
    { id: 'operations', label: 'Operations Review', icon: FileCheck },
    { id: 'ceo', label: 'CEO Sign-Off', icon: FileSignature },
    { id: 'comments', label: `Review Discussion (${commentsCount})`, icon: MessageSquare },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Project Cockpit Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToList}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Projects</span>
              </button>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {project.code}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500">{project.category}</span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {project.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {project.client}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Target: {formatDate(project.targetCompletionDate)}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                project.status === 'approved'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : project.status === 'ceo_review'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : project.status === 'ops_review'
                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {project.status === 'ceo_review' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {project.status === 'ops_review' && <Clock className="w-3.5 h-3.5 text-purple-600" />}
              {project.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
              <span>{getStatusLabel(project.status)}</span>
            </span>

            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[10px]">Total Capex Budget</span>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {formatCurrency(project.budgetAllocated, project.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 -mb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Banner with Action Callouts */}
      <RoleBanner
        onOpenProcurementModal={() => setIsProcurementModalOpen(true)}
        onOpenSiteLogModal={() => setIsSiteLogModalOpen(true)}
        onOpenOpsReviewModal={() => setIsSubmitOpsModalOpen(true)}
        onSwitchTab={(t) => setActiveTab(t)}
      />

      {/* Active Tab View */}
      {activeTab === 'overview' && (
        <OverviewTab project={project} onNavigateTab={(tab) => setActiveTab(tab)} />
      )}

      {activeTab === 'ai' && <AiAddonsTab project={project} />}

      {activeTab === 'procurement' && (
        <ProcurementTab
          project={project}
          onOpenAddItemModal={() => setIsProcurementModalOpen(true)}
        />
      )}

      {activeTab === 'site' && (
        <SiteSupervisionTab
          project={project}
          onOpenAddLogModal={() => setIsSiteLogModalOpen(true)}
        />
      )}

      {activeTab === 'media' && (
        <SiteMediaTab
          project={project}
          onOpenCommentAtTime={(timecode) => {
            setActiveTab('comments');
          }}
        />
      )}

      {activeTab === 'pm' && (
        <ProjectManagementTab
          project={project}
          onOpenAddMilestoneModal={() => setIsMilestoneModalOpen(true)}
          onOpenAddRiskModal={() => setIsRiskModalOpen(true)}
          onOpenSubmitOpsReviewModal={() => setIsSubmitOpsModalOpen(true)}
        />
      )}

      {activeTab === 'operations' && <OperationsReviewTab project={project} />}

      {activeTab === 'ceo' && <CeoReviewTab project={project} />}

      {activeTab === 'comments' && <CommentsTab project={project} />}

      {activeTab === 'audit' && <AuditTrailTab project={project} />}

      {/* Modals */}
      <AddProcurementItemModal
        isOpen={isProcurementModalOpen}
        onClose={() => setIsProcurementModalOpen(false)}
        projectId={project.id}
      />

      <AddSiteLogModal
        isOpen={isSiteLogModalOpen}
        onClose={() => setIsSiteLogModalOpen(false)}
        projectId={project.id}
        currentProgress={project.overallProgress}
      />

      <AddMilestoneModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        projectId={project.id}
      />

      <AddRiskModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        projectId={project.id}
      />

      <SubmitOpsReviewModal
        isOpen={isSubmitOpsModalOpen}
        onClose={() => setIsSubmitOpsModalOpen(false)}
        projectId={project.id}
        projectName={project.name}
      />
    </div>
  );
};
