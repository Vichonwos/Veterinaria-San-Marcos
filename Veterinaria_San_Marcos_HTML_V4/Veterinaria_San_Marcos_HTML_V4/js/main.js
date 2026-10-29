document.addEventListener('DOMContentLoaded', () => {
    // 1. Base de datos local de trabajadores registrados
    const trabajadores = [
        { id: 1, nombre: "Dr. Roberto San Martín", email: "roberto@sanmarcos.cl", pass: "vet123", rol: "admin", cargo: "Médico Veterinario Jefe" },
        { id: 2, nombre: "Dra. Camila Morales", email: "camila@sanmarcos.cl", pass: "cirugia2026", rol: "admin", cargo: "Cirujana Veterinaria" },
        { id: 3, nombre: "Claudia Morales", email: "claudia@sanmarcos.cl", pass: "recepcion123", rol: "admin", cargo: "Recepcionista" },
        { id: 4, nombre: "Gonzalo Tapia", email: "gonzalo@sanmarcos.cl", pass: "admin2026", rol: "admin", cargo: "Administrador General" }
    ];

    // Obtener estado de la sesión actual desde localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole'); // 'admin' o 'cliente'
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 2. Control del gran botón verde en Index.html
    const btnHeroCita = document.querySelector('.hero-buttons .btn-primary');
    if (btnHeroCita) {
        btnHeroCita.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault(); 
                alert('Información obligatoria:\nPara realizar una reserva de cita médica online en nuestra plataforma, primero debes iniciar sesión con tu cuenta de cliente.');
                window.location.href = 'login.html';
            }
        });
    }

    // 3. Proteger rutas por código para evitar accesos manuales por barra de direcciones
    if (currentPage === 'citas.html' && !isLoggedIn) {
        alert('Acceso denegado: Por favor inicia sesión con tu cuenta para agendar una atención.');
        window.location.href = 'login.html';
        return;
    }

    if (currentPage === 'fichas.html' && !isLoggedIn) {
        alert('Acceso denegado: Inicia sesión para visualizar tu historial clínico.');
        window.location.href = 'login.html';
        return;
    }

    const adminPages = ['admin.html'];
    if (adminPages.includes(currentPage)) {
        if (!isLoggedIn || userRole !== 'admin') {
            alert('Acceso denegado: Esta zona está reservada para el personal de la clínica.');
            window.location.href = 'login.html';
            return;
        }
    }

    // 4. Control de visibilidad de menús (guest-only, auth-only, admin-only)
    const guestElements = document.querySelectorAll('.guest-only');
    const authElements = document.querySelectorAll('.auth-only');
    const adminElements = document.querySelectorAll('.admin-only');

    if (isLoggedIn) {
        guestElements.forEach(el => el.style.display = 'none');
        authElements.forEach(el => el.style.display = 'inline-block');
        adminElements.forEach(el => {
            el.style.display = (userRole === 'admin') ? 'inline-block' : 'none';
        });
    } else {
        guestElements.forEach(el => el.style.display = 'inline-block');
        authElements.forEach(el => el.style.display = 'none');
        adminElements.forEach(el => el.style.display = 'none');
    }

    // 5. Formulario de Inicio de Sesión Seguro Unificado (CORREGIDO DUPLICADO)
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const pass = document.getElementById('loginPass').value.trim();

            const empleadoEncontrado = trabajadores.find(t => t.email.toLowerCase() === email && t.pass === pass);
            if (empleadoEncontrado) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('userEmail', empleadoEncontrado.email);
                localStorage.setItem('userName', empleadoEncontrado.nombre);
                
                alert(`¡Bienvenido/a al sistema, ${empleadoEncontrado.nombre}!\nRedirigiendo al Panel Administrativo...`);
                window.location.href = 'admin.html';
                return;
            }

            if (email.endsWith('@gmail.com')) {
                const extraerUsuario = email.split('@')[0];
                const nombreFormateado = extraerUsuario.charAt(0).toUpperCase() + extraerUsuario.slice(1);

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'cliente');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', nombreFormateado);

                alert(`¡Sesión iniciada con éxito!\nBienvenido al portal de pacientes, ${nombreFormateado}.`);
                window.location.href = 'index.html';
            } else {
                alert('Acceso Denegado:\nPara registrarte como paciente y solicitar una cita médica de manera segura, debes utilizar una cuenta de correo válida con dominio @gmail.com.');
            }
        });
    }

    // 6. Manejo del Botón de Cierre de Sesión
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            alert('Has cerrado tu sesión de forma segura.');
            window.location.href = 'index.html';
        });
    }

    // 7. Inicialización del Mapa Geográfico (Leaflet)
    const mapElement = document.getElementById('map');
    if (mapElement && typeof L !== 'undefined') {
        const lat = -34.1657178;
        const lng = -70.7408592;
        const map = L.map('map').setView([lat, lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup("<b>Veterinaria San Marcos</b><br>Av. Libertador Bernardo O'Higgins 456, Rancagua.").openPopup();
    }

    // 8. Formulario de Solicitud de Citas (citas.html)
    const formCita = document.getElementById('formCita');
    if (formCita) {
        if (isLoggedIn && userRole === 'cliente') {
            if(document.getElementById('nombreDueno')) document.getElementById('nombreDueno').value = userName;
            if(document.getElementById('emailDueno')) {
                const inputEmail = document.getElementById('emailDueno');
                inputEmail.value = userEmail;
                inputEmail.setAttribute('readonly', 'true'); 
                inputEmail.style.backgroundColor = '#f1f5f9';
            }
        }

        formCita.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackBox = document.getElementById('mensaje-feedback');
            const emailDueno = document.getElementById('emailDueno').value.trim().toLowerCase();

            if (userRole === 'cliente' && emailDueno !== userEmail.toLowerCase()) {
                alert('Fallo de integridad: Los parámetros de la cuenta activa no coinciden.');
                localStorage.clear();
                window.location.href = 'login.html';
                return;
            }

            const nombreDueno = document.getElementById('nombreDueno').value.trim();
            const mascota = document.getElementById('nombreMascota').value.trim();
            const especie = document.getElementById('especie').value;
            const servicio = document.getElementById('servicio').value;
            const fechaCita = document.getElementById('fechaCita').value;
            const motivo = document.getElementById('motivo').value.trim();

            const nuevaCita = {
                mascota: mascota,
                especie: especie,
                dueno: nombreDueno,
                emailDueno: emailDueno,
                diagnostico: servicio + (motivo ? ' - ' + motivo : ''),
                fecha: fechaCita
            };

            let citasGuardadas = JSON.parse(localStorage.getItem('citasVeterinaria')) || [];
            citasGuardadas.push(nuevaCita);
            localStorage.setItem('citasVeterinaria', JSON.stringify(citasGuardadas));

            if (feedbackBox) {
                feedbackBox.style.color = '#155724';
                feedbackBox.style.backgroundColor = '#d4edda';
                feedbackBox.innerHTML = '¡Tu cita médica veterinaria ha sido agendada con éxito!';
                feedbackBox.style.display = 'block';
                setTimeout(() => { feedbackBox.style.display = 'none'; }, 5000);
            }
            formCita.reset();

            if (userRole === 'cliente' && document.getElementById('emailDueno')) {
                document.getElementById('emailDueno').value = userEmail;
            }
        });
    }
        // 9. Construcción Dinámica de la Tabla de Historial (fichas.html)
    const tablaFichasBody = document.getElementById('tablaFichasBody');
    if (tablaFichasBody) {
        const fichasPredefinidas = [
            { mascota: "Firulais", especie: "Perro (Mestizo)", dueno: "Juan Pérez", emailDueno: "juan.perez@gmail.com", diagnostico: "Otitis leve tratada con gotas óticas.", estado: "Al Día" },
            { mascota: "Luna", especie: "Gato (Siamés)", dueno: "Camila Soto", emailDueno: "camila.soto@gmail.com", diagnostico: "Control sano y vacuna triple felina aplicada.", estado: "Al Día" },
            { mascota: "Copito", especie: "Conejo (Angora)", dueno: "Esteban Rivas", emailDueno: "esteban.rivas@gmail.com", diagnostico: "Corte de dientes incisivos y revisión general.", estado: "Pendiente" }
        ];

        let citasAgendadas = JSON.parse(localStorage.getItem('citasVeterinaria')) || [];
        let todasLasFichas = [...fichasPredefinidas];
        
        citasAgendadas.forEach(cita => {
            todasLasFichas.push({
                mascota: cita.mascota,
                especie: cita.especie,
                dueno: cita.dueno,
                emailDueno: cita.emailDueno,
                diagnostico: `${cita.diagnostico} (Agendado para: ${cita.fecha})`,
                estado: "Cita Agendada"
            });
        });

        if (isLoggedIn && userRole === 'cliente') {
            todasLasFichas = todasLasFichas.filter(ficha => ficha.emailDueno === userEmail.toLowerCase());
            const searchBar = document.querySelector('.search-bar');
            if (searchBar) searchBar.style.display = 'none';
        }

        if (todasLasFichas.length === 0) {
            tablaFichasBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No registras fichas clínicas ni mascotas asociadas aún.</td></tr>';
        } else {
            tablaFichasBody.innerHTML = todasLasFichas.map(ficha => `
                <tr>
                    <td><strong>${ficha.mascota}</strong></td>
                    <td>${ficha.especie}</td>
                    <td>${ficha.dueno}</td>
                    <td>${ficha.diagnostico}</td>
                    <td><span style="color: ${ficha.estado === 'Al Día' ? 'green' : 'orange'}; font-weight: bold;">${ficha.estado}</span></td>
                    <td><button class="btn-action">Ver Detalles</button></td>
                </tr>
            `).join('');
        }
    }

    // 10. Buscador en tiempo real (Disponible para el Administrador)
    const inputBusqueda = document.getElementById('busquedaMascota');
    if (inputBusqueda && tablaFichasBody && userRole === 'admin') {
        inputBusqueda.addEventListener('input', () => {
            const textoFiltro = inputBusqueda.value.toLowerCase().trim();
            const filas = tablaFichasBody.querySelectorAll('tr');
            filas.forEach(fila => {
                fila.style.display = fila.textContent.toLowerCase().includes(textoFiltro) ? '' : 'none';
            });
        });
    }

    // 11. Carga de trabajadores en la vista interna de admin.html
    const tablaTrabajadoresBody = document.getElementById('tablaTrabajadoresBody');
    if (tablaTrabajadoresBody) {
        tablaTrabajadoresBody.innerHTML = trabajadores.map(t => `
            <tr>
                <td>${t.id}</td>
                <td><strong>${t.nombre}</strong></td>
                <td><code>${t.email}</code></td>
                <td>${t.cargo}</td>
                <td><span style="color: green; font-weight: bold;">● Activo</span></td>
                <td>
                    <button class="btn-action">Editar</button>
                    <button class="btn-danger">Desactivar</button>
                </td>
            </tr>
        `).join('');
    }
});