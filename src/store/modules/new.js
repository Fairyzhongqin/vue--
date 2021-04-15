const state = {
  newRectificationShow: false,
}

const mutations = {
  setNewRectificationShow(state,payload){
    if (payload === true) {
      state.newRectificationShow = payload;
    } else {
      state.newRectificationShow = !state.newRectificationShow;
    }
     
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