const state = {
    currDiscussionComp: 'dataDisplay'
  }
  
  const mutations = {
    setCurrDiscussionComp: (store, component) => {
      store.currDiscussionComp = component
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
  