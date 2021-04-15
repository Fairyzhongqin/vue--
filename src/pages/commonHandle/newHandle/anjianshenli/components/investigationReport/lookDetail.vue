<template>
  <div>
    <el-row class="listBox">
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="label">文书种类</span>
        <span class="fonts">{{ report.writTitle }}</span>
      </el-col>
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="label">文书编号</span>
        <span class="fonts">{{ report.writNoName }}</span>
      </el-col>
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="label">当事人</span>
        <span class="fonts">{{ writ.subject }}</span>
      </el-col>
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="label">编制时间</span>
        <span class="fonts">{{ report.creatorTime }}</span>
      </el-col>
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="label">编制人</span>
        <span class="fonts">{{ report.creatName }}</span>
      </el-col>
    </el-row>

    <div class="flex justify-content-space-between align-items-center look_line">
      <div>
        <el-button class="penalty-small_button" type="primary" size="small" @click="preview">浏览案件调查报告书</el-button>
        <el-button class="penalty-small_button" v-if="isSignAd && !forBrowse && final" type="primary" size="small" @click="sign">{{
          report.currUserIdSign ? '签名' : '签名'
        }}</el-button>
        <!-- <el-button class="penalty-small_button" v-if="isSignAd&&!forBrowse" type="primary" size="small" :disabled="report.currUserIdSign" @click="sign">{{report.currUserIdSign?'已签名':'签名'}}</el-button> -->
      </div>

      <div v-if="!forBrowse">
        <span class="edit" @click="edit" v-if="isModifyAllowed && final">修改</span>
        <span class="del" @click="deleReport" v-if="isDeleteAllowed && final">删除</span>
      </div>
    </div>
    <ShowPdf
      v-if="isPreviewVisible"
      :pdfId="report.writId"
      :writName="'案件调查报告'"
      @closePdf="closePdf"
      @updatePdf="updatePdf"
      :buttonList="buttonList"
    ></ShowPdf>
  </div>
</template>
<script>
import { deleteWritAndAccessory } from '@api/fileRelated'
import ShowPdf from '@/components/showPdf'
import { sealAuditStatus } from '@api/common'
import { getWritInfo } from '@api/fileRelated'
import { mapState } from 'vuex'
export default {
  name: 'investigationReportLookDetail',
  components: {
    ShowPdf
  },
  props: {
    report: {
      type: Object
    },
    source: {
      // 是否是制作 or 保存后跳转
      type: Boolean
    },
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPreviewVisible: false,
      writ: {
        subject: '', // 涉案对象
        creator: '' // 编制人 （当前登录人？ coding）
      },
      isSignAd: true, // 是否可以签名
      isDeleteAllowed: false,
      isModifyAllowed: false,
      final: false, // 按钮是否到最终状态
      buttonList: {
        updatePdf: true, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      processVersion: 0, // 第几次回退
      isRecalled: '0' // 是否是回退流程： 0 正常 1 你猜正常不正常
    }
  },
  computed: {
    ...mapState(['currCaseHandle'])
  },
  created() {
    if (this.source) {
      this.preview()
    }
    this.initInfo()
    if (this.currCaseHandle === 1) {
      // 流程在当前节点，肯定可编辑
      this.isDeleteAllowed = true
      this.isModifyAllowed = true
      this.final = true
    } else {
      this.getPreAudit() // 非当前节点 获取法制审核文书审核审批情况，控制按钮展示
    }
  },
  methods: {
    // 获取法制审核文书
    getPreAudit() {
      let writReq = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: 'XZCFJDFZSHYJS'
      }
      getWritInfo(writReq)
        .then(res => {
          let writ = res.data[0]
          this.isRecalled = this.$store.state.penalty.penaltyUndEntity.processStatus
          this.processVersion = this.$store.state.penalty.penaltyUndEntity.processVersion
          if (writ && this.isRecalled === '1' && this.processVersion > writ.writVersion) {
            this.isModifyAllowed = true
            this.isDeleteAllowed = true
            this.final = true
            return
          }

          if (writ) {
            return sealAuditStatus({ requestId: writ.writId })
          } else {
            this.isDeleteAllowed = true
            this.isModifyAllowed = true
            this.final = true
          }
        })
        .then(res => {
          if (res) {
            let lastStatus = res.data[0] // 最后一次审核审批状态
            if (lastStatus) {
              // 有提交
              const code = lastStatus.auditResultCode
              let waiting = ['a01', 'a002', 'a004', 'a006', 'b01', 'b03', 'b04', 'b031', 'b032', 'b041', 'b051']
              let needHandling = ['a001', 'a003', 'a005', 'b02', 'b042', 'b052']
              this.isDeleteAllowed = false
              if (waiting.indexOf(code) >= 0) {
                this.isModifyAllowed = false
                this.isSignAd = false
              } else if (needHandling.indexOf(code) >= 0) {
                this.isModifyAllowed = true
                this.isSignAd = true
              }
              this.final = true
            } else {
              // 无提交: 可以制作 可以删除
              this.isModifyAllowed = true
              this.isDeleteAllowed = true
              this.final = true
            }
          }
        })
        .catch(err => console.info(err))
    },
    // 关闭文书
    closePdf() {
      //刷新页面数据
      this.$parent.getReport()
      this.isPreviewVisible = false
    },
    // 回退编辑
    updatePdf() {
      this.edit()
      this.isPreviewVisible = false
    },
    initInfo() {
      let _penalty = this.$store.state.penalty
      let user = JSON.parse(localStorage.getItem('res'))
      this.writ.subject = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName
      this.writ.creator = user.userEntity.nickName
    },
    preview() {
      if (this.source) {
        this.buttonList = {
          updatePdf: true, // 回退编辑
          signPdf: true, // 签名
          auditPdf: false, // 提交审核
          sealPdf: false, // 加盖公章
          finishPdf: true, // 完成
          lawSealPdf: false, // 加盖执法专用章
          closePdf: true // 退出
        }
      } else {
        this.buttonList = {
          updatePdf: false, // 回退编辑
          signPdf: false, // 签名
          auditPdf: false, // 提交审核
          sealPdf: false, // 加盖公章
          finishPdf: false, // 完成
          lawSealPdf: false, // 加盖执法专用章
          closePdf: true // 退出
        }
      }

      this.isPreviewVisible = true
    },
    sign() {
      this.buttonList = {
        updatePdf: false, // 回退编辑
        signPdf: true, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      }
      this.isPreviewVisible = true
    },
    deleReport() {
      let req = {
        writId: this.report.writId,
        type: 'XZCFAJDCBG'
      }
      deleteWritAndAccessory(req)
        .then(res => {
          this.$message({
            type: 'success',
            message: '案件调查报告删除成功！'
          })
          this.$parent.getReport()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '案件调查报告删除失败！'
          })
        })
    },
    edit() {
      this.$parent.setComponentId('editBox')
    }
  }
}
</script>
<style lang="less" scoped>
.tit {
  background: #e3eef6;
  padding: 0 15px;
  line-height: 24px;
}

.listBox {
  padding: 10px 16px 16px;
  box-sizing: border-box;
}

.label {
  width: 65px;
  line-height: 30px;
  text-align: justify;
  text-align-last: justify;
  padding-right: 10px;
  &:after {
    content: ":";
  }
}

.look_line {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
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
