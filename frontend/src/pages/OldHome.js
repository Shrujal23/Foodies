import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getFeaturedRecipes } from '../services/edamamService';
import { getCurrentUser } from '../services/authService';
import toast from 'react-hot-toast';

// Fallback recipe data in case API fails
const fallbackRecipes = [
  {
    _id: '1',
    title: 'Classic Margherita Pizza',
    description: 'A traditional Italian pizza with fresh basil, mozzarella, and tomatoes. Perfect blend of flavors on a crispy crust.',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    rating: 4.8,
    reviewCount: 1247,
    tags: ['Italian', 'Vegetarian', 'Quick'],
    views: 15420,
    likes: 892,
    author: {
      name: 'Chef Maria',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    }
  },
  {
    _id: '2',
    title: 'Spicy Thai Basil Chicken',
    description: 'A flavorful stir-fry dish with minced chicken, Thai basil, and chili. Perfectly balanced sweet, salty, and spicy flavors.',
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80',
    prepTime: 15,
    cookTime: 10,
    servings: 3,
    difficulty: 'Medium',
    rating: 4.6,
    reviewCount: 892,
    tags: ['Thai', 'Spicy', 'Asian'],
    views: 12340,
    likes: 654,
    author: {
      name: 'Chef Alex',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    }
  },
  {
    _id: '3',
    title: 'Chocolate Lava Cake',
    description: 'Decadent chocolate dessert with a gooey molten center. Serve warm with vanilla ice cream for the perfect indulgence.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    difficulty: 'Medium',
    rating: 4.9,
    reviewCount: 2156,
    tags: ['Dessert', 'Chocolate', 'Baking'],
    views: 28900,
    likes: 1456,
    author: {
      name: 'Chef Sarah',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  },
  {
    _id: '4',
    title: 'Fresh Mediterranean Salad',
    description: 'Light and refreshing salad with cucumbers, tomatoes, olives, and feta cheese. Dressed with olive oil and herbs.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'Easy',
    rating: 4.4,
    reviewCount: 634,
    tags: ['Healthy', 'Mediterranean', 'No-Cook'],
    views: 8760,
    likes: 423,
    author: {
      name: 'Chef Michael',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
    }
  },
  {
    _id: '5',
    title: 'Classic Beef Burger',
    description: 'Juicy homemade beef burger with lettuce, tomato, cheese, and special sauce. Served on a toasted brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2099&q=80',
    prepTime: 20,
    cookTime: 10,
    servings: 4,
    difficulty: 'Easy',
    rating: 4.7,
    reviewCount: 1890,
    tags: ['American', 'Comfort Food', 'Grilling'],
    views: 23450,
    likes: 1123,
    author: {
      name: 'Chef John',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    }
  },
  {
    _id: '6',
    title: 'Creamy Mushroom Risotto',
    description: 'Rich and creamy Italian rice dish with mushrooms, parmesan, and white wine. A luxurious vegetarian main course.',
    image: 'https://images.unsplash.com/photo-1673421199214-15b24f5ba04c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'Hard',
    rating: 4.5,
    reviewCount: 756,
    tags: ['Italian', 'Vegetarian', 'Creamy'],
    views: 11200,
    likes: 567,
    author: {
      name: 'Chef Emma',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
    }
  }
];

export default function Home() {
  const [recipes, setRecipes] = useState(fallbackRecipes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState({ recipes: 0, favorites: 0 });
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [trendingSearches, setTrendingSearches] = useState([
    'chocolate cake', 'pasta', 'salad', 'pizza', 'curry', 'soup'
  ]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const fetchedRecipes = await getFeaturedRecipes();
        setRecipes(fetchedRecipes);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
        setError('Failed to load recipes. Showing sample recipes instead.');
        setRecipes(fallbackRecipes);
      } finally {
        setLoading(false);
      }
    };

    const loadUserData = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    loadRecipes();
    loadUserData();

    // Set recipe of the day (random from featured recipes)
    const randomRecipe = fallbackRecipes[Math.floor(Math.random() * fallbackRecipes.length)];
    setRecipeOfTheDay(randomRecipe);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 pb-8 lg:px-8 bg-gradient-to-b from-accent-50 dark:from-accent-900 dark:to-accent-800">
        <div className="mx-auto max-w-2xl py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
              Find your next favorite recipe
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Discover delicious recipes, save your favorites, and explore nutritional information with Foodies.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/recipes/add"
                className="rounded-md bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
              >
                Share your recipe
              </Link>
              <Link to="/search" className="text-sm font-semibold leading-6 text-gray-900">
                Browse recipes <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Recipes</h2>
          <Link to="/search" className="text-accent-600 hover:text-accent-700 font-medium text-sm flex items-center">
            View all recipes
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-2"></div>
                      </div>
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-xs font-medium">{recipe.rating}</span>
                  </div>

                  {/* Difficulty Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    recipe.difficulty === 'Easy' ? 'bg-green-500/80 text-white' :
                    recipe.difficulty === 'Medium' ? 'bg-yellow-500/80 text-white' :
                    'bg-red-500/80 text-white'
                  }`}>
                    {recipe.difficulty}
                  </div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Recipe stats overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{(recipe.views || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{(recipe.likes || 0).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        {recipe.prepTime + recipe.cookTime} mins
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-accent-600 transition-colors duration-200">
                    {recipe.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(recipe.tags || []).slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating and reviews */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(recipe.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {recipe.rating} ({recipe.reviewCount})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {recipe.servings} servings
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={recipe.author.avatar}
                        alt={recipe.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{recipe.author.name}</span>
                    </div>

                    <Link
                      to={`/recipes/${recipe._id}`}
                      className="text-accent-600 hover:text-accent-700 font-medium text-sm flex items-center group-hover:bg-accent-50 dark:group-hover:bg-accent-900/20 px-3 py-1 rounded-full transition-colors duration-200"
                    >
                      View Recipe
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Breakfast', icon: '🍳' },
              { name: 'Main Course', icon: '🍝' },
              { name: 'Desserts', icon: '🍰' },
              { name: 'Vegetarian', icon: '🥗' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/search?category=${category.name.toLowerCase()}`}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <span className="text-4xl mb-2">{category.icon}</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Famous Chefs Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Our Famous Chefs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Chef Gordon Ramsay',
                specialty: 'French & British Cuisine',
                description: 'World-renowned chef known for his exceptional culinary skills and television shows.',
                image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80'
              },
              {
                name: 'Chef Julia Child',
                specialty: 'French Cuisine',
                description: 'Iconic chef who brought French cooking to American audiences through her books and TV shows.',
                image: 'https://images.unsplash.com/photo-1594736797933-d0b22d5d2d65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
              },
              {
                name: 'Chef Anthony Bourdain',
                specialty: 'Global Cuisine',
                description: 'Adventurous chef and writer who explored cuisines from around the world.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
              }
            ].map((chef) => (
              <div key={chef.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{chef.name}</h3>
                  <p className="text-accent-600 text-sm font-medium mb-2">{chef.specialty}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{chef.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Add New Recipe',
                description: 'Share your favorite recipe with the community',
                icon: '📝',
                link: '/recipes/add',
                color: 'bg-blue-500 hover:bg-blue-600'
              },
              {
                title: 'Browse Recipes',
                description: 'Discover thousands of delicious recipes',
                icon: '🔍',
                link: '/search',
                color: 'bg-green-500 hover:bg-green-600'
              },
              {
                title: 'My Recipes',
                description: 'View and manage your saved recipes',
                icon: '📚',
                link: '/my-recipes',
                color: 'bg-purple-500 hover:bg-purple-600'
              },
              {
                title: 'Recipe Analytics',
                description: 'Track your cooking journey and progress',
                icon: '📊',
                link: '/dashboard',
                color: 'bg-orange-500 hover:bg-orange-600'
              }
            ].map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-2xl mr-4`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-accent-600 transition-colors">
                      {action.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recipe of the Day */}
        {recipeOfTheDay && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Recipe of the Day</h2>
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 text-white">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">👨‍🍳</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Daily Special</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{recipeOfTheDay.title}</h3>
                  <p className="text-lg mb-6 opacity-90">{recipeOfTheDay.description}</p>
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{recipeOfTheDay.prepTime + recipeOfTheDay.cookTime} mins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{recipeOfTheDay.rating}/5</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm opacity-75">{recipeOfTheDay.difficulty}</span>
                    </div>
                  </div>
                  <Link
                    to={`/recipes/${recipeOfTheDay._id}`}
                    className="inline-flex items-center px-6 py-3 bg-white text-accent-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Cook This Recipe
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
                <div className="relative">
                  <img
                    src={recipeOfTheDay.image}
                    alt={recipeOfTheDay.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-accent-500/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Dashboard Preview (if logged in) */}
        {currentUser && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Welcome back, {currentUser.name}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your Recipes</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.recipes}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.favorites}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Statistics */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Foodies Community</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-accent-600 mb-2">10,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recipes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-600 mb-2">5,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-600 mb-2">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-600 mb-2">1M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recipe Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Searches */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Trending Searches</h2>
          <div className="flex flex-wrap gap-3">
            {trendingSearches.map((search, index) => (
              <Link
                key={search}
                to={`/search?q=${encodeURIComponent(search)}`}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
              >
                #{search}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Foodies</h2>
            <p className="text-lg mb-6 opacity-90">Get weekly recipe recommendations and cooking tips delivered to your inbox</p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-accent-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-sm mt-4 opacity-75">No spam, unsubscribe anytime</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Home Chef',
                content: 'Foodies has completely transformed my cooking experience. The recipe recommendations are spot-on!',
                avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                rating: 5
              },
              {
                name: 'Mike Chen',
                role: 'Food Blogger',
                content: 'The community features and recipe sharing make this platform incredibly engaging. Love it!',
                avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
                rating: 5
              },
              {
                name: 'Emma Davis',
                role: 'Nutritionist',
                content: 'Perfect for finding healthy recipes with detailed nutritional information. Highly recommended!',
                avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
                rating: 5
              }
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
