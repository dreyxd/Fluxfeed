import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FluxfeedLanding from './components/FluxfeedLanding'
import FluxfeedSignals from './pages/FluxfeedSignals'
import About from './pages/About'
import Changelog from './pages/Changelog'
import Pricing from './pages/Pricing'
import GettingStarted from './pages/docs/GettingStarted'
import Terms from './pages/docs/Terms'
import Privacy from './pages/docs/Privacy'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FluxfeedLanding />} />
        <Route path="/app" element={<FluxfeedSignals />} />
        <Route path="/about" element={<About />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs/getting-started" element={<GettingStarted />} />
        <Route path="/docs/terms" element={<Terms />} />
        <Route path="/docs/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  )
}
