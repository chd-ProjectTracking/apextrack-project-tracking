export type UserRole = 
  | 'procurement' 
  | 'site_supervisor' 
  | 'project_manager' 
  | 'operations_manager' 
  | 'ceo';

export interface UserPermissions {
  canAddProcurement: boolean;
  canDeleteProcurement: boolean;
  canAddSiteLogs: boolean;
  canUploadMedia: boolean;
  canManageMilestones: boolean;
  canManageRisks: boolean;
  canSubmitOpsReview: boolean;
  canApproveOpsReview: boolean;
  canGrantCeoSignOff: boolean;
  canManageUsers: boolean;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  title: string;
  avatarInitials: string;
  avatarUrl?: string;
  department: string;
  badgeColor: string;
  status: 'active' | 'inactive';
  permissions: UserPermissions;
  createdAt?: string;
}

export type ProjectStatus = 
  | 'draft' 
  | 'data_entry' 
  | 'site_active' 
  | 'ops_review' 
  | 'ceo_review' 
  | 'approved' 
  | 'revision_requested' 
  | 'on_hold';

export interface ProcurementItem {
  id: string;
  itemCode: string;
  description: string;
  category: 'Structural' | 'Electrical' | 'Mechanical' | 'Finishes' | 'Heavy Equipment' | 'Site Services';
  quantity: number;
  unit: string;
  estimatedUnitCost: number;
  actualUnitCost: number;
  estimatedTotal: number;
  actualTotal: number;
  variance: number; // actualTotal - estimatedTotal
  supplier: string;
  poNumber?: string;
  orderStatus: 'Draft' | 'RFQPending' | 'PO Issued' | 'In Transit' | 'Delivered' | 'Inspected';
  requiredOnSiteDate: string;
  actualDeliveryDate?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface SiteLaborCount {
  skilled: number;
  unskilled: number;
  supervisors: number;
  subcontractors: number;
}

export interface SiteDailyLog {
  id: string;
  logDate: string;
  supervisorName: string;
  shift: 'Day' | 'Night' | 'Full 24h';
  weather: 'Clear' | 'Rain' | 'High Wind' | 'Extreme Heat' | 'Dust Storm';
  labor: SiteLaborCount;
  equipmentActive: string[];
  workCompleted: string;
  workPlannedTomorrow: string;
  safetyIncidents: number;
  safetyNotes: string;
  delaysOrBlockers?: string;
  progressPercentageLogged: number;
  photosCount: number;
  verifiedByPm: boolean;
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  phase: 'Pre-construction' | 'Procurement' | 'Substructure' | 'Superstructure' | 'MEP & Systems' | 'Commissioning' | 'Handover';
  targetDate: string;
  actualDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progressPercentage: number;
  assignedRole: UserRole;
  criticalPath: boolean;
}

export interface ProjectRisk {
  id: string;
  description: string;
  category: 'Procurement & Supply Chain' | 'Site Execution' | 'Financial & Budget' | 'Weather & Environmental' | 'Regulatory';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationPlan: string;
  owner: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface ReviewComment {
  id: string;
  authorRole: UserRole;
  authorName: string;
  commentType: 'general' | 'procurement_variance' | 'site_safety' | 'ops_directive' | 'ceo_decision';
  content: string;
  timestamp: string;
  resolved: boolean;
  isApprovalNotice?: boolean;
  isRevisionRequest?: boolean;
}

export interface AuditEvent {
  id: string;
  action: string;
  performedBy: string;
  role: UserRole;
  timestamp: string;
  details: string;
}

export interface SiteMediaPhoto {
  id: string;
  title: string;
  category: 'Living Salon' | 'Master Suite' | 'Marble Cladding' | 'Joinery & Millwork' | 'MEP & Ceiling' | 'Site Inspection';
  imageUrl: string;
  caption: string;
  uploadedBy: string;
  uploadedAt: string;
  verifiedBySupervisor: boolean;
  stage: string;
}

export interface SiteMediaVideo {
  id: string;
  title: string;
  duration: string;
  videoThumbnail: string;
  description: string;
  recordedBy: string;
  recordedAt: string;
  resolution: string;
  inspectionNotes: string;
  keyTimestamps: { time: string; label: string; verified: boolean }[];
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  category: 'Commercial' | 'Infrastructure' | 'Industrial' | 'Residential' | 'Healthcare';
  description: string;
  startDate: string;
  targetCompletionDate: string;
  budgetAllocated: number;
  currency: string;
  status: ProjectStatus;
  overallProgress: number; // 0 to 100
  
  // Assigned personnel
  assignedTeam: {
    procurementLead: string;
    siteSupervisor: string;
    projectManager: string;
    operationsManager: string;
    ceoReviewer: string;
  };

  // Sub-domains
  procurement: {
    items: ProcurementItem[];
    notes: string;
    lastUpdated: string;
  };

  siteSupervision: {
    dailyLogs: SiteDailyLog[];
    currentPhysicalProgress: number;
    safetyIncidentsYTD: number;
    lastUpdated: string;
  };

  pmSchedule: {
    milestones: ProjectMilestone[];
    risks: ProjectRisk[];
    criticalPathNotes: string;
    lastUpdated: string;
  };

  operationsReview: {
    reviewedBy?: string;
    reviewedAt?: string;
    status: 'pending' | 'approved' | 'revision_required';
    checklist: {
      procurementFeasibility: boolean;
      siteReadiness: boolean;
      resourceAllocationChecked: boolean;
      complianceVerified: boolean;
    };
    operationalNotes: string;
  };

  ceoReview: {
    reviewedBy?: string;
    reviewedAt?: string;
    status: 'pending' | 'approved' | 'revision_required' | 'on_hold';
    budgetReleased: boolean;
    executiveDirectives: string;
    roiProjectedMarginPct: number;
  };

  media: {
    photos: SiteMediaPhoto[];
    videoWalkthroughs: SiteMediaVideo[];
  };

  comments: ReviewComment[];
  auditTrail: AuditEvent[];
  updatedAt: string;
  createdAt: string;
}
