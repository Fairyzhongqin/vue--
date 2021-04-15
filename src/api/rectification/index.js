import request from '@/utils/request'


//展示延期整改复查——整改复查列表
export function showReviewListNormal(data = {}) {
    return request({
        url: '/aj/examine/examinedelay/listReview',
        method: 'POST',
        data
    })
}
// 展示正常整改复查列表
export function showRectificationReviewList(data = {}) {
    return request({
        url: '/aj/examinereview/list',
        method: 'POST',
        data
    })
}

//展示整改复查详情
export function showRectificationReviewDetail(data) {
    return request({
        url: '/aj/examinereview/info',
        method: 'GET',
        params: data
    })
}
//展示延期整改复查————整改复查详情
export function showNewReviewDetail(data) {
    return request({
        url: '/aj/examine/examinedelay/delInfo',
        method: 'GET',
        params: data
    })
}
//整改复查保存
export function saveRectificationReview(data) {
    return request({
        url: '/aj/examinereview/save',
        method: 'POST',
        data
    })
}

//展示整改复查延期列表
export function showRectificationDelayList(data = {}) {
    return request({
        url: '/aj/examine/examinedelay/listDelay',
        method: 'POST',
        data
    })
}
// 保存延期材料
export function saveDelayInfo(data = {}) {
    return request({
        url: '/aj/examinereview/saveDelayAcc',
        method: 'POST',
        data
    })
}
// 删除延期材料
export function deleteDelayAcc(data = {}) {
    return request({
        url: "/aj/examinereview/deleteDelayAcc",
        method: "POST",
        data
    })
}


//整改复查延期详情
export function showRectificationDelayDetail(data = {}) {
    return request({
        url: '/aj/examine/examinedelay/info',
        method: 'POST',
        data
    })
}
//整改复查延期保存
export function saveRectificationDelayDetail(data) {
    return request({
        url: '/aj/examine/examinedelay/save',
        method: 'POST',
        data
    })
}

//删除整改复查证据
export function delProof(data) {
    return request({
        url: '/aj/examinereview/deleteEve',
        method: 'POST',
        data
    })
}
// 2020.3.2 新需求之 删除整改复查文书
export function deleteRectificationWrit(data) {
    return request({
        url: '/aj/examinereview/deleteReviewWrit',
        method: 'DELETE',
        params: data
    })
}

//删除整改复查延期申请审批表
export function delSPB(data) {
    return request({
        url: '/aj/examine/examinedelay/deleteWrit',
        method: 'DELETE',
        params: data
    })
}

// 整改复查文书详情 两个通用  文书卡片列表修改的时候可调用
export function rectificationPdfDetail(data) {
    return request({
        url: '/aj/examinereview/writDetail',
        method: 'GET',
        params: data
    })
}
// 整改复查项保存 两个通用  文书卡片列表修改的时候可调用
export function rectificationPdfModifyAndUpdate(data) {
    return request({
        url: '/aj/examinereview/updateBatchProb',
        method: 'POST',
        data
    })
}
