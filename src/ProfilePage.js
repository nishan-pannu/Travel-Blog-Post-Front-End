import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, onViewPost, currentUserId }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const isOwnProfile = currentUserId === user?.id;

  const fetchUserPosts = async () => {
    try {
      // Fetch posts by this user
      const response = await fetch(`http://localhost:3000/api/v1/users/${user.id}/posts`);
      if (response.ok) {
        const posts = await response.json();
        setUserPosts(posts);
      } else {
        setUserPosts([]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        // Remove the post from the local state
        setUserPosts(prev => prev.filter(post => post.id !== postId));
        setShowDeleteModal(false);
        setPostToDelete(null);
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('Error deleting post');
    }
  };

  const confirmDelete = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px 20px 120px 20px' // Increased bottom padding
    }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 0',
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '30px'
      }}>
        {/* Profile Picture */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#4ea1db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '20px',
          fontSize: '40px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {user.profile_picture ? (
            <img 
              src={user.profile_picture || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            user.name?.charAt(0).toUpperCase() || '👤'
          )}
        </div>

        {/* Profile Info */}
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            {user.name || 'Username'}
          </h2>
          
          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {userPosts.length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>posts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {user.followers_count || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {user.following_count || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>following</div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p style={{ 
              margin: '0', 
              fontSize: '14px', 
              lineHeight: '1.4',
              color: '#333'
            }}>
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px' 
      }}>
        <button style={{
          flex: 1,
          padding: '10px',
          backgroundColor: '#4ea1db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          Edit Profile
        </button>
        <button style={{
          flex: 1,
          padding: '10px',
          backgroundColor: '#f8f9fa',
          color: '#333',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          Share Profile
        </button>
      </div>

      {/* Posts Grid */}
      <div>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px'
        }}>
          Your Travel Posts
        </h3>

        {userPosts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px dashed #ccc'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📸</div>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>No posts yet</h4>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              Start sharing your travel experiences!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px'
          }}>
            {userPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  aspectRatio: '1',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Post Image/Content */}
                <div
                  onClick={() => onViewPost(post.id)}
                  style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                >
                  {post.picture_url ? (
                    <img
                      src={post.picture_url || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        // If image fails to load, show placeholder
                        e.target.style.display = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Placeholder for missing/failed images */}
                  <div style={{
                    display: post.picture_url ? 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop' : 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e9ecef',
                    color: '#6c757d',
                    flexDirection: 'column',
                    fontSize: '12px',
                    textAlign: 'center',
                    padding: '10px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '5px' }}>🌍</div>
                    <div style={{ fontWeight: '500', lineHeight: '1.2' }}>
                      {post.title?.substring(0, 20) || 'Travel Story'}
                      {post.title?.length > 20 && '...'}
                    </div>
                  </div>
                  
                  {/* Post overlay with title - only show if there's an image */}
                  {post.picture_url && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      padding: '10px 8px 8px 8px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {post.title}
                    </div>
                  )}
                </div>

                {/* No edit/delete buttons on profile grid - removed */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
              Delete Post
            </h3>
            <p style={{ margin: '0 0 25px 0', color: '#666', lineHeight: '1.5' }}>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPostToDelete(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(postToDelete.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;