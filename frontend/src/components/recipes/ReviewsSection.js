import React, { useState, useEffect } from 'react';
import { StarIcon, TrashIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ReviewsSection = ({ recipeId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, title: '', comment: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchReviews();
  }, [recipeId, sortBy, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/recipes/${recipeId}/reviews?page=${page}&limit=10&sort=${sortBy}`
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setStats(data.stats);
        setTotalPages(data.pagination.pages);
      }

      // Also fetch rating breakdown
      try {
        const breakdownRes = await fetch(`${API_BASE_URL}/recipes/${recipeId}/rating-breakdown`);
        if (breakdownRes.ok) {
          const breakdown = await breakdownRes.json();
          setStats(prev => ({
            ...prev,
            1: breakdown[1] || 0,
            2: breakdown[2] || 0,
            3: breakdown[3] || 0,
            4: breakdown[4] || 0,
            5: breakdown[5] || 0
          }));
        }
      } catch (error) {
        console.error('Failed to fetch rating breakdown:', error);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token not found. Please sign in again.');
        return;
      }

      console.log('Submitting review:', { recipeId, formData });

      const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Review submission response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('Review submission success:', data);
        toast.success('Review submitted successfully!');
        setFormData({ rating: 5, title: '', comment: '' });
        setShowForm(false);
        setPage(1);
        fetchReviews();
      } else {
        const error = await res.json();
        console.error('Review submission error:', error);
        toast.error(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        toast.success('Review deleted');
        fetchReviews();
      } else {
        toast.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleMarkHelpful = async (reviewId, helpful) => {
    try {
      await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful })
      });
      fetchReviews();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Rating Summary */}
      <div className="mb-12 p-8 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(stats.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Based on {stats.totalRatings} {stats.totalRatings === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Write Review Button */}
          <div className="flex items-center justify-center">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                  {stars} ⭐
                </span>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full flex-1 overflow-hidden">
                  {stats.totalRatings > 0 && (
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${(stats[stars] / stats.totalRatings) * 100}%` }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-200 dark:border-orange-700">
          <h3 className="text-xl font-bold mb-6">Share Your Experience</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <StarIcon
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Title (Optional)</label>
              <input
                type="text"
                placeholder="Summarize your experience..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold mb-2">Comment (Optional)</label>
              <textarea
                placeholder="Share your experience with this recipe..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {submitLoading ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sort Options */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold">Reviews ({stats.totalRatings})</h3>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none"
        >
          <option value="recent">Most Recent</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Review Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{review.title || 'No Title'}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By <span className="font-semibold">{review.display_name || review.username}</span> •{' '}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                {user && user.id === review.user_id && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>

              {/* Review Comment */}
              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>
              )}

              {/* Helpful Buttons */}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => handleMarkHelpful(review.id, true)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <HandThumbUpIcon className="w-4 h-4" />
                  Helpful ({review.helpful_count})
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
              )}
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
