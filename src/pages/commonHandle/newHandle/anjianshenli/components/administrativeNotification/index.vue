<template>
  <el-row class="body">
    <div class="create-tab-title">处罚告知</div>
    <div class="body-content-button" v-if="!forBrowse">
      <div>
        <el-button type="primary" class="body-button" :disabled="btnStatus.noticeDis" @click="checkType('行政处罚告知书', 'XXCFGZ')"
          >+ 行政处罚告知书</el-button
        >
        <el-button type="primary" class="body-button" :disabled="btnStatus.returnNoteDis" @click="checkType('处罚告知书送达回执', 'CFHZ')"
          >+ 处罚告知书送达回执</el-button
        >
        <el-button type="primary" class="body-button" :disabled="btnStatus.informDis" @click="checkType('案件告知审批表', 'AJGZSPB')"
          >+ 案件告知审批表</el-button
        >
        <el-button type="primary" class="body-button" @click="checkType('当事人陈述申辩笔录', 'DSRCSSBBL')">+ 当事人陈述申辩笔录</el-button>
        <el-button type="primary" class="body-button" :disabled="!canUploadProof" @click="uploadFile">+ 回执证据</el-button>
      </div>
    </div>
    <div class="doc-container">
      <template v-if="docList.length !== 0">
        <doc-card
          v-for="(docItem, index) of docList"
          :key="index"
          :isRecalled="isRecalled"
          :processVersion="processVersion"
          :docData="docItem"
          :docList="docList"
          :auditInfo="auditInfo"
          :readOnly="forBrowse"
          @afterDelete="initInfo"
          @modifyWrit="checkType"
          @previewWrit="preview"
          @toSeal="toSeal"
          @toLawSeal="toLawSeal"
          @afterUpload="initInfo"
          @submit="toSeal"
        ></doc-card>
      </template>
      <sn-empty-data text="暂无处罚告知相关文书" v-if="docList.length === 0"></sn-empty-data>
    </div>

    <penalty-upload :sourceType="'zztz'" :btnText="'回执证据'" :justHide="true" ref="penaltyUpload" :forBrowse="forBrowse"></penalty-upload>
    <el-dialog class="big-dialog" width="900px" :visible.sync="showPublicDialog" :title="dialogTitle" :before-close="close">
      <common-writ
        v-if="showPublicDialog && dialogContent === 'writDialog'"
        :info="info"
        :isRecalled="isRecalled"
        :writType="writType"
        :selectedPeople="selectedPeople"
        @selectPeople="selectPeople"
        @toLawSeal="initInfo"
        @createWrit="createWrit"
        @close="close"
      ></common-writ>
      <select-people v-if="dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <!-- 文书中用的选择人员弹框 -->
    <el-dialog width="900px" :visible.sync="showWritSelectPeople" :title="`选择${selectType}`" :before-close="wsClose">
      <select-people v-if="showWritSelectPeople" :selectNum="1" :peopleCache="peopleCache" @getPeople="getPeople"> </select-people>
    </el-dialog>
    <show-pdf
      :pdfId="visibleWritId"
      v-if="showPdf"
      :writName="writType"
      :writTypeCode="writTypeCode"
      :cancelAudit="cancelAudit"
      @updatePdf="updatePdf"
      @sealPdf="sealFromPdf($event, 'seal')"
      @closePdf="closePdf"
      @finishPdf="closePdf"
      @auditPdf="sealFromPdf"
      :buttonList="buttonList"
    ></show-pdf>
  </el-row>
</template>
<script>
import { getInvesWrits, createWrit, updateWrit, deleteWrit, getWritInfo, getPunishInform, getWritDataByWritId, sealWrit } from '@api/fileRelated'
import writTypeMap from '@/utils/writType'
import commonWrit from '@/components/commonWrit'
import docCard from '@/components/docCard/index'
import ShowPdf from '@/components/showPdf'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { dateFormat } from '@/utils/util'
import { handleBtnList, setInfo } from '@/utils/audit'
import { sealAudit, sealAuditStatus } from '@api/common'
import { getCurrentProcess } from '@/api/filingRegister/index'
import { mapState } from 'vuex'

import snEmptyData from '@/components/snEmptyData'
import penaltyUpload from '@/pages/commonHandle/components/penaltyUpload.vue'

export default {
  name: 'administrativeNotification',
  components: {
    docCard,
    ShowPdf,
    commonWrit,
    snEmptyData,
    selectPeople,
    penaltyUpload
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cancelAudit: false, // 是否取消审核，为了使showPdf提交部门负责人按钮不置灰
      docNoNames: [], // 行政处罚告知书  文书编号
      handleSuggInfo: '', // 案件调查报告的建议处理意见
      processVersion: 0, // 第几次回退
      isRecalled: '0', // 是否是回退流程： 0 正常 1 你猜正常不正常
      writTypeCode: '', // WS 开头的文书号
      info: {},
      updateWritInfo: null,
      auditInfo: {},
      visibleWritId: '',
      showPublicDialog: false,
      writType: '',
      dialogTitle: '',
      dialogContent: '',
      docList: [], // 卡片数据
      audiReq: {},
      showPdf: false,
      docTypes: [],
      buttonList: {},
      btnStatus: {
        // 不支持多份文书制作的按钮状态
        noticeDis: false, // 行政处罚告知书
        returnNoteDis: false, // 行政处罚告知书送达回执
        informDis: false // 案件告知审批表
      },
      canUploadProof: false, // 只有案件告知审批表审批通过后才能上传回执证据
      selectType: '执法人员',
      showWritSelectPeople: false,
      peopleCache: null,
      selectedPeople: null
    }
  },
  computed: {
    ...mapState(['currCaseHandle', 'writTypeInfo'])
  },
  created() {
    this.isRecalled = this.$store.state.penalty.penaltyUndEntity.processStatus
    this.processVersion = this.$store.state.penalty.penaltyUndEntity.processVersion
    this.initInfo()
    this.getReport()
  },
  methods: {
    closePdf() {
      this.initInfo()
      this.showPublicDialog = false
      this.showPdf = false
    },
    updatePdf(id) {
      this.currWritId = id
      this.showPdf = false
    },
    toLawSeal(data) {
      this.buttonList = handleBtnList(data.typeCode, true)
      this.preview(data.id, data.title)
      this.initInfo()
    },
    // 从showPdf来 审核审批/加盖公章
    sealFromPdf(obj, type) {
      if (!this.getWritFlow()) {
        return
      }
      if (this.isRecalled === '1' && !this.defineMsg('AJGZSPB')) {
        // 回退要判断下文书生成情况
        return
      }
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
        partyName: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName,
        partyId: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
      }
      if (type === 'seal') {
        // 加盖公章
        this.audiReq.auditTypeCode = 'ta80040'
      } else {
        // 审核审批
        this.audiReq.auditTypeCode = obj.auditTypeCode
        if (this.audiReq.auditTypeCode === 'ta80043') {
          // 案件告知审批表
          this.audiReq.parentTaskId = this.getTaskId()
        }
      }
      this.beforeAudit('fromPDF')
    },
    initInfo() {
      let _penalty = this.$store.state.penalty
      // 文书审核需要的信息
      this.auditInfo = {
        requestUsersName: _penalty.udtNames, // 承办人名称
        caseName: _penalty.penaltyUndEntity.caseName // 案件名称
      }
      this.getPunishInform()
    },
    // 获取案件调查报告的建议处理意见
    getReport(type) {
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: 'XZCFAJDCBG'
      }
      getWritInfo(req)
        .then(res => {
          let writ = res.data[0]
          if (writ) {
            return getWritDataByWritId({ writId: writ.writId })
          }
        })
        .then(info => {
          info.data.forEach(tag => {
            if (tag.tagName === 'tag15') {
              // 建议处理意见
              this.handleSuggInfo = tag.tagContent
            }
          })
        })
        .catch(err => console.info(err))
    },
    // 获取 taskId
    getTaskId() {
      let taskId = ''
      if (this.currCaseHandle === 4) {
        // 流程在当前节点，即传 taskId
        let task = this.$store.state.processes.get('AJSL') ? JSON.parse(this.$store.state.processes.get('AJSL')) : []
        taskId = task[0].taskId
      } else {
        // 流程非当前节点 不传 taskId
        taskId = ''
      }
      return taskId
    },
    // 案件告知审批表审核前判断以便提示
    beforeAudit(from) {
      if (from === 'fromPDF') {
        this.auditWrit()
      } else {
        this.audiReq.parentTaskId = this.getTaskId()
        this.showPublicDialog = true
        this.dialogContent = 'selectPeople'
        this.dialogTitle = '选择审核人员'
      }
    },
    // 判断是否是回退流程且案件告知审批表能否提交审核
    getWritFlow() {
      let status = true,
        count = 0
      if (this.isRecalled === '1') {
        this.docList
          .filter(d => d.writTypeName !== 'DSRCSSBBL')
          .forEach(doc => {
            if (this.processVersion > doc.writVersion && !count) {
              this.getMessage('warning', '请重新制作相应文书及回执')
              count++
              status = false
            }
          })
      }
      return status
    },
    // 文书卡片的弹框
    toSeal(audiReq, doc) {
      if (!this.getWritFlow()) {
        return
      }
      if (this.isRecalled === '1' && !this.defineMsg('AJGZSPB')) {
        // 回退要判断下文书生成情况
        return
      }
      this.audiReq = audiReq
      if (this.audiReq.auditTypeCode === 'ta80043') {
        // 案件告知审批表
        this.beforeAudit()
      } else {
        this.showPublicDialog = true
        this.dialogContent = 'selectPeople'
        this.dialogTitle = '选择审核人员'
      }
    },
    // 获取告知相关所有文书
    getPunishInform() {
      let types = ['XXCFGZ', 'CFHZ', 'AJGZSPB', 'DSRCSSBBL']
      getWritInfo({
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: types.join(',')
      }).then(res => {
        this.docList = res.data
        this.docTypes = []
        this.docNoNames = []
        let _docNoNamesObj = []
        // 文书列表是按时间顺序返回的，这边为了文书回显的文书号顺序需要排个序
        let _docTypes = ['XXCFGZ', 'CFHZ']

        this.docList.map(_doc => {
          this.docTypes.push(_doc.writTypeName)
          _docNoNamesObj[_doc.writTypeName] = _doc.writNoName
          if (_doc.writTypeName === 'AJGZSPB') { // 若有案件告知审批表，获取其审核审批状况，判断是否可上传
            this.setUploadStatus(_doc)
          }
        })
        _docTypes.map(item => {
          if (_docNoNamesObj[item]) {
            this.docNoNames.push(_docNoNamesObj[item])
          }
        })
        this.setBtnStatus(this.docTypes)
      })
    },
    // 设置按钮状态
    setBtnStatus(types) {
      if (types.indexOf('XXCFGZ') >= 0) {
        this.btnStatus.noticeDis = true
      } else {
        this.btnStatus.noticeDis = false
      }
      if (types.indexOf('CFHZ') >= 0) {
        this.btnStatus.returnNoteDis = true
      } else {
        this.btnStatus.returnNoteDis = false
      }
      if (types.indexOf('AJGZSPB') >= 0) {
        this.btnStatus.informDis = true
      } else {
        this.btnStatus.informDis = false
      }
    },
    // 判断是否可上传证据
    setUploadStatus(doc){
      sealAuditStatus({
        requestId: doc.writId
      }).then((res) => {
        let last = res.data[0]
        if (last && last.auditResultCode === 'a004') {
          this.canUploadProof = true
        }
      }).catch(err => console.info(err))
    },
    checkType(writTitle, writTypeName, writId, businessId) {
      let infoArr = [
        'writId',
        'penaltyId',
        'telphone',
        'blcList',
        'punishCompanyId',
        'caseName',
        'punishPersonName',
        'objectAddress',
        'postCode',
        'objectType',
        'responsiblePerson',
        'job',
        'subject',
        'sourceId',
        'udtIds',
        'suggestion',
        'companyId',
        'sex'
      ]
      let auditInfo = {
        // 传给文书的信息
        ...setInfo(infoArr),
        processVersion: this.processVersion, // 第几次回退
        docNoNames: this.docNoNames.join('、'),
        handleSuggInfo: this.handleSuggInfo, // 案件调查报告的建议处理意见
        isRecalled: this.isRecalled,
        docList: this.docList
      }
      if (!writId) {
        // 校验是否可以生成文书
        if (!this.defineMsg(writTypeName)) {
          return
        }

        // 从 + 按钮处 新增文书
        this.info.writId = ''
        this.currWritId = ''
        this.showPublicDialog = true
        this.dialogContent = 'writDialog'
        this.info = { writInfo: null, auditInfo }
      } else {
        // 从卡片处 修改文书
        auditInfo.writId = writId
        this.currWritId = writId
        getWritDataByWritId({ writId: writId }).then(res => {
          this.updateWritInfo = res.data
          this.info = { writInfo: this.updateWritInfo, auditInfo }
          this.docList.forEach(doc => {
            // 获取该文书的writVersion
            if (writId === doc.writId) {
              this.info.writVersion = doc.writVersion
            }
          })
          this.dialogContent = 'writDialog'
          this.showPublicDialog = true
        })
      }
      this.writType = writTitle
      this.dialogTitle = writTitle
    },
    // 判断是否能新增文书并给出相应提示
    defineMsg(type) {
      if (type === 'CFHZ' && this.docTypes.indexOf('XXCFGZ') === -1) {
        // 行政处罚告知书送达回执
        this.getMessage('warning', '请先生成行政处罚告知书')
        return false
      }
      if (type === 'AJGZSPB') {
        // 案件告知审批表
        if (this.docTypes.indexOf('XXCFGZ') === -1) {
          this.getMessage('warning', '请先生成行政处罚告知书')
          return false
        } else if (this.docTypes.indexOf('XXCFGZ') >= 0 && this.docTypes.indexOf('CFHZ') === -1) {
          this.getMessage('warning', '请先生成行政处罚告知书送达回执')
          return false
        }
      }
      return true
    },
    close() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.showPublicDialog = false
      this.dialogContent = ''
      this.dialogTitle = ''
    },
    preview(id, title, status, obj) {
      if (status) this.buttonList = status
      if (obj) {
        // 签名
        this.writTypeCode = obj.writTypeCode
      }
      this.visibleWritId = id
      this.writType = title
      this.showPdf = true
    },
    // 发消息
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    // 审核审批（盖章）
    submitToAudition(bool, auditor) {
      this.dialogContent = ''
      this.showPublicDialog = false
      if (!bool) return
      let _penalty = this.$store.state.penalty
      this.audiReq.handlerDeptId = auditor[0].deptId
      this.audiReq.handlerUserId = auditor[0].id
      this.audiReq.requestUsersIds = _penalty.penaltyUndEntity.udtIds
      this.audiReq.requestDeptName = JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name
      this.audiReq.partyName = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName
      this.audiReq.partyId = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
      this.auditWrit()
    },
    getPeople(bool, auditor) {
      this.showWritSelectPeople = false
      if (!bool) return
      this.selectedPeople = auditor
    },
    // 调用审核审批接口
    auditWrit() {
      sealAudit(this.audiReq)
        .then(res => {
          this.closePdf()
          this.getMessage('success', '提交审核成功！')

          this.initInfo()
        })
        .catch(err => console.info(err))
    },
    createWrit(reqData) {
      // 调用接口生成文书
      let isBack, writVersion
      if (reqData.writType === 'DSRCSSBBL') {
        isBack = false
      } else {
        isBack = !!Number(this.isRecalled)
        writVersion = this.processVersion
        reqData.writVersion = this.processVersion
      }
      if (this.currWritId) {
        // 重新创建
        // 判断是否是回退 且 是否为当事人陈述申辩笔录（不用审核审批）
        updateWrit({ writId: this.currWritId, isBack: isBack, writVersion: writVersion }, reqData.data)
          .then(res => {
            this.getMessage('success', '制作成功！')
            this.buttonList = handleBtnList(res.writType)
            this.writTypeCode = res.writType
            this.currWritId = res.writId
            this.preview(res.writId, this.writType)
            this.initInfo()
          })
          .catch(err => {
            this.getMessage('error', '制作失败！')
          })
      } else {
        createWrit(reqData)
          .then(res => {
            this.getMessage('success', '制作成功！')
            this.buttonList = handleBtnList(res.writType)
            this.writTypeCode = res.writType
            this.preview(res.writId, this.writType)
            this.initInfo()
          })
          .catch(err => {
            console.info('err', err)
            this.getMessage('error', '制作失败！')
          })
      }
    },
    // 上传回执证据
    uploadFile() {
      this.$refs.penaltyUpload.addProof()
    },
    // 打开选择人员弹框
    selectPeople(type, cache) {
      this.selectType = type === 'contactor' ? '联系人' : '执法人员'
      this.peopleCache = [cache]
      this.showWritSelectPeople = true
    },
    wsClose() {
      this.showWritSelectPeople = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
  top: 0 !important;
}

.body-content-button {
  padding-top: 18px;

  .body-button {
    border-radius: 5px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 6px;
    height: 28px;
    padding: 7px 8px;
    margin-left: 0;
    margin-bottom: 5px;

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

.bolder {
  font-weight: bolder;
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
  height: auto;

  /deep/ .el-dialog {
    height: auto;
    padding-bottom: 10px;
    margin-top: 5vh !important;
  }
}
</style>
