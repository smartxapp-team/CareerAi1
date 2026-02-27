/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Building2,
  MapPin,
  Search,
  Briefcase,
  TrendingUp,
  Award,
  Star,
  ChevronRight,
  ArrowRight,
  Target,
  BarChart3,
  LayoutDashboard,
  Zap,
  Cpu,
  Brain,
  Globe,
  Upload,
  ShieldCheck,
  Sparkles,
  Map as MapIcon,
  ArrowUpRight,
  X,
  Menu,
  FileText,
  UserCheck,
  Filter,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Theme Context ---
export const ThemeContext = createContext<{ isDark: boolean; toggleTheme: () => void }>({
  isDark: true,
  toggleTheme: () => { },
});
export const useTheme = () => useContext(ThemeContext);

// --- Types ---
type Page = 'home' | 'dashboard' | 'jobs' | 'predictor' | 'map' | 'upload';

// --- Profile Panel Component ---
const ProfilePanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-80 max-w-full z-[70] flex flex-col overflow-y-auto"
            style={{
              background: isDark ? 'rgba(10,5,20,0.97)' : 'rgba(248,245,255,0.98)',
              borderLeft: isDark ? '1px solid rgba(147,51,234,0.2)' : '1px solid rgba(147,51,234,0.15)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(147,51,234,0.12)' }}>
              <span className="text-lg font-bold" style={{ color: isDark ? '#fff' : '#1e1b4b' }}>Profile</span>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: isDark ? '#94a3b8' : '#5b4a96' }}>
                <X size={18} />
              </button>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center pt-10 pb-8 px-6 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(147,51,234,0.12)' }}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
                <User size={36} className="text-white" />
              </div>
              <p className="font-bold text-lg" style={{ color: isDark ? '#fff' : '#1e1b4b' }}>Guest User</p>
              <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#7c6caf' }}>Explore CareerAI</p>
            </div>

            {/* Theme Toggle */}
            <div className="px-6 py-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: isDark ? '#64748b' : '#9333ea' }}>Appearance</p>
              <div
                className="flex rounded-2xl p-1.5 gap-1"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(147,51,234,0.08)', border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(147,51,234,0.2)' }}
              >
                {/* Dark */}
                <button
                  onClick={() => { if (!isDark) toggleTheme(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${isDark
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                  style={!isDark ? { color: '#7c6caf' } : {}}
                >
                  <Moon size={16} /> Dark
                </button>
                {/* Light */}
                <button
                  onClick={() => { if (isDark) toggleTheme(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${!isDark
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : ''
                    }`}
                  style={isDark ? { color: '#94a3b8' } : {}}
                >
                  <Sun size={16} /> Light
                </button>
              </div>

              <p className="text-xs mt-4 text-center" style={{ color: isDark ? '#475569' : '#9333ea' }}>
                {isDark ? '🌙 Dark mode is active' : '☀️ Light mode is active'}
              </p>
            </div>

            {/* Info */}
            <div className="mt-auto px-6 pb-8">
              <div className="p-4 rounded-2xl" style={{ background: isDark ? 'rgba(147,51,234,0.1)' : 'rgba(147,51,234,0.07)', border: '1px solid rgba(147,51,234,0.2)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#9333ea' }}>CareerAI Platform</p>
                <p className="text-xs" style={{ color: isDark ? '#64748b' : '#7c6caf' }}>AI-powered job discovery & career guidance.</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Components ---

const Navbar = ({ activePage, setActivePage, onProfileClick }: { activePage: Page; setActivePage: (p: Page) => void; onProfileClick: () => void }) => {
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string, id: Page, icon: React.ReactNode }[] = [
    { label: 'Dashboard', id: 'dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Jobs', id: 'jobs', icon: <Briefcase size={18} /> },
    { label: 'Predictor', id: 'predictor', icon: <Target size={18} /> },
    { label: 'Map', id: 'map', icon: <MapIcon size={18} /> },
    { label: 'Upload', id: 'upload', icon: <Upload size={18} /> },
  ];

  // Only show the pill navbar if not on the home page
  if (activePage === 'home') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6">
      <div
        className="relative flex items-center justify-between px-3 py-2 rounded-full shadow-lg border"
        style={{
          background: isDark ? 'rgba(10,5,20,0.8)' : 'rgba(248,245,255,0.8)',
          borderColor: isDark ? 'rgba(147,51,234,0.2)' : 'rgba(147,51,234,0.15)',
          backdropFilter: 'blur(24px)',
          width: 'fit-content',
          maxWidth: 'calc(100% - 2rem)',
        }}
      >
        {/* Logo - Elevated white card on left */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer"
          style={{
            background: isDark ? '#1e1b4b' : '#fff',
            border: `1px solid ${isDark ? 'rgba(147,51,234,0.3)' : 'rgba(147,51,234,0.1)'}`,
          }}
          onClick={() => setActivePage('home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={24} className="text-purple-500" />
        </motion.div>

        {/* Navigation Items (Desktop) */}
        <div className="hidden md:flex items-center gap-4 pl-12 pr-4">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activePage === item.id ? 'shadow-md' : ''}`}
              style={{
                color: activePage === item.id ? (isDark ? '#fff' : '#1e1b4b') : (isDark ? '#94a3b8' : '#5b4a96'),
                background: activePage === item.id ? (isDark ? 'linear-gradient(to bottom right, #8b5cf6, #d946ef)' : 'linear-gradient(to bottom right, #a78bfa, #e879f9)') : 'transparent',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activePage === item.id && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{
                    background: isDark ? 'linear-gradient(to bottom right, #8b5cf6, #d946ef)' : 'linear-gradient(to bottom right, #a78bfa, #e879f9)',
                    boxShadow: isDark ? '0 4px 15px rgba(147,51,234,0.4)' : '0 4px 15px rgba(147,51,234,0.2)',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-1">
                {item.icon} {item.label}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Profile Button (Desktop) */}
        <motion.button
          onClick={onProfileClick}
          className="hidden md:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-colors ml-4"
          style={{
            color: isDark ? '#94a3b8' : '#5b4a96',
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(147,51,234,0.08)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(147,51,234,0.2)'}`,
          }}
          whileHover={{ scale: 1.05, borderColor: isDark ? 'rgba(147,51,234,0.5)' : 'rgba(147,51,234,0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          <User size={18} /> Profile
        </motion.button>

        {/* Mobile Menu Toggle */}
        <button
          style={{ color: isDark ? '#fff' : '#1e1b4b' }}
          className="md:hidden ml-16 px-3 py-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 p-3 md:hidden flex flex-col gap-1"
            style={{
              background: isDark ? 'rgba(10,5,20,0.97)' : 'rgba(248,245,255,0.97)',
              borderBottom: `1px solid ${isDark ? 'rgba(147,51,234,0.15)' : 'rgba(147,51,234,0.12)'}`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-left transition-all"
                  style={{
                    background: isActive
                      ? (isDark ? 'linear-gradient(to right, #8b5cf6, #d946ef)' : 'linear-gradient(to right, #a78bfa, #e879f9)')
                      : 'transparent',
                    color: isActive ? '#fff' : (isDark ? '#94a3b8' : '#5b4a96'),
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
            <div className="h-px my-1" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(147,51,234,0.1)' }} />
            <button
              onClick={() => { onProfileClick(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold"
              style={{ color: isDark ? '#94a3b8' : '#5b4a96' }}
            >
              <User size={16} /> Profile
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AnimatedBall = () => (
  <div className="relative w-full h-full">
    {/* Pipe System */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
      <path
        d="M 50 50 L 350 50 L 350 350 L 50 350 Z"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M 50 50 L 350 50 L 350 350 L 50 350 Z"
        fill="none"
        stroke="rgba(168,85,247, 0.3)"
        strokeWidth="2"
      />
    </svg>

    {/* The Animated Ball */}
    <div className="absolute top-[40px] left-[40px] w-5 h-5 bg-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-roll z-20" />

    {/* Complex Structure Elements */}
    <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-white/10 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-4 border-purple-600/20 rounded-full animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

    {/* Speech Bubbles */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="absolute top-10 right-10 dark-glass p-4 rounded-2xl shadow-2xl max-w-[200px] z-30"
    >
      <p className="text-sm font-medium text-white">Ready to find your dream job with AI?</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute top-1/2 right-0 bg-purple-600 p-4 rounded-2xl shadow-2xl max-w-[150px] z-30"
    >
      <p className="text-sm font-bold text-white">Absolutely!</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2 }}
      className="absolute bottom-20 left-1/2 dark-glass p-4 rounded-2xl shadow-2xl max-w-[250px] z-30"
    >
      <p className="text-sm font-medium text-white">Hi, this is CareerAI! Would you like to see your future path?</p>
    </motion.div>

    {/* Glowing Orbs */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-glow" />
  </div>
);

const Hero = ({ onFindJobs, onPredict, onDashboard }: { onFindJobs: () => void, onPredict: () => void, onDashboard: () => void }) => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-dark-bg">
    {/* Background Glows */}
    <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px] -z-10" />
    <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-fuchsia-900/10 rounded-full blur-[150px] -z-10" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h1 className="text-6xl lg:text-8xl font-display font-bold text-white leading-[1.05] mb-8">
            25% Higher Placement Rate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 nova-glow-text">Guaranteed.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-12">
            AI-Driven. It's why we lead. See why the most innovative talent teams add AI to search, candidate-specific recommendations and two-way matching on top of conventional job boards. You won't go back.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md mb-12">
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 text-xs font-bold">AI+</div>
              <input
                type="text"
                placeholder="Enter your main skill..."
                className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 w-full"
              />
            </div>
            <button
              onClick={onPredict}
              className="px-8 py-4 rounded-2xl font-bold gradient-btn flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Analyze Careers <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-dark-bg overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i + 10}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              <span className="text-white font-bold">10k+</span> professionals already using CareerAI
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative aspect-square lg:h-[600px]"
        >
          <AnimatedBall />
        </motion.div>
      </div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    { icon: <Search className="text-purple-400" />, title: "Automated Job Discovery", desc: "AI scans thousands of sources to find the perfect match for you." },
    { icon: <ShieldCheck className="text-emerald-400" />, title: "Verified Job Listings", desc: "Every job is vetted by our AI to ensure legitimacy and safety." },
    { icon: <FileText className="text-indigo-400" />, title: "Resume-Based Matching", desc: "Upload your resume and let AI find roles that fit your experience." },
    { icon: <UserCheck className="text-orange-400" />, title: "Fake Job Detection", desc: "Proprietary algorithms flag suspicious postings before you apply." },
    { icon: <Target className="text-rose-400" />, title: "Career Path Predictor", desc: "Visualize your future growth based on current market trends." },
    { icon: <BarChart3 className="text-violet-400" />, title: "Hiring Demand Trends", desc: "Stay ahead with real-time data on which skills are gaining value." },
  ];

  return (
    <section className="py-24 bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 nova-glow-text">CareerAI?</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">We use cutting-edge artificial intelligence to transform the job search from a chore into a strategic advantage.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 nova-card hover:bg-white/10 hover:border-purple-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/dashboard')
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
      })
      .catch(console.error);
  }, []);

  if (!dashboardData) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { quick_stats, trending_jobs, hiring_companies, demanding_skills, recent_jobs } = dashboardData;

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h2 className="text-4xl font-display font-bold text-white mb-2">Job Market Dashboard</h2>
        <p className="text-slate-400">Real-time analytics and trends across the global job market.</p>
      </div>

      {/* Section 0: Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: "Total Jobs Analyzed", value: quick_stats.total_jobs, icon: <Briefcase size={20} className="text-purple-400" /> },
          { label: "Top Demand Skill", value: quick_stats.top_skill, icon: <LayoutDashboard size={20} className="text-emerald-400" /> },
          { label: "Top Hiring Company", value: quick_stats.top_company, icon: <Building2 size={20} className="text-blue-400" /> },
          { label: "Most Required Role", value: quick_stats.top_role, icon: <Target size={20} className="text-orange-400" /> },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md nova-card"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1 truncate" title={String(stat.value)}>{stat.value}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Section 1: Trending Jobs */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="text-purple-500" size={24} />
          <h3 className="text-2xl font-bold text-white">Trending Jobs</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {trending_jobs.slice(0, 3).map((job: any, i: number) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md p-8 rounded-[32px] nova-card border border-white/10 flex flex-col items-center text-center group transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Briefcase size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{job.title}</h4>
              <p className="text-3xl font-bold text-purple-500 mb-4">{job.count}</p>
              <p className="text-sm text-slate-500 mb-4 uppercase tracking-widest font-bold">Openings</p>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-sm font-bold text-slate-300">Trend: Growing</span>
                <ArrowUpRight className="text-emerald-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 2: Top Hiring Companies */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-8">
          <Building2 className="text-purple-500" size={24} />
          <h3 className="text-2xl font-bold text-white">Top Hiring Companies</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hiring_companies.slice(0, 4).map((company: any, i: number) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.03 }}
              className="bg-white/5 backdrop-blur-md p-6 rounded-3xl nova-card border border-white/10 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Building2 size={26} />
              </div>
              <h4 className="text-base font-bold text-white mb-1 truncate w-full px-2" title={company.name}>{company.name}</h4>
              <p className="text-purple-400 text-sm font-bold">{company.jobs} Jobs Available</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Most Demanding Skills */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-8">
          <Cpu className="text-purple-500" size={24} />
          <h3 className="text-2xl font-bold text-white">Most Demanding Skills</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {demanding_skills.slice(0, 4).map((skill: any, i: number) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.03 }}
              className="bg-white/5 backdrop-blur-md p-6 rounded-3xl nova-card border border-white/10 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-4 group-hover:bg-fuchsia-600 group-hover:text-white transition-all">
                <Cpu size={26} />
              </div>
              <h4 className="text-base font-bold text-white mb-1">{skill.skill}</h4>
              <p className="text-fuchsia-400 text-sm font-bold">Required in {skill.count} Jobs</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: Recent Jobs */}
      <section>
        <div className="flex items-center gap-2 mb-8">
          <MapPin className="text-purple-500" size={24} />
          <h3 className="text-2xl font-bold text-white">Recently Detected Jobs</h3>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden nova-card">
          <div className="hidden md:grid grid-cols-3 gap-4 px-6 py-4 bg-white/5 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div>Job Title</div>
            <div>Company</div>
            <div>Location</div>
          </div>
          <div className="divide-y divide-white/10">
            {recent_jobs.map((job: any, i: number) => (
              <div key={i} className="grid md:grid-cols-3 gap-4 px-6 py-5 hover:bg-white/5 transition-colors items-center">
                <div className="font-bold text-white">{job.title}</div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Building2 size={16} className="text-slate-500" />
                  {job.company}
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin size={16} className="text-slate-500" />
                  {job.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const JobsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedJobIndex, setExpandedJobIndex] = useState<number | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/jobs')
      .then(res => res.json())
      .then(data => {
        // Mock some extra fields since backend is simple
        const enhancedJobs = data.map((job: any) => ({
          ...job,
          description: `Join ${job.company} as a ${job.title} and help us build amazing products.`,
          responsibilities: [
            "Develop and maintain scalable applications",
            "Collaborate with cross-functional teams",
          ],
          salary: "₹8L - ₹15L"
        }));
        setJobs(enhancedJobs);
      })
      .catch(console.error);
  }, []);



  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterSections = [
    {
      title: "Skills",
      options: ["Java", "Python", "SQL", "React", "Spring Boot"]
    },
    {
      title: "Location",
      options: ["Hyderabad", "Bangalore", "Chennai", "Remote"]
    },
    {
      title: "Job Role",
      options: ["Software Developer", "Backend Developer", "Data Analyst", "Web Developer"]
    },
    {
      title: "Experience",
      options: ["Fresher", "1–2 Years", "3–5 Years"]
    }
  ];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h2 className="text-4xl font-display font-bold text-white mb-2">Job Search</h2>
        <p className="text-slate-400">Find your next career move with AI-powered matching.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SIDE: Filter Panel */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 nova-card sticky top-32">
            <div className="flex items-center gap-2 mb-8 text-white font-bold text-xl">
              <Filter size={20} className="text-purple-500" />
              Filters
            </div>

            <div className="space-y-8">
              {filterSections.map((section) => (
                <div key={section.title}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">
                    {section.title}
                  </label>
                  <div className="space-y-3">
                    {section.options.map(option => (
                      <label key={option} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer appearance-none w-5 h-5 rounded-md border border-white/10 bg-white/5 checked:bg-purple-600 checked:border-purple-600 transition-all cursor-pointer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span className="group-hover:text-white transition-colors">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col gap-3">
              <button className="w-full py-3 rounded-xl text-sm font-bold bg-purple-600 text-white hover:bg-fuchsia-600 transition-colors shadow-lg shadow-purple-600/20">
                Apply Filters
              </button>
              <button className="w-full py-3 rounded-xl text-sm font-bold border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Reset Filters
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: Job Results */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or company..."
              className="w-full pl-14 pr-6 py-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-xl"
            />
          </div>

          <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-10 items-start">
            {filteredJobs.map((job, i) => {
              const isExpanded = expandedJobIndex === i;

              // Determine a random "Posted" text based on index for variety
              const postedText = i % 3 === 0 ? "POSTED TODAY" : i % 2 === 0 ? "POSTED YESTERDAY" : "POSTED 3 DAYS AGO";

              // Determine accent color for variety
              const colors = [
                { bg: "bg-purple-900/40", border: "border-purple-500/30", text: "text-purple-300", tagBorder: "border-purple-500/30", tagText: "text-purple-400", iconBg: "bg-purple-500/20" },
                { bg: "bg-blue-900/40", border: "border-blue-500/30", text: "text-blue-300", tagBorder: "border-blue-500/30", tagText: "text-blue-400", iconBg: "bg-blue-500/20" },
                { bg: "bg-emerald-900/40", border: "border-emerald-500/30", text: "text-emerald-300", tagBorder: "border-emerald-500/30", tagText: "text-emerald-400", iconBg: "bg-emerald-500/20" },
                { bg: "bg-orange-900/40", border: "border-orange-500/30", text: "text-orange-300", tagBorder: "border-orange-500/30", tagText: "text-orange-400", iconBg: "bg-orange-500/20" }
              ];
              const theme = colors[i % colors.length];

              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setExpandedJobIndex(isExpanded ? null : i)}
                  className={`relative cursor-pointer group flex flex-col ${isExpanded ? 'xl:col-span-2' : ''}`}
                >
                  {/* Backdrop / Stack Layer */}
                  <div className={`absolute inset-x-0 bottom-0 top-10 rounded-[32px] ${theme.bg} ${theme.border} flex items-end justify-center pb-4 transition-all duration-300 shadow-xl group-hover:brightness-110`}>
                    <span className={`${theme.text} text-[11px] font-bold uppercase tracking-widest`}>{postedText}</span>
                  </div>

                  {/* Front Card */}
                  <div className={`relative z-10 rounded-[32px] bg-slate-900 border border-white/10 p-8 mb-12 shadow-2xl transition-all flex flex-col w-full h-full`}>
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-[14px] ${theme.iconBg} flex items-center justify-center border ${theme.border}`}>
                          <Building2 className={`${theme.tagText}`} size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-300 group-hover:text-white transition-colors">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400">
                        <MapPin size={12} /> {job.location}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-slate-400 font-medium text-lg">
                        {job.salary || "Competitive Salary"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className={`px-4 py-1.5 bg-transparent border ${theme.tagBorder} ${theme.tagText} rounded-xl text-xs font-bold uppercase tracking-wider`}>
                        FULL-TIME
                      </span>
                      {job.skills.slice(0, 3).map((skill: string) => (
                        <span key={skill} className={`px-4 py-1.5 bg-transparent border ${theme.tagBorder} ${theme.tagText} rounded-xl text-xs font-bold uppercase tracking-wider`}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 border-t border-white/10 mt-2 mb-2">
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                              {job.description}
                            </p>
                            {job.responsibilities && job.responsibilities.length > 0 && (
                              <>
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Key Responsibilities</h4>
                                <ul className="space-y-2 mb-6">
                                  {job.responsibilities.map((resp: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                                      <div className={`w-1.5 h-1.5 rounded-full ${theme.iconBg} mt-1.5 shrink-0`} />
                                      {resp}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}

                            <div className="flex gap-3 pt-6 border-t border-white/10">
                              <button
                                className="px-6 py-3 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedJobIndex(isExpanded ? null : i);
                                }}
                              >
                                Show Less
                              </button>
                              <a
                                href={job.link || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 rounded-xl text-sm font-bold bg-purple-600 text-white hover:bg-fuchsia-600 transition-colors shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Apply Now
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!isExpanded && (
                      <div className="mt-auto pt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Click to expand</span>
                        <ArrowRight size={16} className={`${theme.tagText}`} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

const PredictorPage = () => {
  const [skill, setSkill] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [paths, setPaths] = useState<any[]>([]);

  const generatePath = () => {
    fetch('http://127.0.0.1:5000/career', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill })
    })
      .then(res => res.json())
      .then(data => {
        setPaths(data.career_paths);
        setShowResults(true);
      })
      .catch(console.error);
  };

  return (
    <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold text-white mb-4">AI Career Path Predictor</h2>
        <p className="text-slate-400">Enter your core skill and let AI map out your potential career trajectories.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <div className="flex gap-4">
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Enter your main skill (Example: Java)"
            className="flex-1 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm"
          />
          <button
            onClick={generatePath}
            className="px-8 py-4 rounded-2xl font-bold gradient-btn"
          >
            Generate
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 relative"
          >
            {/* Flowchart Layout */}
            <div className="flex flex-col items-center gap-12 relative w-full overflow-x-auto pb-4">
              {/* Root Node */}
              <div className="px-12 py-5 rounded-2xl bg-purple-600 text-white font-bold shadow-[0_0_30px_rgba(168,85,247,0.4)] text-2xl z-20 relative border border-purple-400/50">
                {skill || 'Java'}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-0.5 h-10" style={{ background: 'linear-gradient(to bottom, #9333ea, rgba(147,51,234,0.3))' }} />
              </div>

              {/* Dynamic Connecting Horizontal Line */}
              {paths.length > 1 && (
                <div className="relative w-full mb-4 z-10">
                  <div
                    className="absolute top-0 h-0.5"
                    style={{
                      left: `calc(${100 / (paths.length * 2)}%)`,
                      right: `calc(${100 / (paths.length * 2)}%)`,
                      background: 'linear-gradient(to right, rgba(147,51,234,0.3), #9333ea 30%, #c026d3 70%, rgba(192,38,211,0.3))'
                    }}
                  />
                </div>
              )}

              <div className="flex flex-row justify-center gap-8 w-full min-w-max px-4">
                {paths.map((path, i) => (
                  <div key={i} className="flex flex-col items-center gap-6 relative w-72">
                    {/* Vertical Drop from Horizontal Bar */}
                    {paths.length > 1 && (
                      <div
                        className="absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-16"
                        style={{ background: 'linear-gradient(to bottom, #9333ea, #c026d3)' }}
                      />
                    )}

                    {/* Learn Step */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-6 py-4 rounded-xl bg-white/5 border border-white/20 shadow-lg text-sm font-semibold text-slate-200 z-10 w-full text-center hover:bg-white/10 transition-colors"
                    >
                      <span className="text-purple-400 block mb-1 text-xs uppercase tracking-widest">Learn</span>
                      {path.learn ? path.learn : "Core Skills"}
                    </motion.div>

                    {/* Connecting Vertical Line between Learn and Goal */}
                    <div className="w-0.5 h-8" style={{ background: 'linear-gradient(to bottom, #9333ea, #c026d3)' }} />

                    {/* Goal Step */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (i * 0.1) + 0.2 }}
                      whileHover={{ scale: 1.05, translateY: -5 }}
                      className="px-6 py-8 rounded-2xl bg-white/10 backdrop-blur-md text-white shadow-2xl w-full text-center border border-purple-500/30 hover:border-purple-400 group transition-all nova-card"
                    >
                      <p className="text-[10px] text-purple-300 font-bold uppercase tracking-widest mb-3 group-hover:text-purple-400">Career Goal</p>
                      <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 group-hover:from-purple-200 group-hover:to-fuchsia-200 transition-all">{path.role}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UploadPage = () => (
  <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-display font-bold text-white mb-4">Upload Resume</h2>
      <p className="text-slate-400">Get personalized job recommendations using our advanced AI matching engine.</p>
    </div>

    <motion.div
      whileHover={{ borderColor: '#2563eb' }}
      className="border-2 border-dashed border-white/10 rounded-[40px] p-16 bg-white/5 backdrop-blur-md nova-card flex flex-col items-center justify-center text-center cursor-pointer group transition-colors"
    >
      <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
        <Upload size={40} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">Drag & Drop Resume</h3>
      <p className="text-slate-500 mb-8 max-w-xs">Supports PDF, DOCX, and TXT files. Max file size 5MB.</p>
      <button className="px-10 py-4 rounded-2xl font-bold gradient-btn">
        Select File
      </button>
    </motion.div>

    <div className="mt-12 grid grid-cols-3 gap-6">
      {[
        { icon: <ShieldCheck size={20} />, text: "Secure & Private" },
        { icon: <Sparkles size={20} />, text: "AI Analysis" },
        { icon: <TrendingUp size={20} />, text: "Instant Matching" },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-2 text-slate-500">
          {item.icon}
          <span className="text-xs font-semibold uppercase tracking-wider">{item.text}</span>
        </div>
      ))}
    </div>
  </div>
);

const MapPage = () => (
  <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-4xl font-display font-bold text-white mb-2">Jobs Near You</h2>
        <p className="text-slate-400">Visualizing opportunities in your local area.</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 shadow-sm">
          List View
        </button>
        <button className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold shadow-md">
          Map View
        </button>
      </div>
    </div>

    <div className="relative h-[600px] rounded-[40px] overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 nova-card">
      {/* Mock Map Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-purple-400 shadow-2xl mb-6 animate-bounce border border-white/10">
          <MapIcon size={48} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Nearby job opportunities will appear here</h3>
        <p className="text-slate-500 max-w-md">Allow location access to see verified job listings in your immediate vicinity.</p>
        <button className="mt-8 px-8 py-4 rounded-2xl font-bold gradient-btn">
          Enable Location
        </button>
      </div>

      {/* Mock Map Markers */}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg" />
      <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg" />
      <div className="absolute top-1/2 right-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg" />
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDark, setIsDark] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // Apply theme class to <html> so CSS overrides work globally
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('light');
    } else {
      html.classList.add('light');
    }
  }, [isDark]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return (
        <>
          <Hero
            onFindJobs={() => setCurrentPage('jobs')}
            onPredict={() => setCurrentPage('predictor')}
            onDashboard={() => setCurrentPage('dashboard')}
          />
          <Features />
        </>
      );
      case 'dashboard': return <DashboardPage />;
      case 'jobs': return <JobsPage />;
      case 'predictor': return <PredictorPage />;
      case 'upload': return <UploadPage />;
      case 'map': return <MapPage />;
      default: return <Hero onFindJobs={() => setCurrentPage('jobs')} onPredict={() => setCurrentPage('predictor')} onDashboard={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(d => !d) }}>
      <div className="min-h-screen selection:bg-purple-200 selection:text-purple-900">
        <Navbar activePage={currentPage} setActivePage={setCurrentPage} onProfileClick={() => setProfileOpen(true)} />
        <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
