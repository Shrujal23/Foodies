import { useState } from 'react';
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
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
      
      {/* Hero Section */}
      <div className="pt-20 pb-12 px-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose the perfect plan for your cooking journey. Cancel anytime, no questions asked.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded transition-colors font-medium ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded transition-colors font-medium relative ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly
            {billingCycle === 'yearly' && (
              <span className="ml-2 text-sm text-orange-600 font-semibold">Save 33%</span>
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl p-8 border transition-all duration-300 backdrop-blur-sm ${
                plan.highlighted
                  ? 'border-orange-600 bg-orange-50/50 dark:bg-orange-900/20 hover:shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50 hover:-translate-y-1'
                  : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {plan.badge && (
                <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-4">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {plan.description}
              </p>

              <div className="mb-8">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 rounded font-medium mb-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3 items-start text-sm">
                    <span className="text-orange-600 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.notIncluded?.length > 0 && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-sm opacity-50 text-gray-600 dark:text-gray-400 mb-2">
                      <span className="mt-0.5">–</span>
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
      <div className="max-w-4xl mx-auto px-6 mt-24">
        <h2 className="text-3xl font-bold text-center mb-3 text-gray-900 dark:text-white">
          Questions?
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          We have answers.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="max-w-6xl mx-auto px-6 mt-24">
        <h2 className="text-3xl font-bold text-center mb-3 text-gray-900 dark:text-white">
          Coming Soon
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          We're building more ways to improve your cooking experience.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingFeatures.map((feature, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-500">{feature.availability}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}