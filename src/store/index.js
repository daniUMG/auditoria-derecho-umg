import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import {auth,db,realtime,storage,secondaryApp} from '../firebase'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null,
    usuario: '',
    mensaje: '',
    type: false,
    buscador: '',
    carga: false,
    tableros: [],
    tablero: {nombre: '', descripcion: '', tema: '', id: ''},
    columnas: [],
    casos: [],
    caso: {nombre: '', descripcion: '', columna_id: '', created_at: '', fechaEstimada: '', id: '', id_task: '', prioridad: '', tiempoEstimado: '', updated_at: '', usuarioAsignacion: ''},
    buscadorCasos: '',
    usuarios: [],
    listadoleyes: [],
    listadoReportes: [],
    usuarioReportes: [],
    leyes: [],
    grupos: [],
    loading: false
  },
  mutations: {
    nuevoUsuario(state,payload){
      if(payload === null){
        state.usuario = ''
      }else {
        state.usuario = payload
      }
    },
    setError(state,payload){
      state.error = payload
    },
    nuevoMensaje(state,payload){
      state.mensaje = payload
    },
    estadoType(state,payload){
      state.type = payload
    },
    setTableros(state, payload){
      state.tableros = payload
    },
    setEmpresa(state, payload){
      state.tablero = payload
    },
    setEliminarTablero(state, payload){
      state.tableros = state.tableros.filter(item => item.id !== payload)
    },
    setColumnas(state,payload){
      state.columnas = payload
    },
    setCasos(state,payload){
      state.casos = payload
    },
    setUsuarios(state,payload){
      state.usuarios = payload
    },
    setUsuarioReportes(state, payload){
      state.usuarioReportes = payload
    },
    setReportes(state, payload){
      state.listadoReportes = payload
    },
    setListadoLeyes(state, payload){
      state.listadoleyes = payload
    },
    setLeyes(state, payload){
      state.leyes = payload
    },
    setGrupos(state, payload){
      state.grupos = payload
    },
    cargarFirebase(state, payload){
      state.carga = payload
    },
    setLoading(state,payload){
      state.loading = payload
    }
  },
  actions: {
    buscador({commit, state},payload){
      // console.log(payload)
      state.buscador = payload.toLowerCase()
    },
    buscadorCasos({commit, state},payload){
      state.buscadorCasos = payload.toLowerCase()
    },
    getEmpresasUsuario({commit,state}){
      commit('cargarFirebase',true)
      const tableros = []
      
      db.collection('tableros').get()
      .then(res => {
          res.forEach(doc => {
            if (state.usuario.tipo == "Administrador" || state.usuario.tipo == "Encargado") {
              let tablero = doc.data()
              tablero.id = doc.id
              tableros.push(tablero)
            } else {
              doc.data().grupos.forEach(itemsGrupos => {
                db.collection('grupos').doc(itemsGrupos).get()
                .then(itemGrupo => {
                  itemGrupo.data().usuarios.forEach(itemUsuario => {
                    if (itemUsuario == state.usuario.uid) {
                      let tablero = doc.data()
                      tablero.id = doc.id
                      tableros.push(tablero)
                    }
                  })
                })
              })
            }
          })
          commit('cargarFirebase',false)
          commit('setTableros', tableros)
      })
    },
    getEmpresa({commit,state},payload){
      db.collection('tableros').doc(payload).get()
      .then(doc => {
          // console.log(doc.data())
          let tablero = doc.data()
          tablero.id = doc.id
          // console.log(tablero);
          commit('setEmpresa', tablero)
      })
    },
    setEmpresa({commit,state},payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('tableros').add({
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        region: payload.region,
        tema: payload.tema,
        grupos: payload.grupos,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Empresas'})
      })
    },
    editarEmpresa({commit},payload){
      commit('setLoading',true)
      commit('cargarFirebase',true)
      db.collection('tableros').doc(payload.id).update({
          nombre: payload.nombre,
          descripcion: payload.descripcion,
          region: payload.region,
          tema: payload.tema,
          grupos: payload.grupos
      })
      
      commit('cargarFirebase',false)
      db.collection('tableros').doc(payload.id).get()
      .then(doc => {
          let tablero = doc.data()
          tablero.id = doc.id
          commit('setEmpresa', tablero)
      })
      commit('setLoading',false)
    },
    typpingAction({commit},payload){
      if (payload) {
          let estado = true
          commit('estadoType', estado)
      } else {
          let estado = false
          commit('estadoType', estado)
      }
    },
    crearUsuario({commit}, usuario){
      auth.createUserWithEmailAndPassword(usuario.email,usuario.password)
      .then(res=>{
        // console.log(res)
        const UsuarioCreado = {
          // email: res.user.email,
          // uid : res.user.uid
          nombre: usuario.email,
          email: usuario.email,
          uid: res.user.uid,
          foto: 'https://firebasestorage.googleapis.com/v0/b/proyectoingsis.appspot.com/o/lawlogo.png?alt=media&token=b70d615b-ce69-4df2-95df-08de82fab229',
          tipo: usuario.rol ? usuario.rol : 'usuario'
        }

        db.collection("usuarios").doc(UsuarioCreado.uid).set(UsuarioCreado)
          // console.log("Document successfully written!");
          commit('nuevoUsuario',UsuarioCreado)
          router.push('/')
          
      })
      .catch(error => {
        console.log(error)
        commit('setError', error)
      })
    },
    ingresoUsuario({commit}, usuario){
      auth.signInWithEmailAndPassword(usuario.email,usuario.password)
      .then(res => {
        // console.log(res)
        db.collection('usuarios').doc(res.user.uid).get()
        .then(doc => {
          commit('nuevoUsuario', doc.data())
          // commit('setUsuario', UsuarioLogueado)
          router.push('/')
        })
      })
      .catch(error => {
        console.log(error)
        commit('setError', error)
      })
    },
    async setUsuario({commit}, payload){
      try {
        const doc = await db.collection('usuarios').doc(payload.uid).get()

        if (doc.exists) {
          commit('nuevoUsuario', doc.data())
        } else {
          const usuario = {
            nombre: payload.displayName,
            email: payload.email,
            uid: payload.uid,
            foto: payload.photoURL,
            tipo: payload.rol ? payload.rol : 'usuario'
          }
          await db.collection("usuarios").doc(usuario.uid).set(usuario)
          console.log("Document successfully written!");
          commit('nuevoUsuario',usuario)  
        }
        
      } catch (error) {
        console.log(error)
      }
      
    },
    getUsuarios({commit}){
      const usuarios =  []
      db.collection('usuarios').get()
      .then(res => {
        res.forEach(doc => {
          let usuario = doc.data()
          usuario.id = doc.id
          usuarios.push(usuario)
        })
        commit('setUsuarios',usuarios)
      })
    },
    async setAddUsuario({commit}, payload){
      try {
        const doc = await db.collection('usuarios').where('email', '==', payload.email).get()

        if(!doc.size) {
          commit('cargarFirebase', true)
          commit('setLoading',true)
          // if (payload.photoURL == '') {
          //   var refImg = await storage.refFromURL('gs://proyectoingsis.appspot.com/userDefault.svg')
          //   var urlDescarga = await refImg.getDownloadURL()
          // } else {
          //   var refImg = await storage.ref().child(payload.email).child('fotoPerfil')
          //   console.log(payload.photoURL)
          //   var res = await refImg.put(payload.photoURL)
          //   var urlDescarga = await refImg.getDownloadURL()
          // }
          const signInEmail = await secondaryApp.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          
          const usuario = {
            nombre: payload.displayName,
            email: payload.email,
            uid: signInEmail.user.uid,
            tipo: payload.tipo.value,
            foto: 'https://firebasestorage.googleapis.com/v0/b/proyectoingsis.appspot.com/o/lawlogo.png?alt=media&token=b70d615b-ce69-4df2-95df-08de82fab229'
          }
          db.collection("usuarios").doc(usuario.uid).set(usuario)
          // console.log("Document successfully written!");
          commit('setLoading',false)
          commit('cargarFirebase', false)
          router.push({name:'Usuarios'})
        } else {
          commit('setLoading',false)
          commit('cargarFirebase', false)
          alert('El Correo ya está registrado')
        }
      } catch (error) {
        console.log(error)
      }
      
    },
    getGrupos({commit,state}, payload){
      commit('cargarFirebase',true)
      const grupos = []
      db.collection('grupos').get()
      .then(res => {
          res.forEach(doc => {
              let grupo = doc.data()
              grupo.id = doc.id
              grupos.push(grupo)
          })
          commit('cargarFirebase',false)
          commit('setGrupos', grupos)
      })
    },
    setGrupo({commit,state},payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('grupos').add({
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        usuarios: payload.users,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Grupos'})
      })
    },
    setMessage({commit}, payload){
      const msg = {
        mensaje: payload.mensaje,
        nombre: payload.nombre,
        foto: payload.foto,
        date: Date.now(),
        uid: payload.uid
      }
      db.collection('chats').add(msg).catch(error => console.log(error))
      // console.log("Document successfully written FIRESTORE!");

      // realtime.ref('usuarios/mensajes/'+payload.uid).push(msg).catch(error => console.log(error));
      // console.log("Document successfully written REALTIME!");
      // commit('nuevoMensaje',msg)
    },
    eliminarEmpresa({commit, state}, id){
      db.collection('tableros').doc(id).delete()
      .then(() => {
          commit('setEliminarTablero', id)
      })
    },
    setMessageCaso({commit}, payload){
      const msg = {
        user_name: payload.nombre,
        message: payload.mensaje,
        date: Date.now(),
        hour: Date.now('h:i A'),
        img: payload.foto,
        seenBy: [payload.nombre],
        id_task: payload.idCasoDoc,
        uid: payload.uid,
        type: 'other_actions',
        status_task: 'nuevo'
      }
      db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).collection('chat').add(msg).catch(error => console.log(error))
    },
    getListadoLeyes({commit, state},payload){
      commit('cargarFirebase',true)
      const listadoleyes = []
      db.collection('leyes').get()
      .then(res => {
        res.forEach(doc => {
          db.collection('tableros').doc(doc.data().empresa).get()
          .then(docEmpresa => {
            let ley = doc.data()
            ley.id = doc.id
            ley.decreto = doc.data().documento.numeroLey
            ley.fpublicacion = doc.data().documento.fecha
            ley.nEmpresa = docEmpresa.data().nombre
            ley.rEmpresa = docEmpresa.data().region
            ley.fecha = doc.data().fecha ? moment(doc.data().fecha).format('lll') : '-'
            // ley.fecha_auditoria = doc.data().fecha_auditoria ? moment(doc.data().fecha_auditoria).format('lll') : '-'
            // ley.auditada_por = doc.data().auditada_por ? doc.data().auditada_por : '-'
            listadoleyes.push(ley)
          })
        })
        commit('cargarFirebase',false)
        commit('setListadoLeyes', listadoleyes)
      })
    },
    getListadoReportes({commit, state},payload){
      commit('cargarFirebase',true)
      const listadoReportes = []
      // db.collection('leyes').get()
      // .then(res => {
      //   res.forEach(doc => {
          db.collection('reportes').get()
          .then(docs => {
            // console.log(docs.size)
            docs.forEach(doc => {
              let ley = doc.data()
              ley.id = doc.id
              ley.decreto = doc.data().documento.numeroLey
              ley.fpublicacion = doc.data().documento.fecha
              ley.nEmpresa = doc.data().tablero.nombre
              ley.rEmpresa = doc.data().tablero.region
              ley.fecha = doc.data().fecha ? moment(doc.data().fecha).format('lll') : '-'
              ley.fevaluacion = doc.data().documento.fechaEvaluacion
              // ley.fecha_auditoria = doc.data().fecha_auditoria ? moment(doc.data().fecha_auditoria).format('lll') : '-'
              // ley.auditada_por = doc.data().auditada_por ? doc.data().auditada_por : '-'
              listadoReportes.push(ley)
            })
            // console.log(listadoReportes.length)
            commit('cargarFirebase',false)
            commit('setReportes', listadoReportes)
          })
        // })
      // })
    },
    getUsuarioReportes({commit, state},payload){
      commit('cargarFirebase',true)
      const listadoReportes = []
      db.collection('tableros').get()
      .then(res => {
        res.forEach(doc => {
          doc.data().grupos.forEach(itemsGrupos => {
            db.collection('grupos').doc(itemsGrupos).get()
            .then(itemGrupo => {
              var tableros = []
              itemGrupo.data().usuarios.forEach(itemUsuario => {
                if(itemUsuario == state.usuario.uid) {
                  // let tablero = doc.data()
                  // tablero.id = doc.id
                  tableros.push(doc.id)
                }
              })

              // console.log(tableros)
              if(tableros.length) {
                db.collection('reportes').where('empresa', 'in', tableros).get()
                .then(docs => {
                  // console.log(docs.size)
                  docs.forEach(doc => {
                    if(listadoReportes.filter(ele => ele.id === doc.id).length === 0) {
                      let ley = doc.data()
                      ley.id = doc.id
                      ley.decreto = doc.data().documento.numeroLey
                      ley.fpublicacion = doc.data().documento.fecha
                      ley.nEmpresa = doc.data().tablero.nombre
                      ley.rEmpresa = doc.data().tablero.region
                      ley.fecha = doc.data().fecha ? moment(doc.data().fecha).format('lll') : '-'
                      ley.fevaluacion = doc.data().documento.fechaEvaluacion
                      // ley.fecha_auditoria = doc.data().fecha_auditoria ? moment(doc.data().fecha_auditoria).format('lll') : '-'
                      // ley.auditada_por = doc.data().auditada_por ? doc.data().auditada_por : '-'
                      listadoReportes.push(ley)
                    }
                  })
                  // console.log(listadoReportes.length)
                  // commit('cargarFirebase',false)
                  // commit('setUsuarioReportes', listadoReportes)
                })
              }
            })
          })
        })

        // setTimeout(() => {
          commit('cargarFirebase',false)
          commit('setUsuarioReportes', listadoReportes)
        // }, 3300)
      })
    },
    
    getLeyesLegislacion({commit, state},payload){
      commit('cargarFirebase',true)
      const listadoleyes = []
      db.collection('leyes').where('empresa','==',payload).get()
      .then(res => {
          res.forEach(doc => {
              let ley = doc.data()
              ley.id = doc.id
              ley.decreto = doc.data().documento.numeroLey
              ley.fpublicacion = doc.data().documento.fecha
              ley.fecha = doc.data().fecha ? moment(doc.data().fecha).format('lll') : '-'
              // ley.fecha_auditoria = doc.data().fecha_auditoria ? moment(doc.data().fecha_auditoria).format('lll') : '-'
              // ley.auditada_por = doc.data().auditada_por ? doc.data().auditada_por : '-'
              listadoleyes.push(ley)
          })
          commit('cargarFirebase',false)
          commit('setLeyes', listadoleyes)
      })
    },
    cerrarSesion({commit}){
      auth.signOut()
      commit('nuevoUsuario',null)
      router.push({name:'Login'})
      window.location.href = '/login'
    }
  },
  getters: {
    arrayFiltrado(state){
      let arregloFiltrado = []
      for (let tablero of state.tableros) {
        let nombre = tablero.nombre.toLowerCase();
        let descripcion = tablero.descripcion.toLowerCase();
        if (nombre.indexOf(state.buscador) >= 0 || descripcion.indexOf(state.buscador) >= 0) {
          arregloFiltrado.push(tablero)
        }
      }
      return arregloFiltrado;
    },
    arrayFiltradoEmpresa(state){
      let arregloFiltrado = []
      for (let caso of state.casos) {
        let nombre = caso.nombre.toLowerCase();
        let descripcion = caso.descripcion.toLowerCase();
        if (nombre.indexOf(state.buscadorCasos) >= 0 || descripcion.indexOf(state.buscadorCasos) >= 0) {
          arregloFiltrado.push(caso)
        }
      }
      return arregloFiltrado;
    }
  },
  modules: {
  }
})
