const state = {
  currCaseHandle: 0
}

const getters = {

}

const mutations = {
  setcurrCaseHandle (state, payload) {
    state.currCaseHandle = payload.index
  }
}

const actions = {

}

export default {
  state,
  getters,
  mutations,
  actions
}
