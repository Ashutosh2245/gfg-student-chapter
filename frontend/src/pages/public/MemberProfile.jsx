import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import { RoleBadge } from '../../components/common/Badge';
import { Linkedin, Instagram, Award, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';

export const MemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await usersAPI.getMemberById(id);
        if (res.data.success) {
          setMember(res.data.member);
        }
      } catch (err) {
        console.error('Error fetching member profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gfg-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Member Not Found</h2>
        <p className="text-gray-400 text-sm mb-4">The profile you are looking for does not exist.</p>
        <Link to="/team" className="text-gfg-accent font-semibold flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Team Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link to="/team" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-gfg-accent font-mono">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Team Directory</span>
      </Link>

      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-10 space-y-8 relative overflow-hidden">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <img
            src={member.avatar_url}
            alt={member.name}
            className="w-32 h-32 rounded-3xl object-cover border-4 border-gfg-500/30 shadow-2xl shrink-0"
          />

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <RoleBadge role={member.role} />
              <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-dark-bg border border-dark-border text-gfg-accent">
                {member.department_name}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white">{member.name}</h1>
            <p className="text-sm font-semibold text-gfg-accent font-mono">{member.position}</p>

            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              {member.bio || 'Dedicated team contributor at GeeksforGeeks Student Chapter NIET.'}
            </p>

            {/* Social Links */}
            <div className="pt-2 flex items-center justify-center sm:justify-start space-x-4">
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-xs font-semibold text-gray-300 hover:text-gfg-accent bg-dark-bg px-3 py-1.5 rounded-lg border border-dark-border transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn Profile</span>
                </a>
              )}

              {member.instagram_url && (
                <a
                  href={member.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-xs font-semibold text-gray-300 hover:text-gfg-accent bg-dark-bg px-3 py-1.5 rounded-lg border border-dark-border transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Member Performance Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-dark-border">
          <div className="bg-dark-bg border border-dark-border rounded-2xl p-4 text-center">
            <Award className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-white font-mono">{member.total_xp}</span>
            <span className="text-xs text-gray-400 block mt-0.5">Total XP Earned</span>
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-2xl p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-gfg-accent mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-white font-mono">{member.completed_tasks}</span>
            <span className="text-xs text-gray-400 block mt-0.5">Verified Tasks</span>
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
            <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-white font-mono mt-2 block uppercase">VERIFIED MEMBER</span>
            <span className="text-[10px] text-gray-500 block">GFG NIET Chapter</span>
          </div>
        </div>

      </div>

    </div>
  );
};
