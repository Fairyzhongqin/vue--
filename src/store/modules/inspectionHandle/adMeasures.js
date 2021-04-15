const state = {
  inspectionHandleadMeasuresisShow: false // 是否显示现场处理措施

}

const getters = {
}

const mutations = {
  setInspectionHandleadMeasuresisShow (state) {
    state.inspectionHandleadMeasuresisShow = !state.inspectionHandleadMeasuresisShow
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
