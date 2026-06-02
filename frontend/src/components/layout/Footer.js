import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Recipes', href: '/search' },
    { name: 'Add Recipe', href: '/recipes/add' },
    { name: 'My Cookbook', href: '/dashboard' },
    { name: 'Community', href: '/my-recipes' },
    { name: 'About Us', href: '/about' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-orange-600 mb-3">Foodies</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Discover and share incredible recipes with a community of food lovers.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
            
            {/* Social Icons */}
            <div className="flex space-x-3 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.58v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16-2.07 1.62-4.68 2.58-7.52 2.58-1.2 0-2.38-.07-3.54-.21 2.4 1.54 5.24 2.38 8.27 2.38 9.93 0 15.36-8.23 15.36-15.36 0-.23-.01-.47-.03-.7.9-.63 1.96-1.22 2.56-2.14Z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07c-4.41.2-6.78 2.57-7 7C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.41 2.57 6.78 7 7C8.33 24 8.74 24 12 24s3.67-.01 4.95-.07c4.41-.2 6.78-2.57 7-7C24 15.67 24 15.26 24 12s-.01-3.67-.07-4.95c-.2-4.41-2.57-6.78-7-7C15.67 0 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4ZM18.41 4.15a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z"/>
                </svg>
              </a>
            </div>

            {/* Newsletter */}
            <p className="text-xs text-gray-500 mb-3">Get recipe updates</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded focus:outline-none focus:border-orange-500"
              />
              <button type="submit" className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors whitespace-nowrap">
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
          <p>© {currentYear} Foodies. Made with ❤️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;