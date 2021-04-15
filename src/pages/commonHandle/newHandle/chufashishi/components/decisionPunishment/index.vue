<template>
  <el-row class="body decision_punish_content">
    <div class="tab-left">
      <div class="create-tab-title">处罚决定</div>
      <div class="body-content-button" v-if="!forBrowse">
        <el-button type="primary" class="body-button" :disabled="isExist" @click="checkType('行政处罚决定书（单位/个人）', 'personOrOrg')"
          >+ 行政处罚决定书（单位/个人）</el-button
        >
        <el-button type="primary" class="body-button" :disabled="returnDis" @click="checkType('行政处罚决定书送达回执', 'XZCFJDSSDHZ')"
          >+ 行政处罚决定书送达回执</el-button
        >
        <el-button type="primary" class="body-button" :disabled="caseDesDis" @click="checkType('案件处理呈批表', 'AJCLCPB')">+ 案件处理呈批表</el-button>
        <el-button type="primary" class="body-button" :disabled="isExist" @click="checkType('不予行政处罚决定书', 'BYXZCFJDS')">+ 不予行政处罚决定书</el-button>
      </div>
      <div class="doc-container">
        <template v-if="docList.length !== 0">
          <doc-card
            v-for="(docItem, index) of docList"
            :key="index"
            :docData="docItem"
            :docList="docList"
            :auditInfo="auditInfo"
            :readOnly="forBrowse"
            @toLawSeal="toLawSeal"
            @afterDelete="initInfo"
            @previewWrit="preview"
            @toSeal="toSeal"
            @modifyWrit="checkType"
            @afterUpload="initInfo"
            @submit="toSeal"
          ></doc-card>
        </template>
        <sn-empty-data text="暂无处罚决定相关文书..." v-if="docList.length === 0"></sn-empty-data>
      </div>
    </div>
    <div class="tab-right">
      <div class="create-tab-title">审核审批流程(案件处理呈批表)</div>
      <sn-timeline :lineData="auditProcesses"></sn-timeline>
    </div>

    <el-dialog class="big-dialog" :visible.sync="showPdfDialog" :title="dialogTitle" :before-close="close" width="900px">
      <common-writ
        v-if="showPdfDialog && dialogContent === 'writDialog'"
        :info="info"
        :writType="writType"
        :isSecond="true"
        :code="code"
        @toLawSeal="initInfo"
        @createWrit="createWrit"
        @close="close"
        @toSeal="toSeal"
      ></common-writ>
      <select-people v-if="dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>

    <show-pdf
      :pdfId="visibleWritId"
      v-if="showPdf"
      :writName="writType"
      :writTypeCode="writTypeCode"
      :buttonList="buttonList"
      @toLawSeal="initInfo"
      @updatePdf="updatePdf"
      @sealPdf="sealFromPdf($event, 'seal')"
      @closePdf="closePdf"
      @auditPdf="sealFromPdf"
      @finishPdf="closePdf"
    ></show-pdf>
  </el-row>
</template>
<script>
import { getPunishResolve, getInvesWrits, getWritInfo, createWrit, updateWrit, deleteWrit, getWritDataByWritId, getPunishInform } from '@api/fileRelated'
import ShowPdf from '@/components/showPdf'
import commonWrit from '@/components/commonWrit'
import docCard from '@/components/docCard/index'
import snEmptyData from '@/components/snEmptyData'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { handleBtnList, setInfo } from '@/utils/audit'
import snTimeline from '@/components/TimeLine'
import { finishPro, sealAudit, sealAuditStatus } from '@api/common'
import { dateFormat } from '@/utils/util'
import writTypeMap from '@/utils/writType'
export default {
  name: 'decisionPunishment',
  components: {
    ShowPdf,
    snTimeline,
    commonWrit,
    docCard,
    snEmptyData,
    selectPeople
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      caseOpinion: '', // 案件处理呈批表的承办人意见默认值
      conclusion: '', // 处罚决定书的处罚决定默认值
      writTypeCode: '', // WS 开头的文书号
      showPdfDialog: false,
      dialogTitle: '',
      visibleWritId: '',
      dialogContent: '',
      writType: '',
      info: {},
      objectType: '',
      code: '',
      docList: [],
      auditInfo: {},
      audiReq: {},
      showPdf: false,
      isExist: false, // 是否有决定书
      auditProcesses: [], // 案件处理呈批表审核审批流程信息
      buttonList: {},
      existWrits: [], // 文书列表的文书名称拼音首字母数组
      caseDesDis: false, // 是否是案件处理呈批表
      returnDis: false // 是否有决定书送达回执
    }
  },
  created() {
    let _penalty = this.$store.state.penalty
    this.objectType = _penalty.penaltyUndEntity.objectType
    this.initInfo()
    this.getExerOpinion()
  },
  methods: {
    initInfo() {
      let _penalty = this.$store.state.penalty

      // 文书审核需要的信息
      this.auditInfo = {
        requestUsersName: _penalty.udtNames, // 承办人名称
        caseName: _penalty.penaltyUndEntity.caseName // 案件名称
      }
      // 获取处罚决定文书
      this.getPunishWrit()
    },
    // 获取处罚决定书的处罚决定
    getExerOpinion() {
      let type = 'XXCFJTTLJL2'
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: type
      }
      getWritInfo(req)
        .then(res => {
          let writ = res.data[0]
          if (writ) {
            // 有集体讨论
            return getWritDataByWritId({ writId: writ.writId })
          } else {
            // 无集体讨论，为案件告知审批表
            type = 'AJGZSPB'
            return getWritInfo({
              sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
              type: type
            })
          }
        })
        .then(info => {
          console.info('第一次', info)
          if (type === 'XXCFJTTLJL2') {
            info.data.forEach(tag => {
              if (tag.tagName === 'tag12') {
                this.conclusion = tag.tagContent
              }
            })
          } else {
            // 获取案件告知审批表的详情
            let doc = info.data[0]
            if (doc) {
              return getWritDataByWritId({ writId: doc.writId })
            }
          }
        })
        .then(res => {
          console.info('案件处理呈批表的详情', res.data)
          res.data.forEach(tag => {
            if (tag.tagName === 'tag19') {
              this.conclusion = tag.tagContent
            }
          })
        })
        .catch(err => console.info(err))
    },
    // 获取案件处理呈批表的承办人意见默认值
    getCaseOpinion(type, doc) {
      let tagInd
      if (type === 'BYXZCFJDS') {
        this.caseOpinion = '建议不予处罚。'
        return
      } else if (type === 'XXCFJDSDW') {
        tagInd = 'tag11'
      } else {
        tagInd = 'tag14'
      }

      getWritDataByWritId({ writId: doc.writId }).then(info => {
        info.data.forEach(tag => {
          if (tag.tagName === tagInd) {
            this.caseOpinion = tag.tagContent
          }
        })
      })
    },
    // 获取文书审核审批信息
    getStatus(writ) {
      sealAuditStatus({
        requestId: writ.writId
      }).then(res => {
        let auditResult = res.data[0]
        this.auditProcesses = res.data
        if (auditResult && auditResult.auditResultCode === 'a004') {
          this.hasPresentPassed = true
        }
      })
    },
    // 获取处罚决定文书
    getPunishWrit() {
      let types = ['XXCFJDSDW', 'XXCFJDSGR', 'BYXZCFJDS', 'AJCLCPB', 'XZCFJDSSDHZ']
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: types.join(',')
      }
      getWritInfo(req).then(res => {
        this.existWrits = []
        this.docList = res.data
        this.docList.forEach(doc => {
          this.existWrits.push(doc.writTypeName)
          if (doc.writTypeName === 'AJCLCPB') {
            this.getStatus(doc)
          }
          if (['XXCFJDSDW', 'XXCFJDSGR', 'BYXZCFJDS'].indexOf(doc.writTypeName) >= 0) {
            this.getCaseOpinion(doc.writTypeName, doc)
          }
        })
        this.setBtnStatus(this.existWrits)
      })
    },
    // 设置按钮状态
    setBtnStatus(types) {
      if (types.indexOf('AJCLCPB') >= 0) {
        // 已有审批表
        this.caseDesDis = true
      } else {
        this.caseDesDis = false
      }
      if (types.indexOf('XXCFJDSDW') >= 0 || types.indexOf('XXCFJDSGR') >= 0 || types.indexOf('BYXZCFJDS') >= 0) {
        // 已有决定书
        this.isExist = true
      } else {
        this.isExist = false
      }
      if (types.indexOf('XZCFJDSSDHZ') >= 0) {
        // 已有送达回执
        this.returnDis = true
      } else {
        this.returnDis = false
      }
    },
    checkType(type, writType, writId) {
      let _penalty = this.$store.state.penalty
      if (writType === 'personOrOrg') {
        writType = _penalty.penaltyUndEntity.objectType === '0' ? 'XXCFJDSDW' : 'XXCFJDSGR'
      }
      let infoArr = [
        'writId',
        'blcList',
        'punishCompanyId',
        'caseName',
        'objectAddress',
        'postCode',
        'responsiblePerson',
        'subject',
        'address',
        'person',
        'punishPersonName',
        'sourceId',
        'telphone',
        'udtIds',
        'sex',
        'age',
        'company',
        'objectType',
        'idCard',
        'currentCompany',
        'companyId',
        'currentCompanyAddress',
        'job',
        'suggestion'
      ]

      let auditInfo = {
        // 传给文书的信息
        ...setInfo(infoArr),
        docList: this.docList, // 文书列表
        fact: '', // 违法行为
        law: '', // 相关法律
        punishBasis: '', // 处罚依据
        conclusion: this.conclusion, // 决定书默认的处罚决定
        caseOpinion: this.caseOpinion // 案件处理呈批表默认的承办人意见
      }
      _penalty.blcList.map(_item => {
        if (_item.actName) {
          auditInfo.fact += `${_item.actName}\n`
        }
        if (_item.lawContent) {
          auditInfo.law += `${_item.lawContent}\n`
        }
        if (_item.penaltyAcdName) {
          auditInfo.punishBasis += `${_item.penaltyAcdName}\n`
        }
      })
      this.writType = type
      this.getWritTypeCode() // 获取 code
      if (!writId) {
        // 校验是否可以生成文书
        let res = this.defineMsg(writType)
        if (!res) {
          return
        }

        // 从 + 按钮处 新增文书
        auditInfo.writId = ''
        this.currWritId = ''
        this.showPdfDialog = true
        this.dialogContent = 'writDialog'
        this.info = { writInfo: null, auditInfo }
      } else {
        // 从卡片处 修改文书
        auditInfo.writId = writId
        this.currWritId = writId
        getWritDataByWritId({ writId: writId }).then(res => {
          this.updateWritInfo = res.data
          this.showPdfDialog = true
          this.dialogContent = 'writDialog'
          this.info = { writInfo: this.updateWritInfo, auditInfo }
        })
      }

      this.dialogTitle = type
    },
    // 校验文书生成情况
    defineMsg(type) {
      if (type === 'XZCFJDSSDHZ' && !this.isExist) {
        // 行政处罚决定书送达回执（无决定书）
        this.getMessage('warning', '请先生成行政处罚决定书或者不予行政处罚决定书')
        return false
      }

      if (type === 'AJCLCPB') {
        // 案件处理呈批表
        if (!this.isExist) {
          this.getMessage('warning', '请先生成行政处罚决定书')
          return false
        } else if (this.isExist && this.existWrits.indexOf('XZCFJDSSDHZ') === -1) {
          this.getMessage('warning', '请先生成行政处罚决定书送达回执')
          return false
        }
      }
      return true
    },
    // 获取 requestWritType
    getWritTypeCode() {
      this.code =
        this.writType === '不予行政处罚决定书' ? 'BYXZCFJDS' : this.$store.state.penalty.penaltyUndEntity.objectType === '0' ? 'XXCFJDSDW' : 'XXCFJDSGR'
    },
    // 消息提示
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    close() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.showPdfDialog = false
      this.dialogContent = ''
      this.dialogTitle = ''
    },
    closePdf() {
      this.initInfo()
      this.showPdfDialog = false
      this.showPdf = false
    },
    updatePdf(id) {
      this.currWritId = id
      this.showPdf = false
    },
    // 加盖执法专用章后回调
    toLawSeal(data) {
      this.buttonList = handleBtnList(data.typeCode, true)
      this.preview(data.id, data.title)
      this.initInfo()
    },
    preview(id, title, status) {
      if (status) this.buttonList = status
      this.showPdf = true
      this.writType = title
      this.visibleWritId = id
    },
    createWrit(reqData) {
      // 调用接口生成文书
      if (this.currWritId) {
        // 修改
        updateWrit({ writId: this.currWritId }, reqData.data)
          .then(res => {
            this.getMessage('success', '制作成功！')
            this.writTypeCode = res.writType
            this.buttonList = handleBtnList(res.writType)
            this.preview(this.currWritId, this.writType)
            this.initInfo()
          })
          .catch(err => {
            this.getMessage('error', '制作失败！')
          })
      } else {
        createWrit(reqData)
          .then(res => {
            this.getMessage('success', '制作成功！')
            this.writTypeCode = res.writType
            this.buttonList = handleBtnList(res.writType)
            this.preview(res.writId, this.writType)
            this.initInfo()
          })
          .catch(err => {
            this.getMessage('error', '制作失败！')
          })
      }
    },
    toSeal(audiReq) {
      this.audiReq = audiReq
      this.showPdfDialog = true
      this.dialogContent = 'selectPeople'
      this.dialogTitle = '选择审核人员'
    },

    // 从showPdf来 审核审批/加盖公章
    sealFromPdf(obj, type) {
      let _penalty = this.$store.state.penalty
      this.audiReq = {
        auditTypeCode: '',
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        requestUsersIds: _penalty.penaltyUndEntity.udtIds,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name,
        requestId: obj.pdfId,
        requestTime: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        requestUsersName: _penalty.udtNames,
        submitterCause: _penalty.penaltyUndEntity.caseName,
        partyName:
          this.$store.state.penalty.penaltyUndEntity.objectType === '0'
            ? this.$store.state.penalty.punishCompanyName
            : this.$store.state.penalty.penaltyUndEntity.punishPersonName,
        partyId: this.$store.state.penalty.penaltyUndEntity.objectType === '0' ? this.$store.state.penalty.punishCompanyId : ''
      }

      if (type === 'seal') {
        this.audiReq.auditTypeCode = 'ta80040'
        this.getWritTypeCode()
        this.audiReq.requestWritType = this.code
      } else {
        // 获取处罚决定的流程任务
        let task = this.$store.state.processes.get('CFJD') ? JSON.parse(this.$store.state.processes.get('CFJD')) : []
        this.audiReq.parentTaskId = task[0].taskId
        this.audiReq.auditTypeCode = 'ta80018'
      }
      sealAudit(this.audiReq)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.closePdf()
          this.initInfo()
        })
        .catch(err => console.info(err))
    },
    // 审核审批（盖章）
    submitToAudition(bool, auditor) {
      this.dialogContent = ''
      this.showPdfDialog = false
      if (!bool) return
      if (this.audiReq.auditTypeCode === 'ta80040') {
        this.getWritTypeCode()
        this.audiReq.requestWritType = this.code
      } else {
        // 获取处罚决定的流程任务
        let task = this.$store.state.processes.get('CFJD') ? JSON.parse(this.$store.state.processes.get('CFJD')) : []
        this.audiReq.parentTaskId = task[0].taskId
        this.audiReq.auditTypeCode = 'ta80018'
      }
      this.audiReq.handlerDeptId = auditor[0].deptId
      this.audiReq.handlerUserId = auditor[0].id
      this.audiReq.requestUsersIds = this.$store.state.penalty.penaltyUndEntity.udtIds
      this.audiReq.requestDeptName = JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name
      this.audiReq.partyName =
        this.$store.state.penalty.penaltyUndEntity.objectType === '0'
          ? this.$store.state.penalty.punishCompanyName
          : this.$store.state.penalty.penaltyUndEntity.punishPersonName
      this.partyId = this.$store.state.penalty.penaltyUndEntity.objectType === '0' ? this.$store.state.penalty.punishCompanyId : ''

      // 调用接口向下走流程
      sealAudit(this.audiReq)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.initInfo()
        })
        .catch(err => console.info(err))
    }
  }
}
</script>
<style lang="less" scoped>
.decision_punish_content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .tab-left {
    width: calc(65% - 15px);
    .buttons {
      display: flex;
    }
  }

  .tab-right {
    width: calc(35% - 15px);
    margin-left: 30px;
    .create-tab-title {
      margin-bottom: 16px;
    }
  }
}
.body-content-button {
  padding-top: 18px;
  .body-button {
    border-radius: 5px;
    margin-bottom: 5px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 6px;
    height: 28px;
    padding: 7px 8px;
    margin-left: 0;
    &:not(.is-disabled) {
      background: rgba(0, 153, 255, 1);
    }
  }
}
.content {
  background: #fff;
  padding: 8px;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 16px 82px 33px;
  border-radius: 8px;
  position: relative;
}
.matter {
  font-size: 14px;
  color: #333333;
  padding: 16px;
  box-sizing: border-box;
  height: 200px;
}
.matter-tit {
  width: 75px;
  margin-bottom: 10px;
}
.matter-val {
  width: calc(100% - 75px);
  margin-bottom: 10px;
}
.el-row {
  .el-col {
    padding-top: 16px;
  }
}
.card-footer {
  border-top: 1px solid #eeeeee;
  height: 46px;
  padding: 0 16px;
}

.status {
  background: #1cc19c;
  width: 105px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.statuss {
  background: #eef5f9;
  width: 105px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}

.status-waits {
  &:extend(.statuss);
  color: #0099ff;
  margin-top: 8px;
}
.status-error {
  &:extend(.status);
  color: #ff0000;
}

.hover-font {
  color: #0099ff;
  padding: 0 5px;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
.align-items-center {
  align-items: normal;
}
.align-items-center-1 {
  line-height: 47px;
}
.el-col-lg-8 {
  width: 43%;
}
// 卡片区域
.doc-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 16px;
  .doc-card {
    margin-bottom: 18px;
  }
}
.big-dialog {
  /deep/.el-dialog {
    height: auto;
    padding-bottom: 10px;
    .content {
      margin-bottom: 0;
    }
  }
}
</style>
