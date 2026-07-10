import { Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage'
import Dashboard from './pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
