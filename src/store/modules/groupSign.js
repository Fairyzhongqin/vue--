const state = {
    currGroupComp: 'dataDisplay'
  }
  
  const mutations = {
    setCurrGroupComp: (store, component) => {
      store.currGroupComp = component
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
  