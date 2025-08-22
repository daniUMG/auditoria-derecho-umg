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
                        <template v-slot:[`item.rEmpresa`]="{item}">
                            <v-chip color="secondary" style="color: rgb(57, 162, 227) !important; background: rgb(230, 243, 251) !important; font-size: 11px; height: 22px;">
                                {{ item.rEmpresa }}
                            </v-chip>
                        </template>
                        <!-- <template v-slot:[`item.actions`]="{item}">
                            <v-list-item :to="`/legislacion/editar/ley/${item.id}`">
                                <v-icon class="">fas fa-eye</v-icon>
                            </v-list-item>
                        </template> -->
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
            { text: 'Decreto', value: 'decreto' },
            { text: 'Fecha Publicación', value: 'fpublicacion' },
            { text: 'Empresa', value: 'nEmpresa' },
            { text: 'Región empresa', value: 'rEmpresa' },
            { text: 'Fecha agregada a la empresa', value: 'fecha' },
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