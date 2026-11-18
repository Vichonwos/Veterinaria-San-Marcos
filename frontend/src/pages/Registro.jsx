import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    edad: '',
    genero: '',
    rut: '',
    direccion: '',
    comuna: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de RUT: sin puntos y con guion (Ej: 12345678-9 o 12345678-K)
    const rutRegex = /^\d{7,8}-[0-9kK]$/;
    if (!rutRegex.test(formData.rut.trim())) {
      setError('El RUT debe ingresarse sin puntos y con guion (Ej: 12345678-9).');
      return;
    }

    if (parseInt(formData.edad, 10) < 18) {
      setError('Debes ser mayor de 18 años para crear una cuenta.');
      return;
    }

    setCargando(true);
    const res = await dataService.register({
      ...formData,
      rut: formData.rut.trim().toUpperCase()
    });
    setCargando(false);

    if (res.success) {
      navigate('/citas');
      window.location.reload();
    } else {
      setError(res.message || 'No se pudo crear la cuenta.');
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="text-center fw-bold mb-2">Crear Cuenta Cliente</h2>
        <p className="text-center text-muted small mb-4">
          Ingresa tus datos personales para agendar citas y comprar productos veterinarios.
        </p>

        {error && (
          <div className="alert alert-danger text-center p-2 mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Nombre:</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                placeholder="Ej: Juan"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Apellido:</label>
              <input
                type="text"
                className="form-control"
                name="apellido"
                placeholder="Ej: Pérez"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Correo Electrónico:</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">RUT (Sin puntos y con guion):</label>
              <input
                type="text"
                className="form-control"
                name="rut"
                placeholder="12345678-9"
                value={formData.rut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Edad:</label>
              <input
                type="number"
                className="form-control"
                name="edad"
                placeholder="18"
                min="18"
                max="120"
                value={formData.edad}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Género:</label>
              <select
                className="form-select"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="col-md-7">
              <label className="form-label fw-semibold">Dirección (Opcional):</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                placeholder="Ej: Av. San Pablo 4520"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-5">
              <label className="form-label fw-semibold">Comuna (Opcional):</label>
              <input
                type="text"
                className="form-control"
                name="comuna"
                placeholder="Ej: Quinta Normal"
                value={formData.comuna}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Contraseña:</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold py-2"
                disabled={cargando}
              >
                {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </div>
          </div>

          <div className="text-center small mt-3">
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
}