<template>
    <v-layout>
        <v-flex>
            <v-btn class="mx-2 float-right" fab dark color="secondary" style="padding: 0px;" to="/crear-empresa" v-if="usuario.tipo === 'admin'">
            <v-icon dark>
                fas fa-plus
            </v-icon>
            </v-btn>
            <v-sheet flat color="transparent" max-width="500">
                <form @submit.prevent="buscador(texto)">
                    <v-text-field
                        v-model.trim="texto"
                        append-icon="fas fa-search"
                        label="Buscar Empresa..."
                        single-line
                        v-on:keyup="buscador(texto)"
                    ></v-text-field>
                </form>
            </v-sheet>

            <div v-if="carga" class="text-center mt-5">
                <h2>Cargando Empresas...</h2>
                <sync-loader :loading="carga"></sync-loader>
            </div>

            <v-card style="background: transparent; box-shadow: none;" v-else>
            <v-row style="background: transparent;">
                <v-col v-for="(item, index) in arrayFiltrado" :key="index" class="list-group-item" col="6" xs="12" sm="12" md="4" lg="3" xl="2" style="border: 1px solid transparent !important; background: transparent !important;">
                    <v-card class="mx-auto collection-list" dark max-width="400" :style='`border-radius: initial; border-top: 5px ${item.tema} solid !important; background-color: #fff; color: #3F454C;`'>
                        <v-card-title class="collection-title">
                            <span>
                                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" class="icon-button"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" :fill="`${item.tema}`"/></svg> -->
                                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 640 640" style="position: relative; top: -3px; left: -5px;"><path d="M118.2 126.4C101.5 120.8 92.4 102.6 98 85.9C103.6 69.2 121.7 60.1 138.5 65.6L251.5 103.3C265.4 79.8 291.1 64 320.4 64C364.6 64 400.4 99.8 400.4 144C400.4 147 400.2 149.9 399.9 152.8L522.5 193.7C539.3 199.3 548.3 217.4 542.7 234.2C537.1 251 519 260 502.2 254.4L366.7 209.2C362.2 212.4 357.4 215.1 352.3 217.4L352.3 544.1C352.3 561.8 338 576.1 320.3 576.1L128.3 576.1C110.6 576.1 96.3 561.8 96.3 544.1C96.3 526.4 110.6 512.1 128.3 512.1L288.3 512.1L288.3 217.4C267.3 208.2 251.1 190.4 244.1 168.4L118.2 126.4zM200.8 352L128.3 227.8L55.9 352L200.8 352zM128.4 448C65.5 448 13.2 414 2.4 369.1C-.2 358.1 3.4 346.8 9.1 337L104.3 173.8C109.3 165.2 118.5 160 128.4 160C138.3 160 147.5 165.3 152.5 173.8L247.7 337C253.4 346.8 257 358.1 254.4 369.1C243.6 413.9 191.3 448 128.4 448zM511.2 355.8L438.8 480L583.7 480L511.3 355.8zM637.2 497.1C626.4 542 574.1 576 511.2 576C448.3 576 396 542 385.2 497.1C382.6 486.1 386.2 474.8 391.9 465L487.1 301.8C492.1 293.2 501.3 288 511.2 288C521.1 288 530.3 293.3 535.3 301.8L630.5 465C636.2 474.8 639.8 486.1 637.2 497.1z" :fill="`${item.tema}`"/></svg> -->
                                <svg :fill="`${item.tema}`" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="26" height="26" viewBox="0 0 937.084 937.084" xml:space="preserve">
                                    <g>
                                        <g>
                                            <path d="M707.147,66V10c0-5.523-4.478-10-10-10H434.542c-5.523,0-10,4.477-10,10v46c0,5.523-4.477,10-10,10H239.937    c-5.523,0-10,4.477-10,10v814.915H78.542c-5.523,0-10,4.477-10,10v26.169c0,5.523,4.477,10,10,10h780c5.523,0,10-4.477,10-10    v-26.169c0-5.523-4.477-10-10-10H707.147V120V66z M336.665,647.643c0,5.523-4.477,10-10,10h-29.731c-5.522,0-10-4.477-10-10    v-30.997c0-5.523,4.478-10,10-10h29.731c5.523,0,10,4.477,10,10V647.643z M336.665,556.148c0,5.522-4.477,10-10,10h-29.731    c-5.522,0-10-4.478-10-10V525.15c0-5.523,4.478-10,10-10h29.731c5.523,0,10,4.477,10,10V556.148z M336.665,464.652    c0,5.522-4.477,10-10,10h-29.731c-5.522,0-10-4.478-10-10v-30.997c0-5.523,4.478-10,10-10h29.731c5.523,0,10,4.477,10,10V464.652z     M336.665,373.157c0,5.522-4.477,10-10,10h-29.731c-5.522,0-10-4.478-10-10v-30.998c0-5.523,4.478-10,10-10h29.731    c5.523,0,10,4.477,10,10V373.157z M336.665,281.661c0,5.523-4.477,10-10,10h-29.731c-5.522,0-10-4.477-10-10v-30.998    c0-5.523,4.478-10,10-10h29.731c5.523,0,10,4.477,10,10V281.661z M336.665,190.166c0,5.523-4.477,10-10,10h-29.731    c-5.522,0-10-4.477-10-10v-30.998c0-5.523,4.478-10,10-10h29.731c5.523,0,10,4.477,10,10V190.166z M570.542,890.915h-204V777.354    c0-5.523,4.477-10,10-10h184c5.523,0,10,4.477,10,10V890.915z M650.15,647.643c0,5.523-4.478,10-10,10H390.542    c-5.523,0-10-4.477-10-10v-30.997c0-5.523,4.477-10,10-10H640.15c5.522,0,10,4.477,10,10V647.643L650.15,647.643z M650.15,556.148    c0,5.522-4.478,10-10,10H390.542c-5.523,0-10-4.478-10-10V525.15c0-5.523,4.477-10,10-10H640.15c5.522,0,10,4.477,10,10V556.148    L650.15,556.148z M650.15,464.652c0,5.522-4.478,10-10,10H390.542c-5.523,0-10-4.478-10-10v-30.997c0-5.523,4.477-10,10-10H640.15    c5.522,0,10,4.477,10,10V464.652L650.15,464.652z M650.15,373.157c0,5.522-4.478,10-10,10H390.542c-5.523,0-10-4.478-10-10    v-30.998c0-5.523,4.477-10,10-10H640.15c5.522,0,10,4.477,10,10V373.157L650.15,373.157z M650.15,281.661c0,5.523-4.478,10-10,10    H390.542c-5.523,0-10-4.477-10-10v-30.998c0-5.523,4.477-10,10-10H640.15c5.522,0,10,4.477,10,10V281.661L650.15,281.661z     M650.15,190.166c0,5.523-4.478,10-10,10H390.542c-5.523,0-10-4.477-10-10v-30.998c0-5.523,4.477-10,10-10H640.15    c5.522,0,10,4.477,10,10V190.166L650.15,190.166z"/>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <span class="title" style="margin-left: 5px;">{{item.nombre}}</span>
                        </v-card-title>
                        <v-card-text style="color: #3F454C; font-size: 12px; height: 80px;">
                            {{item.descripcion}}
                        </v-card-text>
                        <!-- <router-link :to="{name: 'ConfTablero', params: {id: item.id}}">
                            <button class="btn btn-warning float-right ml-2">Editar</button>
                        </router-link>
                        <button @click="eliminarTablero(item.id)" class="btn btn-danger float-right">Eliminar</button> -->
                        <v-card-actions>
                        <v-list-item class="grow">
                            <v-row
                            align="center"
                            justify="end"
                            >
                            <span class="subheading mr-1">
                                <router-link :to="{name: 'ConfTablero', params: {id: item.id}}">
                                    <v-btn fab dark small color="secondary">
                                    <v-icon dark>
                                        fas fa-cogs
                                    </v-icon>
                                    </v-btn>
                                </router-link>
                            </span>
                            <span class="subheading">
                                <router-link :to="{name: 'Tareas', params: {id: item.id}}">
                                    <v-btn fab dark small color="secondary">
                                    <v-icon dark>
                                        fas fa fa-eye
                                    </v-icon>
                                    </v-btn>
                                </router-link>
                            </span>
                            </v-row>
                        </v-list-item>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

export default {
    name: 'Tablero',
    data() {
        return {
            texto: ''
        }
    },
    components: {
        PulseLoader, SyncLoader
    },
    computed: {
        ...mapState(['usuario', 'tableros', 'carga']),
        ...mapGetters(['arrayFiltrado']),
    },
    methods:{
        ...mapActions(['getTablerosUsuarios','eliminarTablero','buscador']),
        test(){
            console.log(this.carga)
        }
    },
    created(){
        this.getTablerosUsuarios()
    }
}
</script>

<style>

</style>