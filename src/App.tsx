import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  Mail,
  Phone,
  Linkedin,
  Github,
  Menu,
  X,
  MapPin,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import OpenSource from './pages/OpenSource';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Open Source', path: '/open-source' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] mix-blend-difference px-6 py-8">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link to="/" className="font-mono text-xs tracking-tighter">
            MUNEER.ARCHITECT <span className="text-white/40">/ ARCHITECTURE & AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-12 items-center text-[10px] uppercase tracking-[0.2em] font-mono">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-white/60 transition-colors ${location.pathname === link.path ? 'text-white' : 'text-white/40'}`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="#intake"
              className="ml-4 px-5 py-2.5 border border-white/20 text-white/60 hover:border-white/60 hover:text-white transition-all duration-300"
            >
              Inquire
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-onyx p-12 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs tracking-tighter">MENU</span>
              <button onClick={() => setIsOpen(false)}><X className="w-8 h-8" /></button>
            </div>

            <div className="flex flex-col gap-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-5xl font-medium tracking-tighter hover:text-white/60 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-white/40">
              <a href="https://linkedin.com/in/muneer-p-5052b6128">LinkedIn</a>
              <a href="https://github.com/muneerpp3333">GitHub</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-onyx text-white font-sans selection:bg-white selection:text-black">
        <Nav />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/open-source" element={<OpenSource />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>

        {/* ═══════════════════════ INTAKE SECTION ═══════════════════════ */}
        <section id="intake" className="py-32 px-6 border-t border-white/10 mt-32">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/40">Engage</span>
            </div>

            <div className="grid md:grid-cols-2 gap-24">
              {/* Left Column */}
              <div>
                <h2 className="text-4xl md:text-5xl font-medium mb-8 tracking-tight text-balance leading-[1.1]">
                  Start a<br />Conversation.
                </h2>
                <p className="text-white/50 text-lg leading-relaxed max-w-md mb-12">
                  For teams building at scale: SaaS platforms, agentic AI systems, and enterprise mobile infrastructure. Scope and fit are evaluated before any engagement begins.
                </p>

                {/* Availability Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-3 border border-white/10 bg-white/[0.02] mb-12">
                  <div className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
                  <span className="text-[10px] uppercase tracking-[0.15em] font-mono text-white/50">
                    Limited availability · Q3 / Q4 2026
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-5 text-white/50 font-mono text-sm">
                  <a href="mailto:muneer.pp@outlook.com" className="flex items-center gap-4 hover:text-white transition-colors">
                    <Mail className="w-4 h-4 text-white/30" />
                    <span>muneer.pp@outlook.com</span>
                  </a>
                  <a href="tel:+971524013333" className="flex items-center gap-4 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-white/30" />
                    <span>+971-524013333</span>
                  </a>
                  <div className="flex items-center gap-4 text-white/30">
                    <MapPin className="w-4 h-4" />
                    <span className="text-white/50">Dubai, UAE</span>
                  </div>
                  <div className="flex gap-8 pt-8 border-t border-white/10">
                    <a href="https://linkedin.com/in/muneer-p-5052b6128" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                    <a href="https://github.com/muneerpp3333" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column — Intake Form */}
              <div className="bg-white/[0.03] p-10 md:p-12 border border-white/10">
                {!submitted ? (
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Jane Smith"
                          className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="jane@company.com"
                          className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Company / Organization</label>
                      <input
                        type="text"
                        placeholder="Acme Corp"
                        className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Project Scope</label>
                      <select className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors appearance-none cursor-pointer text-white/60">
                        <option value="" className="bg-[#050505]">Select engagement type</option>
                        <option value="saas" className="bg-[#050505]">SaaS Architecture & Platform Engineering</option>
                        <option value="ai" className="bg-[#050505]">Agentic AI & LLM Integration</option>
                        <option value="mobile" className="bg-[#050505]">Enterprise Mobile Commerce</option>
                        <option value="advisory" className="bg-[#050505]">Technical Advisory / Fractional CTO</option>
                        <option value="build" className="bg-[#050505]">Full Product Build</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Budget Minimum (USD)</label>
                      <select className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors appearance-none cursor-pointer text-white/60">
                        <option value="" className="bg-[#050505]">Select budget range</option>
                        <option value="25-50" className="bg-[#050505]">$25,000 – $50,000</option>
                        <option value="50-100" className="bg-[#050505]">$50,000 – $100,000</option>
                        <option value="100-250" className="bg-[#050505]">$100,000 – $250,000</option>
                        <option value="250+" className="bg-[#050505]">$250,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Project Details</label>
                      <textarea
                        className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors resize-none placeholder:text-white/20"
                        placeholder="Overview of your project, timeline, and key objectives..."
                        rows={4}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white text-black py-5 text-[10px] uppercase tracking-[0.2em] font-mono font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-3"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Inquiry
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center min-h-[400px] text-center"
                  >
                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8">
                      <ArrowUpRight className="w-5 h-5 text-white/60" />
                    </div>
                    <h3 className="text-2xl font-medium mb-4">Inquiry Received</h3>
                    <p className="text-white/50 max-w-sm leading-relaxed">
                      Inquiry received. You'll hear back within 48 hours if there's a fit.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ FOOTER ═══════════════════════ */}
        <footer className="py-12 px-6 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <span>&copy; 2026 Muneer Puthiya Purayil. All rights reserved.</span>
            <div className="flex gap-8">
              <a href="https://linkedin.com/in/muneer-p-5052b6128" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">LinkedIn</a>
              <a href="https://github.com/muneerpp3333" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">GitHub</a>
              <a href="mailto:muneer.pp@outlook.com" className="hover:text-white/50 transition-colors">Email</a>
            </div>
            <span>Dubai, UAE</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}
