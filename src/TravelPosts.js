import React, { useState, useEffect } from 'react';

const TravelPosts = ({ onViewPost }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from your backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading posts...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 20px 120px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Travel Posts</h1>
      
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No posts found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post) => (
            <div 
              key={post.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {/* Post Header */}
              <div style={{ marginBottom: '15px' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
                  {post.title || 'Untitled Post'}
                </h2>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  display: 'flex',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  {post.author && <span>By: {post.author}</span>}
                  {post.stayed_at && <span>📍 {post.stayed_at}</span>}
                  {post.trip_date && (
                    <span>🗓️ {new Date(post.trip_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Post Image */}
              {post.picture_url && (
                <div style={{ marginBottom: '15px' }}>
                  <img 
                    src={post.picture_url || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'} 
                    alt={post.title || 'Travel post'}
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '6px'
                    }}
                  />
                </div>
              )}

              {/* Post Content */}
              <div style={{ marginBottom: '15px' }}>
                <p style={{ 
                  lineHeight: '1.6', 
                  margin: '0',
                  color: '#444'
                }}>
                  {post.intro || 'No content available'}
                </p>
              </div>

              {/* Post Tags */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        style={{
                          backgroundColor: '#e1f5fe',
                          color: '#0277bd',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Engagement Stats */}
              <div style={{ 
                marginTop: '15px',
                display: 'flex',
                gap: '20px',
                fontSize: '14px',
                color: '#666',
                alignItems: 'center'
              }}>
                {post.like_count !== undefined && <span>♡ {post.like_count} likes</span>}
                {post.comment_count !== undefined && <span>💬 {post.comment_count} comments</span>}
                {post.anonymous && <span>👤 Anonymous Post</span>}
                
                {/* View Details Button */}
                <button
                  onClick={() => onViewPost(post.id)}
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  View Full Trip →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelPosts;