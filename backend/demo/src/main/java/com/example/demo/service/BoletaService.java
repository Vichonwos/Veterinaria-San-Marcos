package com.example.demo.service;

import com.example.demo.model.Boleta;
import com.example.demo.model.DetalleBoleta;
import com.example.demo.model.Producto;
import com.example.demo.repository.BoletaRepository;
import com.example.demo.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BoletaService {

    @Autowired
    private BoletaRepository boletaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Boleta> listarTodas() {
        return boletaRepository.findAll();
    }

    public List<Boleta> listarPorUsuario(Long usuarioId) {
        return boletaRepository.findByUsuarioId(usuarioId);
    }

    public Boleta obtenerPorId(Long id) {
        return boletaRepository.findById(id).orElse(null);
    }

    @Transactional
    public Boleta crearBoleta(Boleta boleta) {
        boleta.setFecha(LocalDateTime.now());
        int totalCalculado = 0;

        if (boleta.getDetalles() != null) {
            for (DetalleBoleta detalle : boleta.getDetalles()) {
                Producto prod = productoRepository.findById(detalle.getProducto().getId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                if (prod.getStock() < detalle.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para: " + prod.getNombre());
                }

                // Descontar stock del producto
                prod.setStock(prod.getStock() - detalle.getCantidad());
                productoRepository.save(prod);

                // Fijar precio actual y vincular detalle con su boleta
                detalle.setPrecioUnitario(prod.getPrecio());
                detalle.setProducto(prod);
                detalle.setBoleta(boleta);

                totalCalculado += prod.getPrecio() * detalle.getCantidad();
            }
        }

        boleta.setTotal(totalCalculado);
        return boletaRepository.save(boleta);
    }
}