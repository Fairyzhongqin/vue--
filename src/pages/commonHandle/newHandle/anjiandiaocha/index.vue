<template>
  <div class="ajdc-container penalty-bottom_button">
    <div class="create-tab-title">案件调查</div>
    <div class="button-bar-top" v-if="!forBrowse">
      <el-button type="primary" size="mini" @click="checkType('询问通知书')">+ 询问通知书</el-button>
      <el-button type="primary" size="mini" @click="checkType('询问笔录')">+ 询问笔录</el-button>
      <el-button type="primary" size="mini" @click="checkType('送达地址确认书')">+ 送达地址确认书</el-button>
      <el-button type="primary" size="mini" @click="checkType('勘验笔录')">+ 勘验笔录</el-button>
      <el-button type="primary" size="mini" @click="checkType('抽样取证凭证')">+ 抽样取证凭证</el-button>
      <el-button type="primary" size="mini" @click="checkType('鉴定委托书')">+ 鉴定委托书</el-button>
      <el-button type="primary" size="mini" @click="checkType('先行登记保存证据审批表')">+ 先行登记保存证据审批表</el-button>
      <el-button type="primary" size="mini" @click="checkType('先行登记保存证据通知书')">+ 先行登记保存证据通知书</el-button>
      <el-button type="primary" size="mini" @click="checkType('先行登记保存证据处理审批表')">+ 先行登记保存证据处理审批表</el-button>
      <el-button type="primary" size="mini" @click="checkType('先行登记保存证据处理决定书')">+ 先行登记保存证据处理决定书</el-button>
    </div>
    <div class="doc-container">
      <template v-if="docList.length !== 0">
        <doc-card
          v-for="(docItem, index) of docList"
          :key="index"
          :docData="docItem"
          :isRecalled="isRecalled"
          :processVersion="processVersion"
          :readOnly="forBrowse"
          @afterDelete="initInfo"
          @toLawSeal="lawSeal"
          @modifyWrit="checkType"
          @previewWrit="preview"
          @afterUpload="initInfo"
          @toSeal="toSeal"
          @submit="toSeal"
        ></doc-card>
      </template>
    </div>

    <penalty-upload :sourceType="'ajdc'" :btnText="'调查取证材料'" :forBrowse="forBrowse"></penalty-upload>
    <bottom-bar v-if="!forBrowse">
      <el-button type="primary" @click="endInvestigation">案件调查结束</el-button>
    </bottom-bar>
    <el-dialog
      class="big-dialog"
      :class="{ 'query-record': (writType === '询问笔录' || writType === '勘验笔录')&&dialogContent === 'writDialog' }"
      width="900px"
      height="500px"
      :visible.sync="showPdfDialog"
      :title="dialogTitle"
      :before-close="close"
    >
      <common-writ
        v-if="showPdfDialog && dialogContent === 'writDialog'"
        :info="info"
        :writType="writType"
        :isRecalled="isRecalled"
        @toLawSeal="initInfo('lawSeal')"
        @createWrit="createWrit"
        @close="close"
      ></common-writ>
      <select-people v-if="showPdfDialog && dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <show-pdf
      :pdfId="visibleWritId"
      v-if="showPdf"
      @sealPdf="sealFromPdf($event, 'seal')"
      @updatePdf="updatePdf"
      @closePdf="closePdf"
      @auditPdf="sealFromPdf"
      @finishPdf="closePdf"
      :writTypeCode="writTypeCode"
      :buttonList="buttonList"
      :writName="writName"
    ></show-pdf>
  </div>
</template>

<script>
import bottomBar from '@/components/bottomBar'
import docCard from '@/components/docCard'

import penaltyUpload from '@/pages/commonHandle/components/penaltyUpload.vue'
import { getInvesWrits, createWrit, updateWrit, deleteWrit, getWritInfo, getWritDataByWritId } from '@api/fileRelated'
import { finishPro } from '@api/common'
import commonWrit from '@/components/commonWrit'
import { dateFormat, debounce } from '@/utils/util'
import { getMessage, handleBtnList, setInfo } from '@/utils/audit'
import { getCurrentProcess } from '@/api/filingRegister/index'
import { sealAudit } from '@api/common'
import ShowPdf from '@/components/showPdf'

import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'

export default {
  name: 'anjiandiaocha',
  components: {
    docCard,
    penaltyUpload,
    commonWrit,
    ShowPdf,
    bottomBar,
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
      writTypeCode: '', // ws开头的code
      processVersion: 0, // 第几次回退
      isRecalled: '0', // 是否是回退流程： 0 正常 1 你猜正常不正常
      info: {},
      writType: '',
      docList: [],
      visibleWritId: '', // 浏览文书的id
      showPdfDialog: false, // 是否显示dialog
      dialogContent: '', // 展示哪个 dialog
      dialogTitle: '', // dialog 框标题
      currWritId: '', // 当前正在处理的文书id
      showPdf: false,
      buttonList: {},
      writName: '', // 所浏览文书的文书名
      audiReq: null
    }
  },
  created() {
    this.isRecalled = this.$store.state.penalty.penaltyUndEntity.processStatus
    this.processVersion = this.$store.state.penalty.penaltyUndEntity.processVersion
    this.initInfo()
    this.endInvestigation = debounce(this.endInvestigation, 1000, true)
  },
  methods: {
    // 公章
    toSeal(audiReq) {
      this.audiReq = audiReq
      this.showPdfDialog = true
      if (['ta80008', 'ta80011'].includes(audiReq.auditTypeCode)) {
        this.dialogTitle = '选择审查人员'
      } else if (audiReq.auditTypeCode === 'ta80040') {
        this.dialogTitle = "选择盖章人员"
      } else {
        this.dialogTitle = '选择审核人员'
      }
      this.dialogContent = 'selectPeople'
    },
    // 审核审批
    submitToAudition(bool, auditor) {
      let _penalty = this.$store.state.penalty
      this.dialogContent = ''
      this.showPdfDialog = false
      if (!bool) return
      this.audiReq.requestDeptName = JSON.parse(sessionStorage.getItem('userInfo')).userEntity.deptName
      this.audiReq.handlerDeptId = auditor[0].deptId
      this.audiReq.handlerUserId = auditor[0].id
      this.audiReq.requestTime = dateFormat(new Date(), 'yyyy年mm月dd日')
      this.audiReq.requestUsersIds = _penalty.penaltyUndEntity.udtIds
      ;(this.audiReq.submitterCause = _penalty.penaltyUndEntity.caseName),
        (this.audiReq.partyName = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName),
        (this.audiReq.partyId = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : '')
      this.auditWrit()
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
        partyName: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName,
        partyId: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
      }
      if (type === 'seal') {
        // 加盖公章
        this.audiReq.auditTypeCode = 'ta80040'
      } else {
        // 审核审批
        this.audiReq.auditTypeCode = obj.auditTypeCode
      }
      this.auditWrit()
    },
    // 调用审核审批接口
    auditWrit() {
      sealAudit(this.audiReq)
        .then(res => {
          this.getMessage('success', '提交审核成功！')
          this.initInfo()
          this.closePdf()
        })
        .catch(err => console.info(err))
    },
    initInfo(type) {
      if (type === 'lawSeal') {
        this.preview()
      }
      let _penalty = this.$store.state.penalty
      // 获取案件调查文书
      const writsReq = {
        penaltyId: _penalty.penaltyUndEntity.penaltyId
      }
      getInvesWrits(writsReq)
        .then(res => {
          this.docList = res.data
        })
        .catch(err => console.info(err))
    },
    endInvestigation() {
      let task = this.$store.state.processes.get('AJDC') ? JSON.parse(this.$store.state.processes.get('AJDC')) : []
      if (task.length === 0 || !task) {
        this.getMessage('warning', '案件调查已经结束了。')
        return
      }
      this.$confirm('确定结束案件调查？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          this.confirmFinish(task)
        })
        .catch(() => {})
    },
    confirmFinish: function(task) {
      // 获取 taskId
      const endReq = {
        taskId: task[0].taskId,
        undertakerIds: task[0].vars.undertakerIds
      }
      const prosReq = {
        businessKey: this.$store.state.penalty.penaltyUndEntity.penaltyId
      }
      finishPro(endReq)
        .then(res => {
          this.getMessage('success', '案件调查已结束！')
          // 获取当前流程及我的任务
          return getCurrentProcess(prosReq)
        })
        .then(res => {
          this.$store.commit('setCurrProcesses', res.data)
          this.$emit('initNodes')
        })
        .catch(err => {
          this.getMessage('error', '案件调查结束失败！')
        })
    },
    // 获取某文书
    getWritId(req) {
      getWritInfo(req)
        .then(res => {
          this.currWritId = res.data[0] ? res.data[0].writId : ''
          this.info.writId = this.currWritId
          this.info.writVersion = res.data[0] ? res.data[0].writVersion : ''
        })
        .catch(err => console.info(err))
    },
    checkType(writTitle, writTypeName, writId, businessId) {
      let _penalty = this.$store.state.penalty
      let infoArr = [
        'writId',
        'caseName',
        'responsiblePerson',
        'subject',
        'sourceId',
        'idCard',
        'age',
        'udtIds',
        'objectType',
        'punishCompanyId',
        'companyId',
        'currentCompany',
        'objectAddress'
      ]
      let auditInfo = setInfo(infoArr)
      if (!writTypeName) {
        // 从 + 按钮处 新增文书
        this.info.writId = ''
        this.currWritId = ''
        this.showPdfDialog = true
        this.dialogContent = 'writDialog'
        this.info = { writInfo: null, auditInfo }
      } else {
        // 从卡片处 修改文书
        getWritDataByWritId({ writId: writId }).then(res => {
          this.showPdfDialog = true
          this.dialogContent = 'writDialog'
          this.info = { writInfo: res.data, auditInfo }
          this.info.auditInfo.writId = writId
        })
        this.currWritId = writId
      }
      this.writType = writTitle
      this.dialogTitle = writTitle
    },
    createWrit(reqData) {
      // 调用接口生成文书
      let isBack = !!Number(this.isRecalled)
      let writVersion = this.processVersion
      reqData.writVersion = this.processVersion
      let isUpt = 0
      if (reqData.writType === 'KYBL') {
        isUpt = 1
      }
      if (this.currWritId) {
        // 重新创建
        updateWrit({ writId: this.currWritId, isBack: isBack, writVersion: writVersion, isUpt: isUpt }, reqData.data)
          .then(res => {
            this.getMessage('success', '制作成功！')
            this.buttonList = handleBtnList(res.writType)
            this.currWritId = res.writId
            this.writTypeCode = res.writType
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
            this.buttonList = handleBtnList(res.writType)
            this.writTypeCode = res.writType
            this.preview(res.writId, this.writType)
            this.initInfo()
          })
          .catch(err => {
            this.getMessage('error', '制作失败！')
          })
      }
    },
    // 提示信息
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    closePdf() {
      this.initInfo()
      this.showPdfDialog = false
      this.showPdf = false
    },
    // 回退编辑
    updatePdf(id) {
      this.currWritId = id // 防止重做事生成新的文书
      this.showPdf = false
    },
    close() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.showPdfDialog = false
      this.dialogContent = ''
      this.dialogTitle = ''
    },
    // 加盖执法章后
    lawSeal(data) {
      this.buttonList = handleBtnList(data.typeCode, true)
      this.preview(data.id, data.title)
      this.initInfo()
    },
    // 纯粹浏览文书
    preview(id, title, status) {
      if (status) this.buttonList = status
      this.writName = title
      this.visibleWritId = id
      this.showPdf = true
    }
  }
}
</script>

<style lang="less" scoped>
.ajdc-container {
  position: relative;

  .button-bar-top {
    height: 80px;
    line-height: 35px;
  }

  .doc-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .doc-card {
      margin-bottom: 18px;
    }
  }

  .proof-list {
    display: grid;
    grid: repeat(4, 24%);
    grid-template-columns: repeat(4, 22%);
    justify-content: space-between;
    width: 100%;
    margin-top: 21px;

    .proof {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
}

.query-record.query-record {
  overflow: hidden;
  // top: auto;
  /deep/ .el-dialog {
    height: 100% !important;
    width: 100vw !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    /deep/ .el-dialog__body {
      position: relative;
      height: 100% !important;
    }
  }
}
.end_investigation {
  width: 100%;
  margin-top: 25px;
  text-align: center;
  position: absolute;

  button {
    margin: 0 auto;
  }
}

/deep/ .el-dialog {
  margin-top: 15vh;
  width: 800px;
}

/deep/ .el-dialog__header {
  padding: 17px 20px 10px;
}

/deep/ .el-dialog__wrapper .el-dialog__footer {
  margin-top: 15px;
  padding: 0;
  line-height: 42px;
  padding-right: 10px;
}

/deep/ .el-dialog__title {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}

.button-bar-top {
  /deep/ .el-button {
    height: 28px;
    padding: 7px 8px;
    margin-left: 0;
    background: rgba(0, 153, 255, 1);
  }
}

.penalty-bottom_button {
  /deep/ .bottom-button-container {
    right: 0;
  }
}
</style>
