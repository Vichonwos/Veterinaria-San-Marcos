import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Navbar() {
  const navigate = useNavigate();
  const session = dataService.getSession();
  const isLoggedIn = Boolean(session?.isLogged);
  const isAdmin = session?.role === 'admin';

  const [cartCount, setCartCount] = useState(0);

  const updateCount = () => {
    const carrito = dataService.getCarrito();
    const count = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    return () => window.removeEventListener('cartUpdated', updateCount);
  }, []);

  const handleLogout = () => {
    dataService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
        <span className="me-2" style={{ fontSize: '1.4rem' }}>🐾</span> Veterinaria San Marcos
      </Link>
      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/citas">Solicitar Cita</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tienda">Tienda</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link d-flex align-items-center" to="/carrito">
              🛒 Carrito
              {cartCount > 0 && (
                <span className="badge bg-danger ms-1 rounded-pill">{cartCount}</span>
              )}
            </Link>
          </li>

          {isAdmin && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/fichas">Fichas Clínicas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Panel Admin</Link>
              </li>
            </>
          )}

          <li className="nav-item ms-lg-2">
            {!isLoggedIn ? (
              <div className="d-flex gap-2">
                <Link className="btn btn-outline-light btn-sm px-3" to="/login">Iniciar Sesión</Link>
                <Link className="btn btn-primary btn-sm px-3" to="/registro">Registrarse</Link>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <span className="text-light small">Hola, <strong>{session.user}</strong></span>
                <button className="btn btn-danger btn-sm px-3" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}