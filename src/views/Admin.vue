<template>
<div>
    <v-layout justify-center>
        <v-flex xs6>
            <v-card class="text-center">
                <v-card-text>
                    <v-avatar size="56">
                        <img :src="usuario.foto" alt="IMG">
                    </v-avatar>
                </v-card-text>
                <v-card-text>
                    <h3>{{usuario.nombre}}</h3>
                </v-card-text>
                <v-card-text>
                    <input type="file" ref="boton" class="d-none" @change="buscarImagen($event)">
                    <v-btn color="primary" @click="$refs.boton.click()">Buscar Imagen</v-btn>
                    <v-btn color="secondary" class="ml-3" :disabled="file === null" @click="subirImagen" :loading="loading">Subir Imagen</v-btn>
                </v-card-text>

                <v-card-text v-if="error">
                    <h4>{{error}}</h4>
                </v-card-text>

                <v-card-text v-if="file !== null">
                    <h4>{{ file.name }}</h4><span>{{ file.size/1000 }} Kb.</span>
                    <v-img :src="urlTemporal"></v-img>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</div>
</template>

<script>
import { mapState } from 'vuex'
import {firebase,storage,db} from '@/firebase'

export default {
    name: 'Admin',
    data() {
        return {
            file: null,
            urlTemporal: '',
            loading: false,
            error: null
        }
    },
    computed: {
        ...mapState(['usuario'])
    },
    methods: {
        buscarImagen(event){
            console.log(event.target.files[0])

            const tipoArchivo = event.target.files[0].type;
            if(tipoArchivo === 'image/jpeg' || tipoArchivo == 'image/png'){
                this.file = event.target.files[0]
            }else{
                this.error = 'Archivo no válido'
                this.file = null
                return
            }

            const reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = (e) => {
                // console.log(e.target.result)
                this.urlTemporal = e.target.result
            }
        },
        async subirImagen(){
            try {
                this.loading = true
                const refImg = storage.ref().child(this.usuario.email).child('fotoPerfil')
                const res = await refImg.put(this.file)
                // console.log(res)

                const urlDescarga = await refImg.getDownloadURL();
                this.usuario.foto = urlDescarga;

                await db.collection('usuarios').doc(this.usuario.uid).update({
                    foto: urlDescarga
                })

                this.error = 'Imagen subida con éxito'
                this.file = null

            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style>

</style>