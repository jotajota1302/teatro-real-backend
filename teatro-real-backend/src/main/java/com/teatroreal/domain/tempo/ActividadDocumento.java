package com.teatroreal.domain.tempo;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "actividad_documento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActividadDocumento implements Serializable {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "actividad_id", nullable = false)
    private Actividad actividad;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String nombreArchivo;

    @NotBlank
    @Column(nullable = false, length = 500)
    private String url;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private OrigenDocumento origen;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime fechaSubida;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public enum OrigenDocumento {
        LOCAL,
        DRIVE
    }
}
