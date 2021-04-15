const state = {
  // newRectificationShow: false,
  rectificationCurrentComponent: 'rectificationList',
  detailId: '',
  flag: '',
  totalData: '',
  lineDataMsg: '',
  isRectificationWrit: undefined,
  currentReview: '', // 当前页面的整改复查组件
  // currentReviewState: true
  innerReviewComponent: 'InnerReviewList',
  actsFromCheckAgain: [],//整改复查转简易行政处罚的违法信息
  // actsFromCheckAgainDelay:[],//延期整改复查转简易行政处罚的违法信息
  reloadListFlag: false // 钩子触发整改复查本查的列表加载，需要主动加载
}

const getters = {
}

const mutations = {
  setRectificationCurrentComponent: (state, payload) => {
    state.rectificationCurrentComponent = payload
    state.currentReview = payload
  },
  resetReloadList:(state, payload)=> {
    state.reloadListFlag = payload
  },
  setInnerReviewComponent: (state, payload) => {
    state.innerReviewComponent = payload
    state.currentReview = payload
  },
  setDetailId: (state, { id, flag, isRectificationWrit }) => {
    state.detailId = id
    state.flag = flag
    state.isRectificationWrit = isRectificationWrit
  },
  setInfo: (state, totalData) => {
    state.totalData = totalData
  },
  setMsg: (state, lineDataMsg) => {
    state.lineDataMsg = lineDataMsg
  },
  // getCurrentReview: (state, payload) => {
  //   state.currentReviewState = payload;
  // }
  SET_ACTS_FROM_CHECK_AGAIN: (state, actsFromCheckAgain) => {
    state.actsFromCheckAgain = actsFromCheckAgain
  },
  /*  SET_ACTS_FROM_CHECK_AGAIN_DELAY:(state,actsFromCheckAgainDelay) => {
     state.actsFromCheckAgainDelay = actsFromCheckAgainDelay
   }, */
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
