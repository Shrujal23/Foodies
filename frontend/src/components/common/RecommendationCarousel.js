import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);
  const autoScrollTimerRef = useRef(null);

  const isSingleView = itemsPerView === 1;

  // Check scroll positions
  const updateScrollButtons = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll functionality
  const scroll = useCallback((direction) => {
    if (!containerRef.current) return;

    // Calculate scroll amount inside callback
    const containerWidth = containerRef.current.offsetWidth;
    const scrollAmount = isSingleView ? containerWidth * 0.95 : containerWidth * 0.85;
    
    const currentScroll = containerRef.current.scrollLeft;
    const newPosition = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    containerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });

    setTimeout(updateScrollButtons, 350);
  }, [isSingleView]);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || !items.length) return;

    autoScrollTimerRef.current = setInterval(() => {
      if (!containerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scroll('right');
      }
    }, scrollInterval);

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [autoScroll, scrollInterval, items.length, scroll]);

  // Update buttons on mount and resize
  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scroll('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scroll('right');
    }
  };

  if (!items.length) return null;

  return (
    <section className={`py-12 ${className}`}>
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3.5 rounded-2xl transition-all duration-300 ${
                canScrollLeft
                  ? 'bg-orange-600 text-white shadow-lg hover:bg-orange-700 active:scale-95'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Previous"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3.5 rounded-2xl transition-all duration-300 ${
                canScrollRight
                  ? 'bg-orange-600 text-white shadow-lg hover:bg-orange-700 active:scale-95'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Next"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container - Properly Constrained */}
      <div className="w-full overflow-hidden">
        <div
          ref={containerRef}
          onScroll={updateScrollButtons}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={`flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory outline-none ${
            isSingleView ? 'justify-start' : ''
          }`}
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id || item._id || index}
              className="flex-shrink-0 snap-start"
              style={{
                width: isSingleView 
                  ? '100%'
                  : `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`,
                minWidth: isSingleView 
                  ? '100%' 
                  : `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`,
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Hint */}
      {!isSingleView && canScrollRight && (
        <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
          Swipe or use arrows to explore →
        </div>
      )}
    </section>
  );
}