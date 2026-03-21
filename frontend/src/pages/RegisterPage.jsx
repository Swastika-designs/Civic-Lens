import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (!agreed) return toast.error('Please accept Terms and Conditions');
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      toast.success('Account created! Welcome to CivicLens.');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-primary p-10 text-white">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Building size={22} /> CivicLens
        </div>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">Empower your<br />community.</h2>
          <p className="text-white/70 mb-6">Report local issues, track progress in real-time, and collaborate with neighbors to build a better city.</p>
          <div className="space-y-2">
            {['Quick Reporting — Submit issues in seconds.', 'Transparent Tracking — Follow reports to resolution.'].map(f => (
              <div key={f} className="flex items-center gap-2 text-white/80 text-sm">
                <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-xs">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-orange-50">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-gray-500 mb-8">Join thousands of citizens making a difference.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="John Doe" value={form.fullName}
                  onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                  className="input pl-9" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="name@example.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input pl-9" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input pl-9 pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" placeholder="••••••••" value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="input pl-9" required />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="accent-primary mt-0.5" />
              I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <span className="spinner" /> : 'Sign Up'}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">OR JOIN WITH</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary text-sm py-2.5">G Google</button>
            <button className="btn-secondary text-sm py-2.5">f Facebook</button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
