import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { id } = useParams();
  const { userInfo, updateProfile, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editing, setEditing] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if current user is viewing their own profile
  const isOwnProfile = userInfo && userInfo._id === id;
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        setUser(data);
        
        if (isOwnProfile) {
          setName(data.name || '');
          setEmail(data.email || '');
          setBio(data.bio || '');
          setFavoriteGenres(data.favoriteGenres || []);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };
    
    fetchUserProfile();
  }, [id, isOwnProfile]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const userData = {
        name,
        email,
        bio,
        favoriteGenres,
      };
      
      if (password) {
        userData.password = password;
      }
      
      await updateProfile(id, userData);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };
  
  if (loadingUser) {
    return <div className="loading">Loading profile...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!user) {
    return <div className="not-found">User not found</div>;
  }
  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>{isOwnProfile ? 'My Profile' : `${user.name}'s Profile`}</h1>
        
        {isOwnProfile && !editing ? (
          <button 
            className="edit-profile-btn"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        ) : null}
        
        {isOwnProfile && editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="favoriteGenres">Favorite Genres (comma separated)</label>
              <input
                type="text"
                id="favoriteGenres"
                value={favoriteGenres.join(', ')}
                onChange={(e) => setFavoriteGenres(e.target.value.split(',').map(genre => genre.trim()))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">New Password (leave blank to keep current)</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div className="profile-actions">
              <button 
                type="submit" 
                className="save-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <h3>Name</h3>
              <p>{user.name}</p>
            </div>
            
            {isOwnProfile && (
              <div className="info-group">
                <h3>Email</h3>
                <p>{user.email}</p>
              </div>
            )}
            
            <div className="info-group">
              <h3>Bio</h3>
              <p>{user.bio || 'No bio provided'}</p>
            </div>
            
            <div className="info-group">
              <h3>Favorite Genres</h3>
              {user.favoriteGenres && user.favoriteGenres.length > 0 ? (
                <div className="genre-tags">
                  {user.favoriteGenres.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              ) : (
                <p>No favorite genres specified</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
