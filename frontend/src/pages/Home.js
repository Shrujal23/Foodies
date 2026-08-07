import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  StarIcon,
  FireIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon,
  ScaleIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { getFeaturedRecipes as getFeaturedRecipesService } from '../services/recipeService';
import { ASSET_BASE_URL } from '../config';
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

const FEATURES = [
  {
    title: 'Curated Collections',
    description: 'Organize and save your favorite recipes into personalized collections for easy access.',
    icon: BookmarkIcon,
  },
  {
    title: 'Community Reviews',
    description: 'Read detailed reviews and ratings from home cooks who have tested the recipes.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    title: 'Adjustable Servings',
    description: 'Automatically scale ingredient quantities based on the number of servings you need.',
    icon: ScaleIcon,
  },
  {
    title: 'Mobile Friendly',
    description: 'Access your recipes anytime, anywhere with our fully responsive design.',
    icon: DevicePhoneMobileIcon,
  },
  {
    title: 'Global Cuisine',
    description: 'Explore recipes from cuisines around the world, from Italian to Asian fusion.',
    icon: GlobeAltIcon,
  },
  {
    title: 'Save & Share',
    description: 'Bookmark recipes and share them with friends and family instantly.',
    icon: ShareIcon,
  },
];

const STEPS = [
  { num: '1', title: 'Search & Discover', desc: 'Browse recipes by cuisine, diet, or cooking time.' },
  { num: '2', title: 'Save & Organize', desc: 'Create collections and bookmark favorites for later.' },
  { num: '3', title: 'Share & Enjoy', desc: 'Add your own recipes and get feedback from the community.' },
];

const CUISINES = [
  { id: 'all', label: 'All' },
  { id: 'italian', label: 'Italian' },
  { id: 'asian', label: 'Asian' },
  { id: 'mexican', label: 'Mexican' },
  { id: 'indian', label: 'Indian' },
];

function recipeImage(src) {
  if (!src) return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';
  return src.startsWith('http') ? src : `${ASSET_BASE_URL}${src}`;
}

export default function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(() => {
    try {
      const stored = sessionStorage.getItem('foodiesFeaturedRecipes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => recipes.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [communityRecipes, setCommunityRecipes] = useState(() => {
    try {
      const stored = sessionStorage.getItem('foodiesCommunityRecipes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [communityLoading, setCommunityLoading] = useState(
    () => communityRecipes.length === 0
  );

  useEffect(() => {
    if (recipes.length === 0) loadRecipes();
    if (communityRecipes.length === 0) loadCommunityRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await getFeaturedRecipesService();
      const result = Array.isArray(data) && data.length > 0 ? data : fallbackRecipes;
      setRecipes(result);
      sessionStorage.setItem('foodiesFeaturedRecipes', JSON.stringify(result));
    } catch {
      setRecipes(fallbackRecipes);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityRecipes = async () => {
    try {
      const data = await getFeaturedRecipesService(6);
      const recipesArray = Array.isArray(data) ? data : [data];
      const result =
        recipesArray.length > 0 ? recipesArray.slice(0, 6) : fallbackRecipes.slice(0, 6);
      setCommunityRecipes(result);
      sessionStorage.setItem('foodiesCommunityRecipes', JSON.stringify(result));
    } catch {
      const fallback = fallbackRecipes.slice(0, 6);
      setCommunityRecipes(fallback);
      sessionStorage.setItem('foodiesCommunityRecipes', JSON.stringify(fallback));
    } finally {
      setCommunityLoading(false);
    }
  };

  const commitSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      activeFilter === 'all' ||
      (recipe.cuisine && recipe.cuisine.toLowerCase() === activeFilter)
  );

  return (
    <div className="min-h-screen bg-[#fffaf7] dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-700 via-orange-600 to-orange-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fffaf7] dark:from-gray-950 to-transparent" />
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/20 bg-white/10 p-8 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-md ring-1 ring-white/10 sm:p-10 lg:p-14">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-semibold">
                <FireIcon className="h-4 w-4" />
                <span>Cook, save & share with Foodies</span>
              </div>

              <h1 className="mb-5 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Discover your next favorite recipe
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                Browse community dishes, save collections, leave reviews, and publish your own —
                all in one place.
              </p>

              <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Link
                  to="/search"
                  className="rounded-2xl bg-white px-8 py-3.5 text-center font-semibold text-orange-700 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-orange-50"
                >
                  Explore recipes
                </Link>
                <Link
                  to="/recipes/add"
                  className="rounded-2xl border-2 border-white/60 bg-white/10 px-8 py-3.5 text-center font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Share a recipe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community carousel */}
      <section className="relative z-10 -mt-8 px-4 pb-10 sm:-mt-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-orange-100/80 bg-white/95 p-5 shadow-[0_20px_60px_rgba(100,43,19,0.08)] backdrop-blur dark:border-gray-900 dark:bg-gray-900/100 sm:p-8 lg:p-10">
          {communityLoading ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Fresh from the community
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Recipes shared by home cooks like you
              </p>
              <LoadingPlaceholder variant="recipe" count={1} />
            </>
          ) : communityRecipes.length > 0 ? (
            <RecommendationCarousel
              items={communityRecipes}
              renderItem={(recipe) => (
                <Link
                  to={`/recipes/user/${recipe.id || recipe._id}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-orange-100 dark:border-gray-700 shadow-md hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-700/60 hover:-translate-y-1 transition-all duration-300 block w-full h-full"
                >
                  <div className="relative h-56 sm:h-72 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={recipeImage(recipe.image)}
                      alt={recipe.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition line-clamp-2 text-gray-900 dark:text-white">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">
                      {recipe.description || 'A delicious homemade creation'}
                    </p>
                  </div>
                </Link>
              )}
              title="Fresh from the community"
              subtitle="Recipes shared by home cooks like you"
              itemsPerView={1}
              autoScroll={true}
              scrollInterval={7000}
              className="w-full"
            />
          ) : (
            <EmptyState
              title="No community recipes yet"
              description="Be the first to share a dish with Foodies"
              actions={[
                { label: 'Add your recipe', to: '/recipes/add', primary: true },
                { label: 'Browse more', to: '/search' },
              ]}
              className="py-12"
            />
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto mb-20 max-w-7xl -mt-4 px-4 sm:-mt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { value: '50K+', label: 'Active members', sub: 'Community cooks' },
            { value: '10K+', label: 'Recipes shared', sub: 'User-created dishes' },
            { value: '100K+', label: 'Reviews', sub: 'Real feedback' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-orange-100/80 bg-white/95 px-6 py-6 text-center shadow-[0_16px_40px_rgba(100,43,19,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_20px_48px_rgba(100,43,19,0.1)] dark:border-gray-800 dark:bg-gray-900/95 dark:hover:border-orange-700/50"
            >
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-sm">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Foodies */}
      <section className="mx-auto mb-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Why Foodies?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Simple tools for discovering, saving, and sharing recipes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-[1.5rem] border border-orange-100/80 bg-white p-6 shadow-[0_16px_40px_rgba(100,43,19,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_22px_48px_rgba(100,43,19,0.1)] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-700/50"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4 border border-orange-100 dark:border-orange-900/40 group-hover:bg-orange-100">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mb-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-orange-100 bg-white px-6 py-12 shadow-[0_14px_40px_rgba(87,43,19,0.06)] dark:border-gray-800 dark:bg-gray-900 sm:px-10 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Get started in 3 steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                className="relative text-center px-4 py-6 rounded-2xl border border-transparent hover:border-orange-200 dark:hover:border-orange-800/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[58%] w-[84%] h-0.5 bg-orange-200 dark:bg-gray-700" />
                )}
                <div className="relative z-10 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4 mx-auto shadow-md ring-4 ring-orange-100 dark:ring-orange-950/50">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search + filters */}
      <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-[0_14px_40px_rgba(87,43,19,0.06)] transition-colors hover:border-orange-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 sm:p-8">
          <div className="relative max-w-3xl mx-auto mb-8">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" />
            <input
              type="text"
              placeholder="Search pasta, vegan, 30 minutes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commitSearch()}
              className="w-full pl-12 pr-28 py-3.5 text-base rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 hover:border-orange-200 dark:hover:border-gray-600 transition"
            />
            <button
              type="button"
              onClick={commitSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 hover:shadow-md transition"
            >
              Search
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Browse by cuisine
            </h3>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition duration-200 ${
                    activeFilter === f.id
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-700 dark:hover:text-orange-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured grid */}
      <section className="mx-auto mb-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Popular recipes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trending dishes from the community
            </p>
          </div>
          <Link
            to="/recipes"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <LoadingPlaceholder variant="recipe" count={8} />
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecipes.map((recipe) => {
              const totalMin =
                (Number(recipe.prepTime) || 0) + (Number(recipe.cookTime) || 0) ||
                recipe.totalTime ||
                '—';
              return (
                <div
                  key={recipe._id || recipe.id}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-orange-100/80 bg-white shadow-[0_16px_40px_rgba(100,43,19,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-[0_22px_48px_rgba(100,43,19,0.1)] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-700/50"
                >
                  <Link
                    to={
                      recipe.source === 'user' || (recipe._id && !String(recipe._id).startsWith('recipe_'))
                        ? `/recipes/user/${recipe._id || recipe.id}`
                        : `/recipes/${recipe._id || recipe.id}`
                    }
                    className="block"
                  >
                    <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={recipeImage(recipe.image)}
                        alt={recipe.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {recipe.difficulty && (
                        <span className="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/90 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 border border-orange-100 dark:border-gray-700 shadow-sm">
                          {recipe.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="p-4 pb-16">
                      <h3 className="text-base font-bold mb-1.5 line-clamp-2 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 text-sm">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-semibold">{recipe.rating ?? '—'}</span>
                        </div>
                        <span className="font-medium">
                          {totalMin === '—' ? '—' : `${totalMin} min`}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute bottom-3 right-3">
                    <SaveButton recipe={recipe} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No recipes found"
            description="Try another cuisine filter or clear filters"
            actions={[
              {
                label: 'Clear filters',
                onClick: () => setActiveFilter('all'),
                primary: true,
              },
            ]}
            className="py-14"
          />
        )}
      </section>

      {/* Newsletter */}
      <section className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-orange-400/30 bg-gradient-to-br from-orange-600 via-orange-500 to-pink-500 px-6 py-12 text-center text-white shadow-[0_20px_60px_rgba(231,90,40,0.25)] sm:px-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Get weekly recipe inspiration
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Join 20,000+ home cooks getting fresh, delicious recipe ideas every Sunday.
            Free — unsubscribe anytime.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 placeholder-gray-500 border-2 border-white/80 focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-sm"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-white text-orange-700 font-bold rounded-xl hover:bg-orange-50 hover:shadow-md hover:-translate-y-0.5 transition duration-200 border-2 border-white"
            >
              Subscribe free
            </button>
          </form>
          <p className="text-xs text-white/70 mt-4">No spam. Only tasty ideas.</p>
        </div>
      </section>
    </div>
  );
}
