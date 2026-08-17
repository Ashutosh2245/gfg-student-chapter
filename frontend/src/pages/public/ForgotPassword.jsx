import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request Code, 2: Reset Password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authAPI.forgotPassword({ email });
      if (res.data.success) {
        setMessage(res.data.message);
        if (res.data.resetCode) {
          setResetCode(res.data.resetCode);
        }
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authAPI.resetPassword({ email, resetCode, newPassword });
      if (res.data.success) {
        setMessage('Password reset successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password. Check your reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        
        <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-gfg-accent font-mono">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Login</span>
        </Link>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Reset Account Password</h2>
          <p className="text-xs text-gray-400">
            {step === 1 ? 'Enter your authorized email to generate a reset security code.' : 'Enter your reset code and choose a new password.'}
          </p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl space-y-6">
          
          {message && (
            <div className="p-3.5 rounded-xl bg-gfg-500/10 border border-gfg-500/30 text-gfg-accent text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Registered Email Address</label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gfg-500 hover:bg-gfg-hover text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-gfg-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? 'Generating Code...' : 'Get Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">6-Digit Reset Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 849201"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-white font-mono text-sm text-center tracking-widest focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">New Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gfg-500 hover:bg-gfg-hover text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-gfg-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Reset Password & Login'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
