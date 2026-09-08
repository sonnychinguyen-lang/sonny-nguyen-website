import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TourProvider, useTour } from './tour.jsx'
import Transition from './components/Transition.jsx'
import Home from './pages/Home.jsx'
import ResumePage from './pages/ResumePage.jsx'
import EholdupPage from './pages/EholdupPage.jsx'
import SurreyDensityPage from './pages/SurreyDensityPage.jsx'
import GreenTimbersPage from './pages/GreenTimbersPage.jsx'
import MossParkPage from './pages/MossParkPage.jsx'
import CaperPage from './pages/CaperPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import PersonalPage from './pages/PersonalPage.jsx'

function Overlay() { const { transitioning } = useTour(); return <Transition active={transitioning} /> }

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TourProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/projects/eholdup" element={<EholdupPage />} />
        <Route path="/projects/surrey-density" element={<SurreyDensityPage />} />
        <Route path="/projects/green-timbers" element={<GreenTimbersPage />} />
        <Route path="/projects/moss-park" element={<MossParkPage />} />
        <Route path="/projects/caper" element={<CaperPage />} />
        <Route path="/projects/dashboard" element={<DashboardPage />} />
        <Route path="/personal" element={<PersonalPage />} />
        <Route path="/projects/personal" element={<PersonalPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Overlay />
      </TourProvider>
    </BrowserRouter>
  )
}
