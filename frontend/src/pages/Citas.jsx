import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

// Obtiene la fecha y hora local actual en formato YYYY-MM-DDTHH:mm para el input datetime-local
const getFechaHoraLocalActual = () => {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
};

export default function Citas() {
  const session = dataService.getSession();
  const isLoggedIn = Boolean(
    session && (session.isLoggedIn || session.isLogged || session.token || session.role || session.user || session.email)
  );

  const [formData, setFormData] = useState({
    nombreDueno: session?.user || session?.nombre || '',
    emailDueno: session?.email || '',
    nombreMascota: '',
    especie: '',
    servicio: '',
    fechaCita: '',
    motivo: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Bloqueo si no hay sesión iniciada
  if (!isLoggedIn) {
    return (
      <div className="container my-5 text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '550px' }}>
          <h3 className="fw-bold mb-3">Inicio de Sesión Requerido</h3>
          <p className="text-muted mb-4">
            Para poder agendar una cita médica debes contar con una sesión activa.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary fw-bold px-4">Iniciar Sesión</Link>
            <Link to="/registro" className="btn btn-outline-primary fw-bold px-4">Crear Cuenta</Link>
          </div>
        </div>
      </div>
    );
  }

  const minFechaHora = getFechaHoraLocalActual();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const ahoraLocal = getFechaHoraLocalActual();
    if (!formData.fechaCita || new Date(formData.fechaCita) < new Date(ahoraLocal)) {
      setError('No puedes agendar una cita en una fecha u hora anterior a la actual.');
      return;
    }

    const citasActuales = JSON.parse(localStorage.getItem('citasMedicas')) || [];
    const nuevaCita = { ...formData, id: Date.now() };
    localStorage.setItem('citasMedicas', JSON.stringify([...citasActuales, nuevaCita]));

    setMensaje('¡Solicitud de cita enviada con éxito!');
    setFormData({
      nombreDueno: session?.user || session?.nombre || '',
      emailDueno: session?.email || '',
      nombreMascota: '',
      especie: '',
      servicio: '',
      fechaCita: '',
      motivo: ''
    });

    setTimeout(() => setMensaje(''), 4000);
  };

  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fw-bold mb-2 text-center">Solicitud de Cita Médica</h2>
        <p className="text-center text-muted mb-4">
          Bienvenido <strong>{session?.user || session?.nombre || session?.email}</strong>. Completa los datos para agendar tu atención.
        </p>

        {mensaje && (
          <div className="alert alert-success text-center fw-bold" role="alert">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center fw-bold" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombreDueno" className="form-label fw-semibold">Nombre del Dueño:</label>
              <input
                type="text"
                className="form-control"
                id="nombreDueno"
                value={formData.nombreDueno}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="emailDueno" className="form-label fw-semibold">Correo Electrónico:</label>
              <input
                type="email"
                className="form-control"
                id="emailDueno"
                value={formData.emailDueno}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="nombreMascota" className="form-label fw-semibold">Nombre de la Mascota:</label>
              <input
                type="text"
                className="form-control"
                id="nombreMascota"
                placeholder="Ej: Toby"
                value={formData.nombreMascota}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="especie" className="form-label fw-semibold">Especie:</label>
              <select
                className="form-select"
                id="especie"
                value={formData.especie}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione especie...</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Conejo">Conejo</option>
                <option value="Ave">Ave</option>
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="servicio" className="form-label fw-semibold">Servicio Solicitado:</label>
              <select
                className="form-select"
                id="servicio"
                value={formData.servicio}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un servicio...</option>
                <option value="Consulta general ($15.000)">Consulta general - $15.000</option>
                <option value="Consulta urgencia ($25.000)">Consulta urgencia - $25.000</option>
                <option value="Vacuna antirrábica ($12.000)">Vacuna antirrábica - $12.000</option>
                <option value="Vacuna sextuple ($18.000)">Vacuna sextuple - $18.000</option>
                <option value="Esterilización ($60.000)">Esterilización - $60.000</option>
                <option value="Desparasitación ($8.000)">Desparasitación - $8.000</option>
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="fechaCita" className="form-label fw-semibold">Fecha y Hora Preferida:</label>
              <input
                type="datetime-local"
                className="form-control"
                id="fechaCita"
                min={minFechaHora}
                value={formData.fechaCita}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label htmlFor="motivo" className="form-label fw-semibold">Observaciones / Motivo:</label>
              <textarea
                className="form-control"
                id="motivo"
                rows="3"
                placeholder="Síntomas u observaciones adicionales..."
                value={formData.motivo}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                Enviar Solicitud de Cita
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}