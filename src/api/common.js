import request from '@/utils/request'

// 结束我的待办
export function finishPro(data = {}) {
  return request({
    url: '/aj/activiti/complete',
    method: 'POST',
    data
  })
}

// 当前登录人的信息
export function individualInfo() {
  return request({
    url: '/aj/sys/sysuser/queryLoginUserInfo',
    method: 'GET'
  })
}

// 根据id获取用户信息
export function getUserInfoById(data = {}) {
  return request({
    url: '/aj/sys/sysuser/info',
    method: 'GET',
    params: data
  })
}

// 一般行政处罚 法制审核（提交法制审核处即需提交）
export function legalAudit(data = {}) {
  return request({
    url: '/aj/audit/commitPenalty',
    method: 'POST',
    data
  })
}

// 一般行政处罚 法制预审
export function legalPreAudit(data = {}) {
  return request({
    url: '/aj/audit/commitFzysAudit',
    method: 'POST',
    data
  })
}

// 盖章提交审核
export function sealAudit(data = {}) {
  return request({
    url: '/aj/audit/commit',
    method: 'POST',
    data
  })
}

// 工作台 提交法制预审 审核 
export function submitToPreAudit(data = {}) {
  return request({
    url: '/aj/audit/handleFzysAudit',
    method: 'POST',
    data
  })
}

// 盖章 及 提交审核 审核审批流程信息
export function sealAuditStatus(data = {}) {
  return request({
    url: '/aj/audit/flow',
    method: 'GET',
    params: data
  })
}

// 法制审核流程
export function legalAuditStatus(data = {}) {
  return request({
    url: '/aj/audit/fzFlow',
    method: 'GET',
    params: data
  })
}
// 附件下载
export function downloadFile(data = {}) {
  return request({
    url: '/aj/writ/accessory/download',
    method: 'GET',
    params: data
  })
}

// 附件删除 处罚裁量
export function deleteFile(data = {}) {
  return request({
    url: '/aj/writ/accessory/deleteByIds',
    method: 'GET',
    params: data
  })
}

// 根据id查询数据字典表详情
export function querySysDictById(data = {}) {
  return request({
    url: '/aj/sys/sysdict/info',
    method: 'GET',
    params: data
  })
}

// 签章删除
export function deleteSeal(data = {}) {
  return request({
    url: '/aj/sign/delete',
    method: 'DELETE',
    params: data
  })
}

// 签章上传
export function uploadSeal(data = {}) {
  return request({
    url: '/aj/sign/upload',
    method: 'post',
    data
  })
}

//获取签章图片
export function showSignature(data = {}) {
  return request({
    url: '/aj/sign/getSignByUserId',
    method: 'GET',
    params: data
  })
}

//获取签章图片
export function downSeal(data = {}) {
  return request({
    url: '/aj/sign/download',
    method: 'GET',
    params: data
  })
}

// 消息已读
export function readMsg(data = {}) {
  return request({
    url: '/aj/message/messageremind/markSigleMsg',
    method: 'GET',
    params: data
  })
}

// 获取未读消息列表
export function getNotReadMsg(data = {}) {
  return request({
    url: '/aj/message/messageremind/unReadlist',
    method: 'POST',
    data
  })
}

// 从字典表获取数据
export function getDicData(data = {}) {
  return request({
    url: '/aj/sys/sysdict/list',
    method: 'POST',
    data
  })
}

// 新增自定义检查项
export function addCustomExamine(data = {}) {
  return request({
    url: '/aj/examineInfo/discretionmenu/save',
    method: 'POST',
    data
  })
}

// 获取自定义检查项列表
export function getCusExamineList(data = {}) {
  return request({
    url: '/aj/examineInfo/discretionmenu/list',
    method: 'POST',
    data
  })
}

// 消息提醒一键已读
export function readAllMsg() {
  return request({
    url: '/aj/message/messageremind/markBatchMsg',
    method: 'POST'
  })
}

