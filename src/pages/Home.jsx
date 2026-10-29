import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mt-4">
      {/* Hero Section */}
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
        <div className="container-fluid py-3">
          <h1 className="display-5 fw-bold text-primary">
            <i className="bi bi-heart-pulse-fill me-3"></i>Veterinaria San Marcos
          </h1>
          <p className="col-md-8 fs-5 text-muted">
            Atención profesional e integral para tus mascotas. Gestiona consultas médicas y revisa historiales en línea.
          </p>
          <div className="d-flex gap-3 mt-4">
            <Link to="/citas" className="btn btn-primary btn-lg fw-bold">
              <i className="bi bi-calendar-plus me-2"></i>Agendar Cita
            </Link>
            <Link to="/fichas" className="btn btn-outline-secondary btn-lg fw-bold">
              <i className="bi bi-journal-medical me-2"></i>Ver Fichas
            </Link>
          </div>
        </div>
      </div>

      {/* Tarjetas de servicios */}
      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <i className="bi bi-calendar-check text-primary fs-1 mb-3"></i>
              <h5 className="card-title fw-bold">Reserva Simple</h5>
              <p className="card-text text-muted">Agenda horas médicas de forma rápida y persistente.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <i className="bi bi-file-earmark-medical text-primary fs-1 mb-3"></i>
              <h5 className="card-title fw-bold">Fichas Clínicas</h5>
              <p className="card-text text-muted">Historial médico detallado disponible para consulta constante.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <i className="bi bi-shield-check text-primary fs-1 mb-3"></i>
              <h5 className="card-title fw-bold">Panel Control</h5>
              <p className="card-text text-muted">Acceso administrativo para monitoreo de registros.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}