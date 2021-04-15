import request from '@/utils/request';

// 获取现场检查记录列表
export function getInspectionData(data = {}) {
  return request({
    url: '/aj/examine/list',
    method: 'POST',
    data
  })
}

// 删除现场记录
export function delInspection(data) {
  return request({
    url: '/aj/examine/delete',
    method: 'DELETE',
    params: data
  })
}

// 查询企业列表
export function getComList(data) {
  return request({
    url: '/aj/enterprise/enterprise/list',
    method: 'POST',
    data
  })
}

// 查询部门列表
export function getOrgList(data) {
  return request({
    url: '/aj/sys/sysdept/tree',
    method: 'POST',
    data
  })
}

// 现场检查检查情况查看示例
export function getExample(data) {
  data.type = "discretion_class";
  return request({
    url: '/aj/sys/sysdict/list',
    method: 'POST',
    data
  })
}

// 获取所在地区名字列表
export function getLocation() {
  return request({
    url: '/aj/sys/devdata/getRegionTree',
    method: 'POST',
  })
}

// 现场检查保存
export function inspectionSave(data) {
  return request({
    url: '/aj/examine/save',
    method: 'POST',
    data
  })
}

// 获取执法人员列表
export function getPeopleList(data) {
  return request({
    url: '/aj/sys/sysuser/list',
    method: 'POST',
    data
  })
}
// 查询案审人员列表
export function getAswPeopleList(data) {
  return request({
    url: '/aj/sys/sysuser/listAshUser',
    method: 'POST',
    data
  })
}

// 查看现场检查详情
export function getInspectionDetail(data) {
  return request({
    url: '/aj/examine/info',
    method: 'GET',
    params: data
  })
}

// 修改现场检查详情
export function updateInspectionDetail(data) {
  return request({
    url: '/aj/examine/update',
    method: 'PUT',
    data
  })
}

// 删除现场检查中上传的附件证据
export function delInspectionProof(data) {
  return request({
    url: '/aj/examine/deleteEve',
    method: 'POST',
    data
  })
}

// 删除整改复查中上传的附件证据
export function delReviewProof(data) {
  return request({
    url: '/aj/examinereview/deleteEve',
    method: 'POST',
    data
  })
}

// 删除现场检查检查项
export function delTip(data) {
  return request({
    url: '/aj/examine/deleteProb',
    method: 'DELETE',
    params: data
  })
}

// 查询企业详细信息
export function getComInfo(data) {
  return request({
    url: '/aj/enterprise/enterprise/info',
    method: 'GET',
    params: data
  })
}

// 查询现场检查文书list
export function getInspectionWritList(data) {
  return request({
    url: '/aj/examine/listWrit',
    method: 'GET',
    params: data
  })
}

// 现场检查转责令限期整改
export function toRectification(data) {
  return request({
    url: '/aj/examinerectify/save',
    method: 'POST',
    data
  })
}

// 现场检查转责令限期整改详情
export function rectificationDetail(data) {
  return request({
    url: '/aj/examinerectify/info',
    method: 'GET',
    params: data
  })
}

// 现场检查转现场处理措施
export function toInspectionHandle(data) {
  return request({
    url: '/aj/examinemeas/save',
    method: 'POST',
    data
  })
}

// 现场检查转现场处理措施详情
export function inspectionDetail(data) {
  return request({
    url: '/aj/examinemeas/info',
    method: 'GET',
    params: data
  })
}

// 删除责令限期整改文书
export function delRectificationWrit(data) {
  return request({
    url: '/aj/examinerectify/delete',
    method: 'DELETE',
    params: data
  })
}

// 删除现场处置措施文书
export function delInspectionWrit(data) {
  return request({
    url: '/aj/examinemeas/delete',
    method: 'DELETE',
    params: data
  })
}

// 保存自定义检查项
export function saveMyTips(data) {
  return request({
    url: '/aj/examineInfo/discretionmenu/save',
    method: 'POST',
    data
  })
}

// 删除自定检查项
export function delMyTips(data) {
  return request({
    url: '/aj/examineInfo/discretionmenu/delete',
    method: 'DELETE',
    params: data
  })
}

// 查询自定义检查项列表
export function queryMyTipsList(data) {
  return request({
    url: '/aj/examineInfo/discretionmenu/list',
    method: 'POST',
    data
  })
}