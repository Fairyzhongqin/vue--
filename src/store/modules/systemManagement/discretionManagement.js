const state = {
    currDiscreComp: 'dataDisplay',
    discId: '',//自由裁量的id
    discreQueryValue: null,
    currDiscreSearchInfo: {}
  }

  const mutations = {
    setCurrDiscreComp: (store, payload) => {
      store.currDiscreComp = payload.component
    },
    setCurrDiscreSearchInfo: (store, payload) => {
      store.currDiscreSearchInfo = payload
    },
    setDiscId: (store, payload) => {
      store.discId = payload.discId
    },
    setDiscreQueryValue: (store, payload) => {
      store.discreQueryValue = payload;
    },
    setDiscreQueryPage: (store, payload) => {
      store.discreQueryValue.page = payload;
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
