import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Fichas() {
  const [fichas, setFichas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const session = dataService.getSession();
  const isAdmin = session?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      setFichas(dataService.getFichas());
      setCitas(dataService.getCitas());
    }
  }, [isAdmin]);

  // Si no ha iniciado sesión como Admin, se bloquea la vista
  if (!isAdmin) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger shadow-sm d-inline-block p-4" style={{ maxWidth: '500px' }}>
          <h4 className="fw-bold">Acceso Restringido</h4>
          <p className="mb-0">
            Restringido exclusivamente para personal autorizado. Debes iniciar sesión como <strong>Administrador</strong>.
          </p>
        </div>
      </div>
    );
  }

  // Filtrado simultáneo de Fichas y Citas por nombre de mascota
  const fichasFiltradas = fichas.filter((f) =>
    (f.mascota || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const citasFiltradas = citas.filter((c) =>
    (c.nombreMascota || c.mascota || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h2 className="fw-bold mb-1">Consulta de Fichas e Historial Clínico</h2>
        <p className="text-muted mb-4">Expedientes médicos registrados y citas solicitadas en el sistema.</p>

        {/* Buscador general por nombre de mascota */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre de mascota..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn btn-primary" type="button">Buscar</button>
            </div>
          </div>
        </div>

        {/* Seccion 1: Fichas Clínicas */}
        <h4 className="fw-bold text-primary mb-3">Historial Clínico</h4>
        <div className="table-responsive mb-5">
          <table className="table table-hover align-middle border">
            <thead className="table-dark">
              <tr>
                <th>Mascota</th>
                <th>Especie / Raza</th>
                <th>Dueño</th>
                <th>Último Diagnóstico</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {fichasFiltradas.length > 0 ? (
                fichasFiltradas.map((f) => (
                  <tr key={f.id}>
                    <td><strong>{f.mascota}</strong></td>
                    <td>{f.especie}</td>
                    <td>{f.dueno || f.propietario}</td>
                    <td>{f.diagnostico}</td>
                    <td><span className="badge bg-success">{f.estado || 'Completado'}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No se encontraron fichas clínicas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Seccion 2: Citas Programadas Solicitadas */}
        <h4 className="fw-bold text-primary mb-3">Citas Programadas</h4>
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-dark">
              <tr>
                <th>Mascota</th>
                <th>Dueño / Contacto</th>
                <th>Servicio</th>
                <th>Fecha y Hora</th>
                <th>Motivo / Observación</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.length > 0 ? (
                citasFiltradas.map((c, i) => (
                  <tr key={c.id || i}>
                    <td><strong>{c.nombreMascota || c.mascota}</strong></td>
                    <td>
                      <div>{c.nombreDueno || c.propietario}</div>
                      <small className="text-muted">{c.emailDueno}</small>
                    </td>
                    <td>{c.servicio}</td>
                    <td>{c.fechaCita || c.fecha}</td>
                    <td>{c.motivo || 'Sin observaciones'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No hay citas programadas registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}