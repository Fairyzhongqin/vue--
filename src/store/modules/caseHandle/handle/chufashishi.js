const state = {
  caseHandlechufashishiProgress: 0, // 目前在哪一关
  chufashishiComponent: ''// 目前打开的组件
}
const getters = {
}
const mutations = {
  setcaseHandlechufashishiProgress (state, val) {
    state.caseHandlechufashishiProgress = val
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
