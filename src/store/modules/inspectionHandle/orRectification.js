const state = {
  inspectionHandleorRectificationisShow: false // 是否显示现场处理措施

}

const getters = {
}

const mutations = {
  setInspectionHandleorRectificationisShow (state) {
    state.inspectionHandleorRectificationisShow = !state.inspectionHandleorRectificationisShow
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
