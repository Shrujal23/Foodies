import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * RecommendationCarousel - Professional carousel component
 * Perfect for showcasing recipes, recommendations, or featured content
 * 
 * Features:
 * - Smooth scroll with touch support
 * - Previous/Next navigation buttons
 * - Responsive grid layout
 * - Fade-in animations
 * - Auto-scroll option (optional)
 * - Dark mode support
 * - Accessibility features (keyboard navigation)
 * 
 * @param {array} items - Array of items to display
 * @param {function} renderItem - Render function for each item: (item, index) => JSX
 * @param {number} itemsPerView - How many items to show (default: 4)
 * @param {boolean} autoScroll - Enable auto-scroll (default: false)
 * @param {number} scrollInterval - Auto-scroll interval in ms (default: 5000)
 * @param {string} title - Carousel title
 * @param {string} subtitle - Optional subtitle
 */
export default function RecommendationCarousel({
  items = [],
  renderItem,
  itemsPerView = 4,
  autoScroll = false,
  scrollInterval = 5000,
  title = 'Recommendations',
  subtitle = '',
  className = ''
}) {
  const [scrollPos, setScrollPos] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(autoScroll);
  const containerRef = useRef(null);
  const autoScrollTimerRef = useRef(null);

  // Calculate scroll amount
  const getScrollAmount = () => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    return containerWidth * 0.8; // Scroll 80% of container width
  };

  // Check scroll positions
  const updateScrollButtons = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll functionality
  const scroll = useCallback((direction) => {
    if (!containerRef.current) return;

    const scrollAmount = getScrollAmount();
    const newPosition = direction === 'left' 
      ? scrollPos - scrollAmount 
      : scrollPos + scrollAmount;

    containerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });

    setScrollPos(newPosition);
    setTimeout(updateScrollButtons, 300);
  }, [scrollPos]);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScrollEnabled || !items.length) return;

    autoScrollTimerRef.current = setInterval(() => {
      if (!containerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      
      // If at end, reset to beginning
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        setScrollPos(0);
      } else {
        scroll('right');
      }
    }, scrollInterval);

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [autoScrollEnabled, scrollInterval, items.length, scroll]);

  // Update buttons on mount and resize
  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scroll('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scroll('right');
    }
  };

  // Early return after all hooks
  if (!items.length) {
    return null;
  }

  return (
    <section className={`py-12 ${className}`}>
      {/* Header */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
              {subtitle}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6 sm:mt-0">
          {/* Auto-scroll toggle */}
          {autoScroll && (
            <button
              onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                autoScrollEnabled
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={autoScrollEnabled ? 'Stop auto-scroll' : 'Start auto-scroll'}
            >
              {autoScrollEnabled ? '⏸️ Pause' : '▶️ Play'}
            </button>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3 rounded-xl transition-all duration-300 ${
                canScrollLeft
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-110'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3 rounded-xl transition-all duration-300 ${
                canScrollRight
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-110'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        onScroll={updateScrollButtons}
        onKeyDown={handleKeyDown}
        className="flex overflow-x-auto gap-6 pb-4 scroll-smooth"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="flex-shrink-0 animate-fadeIn"
            style={{
              width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`,
              minWidth: 0,
              animation: `fadeIn 0.5s ease-out ${index * 50}ms both`
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      {canScrollRight && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          ← Swipe or use arrows to explore →
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Hide scrollbar but keep functionality */
        div::-webkit-scrollbar {
          height: 6px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .dark div::-webkit-scrollbar-thumb {
          background: #475569;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </section>
  );
}
