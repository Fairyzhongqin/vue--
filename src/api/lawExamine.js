import request from '@/utils/request'

// 法制审核列表
export function getExamineList (data = {}) {
  return request({
    url: '/aj/penalty/penaltyillage/list',
    method: 'POST',
    data
  })
}

// 法制审核列表详情
export function getExamineInfo (data = {}) {
  return request({
    url: '/aj/penalty/penaltyillage/info',
    method: 'GET',
    data
  })
}

// 保存组织听证
export function savePenaltyHear (data = {}) {
  return request({
    url: '/aj/penalty/penaltyhear/save',
    method: 'POST',
    data
  })
}
// 法制审核
export function handlePenalty (data = {}) {
  return request({
    url: '/aj/audit/handlePenalty',
    method: 'POST',
    data
  })
}

// 结束集体讨论
export function endGroupDiscuss (data = {}) {
  return request({
    url: '/aj/penalty/penaltydisc/complete',
    method: 'GET',
    params: data
  })
}

// 结束集体讨论 (偷懒用的)
export function endGroupDiscussLazy (data = {}) {
  return request({
    url: '/aj/penalty/penaltydisc/finish',
    method: 'GET',
    params: data
  })
}

// 法审的虚拟节点是否盖章
export function isFGVirtualSign (data ={}) {
  return request({
    url: '/aj/audit/isFGVirtualSign',
    method: 'GET',
    params: data
  })
}

// 是否要展示 不发集体讨论的选项
export function passJjtlchoice (data ={}) {
  return request({
    url: '/aj/audit/passJjtlchoice',
    method: 'GET',
    params: data
  })
}
