import axios from 'axios'
import Qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from './../router'
import Vue from 'vue'
import baseUrl from './webIp'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: baseUrl, // 本地服务器
  // baseURL: 'http://192.168.0.65:8085',  // 君文服务器
  // baseURL: 'http://192.168.0.58:8086', // 建星服务器
  // baseURL: 'http://192.168.0.21:8086', // 建星服务器n
  // baseURL: 'http://192.168.0.194:8086', // 梦雨服务器
  // baseURL: 'http://mrwhat.nat300.top', // 内网穿透地址
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
  withCredentials: true
  // headers: {
  //   'Content-Type': 'application/json;charset=utf-8'
  // }
  //   headers: {"Content-Type": "multipart/form-data"}
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   // config.headers['X-Token'] = getToken()
    //   console.log(store.getters.token)
    //   config.headers.Authorization = store.getters.token;
    // }
    if (config.url.indexOf('/aj/writ/createWrit') !== -1 || config.url.indexOf('/aj/writ/reCreateOrEditWrit') !== -1) {
      let vueObj = new Vue()
      vueObj.$loading.showLoading()
    }

    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    // config.headers['Access-Control-Allow-Origin'] = 'http://192.168.0.127'
    // config.headers['withCredentials'] = true;
    // console.info('config', config)
    return config
  },

  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    let objVue = new Vue()
    objVue.$loading.hiddenLoading()
    // console.info('AAAAAAAAA',res)
    if (res.code === '50011') {
      MessageBox.confirm('请重新登录', '登录已失效', {
        confirmButtonText: '登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        router.push({
          path: '/login'
        })
      })
      // if (res.msg) Vue.prototype.$message.error(res.msg)
      return Promise.reject(new Error(res.msg || 'Error'))
    } else if (res.code === '0') {
      if (res.data && res.data.token) {
        if (res.user.userEntity.needPswUpt !== '0') {
          store.commit('SET_TOKEN', res.data.token)
          localStorage.setItem('token', res.data.token)
          sessionStorage.setItem('token', res.data.token)
        }
      }
      // if (res.user) {
      //   store.commit('SET_USER_INFO', res.user)
      //   localStorage.setItem('res', JSON.stringify(res.user))
      // }
      if (res.user) {
        store.commit('SET_USER_INFO', res.user)
        localStorage.setItem('res', JSON.stringify(res.user))
        localStorage.setItem('userInfo', JSON.stringify(res.user))
        sessionStorage.setItem('userInfo', JSON.stringify(res.user))
      }
      if (res.data && res.data.treeList) {
        // localStorage.setItem('treeList', JSON.stringify(res.data.treeList))
        sessionStorage.setItem('treeList', JSON.stringify(res.data.treeList))
        // store.commit("SET_PROJECT_TREELIST", res.data.treeList);
      }
      return Promise.resolve(res)
    } else if (res.code === undefined) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res.msg)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
