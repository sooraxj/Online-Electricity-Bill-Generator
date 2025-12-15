import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Index from './components/Index';
import Home from './components/Home';
import Admin from './components/Admin';
import Staff from './components/Staff';
import About from './components/About';
import Contact from './components/Contact';
import Customers from './components/Customers';
import Dashboard from './components/Dashboard';
import Tariffs from './components/Tarrifs';
import Plans from './components/Plans';
import Bills from './components/Bills';
import Profile from './components/Profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tariffs" element={<Tariffs />} />
        <Route path="/Plan" element={<Plans/>} />
        <Route path="/bills" element={<Bills/>} />
        <Route path="/profile" element={<Profile/>} />        
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/staff" element={<Staff />} />

      </Routes>
    </Router>
  );
}

export default App;