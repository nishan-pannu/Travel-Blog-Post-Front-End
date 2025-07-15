const API_BASE_URL = 'http://localhost:3000/api/v1';

export const authService = {
  // Login user (accepts email OR username)
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  // Sign up new user
  signup: async (name, email, password, passwordConfirmation) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        user: { 
          name, 
          email, 
          password, 
          password_confirmation: passwordConfirmation 
        } 
      })
    });
    return response.json();
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/current_user`, {
      credentials: 'include'
    });
    return response.json();
  }
};