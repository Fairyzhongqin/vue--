<template>
  <div class="writList">
    <div class="docStyle" v-if="writList && writList.length > 0">
      <writ-card
        v-for="(item,index) in writList"
        :key="index"
        :docData="item"
        :readOnly="readOnly"
        :auditInfo="auditInfo"
        @afterDelete="afterDelete"
        @toSeal="toSeal"
        @toLawSeal="toLawSeal"
        @modifyWrit="chooseWrit"
        @afterUpload="initDocuList"
        @previewWrit="signDoc"
        v-on="$listeners"
      ></writ-card>
    </div>
    <sn-empty-data text="暂无整改复查文书" v-if="!writList || writList.length === 0"></sn-empty-data>
    <!-- 选择审核人员 -->
    <el-dialog
      :class="dialogClass"
      :title="showTitle"
      :before-close="closeDialog"
      :visible.sync="writDialogVisible"
      width="900px"
      height="600px"
      class="common-dialog"
    >
      <common-writ
        v-if="writDialogVisible && dialogContent === 'commonWrit'"
        :info="info"
        :writType="showTitle"
        @createWrit="createWrit"
        @toSeal="toSeal"
        @toApproval="toApproval"
        @close="close"
      ></common-writ>
      <select-people
        v-if="dialogContent === 'selectPeople'"
        :selectNum="1"
        @getPeople="submitToAudition"
      ></select-people>
      <div v-if="writDialogVisible && dialogContent === 'updateWrit'"></div>
    </el-dialog>
  </div>
</template>

<script>
import snEmptyData from '@/components/snEmptyData'
import { getInspectionWritList } from '@/api/onSiteInspection/index'
import writCard from '@components/docCard/index'
// 人员选择
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
// 公共组件
import commonWrit from '@components/commonWrit'
// 时间处理函数
import { dateFormat, getWritParams } from '@/utils/util'
// 盖章审批
import { sealAudit } from '@api/common'
// 文书相关
import { createWrit, getWritInfo, updateWrit, getWritDataByWritId, sealWrit } from '@api/fileRelated'
import { mapState } from 'vuex'
export default {
  name: 'writList',
  data() {
    return {
      docDatalist: [],
      auditInfo: {},
      // 盖章弹框
      writDialogVisible: false,
      dialogClass: 'big-dialog',
      showTitle: '',
      info: {},
      dialogContent: '', // dialog 类型
      auditInfo: {}, // 传给文书卡片的审核数据
      audiReq: {}, // 文书提交审核的参数
      readOnly: false //是否是详情的时候 只显示浏览
    }
  },
  inheritAttrs: false,
  props: {
    writList: {
      type: Array,
      required: true
    },
    lawSealAlready: {
      type: Boolean
    },
    option: {
      type: Object
    }
  },
  methods: {
    afterDelete() {},
    // 盖公章按钮
    toSeal(audiReq) {
      this.audiReq = audiReq
      this.audiReq.submitterCause = this.option.examineInfo.companyName
      this.audiReq.requestUsersName = this.option.examineInfo.executorName
      this.audiReq.requestUsersIds = this.option.examineInfo.executorId
      this.writDialogVisible = true
      this.dialogContent = 'selectPeople'
      this.showTitle = '选择盖章人员'
    },
    toLawSeal(data) {
      this.initDocuList()
      this.$emit('previewWrit', data.id, data.title, {
        closePdf: true
      })
    },
    signDoc(id, name, button, data) {
      this.$emit('previewWrit', {
        id: id,
        name: name,
        button: button,
        data: data
      })
    },
    //审核审批
    toApproval() {},
    // 选了人之后点击确定
    submitToAudition(bool, auditor) {
      this.dialogContent = ''
      this.writDialogVisible = false
      if (!bool) return
      this.audiReq.handlerDeptId = auditor[0].deptId
      this.audiReq.handlerUserId = auditor[0].id
      this.audiReq.requestTime = dateFormat(new Date(), 'yyyy年mm月dd日')
      this.audiReq.partyName = this.option.examineInfo.companyName
      this.audiReq.partyId = this.option.examineInfo.companyId
      // 调用接口向下走流程
      sealAudit(this.audiReq)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.initDocuList()
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    //生成文书
    createWrit(createReq) {
      if (this.currWritId) {
        // 重新创建
        updateWrit({ writId: this.currWritId }, createReq.data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '修改文书成功！'
            })
            this.visibleWritId = this.currWritId
            this.previewWrit()
            this.initDocuList()
            this.currWritId = null
            this.updateWritInfo = null
            this.writDialogVisible = false
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '修改文书失败！'
            })
          })
      } else {
        // 新建
        createWrit(createReq)
          .then(res => {
            this.$message({
              type: 'success',
              message: '制作成功！'
            })
            this.setWritBtn(res.writCode)
            this.visibleWritId = res.writId
            this.previewWrit()
            this.initDocuList()
            this.writDialogVisible = false
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '制作失败！'
            })
          })
      }
    },
    // 设置文书按钮状态
    setWritBtn(code) {
      let writTypeInfo = JSON.parse(sessionStorage.writTypeInfo)
      let item = writTypeInfo.find(i => {
        return i.id === code
      })
      this.buttonList = {
        closePdf: true, //退出
        updatePdf: true, //回退编辑
        auditPdf: item.isAudit == 1, // 提交审核
        sealPdf: item.isSign == 1, // 加盖公章
        signPdf: item.userType == 1, // 签名
        lawSealPdf: item.isSign == 2, // 加盖执法专用章
        finishPdf: true //完成
      }
    },
    //关闭弹框
    closeDialog() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.writDialogVisible = false
      this.dialogContent = ''
      this.showTitle = ''
      this.currWritId = null
      this.updateWritInfo = null
    },
    close() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.writDialogVisible = false
    },
    //修改文书
    chooseWrit(title, type, id, businessId) {
      if (this.flag === 'flagDetail') {
        this.$message({
          message: '请至复查页面进行修改',
          type: 'error'
        })
        return
      }
      this.$emit('updateWrit', title, type, id, businessId)
    },
    afterDelete() {
      this.$emit('afterDelete')
    },
    initDocuList(){
      this.$emit("initWritList")
    },
  },
  components: {
    snEmptyData,
    writCard,
    selectPeople,
    commonWrit
  },
  computed: {
    ...mapState(['flag', 'currentReview', 'newReviewflag'])
  },
  created() {
    if (this.newReviewflag === 'flagNewDetail' && this.currentReview === 'NewInnerReview') {
      this.readOnly = true
    } else if (this.flag === 'flagDetail' && this.currentReview === 'newRectification') {
      this.readOnly = true
    }
  }
}
</script>

<style lang="less" scoped>
.docStyle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
}
.common-dialog {
  div {
    white-space: nowrap;
  }
}
</style>
