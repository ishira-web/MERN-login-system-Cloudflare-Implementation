import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, loading, error } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Authentication Error</h2>
          <div style={styles.errorBox}>
            <p>{error}</p>
            <p>Please ensure Cloudflare Access is properly configured.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Dashboard</h2>
        <div style={styles.userInfo}>
          <p style={styles.label}>Welcome back!</p>
          <div style={styles.infoBox}>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  userInfo: {
    marginBottom: '2rem',
  },
  label: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#555',
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    borderLeft: '4px solid #007bff',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '4px',
    borderLeft: '4px solid #dc3545',
  },
};

export default Dashboard;
