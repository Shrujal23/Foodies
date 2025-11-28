export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition duration-300 ease-in-out">
      <div className="flex items-center">
        {Icon && (
          <div className="flex-shrink-0 p-3.5 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl">
            <Icon className="h-6 w-6 text-accent-600" aria-hidden="true" />
          </div>
        )}
        <div className="ml-5">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="mt-1.5 text-2xl font-display font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}