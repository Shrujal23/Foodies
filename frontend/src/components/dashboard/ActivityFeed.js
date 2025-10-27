export default function ActivityFeed({ activities }) {
  const getActivityText = (activity) => {
    switch (activity.activity_type) {
      case 'search':
        return `Searched for "${activity.details.query}"`;
      case 'favorite':
        return `Favorited recipe "${activity.details.recipeName}"`;
      case 'unfavorite':
        return `Removed "${activity.details.recipeName}" from favorites`;
      case 'view':
        return `Viewed recipe "${activity.details.recipeName}"`;
      default:
        return 'Performed an action';
    }
  };

  return (
    <div className="flow-root px-2">
      <ul role="list" className="-mb-8">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex gap-x-4">
                <div>
                  <span className={`
                    h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white shadow-sm
                    ${activity.activity_type === 'search' ? 'bg-sky-50 text-sky-600' : ''}
                    ${activity.activity_type === 'favorite' ? 'bg-rose-50 text-rose-600' : ''}
                    ${activity.activity_type === 'unfavorite' ? 'bg-gray-50 text-gray-600' : ''}
                    ${activity.activity_type === 'view' ? 'bg-emerald-50 text-emerald-600' : ''}
                  `}>
                    <span className="text-sm font-semibold">
                      {activity.activity_type.charAt(0).toUpperCase()}
                    </span>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between gap-x-4 py-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{getActivityText(activity)}</p>
                  </div>
                  <div className="whitespace-nowrap text-right">
                    <time 
                      dateTime={activity.created_at} 
                      className="text-sm text-gray-500 tabular-nums"
                    >
                      {new Date(activity.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}