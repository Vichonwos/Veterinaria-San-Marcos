const KEYS = {
  CITAS: 'vet_citas',
  FICHAS: 'vet_fichas'
};

const initialCitas = [
  { id: 1, mascota: 'Firulais', propietario: 'Juan Pérez', fecha: '2026-11-05', hora: '10:00', motivo: 'Vacunación' }
];

const initialFichas = [
  { id: 1, mascota: 'Pelusa', especie: 'Gato', edad: '3 años', diagnostico: 'Sano / Control sano', tratamiento: 'Desparasitación interna', fecha: '2026-10-20' }
];

export const dataService = {
  init() {
    if (!localStorage.getItem(KEYS.CITAS)) {
      localStorage.setItem(KEYS.CITAS, JSON.stringify(initialCitas));
    }
    if (!localStorage.getItem(KEYS.FICHAS)) {
      localStorage.setItem(KEYS.FICHAS, JSON.stringify(initialFichas));
    }
  },

  // Citas
  getCitas() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.CITAS)) || [];
  },
  guardarCita(nuevaCita) {
    const citas = this.getCitas();
    const citaConId = { ...nuevaCita, id: Date.now() };
    citas.push(citaConId);
    localStorage.setItem(KEYS.CITAS, JSON.stringify(citas));
    return citaConId;
  },
  eliminarCita(id) {
    const citas = this.getCitas().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CITAS, JSON.stringify(citas));
  },

  // Fichas Médicas
  getFichas() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.FICHAS)) || [];
  },
  guardarFicha(nuevaFicha) {
    const fichas = this.getFichas();
    const fichaConId = { ...nuevaFicha, id: Date.now() };
    fichas.push(fichaConId);
    localStorage.setItem(KEYS.FICHAS, JSON.stringify(fichas));
    return fichaConId;
  },
  eliminarFicha(id) {
    const fichas = this.getFichas().filter(f => f.id !== id);
    localStorage.setItem(KEYS.FICHAS, JSON.stringify(fichas));
  }
};