package com.example.demo.config;

import com.example.demo.model.Categoria;
import com.example.demo.model.Producto;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepo,
                               CategoriaRepository categoriaRepo,
                               ProductoRepository productoRepo,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Crear usuarios de prueba para los 3 roles
            if (usuarioRepo.count() == 0) {
                Usuario admin = new Usuario("Admin", "San Marcos", "admin@veterinaria.cl", passwordEncoder.encode("admin123"), "ADMIN");
                admin.setDireccion("Av. San Pablo 4520");
                admin.setComuna("Quinta Normal");
                admin.setRegion("Región Metropolitana de Santiago");
                usuarioRepo.save(admin);

                Usuario vendedor = new Usuario("Carlos", "Vendedor", "vendedor@veterinaria.cl", passwordEncoder.encode("vendedor123"), "VENDEDOR");
                usuarioRepo.save(vendedor);

                Usuario cliente = new Usuario("María", "González", "cliente@veterinaria.cl", passwordEncoder.encode("cliente123"), "CLIENTE");
                cliente.setDireccion("Los Crisantemos 603");
                cliente.setComuna("Cerrillos");
                cliente.setRegion("Región Metropolitana de Santiago");
                usuarioRepo.save(cliente);
            }

            // 2. Crear las 9 categorías y los 22 productos de Veterinaria San Marcos
            if (categoriaRepo.count() == 0) {
                Categoria antibioticos = categoriaRepo.save(new Categoria("Antibióticos", "Medicamentos antibacterianos de uso veterinario", ""));
                Categoria antiparasitarios = categoriaRepo.save(new Categoria("Antiparasitarios", "Control de parásitos internos y externos", ""));
                Categoria antiinflamatorios = categoriaRepo.save(new Categoria("Antiinflamatorios", "Tratamiento de inflamación y dolor articular", ""));
                Categoria dermatologia = categoriaRepo.save(new Categoria("Dermatología", "Cuidado de la piel y pelaje", ""));
                Categoria digestivo = categoriaRepo.save(new Categoria("Digestivo", "Protectores gástricos y probióticos veterinarios", ""));
                Categoria cardiaco = categoriaRepo.save(new Categoria("Cardíaco", "Tratamiento cardiovascular veterinario", ""));
                Categoria analgesicos = categoriaRepo.save(new Categoria("Analgésicos", "Control del dolor agudo y crónico", ""));
                Categoria vacunas = categoriaRepo.save(new Categoria("Vacunas", "Inmunización preventiva para perros y gatos", ""));
                Categoria suplementos = categoriaRepo.save(new Categoria("Suplementos", "Vitaminas, ácidos grasos y condroprotectores", ""));

                // Antibióticos
                productoRepo.save(new Producto("Amoxibay 250mg", "ME001 | Principio activo: Amoxicilina | Presentación: Blíster 10 comp. | Especie: Perro / Gato", 4200, 45, false, "", antibioticos));
                productoRepo.save(new Producto("Enrox 50mg", "ME002 | Principio activo: Enrofloxacino | Presentación: Blíster 10 comp. | Especie: Perro / Gato", 6800, 30, false, "", antibioticos));
                productoRepo.save(new Producto("Metrobay 250mg", "ME003 | Principio activo: Metronidazol | Presentación: Blíster 10 comp. | Especie: Perro / Gato", 3900, 28, false, "", antibioticos));

                // Antiparasitarios
                productoRepo.save(new Producto("Nexgard", "ME004 | Principio activo: Afoxolaner | Presentación: Masticable 1 unid. | Especie: Perro", 9500, 60, false, "", antiparasitarios));
                productoRepo.save(new Producto("Bravecto", "ME005 | Principio activo: Fluralaner | Presentación: Masticable 1 unid. | Especie: Perro", 18900, 40, true, "", antiparasitarios));
                productoRepo.save(new Producto("Revolution Plus", "ME006 | Principio activo: Selamectina+Sarolaner | Presentación: Pipeta 1 unid. | Especie: Gato", 14500, 35, false, "", antiparasitarios));
                productoRepo.save(new Producto("Drontal Plus", "ME007 | Principio activo: Praziquantel+Pamoato | Presentación: Comprimido 1 unid. | Especie: Perro", 3200, 80, false, "", antiparasitarios));
                productoRepo.save(new Producto("Milbemax Gato", "ME008 | Principio activo: Milbemicina+Praziq. | Presentación: Comprimido 2 unid. | Especie: Gato", 6800, 50, false, "", antiparasitarios));

                // Antiinflamatorios
                productoRepo.save(new Producto("Meloxicam 1mg", "ME009 | Principio activo: Meloxicam | Presentación: Blíster 10 comp. | Especie: Perro / Gato", 4500, 55, false, "", antiinflamatorios));
                productoRepo.save(new Producto("Carprofen 50mg", "ME010 | Principio activo: Carprofeno | Presentación: Blíster 10 comp. | Especie: Perro", 9800, 30, false, "", antiinflamatorios));

                // Dermatología
                productoRepo.save(new Producto("Clorhexidina shampoo", "ME011 | Principio activo: Clorhexidina 2% | Presentación: Frasco 250ml | Especie: Perro / Gato", 8900, 25, false, "", dermatologia));
                productoRepo.save(new Producto("Malaseb shampoo", "ME012 | Principio activo: Miconazol+Clorhex. | Presentación: Frasco 250ml | Especie: Perro / Gato", 12500, 20, false, "", dermatologia));
                productoRepo.save(new Producto("Apoquel 16mg", "ME013 | Principio activo: Oclacitinib | Presentación: Blíster 10 comp. | Especie: Perro", 22000, 18, true, "", dermatologia));

                // Digestivo
                productoRepo.save(new Producto("Probifor", "ME014 | Principio activo: Bacillus clausii | Presentación: Sobre 5ml x10 | Especie: Perro / Gato", 5600, 40, false, "", digestivo));
                productoRepo.save(new Producto("Omeprazol 10mg vet", "ME015 | Principio activo: Omeprazol | Presentación: Blíster 10 comp. | Especie: Perro / Gato", 3800, 35, false, "", digestivo));

                // Cardíaco
                productoRepo.save(new Producto("Vetmedin 2.5mg", "ME016 | Principio activo: Pimobendan | Presentación: Blíster 10 comp. | Especie: Perro", 28000, 15, false, "", cardiaco));

                // Analgésicos
                productoRepo.save(new Producto("Tramadol 50mg vet", "ME017 | Principio activo: Tramadol | Presentación: Blíster 10 comp. | Especie: Perro", 5200, 22, false, "", analgesicos));

                // Vacunas
                productoRepo.save(new Producto("Nobivac DHPPi", "ME018 | Principio activo: Vacuna polivalente | Presentación: Vial 1 dosis | Especie: Perro", 8500, 48, false, "", vacunas));
                productoRepo.save(new Producto("Nobivac Rabies", "ME019 | Principio activo: Vacuna antirrábica | Presentación: Vial 1 dosis | Especie: Perro / Gato", 5800, 60, false, "", vacunas));
                productoRepo.save(new Producto("Felocell CVR", "ME020 | Principio activo: Vacuna triple felina | Presentación: Vial 1 dosis | Especie: Gato", 7200, 36, false, "", vacunas));

                // Suplementos
                productoRepo.save(new Producto("Omega vet 3-6-9", "ME021 | Principio activo: Ácidos grasos omega | Presentación: Frasco 100ml | Especie: Perro / Gato", 9900, 30, false, "", suplementos));
                productoRepo.save(new Producto("Condrovet forte", "ME022 | Principio activo: Condroitín+Glucos. | Presentación: Blíster 30 comp. | Especie: Perro", 14500, 25, false, "", suplementos));
            }
        };
    }
}