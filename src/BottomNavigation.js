import React from 'react';

const BottomNavigation = ({ currentView, onNavigate, user }) => {
  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: '🏠' 
    },
    { 
      id: 'search', 
      label: 'Search', 
      icon: '🔍' 
    },
    { 
      id: 'create', 
      label: 'Create', 
      icon: '➕' 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: user?.profile_picture ? '👤' : '👤' 
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            backgroundColor: currentView === item.id ? '#f0f0f0' : 'transparent',
            color: currentView === item.id ? '#007bff' : '#666'
          }}
        >
          <span style={{ 
            fontSize: '24px', 
            marginBottom: '4px',
            filter: currentView === item.id ? 'none' : 'grayscale(0.5)'
          }}>
            {item.icon}
          </span>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: currentView === item.id ? '600' : '400'
          }}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;