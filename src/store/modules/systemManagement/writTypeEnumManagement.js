const state = {
  currWritTypeEnumComp: 'dataDisplay',
  writTypeEnumId: '', // 文书枚举的id
  writTypeEnumQueryValue: null,
  writTypeEnumPageNo : '1'
}
const mutations = {
  setCurrWritTypeEnumComp: (store, payload) => {
    store.currWritTypeEnumComp = payload.component
  },
  setWritTypeEnumId: (store, payload) => {
    store.writTypeEnumId = payload.writTypeEnumId
  },
  setWritTypeEnumPageNo: (store, payload) => {
    store.writTypeEnumPageNo = payload.writTypeEnumPageNo
  },
  setWritTypeEnumQueryValue: (store, payload) => {
    store.writTypeEnumQueryValue = payload
  },
  setDiscreQueryPage: (store, payload) => {
    store.writTypeEnumQueryValue.page = payload
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
