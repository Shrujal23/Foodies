import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL, ASSET_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
  PinterestIcon
} from 'react-share';

const UserRecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const shareUrl = window.location.href;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeRes = await fetch(`${API_BASE_URL}/recipes/user/${id}`);
        if (!recipeRes.ok) throw new Error('Recipe not found');

        const recipeData = await recipeRes.json();
        if (recipeData.image && !recipeData.image.startsWith('http')) {
          recipeData.image = `${ASSET_BASE_URL}${recipeData.image}`;
        }
        setRecipe(recipeData);

        const commentsRes = await fetch(`${API_BASE_URL}/recipes/${id}/comments`);
        if (commentsRes.ok) {
          setComments(await commentsRes.json());
        }
      } catch (err) {
        toast.error('Recipe not found');
        navigate('/my-recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
        toast.success('Comment added!');
      }
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;   {/* Fixed */}
    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
        toast.success('Comment deleted');
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm('Delete this recipe permanently?')) return;   {/* Fixed */}
    try {
      const res = await fetch(`${API_BASE_URL}/recipes/user/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Recipe deleted');
        navigate('/my-recipes');
      }
    } catch (err) {
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!recipe) return null;

  const ingredients = typeof recipe.ingredients === 'string'
    ? JSON.parse(recipe.ingredients)
    : recipe.ingredients;

  const instructions = typeof recipe.instructions === 'string'
    ? JSON.parse(recipe.instructions)
    : recipe.instructions;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero Image */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}
            alt={recipe.title}
            className="w-full h-96 md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-xl md:text-2xl opacity-95 max-w-4xl">
                {recipe.description}
              </p>
            )}
          </div>

          <div className="absolute top-8 right-8 px-5 py-3 rounded-full text-white font-bold text-lg shadow-xl"
            style={{
              backgroundColor:
                recipe.difficulty === 'Easy' ? '#10b981' :
                recipe.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
            }}>
            {recipe.difficulty}
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Share this recipe:</span>
            <div className="flex gap-3">
              <FacebookShareButton url={shareUrl} quote={recipe.title}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={recipe.title}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={recipe.title}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
              <PinterestShareButton url={shareUrl} media={recipe.image} description={recipe.title}>
                <PinterestIcon size={40} round />
              </PinterestShareButton>
              <EmailShareButton url={shareUrl} subject={recipe.title}>
                <EmailIcon size={40} round />
              </EmailShareButton>
            </div>
          </div>

          {user && user.id === recipe.user_id && (
            <div className="flex gap-3">
              <Link
                to={`/recipes/edit/${recipe.id}`}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Edit Recipe
              </Link>
              <button
                onClick={handleDeleteRecipe}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
              >
                Delete Recipe
              </button>
            </div>
          )}

          <Link
            to="/my-recipes"
            className="text-orange-600 hover:text-orange-500 font-medium flex items-center gap-2"
          >
            Back to My Recipes
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-12">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-orange-600">{recipe.prep_time}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Prep Time</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-orange-600">{recipe.cook_time}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Cook Time</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-orange-600">{recipe.servings}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Servings</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {recipe.prep_time + recipe.cook_time} min
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Total Time</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Ingredients</h2>
              <ul className="space-y-4">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-liberal h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-lg text-gray-700 dark:text-gray-300 pt-1.5">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Instructions</h2>
              <ol className="space-y-8">
                {instructions.map((step, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg">
                      {i + 1}
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed pt-2">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Recipe Info</h3>
              <div className="space-y-5 text-sm">
                <div>
                  <span className="text-gray-500">Created</span>
                  <p className="font-medium text-gray-900 dark:text-gray-200">
                    {new Date(recipe.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Last updated</span>
                  <p className="font-medium text-gray-900 dark:text-gray-200">
                    {new Date(recipe.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-20 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Comments ({comments.length})</h2>

          <form onSubmit={handleSubmitComment} className="mb-12">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
              rows="4"
              required
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="mt-4 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-700 disabled:opacity-50 transition shadow-lg"
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div className="space-y-8">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-5 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <img
                    src={comment.avatar_url || `https://ui-avatars.com/api/?name=${comment.display_name || comment.username}&background=fdba74&color=fff`}
                    alt={comment.display_name || comment.username}
                    className="w-12 h-12 rounded-full ring-4 ring-orange-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {comment.display_name || comment.username}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {user && comment.user_id === user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRecipeDetail;