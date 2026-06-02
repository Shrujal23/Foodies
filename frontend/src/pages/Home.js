import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  StarIcon,
  FireIcon,
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
      setRecipes(Array.isArray(recipes) && recipes.length > 0 ? recipes : fallbackRecipes);
    } catch (error) {
      setRecipes(fallbackRecipes);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityRecipes = async () => {
    try {
      const data = await getFeaturedRecipesService(6);
      // Ensure we always have an array
      const recipesArray = Array.isArray(data) ? data : [data];
      console.log('Community recipes loaded:', recipesArray.length, recipesArray);
      setCommunityRecipes(recipesArray.length > 0 ? recipesArray.slice(0, 6) : fallbackRecipes.slice(0, 6));
    } catch (error) {
      console.error('Error loading community recipes:', error);
      setCommunityRecipes(fallbackRecipes.slice(0, 6));
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-br from-orange-700 via-orange-600 to-orange-500">
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent" />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-white/20 font-bold mb-8">
              <FireIcon className="w-6 h-6" />
              <span>Join 50,000+ Food Lovers</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
              Discover Your Next Favorite Recipe
            </h1>
            
            <p className="text-lg lg:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Explore thousands of delicious recipes, save your favorites, and share your culinary creations with a community.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/search" 
                className="px-10 py-4 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-50 transition"
              >
                Explore Recipes
              </Link>
              <Link 
                to="/recipes/add" 
                className="px-10 py-4 bg-white/20 text-white font-bold rounded-lg border border-white/50 hover:bg-white/30 transition"
              >
                Share Your Recipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Carousel Section - RIGHT BELOW HERO */}
      <section className="w-full bg-white dark:bg-gray-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          {communityLoading ? (
            <>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Fresh from the Community
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                Discover amazing recipes shared by home cooks like you
              </p>
              <LoadingPlaceholder variant="recipe" count={1} />
            </>
          ) : communityRecipes.length > 0 ? (
            <RecommendationCarousel
              items={communityRecipes}
              renderItem={(recipe) => (
                <Link
                  to={`/recipes/user/${recipe.id || recipe._id}`}
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300 block w-full h-full"
                >
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition line-clamp-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-base">
                      {recipe.description || 'A delicious homemade creation'}
                    </p>
                  </div>
                </Link>
              )}
              title="Fresh from the Community"
              subtitle="Discover amazing recipes shared by home cooks like you"
              itemsPerView={1}
              autoScroll={true}
              scrollInterval={6000}
              className="w-full"
            />
          ) : (
            <EmptyState
              title="No community recipes yet"
              description="Be the first to share your culinary creation with the Foodies community"
              actions={[
                { label: 'Add Your Recipe', to: '/recipes/add', primary: true },
                { label: 'Browse More', to: '/search' }
              ]}
              className="py-16 bg-white/50 dark:bg-gray-800/50 rounded-3xl"
            />
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative -mt-12 mb-24 max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-3">50K+</div>
            <div className="text-gray-700 dark:text-gray-300 font-semibold">Active Members</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Community Chefs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <div className="text-4xl font-bold text-pink-600 mb-3">10K+</div>
            <div className="text-gray-700 dark:text-gray-300 font-semibold">Recipes Shared</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">User-Created Dishes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <div className="text-4xl font-bold text-rose-600 mb-3">100K+</div>
            <div className="text-gray-700 dark:text-gray-300 font-semibold">Reviews & Ratings</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Community Feedback</div>
          </div>
        </div>
      </section>

      {/* Why Choose Foodies Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto mb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Foodies?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience the best recipe discovery platform built by food lovers, for food lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Curated Collections',
              description: 'Organize and save your favorite recipes into personalized collections for easy access.'
            },
            {
              title: 'Community Reviews',
              description: 'Read detailed reviews and ratings from home cooks who have tested the recipes.'
            },
            {
              title: 'Adjustable Servings',
              description: 'Automatically scale ingredient quantities based on the number of servings you need.'
            },
            {
              title: 'Mobile Friendly',
              description: 'Access your recipes anytime, anywhere with our fully responsive design.'
            },
            {
              title: 'Global Cuisine',
              description: 'Explore recipes from cuisines around the world, from Italian to Asian fusion.'
            },
            {
              title: 'Save & Share',
              description: 'Bookmark recipes and share them with friends and family instantly.'
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-12 md:p-20 mb-24 max-w-7xl mx-auto shadow">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white text-center mb-16">
          Get Started in 3 Easy Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { num: '01', title: 'Search & Discover', desc: 'Browse thousands of recipes by cuisine, diet, or cooking time.' },
            { num: '02', title: 'Save & Organize', desc: 'Create collections and bookmark your favorite recipes for quick access.' },
            { num: '03', title: 'Share & Enjoy', desc: 'Add your own recipes, share with the community, and get feedback.' }
          ].map((step, idx) => (
            <div key={idx} className="relative text-center">
              {idx !== 2 && (
                <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-1 bg-gray-300" />
              )}
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12">
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-600" />
              <input
                type="text"
                placeholder="What are you craving today? Try 'pasta', 'vegan', '30 minutes'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && commitSearch()}
                className="w-full pl-16 pr-40 py-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/30 transition"
              />
              <button
                onClick={() => commitSearch()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition"
              >
                Search
              </button>
            </div>
          </div>

          {/* Cuisine Filters */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Browse by Cuisine</h3>
            <div className="flex flex-wrap gap-4">
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
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    activeFilter === f.id
                      ? 'bg-orange-600 text-white'
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
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Recipes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base">Explore trending dishes loved by our community</p>
        </div>

        {loading ? (
          <LoadingPlaceholder variant="recipe" count={8} />
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe._id}
                className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <Link to={`/recipes/${recipe._id}`} className="block">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 px-3 py-1 rounded text-xs font-semibold">
                      {recipe.difficulty}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 text-sm">
                      {recipe.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{recipe.rating}</span>
                      </div>
                      <span className="font-medium">{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                  </div>
                </Link>
                <div className="absolute bottom-4 right-4">
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

      {/* Newsletter CTA */}
      <section className="bg-orange-600 rounded-lg p-12 text-center text-white mb-24 max-w-7xl mx-auto shadow">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Get Weekly Recipe Inspiration
        </h2>
        <p className="text-lg lg:text-xl mb-10 max-w-3xl mx-auto opacity-90">
          Join 20,000+ home cooks getting fresh, delicious recipes every Sunday
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-50 transition"
          >
            Subscribe Free
          </button>
        </form>
      </section>
    </div>
  );
}