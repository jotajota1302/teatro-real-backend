package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.*;
import com.teatroreal.repository.tops.GuionRepository;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTcPr;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTVMerge;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge;
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
 * SegÃºn especificaciÃ³n reglas-tops1.md
 */
@Service
@Transactional(readOnly = true)
public class ExportWordService {

    @Autowired
    private GuionRepository guionRepository;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final String FONT_FAMILY = "Calibri";

    /**
     * Exporta un guion completo a documento Word
     */
    public byte[] exportToWord(String guionId) throws IOException {
        // Cargar guion con actos primero
        Guion guion = guionRepository.findByIdWithActos(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        // Forzar inicializaciÃ³n de todas las colecciones lazy dentro de la transacciÃ³n
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
        headerRun.setText("TEATRO REAL - GUION DE REGIDURÃA");
        headerRun.setBold(true);
        headerRun.setFontSize(10);
        headerRun.setFontFamily(FONT_FAMILY);
        headerRun.addBreak();

        // TÃ­tulo principal
        XWPFParagraph titlePara = document.createParagraph();
        titlePara.setAlignment(ParagraphAlignment.CENTER);
        titlePara.setSpacingAfter(200);
        XWPFRun titleRun = titlePara.createRun();
        titleRun.setText(guion.getProduccionNombre() != null ? guion.getProduccionNombre().toUpperCase() : "GUION TÃ‰CNICO");
        titleRun.setBold(true);
        titleRun.setFontSize(24);
        titleRun.setFontFamily(FONT_FAMILY);

        // SubtÃ­tulo
        if (guion.getSubtitulo() != null && !guion.getSubtitulo().isEmpty()) {
            XWPFParagraph subPara = document.createParagraph();
            subPara.setAlignment(ParagraphAlignment.CENTER);
            subPara.setSpacingAfter(100);
            XWPFRun subRun = subPara.createRun();
            subRun.setText(guion.getSubtitulo());
            subRun.setItalic(true);
            subRun.setFontSize(14);
            subRun.setFontFamily(FONT_FAMILY);
        }

        // Compositor
        if (guion.getCompositor() != null && !guion.getCompositor().isEmpty()) {
            XWPFParagraph compPara = document.createParagraph();
            compPara.setAlignment(ParagraphAlignment.CENTER);
            compPara.setSpacingAfter(400);
            XWPFRun compRun = compPara.createRun();
            compRun.setText(guion.getCompositor());
            compRun.setFontSize(12);
            compRun.setFontFamily(FONT_FAMILY);
        }

        // Metadatos
        addMetaLine(document, "ProducciÃ³n:", guion.getCompania());
        addMetaLine(document, "Productor:", guion.getProductor());
        addMetaLine(document, "Edición:", guion.getResponsableEdicion());
        addMetaLine(document, "Director de Escena:", guion.getDirectorEscena());
        addMetaLine(document, "Director Musical:", guion.getDirectorMusical());
        addMetaLine(document, "VersiÃ³n:",
            (guion.getVersion() != null ? guion.getVersion() : 1) +
            " - " + (guion.getVersionNombre() != null ? guion.getVersionNombre() : "Inicial"));

        // Separador
        XWPFParagraph sepPara = document.createParagraph();
        sepPara.setSpacingBefore(400);
        sepPara.setSpacingAfter(400);
        XWPFRun sepRun = sepPara.createRun();
        sepRun.setText("â”€".repeat(80));
        sepRun.setFontFamily(FONT_FAMILY);
    }

    private void addMetaLine(XWPFDocument document, String label, String value) {
        XWPFParagraph para = document.createParagraph();
        para.setSpacingAfter(50);

        XWPFRun labelRun = para.createRun();
        labelRun.setText(label + " ");
        labelRun.setBold(true);
        labelRun.setFontSize(10);
        labelRun.setFontFamily(FONT_FAMILY);

        XWPFRun valueRun = para.createRun();
        valueRun.setText(value != null ? value : "-");
        valueRun.setFontSize(10);
        valueRun.setFontFamily(FONT_FAMILY);
    }

    private void addActo(XWPFDocument document, Acto acto) {
        // TÃ­tulo del acto
        XWPFParagraph actoPara = document.createParagraph();
        actoPara.setSpacingBefore(600);
        actoPara.setSpacingAfter(200);
        XWPFRun actoRun = actoPara.createRun();
        actoRun.setText(acto.getNombre() != null ? acto.getNombre().toUpperCase() : "ACTO");
        actoRun.setBold(true);
        actoRun.setFontSize(16);
        actoRun.setFontFamily(FONT_FAMILY);
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
        // TÃ­tulo Pasada
        XWPFParagraph pasadaTitlePara = document.createParagraph();
        pasadaTitlePara.setSpacingBefore(300);
        pasadaTitlePara.setSpacingAfter(100);
        XWPFRun pasadaTitleRun = pasadaTitlePara.createRun();
        pasadaTitleRun.setText("PASADA");
        pasadaTitleRun.setBold(true);
        pasadaTitleRun.setFontSize(12);
        pasadaTitleRun.setFontFamily(FONT_FAMILY);

        // Tabla pasada: DPTO | LUGAR | DESCRIPCIÃ“N
        XWPFTable table = document.createTable(items.size() + 1, 3);
        table.setWidth("100%");

        // Header row
        XWPFTableRow headerRow = table.getRow(0);
        setCell(headerRow.getCell(0), "DPTO", true);
        setCell(headerRow.getCell(1), "LUGAR", true);
        setCell(headerRow.getCell(2), "DESCRIPCIÃ“N", true);

        // Data rows
        for (int i = 0; i < items.size(); i++) {
            PasadaItem item = items.get(i);
            XWPFTableRow row = table.getRow(i + 1);
            if (item.getTipoItem() == PasadaItem.TipoPasadaItem.PLANO_ESCENARIO) {
                setCell(row.getCell(0), "PLANO", true);
                setCell(row.getCell(1), item.getTituloPlano(), false);
                setCell(row.getCell(2), item.getDescripcion(), false);
            } else {
                setCell(row.getCell(0), item.getDepartamento(), false);
                setCell(row.getCell(1), item.getLugar(), false);
                setCell(row.getCell(2), item.getDescripcion(), false);
            }
        }

        // Agrupar visualmente por DPTO en filas consecutivas de instrucción técnica.
        int groupStart = -1;
        String currentDept = null;
        for (int i = 0; i < items.size(); i++) {
            PasadaItem item = items.get(i);
            String dept = item.getDepartamento() != null ? item.getDepartamento().trim() : "";
            boolean eligible = item.getTipoItem() != PasadaItem.TipoPasadaItem.PLANO_ESCENARIO && !dept.isEmpty();

            if (!eligible) {
                applyPasadaDeptMerge(table, groupStart, i - 1);
                groupStart = -1;
                currentDept = null;
                continue;
            }

            if (groupStart < 0) {
                groupStart = i;
                currentDept = dept;
                continue;
            }

            if (!dept.equals(currentDept)) {
                applyPasadaDeptMerge(table, groupStart, i - 1);
                groupStart = i;
                currentDept = dept;
            }
        }
        applyPasadaDeptMerge(table, groupStart, items.size() - 1);
    }

    private void applyPasadaDeptMerge(XWPFTable table, int startDataIndex, int endDataIndex) {
        if (startDataIndex < 0 || endDataIndex <= startDataIndex) return;
        mergeCellVertically(table, 0, startDataIndex + 1, endDataIndex + 1);
    }

    private void mergeCellVertically(XWPFTable table, int col, int fromRow, int toRow) {
        for (int rowIndex = fromRow; rowIndex <= toRow; rowIndex++) {
            XWPFTableCell cell = table.getRow(rowIndex).getCell(col);
            CTTcPr tcPr = cell.getCTTc().isSetTcPr() ? cell.getCTTc().getTcPr() : cell.getCTTc().addNewTcPr();
            CTVMerge vMerge = tcPr.isSetVMerge() ? tcPr.getVMerge() : tcPr.addNewVMerge();
            if (rowIndex == fromRow) {
                vMerge.setVal(STMerge.RESTART);
            } else {
                vMerge.setVal(STMerge.CONTINUE);
                cell.removeParagraph(0);
                cell.addParagraph();
            }
        }
    }

    private void addEscena(XWPFDocument document, Escena escena) {
        // TÃ­tulo escena
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
        escenaTitleRun.setFontFamily(FONT_FAMILY);

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
        run.setFontFamily(FONT_FAMILY);
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
        footerRun.setFontFamily(FONT_FAMILY);
    }
}
