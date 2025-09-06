<template>
  <v-container>
    <v-card class="pa-6">
      <!-- Encabezado -->
      <v-card-title class="headline">
        <v-icon left color="">mdi-clipboard-check</v-icon>
        Calificación de Cumplimiento Legal
      </v-card-title>
      
      <v-card-subtitle class="pb-4">
        <b>Decreto:</b> {{ documento.numeroLey }} <span class="float-right"><b>Fecha Publicación:</b> {{ documento.fecha }}</span>
      </v-card-subtitle>

      <!-- Barra de progreso -->
      <v-card outlined class="mb-6">
        <v-card-title class="subtitle-1 blue--text">
          <v-icon left color="blue">mdi-progress-check</v-icon>
          Progreso de Calificación
        </v-card-title>
        <v-card-text>
          <v-progress-linear
            :value="progreso.porcentaje"
            height="25"
            color="primary"
            class="mb-3"
          >
            <template v-slot:default="{ value }">
              <strong class="white--text">{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
          <div class="text-center">
            <span class="body-2">
              {{ progreso.calificados }} de {{ progreso.total }} elementos calificados
            </span>
          </div>
        </v-card-text>
      </v-card>

      <!-- Resumen de colores -->
      <v-card outlined class="mb-6">
        <v-card-title class="subtitle-1 purple--text">
          <v-icon left color="purple">mdi-chart-pie</v-icon>
          Resumen de Calificaciones
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-card color="green lighten-4" outlined>
                <v-card-text class="text-center">
                  <v-icon large color="green">mdi-check-circle</v-icon>
                  <div class="headline green--text">{{ resumen.cumple }}</div>
                  <div class="caption">Cumple</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card color="orange lighten-4" outlined>
                <v-card-text class="text-center">
                  <v-icon large color="orange">mdi-clock-alert</v-icon>
                  <div class="headline orange--text">{{ resumen.parcial }}</div>
                  <div class="caption">Parcialmente</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card color="red lighten-4" outlined>
                <v-card-text class="text-center">
                  <v-icon large color="red">mdi-close-circle</v-icon>
                  <div class="headline red--text">{{ resumen.noCumple }}</div>
                  <div class="caption">No Cumple</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card color="grey lighten-3" outlined>
                <v-card-text class="text-center">
                  <v-icon large color="grey">mdi-minus-circle</v-icon>
                  <div class="headline grey--text">{{ resumen.noAplica }}</div>
                  <div class="caption">No Aplica</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Estructura jerárquica para calificación -->
      <div v-for="titulo in titulos" :key="titulo.id" class="mb-6">
        <v-card outlined>
          <v-card-title class="subtitle-1 white--text" style="background-color: #151515 !important; border-color: #151515 !important;">
            <v-icon left color="white">mdi-format-header-1</v-icon>
            TÍTULO {{ titulo.numero }} - {{ titulo.nombre }}
          </v-card-title>
          
          <v-card-text class="pa-0">
            <div v-for="capitulo in titulo.capitulos" :key="capitulo.id" class="mb-4">
              <v-card outlined class="ma-3">
                <v-card-title class="subtitle-2 blue darken-1 white--text">
                  <v-icon left color="white">mdi-format-header-2</v-icon>
                  CAPÍTULO {{ capitulo.numero }} - {{ capitulo.nombre }}
                </v-card-title>
                
                <v-card-text>
                  <!-- Artículos -->
                  <div v-for="articulo in capitulo.articulos" :key="articulo.id" class="mb-4">
                    <v-card outlined color="green lighten-5">
                      <v-card-title class="subtitle-2 green darken-1 white--text">
                        <v-icon left color="white">mdi-file-document-outline</v-icon>
                        {{ articulo.nombre }}
                        <v-spacer></v-spacer>
                        <!-- Indicador de calificación del artículo -->
                        <v-chip
                          v-if="getCalificacionArticulo(articulo.id)"
                          small
                          :color="getColorChip(getCalificacionArticulo(articulo.id).estado)"
                          text-color="white"
                        >
                          {{ getTextoEstado(getCalificacionArticulo(articulo.id).estado) }}
                        </v-chip>
                      </v-card-title>
                      
                      <v-card-text>
                        <!-- Contenido e incisos del artículo -->
                        <div class="mb-4">
                          <h6 class="text-subtitle-2 mb-2">Contenido del Artículo:</h6>
                          <div v-for="(elemento, elementoIndex) in articulo.elementos" :key="elemento.id" class="mb-2">
                            <!-- Si es contenido -->
                            <div v-if="elemento.tipo === 'contenido'" class="mb-2">
                              <v-card outlined color="blue lighten-5" class="pa-3">
                                <div class="body-2">{{ elemento.contenido }}</div>
                              </v-card>
                            </div>
                            
                            <!-- Si es inciso (CALIFICABLE) -->
                            <div v-else class="ml-4 mb-3">
                              <v-card outlined color="orange lighten-5">
                                <v-card-title class="caption orange darken-1 white--text pa-3">
                                  <v-icon left color="white" x-small>mdi-format-list-bulleted</v-icon>
                                  Inciso {{ getNumeroInciso(articulo.elementos, elementoIndex, elemento.tipoInciso || 'letras') }}
                                  <v-spacer></v-spacer>
                                  <!-- Indicador de calificación del inciso -->
                                  <v-chip
                                    v-if="getCalificacionInciso(articulo.id, elemento.id)"
                                    x-small
                                    :color="getColorChip(getCalificacionInciso(articulo.id, elemento.id).estado)"
                                    text-color="white"
                                  >
                                    {{ getTextoEstado(getCalificacionInciso(articulo.id, elemento.id).estado) }}
                                  </v-chip>
                                </v-card-title>
                                
                                <v-card-text class="pa-3">
                                  <!-- Contenido del inciso -->
                                  <div class="body-2 mb-3">{{ elemento.contenido }}</div>
                                  
                                  <!-- Calificación del inciso -->
                                  <div class="calificacion-section">
                                    <h6 class="text-body-2 mb-2">Calificación del Inciso:</h6>
                                    
                                    <!-- Radio buttons para calificación -->
                                    <v-radio-group
                                      :value="getEstadoInciso(articulo.id, elemento.id)"
                                      @change="actualizarCalificacionInciso(articulo.id, elemento.id, $event)"
                                      row
                                      dense
                                    >
                                      <v-radio
                                        label="Cumple"
                                        value="cumple"
                                        color="green"
                                      ></v-radio>
                                      <v-radio
                                        label="Parcial"
                                        value="parcial"
                                        color="orange"
                                      ></v-radio>
                                      <v-radio
                                        label="No Cumple"
                                        value="no_cumple"
                                        color="red"
                                      ></v-radio>
                                      <v-radio
                                        label="No Aplica"
                                        value="no_aplica"
                                        color="grey"
                                      ></v-radio>
                                    </v-radio-group>
                                    
                                    <!-- Comentario -->
                                    <v-textarea
                                      :value="getComentarioInciso(articulo.id, elemento.id)"
                                      @input="actualizarComentarioInciso(articulo.id, elemento.id, $event)"
                                      label="Comentario"
                                      outlined
                                      dense
                                      rows="2"
                                      prepend-inner-icon="mdi-comment-text"
                                    ></v-textarea>
                                    
                                    <!-- Adjuntar evidencia -->
                                    <!-- :value="getEvidenciaInciso(articulo.id, elemento.id)" -->
                                    <v-file-input
                                      
                                      @change="actualizarEvidenciaInciso(articulo.id, elemento.id, $event)"
                                      label="Adjuntar Evidencia"
                                      outlined
                                      dense
                                      prepend-icon="mdi-paperclip"
                                      accept="image/*,.pdf,.doc,.docx"
                                      
                                    ></v-file-input>

                                    <v-btn
                                        v-if="getEvidenciaInciso(articulo.id, elemento.id)"
                                        color="primary"
                                        dark
                                        @click="abrirArchivo(getEvidenciaInciso(articulo.id, elemento.id))"
                                    >
                                    Abrir evidencia
                                    </v-btn>
                                    
                                    <!-- Botón guardar calificación del inciso -->
                                    <div class="text-right mt-2">
                                      <v-btn
                                        color="primary"
                                        small
                                        @click="guardarCalificacionInciso(articulo.id, elemento.id)"
                                        :disabled="!getEstadoInciso(articulo.id, elemento.id)"
                                      >
                                        <v-icon left small>mdi-content-save</v-icon>
                                        Guardar Inciso
                                      </v-btn>
                                    </div>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </div>
                          </div>
                        </div>
                        
                        <v-divider class="my-4"></v-divider>
                        
                        <!-- Calificación general del artículo -->
                        <div class="calificacion-articulo">
                          <h6 class="text-subtitle-2 mb-3">Calificación General del Artículo:</h6>
                          
                          <!-- Radio buttons para calificación del artículo -->
                          <v-radio-group
                            :value="getEstadoArticulo(articulo.id)"
                            @change="actualizarCalificacionArticulo(articulo.id, $event)"
                            row
                            dense
                          >
                            <v-radio
                              label="Cumple"
                              value="cumple"
                              color="green"
                            ></v-radio>
                            <v-radio
                              label="Parcial"
                              value="parcial"
                              color="orange"
                            ></v-radio>
                            <v-radio
                              label="No Cumple"
                              value="no_cumple"
                              color="red"
                            ></v-radio>
                            <v-radio
                              label="No Aplica"
                              value="no_aplica"
                              color="grey"
                            ></v-radio>
                          </v-radio-group>
                          
                          <!-- Comentario del artículo -->
                          <v-textarea
                            :value="getComentarioArticulo(articulo.id)"
                            @input="actualizarComentarioArticulo(articulo.id, $event)"
                            label="Comentario General del Artículo"
                            outlined
                            dense
                            rows="3"
                            prepend-inner-icon="mdi-comment-text-outline"
                          ></v-textarea>
                          
                          <!-- Evidencia del artículo -->
                          <!-- :value="getEvidenciaArticulo(articulo.id)" -->
                          <v-file-input
                            
                            @change="actualizarEvidenciaArticulo(articulo.id, $event)"
                            label="Adjuntar Evidencia General"
                            outlined
                            dense
                            prepend-icon="mdi-paperclip"
                            accept="image/*,.pdf,.doc,.docx"
                            
                          ></v-file-input>

                            <v-btn
                                v-if="getEvidenciaArticulo(articulo.id)"
                                color="primary"
                                dark
                                @click="abrirArchivo(getEvidenciaArticulo(articulo.id))"
                            >
                            Abrir evidencia
                            </v-btn>
                          
                          <!-- Botón guardar calificación del artículo -->
                          <div class="text-right mt-3">
                            <v-btn
                              color="success"
                              @click="guardarCalificacionArticulo(articulo.id)"
                              :disabled="!getEstadoArticulo(articulo.id)"
                            >
                              <v-icon left>mdi-content-save</v-icon>
                              Guardar Artículo
                            </v-btn>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Botones finales -->
      <v-row class="mt-6">
        <v-col cols="12" class="text-center">
          <v-btn
            color="success"
            large
            @click="guardarTodasCalificaciones"
            :disabled="progreso.porcentaje < 100"
            :loading="guardando"
          >
            <v-icon left>mdi-content-save-all</v-icon>
            Finalizar y Guardar Evaluación
          </v-btn>

          <v-btn
            color="info"
            large
            outlined
            class="ml-3"
            @click="generarReporte"
            :disabled="progreso.calificados === 0"
          >
            <v-icon left>mdi-file-chart</v-icon>
            Generar Reporte
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      bottom
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
// import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { mapActions, mapState } from "vuex"
import { auth, db, firebase } from "../firebase"

export default {
  name: 'VistaCalificacionDecreto',
  data() {
    return {
      guardando: false,
      
      // Datos del documento - SE ALIMENTAN DESDE this.documento y this.titulos
      documento: {},
      
      // Estructura de títulos - SE ALIMENTA DESDE this.titulos
      titulos: [],

      auditadapor: '',
      gerenteEmpresa: '',
      
      // Calificaciones temporales (antes de guardar)
      calificacionesTemp: {},
      
      // Calificaciones guardadas
      calificaciones: {},
      
      // Progreso y resumen
      progreso: { total: 0, calificados: 0, porcentaje: 0 },
      resumen: { cumple: 0, parcial: 0, noCumple: 0, noAplica: 0 },
      
      // Snackbar
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      empresaID: '',
      auditoriaID: ''
    }
  },
  
  mounted() {
    // this.inicializarCalificaciones()
    // this.calcularProgreso()
  },
  
  computed: {
        ...mapState(['tablero'])
  },
  methods: {
    ...mapActions(['getEmpresa']),

    abrirArchivo(url) {
      // Abrir en nueva pestaña
      window.open(url, "_blank");
    },

    // // INICIALIZACIÓN
    // inicializarCalificaciones() {
    //   // Aquí cargarías desde las variables this.documento y this.titulos
    //   // this.documento = this.$parent.documento
    //   // this.titulos = this.$parent.titulos
      
    //   // Inicializar estructura de calificaciones temporales
    //   this.titulos.forEach(titulo => {
    //     titulo.capitulos.forEach(capitulo => {
    //       capitulo.articulos.forEach(articulo => {
    //         // Calificación del artículo
    //         this.inicializarCalificacionArticulo(articulo.id)
            
    //         // Calificaciones de incisos
    //         articulo.elementos.forEach(elemento => {
    //           if (elemento.tipo === 'inciso') {
    //             this.inicializarCalificacionInciso(articulo.id, elemento.id)
    //           }
    //         })
    //       })
    //     })
    //   })
    // },
    
    // inicializarCalificacionArticulo(articuloId) {
    //   if (!this.calificacionesTemp[`articulo_${articuloId}`]) {
    //     this.$set(this.calificacionesTemp, `articulo_${articuloId}`, {
    //       estado: null,
    //       comentario: '',
    //       evidencia: null
    //     })
    //   }
    // },
    
    // inicializarCalificacionInciso(articuloId, incisoId) {
    //   if (!this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`]) {
    //     this.$set(this.calificacionesTemp, `inciso_${articuloId}_${incisoId}`, {
    //       estado: null,
    //       comentario: '',
    //       evidencia: null
    //     })
    //   }
    // },

    // Método para cargar calificaciones desde la base de datos
    async cargarCalificacionesDesdeDB() {
        try {
            // Aquí haces la consulta a tu DB para obtener las calificaciones guardadas
            // const calificacionesGuardadas = await api.getCalificaciones(this.documentoId)
            
            // Por ahora simulo la carga desde DB
            const calificacionesGuardadas = this.calificaciones
            
            if (calificacionesGuardadas && Object.keys(calificacionesGuardadas).length > 0) {
                // Si hay calificaciones guardadas, las cargamos
                this.cargarCalificacionesExistentes(calificacionesGuardadas)
            } else {
                // Si no hay calificaciones guardadas, inicializamos estructura vacía
                this.inicializarCalificaciones()
            }
        } catch (error) {
            console.error('Error al cargar calificaciones:', error)
            // En caso de error, inicializar estructura vacía
            this.inicializarCalificaciones()
        }
    },

    // Método para cargar calificaciones existentes en la estructura temporal
    cargarCalificacionesExistentes(calificacionesGuardadas) {
        // Primero inicializar la estructura básica
        this.inicializarCalificaciones()
        
        // Luego sobrescribir con los datos guardados
        Object.keys(calificacionesGuardadas).forEach(key => {
            const calificacion = calificacionesGuardadas[key]
            
            // Asegurarse de que la clave existe en calificacionesTemp
            if (this.calificacionesTemp[key]) {
            this.$set(this.calificacionesTemp, key, {
                estado: calificacion.estado || null,
                comentario: calificacion.comentario || '',
                evidencia: calificacion.evidencia || null
            })
            } else {
            // Si la clave no existe, crearla
            this.$set(this.calificacionesTemp, key, {
                estado: calificacion.estado || null,
                comentario: calificacion.comentario || '',
                evidencia: calificacion.evidencia || null
            })
            }
        })
        
        // console.log('Calificaciones cargadas desde DB:', this.calificacionesTemp)
    },

    // Método modificado para inicializar (tu código actual)
    inicializarCalificaciones() {
        // Aquí cargarías desde las variables this.documento y this.titulos
        // this.documento = this.$parent.documento
        // this.titulos = this.$parent.titulos
        
        // Inicializar estructura de calificaciones temporales
        this.titulos.forEach(titulo => {
            titulo.capitulos.forEach(capitulo => {
                capitulo.articulos.forEach(articulo => {
                    // Calificación del artículo
                    this.inicializarCalificacionArticulo(articulo.id)
                
                    // Calificaciones de incisos
                    articulo.elementos.forEach(elemento => {
                        if (elemento.tipo === 'inciso') {
                            this.inicializarCalificacionInciso(articulo.id, elemento.id)
                        }
                    })
                })
            })
        })
    },

    inicializarCalificacionArticulo(articuloId) {
        if (!this.calificacionesTemp[`articulo_${articuloId}`]) {
            this.$set(this.calificacionesTemp, `articulo_${articuloId}`, {
                estado: null,
                comentario: '',
                evidencia: null
            })
        }
    },

    inicializarCalificacionInciso(articuloId, incisoId) {
        if (!this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`]) {
            this.$set(this.calificacionesTemp, `inciso_${articuloId}_${incisoId}`, {
                estado: null,
                comentario: '',
                evidencia: null
            })
        }
    },
    
    // MÉTODOS PARA ARTÍCULOS
    getEstadoArticulo(articuloId) {
      return this.calificacionesTemp[`articulo_${articuloId}`]?.estado || null
    },
    
    getComentarioArticulo(articuloId) {
      return this.calificacionesTemp[`articulo_${articuloId}`]?.comentario || ''
    },
    
    getEvidenciaArticulo(articuloId) {
      return this.calificacionesTemp[`articulo_${articuloId}`]?.evidencia || null
    },
    
    getCalificacionArticulo(articuloId) {
      return this.calificaciones[`articulo_${articuloId}`] || null
    },
    
    actualizarCalificacionArticulo(articuloId, estado) {
      this.calificacionesTemp[`articulo_${articuloId}`].estado = estado
    },
    
    actualizarComentarioArticulo(articuloId, comentario) {
      this.calificacionesTemp[`articulo_${articuloId}`].comentario = comentario
    },
    
    actualizarEvidenciaArticulo(articuloId, evidencia) {
        const file = evidencia
        const storageRef = firebase.storage().ref()
        const pdfRef = storageRef.child(`evidenciaAuditoria/${this.empresaID}/${this.$route.params.id}/${file.name}`)

        pdfRef.put(file)
        .then(snapshot => {
            // Una vez subido, obtenemos el enlace público
            return snapshot.ref.getDownloadURL()
        })
        .then(downloadURL => {
            // console.log('Archivo subido con éxito.')
            // console.log('Archivo disponible en:', downloadURL)
            this.calificacionesTemp[`articulo_${articuloId}`].evidencia = downloadURL
            // this.calificacionesTemp[`articulo_${articuloId}`].evidenciaURL = downloadURL
        })
        .catch(e => {
            console.log(e.message)
        })
        // this.calificacionesTemp[`articulo_${articuloId}`].evidencia = evidencia
    },
    
    guardarCalificacionArticulo(articuloId) {
      const temp = this.calificacionesTemp[`articulo_${articuloId}`]
      this.$set(this.calificaciones, `articulo_${articuloId}`, {
        ...temp,
        fechaCalificacion: new Date().toISOString()
      })
      this.mostrarSnackbar('Calificación del artículo guardada', 'success')
      this.calcularProgreso()

      this.guardando = true
        
      const evaluacionCompleta = {
        documento: this.documento,
        calificaciones: this.calificaciones,
        progreso: this.progreso,
        resumen: this.resumen,
        empresa: this.empresaID,
        ley: this.$route.params.id,
        fechaEvaluacionFormat: new Date().toISOString(),
        fechaEvaluacion: Date.now()
      }

      db.collection('auditoria').doc(this.auditoriaID).update(evaluacionCompleta)

      setTimeout(() => {
        this.guardando = false
        this.mostrarSnackbar('Evaluación guardada exitosamente', 'success')
      }, 1500)
    },
    
    // MÉTODOS PARA INCISOS
    getEstadoInciso(articuloId, incisoId) {
      return this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`]?.estado || null
    },
    
    getComentarioInciso(articuloId, incisoId) {
      return this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`]?.comentario || ''
    },
    
    getEvidenciaInciso(articuloId, incisoId) {
      return this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`]?.evidencia || null
    },
    
    getCalificacionInciso(articuloId, incisoId) {
        // console.log(articuloId, incisoId);
      return this.calificaciones[`inciso_${articuloId}_${incisoId}`] || null
    },
    
    actualizarCalificacionInciso(articuloId, incisoId, estado) {
      this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`].estado = estado
    },
    
    actualizarComentarioInciso(articuloId, incisoId, comentario) {
      this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`].comentario = comentario
    },
    
    actualizarEvidenciaInciso(articuloId, incisoId, evidencia) {
        // console.log(evidencia)
        const file = evidencia
        const storageRef = firebase.storage().ref()
        const pdfRef = storageRef.child(`evidenciaAuditoria/${this.empresaID}/${this.$route.params.id}/${file.name}`)

        pdfRef.put(file)
        .then(snapshot => {
            // Una vez subido, obtenemos el enlace público
            return snapshot.ref.getDownloadURL()
        })
        .then(downloadURL => {
            // console.log('Archivo subido con éxito.')
            // console.log('Archivo disponible en:', downloadURL)
            this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`].evidencia = downloadURL
            // this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`].evidenciaURL = downloadURL
        })
        .catch(e => {
            console.log(e.message)
        })
        // this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`].evidencia = evidencia
    },
    
    guardarCalificacionInciso(articuloId, incisoId) {
      const temp = this.calificacionesTemp[`inciso_${articuloId}_${incisoId}`]
      this.$set(this.calificaciones, `inciso_${articuloId}_${incisoId}`, {
        ...temp,
        fechaCalificacion: new Date().toISOString()
      })
      this.mostrarSnackbar('Calificación del inciso guardada', 'success')
      this.calcularProgreso()

      this.guardando = true
        
      const evaluacionCompleta = {
        documento: this.documento,
        calificaciones: this.calificaciones,
        progreso: this.progreso,
        resumen: this.resumen,
        empresa: this.empresaID,
        ley: this.$route.params.id,
        fechaEvaluacionFormat: new Date().toISOString(),
        fechaEvaluacion: Date.now()
      }

      db.collection('auditoria').doc(this.auditoriaID).update(evaluacionCompleta)

      setTimeout(() => {
        this.guardando = false
        this.mostrarSnackbar('Evaluación guardada exitosamente', 'success')
      }, 1500)
    },
    
    // MÉTODOS AUXILIARES
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
    
    // CÁLCULO DE PROGRESO Y RESUMEN
    calcularProgreso() {
      let total = 0
      let calificados = 0
      let resumen = { cumple: 0, parcial: 0, noCumple: 0, noAplica: 0 }
      
      // Contar artículos e incisos
      this.titulos.forEach(titulo => {
        titulo.capitulos.forEach(capitulo => {
          capitulo.articulos.forEach(articulo => {
            // Contar artículo
            total++
            if (this.calificaciones[`articulo_${articulo.id}`]) {
              calificados++
              const estado = this.calificaciones[`articulo_${articulo.id}`].estado
              if (estado === 'cumple') resumen.cumple++
              else if (estado === 'parcial') resumen.parcial++
              else if (estado === 'no_cumple') resumen.noCumple++
              else if (estado === 'no_aplica') resumen.noAplica++
            }
            
            // Contar incisos
            articulo.elementos.forEach(elemento => {
              if (elemento.tipo === 'inciso') {
                total++
                if (this.calificaciones[`inciso_${articulo.id}_${elemento.id}`]) {
                  calificados++
                  const estado = this.calificaciones[`inciso_${articulo.id}_${elemento.id}`].estado
                  if (estado === 'cumple') resumen.cumple++
                  else if (estado === 'parcial') resumen.parcial++
                  else if (estado === 'no_cumple') resumen.noCumple++
                  else if (estado === 'no_aplica') resumen.noAplica++
                }
              }
            })
          })
        })
      })
      
      this.progreso = {
        total,
        calificados,
        porcentaje: total > 0 ? (calificados / total) * 100 : 0
      }
      
      this.resumen = resumen
    },
    
    // GUARDAR Y GENERAR REPORTE
    guardarTodasCalificaciones() {
        this.guardando = true
        
        const evaluacionCompleta = {
            documento: this.documento,
            calificaciones: this.calificaciones,
            progreso: this.progreso,
            resumen: this.resumen,
            empresa: this.empresaID,
            ley: this.$route.params.id,
            fechaEvaluacionFormat: new Date().toISOString(),
            fechaEvaluacion: Date.now()
        }

        db.collection('auditoria').doc(this.auditoriaID).update(evaluacionCompleta)
      
        // Simular guardado
        setTimeout(() => {
            console.log('Evaluación completa guardada:', evaluacionCompleta)
            this.guardando = false
            this.mostrarSnackbar('Evaluación guardada exitosamente', 'success')
        }, 2000)
    },
    
    generarReporte() {
      this.documento.fechaEvaluacion = new Date().toLocaleString()
      const reporte = {
        documento: this.documento,
        resumen: this.resumen,
        progreso: this.progreso,
        detalleCalificaciones: this.calificaciones,
        tablero: this.tablero,
        titulos: this.titulos,
        empresa: this.empresaID,
        ley: this.$route.params.id,
        auditadapor: this.auditadapor,
        gerenteEmpresa: this.gerenteEmpresa
      }
      this.generarReportePDF()
      // this.generarReportePDFCanvas()

      db.collection('reportes').add(reporte)
      
      console.log('Reporte generado:', reporte)
      this.mostrarSnackbar('Reporte generado correctamente', 'info')
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
        </div>
      `
      // ${this.generarDetalleHTML()}
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

    // FUNCIÓN PARA GENERAR LA PRIMERA PÁGINA DEL INFORME DE AUDITORÍA
    generarPrimeraPagenaAuditoria(doc) {
      const azulOscuro = [52, 73, 94]
      const azulClaro = [41, 128, 185]
      const grisClaroPagina = [248, 249, 250]
      
      // FONDO DE LA PÁGINA
      doc.setFillColor(...grisClaroPagina)
      doc.rect(0, 0, 210, 297, 'F')
      
      // ENCABEZADO ONDULADO SUPERIOR
      doc.setFillColor(...azulOscuro)
      // Rectángulo base del encabezado
      doc.rect(0, 0, 210, 60, 'F')
      
      // Efecto ondulado (simulado con curvas)
      doc.setFillColor(...azulClaro)
      doc.ellipse(50, 45, 80, 15, 'F')
      doc.ellipse(120, 50, 60, 12, 'F')
      doc.ellipse(180, 40, 40, 10, 'F')
      
      // TÍTULO PRINCIPAL
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('INFORME DE', 20, 35)
      doc.text('AUDITORÍA', 20, 50)
      
      // FECHA EN LA ESQUINA SUPERIOR DERECHA
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const fechaActual = new Date()
      // const dia = fechaActual.getDate()
      // const mes = fechaActual.toLocaleDateString('es-ES', { month: 'long' })
      // const año = fechaActual.getFullYear()
      const fechaStr = this.documento.fechaEvaluacion;
      // Separar fecha y hora
      const [fechaPart, horaPart] = fechaStr.split(", ");
      const [dia, mes, anio] = fechaPart.split("/").map(Number);

      // Parsear hora
      let [hora, minuto, segundo] = horaPart.replace(/[^\d:]/g, "").split(":").map(Number);
      const esPM = horaPart.includes("p. m.");
      if (esPM && hora < 12) hora += 12;
      if (!esPM && hora === 12) hora = 0;

      // Crear objeto Date
      const fecha = new Date(anio, mes - 1, dia, hora, minuto, segundo);

      // Obtener nombres
      const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
      const mesNombre = fecha.toLocaleDateString("es-ES", { month: "long" });

      const diaMes = fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
      // console.log(diaMes);
      doc.text(`Guatemala, ${diaMes}`, 120, 80)
      
      // DATOS DEL DESTINATARIO
      let yPos = 100
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      doc.text('Señor(a):', 20, yPos)
      yPos += 6
      doc.text(`${this.gerenteEmpresa}`, 20, yPos)
      yPos += 6
      doc.text(`${this.tablero.nombre}`, 20, yPos)
      yPos += 6
      doc.text('Estimado(a) señor(a):', 20, yPos)
      
      // PÁRRAFO PRINCIPAL
      yPos += 15
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      const parrafoPrincipal = `En mi calidad de auditor asignado, me permito presentar a usted el Informe Final de Auditoría de Cumplimiento Normativo realizado a ${this.tablero.nombre}, con base en la JM 104-2021, de conformidad con los objetivos establecidos al inicio del proceso.

      Durante la auditoría se revisaron ${this.resumen.cumple+this.resumen.parcial+this.resumen.noCumple+this.resumen.noAplica} artículos de la normativa, evaluando el grado de cumplimiento en cada uno de las áreas resultando los hallazgos con comentarios y evidencias documentales. El análisis permitió determinar el porcentaje de cumplimiento total alcanzado por la empresa y, en consecuencia, ubicar su nivel en la escala de madurez normativa.`
      
      const lineasParrafoPrincipal = doc.splitTextToSize(parrafoPrincipal, 170)
      lineasParrafoPrincipal.forEach(linea => {
          if (yPos > 270) {
          // Si se acaba el espacio, continuar en la siguiente función
          return
          }
          doc.text(linea, 20, yPos)
          yPos += 4.5
      })
      
      // RESULTADOS (VIÑETAS)
      yPos += 10
      doc.text('De acuerdo con los resultados:', 20, yPos)
      yPos += 8
      
      // Obtener datos reales del resumen
      const infoNivel = this.obtenerInformacionNivelMadurez()
      
      doc.text(`• Artículos en Cumple: [${this.resumen.cumple}]`, 25, yPos)
      yPos += 6
      doc.text(`• Artículos en Parcial: [${this.resumen.parcial}]`, 25, yPos)
      yPos += 6
      doc.text(`• Artículos en No Cumple: [${this.resumen.noCumple}]`, 25, yPos)
      yPos += 6
      doc.text(`• Porcentaje de cumplimiento obtenido: [${infoNivel.porcentaje.toFixed(1)}%]`, 25, yPos)
      yPos += 6
      doc.text(`• Nivel de madurez asignado: Nivel ${infoNivel.nivel} [${infoNivel.nombreNivel}]`, 25, yPos)
      
      // PÁRRAFO DE EXPLICACIÓN DEL NIVEL
      yPos += 15
      const parrafoNivel = `Este resultado refleja que la organización se encuentra en un estado (${infoNivel.nombreNivel.toLowerCase()}) según el nivel: ${infoNivel.nombreNivel.toLowerCase() === 'inicial' ? 'reactivo' : infoNivel.nombreNivel.toLowerCase() === 'básico/gestionado' ? 'básico' : infoNivel.nombreNivel.toLowerCase() === 'definido' ? 'definido' : 'optimizado'}, lo cual le permite identificar brechas de cumplimiento y contar con una ruta clara para la mejora continua.`
      
      const lineasParrafoNivel = doc.splitTextToSize(parrafoNivel, 170)
      lineasParrafoNivel.forEach(linea => {
          if (yPos > 270) return
          doc.text(linea, 20, yPos)
          yPos += 4.5
      })
      
      // PÁRRAFO FINAL
      yPos += 10
      const parrafoFinal = `Se adjunta al presente la documentación detallada del informe, incluyendo las observaciones específicas por artículo así como las recomendaciones que contribuirán a fortalecer el sistema de gestión normativa y garantizar un mayor nivel de alineación con la JM 104-2021.

      Sin más por el momento, y agradeciendo la apertura de su equipo durante el proceso de auditoría, me suscribo de usted.`
      
      const lineasParrafoFinal = doc.splitTextToSize(parrafoFinal, 170)
      lineasParrafoFinal.forEach(linea => {
          if (yPos > 240) return // Dejar espacio para la firma
          doc.text(linea, 20, yPos)
          yPos += 4.5
      })
      
      // PIE DE PÁGINA ONDULADO
      doc.setFillColor(...azulOscuro)
      doc.rect(0, 250, 210, 47, 'F')
      
      // Efecto ondulado inferior (simulado)
      doc.setFillColor(...azulClaro)
      doc.ellipse(30, 250, 40, 8, 'F')
      doc.ellipse(90, 255, 50, 10, 'F')
      doc.ellipse(160, 250, 35, 8, 'F')
      
      // FIRMA
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text('Atentamente,', 20, 265)
      doc.setFont('helvetica', 'bold')
      doc.text(`${this.auditadapor}`, 20, 275)
      doc.setFont('helvetica', 'normal')
      doc.text('Auditor de Cumplimiento Normativo', 20, 285)
  },
    
    // FUNCIÓN PDF MODIFICADA PARA INCLUIR NIVEL DE MADUREZ
    async generarReportePDF() {
      try {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()

        // GENERAR PRIMERA PÁGINA DE AUDITORÍA
        this.generarPrimeraPagenaAuditoria(doc)

        doc.addPage()
        
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
        doc.addPage()
        yPos = 20
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
        this.mostrarSnackbar('Reporte con Nivel de Madurez generado correctamente', 'success')
        
      } catch (error) {
        console.error('Error generando PDF:', error)
        this.mostrarSnackbar('Error al generar el PDF', 'error')
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

        const xCentro = 50
        const ancho = 30
        const alto = 20
        const espacioEntre = 20

        const colores = {
            1: [255, 99, 99],
            2: [255, 165, 99],
            3: [99, 165, 255],
            4: [99, 255, 132]
        }

        const nombres = {
            1: "NIVEL 1  INICIAL (0-25%)",
            2: "NIVEL 2  BÁSICO (26-50%)",
            3: "NIVEL 3  DEFINIDO (51-75%)",
            4: "NIVEL 4  OPTIMIZADO (76-100%)"
        }

        const descripciones = {
            1: "La organización presenta un proceso reactivo frente a la JM 104-2021, con baja cobertura de artículos evaluados, sin responsables claros ni evidencias suficientes.",
            2: "Existen actividades de cumplimiento de la JM 104-2021, pero no están estandarizadas; la cobertura y las evidencias son parciales y el seguimiento es irregular.",
            3: "El cumplimiento de la JM 104-2021 está documentado y es repetible; los artículos se evalúan con criterios homogéneos, roles claros y trazabilidad.",
            4: "El cumplimiento de la JM 104-2021 es medido y mejorado continuamente; la cobertura de artículos es casi total, con evidencia robusta y mejora sostenida."
        }

        let posicionesTexto = {} // guardar posición final de cada bloque de texto

        for (let nivel = 1; nivel <= 4; nivel++) {
            const yNivel = yPos + (4 - nivel) * (alto + espacioEntre)

            const anchoBase = ancho + (4 - nivel) * 10
            const altoBase  = alto + (4 - nivel) * 6

            const [r, g, b] = colores[nivel]
            doc.setFillColor(r, g, b)

            doc.setDrawColor(0, 0, 0)
            doc.setLineWidth(nivel === nivelActual ? 2 : 0.5)
            doc.lines(
            [
                [anchoBase / 2, altoBase / 2], 
                [-anchoBase / 2, 0],       
                [-anchoBase / 2, -altoBase / 2], 
                [anchoBase / 2, 0]          
            ],
            xCentro,
            yNivel,
            [1, 1],
            'FD',
            true
            )

            // Número dentro
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.text(String(nivel), xCentro - 2.5, yNivel + 3)

            // Texto descriptivo
            doc.setTextColor(0, 0, 0)
            doc.setFontSize(8)
            doc.setFont('helvetica', 'bold')
            doc.text(nombres[nivel], xCentro + 35, yNivel - 3)

            doc.setFontSize(7)
            doc.setFont('helvetica', 'normal')
            const textoDividido = doc.splitTextToSize(descripciones[nivel], 120)
            doc.text(textoDividido, xCentro + 35, yNivel + 5)

            // Calcular última posición usada en este bloque
            const alturaTexto = textoDividido.length * 8 * 0.35 // factor aproximado
            posicionesTexto[nivel] = yNivel + 5 + alturaTexto
        }

        // Agregar "USTED ESTÁ AQUÍ" justo después del bloque de texto del nivel actual
        const yTextoFinal = posicionesTexto[nivelActual] + 5
        doc.setTextColor(200, 0, 0)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text("USTED ESTÁ AQUÍ", xCentro + 35, yTextoFinal)
    },

    // FUNCIÓN PARA DETERMINAR NIVEL SEGÚN PORCENTAJE
    determinarNivel(porcentaje) {
      if (porcentaje >= 0 && porcentaje <= 25) {
        return {
          numero: 1,
          nombre: 'Inicial',
          rango: '(0-25%)',
          descripcion: 'La organización actúa únicamente cuando se le presentan problemas relacionados con la JM 104-2021. No existe un proceso definido para cumplir con los artículos del reglamento, la cobertura de evaluación es baja y las evidencias son mínimas o inexistentes. Se observan inconsistencias y ausencia de responsables claros para garantizar el cumplimiento normativo.',
          evidenciaMinima: 'Muchos artículos de la JM 104-2021 se encuentran en No cumple o sin evaluación. Pocos adjuntos; comentarios breves o genéricos. No existe historial de re-evaluaciones.',
          razonUbicacion: 'Con <=25% de cumplimiento de la JM 104-2021, ausencia de evidencias y falta de revisiones periódicas, la organización demuestra un proceso reactivo y sin controles repetibles.',
          paraSubir: 'Definir responsables del cumplimiento de la JM 104-2021, establecer una plantilla de evidencias y aplicar una política básica de evaluación normativa.'
        }
      } else if (porcentaje >= 26 && porcentaje <= 50) {
        return {
          numero: 2,
          nombre: 'Básico/Gestionado',
          rango: '(26-50%)',
          descripcion: 'Existen actividades para dar cumplimiento a la JM 104-2021, pero no están estandarizadas en toda la organización. La cobertura es media, con evidencias parciales y un seguimiento irregular.',
          evidenciaMinima: 'Mezcla de Cumple, Parcial y No cumple en los artículos evaluados. Evidencias presentes en algunos artículos de la JM 104-2021. Registro de una primera re-evaluación planificada (aunque no constante).',
          razonUbicacion: 'Con 26-50% de cumplimiento, la organización ha iniciado prácticas de cumplimiento de la JM 104-2021, pero de forma parcial y no uniforme.',
          paraSubir: 'Documentar criterios de evaluación por artículo de la norma, exigir evidencia en "No cumple" y programar re-evaluaciones periódicas.'
        }
      } else if (porcentaje >= 51 && porcentaje <= 75) {
        return {
          numero: 3,
          nombre: 'Definido',
          rango: '(51-75%)',
          descripcion: 'La organización cuenta con un proceso documentado y repetible para cumplir la JM 104-2021. Se aplican criterios homogéneos por artículo, la cobertura es alta y las evidencias son consistentes.',
          evidenciaMinima: 'La mayoría de artículos de la JM 104-2021 están en Cumple o Parcial con evidencias. Comentarios claros que justifican decisiones. Historial con al menos dos mediciones comparables. Reportes y trazabilidad disponibles.',
          razonUbicacion: 'Con 51-75% de cumplimiento de la norma, evidencias consistentes y uso de reportes, la organización aplica un proceso definido y verificable.',
          paraSubir: 'Incorporar métricas de proceso (tiempos, tendencias), priorizar planes de acción y automatizar verificaciones normativas clave.'
        }
      } else { // 76-100%
        return {
          numero: 4,
          nombre: 'Optimizado',
          rango: '(76-100%)',
          descripcion: 'La organización gestiona de forma continua la mejora en el cumplimiento de la JM 104-2021. Se mide y optimiza el proceso, logrando cobertura >=90% con evidencias robustas, muy pocos "No cumple" y planes de acción cerrados.',
          evidenciaMinima: 'Casi todos los artículos se cumplen con evidencia sólida. Re-evaluaciones periódicas (trimestrales/semestrales) con tendencia de mejora. Reportes exportados para auditorías externas. Trazabilidad total.',
          razonUbicacion: 'Con >=76% de cumplimiento, la organización opera bajo control normativo, aplicando indicadores y planes de mejora continua conforme a la JM 104-2021.',
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
        
        4: `La empresa ${nombreEmpresa} fue evaluada contra la JM 104-2021 (N=${totalArticulos} artículos): Cumple ${this.resumen.cumple}, Parcial ${this.resumen.parcial}, No cumple ${this.resumen.noCumple}. Con ${porcentaje.toFixed(1)}% de cumplimiento, corresponde Nivel ${nivel.numero} (${nivel.nombre}). El proceso está medido y mejorado de forma continua: existe cobertura >=90% con evidencias sólidas y planes de acción cerrados, además de indicadores que demuestran mejora sostenida frente a la norma.`
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
    // generarDetalleCalificacionesPDF(doc, startY) {
    //   let yPosition = startY
      
    //   this.titulos.forEach((titulo, tituloIndex) => {
    //     // Verificar espacio en página
    //     if (yPosition > 250) {
    //       doc.addPage()
    //       yPosition = 20
    //     }
        
    //     // Título
    //     doc.setFontSize(12)
    //     doc.setTextColor(25, 118, 210) // Azul
    //     doc.setFont('helvetica', 'bold')
    //     doc.text(`${titulo.numero}. ${titulo.nombre}`, 20, yPosition)
    //     yPosition += 10
        
    //     titulo.capitulos.forEach(capitulo => {
    //       if (yPosition > 250) {
    //         doc.addPage()
    //         yPosition = 20
    //       }
          
    //       // Capítulo
    //       doc.setFontSize(10)
    //       doc.setTextColor(0, 0, 0)
    //       doc.setFont('helvetica', 'bold')
    //       doc.text(`  Cap. ${capitulo.numero}: ${capitulo.nombre}`, 25, yPosition)
    //       yPosition += 8
          
    //       capitulo.articulos.forEach(articulo => {
    //         if (yPosition > 250) {
    //           doc.addPage()
    //           yPosition = 20
    //         }
            
    //         // Artículo
    //         const calificacionArt = this.getCalificacionArticulo(articulo.id)
    //         const estadoTexto = calificacionArt ? this.getTextoEstado(calificacionArt.estado) : 'Sin calificar'
    //         const color = this.getColorPDF(calificacionArt?.estado)
            
    //         doc.setTextColor(...color)
    //         doc.setFont('helvetica', 'bold')
    //         doc.text(`    ${articulo.nombre}`, 30, yPosition)
    //         yPosition += 5
            
    //         doc.setFont('helvetica', 'normal')
    //         doc.text(`    Estado: ${estadoTexto}`, 35, yPosition)
    //         yPosition += 5
            
    //         // Comentario del artículo
    //         if (calificacionArt?.comentario) {
    //           doc.setTextColor(100, 100, 100)
    //           doc.setFontSize(8)
    //           const comentarioLineas = doc.splitTextToSize(`    Comentario: ${calificacionArt.comentario}`, 150)
    //           comentarioLineas.forEach(linea => {
    //             if (yPosition > 250) {
    //               doc.addPage()
    //               yPosition = 20
    //             }
    //             doc.text(linea, 35, yPosition)
    //             yPosition += 4
    //           })
    //           doc.setFontSize(10)
    //         }
            
    //         // Incisos del artículo
    //         articulo.elementos.forEach((elemento, elementoIndex) => {
    //           if (elemento.tipo === 'inciso') {
    //             if (yPosition > 250) {
    //               doc.addPage()
    //               yPosition = 20
    //             }
                
    //             const calificacionInc = this.getCalificacionInciso(articulo.id, elemento.id)
    //             const estadoTextoInc = calificacionInc ? this.getTextoEstado(calificacionInc.estado) : 'Sin calificar'
    //             const colorInc = this.getColorPDF(calificacionInc?.estado)
                
    //             doc.setTextColor(...colorInc)
    //             const numeroInciso = this.getNumeroInciso(articulo.elementos, elementoIndex, elemento.tipoInciso)
    //             doc.setFont('helvetica', 'bold')
    //             doc.text(`      ${numeroInciso}) ${elemento.contenido}`, 40, yPosition)
    //             yPosition += 4
                
    //             doc.setFont('helvetica', 'normal')
    //             doc.text(`      Estado: ${estadoTextoInc}`, 45, yPosition)
    //             yPosition += 4
                
    //             // Comentario del inciso
    //             if (calificacionInc?.comentario) {
    //               doc.setTextColor(100, 100, 100)
    //               doc.setFontSize(8)
    //               const comentarioLineas = doc.splitTextToSize(`      Comentario: ${calificacionInc.comentario}`, 140)
    //               comentarioLineas.forEach(linea => {
    //                 if (yPosition > 250) {
    //                   doc.addPage()
    //                   yPosition = 20
    //                 }
    //                 doc.text(linea, 45, yPosition)
    //                 yPosition += 3
    //               })
    //               doc.setFontSize(10)
    //             }
    //             yPosition += 2
    //           }
    //         })
            
    //         yPosition += 5
    //       })
    //       yPosition += 5
    //     })
    //     yPosition += 8
    //   })
    // },

    // FUNCIÓN CORREGIDA PARA GENERAR DETALLE DE CALIFICACIONES CON MÁRGENES APROPIADOS
    generarDetalleCalificacionesPDF(doc, startY) {
      let yPosition = startY
      const margenIzquierdo = 20
      const margenDerecho = 190
      const anchoTexto = margenDerecho - margenIzquierdo // 170
      
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
        const tituloTexto = `${titulo.numero}. ${titulo.nombre}`
        // Ajustar texto del título si es muy largo
        const tituloLineas = doc.splitTextToSize(tituloTexto, anchoTexto)
        tituloLineas.forEach(linea => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(linea, margenIzquierdo, yPosition)
          yPosition += 6
        })
        yPosition += 4
        
        titulo.capitulos.forEach(capitulo => {
          if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
          }
          
          // Capítulo
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.setFont('helvetica', 'bold')
          const capituloTexto = `  Cap. ${capitulo.numero}: ${capitulo.nombre}`
          const capituloLineas = doc.splitTextToSize(capituloTexto, anchoTexto - 10)
          capituloLineas.forEach(linea => {
            if (yPosition > 270) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(linea, margenIzquierdo + 5, yPosition)
            yPosition += 5
          })
          yPosition += 3
          
          capitulo.articulos.forEach(articulo => {
            if (yPosition > 240) { // Más espacio para artículos largos
              doc.addPage()
              yPosition = 20
            }
            
            // Artículo
            const calificacionArt = this.getCalificacionArticulo(articulo.id)
            const estadoTexto = calificacionArt ? this.getTextoEstado(calificacionArt.estado) : 'Sin calificar'
            const color = this.getColorPDF(calificacionArt?.estado)
            
            doc.setTextColor(...color)
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(9) // Reducir tamaño para evitar desbordamiento
            
            // Dividir nombre del artículo si es muy largo
            const nombreArticuloLineas = doc.splitTextToSize(`    ${articulo.nombre}`, anchoTexto - 20)
            nombreArticuloLineas.forEach(linea => {
              if (yPosition > 270) {
                doc.addPage()
                yPosition = 20
              }
              doc.text(linea, margenIzquierdo + 10, yPosition)
              yPosition += 4
            })
            
            // Estado del artículo
            doc.setFont('helvetica', 'normal')
            doc.text(`    Estado: ${estadoTexto}`, margenIzquierdo + 15, yPosition)
            yPosition += 5
            
            // Comentario del artículo
            if (calificacionArt?.comentario) {
              doc.setTextColor(100, 100, 100)
              doc.setFontSize(8)
              const comentarioLineas = doc.splitTextToSize(`    Comentario: ${calificacionArt.comentario}`, anchoTexto - 30)
              comentarioLineas.forEach(linea => {
                if (yPosition > 270) {
                  doc.addPage()
                  yPosition = 20
                }
                doc.text(linea, margenIzquierdo + 15, yPosition)
                yPosition += 3.5
              })
              doc.setFontSize(9) // Restaurar tamaño
              yPosition += 2
            }
            
            // Incisos del artículo
            if (articulo.elementos && articulo.elementos.length > 0) {
              articulo.elementos.forEach((elemento, elementoIndex) => {
                if (elemento.tipo === 'inciso') {
                  if (yPosition > 260) {
                    doc.addPage()
                    yPosition = 20
                  }
                  
                  const calificacionInc = this.getCalificacionInciso(articulo.id, elemento.id)
                  const estadoTextoInc = calificacionInc ? this.getTextoEstado(calificacionInc.estado) : 'Sin calificar'
                  const colorInc = this.getColorPDF(calificacionInc?.estado)
                  
                  doc.setTextColor(...colorInc)
                  const numeroInciso = this.getNumeroInciso(articulo.elementos, elementoIndex, elemento.tipoInciso)
                  doc.setFont('helvetica', 'bold')
                  doc.setFontSize(8)
                  
                  // Dividir contenido del inciso si es muy largo
                  const incisoTexto = `      ${numeroInciso}) ${elemento.contenido}`
                  const incisoLineas = doc.splitTextToSize(incisoTexto, anchoTexto - 40)
                  incisoLineas.forEach(linea => {
                    if (yPosition > 270) {
                      doc.addPage()
                      yPosition = 20
                    }
                    doc.text(linea, margenIzquierdo + 20, yPosition)
                    yPosition += 3.5
                  })
                  
                  // Estado del inciso
                  doc.setFont('helvetica', 'normal')
                  doc.text(`      Estado: ${estadoTextoInc}`, margenIzquierdo + 25, yPosition)
                  yPosition += 4
                  
                  // Comentario del inciso
                  if (calificacionInc?.comentario) {
                    doc.setTextColor(100, 100, 100)
                    doc.setFontSize(7)
                    const comentarioIncLineas = doc.splitTextToSize(`      Comentario: ${calificacionInc.comentario}`, anchoTexto - 50)
                    comentarioIncLineas.forEach(linea => {
                      if (yPosition > 270) {
                        doc.addPage()
                        yPosition = 20
                      }
                      doc.text(linea, margenIzquierdo + 25, yPosition)
                      yPosition += 3
                    })
                    doc.setFontSize(8) // Restaurar tamaño
                  }
                  yPosition += 2
                }
              })
            }
            
            yPosition += 4
          })
          yPosition += 3
        })
        yPosition += 5
      })
    },

    // FUNCIÓN AUXILIAR PARA MANEJAR TEXTO LARGO CON MÁRGENES SEGUROS
    dividirTextoConMargenes(doc, texto, x, y, anchoMaximo, fontSize = 10) {
      doc.setFontSize(fontSize)
      const lineas = doc.splitTextToSize(texto, anchoMaximo)
      let yActual = y
      
      lineas.forEach(linea => {
        if (yActual > 270) {
          doc.addPage()
          yActual = 20
        }
        doc.text(linea, x, yActual)
        yActual += fontSize * 0.4 + 1
      })
      
      return yActual
    },

    // VERSIÓN ALTERNATIVA MÁS COMPACTA PARA ESPACIOS REDUCIDOS
    generarDetalleCalificacionesPDFCompacto(doc, startY) {
      let yPosition = startY
      const margenIzq = 20
      const anchoUtil = 170
      
      this.titulos.forEach((titulo, tituloIndex) => {
        // Título compacto
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFontSize(11)
        doc.setTextColor(25, 118, 210)
        doc.setFont('helvetica', 'bold')
        doc.text(`TÍTULO ${titulo.numero}: ${titulo.nombre}`, margenIzq, yPosition)
        yPosition += 8
        
        titulo.capitulos.forEach(capitulo => {
          // Capítulo compacto
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.setFont('helvetica', 'bold')
          doc.text(`Cap. ${capitulo.numero}: ${capitulo.nombre}`, margenIzq + 5, yPosition)
          yPosition += 6
          
          capitulo.articulos.forEach(articulo => {
            if (yPosition > 260) {
              doc.addPage()
              yPosition = 20
            }
            
            // Artículo en formato tabla compacta
            const calificacionArt = this.getCalificacionArticulo(articulo.id)
            const estado = calificacionArt ? calificacionArt.estado : 'sin_calificar'
            const color = this.getColorPDF(estado)
            
            doc.setFontSize(9)
            doc.setTextColor(...color)
            doc.setFont('helvetica', 'normal')
            
            // Usar formato: "Artículo X: [Estado]"
            const textoResumen = `${articulo.nombre}: [${this.getTextoEstado(estado)}]`
            const lineasResumen = doc.splitTextToSize(textoResumen, anchoUtil - 10)
            
            lineasResumen.forEach(linea => {
              if (yPosition > 270) {
                doc.addPage()
                yPosition = 20
              }
              doc.text(linea, margenIzq + 10, yPosition)
              yPosition += 4
            })
            
            // Solo mostrar incisos con problemas (No cumple o Parcial)
            if (articulo.elementos) {
              articulo.elementos.forEach((elemento, elementoIndex) => {
                if (elemento.tipo === 'inciso') {
                  const calInciso = this.getCalificacionInciso(articulo.id, elemento.id)
                  if (calInciso && (calInciso.estado === 'no_cumple' || calInciso.estado === 'parcial')) {
                    const numeroInciso = this.getNumeroInciso(articulo.elementos, elementoIndex, elemento.tipoInciso)
                    const estadoInc = this.getTextoEstado(calInciso.estado)
                    
                    doc.setFontSize(8)
                    doc.setTextColor(...this.getColorPDF(calInciso.estado))
                    doc.text(`  ${numeroInciso}) ${estadoInc}`, margenIzq + 15, yPosition)
                    yPosition += 3.5
                  }
                }
              })
            }
            
            yPosition += 2
          })
          yPosition += 3
        })
        yPosition += 4
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

    mostrarSnackbar(mensaje, color = 'success') {
      this.snackbar = {
        show: true,
        message: mensaje,
        color: color
      }
    }
  },
  created() {
    if(this.$route.params.id) {
      var user = auth.currentUser
      if(user) {
        db.collection('usuarios').doc(user.uid).get()
        .then(docUser => {
          if(docUser.exists) {
            this.auditadapor = docUser.data().nombre
          }
        })
      }

      db.collection('leyes').doc(this.$route.params.id).get()
      .then(docLey => {
        if(docLey.exists) {
            this.documento = docLey.data().documento
            this.titulos = docLey.data().titulos
            this.empresaID = docLey.data().empresa

            if(docLey.data().empresa) {
              db.collection('usuarios').where('tipo', '==', 'usuario').get()
              .then(docsUser => {
                var usersArr = []
                docsUser.forEach(eledoc => {
                  usersArr.push(eledoc.id)
                })

                db.collection('tableros').doc(docLey.data().empresa).get()
                .then(docEmpresa => {
                  if(docEmpresa.data().grupos) {
                    docEmpresa.data().grupos.forEach(gr => {
                      db.collection('grupos').doc(gr).get()
                      .then(dcg => {
                        if(dcg.data().usuarios) {
                          dcg.data().usuarios.forEach(ele => {
                            if(usersArr.includes(ele)) {
                              db.collection('usuarios').doc(ele).get()
                              .then(docUser => {
                                if(docUser.exists) {
                                  // console.log(docUser.data().nombre)
                                  this.gerenteEmpresa = docUser.data().nombre
                                }
                              })
                            }
                          })
                        }
                      })
                    })
                  }
                })
              })
            }

            this.getEmpresa(docLey.data().empresa)

            db.collection('auditoria').where('empresa', '==', docLey.data().empresa).where('ley', '==', this.$route.params.id).limit(1).get()
            .then(qAuditoria => {
                if(qAuditoria.size) {
                    qAuditoria.forEach(docA => {
                        // console.log(docA.id)
                        this.auditoriaID = docA.id

                        if(docA.data().calificaciones) {
                            // console.log(docA.data().calificaciones)
                            this.calificaciones = docA.data().calificaciones
                        }

                        if(docA.data().progreso) {
                            this.progreso = docA.data().progreso
                        }

                        if(docA.data().resumen) {
                            this.resumen = docA.data().resumen
                        }

                        this.cargarCalificacionesDesdeDB()
                        this.calcularProgreso()
                    })
                } else {
                    const evaluacionParcial = {
                        empresa: this.empresaID,
                        ley: this.$route.params.id,
                    }

                    db.collection('auditoria').add(evaluacionParcial)
                    .then(adddoc => {
                        console.log('aud. add')
                        this.auditoriaID = adddoc.id

                        this.inicializarCalificaciones()
                        this.calcularProgreso()
                    })
                }
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.calificacion-section {
  background-color: #fafafa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 8px;
}

.calificacion-articulo {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.v-card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
}

.headline {
  font-weight: 600 !important;
}

/* Indentación para jerarquía */
.ml-4 {
  margin-left: 16px !important;
}
</style>