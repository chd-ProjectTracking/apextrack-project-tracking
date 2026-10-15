import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { UserProfile, UserRole, UserPermissions } from '../../types/project';
import { DEFAULT_PERMISSIONS_BY_ROLE } from '../../data/initialData';
import { formatDateTime } from '../../utils/formatters';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Lock, 
  KeyRound, 
  Search, 
  ShieldAlert,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

interface AdminControlPanelProps {
  onBackToProjects: () => void;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ onBackToProjects }) => {
  const { 
    users, 
    currentUser, 
    addUser, 
    updateUser, 
    deleteUser, 
    updateUserPermissions, 
    login,
    resetToDemoData 
  } = useProjectContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (user: UserProfile) => {
    if (confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBackToProjects}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer mr-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Administration & Governance
            </span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Backend Control Panel: User Access & Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization team members, assign review authorities, and configure granular functional permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Control Panel KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Registered Team Members</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {users.length} Users
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active across 5 organizational tiers</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Executive Reviewers</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-700">
            {users.filter((u) => u.permissions.canGrantCeoSignOff || u.permissions.canApproveOpsReview).length} Authorized
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Can approve Ops & CEO gates</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Field & Supply Chain Leads</span>
            <KeyRound className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-blue-700">
            {users.filter((u) => u.permissions.canAddProcurement || u.permissions.canAddSiteLogs).length} Active
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Procurement & Site Supervision</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Session</span>
            <Lock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {currentUser?.name || 'Guest'}
          </div>
          <span className="text-[11px] text-purple-700 font-medium mt-1 block truncate">
            {currentUser?.title || 'No role'}
          </span>
        </div>
      </div>

      {/* Filter and User Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, email, department, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="procurement">Procurement</option>
              <option value="site_supervisor">Site Supervisor</option>
              <option value="project_manager">Project Manager</option>
              <option value="operations_manager">Operations Manager</option>
              <option value="ceo">Chief Executive Officer</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">User / Profile</th>
                <th className="py-2.5 px-3 font-semibold">Department & Title</th>
                <th className="py-2.5 px-3 font-semibold">Role Tier</th>
                <th className="py-2.5 px-3 font-semibold">Granular Permissions Matrix</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {user.avatarInitials}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.2 rounded font-normal">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{user.title}</div>
                        <div className="text-[11px] text-slate-500">{user.department}</div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] uppercase font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-sm">
                          {user.permissions.canAddProcurement && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                              BoQ Add
                            </span>
                          )}
                          {user.permissions.canAddSiteLogs && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                              Site Logs
                            </span>
                          )}
                          {user.permissions.canUploadMedia && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                              4K Media
                            </span>
                          )}
                          {user.permissions.canManageMilestones && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                              Milestones
                            </span>
                          )}
                          {user.permissions.canSubmitOpsReview && (
                            <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">
                              Submit Ops
                            </span>
                          )}
                          {user.permissions.canApproveOpsReview && (
                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 font-semibold">
                              Ops Sign-Off
                            </span>
                          )}
                          {user.permissions.canGrantCeoSignOff && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                              CEO Sign-Off
                            </span>
                          )}
                          {user.permissions.canManageUsers && (
                            <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() =>
                            updateUser(user.id, {
                              status: user.status === 'active' ? 'inactive' : 'active',
                            })
                          }
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            user.status === 'active'
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          {user.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => login(user.id)}
                            className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors cursor-pointer"
                            title="Switch to this user session"
                          >
                            Switch To
                          </button>

                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="Edit permissions"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            disabled={isCurrent}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors cursor-pointer"
                            title={isCurrent ? 'Cannot delete active session user' : 'Delete user'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <AddUserModal onClose={() => setIsAddUserModalOpen(false)} />
      )}

      {/* Edit User & Permissions Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

// Modal for Adding a New User
const AddUserModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addUser } = useProjectContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('project_manager');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Project Delivery Office');
  const [permissions, setPermissions] = useState<UserPermissions>({
    ...DEFAULT_PERMISSIONS_BY_ROLE.project_manager,
  });

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setPermissions({ ...DEFAULT_PERMISSIONS_BY_ROLE[newRole] });
    if (newRole === 'procurement') {
      setTitle('Procurement & Sourcing Specialist');
      setDepartment('Supply Chain & Materials');
    } else if (newRole === 'site_supervisor') {
      setTitle('Site Construction Supervisor');
      setDepartment('Field Execution & Safety');
    } else if (newRole === 'project_manager') {
      setTitle('Project Delivery Manager');
      setDepartment('Project Delivery Office');
    } else if (newRole === 'operations_manager') {
      setTitle('Operations Review Director');
      setDepartment('Operations & Quality Compliance');
    } else if (newRole === 'ceo') {
      setTitle('Chief Executive Officer / Principal');
      setDepartment('Executive Office');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please enter user name and email.');
      return;
    }

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    addUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      title: title.trim() || `${role.replace('_', ' ')} specialist`,
      department: department.trim() || 'Operations',
      avatarInitials: initials || 'TU',
      badgeColor: 'text-slate-700 bg-slate-50 border-slate-200',
      status: 'active',
      permissions,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Add New Team Member & Set Permissions</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company Email</label>
              <input
                type="email"
                required
                placeholder="e.g. sarah.jenkins@ranaalkassim.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Role Assignment</label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="procurement">Procurement Specialist</option>
                <option value="site_supervisor">Site Supervisor</option>
                <option value="project_manager">Project Manager</option>
                <option value="operations_manager">Operations Manager</option>
                <option value="ceo">Chief Executive Officer (CEO)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Estimator"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
            />
          </div>

          {/* Granular Permissions Section */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Granular Permissions Matrix
              </span>
              <span className="text-[11px] text-slate-500">Auto-filled based on role preset</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canAddProcurement}
                  onChange={(e) => setPermissions({ ...permissions, canAddProcurement: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Add/Edit BoQ Items</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canDeleteProcurement}
                  onChange={(e) => setPermissions({ ...permissions, canDeleteProcurement: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Delete BoQ Items</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canAddSiteLogs}
                  onChange={(e) => setPermissions({ ...permissions, canAddSiteLogs: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Log Daily Site Progress</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canUploadMedia}
                  onChange={(e) => setPermissions({ ...permissions, canUploadMedia: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Upload Photos & 4K Video</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canManageMilestones}
                  onChange={(e) => setPermissions({ ...permissions, canManageMilestones: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Manage Milestones</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canSubmitOpsReview}
                  onChange={(e) => setPermissions({ ...permissions, canSubmitOpsReview: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Submit for Ops Review</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canApproveOpsReview}
                  onChange={(e) => setPermissions({ ...permissions, canApproveOpsReview: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span className="text-purple-900 font-semibold">Can Grant Ops Sign-Off</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canGrantCeoSignOff}
                  onChange={(e) => setPermissions({ ...permissions, canGrantCeoSignOff: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span className="text-emerald-900 font-bold">Can Grant CEO Sign-Off</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer col-span-2">
                <input
                  type="checkbox"
                  checked={permissions.canManageUsers}
                  onChange={(e) => setPermissions({ ...permissions, canManageUsers: e.target.checked })}
                  className="rounded text-slate-900"
                />
                <span className="text-slate-900 font-bold">Can Access Control Panel & Manage Users</span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer"
            >
              Create User Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Editing User Permissions & Profile
const EditUserModal: React.FC<{ user: UserProfile; onClose: () => void }> = ({ user, onClose }) => {
  const { updateUser, updateUserPermissions } = useProjectContext();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  const [department, setDepartment] = useState(user.department);
  const [role, setRole] = useState<UserRole>(user.role);
  const [permissions, setPermissions] = useState<UserPermissions>({ ...user.permissions });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      title: title.trim(),
      department: department.trim(),
      role,
      permissions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Edit User & Permission Authorities</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="procurement">Procurement Specialist</option>
                <option value="site_supervisor">Site Supervisor</option>
                <option value="project_manager">Project Manager</option>
                <option value="operations_manager">Operations Manager</option>
                <option value="ceo">Chief Executive Officer (CEO)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          {/* Granular Permissions Matrix Checkboxes */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Granular Permissions Matrix
              </span>
              <button
                type="button"
                onClick={() => setPermissions({ ...DEFAULT_PERMISSIONS_BY_ROLE[role] })}
                className="text-[11px] text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
              >
                Reset to Role Preset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canAddProcurement}
                  onChange={(e) => setPermissions({ ...permissions, canAddProcurement: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Add/Edit BoQ Items</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canDeleteProcurement}
                  onChange={(e) => setPermissions({ ...permissions, canDeleteProcurement: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Delete BoQ Items</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canAddSiteLogs}
                  onChange={(e) => setPermissions({ ...permissions, canAddSiteLogs: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Log Daily Site Progress</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canUploadMedia}
                  onChange={(e) => setPermissions({ ...permissions, canUploadMedia: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Upload Photos & 4K Video</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canManageMilestones}
                  onChange={(e) => setPermissions({ ...permissions, canManageMilestones: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Manage Milestones</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canSubmitOpsReview}
                  onChange={(e) => setPermissions({ ...permissions, canSubmitOpsReview: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Can Submit for Ops Review</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canApproveOpsReview}
                  onChange={(e) => setPermissions({ ...permissions, canApproveOpsReview: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span className="text-purple-900 font-semibold">Can Grant Ops Sign-Off</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canGrantCeoSignOff}
                  onChange={(e) => setPermissions({ ...permissions, canGrantCeoSignOff: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span className="text-emerald-900 font-bold">Can Grant CEO Sign-Off</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer col-span-2">
                <input
                  type="checkbox"
                  checked={permissions.canManageUsers}
                  onChange={(e) => setPermissions({ ...permissions, canManageUsers: e.target.checked })}
                  className="rounded text-slate-900"
                />
                <span className="text-slate-900 font-bold">Can Access Control Panel & Manage Users</span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer"
            >
              Save Permissions & Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
