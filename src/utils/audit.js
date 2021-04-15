import {
  sealAuditStatus
} from '@api/common';
import {
  kindleCaseProcess,
  getCurrentProcess,
  getFilingRegister
} from "@/api/filingRegister/index";
import store from '@/store/index'
import message from 'element-ui/packages/message'
import { dateFormat } from "@/utils/util";

export async function handleWritStatus(id) {
  /* 't01' 立案审批表 审核返回上一级，可以制作，可以提交
  'a01' 待审核：不可以制作 不可以提交
  'a001'审核不通过：可以制作 可以提交
  'a002'审核通过:不可以制作 不可以提交
  'a003'审批不通过：可以制作 可以提交
  'a004'审批通过：不可以制作 不可以提交
  'a005'审查不通过：可以制作 可以提交
  'a006'审查通过：不可以制作 不可以提交 */
  let isCreateAllowed = false,
    isAuditAllowed = false, isDeleteAllowed = true;
  if (!id) { // 没制作过：可以制作 不可以提交流程（以下称为提交）
    isCreateAllowed = true
  } else {
    try {
      let result = await sealAuditStatus({
        requestId: id
      })
      let lastStatus = result.data[0]
      if (lastStatus) { // 有提交
        const code = lastStatus.auditResultCode
        isDeleteAllowed = false
        if (code === 'a01' || code === 'a002' || code === 'a004' || code === 'a006') {
          isCreateAllowed = false
          isAuditAllowed = false
        } else if (code === 'a001' || code === 'a003' || code === 'a005' || code === 't01') {
          isCreateAllowed = true
          isAuditAllowed = true
        }
      } else { // 无提交: 可以制作 可以提交
        isCreateAllowed = true
        isAuditAllowed = true
      }
    } catch (e) {
      return void (0)
    }
  }
  return {
    isAuditAllowed: isAuditAllowed,
    isCreateAllowed: isCreateAllowed,
    isDeleteAllowed: isDeleteAllowed
  }
}

export function getKindled(penaltyData, id, type) {
  const kindleReq = {
    caseName: penaltyData.caseName,
    caseReasonCode: penaltyData.caseReasonCode,
    creatorTime: penaltyData.creatorTime,
    penaltyId: penaltyData.penaltyId,
    punishCompanyId: penaltyData.punishCompanyId,
    udtIds: penaltyData.udtIds
  };
  const prosReq = { businessKey: id }
  // 启动行政处罚流程
  kindleCaseProcess(kindleReq)
    .then(res => {
      // 当启动流程后方能获取当前流程及我的待办事项
      return getCurrentProcess(prosReq)
    }).then(res => {
      store.commit("setCurrProcesses", res.data);
      // 页面跳转
      if (type === "handle") {
        store.commit("setCurrentComponent", "newHandle");
      } else if (type === "modify") {
        store.commit("setCurrentComponent", "newFilingRegister");
      }
    })
    .catch(err => {
      console.info(err);
    });
}

// 获取案件信息并更新vuex
export function setCaseDetail(id) {
  getFilingRegister({ penalty: id }).then(res => {
    const entity = res.data;
    store.commit("setPenalty", entity);
  }).catch(err => console.info(err))
}

/**
 * 设置文书按钮
 * @param wsCode WS开头的文书号
 * @param isJust 是否是文书卡片点击签名 true 是 false 否
 * @returns {Object}}
 */
export function handleBtnList(wsCode, isJust, isSign) {
  let info = {}
  let writTypeInfo = JSON.parse(sessionStorage.getItem("writTypeInfo"));

  if (writTypeInfo && writTypeInfo.length > 0 && !isJust) {
    writTypeInfo.forEach(writ => {
      if (writ.typeCode === wsCode) {
        info = {
          updatePdf: !isSign, // 回退编辑
          signPdf: writ.userType, // 签名
          auditPdf: writ.isAudit, // 提交审核
          sealPdf: writ.isSign === 1, // 加盖公章
          finishPdf: true, // 完成
          lawSealPdf: writ.isSign === 2, // 加盖执法专用章
          closePdf: true // 退出
        };
      }
    });
  } else {
    info = {
      updatePdf: false, // 回退编辑
      signPdf: false, // 签名
      auditPdf: false, // 提交审核
      sealPdf: false, // 加盖公章
      finishPdf: false, // 完成
      lawSealPdf: false, // 加盖执法专用章
      closePdf: true // 退出
    };
  }
  return info
}

// 设置 文书弹框 需要的信息
export function setInfo(infoArr) {
  let info = {}
  let penalty = store.state.penalty
  infoArr.forEach(name => {
    switch (name) {
      case 'writId':
        info.writId = ''; break
      case 'caseName': // 案件名称
        info.caseName = penalty.penaltyUndEntity.caseName; break
      case 'responsiblePerson': // 承办人名称
        info.responsiblePerson = penalty.udtNames; break
      case 'udtNames': // 承办人名称
        info.udtNames = penalty.udtNames; break
      case 'subject': // 主体
        info.subject = penalty.penaltyUndEntity.objectType === "0"
          ? penalty.punishCompanyName
          : penalty.penaltyUndEntity.punishPersonName;
        break
      case 'sourceId': // 案件 Id
        info.sourceId = penalty.penaltyUndEntity.penaltyId; break
      case 'penaltyId': // 案件 Id
        info.penaltyId = penalty.penaltyUndEntity.penaltyId; break
      case 'udtIds': // 承办人 id
        info.udtIds = penalty.penaltyUndEntity.udtIds; break
      case 'blcList': // 违法行为
        info.blcList = penalty.blcList; break
      case 'punishCompanyId': // 案件公司 id
        info.punishCompanyId = penalty.penaltyUndEntity.punishCompanyId; break
      case 'companyId': // 案件公司 id
        info.companyId = penalty.penaltyUndEntity.punishCompanyId; break
      case 'objectAddress': // 个人住址/公司地址
        info.objectAddress = penalty.penaltyUndEntity.objectAddress; break
      case 'address': // 个人住址/公司地址
        info.address = penalty.penaltyUndEntity.objectAddress; break
      case 'postCode': // 邮编
        info.postCode = penalty.penaltyUndEntity.postCode; break
      case 'job': // 当事人所担任职务
        info.job = penalty.penaltyUndEntity.job; break
      case 'suggestion': // 承办人意见
        info.suggestion = penalty.penaltyUndEntity.suggestion; break
      case 'person': // 被处罚人
        info.person = penalty.penaltyUndEntity.punishPersonName; break
      case 'punishPersonName': // 被处罚人
        info.punishPersonName = penalty.penaltyUndEntity.punishPersonName; break
      case 'telphone': // 电话
        info.telphone = penalty.penaltyUndEntity.telphone; break
      case 'phone': // 电话
        info.phone = penalty.penaltyUndEntity.telphone; break
      case 'sex': // 性别
        info.sex = penalty.penaltyUndEntity.sex; break
      case 'age': // 年龄
        info.age = penalty.penaltyUndEntity.age; break
      case 'birthday': // 出生年月
        info.birthday = penalty.penaltyUndEntity.birthday; break
      case 'company': // 公司
        info.company = penalty.penaltyUndEntity.objectType === '0' ? penalty.punishCompanyName : ''; break
      case 'objectType': // 单位 or 个人
        info.objectType = penalty.penaltyUndEntity.objectType; break
      case 'idCard': // 身份证号
        info.idCard = penalty.penaltyUndEntity.idCard; break
      case 'currentCompany': // 当事人所在单位
        info.currentCompany = penalty.penaltyUndEntity.currentCompany; break
      case 'currentCompanyAddress': // 当事人所在单位地址
        info.currentCompanyAddress = penalty.penaltyUndEntity.currentCompanyAddress; break
      case 'caseSituation': // 案件基本情况
        info.caseSituation = penalty.penaltyUndEntity.caseSituation; break
      case 'creatorTime': // 登记时间
        info.creatorTime = penalty.penaltyUndEntity.creatorTime; break
      case 'caseCrimeTime': // 立案时间
        info.caseCrimeTime = penalty.penaltyUndEntity.caseCrimeTime; break
    }
  })
  return info
}

// 设置审核所需部分参数
export function setAuditInfo() {
  let info = {}
  let penalty = store.state.penalty
  info = {
    caseId: penalty.penaltyUndEntity.penaltyId,
    caseName: penalty.penaltyUndEntity.caseName,
    executorId: penalty.penaltyUndEntity.udtIds,
    requestUsersIds: penalty.penaltyUndEntity.udtIds,
    partyName:
      penalty.penaltyUndEntity.objectType == 0
        ? penalty.punishCompanyName
        : penalty.penaltyUndEntity.punishPersonName, // 责任主体,
    requestDeptName: JSON.parse(localStorage.getItem("res")).sysDeptEntity
      .name, // 承办部门
    requestTime: dateFormat(
      new Date(penalty.penaltyUndEntity.caseCrimeTime),
      "yyyy-mm-dd HH:MM:ss"
    ),
    requestUsersName: penalty.udtNames,
    submitterCause: penalty.penaltyUndEntity.caseName,
    // requestUsersIds:penalty.udtIds
  }
  return info
}

// 流程回退后直接提交审核时的提醒
export function getMessage(wVersion) {
  let processName = store.state.processesNames[0]
  let isRecalled = store.state.penalty.penaltyUndEntity.processStatus
  let pVersion = store.state.penalty.penaltyUndEntity.processVersion
  if (isRecalled === '1' && pVersion > wVersion) {
    message({
      type: 'warning',
      message: `流程已在${processName}处回退，请重新制作该文书再提交审核或盖章。`
    })
    return false
  } else {
    return true
  }
}

