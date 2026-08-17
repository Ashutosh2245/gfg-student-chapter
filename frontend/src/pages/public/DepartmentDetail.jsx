import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { departmentsAPI } from '../../services/api';
import { RoleBadge } from '../../components/common/Badge';
import { Layers, Users, CheckCircle2, Linkedin, Instagram, ArrowLeft } from 'lucide-react';

export const DepartmentDetail = () => {
  const { deptSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const res = await departmentsAPI.getDepartmentBySlug(deptSlug);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching department detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDept();
  }, [deptSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gfg-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.department) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Department Not Found</h2>
        <p className="text-gray-400 text-sm mb-4">The requested department does not exist or has been renamed.</p>
        <Link to="/team" className="text-gfg-accent font-semibold flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Team
        </Link>
      </div>
    );
  }

  const { department, members, tasks } = data;
  const lead = members.find(m => m.role === 'LEAD');
  const coLeads = members.filter(m => m.role === 'CO_LEAD');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back Link */}
      <Link to="/team" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-gfg-accent transition-colors font-mono">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Departments</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-10 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gfg-500/20 border border-gfg-500/40 flex items-center justify-center text-gfg-accent">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gfg-accent font-mono font-semibold uppercase">Official Department</span>
            <h1 className="text-3xl font-extrabold text-white">{department.name}</h1>
          </div>
        </div>
        <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
          {department.description}
        </p>

        {/* Quick Stats Pill */}
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-dark-bg border border-dark-border text-gray-300">
            👥 {members.length} Members
          </span>
          <span className="px-3 py-1 rounded-lg bg-dark-bg border border-dark-border text-gfg-accent">
            ⚡ {tasks ? tasks.filter(t => t.status === 'COMPLETED').length : 0} Tasks Completed
          </span>
        </div>
      </div>

      {/* Team Lead Section */}
      {lead && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-dark-border pb-2">Department Team Lead</h2>
          <div className="bg-dark-card border border-gfg-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <img src={lead.avatar_url} alt={lead.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-gfg-accent/50" />
            <div className="space-y-2 text-center sm:text-left">
              <RoleBadge role={lead.role} />
              <h3 className="text-xl font-bold text-white">{lead.name}</h3>
              <p className="text-xs text-gfg-accent font-mono">{lead.position}</p>
              <p className="text-xs text-gray-400 max-w-xl">{lead.bio}</p>
              <div className="pt-2 flex justify-center sm:justify-start space-x-3">
                <Link to={`/members/${lead.id}`} className="text-xs text-gfg-accent hover:underline font-semibold">
                  View Full Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Co-Leads Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white border-b border-dark-border pb-2">Department Co-Leads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coLeads.map((m) => (
            <div key={m.id} className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-4">
                <img src={m.avatar_url} alt={m.name} className="w-14 h-14 rounded-full object-cover border border-dark-border" />
                <div>
                  <h4 className="text-sm font-bold text-white">{m.name}</h4>
                  <p className="text-xs text-gfg-accent font-mono">{m.position}</p>
                  <RoleBadge role={m.role} />
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{m.bio}</p>
              <div className="pt-2 flex items-center justify-between text-xs">
                <Link to={`/members/${m.id}`} className="text-gfg-accent hover:underline font-medium">
                  View Profile
                </Link>
                {m.linkedin_url && (
                  <a href={m.linkedin_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
