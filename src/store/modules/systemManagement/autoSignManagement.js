const state = {
  currAutoSignComp: 'dataDisplay',
  signId: '', // id
}
const mutations = {
  setCurrAutoSignComp: (store, payload) => {
    store.currAutoSignComp = payload.component
  },
}
const actions = {
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
