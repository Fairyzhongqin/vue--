import request from '@/utils/request'

// 获取左侧菜单树
export function queryTreeInfo (data = {}) {
  return request({
    url: '/aj/case/casefileaccessory/queryTreeInfo',
    method: 'GET',
    params: data
  })
}

// 获取制作目录数据
export function getDireMaterial (data = {}) {
  return request({
    url: '/aj/case/casefileaccessory/queryCatalog',
    method: 'GET',
    params: data
  })
}

// 保存卷宗目录
export function saveDirectory (id, data = {}) {
  return request({
    url: '/aj/case/casefileaccessory/saveCatalog',
    method: 'POST',
    data,
    params: id
  })
}

// 获取树节点对应的文书信息
export function getNodeRelatedWrit (id, data = {}) {
  return request({
    url: '/aj/case/casefileaccessory/queryAllInfo',
    method: 'POST',
    data,
    params: id
  })
}

// 删除电子卷宗某一个文书
export function delNodeWrit (id) {
  return request({
    url: '/aj/case/casefileaccessory/delete',
    method: 'DELETE',
    params: id
  })
}

// 制作电子卷宗获取浏览数据
export function getArchiveCon (id) {
  return request({
    url: '/aj/case/casefileaccessory/queryAllFile',
    method: 'POST',
    params: id
  })
}

// 制作电子卷宗
export function createArchive (id) {
  return request({
    url: '/aj/case/casefileaccessory/buildFile',
    method: 'GET',
    params: id
  })
}

// 获取电子卷宗下载地址
export function getDownloadURL (id) {
  return request({
    url: '/aj/case/casefileaccessory/getCaseFile',
    method: 'POST',
    params: id
  })
}

// 获取卷宗目录和首页文书
export function getArchiveWrit (id) {
  return request({
    url: '/aj/case/casefileaccessory/getListAndIndex',
    method: 'GET',
    params: id
  })
}