import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Mail, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark-card border-t border-dark-border pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gfg-500/10 border border-gfg-500/40 p-1 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.jpeg"
                  alt="GFG Logo"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/WhatsApp%20Image%202026-04-10%20at%2020.01.01.jpeg';
                  }}
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-wide">
                  GeeksforGeeks <span className="text-gfg-accent">NIET</span>
                </span>
                <span className="text-[10px] text-gray-400 block -mt-1 font-mono">Official Student Chapter</span>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              GeeksforGeeks Student Chapter at Noida Institute of Engineering and Technology (NIET). Fostering technical excellence, open-source innovation, and algorithmic mastery.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://www.linkedin.com/in/ashutosh-kumar-92612b236" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-gray-400 hover:text-gfg-accent hover:border-gfg-accent/50 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com/Ashutosh2245/gfg-student-chapter" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-gray-400 hover:text-gfg-accent hover:border-gfg-accent/50 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-gray-400 hover:text-gfg-accent hover:border-gfg-accent/50 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 border-b border-gfg-500/30 pb-2 inline-block">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-gfg-accent transition-colors">Home Page</Link></li>
              <li><Link to="/about" className="hover:text-gfg-accent transition-colors">About Our Chapter</Link></li>
              <li><Link to="/team" className="hover:text-gfg-accent transition-colors">Leadership & Teams</Link></li>
              <li><Link to="/events" className="hover:text-gfg-accent transition-colors">Hackathons & Events</Link></li>
              <li><Link to="/leaderboard" className="hover:text-gfg-accent transition-colors">Universal Leaderboard</Link></li>
              <li><Link to="/login" className="hover:text-gfg-accent transition-colors font-semibold text-gfg-accent">Portal Member Login</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 border-b border-gfg-500/30 pb-2 inline-block">7 Departments</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/team/technical" className="hover:text-gfg-accent transition-colors">Technical Team</Link></li>
              <li><Link to="/team/social-media" className="hover:text-gfg-accent transition-colors">Social Media Team</Link></li>
              <li><Link to="/team/event-management" className="hover:text-gfg-accent transition-colors">Event Management</Link></li>
              <li><Link to="/team/design" className="hover:text-gfg-accent transition-colors">Design Team</Link></li>
              <li><Link to="/team/content-research" className="hover:text-gfg-accent transition-colors">Content & Research</Link></li>
              <li><Link to="/team/photography-video" className="hover:text-gfg-accent transition-colors">Photography & Video</Link></li>
              <li><Link to="/team/pr-outreach" className="hover:text-gfg-accent transition-colors">PR & Outreach</Link></li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 border-b border-gfg-500/30 pb-2 inline-block">Contact Chapter</h4>
            <div className="flex items-start space-x-3 text-xs text-gray-400">
              <MapPin className="w-4 h-4 text-gfg-accent shrink-0 mt-0.5" />
              <span>NIET Greater Noida, 19, Knowledge Park II, Greater Noida, UP 201306</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <Mail className="w-4 h-4 text-gfg-accent shrink-0" />
              <span>contact@gfgniet.ac.in</span>
            </div>
          </div>

        </div>

        {/* Footer Bottom Credit Bar */}
        <div className="mt-12 pt-8 border-t border-dark-border flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GeeksforGeeks Student Chapter NIET. All rights reserved.</p>
          <p className="flex items-center gap-1.5 mt-2 md:mt-0 font-medium">
            Designed & Engineered with <Heart className="w-3.5 h-3.5 text-gfg-accent fill-gfg-accent inline" /> by{' '}
            <a
              href="https://www.linkedin.com/in/ashutosh-kumar-92612b236"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-gfg-accent hover:underline inline-flex items-center gap-1 bg-gfg-500/10 border border-gfg-500/30 px-2 py-0.5 rounded-lg transition-colors hover:bg-gfg-500 hover:text-white"
            >
              <span>Ashutosh Kumar</span>
              <Linkedin className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
