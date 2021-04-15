import request from '@/utils/request'
// 立案登记增加
export function addFilingRegister(data = {}) {
  return request({
    url: '/aj/penalty/add',
    method: 'POST',
    data
  })
}

// 展示立案登记记录列表
export function showFilingRegister(data = {}) {
  return request({
    url: '/aj/penalty/list',
    method: 'POST',
    data
  })
}
// 获取详情
export function getFilingRegister(data) {
  return request({
    url: '/aj/penalty/info',
    method: 'GET',
    params: data
  })
}
//删除单个立案登记记录
export function delFilingRegister(data) {
  return request({
    url: '/aj/penalty/del',
    method: 'GET',
    params: data
  })
}
//展示案件状态
export function showCaseStatus(data = {}) {
  return request({
    url: '/aj/sys/sysdict/list',
    method: 'POST',
    data
  })
}
// 当前流程及待办事项
export function getCurrentProcess(data = {}) {
  return request({
    url: '/aj/penalty/findHistoryStatus',
    method: 'GET',
    params: data
  })
}
//启动行政处罚流程
export function kindleCaseProcess(data = {}) {
  return request({
    url: '/aj/penalty/startProcessInstance',
    method: 'POST',
    data
  })
}

// 修改立案登記
export function updateFilingRegister(data = {}) {
  return request({
    url: '/aj/penalty/update',
    method: 'POST',
    data
  })
}

// 删除违法记录
export function delLawCase(data = {}) {
  return request({
    url: '/aj/penalty/delLawCase',
    method: 'GET',
    params: data
  })
}

// 删除新增立案处附件
export function delProof(data = {}) {
  return request({
    url: '/aj/penalty/delAccessory',
    method: 'DELETE',
    params: data
  })
}
