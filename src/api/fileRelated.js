import request from '@/utils/request'

// 文书创建
export function createWrit (data = {}) {
  return request({
    url: '/aj/writ/createWrit',
    method: 'POST',
    data
  })
}

// 文书浏览
export function previewWrit (data = {}) {
  return request({
    url: '/aj/writ',
    method: 'GET',
    params: data
  })
}

// 文书删除
export function deleteWrit (data = {}) {
  return request({
    url: '/aj/writ/deleteById',
    method: 'DELETE',
    params: data
  })
}

// 删除文书附件
export function deleteFile (data = {}) {
  return request({
    url: '/aj/writ/deleteWritAccessory',
    method: 'POST',
    params: data
  })
}

// 删除案件移送书、案件撤销记录单、案件调查报告
export function deleteWritAndAccessory (data = {}) {
  return request({
    url: '/aj/penaltyAccessory/deleteWritAndAccessory',
    method: 'DELETE',
    params: data
  })
}

// 根据类型和id查询文书
export function getWritInfo (data = {}) {
  return request({
    url: '/aj/writ/getBySouIdAndType',
    method: 'POST',
    params: data
  })
}

// 获取案件调查相关文书
export function getInvesWrits (data = {}) {
  return request({
    url: '/aj/investCase/queryWritInfo',
    method: 'GET',
    params: data
  })
}

// 查询行政处罚告知相关文书
export function getPunishInform (data = {}) {
  return request({
    url: '/aj/penaltyWrit/queryXzcfInfo',
    method: 'GET',
    params: data
  })
}

// 查询行政处罚听证相关文书
export function getPunishHearing (data = {}) {
  return request({
    url: '/aj/penaltyWrit/queryXzcftzInfo',
    method: 'GET',
    params: data
  })
}

// 查询行政处罚决定相关文书
export function getPunishResolve (data = {}) {
  return request({
    url: '/aj/penaltyWrit/queryXzcfjdInfo',
    method: 'GET',
    params: data
  })
}

// 查询行政处罚执行相关文书
export function getPunishExecute (data = {}) {
  return request({
    url: '/aj/penaltyWrit/queryXzcfzxInfo',
    method: 'GET',
    params: data
  })
}

// 修改文书
export function updateWrit (id, data = {}) {
  return request({
    url: '/aj/writ/reCreateOrEditWrit',
    method: 'POST',
    data,
    params: id
  })
}

// 根据文书id查询文书数据
export function getWritDataByWritId (data = {}) {
  return request({
    url: '/aj/writ/getWritDataByWritId',
    method: 'GET',
    params: data
  })
}

// 文书提交盖章（工作台模块） && 承办人签字
export function sealWrit (data = {}) {
  return request({
    url: '/aj/writ/signWrit',
    method: 'POST',
    params: data
  })
}

// 示例表列表
export function examplelabelList (data = {}) {
  return request({
    url: '/aj/examplelabel/list',
    method: 'POST',
    params: data
  })
}

// 保存示例表
export function examplelabelSave (data = {}) {
  return request({
    url: '/aj/examplelabel/save',
    method: 'POST',
    data
  })
}

// 删除示例表
export function examplelabelDelete (data = {}) {
  return request({
    url: '/aj/examplelabel/delete',
    method: 'DELETE',
    params: data
  })
}

// 根据树节点数据查询文书列表
export function getWritByTree (data = {}) {
  return request({
    url: '/aj/writ/getWritByTree',
    method: 'GET',
    params: data
  })
}
// 上传文书附件
export function uploadOther (data = {}) {
  return request({
    url: '/aj/writ/uploadWritAccessory',
    method: 'POST',
    data
  })
}
// 查询文书状态
export function queryWritState (data = {}) {
  return request({
    url: '/aj/writ/getWritInfo',
    method: 'GET',
    params: data
  })
}
// 签名时登录
export function signLogin (data = {}) {
  return request({
    url: '/aj/writ/login',
    method: 'POST',
    data
  })
}

