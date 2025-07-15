import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TravelPosts from './TravelPosts';
import PostDetailPage from './PostDetailPage';
import ProfilePage from './ProfilePage';
import SearchPage from './SearchPage';
import BottomNavigation from './BottomNavigation';
import CreatePostPage from './CreatePostPage';
import EditPostPage from './EditPostPage';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'search', 'create', 'profile', 'post', 'login', 'signup'
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);

  const handleNavigate = (view) => {
    if ((view === 'profile' || view === 'create') && !isLoggedIn) {
      setCurrentView('login');
    } else {
      setCurrentView(view);
      // Clear selected post when navigating away
      if (view !== 'post') {
        setSelectedPostId(null);
      }
    }
  };

  const handleEditPost = (postId) => {
    setEditingPostId(postId);
    setCurrentView('edit');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
      setCurrentView('home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleViewPost = (postId) => {
    setSelectedPostId(postId);
    setCurrentView('post');
  };

  const handleBackToHome = () => {
    setSelectedPostId(null);
    setCurrentView('home');
  };

  // const handleNavigate = (view) => {
  //   if (view === 'profile' && !isLoggedIn) {
  //     setCurrentView('login');
  //   } else if (view === 'create' && !isLoggedIn) {
  //     setCurrentView('login');
  //   } else {
  //     setCurrentView(view);
  //   }
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {/* Top Navbar - only show on login/signup pages */}
      {(currentView === 'login' || currentView === 'signup') && (
        <Navbar 
          user={user}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onShowLogin={() => setCurrentView('login')}
          onShowSignup={() => setCurrentView('signup')}
        />
      )}
      
      <main className="main-content">
        {currentView === 'home' && (
          <div>
            <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Travel Stories</h1>
            <TravelPosts onViewPost={handleViewPost} />
          </div>
        )}

        {currentView === 'search' && (
          <SearchPage onViewPost={handleViewPost} />
        )}

        {currentView === 'edit' && (
          <EditPostPage
          postId={editingPostId}
          onPostUpdated={(updatedPost) => {
            setCurrentView('post');
          }}
          onCancel={() => {
            setCurrentView('post');
            setEditingPostId(null);
          }}
          />
        )}

        {currentView === 'create' && (
          <CreatePostPage 
            user={user}
            onPostCreated={(newPost) => {
              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'profile' && (
          <ProfilePage 
            user={user} 
            onViewPost={handleViewPost}
            currentUserId={user?.id} 
          />
        )}
        
        {currentView === 'post' && (
          <PostDetailPage 
            postId={selectedPostId} 
            onBackToHome={handleBackToHome}
            onEditPost={handleEditPost}
            currentUserId={user?.id} 
          />
        )}
        
        {currentView === 'login' && (
          <LoginForm onLogin={handleLogin} />
        )}
        
        {currentView === 'signup' && (
          <SignupForm onSignup={handleSignup} />
        )}
      </main>

      {/* Bottom Navigation - hide on login/signup */}
      {currentView !== 'login' && currentView !== 'signup' && (
        <BottomNavigation 
          currentView={currentView}
          onNavigate={handleNavigate}
          user={user}
        />
      )}
    </div>
  );
}

export default App;