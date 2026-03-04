'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowUpRight,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Send,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { trackCTAClick, trackFormStart, trackFormSubmit, trackFormError, trackExternalLink } from '../lib/analytics';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

const IntakeSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;

    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(null),
        });
      }
    };

    // If turnstile script already loaded
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Load turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = renderWidget;
    document.head.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!turnstileToken) {
      setError('Please complete the verification.');
      trackFormError('turnstile_not_completed');
      return;
    }

    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    trackFormStart();

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          company: formData.get('company'),
          scope: formData.get('scope'),
          budget: formData.get('budget'),
          details: formData.get('details'),
          turnstileToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      trackFormSubmit(formData.get('scope') as string, formData.get('budget') as string);
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      trackFormError(msg);
      setError(msg);
      // Reset turnstile
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <a href="mailto:muneer@gitspark.com" onClick={() => trackCTAClick('email', 'intake_section')} className="flex items-center gap-4 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-white/30" />
                <span>muneer@gitspark.com</span>
              </a>
              <a href="https://calendly.com/gitspark/discussion-with-gitspark" target="_blank" rel="noopener noreferrer" onClick={() => trackCTAClick('calendly', 'intake_section')} className="flex items-center gap-4 hover:text-white transition-colors">
                <Calendar className="w-4 h-4 text-white/30" />
                <span>Book a call</span>
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
                      name="name"
                      required
                      placeholder="Jane Smith"
                      className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Email</label>
                    <input
                      type="email"
                      name="email"
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
                    name="company"
                    placeholder="Acme Corp"
                    className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Project Scope</label>
                  <select
                    name="scope"
                    className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors appearance-none cursor-pointer text-white/60"
                  >
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
                  <select
                    name="budget"
                    className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors appearance-none cursor-pointer text-white/60"
                  >
                    <option value="" className="bg-[#050505]">Select budget range</option>
                    <option value="25-50" className="bg-[#050505]">$25,000 - $50,000</option>
                    <option value="50-100" className="bg-[#050505]">$50,000 - $100,000</option>
                    <option value="100-250" className="bg-[#050505]">$100,000 - $250,000</option>
                    <option value="250+" className="bg-[#050505]">$250,000+</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">Project Details</label>
                  <textarea
                    name="details"
                    className="w-full bg-transparent border-b border-white/15 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors resize-none placeholder:text-white/20"
                    placeholder="Overview of your project, timeline, and key objectives..."
                    rows={4}
                  />
                </div>

                {/* Turnstile Widget */}
                <div ref={turnstileRef} />

                {error && (
                  <div className="flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-5 text-[10px] uppercase tracking-[0.2em] font-mono font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Inquiry
                    </>
                  )}
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
                  Inquiry received. You&apos;ll hear back within 48 hours if there&apos;s a fit.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntakeSection;
