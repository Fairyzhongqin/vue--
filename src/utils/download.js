import axios from 'axios'
import Vue from 'vue'
import baseUrl from './webIp'
const api = axios.create({
  baseURL: baseUrl
})
/**
 * 请求拦截
 */
api.interceptors.request.use(config => {
  let token =  localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = token
    }
    // 请求CancelToken保存
    //   config.cancelToken = new axios.CancelToken(cancel => {
    //     window._axiosPromiseArr.push({cancel})
    //   })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export function downLoadFile(data = {}) {
  return api({
    url: '/aj/stat/exportCaseReasonByGet',
    method: 'GET',
    params: data,
    headers: {
      // 'Accept': 'application/octet-stream',
      'Content-Type': 'application/vnd.ms-excel;charset=UTF-8'
    }
  })
}
// /**
//  * 下载文件
//  * @param {请求url} url
//  * @param {成功回调函数} _cb
//  * @param {失败回调函数} _catchcb
//  */
// export function downLoadFile (url, _cb, _catchcb) {
//   return api.get(url, {responseType: 'blob'}, {
//     responseType: 'arraybuffer',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   }).then(_cb).catch(_catchcb)
// }
