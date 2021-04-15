import request from '@/utils/request'

// 自由裁量系数类
// 获取自由裁量系数表格数据
export function getCoefficientOfDiscretionData(data = {}) {
  return request({
    url: '/aj/coefficient/list',
    method: 'POST',
    data
  })
}
// 删除自由材料系数表格数据
export function deleteData(data = {}) {
  return request({
    url: '/aj/coefficient/delete',
    method: 'DELETE',
    params: data
  })
}
// 新增自由裁量系数表格数据
export function saveData(data = {}) {
  return request({
    url: '/aj/coefficient/save',
    method: 'POST',
    data
  })
}
// 修改自由裁量系数表格数据
export function editData(data = {}) {
  return request({
    url: '/aj/coefficient/save',
    method: 'POST',
    data
  })
}

