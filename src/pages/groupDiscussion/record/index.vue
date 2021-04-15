<template>
  <div class="examine-container">
    <sn-page-bar>
      <template slot="button">
        <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
      </template>
      <!-- <div class="bar-title">集体讨论记录</div> -->

      <el-row class="examine-content">
        <el-col :span="24" class="col-left">
          <div class="buttons" v-if="itemInfo.compType === 'record'">
            <el-button type="primary" mini @click="checkType('行政处罚集体讨论记录')">+ 集体讨论记录</el-button>
          </div>
          <div class="doc-container">
            <doc-card
              v-for="(docItem, index) of docList"
              :key="index"
              :docData="docItem"
              :now="now"
              :readOnly="onlyRead"
              @afterDispatch="initPage"
              @afterDelete="initPage"
              @afterUpload="initPage"
              @previewWrit="preview"
              @modifyWrit="checkType"
              @toSeal="toSeal"
            ></doc-card>
          </div>
          <sn-empty-data text="暂无集体讨论记录" v-if="!docList || docList.length === 0"></sn-empty-data>
        </el-col>
      </el-row>
    </sn-page-bar>
    <bottom-bar v-if="itemInfo.compType === 'record' && docList.length !== 0 && itemInfo.isFinish === '0'">
      <el-button type="primary" :disabled="!isAllSigned" @click="finishDiscussion">结束集体讨论</el-button>
    </bottom-bar>

    <el-dialog width="990px" :visible.sync="showDialog" :title="dialogTitle" :before-close="close" top="8vh">
      <common-writ
        v-if="showDialog && dialogContent === 'writDialog'"
        :info="info"
        :writType="writType"
        :selectedPeople="selectedPeopleArr"
        @selectPeople="selectPeople"
        @selectPeoples="selectPeoples"
        @cachePeople="cachePeople"
        @createWrit="createWrit"
        @close="close"
      ></common-writ>
      <select-people v-if="dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <el-dialog title="结束集体讨论" class="finishDialog" :visible.sync="finishVisiable" width="380px" :close-on-click-modal="false">
      <select-type :currentId="currentId" @hasFinish="back"></select-type>
    </el-dialog>
    <!-- 文书选择人员 单选 start -->
    <el-dialog
      :title="`请选择${peopleTitle}`"
      top="8vh"
      :modal-append-to-body="false"
      class="peopleDialog"
      :visible.sync="peopleVisiable"
      width="990px"
      height="570px"
      :lose-on-click-modal="false"
    >
      <select-people @getPeople="getSelectedPeople" :peopleCache="peopleCache" :selectNum="1"></select-people>
    </el-dialog>
    <!-- 文书选择人员 end -->
    <el-dialog
      :title="`请选择${peopleTitles}`"
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
      :buttonList="buttonList"
      v-if="showPdf"
      @updatePdf="updatePdf"
      @finishPdf="finishPdf"
      @closePdf="finishPdf"
    ></show-pdf>
  </div>
</template>

<script>
import bottomBar from '@/components/bottomBar'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import snPageBar from '@/components/snPageBar'
import TimeLine from '@/components/TimeLine'
import docCard from '../components/discussCard'
import { getPenaltydiscInfo, getGroupRecords } from '@/api/groupDiscussion'
import commonWrit from '@/components/commonWrit'
import showPdf from '@/components/showPdf'
import snEmptyData from '@/components/snEmptyData'
import selectType from '../components/selectType'
import {
  // getInvesWrits,
  createWrit,
  updateWrit,
  deleteWrit,
  getWritInfo
  // getPunishInform
} from '@api/fileRelated'
import { sealAuditStatus, sealAudit } from '@api/common'
import { dateFormat } from '@/utils/util'
export default {
  components: {
    snPageBar,
    bottomBar,
    docCard,
    commonWrit,
    showPdf,
    snEmptyData,
    selectType,
    selectPeople
  },
  props: {
    itemInfo: {
      type: Object
    }
  },
  created() {
    this.initPage()
  },
  data() {
    return {
      isAllSigned: true, // 所有文书都签过名
      docList: [],
      info: {}, // 文书制作info
      showDialog: false,
      dialogContent: '',
      writType: '',
      dialogTitle: '',
      currWritId: '',
      visibleWritId: '', // 浏览文书id
      currentId: '', // 结束流程用到的id
      finishVisiable: false,
      selectedPeopleArr: [],
      peopleVisiable: false,
      peoplesVisiable: false,
      audiReq: {},
      showPdf: false,
      onlyRead: false,
      writName: '行政处罚集体讨论记录',
      buttonList: {
        updatePdf: true, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      now: void 0, // 服务器的当前时间
      peopleCache: [],
      peoplesCache: [],
      peopleTitle: '执法人员',
      peopleTitles: '执法人员',
      currSelectPeopleType: ''
    }
  },
  methods: {
    initPage() {
      if (this.itemInfo.compType === 'preview') {
        this.onlyRead = true
      }
      getGroupRecords({
        id: this.itemInfo.id
      }).then(res => {
        this.docList = res.data
        this.now = res.nowTime
        if (this.docList) {
          this.docList.forEach(doc => {
            if (doc.writInfo.writStatus != 3) {
              this.isAllSigned = false
            }
          })
        }
      })
    },
    back() {
      this.finishVisiable = false
      this.$store.commit('setCurrDiscussionComp', 'dataDisplay')
    },
    checkType(type, writType, writId) {
      this.peopleCache = []
      this.info = {
        caseName: this.itemInfo.caseName,
        caseId: this.itemInfo.caseId,
        executorId: this.itemInfo.executorId,
        businessId: this.itemInfo.id,
        flag: this.itemInfo.flag,
          companyId:this.itemInfo.companyId
      }

      this.dialogTitle = '行政处罚集体讨论记录'
      if (!writType) {
        // +
        this.currWritId = ''
      } else {
        this.info.writId = writId
        this.currWritId = writId
      }

      this.writType = type
      this.showDialog = true
      this.dialogContent = 'writDialog'
    },
    createWrit(reqData) {
      this.buttonList = {
        updatePdf: true, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      }
      // 调用接口生成文书
      if (this.currWritId) {
        // 重新创建
        updateWrit({ writId: this.currWritId, isUpt: 1 }, reqData.data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '修改文书成功！'
            })
            this.preview(this.currWritId)
            this.initPage()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '修改文书失败！'
            })
          })
      } else {
        createWrit(reqData)
          .then(res => {
            this.$message({
              type: 'success',
              message: '生成文书成功！'
            })
            this.preview(res.writId)
            this.initPage()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '生成文书失败！'
            })
          })
      }
    },
    finishDiscussion() {
      this.currentId = this.itemInfo.id
      this.finishVisiable = true
    },
    close() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.showDialog = false
      this.dialogContent = ''
      this.dialogTitle = ''
    },
    updatePdf(id) {
      this.currWritId = id
      this.showPdf = false
    },
    finishPdf() {
      this.showPdf = false
      this.showDialog = false
    },
    preview(id, title, status) {
      if (status) this.buttonList = status
      this.showPdf = true
      this.visibleWritId = id
    },
    selectPeople(type, cache) {
      this.currSelectPeopleType = type
      this.peopleTitle = type === 'moderator' ? '主持人' : type === 'reporter' ? '汇报人' : type === 'recorder' ? '记录人' : type === 'attendee' ? '出席人' : ''
      if (!cache.id) {
        this.peopleCache = []
      } else {
        this.peopleCache = [cache]
      }

      this.peopleVisiable = true
    },
    selectPeoples(type, cache) {
      this.currSelectPeopleType = type
      this.peopleTitles = '出席人'
      if (cache.length === 0) {
        this.peoplesCache = []
      } else {
        this.peoplesCache = cache
      }
      this.peoplesVisiable = true
    },
    // 回显这个文书的文书弹框的人员
    cachePeople(val) {
      this.peopleCache = val
    },
    getSelectedPeople(bool, auditor) {
      this.peopleVisiable = false
      this.peoplesVisiable = false
      if (!bool) return
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

        this.selectedPeopleArr = JSON.parse(JSON.stringify(auditor))
      }
    },
    toSeal(audiReq) {
      this.audiReq = audiReq
      this.showDialog = true
      this.dialogContent = 'selectPeople'
      this.dialogTitle = '选择审核人员'
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
      this.audiReq.partyName =
        this.$store.state.penalty.penaltyUndEntity.objectType === '0'
          ? this.$store.state.penalty.punishCompanyName
          : this.$store.state.penalty.penaltyUndEntity.punishPersonName
      this.audiReq.partyId = this.$store.state.penalty.penaltyUndEntity.objectType === '0' ? this.$store.state.penalty.punishCompanyId : ''
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
.examine-container {
  .examine-content {
    margin-top: 25px;
    .col-left {
      padding-right: 25px;
      .buttons {
        margin-bottom: 16px;
        .el-button {
          margin-left: 0;
        }
      }
    }
  }
  .doc-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .doc-card {
      margin-bottom: 18px;
    }
  }
  footer.audit {
    width: 82%;
    position: fixed;
    padding: 11px 0;
    text-align: center;
    right: 15px;
    bottom: 0;
    background: #ffffff;
  }
  .finishDialog {
    margin-top: 120px;
  }
}
</style>
