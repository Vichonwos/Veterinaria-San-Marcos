import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const session = dataService.getSession();
  const navigate = useNavigate();

  useEffect(() => {
    setCarrito(dataService.getCarrito());
  }, []);

  const handleCantidad = (codigo, delta) => {
    const item = carrito.find((i) => i.codigo === codigo);
    if (!item) return;
    const nuevaCant = item.cantidad + delta;
    const actualizado = dataService.actualizarCantidadCarrito(codigo, nuevaCant);
    setCarrito([...actualizado]);
  };

  const handleEliminar = (codigo) => {
    const actualizado = dataService.eliminarDelCarrito(codigo);
    setCarrito([...actualizado]);
  };

  const handleVaciar = () => {
    dataService.vaciarCarrito();
    setCarrito([]);
  };

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleFinalizar = () => {
    if (!session?.isLogged) {
      alert('Debes iniciar sesión o registrarte como cliente para finalizar la compra.');
      navigate('/login');
      return;
    }

    const res = dataService.finalizarCompra();
    if (res.success) {
      setMensaje('¡Compra realizada con éxito! Los productos han sido procesados.');
      setCarrito([]);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '850px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fw-bold mb-3">🛒 Mi Carrito de Compras</h2>

        {mensaje && (
          <div className="alert alert-success text-center fw-bold mb-4">{mensaje}</div>
        )}

        {carrito.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5 mb-4">Tu carrito está vacío.</p>
            <Link to="/tienda" className="btn btn-primary fw-bold">
              Ir a la Tienda de Medicamentos
            </Link>
          </div>
        ) : (
          <>
            <div className="table-responsive mb-4">
              <table className="table align-middle border">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th className="text-center" style={{ width: '140px' }}>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item) => (
                    <tr key={item.codigo}>
                      <td>
                        <strong>{item.nombre}</strong>
                        <br />
                        <small className="text-muted">{item.presentacion}</small>
                      </td>
                      <td>${item.precio.toLocaleString('es-CL')}</td>
                      <td>
                        <div className="input-group input-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleCantidad(item.codigo, -1)}
                          >
                            -
                          </button>
                          <span className="form-control text-center fw-bold">{item.cantidad}</span>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleCantidad(item.codigo, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td><strong>${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong></td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleEliminar(item.codigo)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              <button className="btn btn-outline-secondary btn-sm" onClick={handleVaciar}>
                Vaciar Carrito
              </button>
              <div className="text-end">
                <h4 className="fw-bold mb-3">
                  Total: <span className="text-primary">${total.toLocaleString('es-CL')}</span>
                </h4>
                {!session?.isLogged ? (
                  <div className="text-end">
                    <p className="text-muted small mb-2">Inicia sesión para pagar</p>
                    <Link to="/login" className="btn btn-primary fw-bold px-4">
                      Iniciar Sesión para Pagar
                    </Link>
                  </div>
                ) : (
                  <button className="btn btn-success btn-lg fw-bold px-4" onClick={handleFinalizar}>
                    Confirmar y Pagar
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}