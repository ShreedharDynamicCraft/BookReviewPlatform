import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { userService } from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { id } = useParams();
  const { userInfo, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Check if viewing own profile
  const isOwnProfile = userInfo?._id === id;
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile(id);
        setProfile(data);
        
        // Set form data
        setName(data.name || '');
        setEmail(data.email || '');
        setBio(data.bio || '');
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const userData = {
        name,
        email,
        bio,
        ...(password && { password }),
      };
      
      await updateProfile(id, userData);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-8">
          <h1 className="text-2xl font-bold text-white">{profile.name}'s Profile</h1>
        </div>
        
        <div className="p-8">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Bio</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="4"
                ></textarea>
              </div>
              
              <div>
                <label className="block font-medium mb-1">New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-sm uppercase font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg">{profile.email}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm uppercase font-medium text-gray-500">Bio</h3>
                <p className="mt-1">{profile.bio || 'No bio provided'}</p>
              </div>
              
              {isOwnProfile && (
                <button 
                  onClick={() => setEditing(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
