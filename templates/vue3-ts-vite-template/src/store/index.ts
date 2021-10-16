import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const state = {
  baseInfo: {}
}

const getters = {}

const mutations = {}

const actions = {}

const store = createStore({
  state,
  getters,
  mutations,
  actions,
  plugins: [createPersistedState()]
})

export default store
