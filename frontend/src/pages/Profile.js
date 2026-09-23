import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/dashboard/ProfileHeader';
import { updateProfile } from '../services/authService';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, loading } = useAuth();
  const [formValues, setFormValues] = useState({
    username: user?.username || '',
    display_name: user?.display_name || '',
    email: user?.email || '',
    avatar_url: user?.avatar_url || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormValues({
        username: user.username || '',
        display_name: user.display_name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormValues((prev) => ({ ...prev, avatar_url: previewUrl }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedUser = await updateProfile({
        username: formValues.username,
        display_name: formValues.display_name,
        email: formValues.email,
        avatar_url: formValues.avatar_url,
        avatarFile
      });

      if (updatedUser) {
        toast.success('Profile saved successfully');
      } else {
        toast.error('Profile save failed');
      }
    } catch (error) {
      toast.error(error.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
      <div className="mb-8 border-b border-[#eadbd1] pb-8 dark:border-gray-800">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">Your corner of Foodies</p>
        <h1 className="text-4xl font-bold tracking-tight text-[#35221a] dark:text-white sm:text-5xl">Make it yours.</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-[#7f665a] dark:text-gray-400">
          Keep your details current so your recipes, reviews, and conversations feel like they belong to you.
        </p>
      </div>

      <ProfileHeader user={user} avatarPreview={formValues.avatar_url} />

      <div className="grid gap-8 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="border border-[#eadbd1] bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <div className="mb-7 border-b border-[#eadbd1] pb-5 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-[#35221a] dark:text-white">Your details</h2>
            <p className="mt-2 text-sm text-[#8f7568] dark:text-gray-500">These are the details other cooks may see when you share something.</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5d463b] dark:text-gray-200">Username</label>
              <input
                name="username"
                value={formValues.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#ddc9bc] bg-[#fffaf7] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5d463b] dark:text-gray-200">Display name</label>
              <input
                name="display_name"
                value={formValues.display_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#ddc9bc] bg-[#fffaf7] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5d463b] dark:text-gray-200">Email</label>
              <input
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#ddc9bc] bg-[#fffaf7] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5d463b] dark:text-gray-200">Profile photo</label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-600 dark:text-gray-300"
                />
                <p className="text-xs leading-relaxed text-[#8f7568] dark:text-gray-400">
                  Choose a photo that feels like you. Leave this blank to keep your current picture.
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </div>

        <div className="border border-[#eadbd1] bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <h2 className="text-2xl font-semibold text-[#35221a] dark:text-white">Keep cooking</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8f7568] dark:text-gray-500">A few useful places to go from here.</p>
          <div className="mt-6 divide-y divide-[#eadbd1] border-y border-[#eadbd1] dark:divide-gray-800 dark:border-gray-800">
            <Link to="/forgot-password" className="block py-4 transition hover:text-orange-700 dark:hover:text-orange-300">
              <p className="font-semibold text-[#35221a] dark:text-gray-100">Change password</p>
              <p className="mt-1 text-sm text-[#8f7568] dark:text-gray-400">Keep your account secure.</p>
            </Link>
            <Link to="/recipes" className="block py-4 transition hover:text-orange-700 dark:hover:text-orange-300">
              <p className="font-semibold text-[#35221a] dark:text-gray-100">Manage recipes</p>
              <p className="mt-1 text-sm text-[#8f7568] dark:text-gray-400">See what the community is cooking.</p>
            </Link>
            <Link to="/collections" className="block py-4 transition hover:text-orange-700 dark:hover:text-orange-300">
              <p className="font-semibold text-[#35221a] dark:text-gray-100">Your collections</p>
              <p className="mt-1 text-sm text-[#8f7568] dark:text-gray-400">Return to the recipes you saved.</p>
            </Link>
          </div>

          <div className="mt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              Back to your kitchen
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
