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
    <div className="max-w-6xl mx-auto px-6 py-12 text-gray-900 dark:text-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-gray-500 mt-2">Edit your account information and update your profile photo.</p>
      </div>

      <ProfileHeader user={user} avatarPreview={formValues.avatar_url} />

      <div className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Account details</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Username</label>
              <input
                name="username"
                value={formValues.username}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Display name</label>
              <input
                name="display_name"
                value={formValues.display_name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Profile photo</label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-600 dark:text-gray-300"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload a new profile image or leave blank to keep your current avatar.
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Quick actions</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="font-medium text-gray-900 dark:text-gray-100">Change password</p>
              <p className="mt-1">Update your password from your account settings.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="font-medium text-gray-900 dark:text-gray-100">Manage recipes</p>
              <p className="mt-1">View your recipes from the dashboard.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="font-medium text-gray-900 dark:text-gray-100">Collections</p>
              <p className="mt-1">Visit your saved collections for quick access.</p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
