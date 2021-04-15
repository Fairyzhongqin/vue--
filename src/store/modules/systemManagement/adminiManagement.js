const state = {
    adminiManagementCurrentComponent: 'adminList',
    showOrgList: false, // 选择部门弹窗
    detailId:'',
    flag:'',
    OrgData:''
  }
  const mutations = {
    setAdminiManagementCurrentComponent: (state, payload) => {
      state.adminiManagementCurrentComponent = payload
    },
    setOrgDialog: (state, payload) => {
      state.showOrgList = !state.showOrgList
    },
    setUpdata:(state,{id,flag})=>{
      state.detailId = id
      state.flag = flag
    },
    setAdd:(state,flag)=>{
      state.flag = flag
    },
    setSignature:(state,{id,flag})=>{
      state.detailId = id
      state.flag = flag
    },
    savaOrgData:(state,val)=>{
      state.OrgData = val
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
  