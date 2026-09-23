export default function ProfileHeader({ user, avatarPreview }) {
  return (
    <div className="mb-8 border border-[#eadbd1] bg-[#fff4e9] p-6 dark:border-gray-800 dark:bg-orange-950/20 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <img
            src={avatarPreview || user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.display_name || user?.username || 'User')}&size=200`}
            alt={user?.display_name || user?.username || 'User avatar'}
            className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm dark:border-gray-800 sm:h-28 sm:w-28"
          />
          <div>
            <h2 className="text-2xl font-bold text-[#35221a] dark:text-white">{user?.display_name || user?.username}</h2>
            <p className="mt-1 text-sm text-[#7f665a] dark:text-gray-300">{user?.email}</p>
            <p className="mt-3 text-sm text-[#8f7568] dark:text-gray-400">This is how your profile appears around Foodies.</p>
          </div>
        </div>

        <div className="border-l-2 border-orange-300 pl-5 text-sm text-[#765648] dark:border-orange-800 dark:text-orange-200 sm:ml-auto sm:max-w-xs">
          <p className="font-semibold">A small note</p>
          <p className="mt-2 leading-relaxed">Your display name and profile photo update across the app as soon as you save.</p>
        </div>
      </div>
    </div>
  );
}
