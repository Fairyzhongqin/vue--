const state = {
  currtaskComp: 'dataDisplay',
  jobInfo: null, // 文书枚举的id
  writTypeEnumQueryValue: null,
  writTypeEnumPageNo : '1'
}
const mutations = {
  setCurrtaskComp: (store, payload) => {
    store.currtaskComp = payload.component
  },
  setJobInfo: (store, jobInfo) => {
    store.jobInfo = jobInfo
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
