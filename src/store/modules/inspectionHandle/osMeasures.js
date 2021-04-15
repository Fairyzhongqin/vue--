const state = {
  inspectionHandleosMeasuresisShow: false // 是否显示现场处理措施

}

const getters = {
}

const mutations = {
  setInspectionHandleosMeasuresisShow (state) {
    state.inspectionHandleosMeasuresisShow = !state.inspectionHandleosMeasuresisShow
  }
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
