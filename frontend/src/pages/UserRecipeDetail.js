import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchRecipeAndComments = async () => {
      try {
        // Fetch recipe
        const token = localStorage.getItem('token');
        const recipeResponse = await fetch(`http://localhost:5000/api/recipes/user/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (recipeResponse.ok) {
          const recipeData = await recipeResponse.json();
          // Ensure image URL is absolute when served from backend
          if (recipeData.image && !recipeData.image.startsWith('http')) {
            recipeData.image = `http://localhost:5000${recipeData.image}`;
          }
          setRecipe(recipeData);
          
          // Fetch comments
          const commentsResponse = await fetch(`http://localhost:5000/api/recipes/${id}/comments`);
          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            setComments(commentsData);
          }
        } else {
          throw new Error('Failed to fetch recipe');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load recipe');
        navigate('/my-recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeAndComments();
  }, [id, navigate]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prevComments => [comment, ...prevComments]);
        setNewComment('');
        toast.success('Comment added successfully');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        toast.success('Comment deleted successfully');
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const response = await fetch(`/api/recipes/user/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Recipe deleted successfully');
        navigate('/my-recipes');
      } else {
        throw new Error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h2>
          <Link
            to="/my-recipes"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700"
          >
            Back to My Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{recipe.description}</p>
          
          {/* Share Buttons */}
          <div className="flex items-center space-x-4 mt-4">
            <span className="text-sm font-medium text-gray-500">Share Recipe:</span>
            <div className="flex space-x-2">
              <FacebookShareButton
                url={window.location.href}
                quote={`Check out this delicious ${recipe.title} recipe!`}
                className="hover:opacity-80 transition-opacity"
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              
              <TwitterShareButton
                url={window.location.href}
                title={`Check out this delicious ${recipe.title} recipe!`}
                className="hover:opacity-80 transition-opacity"
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              
              <WhatsappShareButton
                url={window.location.href}
                title={`Check out this delicious ${recipe.title} recipe!`}
                className="hover:opacity-80 transition-opacity"
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              
              <PinterestShareButton
                url={window.location.href}
                media={recipe.image || ''}
                description={`${recipe.title} - ${recipe.description}`}
                className="hover:opacity-80 transition-opacity"
              >
                <PinterestIcon size={32} round />
              </PinterestShareButton>
              
              <EmailShareButton
                url={window.location.href}
                subject={`Check out this ${recipe.title} recipe!`}
                body={`I found this delicious recipe for ${recipe.title}. \n\nDescription: ${recipe.description}\n\nCheck it out here:`}
                className="hover:opacity-80 transition-opacity"
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/recipes/edit/${recipe.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit Recipe
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            Delete Recipe
          </button>
        </div>
      </div>

      {/* Recipe Image */}
      {recipe.image && (
        <div className="mb-8">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Recipe Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipe Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">{recipe.prep_time}</div>
                <div className="text-sm text-gray-500">Prep Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">{recipe.cook_time}</div>
                <div className="text-sm text-gray-500">Cook Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">{recipe.servings}</div>
                <div className="text-sm text-gray-500">Servings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">{recipe.difficulty}</div>
                <div className="text-sm text-gray-500">Difficulty</div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {(typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients).map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-accent-100 text-accent-800 rounded-full text-sm font-medium text-center leading-6 mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {(typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions).map((instruction, index) => (
                <li key={index} className="flex">
                  <span className="inline-block w-8 h-8 bg-accent-600 text-white rounded-full text-sm font-medium text-center leading-8 mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-1">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Created</span>
                <div className="text-sm text-gray-900">
                  {new Date(recipe.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                <div className="text-sm text-gray-900">
                  {new Date(recipe.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Total Time</span>
                <div className="text-sm text-gray-900">
                  {recipe.prep_time + recipe.cook_time} minutes
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/my-recipes"
              className="inline-flex items-center w-full justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to My Recipes
            </Link>
          </div>
        </div>
      </div>

      {/* Comments Section - Full Width */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Comments</h2>
          
          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-12">
            <div className="flex flex-col space-y-4">
              <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                Add your thoughts
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                rows="4"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="self-end px-6 py-3 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 disabled:opacity-50 transition-colors duration-200"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4 pb-8 border-b border-gray-100 last:border-0">
                {comment.avatar_url ? (
                  <img
                    src={comment.avatar_url}
                    alt={comment.display_name || comment.username}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center">
                    <span className="text-accent-800 font-medium text-lg">
                      {(comment.display_name || comment.username || '?')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        {comment.display_name || comment.username}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {comment.user_id === recipe.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No comments yet.</p>
                <p className="text-gray-400">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRecipeDetail;
