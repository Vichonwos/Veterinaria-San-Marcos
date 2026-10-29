import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-heart-pulse-fill fs-3"></i>
          <span className="fw-bold">Veterinaria San Marcos</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/citas">Agendar Cita</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fichas">Fichas Médicas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Acceso Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}