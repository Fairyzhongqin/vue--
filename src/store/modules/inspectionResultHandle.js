const state = {
  tableId: '',
  InfoId:'',
  tableHeadInfo: '',
  inspectionResultComponent: 'isList',
  legalInfoMap: new Map(),
  chanSuggestion: new Map(),
  searchListchange: {},
  searchcurrPagechange:1,
  showMulitList: true,
  showSimplePenality: false,
  simpleId: '',
  businessAddressFull: '',//企业地址
  postalCode: '',//企业邮编
}

const mutations = {
  // GET行政处罚-简易程序文书列表所需id
  setSimpleId: (state, payload) => {
    state.simpleId = payload;
  },
  setInspectionResultComponent: (state, payload) => {
    state.inspectionResultComponent = payload;
  },
  // 保存id
  setTableId: (state, tableId) => {
    state.tableId = tableId
  },
  setInfoId:(state,InfoId)=>{
    state.InfoId = InfoId
  },
  // 保存多选部分头部表格信息
  settableHeadInfo: (state, tableHeadInfo) => {
    state.tableHeadInfo = tableHeadInfo
  },
  setSelectedValue: (state, { id, content, code }) => {
    // console.log(id, content,code)
    state.legalInfoMap.set(id, { content, code })
  },
  setchanSuggestion: (state, payload) => {
    state.chanSuggestion.set(payload.id, payload.content)
  },
  // 保存searchList
  setsearchList: (state, payload) => {
    state.searchListchange = payload;
  },
  //保存currpage
  setcurrPage:(state,payload) =>{
    state.searchcurrPagechange = payload;
  },
  // 控制mutliList展示与否
  setShowMulitList: (state, payload) => {
    state.showMulitList = !state.showMulitList;
  },
  // 控制简易行政处罚展示与否
  setShowSimplePenality: (state, payload) => {
    state.showSimplePenality = !state.showSimplePenality;
  },
  setbusinessAddressFull: (state, payload) => {
    state.businessAddressFull = payload
  },
  setpostalCode: (state, payload) => {
    state.postalCode = payload
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