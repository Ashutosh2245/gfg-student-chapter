import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR'].includes(loggedUser.role)) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('gfgniet2026');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gfg-500/20 border border-gfg-500/40 flex items-center justify-center text-gfg-accent mx-auto shadow-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Management Portal Login</h2>
          <p className="text-xs text-gray-400">
            Internal access restricted to authorized GFG NIET chapter members.
          </p>
        </div>

        {/* Demo Quick Accounts */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2 text-xs">
          <span className="text-[11px] font-mono font-semibold text-gfg-accent uppercase tracking-wider block">Authorized Demo Shortcuts (Click to select role)</span>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <button
              onClick={() => fillQuickDemo('president@gfgniet.ac.in')}
              className="p-2 rounded bg-dark-bg border border-dark-border text-left hover:border-gfg-500 text-gray-300 hover:text-white transition-colors"
            >
              👑 President
            </button>
            <button
              onClick={() => fillQuickDemo('lead.tech@gfgniet.ac.in')}
              className="p-2 rounded bg-dark-bg border border-dark-border text-left hover:border-gfg-500 text-gray-300 hover:text-white transition-colors"
            >
              💻 Tech Lead
            </button>
            <button
              onClick={() => fillQuickDemo('colead.tech1@gfgniet.ac.in')}
              className="p-2 rounded bg-dark-bg border border-dark-border text-left hover:border-gfg-500 text-gray-300 hover:text-white transition-colors"
            >
              ⚡ Tech Co-Lead
            </button>
            <button
              onClick={() => fillQuickDemo('vp.tech@gfgniet.ac.in')}
              className="p-2 rounded bg-dark-bg border border-dark-border text-left hover:border-gfg-500 text-gray-300 hover:text-white transition-colors"
            >
              🚀 Vice President
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@gfgniet.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono text-gray-400">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-mono text-gfg-accent hover:underline flex items-center gap-1">
                  <KeyRound className="w-3 h-3" /> Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gfg-500 hover:bg-gfg-hover text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-gfg-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <p className="text-[11px] text-gray-500 text-center">
            Public signup is disabled. New accounts are generated exclusively by the Chapter President. Members can reset or update passwords via email or settings.
          </p>

        </div>

      </div>
    </div>
  );
};
