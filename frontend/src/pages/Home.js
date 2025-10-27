import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFeaturedRecipes } from '../services/edamamService';
import { getCurrentUser } from '../services/authService';

// Fallback recipe data
const fallbackRecipes = [
  {
    _id: '1',
    title: 'Classic Margherita Pizza',
    description: 'A traditional Italian pizza with fresh basil, mozzarella, and tomatoes.',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
    prepTime: 20,
    cookTime: 15,
    difficulty: 'Easy',
    rating: 4.8,
    cuisine: 'italian'
  },
  {
    _id: '2',
    title: 'Pad Thai Noodles',
    description: 'Authentic Thai rice noodles with shrimp, tofu, and crunchy peanuts.',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
    prepTime: 15,
    cookTime: 20,
    difficulty: 'Medium',
    rating: 4.7,
    cuisine: 'asian'
  },
  {
    _id: '3',
    title: 'Chicken Tikka Masala',
    description: 'Tender chicken in a rich and creamy tomato-based curry sauce.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    prepTime: 30,
    cookTime: 25,
    difficulty: 'Medium',
    rating: 4.9,
    cuisine: 'indian'
  },
  {
    _id: '4',
    title: 'Street Tacos',
    description: 'Authentic Mexican tacos with marinated meat, onions, and cilantro.',
    image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b',
    prepTime: 25,
    cookTime: 15,
    difficulty: 'Easy',
    rating: 4.6,
    cuisine: 'mexican'
  },
  {
    _id: '5',
    title: 'Sushi Roll Platter',
    description: 'Fresh assortment of sushi rolls with premium fish and vegetables.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    prepTime: 45,
    cookTime: 30,
    difficulty: 'Hard',
    rating: 4.9,
    cuisine: 'asian'
  },
  {
    _id: '6',
    title: 'Butter Chicken',
    description: 'Creamy, tomato-based curry with tender chicken pieces.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
    prepTime: 30,
    cookTime: 25,
    difficulty: 'Medium',
    rating: 4.8,
    cuisine: 'indian'
  }
];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeDietFilter, setActiveDietFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Sort recipes based on selected option
  const sortRecipes = (recipes) => {
    switch (sortOption) {
      case 'popular':
        return [...recipes].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'rating':
        return [...recipes].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'quickest':
        return [...recipes].sort((a, b) => 
          ((a.prepTime || 0) + (a.cookTime || 0)) - ((b.prepTime || 0) + (b.cookTime || 0))
        );
      case 'newest':
      default:
        return [...recipes].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
  };

  const dietaryFilters = [
    { id: 'all', label: 'All', icon: '🍽️' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { id: 'low-carb', label: 'Low Carb', icon: '🥩' }
  ];

  const cuisineFilters = [
    { id: 'all', label: 'All Cuisines' },
    { id: 'italian', label: 'Italian', icon: '🍝' },
    { id: 'asian', label: 'Asian', icon: '🍜' },
    { id: 'mexican', label: 'Mexican', icon: '🌮' },
    { id: 'indian', label: 'Indian', icon: '🍛' },
    { id: 'other', label: 'Other', icon: '🍽️' }
  ];

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const fetchedRecipes = await getFeaturedRecipes();
        setRecipes(fetchedRecipes.length ? fetchedRecipes : fallbackRecipes);
        // Set a random recipe as recipe of the day
        const randomRecipe = fetchedRecipes[Math.floor(Math.random() * fetchedRecipes.length)];
        setRecipeOfTheDay(randomRecipe);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setRecipes(fallbackRecipes);
        setRecipeOfTheDay(fallbackRecipes[0]);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Filter recipes based on search and cuisine
  const filteredRecipes = recipes.filter(recipe => {
    // Safely handle potentially undefined values
    const title = recipe?.title || '';
    const description = recipe?.description || '';
    const cuisine = recipe?.cuisine || 'other';

    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = activeFilter === 'all' || 
      (activeFilter === 'other' 
        ? !['italian', 'asian', 'mexican', 'indian'].includes(cuisine.toLowerCase())
        : cuisine.toLowerCase() === activeFilter);
    
    const dietaryPreference = recipe?.dietary || [];
    const matchesDietary = activeDietFilter === 'all' || dietaryPreference.includes(activeDietFilter);
    return matchesSearch && matchesCuisine && matchesDietary;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
      {/* Hero Section with Recipe of the Day */}
      {recipeOfTheDay && (
  <div className="relative bg-accent-600 text-white dark:bg-accent-800">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 mb-4">
                  ✨ Recipe of the Day
                </span>
                <h1 className="text-4xl font-bold mb-4">{recipeOfTheDay.title}</h1>
                <p className="text-lg mb-6 text-accent-100">{recipeOfTheDay.description}</p>
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">⏱️</span>
                    <span>{recipeOfTheDay.prepTime + recipeOfTheDay.cookTime} mins</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">⭐</span>
                    <span>{recipeOfTheDay.rating}</span>
                  </div>
                </div>
                <Link
                  to={`/recipes/${recipeOfTheDay._id}`}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-accent-600 font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Recipe
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden">
                <img
                  src={recipeOfTheDay.image}
                  alt={recipeOfTheDay.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                  <svg className="w-5 h-5 absolute right-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  className="px-4 py-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  onChange={(e) => setSortOption(e.target.value)}
                  value={sortOption}
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="quickest">Quickest to Make</option>
                </select>
              </div>
              <Link
              to="/recipes/add"
              className="inline-flex items-center px-4 py-3 rounded-lg bg-accent-600 text-white font-semibold hover:bg-accent-700 transition-colors"
            >
              <span className="mr-2">📝</span>
              Share Recipe
            </Link>
          </div>

          {/* Filter Groups */}
          <div className="space-y-4">
            {/* Cuisine Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cuisine</h3>
              <div className="flex flex-wrap gap-2">
                {cuisineFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-accent-600 text-white'
                        : 'bg-white dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {filter.icon && <span className="mr-2">{filter.icon}</span>}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveDietFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeDietFilter === filter.id
                        ? 'bg-accent-600 text-white'
                        : 'bg-white dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {filter.icon && <span className="mr-2">{filter.icon}</span>}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg"></div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortRecipes(filteredRecipes).map((recipe) => (
              <Link
                key={recipe._id}
                to={`/recipes/${recipe._id}`}
                className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative h-48">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white">
                    {recipe.difficulty}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-accent-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">⭐</span>
                      {recipe.rating}
                    </div>
                    <div>{recipe.prepTime + recipe.cookTime} mins</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredRecipes.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Top Chefs Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Top Chefs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Master Chef',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
                recipes: 45,
                followers: '2.3k',
                specialty: 'Italian Cuisine'
              },
              {
                name: 'David Chen',
                role: 'Executive Chef',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
                recipes: 38,
                followers: '1.8k',
                specialty: 'Asian Fusion'
              },
              {
                name: 'Maria Garcia',
                role: 'Pastry Chef',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
                recipes: 52,
                followers: '3.1k',
                specialty: 'Desserts'
              },
              {
                name: 'James Wilson',
                role: 'Sous Chef',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
                recipes: 29,
                followers: '1.5k',
                specialty: 'Modern American'
              }
            ].map((chef) => (
              <div key={chef.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={chef.avatar}
                    alt={chef.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-accent-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                    👨‍🍳
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{chef.name}</h3>
                <p className="text-accent-600 text-sm mb-3">{chef.role}</p>
                <p className="text-gray-600 text-sm mb-4">{chef.specialty}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <div>
                    <div className="font-semibold">{chef.recipes}</div>
                    <div>Recipes</div>
                  </div>
                  <div>
                    <div className="font-semibold">{chef.followers}</div>
                    <div>Followers</div>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 px-4 border border-accent-600 text-accent-600 rounded-lg hover:bg-accent-600 hover:text-white transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription Section */}
  <div className="mt-16 bg-accent-50 dark:bg-accent-800 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Weekly Recipe Inspiration</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter and receive hand-picked recipes, cooking tips, and exclusive content
              directly in your inbox every week.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              Join 10,000+ food enthusiasts who love getting weekly updates! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}