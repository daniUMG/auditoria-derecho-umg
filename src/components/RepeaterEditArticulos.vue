<template>
  <div>
    <v-card class="pa-6">
      <v-card-title class="headline">
        <v-icon left color="">mdi-gavel</v-icon>
        Editar Ley
      </v-card-title>
      
      <v-card-subtitle class="pb-4">
        Monitoreo Legal - Empresa: {{ tablero.nombre }}
      </v-card-subtitle>

      <v-form ref="form" v-model="valid">
        <!-- Encabezado del documento (sin repeater) -->
        <v-card outlined class="mb-6">
          <v-card-title class="subtitle-1 white--text" style="background-color: #151515 !important; border-color: #151515 !important;">
            <v-icon left color="white">mdi-file-document</v-icon>
            Información principal de la Ley
          </v-card-title>
          <v-card-text>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="documento.numeroLey"
                    label="Número de Ley/Decreto"
                    outlined
                    dense
                    prepend-inner-icon="mdi-file-document"
                    :rules="[rules.required]"
                    ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="documento.fecha"
                    label="Fecha de Publicación"
                    type="date"
                    outlined
                    dense
                    prepend-inner-icon="mdi-calendar"
                    :rules="[rules.required]"
                    ></v-text-field>
                </v-col>

                <!-- <v-col cols="12" md="12">
                    <input type="file" accept="application/pdf" :rules="fileRules" @change="handleFileUpload">
                    <p v-if="pdfSrc" style="color: #11bf11;">Archivo correctamente cargado</p>
                </v-col> -->
            </v-row>
          </v-card-text>
        </v-card>

        <!-- NIVEL 1: TÍTULOS -->
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6">Títulos</h3>
          <v-btn
            color=""
            @click="agregarTitulo"
            :disabled="!valid"
          >
            <v-icon left>mdi-plus</v-icon>
            Agregar Título
          </v-btn>
        </div>

        <div v-if="titulos.length === 0">
          <v-alert type="info" outlined class="mb-4">
            <v-icon slot="prepend">mdi-information</v-icon>
            No hay títulos agregados. Comienza agregando un título.
          </v-alert>
        </div>

        <!-- Repeater de Títulos -->
        <div v-for="(titulo, tituloIndex) in titulos" :key="titulo.id" class="mb-6">
          <v-card outlined>
            <v-card-title class="subtitle-1 blue darken-1 white--text">
              <v-icon left color="white">mdi-format-header-1</v-icon>
              Título {{ tituloIndex + 1 }}
              <v-spacer></v-spacer>
              <v-btn
                icon
                small
                color="white"
                @click="eliminarTitulo(tituloIndex)"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-card-title>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="titulo.numero"
                    label="Número del Título"
                    outlined
                    dense
                    prepend-inner-icon="mdi-numeric"
                    :rules="[rules.required]"
                    hint="Ej: I, II, III, 1, 2, 3"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="8">
                  <v-text-field
                    v-model="titulo.nombre"
                    label="Nombre del Título"
                    outlined
                    dense
                    prepend-inner-icon="mdi-format-title"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- NIVEL 2: CAPÍTULOS -->
              <v-divider class="my-4"></v-divider>
              <div class="d-flex justify-space-between align-center mb-3">
                <h4 class="text-subtitle-1 blue--text">Capítulos del Título {{ tituloIndex + 1 }}</h4>
                <v-btn
                  color="blue"
                  small
                  outlined
                  @click="agregarCapitulo(tituloIndex)"
                >
                  <v-icon left small>mdi-plus</v-icon>
                  Agregar Capítulo
                </v-btn>
              </div>

              <div v-if="titulo.capitulos.length === 0">
                <v-alert type="info" outlined dense class="mb-3">
                  No hay capítulos en este título.
                </v-alert>
              </div>

              <!-- Repeater de Capítulos -->
              <div v-for="(capitulo, capituloIndex) in titulo.capitulos" :key="capitulo.id" class="mb-4">
                <v-card outlined color="blue lighten-5">
                  <v-card-title class="subtitle-2 blue lighten-1 white--text">
                    <v-icon left color="white" small>mdi-format-header-2</v-icon>
                    Capítulo {{ capituloIndex + 1 }}
                    <v-spacer></v-spacer>
                    <v-btn
                      icon
                      x-small
                      color="white"
                      @click="eliminarCapitulo(tituloIndex, capituloIndex)"
                    >
                      <v-icon x-small>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-title>
                  
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="capitulo.numero"
                          label="Número del Capítulo"
                          outlined
                          dense
                          prepend-inner-icon="mdi-roman-numeral-1"
                          :rules="[rules.required, rules.romano]"
                          hint="Ej: I, II, III, IV, V"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="capitulo.nombre"
                          label="Nombre del Capítulo"
                          outlined
                          dense
                          prepend-inner-icon="mdi-format-title"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!-- NIVEL 3: ARTÍCULOS -->
                    <v-divider class="my-3"></v-divider>
                    <div class="d-flex justify-space-between align-center mb-3">
                      <h5 class="text-body-1 green--text">Artículos del Capítulo {{ capitulo.numero }}</h5>
                      <v-btn
                        color="green"
                        x-small
                        outlined
                        @click="agregarArticulo(tituloIndex, capituloIndex)"
                      >
                        <v-icon left x-small>mdi-plus</v-icon>
                        Agregar Artículo
                      </v-btn>
                    </div>

                    <div v-if="capitulo.articulos.length === 0">
                      <v-alert type="info" outlined dense class="mb-3">
                        No hay artículos en este capítulo.
                      </v-alert>
                    </div>

                    <!-- Repeater de Artículos -->
                    <div v-for="(articulo, articuloIndex) in capitulo.articulos" :key="articulo.id" class="mb-3">
                      <v-card outlined color="green lighten-5">
                        <v-card-title class="body-2 green lighten-2 white--text">
                          <v-icon left color="white" x-small>mdi-file-document-outline</v-icon>
                          Artículo {{ articuloIndex + 1 }}
                          <v-spacer></v-spacer>
                          <v-btn
                            icon
                            x-small
                            color="white"
                            @click="eliminarArticulo(tituloIndex, capituloIndex, articuloIndex)"
                          >
                            <v-icon x-small>mdi-delete</v-icon>
                          </v-btn>
                        </v-card-title>
                        
                        <v-card-text>
                          <!-- Nombre del artículo -->
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                v-model="articulo.nombre"
                                label="Nombre del Artículo"
                                outlined
                                dense
                                prepend-inner-icon="mdi-tag-outline"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <!-- Configuración de incisos -->
                          <v-row class="mb-3">
                            <v-col cols="12" class="pb-0">
                              <div class="d-flex align-center">
                                <h6 class="text-body-2 orange--text mr-4">Configuración de Incisos:</h6>
                                <v-btn-toggle
                                  v-model="articulo.tipoInciso"
                                  mandatory
                                  dense
                                  class="mr-4"
                                >
                                  <v-btn value="letras" x-small>
                                    <v-icon left x-small>mdi-alpha-a</v-icon>
                                    Letras (a, b, c)
                                  </v-btn>
                                  <v-btn value="numeros" x-small>
                                    <v-icon left x-small>mdi-numeric-1</v-icon>
                                    Números (1, 2, 3)
                                  </v-btn>
                                </v-btn-toggle>
                              </div>
                            </v-col>
                          </v-row>

                          <!-- Botones para agregar contenido -->
                          <v-row class="mb-3">
                            <v-col cols="12">
                              <div class="d-flex gap-2">
                                <v-btn
                                  color="blue"
                                  x-small
                                  outlined
                                  @click="agregarContenido(tituloIndex, capituloIndex, articuloIndex)"
                                >
                                  <v-icon left x-small>mdi-text</v-icon>
                                  Agregar Contenido
                                </v-btn>
                                <v-btn
                                  color="orange"
                                  x-small
                                  outlined
                                  @click="agregarInciso(tituloIndex, capituloIndex, articuloIndex)"
                                >
                                  <v-icon left x-small>mdi-format-list-bulleted</v-icon>
                                  Agregar Inciso
                                </v-btn>
                              </div>
                            </v-col>
                          </v-row>

                          <!-- Contenido intercalado -->
                          <div v-if="articulo.elementos && articulo.elementos.length === 0">
                            <v-alert type="info" outlined dense class="mb-3">
                              <v-icon slot="prepend">mdi-information</v-icon>
                              Agrega contenido o incisos para estructurar este artículo.
                            </v-alert>
                          </div>

                          <!-- Repeater de elementos (contenido e incisos intercalados) -->
                          <div v-for="(elemento, elementoIndex) in articulo.elementos" :key="elemento.id" class="mb-3">
                            
                            <!-- Si es contenido -->
                            <v-card v-if="elemento.tipo === 'contenido'" outlined color="blue lighten-5">
                              <v-card-title class="caption blue lighten-2 white--text pa-3">
                                <v-icon left color="white" x-small>mdi-text</v-icon>
                                Contenido {{ getNumeroContenido(articulo.elementos, elementoIndex) }}
                                <v-spacer></v-spacer>
                                <v-btn
                                  icon
                                  x-small
                                  color="white"
                                  @click="eliminarElemento(tituloIndex, capituloIndex, articuloIndex, elementoIndex)"
                                >
                                  <v-icon x-small>mdi-delete</v-icon>
                                </v-btn>
                              </v-card-title>
                              
                              <v-card-text class="pa-3">
                                <v-textarea
                                  v-model="elemento.contenido"
                                  label="Contenido"
                                  outlined
                                  dense
                                  rows="3"
                                  prepend-inner-icon="mdi-text"
                                  :rules="[rules.required]"
                                  hide-details
                                ></v-textarea>
                              </v-card-text>
                            </v-card>

                            <!-- Si es inciso -->
                            <v-card v-else outlined color="orange lighten-5">
                                <v-card-title class="caption orange lighten-2 white--text pa-3">
                                    <v-icon left color="white" x-small>mdi-format-list-bulleted</v-icon>
                                    Inciso {{ getNumeroInciso(articulo.elementos, elementoIndex, articulo.tipoInciso) }}
                                    <small class="ml-2">{{ getTipoIncisoTexto(elemento) }}</small>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                    icon
                                    x-small
                                    color="white"
                                    @click="eliminarElemento(tituloIndex, capituloIndex, articuloIndex, elementoIndex)"
                                    >
                                    <v-icon x-small>mdi-delete</v-icon>
                                    </v-btn>
                                </v-card-title>
                                
                                <v-card-text class="pa-3">
                                    <v-textarea
                                    v-model="elemento.contenido"
                                    label="Contenido del Inciso"
                                    outlined
                                    dense
                                    rows="2"
                                    prepend-inner-icon="mdi-text"
                                    :rules="[rules.required]"
                                    hide-details
                                    ></v-textarea>
                                </v-card-text>
                            </v-card>

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

        <!-- Botones de acción principales -->
        <v-row class="mt-6">
          <v-col cols="12" class="text-center">
            <v-btn
              color="success"
              large
              @click="guardarDocumento"
              :disabled="!valid || titulos.length === 0"
              :loading="guardando"
            >
              <v-icon left>mdi-content-save</v-icon>
              Guardar Documento Completo
            </v-btn>

            <v-btn
              color="info"
              large
              outlined
              class="ml-3"
              @click="vistaPrevia"
              :disabled="titulos.length === 0"
            >
              <v-icon left>mdi-eye</v-icon>
              Vista Previa
            </v-btn>

            <!-- <v-btn
              color="grey"
              large
              outlined
              class="ml-3"
              @click="limpiarFormulario"
            >
              <v-icon left>mdi-refresh</v-icon>
              Limpiar Todo
            </v-btn> -->
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- Dialog de Vista Previa -->
    <v-dialog v-model="dialogPrevia" max-width="800px" scrollable>
      <v-card>
        <v-card-title class="white--text" style="background-color: #151515 !important; border-color: #151515 !important;">
          <v-icon left color="white">mdi-eye</v-icon>
          Vista Previa
          <v-spacer></v-spacer>
          <v-btn icon color="white" @click="dialogPrevia = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div v-if="documento.numeroLey">
            <h2 class="text-center mb-4">Decreto: {{ documento.numeroLey }}</h2>
            <p class="text-center mb-6 grey--text">Fecha: {{ documento.fecha }}</p>
            
            <div v-for="titulo in titulos" :key="titulo.id" class="mb-6">
              <h3 class="primary--text mb-3">TÍTULO {{ titulo.numero }} - {{ titulo.nombre }}</h3>
              
              <div v-for="capitulo in titulo.capitulos" :key="capitulo.id" class="ml-4 mb-4">
                <h4 class="blue--text mb-2">CAPÍTULO {{ capitulo.numero }} - {{ capitulo.nombre }}</h4>
                
                <div v-for="(articulo, index) in capitulo.articulos" :key="articulo.id" class="ml-4 mb-3">
                  <h5 class="green--text mb-1">ARTÍCULO {{ index + 1 }} - {{ articulo.nombre }}</h5>
                  
                  <!-- Mostrar elementos intercalados -->
                  <div v-for="(elemento, index) in articulo.elementos" :key="elemento.id" class="mb-1">
                    <div v-if="elemento.tipo === 'contenido'" class="mb-2">
                      <p>{{ elemento.contenido }}</p>
                    </div>
                    <div v-else class="ml-4 mb-1">
                      <span class="font-weight-medium orange--text">
                        {{ getNumeroInciso(articulo.elementos, index, articulo.tipoInciso) }})
                      </span>
                      {{ elemento.contenido }}
                    </div>
                  </div>
                  
                  <!-- Fallback si no hay elementos -->
                  <div v-if="!articulo.elementos || articulo.elementos.length === 0">
                    <p class="grey--text"><em>Artículo sin contenido</em></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

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
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { db, firebase } from "../firebase"

export default {
  name: 'JerarquiaLegal',
  data() {
    return {
        valid: false,
        guardando: false,
        dialogPrevia: false,
        documento: {
            numeroLey: '',
            fecha: ''
        },
        titulos: [],
        contadorId: 1,
        snackbar: {
            show: false,
            message: '',
            color: 'success'
        },
        rules: {
            required: value => !!value || 'Este campo es requerido',
            romano: value => {
            if (!value) return true // Se maneja con required
            const regexRomano = /^(XL|L?X{0,3})(IX|IV|V?I{0,3})$/i
            const regexNumero = /^\d+$/
            return regexRomano.test(value) || regexNumero.test(value) || 'Debe ser un número romano (I, II, III...) o arábigo (1, 2, 3...)'
            }
        },
        fileRules: [
            v => !!v || 'El archivo es requerido'
        ],
        filepdfSrc: null,
        pdfSrc: null,
    }
  },
  computed: {
    ...mapState(['tablero'])
  },
  methods: {
    ...mapActions(['getEmpresa']),
    handleFileUpload(event) {
        const file = event.target.files[0]
        this.filepdfSrc = event.target.files[0]
        this.pdfSrc = URL.createObjectURL(file) // para previsualizar

        // const storageRef = firebase.storage().ref()
        // const pdfRef = storageRef.child(`leyesPDF/${file.name}`)

        // pdfRef.put(file)
        // .then(snapshot => {
        //     console.log('Archivo subido con éxito.')
        // })
        // .catch(error => {
        //     console.error('Error al subir:', error)
        // })
    },
    // MÉTODOS PARA TÍTULOS
    agregarTitulo() {
      const nuevoTitulo = {
        id: this.contadorId++,
        numero: '',
        nombre: '',
        capitulos: []
      }
      this.titulos.push(nuevoTitulo)
      this.mostrarSnackbar('Título agregado correctamente', 'success')
    },
    
    eliminarTitulo(index) {
      if (confirm('¿Estás seguro de eliminar este título y todo su contenido?')) {
        this.titulos.splice(index, 1)
        this.mostrarSnackbar('Título eliminado', 'warning')
      }
    },

    // MÉTODOS PARA CAPÍTULOS
    agregarCapitulo(tituloIndex) {
      const nuevoCapitulo = {
        id: this.contadorId++,
        numero: '',
        nombre: '',
        articulos: []
      }
      this.titulos[tituloIndex].capitulos.push(nuevoCapitulo)
      this.mostrarSnackbar('Capítulo agregado correctamente', 'success')
    },
    
    eliminarCapitulo(tituloIndex, capituloIndex) {
      if (confirm('¿Estás seguro de eliminar este capítulo y todo su contenido?')) {
        this.titulos[tituloIndex].capitulos.splice(capituloIndex, 1)
        this.mostrarSnackbar('Capítulo eliminado', 'warning')
      }
    },

    // MÉTODOS PARA ARTÍCULOS
    agregarArticulo(tituloIndex, capituloIndex) {
      const nuevoArticulo = {
        id: this.contadorId++,
        nombre: '',
        tipoInciso: 'letras', // por defecto letras
        elementos: [] // array que contendrá contenido e incisos intercalados
      }
      this.titulos[tituloIndex].capitulos[capituloIndex].articulos.push(nuevoArticulo)
      this.mostrarSnackbar('Artículo agregado correctamente', 'success')
    },
    
    eliminarArticulo(tituloIndex, capituloIndex, articuloIndex) {
      if (confirm('¿Estás seguro de eliminar este artículo y sus incisos?')) {
        this.titulos[tituloIndex].capitulos[capituloIndex].articulos.splice(articuloIndex, 1)
        this.mostrarSnackbar('Artículo eliminado', 'warning')
      }
    },

    // MÉTODOS PARA CONTENIDO E INCISOS INTERCALADOS
    agregarContenido(tituloIndex, capituloIndex, articuloIndex) {
      const nuevoContenido = {
        id: this.contadorId++,
        tipo: 'contenido',
        contenido: ''
      }
      this.titulos[tituloIndex].capitulos[capituloIndex].articulos[articuloIndex].elementos.push(nuevoContenido)
      this.mostrarSnackbar('Contenido agregado correctamente', 'success')
    },

    // agregarInciso(tituloIndex, capituloIndex, articuloIndex) {
    //   const nuevoInciso = {
    //     id: this.contadorId++,
    //     tipo: 'inciso',
    //     contenido: ''
    //   }
    //   this.titulos[tituloIndex].capitulos[capituloIndex].articulos[articuloIndex].elementos.push(nuevoInciso)
    //   this.mostrarSnackbar('Inciso agregado correctamente', 'success')
    // },

    // MÉTODOS AUXILIARES
    getNumeroContenido(elementos, elementoIndex) {
      // Cuenta solo los elementos de tipo 'contenido' hasta el índice actual
      let contador = 1
      for (let i = 0; i <= elementoIndex; i++) {
        if (elementos[i] && elementos[i].tipo === 'contenido' && i < elementoIndex) {
          contador++
        }
      }
      return contador
    },

    eliminarElemento(tituloIndex, capituloIndex, articuloIndex, elementoIndex) {
      const elemento = this.titulos[tituloIndex].capitulos[capituloIndex].articulos[articuloIndex].elementos[elementoIndex]
      const tipo = elemento.tipo === 'contenido' ? 'contenido' : 'inciso'
      
      if (confirm(`¿Estás seguro de eliminar este ${tipo}?`)) {
        this.titulos[tituloIndex].capitulos[capituloIndex].articulos[articuloIndex].elementos.splice(elementoIndex, 1)
        this.mostrarSnackbar(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} eliminado`, 'warning')
      }
    },

    // MÉTODO MODIFICADO PARA AGREGAR INCISO
    agregarInciso(tituloIndex, capituloIndex, articuloIndex) {
      const articulo = this.titulos[tituloIndex].capitulos[capituloIndex].articulos[articuloIndex]
      
      const nuevoInciso = {
        id: this.contadorId++,
        tipo: 'inciso',
        contenido: '',
        tipoInciso: articulo.tipoInciso // Guarda el tipo de inciso al momento de creación
      }
      
      articulo.elementos.push(nuevoInciso)
      this.mostrarSnackbar('Inciso agregado correctamente', 'success')
    },

    // MÉTODO MODIFICADO PARA OBTENER NUMERACIÓN DE INCISO
    getNumeroInciso(elementos, elementoIndex, tipoIncisoDefault) {
      // Usa el tipo de inciso guardado en el elemento, o el por defecto
      const elemento = elementos[elementoIndex]
      const tipoInciso = elemento.tipoInciso || tipoIncisoDefault
      
      // Encuentra el último contenido antes del inciso actual
      let ultimoContenidoIndex = -1
      for (let i = elementoIndex - 1; i >= 0; i--) {
        if (elementos[i].tipo === 'contenido') {
          ultimoContenidoIndex = i
          break
        }
      }
      
      // Cuenta incisos desde el último contenido
      let contadorIncisos = 1
      for (let i = ultimoContenidoIndex + 1; i < elementoIndex; i++) {
        if (elementos[i] && elementos[i].tipo === 'inciso') {
          contadorIncisos++
        }
      }
      
      if (tipoInciso === 'letras') {
        return String.fromCharCode(96 + contadorIncisos) // a, b, c, etc.
      } else {
        return contadorIncisos.toString() // 1, 2, 3, etc.
      }
    },

    // MÉTODO AUXILIAR PARA MOSTRAR EL TIPO DE INCISO EN EL TÍTULO
    getTipoIncisoTexto(elemento) {
      if (elemento.tipoInciso === 'letras') {
        return '(Letras)'
      } else if (elemento.tipoInciso === 'numeros') {
        return '(Números)'
      }
      return ''
    },
    
    guardarDocumento() {
      if (this.$refs.form.validate()) {
        this.guardando = true
        
        const documentoCompleto = {
          ...this.documento,
          titulos: this.titulos,
          fechaCreacion: new Date().toISOString(),
          totalTitulos: this.titulos.length,
          totalCapitulos: this.contarCapitulos(),
          totalArticulos: this.contarArticulos(),
          totalIncisos: this.contarIncisos()
        }

        db.collection('leyes').doc(this.$route.params.id).update({
          documento: this.documento,
          titulos: this.titulos
        })
        
        // Simular guardado
        setTimeout(() => {
        //   console.log('Documento completo guardado:', documentoCompleto)
          this.guardando = false
          this.mostrarSnackbar('Documento guardado exitosamente', 'success')
        }, 2000)
      }
    },

    vistaPrevia() {
      this.dialogPrevia = true
    },
    
    limpiarFormulario() {
      if (confirm('¿Estás seguro de limpiar todo el formulario? Se perderán todos los datos.')) {
        this.documento = {
          numeroLey: '',
          fecha: ''
        }
        this.titulos = []
        this.contadorId = 1
        this.$refs.form.resetValidation()
        this.mostrarSnackbar('Formulario limpiado', 'info')
      }
    },
    
    mostrarSnackbar(mensaje, color = 'success') {
      this.snackbar = {
        show: true,
        message: mensaje,
        color: color
      }
    },

    // CONTADORES PARA ESTADÍSTICAS
    contarCapitulos() {
      return this.titulos.reduce((total, titulo) => total + titulo.capitulos.length, 0)
    },
    
    contarArticulos() {
      return this.titulos.reduce((total, titulo) => 
        total + titulo.capitulos.reduce((subTotal, capitulo) => 
          subTotal + capitulo.articulos.length, 0), 0)
    },
    
    contarIncisos() {
      return this.titulos.reduce((total, titulo) => 
        total + titulo.capitulos.reduce((subTotal, capitulo) => 
          subTotal + capitulo.articulos.reduce((incisoTotal, articulo) => {
            if (!articulo.elementos) return incisoTotal
            return incisoTotal + articulo.elementos.filter(el => el.tipo === 'inciso').length
          }, 0), 0), 0)
    }
  },
  created() {
    if(this.$route.params.id) {
        db.collection('leyes').doc(this.$route.params.id).get()
        .then(docLey => {
            if(docLey.exists) {
                this.documento = docLey.data().documento
                this.titulos = docLey.data().titulos

                this.getEmpresa(docLey.data().empresa)
            }
        })
    }
  }
}
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
}

.headline {
  font-weight: 600 !important;
}

/* Estilos para jerarquía visual */
.v-card .v-card {
  border-left: 4px solid;
}

.v-card .v-card .v-card {
  border-left-color: #2196F3 !important;
}

.v-card .v-card .v-card .v-card {
  border-left-color: #4CAF50 !important;
}

.v-card .v-card .v-card .v-card .v-card {
  border-left-color: #FF9800 !important;
}

/* Indentación visual */
.ml-4 {
  margin-left: 16px !important;
}

.gap-2 {
  gap: 8px;
}
</style>