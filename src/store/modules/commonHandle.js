const state = {
  showComList: false,
  currentComponent: 'generalPenalties',
  penalty: {}, // 案件详情
  processes: null,
  processesTypes: [],
  processesNames: [],
  showCauseList: false,
  showContractorList: false,
  from: null, // 从何处跳转至新增立案页面 null 列表  'lianshenpi' 立案审批
  showExample: false,
  isPenaltyInfoUpdated: false, // 当前流程的案件信息是否已修改
  createdOnceMore: false, // 立案审批是否重新制作了
  scrollTop: 0, // 页面滚动高度
  currentCompreComponent: '',
  moduleId: '' // 电子卷宗所需 id 
}

const mutations = {
  updateFrom: (state, from) => {
    state.from = from
  },
  setModuleId: (state, payload) => {
    state.moduleId = payload
  },
  setComDialog: (state, payload) => {
    state.showComList = !state.showComList
  },
  setCauseDialog: (state, payload) => {
    state.showCauseList = !state.showCauseList
  },
  setPeopleDialog: (state, payload) => {
    state.showContractorList = !state.showContractorList
  },
  setExampleDialog: (state, payload) => {
    state.showExample = !state.showExample
  },
  setCurrentComponent: (state, payload) => { // 设置当前组件（一般行政处罚处）
    state.currentComponent = payload
  },
  setPenalty: (state, penalty) => {
    // 一般行政处罚跳转流程时 & 修改行政处罚 & 行政处罚详情 相应 case
    state.penalty = penalty
  },
  setIsPenaltyInfoUpdated: (state, bool) => { // 一般行政处罚详情是否修改
    state.isPenaltyInfoUpdated = bool
  },
  setCreatedOnceMore: (state, bool) => { // 立案审批表是否再次被创建
    state.createdOnceMore = bool
  },
  updScrollTop: (state, val) => {
    state.scrollTop = val
  },
  setCurrProcesses: (state, processes) => {
    if (processes.length === 0) { // 流程结束
      state.processesTypes = ['GAME OVER']
      return
    }
    let preMapped = []
    state.processesTypes = []
    state.processesNames = []
    processes.map(process => {
      preMapped.push([process.processType, JSON.stringify(process.myTaskList)]) // 一级数据（大节点） 类型 对应的任务数组
      state.processesTypes.push(process.processType) // 一级数据（大节点） 类型
      state.processesNames.push(process.activiName) // 当前所到节点（大节点 或 小节点） 名称
    })
    state.processes = new Map(preMapped)
  },
  setCompreComponent: (state, val) => {
    state.currentCompreComponent = val.treeCode
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
