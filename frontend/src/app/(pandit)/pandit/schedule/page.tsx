'use client';
export default function PanditSchedulePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Schedule</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your availability</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <span className="text-4xl block mb-4">🕐</span>
        <p className="text-gray-500">Set your availability for virtual and in-person ceremonies. Devotees will see these when booking.</p>
      </div>
    </div>
  );
}
