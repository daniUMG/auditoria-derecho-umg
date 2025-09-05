<template>
  <div class="login-container">
    <v-layout justify-center align-center fill-height>
      <v-flex xs12 sm10 md8 lg6 xl4>
        <v-card class="login-card elevation-12" shaped>
          <!-- Header con gradiente -->
          <div class="card-header" :class="registro ? 'register-gradient' : 'login-gradient'">
            <div class="header-content">
              <v-icon size="48" class="mb-3">
                {{ registro ? 'mdi-account-plus' : 'mdi-account-circle' }}
              </v-icon>
              <h2 class="display-1 font-weight-light text-uppercase">
                {{ registro ? 'Crear Cuenta' : 'Bienvenido' }}
              </h2>
              <p class="subtitle-1 mb-0 opacity-90">
                {{ registro ? 'Únete al sistema de monitoreo' : 'Ingresa a tu cuenta' }}
              </p>
            </div>
          </div>

          <!-- Formulario de Login -->
          <v-card-text v-if="!registro" class="pt-8 pb-1">
            <form @submit.prevent="ingresoUsuario({email: email, password: pass})">
              <v-text-field
                v-model="$v.email.$model"
                type="email"
                label="Correo Electrónico"
                prepend-inner-icon="mdi-email"
                outlined
                rounded
                :error="$v.email.$error"
                :error-messages="getEmailErrors()"
                class="mb-2"
                color="primary"
              ></v-text-field>

              <v-text-field
                v-model="pass"
                type="password"
                label="Contraseña"
                prepend-inner-icon="mdi-lock"
                outlined
                rounded
                :error="$v.pass.$error"
                :error-messages="getPasswordErrors()"
                class="mb-4"
                color="primary"
              ></v-text-field>

              <v-btn
                type="submit"
                block
                large
                rounded
                :disabled="$v.$invalid"
                :loading="loading"
                color="primary"
                class="mb-3 btn-login"
                elevation="2"
              >
                <v-icon left>mdi-login</v-icon>
                Iniciar Sesión
              </v-btn>
            </form>

            <!-- Divider -->
            <div class="divider-container mt-4">
              <v-divider></v-divider>
              <span class="divider-text">o</span>
              <v-divider></v-divider>
            </div>

            <!-- Social Login Buttons -->
            <!-- <div class="social-buttons">
              <v-btn
                large
                rounded
                outlined
                color="red"
                class="mb-2 social-btn"
                @click="google"
                block
              >
                <v-icon left color="red">mdi-google</v-icon>
                Google
              </v-btn>
              
              <v-btn
                large
                rounded
                outlined
                color="indigo"
                class="social-btn"
                @click="facebook"
                block
              >
                <v-icon left color="indigo">mdi-facebook</v-icon>
                Facebook
              </v-btn>
            </div> -->

            <!-- Error Messages -->
            <v-alert
              v-if="error"
              type="error"
              rounded
              class="mt-4"
              dense
            >
              <span v-if="error.code === 'auth/user-not-found'">
                Usuario no encontrado
              </span>
              <span v-else-if="error.code === 'auth/wrong-password'">
                Contraseña incorrecta
              </span>
              <span v-else>{{ error.message }}</span>
            </v-alert>
          </v-card-text>

          <!-- Formulario de Registro -->
          <v-card-text v-else class="pt-8 pb-1">
            <form @submit.prevent="crearUsuario({email: email, password: pass})">
              <v-text-field
                v-model="$v.email.$model"
                type="email"
                label="Correo Electrónico"
                prepend-inner-icon="mdi-email"
                outlined
                rounded
                :error="$v.email.$error"
                :error-messages="getEmailErrors()"
                class="mb-2"
                color="secondary"
              ></v-text-field>

              <v-text-field
                v-model="$v.pass.$model"
                type="password"
                label="Contraseña"
                prepend-inner-icon="mdi-lock"
                outlined
                rounded
                :error="$v.pass.$error"
                :error-messages="getPasswordErrors()"
                class="mb-4"
                color="secondary"
                hint="Mínimo 6 caracteres"
                persistent-hint
              ></v-text-field>

              <v-btn
                type="submit"
                block
                large
                rounded
                :disabled="$v.$invalid"
                :loading="loading"
                color="secondary"
                class="mb-3 btn-register"
                elevation="2"
              >
                <v-icon left>mdi-account-plus</v-icon>
                Crear Cuenta
              </v-btn>
            </form>

            <!-- Error Messages -->
            <v-alert
              v-if="error"
              type="error"
              rounded
              class="mt-4"
              dense
            >
              <span v-if="error.code === 'auth/email-already-in-use'">
                Este correo ya está registrado
              </span>
              <span v-else>{{ error.message }}</span>
            </v-alert>
          </v-card-text>

          <!-- Toggle Button -->
          <v-card-actions class="px-8 pb-8">
            <v-btn
              block
              large
              text
              rounded
              @click="toggleMode"
              class="toggle-btn"
              :color="registro ? 'primary' : 'secondary'"
            >
              {{ registro ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Background Pattern -->
    <!-- <div class="background-pattern"></div> -->
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
            pass2: '',
            loading: false
        }
    },
    methods:{
        ...mapActions(['setUsuario','ingresoUsuario','crearUsuario']),
        
        toggleMode() {
            this.registro = !this.registro;
            this.clearForm();
        },
        
        clearForm() {
            this.email = '';
            this.pass = '';
            this.$v.$reset();
        },
        
        getEmailErrors() {
            const errors = [];
            if (!this.$v.email.$dirty) return errors;
            !this.$v.email.required && errors.push('El correo es requerido');
            !this.$v.email.email && errors.push('Ingresa un correo válido');
            return errors;
        },
        
        getPasswordErrors() {
            const errors = [];
            if (!this.$v.pass.$dirty) return errors;
            !this.$v.pass.required && errors.push('La contraseña es requerida');
            !this.$v.pass.minLength && errors.push('Mínimo 6 caracteres');
            return errors;
        },
        
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
            this.loading = true;
            firebase.auth().languageCode = 'es';
            try {
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;

                this.setUsuario(user)
                router.push({name: 'Tablero'})
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false;
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
    }
}
</script>

<style scoped>
.login-container {
  /* min-height: 100vh; */
  position: relative;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  padding: 20px;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%);
  pointer-events: none;
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.card-header {
  padding: 40px 32px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: 0.9;
}

.login-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-gradient {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.header-content {
  position: relative;
  z-index: 1;
}

.opacity-90 {
  opacity: 0.9;
}

.divider-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.divider-text {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  padding: 0 8px;
  margin-bottom: 0px;
  background: #fff;
}

.social-buttons {
  margin-top: 16px;
}

.social-btn {
  text-transform: none !important;
  font-weight: 500;
  border-width: 2px !important;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.btn-login, .btn-register {
  text-transform: none !important;
  font-weight: 600;
  font-size: 16px;
  height: 48px !important;
  transition: all 0.3s ease;
}

.btn-login:hover, .btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2) !important;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.btn-register {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
}

.toggle-btn {
  text-transform: none !important;
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.toggle-btn:hover {
  opacity: 1;
}

.v-text-field {
  margin-bottom: 8px;
}

.v-text-field--outlined >>> .v-input__control > .v-input__slot {
  border-radius: 25px !important;
}

.v-text-field >>> .v-input__icon--prepend-inner {
  margin-right: 12px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .login-container {
    padding: 10px;
  }
  
  .card-header {
    padding: 30px 24px;
  }
  
  .v-card-text {
    padding: 24px !important;
  }
  
  .v-card-actions {
    padding: 0 24px 24px !important;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeInUp 0.6s ease-out;
}

/* Loading state */
.v-btn--loading {
  pointer-events: none;
}
</style>