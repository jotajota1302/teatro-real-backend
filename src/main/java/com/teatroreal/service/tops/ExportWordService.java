package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.*;
import com.teatroreal.repository.tops.GuionRepository;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Servicio para exportar guiones a formato Word (.docx)
 * Según especificación reglas-tops1.md
 */
@Service
@Transactional(readOnly = true)
public class ExportWordService {

    @Autowired
    private GuionRepository guionRepository;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Exporta un guion completo a documento Word
     */
    public byte[] exportToWord(String guionId) throws IOException {
        // Cargar guion con actos primero
        Guion guion = guionRepository.findByIdWithActos(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        // Forzar inicialización de todas las colecciones lazy dentro de la transacción
        for (Acto acto : guion.getActos()) {
            acto.getPasadaItems().size();
            for (Escena escena : acto.getEscenas()) {
                escena.getElementos().size();
            }
        }

        try (XWPFDocument document = new XWPFDocument()) {
            // Portada / Encabezado del documento
            addTitleSection(document, guion);

            // Contenido: Actos
            List<Acto> actos = new ArrayList<>(guion.getActos());
            actos.sort(Comparator.comparing(Acto::getOrden));

            for (Acto acto : actos) {
                addActo(document, acto);
            }

            // Footer info
            addFooterInfo(document, guion);

            // Escribir a bytes
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.write(out);
            return out.toByteArray();
        }
    }

    private void addTitleSection(XWPFDocument document, Guion guion) {
        // Header
        XWPFParagraph headerPara = document.createParagraph();
        headerPara.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun headerRun = headerPara.createRun();
        headerRun.setText("TEATRO REAL - GUION DE REGIDURÍA");
        headerRun.setBold(true);
        headerRun.setFontSize(10);
        headerRun.addBreak();

        // Título principal
        XWPFParagraph titlePara = document.createParagraph();
        titlePara.setAlignment(ParagraphAlignment.CENTER);
        titlePara.setSpacingAfter(200);
        XWPFRun titleRun = titlePara.createRun();
        titleRun.setText(guion.getProduccionNombre() != null ? guion.getProduccionNombre().toUpperCase() : "GUION TÉCNICO");
        titleRun.setBold(true);
        titleRun.setFontSize(24);
        titleRun.setFontFamily("Times New Roman");

        // Subtítulo
        if (guion.getSubtitulo() != null && !guion.getSubtitulo().isEmpty()) {
            XWPFParagraph subPara = document.createParagraph();
            subPara.setAlignment(ParagraphAlignment.CENTER);
            subPara.setSpacingAfter(100);
            XWPFRun subRun = subPara.createRun();
            subRun.setText(guion.getSubtitulo());
            subRun.setItalic(true);
            subRun.setFontSize(14);
            subRun.setFontFamily("Times New Roman");
        }

        // Compositor
        if (guion.getCompositor() != null && !guion.getCompositor().isEmpty()) {
            XWPFParagraph compPara = document.createParagraph();
            compPara.setAlignment(ParagraphAlignment.CENTER);
            compPara.setSpacingAfter(400);
            XWPFRun compRun = compPara.createRun();
            compRun.setText(guion.getCompositor());
            compRun.setFontSize(12);
            compRun.setFontFamily("Times New Roman");
        }

        // Metadatos
        addMetaLine(document, "Producción:", guion.getCompania());
        addMetaLine(document, "Director de Escena:", guion.getDirectorEscena());
        addMetaLine(document, "Director Musical:", guion.getDirectorMusical());
        addMetaLine(document, "Versión:",
            (guion.getVersion() != null ? guion.getVersion() : 1) +
            " - " + (guion.getVersionNombre() != null ? guion.getVersionNombre() : "Inicial"));

        // Separador
        XWPFParagraph sepPara = document.createParagraph();
        sepPara.setSpacingBefore(400);
        sepPara.setSpacingAfter(400);
        XWPFRun sepRun = sepPara.createRun();
        sepRun.setText("─".repeat(80));
    }

    private void addMetaLine(XWPFDocument document, String label, String value) {
        XWPFParagraph para = document.createParagraph();
        para.setSpacingAfter(50);

        XWPFRun labelRun = para.createRun();
        labelRun.setText(label + " ");
        labelRun.setBold(true);
        labelRun.setFontSize(10);

        XWPFRun valueRun = para.createRun();
        valueRun.setText(value != null ? value : "-");
        valueRun.setFontSize(10);
    }

    private void addActo(XWPFDocument document, Acto acto) {
        // Título del acto
        XWPFParagraph actoPara = document.createParagraph();
        actoPara.setSpacingBefore(600);
        actoPara.setSpacingAfter(200);
        XWPFRun actoRun = actoPara.createRun();
        actoRun.setText(acto.getNombre() != null ? acto.getNombre().toUpperCase() : "ACTO");
        actoRun.setBold(true);
        actoRun.setFontSize(16);
        actoRun.setFontFamily("Times New Roman");
        actoRun.setUnderline(UnderlinePatterns.SINGLE);

        // Tabla Pasada
        List<PasadaItem> pasadaItems = new ArrayList<>(acto.getPasadaItems());
        if (!pasadaItems.isEmpty()) {
            pasadaItems.sort(Comparator.comparing(PasadaItem::getOrden));
            addPasadaSection(document, pasadaItems);
        }

        // Escenas
        List<Escena> escenas = new ArrayList<>(acto.getEscenas());
        escenas.sort(Comparator.comparing(Escena::getOrden));
        for (Escena escena : escenas) {
            addEscena(document, escena);
        }
    }

    private void addPasadaSection(XWPFDocument document, List<PasadaItem> items) {
        // Título Pasada
        XWPFParagraph pasadaTitlePara = document.createParagraph();
        pasadaTitlePara.setSpacingBefore(300);
        pasadaTitlePara.setSpacingAfter(100);
        XWPFRun pasadaTitleRun = pasadaTitlePara.createRun();
        pasadaTitleRun.setText("PASADA");
        pasadaTitleRun.setBold(true);
        pasadaTitleRun.setFontSize(12);

        // Tabla pasada: DPTO | LUGAR | DESCRIPCIÓN
        XWPFTable table = document.createTable(items.size() + 1, 3);
        table.setWidth("100%");

        // Header row
        XWPFTableRow headerRow = table.getRow(0);
        setCell(headerRow.getCell(0), "DPTO", true);
        setCell(headerRow.getCell(1), "LUGAR", true);
        setCell(headerRow.getCell(2), "DESCRIPCIÓN", true);

        // Data rows
        for (int i = 0; i < items.size(); i++) {
            PasadaItem item = items.get(i);
            XWPFTableRow row = table.getRow(i + 1);
            setCell(row.getCell(0), item.getDepartamento(), false);
            setCell(row.getCell(1), item.getLugar(), false);
            setCell(row.getCell(2), item.getDescripcion(), false);
        }
    }

    private void addEscena(XWPFDocument document, Escena escena) {
        // Título escena
        XWPFParagraph escenaTitlePara = document.createParagraph();
        escenaTitlePara.setSpacingBefore(400);
        escenaTitlePara.setSpacingAfter(100);
        XWPFRun escenaTitleRun = escenaTitlePara.createRun();
        String escenaTitle = "ESCENA: " + (escena.getNombre() != null ? escena.getNombre().toUpperCase() : "");
        if (escena.getDuracion() != null && !escena.getDuracion().isEmpty()) {
            escenaTitle += " (c. " + escena.getDuracion() + ")";
        }
        escenaTitleRun.setText(escenaTitle);
        escenaTitleRun.setBold(true);
        escenaTitleRun.setFontSize(11);

        // Tabla TOPs
        List<ElementoGuion> elementos = new ArrayList<>(escena.getElementos());
        if (elementos.isEmpty()) {
            return;
        }
        elementos.sort(Comparator.comparing(ElementoGuion::getOrden));

        XWPFTable table = document.createTable(elementos.size() + 1, 5);
        table.setWidth("100%");

        // Header row
        XWPFTableRow headerRow = table.getRow(0);
        setCell(headerRow.getCell(0), "PIE", true);
        setCell(headerRow.getCell(1), "TOP", true);
        setCell(headerRow.getCell(2), "DPTO", true);
        setCell(headerRow.getCell(3), "QUIEN/QUE", true);
        setCell(headerRow.getCell(4), "OBSERVACIONES", true);

        // Data rows
        for (int i = 0; i < elementos.size(); i++) {
            ElementoGuion elem = elementos.get(i);
            XWPFTableRow row = table.getRow(i + 1);
            setCell(row.getCell(0), elem.getPieFormateado(), false);
            setCell(row.getCell(1), formatTopCell(elem), elem.getTipoElemento() == ElementoGuion.TipoElemento.TOP);
            setCell(row.getCell(2), elem.getDepartamento(), false);
            setCell(row.getCell(3), elem.getEncabezado(), false);
            setCell(row.getCell(4), elem.getContenido(), false);
        }
    }

    private String formatTopCell(ElementoGuion elem) {
        if (elem.getTipoElemento() == ElementoGuion.TipoElemento.TOP) {
            return elem.getNumeroTop() != null ? elem.getNumeroTop() : "";
        }
        switch (elem.getTipoElemento()) {
            case ENTRADA: return "E";
            case MUTIS: return "M";
            case INTERNO: return "INT";
            default: return elem.getTipoElemento() != null ? elem.getTipoElemento().name() : "";
        }
    }

    private void setCell(XWPFTableCell cell, String text, boolean bold) {
        XWPFParagraph para = cell.getParagraphs().get(0);
        XWPFRun run = para.createRun();
        run.setText(text != null ? text : "");
        run.setFontSize(9);
        run.setFontFamily("Arial");
        if (bold) {
            run.setBold(true);
        }
    }

    private void addFooterInfo(XWPFDocument document, Guion guion) {
        XWPFParagraph footerPara = document.createParagraph();
        footerPara.setSpacingBefore(600);
        footerPara.setAlignment(ParagraphAlignment.CENTER);

        XWPFRun footerRun = footerPara.createRun();
        String fechaActualizacion = guion.getUpdatedAt() != null
            ? guion.getUpdatedAt().format(DATE_FORMAT)
            : LocalDateTime.now().format(DATE_FORMAT);
        footerRun.setText("Documento generado: " + fechaActualizacion);
        footerRun.setFontSize(8);
        footerRun.setItalic(true);
    }
}
