import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import FluxfeedLanding from './components/FluxfeedLanding'
import FluxfeedSignals from './pages/FluxfeedSignals'
import About from './pages/About'
import Changelog from './pages/Changelog'
import Pricing from './pages/Pricing'
import Token from './pages/Token'
import GettingStarted from './pages/docs/GettingStarted'
import Terms from './pages/docs/Terms'
import Privacy from './pages/docs/Privacy'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login?redirect=/app" replace />
  }

  return <>{children}</>
}

export default function App() {
  // Detect if we're on app subdomain
  const isAppSubdomain = typeof window !== 'undefined' && window.location.hostname === 'app.fluxfeed.news'
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* On app subdomain, redirect root to /app; otherwise show landing */}
          <Route 
            path="/" 
            element={isAppSubdomain ? <Navigate to="/app" replace /> : <FluxfeedLanding />} 
          />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <FluxfeedSignals />
              </ProtectedRoute>
            }
          />
          {/* Redirect marketing pages to /app on app subdomain */}
          <Route 
            path="/about" 
            element={isAppSubdomain ? <Navigate to="/app" replace /> : <About />} 
          />
          <Route 
            path="/changelog" 
            element={isAppSubdomain ? <Navigate to="/app" replace /> : <Changelog />} 
          />
          <Route 
            path="/pricing" 
            element={isAppSubdomain ? <Navigate to="/app" replace /> : <Pricing />} 
          />
          <Route 
            path="/token" 
            element={isAppSubdomain ? <Navigate to="/app" replace /> : <Token />} 
          />
          <Route 
            path="/docs/getting-started" 
            element={isAppSubdomain ? <Navigate to="/app" replace /> : <GettingStarted />} 
          />
          <Route 
            path="/docs/terms" 
            element={isAppSubdomain ? <Navigate to="/app" replace /> : <Terms />} 
          />
          <Route 
            path="/docs/privacy" 
            element={isAppSubdomain ? <Navigate to="/app" replace /> : <Privacy />} 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
