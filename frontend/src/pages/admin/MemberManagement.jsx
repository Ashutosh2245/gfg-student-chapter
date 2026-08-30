import React, { useEffect, useState } from 'react';
import { usersAPI, departmentsAPI, authAPI } from '../../services/api';
import { RoleBadge } from '../../components/common/Badge';
import { Users, UserPlus, Search, CheckCircle2, XCircle, Edit3, Trash2, Shield, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatAvatarUrl } from '../../utils/formatAvatar';

export const MemberManagement = () => {
  const { user, isPresident, updateUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CO_LEAD',
    department_id: '1',
    position: '',
    bio: '',
    linkedin_url: '',
    instagram_url: '',
    avatar_url: '/avatars/default.jpg'
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'CO_LEAD',
    department_id: '1',
    position: '',
    bio: '',
    linkedin_url: '',
    instagram_url: '',
    avatar_url: '',
    newPassword: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      const [usersRes, deptsRes] = await Promise.all([
        usersAPI.getMembers(),
        departmentsAPI.getDepartments()
      ]);
      if (usersRes.data.success) setMembers(usersRes.data.users);
      if (deptsRes.data.success) setDepartments(deptsRes.data.departments);
    } catch (err) {
      console.error('Error fetching member list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      const res = await authAPI.createMember({
        ...formData,
        avatar_url: formatAvatarUrl(formData.avatar_url)
      });
      if (res.data.success) {
        setFormSuccess(res.data.message);
        setShowAddModal(false);
        fetchMembers();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create member account.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setEditFormData({
      name: member.name || '',
      email: member.email || '',
      role: member.role || 'CO_LEAD',
      department_id: String(member.department_id || '1'),
      position: member.position || '',
      bio: member.bio || '',
      linkedin_url: member.linkedin_url || '',
      instagram_url: member.instagram_url || '',
      avatar_url: member.avatar_url || '/avatars/default.jpg',
      newPassword: ''
    });
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      const res = await usersAPI.updateMember(editingMember.id, {
        ...editFormData,
        avatar_url: formatAvatarUrl(editFormData.avatar_url)
      });
      if (res.data.success) {
        setFormSuccess(`Updated ${editingMember.name}'s profile successfully!`);
        if (user && editingMember.id === user.id && res.data.user) {
          updateUser(res.data.user);
        }
        setEditingMember(null);
        fetchMembers();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update member profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    setSubmitting(true);
    try {
      const res = await usersAPI.deleteMember(deletingMember.id);
      if (res.data.success) {
        setFormSuccess(`Deleted account for ${deletingMember.name}.`);
        setDeletingMember(null);
        fetchMembers();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to delete member.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMemberStatus = async (id, currentStatus) => {
    try {
      await usersAPI.updateStatus(id, !currentStatus);
      fetchMembers();
    } catch (err) {
      console.error('Error toggling member status:', err);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-gfg-accent" />
            <span>Member Management & Onboarding</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            President administrative hub. Create, edit, reset passwords, or delete member accounts.
          </p>
        </div>

        {isPresident() && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gfg-500 hover:bg-gfg-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-gfg-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard New Member</span>
          </button>
        )}
      </div>

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-gfg-500/10 border border-gfg-500/30 text-gfg-accent text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter members by name, email, or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-card border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gfg-accent"
        />
      </div>

      {/* Member Directory Table */}
      <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-bg border-b border-dark-border text-xs font-mono text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Member</th>
                <th className="py-4 px-6">Role & Position</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Status</th>
                {isPresident() && <th className="py-4 px-6 text-right">Admin Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 font-mono">Loading chapter members...</td>
                </tr>
              ) : filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-dark-hover/40 transition-colors">
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={formatAvatarUrl(m.avatar_url)} 
                        alt={m.name} 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'; }}
                        className="w-10 h-10 rounded-full object-cover border border-dark-border" 
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">{m.name}</h4>
                        <p className="text-xs text-gray-400 font-mono">{m.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 space-y-1">
                    <RoleBadge role={m.role} />
                    <p className="text-xs font-medium text-gray-300">{m.position}</p>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-bg border border-dark-border text-gray-300">
                      {m.department_name}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {m.is_active ? (
                      <span className="text-xs font-mono text-gfg-accent flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-red-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Deactivated
                      </span>
                    )}
                  </td>

                  {isPresident() && (
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-1.5 rounded-lg bg-dark-bg border border-dark-border text-gray-300 hover:text-gfg-accent hover:border-gfg-accent/50 transition-colors"
                        title="Edit Member Profile"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleMemberStatus(m.id, m.is_active)}
                        className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                          m.is_active
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-gfg-500/10 text-gfg-accent border-gfg-500/30'
                        }`}
                      >
                        {m.is_active ? 'Deactivate' : 'Activate'}
                      </button>

                      {m.role !== 'PRESIDENT' && (
                        <button
                          onClick={() => setDeletingMember(m)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-gfg-accent" />
                <span>Onboard Chapter Member</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {formError && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{formError}</div>}

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-gray-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aryan@gfgniet.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-gray-400 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  >
                    <option value="VICE_PRESIDENT">VICE PRESIDENT</option>
                    <option value="COORDINATOR">COORDINATOR</option>
                    <option value="LEAD">TEAM LEAD</option>
                    <option value="CO_LEAD">CO-LEAD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">Department *</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Official Position Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical Co-Lead (Web)"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Profile Photo (URL or Local path e.g. /avatars/myphoto.jpg)</label>
                <input
                  type="text"
                  placeholder="/avatars/default.jpg"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-dark-bg text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2 rounded-xl bg-gfg-500 text-white font-bold hover:bg-gfg-hover">{submitting ? 'Creating...' : 'Create Account'}</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Full Edit Member Modal (President Admin Control) */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-gfg-accent" />
                <span>Edit Profile for {editingMember.name}</span>
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {formError && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{formError}</div>}

            <form onSubmit={handleUpdateMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  />
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-gray-400 mb-1">Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  >
                    <option value="PRESIDENT">PRESIDENT</option>
                    <option value="VICE_PRESIDENT">VICE PRESIDENT</option>
                    <option value="COORDINATOR">COORDINATOR</option>
                    <option value="LEAD">TEAM LEAD</option>
                    <option value="CO_LEAD">CO-LEAD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">Department</label>
                  <select
                    value={editFormData.department_id}
                    onChange={(e) => setEditFormData({ ...editFormData, department_id: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Position Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.position}
                  onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Profile Photo (URL or Local path e.g. /avatars/photo.jpg)</label>
                <input
                  type="text"
                  value={editFormData.avatar_url}
                  onChange={(e) => setEditFormData({ ...editFormData, avatar_url: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-gray-400 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editFormData.linkedin_url}
                    onChange={(e) => setEditFormData({ ...editFormData, linkedin_url: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  />
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={editFormData.instagram_url}
                    onChange={(e) => setEditFormData({ ...editFormData, instagram_url: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Bio / Profile Description</label>
                <textarea
                  rows="2"
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div className="p-3 bg-dark-bg border border-dark-border rounded-xl space-y-1">
                <label className="block font-mono text-amber-400 mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> Admin Password Override (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password to force update..."
                  value={editFormData.newPassword}
                  onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setEditingMember(null)} className="px-4 py-2 rounded-xl bg-dark-bg text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2 rounded-xl bg-gfg-500 text-white font-bold hover:bg-gfg-hover">{submitting ? 'Saving...' : 'Save Member Details'}</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Member Confirmation Modal */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Delete Member Account?</h3>
              <p className="text-xs text-gray-400">
                Are you sure you want to permanently delete the account for <span className="text-white font-bold">{deletingMember.name}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-4 pt-2">
              <button onClick={() => setDeletingMember(null)} className="px-5 py-2.5 rounded-xl bg-dark-bg text-gray-300 hover:text-white text-xs font-semibold">Cancel</button>
              <button onClick={handleDeleteMember} disabled={submitting} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/20">{submitting ? 'Deleting...' : 'Delete Account'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
