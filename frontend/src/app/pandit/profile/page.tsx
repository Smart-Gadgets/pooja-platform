'use client';

import { useEffect, useState } from 'react';
import { panditsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PanditProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', phone: '', city: '', state: '', experienceYears: '0', baseRate: '', specializations: '', languages: 'Hindi', virtualAvailable: true, inPersonAvailable: true });

  useEffect(() => {
    panditsApi.getMyProfile().then(p => {
      setProfile(p);
      if (p) setForm({
        name: p.name || '', bio: p.bio || '', phone: p.phone || '', city: p.city || '', state: p.state || '',
        experienceYears: String(p.experienceYears || p.experience || 0), baseRate: String(p.baseRate || p.pricePerHour || ''),
        specializations: (p.specializations || []).join(', '), languages: (p.languages || ['Hindi']).join(', '),
        virtualAvailable: p.virtualAvailable ?? true, inPersonAvailable: p.inPersonAvailable ?? true,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      name: form.name, bio: form.bio, phone: form.phone, city: form.city, state: form.state,
      experienceYears: parseInt(form.experienceYears), baseRate: parseFloat(form.baseRate) || null,
      specializations: form.specializations.split(',').map(s => s.trim()).filter(Boolean),
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      virtualAvailable: form.virtualAvailable, inPersonAvailable: form.inPersonAvailable,
    };
    try {
      if (profile) { await panditsApi.updateProfile(data); toast.success('Profile updated'); }
      else { await panditsApi.createProfile(data); toast.success('Profile created! Pending admin verification.'); }
    } catch (err: any) { toast.error(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="py-20 text-center"><span className="text-4xl animate-pulse">🪔</span></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">{profile ? 'Edit Profile' : 'Create Profile'}</h1>
        <p className="text-gray-500 mt-1">{profile?.verified ? '✅ Verified' : profile ? '⏳ Pending verification' : 'Set up your pandit profile'}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
            <input type="text" value={form.city} onChange={e => update('city', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <input type="text" value={form.state} onChange={e => update('state', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
          <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" placeholder="Tell devotees about your background and expertise..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience (years)</label>
            <input type="number" value={form.experienceYears} onChange={e => update('experienceYears', e.target.value)} min="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Base Rate (₹/ceremony)</label>
            <input type="number" value={form.baseRate} onChange={e => update('baseRate', e.target.value)} min="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Specializations (comma-separated)</label>
          <input type="text" value={form.specializations} onChange={e => update('specializations', e.target.value)} placeholder="Ganesh Puja, Satyanarayan Katha, Griha Pravesh" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Languages (comma-separated)</label>
          <input type="text" value={form.languages} onChange={e => update('languages', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.virtualAvailable} onChange={e => update('virtualAvailable', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
            <span className="text-sm text-gray-700">📹 Virtual available</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.inPersonAvailable} onChange={e => update('inPersonAvailable', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
            <span className="text-sm text-gray-700">🏠 In-person available</span>
          </label>
        </div>
        <button type="submit" disabled={saving} className="w-full px-6 py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 shadow-sm transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
}
