import request from '@/utils/request'

//展示参数列表
export function getPamameterList(data = {}) {
  return request({
    url: '/aj/sys/sysconfig/list',
    method: 'POST',
    data
  })
}
//删除参数数据
export function deleteParameterData(data = {}) {
  return request({
    url: '/aj/sys/sysconfig/saveOrUpdate',
    method: 'POST',
   data
  })
}
//新增参数数据
export function addParameterData(data = {}) {
  return request({
    url: '/aj/sys/sysconfig/saveOrUpdate',
    method: 'POST',
   data
  })
}

//修改参数数据
export function editParameterData(data = {}) {
  return request({
    url: '/aj/sys/sysconfig/saveOrUpdate',
    method: 'POST',
   data
  })
}