const state = {
   isDataList: false,
   flag: '',
   detailId: '',
   //   新增修改 返回删除节点
   addDictionaryInfo: null,
   addFreeInfoStatus:false,//自由裁量参数新增
   editFreeInfoStatus:false,//自由裁量参数编辑
   addDicInfoStatus:false,//字典新增
   editDicInfoStatus:false,//字典编辑
   addParamsInfoStatus:false,//参数新增
   editParamsInfoStatus:false,//参数编辑
}
const mutations = {
   setMenu: (state, payload) => {
      state.isDataList = !state.isDataList
   },
   setAdd: (state, flag) => {
      state.flag = flag
   },
   setUpdata: (state, { id, flag }) => {
      state.detailId = id
      state.flag = flag
   },
   //   新增修改 返回删除节点
   closeTags: (state, obj) => {
      state.addDictionaryInfo = obj;
   },
   changeFreeAddStatus:(state,payload) => {
      state.addFreeInfoStatus = payload
   },
   changeFreeEditStatus:(state,payload) => {
      state.editFreeInfoStatus = payload
   },
   changeDicAddStatus:(state,payload) => {
      state.addDicInfoStatus = payload
   },
   changeDicEditStatus:(state,payload) => {
      state.editDicInfoStatus = payload
   },
   changeParamsAddStatus:(state,payload) => {
      state.addParamsInfoStatus = payload
   },
   changeParamsEditStatus:(state,payload) => {
      state.editParamsInfoStatus = payload
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