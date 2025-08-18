<template>
    <v-layout>
        <v-flex>
            <div class="position-absolute mr-5" style="right: 0px;">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn text icon to="crear-usuarios">
                            <v-icon x-large color="blue darken-2" v-bind="attrs" v-on="on">
                            fas fa-plus-circle
                            </v-icon>
                        </v-btn>
                    </template>
                <span>Crear Usuarios</span>
                </v-tooltip>
            </div>
            <h2>Usuarios</h2>
            <v-card>
                <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="fas fa-search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="usuarios"
                    :search="search"
                    class="elevation-1"
                >
                <template v-slot:[`item.tipo`]="{ item }">
                    <v-chip
                        :color="getColor(item.tipo)"
                        dark
                        style="text-transform: capitalize !important;"
                    >
                        {{ item.tipo }}
                    </v-chip>
                </template>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: 'Usuarios',
    data () {
      return {
        search: '',
        headers: [
          {
            text: 'Nombre',
            align: 'start',
            filterable: true,
            value: 'nombre',
          },
          { text: 'Email', value: 'email'},
          { text: 'Tipo', value: 'tipo'},
        //   { text: 'Acciones', value: 'actions', filterable: false}
        ]
      }
    },
    computed: {
        ...mapState(['carga','loading','usuarios'])
    },
    methods: {
        ...mapActions(['getUsuarios']),
        getColor (tipo) {
            if (tipo == 'usuario') return 'green'
            else if (tipo == 'auditor') return 'orange'
            else if (tipo == 'admin') return 'blue'
            else return 'red'
        },
    },
    created() {
        this.getUsuarios()
    }
}
</script>