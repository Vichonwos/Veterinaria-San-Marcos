import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de usuario admin
    if (credentials.email === 'admin@sanmarcos.cl' && credentials.password === 'admin123') {
      localStorage.setItem('vet_auth', 'true');
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="mb-0 fw-bold">Acceso Administrativo</h4>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  Credenciales incorrectas. Usa: <strong>admin@sanmarcos.cl / admin123</strong>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="admin@sanmarcos.cl"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}