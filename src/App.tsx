import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FluxfeedLanding from './components/FluxfeedLanding'
import FluxfeedSignals from './pages/FluxfeedSignals'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FluxfeedLanding />} />
        <Route path="/app" element={<FluxfeedSignals />} />
      </Routes>
    </BrowserRouter>
  )
}
