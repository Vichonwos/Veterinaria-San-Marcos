import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Admin() {
  const session = dataService.getSession();
  const rol = session?.role?.toUpperCase();
  const isAdmin = rol === 'ADMIN';
  const isVendedor = rol === 'VENDEDOR';
  const tieneAcceso = isAdmin || isVendedor;

  const [tabActiva, setTabActiva] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [boletas, setBoletas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Estados para modales / detalle
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [formProducto, setFormProducto] = useState(null);
  const [formUsuario, setFormUsuario] = useState(null);

  const cargarDatos = async () => {
    const [prods, cats, bols] = await Promise.all([
      dataService.getMedicamentos(),
      dataService.getCategorias(),
      dataService.getBoletas()
    ]);
    setProductos(prods);
    setCategorias(cats);
    setBoletas(bols);

    if (isAdmin) {
      const users = await dataService.getUsuarios();
      setUsuarios(users);
    }
  };

  useEffect(() => {
    if (tieneAcceso) {
      cargarDatos();
    }
  }, [tieneAcceso]);

  if (!tieneAcceso) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger shadow-sm d-inline-block p-4" style={{ maxWidth: '500px' }}>
          <h4 className="fw-bold">Acceso Restringido</h4>
          <p className="mb-0">
            Esta sección es exclusiva para personal <strong>Administrador</strong> o <strong>Vendedor</strong>.
          </p>
        </div>
      </div>
    );
  }

  // --- CRUD PRODUCTOS (SOLO ADMIN) ---
  const abrirFormProducto = (prod = null) => {
    if (prod) {
      setFormProducto({
        id: prod.id,
        nombre: prod.nombre,
        descripcion: prod.descripcion || '',
        precio: prod.precio,
        stock: prod.stock,
        oferta: Boolean(prod.oferta),
        imagen: prod.imagen || 'https://via.placeholder.com/400x300',
        categoriaId: prod.categoriaId || (categorias[0]?.id ?? 1)
      });
    } else {
      setFormProducto({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 10,
        oferta: false,
        imagen: 'https://via.placeholder.com/400x300',
        categoriaId: categorias[0]?.id ?? 1
      });
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formProducto.nombre,
      descripcion: formProducto.descripcion,
      precio: Number(formProducto.precio),
      stock: Number(formProducto.stock),
      oferta: Boolean(formProducto.oferta),
      imagen: formProducto.imagen,
      categoria: { id: Number(formProducto.categoriaId) }
    };

    const ok = formProducto.id
      ? await dataService.actualizarProducto(formProducto.id, payload)
      : await dataService.crearProducto(payload);

    if (ok) {
      setFormProducto(null);
      cargarDatos();
    } else {
      alert('No se pudo guardar el producto.');
    }
  };

  const handleEliminarProducto = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      await dataService.eliminarProducto(id);
      cargarDatos();
    }
  };

  // --- CRUD USUARIOS (SOLO ADMIN) ---
  const abrirFormUsuario = (u = null) => {
    if (u) {
      setFormUsuario({ ...u, password: '' });
    } else {
      setFormUsuario({ nombre: '', apellido: '', email: '', password: '', rol: 'CLIENTE' });
    }
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    const ok = formUsuario.id
      ? await dataService.actualizarUsuario(formUsuario.id, formUsuario)
      : await dataService.crearUsuario(formUsuario);

    if (ok) {
      setFormUsuario(null);
      cargarDatos();
    } else {
      alert('Error al guardar el usuario.');
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (window.confirm('¿Eliminar este usuario permanentemente?')) {
      await dataService.eliminarUsuario(id);
      cargarDatos();
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold mb-0">Panel de Gestión — Veterinaria San Marcos</h2>
          <small className="text-muted">Sesión activa como: <strong>{rol}</strong></small>
        </div>
      </div>

      {/* Navegación por pestañas según Rol */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${tabActiva === 'productos' ? 'active fw-bold' : ''}`}
            onClick={() => { setTabActiva('productos'); setDetalleSeleccionado(null); }}
          >
            Productos ({productos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabActiva === 'boletas' ? 'active fw-bold' : ''}`}
            onClick={() => { setTabActiva('boletas'); setDetalleSeleccionado(null); }}
          >
            Órdenes / Boletas ({boletas.length})
          </button>
        </li>
        {/* Pestaña Usuarios: Oculta para VENDEDOR */}
        {isAdmin && (
          <li className="nav-item">
            <button
              className={`nav-link ${tabActiva === 'usuarios' ? 'active fw-bold' : ''}`}
              onClick={() => { setTabActiva('usuarios'); setDetalleSeleccionado(null); }}
            >
              Usuarios y Roles ({usuarios.length})
            </button>
          </li>
        )}
      </ul>

      {/* ========================================================= */}
      {/* TAB 1: PRODUCTOS (ADMIN: CRUD completo | VENDEDOR: Lectura) */}
      {/* ========================================================= */}
      {tabActiva === 'productos' && (
        <div className="card shadow-sm border-0 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Catálogo de Productos</h4>
            {isAdmin && (
              <button className="btn btn-primary btn-sm" onClick={() => abrirFormProducto()}>
                + Nuevo Producto
              </button>
            )}
          </div>

          {formProducto && isAdmin && (
            <form onSubmit={guardarProducto} className="border rounded p-3 mb-4 bg-light">
              <h6 className="fw-bold mb-3">{formProducto.id ? 'Editar Producto' : 'Nuevo Producto'}</h6>
              <div className="row g-2">
                <div className="col-md-4">
                  <input className="form-control" placeholder="Nombre" required value={formProducto.nombre}
                    onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={formProducto.categoriaId}
                    onChange={(e) => setFormProducto({ ...formProducto, categoriaId: e.target.value })}>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <input type="number" className="form-control" placeholder="Precio" required value={formProducto.precio}
                    onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <input type="number" className="form-control" placeholder="Stock" required value={formProducto.stock}
                    onChange={(e) => setFormProducto({ ...formProducto, stock: e.target.value })} />
                </div>
                <div className="col-md-1 d-flex align-items-center">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="chkOferta" checked={formProducto.oferta}
                      onChange={(e) => setFormProducto({ ...formProducto, oferta: e.target.checked })} />
                    <label className="form-check-label small" htmlFor="chkOferta">Oferta</label>
                  </div>
                </div>
                <div className="col-md-8">
                  <input className="form-control" placeholder="Descripción" value={formProducto.descripcion}
                    onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })} />
                </div>
                <div className="col-md-4 d-flex gap-2">
                  <button type="submit" className="btn btn-success w-100">Guardar</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setFormProducto(null)}>Cancelar</button>
                </div>
              </div>
            </form>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle border">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td><code>#{p.id}</code></td>
                    <td>
                      <strong>{p.nombre}</strong>
                      {p.oferta && <span className="badge bg-warning text-dark ms-2">Oferta</span>}
                    </td>
                    <td>{p.categoria}</td>
                    <td>${p.precio?.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${p.stock < 5 ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock} unid.
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setDetalleSeleccionado({ tipo: 'producto', data: p })}
                      >
                        Ver Detalle
                      </button>
                      {isAdmin && (
                        <>
                          <button className="btn btn-sm btn-outline-warning me-2" onClick={() => abrirFormProducto(p)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminarProducto(p.id)}>
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BOLETAS / ÓRDENES (ADMIN y VENDEDOR)               */}
      {/* ========================================================= */}
      {tabActiva === 'boletas' && (
        <div className="card shadow-sm border-0 p-4">
          <h4 className="fw-bold mb-3">Órdenes y Boletas Emitidas</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle border">
              <thead className="table-dark">
                <tr>
                  <th>N° Boleta</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Dirección Entrega</th>
                  <th>Total</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {boletas.map((b) => (
                  <tr key={b.id}>
                    <td><code>#{b.id}</code></td>
                    <td>{new Date(b.fecha).toLocaleString('es-CL')}</td>
                    <td>{b.usuario ? `${b.usuario.nombre} ${b.usuario.apellido || ''}` : 'Cliente'}</td>
                    <td>{b.direccionEntrega}, {b.comunaEntrega}</td>
                    <td><strong>${b.total?.toLocaleString('es-CL')}</strong></td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setDetalleSeleccionado({ tipo: 'boleta', data: b })}
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
                {boletas.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-3">Aún no hay boletas registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: USUARIOS Y ROLES (EXCLUSIVO ADMIN)                 */}
      {/* ========================================================= */}
      {tabActiva === 'usuarios' && isAdmin && (
        <div className="card shadow-sm border-0 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Gestión de Usuarios y Roles</h4>
            <button className="btn btn-primary btn-sm" onClick={() => abrirFormUsuario()}>
              + Nuevo Usuario
            </button>
          </div>

          {formUsuario && (
            <form onSubmit={guardarUsuario} className="border rounded p-3 mb-4 bg-light">
              <h6 className="fw-bold mb-3">{formUsuario.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h6>
              <div className="row g-2">
                <div className="col-md-2">
                  <input className="form-control" placeholder="Nombre" required value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <input className="form-control" placeholder="Apellido" value={formUsuario.apellido || ''}
                    onChange={(e) => setFormUsuario({ ...formUsuario, apellido: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <input type="email" className="form-control" placeholder="Email" required value={formUsuario.email}
                    onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <input type="password" className="form-control"
                    placeholder={formUsuario.id ? 'Nueva clave (opc)' : 'Contraseña'}
                    required={!formUsuario.id}
                    value={formUsuario.password}
                    onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={formUsuario.rol}
                    onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })}>
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="col-md-1 d-flex gap-1">
                  <button type="submit" className="btn btn-success">OK</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setFormUsuario(null)}>X</button>
                </div>
              </div>
            </form>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle border">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Correo Electrónico</th>
                  <th>Rol Asignado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td><code>#{u.id}</code></td>
                    <td><strong>{u.nombre} {u.apellido || ''}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.rol === 'ADMIN' ? 'bg-danger' : u.rol === 'VENDEDOR' ? 'bg-primary' : 'bg-secondary'}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-warning me-2" onClick={() => abrirFormUsuario(u)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminarUsuario(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PANEL DE DETALLE (PARA PRODUCTO O BOLETA)                 */}
      {/* ========================================================= */}
      {detalleSeleccionado && (
        <div className="card shadow-sm border-primary mt-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0">
              {detalleSeleccionado.tipo === 'producto'
                ? `Detalle de Producto #${detalleSeleccionado.data.id}`
                : `Detalle de Boleta #${detalleSeleccionado.data.id}`}
            </h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDetalleSeleccionado(null)}>
              Cerrar
            </button>
          </div>

          {detalleSeleccionado.tipo === 'producto' ? (
            <div>
              <p className="mb-1"><strong>Nombre:</strong> {detalleSeleccionado.data.nombre}</p>
              <p className="mb-1"><strong>Categoría:</strong> {detalleSeleccionado.data.categoria}</p>
              <p className="mb-1"><strong>Descripción:</strong> {detalleSeleccionado.data.descripcion}</p>
              <p className="mb-1"><strong>Precio:</strong> ${detalleSeleccionado.data.precio?.toLocaleString('es-CL')}</p>
              <p className="mb-0"><strong>Stock disponible:</strong> {detalleSeleccionado.data.stock} unidades</p>
            </div>
          ) : (
            <div>
              <p className="mb-2">
                <strong>Cliente:</strong> {detalleSeleccionado.data.usuario?.nombre} ({detalleSeleccionado.data.usuario?.email}) |{' '}
                <strong>Total:</strong> ${detalleSeleccionado.data.total?.toLocaleString('es-CL')}
              </p>
              <ul className="list-group">
                {detalleSeleccionado.data.detalles?.map((d) => (
                  <li key={d.id} className="list-group-item d-flex justify-content-between">
                    <span>{d.producto?.nombre} (x{d.cantidad})</span>
                    <strong>${(d.precioUnitario * d.cantidad).toLocaleString('es-CL')}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}