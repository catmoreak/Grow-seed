import { useState, useEffect } from 'react';
import './App.css';
function App() {
    const [serverStatus, setServerStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const checkServerHealth = async () => {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                setServerStatus(data);
                setError(null);
            }
            catch (err) {
                setError('Failed to connect to backend server');
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        checkServerHealth();
    }, []);
    return (<div className="admin-container">
      <header className="admin-header">
        <h1>🌱 Admin Dashboard - Grow Seed</h1>
        <p>Admin Panel & Backend Control Center</p>
      </header>

      <main className="admin-main">
        <section className="status-card">
          <h2>Backend Server Status</h2>
          {loading && <p className="loading">Checking server health...</p>}
          {error && <p className="error">{error}</p>}
          {serverStatus && (<div className="status-info">
              <p>
                <strong>Status:</strong> <span className="status-ok">{serverStatus.status}</span>
              </p>
              <p>
                <strong>Time:</strong> {new Date(serverStatus.timestamp).toLocaleString()}
              </p>
            </div>)}
        </section>

        <section className="features-card">
          <h2>Admin Features</h2>
          <ul>
            <li>✓ Monitor main website (Client) API calls</li>
            <li>✓ Admin panel with backend integration</li>
            <li>✓ Proxy API requests to main website</li>
            <li>✓ Full-stack admin dashboard</li>
          </ul>
        </section>

        <section className="info-card">
          <h2>Architecture</h2>
          <div className="architecture">
            <div className="component">
              <strong>Admin Frontend</strong>
              <p>React Dashboard (5173 → 3000)</p>
            </div>
            <div className="arrow">→</div>
            <div className="component">
              <strong>Backend API</strong>
              <p>Express Server (3000)</p>
            </div>
            <div className="arrow">→</div>
            <div className="component">
              <strong>Main Website</strong>
              <p>Client APIs</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="admin-footer">
        <p>Admin Dashboard • Full-Stack Monorepo</p>
      </footer>
    </div>);
}
export default App;
