import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = dataService.login(email, password);
    if (res.success) {
      if (res.session.role === 'admin') {
        navigate('/fichas');
      } else {
        navigate('/citas');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '420px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="text-center fw-bold mb-2">Acceso al Sistema</h2>
        <p className="text-center text-muted small mb-4">
          Ingresa tus credenciales de cliente o administrador.
        </p>

        {error && (
          <div className="alert alert-danger text-center p-2 mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo Electrónico:</label>
            <input
              type="email"
              className="form-control"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold mb-3">
            Ingresar
          </button>
          <div className="text-center small">
            ¿No tienes cuenta? <Link to="/registro">Regístrate como cliente</Link>
          </div>
        </form>
      </div>
    </div>
  );
}