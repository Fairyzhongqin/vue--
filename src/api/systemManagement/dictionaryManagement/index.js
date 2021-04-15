import request from '@/utils/request'

// 获取表格数据
export function getDictionaryData(data = {}) {
  return request({
    url: '/aj/sys/sysdict/list',
    method: 'POST',
    data
  })
}
// 删除字典数据
export function deleteDictionaryData(data = {}) {
  return request({
    url: '/aj/sys/sysdict/saveOrUpdate',
    method: 'POST',
    data
  })
}
// 新增字典数据
export function addDictionaryData(data = {}) {
  return request({
    url: '/aj/sys/sysdict/saveOrUpdate',
    method: 'POST',
    data
  })
}
// 修改字典数据
export function editDictionaryData(data = {}) {
  return request({
    url: '/aj/sys/sysdict/saveOrUpdate',
    method: 'POST',
    data
  })
}
// 获取字典类型
export function getDictionaryType(data = {}) {
  return request({
    url: '/aj/sys/devdatatype/dictlist',
    method: 'POST',
    data
  })
}

