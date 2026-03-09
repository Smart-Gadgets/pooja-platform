'use client';
import { useEffect, useState } from 'react';
import { panditsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PanditProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({ name: '', bio: '', phone: '', city: '', state: '', experienceYears: '0', baseRate: '', specializations: '', languages: 'Hindi', virtualAvailable: true, inPersonAvailable: true });

  useEffect(() => {
    panditsApi.getMyProfile().then(p => { setProfile(p); if (p) setF({ name: p.name||'', bio: p.bio||'', phone: p.phone||'', city: p.city||'', state: p.state||'', experienceYears: String(p.experienceYears||p.experience||0), baseRate: String(p.baseRate||p.pricePerHour||''), specializations: (p.specializations||[]).join(', '), languages: (p.languages||['Hindi']).join(', '), virtualAvailable: p.virtualAvailable??true, inPersonAvailable: p.inPersonAvailable??true }); }).catch(() => {});
  }, []);

  const u = (k: string, v: any) => setF({ ...f, [k]: v });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const data = { name: f.name, bio: f.bio, phone: f.phone, city: f.city, state: f.state, experienceYears: parseInt(f.experienceYears), baseRate: parseFloat(f.baseRate)||null, specializations: f.specializations.split(',').map(s=>s.trim()).filter(Boolean), languages: f.languages.split(',').map(s=>s.trim()).filter(Boolean), virtualAvailable: f.virtualAvailable, inPersonAvailable: f.inPersonAvailable };
    try { if (profile) { await panditsApi.updateProfile(data); toast.success('Updated'); } else { await panditsApi.createProfile(data); toast.success('Created! Pending verification.'); } } catch (err: any) { toast.error(err.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile ? 'Edit Profile' : 'Create Profile'}</h1>
      <p className="text-gray-500 text-sm mb-8">{profile?.verified ? '✅ Verified' : profile ? '⏳ Pending verification' : 'Set up to receive bookings'}</p>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={f.name} onChange={e=>u('name',e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={f.city} onChange={e=>u('city',e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={f.state} onChange={e=>u('state',e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea value={f.bio} onChange={e=>u('bio',e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" placeholder="Tell devotees about your background..." /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label><input type="number" value={f.experienceYears} onChange={e=>u('experienceYears',e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (₹)</label><input type="number" value={f.baseRate} onChange={e=>u('baseRate',e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Specializations (comma-separated)</label><input type="text" value={f.specializations} onChange={e=>u('specializations',e.target.value)} placeholder="Ganesh Puja, Satyanarayan Katha" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Languages</label><input type="text" value={f.languages} onChange={e=>u('languages',e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.virtualAvailable} onChange={e=>u('virtualAvailable',e.target.checked)} className="w-4 h-4 rounded text-amber-600" /><span className="text-sm">📹 Virtual</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.inPersonAvailable} onChange={e=>u('inPersonAvailable',e.target.checked)} className="w-4 h-4 rounded text-amber-600" /><span className="text-sm">🏠 In-person</span></label>
        </div>
        <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-50">{saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}</button>
      </form>
    </div>
  );
}
