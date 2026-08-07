import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse recipes', href: '/search' },
    { name: 'Community', href: '/recipes' },
    { name: 'Add recipe', href: '/recipes/add' },
    { name: 'Collections', href: '/collections' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const companyLinks = [
    { name: 'About us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy policy', href: '/privacy' },
    { name: 'Terms of service', href: '/terms' },
  ];

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="mt-20 border-t border-orange-900/30 bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500" />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block group">
              <h2 className="text-2xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                Foodies
              </h2>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
              Discover, save, and share recipes with a community of home cooks.
              Built for people who love food.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                {
                  label: 'Facebook',
                  href: 'https://facebook.com',
                  path: 'M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z',
                },
                {
                  label: 'Twitter',
                  href: 'https://twitter.com',
                  path: 'M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.58v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16-2.07 1.62-4.68 2.58-7.52 2.58-1.2 0-2.38-.07-3.54-.21 2.4 1.54 5.24 2.38 8.27 2.38 9.93 0 15.36-8.23 15.36-15.36 0-.23-.01-.47-.03-.7.9-.63 1.96-1.22 2.56-2.14Z',
                },
                {
                  label: 'Instagram',
                  href: 'https://instagram.com',
                  path: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07c-4.41.2-6.78 2.57-7 7C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.41 2.57 6.78 7 7C8.33 24 8.74 24 12 24s3.67-.01 4.95-.07c4.41-.2 6.78-2.57 7-7C24 15.67 24 15.26 24 12s-.01-3.67-.07-4.95c-.2-4.41-2.57-6.78-7-7C15.67 0 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4ZM18.41 4.15a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z',
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-gray-800/80 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/50 hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-1.5 h-px bg-orange-500 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-1.5 h-px bg-orange-500 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Recipe ideas in your inbox. No spam — just food you&apos;ll want to cook.
            </p>
            {subscribed ? (
              <p className="text-sm text-orange-400 font-medium border border-orange-500/30 bg-orange-500/10 rounded-xl px-3 py-2.5">
                Thanks — you&apos;re on the list.
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-800/90 border-2 border-gray-700 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-orange-500 hover:border-gray-600 transition"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-xl border-2 border-orange-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-xs text-gray-600 sm:flex-row">
          <p>© {currentYear} Foodies. Made for home cooks.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-orange-400 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-orange-400 transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-orange-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
