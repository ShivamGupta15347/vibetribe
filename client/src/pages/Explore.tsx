import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Companion, CompanionFilters, VIBE_TAGS } from '../types';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Explore: React.FC = () => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<CompanionFilters>({
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCompanions: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const fetchCompanions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getCompanions(filters);
      if (response.success && response.data && response.data.companions) {
        setCompanions(response.data.companions);
        if (response.data.pagination) {
          setPagination({
            currentPage: response.data.pagination.currentPage || 1,
            totalPages: response.data.pagination.totalPages || 1,
            totalCompanions: response.data.pagination.totalCompanions || 0,
            hasNextPage: response.data.pagination.hasNextPage || false,
            hasPrevPage: response.data.pagination.hasPrevPage || false,
          });
        }
      } else {
        setCompanions([]);
        setError('No companions found');
      }
    } catch (err: any) {
      console.error('Error fetching companions:', err);
      setError(err.message || 'Failed to fetch companions');
      setCompanions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompanions();
  }, [fetchCompanions]);

  const handleFilterChange = (newFilters: Partial<CompanionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    handleFilterChange({ vibeTags: newTags.length > 0 ? newTags : undefined });
  };

  const handleSearch = () => {
    handleFilterChange({ city: searchQuery || undefined });
  };

  const handlePriceFilter = () => {
    const min = priceRange.min ? parseInt(priceRange.min) : undefined;
    const max = priceRange.max ? parseInt(priceRange.max) : undefined;
    handleFilterChange({ minRate: min, maxRate: max });
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchQuery('');
    setSelectedTags([]);
    setPriceRange({ min: '', max: '' });
  };

  const getTagColor = (index: number) => {
    const colors = ['tag-pink', 'tag-purple', 'tag-blue', 'tag-yellow'];
    return colors[index % colors.length];
  };

  if (loading && companions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-dark mb-4">
            Explore Companions 🌟
          </h1>
          <p className="text-xl text-neutral-gray">
            Find your perfect companion for any occasion
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Location 🔍
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter city..."
                  className="input-field rounded-r-none"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-3 bg-primary-purple text-white rounded-r-xl hover:bg-primary-pink transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Price Range 💰
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="Min"
                  className="input-field"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="Max"
                  className="input-field"
                />
                <button
                  onClick={handlePriceFilter}
                  className="px-4 py-3 bg-primary-blue text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Vibe Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Vibe Tags 🏷️
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBE_TAGS.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-purple text-white'
                        : 'bg-gray-100 text-neutral-gray hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-sm text-neutral-gray hover:text-primary-purple transition-colors"
            >
              Clear all filters
            </button>
            <span className="text-sm text-neutral-gray">
              {pagination.totalCompanions} companions found
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Companions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companions && companions.length > 0 ? companions.map((companion, index) => (
            <motion.div
              key={companion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card overflow-hidden cursor-pointer group"
            >
              <Link to={`/companion/${companion.id}`}>
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-pink to-primary-purple overflow-hidden">
                  {companion.images && companion.images.length > 0 ? (
                    <img
                      src={companion.images[0]}
                      alt={companion.displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                      👤
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-neutral-dark">
                    {companion.formattedRate}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-neutral-dark mb-1">
                    {companion.displayName}
                  </h3>
                  <p className="text-sm text-neutral-gray mb-3 line-clamp-2">
                    {companion.tagline}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(companion.rating.average) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-neutral-gray ml-2">
                      ({companion.rating.count})
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {companion.vibeTags && companion.vibeTags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className={`tag ${getTagColor(tagIndex)} text-xs px-2 py-1`}
                      >
                        {tag}
                      </span>
                    ))}
                    {companion.vibeTags && companion.vibeTags.length > 3 && (
                      <span className="text-xs text-neutral-gray px-2 py-1">
                        +{companion.vibeTags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="mt-3 text-sm text-neutral-gray">
                    📍 {companion.location.city}
                    {companion.location.area && `, ${companion.location.area}`}
                  </div>
                </div>
              </Link>
            </motion.div>
          )) : null}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFilterChange({ page: pagination.currentPage - 1 })}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-neutral-gray">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handleFilterChange({ page: pagination.currentPage + 1 })}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {companions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-neutral-dark mb-2">
              No companions found
            </h3>
            <p className="text-neutral-gray mb-4">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore; 