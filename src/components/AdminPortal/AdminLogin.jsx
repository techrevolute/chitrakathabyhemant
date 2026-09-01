import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { BUSINESS_INFO } from '../../data/initialData';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('clicksbyhemant5564@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Supabase production backend is not configured.');
      setLoading(false);
      return;
    }

    try {
      // Authenticate directly against Supabase Auth (Single Source of Truth)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (error) {
        console.error('Supabase Auth error:', error.message);
        setErrorMsg(error.message || 'Invalid email or password. Please check your Supabase credentials.');
        setLoading(false);
        return;
      }

      if (data && data.user) {
        onLoginSuccess({
          email: data.user.email,
          id: data.user.id,
          role: data.user.role || 'Administrator',
          name: data.user.user_metadata?.name || BUSINESS_INFO.owner,
          session: data.session,
          rememberMe
        });
      }
    } catch (err) {
      console.error('Login exception:', err);
      setErrorMsg(err.message || 'Login failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotStatus('Sending reset link...');

    try {
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim());
        if (error) {
          setForgotStatus(`Error: ${error.message}`);
        } else {
          setForgotStatus('Password reset link sent to your email!');
          setTimeout(() => {
            setForgotModalOpen(false);
            setForgotStatus('');
          }, 3000);
        }
      }
    } catch (err) {
      setForgotStatus('Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#141414] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8B0000]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#1C1C1C] rounded-3xl p-8 border border-stone-800 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src={`${import.meta.env.BASE_URL || '/'}assets/chitrakatha_logo.png`.replace(/\/+/g, '/')}
            alt="Chitrakatha Logo"
            className="h-16 w-auto object-contain mx-auto filter drop-shadow-lg"
          />

          <h2 className="font-serif text-3xl font-bold tracking-tight text-white mt-3">
            Admin CMS Login
          </h2>

          <p className="text-xs text-stone-400 font-light">
            Chitrakatha by Hemant — Authorized Administrator Access Only
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white focus:outline-none focus:border-[#8B0000]"
                placeholder="Clicksbyhemant5564@gmail.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Password</label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white focus:outline-none focus:border-[#8B0000]"
                placeholder="Enter Supabase Admin Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#8B0000] rounded"
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          {/* Login Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating with Supabase...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full text-center text-xs text-stone-400 hover:text-white pt-2 block"
            >
              ← Back to Main Portfolio Website
            </button>
          </div>

        </form>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1C1C1C] rounded-3xl p-6 max-w-sm w-full border border-stone-800 space-y-4">
            <h3 className="font-serif text-xl font-bold">Reset Password</h3>
            <p className="text-xs text-stone-400">Enter your registered admin email to receive reset instructions.</p>
            
            {forgotStatus ? (
              <div className="p-3 bg-emerald-950 text-emerald-300 text-xs rounded-xl text-center">
                {forgotStatus}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="clicksbyhemant5564@gmail.com"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#8B0000] text-white text-xs font-semibold"
                  >
                    Send Link
                  </button>
                  <button
                    type="button"
                    onClick={() => { setForgotModalOpen(false); setForgotStatus(''); }}
                    className="flex-1 py-2.5 rounded-full bg-stone-800 text-stone-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
