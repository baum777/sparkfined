import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AnalyzePage from './pages/AnalyzePage'
import JournalPage from './pages/JournalPage'
import ReplayPage from './pages/ReplayPage'
import SettingsPage from './pages/SettingsPage'
import { InstallCTA } from './components/InstallCTA'
import { IOSInstallHint } from './components/IOSInstallHint'
import { Titlebar } from './components/Titlebar'
import { useSettings } from './hooks/useSettings'
import './styles/App.css'

function App() {
  // M-PWA-5: Settings integration
  const { settings } = useSettings()

  return (
    <Router>
      {/* M-PWA-4: Desktop Titlebar (Window Controls Overlay) */}
      <Titlebar enabled={settings.customTitlebar} />
      
      <Layout>
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/replay" element={<ReplayPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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
