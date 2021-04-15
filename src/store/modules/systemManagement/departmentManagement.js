const state = {
    isDataList:false,
    detailId:'',
    flag:''
  }
  const mutations = {
   setDepartment:(state,payload) => {
       state.isDataList = !state.isDataList
   },
   setUpdata:(state,{id,flag}) =>{
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
  