import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Booking, Companion } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'pending'>('upcoming');
  const [companions, setCompanions] = useState<Companion[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [bookingsResponse, companionsResponse]: [
        import('../types').ApiResponse<import('../types').PaginatedBookingResponse>,
        import('../types').ApiResponse<import('../types').PaginatedCompanionResponse>
      ] = await Promise.all([
        apiService.getMyBookings(),
        apiService.getCompanions()
      ]);
      
      setBookings(bookingsResponse.data.bookings);
      setCompanions(companionsResponse.data.companions);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await apiService.updateBookingStatus(bookingId, 'cancelled');
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getCompanionById = (companionId: string) => {
    return companions.find(companion => companion.id === companionId);
  };

  const filterBookings = (type: 'upcoming' | 'past' | 'pending') => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      switch (type) {
        case 'upcoming':
          return bookingDate > now && booking.status === 'confirmed';
        case 'past':
          return bookingDate < now;
        case 'pending':
          return booking.status === 'pending';
        default:
          return false;
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name}! ✨
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your bookings and find your next adventure
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Upcoming Bookings</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filterBookings('upcoming').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-pink-600">
                  {filterBookings('pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filterBookings('past').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'upcoming', label: 'Upcoming', icon: '📅' },
              { key: 'pending', label: 'Pending', icon: '⏳' },
              { key: 'past', label: 'Past', icon: '✅' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {filterBookings(activeTab).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No {activeTab} bookings
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'upcoming' && "Ready for an adventure? Find your perfect companion!"}
                  {activeTab === 'pending' && "No pending requests at the moment."}
                  {activeTab === 'past' && "Your booking history will appear here."}
                </p>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => window.location.href = '/explore'}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Explore Companions
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filterBookings(activeTab).map((booking) => {
                  const companion = getCompanionById(booking.companion.id);
                  return (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {companion?.displayName?.charAt(0) || booking.companion.displayName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-800">
                                {companion?.displayName || booking.companion.displayName}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">Date:</span> {formatDate(booking.date)}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">Duration:</span> {booking.duration} hours
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">Activity:</span> {booking.activity}
                            </p>
                            {booking.specialRequests && (
                              <p className="text-gray-600 mb-2">
                                <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                              </p>
                            )}
                            <p className="text-purple-600 font-semibold">
                              ₹{booking.totalAmount}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          {activeTab === 'upcoming' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => window.location.href = `/companion/${booking.companion.id}`}
                            className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm font-medium"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.href = '/explore'}
              className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-medium">Find Companions</div>
            </button>
            
            <button
              onClick={() => window.location.href = '/profile'}
              className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-medium">Edit Profile</div>
            </button>
            
            <button
              onClick={() => window.location.href = '/settings'}
              className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-medium">Settings</div>
            </button>
            
            <button
              onClick={() => window.location.href = '/support'}
              className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium">Support</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 