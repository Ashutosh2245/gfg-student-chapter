import React, { useEffect, useState } from 'react';
import { leaderboardAPI, departmentsAPI } from '../../services/api';
import { Award, Filter, Search, Trophy, Medal, Star, Flame, Sparkles } from 'lucide-react';
import { RoleBadge } from '../../components/common/Badge';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('overall');
  const [timeframe, setTimeframe] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await departmentsAPI.getDepartments();
        if (res.data.success) {
          setDepartments(res.data.departments);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const res = await leaderboardAPI.getLeaderboard({
          department_slug: selectedDept,
          timeframe,
          search: searchTerm
        });
        if (res.data.success) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [selectedDept, timeframe, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          <span>Universal Chapter Rankings</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">
          Chapter XP <span className="text-gfg-accent">Leaderboard</span>
        </h1>
        <p className="text-sm text-gray-400">
          Recognizing active member achievements, verified task completions, and technical excellence across all departments.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Timeframe Selector Pills */}
          <div className="flex items-center bg-dark-bg p-1 rounded-2xl border border-dark-border w-full md:w-auto">
            <button
              onClick={() => setTimeframe('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${timeframe === 'all' ? 'bg-gfg-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${timeframe === 'monthly' ? 'bg-gfg-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${timeframe === 'weekly' ? 'bg-gfg-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Weekly Sprint
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search geek by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gfg-accent"
            />
          </div>

        </div>

        {/* Department Mode Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedDept('overall')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedDept === 'overall'
                ? 'bg-gfg-500/20 text-gfg-accent border-gfg-500'
                : 'bg-dark-bg text-gray-400 border-dark-border hover:text-white'
            }`}
          >
            🌟 Universal Overall
          </button>
          {departments.map((d) => (
            <button
              key={d.slug}
              onClick={() => setSelectedDept(d.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedDept === d.slug
                  ? 'bg-gfg-500/20 text-gfg-accent border-gfg-500'
                  : 'bg-dark-bg text-gray-400 border-dark-border hover:text-white'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

      </div>

      {/* Top 3 Podium Highlights */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          
          {/* Silver #2 */}
          <div className="bg-dark-card border border-slate-400/30 rounded-3xl p-6 text-center space-y-3 order-2 md:order-1">
            <div className="w-10 h-10 rounded-xl bg-slate-300/20 text-slate-300 font-mono font-bold flex items-center justify-center mx-auto text-sm border border-slate-300/40">
              #2
            </div>
            <img src={leaderboard[1].avatar_url} alt={leaderboard[1].name} className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-slate-300" />
            <div>
              <h3 className="text-base font-bold text-white">{leaderboard[1].name}</h3>
              <p className="text-xs text-gray-400 font-mono">{leaderboard[1].department_name}</p>
            </div>
            <div className="pt-2 border-t border-dark-border">
              <span className="text-lg font-mono font-extrabold text-gfg-accent">{leaderboard[1].total_xp} XP</span>
              <span className="text-[11px] text-gray-400 block">{leaderboard[1].completed_tasks} Tasks</span>
            </div>
          </div>

          {/* Gold #1 */}
          <div className="bg-dark-card border-2 border-amber-400/60 shadow-2xl shadow-amber-500/10 rounded-3xl p-8 text-center space-y-4 order-1 md:order-2 scale-105">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 font-mono font-extrabold flex items-center justify-center mx-auto text-base border border-amber-400/60">
              👑 #1
            </div>
            <img src={leaderboard[0].avatar_url} alt={leaderboard[0].name} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white">{leaderboard[0].name}</h3>
              <p className="text-xs text-amber-400 font-mono font-semibold">{leaderboard[0].department_name}</p>
            </div>
            <div className="pt-2 border-t border-dark-border">
              <span className="text-2xl font-mono font-extrabold text-amber-400">{leaderboard[0].total_xp} XP</span>
              <span className="text-xs text-gray-300 block">{leaderboard[0].completed_tasks} Verified Tasks</span>
            </div>
          </div>

          {/* Bronze #3 */}
          <div className="bg-dark-card border border-amber-700/30 rounded-3xl p-6 text-center space-y-3 order-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700/20 text-amber-600 font-mono font-bold flex items-center justify-center mx-auto text-sm border border-amber-700/40">
              #3
            </div>
            <img src={leaderboard[2].avatar_url} alt={leaderboard[2].name} className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-amber-700" />
            <div>
              <h3 className="text-base font-bold text-white">{leaderboard[2].name}</h3>
              <p className="text-xs text-gray-400 font-mono">{leaderboard[2].department_name}</p>
            </div>
            <div className="pt-2 border-t border-dark-border">
              <span className="text-lg font-mono font-extrabold text-gfg-accent">{leaderboard[2].total_xp} XP</span>
              <span className="text-[11px] text-gray-400 block">{leaderboard[2].completed_tasks} Tasks</span>
            </div>
          </div>

        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-bg/80 border-b border-dark-border text-xs font-mono text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Member Geek</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6 text-center">Completed Tasks</th>
                <th className="py-4 px-6 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 font-mono">
                    Calculating live rankings...
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No members match the selected leaderboard filter.
                  </td>
                </tr>
              ) : (
                leaderboard.map((item) => (
                  <tr key={item.id} className="hover:bg-dark-hover/50 transition-colors">
                    
                    {/* Rank */}
                    <td className="py-4 px-6 font-mono font-bold">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                        item.rank === 1 ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40' :
                        item.rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40' :
                        item.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' :
                        'text-gray-400'
                      }`}>
                        #{item.rank}
                      </span>
                    </td>

                    {/* Member Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img src={item.avatar_url} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-dark-border" />
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <span className="text-[11px] text-gray-400">{item.position}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-bg border border-dark-border text-gray-300">
                        {item.department_name}
                      </span>
                    </td>

                    {/* Completed Tasks */}
                    <td className="py-4 px-6 text-center font-mono text-sm font-semibold text-gray-300">
                      {item.completed_tasks}
                    </td>

                    {/* XP */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-gfg-accent text-base">
                      {item.total_xp} XP
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
