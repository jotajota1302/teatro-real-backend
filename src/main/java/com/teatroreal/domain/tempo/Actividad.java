package com.teatroreal.domain.tempo;

import com.teatroreal.domain.user.Usuario;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "actividades")
public class Actividad implements Serializable {

    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

    @NotBlank
    @Column(nullable = false, length = 255)
    private String titulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "temporada_id", nullable = true)
    private Temporada temporada;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_actividad_id", nullable = false)
    private TipoActividad tipoActividad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espacio_id", nullable = false)
    private Espacio espacio;

    @NotNull
    @Column(nullable = false)
    private LocalDate fecha;

    @NotNull
    @Column(nullable = false)
    private LocalTime horaInicio;

    @NotNull
    @Column(nullable = false)
    private LocalTime horaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;

    @Column(columnDefinition = "TEXT")
    private String notas;

    // Campos específicos almacén
    @Enumerated(EnumType.STRING)
    private TipoMovimiento tipoMovimiento;

    private Integer numCamiones;
    private String lugarOrigen;
    private String lugarDestino;
    private String produccionNombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoActividad estado = EstadoActividad.PENDIENTE;

    private String googleEventId;
    private LocalDateTime ultimaSincronizacion;

    // Relación con documentos
    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActividadDocumento> documentos = new ArrayList<>();

    // Auditoría
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Usuario createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ENUMS: según modelo v2 / plan implementación backend
    public enum EstadoActividad {
        PENDIENTE, EN_TRANSITO, COMPLETADO
    }

    public enum TipoMovimiento {
        ENTRADA, SALIDA, INTERNO
    }

    // GETTERS Y SETTERS

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public Temporada getTemporada() { return temporada; }
    public void setTemporada(Temporada temporada) { this.temporada = temporada; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public TipoActividad getTipoActividad() { return tipoActividad; }
    public void setTipoActividad(TipoActividad tipoActividad) { this.tipoActividad = tipoActividad; }

    public Espacio getEspacio() { return espacio; }
    public void setEspacio(Espacio espacio) { this.espacio = espacio; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public Departamento getDepartamento() { return departamento; }
    public void setDepartamento(Departamento departamento) { this.departamento = departamento; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public TipoMovimiento getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(TipoMovimiento tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }

    public Integer getNumCamiones() { return numCamiones; }
    public void setNumCamiones(Integer numCamiones) { this.numCamiones = numCamiones; }

    public String getLugarOrigen() { return lugarOrigen; }
    public void setLugarOrigen(String lugarOrigen) { this.lugarOrigen = lugarOrigen; }

    public String getLugarDestino() { return lugarDestino; }
    public void setLugarDestino(String lugarDestino) { this.lugarDestino = lugarDestino; }

    public String getProduccionNombre() { return produccionNombre; }
    public void setProduccionNombre(String produccionNombre) { this.produccionNombre = produccionNombre; }

    public EstadoActividad getEstado() { return estado; }
    public void setEstado(EstadoActividad estado) { this.estado = estado; }

    public String getGoogleEventId() { return googleEventId; }
    public void setGoogleEventId(String googleEventId) { this.googleEventId = googleEventId; }

    public LocalDateTime getUltimaSincronizacion() { return ultimaSincronizacion; }
    public void setUltimaSincronizacion(LocalDateTime ultimaSincronizacion) { this.ultimaSincronizacion = ultimaSincronizacion; }

    public List<ActividadDocumento> getDocumentos() { return documentos; }
    public void setDocumentos(List<ActividadDocumento> documentos) { this.documentos = documentos; }

    public Usuario getCreatedBy() { return createdBy; }
    public void setCreatedBy(Usuario createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
