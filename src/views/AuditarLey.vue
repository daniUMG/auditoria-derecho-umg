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
import { db, firebase } from "../firebase"

export default {
  name: 'VistaCalificacionDecreto',
  data() {
    return {
      guardando: false,
      
      // Datos del documento - SE ALIMENTAN DESDE this.documento y this.titulos
      documento: {},
      
      // Estructura de títulos - SE ALIMENTA DESDE this.titulos
      titulos: [],
      
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
      const reporte = {
        documento: this.documento,
        resumen: this.resumen,
        progreso: this.progreso,
        detalleCalificaciones: this.calificaciones
      }
      this.generarReportePDF()
      // this.generarReportePDFCanvas()
      
      console.log('Reporte generado:', reporte)
      this.mostrarSnackbar('Reporte generado correctamente', 'info')
    },
    
    // async generarReportePDFCanvas() {
    //   try {
    //     // Crear HTML del reporte
    //     const reporteHTML = this.crearHTMLReporte()
        
    //     // Crear elemento temporal
    //     const elemento = document.createElement('div')
    //     elemento.innerHTML = reporteHTML
    //     elemento.style.position = 'absolute'
    //     elemento.style.left = '-9999px'
    //     elemento.style.width = '800px'
    //     elemento.style.padding = '20px'
    //     elemento.style.backgroundColor = 'white'
    //     elemento.style.fontFamily = 'Arial, sans-serif'
        
    //     document.body.appendChild(elemento)
        
    //     // Convertir a canvas
    //     const canvas = await html2canvas(elemento)
        
    //     // Crear PDF usando CDN de jsPDF
    //     const { jsPDF } = window.jspdf
    //     const pdf = new jsPDF('p', 'mm', 'a4')
        
    //     const imgData = canvas.toDataURL('image/png')
    //     const imgWidth = 210
    //     const pageHeight = 295
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width
    //     let heightLeft = imgHeight
        
    //     let position = 0
        
    //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    //     heightLeft -= pageHeight
        
    //     while (heightLeft >= 0) {
    //       position = heightLeft - imgHeight
    //       pdf.addPage()
    //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    //       heightLeft -= pageHeight
    //     }
        
    //     // Limpiar
    //     document.body.removeChild(elemento)
        
    //     // Descargar
    //     pdf.save(`Reporte_${this.documento.numeroLey}_${new Date().toISOString().split('T')[0]}.pdf`)
    //     this.mostrarSnackbar('Reporte PDF generado correctamente', 'success')
        
    //   } catch (error) {
    //     console.error('Error generando PDF:', error)
    //     this.mostrarSnackbar('Error al generar el PDF', 'error')
    //   }
    // },
    
    // crearHTMLReporte() {
    //   return `
    //     <div style="font-family: Arial, sans-serif; padding: 20px;">
    //       <h1 style="color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">
    //         REPORTE DE CALIFICACIÓN LEGAL
    //       </h1>
          
    //       <div style="margin: 20px 0;">
    //         <p><strong>Documento:</strong> ${this.documento.numeroLey}</p>
    //         <p><strong>Fecha:</strong> ${this.documento.fecha}</p>
    //         <p><strong>Fecha de Evaluación:</strong> ${new Date().toLocaleDateString()}</p>
    //       </div>
          
    //       <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
    //         <h2 style="color: #673ab7; margin-top: 0;">RESUMEN ESTADÍSTICO</h2>
    //         <div style="display: flex; justify-content: space-around; text-align: center;">
    //           <div style="color: #4caf50;"><strong>${this.resumen.cumple}</strong><br>Cumple</div>
    //           <div style="color: #ff9800;"><strong>${this.resumen.parcial}</strong><br>Parcial</div>
    //           <div style="color: #f44336;"><strong>${this.resumen.noCumple}</strong><br>No Cumple</div>
    //           <div style="color: #9e9e9e;"><strong>${this.resumen.noAplica}</strong><br>No Aplica</div>
    //         </div>
    //         <p style="text-align: center; margin: 10px 0;"><strong>Auditoría completada al: ${this.progreso.porcentaje.toFixed(1)}%</strong></p>
    //       </div>
          
    //       <h2 style="color: #1976d2;">DETALLE DE CALIFICACIONES</h2>
          
    //       ${this.generarDetalleHTML()}
    //     </div>
    //   `
    // },

    crearHTMLReporte() {
      return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #673ab7; margin-top: 0;">RESUMEN ESTADÍSTICO</h2>
            <div style="display: flex; justify-content: space-around; text-align: center;">
              <div style="color: #4caf50;"><strong>${this.resumen.cumple}</strong><br>Cumple</div>
              <div style="color: #ff9800;"><strong>${this.resumen.parcial}</strong><br>Parcial</div>
              <div style="color: #f44336;"><strong>${this.resumen.noCumple}</strong><br>No Cumple</div>
              <div style="color: #9e9e9e;"><strong>${this.resumen.noAplica}</strong><br>No Aplica</div>
            </div>
            <p style="text-align: center; margin: 10px 0;"><strong>Auditoría completada al: ${this.progreso.porcentaje.toFixed(1)}%</strong></p>
          </div>
          
          <h2 style="color: #1976d2;">DETALLE DE CALIFICACIONES</h2>
          
          ${this.generarDetalleHTML()}
        </div>
      `
    },

    crearHTMLReporteHeader() {
      return `
            <div style="margin: 20px 0;">
              <p><strong>Documento:</strong> ${this.documento.numeroLey}</p>
              <p><strong>Fecha:</strong> ${this.documento.fecha}</p>
              <p><strong>Fecha de Evaluación:</strong> ${new Date().toLocaleDateString()}</p>
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
    
    // FUNCIÓN PRINCIPAL PARA GENERAR PDF
    
    async generarReportePDF() {
      try {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()
        
        // Configuración de colores
        const azulPrimario = [65, 105, 225] // Color azul del encabezado
        const azulSecundario = [70, 130, 180]
        
        // ENCABEZADO PRINCIPAL
        doc.setFillColor(...azulPrimario)
        doc.rect(0, 0, 210, 70, 'F')
        
        // Nombre de la empresa (centrado y grande)
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(28)
        doc.setFont('helvetica', 'bold')
        const nombreReporte = "Cumplimiento Legal de la empresa:" // Variable personalizable
        doc.text(nombreReporte, 105, 20, { align: 'center' })
        doc.setFont('helvetica', 'bold')
        const nombreEmpresa = this.tablero.nombre
        doc.text(nombreEmpresa, 105, 35, { align: 'center' })

        // const reporteHTMLHeader = this.crearHTMLReporteHeader()
        
        // // Crear elemento temporal
        // const elementoHeader = document.createElement('div')
        // elementoHeader.innerHTML = reporteHTMLHeader
        // // elementoHeader.style.position = 'absolute'
        // // elementoHeader.style.left = '-9999px'
        // // elementoHeader.style.width = '800px'
        // // elementoHeader.style.padding = '20px'
        // // elementoHeader.style.backgroundColor = 'white'
        // elementoHeader.style.fontFamily = 'Arial, sans-serif'
        
        // document.body.appendChild(elementoHeader)
        
        // // Convertir a canvas
        // const canvasHeader = await html2canvas(elementoHeader)

        // // Crear PDF usando CDN de jsPDF
        // // const { jsPDF } = window.jspdf
        // // const pdf = new jsPDF('p', 'mm', 'a4')
        
        // const imgDataHeader = canvasHeader.toDataURL('image/png')
        // const imgWidthHeader = 210
        // const pageHeightHeader = 295
        // const imgHeightHeader = (canvasHeader.height * imgWidthHeader) / canvasHeader.width
        // let heightLeftHeader = imgHeightHeader
        
        // let positionHeader = 0
        
        // doc.addImage(imgDataHeader, 'PNG', 0, positionHeader, imgWidthHeader, imgHeightHeader)
        // heightLeftHeader -= pageHeightHeader
        
        // while (heightLeftHeader >= 0) {
        //   positionHeader = heightLeftHeader - imgHeightHeader
        //   doc.addPage()
        //   doc.addImage(imgDataHeader, 'PNG', 0, positionHeader, imgWidthHeader, imgHeightHeader)
        //   heightLeftHeader -= pageHeightHeader
        // }
        
        // // Limpiar
        // document.body.removeChild(elementoHeader)
        // <div style="margin: 20px 0;">
        //       <p><strong>Documento:</strong> ${this.documento.numeroLey}</p>
        //       <p><strong>Fecha:</strong> ${this.documento.fecha}</p>
        //       <p><strong>Fecha de Evaluación:</strong> ${new Date().toLocaleDateString()}</p>
        //     </div>
        
        
        // Ley evaluada (más pequeño, centrado)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'normal')
        doc.text(`Decreto: ${this.documento.numeroLey}`, 105, 45, { align: 'center' })
        doc.text(`Fecha del decreto: ${this.documento.fecha}`, 105, 53, { align: 'center' })
        doc.text(`Fecha de Evaluación: ${new Date().toLocaleDateString()}`, 105, 61, { align: 'center' })
        
        // SECCIÓN: NIVEL DE MADUREZ
        let yPos = 75
        doc.setFillColor(...azulSecundario)
        doc.rect(20, yPos, 170, 12, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text("Nivel de madurez X - NombreNivel", 105, yPos + 8, { align: 'center' })
        
        // Descripción del nivel
        yPos += 25
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text("Pequeño resumen de lo que implica este nivel de madurez", 105, yPos, { align: 'center' })
        
        // SECCIÓN: RESUMEN Y RECOMENDACIONES
        yPos += 25
        doc.setFillColor(...azulSecundario)
        doc.rect(20, yPos, 170, 12, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text("Resumen y recomendaciones", 105, yPos + 8, { align: 'center' })
        
        // GRÁFICA DE BARRAS
        yPos += 30
        this.dibujarGraficaBarras(doc, yPos)
        
        // Párrafo explicativo
        yPos += 80
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const textoExplicativo = "Párrafo destacando por qué la empresa obtuvo este nivel de madurez y una pequeña recomendación"
        const lineasTexto = doc.splitTextToSize(textoExplicativo, 170)
        lineasTexto.forEach(linea => {
          doc.text(linea, 105, yPos, { align: 'center' })
          yPos += 5
        })
        
        // NUEVA PÁGINA PARA ARTÍCULOS EVALUADOS
        doc.addPage()
        yPos = 20
        
        // SECCIÓN: ARTÍCULOS EVALUADOS
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
        doc.save(`Reporte_${this.documento.numeroLey}_${new Date().toISOString().split('T')[0]}.pdf`)
        this.mostrarSnackbar('Reporte PDF generado correctamente', 'success')
        
      } catch (error) {
        console.error('Error generando PDF:', error)
        this.mostrarSnackbar('Error al generar el PDF', 'error')
      }
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
        db.collection('leyes').doc(this.$route.params.id).get()
        .then(docLey => {
            if(docLey.exists) {
                this.documento = docLey.data().documento
                this.titulos = docLey.data().titulos
                this.empresaID = docLey.data().empresa

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