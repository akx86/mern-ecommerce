import { Navigate, Route, Router, Routes } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PublicRoute from './features/auth/components/PublicRoute';
import RegisterPage from './pages/RegisterPage';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import HomePage from './pages/HomePage';
function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          {/* <Route path="/cart" element={<CartPage />} /> */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<HomePage />} />

      </Routes>
  )
}

export default App
