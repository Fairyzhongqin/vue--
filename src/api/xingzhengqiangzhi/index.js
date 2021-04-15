//行政强制相关接口
import request from '@/utils/request'

export function examineadminList (data = {}) {
  return request({
    url: '/aj/penaltyWrit/queryXzqzInfo',
    method: 'GET',
    params: data
  })
}  