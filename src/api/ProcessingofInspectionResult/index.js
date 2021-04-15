import request from '@/utils/request';


// 获取检查记录列表
export function getlistOfsiteinspectionRecord(data = {}) {
  return request ({
    url:'/aj/examine/list',
    method:'POST',
    data
  })
}

// 检查结果处理处置页面
export function getExamineInfo(data={}) {
  return request({
    url:'/aj/examine/info',
    method:'GET',
    params:data
  })
}

// 删除每个处置列表项

export function deleteExamineItem(data={}) {
  return request({
    url:'/aj/examine/deleteProb',
    method:'DELETE',
    params:data
  })
}

// 查询文书
export function queryDocument(data={}) {
  return request({
    url:'/aj/examine/listWrit',
    method:'GET',
    params:data
  })
}
// 法律依据legislativeAuthority
export function legislativeAuthority(data={}) {
  return request({
    url:'/aj/sys/sysdict/list',
    method:'POST',
    data
  })
}
// 保存现场处理措施
export function saveExamine(data={}) {
  return request({
    url:'/aj/examinemeas/save',
    method:'POST',
    data
  })
}
// 制作现场处理措施决定书接口
export function makeDisposalDocument(data={}) {
  return request({
    url:'/aj/writ/createWrit',
    method:'POST',
    data
  })
}
// 加盖公章
export function addSeal(data={}) {
  return request({
    url:'/aj/writ/signWrit',
    method:'POST',
    params:data
  })
}
// 保存责令限期整改

export function saveLimitedModify(data={}) {
  return request({
    url:'/aj/examinerectify/save',
    method:'POST',
  data
  })
}
// 保存简易行政处罚
export function saveSimpleAdministration(data={}){
  return request({
    url:'/aj/penaltysimple/save',
    method:'post',
    data
  })
}
// 行政处罚-简易程序文书列表
export function simpleDocumentList(data={}){
  return request({
    url:'/aj/penaltysimple/writlist',
    methods:'get',
    params:data
  })
}
// 根据企业id查询企业信息
export function enterPriseInquireByid(data={}){
  return request({
    url:'/aj/enterprise/enterprise/info',
    methods:'GET',
    params:data
  })
}
//根据企业id查询该企业历次检查记录
export function getExamineCheckRecord(data={}){
  return request({
    url:'/aj/examine/examineList',
    methods:'GET',
    params:data
  })
}