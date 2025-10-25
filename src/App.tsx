import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import OfflineIndicator from './components/OfflineIndicator'
import AnalyzePage from './pages/AnalyzePage'
import JournalPage from './pages/JournalPage'
import ReplayPage from './pages/ReplayPage'
import './styles/App.css'

function App() {
  return (
    <Router>
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
    </Router>
  )
}

export default App
