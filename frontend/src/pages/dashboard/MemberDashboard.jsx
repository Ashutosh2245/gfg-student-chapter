import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tasksAPI, usersAPI } from '../../services/api';
import { StatusBadge, PriorityBadge, RoleBadge } from '../../components/common/Badge';
import { Layers, Award, CheckCircle2, Send, ExternalLink, Clock, Play, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [memberStats, setMemberStats] = useState({ totalXP: 0, completedTasks: 0 });
  const [loading, setLoading] = useState(true);

  // Submit Modal state
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState(null);
  const [submitForm, setSubmitForm] = useState({ comment: '', proof_url: '', proof_type: 'GITHUB' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchMemberDashboard = async () => {
    if (!user) return;
    try {
      const [tasksRes, profileRes] = await Promise.all([
        tasksAPI.getTasks({ my_tasks: 'true' }),
        usersAPI.getMemberById(user.id)
      ]);

      if (tasksRes.data.success) {
        setMyTasks(tasksRes.data.tasks);
      }
      if (profileRes.data.success) {
        setMemberStats({
          totalXP: profileRes.data.member.total_xp,
          completedTasks: profileRes.data.member.completed_tasks
        });
      }
    } catch (err) {
      console.error('Error fetching member dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberDashboard();
  }, [user]);

  const handleStartTask = async (taskId) => {
    try {
      await tasksAPI.updateStatus(taskId, 'IN_PROGRESS');
      fetchMemberDashboard();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!selectedTaskForSubmit) return;
    setSubmitting(true);
    setFeedback('');

    try {
      const res = await tasksAPI.submitTask(selectedTaskForSubmit.id, submitForm);
      if (res.data.success) {
        setFeedback('Task submitted successfully! Submitted to department reviewer.');
        setSelectedTaskForSubmit(null);
        setSubmitForm({ comment: '', proof_url: '', proof_type: 'GITHUB' });
        fetchMemberDashboard();
      }
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Error submitting task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Card */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img src={user?.avatar_url || '/avatars/default.jpg'} alt={user?.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-gfg-accent shadow-xl" />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <RoleBadge role={user?.role} />
              <span className="text-xs font-mono text-gfg-accent font-semibold">{user?.department_name || 'Department Member'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
            <p className="text-xs text-gray-400 font-mono">{user?.position}</p>
          </div>
        </div>

        {/* Action Buttons & Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/dashboard/profile"
            className="bg-dark-bg border border-dark-border hover:border-gfg-500 text-xs text-gray-300 hover:text-white px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center space-x-1.5"
          >
            <Edit3 className="w-4 h-4 text-gfg-accent" />
            <span>Edit My Profile & Photo</span>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="bg-dark-bg border border-dark-border px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 font-mono block">Earned XP</span>
              <span className="text-xl font-mono font-extrabold text-gfg-accent">{memberStats.totalXP} XP</span>
            </div>
            <div className="bg-dark-bg border border-dark-border px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 font-mono block">Completed Tasks</span>
              <span className="text-xl font-mono font-extrabold text-white">{memberStats.completedTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-gfg-500/10 border border-gfg-500/30 text-gfg-accent text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Assigned Tasks Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-dark-border pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-gfg-accent" />
            <span>My Assigned Department Tasks</span>
          </h2>
          <Link to="/leaderboard" className="text-xs font-semibold text-gfg-accent hover:underline">
            Check My Ranking on Leaderboard →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-gray-400 font-mono text-center py-8">Loading assigned tasks...</p>
        ) : myTasks.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-3xl p-12 text-center text-gray-400 text-xs">
            No active tasks currently assigned to you. Contact your Team Lead for assignment!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myTasks.map((t) => (
              <div key={t.id} className="bg-dark-card border border-dark-border hover:border-gfg-500/40 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white">{t.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{t.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-dark-border">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">Award: <strong className="text-gfg-accent">+{t.xp_points} XP</strong></span>
                    <span className="text-gray-400">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  {t.status === 'PENDING' && (
                    <button
                      onClick={() => handleStartTask(t.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Working (In Progress)</span>
                    </button>
                  )}

                  {(t.status === 'IN_PROGRESS' || t.status === 'REVISION_REQUIRED') && (
                    <button
                      onClick={() => setSelectedTaskForSubmit(t)}
                      className="w-full bg-gfg-500 hover:bg-gfg-hover text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-gfg-500/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Completed Task Proof</span>
                    </button>
                  )}

                  {t.status === 'SUBMITTED' && (
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs text-center font-mono">
                      ⏳ Under Review by Team Lead
                    </div>
                  )}

                  {t.status === 'COMPLETED' && (
                    <div className="p-2.5 rounded-xl bg-gfg-500/10 border border-gfg-500/30 text-gfg-accent text-xs text-center font-mono font-bold">
                      ✓ Approved & XP Awarded
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Submission Modal */}
      {selectedTaskForSubmit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-gfg-accent" />
                <span>Submit Task Deliverables</span>
              </h3>
              <button onClick={() => setSelectedTaskForSubmit(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="bg-dark-bg p-3 rounded-xl border border-dark-border text-xs">
              <h4 className="font-bold text-white">{selectedTaskForSubmit.title}</h4>
              <span className="text-[11px] font-mono text-gfg-accent">XP Award: +{selectedTaskForSubmit.xp_points} XP</span>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-gray-400 mb-1">Proof Link URL (GitHub, Drive, Post, Image) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/org/repo/pull/1"
                  value={submitForm.proof_url}
                  onChange={(e) => setSubmitForm({ ...submitForm, proof_url: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Proof Artifact Type</label>
                <select
                  value={submitForm.proof_type}
                  onChange={(e) => setSubmitForm({ ...submitForm, proof_type: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                >
                  <option value="GITHUB">GitHub Pull Request / Commit</option>
                  <option value="DRIVE">Google Drive Document / Assets</option>
                  <option value="INSTAGRAM">Instagram / Social Post Link</option>
                  <option value="LINK">Other External Website Link</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Submission Comments / Notes</label>
                <textarea
                  rows="3"
                  placeholder="Describe your solution, methodology, or changes implemented..."
                  value={submitForm.comment}
                  onChange={(e) => setSubmitForm({ ...submitForm, comment: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForSubmit(null)}
                  className="px-4 py-2 rounded-xl bg-dark-bg text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gfg-500 text-white font-bold hover:bg-gfg-hover"
                >
                  {submitting ? 'Submitting...' : 'Submit to Reviewer'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
