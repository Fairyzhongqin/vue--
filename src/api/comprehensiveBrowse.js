import request from '@/utils/request'

// 根据id获取用户信息
export function queryCompreTreeInfo(data = {}) {
    return request({
      url: '/aj/case/comprereview/queryTreeInfo',
      method: 'GET',
      params: data
    })
  }