package com.example.demo.controller;

import com.example.demo.model.Usuario;
import com.example.demo.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Usuarios", description = "Administración de usuarios y roles (Solo ADMIN)")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @Operation(summary = "Listar todos los usuarios (Solo ADMIN)")
    public List<Usuario> listar() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID (Solo ADMIN)")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Usuario user = usuarioService.obtenerPorId(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Crear usuario con rol específico ADMIN/VENDEDOR/CLIENTE (Solo ADMIN)")
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.guardar(usuario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar usuario y/o cambiar su rol (Solo ADMIN)")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario datos) {
        Usuario existente = usuarioService.obtenerPorId(id);
        if (existente != null) {
            existente.setNombre(datos.getNombre());
            existente.setApellido(datos.getApellido());
            existente.setEmail(datos.getEmail());
            existente.setRol(datos.getRol());
            existente.setDireccion(datos.getDireccion());
            existente.setComuna(datos.getComuna());
            existente.setRegion(datos.getRegion());
            if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
                existente.setPassword(passwordEncoder.encode(datos.getPassword()));
            }
            return ResponseEntity.ok(usuarioService.guardar(existente));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario (Solo ADMIN)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}