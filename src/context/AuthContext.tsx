import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState } from '../types';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Define initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Define action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: any; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'AUTH_LOADING' };

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}>({
  state: initialState,
  login: async () => {},
  logout: () => {},
  clearError: () => {}
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: true
      };
    default:
      return state;
  }
};

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Set up axios default headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check for token on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'No token found' });
          return;
        }
        
        // Check if token is expired
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Token expired' });
          return;
        }
        
        // Token valid, fetch user data
        const res = await axios.get('/api/users/me');
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: res.data, token } 
        });
      } catch (err) {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: 'Authentication failed' 
        });
      }
    };
    
    dispatch({ type: 'AUTH_LOADING' });
    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      const res = await axios.post('/api/auth/login', { email, password });
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: res.data.user, 
          token: res.data.token 
        } 
      });
    } catch (err: any) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: err.response?.data?.message || 'Login failed' 
      });
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};