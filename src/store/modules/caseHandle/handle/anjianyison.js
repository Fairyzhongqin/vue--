const state = {
  currTransPro: 1, // 当前案件移送所在节点
  currCaseEndPro: 1, // 当前案件终止所在节点
  transComponent: '' // 案件移送的组件
}

const getters = {

}

const mutations = {
  setCurrTransPro(state, val) {
    state.currTransPro = val
  },
  setTransComponent(state, component) {
    state.transComponent = component
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
