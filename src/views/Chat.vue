<template>
    <v-layout>
        <v-flex>
            <v-card>
                <v-card-text>
                    <h3>Bienvenido {{usuario.nombre}}</h3>
                </v-card-text>
                
                <!-- <v-card-text>
                    <div class="text-right">
                        <v-chip pill>
                            <v-avatar left>
                                <img :src="usuario.foto" alt="AVATAR">
                            </v-avatar>Mensaje
                        </v-chip>
                        <p class="caption mr-2">06 de octube</p>
                    </div>
                </v-card-text> -->

                <v-card-text style="height: 60vh; overflow: auto;" v-chat-scroll="{always: false, smooth: true, scrollonremoved:true}">
                    <div :class="item.nombre === usuario.nombre ? 'text-right' : 'text-left'" v-for="(item, index) in mensajes" :key="index">
                    <v-menu
                        bottom
                        right
                        transition="scale-transition"
                        origin="top left"
                    >
                    <template v-slot:activator="{ on }">
                    <v-chip
                        pill
                        v-on="on"
                    >
                        <v-avatar left>
                        <v-img :src="item.foto"></v-img>
                        </v-avatar>
                        {{item.mensaje}}
                    </v-chip>
                    <p class="caption mr-2">{{item.date}}</p>
                    </template>
                    <v-card width="300">
                    <v-list dark>
                        <v-list-item>
                        <v-list-item-avatar>
                            <v-img :src="item.foto"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{item.nombre}}</v-list-item-title>
                            <v-list-item-subtitle>{{item.uid}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn
                            icon
                            @click="menu = false"
                            >
                            <v-icon>fas fa-times</v-icon>
                            </v-btn>
                        </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-list>
                        <v-list-item @click="() => {}">
                        <v-list-item-action>
                            <v-icon>far fa-clock</v-icon>
                        </v-list-item-action>
                        <v-list-item-subtitle>{{item.date}}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                    </v-card>
                    </v-menu>
                </div>
                </v-card-text>

                <v-card-text>
                    <!-- <small v-if="type"> está escribiendo...</small> -->
                    <v-form @submit.prevent="enviarMensaje" v-model="valido">
                        <v-text-field v-model="mensaje" v-on:keyup="typping(mensaje)" label="Escribe tu mensaje aquí" required :rules="reglas"></v-text-field>
                    </v-form>
                </v-card-text>

            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { realtime,db } from '../firebase';
import moment from 'moment'
import Vue from 'vue'

export default {
    name: 'Chat',
    data() {
        return {
            mensaje: '',
            valido: false,
            mensajes: '',
            reglas: [
                v => !!v || 'Tienes que escribir un mensaje...',
            ]
        }
    },
    computed: {
        ...mapState(['usuario','type'])
    },
    created() {
        //
    },
    methods: {
        ...mapActions(['setMessage','typpingAction']),
        enviarMensaje(){
            if(this.valido){
                // console.log('Mensaje:'+this.mensaje);
                const msg = {
                    uid: this.usuario.uid,
                    mensaje: this.mensaje,
                    nombre: this.usuario.nombre,
                    foto: this.usuario.foto,
                    date: Date.now(),
                }
                this.setMessage(msg)

                realtime.ref('mensajes/usuarios/'+this.usuario.uid).push(msg).catch(error => console.log(error));
                // console.log("Document successfully written REALTIME!");

                this.mensaje = ''
            }else{
                console.log('No escribiste nada')
            }
        },
        typping(mensaje){
            this.typpingAction(mensaje)
        },
    },
    
    created(){
        moment.locale('es');
        this.typping();
        const ref = db.collection('chats').orderBy('date', 'desc').limit(10)

        ref.onSnapshot(querySnapshot => {
            this.mensajes = []
            querySnapshot.forEach(doc => {
                this.mensajes.unshift({
                    mensaje: doc.data().mensaje,
                    nombre: doc.data().nombre,
                    uid: doc.data().uid,
                    foto: doc.data().foto,
                    date: moment(doc.data().date).format('lll')
                })
            });
            // console.log(this.mensajes);
        })
        
    }
}
</script>

<style>

</style>