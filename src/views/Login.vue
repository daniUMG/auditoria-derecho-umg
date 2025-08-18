<template>
  <div>
      <v-layout justify-center mt-5>
          <v-flex xs12 sm8 md6 xl4>
              <v-card>
                    <v-card-text class="display-1 text-uppercase white--text text-center" :class="registro ? 'accent' : 'secondary'">
                        <span v-if="!registro">Ingreso</span>
                        <span v-else>Registro</span>
                    </v-card-text>

                    <v-card-text v-if="!registro">
                        <form @submit.prevent="ingresoUsuario({email: email, password: pass})">
                            <input type="email" placeholder="Ingrese Email" v-model="$v.email.$model" class="form-control mb-2" :class="{'is-invalid': $v.email.$error}">
                            <small class="text-danger d-block mb-3" v-if="!$v.email.email">Ingrese un correo valido</small>
                            <small class="text-danger d-block mb-3" v-if="!$v.email.required">Campo requerido</small>
                            <input type="password" placeholder="Ingrese Contraseña" v-model="pass" class="form-control mb-2" :class="{'is-invalid': $v.email.$error}">
                            <small class="text-danger d-block mb-3" v-if="!$v.pass.required">Campo requerido</small>
                            <small class="text-danger d-block mb-3" v-if="!$v.pass.minLength">Mínimo 6 caracteres</small>
                            <!-- <button type="submit" :disabled="!desactivar" class="btn btn-primary">Ingresar</button> -->
                            <v-btn type="submit" block :disabled="$v.$invalid" class="btn btn-primary mb-3" color="info">Ingresar</v-btn>
                        </form>
                        
                        <hr v-if="error != null">
                        <p v-if="error != null && error.code === 'auth/user-not-found'" class="text-danger">Usuario incorrecto/No existente</p>
                        <p v-if="error != null && error.code === 'auth/wrong-password'" class="text-danger">Contraseña incorrecta</p>


                        <v-btn block color="error" @click="google">
                            <v-icon left dark>fab fa-google</v-icon>
                            Google
                        </v-btn>
                      <!-- <v-btn block color="info" class="mt-2" @click="facebook">
                          <v-icon left dark>fab fa-facebook-square</v-icon>
                          Facebook
                      </v-btn> -->
                    </v-card-text>

                    <v-card-text v-else>
                        <form @submit.prevent="crearUsuario({email: email, password: pass})">
                            <input type="email" placeholder="Ingrese su correo" v-model="$v.email.$model" class="form-control mb-2" :class="{'is-invalid': $v.email.$error}">
                            <small v-if="!$v.email.required" class="d-block text-danger mb-2">Campo requerido</small>
                            <small v-if="!$v.email.email" class="d-block text-danger mb-2">Email no valido</small>

                            <input type="password" placeholder="Ingrese su contraseña" v-model="$v.pass.$model" class="form-control mb-2" :class="{'is-invalid': $v.pass.$error}">
                            <small v-if="!$v.pass.required" class="d-block text-danger mb-2">Campo requerido</small>
                            <small v-if="!$v.pass.minLength" class="d-block text-danger mb-2">Minimo 6 caracteres</small>

                            <!-- <input type="password" placeholder="Repita su contraseña" v-model="$v.pass2.$model" class="form-control mb-2" :class="{'is-invalid': $v.pass1.$error}">
                            <small v-if="!$v.pass2.required" class="d-block text-danger mb-2">Campo requerido</small>
                            <small v-if="!$v.pass2.sameAsPassword" class="d-block text-danger mb-2">La contraseñas no coinciden</small> -->
                            <!-- <button type="submit" :disabled="!desactivar" class="btn btn-primary">Registrar Usuario</button> -->
                            <v-btn type="submit" block :disabled="$v.$invalid" class="btn btn-primary mb-3" color="info">Registrar Usuario</v-btn>
                            <!-- {{desactivar}} -->
                        </form>
                        
                        <hr v-if="error != null">
                        <p v-if="error != null && error.code === 'auth/email-already-in-use'" class="text-danger">Usuario ya registrado</p>


                        <v-btn block color="error" @click="google">
                            <v-icon left dark>fab fa-google</v-icon>
                            Google
                        </v-btn>
                      <!-- <v-btn block color="info" class="mt-2" @click="facebook">
                          <v-icon left dark>fab fa-facebook-square</v-icon>
                          Facebook
                      </v-btn> -->
                    </v-card-text>

                    <v-card-text>
                        <v-btn block @click="registro = true" v-if="!registro">¿No tienes Cuenta? Registrate aquí</v-btn>
                        <v-btn block @click="registro = false" v-else>¿Ya tienes Cuenta? Ingresa aquí</v-btn>
                    </v-card-text>
              </v-card>
          </v-flex>
      </v-layout>
  </div>
</template>

<script>
import {firebase,auth,db} from '../firebase'
import { mapActions, mapMutations, mapState } from "vuex";
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import router from '../router'

export default {
    name: 'Login',
    data() {
        return {
            registro: false,
            email: '',
            pass: '',
            pass1: '',
            pass2: ''
        }
    },
    methods:{
        ...mapActions(['setUsuario','ingresoUsuario','crearUsuario']),
        // ...mapMutations(['nuevoUsuario']),
        facebook(){
            console.log('FACEBOOK')
            const provider = new firebase.auth.FacebookAuthProvider();
            this.ingresar(provider)
        },
        google(){
            console.log('GOOGLE')
            const provider = new firebase.auth.GoogleAuthProvider();
            this.ingresar(provider)
        },
        async ingresar(provider){
            firebase.auth().languageCode = 'es';
            try {
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;
                // console.log(user)

                this.setUsuario(user)

                router.push({name: 'Tablero'})
            } catch (error) {
                // if(error.email){
                //     console.log('El email ya ha sido registrado!')
                // }else if(error.credential){
                //     console.log('El Usuario ya ha sido registrado!')
                // }
                console.log(error)
            }
        }
    },
    computed: {
        ...mapState(['error']),
        desactivar(){
            return this.email !== '' && this.pass !== '' && this.pass.length > 5
        }
    },
    validations: {
        email: {email,required},
        pass: {minLength: minLength(6), required},
        // pass1: {required, minLength: minLength(6)},
        // pass2: {sameAsPassword: sameAs('pass')}
    }
}
</script>

<style>

</style>