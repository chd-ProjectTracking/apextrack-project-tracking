import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  UserRole, 
  UserProfile, 
  UserPermissions, 
  ProcurementItem, 
  SiteDailyLog, 
  ProjectMilestone, 
  ProjectRisk, 
  ReviewComment, 
  AuditEvent 
} from '../types/project';
import { INITIAL_PROJECTS, INITIAL_USERS, DEFAULT_PERMISSIONS_BY_ROLE } from '../data/initialData';

interface ProjectContextType {
  // Projects
  projects: Project[];
  activeProjectId: string;
  activeProject: Project | undefined;
  selectProject: (id: string) => void;
  createProject: (newProject: Omit<Project, 'id' | 'auditTrail' | 'comments' | 'createdAt' | 'updatedAt'>) => void;

  // Users & Auth
  users: UserProfile[];
  currentUser: UserProfile | null;
  currentRole: UserRole;
  login: (userId: string) => void;
  logout: () => void;
  setCurrentRole: (role: UserRole) => void;
  addUser: (userData: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updates: Partial<UserProfile>) => void;
  deleteUser: (userId: string) => boolean;
  updateUserPermissions: (userId: string, permissions: Partial<UserPermissions>) => void;
  hasPermission: (permission: keyof UserPermissions) => boolean;

  // Project Domain Actions
  addProcurementItem: (projectId: string, item: Omit<ProcurementItem, 'id' | 'updatedBy' | 'updatedAt' | 'estimatedTotal' | 'actualTotal' | 'variance'>) => void;
  updateProcurementItem: (projectId: string, itemId: string, updates: Partial<ProcurementItem>) => void;
  deleteProcurementItem: (projectId: string, itemId: string) => void;
  addSiteDailyLog: (projectId: string, log: Omit<SiteDailyLog, 'id' | 'supervisorName' | 'createdAt' | 'verifiedByPm'>) => void;
  addMilestone: (projectId: string, milestone: Omit<ProjectMilestone, 'id'>) => void;
  updateMilestone: (projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>) => void;
  addRisk: (projectId: string, risk: Omit<ProjectRisk, 'id'>) => void;
  updateRisk: (projectId: string, riskId: string, updates: Partial<ProjectRisk>) => void;
  submitForOpsReview: (projectId: string, notes: string) => void;
  submitOperationsDecision: (
    projectId: string,
    decision: 'approved' | 'revision_required',
    notes: string,
    checklist: { procurementFeasibility: boolean; siteReadiness: boolean; resourceAllocationChecked: boolean; complianceVerified: boolean }
  ) => void;
  submitCeoDecision: (
    projectId: string,
    decision: 'approved' | 'revision_required' | 'on_hold',
    directives: string,
    budgetReleased: boolean
  ) => void;
  addReviewComment: (
    projectId: string,
    content: string,
    commentType: ReviewComment['commentType']
  ) => void;
  toggleCommentResolved: (projectId: string, commentId: string) => void;
  resetToDemoData: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'apextrack_projects_v2';
const USERS_KEY = 'apextrack_users_v2';
const CURRENT_USER_KEY = 'apextrack_active_user_v2';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_USERS;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUserId = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUserId) {
        const found = users.find((u) => u.id === savedUserId);
        if (found) return found;
      }
    } catch {
      // Fallback
    }
    // Default to CEO Rana Al Kassim or first user
    return users.find((u) => u.role === 'ceo') || users[0] || null;
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return INITIAL_PROJECTS[0]?.id || '';
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, currentUser.id);
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save current user to localStorage', e);
    }
  }, [currentUser]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const currentRole: UserRole = currentUser?.role || 'project_manager';

  // Permission Checker
  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!currentUser) return false;
    return Boolean(currentUser.permissions?.[permission]);
  };

  // Auth methods
  const login = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const setCurrentRole = (role: UserRole) => {
    const matchingUser = users.find((u) => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else if (currentUser) {
      const updated = {
        ...currentUser,
        role,
        permissions: { ...DEFAULT_PERMISSIONS_BY_ROLE[role] },
      };
      setCurrentUser(updated);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    }
  };

  // User Management
  const addUser = (userData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: 'usr-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        const updated = { ...user, ...updates };
        if (currentUser?.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      })
    );
  };

  const deleteUser = (userId: string): boolean => {
    if (currentUser?.id === userId) {
      alert('You cannot delete your currently active user profile.');
      return false;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return true;
  };

  const updateUserPermissions = (userId: string, permissions: Partial<UserPermissions>) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        const updated = {
          ...user,
          permissions: {
            ...user.permissions,
            ...permissions,
          },
        };
        if (currentUser?.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      })
    );
  };

  const addAuditEvent = (project: Project, action: string, details: string): AuditEvent => ({
    id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    action,
    performedBy: currentUser?.name || 'Authenticated User',
    role: currentRole,
    timestamp: new Date().toISOString(),
    details,
  });

  const selectProject = (id: string) => {
    setActiveProjectId(id);
  };

  const createProject = (newProjectData: Omit<Project, 'id' | 'auditTrail' | 'comments' | 'createdAt' | 'updatedAt'>) => {
    const id = 'prj-' + Date.now();
    const now = new Date().toISOString();
    const initialAudit: AuditEvent = {
      id: 'aud-' + Date.now(),
      action: 'Project Created',
      performedBy: currentUser?.name || 'System User',
      role: currentRole,
      timestamp: now,
      details: `Project "${newProjectData.name}" created with code ${newProjectData.code}.`,
    };

    const newProject: Project = {
      ...newProjectData,
      id,
      comments: [
        {
          id: 'c-' + Date.now(),
          authorRole: currentRole,
          authorName: currentUser?.name || 'System User',
          commentType: 'general',
          content: `Project record initialized by ${currentUser?.name || 'System User'} (${currentUser?.title || ''}).`,
          timestamp: now,
          resolved: true,
        },
      ],
      auditTrail: [initialAudit],
      createdAt: now,
      updatedAt: now,
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(id);
  };

  const addProcurementItem = (
    projectId: string,
    itemData: Omit<ProcurementItem, 'id' | 'updatedBy' | 'updatedAt' | 'estimatedTotal' | 'actualTotal' | 'variance'>
  ) => {
    const estimatedTotal = itemData.quantity * itemData.estimatedUnitCost;
    const actualTotal = itemData.quantity * itemData.actualUnitCost;
    const variance = actualTotal - estimatedTotal;
    const now = new Date().toISOString();

    const newItem: ProcurementItem = {
      ...itemData,
      id: 'proc-' + Date.now(),
      estimatedTotal,
      actualTotal,
      variance,
      updatedBy: currentUser?.name || 'Procurement Lead',
      updatedAt: now.split('T')[0],
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const updatedItems = [...project.procurement.items, newItem];
        const audit = addAuditEvent(
          project,
          'Procurement Item Added',
          `Added ${newItem.itemCode}: "${newItem.description}" (Est. $${estimatedTotal.toLocaleString()}, Act. $${actualTotal.toLocaleString()}).`
        );
        return {
          ...project,
          procurement: {
            ...project.procurement,
            items: updatedItems,
            lastUpdated: now.split('T')[0],
          },
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const updateProcurementItem = (projectId: string, itemId: string, updates: Partial<ProcurementItem>) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const updatedItems = project.procurement.items.map((item) => {
          if (item.id !== itemId) return item;
          const merged = { ...item, ...updates };
          const estimatedTotal = merged.quantity * merged.estimatedUnitCost;
          const actualTotal = merged.quantity * merged.actualUnitCost;
          const variance = actualTotal - estimatedTotal;
          return {
            ...merged,
            estimatedTotal,
            actualTotal,
            variance,
            updatedBy: currentUser?.name || item.updatedBy,
            updatedAt: now.split('T')[0],
          };
        });

        const audit = addAuditEvent(
          project,
          'Procurement Item Updated',
          `Modified item details for item ID ${itemId}.`
        );

        return {
          ...project,
          procurement: {
            ...project.procurement,
            items: updatedItems,
            lastUpdated: now.split('T')[0],
          },
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const deleteProcurementItem = (projectId: string, itemId: string) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const target = project.procurement.items.find((i) => i.id === itemId);
        const updatedItems = project.procurement.items.filter((i) => i.id !== itemId);
        const audit = addAuditEvent(
          project,
          'Procurement Item Removed',
          `Removed item ${target?.itemCode || itemId} (${target?.description || ''}).`
        );
        return {
          ...project,
          procurement: {
            ...project.procurement,
            items: updatedItems,
            lastUpdated: now.split('T')[0],
          },
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const addSiteDailyLog = (
    projectId: string,
    logData: Omit<SiteDailyLog, 'id' | 'supervisorName' | 'createdAt' | 'verifiedByPm'>
  ) => {
    const now = new Date().toISOString();
    const newLog: SiteDailyLog = {
      ...logData,
      id: 'log-' + Date.now(),
      supervisorName: currentUser?.name || 'Site Supervisor',
      verifiedByPm: currentRole === 'project_manager',
      createdAt: now,
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const totalIncidents = project.siteSupervision.safetyIncidentsYTD + logData.safetyIncidents;
        const updatedLogs = [newLog, ...project.siteSupervision.dailyLogs];
        const audit = addAuditEvent(
          project,
          'Daily Site Log Submitted',
          `Site log for ${logData.logDate} (${logData.shift} shift) by ${newLog.supervisorName}. Progress logged: ${logData.progressPercentageLogged}%.`
        );

        return {
          ...project,
          overallProgress: Math.max(project.overallProgress, logData.progressPercentageLogged),
          siteSupervision: {
            ...project.siteSupervision,
            dailyLogs: updatedLogs,
            currentPhysicalProgress: logData.progressPercentageLogged,
            safetyIncidentsYTD: totalIncidents,
            lastUpdated: logData.logDate,
          },
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const addMilestone = (projectId: string, milestoneData: Omit<ProjectMilestone, 'id'>) => {
    const now = new Date().toISOString();
    const newMilestone: ProjectMilestone = {
      ...milestoneData,
      id: 'ms-' + Date.now(),
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const updatedMilestones = [...project.pmSchedule.milestones, newMilestone];
        const audit = addAuditEvent(
          project,
          'Milestone Added',
          `Added milestone "${newMilestone.title}" targeting ${newMilestone.targetDate}.`
        );
        return {
          ...project,
          pmSchedule: {
            ...project.pmSchedule,
            milestones: updatedMilestones,
            lastUpdated: now.split('T')[0],
          },
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const updateMilestone = (projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const updatedMilestones = project.pmSchedule.milestones.map((m) =>
          m.id === milestoneId ? { ...m, ...updates } : m
        );
        const audit = addAuditEvent(
          project,
          'Milestone Updated',
          `Updated status or progress for milestone ID ${milestoneId}.`
        );
        return {
          ...project,
          pmSchedule: {
            ...project.pmSchedule,
            milestones: updatedMilestones,
            lastUpdated: now.split('T')[0],
          },
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const addRisk = (projectId: string, riskData: Omit<ProjectRisk, 'id'>) => {
    const now = new Date().toISOString();
    const newRisk: ProjectRisk = {
      ...riskData,
      id: 'risk-' + Date.now(),
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const updatedRisks = [...project.pmSchedule.risks, newRisk];
        const audit = addAuditEvent(
          project,
          'Risk Logged',
          `Logged ${newRisk.severity} severity risk: "${newRisk.description}".`
        );
        return {
          ...project,
          pmSchedule: {
            ...project.pmSchedule,
            risks: updatedRisks,
            lastUpdated: now.split('T')[0],
          },
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const updateRisk = (projectId: string, riskId: string, updates: Partial<ProjectRisk>) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const updatedRisks = project.pmSchedule.risks.map((r) =>
          r.id === riskId ? { ...r, ...updates } : r
        );
        const audit = addAuditEvent(project, 'Risk Updated', `Updated status or mitigation for risk ${riskId}.`);
        return {
          ...project,
          pmSchedule: {
            ...project.pmSchedule,
            risks: updatedRisks,
            lastUpdated: now.split('T')[0],
          },
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const submitForOpsReview = (projectId: string, notes: string) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const audit = addAuditEvent(
          project,
          'Submitted to Operations Review',
          `PM ${currentUser?.name || 'Project Manager'} submitted project data for Operations Review. Notes: ${notes}`
        );
        const comment: ReviewComment = {
          id: 'c-' + Date.now(),
          authorRole: currentRole,
          authorName: currentUser?.name || 'Project Manager',
          commentType: 'general',
          content: `Project data package compiled and submitted for Operations Review: ${notes}`,
          timestamp: now,
          resolved: false,
        };
        return {
          ...project,
          status: 'ops_review',
          operationsReview: {
            ...project.operationsReview,
            status: 'pending',
            operationalNotes: notes,
          },
          comments: [comment, ...project.comments],
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const submitOperationsDecision = (
    projectId: string,
    decision: 'approved' | 'revision_required',
    notes: string,
    checklist: { procurementFeasibility: boolean; siteReadiness: boolean; resourceAllocationChecked: boolean; complianceVerified: boolean }
  ) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const nextStatus = decision === 'approved' ? 'ceo_review' : 'revision_requested';
        const audit = addAuditEvent(
          project,
          decision === 'approved' ? 'Operations Review Approved' : 'Revisions Requested by Operations',
          `Operations Manager ${currentUser?.name || 'Elena Vance'} evaluated project: ${decision}. Next state: ${nextStatus}. Notes: ${notes}`
        );
        const comment: ReviewComment = {
          id: 'c-' + Date.now(),
          authorRole: 'operations_manager',
          authorName: currentUser?.name || 'Elena Vance',
          commentType: 'ops_directive',
          content: `Operations Decision [${decision.toUpperCase()}]: ${notes}`,
          timestamp: now,
          resolved: decision === 'approved',
          isApprovalNotice: decision === 'approved',
          isRevisionRequest: decision === 'revision_required',
        };
        return {
          ...project,
          status: nextStatus,
          operationsReview: {
            reviewedBy: currentUser?.name || 'Elena Vance',
            reviewedAt: now,
            status: decision,
            checklist,
            operationalNotes: notes,
          },
          comments: [comment, ...project.comments],
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const submitCeoDecision = (
    projectId: string,
    decision: 'approved' | 'revision_required' | 'on_hold',
    directives: string,
    budgetReleased: boolean
  ) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        let nextStatus = project.status;
        if (decision === 'approved') nextStatus = 'approved';
        else if (decision === 'revision_required') nextStatus = 'revision_requested';
        else if (decision === 'on_hold') nextStatus = 'on_hold';

        const audit = addAuditEvent(
          project,
          `CEO Decision: ${decision.toUpperCase()}`,
          `CEO ${currentUser?.name || 'Rana Al Kassim'} signed off: ${decision}. Capital release: ${budgetReleased ? 'YES' : 'NO'}. Directives: ${directives}`
        );

        const comment: ReviewComment = {
          id: 'c-' + Date.now(),
          authorRole: 'ceo',
          authorName: currentUser?.name || 'Rana Al Kassim',
          commentType: 'ceo_decision',
          content: `CEO Executive Sign-Off [${decision.toUpperCase()}]: ${directives}. Capital Release: ${budgetReleased ? 'Authorized' : 'Pending'}.`,
          timestamp: now,
          resolved: decision === 'approved',
          isApprovalNotice: decision === 'approved',
          isRevisionRequest: decision === 'revision_required',
        };

        return {
          ...project,
          status: nextStatus,
          ceoReview: {
            ...project.ceoReview,
            reviewedBy: currentUser?.name || 'Rana Al Kassim',
            reviewedAt: now,
            status: decision,
            budgetReleased,
            executiveDirectives: directives,
          },
          comments: [comment, ...project.comments],
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const addReviewComment = (
    projectId: string,
    content: string,
    commentType: ReviewComment['commentType']
  ) => {
    const now = new Date().toISOString();
    const newComment: ReviewComment = {
      id: 'c-' + Date.now(),
      authorRole: currentRole,
      authorName: currentUser?.name || 'Team Member',
      commentType,
      content,
      timestamp: now,
      resolved: false,
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const audit = addAuditEvent(
          project,
          'Review Comment Added',
          `${currentUser?.name || 'Team Member'} posted a ${commentType} note.`
        );
        return {
          ...project,
          comments: [newComment, ...project.comments],
          auditTrail: [audit, ...project.auditTrail],
          updatedAt: now,
        };
      })
    );
  };

  const toggleCommentResolved = (projectId: string, commentId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          comments: project.comments.map((c) =>
            c.id === commentId ? { ...c, resolved: !c.resolved } : c
          ),
        };
      })
    );
  };

  const resetToDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS.find((u) => u.role === 'ceo') || INITIAL_USERS[0]);
    setActiveProjectId(INITIAL_PROJECTS[0].id);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        activeProject,
        selectProject,
        createProject,

        users,
        currentUser,
        currentRole,
        login,
        logout,
        setCurrentRole,
        addUser,
        updateUser,
        deleteUser,
        updateUserPermissions,
        hasPermission,

        addProcurementItem,
        updateProcurementItem,
        deleteProcurementItem,
        addSiteDailyLog,
        addMilestone,
        updateMilestone,
        addRisk,
        updateRisk,
        submitForOpsReview,
        submitOperationsDecision,
        submitCeoDecision,
        addReviewComment,
        toggleCommentResolved,
        resetToDemoData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
