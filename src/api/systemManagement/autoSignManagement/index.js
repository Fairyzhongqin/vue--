import request from '@/utils/request'

// 初始化数据库公章数据
export function initSignDataToTable (data = {}) {
  return request({
    url: '/aj/af/autoSign/initSignDataToTable',
    method: 'GET'
  })
}

// 获取初始化的公章数据列表
export function listSignDataTable (data = {}) {
  return request({
    url: '/aj/af/autoSign/listSignDataTable',
    method: 'POST',
    data
  })
}
// 保存
export function addSignData (data = {}) {
  return request({
    url: '/aj/sign/save',
    method: 'POST',
    data
  })
}

