import React, { useState, useEffect } from 'react';

const PostDetailPage = ({ postId, onBackToHome, onEditPost, currentUserId }) => {
  const [post, setPost] = useState(null);
  const [days, setDays] = useState([]);
  const [rating, setRating] = useState(null); // Single rating, not array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDaysAndRating = async () => {
      try {
        // Fetch the specific post
        const postResponse = await fetch(`http://localhost:3000/api/v1/posts/${postId}`);
        if (!postResponse.ok) {
          throw new Error('Post not found');
        }
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch days for this post
        const daysResponse = await fetch(`http://localhost:3000/api/v1/posts/${postId}/days`);
        if (daysResponse.ok) {
          const daysData = await daysResponse.json();
          setDays(daysData);
        } else {
          setDays([]); // No days found, that's okay
        }

        // Fetch rating for this post
        const ratingResponse = await fetch(`http://localhost:3000/api/v1/posts/${postId}/ratings`);
        if (ratingResponse.ok) {
          const ratingData = await ratingResponse.json();
          // Since your controller returns a single rating object, not an array
          setRating(ratingData);
        } else {
          setRating(null); // No rating found, that's okay
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDaysAndRating();
    }
  }, [postId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <p>Error: {error}</p>
        <button 
          onClick={onBackToHome}
          style={{ 
            color: '#007bff', 
            background: 'none', 
            border: 'none', 
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Post not found</p>
        <button 
          onClick={onBackToHome}
          style={{ 
            color: '#007bff', 
            background: 'none', 
            border: 'none', 
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Back to Home Link */}
      <button 
        onClick={onBackToHome}
        style={{ 
          color: '#007bff', 
          background: 'none', 
          border: 'none', 
          textDecoration: 'underline',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'inline-block',
          fontSize: '16px'
        }}
      >
        ← Back to All Posts
      </button>

      {/* Post Details */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '30px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        {/* Post Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '32px' }}>
            {post.title || 'Untitled Post'}
          </h1>
          <div style={{ 
            fontSize: '16px', 
            color: '#666',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {post.author && <span><strong>By:</strong> {post.author}</span>}
            {post.stayed_at && <span><strong>🏨 Stayed at:</strong> {post.stayed_at}</span>}
            {post.trip_date && (
              <span><strong>📅 Trip Date:</strong> {new Date(post.trip_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {/* Post Image */}
        {post.picture_url && (
          <div style={{ marginBottom: '20px' }}>
            <img 
              src={post.picture_url} 
              alt={post.title || 'Travel post'}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
        )}

        {/* Post Content */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ 
            lineHeight: '1.8', 
            margin: '0',
            color: '#444',
            fontSize: '18px'
          }}>
            {post.intro || 'No content available'}
          </p>
        </div>

        {/* Engagement Stats */}
        <div style={{ 
          display: 'flex',
          gap: '25px',
          fontSize: '16px',
          color: '#666',
          borderTop: '1px solid #eee',
          paddingTop: '15px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '25px', flex: 1 }}>
            {post.like_count !== undefined && <span>❤️ {post.like_count} likes</span>}
            {post.comment_count !== undefined && <span>💬 {post.comment_count} comments</span>}
            {post.anonymous && <span>👤 Anonymous Post</span>}
          </div>
          
          {/* Edit/Delete buttons for post owner */}
          {currentUserId === post.author_id && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => onEditPost(postId)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this post?')) {
                    fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
                      method: 'DELETE',
                      credentials: 'include'
                    }).then(response => {
                      if (response.ok) {
                        onBackToHome();
                      } else {
                        alert('Failed to delete post');
                      }
                    });
                  }
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rating Section */}
      {rating && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '30px',
          backgroundColor: '#fff3cd',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '20px',
            fontSize: '28px',
            borderBottom: '2px solid #ffc107',
            paddingBottom: '10px'
          }}>
            Trip Rating & Review
          </h2>

          {/* Overall Rating */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#007bff',
              marginBottom: '5px'
            }}>
              {rating.overall}/10
            </div>
            <div style={{ fontSize: '18px', color: '#666' }}>Overall Rating</div>
          </div>

          {/* Rating Categories Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            {rating.food && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px' }}>🍽️ Food:</span>
                <strong style={{ fontSize: '18px', color: '#007bff' }}>{rating.food}/10</strong>
              </div>
            )}
            {rating.safety && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px' }}>🛡️ Safety:</span>
                <strong style={{ fontSize: '18px', color: '#007bff' }}>{rating.safety}/10</strong>
              </div>
            )}
            {rating.cost && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px' }}>💰 Cost:</span>
                <strong style={{ fontSize: '18px', color: '#007bff' }}>{rating.cost}</strong>
              </div>
            )}
            {rating.climate && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px' }}>🌤️ Climate:</span>
                <strong style={{ fontSize: '18px', color: '#007bff' }}>{rating.climate}</strong>
              </div>
            )}
          </div>

          {/* Transportation & Visit Again */}
          <div style={{ marginBottom: '20px' }}>
            {rating.transportation && (
              <p style={{ margin: '8px 0', fontSize: '16px', color: '#555' }}>
                <strong>🚌 Transportation:</strong> {rating.transportation}
              </p>
            )}
            {rating.visit_again && (
              <p style={{ margin: '8px 0', fontSize: '16px', color: '#555' }}>
                <strong>🔄 Would visit again:</strong> {rating.visit_again}
              </p>
            )}
          </div>

          {/* Summary */}
          {rating.summary && (
            <div style={{ 
              backgroundColor: '#e9ecef',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '20px' }}>Review Summary:</h4>
              <p style={{ 
                margin: '0',
                lineHeight: '1.6',
                color: '#555',
                fontSize: '16px'
              }}>
                {rating.summary}
              </p>
            </div>
          )}

          {/* Tags */}
          {rating.tags && (
            <div style={{ textAlign: 'center' }}>
              <span style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                #{rating.tags}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Days Section */}
      {days.length > 0 && (
        <div>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '20px',
            fontSize: '28px',
            borderBottom: '2px solid #007bff',
            paddingBottom: '10px'
          }}>
            Day-by-Day Itinerary ({days.length} {days.length === 1 ? 'day' : 'days'})
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {days.map((day) => (
              <div 
                key={day.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '25px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    color: '#007bff',
                    fontSize: '24px'
                  }}>
                    Day {day.number}
                  </h3>
                  {day.intro && (
                    <p style={{ 
                      margin: '0 0 10px 0', 
                      fontSize: '16px', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      📍 {day.intro}
                    </p>
                  )}
                </div>
                
                {day.picture && (
                  <div style={{ marginBottom: '15px' }}>
                    <img 
                      src={day.picture} 
                      alt={`Day ${day.number}`}
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                )}
                
                {day.description && (
                  <div style={{ 
                    margin: '0',
                    lineHeight: '1.6',
                    color: '#555',
                    whiteSpace: 'pre-line',
                    fontSize: '16px',
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '6px'
                  }}>
                    {day.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {days.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px dashed #ccc'
        }}>
          <p style={{ margin: '0', color: '#666', fontSize: '18px' }}>
            No daily itinerary available for this trip yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;