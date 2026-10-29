import { describe, it, expect, beforeEach } from 'vitest';
import { dataService } from './dataService';

describe('Pruebas Unitarias - dataService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe inicializar y retornar la lista de citas iniciales', () => {
    const citas = dataService.getCitas();
    expect(Array.isArray(citas)).toBe(true);
    expect(citas.length).toBeGreaterThan(0);
  });

  it('debe agregar una nueva cita a localStorage con ID único', () => {
    const nuevaCita = {
      mascota: 'Boby',
      propietario: 'Ana Gómez',
      fecha: '2026-11-12',
      hora: '11:00',
      motivo: 'Vacuna anual'
    };

    const resultado = dataService.guardarCita(nuevaCita);

    expect(resultado).toHaveProperty('id');
    expect(resultado.mascota).toBe('Boby');

    const listaActualizada = dataService.getCitas();
    expect(listaActualizada.some(c => c.mascota === 'Boby')).toBe(true);
  });

  it('debe eliminar una cita correctamente', () => {
    const citasIniciales = dataService.getCitas();
    const idAEliminar = citasIniciales[0].id;

    dataService.eliminarCita(idAEliminar);

    const citasDespues = dataService.getCitas();
    expect(citasDespues.some(c => c.id === idAEliminar)).toBe(false);
  });
});