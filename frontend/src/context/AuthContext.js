import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user from backend (authenticated via Cloudflare Access)
  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/auth/me');
      setUser(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setError(error.response?.data?.message || 'Authentication failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch user on mount
    // Cloudflare Access handles authentication at the edge
    fetchUser();
  }, []);

  const logout = () => {
    // Redirect to Cloudflare Access logout endpoint
    window.location.href = '/cdn-cgi/access/logout';
  };

  const refreshUser = () => {
    fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
