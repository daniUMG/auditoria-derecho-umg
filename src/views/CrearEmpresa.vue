<template>
    <v-layout>
        <v-flex>
            <div class="ml-5 contain-crearCasos">
                <h2>Crear Empresa</h2>
                <form @submit.prevent="setTablero({nombre,descripcion,tema,grupos: arrayGrupos})">
                        <v-text-field
                        v-model.trim="nombre"
                        :counter="30"
                        :rules="nombreRules"
                        label="Nombre Empresa"
                        required
                        ></v-text-field>
                        <v-textarea
                        v-model.trim="descripcion"
                        autocomplete="descripcion"
                        label="Descripcion"
                        :rules="descripcionRules"
                        :counter="1530"
                        required
                        ></v-textarea>
                        <v-select
                            v-model="arrayGrupos"
                            :items="grupos"
                            item-value="id"
                            item-text="nombre"
                            :rules="arrayGruposRules"
                            attach
                            chips
                            label="Grupos con acceso:"
                            multiple
                            required
                        ></v-select>

                    <label for="temaTablero">Tema Empresa</label><br>
                    <input type="color" v-model="tema" required><br>

                    <v-btn
                        class="mr-4 mt-4"
                        type="submit"
                        :loading="loading"
                        :disabled="$v.$invalid || carga"
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
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
    name: 'CrearTablero',
    data() {
        return {
            nombre: '',
            nombreRules: [
                v => !!v || 'El nombre es requerido',
                v => (v && v.length <= 30) || 'La descripción no puede ser mayor a 30 caracteres'
            ],
            descripcion: '',
            descripcionRules: [
                v => !!v || 'La descripción es requerida',
                v => (v && v.length <= 1530) || 'La descripción no puede ser mayor a 1530 caracteres'
            ],
            tema: '',
            arrayGrupos: [],
            arrayGruposRules: [
                v => !!v || 'Debe elegir al menos un grupo',
            ]
        }
    },
    computed: {
        ...mapState(['loading','carga','grupos'])
    },
    validations: {
        nombre: {required, minLength: maxLength(30)},
        descripcion: {required, minLength: maxLength(1530)},
        arrayGrupos: [required]
    },
    methods: {
        ...mapActions(['setTablero','getGrupos'])
    },
    created(){
        this.getGrupos()
    }
}
</script>