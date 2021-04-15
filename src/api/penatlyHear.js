import request from '@/utils/request'

// 获取组织听证列表
export function getPenaltyhearList (data = {}) {
  return request({
    url: '/aj/penalty/penaltyhear/list',
    method: 'POST',
    data
  })
}

// 组织听证详情
export function getPenaltyhearinfo (data = {}) {
  return request({
    url: '/aj/penalty/penaltyhear/info',
    method: 'GET',
    params: data
  })
}

// 结束听证

export function penaltyhearComplete (data = {}) {
  return request({
    url: '/aj/penalty/penaltyhear/complete',
    method: 'GET',
    params: data
  })
}

// 是否提交过听证
export function isSaveHeaar (data = {}) {
  return request({
    url: '/aj/penalty/penaltyhear/isSaveHeaar',
    method: 'GET',
    params: data
  })
}