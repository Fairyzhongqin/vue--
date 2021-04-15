const state = {
  inspectionResultShow: false
}

const getters = {}

const mutations = {
  setInspectionResultShow: (state, payload) => {
    state.inspectionResultShow = !state.inspectionResultShow
  }
  // setPunishShow: (state, payload) => {
  //   state.punishShow = !state.punishShow
  // }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
