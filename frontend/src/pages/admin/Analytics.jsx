import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { BarChart3, TrendingUp, Users, CheckCircle2, Award, Layers } from 'lucide-react';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.data.success) {
          setData(res.data.metrics);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gfg-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-gfg-accent" />
          <span>Chapter Executive Analytics</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Real-time completion metrics, department operational performance, and XP distribution insights.
        </p>
      </div>

      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-2">
          <span className="text-xs text-gray-400 font-mono block">Chapter Active Geeks</span>
          <span className="text-3xl font-extrabold text-white font-mono">{data?.activeMembers} / {data?.totalMembers}</span>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-2">
          <span className="text-xs text-gray-400 font-mono block">Overall Completion Rate</span>
          <span className="text-3xl font-extrabold text-gfg-accent font-mono">{data?.completionRate}%</span>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-2">
          <span className="text-xs text-gray-400 font-mono block">Tasks Delivered</span>
          <span className="text-3xl font-extrabold text-white font-mono">{data?.completedTasks} / {data?.totalTasks}</span>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-2">
          <span className="text-xs text-gray-400 font-mono block">Total XP Distributed</span>
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{data?.totalXP}</span>
        </div>
      </div>

      {/* Department Breakdown Performance Progress Bars */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-gfg-accent" />
          <span>Department Operational Efficiency</span>
        </h2>

        <div className="space-y-5">
          {data?.departmentPerformance.map((dept) => (
            <div key={dept.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">{dept.name}</span>
                <span className="text-gray-400">{dept.completedTasks} of {dept.totalTasks} Tasks ({dept.completionRate}%) — <strong className="text-gfg-accent">{dept.totalXP} XP</strong></span>
              </div>
              <div className="w-full h-3 bg-dark-bg border border-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gfg-500 to-gfg-accent rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(dept.completionRate, 5)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
