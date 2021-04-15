import request from '@/utils/request';

export function login (data) {
  return request({
    url: '/aj/main/web/login',
    method: 'post',
    data
  })
}

export function ajsyssysmenulist(data) {
  return request({
    url: '/aj/sys/sysmenu/list',
    method: 'post',
    data
  })
}

export function updatePassword(data = {}) {
  return request({
    url: '/aj/sys/sysuser/updatePsw',
    method: 'post',
    data
  })
}

export function logoutSystem() {
  return request({
    url: '/aj/main/web/logout',
    method: 'post'
  })
}

export function checkPwd(data) {
  return request({
    url: '/aj/sys/sysuser/checkInitPsw',
    method: 'post',
    data
  })
}

// 获取所有文书类型信息
export function getWritTypeInfo(data = {}) {
  return request({
    url: '/aj/writ/writtypeenum/getAllWritType',
    method: 'POST',
    data
  })
}

// url登录
export function transferLogin(data = {}) {
  return request({
    url: 'aj/transfer/login',
    method: 'GET',
    params: data
  })
}

