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
      <!-- <v-tooltip bottom v-else-if="this.$route.path == '/procesos'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" to="crear-procesos">
            <v-icon>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Crear Procesos</span>
      </v-tooltip>
      <v-tooltip bottom v-else-if="this.$route.path == '/familias'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" to="crear-familias">
            <v-icon>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Crear Familias</span>
      </v-tooltip>
      <v-tooltip bottom v-else-if="this.$route.path == '/claves'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" to="crear-claves">
            <v-icon>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Crear Claves</span>
      </v-tooltip> -->

      <!-- <v-menu
        bottom
        left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>fas fa-ellipsis-v</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in opciones" :key="index" link>
            <v-icon>fas fa-tachometer-alt</v-icon>
            <v-list-item v-text="item.title" :to="item.link"></v-list-item>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
    name: 'MenuLeyes',
    data() {
      return {
        opciones: [
          {title: 'Procesos', link: 'procesos'},
          {title: 'Familias', link: 'familias'},
          {title: 'Claves', link: 'claves'}
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