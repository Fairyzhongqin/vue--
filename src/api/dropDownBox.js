import request from '@/utils/request'

export function dropDownBoxByPost (url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
export function dropDownBoxByGet (url, data) {
  return request({
    url: url,
    method: 'get',
    params: data
  })
}
