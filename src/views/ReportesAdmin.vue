<template>
    <v-layout>
        <v-flex>
            <div class="mt-4">
                <h1>Todas los reportes</h1>
                <v-card>
                    <v-card-title>
                    <v-text-field
                        v-model="search"
                        append-icon="fas fa-search"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="listadoReportes"
                        :search="search"
                    >
                        <template v-slot:[`item.rEmpresa`]="{item}">
                            <v-chip color="secondary" style="color: rgb(57, 162, 227) !important; background: rgb(230, 243, 251) !important; font-size: 11px; height: 22px;">
                                {{ item.rEmpresa }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{item}">
                            <v-list-item @click="generarReporte(item)">
                                <v-icon class="">mdi-arrow-down-bold-circle</v-icon>
                            </v-list-item>
                        </template>
                    </v-data-table>
                </v-card>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import html2canvas from 'html2canvas'
import { mapActions, mapState } from "vuex"

export default {
    name: 'ListadoLeyes',
    data () {
      return {
        search: '',
        headers: [
            { text: 'Decreto', value: 'decreto' },
            { text: 'Fecha evaluación', value: 'fevaluacion' },
            { text: 'Empresa', value: 'nEmpresa' },
            { text: 'Región empresa', value: 'rEmpresa' },
            { text: 'Acción', value: 'actions' },
        ],
        documento: '',
        resumen: '',
        progreso: '',
        detalleCalificaciones: '',
        tablero: '',
        empresa: '',
        ley: '',
        titulos: [],
      }
    },
    components: {
    },
    computed: {
        ...mapState(['listadoReportes'])
    },
    methods: {
        ...mapActions(['getListadoReportes']),
        generarReporte(payload) {
            this.documento = payload.documento
            this.resumen = payload.resumen
            this.progreso = payload.progreso
            this.detalleCalificaciones = payload.detalleCalificaciones
            this.tablero = payload.tablero
            this.empresa = payload.empresa
            this.ley = payload.ley
            this.titulos = payload.titulos
            this.generarReportePDF()
        },

        crearHTMLReporte() {
            return `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #673ab7; margin-top: 0;">Resumen Estadístico Auditoría:</h2>
                    <div style="display: flex; justify-content: space-around; text-align: center;">
                    <div style="color: #4caf50;"><strong>${this.resumen.cumple}</strong><br>Cumple</div>
                    <div style="color: #ff9800;"><strong>${this.resumen.parcial}</strong><br>Parcial</div>
                    <div style="color: #f44336;"><strong>${this.resumen.noCumple}</strong><br>No Cumple</div>
                    <div style="color: #9e9e9e;"><strong>${this.resumen.noAplica}</strong><br>No Aplica</div>
                    </div>
                    <p style="text-align: center; margin: 10px 0;">
                    <strong>Auditoría completada al: ${this.progreso.porcentaje.toFixed(1)}%</strong>
                    </p>
                    
                    <!-- Barra de progreso -->
                    <div style="width: 100%; background: #ddd; border-radius: 8px; height: 20px; margin: 10px 0;">
                    <div style="
                        width: ${this.progreso.porcentaje.toFixed(1)}%; 
                        background: linear-gradient(90deg, #4caf50, #81c784); 
                        height: 100%; 
                        border-radius: 8px;
                        transition: width 0.5s ease;">
                    </div>
                    </div>
                </div>
                
                <h2 style="color: #1976d2;">DETALLE DE CALIFICACIONES</h2>
                
                ${this.generarDetalleHTML()}
                </div>
            `
        },
        
        generarDetalleHTML() {
        let html = ''
        
        this.titulos.forEach(titulo => {
            html += `<h3 style="color: #1976d2; margin-top: 25px;">${titulo.numero}. ${titulo.nombre}</h3>`
            
            titulo.capitulos.forEach(capitulo => {
            html += `<h4 style="color: #1565c0; margin-left: 10px;">Capítulo ${capitulo.numero}: ${capitulo.nombre}</h4>`
            
            capitulo.articulos.forEach(articulo => {
                const calificacionArt = this.getCalificacionArticulo(articulo.id)
                const estadoTexto = calificacionArt ? this.getTextoEstado(calificacionArt.estado) : 'Sin calificar'
                const color = this.getColorHTML(calificacionArt?.estado)
                
                html += `
                <div style="margin-left: 20px; margin-bottom: 15px; border-left: 3px solid ${color}; padding-left: 10px;">
                    <h5 style="margin: 5px 0;">${articulo.nombre}</h5>
                    <p style="color: ${color}; font-weight: bold;">Estado: ${estadoTexto}</p>
                    ${calificacionArt?.comentario ? `<p><em>Comentario: ${calificacionArt.comentario}</em></p>` : ''}
                    
                    ${this.generarIncisosHTML(articulo)}
                </div>
                `
            })
            })
        })
        
        return html
        },
        
        generarIncisosHTML(articulo) {
        let html = ''
        
        articulo.elementos.forEach((elemento, index) => {
            if (elemento.tipo === 'inciso') {
            const calificacionInc = this.getCalificacionInciso(articulo.id, elemento.id)
            const estadoTexto = calificacionInc ? this.getTextoEstado(calificacionInc.estado) : 'Sin calificar'
            const color = this.getColorHTML(calificacionInc?.estado)
            const numeroInciso = this.getNumeroInciso(articulo.elementos, index, elemento.tipoInciso)
            
            html += `
                <div style="margin-left: 15px; margin-bottom: 8px;">
                <p style="margin: 2px 0;"><strong>${numeroInciso})</strong> ${elemento.contenido}</p>
                <p style="color: ${color}; font-size: 12px; margin: 2px 0;">Estado: ${estadoTexto}</p>
                ${calificacionInc?.comentario ? `<p style="font-size: 11px; color: #666; margin: 2px 0;"><em>${calificacionInc.comentario}</em></p>` : ''}
                </div>
            `
            }
        })
        
        return html
        },
        
        getColorHTML(estado) {
        const colores = {
            'cumple': '#4caf50',
            'parcial': '#ff9800', 
            'no_cumple': '#f44336',
            'no_aplica': '#9e9e9e'
        }
        return colores[estado] || '#000000'
        },
        
        // FUNCIÓN PDF MODIFICADA PARA INCLUIR NIVEL DE MADUREZ
        async generarReportePDF() {
        try {
            const { jsPDF } = window.jspdf
            const doc = new jsPDF()
            
            // Obtener información del nivel de madurez
            const infoNivel = this.obtenerInformacionNivelMadurez()
            
            // Configuración de colores
            const azulPrimario = [65, 105, 225]
            const azulSecundario = [70, 130, 180]
            
            // ENCABEZADO PRINCIPAL
            doc.setFillColor(...azulPrimario)
            doc.rect(0, 0, 210, 70, 'F')
            
            // Nombre de la empresa
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(28)
            doc.setFont('helvetica', 'bold')
            // const nombreEmpresa = "Nombre empresa" // Variable personalizable
            // doc.text(nombreEmpresa, 105, 25, { align: 'center' })
            
            // // Ley evaluada
            // doc.setFontSize(14)
            // doc.setFont('helvetica', 'normal')
            // doc.text("Ley evaluada", 105, 35, { align: 'center' })

            doc.setFont('helvetica', 'bold')
            const nombreReporte = "Cumplimiento Legal de la empresa:" // Variable personalizable
            doc.text(nombreReporte, 105, 20, { align: 'center' })
            doc.setFont('helvetica', 'bold')
            const nombreEmpresa = this.tablero.nombre
            doc.text(nombreEmpresa, 105, 35, { align: 'center' })
            
            // Ley evaluada (más pequeño, centrado)
            doc.setFontSize(14)
            doc.setFont('helvetica', 'normal')
            doc.text(`Decreto: ${this.documento.numeroLey}`, 105, 45, { align: 'center' })
            doc.text(`Fecha del decreto: ${this.documento.fecha}`, 105, 53, { align: 'center' })
            doc.text(`Fecha de Evaluación: ${this.documento.fechaEvaluacion}`, 105, 61, { align: 'center' })
            
            // SECCIÓN: NIVEL DE MADUREZ (ACTUALIZADA CON CÁLCULO)
            let yPos = 75
            doc.setFillColor(...azulSecundario)
            doc.rect(20, yPos, 170, 12, 'F')
            
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text(`Nivel de madurez ${infoNivel.nivel} - ${infoNivel.nombreNivel}`, 105, yPos + 8, { align: 'center' })
            
            // Descripción del nivel (usando la descripción real del nivel calculado)
            yPos += 25
            doc.setTextColor(100, 100, 100)
            doc.setFontSize(9)
            doc.setFont('helvetica', 'normal')
            const descripcionLineas = doc.splitTextToSize(infoNivel.descripcion, 170)
            descripcionLineas.forEach(linea => {
            doc.text(linea, 105, yPos, { align: 'center' })
            yPos += 4
            })
            
            // Porcentaje de cumplimiento destacado
            yPos += 10
            doc.setTextColor(25, 118, 210)
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')
            doc.text(`Porcentaje de Cumplimiento: ${infoNivel.porcentaje.toFixed(1)}%`, 105, yPos, { align: 'center' })
            
            // SECCIÓN: RESUMEN Y RECOMENDACIONES
            yPos += 20
            doc.setFillColor(...azulSecundario)
            doc.rect(20, yPos, 170, 12, 'F')
            
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text("Resultado auditoría", 105, yPos + 8, { align: 'center' })
            
            // GRÁFICA DE BARRAS
            yPos += 30
            this.dibujarGraficaBarras(doc, yPos)
            
            // Párrafo explicativo (usando la plantilla personalizada)
            yPos += 80
            doc.setTextColor(50, 50, 50)
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            const plantillaLineas = doc.splitTextToSize(infoNivel.plantillaParrafo, 170)
            plantillaLineas.forEach(linea => {
            doc.text(linea, 105, yPos, { align: 'center' })
            yPos += 4
            })
            
            // SEGUNDA PÁGINA: INFORMACIÓN DETALLADA DEL NIVEL
            doc.addPage()
            yPos = 20

            doc.setFillColor(...azulSecundario)
            doc.rect(20, yPos, 170, 12, 'F')
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text("Gráfica nivel de madurez", 105, yPos + 8, { align: 'center' })

            // GRÁFICA DE BARRAS
            yPos += 30
            this.dibujarGraficaNivelesVisual(doc, yPos)

            doc.addPage()
            yPos = 20
            
            // Título de la página
            doc.setFillColor(...azulSecundario)
            doc.rect(20, yPos, 170, 12, 'F')
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text("Información Detallada del Nivel de Madurez", 105, yPos + 8, { align: 'center' })
            
            yPos += 25
            
            // Razón de ubicación en este nivel
            doc.setTextColor(0, 0, 0)
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            doc.text("¿Por qué se ubica en este nivel?", 20, yPos)
            yPos += 10
            
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            const razonLineas = doc.splitTextToSize(infoNivel.razonUbicacion, 170)
            razonLineas.forEach(linea => {
            doc.text(linea, 20, yPos)
            yPos += 5
            })
            
            yPos += 10
            
            // Evidencia mínima esperada
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            doc.text("Evidencia mínima en el sistema:", 20, yPos)
            yPos += 10
            
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            const evidenciaLineas = doc.splitTextToSize(infoNivel.evidenciaMinima, 170)
            evidenciaLineas.forEach(linea => {
            doc.text(linea, 20, yPos)
            yPos += 5
            })
            
            yPos += 10
            
            // Recomendaciones para mejorar
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            const tituloRecomendacion = infoNivel.nivel === 4 ? "Para sostener el nivel:" : "Para subir de nivel:"
            doc.text(tituloRecomendacion, 20, yPos)
            yPos += 10
            
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            infoNivel.recomendaciones.forEach(recomendacion => {
            doc.text(`• ${recomendacion}`, 25, yPos)
            yPos += 6
            })
            
            // TERCERA PÁGINA: ARTÍCULOS EVALUADOS
            doc.addPage()
            yPos = 20
            
            doc.setFillColor(...azulSecundario)
            doc.rect(20, yPos, 170, 12, 'F')
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text("Artículos evaluados", 105, yPos + 8, { align: 'center' })
            
            // DETALLE DE CALIFICACIONES
            yPos += 25
            this.generarDetalleCalificacionesPDF(doc, yPos)

            // Crear HTML del reporte
            const reporteHTML = this.crearHTMLReporte()
            
            // Crear elemento temporal
            const elemento = document.createElement('div')
            elemento.innerHTML = reporteHTML
            elemento.style.position = 'absolute'
            elemento.style.left = '-9999px'
            elemento.style.width = '800px'
            elemento.style.padding = '20px'
            elemento.style.backgroundColor = 'white'
            elemento.style.fontFamily = 'Arial, sans-serif'
            
            document.body.appendChild(elemento)
            
            // Convertir a canvas
            const canvas = await html2canvas(elemento)

            // Crear PDF usando CDN de jsPDF
            // const { jsPDF } = window.jspdf
            // const pdf = new jsPDF('p', 'mm', 'a4')
            
            const imgData = canvas.toDataURL('image/png')
            const imgWidth = 210
            const pageHeight = 295
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            let heightLeft = imgHeight
            
            let position = 0
            
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
            
            while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            doc.addPage()
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
            }
            
            // Limpiar
            document.body.removeChild(elemento)
            
            // Descargar PDF
            doc.save(`Reporte_NivelMadurez_${this.documento.numeroLey}_${new Date().toISOString().split('T')[0]}.pdf`)
            // this.mostrarSnackbar('Reporte con Nivel de Madurez generado correctamente', 'success')
            
        } catch (error) {
            console.error('Error generando PDF:', error)
            // this.mostrarSnackbar('Error al generar el PDF', 'error')
        }
        },

        // FUNCIÓN PARA CALCULAR NIVEL DE MADUREZ
        calcularNivelMadurez() {
        let totalPuntaje = 0
        let totalElementos = 0
        
        // Contar y sumar puntajes de artículos e incisos
        this.titulos.forEach(titulo => {
            titulo.capitulos.forEach(capitulo => {
            capitulo.articulos.forEach(articulo => {
                // Evaluar artículo
                const calificacionArt = this.getCalificacionArticulo(articulo.id)
                if (calificacionArt && calificacionArt.estado) {
                totalPuntaje += this.getPuntajeEstado(calificacionArt.estado)
                totalElementos++
                }
                
                // Evaluar incisos
                articulo.elementos.forEach(elemento => {
                if (elemento.tipo === 'inciso') {
                    const calificacionInc = this.getCalificacionInciso(articulo.id, elemento.id)
                    if (calificacionInc && calificacionInc.estado) {
                    totalPuntaje += this.getPuntajeEstado(calificacionInc.estado)
                    totalElementos++
                    }
                }
                })
            })
            })
        })
        
        // Calcular porcentaje
        const porcentajeCumplimiento = totalElementos > 0 ? (totalPuntaje / totalElementos) * 100 : 0
        
        // Determinar nivel
        const nivel = this.determinarNivel(porcentajeCumplimiento)
        
        return {
            porcentaje: porcentajeCumplimiento,
            nivel: nivel.numero,
            nombreNivel: nivel.nombre,
            descripcion: nivel.descripcion,
            totalElementos,
            totalPuntaje,
            razonUbicacion: nivel.razonUbicacion,
            evidenciaMinima: nivel.evidenciaMinima,
            plantillaParrafo: this.generarPlantillaParrafo(porcentajeCumplimiento, nivel)
        }
        },

        // FUNCIÓN PARA OBTENER PUNTAJE POR ESTADO
        getPuntajeEstado(estado) {
        const puntajes = {
            'cumple': 1.0,
            'parcial': 0.5,
            'no_cumple': 0.0,
            'no_aplica': 0.0  // No aplica no suma al puntaje ni al total
        }
        return puntajes[estado] || 0.0
        },

        dibujarGraficaNivelesVisual(doc, yPos) {
        const infoNivel = this.obtenerInformacionNivelMadurez()
        const nivelActual = infoNivel.nivel

        // Configuración reducida
        const xCentro = 50 // centro de las figuras
        const ancho = 30
        const alto = 20
        const espacioEntre = 20

        // Colores por nivel
        const colores = {
            1: [255, 99, 99],   // Rojo
            2: [255, 165, 99],  // Naranja
            3: [99, 165, 255],  // Azul
            4: [99, 255, 132]   // Verde
        }

        // Nombres y descripciones
        const nombres = {
            1: "NIVEL 1  INICIAL (0–25%)",
            2: "NIVEL 2  BÁSICO (26–50%)",
            3: "NIVEL 3  DEFINIDO (51–75%)",
            4: "NIVEL 4  OPTIMIZADO (76–100%)"
        }

        const descripciones = {
            1: "La organización presenta un proceso reactivo frente a la JM 104-2021.",
            2: "Existen actividades de cumplimiento de la JM 104-2021, pero no están documentadas.",
            3: "El cumplimiento de la JM 104-2021 está documentado y es repetible.",
            4: "El cumplimiento de la JM 104-2021 es medido y mejorado continuamente."
        }

        // Dibujar cada nivel (de arriba hacia abajo, el rombo más pequeño es el 4)
        for (let nivel = 1; nivel <= 4; nivel++) {
            // const yNivel = yPos + (4 - nivel) * (alto + espacioEntre)
            // const index = 4 - nivel // 0 para el nivel 4, 3 para el nivel 1
            const yNivel = yPos + (4 - nivel) * (alto + espacioEntre)

            // Tamaño proporcional al nivel
            // const anchoBase = ancho + (nivel - 1) * 10
            // const altoBase = alto + (nivel - 1) * 6
            const anchoBase = ancho + (4 - nivel) * 10
            const altoBase  = alto + (4 - nivel) * 6

            // Seleccionar color
            const [r, g, b] = colores[nivel]
            doc.setFillColor(r, g, b)

            // Dibujar figura tipo rombo
            doc.setDrawColor(0, 0, 0)
            doc.setLineWidth(nivel === nivelActual ? 2 : 0.5)
            doc.lines(
            [
                [anchoBase / 2, altoBase / 2], // derecha
                [-anchoBase / 2, 0],       // arriba
                [-anchoBase / 2, -altoBase / 2], // izquierda
                [anchoBase / 2, 0]          // abajo
            ],
            xCentro,
            yNivel,
            [1, 1],
            'FD', // Fill & Draw
            true
        )

            // Número dentro del rombo
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.text(String(nivel), xCentro - 2.5, yNivel + 3)

            // Texto descriptivo a la derecha
            doc.setTextColor(0, 0, 0)
            doc.setFontSize(8)
            doc.setFont('helvetica', 'bold')
            doc.text(nombres[nivel], xCentro + 35, yNivel - 3)

            doc.setFontSize(7)
            doc.setFont('helvetica', 'normal')
            doc.text(doc.splitTextToSize(descripciones[nivel], 120), xCentro + 35, yNivel + 5)
        }

        // Indicador "USTED ESTÁ AQUÍ" → más cerca y más visible
        const yIndicador = yPos + (4 - nivelActual) * (alto + espacioEntre + 10)
        doc.setTextColor(200, 0, 0)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text("USTED ESTÁ AQUÍ", xCentro + 88, yIndicador - 23)
        },

        // FUNCIÓN PARA DETERMINAR NIVEL SEGÚN PORCENTAJE
        determinarNivel(porcentaje) {
        if (porcentaje >= 0 && porcentaje <= 25) {
            return {
            numero: 1,
            nombre: 'Inicial',
            rango: '(0–25%)',
            descripcion: 'La organización actúa únicamente cuando se le presentan problemas relacionados con la JM 104-2021. No existe un proceso definido para cumplir con los artículos del reglamento, la cobertura de evaluación es baja y las evidencias son mínimas o inexistentes. Se observan inconsistencias y ausencia de responsables claros para garantizar el cumplimiento normativo.',
            evidenciaMinima: 'Muchos artículos de la JM 104-2021 se encuentran en No cumple o sin evaluación. Pocos adjuntos; comentarios breves o genéricos. No existe historial de re-evaluaciones.',
            razonUbicacion: 'Con ≤25% de cumplimiento de la JM 104-2021, ausencia de evidencias y falta de revisiones periódicas, la organización demuestra un proceso reactivo y sin controles repetibles.',
            paraSubir: 'Definir responsables del cumplimiento de la JM 104-2021, establecer una plantilla de evidencias y aplicar una política básica de evaluación normativa.'
            }
        } else if (porcentaje >= 26 && porcentaje <= 50) {
            return {
            numero: 2,
            nombre: 'Básico/Gestionado',
            rango: '(26–50%)',
            descripcion: 'Existen actividades para dar cumplimiento a la JM 104-2021, pero no están estandarizadas en toda la organización. La cobertura es media, con evidencias parciales y un seguimiento irregular.',
            evidenciaMinima: 'Mezcla de Cumple, Parcial y No cumple en los artículos evaluados. Evidencias presentes en algunos artículos de la JM 104-2021. Registro de una primera re-evaluación planificada (aunque no constante).',
            razonUbicacion: 'Con 26–50% de cumplimiento, la organización ha iniciado prácticas de cumplimiento de la JM 104-2021, pero de forma parcial y no uniforme.',
            paraSubir: 'Documentar criterios de evaluación por artículo de la norma, exigir evidencia en "No cumple" y programar re-evaluaciones periódicas.'
            }
        } else if (porcentaje >= 51 && porcentaje <= 75) {
            return {
            numero: 3,
            nombre: 'Definido',
            rango: '(51–75%)',
            descripcion: 'La organización cuenta con un proceso documentado y repetible para cumplir la JM 104-2021. Se aplican criterios homogéneos por artículo, la cobertura es alta y las evidencias son consistentes.',
            evidenciaMinima: 'La mayoría de artículos de la JM 104-2021 están en Cumple o Parcial con evidencias. Comentarios claros que justifican decisiones. Historial con al menos dos mediciones comparables. Reportes y trazabilidad disponibles.',
            razonUbicacion: 'Con 51–75% de cumplimiento de la norma, evidencias consistentes y uso de reportes, la organización aplica un proceso definido y verificable.',
            paraSubir: 'Incorporar métricas de proceso (tiempos, tendencias), priorizar planes de acción y automatizar verificaciones normativas clave.'
            }
        } else { // 76-100%
            return {
            numero: 4,
            nombre: 'Optimizado',
            rango: '(76–100%)',
            descripcion: 'La organización gestiona de forma continua la mejora en el cumplimiento de la JM 104-2021. Se mide y optimiza el proceso, logrando cobertura ≥90% con evidencias robustas, muy pocos "No cumple" y planes de acción cerrados.',
            evidenciaMinima: 'Casi todos los artículos se cumplen con evidencia sólida. Re-evaluaciones periódicas (trimestrales/semestrales) con tendencia de mejora. Reportes exportados para auditorías externas. Trazabilidad total.',
            razonUbicacion: 'Con ≥76% de cumplimiento, la organización opera bajo control normativo, aplicando indicadores y planes de mejora continua conforme a la JM 104-2021.',
            paraSubir: 'Monitoreo constante, análisis de brechas residuales y automatización de controles normativos.'
            }
        }
        },

        // FUNCIÓN PARA GENERAR PLANTILLA DE PÁRRAFO PERSONALIZADA
        generarPlantillaParrafo(porcentaje, nivel) {
        const totalArticulos = this.contarTotalArticulos()
        const nombreEmpresa = this.tablero.nombre
        
        const plantillas = {
            1: `La empresa ${nombreEmpresa} fue evaluada contra la JM 104-2021 (N=${totalArticulos} artículos): Cumple ${this.resumen.cumple}, Parcial ${this.resumen.parcial}, No cumple ${this.resumen.noCumple}. El porcentaje de cumplimiento es ${porcentaje.toFixed(1)}%, por lo que se asigna Nivel ${nivel.numero} (${nivel.nombre}). El resultado evidencia un proceso reactivo y no estandarizado frente a la norma, con baja cobertura y escasez de evidencias; se observan inconsistencias entre evaluaciones y falta de responsables definidos.`,
            
            2: `La empresa ${nombreEmpresa} fue evaluada contra la JM 104-2021 (N=${totalArticulos} artículos): Cumple ${this.resumen.cumple}, Parcial ${this.resumen.parcial}, No cumple ${this.resumen.noCumple}. Con ${porcentaje.toFixed(1)}% de cumplimiento, se clasifica en Nivel ${nivel.numero} (${nivel.nombre}). Existen actividades de cumplimiento, pero no están estandarizadas en toda la organización; la cobertura es media, las evidencias son parciales y el seguimiento es irregular.`,
            
            3: `La empresa ${nombreEmpresa} fue evaluada contra la JM 104-2021 (N=${totalArticulos} artículos): Cumple ${this.resumen.cumple}, Parcial ${this.resumen.parcial}, No cumple ${this.resumen.noCumple}. El ${porcentaje.toFixed(1)}% de cumplimiento ubica a la organización en Nivel ${nivel.numero} (${nivel.nombre}). Se observa un proceso documentado y repetible frente a la norma, con cobertura amplia y evidencias consistentes.`,
            
            4: `La empresa ${nombreEmpresa} fue evaluada contra la JM 104-2021 (N=${totalArticulos} artículos): Cumple ${this.resumen.cumple}, Parcial ${this.resumen.parcial}, No cumple ${this.resumen.noCumple}. Con ${porcentaje.toFixed(1)}% de cumplimiento, corresponde Nivel ${nivel.numero} (${nivel.nombre}). El proceso está medido y mejorado de forma continua: existe cobertura ≥90% con evidencias sólidas y planes de acción cerrados, además de indicadores que demuestran mejora sostenida frente a la norma.`
        }
        
        return plantillas[nivel.numero] || plantillas[1]
        },

        // FUNCIÓN AUXILIAR PARA CONTAR TOTAL DE ARTÍCULOS
        contarTotalArticulos() {
        let total = 0
        this.titulos.forEach(titulo => {
            titulo.capitulos.forEach(capitulo => {
            total += capitulo.articulos.length
            })
        })
        return total
        },

        // FUNCIÓN PARA OBTENER INFORMACIÓN COMPLETA DEL NIVEL DE MADUREZ
        obtenerInformacionNivelMadurez() {
        const nivelMadurez = this.calcularNivelMadurez()
        
        return {
            ...nivelMadurez,
            // Información adicional para el reporte
            fechaEvaluacion: this.documento.fechaEvaluacion,
            evaluador: 'Sistema de Evaluación Legal', // Personalizable
            normaEvaluada: 'JM 104-2021',
            // Métricas adicionales
            cobertura: this.progreso.porcentaje,
            elementosEvaluados: nivelMadurez.totalElementos,
            recomendaciones: this.generarRecomendaciones(nivelMadurez.nivel)
        }
        },

        // FUNCIÓN PARA GENERAR RECOMENDACIONES SEGÚN NIVEL
        generarRecomendaciones(nivel) {
        const recomendaciones = {
            1: [
            'Definir responsables específicos del cumplimiento de la JM 104-2021',
            'Establecer una plantilla estándar de evidencias para cada artículo',
            'Implementar una política básica de evaluación normativa',
            'Crear un cronograma inicial de revisiones'
            ],
            2: [
            'Documentar criterios específicos de evaluación por artículo',
            'Exigir evidencia documental para todos los casos de "No cumple"',
            'Programar re-evaluaciones periódicas trimestrales',
            'Estandarizar procesos en todas las áreas de la organización'
            ],
            3: [
            'Incorporar métricas de proceso (tiempos de evaluación, tendencias)',
            'Priorizar y documentar planes de acción para elementos parciales',
            'Automatizar verificaciones normativas clave',
            'Implementar sistema de alertas preventivas'
            ],
            4: [
            'Mantener monitoreo constante de indicadores',
            'Realizar análisis profundo de brechas residuales',
            'Continuar automatización de controles normativos',
            'Establecer benchmarking con organizaciones similares'
            ]
        }
        
        return recomendaciones[nivel] || recomendaciones[1]
        },

        // FUNCIÓN PARA DIBUJAR GRÁFICA DE BARRAS
        dibujarGraficaBarras(doc, startY) {
        const datos = [
            { label: 'Cumple', valor: this.resumen.cumple, color: [76, 175, 80] },
            { label: 'No cumple', valor: this.resumen.noCumple, color: [244, 67, 54] },
            { label: 'Cumple parcialmente', valor: this.resumen.parcial, color: [255, 152, 0] },
            { label: 'No aplica', valor: this.resumen.noAplica, color: [158, 158, 158] }
        ]
        
        const maxValor = Math.max(...datos.map(d => d.valor), 1)
        const anchoGrafica = 150
        const altoGrafica = 40
        const anchoBarra = 30
        const espacioBarra = 8
        
        let xPos = 30
        
        // Dibujar ejes
        doc.setDrawColor(0, 0, 0)
        doc.line(25, startY + altoGrafica + 5, 25 + anchoGrafica, startY + altoGrafica + 5) // Eje X
        doc.line(25, startY, 25, startY + altoGrafica + 5) // Eje Y
        
        // Dibujar barras
        datos.forEach((dato, index) => {
            const alturaBarra = (dato.valor / maxValor) * altoGrafica
            const yBarra = startY + altoGrafica + 5 - alturaBarra
            
            // Dibujar barra
            doc.setFillColor(...dato.color)
            doc.rect(xPos, yBarra, anchoBarra, alturaBarra, 'F')
            
            // Valor encima de la barra
            doc.setTextColor(0, 0, 0)
            doc.setFontSize(10)
            doc.setFont('helvetica', 'bold')
            doc.text(dato.valor.toString(), xPos + anchoBarra/2, yBarra - 2, { align: 'center' })
            
            // Etiqueta debajo
            doc.setFontSize(8)
            doc.setFont('helvetica', 'normal')
            const lineasLabel = doc.splitTextToSize(dato.label, anchoBarra)
            lineasLabel.forEach((linea, lineIndex) => {
            doc.text(linea, xPos + anchoBarra/2, startY + altoGrafica + 12 + (lineIndex * 4), { align: 'center' })
            })
            
            xPos += anchoBarra + espacioBarra
        })
        
        // Escala del eje Y
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(8)
        for (let i = 0; i <= maxValor; i += Math.ceil(maxValor / 4)) {
            const yEscala = startY + altoGrafica + 5 - (i / maxValor) * altoGrafica
            doc.text(i.toString(), 22, yEscala, { align: 'right' })
        }
        },

        // FUNCIÓN PARA GENERAR DETALLE DE CALIFICACIONES
        generarDetalleCalificacionesPDF(doc, startY) {
        let yPosition = startY
        
        this.titulos.forEach((titulo, tituloIndex) => {
            // Verificar espacio en página
            if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
            }
            
            // Título
            doc.setFontSize(12)
            doc.setTextColor(25, 118, 210) // Azul
            doc.setFont('helvetica', 'bold')
            doc.text(`${titulo.numero}. ${titulo.nombre}`, 20, yPosition)
            yPosition += 10
            
            titulo.capitulos.forEach(capitulo => {
            if (yPosition > 250) {
                doc.addPage()
                yPosition = 20
            }
            
            // Capítulo
            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
            doc.setFont('helvetica', 'bold')
            doc.text(`  Cap. ${capitulo.numero}: ${capitulo.nombre}`, 25, yPosition)
            yPosition += 8
            
            capitulo.articulos.forEach(articulo => {
                if (yPosition > 250) {
                doc.addPage()
                yPosition = 20
                }
                
                // Artículo
                const calificacionArt = this.getCalificacionArticulo(articulo.id)
                const estadoTexto = calificacionArt ? this.getTextoEstado(calificacionArt.estado) : 'Sin calificar'
                const color = this.getColorPDF(calificacionArt?.estado)
                
                doc.setTextColor(...color)
                doc.setFont('helvetica', 'bold')
                doc.text(`    ${articulo.nombre}`, 30, yPosition)
                yPosition += 5
                
                doc.setFont('helvetica', 'normal')
                doc.text(`    Estado: ${estadoTexto}`, 35, yPosition)
                yPosition += 5
                
                // Comentario del artículo
                if (calificacionArt?.comentario) {
                doc.setTextColor(100, 100, 100)
                doc.setFontSize(8)
                const comentarioLineas = doc.splitTextToSize(`    Comentario: ${calificacionArt.comentario}`, 150)
                comentarioLineas.forEach(linea => {
                    if (yPosition > 250) {
                    doc.addPage()
                    yPosition = 20
                    }
                    doc.text(linea, 35, yPosition)
                    yPosition += 4
                })
                doc.setFontSize(10)
                }
                
                // Incisos del artículo
                articulo.elementos.forEach((elemento, elementoIndex) => {
                if (elemento.tipo === 'inciso') {
                    if (yPosition > 250) {
                    doc.addPage()
                    yPosition = 20
                    }
                    
                    const calificacionInc = this.getCalificacionInciso(articulo.id, elemento.id)
                    const estadoTextoInc = calificacionInc ? this.getTextoEstado(calificacionInc.estado) : 'Sin calificar'
                    const colorInc = this.getColorPDF(calificacionInc?.estado)
                    
                    doc.setTextColor(...colorInc)
                    const numeroInciso = this.getNumeroInciso(articulo.elementos, elementoIndex, elemento.tipoInciso)
                    doc.setFont('helvetica', 'bold')
                    doc.text(`      ${numeroInciso}) ${elemento.contenido}`, 40, yPosition)
                    yPosition += 4
                    
                    doc.setFont('helvetica', 'normal')
                    doc.text(`      Estado: ${estadoTextoInc}`, 45, yPosition)
                    yPosition += 4
                    
                    // Comentario del inciso
                    if (calificacionInc?.comentario) {
                    doc.setTextColor(100, 100, 100)
                    doc.setFontSize(8)
                    const comentarioLineas = doc.splitTextToSize(`      Comentario: ${calificacionInc.comentario}`, 140)
                    comentarioLineas.forEach(linea => {
                        if (yPosition > 250) {
                        doc.addPage()
                        yPosition = 20
                        }
                        doc.text(linea, 45, yPosition)
                        yPosition += 3
                    })
                    doc.setFontSize(10)
                    }
                    yPosition += 2
                }
                })
                
                yPosition += 5
            })
            yPosition += 5
            })
            yPosition += 8
        })
        },

        // FUNCIÓN AUXILIAR PARA COLORES EN PDF
        getColorPDF(estado) {
            const colores = {
                'cumple': [76, 175, 80],      // Verde
                'parcial': [255, 152, 0],     // Naranja
                'no_cumple': [244, 67, 54],   // Rojo
                'no_aplica': [158, 158, 158]  // Gris
            }
            return colores[estado] || [0, 0, 0] // Negro por defecto
        },
        getCalificacionArticulo(articuloId) {
            return this.detalleCalificaciones[`articulo_${articuloId}`] || null
        },
        getCalificacionInciso(articuloId, incisoId) {
            // console.log(articuloId, incisoId);
            return this.detalleCalificaciones[`inciso_${articuloId}_${incisoId}`] || null
        },

        getColorChip(estado) {
        const colores = {
            'cumple': 'green',
            'parcial': 'orange',
            'no_cumple': 'red',
            'no_aplica': 'grey'
        }
        return colores[estado] || 'grey'
        },
        
        getTextoEstado(estado) {
        const textos = {
            'cumple': 'Cumple',
            'parcial': 'Parcial',
            'no_cumple': 'No Cumple',
            'no_aplica': 'No Aplica'
        }
        return textos[estado] || ''
        },
        getNumeroInciso(elementos, elementoIndex, tipoInciso) {
            // Reutilizar lógica del componente anterior
            let ultimoContenidoIndex = -1
            for (let i = elementoIndex - 1; i >= 0; i--) {
                if (elementos[i].tipo === 'contenido') {
                ultimoContenidoIndex = i
                break
                }
            }
            
            let contadorIncisos = 1
            for (let i = ultimoContenidoIndex + 1; i < elementoIndex; i++) {
                if (elementos[i] && elementos[i].tipo === 'inciso') {
                contadorIncisos++
                }
            }
            
            if (tipoInciso === 'letras') {
                return String.fromCharCode(96 + contadorIncisos)
            } else {
                return contadorIncisos.toString()
            }
        },
    },
    created() {
        this.getListadoReportes()  
    }
}
</script>