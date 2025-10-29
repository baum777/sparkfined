import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import UpdateBanner from './components/UpdateBanner'
import AnalyzePage from './pages/AnalyzePage'
import JournalPage from './pages/JournalPage'
import ReplayPage from './pages/ReplayPage'
import './styles/App.css'

function App() {
  return (
    <Router>
      <UpdateBanner />
      <Layout>
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/replay" element={<ReplayPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
