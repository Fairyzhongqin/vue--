import request from '@/utils/request'

// list页
export function planexamine (data = {}) {
  return request({
    url: '/aj/planexamine/list',
    method: 'POST',
    data
  })
}

export function delexamine (data = {}) { // 列表删除
  return request({
    url: '/aj/planexamine/delete',
    method: 'DELETE',

    params: data

  })
}

export function urge (data = {}) { // 提醒
  return request({
    url: '/aj/audit/urge',
    method: 'GET',
    params: data
  })
}
// editor
export function discretionList (data = {}) { // 检查项分类表
  return request({
    url: '/aj/sys/sysdict/list',
    method: 'POST',
    data
  })
}

export function listDiscByType (data = {}) { // 根据类型查询检查内容
  return request({
    url: '/aj/discretion/listDiscByType',
    method: 'POST',
    data
  })
}

export function saveBatch (data = {}) { // 保存检查方案（批量）
  return request({
    url: '/aj/planexamine/saveBatch',
    method: 'POST',
    data
  })
}

export function saveUpdate (data = {}) { // 保存检查方案（修改）
  return request({
    url: '/aj/planexamine/update',
    method: 'PUT',
    data
  })
}

export function submitReview (data = {}) { // 提交审核
  return request({
    url: '/aj/audit/commit',
    method: 'POST',
    data
  })
}

export function info (data = {}) { // 查看详情
  return request({
    url: '/aj/planexamine/info',
    method: 'GET',
    params: data
  })
}

export function getEnterpriseInfo (data = {}) { // 获取企业数据详情
  return request({
    url: '/aj/enterprise/enterprise/info',
    method: 'GET',
    params: data
  })
}

export function discretioncustomSave (data = {}) { // 保存常用检查项
  return request({
    url: '/aj/discretion/discretioncustom/save',
    method: 'POST',
    data
  })
}

export function discretioncustomDelete (data = {}) { // 删除常用检查项
  return request({
    url: '/aj/discretion/discretioncustom/delete',
    method: 'DELETE',
    params: data
  })
}

export function discretioncustomList (data = {}) { // 常用检查项（常用自由裁量）列表
  return request({
    url: '/aj/discretion/discretioncustom/list',
    method: 'POST',
    data
  })
}

// view 页
export function flow (data = {}) { // 流程信息
  return request({
    url: '/aj/audit/flow',
    method: 'GET',
    params: data
  })
}

export function delCheckItem (data = {}) { // 流程信息
  return request({
    url: '/aj/planexamine/deleteProb',
    method: 'DELETE',
    params: data
  })
}
