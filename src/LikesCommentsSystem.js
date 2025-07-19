import React, { useState, useEffect } from 'react';

// Like Button Component
export const LikeButton = ({ postId, initialLikeCount = 0, initialLiked = false, currentUserId }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      alert('Please log in to like posts');
      return;
    }

    setLoading(true);
    try {
      const endpoint = liked ? 'unlike' : 'like';
      const method = liked ? 'DELETE' : 'POST';
      
      const response = await fetch(`http://localhost:3000/api/v1/posts/${postId}/${endpoint}`, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.like_count);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        fontSize: '16px',
        color: liked ? '#ff6b6b' : '#666',
        transition: 'all 0.2s ease',
        padding: '8px 12px',
        borderRadius: '20px',
        backgroundColor: liked ? '#fff5f5' : 'transparent'
      }}
    >
      <span style={{ 
        fontSize: '18px',
        transform: liked ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s ease'
      }}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span style={{ fontWeight: '500' }}>{likeCount}</span>
    </button>
  );
};

// Comment Button Component
export const CommentButton = ({ commentCount = 0, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#666',
        padding: '8px 12px',
        borderRadius: '20px',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#f0f0f0';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
      }}
    >
      <span style={{ fontSize: '18px' }}>💬</span>
      <span style={{ fontWeight: '500' }}>{commentCount}</span>
    </button>
  );
};

// Add Comment Form Component
const AddCommentForm = ({ postId, onCommentAdded, currentUserId }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (!currentUserId) {
      alert('Please log in to comment');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/posts/${postId}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: { content: content.trim() }
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        onCommentAdded(newComment);
        setContent('');
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start'
      }}>
        {/* User Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#8B4513',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          flexShrink: 0
        }}>
          👤
        </div>
        
        {/* Comment Input */}
        <div style={{ flex: 1 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={currentUserId ? "Add a comment..." : "Please log in to comment"}
            disabled={!currentUserId || loading}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
            }}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px'
          }}>
            <span style={{
              fontSize: '12px',
              color: content.length > 900 ? '#ff6b6b' : '#999'
            }}>
              {content.length}/1000
            </span>
            
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading || !currentUserId}
              style={{
                padding: '8px 16px',
                backgroundColor: (!content.trim() || loading || !currentUserId) ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: (!content.trim() || loading || !currentUserId) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              {loading ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Comment Item Component
const CommentItem = ({ comment, onDelete, currentUserId }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/posts/${comment.post_id}/comments/${comment.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        onDelete(comment.id);
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      opacity: deleting ? 0.5 : 1,
      transition: 'opacity 0.2s ease'
    }}>
      {/* User Avatar */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#8B4513',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        flexShrink: 0
      }}>
        👤
      </div>
      
      {/* Comment Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '12px 16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{
              fontWeight: '600',
              fontSize: '14px',
              color: '#333'
            }}>
              {comment.user.username}
            </span>
            
            {currentUserId === comment.user.id && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e9ecef';
                  e.target.style.color = '#dc3545';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#999';
                }}
              >
                🗑️
              </button>
            )}
          </div>
          
          <p style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.4',
            color: '#333'
          }}>
            {comment.content}
          </p>
        </div>
        
        <span style={{
          fontSize: '12px',
          color: '#999',
          marginLeft: '16px',
          marginTop: '4px',
          display: 'block'
        }}>
          {formatDate(comment.created_at)}
        </span>
      </div>
    </div>
  );
};

// Comments Modal Component
export const CommentsModal = ({ isOpen, onClose, postId, postTitle, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
          }}>
            Comments on "{postTitle}"
          </h2>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto'
        }}>
          {/* Add Comment Form */}
          <AddCommentForm
            postId={postId}
            onCommentAdded={handleCommentAdded}
            currentUserId={currentUserId}
          />

          {/* Comments List */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              Loading comments...
            </div>
          ) : comments.length > 0 ? (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '16px'
              }}>
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </h3>
              
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleCommentDeleted}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>No comments yet</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};