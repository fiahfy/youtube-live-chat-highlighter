import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import storage from '../utils/storage'

Vue.use(Vuex)

export const defaultState = {
  enabled: true,
  ownerColor: '#ff9',
  moderatorColor: '#99f',
  memberColor: '#9f9',
  rules: []
}

export default new Vuex.Store({
  state: {
    ...defaultState
  },
  actions: {
    async init ({ commit }) {
      const items = await storage.get('vuex')
      try {
        const values = JSON.parse(items['vuex'])
        commit('setValues', { values })
      } catch (e) {}
    },
    async sendUpdates () {
      chrome.runtime.sendMessage({})
    },
    async setEnabled ({ commit, dispatch }, { enabled }) {
      commit('setEnabled', { enabled })
      dispatch('sendUpdates')
    },
    async setOwnerColor ({ commit, dispatch }, { ownerColor }) {
      commit('setOwnerColor', { ownerColor })
      dispatch('sendUpdates')
    },
    async setModeratorColor ({ commit, dispatch }, { moderatorColor }) {
      commit('setModeratorColor', { moderatorColor })
      dispatch('sendUpdates')
    },
    async setMemberColor ({ commit, dispatch }, { memberColor }) {
      commit('setMemberColor', { memberColor })
      dispatch('sendUpdates')
    }
  },
  mutations: {
    setValues (state, { values }) {
      Object.keys(state).forEach((key) => {
        const value = values[key]
        if (typeof value !== 'undefined') {
          state[key] = values[key]
        }
      })
    },
    setEnabled (state, { enabled }) {
      state.enabled = enabled
    },
    setOwnerColor (state, { ownerColor }) {
      state.ownerColor = ownerColor
    },
    setModeratorColor (state, { moderatorColor }) {
      state.moderatorColor = moderatorColor
    },
    setMemberColor (state, { memberColor }) {
      state.memberColor = memberColor
    },
    addRule (state) {
      const id = Math.max.apply(null, [0, ...state.rules.map((rule) => rule.id)]) + 1
      state.rules = [
        ...state.rules,
        { id }
      ]
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
