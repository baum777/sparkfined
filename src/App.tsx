import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AnalyzePage from './pages/AnalyzePage'
import JournalPage from './pages/JournalPage'
import ReplayPage from './pages/ReplayPage'
import { InstallCTA } from './components/InstallCTA'
import { IOSInstallHint } from './components/IOSInstallHint'
import { Titlebar } from './components/Titlebar'
import './styles/App.css'

function App() {
  return (
    <Router>
      {/* M-PWA-4: Desktop Titlebar (Window Controls Overlay) */}
      <Titlebar enabled={true} />
      
      <Layout>
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/replay" element={<ReplayPage />} />
        </Routes>
        
        {/* M-PWA-3: Install CTA (Desktop/Android) */}
        <InstallCTA />
        
        {/* M-PWA-6: iOS Install Hint */}
        <IOSInstallHint />
      </Layout>
    </Router>
  )
}

export default App
