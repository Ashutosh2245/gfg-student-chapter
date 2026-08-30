import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import { RoleBadge } from '../../components/common/Badge';
import { User, Camera, Linkedin, Instagram, KeyRound, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { formatAvatarUrl } from '../../utils/formatAvatar';

export const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '',
    linkedin_url: user?.linkedin_url || '',
    instagram_url: user?.instagram_url || '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchCurrentProfile = async () => {
      try {
        const res = await usersAPI.getMemberById(user.id);
        if (res.data.success) {
          const m = res.data.member;
          setProfile({
            name: m.name || '',
            bio: m.bio || '',
            avatar_url: m.avatar_url || '',
            linkedin_url: m.linkedin_url || '',
            instagram_url: m.instagram_url || '',
            newPassword: ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentProfile();
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    const formattedAvatar = formatAvatarUrl(profile.avatar_url);

    try {
      const res = await usersAPI.updateOwnProfile({
        ...profile,
        avatar_url: formattedAvatar
      });
      if (res.data.success) {
        setMessage('Your profile details and image have been updated successfully!');
        setProfile(prev => ({ ...prev, avatar_url: formattedAvatar, newPassword: '' }));
        if (res.data.user) {
          updateUser(res.data.user);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <User className="w-7 h-7 text-gfg-accent" />
          <span>My Member Profile & Settings</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Update your public profile photo, bio, social media accounts, or change your portal password.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-gfg-500/10 border border-gfg-500/30 text-gfg-accent text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 space-y-8 shadow-2xl">
        
        {/* Profile Avatar Header */}
        <div className="flex items-center space-x-6 pb-6 border-b border-dark-border">
          <img
            src={formatAvatarUrl(profile.avatar_url)}
            alt={profile.name}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'; }}
            className="w-24 h-24 rounded-3xl object-cover border-2 border-gfg-accent shadow-xl"
          />
          <div className="space-y-1">
            <RoleBadge role={user?.role} />
            <h2 className="text-xl font-bold text-white mt-1">{profile.name}</h2>
            <p className="text-xs font-mono text-gfg-accent">{user?.position}</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleProfileSave} className="space-y-6 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gfg-accent"
              />
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Profile Image Path / URL</label>
              <div className="relative">
                <Camera className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="/avatars/filename.jpg"
                  value={profile.avatar_url}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>
              <span className="text-[10px] text-gray-500 block mt-1">Upload your photo to `frontend/public/avatars/filename.jpg` and type `/avatars/filename.jpg`</span>
            </div>
          </div>

          <div>
            <label className="block font-mono text-gray-400 mb-1">Bio / Technical Background</label>
            <textarea
              rows="3"
              placeholder="Tell chapter members about your tech stack, skills, and interests..."
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gfg-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-gray-400 mb-1">LinkedIn Profile URL</label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profile.linkedin_url}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Instagram Profile URL</label>
              <div className="relative">
                <Instagram className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={profile.instagram_url}
                  onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>
            </div>
          </div>

          {/* Change Password Block */}
          <div className="p-4 bg-dark-bg border border-dark-border rounded-2xl space-y-2">
            <label className="block font-mono text-amber-400 font-semibold flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" /> Change Portal Password
            </label>
            <input
              type="password"
              placeholder="Leave blank to keep current password..."
              value={profile.newPassword}
              onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gfg-500 hover:bg-gfg-hover text-white px-6 py-3 rounded-xl font-bold text-xs shadow-xl shadow-gfg-500/20 flex items-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
