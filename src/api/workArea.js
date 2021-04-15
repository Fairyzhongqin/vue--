import request from '@/utils/request'

// 获取待办列表
export function getTodoList(data) {
  return request({
    url: '/aj/audit/toDoWithCondition',
    method: 'POST',
    data
  })
}

// 获取已办列表
export function getDoneList(data) {
  return request({
    url: '/aj/audit/doneWithCondition',
    method: 'POST',
    data
  })
}

// 获取待办流程
export function getTodoProcedure(data) {
  return request({
    url: '/aj/audit/flow',
    method: 'GET',
    params: data
  })
}

// 提交审核审批信息
export function submitTodoInfo(data) {
  return request({
    url: '/aj/audit/handle',
    method: 'POST',
    data
  })
}

// 法规提交审批信息
export function submitLawInfo(data) {
  return request({
    url: '/aj/audit/handlePenalty',
    method: 'POST',
    data
  })
}

// 提交文书盖章信息
export function submitSignWrit(data) {
  return request({
    url: '/aj/writ/signWrit',
    method: 'POST',
    params: data
  })
}

// 获取工作台现场检查，一般行政处罚数量
export function todoNum(data) {
  return request({
    url: '/aj/work/cnt',
    method: 'GET',
    params: data
  })
}

// 获取签名/盖章状态
export function getSealState(data) {
  return request({
    url: '/aj/audit/getAuditBoInfoByTaskId',
    method: 'GET',
    params: data
  })
}