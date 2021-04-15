<template>
  <div class="finish_lay">
    <el-row>
      <el-col :span="17">
        <div class="contain">
          <div class="create-tab-title">案件延期</div>
          <div class="info">
            <el-row style="padding: 16px;">
              <el-col :sm="24" :md="9" class="flex align-items-center">
                <span class="casetit">文书种类：</span>
                {{ writInfo.writTitle }}
              </el-col>
              <el-col :sm="24" :md="15" class="flex align-items-center">
                <span class="casetit">文书编号：</span>
                {{ writInfo.writNoName }}
              </el-col>
              <el-col :sm="24" :md="9" class="flex align-items-center">
                <span class="casetit">文书名称：</span>
                {{ writInfo.writTitle }}
              </el-col>
              <el-col :sm="24" :md="15" class="flex align-items-center">
                <span class="casetit">编制时间：</span>
                {{ writInfo.creatorTime }}
              </el-col>
              <el-col :sm="24" :md="12" class="flex align-items-center">
                <span class="casetit">编制人：</span>
                {{ writInfo.creatName }}
              </el-col>
            </el-row>
          </div>
          <div class="btns">
            <div class="btn_left">
              <el-button
                type="primary"
                class="penalty-small_button"
                size="mini"
                @click="preview"
              >浏览案件延期审批表</el-button>
              <el-button
                type="primary"
                class="penalty-small_button"
                size="mini"
                @click="preview('sign')"
                v-if="isAuditAllowed && !forBrowse"
              >签名</el-button>
              <!-- <el-button type="primary"
                         class="penalty-small_button"
                         size="mini"
                         @click="preview('sign')"
                         v-if="isAuditAllowed&&!forBrowse"
              :disabled="hasSign">{{hasSign?'已':''}}签名</el-button>-->
              <el-button
                type="primary"
                class="penalty-small_button"
                size="mini"
                @click="submit"
                v-if="isAuditAllowed && !forBrowse"
              >提交审核</el-button>
            </div>
            <div class="btn_right" v-if="!forBrowse">
              <span class="edit" @click="edit" v-if="isModifyAllowed">修改</span>
              <span class="del" @click="deleteWrit" v-if="isDeleteAllowed">删除</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="create-tab-title">审核审批流程</div>
        <div class="time_line_lay">
          <time-line :lineData="auditProcesses"></time-line>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :before-close="beforeClose"
      class="preview_dialog"
      :visible.sync="showDialog"
      width="900px"
      :title="dialogTitle"
    >
      <select-people
        v-if="dialogContent === 'selectPeople'"
        :selectNum="1"
        @getPeople="submitToAudition"
      ></select-people>
    </el-dialog>
    <ShowPdf
      v-if="showPdf"
      :writName="'案件延期审批表'"
      :pdfId="previewId"
      :buttonList="btnList"
      @finishPdf="finishPdf"
      @updatePdf="edit"
      @auditPdf="auditPdf"
      @closePdf="finishPdf"
      @signSuccess="hasSign = true"
      :isUserSign="1"
    ></ShowPdf>
  </div>
</template>

<script>
import timeLine from '@/components/TimeLine/index'
import ShowPdf from '@/components/showPdf'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { sealAudit, sealAuditStatus } from '@api/common'
import { deleteWrit, queryWritState } from '@api/fileRelated'
import { dateFormat } from '@/utils/util'

export default {
  name: 'anjianyanqiFinishPage',
  components: {
    timeLine,
    ShowPdf,
    selectPeople
  },
  props: {
    writInfo: {
      type: Object
    },
    source: {
      type: Boolean
    },
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: false,
      audiReq: {}, // 提交审核的信息
      dialogContent: '',
      previewId: '', // 文书浏览的id
      dialogTitle: '', // 弹出框标题
      creator: '', // 编制人
      auditProcesses: [], // 审核审批流程信息
      isModifyAllowed: true, // 是否可以修改
      isAuditAllowed: true, // 提交审核
      isDeleteAllowed: true, // 是否可以删除
      showPdf: false,
      btnList: {
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: false, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      hasSign: false
    }
  },
  created() {
    if (this.source) this.preview('created')
    this.initCaseDelay()
    //当案件结案之后  按钮不能操作
    this.initButton()
    this.checkSignType()
  },
  methods: {
    checkSignType() {
      queryWritState({
        writId: this.writInfo.writId
      }).then(res => {
        this.hasSign = res.data.currUserIdSign
      })
    },
    initButton() {
      //如果已经结案了  结案时间不为空
      if (this.$store.state.penalty.penaltyUndEntity.caseEndTime) {
        this.forBrowse = true
      }
    },
    initCaseDelay() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.creator = user.userEntity.nickName
      this.getWritStat()
    },
    // 获取文书审核审批信息 并 控制按钮状态
    getWritStat() {
      sealAuditStatus({
        requestId: this.writInfo.writId
      })
        .then(res => {
          let lastStatus = res.data[0] // 最后一次审核审批状态
          this.auditProcesses = res.data
          if (lastStatus) {
            // 有提交
            const code = lastStatus.auditResultCode
            this.isDeleteAllowed = false
            if (code === 'a01' || code === 'a002' || code === 'a004' || code === 'a006') {
              this.isModifyAllowed = false
              this.isAuditAllowed = false
            } else if (code === 'a001' || code === 'a003' || code === 'a005') {
              this.isModifyAllowed = true
              this.isAuditAllowed = true
            }
          } else {
            // 无提交: 可以制作 可以提交
            this.isModifyAllowed = true
            this.isAuditAllowed = true
            this.isDeleteAllowed = true
          }
        })
        .catch(err => console.info(err))
    },
    submitToAudition(bool, auditor) {
      this.beforeClose()
      if (!bool) return
      this.audiReq = {
        auditTypeCode: 'ta80026',
        handlerDeptId: auditor[0].deptId,
        handlerUserId: auditor[0].id,
        requestUsersIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name,
        requestId: this.writInfo.writId,
        requestTime: dateFormat(new Date(), 'yyyy年mm月dd日'),
        requestUsersName: this.$store.state.penalty.udtNames,
        submitterCause: this.$store.state.penalty.penaltyUndEntity.caseName,
        partyName:
          this.$store.state.penalty.penaltyUndEntity.objectType === '0'
            ? this.$store.state.penalty.punishCompanyName
            : this.$store.state.penalty.penaltyUndEntity.punishPersonName,
        partyId: this.$store.state.penalty.penaltyUndEntity.objectType === '0' ? this.$store.state.penalty.punishCompanyId : ''
      }
      // 调用接口向下走流程
      sealAudit(this.audiReq)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.getWritStat()
        })
        .catch(err => console.info(err))
    },
    // 修改
    edit() {
      this.$emit('pageChange', 'makePage')
    },
    // 删除文书
    deleteWrit() {
      this.$confirm('确定删除案件延期审批表？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let req = {
          writId: this.writInfo.writId
        }
        deleteWrit(req)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.$parent.initPage()
            this.$emit('pageChange', '')
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
          })
      })
    },
    preview(type) {
      if (type === 'created') {
        this.btnList = {
          updatePdf: true,
          signPdf: true,
          auditPdf: true,
          sealPdf: false,
          finishPdf: true,
          lawSealPdf: false,
          closePdf: true
        }
      } else if (type === 'sign') {
        this.btnList = {
          updatePdf: false,
          signPdf: true,
          auditPdf: true,
          sealPdf: false,
          finishPdf: true,
          lawSealPdf: false,
          closePdf: true
        }
      } else {
        this.btnList = {
          updatePdf: false,
          signPdf: false,
          auditPdf: false,
          sealPdf: false,
          finishPdf: false,
          lawSealPdf: false,
          closePdf: true
        }
      }
      this.showDialog = false
      this.dialogTitle = '案件延期审批表'
      this.showPdf = true
      this.previewId = this.writInfo.writId
    },
    submit() {
      queryWritState({ writId: this.writInfo.writId }).then(res => {
        if (res.data.isUserSign === 1 && !res.data.isAllUserSign) {
          this.$message({
            type: 'warning',
            message: '请耐心等待所有承办人员签名。'
          })
        } else {
          this.dialogContent = 'selectPeople'
          this.dialogTitle = '选择审核人员'
          this.showDialog = true
        }
      })
    },
    beforeClose() {
      this.showDialog = false
      this.dialogContent = ''
      this.dialogTitle = ''
    },
    finishPdf() {
      this.showPdf = false
    },
    auditPdf(obj) {
      // 提交审核
      let _penalty = this.$store.state.penalty
      sealAudit({
        auditTypeCode: 'ta80026',
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        requestUsersIds: _penalty.penaltyUndEntity.udtIds,
        // parentTaskId: task[0].taskId,
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
      }).then(res => {
        this.$message({
          type: 'success',
          message: '提交审核成功！'
        })
        this.finishPdf()
        this.initCaseDelay()
      })
    }
  }
}
</script>

<style lang="less" scope>
.finish_lay {
  .contain {
    padding-right: 30px;
    .info {
      font-size: 14px;
      line-height: 37px;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
    }
    .btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 62px;
      .btn_right {
        font-size: 14px;
        button {
          background-color: transparent;
          border: none;
          color: #ff4b3d;
          cursor: pointer;
          &:first-child {
            color: #0099ff;
          }
        }
      }
    }
  }
  .time_line_lay {
    padding-top: 20px;
  }
  .edit {
    color: #0099ff;
    cursor: pointer;
  }
  .del {
    color: #ff0000;
    cursor: pointer;
  }
}
</style>
