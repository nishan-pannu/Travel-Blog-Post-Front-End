import React, { useState, useEffect } from 'react';

const SearchPage = ({ onViewPost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for:', query); // Debug log
      const response = await fetch(`http://localhost:3000/api/v1/posts/search?q=${encodeURIComponent(query)}`);
      console.log('Search response status:', response.status); // Debug log
      
      if (response.ok) {
        const results = await response.json();
        console.log('Search results:', results); // Debug log
        setSearchResults(results);
      } else {
        console.error('Search failed with status:', response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      // Add to recent searches (you can store this in localStorage later)
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        return updated;
      });
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px 20px 120px 20px' // Increased bottom padding
    }}>
      {/* Search Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', textAlign: 'center' }}>
          Discover Travel Stories
        </h2>
        
        {/* Search Bar */}
        <div>
          <div style={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search destinations, experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e);
                }
              }}
              style={{
                width: '100%',
                padding: '12px 50px 12px 20px',
                border: '1px solid #e0e0e0',
                borderRadius: '25px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f8f9fa'
              }}
            />
            <button
              onClick={(e) => handleSearchSubmit(e)}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#007bff'
              }}
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && searchQuery === '' && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#666' }}>
            Recent Searches
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(search);
                  handleSearch(search);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Searching...</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
            Search Results ({searchResults.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {searchResults.map((post) => (
              <div
                key={post.id}
                onClick={() => onViewPost(post.id)}
                style={{
                  display: 'flex',
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
              >
                {/* Post Image */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginRight: '15px',
                  flexShrink: 0
                }}>
                  {post.picture_url ? (
                    <img
                      src={post.picture_url}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6c757d'
                    }}>
                      📷
                    </div>
                  )}
                </div>

                {/* Post Info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                    {post.title}
                  </h4>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '14px', 
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    {post.intro?.substring(0, 100)}...
                  </p>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {post.author && <span>By {post.author}</span>}
                    {post.stayed_at && <span> • 📍 {post.stayed_at}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && !loading && searchResults.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>No results found</h4>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            Try searching for different destinations or experiences
          </p>
        </div>
      )}

      {/* Popular Destinations (when no search) */}
      {!searchQuery && searchResults.length === 0 && (
        <div>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
            Popular Destinations
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px'
          }}>
            {['Paris', 'Tokyo', 'New York', 'London', 'Bali', 'Iceland'].map((destination) => (
              <button
                key={destination}
                onClick={() => {
                  setSearchQuery(destination);
                  handleSearch(destination);
                }}
                style={{
                  padding: '20px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {destination}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;