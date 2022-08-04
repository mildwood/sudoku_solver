import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    snackbarTrigger: false,
    snackbarMessage: "",
    snackbarTimeout: 3000,
  },
  getters: {
  },
  mutations: {
    setSnackbarMessage(state, data) {
      state.snackbarMessage = data
    },
    setSnackbarTrigger(state, data){
      state.snackbarTrigger = data
    },
    setSnackbarTimeout(state, data){
      state.snackbarTimeout = data
    },
  },
  actions: {
  },
  modules: {
  }
})
