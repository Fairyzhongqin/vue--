import request from '@/utils/request'
//菜单树
export function menuTree(data = {}) {
    return request({
      url: '/aj/sys/sysmenu/tree',
      method: 'POST',
      data
    })
  }
//保存或者修改菜单
export function saveMenu(data = {}) {
    return request({
      url: '/aj/sys/sysmenu/saveOrUpdate',
      method: 'POST',
      data
    })
  }
//删除菜单
export function deleteMenu(data = {}) {
    return request({
      url: '/aj/sys/sysmenu/delete',
      method: 'DELETE',
      params: data
    })
  }
//菜单详情
export function detailMenu(data = {}) {
    return request({
      url: '/aj/sys/sysmenu/info',
      method: 'GET',
      params: data
    })
  }