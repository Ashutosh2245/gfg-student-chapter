import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, tasksAPI, departmentsAPI, leaderboardAPI } from '../../services/api';
import { Shield, Users, CheckCircle2, Award, Clock, ArrowRight, Layers, FileCheck } from 'lucide-react';
import { RoleBadge, StatusBadge } from '../../components/common/Badge';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTasks: 0,
    pendingSubmissions: 0,
    totalXP: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, tasksRes, deptsRes, lbRes] = await Promise.all([
          usersAPI.getMembers(),
          tasksAPI.getTasks({}),
          departmentsAPI.getDepartments(),
          leaderboardAPI.getLeaderboard({ timeframe: 'all' })
        ]);

        const usersList = usersRes.data.success ? usersRes.data.users : [];
        const tasksList = tasksRes.data.success ? tasksRes.data.tasks : [];
        const lbList = lbRes.data.success ? lbRes.data.leaderboard : [];

        const pendingSubs = tasksList.filter(t => t.status === 'SUBMITTED' || t.status === 'UNDER_REVIEW');
        const sumXP = lbList.reduce((acc, curr) => acc + curr.total_xp, 0);

        setStats({
          totalMembers: usersList.length,
          totalTasks: tasksList.length,
          pendingSubmissions: pendingSubs.length,
          totalXP: sumXP
        });

        setRecentTasks(tasksList.slice(0, 5));
        setRecentSubmissions(pendingSubs.slice(0, 4));

      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-gfg-accent" />
            <span className="text-xs font-mono font-semibold text-gfg-accent uppercase">Executive Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, <span className="text-gfg-accent">{user?.name}</span>
          </h1>
          <p className="text-sm text-gray-400">
            {user?.position} • Overview of chapter departments, task submissions, and XP audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/members"
            className="bg-gfg-500 hover:bg-gfg-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-gfg-500/20"
          >
            + Onboard Member
          </Link>
          <Link
            to="/admin/tasks"
            className="bg-dark-bg border border-dark-border text-gray-200 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            Assign Task
          </Link>
        </div>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono">Chapter Members</span>
            <Users className="w-4 h-4 text-gfg-accent" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono">{stats.totalMembers}</span>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono">Total Tasks</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono">{stats.totalTasks}</span>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono">Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{stats.pendingSubmissions}</span>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono">Awarded XP</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.totalXP}</span>
        </div>
      </div>

      {/* Dual Section: Submissions Review & Task Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Submissions Queue */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Review Submissions Queue</h3>
            </div>
            <Link to="/admin/submissions" className="text-xs font-semibold text-amber-400 hover:underline">
              Manage Queue →
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">No pending task submissions requiring review.</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((task) => (
                <div key={task.id} className="bg-dark-bg border border-dark-border rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{task.title}</span>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>Dept: {task.department_name}</span>
                    <span>XP: {task.xp_points}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Master Task List */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-gfg-accent" />
              <h3 className="text-lg font-bold text-white">Active Tasks Overview</h3>
            </div>
            <Link to="/admin/tasks" className="text-xs font-semibold text-gfg-accent hover:underline">
              View All Tasks →
            </Link>
          </div>

          <div className="space-y-3">
            {recentTasks.map((t) => (
              <div key={t.id} className="bg-dark-bg border border-dark-border rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.title}</h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">Assigned to: {t.assignee ? t.assignee.name : 'Unassigned'}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
