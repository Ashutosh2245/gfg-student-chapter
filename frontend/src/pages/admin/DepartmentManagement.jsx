import React, { useEffect, useState } from 'react';
import { departmentsAPI } from '../../services/api';
import { Layers, Users, CheckCircle2, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await departmentsAPI.getDepartments();
        if (res.data.success) {
          setDepartments(res.data.departments);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-7 h-7 text-gfg-accent" />
          <span>Department Management & Oversight</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor operational data, leads, co-leads, and performance metrics across all 7 independent departments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gfg-accent px-2.5 py-0.5 rounded bg-gfg-500/10 border border-gfg-500/20">
                  {dept.slug}
                </span>
                <span className="text-xs text-gray-400 font-mono">👥 {dept.member_count} Members</span>
              </div>

              <h3 className="text-xl font-bold text-white mt-3">{dept.name}</h3>
              <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{dept.description}</p>
            </div>

            {/* Department Lead */}
            <div className="bg-dark-bg border border-dark-border rounded-2xl p-3.5 space-y-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Assigned Team Lead</span>
              {dept.lead ? (
                <div className="flex items-center space-x-3">
                  <img src={dept.lead.avatar_url} alt={dept.lead.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{dept.lead.name}</h4>
                    <span className="text-[10px] text-gfg-accent font-mono">{dept.lead.position}</span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-amber-400 italic">No Lead Assigned</span>
              )}
            </div>

            {/* Department Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-dark-border">
              <div className="bg-dark-bg p-2 rounded-xl border border-dark-border">
                <span className="text-xs font-mono text-gray-400 block">Completed Tasks</span>
                <span className="text-sm font-bold font-mono text-white">{dept.completed_tasks}</span>
              </div>
              <div className="bg-dark-bg p-2 rounded-xl border border-dark-border">
                <span className="text-xs font-mono text-gray-400 block">Total Dept XP</span>
                <span className="text-sm font-bold font-mono text-gfg-accent">{dept.total_xp} XP</span>
              </div>
            </div>

            <Link
              to={`/team/${dept.slug}`}
              className="w-full bg-dark-bg hover:bg-dark-hover border border-dark-border text-xs text-gray-300 hover:text-white py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-1 transition-colors"
            >
              <span>View Department Portal Page</span>
              <ChevronRight className="w-3.5 h-3.5 text-gfg-accent" />
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
};
