const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

// Helper para adjuntar el token JWT en peticiones protegidas
const getAuthHeaders = () => {
  const session = dataService.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {})
  };
};

// Datos clínicos locales (Evaluación 2)
const fichasIniciales = [
  { id: 1, mascota: 'Toby', especie: 'Perro', raza: 'Mestizo', dueno: 'Marcela Gómez', diagnostico: 'Control General y Vacunación Sextuple', estado: 'Completado' },
  { id: 2, mascota: 'Pelusa', especie: 'Gato', raza: 'Persa', dueno: 'Carlos Pérez', diagnostico: 'Vacunación Triple Felina y Desparasitación', estado: 'Pendiente' },
  { id: 3, mascota: 'Max', especie: 'Perro', raza: 'Golden Retriever', dueno: 'Juan Pérez', diagnostico: 'Chequeo Preventivo y Limpieza Dental', estado: 'Completado' },
  { id: 4, mascota: 'Luna', especie: 'Conejo', raza: 'Cabeza de León', dueno: 'Sofía Morales', diagnostico: 'Corte de Dientes y Control Nutricional', estado: 'Completado' }
];

export const dataService = {
  // ==========================================
  // 1. AUTENTICACIÓN Y SESIÓN (JWT)
  // ==========================================
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.mensaje || 'Credenciales incorrectas' };
      }

      const session = {
        isLogged: true,
        id: data.id,
        role: data.rol, // 'ADMIN', 'VENDEDOR' o 'CLIENTE'
        user: `${data.nombre} ${data.apellido || ''}`.trim(),
        email: data.email,
        direccion: data.direccion || '',
        comuna: data.comuna || '',
        region: data.region || '',
        token: data.token
      };

      localStorage.setItem('userSession', JSON.stringify(session));
      return { success: true, session };
    } catch (error) {
      return { success: false, message: 'No se pudo conectar con el servidor.' };
    }
  },

  register: async (usuarioData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido || '',
          email: usuarioData.email,
          password: usuarioData.password,
          direccion: usuarioData.direccion || '',
          comuna: usuarioData.comuna || '',
          region: usuarioData.region || ''
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.mensaje || 'Error al registrar usuario.' };
      }

      // Iniciar sesión automáticamente tras registrarse
      return await dataService.login(usuarioData.email, usuarioData.password);
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor.' };
    }
  },

  logout: () => {
    localStorage.removeItem('userSession');
  },

  getSession: () => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  },

  // ==========================================
  // 2. GESTIÓN DE USUARIOS (SOLO ADMIN)
  // ==========================================
  getUsuarios: async () => {
    const res = await fetch(`${API_URL}/usuarios`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  },

  crearUsuario: async (usuario) => {
    const res = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(usuario)
    });
    return res.ok;
  },

  actualizarUsuario: async (id, usuario) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(usuario)
    });
    return res.ok;
  },

  eliminarUsuario: async (id) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  // ==========================================
  // 3. PRODUCTOS Y CATEGORÍAS (CATÁLOGO + ADMIN)
  // ==========================================
  getCategorias: async () => {
    const res = await fetch(`${API_URL}/categorias`);
    if (!res.ok) return [];
    return await res.json();
  },

  getMedicamentos: async () => {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) return [];
    const productos = await res.json();

    // Adaptamos los campos para mantener compatibilidad con Tienda.jsx y Carrito.jsx
    return productos.map((p) => ({
      ...p,
      codigo: String(p.id),
      categoria: p.categoria ? p.categoria.nombre : 'General',
      categoriaId: p.categoria ? p.categoria.id : null
    }));
  },

  crearProducto: async (producto) => {
    const res = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(producto)
    });
    return res.ok;
  },

  actualizarProducto: async (id, producto) => {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(producto)
    });
    return res.ok;
  },

  eliminarProducto: async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  // ==========================================
  // 4. CARRITO Y BOLETAS / ÓRDENES
  // ==========================================
  getCarrito: () => JSON.parse(localStorage.getItem('carrito')) || [],

  setCarrito: (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('cartUpdated'));
  },

  agregarAlCarrito: (producto) => {
    const carrito = dataService.getCarrito();
    const index = carrito.findIndex((item) => String(item.codigo) === String(producto.codigo));

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

    if (cantidad <= 0) {
      carrito = carrito.filter((item) => String(item.codigo) !== String(codigo));
    } else {
      const item = carrito.find((i) => String(i.codigo) === String(codigo));
      if (item) {
        if (cantidad > item.stock) {
          alert(`Solo hay ${item.stock} unidades disponibles.`);
          item.cantidad = item.stock;
        } else {
          item.cantidad = cantidad;
        }
      }
    }
    dataService.setCarrito(carrito);
    return carrito;
  },

  eliminarDelCarrito: (codigo) => {
    const carrito = dataService.getCarrito().filter((item) => String(item.codigo) !== String(codigo));
    dataService.setCarrito(carrito);
    return carrito;
  },

  vaciarCarrito: () => {
    localStorage.removeItem('carrito');
    window.dispatchEvent(new Event('cartUpdated'));
  },

  finalizarCompra: async (datosEntrega = {}) => {
    const carrito = dataService.getCarrito();
    if (carrito.length === 0) return { success: false, message: 'El carrito está vacío.' };

    const session = dataService.getSession();
    if (!session?.token || !session?.id) {
      return { success: false, message: 'Debes iniciar sesión para finalizar tu compra.' };
    }

    const payloadBoleta = {
      usuario: { id: session.id },
      direccionEntrega: datosEntrega.direccionEntrega || session.direccion || 'Retiro en Veterinaria San Marcos',
      comunaEntrega: datosEntrega.comunaEntrega || session.comuna || 'Quinta Normal',
      regionEntrega: datosEntrega.regionEntrega || session.region || 'Región Metropolitana de Santiago',
      indicaciones: datosEntrega.indicaciones || '',
      detalles: carrito.map((item) => ({
        producto: { id: Number(item.id || item.codigo) },
        cantidad: item.cantidad
      }))
    };

    try {
      const res = await fetch(`${API_URL}/boletas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payloadBoleta)
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.mensaje || 'Error al registrar la boleta.' };
      }

      dataService.vaciarCarrito();
      return { success: true, boleta: data };
    } catch (error) {
      return { success: false, message: 'Error de conexión al procesar la compra.' };
    }
  },

  getBoletas: async () => {
    const res = await fetch(`${API_URL}/boletas`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  },

  // ==========================================
  // 5. MÓDULO CLÍNICO (LOCALSTORAGE)
  // ==========================================
  getFichas: () => {
    const fichas = localStorage.getItem('fichasClinicas');
    if (!fichas) {
      localStorage.setItem('fichasClinicas', JSON.stringify(fichasIniciales));
      return fichasIniciales;
    }
    return JSON.parse(fichas);
  },

  getCitas: () => JSON.parse(localStorage.getItem('citasMedicas')) || []
};