import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-gray-600 dark:text-gray-400">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when you create an account, update your profile, use the interactive features of our services, or communicate with us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services. This includes personalizing your experience, matching you with relevant recipes, and securing your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3. Information Sharing</h2>
              <p>
                We do not share your personal information with third parties except as described in this privacy policy. We may share your public profile and public recipes with other users as part of the core functionality of Foodies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">4. Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.
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