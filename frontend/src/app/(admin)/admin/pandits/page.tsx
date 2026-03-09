'use client';
import { useEffect, useState } from 'react';
import { panditsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminPanditsPage() {
  const [pandits, setPandits] = useState<any[]>([]);
  const load = () => panditsApi.getAll(0, 200).then(d => setPandits(d?.content || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const verify = async (id: string) => { try { await panditsApi.verifyPandit(id); toast.success('Verified'); load(); } catch { toast.error('Failed'); } };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Pandit Verification</h1>
      <p className="text-slate-500 text-sm mb-6">Review and verify pandit profiles</p>
      <div className="space-y-3">
        {pandits.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-lg font-bold text-amber-700">{(p.name || 'P').charAt(0)}</div>
              <div>
                <p className="font-medium text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-400">{p.city}, {p.state} · {p.experienceYears || p.experience || 0} yrs experience</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {(p.specializations || []).slice(0, 3).map((s: string) => <span key={s} className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px]">{s}</span>)}
                </div>
              </div>
            </div>
            {p.verified
              ? <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">✓ Verified</span>
              : <button onClick={() => verify(p.id)} className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700">Verify</button>
            }
          </div>
        ))}
        {pandits.length === 0 && <div className="p-16 text-center text-slate-400">No pandits registered</div>}
      </div>
    </div>
  );
}
