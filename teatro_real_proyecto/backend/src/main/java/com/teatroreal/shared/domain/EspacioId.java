package com.teatroreal.shared.domain;

import java.util.UUID;
import java.util.Objects;

/**
 * Value Object para el ID de Espacio (sin Lombok).
 */
public final class EspacioId {
    private final UUID value;

    public EspacioId(UUID value) {
        this.value = Objects.requireNonNull(value, "value no puede ser nulo");
    }

    public UUID getValue() {
        return value;
    }

    public static EspacioId generate() {
        return new EspacioId(UUID.randomUUID());
    }

    public static EspacioId from(String id) {
        return new EspacioId(UUID.fromString(id));
    }

    @Override
    public String toString() {
        return value.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EspacioId that = (EspacioId) o;
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
