import React, { useState } from 'react';

const CreatePostPage = ({ user, onPostCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    trip_date: '',
    intro: '',
    stayed_at: '',
    picture_url: '',
    anonymous: false
  });

  const [days, setDays] = useState([
    {
      day_number: 1,
      day_intro: '',
      day_description: '',
      day_picture_url: ''
    }
  ]);

  const [rating, setRating] = useState({
    overall: '',
    food: '',
    safety: '',
    cost: '',
    transportation: '',
    climate: '',
    visit_again: '',
    summary: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRating(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (dayIndex, field, value) => {
    setDays(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, [field]: value } : day
    ));
  };

  const addDay = () => {
    setDays(prev => [...prev, {
      day_number: prev.length + 1,
      day_intro: '',
      day_description: '',
      day_picture_url: ''
    }]);
  };

  const removeDay = (dayIndex) => {
    if (days.length > 1) {
      setDays(prev => prev.filter((_, index) => index !== dayIndex)
        .map((day, index) => ({ ...day, day_number: index + 1 })));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!rating.overall || !rating.visit_again || !rating.cost || !rating.summary.trim()) {
      setError('Please complete all required rating fields (Overall, Cost, Visit Again, Summary)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the post first
      const postResponse = await fetch('http://localhost:3000/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          post: formData
        })
      });

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const newPost = await postResponse.json();
      const postId = newPost.id;

      // Create days for the post
      const dayPromises = days.map(day => 
        fetch(`http://localhost:3000/api/v1/posts/${postId}/days`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            day: {
              day_number: day.day_number,
              day_intro: day.day_intro,
              day_description: day.day_description,
              day_picture_url: day.day_picture_url || null
            }
          })
        })
      );

      await Promise.all(dayPromises);

      // Create rating for the post
      await fetch(`http://localhost:3000/api/v1/posts/${postId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: {
            ...rating,
            user_id: user.id
          }
        })
      });

      onPostCreated(newPost);
      
    } catch (err) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px 20px 120px 20px' // Increased bottom padding
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            color: '#007bff',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        
        <h2 style={{ margin: 0, fontSize: '20px' }}>
          Share Your Travel Story
        </h2>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Share'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {/* Post Details Section */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Trip Details</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Trip Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., 7 Days in Paris"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Trip Date
              </label>
              <input
                type="date"
                name="trip_date"
                value={formData.trip_date}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Where you stayed
              </label>
              <input
                type="text"
                name="stayed_at"
                value={formData.stayed_at}
                onChange={handleInputChange}
                placeholder="Hotel/Airbnb name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Cover Photo URL
            </label>
            <input
              type="url"
              name="picture_url"
              value={formData.picture_url}
              onChange={handleInputChange}
              placeholder="https://example.com/photo.jpg"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Trip Summary
            </label>
            <textarea
              name="intro"
              value={formData.intro}
              onChange={handleInputChange}
              placeholder="Brief overview of your trip..."
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              name="anonymous"
              id="anonymous"
              checked={formData.anonymous}
              onChange={handleInputChange}
            />
            <label htmlFor="anonymous" style={{ fontSize: '14px' }}>
              Post anonymously
            </label>
          </div>
        </div>
      </div>

      {/* Days Section */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Daily Itinerary</h3>
          <button
            onClick={addDay}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            + Add Day
          </button>
        </div>

        {days.map((day, index) => (
          <div key={index} style={{
            marginBottom: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: '#007bff' }}>Day {day.day_number}</h4>
              {days.length > 1 && (
                <button
                  onClick={() => removeDay(index)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                  Location/Area
                </label>
                <input
                  type="text"
                  value={day.day_intro}
                  onChange={(e) => handleDayChange(index, 'day_intro', e.target.value)}
                  placeholder="e.g., Montmartre, Central Park"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                  What you did
                </label>
                <textarea
                  value={day.day_description}
                  onChange={(e) => handleDayChange(index, 'day_description', e.target.value)}
                  placeholder="Describe your activities, meals, experiences..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                  Photo URL (optional)
                </label>
                <input
                  type="url"
                  value={day.day_picture_url}
                  onChange={(e) => handleDayChange(index, 'day_picture_url', e.target.value)}
                  placeholder="https://example.com/day-photo.jpg"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rating Section */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fff3cd'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Rate Your Trip *</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Overall (1-10) *
            </label>
            <input
              type="number"
              name="overall"
              step="0.1"
              min="1"
              max="10"
              value={rating.overall}
              onChange={handleRatingChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Food (1-10)
            </label>
            <input
              type="number"
              name="food"
              step="0.1"
              min="1"
              max="10"
              value={rating.food}
              onChange={handleRatingChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Safety (1-10)
            </label>
            <input
              type="number"
              name="safety"
              step="0.1"
              min="1"
              max="10"
              value={rating.safety}
              onChange={handleRatingChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Cost *
            </label>
            <select
              name="cost"
              value={rating.cost}
              onChange={handleRatingChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Select cost level...</option>
              <option value="Budget">Budget ($)</option>
              <option value="Mid-range">Mid-range ($$)</option>
              <option value="Luxury">Luxury ($$$)</option>
              <option value="Ultra-luxury">Ultra-luxury ($$$$)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Climate
            </label>
            <select
              name="climate"
              value={rating.climate}
              onChange={handleRatingChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Select climate...</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Mild">Mild</option>
              <option value="Cool">Cool</option>
              <option value="Cold">Cold</option>
              <option value="Rainy">Rainy</option>
              <option value="Dry">Dry</option>
              <option value="Humid">Humid</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Transportation
            </label>
            <input
              type="text"
              name="transportation"
              value={rating.transportation}
              onChange={handleRatingChange}
              placeholder="e.g., walking, metro, uber"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Would visit again? *
            </label>
            <select
              name="visit_again"
              value={rating.visit_again}
              onChange={handleRatingChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Maybe">Maybe</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
            Review Summary *
          </label>
          <textarea
            name="summary"
            value={rating.summary}
            onChange={handleRatingChange}
            placeholder="Share your overall thoughts about the trip..."
            rows="3"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={rating.tags}
            onChange={handleRatingChange}
            placeholder="e.g., summer, budget, family"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Creating Your Travel Story...' : 'Share Your Complete Travel Story'}
      </button>
    </div>
  );
};

export default CreatePostPage;