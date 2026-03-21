import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, CheckCircle, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-primary">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Shield size={20} />
          <span>CIVIC LENS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white/80 hover:text-white text-sm">Home</Link>
          <Link to="/" className="text-white/80 hover:text-white text-sm">How it Works</Link>
          <Link to="/login" className="border border-white text-white px-4 py-1.5 rounded-full text-sm hover:bg-white hover:text-primary transition-colors">Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-primary text-white px-8 py-20 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 rounded-full p-3">
            <Shield size={32} />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Smart City Issue<br />Reporting Platform
        </h1>
        <p className="text-white/80 max-w-lg mx-auto mb-8">
          Report civic issues, track resolutions, and build a better city together. Empowering citizens through technology.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
            Sign In
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-2xl mx-auto -mt-8 px-6">
        <div className="bg-white rounded-2xl shadow-card p-6 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '247', label: 'Issues Reported', color: 'text-primary' },
            { value: '182', label: 'Resolved', color: 'text-green-500' },
            { value: '73%', label: 'Resolution Rate', color: 'text-primary' },
          ].map(({ value, label, color }) => (
            <div key={label}>
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-gray-500 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section className="px-8 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-primary mb-2">How It Works</h2>
        <div className="w-12 h-1 bg-primary mx-auto rounded mb-10" />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: MapPin, title: 'Report Issues', desc: 'Snap a photo, pin a location, and report civic issues in seconds. Our smart tagging system ensures it reaches the right department.' },
            { icon: CheckCircle, title: 'Track Progress', desc: 'Follow your reports through every stage from submission to resolution. Get real-time updates on your dashboard.' },
            { icon: Users, title: 'Resolve Together', desc: 'Authorities address issues and notify you. Stay informed about community improvements in your local area.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-primary/10 rounded-full p-3">
                  <Icon size={24} className="text-primary" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white px-8 py-16 text-center mx-6 rounded-3xl mb-16">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 rounded-full p-3"><Users size={28} /></div>
        </div>
        <h2 className="text-3xl font-extrabold mb-3">Ready to make a difference?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">Join thousands of citizens improving their city. It only takes 30 seconds to sign up.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="bg-primary-800 text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-900 transition-colors flex items-center justify-center gap-2">
            Citizen Login / Sign Up <ArrowRight size={16} />
          </Link>
          <Link to="/admin/login" className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-full hover:border-white transition-colors flex items-center justify-center gap-2">
            <Shield size={16} /> Authority Login
          </Link>
        </div>
        <p className="text-white/50 text-xs mt-3">For city officials, maintenance teams, and emergency responders.</p>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm border-t">
        <div className="flex items-center justify-center gap-1 mb-2 text-primary font-bold">
          <Shield size={14} /> CIVIC LENS
        </div>
        <div className="flex justify-center gap-4 mb-2">
          <a href="#" className="hover:text-gray-600">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600">Terms of Service</a>
          <a href="#" className="hover:text-gray-600">Contact Support</a>
        </div>
        <p>© 2024 CivicLens. All rights reserved.</p>
      </footer>
    </div>
  );
}
