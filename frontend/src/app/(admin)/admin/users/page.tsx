'use client';
import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const load = () => authApi.listUsers(0, 200).then(d => setUsers(d?.content || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const approve = async (id: string) => { try { await authApi.approveUser(id); toast.success('Approved'); load(); } catch { toast.error('Failed'); } };

  const list = users.filter(u => {
    if (filter !== 'ALL' && u.role !== filter && u.status !== filter) return false;
    if (search && !(u.fullName || u.name || '').toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const badge = (role: string) => ({ ADMIN: 'bg-violet-100 text-violet-700', SELLER: 'bg-emerald-100 text-emerald-700', PANDIT: 'bg-amber-100 text-amber-700', CUSTOMER: 'bg-blue-100 text-blue-700' }[role] || 'bg-gray-100 text-gray-700');
  const sbadge = (s: string) => ({ ACTIVE: 'bg-green-100 text-green-700', PENDING_APPROVAL: 'bg-amber-100 text-amber-700', SUSPENDED: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">User Management</h1>
      <p className="text-slate-500 text-sm mb-6">{users.length} registered users</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
        <div className="flex gap-1.5 flex-wrap">
          {['ALL', 'ADMIN', 'SELLER', 'PANDIT', 'CUSTOMER', 'PENDING_APPROVAL'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {f === 'ALL' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <p className="text-sm font-medium text-slate-900">{u.fullName || u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge(u.role)}`}>{u.role}</span></td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sbadge(u.status)}`}>{u.status?.replace('_', ' ')}</span></td>
                <td className="px-5 py-3 text-right">
                  {u.status === 'PENDING_APPROVAL' && <button onClick={() => approve(u.id)} className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700">Approve</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <div className="p-12 text-center text-slate-400 text-sm">No users match your filter</div>}
      </div>
    </div>
  );
}
