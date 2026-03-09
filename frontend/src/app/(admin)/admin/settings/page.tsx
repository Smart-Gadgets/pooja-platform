'use client';
export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
      <p className="text-slate-500 text-sm mb-8">Platform configuration</p>
      <div className="bg-white rounded-2xl border border-slate-100 p-8">
        <p className="text-slate-400 text-center py-12">Settings page — configure payment gateways, notification preferences, and platform policies here.</p>
      </div>
    </div>
  );
}
