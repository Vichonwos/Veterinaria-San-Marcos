// 1. Usuarios precargados (Admin, Médicos, Recepcionistas)
const usuariosIniciales = [
  {
    id: 1,
    rut: '11111111-1',
    nombre: 'Carlos',
    apellido: 'Administrador',
    email: 'admin@sanmarcos.cl',
    password: 'admin123',
    role: 'admin',
    estado: 'Activo'
  },
  {
    id: 2,
    rut: '12345678-9',
    nombre: 'Dra. Patricia',
    apellido: 'Soto',
    email: 'medico@sanmarcos.cl',
    password: 'medico123',
    role: 'medico',
    estado: 'Activo'
  },
  {
    id: 3,
    rut: '98765432-1',
    nombre: 'Marcelo',
    apellido: 'Vargas',
    email: 'recepcion@sanmarcos.cl',
    password: 'recep123',
    role: 'recepcionista',
    estado: 'Activo'
  }
];

// 2. Fichas clínicas y mascotas precargadas en el sistema
const fichasIniciales = [
  {
    id: 1,
    mascota: 'Toby',
    especie: 'Perro',
    raza: 'Mestizo',
    dueno: 'Marcela Gómez',
    diagnostico: 'Control General y Vacunación Sextuple',
    estado: 'Completado'
  },
  {
    id: 2,
    mascota: 'Pelusa',
    especie: 'Gato',
    raza: 'Persa',
    dueno: 'Carlos Pérez',
    diagnostico: 'Vacunación Triple Felina y Desparasitación',
    estado: 'Pendiente'
  },
  {
    id: 3,
    mascota: 'Max',
    especie: 'Perro',
    raza: 'Golden Retriever',
    dueno: 'Juan Pérez',
    diagnostico: 'Chequeo Preventivo y Limpieza Dental',
    estado: 'Completado'
  },
  {
    id: 4,
    mascota: 'Luna',
    especie: 'Conejo',
    raza: 'Cabeza de León',
    dueno: 'Sofía Morales',
    diagnostico: 'Corte de Dientes y Control Nutricional',
    estado: 'Completado'
  }
];

// 3. Inventario inicial de medicamentos
const medicamentosIniciales = [
  { codigo: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg', activo: 'Amoxicilina', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 45, precio: 4200 },
  { codigo: 'ME002', categoria: 'Antibióticos', nombre: 'Enrox 50mg', activo: 'Enrofloxacino', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 30, precio: 6800 },
  { codigo: 'ME003', categoria: 'Antibióticos', nombre: 'Metrobay 250mg', activo: 'Metronidazol', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 28, precio: 3900 },
  { codigo: 'ME004', categoria: 'Antiparasitarios', nombre: 'Nexgard', activo: 'Afoxolaner', presentacion: 'Masticable 1 unid.', especie: 'Perro', stock: 60, precio: 9500 },
  { codigo: 'ME005', categoria: 'Antiparasitarios', nombre: 'Bravecto', activo: 'Fluralaner', presentacion: 'Masticable 1 unid.', especie: 'Perro', stock: 40, precio: 18900 },
  { codigo: 'ME006', categoria: 'Antiparasitarios', nombre: 'Revolution Plus', activo: 'Selamectina+Sarolaner', presentacion: 'Pipeta 1 unid.', especie: 'Gato', stock: 35, precio: 14500 },
  { codigo: 'ME007', categoria: 'Antiparasitarios', nombre: 'Drontal Plus', activo: 'Praziquantel+Pamoato', presentacion: 'Comprimido 1 unid.', especie: 'Perro', stock: 80, precio: 3200 },
  { codigo: 'ME008', categoria: 'Antiparasitarios', nombre: 'Milbemax Gato', activo: 'Milbemicina+Praziq.', presentacion: 'Comprimido 2 unid.', especie: 'Gato', stock: 50, precio: 6800 },
  { codigo: 'ME009', categoria: 'Antiinflamatorios', nombre: 'Meloxicam 1mg', activo: 'Meloxicam', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 55, precio: 4500 },
  { codigo: 'ME010', categoria: 'Antiinflamatorios', nombre: 'Carprofen 50mg', activo: 'Carprofeno', presentacion: 'Blíster 10 comp.', especie: 'Perro', stock: 30, precio: 9800 },
  { codigo: 'ME011', categoria: 'Dermatología', nombre: 'Clorhexidina shampoo', activo: 'Clorhexidina 2%', presentacion: 'Frasco 250ml', especie: 'Perro / Gato', stock: 25, precio: 8900 },
  { codigo: 'ME012', categoria: 'Dermatología', nombre: 'Malaseb shampoo', activo: 'Miconazol+Clorhex.', presentacion: 'Frasco 250ml', especie: 'Perro / Gato', stock: 20, precio: 12500 },
  { codigo: 'ME013', categoria: 'Dermatología', nombre: 'Apoquel 16mg', activo: 'Oclacitinib', presentacion: 'Blíster 10 comp.', especie: 'Perro', stock: 18, precio: 22000 },
  { codigo: 'ME014', categoria: 'Digestivo', nombre: 'Probifor', activo: 'Bacillus clausii', presentacion: 'Sobre 5ml x10', especie: 'Perro / Gato', stock: 40, precio: 5600 },
  { codigo: 'ME015', categoria: 'Digestivo', nombre: 'Omeprazol 10mg vet', activo: 'Omeprazol', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 35, precio: 3800 },
  { codigo: 'ME016', categoria: 'Cardíaco', nombre: 'Vetmedin 2.5mg', activo: 'Pimobendan', presentacion: 'Blíster 10 comp.', especie: 'Perro', stock: 15, precio: 28000 },
  { codigo: 'ME017', categoria: 'Analgésicos', nombre: 'Tramadol 50mg vet', activo: 'Tramadol', presentacion: 'Blíster 10 comp.', especie: 'Perro', stock: 22, precio: 5200 },
  { codigo: 'ME018', categoria: 'Vacunas', nombre: 'Nobivac DHPPi', activo: 'Vacuna polivalente', presentacion: 'Vial 1 dosis', especie: 'Perro', stock: 48, precio: 8500 },
  { codigo: 'ME019', categoria: 'Vacunas', nombre: 'Nobivac Rabies', activo: 'Vacuna antirrábica', presentacion: 'Vial 1 dosis', especie: 'Perro / Gato', stock: 60, precio: 5800 },
  { codigo: 'ME020', categoria: 'Vacunas', nombre: 'Felocell CVR', activo: 'Vacuna triple felina', presentacion: 'Vial 1 dosis', especie: 'Gato', stock: 36, precio: 7200 },
  { codigo: 'ME021', categoria: 'Suplementos', nombre: 'Omega vet 3-6-9', activo: 'Ácidos grasos omega', presentacion: 'Frasco 100ml', especie: 'Perro / Gato', stock: 30, precio: 9900 },
  { codigo: 'ME022', categoria: 'Suplementos', nombre: 'Condrovet forte', activo: 'Condroitín+Glucos.', presentacion: 'Blíster 30 comp.', especie: 'Perro', stock: 25, precio: 14500 }
];

export const dataService = {
  // Manejo de Usuarios
  getUsuarios: () => {
    const usuarios = localStorage.getItem('usuarios');
    if (!usuarios) {
      localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
      return usuariosIniciales;
    }
    return JSON.parse(usuarios);
  },

  register: (usuarioData) => {
    const usuarios = dataService.getUsuarios();
    if (usuarios.some((u) => u.email === usuarioData.email)) {
      return { success: false, message: 'El correo electrónico ya está registrado.' };
    }
    if (usuarioData.rut && usuarios.some((u) => u.rut === usuarioData.rut)) {
      return { success: false, message: 'El RUT ingresado ya está registrado.' };
    }

    const nuevoUsuario = {
      id: Date.now(),
      ...usuarioData,
      role: usuarioData.role || 'cliente',
      estado: usuarioData.estado || 'Activo'
    };

    const usuariosActualizados = [...usuarios, nuevoUsuario];
    localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

    if (!usuarioData.creadoPorAdmin) {
      const session = {
        isLogged: true,
        role: nuevoUsuario.role,
        user: `${nuevoUsuario.nombre} ${nuevoUsuario.apellido || ''}`.trim(),
        email: nuevoUsuario.email,
        rut: nuevoUsuario.rut
      };
      localStorage.setItem('userSession', JSON.stringify(session));
      return { success: true, session };
    }

    return { success: true };
  },

  login: (email, password) => {
    const usuarios = dataService.getUsuarios();
    const u = usuarios.find((u) => u.email === email && u.password === password);

    if (u) {
      if (u.estado === 'Inactivo') {
        return { success: false, message: 'Su cuenta se encuentra desactivada.' };
      }

      const session = {
        isLogged: true,
        role: u.role,
        user: u.role === 'admin' ? 'Administrador General' : `${u.nombre} ${u.apellido || ''}`.trim(),
        email: u.email,
        rut: u.rut
      };
      localStorage.setItem('userSession', JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, message: 'Credenciales incorrectas' };
  },

  toggleEstadoUsuario: (id) => {
    const usuarios = dataService.getUsuarios();
    const idx = usuarios.findIndex((u) => u.id === id);
    if (idx !== -1) {
      usuarios[idx].estado = usuarios[idx].estado === 'Activo' ? 'Inactivo' : 'Activo';
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      return usuarios;
    }
    return usuarios;
  },

  logout: () => {
    localStorage.removeItem('userSession');
  },

  getSession: () => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  },

  // Manejo de Fichas Clínicas de Mascotas
  getFichas: () => {
    const fichas = localStorage.getItem('fichasClinicas');
    if (!fichas) {
      localStorage.setItem('fichasClinicas', JSON.stringify(fichasIniciales));
      return fichasIniciales;
    }
    return JSON.parse(fichas);
  },

  // Manejo de Citas Médicas Solicitadas
  getCitas: () => JSON.parse(localStorage.getItem('citasMedicas')) || [],

  // Manejo de Tienda de Medicamentos
  getMedicamentos: () => {
    const meds = localStorage.getItem('medicamentos');
    if (!meds) {
      localStorage.setItem('medicamentos', JSON.stringify(medicamentosIniciales));
      return medicamentosIniciales;
    }
    return JSON.parse(meds);
  },

  // Manejo de Carrito de Compras
  getCarrito: () => JSON.parse(localStorage.getItem('carrito')) || [],

  setCarrito: (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('cartUpdated'));
  },

  agregarAlCarrito: (producto) => {
    const carrito = dataService.getCarrito();
    const index = carrito.findIndex((item) => item.codigo === producto.codigo);

    if (index !== -1) {
      if (carrito[index].cantidad + 1 > producto.stock) {
        return { success: false, message: `No hay más stock disponible para ${producto.nombre}.` };
      }
      carrito[index].cantidad += 1;
    } else {
      if (producto.stock < 1) {
        return { success: false, message: 'Producto sin stock.' };
      }
      carrito.push({ ...producto, cantidad: 1 });
    }

    dataService.setCarrito(carrito);
    return { success: true, carrito };
  },

  actualizarCantidadCarrito: (codigo, cantidad) => {
    let carrito = dataService.getCarrito();
    const meds = dataService.getMedicamentos();
    const producto = meds.find((m) => m.codigo === codigo);

    if (cantidad <= 0) {
      carrito = carrito.filter((item) => item.codigo !== codigo);
    } else {
      const item = carrito.find((i) => i.codigo === codigo);
      if (item) {
        if (producto && cantidad > producto.stock) {
          alert(`Solo hay ${producto.stock} unidades disponibles.`);
          item.cantidad = producto.stock;
        } else {
          item.cantidad = cantidad;
        }
      }
    }
    dataService.setCarrito(carrito);
    return carrito;
  },

  eliminarDelCarrito: (codigo) => {
    const carrito = dataService.getCarrito().filter((item) => item.codigo !== codigo);
    dataService.setCarrito(carrito);
    return carrito;
  },

  vaciarCarrito: () => {
    localStorage.removeItem('carrito');
    window.dispatchEvent(new Event('cartUpdated'));
  },

  finalizarCompra: () => {
    const carrito = dataService.getCarrito();
    if (carrito.length === 0) return { success: false, message: 'El carrito está vacío.' };

    const medicamentos = dataService.getMedicamentos();

    for (const item of carrito) {
      const med = medicamentos.find((m) => m.codigo === item.codigo);
      if (!med || med.stock < item.cantidad) {
        return {
          success: false,
          message: `Stock insuficiente para ${item.nombre}. Disponible: ${med ? med.stock : 0}`
        };
      }
    }

    for (const item of carrito) {
      const idx = medicamentos.findIndex((m) => m.codigo === item.codigo);
      if (idx !== -1) {
        medicamentos[idx].stock -= item.cantidad;
      }
    }

    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    dataService.vaciarCarrito();
    return { success: true };
  }
};