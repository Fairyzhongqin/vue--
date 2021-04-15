import request from '@/utils/request'

//保存或修改系统用户
export function saveUser(data = {}) {
    return request({
      url: '/aj/sys/sysuser/saveOrupdate',
      method: 'POST',
      data
    })
  }

//查看角色列表
export function showUserList(data = {}) {
  return request({
    url: '/aj/sys/sysrole/list',
    method: 'POST',
    data
  })
}

//系统用户详情
export function detailUserList(data = {}) {
  return request({
    url: '/aj/sys/sysuser/info',
    method: 'GET',
    params: data
  })
}
//删除系统用户
export function deleteUserList(data = {}) {
  return request({
    url: '/aj/sys/sysuser/delete',
    method: 'DELETE',
    params: data
  })
}
//授权
export function toGrant(data = {}) {
  return request({
    url: '/aj/sys/sysuser/addRole',
    method: 'POST',
    data
  })
}
//获取签章图片
export function showSignature(data = {}) {
  return request({
    url: '/aj/sign/getSignByUserId',
    method: 'GET',
    params: data
  })
}
//签章删除
export function deleteSignature(data = {}) {
  return request({
    url: '/aj/sign/delete',
    method: 'DELETE',
    params: data
  })
}
//签章上传
export function upLoadSignature(data = {}) {
  return request({
    url: '/aj/sign/upload',
    method: 'POST',
    data
  })
}

//重置密码
export function initPsw(data = {}) {
  return request({
    url: '/aj/sys/sysuser/initPsw',
    method: 'GET',
    params: data
  })
}
