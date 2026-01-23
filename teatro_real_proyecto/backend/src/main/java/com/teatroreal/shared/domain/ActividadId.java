package com.teatroreal.shared.domain;

import java.util.UUID;
import java.util.Objects;

/**
 * Value Object para el ID de Actividad (sin Lombok).
 */
public final class ActividadId {
    private final UUID value;

    public ActividadId(UUID value) {
        this.value = Objects.requireNonNull(value, "value no puede ser nulo");
    }

    public UUID getValue() {
        return value;
    }

    public static ActividadId generate() {
        return new ActividadId(UUID.randomUUID());
    }

    public static ActividadId from(String id) {
        return new ActividadId(UUID.fromString(id));
    }

    @Override
    public String toString() {
        return value.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ActividadId that = (ActividadId) o;
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
