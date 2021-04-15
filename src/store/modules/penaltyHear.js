const state = {
    currHearingComp: 'dataDisplay'
  }
  
  const mutations = {
    setCurrHearingComp: (store, component) => {
      store.currHearingComp = component
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
  