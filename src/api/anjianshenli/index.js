// 案件审理相关接口
import request from '@/utils/request'

// 新增或修改立案处罚裁量记录
export function saveOrUpdateCriteria(data = {}) {
  return request({
    url: '/aj/laDiscretion/saveOrUpdate',
    method: 'POST',
    data
  })
}

// 删除立案处罚裁量记录
export function deleteCriteria(data = {}) {
  return request({
    url: '/aj/laDiscretion/delete',
    method: 'GET',
    params: data
  })
}

// 查询立案处罚裁量关联记录
export function getCriteria(data = {}) {
  return request({
    url: '/aj/laDiscretion/info',
    method: 'POST',
    data
  })
}

// 获取当前案件的处罚信息
export function getCritBasicInfo(data = {}) {
  return request({
    url: '/aj/laDiscretion/getLaInfo',
    method: 'GET',
    params: data
  })
}

// 查询自由裁量系数列表
export function getFactors(data) {
  return request({
    url: '/aj/coefficient/list',
    method: 'POST',
    data
  })
}

// 行政处罚 - 查询附件证据
export function getFile(data = {}) {
  return request({
    url: '/aj/penaltyAccessory/queryAccessory',
    method: 'POST',
    data
  })
}

// 行政处罚 - 删除附件证据
export function delFile(data = {}) {
  return request({
    url: '/aj/penaltyAccessory/deleteAccessory',
    method: 'POST',
    data
  })
}

// 案件审理 - 获取组织听证相关文书
export function getGroDisWrit(data = {}) {
  return request({
    url: '/aj/penalty/penaltyhear/getPHs',
    method: 'GET',
    params: data
  })
}