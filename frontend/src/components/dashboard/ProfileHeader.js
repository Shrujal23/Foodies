import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProfileHeader({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.avatar_url);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll just create a local URL for the image
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      toast.success('Profile picture updated!');
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center space-x-8">
        <div className="relative">
          <img
            src={imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=200`}
            alt={user?.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <button
            onClick={() => setIsEditing(true)}
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-150"
          >
            <PencilIcon className="w-5 h-5 text-gray-600" />
          </button>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image"
            />
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
          <p className="text-gray-500 mt-1">Member since {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}