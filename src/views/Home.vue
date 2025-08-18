<template>
  <div>
    <v-layout>
      
      <h2>Bienvenido: {{usuario.nombre}}</h2>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState(['usuario'])
  }
}
</script>
