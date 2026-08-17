import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, departmentsAPI } from '../../services/api';
import { RoleBadge } from '../../components/common/Badge';
import { Linkedin, Instagram, ChevronRight, Users, Shield, Layers } from 'lucide-react';

export const Team = () => {
  const [leadership, setLeadership] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [usersRes, deptRes] = await Promise.all([
          usersAPI.getMembers(),
          departmentsAPI.getDepartments()
        ]);

        if (usersRes.data.success) {
          const execs = usersRes.data.users.filter(u => ['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR'].includes(u.role));
          setLeadership(execs);
        }
        if (deptRes.data.success) {
          setDepartments(deptRes.data.departments);
        }
      } catch (err) {
        console.error('Error loading team data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white">
          Chapter Leadership & <span className="text-gfg-accent">Departments</span>
        </h1>
        <p className="text-sm text-gray-400">
          Meet the executive leadership and the 7 specialized teams powering GFG Student Chapter NIET.
        </p>
      </div>

      {/* Executive Leadership Grid */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-dark-border pb-3">
          <Shield className="w-5 h-5 text-gfg-accent" />
          <h2 className="text-xl font-bold text-white">Executive Leadership</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((member) => (
            <div key={member.id} className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4 text-center group hover:border-gfg-500/40 transition-all">
              <div className="relative inline-block">
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gfg-500/40 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <RoleBadge role={member.role} />
                <h3 className="text-lg font-bold text-white mt-2">{member.name}</h3>
                <p className="text-xs text-gfg-accent font-medium mt-0.5">{member.position}</p>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{member.bio}</p>
              </div>

              <div className="pt-2 flex items-center justify-center space-x-3 text-gray-400">
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-gfg-accent transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.instagram_url && (
                  <a href={member.instagram_url} target="_blank" rel="noreferrer" className="hover:text-gfg-accent transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                <Link to={`/members/${member.id}`} className="text-xs font-semibold text-gfg-accent hover:underline">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Departments Showcase */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-dark-border pb-3">
          <Layers className="w-5 h-5 text-gfg-accent" />
          <h2 className="text-xl font-bold text-white">7 Operational Departments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-gfg-500/10 text-gfg-accent border border-gfg-500/20">
                    {dept.member_count} Members
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 line-clamp-3">{dept.description}</p>
              </div>

              {/* Lead highlight */}
              {dept.lead && (
                <div className="bg-dark-bg border border-dark-border rounded-xl p-3 flex items-center space-x-3">
                  <img src={dept.lead.avatar_url} alt={dept.lead.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono block">TEAM LEAD</span>
                    <span className="text-xs font-bold text-white">{dept.lead.name}</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to={`/team/${dept.slug}`}
                  className="w-full bg-dark-bg border border-dark-border hover:border-gfg-500/50 text-gray-300 hover:text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Explore Department Team</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
