import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const res = await dataService.login(email, password);
    setCargando(false);

    if (res.success) {
      const rol = res.session?.role?.toUpperCase();
      if (rol === 'ADMIN' || rol === 'VENDEDOR') {
        navigate('/admin');
      } else {
        navigate('/tienda');
      }
      window.location.reload(); // Refresca el Navbar con la nueva sesión
    } else {
      setError(res.message || 'Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '480px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fw-bold text-center mb-2">Iniciar Sesión</h2>
        <p className="text-muted text-center small mb-4">
          Veterinaria San Marcos — Acceso a Tienda y Gestión
        </p>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@veterinaria.cl"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            ¿No tienes cuenta? <Link to="/registro" className="fw-bold">Regístrate aquí</Link>
          </small>
        </div>

        <hr className="my-3" />
        <div className="small text-muted">
          <strong>Cuentas de prueba (MySQL):</strong>
          <ul className="mb-0 mt-1 ps-3">
            <li><code>admin@veterinaria.cl</code> / <code>admin123</code></li>
            <li><code>vendedor@veterinaria.cl</code> / <code>vendedor123</code></li>
            <li><code>cliente@veterinaria.cl</code> / <code>cliente123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}