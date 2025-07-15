import React, { useState, useEffect } from 'react';

const RatingsDetailPage = ({ postId, onBackToHome }) => {
  const [post, setPost] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostAndRatings = async () => {
      try {
        // Fetch the specific post
        const postResponse = await fetch(`http://localhost:3000/api/v1/posts/${postId}`);
        if (!postResponse.ok) {
          throw new Error('Post not found');
        }
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch ratings for this post (fix the URL)
        const ratingsResponse = await fetch(`http://localhost:3000/api/v1/posts/${postId}/ratings`);
        if (ratingsResponse.ok) {
          const ratingsData = await ratingsResponse.json();
          setRatings(ratingsData);
        } else {
          setRatings([]); // No ratings found, that's okay
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostAndRatings();
    }
  }, [postId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading post and ratings...</p>
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
          paddingTop: '15px'
        }}>
          {post.like_count !== undefined && <span>❤️ {post.like_count} likes</span>}
          {post.comment_count !== undefined && <span>💬 {post.comment_count} comments</span>}
          {post.anonymous && <span>👤 Anonymous Post</span>}
        </div>
      </div>

      {/* Ratings Section */}
      {ratings.length > 0 && (
        <div>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '20px',
            fontSize: '28px',
            borderBottom: '2px solid #007bff',
            paddingBottom: '10px'
          }}>
            Ratings & Reviews ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {ratings.map((rating) => (
              <div 
                key={rating.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '25px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                {/* Rating Header */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    color: '#007bff',
                    fontSize: '20px'
                  }}>
                    Overall Rating: {rating.overall}/10
                  </h3>
                </div>

                {/* Rating Categories Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  {rating.food && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🍽️ Food:</span>
                      <strong>{rating.food}/10</strong>
                    </div>
                  )}
                  {rating.safety && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🛡️ Safety:</span>
                      <strong>{rating.safety}/10</strong>
                    </div>
                  )}
                  {rating.cost && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>💰 Cost:</span>
                      <strong>{rating.cost}/10</strong>
                    </div>
                  )}
                  {rating.climate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🌤️ Climate:</span>
                      <strong>{rating.climate}/10</strong>
                    </div>
                  )}
                </div>

                {/* Transportation & Visit Again */}
                <div style={{ marginBottom: '15px' }}>
                  {rating.transportation && (
                    <p style={{ margin: '5px 0', color: '#555' }}>
                      <strong>🚌 Transportation:</strong> {rating.transportation}
                    </p>
                  )}
                  {rating.visit_again && (
                    <p style={{ margin: '5px 0', color: '#555' }}>
                      <strong>🔄 Would visit again:</strong> {rating.visit_again}
                    </p>
                  )}
                </div>

                {/* Summary */}
                {rating.summary && (
                  <div style={{ 
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Review Summary:</h4>
                    <p style={{ 
                      margin: '0',
                      lineHeight: '1.6',
                      color: '#555'
                    }}>
                      {rating.summary}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {rating.tags && (
                  <div style={{ marginTop: '15px' }}>
                    <span style={{
                      backgroundColor: '#e1f5fe',
                      color: '#0277bd',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      #{rating.tags}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Ratings Message */}
      {ratings.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px dashed #ccc'
        }}>
          <p style={{ margin: '0', color: '#666', fontSize: '18px' }}>
            No ratings available for this trip yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default RatingsDetailPage;