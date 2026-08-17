import React, { useEffect, useState } from 'react';
import { tasksAPI, departmentsAPI, usersAPI } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Plus, Search, Filter, Layers, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TaskManagement = () => {
  const { user, isExecutive, isLead } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Task creation form
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    department_id: user?.department_id || '1',
    assigned_to_user_id: '',
    priority: 'MEDIUM',
    difficulty: 'MEDIUM',
    xp_points: 10,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasksData = async () => {
    try {
      const [tasksRes, deptsRes, usersRes] = await Promise.all([
        tasksAPI.getTasks({}),
        departmentsAPI.getDepartments(),
        usersAPI.getMembers()
      ]);
      if (tasksRes.data.success) setTasks(tasksRes.data.tasks);
      if (deptsRes.data.success) setDepartments(deptsRes.data.departments);
      if (usersRes.data.success) setMembers(usersRes.data.users);
    } catch (err) {
      console.error('Error loading task management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await tasksAPI.createTask(taskForm);
      if (res.data.success) {
        setShowCreateModal(false);
        setTaskForm({
          title: '',
          description: '',
          department_id: user?.department_id || '1',
          assigned_to_user_id: '',
          priority: 'MEDIUM',
          difficulty: 'MEDIUM',
          xp_points: 10,
          deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
        });
        fetchTasksData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating task.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateDifficultyPoints = (difficulty) => {
    let pts = 10;
    if (difficulty === 'EASY') pts = 5;
    if (difficulty === 'MEDIUM') pts = 10;
    if (difficulty === 'HARD') pts = 20;
    if (difficulty === 'MAJOR') pts = 35;
    setTaskForm({ ...taskForm, difficulty, xp_points: pts });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-gfg-accent" />
            <span>Task Management & Assignment</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Create, assign, and track technical task workflows across department teams.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gfg-500 hover:bg-gfg-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-gfg-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-bg border-b border-dark-border text-xs font-mono text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Task Title & Dept</th>
                <th className="py-4 px-6">Assigned Member</th>
                <th className="py-4 px-6">Priority & XP</th>
                <th className="py-4 px-6">Deadline</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 font-mono">Loading task registry...</td>
                </tr>
              ) : tasks.map((t) => (
                <tr key={t.id} className="hover:bg-dark-hover/40 transition-colors">
                  
                  <td className="py-4 px-6 space-y-1">
                    <h4 className="font-bold text-white text-sm">{t.title}</h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-gfg-accent">
                      {t.department_name}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {t.assignee ? (
                      <div className="flex items-center space-x-2">
                        <img src={t.assignee.avatar_url} alt={t.assignee.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-xs text-gray-300">{t.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-400 italic">Unassigned</span>
                    )}
                  </td>

                  <td className="py-4 px-6 space-y-1">
                    <div className="flex items-center space-x-2">
                      <PriorityBadge priority={t.priority} />
                      <span className="text-xs font-mono font-bold text-gfg-accent">+{t.xp_points} XP</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                    {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No Deadline'}
                  </td>

                  <td className="py-4 px-6">
                    <StatusBadge status={t.status} />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-gfg-accent" />
                <span>Create Department Task</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-gray-400 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Responsive Leaderboard Page"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Task Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Detailed instructions, requirements, and deliverables..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-gray-400 mb-1">Department *</label>
                  <select
                    value={taskForm.department_id}
                    onChange={(e) => setTaskForm({ ...taskForm, department_id: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">Assign to Member</label>
                  <select
                    value={taskForm.assigned_to_user_id}
                    onChange={(e) => setTaskForm({ ...taskForm, assigned_to_user_id: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  >
                    <option value="">Unassigned (Open Pool)</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.position})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-gray-400 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">Difficulty</label>
                  <select
                    value={taskForm.difficulty}
                    onChange={(e) => updateDifficultyPoints(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  >
                    <option value="EASY">EASY (5 XP)</option>
                    <option value="MEDIUM">MEDIUM (10 XP)</option>
                    <option value="HARD">HARD (20 XP)</option>
                    <option value="MAJOR">MAJOR (35+ XP)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">Award XP</label>
                  <input
                    type="number"
                    value={taskForm.xp_points}
                    onChange={(e) => setTaskForm({ ...taskForm, xp_points: parseInt(e.target.value) || 0 })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-dark-bg text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gfg-500 text-white font-bold hover:bg-gfg-hover"
                >
                  {submitting ? 'Creating...' : 'Assign Task'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
