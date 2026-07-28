export default function ProfileHeader({ user, avatarPreview }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={avatarPreview || user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.display_name || user?.username || 'User')}&size=200`}
            alt={user?.display_name || user?.username || 'User avatar'}
            className="w-32 h-32 rounded-full object-cover shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.display_name || user?.username}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Member since {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-orange-50 dark:bg-orange-950/20 p-5 text-sm text-orange-700 dark:text-orange-200">
          <p className="font-semibold">Tip</p>
          <p className="mt-2 leading-relaxed">Updating your profile here refreshes your session and immediately applies your new display name and avatar across the app.</p>
        </div>
      </div>
    </div>
  );
}
