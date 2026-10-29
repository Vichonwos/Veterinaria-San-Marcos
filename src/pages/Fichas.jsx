import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Fichas() {
  const [fichas, setFichas] = useState([]);
  const [form, setForm] = useState({
    mascota: '',
    especie: 'Perro',
    edad: '',
    diagnostico: '',
    tratamiento: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    cargarFichas();
  }, []);

  const cargarFichas = () => {
    setFichas(dataService.getFichas());
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dataService.guardarFicha(form);
    setAlerta('Ficha médica creada correctamente');
    setForm({
      mascota: '',
      especie: 'Perro',
      edad: '',
      diagnostico: '',
      tratamiento: '',
      fecha: new Date().toISOString().split('T')[0]
    });
    cargarFichas();
    setTimeout(() => setAlerta(null), 3000);
  };

  const handleEliminar = (id) => {
    dataService.eliminarFicha(id);
    cargarFichas();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary fw-bold">
        <i className="bi bi-journal-medical me-2"></i>Fichas Médicas Clónicas
      </h2>

      {alerta && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {alerta}
        </div>
      )}

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              Nueva Ficha Médica
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
                    required
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">Especie</label>
                    <select
                      className="form-select"
                      name="especie"
                      value={form.especie}
                      onChange={handleChange}
                    >
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                      <option value="Exótico">Exótico</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Edad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="edad"
                      placeholder="Ej: 2 años"
                      value={form.edad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Diagnóstico</label>
                  <textarea
                    className="form-control"
                    name="diagnostico"
                    rows="2"
                    value={form.diagnostico}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tratamiento</label>
                  <textarea
                    className="form-control"
                    name="tratamiento"
                    rows="2"
                    value={form.tratamiento}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  <i className="bi bi-plus-circle me-1"></i> Registrar Ficha
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Tabla de Fichas */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
              <span>Historial Médico</span>
              <span className="badge bg-primary fs-6">{fichas.length}</span>
            </div>
            <div className="card-body p-0">
              {fichas.length === 0 ? (
                <div className="p-4 text-center text-muted">Sin fichas médicas registradas.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Mascota</th>
                        <th>Diagnóstico</th>
                        <th>Tratamiento</th>
                        <th>Fecha</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fichas.map((ficha) => (
                        <tr key={ficha.id}>
                          <td>
                            <strong className="text-primary d-block">{ficha.mascota}</strong>
                            <small className="text-muted">{ficha.especie} • {ficha.edad}</small>
                          </td>
                          <td>{ficha.diagnostico}</td>
                          <td>{ficha.tratamiento}</td>
                          <td><small>{ficha.fecha}</small></td>
                          <td className="text-center">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleEliminar(ficha.id)}
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