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
      a: "Masala AI uses the Groq API to help turn the ingredients, flavours, and time you have into practical cooking ideas."
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
    toast('Payments are not connected yet. Your plan choice has been noted.', {
      icon: '📝',
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] pb-20 dark:bg-gray-950">
      
      {/* Hero Section */}
      <div className="mx-auto max-w-4xl border-b border-[#eadbd1] px-6 pb-12 pt-14 text-center dark:border-gray-800 sm:pt-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">
          Make more of the meals you love
        </p>
        <h1 className="text-4xl font-bold leading-tight text-[#35221a] dark:text-white lg:text-5xl">
          A little more help in the kitchen.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#7f665a] dark:text-gray-400">
          Keep your favourite recipes close, plan meals with less guesswork, and get back to cooking the way you like it.
        </p>
        <p className="mt-5 text-sm text-[#8f7568] dark:text-gray-500">Cancel anytime · Prices shown in Indian rupees · No surprise fees</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center px-6 py-8 sm:py-10">
        <div className="flex rounded-xl border border-[#ddc9bc] bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <button
            onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
              className={`relative rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly
            {billingCycle === 'yearly' && (
              <span className="ml-2 text-xs font-semibold text-orange-600">Save 33%</span>
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center text-sm text-[#8f7568] dark:text-gray-500">Choose the kind of help you want at home.</p>
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
                plan.highlighted
                  ? 'border-orange-600 bg-[#fff3e8] shadow-[0_16px_40px_rgba(194,91,37,0.12)] dark:bg-orange-950/30'
                  : 'border-[#eadbd1] bg-white dark:border-gray-700 dark:bg-gray-900 hover:border-[#cdb2a3] hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">
                  {plan.badge}
                </div>
              )}

              <h3 className="mb-2 text-2xl font-bold text-[#35221a] dark:text-white">{plan.name}</h3>
              <p className="mb-6 text-sm leading-relaxed text-[#7f665a] dark:text-gray-400">
                {plan.description}
              </p>

              <div className="mb-8">
                <span className="text-4xl font-bold text-[#35221a] dark:text-white">
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
                className={`mb-8 w-full rounded-lg py-3 font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30'
                    : 'border border-[#ddc9bc] text-[#35221a] hover:border-orange-400 hover:bg-orange-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3 items-start text-sm">
                    <span className="mt-0.5 font-bold text-orange-600">✓</span>
                    <span className="text-sm text-[#5d463b] dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.notIncluded?.length > 0 && (
                <div className="border-t border-[#eadbd1] pt-6 dark:border-gray-700">
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
      <div className="mx-auto mt-24 max-w-3xl px-6">
        <h2 className="mb-3 text-center text-3xl font-bold text-[#35221a] dark:text-white">
          Before you decide
        </h2>
        <p className="mb-10 text-center text-[#7f665a] dark:text-gray-400">
          A few practical answers, without the fine-print feeling.
        </p>

        <div className="divide-y divide-[#eadbd1] border-y border-[#eadbd1] dark:divide-gray-800 dark:border-gray-800">
          {faqs.map((faq, idx) => (
            <details
              key={idx} 
              className="group py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#35221a] marker:hidden dark:text-white">
                {faq.q}
                <span className="text-xl font-normal text-orange-600 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 max-w-2xl pr-8 text-sm leading-relaxed text-[#7f665a] dark:text-gray-400">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="mx-auto mt-24 max-w-6xl px-6">
        <h2 className="mb-3 text-center text-3xl font-bold text-[#35221a] dark:text-white">
          What we&apos;re cooking next
        </h2>
        <p className="mb-12 text-center text-[#7f665a] dark:text-gray-400">
          New tools will arrive as they become genuinely useful, not just because they sound impressive.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingFeatures.map((feature, idx) => (
            <div key={idx} className="border border-[#eadbd1] bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h4 className="mb-2 font-semibold text-[#35221a] dark:text-white">{feature.title}</h4>
              <p className="text-sm text-[#8f7568] dark:text-gray-500">Planned for {feature.availability}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}