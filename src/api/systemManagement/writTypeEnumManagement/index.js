import request from '@/utils/request'

// 获取所有的文书数据
export function getWritTypeEnumLst (data = {}) {
  return request({
    url: '/aj/writ/writtypeenum/list',
    method: 'POST',
    data
  })
}
// 新增或者修改文书数据
export function saveOrUpdate (data = {}) {
  return request({
    url: '/aj/writ/writtypeenum/saveOrUpdate',
    method: 'POST',
    data
  })
}

// 获取详情
export function info (data = {}) {
  return request({
    url: '/aj/writ/writtypeenum/info',
    method: 'GET',
    params: data
  })
}

// 获取所有的方案信息
export function listBackup (data = {}) {
  return request({
    url: '/aj/writ/writtypeenum/listBackup',
    method: 'POST',
    data
  })
}

// 激活某个方案
export function activeBackup (data = {}) {
  return request({
    url: '/aj/writ/writtypeenum/activeBackup',
    method: 'GET',
    params: data
  })
}

// 新建或者修改方案
export function saveOrUptBU (data = {}) {
  return request({
    url: '/aj/writ/writtypeenum/saveOrUptBU',
    method: 'POST',
    data
  })
}

// 删除方案
export function deleteBackup (data = {}) {
  return request({
    url: '/aj/writ/writtypeenum/deleteBackup',
    method: 'DELETE',
    params: data
  })
}
