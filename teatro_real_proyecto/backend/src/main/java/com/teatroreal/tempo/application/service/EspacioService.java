package com.teatroreal.tempo.application.service;

import com.teatroreal.tempo.application.dto.EspacioDTO;
import com.teatroreal.tempo.application.dto.CreateEspacioRequest;
import com.teatroreal.tempo.infrastructure.mock.MockDataProvider;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Servicio de gestión de espacios (con datos mockeados).
 */
@Service
public class EspacioService {

    private final MockDataProvider mockDataProvider;

    public EspacioService(MockDataProvider mockDataProvider) {
        this.mockDataProvider = mockDataProvider;
    }

/**
 * Obtiene todos los espacios.
 */
public List<EspacioDTO> obtenerTodos() {
    return mockDataProvider.getEspacios();
}

/**
 * Listar todos los espacios.
 */
public List<EspacioDTO> listarEspacios() {
    return obtenerTodos();
}

/**
 * Obtiene todos los espacios activos.
 */
public List<EspacioDTO> obtenerActivos() {
    return mockDataProvider.getEspacios().stream()
        .filter(EspacioDTO::isActivo)
        .toList();
}

/**
 * Listar espacios activos.
 */
public List<EspacioDTO> listarEspaciosActivos() {
    return obtenerActivos();
}

/**
 * Obtiene un espacio por ID.
 */
public EspacioDTO obtenerPorId(String id) {
    EspacioDTO espacio = mockDataProvider.getEspacioById(id);
    if (espacio == null) {
        throw new IllegalArgumentException("Espacio no encontrado: " + id);
    }
    return espacio;
}

/**
 * Obtener un espacio por ID.
 */
public EspacioDTO obtenerEspacio(String id) {
    return obtenerPorId(id);
}

/**
 * Obtener espacio por nombre.
 */
public EspacioDTO obtenerEspacioPorNombre(String nombre) {
    EspacioDTO espacio = mockDataProvider.getEspacios().stream()
        .filter(e -> e.getNombre().equalsIgnoreCase(nombre))
        .findFirst()
        .orElse(null);
    if (espacio == null) {
        throw new IllegalArgumentException("Espacio no encontrado con nombre: " + nombre);
    }
    return espacio;
}

/**
 * Crea un nuevo espacio.
 */
public EspacioDTO crear(CreateEspacioRequest request) {
    EspacioDTO espacio = new EspacioDTO(
        UUID.randomUUID().toString(),
        request.getNombre(),
        request.getTipo(),
        request.getUbicacion(),
        request.getCodigoColor(),
        true,
        Instant.now(),
        Instant.now()
    );
    mockDataProvider.addEspacio(espacio);
    return espacio;
}

/**
 * Crear un nuevo espacio.
 */
public EspacioDTO crearEspacio(CreateEspacioRequest request) {
    return crear(request);
}

/**
 * Actualiza un espacio existente.
 */
public EspacioDTO actualizar(String id, CreateEspacioRequest request) {
    EspacioDTO existente = obtenerPorId(id);
    
    EspacioDTO actualizado = new EspacioDTO(
        id,
        request.getNombre(),
        request.getTipo(),
        request.getUbicacion(),
        request.getCodigoColor(),
        existente.isActivo(),
        existente.getCreatedAt(),
        Instant.now()
    );
    mockDataProvider.updateEspacio(id, actualizado);
    return actualizado;
}

/**
 * Actualizar un espacio.
 */
public EspacioDTO actualizarEspacio(String id, CreateEspacioRequest request) {
    return actualizar(id, request);
}

/**
 * Elimina un espacio (lo desactiva lógicamente).
 */
public void eliminar(String id) {
    EspacioDTO espacio = obtenerPorId(id);
    
    EspacioDTO desactivado = new EspacioDTO(
        id,
        espacio.getNombre(),
        espacio.getTipo(),
        espacio.getUbicacion(),
        espacio.getCodigoColor(),
        false,
        espacio.getCreatedAt(),
        Instant.now()
    );
    mockDataProvider.updateEspacio(id, desactivado);
}

/**
 * Desactivar un espacio.
 */
public void desactivarEspacio(String id) {
    eliminar(id);
}

/**
 * Eliminar un espacio.
 */
public void eliminarEspacio(String id) {
    eliminar(id);
}

/**
 * Activa un espacio desactivado.
 */
public EspacioDTO activar(String id) {
    EspacioDTO espacio = obtenerPorId(id);
    
    EspacioDTO activado = new EspacioDTO(
        id,
        espacio.getNombre(),
        espacio.getTipo(),
        espacio.getUbicacion(),
        espacio.getCodigoColor(),
        true,
        espacio.getCreatedAt(),
        Instant.now()
    );
    mockDataProvider.updateEspacio(id, activado);
    return activado;
}

/**
 * Activar un espacio.
 */
public void activarEspacio(String id) {
    activar(id);
}
}
