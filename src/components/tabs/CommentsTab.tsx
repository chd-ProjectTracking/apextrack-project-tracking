import React, { useState } from 'react';
import { Project, ReviewComment } from '../../types/project';
import { useProjectContext } from '../../context/ProjectContext';
import { SYSTEM_USERS } from '../../data/initialData';
import { formatDateTime } from '../../utils/formatters';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  DollarSign, 
  HardHat, 
  FileSignature, 
  HelpCircle 
} from 'lucide-react';

interface CommentsTabProps {
  project: Project;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({ project }) => {
  const { currentRole, addReviewComment, toggleCommentResolved } = useProjectContext();
  const currentUser = SYSTEM_USERS[currentRole];

  const [newCommentText, setNewCommentText] = useState('');
  const [commentType, setCommentType] = useState<ReviewComment['commentType']>(
    currentRole === 'ceo'
      ? 'ceo_decision'
      : currentRole === 'operations_manager'
      ? 'ops_directive'
      : currentRole === 'procurement'
      ? 'procurement_variance'
      : currentRole === 'site_supervisor'
      ? 'site_safety'
      : 'general'
  );
  const [filterType, setFilterType] = useState<string>('all');

  const comments = project.comments;
  const filteredComments = comments.filter((c) => {
    return filterType === 'all' || c.commentType === filterType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addReviewComment(project.id, newCommentText.trim(), commentType);
    setNewCommentText('');
  };

  const getCommentIcon = (type: ReviewComment['commentType']) => {
    switch (type) {
      case 'ceo_decision':
        return <FileSignature className="w-4 h-4 text-emerald-600" />;
      case 'ops_directive':
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
      case 'procurement_variance':
        return <DollarSign className="w-4 h-4 text-indigo-600" />;
      case 'site_safety':
        return <HardHat className="w-4 h-4 text-amber-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTypeLabel = (type: ReviewComment['commentType']) => {
    switch (type) {
      case 'ceo_decision':
        return 'CEO Executive Directive';
      case 'ops_directive':
        return 'Operations Review Directive';
      case 'procurement_variance':
        return 'Procurement & Variance Note';
      case 'site_safety':
        return 'Site Safety / Execution Note';
      default:
        return 'Project Note';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Review Comments & Team Discussion Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured review commentary between field leads, project managers, and executive reviewers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Filter Thread:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Comments ({comments.length})</option>
            <option value="ceo_decision">CEO Directives</option>
            <option value="ops_directive">Operations Directives</option>
            <option value="procurement_variance">Procurement Notes</option>
            <option value="site_safety">Site & Safety Notes</option>
            <option value="general">General Notes</option>
          </select>
        </div>
      </div>

      {/* New Comment Submission Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Posting as:</span>
            <span className="font-bold text-slate-900">{currentUser.name}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{currentUser.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">Comment Type:</span>
            <select
              value={commentType}
              onChange={(e) => setCommentType(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="general">General Note</option>
              <option value="procurement_variance">Procurement / Cost Note</option>
              <option value="site_safety">Site Safety / Progress Note</option>
              <option value="ops_directive">Operations Review Directive</option>
              <option value="ceo_decision">CEO Executive Directive</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={`Add your review comment or team feedback as ${currentUser.name}...`}
            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900 leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Review Comment</span>
            </button>
          </div>
        </form>
      </div>

      {/* Thread list */}
      <div className="space-y-3">
        {filteredComments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
            No comments in this thread. Be the first to add a review remark above.
          </div>
        ) : (
          filteredComments.map((comment) => {
            const author = SYSTEM_USERS[comment.authorRole] || {
              name: comment.authorName,
              title: comment.authorRole,
            };

            return (
              <div
                key={comment.id}
                className={`bg-white border rounded-xl p-4 shadow-xs transition-colors ${
                  comment.isApprovalNotice
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : comment.isRevisionRequest
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                      {getCommentIcon(comment.commentType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900">{comment.authorName}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{author.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="font-semibold text-slate-600">{getTypeLabel(comment.commentType)}</span>
                        <span>·</span>
                        <span className="font-mono">{formatDateTime(comment.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCommentResolved(project.id, comment.id)}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                        comment.resolved
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {comment.resolved ? 'Resolved' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 pl-9 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
