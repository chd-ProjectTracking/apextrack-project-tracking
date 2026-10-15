import { ProjectStatus, UserRole } from '../types/project';

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (val: number): string => {
  return `${Math.round(val)}%`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (isoStr: string): string => {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
};

export const getStatusLabel = (status: ProjectStatus): string => {
  switch (status) {
    case 'draft':
      return 'Draft Baseline';
    case 'data_entry':
      return 'Data Ingestion';
    case 'site_active':
      return 'Active Construction';
    case 'ops_review':
      return 'Pending Ops Review';
    case 'ceo_review':
      return 'Pending CEO Sign-Off';
    case 'approved':
      return 'Greenlit & Executing';
    case 'revision_requested':
      return 'Revision Required';
    case 'on_hold':
      return 'Executive Hold';
    default:
      return status;
  }
};

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'procurement':
      return 'Procurement Specialist';
    case 'site_supervisor':
      return 'Site Supervisor';
    case 'project_manager':
      return 'Project Manager';
    case 'operations_manager':
      return 'Operations Manager';
    case 'ceo':
      return 'Chief Executive Officer';
    default:
      return role;
  }
};
