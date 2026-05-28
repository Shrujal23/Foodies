import { useState } from 'react';
import { CheckIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [billingCycle, setBillingCycle] = useState('monthly');


  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for discovering Indian recipes',
      features: [
        'Unlimited recipe browsing',
        'Search with Edamam',
        'Community recipes',
        'Save up to 15 recipes',
        'Basic AI suggestions',
      ],
      notIncluded: [
        'Unlimited collections',
        'Advanced AI Chef',
        'Ad-free experience',
        'Recipe scaling & nutrition',
        'Priority support',
      ],
      cta: 'Current Plan',
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 149 : 1199,
      description: 'For passionate home cooks',
      features: [
        'Everything in Free',
        'Unlimited saves & collections',
        'Advanced AI Chef (Masala AI)',
        'Ad-free experience',
        'Recipe scaling calculator',
        'Nutrition analysis',
        'Advanced filters (spice level, region)',
        'Email support',
      ],
      notIncluded: [
        'Video tutorials',
        'Custom meal planner',
        'Priority support',
      ],
      cta: 'Subscribe Now',
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      id: 'elite',
      name: 'Chef Elite',
      price: billingCycle === 'monthly' ? 299 : 2499,
      description: 'For serious food lovers',
      features: [
        'Everything in Pro',
        'Video cooking tutorials',
        'Custom weekly meal planner',
        'Priority support (fast response)',
        'Export recipes as PDF',
        'Ingredient price comparison',
        'Early access to new features',
      ],
      notIncluded: [],
      cta: 'Subscribe Now',
      highlighted: false,
      badge: 'Premium',
    },
  ];

  const faqs = [
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of the current billing period."
    },
    {
      q: "Do you offer refunds?",
      a: "We offer a 7-day money-back guarantee. If you're not satisfied, contact us and we'll process a full refund."
    },
    {
      q: "How does the AI Chef work?",
      a: "Our Masala AI Chef is powered by Google Gemini and is deeply trained on Indian cuisine."
    },
    {
      q: "Can I switch plans later?",
      a: "Absolutely! You can upgrade or downgrade your plan anytime."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept UPI, Credit/Debit Cards, PayPal, and Razorpay."
    },
  ];

  const upcomingFeatures = [
    { title: 'Video Cooking Tutorials', availability: 'Pro+' },
    { title: 'Smart Meal Planner', availability: 'Chef Elite' },
    { title: 'Grocery List Integration', availability: 'Pro+' },
    { title: 'Regional Festival Menus', availability: 'All' },
  ];

  const handleSubscribe = (planId) => {
    if (planId === 'free') {
      toast.success("You're already on the Free plan!");
      return;
    }
    toast.success(`Redirecting to checkout for ${planId} plan...`);
    setTimeout(() => {
      toast.error('Payment integration coming soon!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900 pb-20">
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl mb-6 shadow">
          <span className="font-semibold text-orange-600 dark:text-orange-400">Premium Experience</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          Elevate Your <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Desi Kitchen</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Unlock powerful tools to make your Indian cooking journey more enjoyable and efficient.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-1.5 shadow-inner flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              SAVE 33%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 shadow-xl ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white ring-4 ring-orange-300 dark:ring-orange-700 scale-105'
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 text-xs font-bold px-5 py-1.5 rounded-2xl shadow">
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.highlighted ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-10">
                <span className="text-5xl font-extrabold">
                  {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className={`${plan.highlighted ? 'text-orange-100' : 'text-gray-500'} text-lg`}>
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-4 rounded-2xl font-semibold mb-10 transition-all ${
                  plan.highlighted
                    ? 'bg-white text-orange-600 hover:bg-orange-50'
                    : 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:brightness-110'
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-orange-200' : 'text-green-500'}`} />
                    <span className="text-[15px] leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.notIncluded?.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Not Included</p>
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 items-start opacity-60 text-sm">
                      <span className="text-red-400 mt-1">✕</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 mt-28">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Have questions? We've got answers.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {faq.q}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Coming Soon
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          We're working hard to bring more exciting features to your kitchen.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingFeatures.map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition">
              <SparklesIcon className="w-8 h-8 text-orange-500 mb-4" />
              <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.availability}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}