import React, { useState, useEffect } from 'react';

const TravelDays = () => {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch days from ALL posts
  useEffect(() => {
    const fetchDays = async () => {
      try {
        // First get all posts
        const postsResponse = await fetch('http://localhost:3000/api/v1/posts');
        const posts = await postsResponse.json();
        
        // Then get days for each post
        const allDays = [];
        for (const post of posts) {
          try {
            const daysResponse = await fetch(`http://localhost:3000/api/v1/posts/${post.id}/days`);
            if (daysResponse.ok) {
              const postDays = await daysResponse.json();
              // Add post info to each day
              const daysWithPostInfo = postDays.map(day => ({
                ...day,
                postTitle: post.title,
                postId: post.id
              }));
              allDays.push(...daysWithPostInfo);
            }
          } catch (error) {
            console.error(`Error fetching days for post ${post.id}:`, error);
          }
        }
        
        setDays(allDays);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDays();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading days...</p>
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
      <h1 style={{ textAlign: 'left', marginBottom: '30px' }}>Travel Itinerary</h1>
      
      {days.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No days found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {days.map((day) => (
            <div 
              key={day.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#d5e7f2',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {/* Day Header */}
              <div style={{ marginBottom: '15px' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
                  Day {day.number || 'Unknown'} - {day.intro}
                </h2>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  display: 'flex',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}> 
                  {day.intro && <span>📍 {day.intro}</span>}
                  <span>🗂️ From: {day.postTitle}</span>
                </div>
              </div>

              {/* Day Image */}
              {day.day_picture_url && (
                <div style={{ marginBottom: '15px' }}>
                  <img 
                    src={day.day_picture_url} 
                    alt={`Day ${day.day_number}`}
                    style={{
                      width: '80%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}

              {/* Day Description */}
              <div style={{ marginBottom: '15px' }}>
                <p style={{ 
                  lineHeight: '1.6', 
                  margin: '0',
                  color: '#444',
                  whiteSpace: 'pre-line' // This preserves line breaks in your description
                }}>
                  {day.description || day.intro || 'No content available'}
                </p>
              </div>

              {/* Day Tags */}
              {day.tags && day.tags.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {day.tags.map((tag, index) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelDays;