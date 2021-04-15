<template>
  <div v-loading="loading">
    <div class="create-tab-title" :class="{ small: showComponent === 'saveBox' }">法制审核</div>
    <div v-if="!isDetailAvailable && !showComponent && !forBrowse" style="margin-top: 16px;">
      <!-- <el-button type="primary" class="penalty-small_button" mini @click="popView">制作法制审核卷宗</el-button> -->
      <!-- <el-button
        type="primary"
        v-if="archiveId"
        class="penalty-small_button"
        size="mini"
        @click="previewFile"
      >浏览法制审核卷宗</el-button> -->
      <el-button class="penalty-small_button" type="primary" size="mini" @click="createAuditWrit">制作行政处罚法制审核意见书​</el-button>
    </div>
    <component
      :crit="crit"
      :auditInfo="auditInfo"
      :source="source"
      :is="showComponent"
      v-on="$listeners"
      :writTypeCode="writTypeCode"
      v-bind="$attrs"
      :docList="docList"
      :isRecalled="isRecalled"
      :processVersion="processVersion"
      :forBrowse="forBrowse"
      @createWrit="createWrit"
      @afterDelete="initAuditInfo"
      @previewWrit="preview"
    ></component>
      <history-writ
        v-if="!showComponent"
        :docList="docList"
        v-on="$listeners"
        v-bind="$attrs"
        :processVersion="processVersion"
        :isRecalled="isRecalled"
        :forBrowse="forBrowse"
        @previewWrit="preview"
      ></history-writ>
    <archive-frame :type="'audit'" class="animated" :class="animateClass" v-if="showFrame" @closeFrame="closeFrame"></archive-frame>
    <show-pdf
      :pdfId="pdfId"
      @closePdf="showPdf2 = false"
      v-if="showPdf2"
      :buttonList="{
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true
      }"
      :writName="'行政处罚法制审核意见书'"
    ></show-pdf>
    <show-pdf
      :pdfId="archiveId"
      @closePdf="closePdf"
      v-if="showPdf"
      :pdfType="'accessory'"
      :buttonList="{
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true
      }"
      :writName="'法制审核卷宗'"
    ></show-pdf>
  </div>
</template>
<script>
import localEditBox from './edit' // 编辑
// import editBox from "../penaltyDiscretion/edit"; // 处罚裁量处
import editBox from './edit' // 提交法制审核
import saveBox from './saveTrue' // 保存
import snEmptyData from '@/components/snEmptyData'
import { getWritInfo, createWrit, updateWrit } from '@api/fileRelated'
import { getCriteria } from '@api/anjianshenli'
import { finishPro } from '@api/common'
import { getDownloadURL } from '@/api/dossier'
import showPdf from '@/components/showPdf'
import archiveFrame from '@/pages/commonHandle/newHandle/dianzijuanzong/components/archiveFrame'
import docCard from '@/components/docCard/index'
import historyWrit from './historyWrit'
export default {
  name: 'departmentAuditIndex',
  components: {
    editBox,
    saveBox,
    localEditBox,
    snEmptyData,
    showPdf,
    archiveFrame,
    docCard,
    historyWrit
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      writTypeCode: '',
      processVersion: 0, // 第几次回退
      isRecalled: '0', // 是否是回退流程： 0 正常 1 你猜正常不正常
      isDetailAvailable: false,
      showComponent: '',
      crit: {}, // 处罚裁量记录
      auditInfo: {}, // 行政处罚法制审核意见书信息
      loading: true,
      source: false,
      showFrame: '', // 是否展示法制审核卷宗弹框
      animateClass: 'slideInUp',
      showPdf: false, // 浏览法制审核卷宗PDF
      archiveId: '', // 法制审核卷宗浏览 id
      docList: [],
      pdfId: '',
      showPdf2: false,
      lastIsNotAgree: false
    }
  },
  created() {
    this.getAudit()
    this.isRecalled = this.$store.state.penalty.penaltyUndEntity.processStatus
    this.processVersion = this.$store.state.penalty.penaltyUndEntity.processVersion
    // 存入电子卷宗所需 moduleId
    this.$store.commit('setModuleId', this.$store.state.penalty.penaltyUndEntity.penaltyId)
  },
  methods: {
    initAuditInfo(type) {
      let currCaseHandle = this.$store.state.currCaseHandle
      if (currCaseHandle >= 2) {
        this.getAudit(type)
      } else {
        this.showComponent = ''
        this.isDetailAvailable = false
        this.initPuniCritInfo()
      }
    },
    // 获取处罚裁量信息
    initPuniCritInfo() {
      let req = {
        laDiscretionId: '',
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId
      }
      getCriteria(req)
        .then(res => {
          this.crit = res.data
          this.loading = false
        })
        .catch(err => console.info(err))
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
    // 获取文书信息
    getAudit(type) {
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: 'XZCFJDFZSHYJS'
      }
      // 获取 法制审核卷宗 下载地址
      this.getUrl()
      getWritInfo(req)
        .then(res => {
          this.auditInfo = res.data[0]
          if (res.data[0]) {
            if (res.data[0].auditStatusValue.indexOf('部门审核不通过') !== -1) {
              this.lastIsNotAgree = true
              // 最后包含不同意，那就展示全部
              this.docList = res.data
            } else {
              this.lastIsNotAgree = false
              // 最后一个不是不同意，那就展示前面的
              this.docList = res.data.splice(1, res.data.length - 1)
            }
          }

          if (this.auditInfo && this.auditInfo !== {} && !this.lastIsNotAgree) {
            if (type === 'afterCreated') {
              this.source = true
            } else {
              this.source = false
            }
            this.showComponent = 'saveBox'
            this.isDetailAvailable = true
          } else {
            this.showComponent = ''
            this.isDetailAvailable = false
          }
          this.initPuniCritInfo()
        })
        .catch(err => console.info(err))
    },
    createWrit(params) {
      let isBack = !!Number(this.isRecalled)
      let writVersion = this.$store.state.penalty.penaltyUndEntity.processVersion
      params.writVersion = writVersion
      if (this.auditInfo && this.auditInfo.writId && !this.lastIsNotAgree) {
        // 最后一步是不同意就不能
        updateWrit(
          {
            writId: this.auditInfo.writId,
            isBack: isBack,
            writVersion: writVersion
          },
          params.data
        )
          .then(res => {
            this.getMessage('success', '制作成功！')
            this.writTypeCode = res.writType
            this.initAuditInfo('afterCreated')
            this.initPuniCritInfo()
          })
          .catch(err => {
            this.getMessage('error', '制作失败！')
          })
      } else {
        createWrit(params)
          .then(res => {
            this.getMessage('success', '制作成功！')
            this.writTypeCode = res.writType
            this.initAuditInfo('afterCreated')
            this.initPuniCritInfo()
          })
          .catch(err => {
            this.getMessage('error', '制作失败！')
          })
      }
    },
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    createAuditWrit() {
      this.showComponent = 'editBox'
    },
    setShowComponent(val) {
      this.showComponent = val
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
      this.showPdf = true
    },
    // 关闭浏览法制审核卷宗的 pdf 浏览
    closePdf() {
      this.showPdf = false
    },
    preview(id) {
      this.pdfId = id
      this.showPdf2 = true
    }
  }
}
</script>
<style lang="less" scope>
.small {
  width: calc(61.5%);
}
</style>
