import React from 'react';

const Footer = () => {
  return (
    <footer className=" bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Foodies</h3>
            <p className="text-gray-300 text-sm">
              Discover and share amazing recipes from around the world. Join our community
              of food lovers and cooking enthusiasts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2"> 
              <li>
                <a href="/" className="text-gray-300 hover:text-white text-sm transition duration-150 ease-in-out">
                  Home
                </a>
              </li>
              <li>
                <a href="/recipes" className="text-gray-300 hover:text-white text-sm transition duration-150 ease-in-out">
                  Recipes
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white text-sm transition duration-150 ease-in-out">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white text-sm transition duration-150 ease-in-out">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.44,4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96,1.32-2.02-.88.52-1.86.9-2.9,1.1-.82-.88-2-1.43-3.3-1.43-2.5,0-4.55,2.04-4.55,4.54,0,.36.03.7.1,1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6,1.45-.6,2.3,0,1.56.8,2.95,2,3.77-.74-.03-1.44-.23-2.05-.58v.06c0,2.2,1.56,4.03,3.64,4.44-.67.2-1.37.2-2.06.08.58,1.8,2.26,3.12,4.25,3.16C5.78,18.1,3.37,18.74,1,18.46c2,1.3,4.4,2.04,6.97,2.04,8.35,0,12.92-6.92,12.92-12.93,0-.2,0-.4-.02-.6.9-.63,1.96-1.22,2.56-2.14Z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2.16c3.2,0,3.58.01,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85,0,3.2-.01,3.58-.07,4.85-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07-3.2,0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85,0-3.2.01-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.17,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33.01,7.05.07c-4.41.2-6.78,2.57-7,7C0,8.33,0,8.74,0,12s.01,3.67.07,4.95c.2,4.41,2.57,6.78,7,7C8.33,24,8.74,24,12,24s3.67-.01,4.95-.07c4.41-.2,6.78-2.57,7-7C24,15.67,24,15.26,24,12s-.01-3.67-.07-4.95c-.2-4.41-2.57-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Foodies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;