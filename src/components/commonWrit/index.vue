<template>
  <div>
    <component v-bind="$attrs" v-on="$listeners" :is="writComponent"></component>
  </div>
</template>

<script>
import queryInform from './queryInform' // 询问通知书
import queryRecords from './queryRecords' // 询问笔录
import checkRecord from './checkRecord' // 勘验笔录
import addressConfirm from './addressConfirm' // 行政执法文书送达地址确认书
import extendClosedTime from './extendClosedTime' // 延长查封扣押期限决定书
import closeAndDistrainDecision from './closeAndDistrainDecision' // 查封扣押处理决定书
import seizureList from './seizureList' //+ 查封扣押（场所、设施、财物）清单
import takeEvidence from './takeEvidence' //抽样取证凭证
import approvalform from './xingzhengqiangzhi/approvalform' //+ 行政强制审批表 一般行政处罚
// import compulsoryApprovalform from "./compulsoryApprovalform"; //行政强制执行审批表  现场结果处理
import payFine from './xingzhengqiangzhi/payFine' //+ 缴纳罚款催告书
import returnPayFine from './xingzhengqiangzhi/returnPayFine' //+ 缴纳罚款催告书
import decisiononAdditionalPenalty from './xingzhengqiangzhi/decisiononAdditionalPenalty' //+ 加处罚款决定书
import returnDecisiononAdditionalPenalty from './xingzhengqiangzhi/returnDecisiononAdditionalPenalty'
import advanceNotice from './xingzhengqiangzhi/advanceNotice' //+ 行政强制执行事先催告书
import returnAdvanceNotice from './xingzhengqiangzhi/returnAdvanceNotice' //+ 行政强制执行事先催告书
import stopPower from './xingzhengqiangzhi/stopPower' //+ 停止供电（供应民用爆炸物品）通知书
import powerCutDecision from './xingzhengqiangzhi/powerCutDecision' //+ 停止供电（供应民用爆炸物品）决定书
import restorePowerNotice from './xingzhengqiangzhi/restorePowerNotice' //+ 恢复供电（供应民用爆炸物品）通知书
import applicationForEnforcement from './xingzhengqiangzhi/applicationForEnforcement' //强制执行申请书
import returnApplicationForEnforcement from './xingzhengqiangzhi/returnApplicationForEnforcement' // 强制执行申请书送达回执
import approvalFrom from './xsdjbczj/approvalFrom' //先行登记保存证据审批表
import evidenceNotice from './xsdjbczj/evidenceNotice' //先行登记保存证据通知书
import evidenceExamine from './xsdjbczj/evidenceExamine' // 先行登记保存证据处理审批表
import evidenceDecision from './xsdjbczj/evidenceDecision' // 先行登记保存证据处理决定书
import examination from './Examination' //行政强制审批表
import nonResRangeTrans from './nonResRangeTrans' // 非职责范围安全问题移交单
import evidenceExecution from './xsdjbczj/evidenceExecution' //先行登记保存处理决定书
import partyState from './partyState' //当事人陈述申辩笔录
import decisionSeizureDialog from './decisionSeizureDialog' //查封扣押决定书
import entrust from './entrust' //鉴定委托书
import caseInform from './caseInform' //案件告知审批表
import penaltyNotice from './xingzhengchufa/penaltyNotice' //行政处罚告知书 新
import returnNotice from './xingzhengchufa/returnNotice' //行政处罚告知书送达回执
import decision from './xingzhengchufajueding/decision' //行政处罚决定书 单位
import decisionPerson from './xingzhengchufajueding/decisionPerson' //行政处罚决定书 个人
import returnDecision from './xingzhengchufajueding/returnDecision' //行政处罚决定书送达回执
import noDecision from './xingzhengchufajueding/noDecision' //不予行政处罚决定书
import caseHandleApproval from './caseHandleApproval' //案件处理呈批表
import delayPay from './xingzhengzhixing/delayPay' //延期（分期）缴纳罚款审批表
import approveDelayPay from './xingzhengzhixing/approveDelayPay' //延期（分期）缴纳罚款批准书
import delayPayReturn from './delayPayReturn' //延期（分期）缴纳罚款送达回执
import groupDiscussion from './groupDiscussion' //行政处罚集体讨论记录
import hearMeetingNotice from './hearingOfPenalty/hearMeetingNotice' // 行政处罚听证会通知书
import returnHearingNotice from './hearingOfPenalty/returnHearingNotice' // 行政处罚听证会通知书送达回执
import hearingRecord from './hearingOfPenalty/hearingRecord' // 听证笔录
import hearingReport from './hearingOfPenalty/hearingReport' // 听证报告
import caseDelay from './caseDelay' // 案件延期审批表
export default {
  name: 'commonWrit',
  props: {
    writType: {
      type: String
    },
    code: {
      type: String
    }
  },
  components: {
    approveDelayPay,
    delayPay,
    delayPayReturn,
    addressConfirm,
    decisionPerson,
    decision,
    noDecision,
    returnNotice,
    // hearNotice,
    penaltyNotice,
    entrust,
    seizureList,
    evidenceExecution,
    evidenceExamine,
    evidenceNotice,
    evidenceDecision,
    approvalFrom,
    takeEvidence,
    queryInform,
    queryRecords,
    checkRecord,
    approvalform,
    payFine,
    returnPayFine,
    decisiononAdditionalPenalty,
    returnDecisiononAdditionalPenalty,
    advanceNotice,
    returnAdvanceNotice,
    stopPower,
    powerCutDecision,
    restorePowerNotice,
    applicationForEnforcement,
    returnApplicationForEnforcement,
    nonResRangeTrans,
    extendClosedTime,
    closeAndDistrainDecision,
    examination,
    evidenceExecution,
    partyState,
    decisionSeizureDialog,
    approvalFrom,
    caseHandleApproval,
    groupDiscussion,
    hearMeetingNotice,
    returnHearingNotice,
    hearingRecord,
    hearingReport,
    returnDecision,
    caseInform,
    caseDelay
    // compulsoryApprovalform
  },
  data() {
    return {
      writComponent: ''
    }
  },
  created() {
    this.initWritPage()
  },
  methods: {
    initWritPage() {
      switch (this.writType) {
        case '询问通知书':
          this.writComponent = 'queryInform'
          break
        case '询问笔录':
          this.writComponent = 'queryRecords'
          break
        case '勘验笔录':
          this.writComponent = 'checkRecord'
          break
        case '送达地址确认书':
          this.writComponent = 'addressConfirm'
          break
        case '抽样取证凭证':
          this.writComponent = 'takeEvidence'
          break
        // case "行政强制执行审批表处理": //检查结果处理
        //   this.writComponent = "compulsoryApprovalform";
        //   break;
        case '行政强制审批表':
          // this.writComponent = "examination";
          this.writComponent = 'approvalform'
          break
        case '缴纳罚款催告书':
          this.writComponent = 'payFine'
          break
        case '缴纳罚款催告书送达回执':
          this.writComponent = 'returnPayFine'
          break
        case '加处罚款决定书':
          this.writComponent = 'decisiononAdditionalPenalty'
          break
        case '加处罚款决定书送达回执':
          this.writComponent = 'returnDecisiononAdditionalPenalty'
          break
          returnDecisiononAdditionalPenalty
        case '行政强制执行事先催告书':
          this.writComponent = 'advanceNotice'
          break
        case '行政强制执行事先催告书送达回执':
          this.writComponent = 'returnAdvanceNotice'
          break
        case '停止供电（供应民用爆炸物品）通知书':
          this.writComponent = 'stopPower'
          break
        case '停止供电（供应民用爆炸物品）决定书':
          this.writComponent = 'powerCutDecision'
          break
        case '恢复供电（供应民用爆炸物品）通知书':
          this.writComponent = 'restorePowerNotice'
          break
        case '强制执行申请书':
          this.writComponent = 'applicationForEnforcement'
          break
        case '强制执行申请书送达回执':
          this.writComponent = 'returnApplicationForEnforcement'
          break
        case '先行登记保存证据审批表':
          this.writComponent = 'approvalFrom'
          break
        case '先行登记保存证据通知书':
          this.writComponent = 'evidenceNotice'
          break
        case '先行登记保存证据处理审批表':
          this.writComponent = 'evidenceExamine'
          break
        case '先行登记保存证据处理决定书':
          this.writComponent = 'evidenceDecision'
          break
        case '行政强制审批表':
          this.writComponent = 'examination'
          break
        case '非职责范围安全问题移交单':
          this.writComponent = 'nonResRangeTrans'
          break
        case '延长查封扣押期限决定书':
          this.writComponent = 'extendClosedTime'
          break
        case '查封扣押处理决定书':
          this.writComponent = 'closeAndDistrainDecision'
          break
        case '查封扣押（场所、设施、财物）清单':
          this.writComponent = 'seizureList'
          break
        case '查封扣押清单':
          this.writComponent = 'seizureList'
          break
        case '先行登记保存处理决定书':
          this.writComponent = 'evidenceExecution'
          break
        case '当事人陈述申辩笔录':
          this.writComponent = 'partyState'
          break
        case '查封扣押决定书':
          this.writComponent = 'decisionSeizureDialog'
          break
        case '鉴定委托书':
          this.writComponent = 'entrust'
          break
        case '案件告知审批表':
          this.writComponent = 'caseInform'
          break
        case '行政处罚告知书':
          this.writComponent = 'penaltyNotice'
          break
        case '处罚告知书送达回执':
          this.writComponent = 'returnNotice'
          break
        case '行政处罚决定书（单位/个人）':
          this.writComponent = this.code == 'XXCFJDSDW' ? 'decision' : 'decisionPerson'
          break
        case '行政处罚决定书（单位）':
          this.writComponent = 'decision'
          break
        case '行政处罚决定书（个人）':
          this.writComponent = 'decisionPerson'
          break
        case '行政处罚决定书送达回执':
          this.writComponent = 'returnDecision'
          break
        case '不予行政处罚决定书':
          this.writComponent = 'noDecision'
          break
        case '案件处理呈批表':
          this.writComponent = 'caseHandleApproval'
          break
        case '延期（分期）缴纳罚款审批表':
          this.writComponent = 'delayPay'
          break
        case '延期（分期）缴纳罚款批准书':
          this.writComponent = 'approveDelayPay'
          break
        case '延期（分期）缴纳罚款送达回执':
          this.writComponent = 'delayPayReturn'
          break
        case '行政处罚集体讨论记录':
          this.writComponent = 'groupDiscussion'
          break
        case '行政处罚听证会通知书':
          this.writComponent = 'hearMeetingNotice'
          break
        case '行政处罚听证会通知书送达回执':
          this.writComponent = 'returnHearingNotice'
          break
        case '听证笔录':
          this.writComponent = 'hearingRecord'
          break
        case '听证会报告书':
          this.writComponent = 'hearingReport'
          break
        case '案件延期审批表':
          this.writComponent = 'caseDelay'
          break
        default:
          return
      }
    }
  }
}
</script>

<style lang="less">
</style>