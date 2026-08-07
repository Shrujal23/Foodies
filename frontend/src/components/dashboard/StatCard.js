export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-[#fffdfb]/95 dark:bg-gray-800/90 rounded-2xl shadow-[0_12px_30px_rgba(53,34,26,0.08)] p-6 border border-[#f4ddce] dark:border-gray-700 hover:shadow-[0_16px_40px_rgba(53,34,26,0.12)] transition duration-300 ease-in-out">
      <div className="flex items-center">
        {Icon && (
          <div className="flex-shrink-0 p-3.5 bg-gradient-to-br from-[#fff0e8] to-[#ffe8ee] dark:from-orange-900/40 dark:to-pink-900/40 rounded-xl">
            <Icon className="h-6 w-6 text-[#c85b2d] dark:text-orange-300" aria-hidden="true" />
          </div>
        )}
        <div className="ml-5">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
          <p className="mt-1.5 text-2xl font-display font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}