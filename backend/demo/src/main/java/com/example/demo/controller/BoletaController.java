package com.example.demo.controller;

import com.example.demo.model.Boleta;
import com.example.demo.service.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/boletas")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Boletas / Órdenes", description = "Gestión de compras y órdenes de venta")
public class BoletaController {

    @Autowired
    private BoletaService boletaService;

    @GetMapping
    @Operation(summary = "Listar todas las boletas (ADMIN y VENDEDOR)")
    public List<Boleta> listarTodas() {
        return boletaService.listarTodas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una boleta por ID (ADMIN, VENDEDOR, CLIENTE)")
    public ResponseEntity<Boleta> obtenerPorId(@PathVariable Long id) {
        Boleta boleta = boletaService.obtenerPorId(id);
        return boleta != null ? ResponseEntity.ok(boleta) : ResponseEntity.notFound().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Obtener historial de compras de un usuario")
    public List<Boleta> listarPorUsuario(@PathVariable Long usuarioId) {
        return boletaService.listarPorUsuario(usuarioId);
    }

    @PostMapping
    @Operation(summary = "Registrar una nueva compra y descontar stock (CLIENTE o ADMIN)")
    public ResponseEntity<?> crearBoleta(@RequestBody Boleta boleta) {
        try {
            Boleta creada = boletaService.crearBoleta(boleta);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }
}