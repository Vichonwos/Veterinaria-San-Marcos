export const dataService = {
  // Manejo de Sesión en localStorage
  login: (email, password) => {
    if ((email === 'admin@sanmarcos.cl' || email === 'admin') && password === 'admin123') {
      const session = { isLogged: true, role: 'admin', user: 'Administrador' };
      localStorage.setItem('userSession', JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, message: 'Credenciales incorrectas' };
  },

  logout: () => {
    localStorage.removeItem('userSession');
  },

  getSession: () => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  },

  // Obtener Fichas y Citas
  getFichas: () => {
    return JSON.parse(localStorage.getItem('fichasClinicas')) || [
      { id: 1, mascota: 'Toby', especie: 'Perro', dueno: 'Marcela Gómez', diagnostico: 'Control General', estado: 'Completado' },
      { id: 2, mascota: 'Pelusa', especie: 'Gato', dueno: 'Carlos Pérez', diagnostico: 'Vacunación Triple Felina', estado: 'Pendiente' }
    ];
  },

  getCitas: () => {
    return JSON.parse(localStorage.getItem('citasMedicas')) || [];
  }
};