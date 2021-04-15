import request from '@/utils/request'

// 获取集体讨论
export function getPenaltydiscList(data = {}) {
  return request({
    url: '/aj/penalty/penaltydisc/list',
    method: 'POST',
    data
  })
}

// 获取集体讨论
export function getPenaltydiscInfo(data = {}) {
  return request({
    url: '/aj/penalty/penaltydisc/info',
    method: 'GET',
    data
  })
}

// 结束集体讨论
export function penaltydiscComplete(data = {}) {
  return request({
    url: '/aj/penalty/penaltydisc/complete',
    method: 'GET',
    params: data
  })
}

// 集体讨论通知详情
export function getNoticeInfo(data = {}) {
  return request({
    url: '/aj/penalty/discussnotice/info',
    method: 'GET',
    params: data
  })
}

// 集体讨论通知发送
export function submitNotice(caseIds, data = {}) {
  return request({
    url: '/aj/penalty/discussnotice/saveOrUptBatch',
    method: 'POST',
    data,
    params: caseIds
  })
}
// 获取集体讨论会签列表
export function getGroupSignList(data = {}) {
  return request({
    url: '/aj/penalty/penaltydiscopinion/list',
    method: 'POST',
    data
  })
}
// 更新
export function getGroupSignUpdate(data = {}) {
  return request({
    url: '/aj/penalty/penaltydiscopinion/update',
    method: 'PUT',
    data
  })
}
// 新确认意见更新接口
export function getGroupOpinionUpdate(data = {}) {
  return request({
    url: '/aj/penalty/penaltydiscopinion/updateOpinion',
    method: 'PUT',
    data
  })
}
// 根据集体讨论id获取集体讨论文书列表
export function getGroupRecords(data = {}) {
  return request({
    url: '/aj/penalty/penaltydiscopinion/listOpinion',
    method: 'POST',
    params: data
  })
}
// 根据文书id查询意见
export function getOpinions(data = {}) {
  return request({
    url: '/aj/penalty/penaltydiscopinion/listOpinionByWritId',
    method: 'POST',
    params: data
  })
}
// 根据文书id查询签名
export function getSign(data = {}) {
  return request({
    url: '/aj/penalty/penaltydiscopinion/listSigns',
    method: 'POST',
    params: data
  })
}
// 派发文书确认
export function dispatch(data = {}) {
  return request({
    url: '/aj/penalty/penaltydiscopinion/submitOpinion',
    method: 'GET',
    params: data
  })
}
