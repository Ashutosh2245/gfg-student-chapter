import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { departmentsAPI, leaderboardAPI, eventsAPI } from '../../services/api';
import { RoleBadge } from '../../components/common/Badge';
import { Code, Users, Award, Calendar, ArrowRight, Shield, Zap, Sparkles, Terminal, ChevronRight, CheckCircle2, Lock } from 'lucide-react';

export const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [deptsRes, lbRes, eventsRes] = await Promise.all([
          departmentsAPI.getDepartments(),
          leaderboardAPI.getLeaderboard(),
          eventsAPI.getEvents()
        ]);

        if (deptsRes.data.success) setDepartments(deptsRes.data.departments);
        if (lbRes.data.success) setLeaderboard(lbRes.data.leaderboard.slice(0, 5));
        if (eventsRes.data.success) setUpcomingEvents(eventsRes.data.events);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-16">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gfg-500/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-3 bg-dark-card border border-gfg-500/40 px-4 py-2 rounded-full shadow-xl">
              <img
                src="/logo.jpeg"
                alt="GFG Emblem"
                className="w-5 h-5 object-cover rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/WhatsApp%20Image%202026-04-10%20at%2020.01.01.jpeg';
                }}
              />
              <span className="text-xs font-mono font-bold text-gfg-accent">GeeksforGeeks Student Chapter NIET</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gfg-accent animate-ping"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Architecting the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gfg-accent via-emerald-300 to-green-400">NIET Developers</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Empowering students through algorithmic mastery, open-source engineering, design systems, and real-world tech hackathons across 7 specialized departments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/team"
                className="w-full sm:w-auto bg-gfg-500 hover:bg-gfg-hover text-white px-8 py-4 rounded-2xl font-extrabold text-sm shadow-2xl shadow-gfg-500/30 flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <span>Explore 7 Chapter Teams</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto bg-dark-card border-2 border-gfg-accent/60 hover:border-gfg-accent text-white px-8 py-4 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <Lock className="w-4 h-4 text-gfg-accent" />
                <span>Portal Member Login</span>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-dark-border/60">
              <div className="bg-dark-card/60 border border-dark-border p-4 rounded-2xl">
                <span className="text-2xl font-mono font-extrabold text-white block">33+</span>
                <span className="text-xs text-gray-400 font-mono">Chapter Members</span>
              </div>
              <div className="bg-dark-card/60 border border-dark-border p-4 rounded-2xl">
                <span className="text-2xl font-mono font-extrabold text-gfg-accent block">7</span>
                <span className="text-xs text-gray-400 font-mono">Specialized Teams</span>
              </div>
              <div className="bg-dark-card/60 border border-dark-border p-4 rounded-2xl">
                <span className="text-2xl font-mono font-extrabold text-amber-400 block">300+</span>
                <span className="text-xs text-gray-400 font-mono">Hackathon Attendees</span>
              </div>
              <div className="bg-dark-card/60 border border-dark-border p-4 rounded-2xl">
                <span className="text-2xl font-mono font-extrabold text-blue-400 block">100%</span>
                <span className="text-xs text-gray-400 font-mono">Merit XP System</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7 Specialized Departments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-dark-border pb-6">
          <div>
            <span className="text-xs font-mono font-bold text-gfg-accent uppercase tracking-wider block">Operational Backbone</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">7 Chapter Departments</h2>
          </div>
          <Link to="/team" className="text-xs font-mono font-bold text-gfg-accent hover:underline flex items-center space-x-1">
            <span>View Executive Leadership & Full Teams</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              to={`/team/${dept.slug}`}
              className="group bg-dark-card border border-dark-border hover:border-gfg-500/50 p-6 rounded-3xl space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gfg-500/10 border border-gfg-500/30 flex items-center justify-center text-gfg-accent group-hover:bg-gfg-500 group-hover:text-white transition-colors">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-gfg-accent transition-colors">{dept.name}</h3>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">{dept.description}</p>
              </div>

              <div className="pt-4 border-t border-dark-border/50 flex items-center justify-between text-xs font-mono text-gfg-accent font-semibold">
                <span>Explore Department</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Universal XP Leaderboard Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">Meritocracy System</span>
              <h2 className="text-2xl font-extrabold text-white mt-0.5">Top Chapter Performers</h2>
            </div>
            <Link to="/leaderboard" className="bg-dark-bg border border-dark-border hover:border-gfg-500 text-xs font-bold text-white px-4 py-2 rounded-xl transition-colors">
              Full Standings →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-dark-border text-gray-400 font-mono uppercase">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-right">Earned XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {leaderboard.map((m) => (
                  <tr key={m.id} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">#{m.rank}</td>
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img src={m.avatar_url} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-dark-border" />
                      <div>
                        <span className="font-bold text-white block">{m.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{m.position}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono">{m.department_name}</td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-gfg-accent">{m.total_xp} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Flagship Hackathons & Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-gfg-accent uppercase tracking-wider block">Hackathons & Workshops</span>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">Upcoming Chapter Events</h2>
          </div>
          <Link to="/events" className="text-xs font-mono font-bold text-gfg-accent hover:underline">
            View All Events →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((evt) => (
            <div key={evt.id} className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="relative h-48 overflow-hidden">
                <img src={evt.banner_url} alt={evt.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 right-4 bg-dark-bg/90 border border-dark-border px-3 py-1 rounded-full text-[10px] font-mono font-bold text-gfg-accent">
                  {evt.status}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">{evt.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{evt.description}</p>
                <div className="pt-4 border-t border-dark-border flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">📍 {evt.venue}</span>
                  <a href={evt.registration_url} target="_blank" rel="noreferrer" className="text-gfg-accent font-bold hover:underline">
                    Register Now →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
