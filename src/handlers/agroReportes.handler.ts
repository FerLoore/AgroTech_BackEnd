import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroReporte } from "../entities/AgroReporte";
import { AgroFinca } from "../entities/AgroFinca";
import { AgroUsuario } from "../entities/AgroUsuario";
import PDFDocument from "pdfkit-table";
import path from "path";

// SVG Paths para los íconos (simulando PrimeIcons)
const ICONS = {
    tree: "M12 2L4 15h5v7h6v-7h5L12 2z",
    alert: "M12 2L22 20H2L12 2ZM11 10V14H13V10H11ZM11 16V18H13V16H11Z",
    bell: "M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.9 16.3 5.4 13.5 4.7V4C13.5 3.2 12.8 2.5 12 2.5C11.2 2.5 10.5 3.2 10.5 4V4.7C7.7 5.4 6 7.9 6 11V16L4 18V19H20V18L18 16Z",
    chart: "M3 3V21H21V19H5V3H3ZM7 17L12 11L15 14L21 6L19.5 4.5L15 11L12 8L5.5 15.5L7 17Z",
    list: "M4 6H6V8H4V6ZM4 11H6V13H4V11ZM4 16H6V18H4V16ZM8 6H20V8H8V6ZM8 11H20V13H8V11ZM8 16H20V18H8V16Z",
    pie: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 4.07C16.94 4.56 20 7.92 20 12C20 12.18 20 12.35 19.98 12.53L13 12V4.07ZM11 4.07V13H2.07C2.56 9.05 5.92 6 11 4.07ZM11.5 14.5L18.36 18.36C16.8 19.98 14.55 21 12 21C6.98 21 2.91 16.96 2.05 14.5H11.5Z"
};

export const getReportes = async (req: Request, res: Response) => {
    try {
        const { fincaId } = req.query;
        const reporteRepository = AppDataSource.getRepository(AgroReporte);

        let reportes;
        const select = ["repo_reporte", "repo_fecha", "repo_tipo", "repo_secciones", "fin_finca", "usu_usuario", "repo_usuario_nombre"];
        
        if (fincaId) {
            reportes = await reporteRepository.find({
                select: select as any,
                where: { fin_finca: Number(fincaId) },
                order: { repo_fecha: "DESC" }
            });
        } else {
            reportes = await reporteRepository.find({
                select: select as any,
                order: { repo_fecha: "DESC" }
            });
        }

        res.json({ ok: true, reportes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error al obtener reportes" });
    }
};

export const getReportePdf = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reporteRepository = AppDataSource.getRepository(AgroReporte);
        
        const reporte = await reporteRepository.findOneBy({ repo_reporte: Number(id) });
        if (!reporte || !reporte.repo_pdf_base64) {
            return res.status(404).json({ ok: false, message: "PDF no encontrado" });
        }

        const pdfBuffer = Buffer.from(reporte.repo_pdf_base64, "base64");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="Reporte_AgroTech_${reporte.repo_reporte}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error al obtener PDF" });
    }
};

export const createReporte = async (req: Request, res: Response) => {
    try {
        const { fin_finca, usu_usuario, repo_tipo, repo_secciones, report_data } = req.body;
        console.log("DEBUG - report_data:", JSON.stringify(report_data, null, 2));

        const reporteRepository = AppDataSource.getRepository(AgroReporte);
        const fincaRepository = AppDataSource.getRepository(AgroFinca);
        const usuarioRepository = AppDataSource.getRepository(AgroUsuario);

        const finca = await fincaRepository.findOneBy({ fin_finca });
        const usuario = usu_usuario ? await usuarioRepository.findOneBy({ usu_usuario }) : null;

        const fincaNombre = finca ? finca.fin_nombre : "Desconocida";
        const usuarioNombre = usuario ? usuario.usu_nombre : "Sistema";

        // 0. Crear el registro en BD primero para obtener el ID real
        const reportePreliminar = reporteRepository.create({
            repo_tipo,
            repo_secciones,
            repo_pdf_base64: "PENDING",
            fin_finca,
            usu_usuario,
            repo_usuario_nombre: usuarioNombre
        });
        await reporteRepository.save(reportePreliminar);
        const reporteId = reportePreliminar.repo_reporte;

        // --- Generar PDF con PDFKit-Table en memoria ---
        const doc = new PDFDocument({ margin: 40, size: "A4", bufferPages: true });
        const buffers: Buffer[] = [];
        doc.on("data", (chunk) => buffers.push(chunk));

        // Flag para la portada
        let isCover = true;

        // Quitamos el listener doc.on('pageAdded') que causaba el bucle infinito y problemas de coordenadas
        // Ahora usaremos un post-proceso al final del documento.

        const promise = new Promise<string>((resolve, reject) => {
            doc.on("end", () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData.toString("base64"));
            });
            doc.on("error", reject);
        });

        // ================= REDISEÑO DEL PDF NATIVO =================
        const titleFont = "Times-Bold";
        const bodyFont = "Helvetica";
        const bodyBold = "Helvetica-Bold";

        // --- Función auxiliar para dibujar íconos SVG ---
        const drawIcon = (pathData: string, x: number, y: number, color: string, scale: number = 1) => {
            doc.save();
            doc.translate(x, y);
            doc.scale(scale);
            doc.path(pathData).fill(color);
            doc.restore();
        };

        // --- PÁGINA 1: PORTADA ---
        doc.rect(0, 0, 595, 842).fill("#2D4A2D");
        
        try {
            const logoPath = path.join(__dirname, "../../../AgroTech_Client/src/assets/AGROTECHLOGOsinfondo.png");
            doc.image(logoPath, 220, 200, { width: 150 });
        } catch (e) {
            console.error("No se pudo cargar el logo:", e);
        }

        doc.fillColor("white").font(titleFont).fontSize(42).text("AGROTECH", 0, 380, { align: "center", width: 595 });
        doc.font(bodyFont).fontSize(16).text("Sistema de Gestión Agrícola Inteligente", 0, 430, { align: "center", width: 595 });
        
        doc.moveDown(4);
        doc.font(titleFont).fontSize(24).text("INFORME FITOSANITARIO", 0, doc.y, { align: "center", width: 595 });
        
        doc.moveDown(2);
        doc.font(bodyFont).fontSize(14).text(`Finca: ${fincaNombre}`, 0, doc.y, { align: "center", width: 595 });
        doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 0, doc.y + 10, { align: "center", width: 595 });
        doc.text(`ID Reporte: #AT-${fin_finca}-${reporteId}`, 0, doc.y + 10, { align: "center", width: 595 });

        // --- PÁGINA 2: KPIS Y DONA ---
        isCover = false;
        doc.addPage();
        doc.fillColor("#000000");

        // Título de Sección
        drawIcon(ICONS.list, 40, 50, "#2D4A2D", 1.2);
        doc.font(titleFont).fontSize(22).fillColor("#2D4A2D").text(" Resumen de KPIs", 70, 50);
        doc.moveTo(40, 80).lineTo(555, 80).lineWidth(2).stroke("#2D4A2D");
        doc.moveDown(2);

        // KPIs
        if (report_data && report_data.kpis) {
            const blockWidth = 360;
            const cardWidth = 170;
            const cardHeight = 85;
            const gapX = 20;
            const gapY = 20;
            
            // Centrado en el ancho de la página (595 / 2 = 297.5)
            const startX = 297.5 - (blockWidth / 2);
            const startY = 110;

            const cards = [
                {
                    label: "ÁRBOLES FILTRADOS",
                    value: String(report_data.kpis.total || 0),
                    bg: "#E8F5E9",
                    border: "#2D4A2D",
                    icon: ICONS.tree,
                    col: 0, row: 0
                },
                {
                    label: "ÁRBOLES ENFERMOS",
                    value: String(report_data.kpis.enfermos || 0),
                    bg: "#FFF0F0",
                    border: "#ef4444",
                    icon: ICONS.alert,
                    col: 1, row: 0
                },
                {
                    label: "ALERTAS ACTIVAS",
                    value: String(report_data.kpis.activas || 0),
                    bg: "#FFF8F0",
                    border: "#f97316",
                    icon: ICONS.bell,
                    col: 0, row: 1
                },
                {
                    label: "INCIDENCIA PROM.",
                    value: String(report_data.kpis.incidencia || 0) + "%",
                    bg: "#F0F4FF",
                    border: "#3b82f6",
                    icon: ICONS.chart,
                    col: 1, row: 1
                }
            ];

            cards.forEach(card => {
                const x = startX + (card.col * (cardWidth + gapX));
                const y = startY + (card.row * (cardHeight + gapY));

                // Dibujar tarjeta con borde redondeado y clipping para el borde izquierdo
                doc.save();
                doc.roundedRect(x, y, cardWidth, cardHeight, 8).clip();
                doc.rect(x, y, cardWidth, cardHeight).fill(card.bg); // Fondo
                doc.rect(x, y, 6, cardHeight).fill(card.border);     // Borde grueso izquierdo
                doc.restore();

                // Textos
                doc.font(bodyBold).fontSize(9).fillColor("#555555").text(card.label, x + 16, y + 16);
                doc.font(titleFont).fontSize(32).fillColor(card.border).text(card.value, x + 16, y + 36);

                // Ícono a la derecha
                drawIcon(card.icon, x + cardWidth - 36, y + 32, card.border, 1.2);
            });

            doc.y = startY + (2 * cardHeight) + gapY + 15;
        }

        // GRÁFICO DE DONA NATIVO
        if (report_data && report_data.sintomasData && Array.isArray(report_data.sintomasData.labels) && report_data.sintomasData.labels.length > 0) {
            doc.moveDown(1);
            const chartTitleY = doc.y;
            drawIcon(ICONS.pie, 40, chartTitleY, "#2D4A2D", 1.2);
            doc.font(titleFont).fontSize(20).fillColor("#2D4A2D").text(" Frecuencia de Síntomas", 70, chartTitleY);
            doc.moveTo(40, chartTitleY + 30).lineTo(555, chartTitleY + 30).lineWidth(1).stroke("#e5e7eb");
            
            const cx = 150;
            const cy = chartTitleY + 130;
            const radius = 80;
            const innerRadius = 50;

            const data = report_data.sintomasData.datasets[0].data;
            const colors = report_data.sintomasData.datasets[0].backgroundColor;
            const labels = report_data.sintomasData.labels;
            const total = data.reduce((a: number, b: number) => a + b, 0);

            if (total > 0) {
                let startAngle = -Math.PI / 2;

                for (let i = 0; i < data.length; i++) {
                    if (data[i] === 0) continue;
                    const sliceAngle = (data[i] / total) * 2 * Math.PI;
                    const endAngle = startAngle + sliceAngle;

                    const x1 = cx + radius * Math.cos(startAngle);
                    const y1 = cy + radius * Math.sin(startAngle);
                    const x2 = cx + radius * Math.cos(endAngle);
                    const y2 = cy + radius * Math.sin(endAngle);
                    const largeArc = sliceAngle > Math.PI ? 1 : 0;

                    // Si es un círculo completo (solo 1 item)
                    if (sliceAngle >= 2 * Math.PI - 0.01) {
                        doc.circle(cx, cy, radius).fill(colors[i]);
                    } else {
                        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                        doc.path(pathData).fill(colors[i]);
                    }

                    startAngle = endAngle;
                }
            } else {
                doc.circle(cx, cy, radius).fill("#e5e7eb"); // Gris si no hay data
            }

            // Inner circle for doughnut
            doc.circle(cx, cy, innerRadius).fill("white");

            // Texto en el centro de la dona
            doc.font(titleFont).fontSize(24).fillColor("#2D4A2D").text(String(total), cx - 30, cy - 12, { width: 60, align: "center" });
            doc.font(bodyFont).fontSize(10).fillColor("#888888").text("Alertas", cx - 30, cy + 12, { width: 60, align: "center" });

            // Leyenda a la derecha
            let legendY = cy - radius + 10;
            for (let i = 0; i < data.length; i++) {
                if (data[i] === 0) continue;
                doc.circle(cx + 120, legendY + 5, 6).fill(colors[i]);
                doc.font(bodyBold).fontSize(12).fillColor("#333333").text(`${data[i]}`, cx + 135, legendY);
                doc.font(bodyFont).fontSize(12).fillColor("#666666").text(`- ${labels[i]} (${Math.round((data[i]/total)*100)}%)`, cx + 160, legendY);
                legendY += 22;
            }

            doc.y = Math.max(cy + radius + 20, legendY + 20); // Menos espacio vacío
        }

        // --- PÁGINA 3: TABLAS (Solo si hay data) ---
        const hasArboles = report_data && Array.isArray(report_data.arbolesCriticos) && report_data.arbolesCriticos.length > 0;
        const hasSecciones = report_data && Array.isArray(report_data.seccionesAtencion) && report_data.seccionesAtencion.length > 0;

        if (hasArboles || hasSecciones) {
            // Solo añadir página si no estamos ya en una página nueva limpia
            if (doc.y > 100) doc.addPage();
        }

        // TABLA ÁRBOLES CRÍTICOS
        if (hasArboles) {
            const table1Y = doc.y > 500 ? (doc.addPage(), 50) : doc.y + 30;
            drawIcon(ICONS.alert, 40, table1Y, "#2D4A2D", 1.2);
            doc.font(titleFont).fontSize(20).fillColor("#2D4A2D").text(" Top Árboles Críticos", 70, table1Y + 3);
            doc.moveDown(1.5);

            const tableArray = {
                headers: [
                    { label: "Rango", property: "rank", width: 60 },
                    { label: "Referencia", property: "referencia", width: 130 },
                    { label: "Sección", property: "seccion", width: 130 },
                    { label: "Estado", property: "estado", width: 100 },
                    { label: "Alertas", property: "alertas", width: 80 }
                ],
                datas: report_data.arbolesCriticos.map((a: any, idx: number) => ({
                    rank: String(a.rank || idx + 1),
                    referencia: String(a.referencia || a.id || "N/A"),
                    seccion: String(a.seccion_nombre || a.seccion_id || "N/A"),
                    estado: String(a.estado || "Sano"),
                    alertas: String(a.totalAlertas || a.alertas || "0")
                }))
            };

            await (doc as any).table(tableArray, {
                prepareHeader: () => doc.font(bodyBold).fontSize(10).fillColor("#000000"),
                prepareRow: () => doc.font(bodyFont).fontSize(10).fillColor("#000000"),
                x: 40,
                padding: 10
            });
        }

        // TABLA SECCIONES
        if (hasSecciones) {
            const table2Y = doc.y > 500 ? (doc.addPage(), 50) : doc.y + 40;
            drawIcon(ICONS.tree, 40, table2Y, "#2D4A2D", 1.2);
            doc.font(titleFont).fontSize(20).fillColor("#2D4A2D").text(" Secciones que Requieren Atención", 70, table2Y + 3);
            doc.moveDown(1.5);

            const tableArraySec = {
                headers: [
                    { label: "Sección", property: "nombre", width: 200 },
                    { label: "Total Árboles", property: "total", width: 150 },
                    { label: "Enfermos", property: "enfermos", width: 165 }
                ],
                datas: report_data.seccionesAtencion.map((s: any) => ({
                    nombre: String(s.nombre || s.seccion_nombre || "Desconocida"),
                    total: String(s.total || s.total_arboles || "0"),
                    enfermos: String(s.enfermos || s.total_enfermos || "0")
                }))
            };

            await (doc as any).table(tableArraySec, {
                prepareHeader: () => doc.font(bodyBold).fontSize(10).fillColor("#000000"),
                prepareRow: () => doc.font(bodyFont).fontSize(10).fillColor("#000000"),
                x: 40,
                padding: 10
            });
        }



        // ================= POST-PROCESADO DE PÁGINAS (Headers/Footers) =================
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            
            // No dibujar footer/marco en la portada (página 0)
            if (i === 0) continue;

            // IMPORTANTE: Desactivar márgenes temporalmente para evitar que el footer 
            // dispare una nueva página automática si está muy cerca del borde inferior
            const oldBottomMargin = doc.page.margins.bottom;
            doc.page.margins.bottom = 0;

            doc.save();
            
            // Marco verde
            doc.lineWidth(4).strokeColor("#2D4A2D").moveTo(0, 0).lineTo(0, 842).stroke();
            doc.lineWidth(2).strokeColor("#2D4A2D").moveTo(0, 0).lineTo(595, 0).stroke();
            doc.lineWidth(2).strokeColor("#2D4A2D").moveTo(0, 842).lineTo(595, 842).stroke();

            // Pie de página
            const footerY = 810;
            doc.lineWidth(1).strokeColor("#2D4A2D").moveTo(40, footerY - 10).lineTo(555, footerY - 10).stroke();
            
            try {
                const logoPath = path.join(__dirname, "../../../AgroTech_Client/src/assets/AGROTECHLOGOsinfondo.png");
                doc.image(logoPath, 40, footerY, { width: 12 });
            } catch (e) {}

            doc.font(bodyBold).fontSize(9).fillColor("#6b7280").text("AgroTech · Confidencial", 56, footerY + 2);
            doc.font(bodyFont).fontSize(9).fillColor("#6b7280").text(`Generado automáticamente · uso exclusivo de finca`, 0, footerY + 2, { align: "center", width: 595 });
            doc.font(bodyFont).fontSize(9).fillColor("#6b7280").text(`Página ${i + 1} de ${pages.count}`, 0, footerY + 2, { align: "right", width: 555 });

            doc.restore();
            
            // Restaurar margen
            doc.page.margins.bottom = oldBottomMargin;
        }

        // Finalize PDF file
        doc.end();

        // Esperar el base64
        const pdfBase64 = await promise;

        // Actualizar registro en base de datos
        reportePreliminar.repo_pdf_base64 = pdfBase64;
        await reporteRepository.save(reportePreliminar);

        res.status(201).json({ 
            ok: true, 
            message: "Reporte generado correctamente", 
            reporte: {
                repo_reporte: reportePreliminar.repo_reporte,
                repo_fecha: reportePreliminar.repo_fecha,
                repo_tipo: reportePreliminar.repo_tipo
            } 
        });

    } catch (error: any) {
        console.error("Error al crear reporte:", error);
        res.status(500).json({ ok: false, message: "Error al generar el reporte PDF: " + (error.message || "Desconocido") });
    }
};

export const deleteReporte = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reporteRepository = AppDataSource.getRepository(AgroReporte);
        
        const reporte = await reporteRepository.findOneBy({ repo_reporte: Number(id) });
        if (!reporte) {
            return res.status(404).json({ ok: false, message: "Reporte no encontrado" });
        }

        await reporteRepository.remove(reporte);
        res.json({ ok: true, message: "Reporte eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error al eliminar reporte" });
    }
};
