import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Tienda() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    setMedicamentos(dataService.getMedicamentos());
  }, []);

  const handleAgregar = (producto) => {
    const res = dataService.agregarAlCarrito(producto);
    if (res.success) {
      setMensaje(`¡${producto.nombre} agregado al carrito!`);
      setTimeout(() => setMensaje(''), 3000);
    } else {
      alert(res.message);
    }
  };

  const filtrados = medicamentos.filter(
    (m) =>
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.especie.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">🛒 Tienda de Medicamentos</h2>
            <p className="text-muted mb-0">Explora nuestro catálogo e insumos médicos veterinarios.</p>
          </div>
          <Link to="/carrito" className="btn btn-outline-primary fw-bold">
            Ver Carrito 🛒
          </Link>
        </div>

        {mensaje && <div className="alert alert-success fw-bold text-center mb-4">{mensaje}</div>}

        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por producto, categoría o especie..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Presentación</th>
                <th>Especie</th>
                <th>Stock</th>
                <th>Precio (CLP)</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((m) => (
                <tr key={m.codigo}>
                  <td><code>{m.codigo}</code></td>
                  <td>
                    <strong>{m.nombre}</strong>
                    <br />
                    <small className="text-muted">{m.activo}</small>
                  </td>
                  <td>{m.categoria}</td>
                  <td>{m.presentacion}</td>
                  <td>{m.especie}</td>
                  <td>
                    <span className={`badge ${m.stock > 15 ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {m.stock} unid.
                    </span>
                  </td>
                  <td><strong>${m.precio.toLocaleString('es-CL')}</strong></td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary fw-bold"
                      onClick={() => handleAgregar(m)}
                      disabled={m.stock <= 0}
                    >
                      {m.stock > 0 ? '+ Carrito' : 'Agotado'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}