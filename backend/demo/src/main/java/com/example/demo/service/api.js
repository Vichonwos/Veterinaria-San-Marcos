const API_URL = 'http://localhost:8080/api/v1';

// Helper para incluir el token JWT en peticiones protegidas
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// 1. Autenticación
export const loginUsuario = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Credenciales incorrectas');
  return res.json();
};

export const registrarUsuario = async (datosUsuario) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosUsuario)
  });
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json();
};

// 2. Productos y Categorías (Público)
export const obtenerProductos = async () => {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
};

export const obtenerCategorias = async () => {
  const res = await fetch(`${API_URL}/categorias`);
  return res.json();
};

// 3. Boletas / Órdenes (Requiere Token)
export const crearBoleta = async (boleta) => {
  const res = await fetch(`${API_URL}/boletas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(boleta)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.mensaje || 'Error al procesar la compra');
  }
  return res.json();
};

export const obtenerBoletas = async () => {
  const res = await fetch(`${API_URL}/boletas`, {
    headers: getAuthHeaders()
  });
  return res.json();
};