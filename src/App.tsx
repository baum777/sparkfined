import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import AnalyzePage from './pages/AnalyzePage'
import JournalPage from './pages/JournalPage'
import ReplayPage from './pages/ReplayPage'
import './styles/App.css'

function App() {
  return (
    <Router>
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
    </Router>
  )
}

export default App
