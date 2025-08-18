<template>
    <v-layout>
        <v-flex>
            <div class="ml-5 contain-crearCasos">
                <h2>Crear Grupos</h2>
                <v-form @submit.prevent="setGrupo({nombre, descripcion, users})">
                    <v-text-field v-model.trim="nombre" :counter="25" :rules="nombreRules" label="Nombre:" placeholder="Ingrese el nombre del Grupo..." required></v-text-field>
                    <v-textarea
                        v-model.trim="descripcion"
                        autocomplete="descripcion"
                        label="Descripción:"
                        :rules="descripcionRules"
                        :counter="1530"
                    ></v-textarea>
                    <v-flex v-for="(item, index) in arrayUsuarios" :key="index">
                        <v-select
                            v-model="users"
                            :items="item.usuarios"
                            item-value="id"
                            item-text="nombre"
                            :rules="usersRules"
                            attach
                            chips
                            label="Usuarios"
                            multiple
                        ></v-select>
                    </v-flex>
                    <v-btn :disabled="$v.$invalid || carga" :loading="loading" class="btn btn-seondary mt-4" type="submit">
                    Guardar
                    </v-btn>
                </v-form>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { required, maxLength } from 'vuelidate/lib/validators'
import { db } from "../firebase"

export default {
    name: 'CrearGrupos',
    data() {
        return {
            nombre: '',
            nombreRules: [
                v => !!v || 'El nombre es requerido',
                v => (v && v.length <= 25) || 'El nombre no puede tener más de 25 caracteres'
            ],
            descripcion: '',
            descripcionRules: [
                v => !!v || 'La descripción es requerida',
                v => (v && v.length <= 25) || 'La descripción no puede tener más de 1530 caracteres'
            ],
            users: [],
            arrayUsuarios: [],
            usersRules: [
                v => !!v || 'Debe elegir al menos un usuario'
            ]
        }
    },
    validations: {
        nombre: {required, minLength: maxLength(25)},
        descripcion: {required, minLength: maxLength(1530)},
        users: {required}
    },
    computed: {
        ...mapState(['loading','carga'])
    },
    methods: {
        ...mapActions(['setGrupo']),
        async selectUsuarios(){
            try {
                const doc = await db.collection('usuarios').get()
                const usuarios = []
                doc.forEach(res => {
                    let usuario = res.data()
                    usuario.id = res.id
                    usuarios.push(usuario)
                })
                const array = []
                usuarios.forEach(element => {
                    // arrayid.push(element.id)
                    array.push({nombre: element.nombre, id: element.id, json: [{id: element.id, nombre: element.nombre}]})
                })
                this.arrayUsuarios = [{usuarios: array}]
            } catch (error) {
                console.log(error)
            }
        }
    },
    created(){
        this.selectUsuarios()
    }
}
</script>