import request from '@/utils/request'

// 获取模板列表
export function getTempList (data = {}) {
  return request({
    url: '/aj/template/templatemanager/list',
    method: 'POST',
    data
  })
}

// 保存模板
export function saveTemp (data = {}) {
  return request({
    url: '/aj/template/templatemanager/saveOrUpdate',
    method: 'POST',
    data
  })
}

// 删除某条模板
export function delTemp (data = {}) {
  return request({
    url: '/aj/template/templatemanager/delete',
    method: 'DELETE',
    params: data
  })
}

// 分享某条模板
export function shareTemp (data = {}) {
  return request({
    url: '/aj/template/templatemanager/share',
    method: 'GET',
    params: data
  })
}

// 获取某条模板详情
export function getTempDetail (data = {}) {
  return request({
    url: '/aj/template/templatemanager/info',
    method: 'GET',
    params: data
  })
}

// 删除某条检查项
export function delProb (data = {}) {
  return request({
    url: '/aj/template/templatemanager/deleteProb',
    method: 'DELETE',
    params: data
  })
}