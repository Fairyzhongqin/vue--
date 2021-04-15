import request from '@/utils/request'

//展示角色列表
export function showRoleList(data = {}) {
    return request({
      url: '/aj/sys/sysrole/list',
      method: 'POST',
      data
    })
  }

//角色详情
export function detailRole(data = {}) {
    return request({
      url: '/aj/sys/sysrole/info',
      method: 'GET',
      params: data
    })
  }
//保存或者修改角色
export function saveRole(data = {}) {
    return request({
      url: '/aj/sys/sysrole/saveOrUpdate',
      method: 'POST',
      data
    })
  }
//删除角色
export function deleteRole(data = {}) {
    return request({
      url: '/aj/sys/sysrole/delete',
      method: 'DELETE',
      params: data
    })
  }
//菜单树
export function menuTree(data = {}) {
  return request({
    url: '/aj/sys/sysmenu/tree',
    method: 'POST',
    data
  })
}
