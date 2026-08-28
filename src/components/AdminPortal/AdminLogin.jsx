import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Camera, KeyRound, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/initialData';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('Clicksbyhemant5564@gmail.com');
  const [password, setPassword] = useState('chitrkathabyhemant');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Authentication check for Hemant Mandawade Admin Credentials
    const cleanEmail = email.trim().toLowerCase();
    const targetEmail = 'clicksbyhemant5564@gmail.com';
    const targetPass = 'chitrkathabyhemant';

    if ((cleanEmail === targetEmail || cleanEmail === 'admin@chitrakathabyhemant.com') && password === targetPass) {
      onLoginSuccess({
        email,
        name: BUSINESS_INFO.owner,
        role: 'Administrator',
        rememberMe
      });
    } else if (password !== targetPass) {
      setErrorMsg('Invalid password. Default password is: chitrkathabyhemant');
    } else {
      onLoginSuccess({
        email,
        name: BUSINESS_INFO.owner,
        role: 'Administrator',
        rememberMe
      });
    }
  };

  const handleDemoLogin = () => {
    setEmail('Clicksbyhemant5564@gmail.com');
    setPassword('chitrkathabyhemant');
    onLoginSuccess({
      email: 'Clicksbyhemant5564@gmail.com',
      name: BUSINESS_INFO.owner,
      role: 'Administrator',
      rememberMe: true
    });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModalOpen(false);
    }, 2000);
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
                placeholder="chitrkathabyhemant"
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
              className="w-full py-3.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>1-Click Quick Admin Login</span>
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
            
            {forgotSuccess ? (
              <div className="p-3 bg-emerald-950 text-emerald-300 text-xs rounded-xl text-center">
                Reset link sent to Clicksbyhemant5564@gmail.com!
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Clicksbyhemant5564@gmail.com"
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
                    onClick={() => setForgotModalOpen(false)}
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
