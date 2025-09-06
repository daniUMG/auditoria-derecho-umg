<template>
    <v-layout>
        <v-flex>
            <v-card>
                <v-card-title class="indigo white--text headline">
                Grupos
                <div class="position-absolute mr-5" style="right: 0px;">
                    <v-btn text icon to="crear-grupos">
                        <v-icon large color="white darken-2">
                        fas fa-plus-circle
                        </v-icon>
                    </v-btn>
                </div>
                </v-card-title>
                <v-row
                class="pa-4"
                justify="space-between"
                >
                <v-col cols="5">
                    <v-treeview
                    :active.sync="active"
                    :items="items"
                    :open.sync="open"
                    activatable
                    color="warning"
                    open-on-click
                    transition
                    >
                    <template v-slot:prepend="{ item }">
                        <v-icon v-if="!item.children">
                        fas fa-users
                        </v-icon>
                    </template>
                    </v-treeview>
                </v-col>

                <v-divider vertical></v-divider>

                <v-col
                    class="d-flex text-center"
                >
                    <v-scroll-y-transition mode="out-in">
                    <div
                        v-if="!selected"
                        class="title grey--text text--lighten-1 font-weight-light"
                        style="align-self: center;"
                    >
                        Seleccione un Grupo
                    </div>
                    <v-card
                        v-else
                        :key="selected.id"
                        class="pt-6 mx-auto"
                        flat
                        max-width="1200"
                    >
                        <v-card-text>
                            <v-avatar
                                size="88"
                            >
                                <v-icon x-large>fas fa-users</v-icon>
                            </v-avatar>
                            <h3 class="headline mb-2">
                                {{ selected.name }}
                            </h3>
                            <div class="blue--text mb-2">
                                {{ selected.descripcion }}
                            </div>
                            <div class="blue--text subheading font-weight-bold">
                                Usuarios que pertenecen al Grupo:
                            </div>
                            <router-link :to="{name: 'EditarGrupo', params: {id: selected.id}}">
                                <v-btn fab dark small color="secondary">
                                    <v-icon>fas fa-pen</v-icon>
                                </v-btn>
                            </router-link>
                            <!-- </v-avatar> -->
                        </v-card-text>
                        <v-simple-table
                            fixed-header
                            height="300px"
                        >
                            <template v-slot:default>
                            <thead>
                                <tr>
                                <th class="text-left">
                                    #
                                </th>
                                <th class="text-left">
                                    Email
                                </th>
                                <th class="text-left">
                                    Tipo Usuario
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="(item, index) in selected.dataUsers"
                                :key="index"
                                >
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.nombre }}</td>
                                <td>
                                    <v-chip
                                        :color="getColor(item.tipo)"
                                        dark
                                        style="text-transform: capitalize !important;"
                                    >
                                        {{ item.tipo }}
                                    </v-chip>
                                </td>
                                </tr>
                            </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                    </v-scroll-y-transition>
                </v-col>
                </v-row>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import {  } from "vuex"
import { db } from "../firebase"

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
    name: 'Grupos',
    data() {
        return {
            active: [],
            avatar: null,
            open: [],
            grupos: [],
            usuariosGrupo: ''
        }
    },
    computed: {
      items () {
        return [
          {
            name: 'Grupos',
            children: this.grupos,
          },
        ]
      },
      selected () {
        if (!this.active.length) return undefined

        const id = this.active[0]

        return this.grupos.find(grupo => grupo.id === id)
      },
    },
    methods: {
        async selectGrupos(){
            try {
                const doc = await db.collection('grupos').get()
                const grupos = []
                doc.forEach(res => {
                    var dataUser = []
                    let grupo = res.data()
                    grupo.name = res.data().nombre
                    res.data().usuarios.forEach(item => {
                        db.collection('usuarios').doc(item).get()
                        .then(doc => {
                            dataUser.push({uid: item, nombre: doc.data().email, tipo: doc.data().tipo})
                        })
                    })
                    grupo.dataUsers = dataUser
                    grupo.id = res.id
                    grupos.push(grupo)
                })
                // const array = []
                // grupos.forEach(element => {
                //     array.push({nombre: element.tag, id: element.id})
                // })
                this.grupos = grupos
            } catch (error) {
                console.log(error);
            }
        },
        getColor (tipo) {
            if (tipo == 'usuario') return 'green'
            else if (tipo == 'auditor') return 'orange'
            else if (tipo == 'admin') return 'blue'
            else return 'red'
        },
    },
    created() {
        this.selectGrupos()
    }
}
</script>