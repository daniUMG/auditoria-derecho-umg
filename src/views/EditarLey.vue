<template>
    <div>
        <v-layout>
            <v-flex>
                <div class="ml-5 contain-crearCasos">
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-btn :disabled="savingForm ? true : $v.$invalid || carga" :loading="loading" @click.prevent="saveLey" class="btn btn-seondary mt-4 float-right" style="position: relative; top: -15px;" type="submit">
                            Guardar
                            </v-btn>
                            <h2 style="margin-bottom: 20px;">Editar Ley</h2>
                            <v-btn color="primary float-right" style="margin-bottom: 25px;" @click="drawer = true" v-if="usuario.tipo === 'auditor'">Evaluar Ley</v-btn>
                        </v-col>
                    </v-row>

                    <v-row v-if="fecha_auditoria && auditada_por">
                        <v-col cols="12" md="12" style="text-align: right;">
                            <p><b>Última auditoria realizada por:</b> {{ auditada_por }}</p>
                            <p><b>Fecha última auditoria:</b> {{ fecha_auditoria }}</p>
                        </v-col>
                    </v-row>
                    
                    <!-- @submit.prevent="setCaso({nombre, descripcion, usuarioAsignacion: asignacion, prioridad, date, time, tiempoEstimado: tiempoestimado, tablero_id: $route.params.id})" -->
                    <!-- <v-form> -->
                        <v-text-field v-model.trim="nombre" :counter="50" :rules="nameRules" label="Nombre" placeholder="Ingrese un nombre..." required></v-text-field>

                        <v-textarea v-model.trim="descripcion" :rules="descripcionRules" :counter="1530" label="Descripción" placeholder="Ingrese una descripción del decreto/ley" required></v-textarea>

                        <v-row>
                            <v-col cols="12" md="12">
                                <input type="file" accept="application/pdf" :rules="fileRules" @change="handleFileUpload">
                            </v-col>

                            <v-col cols="12" md="12" v-if="pdfSrc">
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
                        </v-row>
                    <!-- </v-form> -->
                </div>
            </v-flex>
        </v-layout>

        <v-navigation-drawer
            v-model="drawer"
            right
            temporary
            width="700"
            style="position: fixed;"
        >
            <v-toolbar flat>
                <v-toolbar-title>Evaluación de la Ley</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="drawer = false">
                <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-divider></v-divider>

            <v-form ref="form" lazy-validation>
                <v-container>
                <!-- Slider para cumplimiento -->
                <v-row>
                    <v-col cols="12">
                    <v-subheader>Cumplimiento de la Ley: {{ cumplimiento }}%</v-subheader>
                    <v-slider
                        v-model="cumplimiento"
                        :min="0"
                        :max="100"
                        step="1"
                        ticks="always"
                        tick-size="4"
                    ></v-slider>
                    </v-col>
                </v-row>

                <!-- Campos de radio buttons -->
                <v-row v-for="(pregunta, index) in preguntas" :key="index">
                    <v-col cols="12">
                    <v-subheader>{{ pregunta.titulo }}</v-subheader>
                    <v-radio-group v-model="evaluaciones[index]" row>
                        <v-radio label="Muy Bajo" :value="1"></v-radio>
                        <v-radio label="Bajo" :value="2"></v-radio>
                        <v-radio label="Medio" :value="3"></v-radio>
                        <v-radio label="Alto" :value="4"></v-radio>
                        <v-radio label="Muy Alto" :value="5"></v-radio>
                    </v-radio-group>
                    </v-col>
                </v-row>

                <v-row justify="end">
                    <v-btn color="success" @click.prevent="submitFormAuditor">Enviar Evaluación</v-btn>
                </v-row>
                </v-container>
            </v-form>
        </v-navigation-drawer>
    </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
// import * as pdfjsLib from "pdfjs-dist/webpack";
import moment from 'moment';
import axios from "axios";
import pdf from 'vue-pdf'
import { mapActions, mapState } from "vuex"
import { db, firebase } from "../firebase";

export default {
    name: 'EditarLey',
    components: {
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
            tiempoestimado: 1,
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
            fecha_auditoria: '',
            auditada_por: '',
            savingForm: false,

            // sidebar
            drawer: false,
            cumplimiento: 50,
            preguntas: [
                { titulo: "Claridad de la ley" },
                { titulo: "Aplicabilidad práctica" },
                { titulo: "Impacto social" },
                { titulo: "Coherencia con otras leyes" },
                { titulo: "Facilidad de cumplimiento" }
            ],
            evaluaciones: [3, 3, 3, 3, 3],
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
        ...mapState(['carga', 'usuarios', 'loading', 'usuario']),
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
    watch: {
        drawer(val) {
            // console.log(val)
            if (val) {
                // document.body.classList.add('no-scroll');
                document.body.style.overflow = 'hidden'
            } else {
                // document.body.classList.remove('no-scroll');
                document.body.style.overflow = 'auto'
            }
        }
    },
    methods: {
        ...mapActions(['setCaso','getUsuarios']),
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

            if(this.filepdfSrc) {
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
                    db.collection('leyes').doc(this.$route.params.id).update({
                        nombre: this.nombre,
                        descripcion: this.descripcion,
                        url: downloadURL,
                        // legislacion: this.$route.params.id,
                        auditada_por: '',
                        fecha_auditoria: '',
                        // fecha: Date.now()
                    })

                    this.$router.push({name: 'Tareas', params: {id: this.legislacionid}})
                    this.savingForm = false
                })
                .catch(error => {
                    console.error('Error al subir:', error)
                })
            } else {
                // Aquí lo guardas en tu base de datos
                db.collection('leyes').doc(this.$route.params.id).update({
                    nombre: this.nombre,
                    descripcion: this.descripcion,
                    // url: downloadURL,
                    // legislacion: this.$route.params.id,
                    auditada_por: '',
                    fecha_auditoria: '',
                    // fecha: Date.now()
                })

                this.$router.push({name: 'Tareas', params: {id: this.legislacionid}})
                this.savingForm = false
            }

            // var obj = {
            //     nombre: this.nombre,
            //     descripcion: this.descripcion,
            // }
        },
        async cargarPDF(pdfSrcLocal) {
            let dataSrc = JSON.stringify({
                "url": pdfSrcLocal
            });

            let configSrc = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://us-central1-seocloud-dcdfb.cloudfunctions.net/index-seocloud/pdf',
                headers: { 
                    'Content-Type': 'application/json'
                },
                data: dataSrc,
                responseType: 'arraybuffer'
            };
    
            axios(configSrc)
            .then((response) => {
                // console.log(response.data)
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                this.pdfSrc = url; // para usar en vue-pdf

                // const formData = new FormData();
                // formData.append("file", blob, "document.pdf");

                // this.$http.post("http://localhost:3000/parse-pdf", formData)
                // let configSrc = {
                //     method: 'post',
                //     maxBodyLength: Infinity,
                //     url: 'https://us-central1-seocloud-dcdfb.cloudfunctions.net/index-seocloud/parse-pdf',
                //     headers: { 
                //         'Content-Type': 'application/json'
                //     },
                //     data: dataSrc,
                //     responseType: 'arraybuffer'
                // };
        
                // axios(configSrc)
                // .then(res => {
                //     console.log("JSON del PDF:", res.data);
                // })
                // .catch(err => console.error(err));
            });
        },
        submitFormAuditor() {
            if(this.$route.params.id) {
                // console.log(this.preguntas, this.evaluaciones, this.cumplimiento)
                // alert('Evaluación guardada')
                db.collection('leyes').doc(this.$route.params.id).update({
                    cumplimiento: this.cumplimiento,
                    evaluaciones: this.evaluaciones,
                    preguntas: this.preguntas.map(p => p.titulo),
                    auditada_por: this.usuario.email,
                    obj_auditor: this.usuario,
                    fecha_auditoria: Date.now()
                })
                .then(() => {
                    this.drawer = false
                    // this.cumplimiento = 50
                    // this.preguntas = [
                    //     { titulo: "Claridad de la ley" },
                    //     { titulo: "Aplicabilidad práctica" },
                    //     { titulo: "Impacto social" },
                    //     { titulo: "Coherencia con otras leyes" },
                    //     { titulo: "Facilidad de cumplimiento" }
                    // ]
                    // this.evaluaciones = [3, 3, 3, 3, 3]

                    alert('Evaluación guardada')
                })
            }
        }
    },
    created(){
        this.savingForm = false
        this.drawer = false

        if(this.$route.params.id) {
            db.collection('leyes').doc(this.$route.params.id).get()
            .then(docLey => {
                if(docLey.exists) {
                    this.legislacionid = docLey.data().legislacion ? docLey.data().legislacion : ''
                    var pdfSrcLocal = docLey.data().url ? docLey.data().url : null
                    this.nombre = docLey.data().nombre ? docLey.data().nombre : ''
                    this.descripcion = docLey.data().descripcion ? docLey.data().descripcion : ''

                    this.cumplimiento = docLey.data().cumplimiento ? docLey.data().cumplimiento : 50
                    this.evaluaciones = docLey.data().evaluaciones ? docLey.data().evaluaciones : [3, 3, 3, 3, 3]
                    this.preguntas = docLey.data().preguntas ? docLey.data().preguntas : [
                        { titulo: "Claridad de la ley" },
                        { titulo: "Aplicabilidad práctica" },
                        { titulo: "Impacto social" },
                        { titulo: "Coherencia con otras leyes" },
                        { titulo: "Facilidad de cumplimiento" }
                    ]
                    this.auditada_por = docLey.data().auditada_por ? docLey.data().auditada_por : ''
                    this.fecha_auditoria = docLey.data().fecha_auditoria ? moment(docLey.data().fecha_auditoria).format('lll') : ''

                    // this.axios.get(pdfSrcLocal, { responseType: "blob" })
                    // .then(res => {
                    //     const url = URL.createObjectURL(res.data);
                    //     this.pdfSrc = url; // para usar en vue-pdf
                    // });
                    if(pdfSrcLocal) {
                        this.cargarPDF(pdfSrcLocal)
                    }
                }
            })
        }
    },
    mounted() {
        // PDF de prueba desde la web
        // this.pdfSrc = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
    }
}
</script>