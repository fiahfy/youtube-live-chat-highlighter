import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import storage from '../utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    enabled: true
  },
  actions: {
    async init ({ commit }) {
      const items = await storage.get('vuex')
      const values = JSON.parse(items['vuex'])
      commit('setValues', { values })
    },
    async sendUpdates () {
      chrome.runtime.sendMessage({})
    },
    async setEnabled ({ commit, dispatch }, { enabled }) {
      commit('setEnabled', { enabled })
      dispatch('sendUpdates')
    }
  },
  mutations: {
    setValues (state, { values }) {
      Object.keys(state).forEach((key) => {
        state[key] = values[key]
      })
    },
    setEnabled (state, { enabled }) {
      state.enabled = enabled
    }
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => null,
        setItem: (key, value) => storage.set({ [key]: value }),
        removeItem: (key) => storage.remove(key)
      }
    })
  ]
})
