import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, LogIn, LogOut, Menu, X, Award, ChevronDown, BarChart3, ShieldCheck } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, logout, isExecutive } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const departmentsList = [
    { name: 'Technical Team', slug: 'technical' },
    { name: 'Social Media Team', slug: 'social-media' },
    { name: 'Event Management Team', slug: 'event-management' },
    { name: 'Design Team', slug: 'design' },
    { name: 'Content & Research Team', slug: 'content-research' },
    { name: 'Photography & Video Team', slug: 'photography-video' },
    { name: 'PR & Outreach Team', slug: 'pr-outreach' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-xl border-b border-dark-border shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official GFG Brand & Logo Emblem */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gfg-500/10 border border-gfg-500/40 p-2 flex items-center justify-center group-hover:border-gfg-accent group-hover:shadow-gfg-glow transition-all duration-300">
                <img
                  src=""C:\Users\Ashutosh Kumar\Desktop\gfg-student-chapter\frontend\public\avatars\WhatsApp Image 2026-04-10 at 20.01.01.jpeg""
                  alt="GeeksforGeeks Official Logo"
                  className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gfg-accent rounded-full border-2 border-dark-bg shadow-sm"></div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl text-white tracking-tight group-hover:text-gfg-accent transition-colors">
                  GeeksforGeeks
                </span>
                <span className="text-xs font-mono font-bold text-gfg-accent px-1.5 py-0.5 rounded bg-gfg-500/10 border border-gfg-500/30">
                  NIET
                </span>
              </div>
              <span className="text-[11px] text-gray-400 block -mt-0.5 font-medium tracking-wide">
                GeeksforGeeks Student Chapter NIET
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold">
            <Link to="/" className={`transition-colors py-1 ${isActive('/') ? 'text-gfg-accent border-b-2 border-gfg-accent font-bold' : 'text-gray-300 hover:text-white'}`}>
              Home
            </Link>

            <Link to="/about" className={`transition-colors py-1 ${isActive('/about') ? 'text-gfg-accent border-b-2 border-gfg-accent font-bold' : 'text-gray-300 hover:text-white'}`}>
              About Us
            </Link>

            {/* Department Dropdown */}
            <div className="relative group py-1">
              <Link 
                to="/team" 
                className={`flex items-center space-x-1 transition-colors ${location.pathname.startsWith('/team') ? 'text-gfg-accent border-b-2 border-gfg-accent font-bold' : 'text-gray-300 hover:text-white'}`}
              >
                <span>Departments</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-transform group-hover:rotate-180" />
              </Link>

              <div className="absolute top-full left-0 mt-2 w-64 bg-dark-card border border-dark-border rounded-2xl shadow-2xl py-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                <Link to="/team" className="block px-4 py-2 text-xs font-bold text-gfg-accent uppercase tracking-wider hover:bg-dark-hover">
                  View All 7 Teams
                </Link>
                <div className="h-px bg-dark-border my-1"></div>
                {departmentsList.map((d) => (
                  <Link
                    key={d.slug}
                    to={`/team/${d.slug}`}
                    className="block px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-dark-hover transition-colors"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/events" className={`transition-colors py-1 ${isActive('/events') ? 'text-gfg-accent border-b-2 border-gfg-accent font-bold' : 'text-gray-300 hover:text-white'}`}>
              Events
            </Link>

            <Link to="/leaderboard" className={`flex items-center space-x-1.5 transition-colors py-1 ${isActive('/leaderboard') ? 'text-gfg-accent border-b-2 border-gfg-accent font-bold' : 'text-gray-300 hover:text-white'}`}>
              <Award className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </Link>

            {isExecutive() && (
              <Link to="/admin/analytics" className={`flex items-center space-x-1.5 transition-colors py-1 ${isActive('/admin/analytics') ? 'text-gfg-accent border-b-2 border-gfg-accent font-bold' : 'text-gray-300 hover:text-white'}`}>
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Analytics</span>
              </Link>
            )}
          </div>

          {/* TOP RIGHT CORNER: Prominent Login & Portal Access Button */}
          <div className="hidden sm:flex items-center space-x-4">
            <NotificationBell />

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={isExecutive() ? '/admin/dashboard' : '/dashboard'}
                  className="flex items-center space-x-2 bg-gfg-500 hover:bg-gfg-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xl shadow-gfg-500/25 transition-all hover:scale-105 border border-gfg-accent/30"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isExecutive() ? 'Admin Portal' : 'Member Dashboard'}</span>
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2.5 text-gray-400 hover:text-red-400 transition-colors rounded-xl bg-dark-card border border-dark-border hover:border-red-500/30"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative group inline-flex items-center space-x-2 bg-gradient-to-r from-gfg-600/30 via-gfg-500/20 to-dark-card border-2 border-gfg-accent/60 hover:border-gfg-accent text-white px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-gfg-500/20 hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4 text-gfg-accent group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">MEMBER LOGIN</span>
                <span className="w-2 h-2 rounded-full bg-gfg-accent animate-ping absolute -top-1 -right-1"></span>
              </Link>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center space-x-2">
            <NotificationBell />

            {!user && (
              <Link
                to="/login"
                className="bg-gfg-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white rounded-lg bg-dark-card border border-dark-border"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-dark-card border-b border-dark-border px-4 pt-3 pb-6 space-y-3 font-medium">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gfg-accent text-sm font-semibold">Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gfg-accent text-sm font-semibold">About Chapter</Link>
          <Link to="/team" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gfg-accent text-sm font-semibold">Departments & Team</Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-gfg-accent text-sm font-semibold">Events & Hackathons</Link>
          <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-400 text-sm font-semibold">Universal Leaderboard</Link>
          
          <div className="pt-3 border-t border-dark-border">
            {user ? (
              <Link
                to={isExecutive() ? '/admin/dashboard' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 bg-gfg-500 text-white py-3 rounded-xl font-bold text-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open {isExecutive() ? 'Admin' : 'Member'} Portal</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 bg-gfg-500 border border-gfg-accent text-white py-3 rounded-xl font-extrabold text-xs shadow-xl"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Member Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
