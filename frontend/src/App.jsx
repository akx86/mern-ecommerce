
import './App.css'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast';
import Shop from './pages/Shop'

function App() { 
  return (
  
   <>
   <Toaster 
        position="top-center" 
        reverseOrder={false} 
      />
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/shop" element={<Shop />} />
   </Routes>
   </>
  )
}

export default App
