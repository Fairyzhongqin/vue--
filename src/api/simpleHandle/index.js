import request from '@/utils/request'
//展示简易程序列表
export function showSimpleHandleList(data = {}) {
    return request({
      url: '/aj/penaltysimple/list',
      method: 'POST',
      data
    })
  }

//展示简易程序详情
export function simpleHandleInfo(data = {}) {
  return request({
    url: '/aj/penaltysimple/info',
    method: 'GET',
    params: data
  })
}