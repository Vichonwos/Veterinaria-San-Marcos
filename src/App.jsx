import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Citas from './pages/Citas';
import Fichas from './pages/Fichas';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/fichas" element={<Fichas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}