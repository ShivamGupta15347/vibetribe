import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Companion, BookingForm } from '../types';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CompanionProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState<BookingForm>({
    companionId: id || '',
    date: '',
    startTime: '',
    endTime: '',
    activity: '',
    location: '',
    specialRequests: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchCompanion = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await apiService.getCompanion(id);
      if (response.success) {
        setCompanion(response.data.companion);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch companion details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCompanion();
    }
  }, [fetchCompanion, id]);

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await apiService.createBooking(bookingData);
      if (response.success) {
        setShowBookingForm(false);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const getTagColor = (index: number) => {
    const colors = ['tag-pink', 'tag-purple', 'tag-blue', 'tag-yellow'];
    return colors[index % colors.length];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !companion) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-neutral-dark mb-2">
            Companion not found
          </h2>
          <p className="text-neutral-gray mb-4">{error}</p>
          <button
            onClick={() => navigate('/explore')}
            className="btn btn-primary"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/explore')}
          className="mb-6 text-neutral-gray hover:text-primary-purple transition-colors flex items-center"
        >
          ← Back to Explore
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Image Gallery */}
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-pink to-primary-purple">
                {companion.images && companion.images.length > 0 ? (
                  <img
                    src={companion.images[0]}
                    alt={companion.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                    👤
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-neutral-dark">
                  {companion.formattedRate}
                </div>
              </div>

              {/* Basic Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-dark mb-2">
                      {companion.displayName}
                    </h1>
                    <p className="text-lg text-neutral-gray mb-3">
                      {companion.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(companion.rating.average) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-neutral-gray ml-2">
                        {companion.rating.average.toFixed(1)} ({companion.rating.count} reviews)
                      </span>
                    </div>
                    <div className="text-sm text-neutral-gray">
                      {companion.totalBookings} bookings completed
                    </div>
                  </div>
                </div>

                {/* Vibe Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {companion.vibeTags.map((tag, index) => (
                    <span
                      key={tag}
                      className={`tag ${getTagColor(index)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-3">
                    About {companion.displayName} 💭
                  </h3>
                  <p className="text-neutral-gray leading-relaxed">
                    {companion.description}
                  </p>
                </div>

                {/* Specializations */}
                {companion.specializations && companion.specializations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-neutral-dark mb-3">
                      Specializations 🎯
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {companion.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {companion.languages && companion.languages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-neutral-dark mb-3">
                      Languages 🌍
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {companion.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-primary-yellow/10 text-neutral-dark rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Quick Info Card */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                  Quick Info 📋
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-gray">Age:</span>
                    <span className="font-medium">{companion.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray">Gender:</span>
                    <span className="font-medium">{companion.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray">Location:</span>
                    <span className="font-medium text-right">
                      {companion.location.city}
                      {companion.location.area && `, ${companion.location.area}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray">Rate:</span>
                    <span className="font-medium text-primary-purple">
                      {companion.formattedRate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray">Verified:</span>
                    <span className="font-medium text-green-600">
                      {companion.isVerified ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={companion.user.avatar}
                    alt={companion.user.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-dark">
                      {companion.user.name}
                    </h4>
                    {companion.user.bio && (
                      <p className="text-sm text-neutral-gray">
                        {companion.user.bio}
                      </p>
                    )}
                  </div>
                </div>
                {companion.user.interests && companion.user.interests.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-neutral-dark mb-2">
                      Interests:
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {companion.user.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-gray-100 text-neutral-gray rounded text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Button */}
              <div className="card p-6">
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full btn btn-primary"
                >
                  Book {companion.displayName} 🚀
                </button>
                <p className="text-xs text-neutral-gray mt-2 text-center">
                  Secure booking with instant confirmation
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neutral-dark">
                  Book {companion.displayName}
                </h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-neutral-gray hover:text-neutral-dark"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Date 📅
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date}
                    onChange={handleBookingChange}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Start Time 🕐
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      required
                      value={bookingData.startTime}
                      onChange={handleBookingChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      End Time 🕐
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      required
                      value={bookingData.endTime}
                      onChange={handleBookingChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Activity 🎯
                  </label>
                  <input
                    type="text"
                    name="activity"
                    required
                    value={bookingData.activity}
                    onChange={handleBookingChange}
                    className="input-field"
                    placeholder="What would you like to do?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Location 📍
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={bookingData.location}
                    onChange={handleBookingChange}
                    className="input-field"
                    placeholder="Where would you like to meet?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Special Requests 💭 (Optional)
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleBookingChange}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Any special requests or preferences?"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 btn btn-primary disabled:opacity-50"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanionProfile; 