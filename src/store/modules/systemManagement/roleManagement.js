const state = {
    isDataList:false,
    flag:'',
    detailId:''

  }
  const mutations = {
   setRoleManagement:(state,payload) => {
       state.isDataList = !state.isDataList
   },
   setAdd:(state,flag) => {
      state.flag = flag
   },
   setUpdata:(state,{id,flag})=>{
      state.detailId = id
      state.flag = flag
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