<template>
  <v-app>
    <Navbar v-if="usuario !== ''" />
    <v-main>
      <v-container v-dragscroll:nochilddrag>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions,mapState } from 'vuex';
import Navbar from '@/components/Navbar'

export default {

  name: 'App',
  data: () => ({
    //
  }),
  components: {
    Navbar
  },
  methods:{
    ...mapActions(['cerrarSesion'])
  },
  computed: {
    ...mapState(['usuario'])
  }
};
</script>