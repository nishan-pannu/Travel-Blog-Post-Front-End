import React, { useState, useEffect } from 'react';
import { LikeButton, CommentButton, CommentsModal } from './LikesCommentsSystem';

const TravelBlogPostDetail = ({ postId, onBackToHome, currentUserId }) => {
  const [post, setPost] = useState(null);
  const [days, setDays] = useState([]);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);

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
          setDays([]);
        }

        // Fetch rating for this post
        const ratingResponse = await fetch(`http://localhost:3000/api/v1/posts/${postId}/ratings`);
        if (ratingResponse.ok) {
          const ratingData = await ratingResponse.json();
          setRating(ratingData);
        } else {
          setRating(null);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  const getCostDisplay = (cost) => {
    if (!cost) return '';
    const costMap = {
      'Budget': '$',
      'Mid-range': '$$', 
      'Luxury': '$$$',
      'Ultra-luxury': '$$$$'
    };
    return costMap[cost] || cost;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <p>Error: {error || 'Post not found'}</p>
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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px 40px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: '500',
          color: '#333'
        }}>
          Welcome to Travel Blog
        </h1>
        
        {/* Navigation */}
        <div style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          color: '#666',
          fontSize: '16px'
        }}>
          <span style={{ cursor: 'pointer' }} onClick={onBackToHome}>Home</span>
          
          {/* Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#4ea1db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              👤
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        gap: '40px',
        padding: '40px',
        backgroundColor: 'white',
        margin: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        
        {/* Left Content */}
        <div style={{ flex: '2' }}>
          {/* Post Header */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '600',
              margin: '0 0 15px 0',
              color: '#333',
              lineHeight: '1.2'
            }}>
              {post.title}
            </h2>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              color: '#666',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              <span>By: {post.author}</span>
              <span>Published: {formatDate(post.trip_date || post.created_at)}</span>
            </div>

            {/* Like and Comment Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e9ecef'
            }}>
              <LikeButton
                postId={post.id}
                initialLikeCount={post.like_count || 0}
                initialLiked={post.liked_by_current_user || false}
                currentUserId={currentUserId}
              />
              
              <CommentButton
                commentCount={post.comment_count || 0}
                onClick={() => setShowComments(true)}
              />
            </div>        
            
          </div>

          {/* Introduction */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 10px 0'
            }}>
              Introduction:
            </h3>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333',
              margin: 0
            }}>
              {post.intro || 'No description available for this trip.'}
            </p>
          </div>

          {/* Days Breakdown */}
          <div>
            {days.length > 0 ? (
              days.map((day) => (
                <div key={day.id} style={{ marginBottom: '25px' }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    margin: '0 0 15px 0',
                    color: '#333'
                  }}>
                    Day {day.day_number} - {day.intro || day.day_intro || 'Exploring'}
                  </h3>
                  <div style={{
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333'
                  }}>
                    {day.description || day.day_description || 'No activities listed for this day.'}
                  </div>
                  {(day.picture || day.day_picture_url) && (
                    <div style={{ marginTop: '15px' }}>
                      <img
                        src={day.picture || day.day_picture_url}
                        alt={`Day ${day.day_number}`}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ 
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#666'
              }}>
                <p>No daily itinerary available for this trip.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ flex: '1' }}>
          {/* Cover Image */}
          <div style={{
            marginBottom: '30px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <img
              src={post.picture_url || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'}
              alt={post.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop';
              }}
            />
          </div>

          {/* Rating Card */}
          {rating && (
            <div style={{
              border: '2px solid #333',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                OVERALL RATING: <span style={{ fontSize: '24px', color: '#333' }}>{rating.overall}</span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '14px'
              }}>
                {rating.food && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Food Rating:</span>
                    <strong>{rating.food}</strong>
                  </div>
                )}
                
                {rating.safety && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Safety Rating:</span>
                    <strong>{rating.safety}</strong>
                  </div>
                )}
                
                {rating.cost && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cost:</span>
                    <strong>{getCostDisplay(rating.cost)}</strong>
                  </div>
                )}
                
                {rating.transportation && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>Transportation:</div>
                    <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {rating.transportation}
                    </div>
                  </div>
                )}
                
                {rating.visit_again && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    fontWeight: '600'
                  }}>
                    <span>Visit Again?</span>
                    <span>{rating.visit_again}</span>
                  </div>
                )}

                {rating.summary && (
                  <div style={{ marginTop: '15px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>Summary:</div>
                    <div style={{ 
                      fontSize: '13px', 
                      lineHeight: '1.4',
                      fontStyle: 'italic',
                      color: '#555'
                    }}>
                      "{rating.summary}"
                    </div>
                  </div>
                )}

                {rating.tags && (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      #{rating.tags}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit/Delete buttons for post owner */}
          {currentUserId === post.author_id && (
            <div style={{ 
              marginTop: '20px',
              display: 'flex', 
              gap: '10px' 
            }}>
              <button
                onClick={() => alert('Edit functionality would go here')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
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
                  flex: 1,
                  padding: '8px 12px',
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

          {/* No Rating Message */}
          {!rating && (
            <div style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              color: '#666'
            }}>
              <p style={{ margin: 0 }}>No rating available for this trip.</p>
            </div>
          )}
        </div>
      </div>

      {/* Comments Modal - Outside everything for proper z-index */}
      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={post.id}
        postTitle={post.title}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default TravelBlogPostDetail;