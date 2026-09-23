import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#fffaf7] px-4 py-8 dark:bg-gray-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs />

        <article className="mt-8 overflow-hidden border border-[#eadbd1] bg-white dark:border-gray-800 dark:bg-gray-900">
          <header className="border-b border-[#eadbd1] px-6 py-10 dark:border-gray-800 sm:px-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">The ground rules</p>
            <h1 className="text-4xl font-bold leading-tight text-[#35221a] dark:text-white sm:text-5xl">Terms of Service</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#7f665a] dark:text-gray-400">
              Foodies works best when people share generously, give credit, and treat one another well. These are the simple rules for using the service.
            </p>
            <p className="mt-6 text-sm text-[#8f7568] dark:text-gray-500">Last updated: September 2026</p>
          </header>

          <div className="grid gap-10 px-6 py-10 sm:px-12 lg:grid-cols-[180px_1fr]">
            <nav aria-label="Terms of service sections" className="self-start lg:sticky lg:top-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8f7568] dark:text-gray-500">On this page</p>
              <div className="space-y-2 text-sm">
                <a href="#agreement" className="block text-orange-700 hover:underline dark:text-orange-300">Using Foodies</a>
                <a href="#accounts" className="block text-orange-700 hover:underline dark:text-orange-300">Your account</a>
                <a href="#content" className="block text-orange-700 hover:underline dark:text-orange-300">Your content</a>
                <a href="#community" className="block text-orange-700 hover:underline dark:text-orange-300">Community rules</a>
                <a href="#changes" className="block text-orange-700 hover:underline dark:text-orange-300">Changes</a>
              </div>
            </nav>

            <div className="space-y-10 text-base leading-7 text-[#6f5b51] dark:text-gray-400">
            <section id="agreement">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">1. Using Foodies</h2>
              <p>
                By accessing or using Foodies, you agree to these terms. If you do not agree with them, please do not use the service. You must be old enough to enter into a binding agreement where you live, or use Foodies with the involvement of a parent or guardian.
              </p>
            </section>

            <section id="accounts">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">2. Your account</h2>
              <p>
                Please give us accurate, current information when you create an account and keep your password private. You are responsible for activity that happens through your account. Tell us promptly if you believe someone else has accessed it.
              </p>
            </section>

            <section id="content">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">3. Your recipes and content</h2>
              <p>
                You keep ownership of the recipes, photos, reviews, and other content you upload. By sharing content on Foodies, you give us a non-exclusive, worldwide, royalty-free license to host, display, resize, format, and distribute it as needed to operate and promote the service. Only share content you created or have permission to use, and remove it when you no longer want it available where our tools allow.
              </p>
            </section>

            <section id="community">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">4. Community rules</h2>
              <p className="mb-3">When using Foodies, please do not:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Post abusive, harassing, or discriminatory comments or reviews.</li>
                <li>Upload inappropriate, misleading, or copyright-infringing content.</li>
                <li>Spam the platform, manipulate ratings, or impersonate another person.</li>
                <li>Use Foodies to break the law, harm others, or interfere with the service.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">5. Recipes are not professional advice</h2>
              <p>
                Recipes and suggestions on Foodies are provided for general information. Use your judgment about allergies, dietary needs, ingredients, equipment, cooking temperatures, and food safety. Foodies is not a substitute for medical, nutritional, or professional advice.
              </p>
            </section>

            <section id="changes">
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">6. Changes and account access</h2>
              <p>
                We may improve, change, suspend, or discontinue parts of Foodies. We may also restrict or end access when an account seriously or repeatedly breaks these terms, creates risk for others, or requires action for legal or security reasons. We will update this page when the terms change and will use reasonable notice for significant changes.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-[#35221a] dark:text-white">7. Questions</h2>
              <p>
                If something here is unclear, ask us before using the service. We would rather explain a rule than have it come as a surprise.
              </p>
            </section>
            </div>
          </div>

          <div className="border-t border-[#eadbd1] px-6 py-6 text-sm text-[#8f7568] dark:border-gray-800 dark:text-gray-400 sm:px-12">
            Have a question about these terms? <Link to="/contact" className="font-semibold text-orange-700 hover:underline dark:text-orange-300">Contact the Foodies team</Link>.
          </div>
        </article>
      </div>
    </div>
  );
}
