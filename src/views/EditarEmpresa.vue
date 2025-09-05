<template>
  <v-layout>
        <v-flex>
            <!-- <h1>{{$route.params.id}}</h1> -->
            <v-row>
                <v-col>
                    <div>
                        <!-- <form @submit.prevent="editarEmpresa(tablero)"> -->
                            <v-text-field
                                v-model.trim="tablero.nombre"
                                :counter="30"
                                :error-messages="nombreErrors"
                                label="Nombre Empresa"
                                required
                                @input="$v.tablero.nombre.$touch()"
                                @blur="$v.tablero.nombre.$touch()"
                            ></v-text-field>

                            <v-textarea
                                v-model.trim="tablero.descripcion"
                                autocomplete="descripcion"
                                label="Descripción"
                                :error-messages="descripcionErrors"
                                :counter="1530"
                                required
                                @input="$v.tablero.descripcion.$touch()"
                                @blur="$v.tablero.descripcion.$touch()"
                            ></v-textarea>

                            <v-text-field
                                v-model.trim="tablero.region"
                                :counter="15"
                                :error-messages="regionErrors"
                                label="Región"
                                required
                                @input="$v.tablero.nombre.$touch()"
                                @blur="$v.tablero.nombre.$touch()"
                            ></v-text-field>

                            <label for="temaTablero">Tema Empresa</label><br>
                            <input type="color" v-model="tablero.tema" required><br>

                            <v-select
                                v-model="tablero.grupos"
                                :items="grupos"
                                item-value="id"
                                item-text="nombre"
                                attach
                                chips
                                label="Grupos con acceso:"
                                multiple
                                required
                            ></v-select>

                            <v-btn
                                class="mr-4 mt-4"
                                type="submit"
                                :loading="loading"
                                :disabled="$v.tablero.$invalid || carga"
                                @click="editarEmpresaLocal(tablero)"
                            >
                                Guardar
                            </v-btn>
                        <!-- </form> -->
                    </div>
                </v-col>
            </v-row>
        </v-flex>

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
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import {db} from '../firebase'

export default {
    name: 'EditarEmpresa',
    data () {
      return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        id: this.$route.params.id,
        name: '',
        select: null,
        temaColumna: '#ddd',
        items: [
            'A mi',
            'A quien lo mueva'
        ],
        errors: '',
        columnas: [],
        search: '',
        headers: [
            {
                text: 'Nombre',
                align: 'start',
                sortable: true,
                value: 'nombre',
            },
            // { text: 'Tema', value: 'tema' },
            { text: 'Asignacion', value: 'asignacion' },
            // { text: 'Acciones', value: 'accion', sortable: false }
        ],
        mensajes: [],
        snackbar: {
            show: false,
            message: '',
            color: 'success'
        },
      }
    },
    mixins: [validationMixin],
    validations: {
      name: { required, maxLength: maxLength(20) },
      select: { required },
      tablero: {
          nombre: {required, maxLength: maxLength(30)},
          descripcion: {required},
          region: {required, maxLength: maxLength(17)},
      }
    },
    computed: {
        ...mapState(['carga', 'tablero', 'loading','grupos']),
        selectErrors () {
            const errors = []
            if (!this.$v.select.$dirty) return errors
            !this.$v.select.required && errors.push('Campo requerido')
            return errors
        },
        nameErrors () {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.maxLength && errors.push('El nombre no puede ser de más de 10 caracteres')
            !this.$v.name.required && errors.push('El nombre es requerido.')
            return errors
        },
        nombreErrors() {
            const errors = []
            if (!this.$v.tablero.nombre.$dirty) return errors
            !this.$v.tablero.nombre.maxLength && errors.push('El nombre no puede ser de más de 30 caracteres')
            !this.$v.tablero.nombre.required && errors.push('El nombre es requerido.')
            return errors
        },
        descripcionErrors() {
            const errors = []
            if (!this.$v.tablero.descripcion.$dirty) return errors
            !this.$v.tablero.descripcion.required && errors.push('La descripción no es requerido.')
            return errors
        },
        regionErrors() {
            const errors = []
            if (!this.$v.tablero.region.$dirty) return errors
            !this.$v.tablero.region.maxLength && errors.push('La region no puede ser de más de 17 caracteres')
            !this.$v.tablero.region.required && errors.push('La region es requerida.')
            return errors
        },
    },
    methods: {
        ...mapActions(['getEmpresa','editarEmpresa','getGrupos']),
        editarEmpresaLocal() {
            this.editarEmpresa(this.tablero)
            this.mostrarSnackbar('Empresa editada exitosamente', 'success')
        },
        mostrarSnackbar(mensaje, color = 'success') {
            this.snackbar = {
                show: true,
                message: mensaje,
                color: color
            }
        },
    },
    created() {
        this.getEmpresa(this.$route.params.id)
        this.getGrupos()

        const ref = db.collection('tableros').doc(this.$route.params.id).collection('columnas').orderBy('nombre', 'desc')

        ref.onSnapshot(querySnapshot => {
            this.columnas = []
            querySnapshot.forEach(doc => {
                this.columnas.unshift({
                    nombre: doc.data().nombre,
                    asignacion: doc.data().asignacion,
                    region: doc.data().region,
                    tema: doc.data().tema,
                    tablero_id: doc.data().tablero_id
                })
            });
            // console.log(this.columnas);
        })
    }
}
</script>

<style>

</style>