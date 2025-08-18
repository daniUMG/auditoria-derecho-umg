<template>
<nav>
  <v-app-bar
      app
      color="secondary"
      dark
    >
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn
        text
      >
        <span class="mr-2" @click="cerrarSesion">Cerrar Sesion</span>
        <v-icon>fas fa-sign-out-alt</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer color="secondary" v-model="drawer" app>
      <v-layout column align-center mt-5>
        <v-flex>
          <v-avatar size="56">
            <img :src="'https://firebasestorage.googleapis.com/v0/b/proyectoingsis.appspot.com/o/lawlogo.png?alt=media&token=b70d615b-ce69-4df2-95df-08de82fab229'" alt="IMG">
          </v-avatar>
          <h1></h1>
        </v-flex>
        <v-flex>
          <p class="mt-3 white--text">{{usuario.nombre}}</p>
          <p class="mt-3 white--text" style="text-align: center; margin: 0px !important;">
            <v-chip
              :color="getColor(usuario.tipo)"
              dark
              style="text-transform: capitalize !important; padding: 10px !important; height: 23px; position: relative; top: -10px;"
            >
              {{ usuario.tipo }}
            </v-chip>
          </p>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>

      <v-list-item v-for="(item, index) in items" :key="index" :to="item.to">
        <v-list-item-icon style="margin-right: 18px !important;">
          <v-icon class="white--text">{{item.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title white--text">
            {{item.title}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

</nav>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Navbar',
  data: () => ({
    drawer: false,
    // https://fontawesome.com/v4/icons/
    items: [],
  }),
  methods:{
    ...mapActions(['cerrarSesion']),
    getColor (tipo) {
      if (tipo == 'usuario') return 'green'
      else if (tipo == 'auditor') return 'orange'
      else if (tipo == 'admin') return 'blue'
      else return 'red'
    },
  },
  computed: {
      ...mapState(['usuario'])
  },
  created() {
    if(this.usuario) {
      this.usuario.tipo === 'admin' ?
        this.items = [
          { title: 'Empresas', icon: 'fas fa-balance-scale', to: {name:'Empresas'}},
          { title: 'Leyes', icon: 'fas fa fa-gavel', to: {name:'Leyes'}},
          { title: 'Usuarios', icon: 'fas fa-user-friends', to: {name:'Usuarios'}},
          { title: 'Grupos', icon: 'fas fa-users', to: {name:'Grupos'}},
          { title: 'Reportes', icon: 'fas fa fa-signal', to: {name:'Reportes'}}
        ]
      : this.usuario.tipo === 'auditor' ?
        this.items = [
          { title: 'Empresas', icon: 'fas fa-balance-scale', to: {name:'Empresas'}},
          // { title: 'Leyes', icon: 'fas fa fa-gavel', to: {name:'Leyes'}},
          // { title: 'Usuarios', icon: 'fas fa-user-friends', to: {name:'Usuarios'}},
          // { title: 'Grupos', icon: 'fas fa-users', to: {name:'Grupos'}}
        ]
      :
        this.items = [
          { title: 'Empresas', icon: 'fas fa-balance-scale', to: {name:'Empresas'}},
          // { title: 'Leyes', icon: 'fas fa fa-gavel', to: {name:'Leyes'}},
          // { title: 'Usuarios', icon: 'fas fa-user-friends', to: {name:'Usuarios'}},
          // { title: 'Grupos', icon: 'fas fa-users', to: {name:'Grupos'}}
        ]
    }
  }
}
</script>

<style>

</style>