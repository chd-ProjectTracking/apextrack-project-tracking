import React from 'react';
import { Project } from '../../types/project';
import { formatDateTime } from '../../utils/formatters';
import { History, UserCheck, Shield } from 'lucide-react';

interface AuditTrailTabProps {
  project: Project;
}

export const AuditTrailTab: React.FC<AuditTrailTabProps> = ({ project }) => {
  const audit = project.auditTrail || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Project Audit Trail & Governance Log</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable event log of all estimation additions, site progress submissions, and multi-tier approval actions.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        {audit.length === 0 ? (
          <div className="text-xs text-slate-400 py-8 text-center">
            No audit records logged yet.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {audit.map((event) => {
              return (
                <div key={event.id} className="relative text-xs">
                  {/* Bullet */}
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{event.action}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-slate-700">{event.performedBy}</span>
                      <span className="text-slate-400">({event.role.replace('_', ' ')})</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-slate-500">{formatDateTime(event.timestamp)}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{event.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
