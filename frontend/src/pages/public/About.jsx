import React from 'react';
import { Target, Compass, Terminal, ShieldCheck, Zap, Users, Code } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gfg-500/10 text-gfg-accent text-xs font-semibold uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          <span>About Our Student Chapter</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Nurturing Technological Excellence at <span className="text-gfg-accent">NIET</span>
        </h1>
        <p className="text-base text-gray-400 leading-relaxed">
          GeeksforGeeks Student Chapter at Noida Institute of Engineering & Technology is an elite technical student organization committed to fostering a strong developer ecosystem, algorithmic problem solving, and peer-to-peer mentorship.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gfg-500/20 border border-gfg-500/40 flex items-center justify-center text-gfg-accent">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Our Mission</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            To provide student developers with real-world exposure, industry-aligned task management experience, high-impact hackathons, and continuous skill building in Data Structures, Algorithms, Full-Stack Web Engineering, AI, and Cloud Technologies.
          </p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Our Vision</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            To establish NIET as a premier technical talent hub recognized across national competitive coding platforms, global hackathons, open-source repositories, and top tier engineering placements.
          </p>
        </div>
      </div>

      {/* Core Operational Culture */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Our Core Chapter Pillars</h2>
          <p className="text-xs text-gray-400">Built around discipline, accountability, and continuous technical growth</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-dark-bg border border-dark-border rounded-2xl p-6 space-y-3">
            <ShieldCheck className="w-8 h-8 text-gfg-accent" />
            <h4 className="text-base font-bold text-white">Strict Department Isolation</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every department operates independently with dedicated leads, explicit task assignments, and department-specific performance tracking.
            </p>
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-2xl p-6 space-y-3">
            <Zap className="w-8 h-8 text-amber-400" />
            <h4 className="text-base font-bold text-white">Gamified XP System</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Members earn XP upon verification of task submissions, fostering healthy competitive spirit through our universal leaderboard.
            </p>
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-2xl p-6 space-y-3">
            <Users className="w-8 h-8 text-purple-400" />
            <h4 className="text-base font-bold text-white">Peer Mentorship</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Senior leads guide co-leads through code reviews, design feedback, social strategy, and event logistics.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
