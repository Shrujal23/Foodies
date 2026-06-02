import { useEffect, useRef, useState } from 'react';

/**
 * AnimatedStatCard - Professional stat card with animated number counter
 * Perfect for showcasing metrics, achievements, or key statistics
 * 
 * Features:
 * - Animated number counter (0 to target)
 * - Intersection Observer for visibility-triggered animation
 * - Icon support
 * - Color variations
 * - Dark mode support
 * - Responsive design
 * - Customizable duration & easing
 * - Prefix/suffix support (%, $, etc.)
 * 
 * @param {string|number} value - Final value to count to
 * @param {string} label - Stat label
 * @param {string} icon - Icon emoji or SVG
 * @param {string} color - Color variant: 'orange', 'pink', 'emerald', 'blue'
 * @param {number} duration - Animation duration in ms (default: 2000)
 * @param {string} prefix - Text before number ($, €, etc.)
 * @param {string} suffix - Text after number (%, K, etc.)
 * @param {string} trend - Optional trend: 'up', 'down', or null
 * @param {string} trendValue - Trend percentage or amount
 * @param {string} className - Additional CSS classes
 */

// Color configurations moved outside component to prevent recreation on every render
const COLOR_STYLES = {
  orange: {
    bg: 'from-orange-500 to-orange-600',
    light: 'from-orange-100 to-orange-50',
    darkLight: 'dark:from-orange-900/40 dark:to-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    accent: 'rgb(249, 115, 22)', // orange-500
    glow: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
  },
  pink: {
    bg: 'from-pink-500 to-pink-600',
    light: 'from-pink-100 to-pink-50',
    darkLight: 'dark:from-pink-900/40 dark:to-pink-900/20',
    text: 'text-pink-600 dark:text-pink-400',
    badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    accent: 'rgb(236, 72, 153)', // pink-500
    glow: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
  },
  emerald: {
    bg: 'from-emerald-500 to-emerald-600',
    light: 'from-emerald-100 to-emerald-50',
    darkLight: 'dark:from-emerald-900/40 dark:to-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    accent: 'rgb(16, 185, 129)', // emerald-500
    glow: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  blue: {
    bg: 'from-blue-500 to-blue-600',
    light: 'from-blue-100 to-blue-50',
    darkLight: 'dark:from-blue-900/40 dark:to-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    accent: 'rgb(59, 130, 246)', // blue-500
    glow: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  }
};

export default function AnimatedStatCard({
  value = 0,
  label = 'Stat',
  icon = null,
  color = 'orange',
  duration = 2000,
  prefix = '',
  suffix = '',
  trend = null,
  trendValue = '',
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const styles = COLOR_STYLES[color] || COLOR_STYLES.orange;

  // Safely parse the target value in case a string (like "2,500") is passed
  const parsedValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  const targetValue = isNaN(parsedValue) ? 0 : parsedValue;

  // Intersection Observer for triggering animation
  useEffect(() => {
    const currentRef = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          setIsVisible(true);
          hasAnimatedRef.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Number counter animation using RAF (for smooth animation)
  useEffect(() => {
    if (!isVisible) return;

    let animationId;
    let startTime;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (ease-out cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOutCubic * targetValue);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, targetValue, duration]);

  const trendColor = trend === 'up' 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : trend === 'down' 
    ? 'text-red-600 dark:text-red-400' 
    : '';

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${className}`}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.light} ${styles.darkLight}`} />

      {/* Animated Background Decoration */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      {/* Content */}
      <div className="relative p-8 lg:p-10">
        <div className="flex items-start justify-between">
          {/* Left side - Content */}
          <div className="flex-1">
            {/* Icon */}
            {icon && (
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
            )}

            {/* Label */}
            <p className={`text-sm lg:text-base font-semibold uppercase tracking-wider ${styles.text} mb-3 opacity-80`}>
              {label}
            </p>

            {/* Main Value */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
                {prefix}
                <span className="tabular-nums">{displayValue.toLocaleString()}</span>
                {suffix}
              </span>

              {/* Trend Badge */}
              {trend && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm ${styles.badge}`}>
                  <span>
                    {trend === 'up' ? '📈' : '📉'}
                  </span>
                  <span className={trendColor}>
                    {trendValue}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Icon Circle */}
          <div className={`hidden sm:flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${styles.bg} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ml-4 flex-shrink-0`}>
            <span className="text-3xl filter drop-shadow-lg">
              {icon ? (
                <span className="opacity-50">{icon}</span>
              ) : (
                <span>📊</span>
              )}
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gradient-to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          style={{
        backgroundImage: `linear-gradient(to right, transparent, ${styles.accent}, transparent)`
          }}
        />
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-300"
      style={{
        background: styles.glow
        }}
      />
    </div>
  );
}

/**
 * Usage Examples:
 * 
 * // Basic stat
 * <AnimatedStatCard
 *   value={2500}
 *   label="Recipes Shared"
 *   icon="🍳"
 * />
 * 
 * // With prefix/suffix
 * <AnimatedStatCard
 *   value={150}
 *   label="Total Revenue"
 *   prefix="$"
 *   icon="💰"
 *   color="emerald"
 * />
 * 
 * // With trend
 * <AnimatedStatCard
 *   value={85}
 *   label="Satisfaction Rate"
 *   suffix="%"
 *   trend="up"
 *   trendValue="+12%"
 *   icon="😊"
 *   color="blue"
 * />
 * 
 * // Grid of stats
 * <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 *   <AnimatedStatCard value={1200} label="Users" icon="👥" />
 *   <AnimatedStatCard value={5400} label="Recipes" icon="🍳" color="pink" />
 *   <AnimatedStatCard value={42000} label="Downloads" icon="⬇️" color="emerald" />
 *   <AnimatedStatCard value={98} label="Rating" suffix="%" icon="⭐" color="blue" />
 * </div>
 */
