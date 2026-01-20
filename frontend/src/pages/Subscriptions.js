import { useState } from 'react';
import { CheckIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or yearly

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      icon: '🍽️',
      description: 'Perfect for recipe enthusiasts',
      features: [
        'Browse unlimited recipes',
        'Search across Edamam database',
        'View community recipes',
        'Save up to 10 recipes',
        'Basic profile',
      ],
      notIncluded: [
        'Unlimited bookmarks',
        'Recipe recommendations',
        'Ad-free experience',
        'Priority support',
        'Advanced filters',
      ],
      cta: 'Current Plan',
      highlighted: false,
      recommended: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 4.99 : 49.99,
      icon: '⭐',
      description: 'For serious home cooks',
      features: [
        'Everything in Free',
        'Unlimited bookmarks & collections',
        'AI-powered recipe recommendations',
        'Ad-free experience',
        'Advanced recipe filters',
        'Recipe scaling calculator',
        'Nutrition analysis',
        'Email support (24-48h)',
      ],
      notIncluded: [
        'Video cooking tutorials',
        'Premium community features',
        'Custom meal plans',
        'Priority support (1h)',
      ],
      cta: 'Subscribe Now',
      highlighted: true,
      recommended: true,
      badge: 'Most Popular',
    },
    {
      id: 'chef',
      name: 'Chef Elite',
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      icon: '👨‍🍳',
      description: 'For culinary professionals',
      features: [
        'Everything in Pro',
        'Video cooking tutorials',
        'Premium community access',
        'Custom meal planning',
        'Priority support (1h response)',
        'Export recipes to PDF',
        'Ingredient price comparison',
        'Advanced nutritional insights',
        'Sync across all devices',
      ],
      notIncluded: [],
      cta: 'Subscribe Now',
      highlighted: false,
      recommended: false,
      badge: 'Premium',
    },
  ];

  const upcomingFeatures = [
    {
      id: 1,
      title: 'Video Cooking Tutorials',
      description: 'Learn cooking techniques from professional chefs with step-by-step video guides.',
      icon: '🎥',
      releaseDate: 'Coming Feb 2026',
      availability: 'Pro+',
    },
    {
      id: 2,
      title: 'AI Recipe Generator',
      description: 'Generate unique recipes based on ingredients you have at home using AI.',
      icon: '🤖',
      releaseDate: 'Coming Mar 2026',
      availability: 'Pro+',
    },
    {
      id: 3,
      title: 'Meal Planning Assistant',
      description: 'Create personalized weekly meal plans with automated shopping lists.',
      icon: '📅',
      releaseDate: 'Coming Mar 2026',
      availability: 'Chef Elite',
    },
    {
      id: 4,
      title: 'Grocery Delivery Integration',
      description: 'Order ingredients directly from partnered grocery stores.',
      icon: '🛒',
      releaseDate: 'Coming Apr 2026',
      availability: 'Chef Elite',
    },
    {
      id: 5,
      title: 'Social Cooking Events',
      description: 'Connect with other foodies and join virtual cooking sessions.',
      icon: '👥',
      releaseDate: 'Coming May 2026',
      availability: 'Pro+',
    },
    {
      id: 6,
      title: 'Recipe Monetization',
      description: 'Earn money by sharing your unique recipes with the community.',
      icon: '💰',
      releaseDate: 'Coming Jun 2026',
      availability: 'All Users',
    },
  ];

  const handleSubscribe = (planId) => {
    if (planId === 'free') {
      toast.success('You already have the Free plan!');
      return;
    }
    toast.success(`Redirecting to checkout for ${planId}...`);
    // In production, integrate with Stripe or payment provider
    setTimeout(() => {
      toast.error('Payment integration coming soon!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <span className="text-blue-700 dark:text-blue-300 text-sm font-semibold flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" />
            Premium Plans Available
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Upgrade Your Cooking Experience
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Choose the perfect plan for your culinary journey. Unlock exclusive features and join thousands of food lovers.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-6 mb-12">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-lg font-semibold transition relative ${
              billingCycle === 'yearly'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Yearly Billing
            <span className="absolute -top-3 -right-12 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl transition transform hover:scale-105 duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl md:scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 right-6">
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-8">
                  <div className="text-4xl mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p
                    className={`text-sm mb-6 ${
                      plan.highlighted ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span
                      className={`${
                        plan.highlighted
                          ? 'text-blue-100'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && plan.price > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      ${(plan.price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                  }`}
                >
                  {plan.cta}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-sm uppercase opacity-75">Included</h4>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <CheckIcon
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-blue-100' : 'text-green-500'
                        }`}
                      />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Not Included */}
                {plan.notIncluded.length > 0 && (
                  <div className="space-y-4 pt-8 border-t border-gray-300 dark:border-gray-700">
                    <h4 className="font-semibold text-sm uppercase opacity-50">Not included</h4>
                    {plan.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex gap-3 items-start opacity-50">
                        <span className="text-gray-400 mt-0.5">✕</span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Detailed Comparison
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">
                    Chef Elite
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Browse recipes', free: true, pro: true, elite: true },
                  { feature: 'Save recipes', free: '10', pro: 'Unlimited', elite: 'Unlimited' },
                  { feature: 'Ad-free browsing', free: false, pro: true, elite: true },
                  { feature: 'Advanced filters', free: false, pro: true, elite: true },
                  { feature: 'Nutrition analysis', free: false, pro: true, elite: true },
                  { feature: 'Video tutorials', free: false, pro: false, elite: true },
                  { feature: 'Priority support', free: false, pro: false, elite: true },
                  { feature: 'Custom meal plans', free: false, pro: false, elite: true },
                  { feature: 'API access', free: false, pro: false, elite: true },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.free === true ? (
                        <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                      ) : row.free === false ? (
                        <span className="text-gray-400">✕</span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{row.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.pro === true ? (
                        <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                      ) : row.pro === false ? (
                        <span className="text-gray-400">✕</span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{row.pro}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.elite === true ? (
                        <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                      ) : row.elite === false ? (
                        <span className="text-gray-400">✕</span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{row.elite}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Features */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            🚀 Exciting Features Coming Soon
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            We're constantly innovating to enhance your cooking experience. Here's what's on our roadmap.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{feature.icon}</span>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {feature.availability}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm font-semibold">
                  <FireIcon className="w-4 h-4" />
                  {feature.releaseDate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.',
              },
              {
                q: 'Do you offer refunds?',
                a: "We offer 7-day full refunds if you're not satisfied with your subscription. No questions asked!",
              },
              {
                q: 'Can I change my plan?',
                a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'Is there a student discount?',
                a: 'Yes! Students get 50% off Pro plans with a valid student email. Contact our support team.',
              },
              {
                q: 'Do you offer family plans?',
                a: 'Family plans are coming soon! Sign up for our newsletter to be notified when they launch.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay. More options coming soon.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Cooking?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of food lovers who are transforming their cooking with Foodies premium features.
          </p>
          <button
            onClick={() => handleSubscribe('pro')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
