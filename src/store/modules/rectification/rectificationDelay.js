const state = {
  newRectificationDelayShow: false,
  delayDetailId: '',
  delayExecutorId: '',
  delayFlag: '',
  delayDataId: null,
  delayCompanyId: null,
  delayPerson: null,
  delayPersonName: null,
  delayCompanyName: null,
  delayStartTime: null,
  newDelayStatus: false,//延期功能页面显示状态
  newDelayArr: [],//延期页面 检查项的id数组数据
  newReviewId: "",//延期整改复查详情id
  newReviewFlag: "",//延期整改复查详情flag
}

const getters = {
}

const mutations = {
  setNewRectificationDelayShow: (state, boolean) => {
    state.newRectificationDelayShow = boolean === false ? boolean : !state.newRectificationDelayShow
  },
  SET_NEW_DELAY_STATUS: (state, payload) => {
    state.newDelayStatus = !state.newDelayStatus
  },
  SET_NEW_DELAY_ARR: (state, payload) => {
    state.newDelayArr = payload
  },
  setDetailIded: (state, { executorId, flag, id, delayCompanyId, delayPerson, delayPersonName, delayCompanyName, delayStartTime }) => {
    state.delayExecutorId = executorId
    state.delayFlag = flag
    state.delayDataId = id;
    state.delayCompanyId = delayCompanyId;
    state.delayPerson = delayPerson;
    state.delayStartTime = delayStartTime;
    state.delayPersonName = delayPersonName;
    state.delayCompanyName = delayCompanyName;
  },
  SET_NEW_REVIEW_STATUS: (state, { id, flag }) => {
    state.newReviewId = id
    state.newReviewflag = flag
  }
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
