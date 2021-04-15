import request from '@/utils/request'

// 获取表格数据
export function getTableList(data = {}) {
  return request({
    url: '/aj/enterprise/enterprise/list',
    method: 'POST',
    data
  })
}

// 获取数据详情
export function getDataInfo(data = {}) {
  return request({
    url: '/aj/enterprise/enterprise/info',
    method: 'GET',
    params: data
  })
}

// 保存
export function saveData(data = {}) {
  return request({
    url: '/aj/enterprise/enterprise/save',
    method: 'POST',
    data
  })
}

// 获取监管类型
export function getJglx(data = {}) {
  return request({
    url: '/aj/sys/devdata/getAllSupervisionIndustryTypes',
    method: 'GET',
    params: data
  })
}

// 获取下拉框数据
export function getOptions(data = {}) {
  return request({
    url: '/aj/sys/devdata/listByType',
    method: 'GET',
    params: data
  })
}

// 更新启用状态
export function updateStateFunc(data = {}) {
  return request({
    url: '/aj/enterprise/enterprise/update',
    method: 'PUT',
    data
  })
}

// 补录检查方案
export function supplementPlan(data = {}) {
  return request({
    url: '/aj/planexamine/savePlanByEid',
    method: 'GET',
    params: data
  })
}

// 附件上传
export function upload(data = {}) {
  return request({
    url: '/aj/planexamine/upload',
    method: 'POST',
    data
  })
}
