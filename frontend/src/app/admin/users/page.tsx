'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    authApi.listUsers(0, 100).then(d => setUsers(d?.content || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const approve = async (id: string) => {
    try { await authApi.approveUser(id); toast.success('User approved'); load(); }
    catch { toast.error('Failed to approve'); }
  };

  const filtered = filter === 'ALL' ? users : users.filter(u => u.role === filter || u.status === filter);
  const roleBadge = (role: string) => {
    const m: Record<string, string> = { ADMIN: 'bg-purple-100 text-purple-700', SELLER: 'bg-emerald-100 text-emerald-700', PANDIT: 'bg-amber-100 text-amber-700', CUSTOMER: 'bg-blue-100 text-blue-700' };
    return m[role] || 'bg-gray-100 text-gray-700';
  };
  const statusBadge = (status: string) => {
    const m: Record<string, string> = { ACTIVE: 'bg-green-100 text-green-700', PENDING_APPROVAL: 'bg-amber-100 text-amber-700', SUSPENDED: 'bg-red-100 text-red-700' };
    return m[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">{users.length} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'ADMIN', 'SELLER', 'PANDIT', 'CUSTOMER', 'PENDING_APPROVAL'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-200'}`}>
            {f === 'ALL' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                        {(u.fullName || u.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.fullName || u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(u.status)}`}>{u.status?.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{[u.city, u.state].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    {u.status === 'PENDING_APPROVAL' && (
                      <button onClick={() => approve(u.id)} className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors shadow-sm">
                        ✓ Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="py-12 text-center text-gray-400">Loading...</div>}
        {!loading && filtered.length === 0 && <div className="py-12 text-center text-gray-400">No users found</div>}
      </div>
    </div>
  );
}
