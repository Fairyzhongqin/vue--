<template>
  <div class="bmsh-container">
    <div class="tab-left">
      <el-row style="padding: 16px;">
        <el-col :sm="24" :md="24" class="flex align-items-center">
          <span class="casetit">文书种类</span>
          <span class="fonts">{{ auditInfo.writTitle }}</span>
        </el-col>
        <el-col :sm="24" :md="24" class="flex align-items-center">
          <span class="casetit">文书编号</span>
          <span class="fonts">{{ auditInfo.writNoName }}</span>
        </el-col>
        <el-col :sm="24" :md="24" class="flex align-items-center">
          <span class="casetit">编制人</span>
          <span class="fonts">{{ auditInfo.creatName }}</span>
        </el-col>
        <el-col :sm="24" :md="24" class="flex align-items-center">
          <span class="casetit">编制时间</span>
          <span class="fonts">{{ auditInfo.creatorTime }}</span>
        </el-col>
        <div class="operations" v-if="!forBrowse">
          <span class="edit" @click="edit" v-if="isModifyAd && compType !== 'legalReview' && final">修改</span>
          <span class="del" @click="deleteWrit" v-if="isDeleteAd && compType !== 'legalReview' && final">删除</span>
        </div>
      </el-row>

      <div class="depart_line flex justify-content-space-between align-items-center" v-if="!showDetail">
        <div class="buttons">
          <!-- <el-button
            type="primary"
            v-if="isFileAd && compType !== 'legalReview' && final && !forBrowse"
            class="penalty-small_button"
            mini
            @click="popView"
          >制作法制审核卷宗</el-button> -->
          <!-- <el-button
            type="primary"
            v-if="archiveId"
            class="penalty-small_button"
            mini
            @click="previewFile"
          >浏览法制审核卷宗</el-button> -->
          <el-button type="primary" size="small" class="penalty-small_button" @click="check('report')">浏览案件调查报告</el-button>
          <el-button type="primary" size="small" class="penalty-small_button" @click="check('departAudit', true)">浏览行政处罚法制审核意见书</el-button>
          <!-- <el-button
            type="primary"
            size="small"
            class="penalty-small_button"
            @click="signFile"
            v-if="isUserSign && compType !== 'legalReview' && final && !forBrowse"
          >签名</el-button> -->
          <el-button
            type="primary"
            size="small"
            class="penalty-small_button"
            @click="check('audit')"
            :disabled="isAuditDis"
            v-if="isAuditAd && compType !== 'legalReview' && final && !forBrowse"
            >提交部门负责人</el-button
          >
        </div>
      </div>

      <offence-box type="look" v-if="showDetail"></offence-box>

      <div class="button-group" v-if="showDetail">
        <button-group :buttonList="buttonList"></button-group>
      </div>
      <history-writ
        :docList="docList"
        v-on="$listeners"
        v-bind="$attrs"
        :processVersion="processVersion"
        :isRecalled="isRecalled"
        :forBrowse="forBrowse"
        @previewWrit="preview"
      ></history-writ>
    </div>

    <div class="tab-right">
      <div class="create-tab-title">审核审批流程</div>
      <sn-timeline :lineData="auditProcesses"></sn-timeline>
    </div>
    <el-dialog :before-close="beforeClose" class="preview_dialog" :visible.sync="showDialog" width="900px" title="选择部门负责人员">
      <select-people v-if="showDialog" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <archive-frame :type="'audit'" class="animated" :class="animateClass" v-if="showFrame" @closeFrame="closeFrame"></archive-frame>
    <ShowPdf
      v-if="showPdf"
      :buttonList="btnList"
      :pdfId="previewId"
      :writName="writName"
      :writTypeCode="writTypeCode"
      :pdfType="writName === '电子卷宗' ? 'accessory' : void 0"
      @auditPdf="auditPdf"
      @finishPdf="closePdf"
      @updatePdf="updatePdf"
      @closePdf="closePdf"
    ></ShowPdf>
  </div>
</template>
<script>
import offenceBox from '../component/offence' // 违法行为
import buttonGroup from '@/components/buttonGroup/index'
import ShowPdf from '@/components/showPdf'
import snTimeline from '@/components/TimeLine'
import { getCurrentProcess } from '@/api/filingRegister/index'
import { legalAudit, legalAuditStatus } from '@api/common'
import { getWritInfo, deleteWrit } from '@api/fileRelated'
import { dateFormat } from '@/utils/util'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { setCaseDetail, handleBtnList, setAuditInfo } from '@/utils/audit'
import { mapState } from 'vuex'
import { getDownloadURL } from '@/api/dossier'
import archiveFrame from '@/pages/commonHandle/newHandle/dianzijuanzong/components/archiveFrame'
import historyWrit from './historyWrit'
export default {
  name: 'departmentAuditSaveTrue',
  components: {
    offenceBox,
    buttonGroup,
    ShowPdf,
    selectPeople,
    snTimeline,
    archiveFrame,
    historyWrit
  },
  props: {
    crit: {
      // 处罚裁量
      type: Object
    },
    writTypeCode: {
      type: String // WS开头的文书号
    },
    auditInfo: {
      // 行政处罚法制审核意见书审核流程表文书信息
      type: Object
    },
    compType: {
      // legalReview 法制审核处
      type: String
    },
    source: {
      // 是否是制作或保存后跳转
      type: Boolean
    },
    forBrowse: {
      type: Boolean,
      default: false
    },
    docList: {
      type: Array
    },
  },
  data() {
    return {
      audiReq: {}, // 提交审核的信息
      showDialog: false,
      visibleWritId: '', // 浏览文书的id
      showDetail: false,
      writName: '', // 文书名字
      buttonList: [
        {
          type: '',
          name: '返回',
          fun: () => {
            this.showDetail = false
          }
        },
        {
          type: 'primary',
          name: '修改'
        }
      ],
      previewId: '', // 文书浏览的id
      creator: '', // 编制人
      auditProcesses: [], // 审核流程信息
      isModifyAd: true, // 是否可以修改
      isAuditAd: true, // 提交审核
      isDeleteAd: true, // 是否可以删除
      isFileAd: false, // 是否可制作电子卷宗
      isUserSign: true, // 是否可以签名
      isAuditDis: false, // 审核审批按钮是否置灰
      showPdf: false,
      final: false, // 按钮是否是最终状态
      btnList: {},
      processVersion: 0, // 第几次回退
      isRecalled: '0', // 是否是回退流程： 0 正常 1 回退
      archiveId: '', // 电子卷宗 id
      showFrame: false, // 制作电子卷宗框
      animateClass: 'slideInUp'
    }
  },
  computed: {
    ...mapState(['currCaseHandle'])
  },
  created() {
    if (this.source) this.check('departAudit')
    this.initSaveTrue()
  },
  methods: {
    preview(id) {
      this.$emit('previewWrit',id)
    },
    // 获取文书审核审批信息 并 控制按钮状态
    getWritStat() {
      console.info(this.auditInfo)
      legalAuditStatus({
        requestId: this.auditInfo.sourceId,
        type: '0'
      })
        .then(res => {
          let lastStatus = res.data[0],
            btnArr = ['isModifyAd', 'isAuditAd', 'isUserSign', 'isFileAd'] // 最后一次审核审批状态
          this.auditProcesses = res.data
          this.isRecalled = this.$store.state.penalty.penaltyUndEntity.processStatus
          this.processVersion = this.$store.state.penalty.penaltyUndEntity.processVersion
          if (this.isRecalled === '1' && this.processVersion > this.auditInfo.writVersion) {
            let btnArr = ['isModifyAd', 'isUserSign', 'isDeleteAd', 'isFileAd', 'isAuditAd']
            this.setBtnShow(btnArr, true)
            this.isAuditDis = true
            this.final = true
            return
          } else {
            this.isAuditDis = false
          }
          if (lastStatus) {
            // 有提交
            const code = lastStatus.auditResultCode
            let waiting = ['a01', 'a002', 'a004', 'a006', 'b01', 'b03', 'b04', 'b031', 'b032', 'b041', 'b051', 'b042', 'b052', 'tfs01']
            let needHandling = ['a001', 'a003', 'a005', 'b02']
            this.isDeleteAd = false
            if (waiting.indexOf(code) >= 0) {
              this.setBtnShow(btnArr, false)
            } else if (needHandling.indexOf(code) >= 0) {
              this.setBtnShow(btnArr, true)
            }
            this.final = true
          } else {
            // 无提交: 可以制作 可以提交
            btnArr = ['isModifyAd', 'isAuditAd', 'isUserSign', 'isDeleteAd', 'isFileAd']
            this.setBtnShow(btnArr, true)
            this.final = true
          }
        })
        .catch(err => console.info(err))
    },
    // 设置按钮显示状态
    setBtnShow(btnArr, bool) {
      btnArr.forEach(btn => {
        this[btn] = bool
      })
    },
    initSaveTrue() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.creator = user.userEntity.nickName
      this.getUrl()
      this.getWritStat()
    },
    edit() {
      this.$parent.setShowComponent('editBox')
    },
    lookDetail() {
      this.showDetail = true
    },
    submitToAudition(bool, data) {
      this.beforeClose()
      if (!bool) return

      let _penalty = this.$store.state.penalty,
        taskId
      if (this.currCaseHandle === 2) {
        // 在当前节点，即传 taskId
        let task = this.$store.state.processes.get('AJSL') ? JSON.parse(this.$store.state.processes.get('AJSL')) : []
        taskId = task[0].taskId
      } else {
        taskId = ''
      }
      this.audiReq = {
        ...setAuditInfo(),
        auditTypeCode: 'ta80014',
        auditStatus: '',
        handlerDeptId: data.deptId ? data.deptId : data[0].deptId,
        handlerUserId: data.peopleId ? data.peopleId : data[0].id,
        parentTaskId: taskId,
        requestId: data.pdfId ? data.pdfId : this.auditInfo.writId
      }
      // 调用接口向下走流程
      legalAudit(this.audiReq)
        .then(res => {
          this.getMessage('success', '提交部门负责人成功！')
          setCaseDetail(this.$store.state.penalty.penaltyUndEntity.penaltyId)
          this.getWritStat()
          this.showPdf = false
        })
        .catch(err => console.info(err))
    },
    // 提示信息
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    beforeClose() {
      this.showDialog = false
    },
    check(type, isPreview) {
      if (type === 'audit') {
        this.showDialog = true
      } else if (type === 'departAudit') {
        if (!this.source || isPreview) {
          // 浏览
          this.btnList = handleBtnList(this.writTypeCode, true)
        } else {
          this.btnList = handleBtnList(this.writTypeCode, false)
        }
        this.btnList.signPdf = false
        this.showDialog = false
        this.showPdf = true
        this.writName = '行政处罚法制审核意见书'
        this.previewId = this.auditInfo.writId
      } else {
        this.btnList = handleBtnList('ws10053', true)
        this.showDialog = false
        this.writName = '行政处罚案件调查报告'
        this.getReport()
      }
    },
    getReport() {
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: 'XZCFAJDCBG'
      }
      getWritInfo(req)
        .then(res => {
          this.showPdf = true
          this.previewId = res.data[0].writId
        })
        .catch(err => console.info(err))
    },
    // 签名文书
    signFile() {
      this.btnList = handleBtnList('ta80014', false)
      this.btnList.updatePdf = false
      this.previewId = this.auditInfo.writId
      this.showPdf = true
      this.writName = '行政处罚法制审核意见书'
    },
    // 回退编辑
    updatePdf() {
      this.edit()
      this.showPdf = false
    },
    // 提交审核
    auditPdf(data) {
      this.submitToAudition(true, data)
    },
    deleteWrit() {
      let req = {
        writId: this.auditInfo.writId
      }
      deleteWrit(req)
        .then(res => {
          this.getMessage('success', '删除成功！')
          this.$emit('afterDelete')
        })
        .catch(err => {
          this.getMessage('error', '删除失败！')
        })
    },
    // 获取法制审核卷宗下载地址：控制按钮
    getUrl() {
      getDownloadURL({
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        fileType: '1'
      }).then(res => {
        if (res.data) {
          this.archiveId = res.data.accessoryId
        } else {
          this.archiveId = ''
        }
      })
    },
    // 弹出法制审核卷宗信息
    popView() {
      this.showFrame = true
    },
    // 关闭法制审核卷宗弹出框
    closeFrame() {
      this.animateClass = 'slideOutDown'
      setTimeout(() => {
        this.showFrame = false
        this.animateClass = 'slideInUp'
      }, 1000)
      this.getUrl()
    },
    // 浏览法制审核卷宗 PDF
    previewFile() {
      this.btnList = handleBtnList(null, true)
      this.previewId = this.archiveId
      this.writName = '电子卷宗'
      this.showPdf = true
    },
    // 关闭浏览法制审核卷宗的 pdf 浏览
    closePdf() {
      this.showPdf = false
      this.source = false
    }
  }
}
</script>
<style lang="less" scope>
.bmsh-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .tab-left {
    width: calc(65% - 15px);

    .buttons {
      display: flex;
      flex-wrap: wrap;

      .el-button {
        margin: 0 10px 5px 0;
      }
    }

    .operations {
      text-align: right;
      margin-left: 10px;
    }
  }

  .tab-middle {
    width: 1px;
    margin-top: -24px;
    background-color: #e0e0e0;
  }

  .tab-right {
    width: calc(35% - 15px);
    margin-top: -24px;

    .create-tab-title {
      margin-bottom: 16px;
    }
  }
}

.depart_line {
  flex-wrap: wrap;
  padding: 16px 21px 0 16px;
  border-top: 1px solid #e0e0e0;
}

.casetit {
  width: 80px;
  line-height: 30px;
  text-align: justify;
  text-align-last: justify;
  padding-right: 20px;
  &:after{
    content: ":";
  }
}

.edit {
  color: #0099ff;
  cursor: pointer;
}

.del {
  color: #ff0000;
  cursor: pointer;
}
</style>
