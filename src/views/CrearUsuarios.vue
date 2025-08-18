<template>
    <v-layout>
        <v-flex>
            <div class="ml-5 contain-crearCasos">
                <h2>Crear Usuarios</h2>
                <form @submit.prevent="setAddUsuario({displayName,email,password,photoURL,tipo,uid})">
                    <!-- <h3 class="uuid">{{ uuid }}</h3> -->
                    <v-row>
                        <v-col
                        cols="12"
                        sm="6"
                        >
                            <v-text-field
                                v-model.trim="displayName"
                                :rules="[rules.required]"
                                label="Nombres"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col
                        cols="12"
                        sm="6"
                        >
                            <v-text-field
                                v-model="email"
                                :rules="[rules.required, rules.email]"
                                label="E-mail"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-text-field
                        v-model="password"
                        :append-icon="show1 ? 'fas fa-eye' : 'fas fa-eye-slash'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        label="Password"
                        hint="Mínimo 8 caracteres"
                        counter
                        @click:append="show1 = !show1"
                    ></v-text-field>
                    <!-- <v-card-text>
                        <label for="file" class="font-weight-bold">Imagen:</label><br>
                        <input type="file" ref="boton" class="d-none" @change="buscarImagen($event)">
                        <v-btn color="primary" @click="$refs.boton.click()">Buscar Imagen</v-btn>
                    </v-card-text> -->

                    <v-card-text v-if="error">
                        <h4>{{error}}</h4>
                    </v-card-text>

                    <v-card-text v-if="file !== null">
                        <h4>{{ file.name }}</h4><span>{{ file.size/1000 }} Kb.</span>
                        <v-img :src="urlTemporal"></v-img>
                    </v-card-text>

                    <v-select
                        v-model="tipo"
                        hint="Tipo de Usuario"
                        :items="itemsTipos"
                        item-text="text"
                        item-value="value"
                        label="Tipo de Usuario"
                        :rules="[rules.required]"
                        persistent-hint
                        return-object
                        single-line
                    ></v-select>
                    <v-btn
                        class="mr-4 mt-4"
                        type="submit"
                        :loading="loading"
                        :disabled="$v.$invalid"
                    >
                        Guardar
                    </v-btn>
                </form>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { uuid } from 'vue-uuid'
import { required, minLength } from 'vuelidate/lib/validators'
import {storage} from '@/firebase'

export default {
    name: 'CrearUsuarios',
    data() {
        return {
            uid: uuid.v1(),
            displayName: '',
            photoURL: '',
            email: '',
            password: '',
            tipo: {text: 'Usuario', value: 'usuario'},
            itemsTipos: [
                {text: 'Usuario', value: 'usuario'},
                {text: 'Auditor', value: 'auditor'},
                // {text: 'Encargado'},
                {text: 'Administrador', value: 'admin'}
            ],
            show1: false,
            rules: {
                required: v => !!v || 'Requerido.',
                min: v => v.length >= 8 || 'Min 8 caracteres',
                email: v => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(v) || 'Ingrese un email válido.'
                },
            },
            urlTemporal: '',
            error: null,
            file: null
        }
    },
    computed: {
        ...mapState(['loading'])
    },
    validations: {
        displayName: {required},
        email: {required},
        password: {required, minLength: minLength(8)},
        tipo: {required}
    },
    methods: {
        ...mapActions(['setAddUsuario']),
        buscarImagen(event){
            const tipoArchivo = event.target.files[0].type;
            if(tipoArchivo === 'image/jpeg' || tipoArchivo == 'image/png'){
                this.file = event.target.files[0]
                this.photoURL = this.file
                console.log(this.photoURL);
            }else{
                this.error = 'Archivo no válido'
                this.file = null
                return
            }

            const reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = (e) => {
                this.urlTemporal = e.target.result
            }
        }
    }
}
</script>