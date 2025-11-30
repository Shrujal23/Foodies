// src/pages/Home.js
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  PlusCircleIcon,
  HeartIcon,
  SparklesIcon,
  UsersIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { API_BASE_URL, ASSET_BASE_URL } from '../config';
import { getFeaturedRecipes } from '../services/edamamService';
import SaveButton from '../components/recipes/SaveButton';

const fallbackRecipes = [
  {
    _id: '1',
    title: 'Classic Margherita Pizza',
    description: 'A traditional Italian pizza with fresh basil, mozzarella, and tomatoes.',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4dd545b?w=800',
    prepTime: 20,
    cookTime: 15,
    difficulty: 'Easy',
    rating: 4.8,
    cuisine: 'italian',
  },
  {
    _id: '2',
    title: 'Pad Thai Noodles',
    description: 'Authentic Thai stir-fried rice noodles with shrimp, peanuts, and lime.',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
    prepTime: 15,
    cookTime: 20,
    difficulty: 'Medium',
    rating: 4.7,
    cuisine: 'asian',
  },
  {
    _id: '3',
    title: 'Chicken Tikka Masala',
    description: 'Tender chicken in a rich, creamy tomato curry sauce.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    prepTime: 30,
    cookTime: 25,
    difficulty: 'Medium',
    rating: 4.9,
    cuisine: 'indian',
  },
  {
    _id: '4',
    title: 'Street Tacos al Pastor',
    description: 'Marinated pork tacos with pineapple, onion, and cilantro.',
    image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800',
    prepTime: 25,
    cookTime: 15,
    difficulty: 'Easy',
    rating: 4.6,
    cuisine: 'mexican',
  },
  {
    _id: '5',
    title: 'California Sushi Roll',
    description: 'Fresh crab, avocado, and cucumber wrapped in nori and rice.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
    prepTime: 45,
    cookTime: 30,
    difficulty: 'Hard',
    rating: 4.9,
    cuisine: 'asian',
  },
  {
    _id: '6',
    title: 'Butter Chicken',
    description: 'Creamy, buttery tomato-based curry with tender chicken.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
    prepTime: 30,
    cookTime: 25,
    difficulty: 'Medium',
    rating: 4.8,
    cuisine: 'indian',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeDietFilter, setActiveDietFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load featured recipes
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFeaturedRecipes();
        const final = data.length ? data : fallbackRecipes;
        setRecipes(final);
        setRecipeOfTheDay(final[Math.floor(Math.random() * final.length)]);
      } catch {
        setRecipes(fallbackRecipes);
        setRecipeOfTheDay(fallbackRecipes[0]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load community recipes
  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/recipes/user-recipes`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const processed = (Array.isArray(data) ? data : []).slice(0, 6).map(r => ({
          ...r,
          image: r.image?.startsWith('http') ? r.image : `${ASSET_BASE_URL}${r.image}`,
        }));
        setCommunityRecipes(processed);
      } catch (err) {
        console.error('Failed to load community recipes');
      } finally {
        setCommunityLoading(false);
      }
    };
    loadCommunity();
  }, []);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(Array.isArray(saved) ? saved.slice(0, 6) : []);
    } catch {}
  }, []);

  const commitSearch = (q = searchQuery) => {
    const query = q.trim();
    if (!query) return;
    const updated = [query, ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  };

  const getDisplayName = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return user?.display_name || user?.username || '';
    } catch {
      return '';
    }
  };

  const filteredRecipes = recipes.filter(r => {
    const q = searchQuery.toLowerCase();
    const title = (r.title || '').toLowerCase();
    const desc = (r.description || '').toLowerCase();
    const cuisine = (r.cuisine || 'other').toLowerCase();

    const matchesSearch = title.includes(q) || desc.includes(q);
    const matchesCuisine = activeFilter === 'all' || 
      (activeFilter === 'other' ? !['italian','asian','mexican','indian'].includes(cuisine) : cuisine === activeFilter);
    const matchesDiet = activeDietFilter === 'all' || (r.dietary || []).includes(activeDietFilter);

    return matchesSearch && matchesCuisine && matchesDiet;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortOption) {
      case 'popular': return (b.likes || 0) - (a.likes || 0);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'quickest': return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900">

      {/* HERO - Recipe of the Day */}
      {recipeOfTheDay && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-pink-600 to-rose-600" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-lg font-bold mb-8 shadow-xl">
                  <FireIcon className="w-6 h-6" />
                  Recipe of the Day
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                  {recipeOfTheDay.title}
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 mb-10 max-w-2xl">
                  {recipeOfTheDay.description}
                </p>

                <div className="flex flex-wrap gap-10 mb-12">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <ClockIcon className="w-9 h-9" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{recipeOfTheDay.prepTime + recipeOfTheDay.cookTime} min</div>
                      <div className="text-white/80">Total time</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <StarIcon className="w-9 h-9 text-yellow-300" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{recipeOfTheDay.rating}</div>
                      <div className="text-white/80">Community rating</div>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/recipes/${recipeOfTheDay._id}`}
                  className="inline-flex items-center gap-4 px-10 py-6 bg-white text-orange-600 font-bold text-xl rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  View Full Recipe
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />
                <img
                  src={recipeOfTheDay.image}
                  alt={recipeOfTheDay.title}
                  className="w-full h-96 lg:h-full object-cover rounded-3xl shadow-3xl"
                />
                <div className="absolute top-8 right-8 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-2xl">
                  Trending #1
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* Greeting */}
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {greeting()}{getDisplayName() ? `, ${getDisplayName()}!` : '!'}
          </h2>
          <p className="text-2xl text-gray-700 dark:text-gray-300">
            Discover your next favorite recipe
          </p>
        </div>

                {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {[
            { to: "/search", icon: MagnifyingGlassIcon, label: "Search Recipes", gradient: "from-orange-500 to-pink-600" },
            { to: "/recipes/add", icon: PlusCircleIcon, label: "Add Your Recipe", gradient: "from-emerald-500 to-teal-600" },
            { to: "/favorites", icon: HeartIcon, label: "My Favorites", gradient: "from-rose-500 to-pink-600" },
            { to: "/about", icon: InformationCircleIcon, label: "About Us", gradient: "from-purple-500 to-indigo-600" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group relative overflow-hidden rounded-3xl shadow-2xl transform hover:-translate-y-6 hover:shadow-3xl transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative p-16 text-center text-white">
                <item.icon className="w-24 h-24 mx-auto mb-8 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-3xl font-bold">{item.label}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* SEARCH & FILTERS - PERFECTLY FIXED */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl shadow-3xl p-12 mb-24 border border-white/30">
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 text-orange-500" />
              <input
                type="text"
                placeholder="What are you craving today? Try 'pasta', 'vegan', '30 minutes'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && commitSearch()}
                className="w-full pl-24 pr-56 py-8 text-2xl rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30 transition-all duration-300"
              />
              <button
                onClick={() => commitSearch()}
                className="absolute right-6 top-1/2 -translate-y-1/2 px-12 py-5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-xl rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Search
              </button>
            </div>
          </div>

          {/* Cuisine Filters */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Cuisine</h3>
            <div className="flex flex-wrap gap-5">
              {[
                { id: 'all', label: 'All Cuisines' },
                { id: 'italian', label: 'Italian' },
                { id: 'asian', label: 'Asian' },
                { id: 'mexican', label: 'Mexican' },
                { id: 'indian', label: 'Indian' },
                { id: 'other', label: 'Other' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                    activeFilter === f.id
                      ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-orange-500/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Filters */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Diet & Lifestyle</h3>
            <div className="flex flex-wrap gap-5">
              {[
                { id: 'all', label: 'All Diets' },
                { id: 'vegetarian', label: 'Vegetarian' },
                { id: 'vegan', label: 'Vegan' },
                { id: 'gluten-free', label: 'Gluten-Free' },
                { id: 'low-carb', label: 'Low Carb' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveDietFilter(f.id)}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                    activeDietFilter === f.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/70 dark:bg-gray-800/70 rounded-3xl overflow-hidden shadow-xl animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700" />
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-24">
            {sortedRecipes.map(recipe => (
              <div
                key={recipe._id}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl hover:-translate-y-4 transition-all duration-500"
              >
                <Link to={`/recipes/${recipe._id}`} className="block">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur px-4 py-2 rounded-full text-sm font-bold">
                      {recipe.difficulty}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-6">
                      {recipe.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <StarIcon className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold">{recipe.rating}</span>
                      </div>
                      <span className="font-medium">{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                  </div>
                </Link>
                <div className="absolute bottom-6 right-6">
                  <SaveButton recipe={recipe} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <SparklesIcon className="w-32 h-32 mx-auto text-gray-300 dark:text-gray-700 mb-8" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No recipes found</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Community Section */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Fresh from the Community
            </h2>
            <Link to="/my-recipes" className="text-xl font-bold text-orange-600 hover:text-orange-700 flex items-center gap-3">
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>

          {communityLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white/70 dark:bg-gray-800/70 rounded-3xl overflow-hidden shadow-xl animate-pulse">
                  <div className="h-56 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-8">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : communityRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {communityRecipes.map(r => (
                <Link
                  key={r.id || r._id}
                  to={`/recipes/user/${r.id || r._id}`}
                  className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl hover:-translate-y-4 transition-all duration-500"
                >
                  {r.image && (
                    <img src={r.image} alt={r.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                      {r.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {r.description || 'A delicious homemade creation'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/50 dark:bg-gray-800/50 rounded-3xl">
              <UsersIcon className="w-24 h-24 mx-auto text-gray-400 mb-6" />
              <p className="text-2xl text-gray-600 dark:text-gray-400">
                No community recipes yet. Be the first to <Link to="/recipes/add" className="text-orange-600 font-bold hover:underline">share yours</Link>!
              </p>
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-3xl p-16 text-center text-white shadow-3xl">
          <SparklesIcon className="w-20 h-20 mx-auto mb-8" />
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Get Weekly Recipe Inspiration
          </h2>
          <p className="text-xl lg:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
            Join 20,000+ home cooks getting fresh, delicious recipes every Sunday
          </p>
          <form className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-10 py-6 rounded-2xl text-gray-900 text-xl focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              className="px-12 py-6 bg-white text-orange-600 font-bold text-xl rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Subscribe Free
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}