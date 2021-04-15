import request from '@/utils/request';

// 获取安全生产统计表
export function getAQSCData(data = {}) {
  return request({
    url: '/aj/statAnaly/thirdTableStat',
    method: 'POST',
    data
  })
}
// 获取执法检查情况统计表(部门)
export function getZFJCQKData(data = {}) {
  return request({
    url: '/aj/statAnaly/firstTableStat',
    method: 'POST',
    data
  })
}
// 获取执法检查情况统计表(监管行业)
export function getPenaltyInspData(data = {}) {
  return request({
    url: '/aj/statAnaly/statSupervise',
    method: 'POST',
    data
  })
}
// 获取案由统计统计表
export function getAYTJData(data = {}) {
  return request({
    url: '/aj/stat/caseReason',
    method: 'POST',
    data
  })
}
// 获取首页统计表
export function getHomePageData(data = {}) {
  return request({
    url: '/aj/stat/indexStat',
    method: 'POST',
    data
  })
}
// 导出 全省安全生产执法情况季度统计表
export function exportPenaltyWorkData(data = {}) {
  return request({
    url: '/aj/statAnaly/exportThirdTableStat',
    method: 'POST',
    data,
    responseType: "arraybuffer"
  })
}
// 导出案由统计统计表
export function exportCaseReasonData(data = {}) {
  return request({
    url: '/aj/stat/exportCaseReason',
    method: 'POST',
    data,
    responseType: "arraybuffer"
  })
}
// 导出执法检查情况统计表(部门)
export function exportExamineStatData(data = {}) {
  return request({
    url: '/aj/statAnaly/exportFirstTableStat',
    method: 'POST',
    data,
    responseType: "arraybuffer"
  })
}
// 导出执法检查情况统计表(监管行业)
export function exportPenaltyInspByClass(data = {}) {
  return request({
    url: '/aj/statAnaly/exportStatSupervise',
    method: 'POST',
    data,
    responseType: "arraybuffer"
  })
}
// 企业列表弹出框详情  isGreat 不传：实际检查企业列表 1：检查规上企业列表
export function inspectExamineList(isGreat, data = {}) {
  return request({
    url: '/aj/stat/inspectExamineList',
    method: 'POST',
    params: isGreat,
    data

  })
}
// 隐患数列表弹出框详情  
export function listDangeExamine(data = {}) {
  return request({
    url: '/aj/stat/listDangeExamine',
    method: 'POST',
    data
  })
}
// 现场检查列表弹出框详情  
export function examineList(data = {}) {
  return request({
    url: '/aj/stat/examineList',
    method: 'POST',
    data
  })
}
// 检查方案列表弹出框详情  
export function planExamineList(data = {}) {
  return request({
    url: '/aj/stat/planExamineList',
    method: 'POST',
    data
  })
}
// 立案列表弹出框详情  不传 立案列表 0 事故立案列表 1事前立案列表 2事前5万元以上立案列表 3 结案数
export function penaltyList(itemValue, data = {}) {
  return request({
    url: '/aj/stat/penaltyList',
    method: 'POST',
    params: itemValue,
    data
  })
}
// 处罚执行列表弹出框详情  1申请强制 不传 自动履行
export function listQZPenalty(isQz, data = {}) {
  return request({
    url: '/aj/stat/listQZPenalty',
    method: 'POST',
    params: isQz,
    data
  })
}
// 简易程序列表弹出框详情
export function listSimpleP({ }, data = {}) {
  return request({
    url: '/aj/stat/listSimpleP',
    method: 'POST',
    data
  })
}
// 听证程序列表弹出框详情
export function listHearing({ }, data = {}) {
  return request({
    url: '/aj/stat/listHearing',
    method: 'POST',
    data
  })
}
// 案由列表弹出框详情
export function caseReasonList(itemValue, data = {}) {
  return request({
    url: '/aj/stat/caseReasonList',
    method: 'POST',
    params: itemValue,
    data
  })
}
// 复查企业列表弹出框详情
export function listReviewCompany({ }, data = {}) {
  return request({
    url: '/aj/stat/listReviewCompany',
    method: 'POST',
    data
  })
}