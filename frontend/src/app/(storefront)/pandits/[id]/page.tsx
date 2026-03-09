'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SAMPLE_PANDITS } from '@/lib/sampleData';
import { panditsApi, ordersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import type { Pandit } from '@/lib/types';

export default function PanditDetailPage() {
  const { id } = useParams();
  const [pandit, setPandit] = useState<Pandit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ ceremonyType: '', date: '', time: '', mode: 'VIRTUAL' as 'VIRTUAL' | 'IN_PERSON', address: '' });
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    panditsApi.getById(id as string)
      .then((data) => setPandit(data))
      .catch(() => {
        const sample = SAMPLE_PANDITS.find((p) => p.id === id);
        if (sample) setPandit(sample);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a pandit');
      return;
    }
    try {
      await ordersApi.createBooking({ panditId: pandit?.id, ...bookingData });
      toast.success('Booking request sent! The pandit will confirm shortly.');
      setShowBooking(false);
    } catch {
      toast.error('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <span className="text-5xl animate-float">🙏</span>
      </div>
    );
  }

  if (!pandit) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center text-center">
        <div>
          <span className="text-6xl block mb-4">🔍</span>
          <h2 className="font-display text-2xl font-bold text-burgundy-700">Pandit not found</h2>
          <Link href="/pandits" className="btn-primary mt-4">Browse Pandits</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-burgundy-800 to-burgundy-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-saffron-200/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/pandits" className="hover:text-white transition-colors">Pandits</Link>
            <span>/</span>
            <span className="text-white">{pandit.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-saffron flex items-center justify-center text-white text-3xl font-display font-bold flex-shrink-0">
              {pandit.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-3xl md:text-4xl font-bold">{pandit.name}</h1>
                {pandit.verified && (
                  <span className="badge bg-temple-400/20 text-temple-300 border border-temple-400/30">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-temple-300 font-medium mt-1">{pandit.title}</p>
              <p className="text-saffron-200/60 text-sm mt-1">{pandit.city}, {pandit.state} · {pandit.experience} years experience</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <span className="text-temple-300">★</span>
                  <span className="font-medium">{pandit.rating}</span>
                  <span className="text-sm text-saffron-200/50">({pandit.reviewCount} reviews)</span>
                </div>
                <div className="flex gap-2">
                  {pandit.languages.map((l) => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/70">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="card-flat p-6">
              <h2 className="font-display text-2xl font-semibold text-burgundy-700 mb-4">About</h2>
              <p className="text-burgundy-500 leading-relaxed">{pandit.bio}</p>
            </div>

            {/* Specializations */}
            <div className="card-flat p-6">
              <h2 className="font-display text-2xl font-semibold text-burgundy-700 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {pandit.specializations.map((s) => (
                  <span key={s} className="px-4 py-2 rounded-xl bg-saffron-50 text-saffron-700 font-medium text-sm border border-saffron-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-flat p-6 sticky top-24">
              <h3 className="font-display text-xl font-semibold text-burgundy-700 mb-4">Book a Session</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-burgundy-400">Per Hour</span>
                  <span className="font-display text-lg font-bold text-saffron-600">₹{pandit.pricePerHour}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-burgundy-400">Per Ceremony</span>
                  <span className="font-display text-lg font-bold text-saffron-600">₹{pandit.pricePerCeremony}</span>
                </div>
                {pandit.virtualAvailable && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Virtual sessions available
                  </div>
                )}
              </div>

              {!showBooking ? (
                <button onClick={() => setShowBooking(true)} className="btn-primary w-full">
                  Book Now
                </button>
              ) : (
                <div className="space-y-3">
                  <select
                    value={bookingData.ceremonyType}
                    onChange={(e) => setBookingData({ ...bookingData, ceremonyType: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Ceremony</option>
                    {pandit.specializations.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="input-field"
                  />
                  <select
                    value={bookingData.mode}
                    onChange={(e) => setBookingData({ ...bookingData, mode: e.target.value as 'VIRTUAL' | 'IN_PERSON' })}
                    className="input-field"
                  >
                    <option value="VIRTUAL">Virtual (Online)</option>
                    <option value="IN_PERSON">In-Person</option>
                  </select>
                  {bookingData.mode === 'IN_PERSON' && (
                    <input
                      type="text"
                      placeholder="Your address"
                      value={bookingData.address}
                      onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                      className="input-field"
                    />
                  )}
                  <button onClick={handleBooking} className="btn-primary w-full">Confirm Booking</button>
                  <button onClick={() => setShowBooking(false)} className="btn-ghost w-full text-sm">Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
