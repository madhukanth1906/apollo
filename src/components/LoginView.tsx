'use client';
import React, { useState } from 'react';
import { account } from '@/services/appwrite';
import { Shield, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { PakshyaLogo, EmblemOfIndia } from './BrandAssets';

export const LoginView: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create session via Appwrite SDK
      await account.createEmailPasswordSession(email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error('Login Failed', err);
      // For prototype: mock login if Appwrite not fully configured
      if (email === 'admin@sih.gov.in' || email === 'inspector@sih.gov.in') {
        onLoginSuccess();
      } else {
        setError(err.message || 'Invalid credentials or Appwrite not configured.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0a1f44] p-6 text-center text-white relative">
          <div className="flex justify-center mb-4">
            <EmblemOfIndia className="w-12 h-16" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">PAKSHYA Platform</h2>
          <p className="text-xs text-blue-200 mt-1">Legal Metrology Compliance System</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Official Email / ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm outline-none transition"
                  placeholder="inspector@sih.gov.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-sm rounded shadow flex items-center justify-center gap-2 transition mb-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          
          <button
            type="button"
            onClick={onLoginSuccess}
            className="w-full py-2.5 mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded shadow flex items-center justify-center gap-2 transition border border-slate-300"
          >
            Continue as Guest (Prototype Mode)
          </button>
        </form>
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-500 border-t border-slate-200">
          Govt. of India ?" Department of Consumer Affairs<br/>
          Use admin@sih.gov.in for Prototype Access
        </div>
      </div>
    </div>
  );
};
