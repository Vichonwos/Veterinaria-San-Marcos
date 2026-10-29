import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Navbar() {
  const navigate = useNavigate();
  const session = dataService.getSession();
  const isLoggedIn = Boolean(session?.isLogged);

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
          
          {/* Visible para TODO el mundo */}
          <li className="nav-item">
            <Link className="nav-link" to="/citas">Solicitar Cita</Link>
          </li>

          {/* Visible SOLO para Administrador */}
          {isLoggedIn && (
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
              <Link className="btn btn-outline-light btn-sm px-3" to="/login">Iniciar Sesión</Link>
            ) : (
              <button className="btn btn-danger btn-sm px-3" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}