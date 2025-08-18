<template>
  <v-layout>
      <v-flex>
          <!-- <h1>{{$route.params.id}}</h1> -->
        <v-row>
            <v-col>
                <div>
                    <form @submit.prevent="editarTablero(tablero)">
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
                        @click="editarTablero(tablero)"
                    >
                        Guardar
                    </v-btn>
                    </form>
                </div>
            </v-col>
        
            <!-- <v-col>
                <div>
                    <form @submit.prevent="setColumnas(name,select,temaColumna)">
                        <v-dialog
                        v-model="dialog"
                        fullscreen
                        hide-overlay
                        transition="dialog-bottom-transition"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                            color="secondary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            class="mb-4"
                            >
                            Crear Columna
                            </v-btn>
                        </template>
                        <v-card>
                            <v-toolbar
                            dark
                            color="secondary"
                            >
                            <v-btn
                                icon
                                dark
                                @click="dialog = false"
                            >
                                <v-icon>far fa-times-circle</v-icon>
                            </v-btn>
                            <v-toolbar-title>Crear Columnas</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn
                                dark
                                text
                                type="submit"
                                :disabled="$v.$invalid || carga"
                                @click="setColumnas(name,select,temaColumna)"
                                :loading="loading"
                                >
                                Guardar
                                </v-btn>
                            </v-toolbar-items>
                            </v-toolbar>

                            <v-list three-line subheader width="300" class="ml-5 mt-5">
                                <v-text-field 
                                v-model.trim="name"
                                :error-messages="nameErrors"
                                :counter="20"
                                label="Nombre Columna"
                                required
                                @input="$v.name.$touch()"
                                @blur="$v.name.$touch()"
                                ></v-text-field>
                                <label for="temaColumna" class="mt-2" style="color: #949494;">Tema Columna</label><br>
                                <input type="color" v-model="temaColumna">
                                <v-select
                                v-model="select"
                                :items="items"
                                :error-messages="selectErrors"
                                label="Asignación"
                                required
                                @change="$v.select.$touch()"
                                @blur="$v.select.$touch()"
                                ></v-select>
                            </v-list>
                        </v-card>
                        </v-dialog>
                    </form>

                    <v-card>
                        <v-card-title>
                            <v-icon class="mr-2">fas fa-columns</v-icon>
                            Columnas
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                append-icon="fas fa-search"
                                label="Buscar"
                                single-line
                                hide-details
                            >
                            </v-text-field>
                        </v-card-title>
                        <v-data-table
                            :headers="headers"
                            :items="columnas"
                            :search="search"
                            :loading="carga"
                            loading-text="Cargando... Por favor espere"
                            class="elevation-1"
                        >
                        <template v-slot:[`item.accion`]="{ item }">
                            <v-btn icon color="secondary" @click="editColumna(item)">
                                <v-icon small>
                                    fas fa-pen
                                </v-icon>
                            </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </div>
            </v-col> -->
        </v-row>
      </v-flex>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import {db} from '../firebase'

export default {
    name: 'ConfTablero',
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
        mensajes: []
      }
    },
    mixins: [validationMixin],
    validations: {
      name: { required, maxLength: maxLength(20) },
      select: { required },
      tablero: {
          nombre: {required, maxLength: maxLength(30)},
          descripcion: {required}
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
            !this.$v.tablero.nombre.maxLength && errors.push('El nombre no puede ser de más de 10 caracteres')
            !this.$v.tablero.nombre.required && errors.push('El nombre es requerido.')
            return errors
        },
        descripcionErrors() {
            const errors = []
            if (!this.$v.tablero.descripcion.$dirty) return errors
            !this.$v.tablero.descripcion.required && errors.push('La descripción no es requerido.')
            return errors
        }
    },
    methods: {
        ...mapActions(['agregarColumna','getTablero','editarTablero','getColumnas','getGrupos']),
        setColumnas(name,select,temaColumna){
            this.dialog = false
            // console.log(name,select,temaColumna, this.carga)
            let columna = {
                nombre: name,
                tema: temaColumna,
                asignacion: select,
                tablero_id: this.$route.params.id
            }
            // console.log(columna)
            this.agregarColumna(columna)
        },
        editColumna(item){
            console.log(item)
        }
    },
    created() {
        this.getTablero(this.$route.params.id)
        this.getGrupos()
        // this.getColumnas(this.$route.params.id)

        const ref = db.collection('tableros').doc(this.$route.params.id).collection('columnas').orderBy('nombre', 'desc')

        ref.onSnapshot(querySnapshot => {
            this.columnas = []
            querySnapshot.forEach(doc => {
                this.columnas.unshift({
                    nombre: doc.data().nombre,
                    asignacion: doc.data().asignacion,
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