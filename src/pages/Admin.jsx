import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const session = dataService.getSession();
  const isAdmin = session?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      setUsuarios(dataService.getUsuarios());
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger shadow-sm d-inline-block p-4" style={{ maxWidth: '500px' }}>
          <h4 className="fw-bold">Acceso Restringido</h4>
          <p className="mb-0">
            Esta sección es exclusiva para el <strong>Personal Administrador</strong>.
          </p>
        </div>
      </div>
    );
  }

  const handleToggleEstado = (id) => {
    const nuevosUsuarios = dataService.toggleEstadoUsuario(id);
    setUsuarios([...nuevosUsuarios]);
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fw-bold mb-2">Gestión de Usuarios y Roles</h2>
        <p className="text-muted mb-4">
          Desde aquí puedes monitorear y gestionar a los usuarios y trabajadores registrados en el sistema.
        </p>

        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo Electrónico</th>
                <th>RUT</th>
                <th>Rol Asignado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td><code>#{u.id}</code></td>
                  <td><strong>{u.nombre} {u.apellido || ''}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.rut || 'N/A'}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'admin'
                          ? 'bg-danger'
                          : u.role === 'medico'
                          ? 'bg-primary'
                          : u.role === 'recepcionista'
                          ? 'bg-info text-dark'
                          : 'bg-secondary'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.estado === 'Activo' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {u.estado || 'Activo'}
                    </span>
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      <button
                        className={`btn btn-sm ${u.estado === 'Activo' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => handleToggleEstado(u.id)}
                      >
                        {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    )}
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