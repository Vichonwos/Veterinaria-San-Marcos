import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

export default function Admin() {
  const navigate = useNavigate();
  const citasCount = dataService.getCitas().length;
  const fichasCount = dataService.getFichas().length;

  const handleLogout = () => {
    localStorage.removeItem('vet_auth');
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold mb-0">
          <i className="bi bi-speedometer2 me-2"></i>Panel de Control
        </h2>
        <button className="btn btn-outline-danger fw-bold" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm bg-primary text-white p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 text-uppercase fw-bold">Citas Registradas</h6>
                <h1 className="display-4 fw-bold mb-0">{citasCount}</h1>
              </div>
              <i className="bi bi-calendar-check display-3 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm bg-dark text-white p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 text-uppercase fw-bold">Fichas Clínicas</h6>
                <h1 className="display-4 fw-bold mb-0">{fichasCount}</h1>
              </div>
              <i className="bi bi-journal-medical display-3 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}