<template>
  <div class="examine-container">
    <sn-page-bar>
      <template slot="button">
        <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
      </template>
      <!-- <div class="bar-title">行政处罚听证</div> -->
      <el-row class="examine-content">
        <el-col :span="24" class="col-left">
          <div class="buttons" v-if="!onlyRead">
            <el-button type="primary" mini @click="addProof">+ 当事人听证申请</el-button>
            <el-button type="primary" :disabled="isDisable || hasSubmitAudit" mini @click="checkType('行政处罚听证会通知书')">+ 行政处罚听证会通知书</el-button>
            <!-- <el-button type="primary" mini @click="checkType('行政处罚听证会通知书')">+ 行政处罚听证会通知书</el-button> -->
            <el-button type="primary" :disabled="isDisable || hasSubmitAudit" mini @click="checkType('行政处罚听证会通知书送达回执')"
              >+ 行政处罚听证会通知书送达回执</el-button
            >
            <el-button type="primary" :disabled="isDisable || hasSubmitAudit" mini @click="checkType('听证笔录')">+ 听证笔录</el-button>
            <el-button type="primary" :disabled="isReportDis || isDisable" mini @click="checkType('听证会报告书')">+ 听证会报告书</el-button>
          </div>
          <div class="doc-container">
            <doc-card
              v-for="(docItem, index) of docList"
              :key="index"
              :docData="docItem"
              :auditInfo="auditInfo"
              :readOnly="onlyRead"
              @afterDelete="initPage"
              @afterUpload="initPage"
              @previewWrit="preview"
              @modifyWrit="checkType"
              @toSeal="toSeal"
              @submit="toSeal"
              @toLawSeal="toLawSeal"
            ></doc-card>
          </div>
          <sn-empty-data text="暂无听证会相关文书" v-if="docList.length === 0"></sn-empty-data>

          <section class="proof-list">
            <div v-for="(item, index) in proofList" :key="index" class="proof">
              <down-proof v-if="!!item" :type="'deleteAccessory'" :proof="item" :canDel="!onlyRead" @afterDel="afterDelProof"></down-proof>
            </div>
            <div class="upload-proof">
              <upload-proof
                ref="proof"
                v-show="(hideUploadBox && !onlyRead) || (proofList.length > 0 && !onlyRead)"
                :uploadType="'uploadAccessory'"
                :fileDetail="uploadReq"
                @getUploadMsg="afterUpload"
              ></upload-proof>
            </div>
          </section>
        </el-col>
      </el-row>
    </sn-page-bar>

    <!-- <bottom-bar>
      <el-button type="primary" @click="back">返回</el-button>
    </bottom-bar>-->

    <!--  -->
    <el-dialog width="1000px" :visible.sync="showDialog" :title="dialogTitle" :before-close="close">
      <common-writ
        v-if="showDialog && dialogContent === 'writDialog'"
        :info="info"
        :writType="writType"
        :selectedPeople="selectedPeople"
        @selectPeople="selectPeople"
        @selectPeoples="selectPeoples"
        @createWrit="createWrit"
        @close="close"
      ></common-writ>

      <select-people v-if="dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <el-dialog
      :title="chooseTitle"
      :modal-append-to-body="true"
      class="peopleDialog"
      :visible.sync="peopleVisiable"
      width="900px"
      height="600px"
      :lose-on-click-modal="false"
    >
      <select-people @getPeople="getSelectedPeople" :selectNum="1" :peopleCache="peopleCache"></select-people>
    </el-dialog>
    <el-dialog
      :title="chooseTitles"
      :modal-append-to-body="true"
      class="peopleDialog"
      :visible.sync="peoplesVisiable"
      width="900px"
      height="600px"
      :lose-on-click-modal="false"
    >
      <select-people @getPeople="getSelectedPeople" :minNum="2" :peopleCache="peoplesCache"></select-people>
    </el-dialog>
    <show-pdf
      :pdfId="visibleWritId"
      :writName="writName"
      :writTypeCode="writTypeCode"
      :isNotZcr="isNotZcr"
      v-if="showPdf"
      @closePdf="closePdf"
      @updatePdf="updatePdf"
      @sealPdf="sealFromPdf($event, 'seal')"
      @auditPdf="sealFromPdf"
      @finishPdf="closePdf"
      :buttonList="buttonList"
    ></show-pdf>
  </div>
</template>

<script>
import bottomBar from '@/components/bottomBar'
import snPageBar from '@/components/snPageBar'
import TimeLine from '@/components/TimeLine'
import docCard from '@/components/docCard'
import commonWrit from '@/components/commonWrit'
import showPdf from '@/components/showPdf'
import snEmptyData from '@/components/snEmptyData'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { dateFormat } from '@/utils/util'
import { createWrit, updateWrit } from '@api/fileRelated'
import { getPenaltyhearinfo, penaltyhearComplete } from '@/api/penatlyHear'

import { sealAuditStatus, sealAudit } from '@api/common'
import { handleBtnList } from '@/utils/audit'

import snAddButton from '@/components/snAddButton'
import downProof from '@components/downProof/index'
import uploadProof from '@components/uploadProof/index'
import { getFile } from '@api/anjianshenli'
export default {
  components: {
    snPageBar,
    TimeLine,
    docCard,
    commonWrit,
    showPdf,
    snEmptyData,
    selectPeople,
    bottomBar,
    snAddButton,
    downProof,
    uploadProof
  },
  props: {
    itemInfo: {
      type: Object
    },
    pageType: {
      type: String
    }
  },
  data() {
    return {
      isDisable: true, // 是否上床听证材料
      writTypeCode: '', // WS 开头的文书号
      docList: [],
      info: {},
      showDialog: false,
      dialogContent: '',
      writType: '',
      currWritId: '',
      visibleWritId: '',
      dialogTitle: '',
      selectedPeople: [],
      peopleVisiable: false,
      peoplesVisiable: false,
      currSelectPeopleType: '', // 选择人员的类型
      audiReq: {},
      auditInfo: {},
      onlyRead: false,
      showPdf: false,
      isReportDis: false, // 听证会报告书只允许做一份
      buttonList: {
        updatePdf: true, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      writName: '',
      proofList: [],
      hideUploadBox: false,
      uploadReq: {
        penaltyId: this.itemInfo.caseId,
        sourceType: 'tzsh'
      }, // 设置上传证据材料的参数
      peopleCache: [],
      peoplesCache: [],
      docTypes: [],
      hasSubmitAudit: false,
      isNotZcr: false, // 不是主持人不能签名的情况
      chooseTitle: '请选择执法人员',
      chooseTitles: '请选择执法人员'
    }
  },
  created() {
    if (this.pageType === 'preview') {
      this.onlyRead = true
    }
  },
  mounted() {
    this.initPage()
    this.initProof()
  },
  methods: {
    initPage() {
      console.info('this.itemInfo', this.itemInfo)
      // 文书审核需要的信息
      this.auditInfo = {
        requestUsersName: this.itemInfo.executorName, // 承办人名称
        caseName: this.itemInfo.caseName, // 案件名称
        partyName: this.itemInfo.partyName
        // companyId: this.
      }
      getPenaltyhearinfo({
        id: this.itemInfo.id
      }).then(res => {
        if (res.code === '0') {
          this.docList = res.data.writList
          let count = 0
          this.docTypes = []
          this.docList.forEach(val => {
            this.docTypes.push(val.writTypeName)
            if (val.writTypeName === 'TZHBGS') {
              if(!val.isUserSign) {
                this.isNotZcr = true
              } else {
                this.isNotZcr = false
              }
              count++
              // coding 等君文给我返code
              // a01 待审核
              //
              if (val.auditStatusCode === 'a01') {
                this.hasSubmitAudit = true
              }
            }
          })
          if (count) {
            this.isReportDis = true
          } else {
            this.isReportDis = false
          }
        }
      })
    },
    initProof() {
      getFile(this.uploadReq)
        .then(res => {
          let _proofs = res.data
          this.proofList = []
          _proofs.forEach(proof => {
            let proofObj = this.getProofObj(proof)
            this.proofList.push(proofObj)
          })
        })
        .catch(err => console.info(err))
    },
    // 处理证据
    getProofObj(proof) {
      return {
        accessoryDownUrl: proof.accessoryUrl, // 附件下载url
        accessoryId: proof.accessoryId, // 附件id
        accessoryName: proof.accessoryName, // 附件名字
        accessoryType: '', // 附件类型
        accessoryUrl: proof.accessoryImgUrl, // 附件在线显示url
        id: proof.penaltyId // 证据关联的id
      }
    },
    // 上传附件后
    afterUpload(res) {
      let proofObj = this.getProofObj(res.data)
      this.proofList.push(proofObj)
    },
    // 删除附件后
    afterDelProof(accessoryId) {
      let delIndex
      this.proofList.forEach((proof, index) => {
        if (proof.accessoryId === accessoryId) {
          delIndex = index
        }
      })
      this.proofList.splice(delIndex, 1)
    },
    // 已上传听证材料
    getEnoughProof(bool) {
      this.isDisable = bool
    },
    addProof() {
      this.hideUploadBox = true
      this.$refs.proof.$refs.inner_upload.$children[0].handleClick()
    },
    updatePdf(id) {
      this.currWritId = id
      this.showPdf = false
    },
    // 从showPdf来 审核审批/加盖公章/加盖执法专用章
    sealFromPdf(obj, type) {
      // let _penalty = this.$store.state.penalty;
      let audiReq = {
        auditTypeCode: '',
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name,
        requestId: obj.pdfId,
        requestTime: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        requestUsersName: this.itemInfo.executorName,
        submitterCause: this.itemInfo.caseName,
        requestUsersIds: this.itemInfo.executorId,
        partyName: this.itemInfo.partyName,
        partyId: this.itemInfo.companyId
      }
      console.info('sealFromPDF', audiReq)
      // return
      if (type === 'seal') {
        // 加盖公章
        audiReq.auditTypeCode = 'ta80040'
      } else {
        // 审核审批
        audiReq.auditTypeCode = obj.auditTypeCode
      }
      if (audiReq.auditTypeCode === 'ta80049') {
        // 听证会报告书
        audiReq.parentTaskId = this.itemInfo.parentTaskId
      }
      sealAudit(audiReq).then(res => {
        this.$message({
          type: 'success',
          message: '提交审核成功！'
        })
        this.closePdf()
        this.initPage()
      })
    },
    closePdf() {
      this.initPage()
      this.showDialog = false
      this.showPdf = false
    },
    checkType(type, writType, writId) {
      if (this.defineMsg(type)) {
        return
      }
      this.writName = type
      this.info = {
        caseName: this.itemInfo.caseName,
        partyName: this.itemInfo.partyName,
        id: this.itemInfo.id,
        caseId: this.itemInfo.caseId,
        executorId: this.itemInfo.executorId,
        brothers: this.docList,
        companyId: this.itemInfo.companyId
      }

      this.dialogTitle = type
      if (!writType) {
        this.currWritId = ''
      } else {
        this.info.writId = writId
        this.currWritId = writId
      }

      this.writType = type
      this.showDialog = true
      this.dialogContent = 'writDialog'
    },
    defineMsg(type) {
      // this.docList
      if (type === 'XZCFTZHTZSSDHZ' && this.docTypes.indexOf('XXCFTZHTZS')) {
        this.$message({
          type: 'warning',
          message: '请先生成行政处罚听证会通知书'
        })
      }
      return false
    },
    back() {
      this.$store.commit('setCurrHearingComp', 'dataDisplay')
    },
    // 文书调用人员弹框
    selectPeople(type, cache) {
      switch (type) {
        case 'lxr':
          this.chooseTitle = '请选择联系人'
          break;
        case 'clerk':
          this.chooseTitle = '请选择书记员'
          break;
        case 'moderator':
          this.chooseTitle = '请选择主持人'
          break;
        case 'hearings':
          this.chooseTitle = '请选择听证员'
          break;
        default:
          this.chooseTitle = '请选择执法人员'
          break;
      }
      this.currSelectPeopleType = type
      console.info('cache', cache)
      if (!cache.id) {
        this.peopleCache = []
      } else {
        this.peopleCache = [cache]
      }

      this.peopleVisiable = true
    },
    selectPeoples(type, cache) {
      switch (type) {
        case 'hearings':
          this.chooseTitles = '请选择听证员'
          break;
        case 'investigators':
          this.chooseTitles = '请选择调查人员'
          break;
      }
      
      this.currSelectPeopleType = type
      if (cache.length === 0) {
        this.peoplesCache = []
      } else {
        this.peoplesCache = cache
      }
      this.peoplesVisiable = true
    },
    getSelectedPeople(bool, auditor) {
      this.peopleVisiable = false
      this.peoplesVisiable = false
      // 选完执法人员
      if (!bool) {
        return
      }
      if (auditor.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择审核人员',
          type: 'error'
        })
      } else {
        auditor.map(item => {
          item._selfType = this.currSelectPeopleType
        })
        this.selectedPeople = JSON.parse(JSON.stringify(auditor))
      }
    },
    createWrit(reqData) {
      // 调用接口生成文书
      let isUpt = 0
      if (reqData.writType === 'TZBL' || reqData.writType === 'TZHBGS') {
        isUpt = 1
      }
      if (this.currWritId) {
        // 重新创建
        updateWrit({ writId: this.currWritId, isUpt: isUpt }, reqData.data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '制作成功'
            })
            this.writTypeCode = res.writType
            this.buttonList = handleBtnList(res.writType)
            this.preview(this.currWritId)
            this.initPage()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '制作失败'
            })
          })
      } else {
        reqData.isUpt = isUpt;
        createWrit(reqData)
          .then(res => {
            this.$message({
              type: 'success',
              message: '制作成功'
            })
            this.writTypeCode = res.writType
            this.buttonList = handleBtnList(res.writType)
            this.preview(res.writId)
            this.initPage()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '制作失败'
            })
          })
      }
    },
    preview(id, title, status, doc) {
      if (doc) {
        // 签名
        this.writTypeCode = doc.writTypeCode
      }
      if (title) this.writName = title
      if (status) this.buttonList = status
      this.showPdf = true
      this.visibleWritId = id
    },
    close() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.showDialog = false
      this.dialogContent = ''
      this.dialogTitle = ''
    },
    // 审核审批（盖章）
    submitToAudition(bool, auditor) {
      this.dialogContent = ''
      this.showDialog = false
      if (!bool) return
      this.audiReq.handlerDeptId = auditor[0].deptId
      this.audiReq.handlerUserId = auditor[0].id
      this.audiReq.requestTime = dateFormat(new Date(), 'yyyy年mm月dd日')
      this.audiReq.requestDeptName = JSON.parse(localStorage.getItem('res')).userEntity.deptName
      this.audiReq.partyName = this.itemInfo.partyName
      this.audiReq.partyId = this.itemInfo.companyId
      if (this.audiReq.auditTypeCode === 'ta80049') {
        // 听证会报告书
        this.audiReq.parentTaskId = this.itemInfo.parentTaskId
      }
      // 调用接口向下走流程
      sealAudit(this.audiReq)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.initPage()
        })
        .catch(err => console.info(err))
    },
    toSeal(audiReq) {
      this.audiReq = audiReq
      this.showDialog = true
      this.dialogContent = 'selectPeople'
      this.dialogTitle = '选择审核人员'
    },
    finishHearing() {
      penaltyhearComplete({
        id: this.itemInfo.id
      }).then(res => {
        if (res.code === '0') {
          this.back()
        }
      })
    },
    // 加盖执法专用章后回调
    toLawSeal(data) {
      this.buttonList = handleBtnList(data.typeCode, true)
      this.preview(data.id, data.title)
      this.initPage()
    }
  },
  watch: {
    itemInfo: {
      handler: function(val, oldVal) {
        if (!val.id) alert(1)
      },
      deep: true
    },
    proofList: {
      handler: function(nv, ov) {
        if (nv.length > 0) {
          this.getEnoughProof(false)
        } else if (nv.length === 0) {
          this.getEnoughProof(true)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.examine-container {
  position: relative;
  .examine-content {
    margin-top: 25px;
    .col-left {
      padding-right: 25px;
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
      .input-bar {
        height: 35px;
        line-height: 35px;
        width: 100%;
        display: flex;
        flex-direction: row;
        .input-name {
          margin-right: 10px;
        }
        .input {
          width: 85%;
        }
      }
      .tabs {
        margin-top: 20px;
      }
      .buttons {
        margin-bottom: 16px;
        .el-button {
          margin-left: 0;
        }
      }
    }
  }
  /deep/ .create-bar {
    min-height: 70vh;
  }
  .doc-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .doc-card {
      margin-bottom: 18px;
    }
  }
  footer.hearing {
    width: 100%;
    position: absolute;
    padding: 11px 0;
    margin-top: 0;
    text-align: center;
  }
}
</style>
