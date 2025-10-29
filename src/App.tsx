import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import OfflineIndicator from './components/OfflineIndicator'
import { InstallCTA } from './components/InstallCTA'
import AnalyzePage from './pages/AnalyzePage'
import JournalPage from './pages/JournalPage'
import ReplayPage from './pages/ReplayPage'
import './styles/App.css'

function App() {
  return (
    <Router>
      {/* Blade Runner × TradingView × Notion AppShell */}
      <div className="min-h-screen bg-bg flex flex-col relative">
        {/* Subtle gradient overlay for depth */}
        <div className="fixed inset-0 bg-surface-gradient opacity-40 pointer-events-none" />
        
        {/* App Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <OfflineIndicator />
          <InstallCTA variant="floating" />
          
          {/* Main content area with max-width constraint */}
          <main className="flex-1 pb-20 pt-4">
            <div className="container mx-auto px-4 max-w-container">
              <Routes>
                <Route path="/" element={<AnalyzePage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/replay" element={<ReplayPage />} />
              </Routes>
            </div>
          </main>
          
          <BottomNav />
        </div>
      </div>
    </Router>
  )
}

export default App
