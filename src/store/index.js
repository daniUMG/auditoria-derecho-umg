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
    leyes: [],
    procesos: [],
    subprocesos: [],
    areas: [],
    familias: [],
    subfamilias: [],
    claves: [],
    caracteristicas: [],
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
    setTablero(state, payload){
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
    setCaso(state,payload){
      state.caso = payload
    },
    setUsuarios(state,payload){
      state.usuarios = payload
    },
    setEquipos(state, payload){
      state.listadoleyes = payload
    },
    setLeyes(state, payload){
      state.leyes = payload
    },
    setProcesos(state, payload){
      state.procesos = payload
    },
    setSubProcesos(state, payload){
      state.subprocesos = payload
    },
    setAreas(state, payload){
      state.areas = payload
    },
    setFamilias(state, payload){
      state.familias = payload
    },
    setSubFamilias(state, payload){
      state.subfamilias = payload
    },
    setClaves(state, payload){
      state.claves = payload
    },
    setCaracteristicas(state, payload){
      state.caracteristicas = payload
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
    getTableros({commit,state}){
      commit('cargarFirebase',true)
      const tableros = []
      db.collection('tableros').get()
      .then(res => {
          res.forEach(doc => {
              // console.log(doc.id)
              // console.log(doc.data())
              let tablero = doc.data()
              tablero.id = doc.id
              tableros.push(tablero)
          })
          commit('cargarFirebase',false)
          commit('setTableros', tableros)
      })
    },
    getTablerosUsuarios({commit,state}){
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
    getTablero({commit,state},payload){
      db.collection('tableros').doc(payload).get()
      .then(doc => {
          // console.log(doc.data())
          let tablero = doc.data()
          tablero.id = doc.id
          // console.log(tablero);
          commit('setTablero', tablero)
      })
    },
    setTablero({commit,state},payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('tableros').add({
        nombre: payload.nombre,
        descripcion: payload.descripcion,
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
    editarTablero({commit},payload){
      commit('setLoading',true)
      commit('cargarFirebase',true)
      db.collection('tableros').doc(payload.id).update({
          nombre: payload.nombre,
          descripcion: payload.descripcion,
          tema: payload.tema,
          grupos: payload.grupos
      })
      
      commit('cargarFirebase',false)
      db.collection('tableros').doc(payload.id).get()
      .then(doc => {
          let tablero = doc.data()
          tablero.id = doc.id
          commit('setTablero', tablero)
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
    eliminarTablero({commit, state}, id){
      db.collection('tableros').doc(id).delete()
      .then(() => {
          commit('setEliminarTablero', id)
      })
    },
    agregarColumna({commit,state}, payload){
      commit('cargarFirebase',true)
      db.collection('tableros').doc(payload.tablero_id).collection('columnas').add(payload)
      .then(doc => {
          // router.push({name: 'ConfTablero'})
          commit('cargarFirebase',false)
      })
    },
    getColumnas({commit,state}, payload){
      commit('cargarFirebase',true)
      const columnas = []
      db.collection('tableros').doc(payload).collection('columnas').get()
      .then(res => {
          res.forEach(doc => {
              // console.log(doc.id)
              // console.log(doc.data())
              let columna = doc.data()
              columna.id = doc.id
              columnas.push(columna)
              // columnas.push({id: 'cerrado', nombre: 'Cerrado'})
          })
          commit('cargarFirebase',false)
          commit('setColumnas', columnas)
      })
    },
    getCasos({commit,state},payload){
      commit('setCasos', payload)
      // commit('cargarFirebase',true)
      // const casos = []
      // db.collection('tableros').doc(payload).collection('casos').get()
      // .then(res => {
      //     res.forEach(doc => {
      //         // console.log(doc.id)
      //         // console.log(doc.data())
      //         let caso = doc.data()
      //         caso.id = doc.id
      //         casos.push(caso)
      //     })
      //     commit('cargarFirebase',false)
      //     commit('setCasos', casos)
      // })
    },
    getCaso({commit},payload){
      commit('setLoading',true)
      var casoset
      db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCaso).get()
      .then(doc => {
          // console.log(doc.data())
          casoset = doc.data()
          casoset.id = doc.id
          commit('setCaso', casoset)
          commit('setLoading',false)
      })
    },
    setCaso({commit,state}, payload){
      commit('cargarFirebase',true)
      commit('setLoading',true)
      var newPostKey = realtime.ref().child('Casos').push().key
      console.log(newPostKey);
      const structCaso = {
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        create_by: state.usuario.nombre,
        usuarioAsignado: payload.usuarioAsignacion,
        foto: state.usuario.foto,
        prioridad: payload.prioridad,
        fechaEstimada: payload.date+' '+payload.time+':00',
        tiempoEstimado: payload.tiempoEstimado,
        columna_id: 'nuevo',
        category: 'Sin Asignar',
        sub_category: 'Sin Asignar',
        proyecto: 'Sin Asignar',
        sub_proyecto: 'Sin Asignar',
        id_task: newPostKey,
        created_at: Date.now(),
        updated_at: Date.now()
      }

      db.collection('tableros').doc(payload.tablero_id).collection('casos').doc(newPostKey).set(structCaso)

      // Datos chat
      const message = 'Se creó el ticket'
      db.collection('tableros').doc(payload.tablero_id).collection('casos').doc(newPostKey).collection('chat').add({
        user_name: state.usuario.nombre,
        message: message,
        date: Date.now(),
        hour: Date.now('h:i A'),
        img: state.usuario.foto,
        seenBy: [state.usuario.nombre],
        id_task: newPostKey,
        uid: state.usuario.uid,
        type: 'all_question_answered',
        status_task: 'nuevo'
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Tareas', id: payload.tablero_id})
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
    editarCasoPrioridad({commit,state},payload){
      // console.log(payload.idTablero)
      // console.log(payload.idCasoDoc)
      db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).update({
          prioridad: payload.prioridad
      })
      const message = 'se cambió la prioridad a: '+payload.prioridad
      db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).collection('chat').add({
        user_name: state.usuario.nombre,
        message: message,
        date: Date.now(),
        hour: Date.now('h:i A'),
        img: state.usuario.foto,
        seenBy: [state.usuario.nombre],
        id_task: payload.idCasoDoc,
        uid: state.usuario.uid,
        type: 'other_actions',
        status_task: 'nuevo'
      }).catch(error => console.log(error))
    },
    editarCasoAsignacion({commit,state},payload){
      // console.log(payload.idTablero)
      // console.log(payload.idCasoDoc)
      if(payload.asignado) {
        db.collection('usuarios').doc(payload.asignado).get()
        .then(docUser => {
          db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).update({
              usuarioAsignado: docUser.data().nombre,
              foto: docUser.data().foto,
          })
          const message = 'se cambió la asignación a: '+docUser.data().nombre
          db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).collection('chat').add({
            user_name: state.usuario.nombre,
            message: message,
            date: Date.now(),
            hour: Date.now('h:i A'),
            img: state.usuario.foto,
            seenBy: [state.usuario.nombre],
            id_task: payload.idCasoDoc,
            uid: state.usuario.uid,
            type: 'other_actions',
            status_task: 'nuevo'
          }).catch(error => console.log(error))
        }).catch(error => console.log(error))
      }
    },
    editarCasoColumna({commit,state},payload){
      if(payload.columna) {
        if(payload.columna !== 'cerrado') {
          db.collection('tableros').doc(payload.idTablero).collection('columnas').doc(payload.columna).get()
          .then(docCol => {
            db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).update({
              columna_id: payload.columna,
              title_columna: docCol.data().nombre,
              usuarioAsignado: state.usuario.nombre,
              foto: state.usuario.foto,
            })

            var message = 'se cambió el status a: '+docCol.data().nombre
            db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).collection('chat').add({
              user_name: state.usuario.nombre,
              message: message,
              date: Date.now(),
              hour: Date.now('h:i A'),
              img: state.usuario.foto,
              seenBy: [state.usuario.nombre],
              id_task: payload.idCasoDoc,
              uid: state.usuario.uid,
              type: 'other_actions',
              status_task: 'nuevo'
            }).catch(error => console.log(error))
          })
        } else {
          db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).update({
            columna_id: payload.columna,
            title_columna: payload.columna,
            usuarioAsignado: state.usuario.nombre,
            foto: state.usuario.foto,
          })

          var message = 'se cambió el status a: '+payload.columna
          db.collection('tableros').doc(payload.idTablero).collection('casos').doc(payload.idCasoDoc).collection('chat').add({
            user_name: state.usuario.nombre,
            message: message,
            date: Date.now(),
            hour: Date.now('h:i A'),
            img: state.usuario.foto,
            seenBy: [state.usuario.nombre],
            id_task: payload.idCasoDoc,
            uid: state.usuario.uid,
            type: 'other_actions',
            status_task: 'nuevo'
          }).catch(error => console.log(error))
        }
      }
      // console.log(payload.columna);
    },
    getListadoLeyes({commit, state},payload){
      commit('cargarFirebase',true)
      const listadoleyes = []
      db.collection('leyes').get()
      .then(res => {
          res.forEach(doc => {
              let equipo = doc.data()
              equipo.id = doc.id
              equipo.fecha = doc.data().fecha ? moment(doc.data().fecha).format('lll') : '-'
              equipo.fecha_auditoria = doc.data().fecha_auditoria ? moment(doc.data().fecha_auditoria).format('lll') : '-'
              equipo.auditada_por = doc.data().auditada_por ? doc.data().auditada_por : '-'
              listadoleyes.push(equipo)
          })
          commit('cargarFirebase',false)
          commit('setEquipos', listadoleyes)
      })
    },
    getLeyesLegislacion({commit, state},payload){
      commit('cargarFirebase',true)
      const listadoleyes = []
      db.collection('leyes').where('legislacion','==',payload).get()
      .then(res => {
          res.forEach(doc => {
              let equipo = doc.data()
              equipo.id = doc.id
              equipo.fecha = doc.data().fecha ? moment(doc.data().fecha).format('lll') : '-'
              equipo.fecha_auditoria = doc.data().fecha_auditoria ? moment(doc.data().fecha_auditoria).format('lll') : '-'
              equipo.auditada_por = doc.data().auditada_por ? doc.data().auditada_por : '-'
              listadoleyes.push(equipo)
          })
          commit('cargarFirebase',false)
          commit('setLeyes', listadoleyes)
      })
    },
    setEquipo({commit, state}, payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('listadoleyes').add({
        tag: payload.tag,
        codigoSap: payload.codigoSap,
        // imagen: payload.imagen,
        tipoEquipo: payload.tipoEquipo,
        descripcion: payload.descripcion,
        proceso: payload.proceso,
        subproceso: payload.subproceso,
        area: payload.area,
        familia: payload.familia,
        subfamilia: payload.subfamilia,
        clave: payload.clave,
        caracteristica: payload.caracteristica,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Equipos'})
      })
    },
    getProcesos({commit, state},payload){
      commit('cargarFirebase',true)
      const procesos = []
      db.collection('procesos').get()
      .then(res => {
          res.forEach(doc => {
              let proceso = doc.data()
              proceso.id = doc.id
              procesos.push(proceso)
          })
          commit('cargarFirebase',false)
          commit('setProcesos', procesos)
      })
    },
    setProceso({commit, state}, payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('procesos').add({
        nombre: payload.nombreProceso,
        descripcion: payload.descripcionProceso,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Procesos'})
      })
    },
    getSubProcesos({commit, state},payload){
      commit('cargarFirebase',true)
      const subprocesos = []
      db.collection('subprocesos').get()
      .then(res => {
          res.forEach(doc => {
              let subproceso = doc.data()
              subproceso.id = doc.id
              subprocesos.push(subproceso)
          })
          commit('cargarFirebase',false)
          commit('setSubProcesos', subprocesos)
      })
    },
    setSubProceso({commit, state}, payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('subprocesos').add({
        nombre: payload.nombreSubProceso,
        idproceso: payload.idproceso,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Procesos'})
      })
    },
    getAreas({commit, state},payload){
      commit('cargarFirebase',true)
      const areas = []
      db.collection('areas').get()
      .then(res => {
          res.forEach(doc => {
              let area = doc.data()
              area.id = doc.id
              areas.push(area)
          })
          commit('cargarFirebase',false)
          commit('setAreas', areas)
      })
    },
    setArea({commit, state}, payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('areas').add({
        nombre: payload.nombreArea,
        idsubproceso: payload.idsubproceso,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Procesos'})
      })
    },
    getFamilias({commit, state},payload){
      commit('cargarFirebase',true)
      const familias = []
      db.collection('familias').get()
      .then(res => {
          res.forEach(doc => {
              let familia = doc.data()
              familia.id = doc.id
              familias.push(familia)
          })
          commit('cargarFirebase',false)
          commit('setFamilias', familias)
      })
    },
    setFamilia({commit,state},payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('familias').add({
        nombre: payload.nombreFamilia,
        descripcion: payload.descripcionFamilia,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Familias'})
      })
    },
    getSubFamilias({commit, state},payload){
      commit('cargarFirebase',true)
      const subfamilias = []
      db.collection('subfamilias').get()
      .then(res => {
          res.forEach(doc => {
              let subfamilia = doc.data()
              subfamilia.id = doc.id
              subfamilias.push(subfamilia)
          })
          commit('cargarFirebase',false)
          commit('setSubFamilias', subfamilias)
      })
    },
    setSubFamilia({commit,state},payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('subfamilias').add({
        nombre: payload.nombreSubFamilia,
        idfamilia: payload.idfamilia,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Familias'})
      })
    },
    getClaves({commit, state},payload){
      commit('cargarFirebase',true)
      const claves = []
      db.collection('claves').get()
      .then(res => {
          res.forEach(doc => {
              let clave = doc.data()
              clave.id = doc.id
              claves.push(clave)
          })
          commit('cargarFirebase',false)
          commit('setClaves', claves)
      })
    },
    setClave({commit,state},payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('claves').add({
        nombre: payload.nombreClave,
        descripcion: payload.descripcionClave,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Claves'})
      })
    },
    getCaracteristicas({commit, state},payload){
      commit('cargarFirebase',true)
      const caracteriticas = []
      db.collection('caracteriticas').get()
      .then(res => {
          res.forEach(doc => {
              let caracteritica = doc.data()
              caracteritica.id = doc.id
              caracteriticas.push(caracteritica)
          })
          commit('cargarFirebase',false)
          commit('setCaracteriticas', caracteriticas)
      })
    },
    setCaracteristica({commit,state},payload){
      commit('cargarFirebase', true)
      commit('setLoading',true)
      db.collection('caracteristicas').add({
        nombre: payload.nombreCaracteristica,
        idclave: payload.idclave,
        date: Date.now(),
        hour: Date.now('h:i A')
      }).catch(error => console.log(error))
      .then(doc => {
        // console.log(payload)
        commit('cargarFirebase',false)
        commit('setLoading',false)
        router.push({name:'Claves'})
      })
    },
    cerrarSesion({commit}){
      auth.signOut()
      commit('nuevoUsuario',null)
      router.push({name:'Login'})
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
    arrayFiltradoCasos(state){
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
