import { useState, useEffect } from 'react'
import './App.css'

interface ServerStatus {
  status: string
  timestamp: string
}

function App() {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Login states
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    // Only check health if logged in
    if (!isLoggedIn) return;

    const checkServerHealth = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setServerStatus(data)
        setError(null)
      } catch (err) {
        setError('Failed to connect to backend server')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkServerHealth()
  }, [isLoggedIn])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple hardcoded login for now
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid username or password (use admin/admin)')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-container login-page">
        <div className="login-card">
          <h2>Grow Seed Admin</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter admin"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter admin"
              />
            </div>
            {loginError && <p className="error">{loginError}</p>}
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <div>
            <h1>🌱 Admin Dashboard - Grow Seed</h1>
            <p>Admin Panel & Backend Control Center</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="admin-main">
        <section className="status-card">
          <h2>Backend Server Status</h2>
          {loading && <p className="loading">Checking server health...</p>}
          {error && <p className="error">{error}</p>}
          {serverStatus && (
            <div className="status-info">
              <p>
                <strong>Status:</strong> <span className="status-ok">{serverStatus.status}</span>
              </p>
              <p>
                <strong>Time:</strong> {new Date(serverStatus.timestamp).toLocaleString()}
              </p>
            </div>
          )}
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
    </div>
  )
}

export default App
