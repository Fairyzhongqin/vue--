const state = {
  currentReAuditComponent: 'dataDisplay'
}
const mutations = {
  setCurrentReAuditComponent: (store, component) => {
    store.currentReAuditComponent = component
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
