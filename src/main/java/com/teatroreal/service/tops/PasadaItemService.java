package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.Acto;
import com.teatroreal.domain.tops.PasadaItem;
import com.teatroreal.dto.request.PasadaItemRequest;
import com.teatroreal.repository.tops.ActoRepository;
import com.teatroreal.repository.tops.PasadaItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PasadaItemService {

    @Autowired
    private PasadaItemRepository pasadaItemRepository;

    @Autowired
    private ActoRepository actoRepository;

    public List<PasadaItem> findByActoId(String actoId) {
        return pasadaItemRepository.findByActoIdOrderByOrdenAsc(actoId);
    }

    public PasadaItem findById(String id) {
        return pasadaItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PasadaItem no encontrado: " + id));
    }

    public PasadaItem create(String actoId, PasadaItemRequest request) {
        Acto acto = actoRepository.findById(actoId)
                .orElseThrow(() -> new RuntimeException("Acto no encontrado: " + actoId));

        PasadaItem item = new PasadaItem();
        item.setActo(acto);
        mapRequestToEntity(request, item);

        // Si no se especifica orden, añadir al final
        if (item.getOrden() == null || item.getOrden() == 0) {
            Integer maxOrden = pasadaItemRepository.findMaxOrdenByActoId(actoId);
            item.setOrden(maxOrden + 1);
        }

        return pasadaItemRepository.save(item);
    }

    public PasadaItem insertAt(String actoId, int orden, PasadaItemRequest request) {
        Acto acto = actoRepository.findById(actoId)
                .orElseThrow(() -> new RuntimeException("Acto no encontrado: " + actoId));

        // Tratar 'orden' como índice de inserción (0-based), robusto ante órdenes no normalizados
        List<PasadaItem> existentes = pasadaItemRepository.findByActoIdOrderByOrdenAsc(actoId);
        int insertPos = Math.max(0, Math.min(orden, existentes.size()));

        int targetOrden;
        if (existentes.isEmpty()) {
            targetOrden = 1;
        } else if (insertPos == existentes.size()) {
            Integer lastOrden = existentes.get(existentes.size() - 1).getOrden();
            targetOrden = (lastOrden != null ? lastOrden : existentes.size()) + 1;
        } else {
            Integer ordenAtPos = existentes.get(insertPos).getOrden();
            targetOrden = ordenAtPos != null ? ordenAtPos : insertPos + 1;
        }

        // Desplazar items existentes con orden >= targetOrden
        pasadaItemRepository.incrementOrdenFrom(actoId, targetOrden);

        PasadaItem item = new PasadaItem();
        item.setActo(acto);
        mapRequestToEntity(request, item);
        item.setOrden(targetOrden);

        return pasadaItemRepository.save(item);
    }

    public PasadaItem update(String id, PasadaItemRequest request) {
        PasadaItem item = findById(id);
        mapRequestToEntity(request, item);
        return pasadaItemRepository.save(item);
    }

    public void delete(String id) {
        if (!pasadaItemRepository.existsById(id)) {
            throw new RuntimeException("PasadaItem no encontrado: " + id);
        }
        pasadaItemRepository.deleteById(id);
    }

    /**
     * Reordena los items de pasada según la lista de IDs ordenada
     */
    public void reorder(String actoId, List<String> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            final int newOrden = i + 1;
            pasadaItemRepository.findById(orderedIds.get(i))
                .ifPresent(item -> {
                    item.setOrden(newOrden);
                    pasadaItemRepository.save(item);
                });
        }
    }

    private void mapRequestToEntity(PasadaItemRequest request, PasadaItem item) {
        if (request.getDepartamento() != null) {
            item.setDepartamento(request.getDepartamento());
        }
        if (request.getLugar() != null) {
            item.setLugar(request.getLugar());
        }
        if (request.getDescripcion() != null) {
            item.setDescripcion(request.getDescripcion());
        }
        if (request.getTipoItem() != null) {
            item.setTipoItem(request.getTipoItem());
        } else if (item.getTipoItem() == null) {
            item.setTipoItem(PasadaItem.TipoPasadaItem.INSTRUCCION_TECNICA);
        }
        if (request.getTituloPlano() != null) {
            item.setTituloPlano(request.getTituloPlano());
        }
        if (request.getImagen() != null) {
            item.setImagen(request.getImagen());
        }
        if (request.getOrden() != null) {
            item.setOrden(request.getOrden());
        }
    }
}
