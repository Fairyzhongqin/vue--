const state = {
    currTempComp: 'dataTable',
    tempInfo: {} // 某条模板列表的信息
  }
  
  const mutations = {
    switchInspTemplate: (store, component) => {
      store.currTempComp = component
    },
    setTempInfo: (store, info) => {
      store.tempInfo = info
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
  