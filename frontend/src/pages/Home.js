import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { getFeaturedRecipes as getFeaturedRecipesService } from '../services/recipeService';
import SaveButton from '../components/recipes/SaveButton';
import EmptyState from '../components/common/EmptyState';
import LoadingPlaceholder from '../components/common/LoadingPlaceholder';
import RecommendationCarousel from '../components/common/RecommendationCarousel';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
    loadCommunityRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const recipes = await getFeaturedRecipesService();
      setRecipes(recipes.length > 0 ? recipes : fallbackRecipes);
    } catch (error) {
      setRecipes(fallbackRecipes);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityRecipes = async () => {
    try {
      const data = await getFeaturedRecipesService(6);
      setCommunityRecipes(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (error) {
      console.error('Error loading community recipes:', error);
    } finally {
      setCommunityLoading(false);
    }
  };

  const commitSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const filteredRecipes = recipes.filter(recipe => 
    activeFilter === 'all' || (recipe.cuisine && recipe.cuisine.toLowerCase() === activeFilter)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900">

      {/* ENHANCED HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-pink-600 to-rose-600" />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-lg font-bold mb-8 shadow-xl">
              <FireIcon className="w-6 h-6" />
              <span>Join 50,000+ Food Lovers Worldwide</span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-extrabold leading-tight mb-8">
              Discover Your Next <span className="bg-gradient-to-r from-orange-200 to-pink-200 bg-clip-text text-transparent">Favorite Recipe</span>
            </h1>
            
            <p className="text-xl lg:text-3xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Explore thousands of delicious recipes, save your favorites, and share your culinary creations with a passionate community.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/search" 
                className="px-10 py-5 bg-white text-orange-600 font-bold text-xl rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Explore Recipes
              </Link>
              <Link 
                to="/recipes/add" 
                className="px-10 py-5 bg-white/20 backdrop-blur text-white font-bold text-xl rounded-2xl border-2 border-white/50 hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
              >
                Share Your Recipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative -mt-16 mb-24 max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition">
            <div className="text-5xl font-bold text-orange-600 mb-3">50K+</div>
            <div className="text-gray-700 dark:text-gray-300 font-semibold">Active Members</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Community Chefs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition">
            <div className="text-5xl font-bold text-pink-600 mb-3">10K+</div>
            <div className="text-gray-700 dark:text-gray-300 font-semibold">Recipes Shared</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">User-Created Dishes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition">
            <div className="text-5xl font-bold text-rose-600 mb-3">100K+</div>
            <div className="text-gray-700 dark:text-gray-300 font-semibold">Reviews & Ratings</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Community Feedback</div>
          </div>
        </div>
      </section>

      {/* Why Choose Foodies Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto mb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Why Choose Foodies?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience the best recipe discovery platform built by food lovers, for food lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '👨‍🍳',
              title: 'Curated Collections',
              description: 'Organize and save your favorite recipes into personalized collections for easy access.'
            },
            {
              icon: '⭐',
              title: 'Community Reviews',
              description: 'Read detailed reviews and ratings from home cooks who have tested the recipes.'
            },
            {
              icon: '🔄',
              title: 'Adjustable Servings',
              description: 'Automatically scale ingredient quantities based on the number of servings you need.'
            },
            {
              icon: '📱',
              title: 'Mobile Friendly',
              description: 'Access your recipes anytime, anywhere with our fully responsive design.'
            },
            {
              icon: '🌍',
              title: 'Global Cuisine',
              description: 'Explore recipes from cuisines around the world, from Italian to Asian fusion.'
            },
            {
              icon: '💾',
              title: 'Save & Share',
              description: 'Bookmark recipes and share them with friends and family instantly.'
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-12 md:p-20 mb-24 max-w-7xl mx-auto shadow-xl">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-16">
          Get Started in 3 Easy Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { num: '01', title: 'Search & Discover', desc: 'Browse thousands of recipes by cuisine, diet, or cooking time.' },
            { num: '02', title: 'Save & Organize', desc: 'Create collections and bookmark your favorite recipes for quick access.' },
            { num: '03', title: 'Share & Enjoy', desc: 'Add your own recipes, share with the community, and get feedback.' }
          ].map((step, idx) => (
            <div key={idx} className="relative">
              {idx !== 2 && (
                <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500" />
              )}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg mx-auto">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl shadow-3xl p-12 border border-white/30">
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
        </div>
      </div>

      {/* Featured Recipes Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Popular Recipes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Explore trending dishes loved by our community</p>
        </div>

        {loading ? (
          <LoadingPlaceholder variant="recipe" count={8} />
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredRecipes.map(recipe => (
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
          <EmptyState
            icon="🔍"
            title="No recipes found"
            description="Try adjusting your filters to find delicious dishes"
            actions={[
              { label: 'Clear Filters', onClick: () => setActiveFilter('all'), primary: true }
            ]}
            className="py-16"
          />
        )}
      </section>

      {/* Community Recipes Section */}
      <section className="mb-32 max-w-7xl mx-auto px-6">
        {communityLoading ? (
          <>
            <div className="mb-12">
              <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Fresh from the Community
              </h2>
            </div>
            <LoadingPlaceholder variant="recipe" count={4} />
          </>
        ) : communityRecipes.length > 0 ? (
          <RecommendationCarousel
            items={communityRecipes}
            renderItem={(recipe) => (
              <Link
                to={`/recipes/user/${recipe.id || recipe._id}`}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl hover:-translate-y-4 transition-all duration-500 block h-full"
              >
                {recipe.image && (
                  <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition line-clamp-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {recipe.description || 'A delicious homemade creation'}
                  </p>
                </div>
              </Link>
            )}
            title="Fresh from the Community"
            subtitle="Discover amazing recipes shared by home cooks like you"
            itemsPerView={4}
            autoScroll={true}
            scrollInterval={6000}
          />
        ) : (
          <EmptyState
            icon="👥"
            title="No community recipes yet"
            description="Be the first to share your culinary creation with the Foodies community"
            actions={[
              { label: 'Add Your Recipe', to: '/recipes/add', primary: true },
              { label: 'Browse More', to: '/search' }
            ]}
            className="py-16 bg-white/50 dark:bg-gray-800/50 rounded-3xl"
          />
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-3xl p-16 text-center text-white shadow-3xl mb-24 max-w-7xl mx-auto">
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
  );
}
