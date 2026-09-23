import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#fffaf7] px-4 py-8 dark:bg-gray-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs />

        <article className="mt-8 overflow-hidden border border-[#eadbd1] bg-white dark:border-gray-800 dark:bg-gray-900">
          <header className="border-b border-[#eadbd1] px-6 py-10 dark:border-gray-800 sm:px-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">Your information, explained</p>
            <h1 className="text-4xl font-bold leading-tight text-[#35221a] dark:text-white sm:text-5xl">Privacy Policy</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#7f665a] dark:text-gray-400">
              We want Foodies to feel personal without making your information feel exposed. This page explains what we collect, why we need it, and the choices you have.
            </p>
            <p className="mt-6 text-sm text-[#8f7568] dark:text-gray-500">Last updated: September 2026</p>
          </header>

          <div className="grid gap-10 px-6 py-10 sm:px-12 lg:grid-cols-[180px_1fr]">
            <nav aria-label="Privacy policy sections" className="self-start lg:sticky lg:top-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8f7568] dark:text-gray-500">On this page</p>
              <div className="space-y-2 text-sm">
                <a href="#collect" className="block text-orange-700 hover:underline dark:text-orange-300">What we collect</a>
                <a href="#use" className="block text-orange-700 hover:underline dark:text-orange-300">How we use it</a>
                <a href="#sharing" className="block text-orange-700 hover:underline dark:text-orange-300">When we share</a>
                <a href="#choices" className="block text-orange-700 hover:underline dark:text-orange-300">Your choices</a>
                <a href="#security" className="block text-orange-700 hover:underline dark:text-orange-300">Security</a>
              </div>
            </nav>

            <div className="space-y-10 text-base leading-7 text-[#6f5b51] dark:text-gray-400">
            <section id="collect">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">1. What we collect</h2>
              <p>
                We collect information you choose to give us when you create an account, update your profile, publish a recipe, save a dish, leave a review, or contact us. This can include your name, email address, profile details, recipes, images, ratings, and comments.
              </p>
            </section>

            <section id="use">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">2. How we use it</h2>
              <p>
                We use this information to run Foodies, keep your account secure, show your public recipes to the community, personalize your experience, respond to support requests, and understand what needs improving. If you use an optional AI or external recipe feature, the information needed for that feature may be processed by the relevant service provider.
              </p>
            </section>

            <section id="sharing">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">3. When we share information</h2>
              <p>
                We do not sell your personal information. Your public profile, public recipes, reviews, and other content you choose to publish can be seen by other Foodies users. We may also use trusted providers for hosting, authentication, storage, analytics, payments, or optional recipe and AI features. We may disclose information when required to comply with law or protect Foodies, our users, or the public.
              </p>
            </section>

            <section id="choices">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">4. Your choices</h2>
              <p>
                You can review and update much of your account information from your profile. You can choose what recipes and comments to publish, and you can contact us to ask about accessing, correcting, or deleting personal information associated with your account. Some records may need to be kept for security, legal, or operational reasons.
              </p>
            </section>

            <section id="security">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">5. Security</h2>
              <p>
                We take reasonable measures to protect information from loss, misuse, unauthorized access, disclosure, alteration, and destruction. No online service can promise perfect security, so please use a strong, unique password and let us know if you think your account has been compromised.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">6. Changes to this policy</h2>
              <p>
                We may update this policy as Foodies grows or the way we handle information changes. We will update the date at the top of this page and provide a more noticeable notice when a change is significant.
              </p>
            </section>
            </div>
          </div>

          <div className="border-t border-[#eadbd1] px-6 py-6 text-sm text-[#8f7568] dark:border-gray-800 dark:text-gray-400 sm:px-12">
            Questions about your information? <Link to="/contact" className="font-semibold text-orange-700 hover:underline dark:text-orange-300">Contact the Foodies team</Link>.
          </div>
        </article>
      </div>
    </div>
  );
}