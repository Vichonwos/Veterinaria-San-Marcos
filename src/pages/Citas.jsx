import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [form, setForm] = useState({
    mascota: '',
    propietario: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = () => {
    const datos = dataService.getCitas();
    setCitas(datos);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dataService.guardarCita(form);
    setAlerta({ tipo: 'success', texto: '¡Cita registrada con éxito!' });
    setForm({ mascota: '', propietario: '', fecha: '', hora: '', motivo: '' });
    cargarCitas();

    setTimeout(() => setAlerta(null), 3000);
  };

  const handleEliminar = (id) => {
    dataService.eliminarCita(id);
    cargarCitas();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary fw-bold">
        <i className="bi bi-calendar-plus me-2"></i>Gestión de Citas Médicas
      </h2>

      {alerta && (
        <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
          {alerta.texto}
        </div>
      )}

      <div className="row g-4">
        {/* Formulario de registro */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              Agendar Nueva Cita
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre Mascota</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mascota"
                    value={form.mascota}
                    onChange={handleChange}
                    placeholder="Ej: Firulais"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre Propietario</label>
                  <input
                    type="text"
                    className="form-control"
                    name="propietario"
                    value={form.propietario}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label fw-semibold">Hora</label>
                    <input
                      type="time"
                      className="form-control"
                      name="hora"
                      value={form.hora}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Motivo Consulta</label>
                  <textarea
                    className="form-control"
                    name="motivo"
                    rows="3"
                    value={form.motivo}
                    onChange={handleChange}
                    placeholder="Ej: Vacunación o control"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  <i className="bi bi-check-circle me-1"></i> Guardar Cita
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Tabla de registros guardados */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
              <span>Citas Programadas</span>
              <span className="badge bg-primary fs-6">{citas.length}</span>
            </div>
            <div className="card-body p-0">
              {citas.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  No hay citas registradas en el sistema.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Mascota</th>
                        <th>Dueño</th>
                        <th>Fecha / Hora</th>
                        <th>Motivo</th>
                        <th className="text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citas.map((cita) => (
                        <tr key={cita.id}>
                          <td className="fw-bold text-primary">{cita.mascota}</td>
                          <td>{cita.propietario}</td>
                          <td>
                            <small className="d-block fw-semibold">{cita.fecha}</small>
                            <small className="text-muted">{cita.hora}</small>
                          </td>
                          <td>{cita.motivo}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleEliminar(cita.id)}
                              title="Eliminar cita"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}