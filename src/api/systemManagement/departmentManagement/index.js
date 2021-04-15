import request from '@/utils/request'

//部门树
export function departmentTree(data = {}) {
    return request({
      url: '/aj/sys/sysdept/tree',
      method: 'POST',
      data
    })
  }
//保存部门管理
export function saveDepartment(data = {}) {
    return request({
      url: '/aj/sys/sysdept/saveOrUpdate',
      method: 'POST',
      data
    })
  }
//删除部门管理
export function deleteDepartment(data = {}) {
    return request({
      url: '/aj/sys/sysdept/delete',
      method: 'DELETE',
      params: data
    })
  }
//部门管理详情
export function detailDepartment(data = {}) {
    return request({
      url: '/aj/sys/sysdept/info',
      method: 'GET',
      params: data
    })
  }