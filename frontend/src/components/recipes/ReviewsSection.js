import React, { useEffect, useState } from 'react';
import { ChatBubbleOvalLeftIcon, HeartIcon, StarIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../services/apiClient';
import toast from 'react-hot-toast';

const EMPTY_FORM = { rating: 5, title: '', comment: '' };

const timeAgo = (value) => {
  if (!value) return 'now';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const Avatar = ({ name, src, large = false }) => (
  <div className={`${large ? 'h-11 w-11' : 'h-10 w-10'} shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-sm font-semibold text-white`}>
    {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center">{(name || 'F').trim().slice(0, 1).toUpperCase()}</span>}
  </div>
);

const ReviewsSection = ({ recipeId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showRating, setShowRating] = useState(false);
  const [posting, setPosting] = useState(false);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/recipes/${recipeId}/reviews?page=${page}&limit=10&sort=${sortBy}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setReviews(data.reviews || []);
      setStats(data.stats || { averageRating: 0, totalRatings: 0 });
      setTotalPages(data.pagination?.pages || 1);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // loadComments intentionally follows the discussion query state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId, sortBy, page]);

  const postComment = async (event) => {
    event.preventDefault();
    if (!user) return toast.error('Please sign in to join the conversation');
    if (!form.comment.trim()) return toast.error('Write a comment before posting');
    try {
      setPosting(true);
      const response = await apiFetch(`/recipes/${recipeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Could not post comment');
      setForm(EMPTY_FORM);
      setShowRating(false);
      toast.success('Comment posted');
      page === 1 ? loadComments() : setPage(1);
    } catch (error) {
      toast.error(error.message || 'Could not post comment');
    } finally {
      setPosting(false);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      const response = await apiFetch(`/recipes/${recipeId}/reviews/${reviewId}/helpful`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ helpful: true }) });
      if (!response.ok) throw new Error();
      loadComments();
    } catch { toast.error('Could not register that reaction'); }
  };

  const deleteComment = async (reviewId) => {
    if (!window.confirm('Delete this comment?')) return;
    const response = await apiFetch(`/recipes/${recipeId}/reviews/${reviewId}`, { method: 'DELETE' });
    response.ok ? (toast.success('Comment deleted'), loadComments()) : toast.error('Could not delete comment');
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'Foodies recipe discussion', url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); toast.success('Recipe link copied'); }
    } catch (error) { if (error.name !== 'AbortError') toast.error('Could not share this recipe'); }
  };

  const name = user?.display_name || user?.displayName || user?.username || 'You';
  const avatar = user?.avatar_url || user?.avatarUrl;

  return (
    <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#f4ddce] bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f4ddce] px-5 py-4 dark:border-gray-700 sm:px-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Discussion</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{stats.totalRatings || 0} {(stats.totalRatings || 0) === 1 ? 'comment' : 'comments'}{stats.totalRatings > 0 && ` · ${Number(stats.averageRating || 0).toFixed(1)} average rating`}</p>
        </div>
        <select aria-label="Sort comments" value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-orange-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
          <option value="recent">Latest</option><option value="helpful">Top</option><option value="rating-high">Highest rated</option><option value="rating-low">Lowest rated</option>
        </select>
      </header>

      <div className="border-b border-[#f4ddce] px-5 py-4 dark:border-gray-700 sm:px-6">
        {user ? (
          <form onSubmit={postComment} className="flex gap-3">
            <Avatar name={name} src={avatar} large />
            <div className="min-w-0 flex-1">
              <textarea value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} placeholder="Share a tip, substitution, or how it went…" rows={2} maxLength={1000} className="w-full resize-none border-0 bg-transparent px-0 py-1 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-0 dark:text-white" />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                <button type="button" onClick={() => setShowRating(!showRating)} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-orange-600 dark:text-gray-400"><StarIcon className="h-4 w-4" />{showRating ? `${form.rating} stars` : 'Add rating'}</button>
                <button type="submit" disabled={posting || !form.comment.trim()} className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-45">{posting ? 'Posting…' : 'Post'}</button>
              </div>
              {showRating && <div className="mt-3 flex items-center gap-1" aria-label="Choose rating">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-orange-400"><SolidStarIcon className={`h-5 w-5 ${star <= form.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} /></button>)}</div>}
            </div>
          </form>
        ) : (
          <button onClick={() => toast('Sign in to add a comment')} className="flex w-full items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3 text-left text-sm text-orange-800 transition hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-200"><ChatBubbleOvalLeftIcon className="h-5 w-5 shrink-0" /><span><strong>Join the conversation.</strong> Sign in to share your cooking notes.</span></button>
        )}
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="h-7 w-7 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
        : reviews.length === 0 ? <div className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No comments yet. Be the first to share how this recipe turned out.</div>
        : <div>{reviews.map((review) => {
          const author = review.display_name || review.username || 'Foodie';
          return <article key={review.id} className="flex gap-3 border-b border-[#f4ddce] px-5 py-4 transition hover:bg-orange-50/40 dark:border-gray-700 dark:hover:bg-gray-700/40 sm:px-6">
            <Avatar name={author} src={review.avatar_url} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[15px] leading-5"><span className="truncate font-semibold text-gray-900 dark:text-white">{author}</span>{review.username && <span className="truncate text-gray-500 dark:text-gray-400">@{review.username}</span>}<span className="text-gray-400">·</span><time className="shrink-0 text-gray-500 dark:text-gray-400" title={new Date(review.created_at).toLocaleString()}>{timeAgo(review.created_at)}</time></div>
              {review.title && <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">{review.title}</p>}
              <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-6 text-gray-800 dark:text-gray-200">{review.comment || `Gave this recipe ${review.rating} out of 5 stars.`}</p>
              <div className="mt-2 flex items-center gap-5 text-sm text-gray-500 dark:text-gray-400"><span className="flex items-center gap-1" title={`${review.rating} out of 5 stars`}><SolidStarIcon className="h-4 w-4 text-amber-400" />{review.rating}</span><button onClick={() => markHelpful(review.id)} className="flex items-center gap-1.5 transition hover:text-rose-500" aria-label="Mark comment helpful"><HeartIcon className="h-4 w-4" />{review.helpful_count || 0}</button><button onClick={share} className="transition hover:text-orange-600" aria-label="Share recipe"><ArrowUpTrayIcon className="h-4 w-4" /></button>{user?.id === review.user_id && <button onClick={() => deleteComment(review.id)} className="ml-auto transition hover:text-red-500" aria-label="Delete comment"><TrashIcon className="h-4 w-4" /></button>}</div>
            </div>
          </article>;
        })}
        {totalPages > 1 && <div className="flex items-center justify-between px-5 py-4 text-sm sm:px-6"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="font-medium text-orange-600 disabled:opacity-40">Previous</button><span className="text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="font-medium text-orange-600 disabled:opacity-40">Next</button></div>}
        </div>}
    </section>
  );
};

export default ReviewsSection;
