<template>
  <v-layout>
      <v-flex>
          <div class="ml-5 contain-crearCasos">
            <!-- <v-row>
                <v-col cols="12" md="12">
                    <v-btn :disabled="savingForm ? true : $v.$invalid || carga" :loading="loading" @click.prevent="saveLey" class="btn btn-seondary mt-4 float-right" style="position: relative; top: -15px;" type="submit">
                    Guardar
                    </v-btn>
                    <h2 style="margin-bottom: 35px;">Agregar Ley</h2>
                </v-col>
            </v-row>
            
            <v-text-field v-model.trim="nombre" :counter="50" :rules="nameRules" label="Nombre" placeholder="Ingrese un nombre..." required></v-text-field>

            <v-textarea v-model.trim="descripcion" :rules="descripcionRules" :counter="1530" label="Descripción" placeholder="Ingrese una descripción del decreto/ley" required></v-textarea>

            <v-row>
                <v-col cols="12" md="12">
                    <input type="file" accept="application/pdf" :rules="fileRules" @change="handleFileUpload">
                    <p v-if="pdfSrc" style="color: #11bf11;">Archivo correctamente cargado</p>
                </v-col>

                <v-col cols="12" md="12" v-if="pdfSrc && verArticulo">
                    <div v-if="numPages > 0" style="margin-top: 10px; text-align: center;">
                        <button @click="prevPage" :disabled="page <= 1" class="mr-4" :style="page <= 1 ? 'color: #c0c0c0' : ''">⬅ Anterior</button>
                        <span>Página {{ page }} de {{ numPages }}</span>
                        <button @click="nextPage" :disabled="page >= numPages" class="ml-4" :style="page >= numPages ? 'color: #c0c0c0' : ''">Siguiente ➡</button>
                    </div>

                    <pdf
                        :src="pdfSrc"
                        :page="page"
                        @num-pages="numPages = $event"
                        style="width: 100%; height: 600px;"
                    />
                </v-col>
            </v-row> -->

            <v-row>
                <v-col cols="12" md="12">
                    <repeater-articulos />
                </v-col>
            </v-row>
          </div>
      </v-flex>
  </v-layout>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
// import * as pdfjsLib from 'pdfjs-dist'
import RepeaterArticulos from '../components/RepeaterArticulos.vue'
import pdf from 'vue-pdf'
import { mapActions, mapState } from "vuex"
import { db, firebase } from "../firebase"

export default {
    name: 'CrearLey',
    components: {
        RepeaterArticulos,
        pdf
    },
    data() {
        return {
            nombre: '',
            nameRules: [
                v => !!v || 'El nombre es requerido',
                v => (v && v.length <= 50) || 'El nombre no puede ser mayor de 50 caracteres',
            ],
            descripcion: '',
            descripcionRules: [
                v => !!v || 'La descripción es requerida',
                v => (v && v.length <= 1530) || 'La descripción no puede ser de más de 1530 caracteres',
            ],
            prioridad: 1,
            asignacion: '',
            arrayUsuarios: [],
            date: new Date().toISOString().substr(0, 10),
            modal: false,
            time: null,
            modal2: false,
            // pdfFile: null,
            // pdfLoaded: false,
            filepdfSrc: null,
            pdfSrc: null,
            fileRules: [
                v => !!v || 'El archivo es requerido'
            ],
            page: 1,
            numPages: 0,
            currentPage: 0,
			pageCount: 0,
            verArticulo: false,
            savingForm: false
        }
    },
    validations: {
        nombre: {required,minLength: maxLength(50)},
        descripcion: {required,minLength: maxLength(1530)},
        // prioridad: {required},
        // asignacion: {required},
        // time: {required},
        // tiempoestimado: {required},
        pdfSrc: {required}
    },
    computed: {
        ...mapState(['carga', 'usuarios', 'loading']),
        color () {
            if (this.prioridad < 4) return 'green'
            if (this.prioridad < 8) return 'orange'
            return 'red'
        },
        colorEstimado () {
            if (this.tiempoestimado < 250) return 'green'
            if (this.tiempoestimado < 600) return 'orange'
            return 'red'
        }
    },
    methods: {
        ...mapActions(['getUsuarios']),
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
        nextPage() {
            if (this.page < this.numPages) this.page++
        },
        prevPage() {
            if (this.page > 1) this.page--
        },
        saveLey() {
            this.savingForm = true
            const file = this.filepdfSrc
            const storageRef = firebase.storage().ref()
            const pdfRef = storageRef.child(`leyesPDF/${file.name}`)

            pdfRef.put(file)
            .then(snapshot => {
                // Una vez subido, obtenemos el enlace público
                return snapshot.ref.getDownloadURL()
            })
            .then(downloadURL => {
                // console.log('Archivo subido con éxito.')
                console.log('Archivo disponible en:', downloadURL)
  
                // Aquí lo guardas en tu base de datos
                db.collection('leyes').add({
                    nombre: this.nombre,
                    descripcion: this.descripcion,
                    url: downloadURL,
                    legislacion: this.$route.params.id,
                    auditada_por: '',
                    fecha_auditoria: '',
                    fecha: Date.now()
                })

                this.$router.push({name: 'LeyesEmpresa', params: {id: this.$route.params.id}})
                this.savingForm = false
            })
            .catch(error => {
                console.error('Error al subir:', error)
            })

            // var obj = {
            //     nombre: this.nombre,
            //     descripcion: this.descripcion,
            // }
        }
    },
    created(){
        this.getUsuarios()
        this.savingForm = false
    },
    mounted() {
        // PDF de prueba desde la web
        // this.pdfSrc = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
    }
}
</script>