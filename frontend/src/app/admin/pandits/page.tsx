'use client';

import { useEffect, useState } from 'react';
import { panditsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminPanditsPage() {
  const [pandits, setPandits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    panditsApi.getAll(0, 100).then(d => setPandits(d?.content || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const verify = async (id: string) => {
    try { await panditsApi.verifyPandit(id); toast.success('Pandit verified'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Pandit Verification</h1>
        <p className="text-gray-500 mt-1">Review and verify pandit profiles</p>
      </div>

      <div className="grid gap-4">
        {pandits.map((p: any) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xl font-bold text-amber-700">
                  {(p.name || 'P').charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.city}, {p.state} · {p.experienceYears || p.experience || 0} yrs</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(p.specializations || []).slice(0, 4).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {p.verified ? (
                  <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">✓ Verified</span>
                ) : (
                  <button onClick={() => verify(p.id)} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-sm transition-colors">
                    Verify Pandit
                  </button>
                )}
              </div>
            </div>
            {p.bio && <p className="text-sm text-gray-500 mt-3 line-clamp-2">{p.bio}</p>}
          </div>
        ))}
        {!loading && pandits.length === 0 && <div className="py-16 text-center text-gray-400">No pandits registered yet</div>}
      </div>
    </div>
  );
}
