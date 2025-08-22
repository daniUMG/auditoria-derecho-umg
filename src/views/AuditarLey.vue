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
        
        console.log('Calificaciones cargadas desde DB:', this.calificacionesTemp)
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
      
      console.log('Reporte generado:', reporte)
      this.mostrarSnackbar('Reporte generado correctamente', 'info')
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