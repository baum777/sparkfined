import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
<<<<<<< HEAD
<<<<<<< HEAD
import Layout from './components/layout/Layout'
=======
import Header from './components/Header'
import BottomNav from './components/BottomNav'
<<<<<<< HEAD
>>>>>>> origin/pr/2
=======
import OfflineIndicator from './components/OfflineIndicator'
>>>>>>> origin/pr/5
=======
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import OfflineIndicator from './components/OfflineIndicator'
>>>>>>> origin/pr/8
import AnalyzePage from './pages/AnalyzePage'
import JournalPage from './pages/JournalPage'
import ReplayPage from './pages/ReplayPage'
import './styles/App.css'

function App() {
  return (
    <Router>
<<<<<<< HEAD
<<<<<<< HEAD
      <Layout>
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/replay" element={<ReplayPage />} />
        </Routes>
      </Layout>
=======
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Header />
        <OfflineIndicator />
        <main className="flex-1 pb-20">
          <Routes>
            <Route path="/" element={<AnalyzePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/replay" element={<ReplayPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
>>>>>>> origin/pr/2
=======
      {/* Blade Runner × TradingView × Notion AppShell */}
      <div className="min-h-screen bg-bg flex flex-col relative">
        {/* Subtle gradient overlay for depth */}
        <div className="fixed inset-0 bg-surface-gradient opacity-40 pointer-events-none" />
        
        {/* App Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <OfflineIndicator />
          
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
>>>>>>> origin/pr/8
    </Router>
  )
}

export default App
