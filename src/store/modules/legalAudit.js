const state = {
  currentAuditComponent: 'dataDisplay'
}

const mutations = {
  setCurrentAuditComponent: (store, component) => {
    store.currentAuditComponent = component
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
