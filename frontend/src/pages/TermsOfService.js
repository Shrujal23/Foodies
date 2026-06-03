import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>

          <div className="space-y-8 text-gray-600 dark:text-gray-400">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Foodies, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">2. User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. 
                Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3. Content Ownership</h2>
              <p>
                Users retain all ownership rights to the recipes and images they upload. By uploading content, 
                you grant Foodies a non-exclusive license to display, modify, and distribute your content on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">4. Community Guidelines</h2>
              <p className="mb-3">When interacting with the community, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Post abusive, harassing, or discriminatory comments or reviews.</li>
                <li>Upload inappropriate or copyright-infringing images.</li>
                <li>Spam the platform with fake ratings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">5. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Your continued use of the platform 
                after such modifications constitutes your acknowledgment and agreement to the modified terms.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            Last updated: May 2026. If you have any questions, please <Link to="/contact" className="text-orange-600 hover:underline">contact us</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
