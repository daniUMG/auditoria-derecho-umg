<template>
  <v-card
    color="grey lighten-4"
    height="90px"
    width="60px"
    outlined
    tile
    class="d-grid gap-2 d-md-flex justify-content-md-end float-right"
  >
    <v-toolbar collapse>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" :to="`/legislacion/agregar/ley/${$route.params.id}`">
            <v-icon>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Ley</span>
      </v-tooltip>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
    name: 'MenuLeyes',
    data() {
      return {
        opciones: [
          {title: '', link: ''},
        ]
      }
    },
}
</script>

<style>
/* MENU DE EQUIPOS */
.v-application .grey.lighten-4 {
    background-color: #f6f8f8 !important;
    border-color: #f6f8f8 !important;
}
</style>