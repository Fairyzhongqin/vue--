const state = {
  showOrgList: false, // 选择部门弹窗
  showComList: false, // 选择企业弹窗
  showExample: false, // 选择检查情况弹窗
  showPeopleList: false, // 选择执法人员弹窗
  inspectionCurrentComponent: 'inspectionList', // 新增现场检查当前的组件
  newInspectionCanOper: false, // 新增现场检查能否操作转的操作
  routeInspectionId: null,
  routeSchemeId: null,
  statusFromMeasureForm: true,//责令限期整改必填校验
  detailVal:"",
  valFlag:"",//现场检查进入检查的标识
  detailFromRecords:false,//是否是从现场检查记录点击详情的操作
  keepInEnterprise:true,//确保在企业列表页展示
  checkSource: false // 现场检查记录是否来自检查方案
}

const mutations = {
  SET_KEEP_IN_ENTERPRISE: (state,status) => {
    state.keepInEnterprise = status
  },
  setNewInspectionShow: (state, payload) => {
    state.newInspectionShow = !state.newInspectionShow;
  },
  setPunishShow: (state, payload) => {
    state.punishShow = !state.punishShow
  },
  setComDialog: (state, payload) => {
    state.showComList = !state.showComList
  },
  setOrgDialog: (state, payload) => {
    state.showOrgList = !state.showOrgList
  },
  setExampleDialog: (state, payload) => {
    state.showExample = !state.showExample
  },
  setInspectionCurrentComponent: (state, payload) => {
    state.inspectionCurrentComponent = payload;
  },
  setPeopleDialog: (state, payload) => {
    state.showPeopleList = !state.showPeopleList;
  },
  setNewInspectionCanOper: (state, payload) => {
    state.newInspectionCanOper = payload;
  },
  setRouteInspectionId: (state, payload) => {
    state.routeInspectionId = payload
  },
  setRouteSchemeId: (state, payload) => {
    state.routeSchemeId = payload;
  },
  setStatusFromMeasure: (state, payload) => {
    state.statusFromMeasureForm = payload;
  },
  setDetailFromRecords: (state, status) => {
    state.detailFromRecords = status;
  },
  setCheckFlag:(state,valFlag)=>{
    state.valFlag = valFlag
  },
  Identification:(state,detailVal) =>{
    state.detailVal = detailVal
  },
  setCheckSource: (state, payload) => {
    state.checkSource = payload
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