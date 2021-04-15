import request from '@/utils/request'

// 自由裁量列表
export function getDiscretionList(data = {}) {
  return request({
    url: '/aj/discretion/list',
    method: 'POST',
    data
  })
}
// 修改自由裁量
export function saveOrUpdateDisc(data = {}) {
  return request({
    url: '/aj/discretion/saveOrUpdate',
    method: 'POST',
    data
  })
}
//自由裁量详情
export function discDetail(data = {}) {
  return request({
    url: '/aj/discretion/info',
    method: 'GET',
    params: data
  })
}
//删除自由裁量
export function deleteDisc(data = {}) {
  return request({
    url: '/aj/discretion/delete',
    method: 'GET',
    params: data
  })
}
//删除自由裁量细则
export function deleteRule(data = {}) {
  return request({
    url: '/aj/discretion/deleteRule',
    method: 'DELETE',
    params: data
  })
}
//删除自由裁量档次
export function deleteLevel(data = {}) {
  return request({
    url: '/aj/discretion/deleteLevel',
    method: 'DELETE',
    params: data
  })
}
//删除自由裁量档次-levelValue
export function deleteValue(data = {}) {
  return request({
    url: '/aj/discretion/deleteValue',
    method: 'DELETE',
    params: data
  })
}
//展示字典值
export function showDict(data = {}) {
  return request({
    url: '/aj/sys/sysdict/listTree',
    method: 'GET',
    params: data
  })
}
