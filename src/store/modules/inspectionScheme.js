const state = {
  inspectionSchemeList: false,
  inspectionCheckListCache: [],
  inspectionCheckList: [],
  planexamineId: '',
  keepCurrentPage: "",
}

const getters = {}

const mutations = {
  setInspectionCheckListCache: (state, nodeData) => { // 选中检查项缓存
    let node = nodeData.node
    let status = nodeData.status
    let pstatus = nodeData.pstatus
    let data = state.inspectionCheckListCache
    let existIndex = _.findIndex(data, ['id', node.id]) // 查询是否已有该记录
    if (!(existIndex === -1)) {
      if (!status && !pstatus) { // 有记录 传入取消选中 则删除
        _.pullAt(data, existIndex)
        data.push('')
        data.pop()
      }
    } else {
      if (status || pstatus) { // 无记录 传入选中 则添加
        data.push(node)
      }
    }
  },
  cloneToInspectionCheckListCache: (state, nodeData) => {
    state.inspectionCheckListCache = nodeData
  },
  setInspectionCheckList: (state, checkList) => { // 选中检查项
    state.inspectionCheckList = checkList
    state.inspectionCheckListCache = [] // 清空缓存
  },

  deleteInspectionCheckListCache: (state) => {
    state.inspectionCheckListCache = [];
  },
  deleteInspectionCheckList: (state) => {
    state.inspectionCheckList = [];
  },
  planexamineId: (state, msg) => {
    state.planexamineId = msg;
  },
  keepCurrentPage: (state, payload) => {
    state.keepCurrentPage = payload;
  },
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
