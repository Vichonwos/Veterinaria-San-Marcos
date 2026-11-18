import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solución para la carga de íconos de marcadores en Leaflet con Vite/React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Home() {
  useEffect(() => {
    // Coordenadas de Rancagua (Av. Libertador Bernardo O'Higgins 456)
    const lat = -34.1701;
    const lng = -70.7407;

    // Inicializar mapa
    const map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marcador con popup
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup('<b>🐾 Veterinaria San Marcos</b><br>Av. Libertador Bernardo O\'Higgins 456, Rancagua.')
      .openPopup();

    // Limpieza al desmontar el componente
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="container my-5">
      {/* Hero / Banner Principal */}
      <div className="bg-light p-5 rounded-3 mb-5 text-center shadow-sm">
        <h1 className="fw-bold display-5 text-primary mb-3">🐾 Veterinaria San Marcos</h1>
        <p className="lead text-secondary mb-4">
          Excelencia en salud y bienestar animal. Cuidando a tus mejores amigos en Rancagua desde 2009.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/citas" className="btn btn-primary btn-lg fw-bold">
            📅 Reservar Cita Online
          </Link>
        </div>
      </div>

      {/* Tarjetas de Servicios */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center p-3">
            <div className="card-body">
              <h3 className="card-title fw-bold h5">Consulta General</h3>
              <p className="card-text text-muted">Evaluación médica integral para detectar cualquier anomalía a tiempo.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center p-3">
            <div className="card-body">
              <h3 className="card-title fw-bold h5">Vacunación y Desparasitación</h3>
              <p className="card-text text-muted">Mantén al día el calendario de inmunización de tu mascota de forma segura.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center p-3">
            <div className="card-body">
              <h3 className="card-title fw-bold h5">Cirugía Menor</h3>
              <p className="card-text text-muted">Pabellón equipado con altos estándares de seguridad y anestesia controlada.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección del Mapa */}
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fw-bold text-center mb-2">Nuestra Ubicación en Rancagua</h2>
        <p className="text-center text-muted mb-4">
          Visítanos en nuestras instalaciones. Contamos con estacionamiento y zona de espera cómoda.
        </p>
        <div 
          id="map" 
          style={{ height: '400px', width: '100%', borderRadius: '8px', zIndex: 1 }}
        ></div>
      </div>
    </div>
  );
}