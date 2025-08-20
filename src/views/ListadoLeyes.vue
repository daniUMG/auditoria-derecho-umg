<template>
    <v-layout>
        <v-flex>
            <div class="mt-4">
                <h1>Todas las leyes</h1>
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
                    :items="listadoleyes"
                    :search="search"
                    >
                        <template v-slot:[`item.actions`]="{item}">
                            <v-list-item :to="`/legislacion/editar/ley/${item.id}`">
                                <v-icon class="">fas fa-eye</v-icon>
                            </v-list-item>
                        </template>
                    </v-data-table>
                </v-card>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
    name: 'ListadoLeyes',
    data () {
      return {
        search: '',
        headers: [
        //   {
        //     text: '#TAG',
        //     align: 'start',
        //     filterable: true,
        //     value: 'tag',
        //   },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Descripción', value: 'descripcion' },
            { text: 'Fecha agregada', value: 'fecha' },
            { text: 'Auditada por', value: 'auditada_por' },
            { text: 'Fecha Auditoría', value: 'fecha_auditoria' },
            { text: 'Acciones', value: 'actions', filterable: false}
        ]
      }
    },
    components: {
    },
    computed: {
        ...mapState(['listadoleyes'])
    },
    methods: {
        ...mapActions(['getListadoLeyes'])
    },
    created() {
        this.getListadoLeyes()  
    }
}
</script>