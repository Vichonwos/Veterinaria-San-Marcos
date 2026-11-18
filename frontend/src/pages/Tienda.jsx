import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Tienda() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      const data = await dataService.getMedicamentos();
      setMedicamentos(data);
      setCargando(false);
    };
    cargarProductos();
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

  const filtrados = medicamentos.filter((m) => {
    const termino = busqueda.toLowerCase();
    return (
      (m.nombre || '').toLowerCase().includes(termino) ||
      (m.categoria || '').toLowerCase().includes(termino) ||
      (m.descripcion || '').toLowerCase().includes(termino)
    );
  });

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">🛒 Tienda Veterinaria</h2>
            <p className="text-muted mb-0">Explora nuestro catálogo de alimentos, farmacia y accesorios.</p>
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
              placeholder="Buscar por producto, categoría o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-5 text-muted">Cargando productos desde el servidor...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle border">
              <thead className="table-dark">
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Stock</th>
                  <th>Precio (CLP)</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((m) => (
                  <tr key={m.codigo}>
                    <td><code>#{m.codigo}</code></td>
                    <td>
                      <strong>{m.nombre}</strong>
                      {m.oferta && <span className="badge bg-warning text-dark ms-2">Oferta</span>}
                    </td>
                    <td>{m.categoria}</td>
                    <td>
                      <small className="text-muted">{m.descripcion || 'Sin descripción'}</small>
                    </td>
                    <td>
                      <span className={`badge ${m.stock < 5 ? 'bg-danger' : 'bg-success'}`}>
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
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No se encontraron productos que coincidan con tu búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}