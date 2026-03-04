'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Mail, Building2, DollarSign, FileText, Clock } from 'lucide-react';

interface Submission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  scope: string | null;
  budget: string | null;
  details: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  qualified: 'bg-green-500/20 text-green-400 border-green-500/30',
  closed: 'bg-white/10 text-white/40 border-white/20',
};

const STATUSES = ['new', 'contacted', 'qualified', 'closed'] as const;

export default function AdminClient() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchSubmissions = async (status?: string | null) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    params.set('limit', '50');
    const res = await fetch(`/api/submissions?${params}`);
    const data = await res.json();
    setSubmissions(data.submissions);
    setTotal(data.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions(filter);
  }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchSubmissions(filter);
  };

  const formatDate = (d: string) => {
    const date = new Date(d + 'Z');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const scopeLabels: Record<string, string> = {
    saas: 'SaaS Architecture',
    ai: 'Agentic AI & LLM',
    mobile: 'Enterprise Mobile',
    advisory: 'Technical Advisory',
    build: 'Full Product Build',
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-medium tracking-tight mb-2">Submissions</h1>
            <p className="text-white/40 text-sm font-mono">{total} total</p>
          </div>
          <button
            onClick={() => fetchSubmissions(filter)}
            className="p-3 border border-white/10 hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-mono border transition-colors ${
              filter === null ? 'border-white/40 text-white bg-white/5' : 'border-white/10 text-white/40 hover:text-white/60'
            }`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-mono border transition-colors ${
                filter === s ? 'border-white/40 text-white bg-white/5' : 'border-white/10 text-white/40 hover:text-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-white/30 font-mono text-sm">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 text-white/30 font-mono text-sm">No submissions yet</div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="border border-white/10 bg-white/[0.02]">
                {/* Row */}
                <button
                  onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                  className="w-full px-6 py-5 flex items-center gap-6 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className={`px-3 py-1 text-[9px] uppercase tracking-[0.15em] font-mono border ${STATUS_COLORS[sub.status]}`}>
                    {sub.status}
                  </span>
                  <span className="font-medium flex-1 truncate">{sub.name}</span>
                  <span className="text-white/40 text-sm truncate max-w-[200px]">{sub.email}</span>
                  <span className="text-white/30 text-xs font-mono whitespace-nowrap">
                    {formatDate(sub.created_at)}
                  </span>
                </button>

                {/* Expanded Detail */}
                {expanded === sub.id && (
                  <div className="px-6 pb-6 border-t border-white/5 pt-5 space-y-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-white/30 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-1">Email</p>
                          <a href={`mailto:${sub.email}`} className="text-sm hover:text-white/80 transition-colors">
                            {sub.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="w-4 h-4 text-white/30 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-1">Company</p>
                          <p className="text-sm">{sub.company || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-white/30 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-1">Scope</p>
                          <p className="text-sm">{sub.scope ? scopeLabels[sub.scope] || sub.scope : '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-4 h-4 text-white/30 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-1">Budget</p>
                          <p className="text-sm">{sub.budget ? `$${sub.budget}k` : '—'}</p>
                        </div>
                      </div>
                    </div>

                    {sub.details && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-white/30 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-1">Details</p>
                          <p className="text-sm text-white/70 leading-relaxed">{sub.details}</p>
                        </div>
                      </div>
                    )}

                    {/* Status Actions */}
                    <div className="flex gap-2 pt-3 border-t border-white/5">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(sub.id, s)}
                          disabled={sub.status === s}
                          className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-mono border transition-colors ${
                            sub.status === s
                              ? 'border-white/20 text-white/20 cursor-not-allowed'
                              : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
