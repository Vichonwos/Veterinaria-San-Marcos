import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      navigate('/fichas');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '420px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="text-center fw-bold mb-2">Acceso al Sistema</h2>
        <p className="text-center text-muted small mb-4">
          Ingresa tus credenciales seguras protegidas con token.
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
              placeholder="admin@sanmarcos.cl"
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
          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}