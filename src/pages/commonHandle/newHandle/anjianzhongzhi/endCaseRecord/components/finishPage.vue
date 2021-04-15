<template>
  <div class="finish_lay">
    <el-row>
      <el-col :span="17">
        <div class="contain">
          <div class="info">
            <el-row style="padding: 16px;">
              <el-col :sm="24" :md="10" class="flex align-items-center">
                <span class="casetit">文书种类：</span>
                {{ writInfo.writTitle }}
              </el-col>
              <el-col :sm="24" :md="14" class="flex align-items-center">
                <span class="casetit">文书名称：</span>
                {{ writInfo.writTitle }}
              </el-col>
              <el-col :sm="24" :md="10" class="flex align-items-center">
                <span class="casetit">编制人：</span>
                {{ writInfo.creatName }}
              </el-col>
              <el-col :sm="24" :md="14" class="flex align-items-center">
                <span class="casetit">编制时间：</span>
                {{ writInfo.creatorTime }}
              </el-col>
              <el-col :sm="24" :md="24" class="flex align-items-center">
                <span class="casetit">文书编号：</span>
                {{ writInfo.writNoName }}
              </el-col>
              <el-col :sm="24" :md="24" class="flex align-items-center">
                <span class="casetit subject-long">被处罚单位（个人）：</span>
                {{ writInfo.punishName }}
              </el-col>
            </el-row>
          </div>
          <div class="btns">
            <div class="btn_left">
              <el-button class="penalty-small_button" type="primary" size="mini" @click="preview">浏览案件终止记录单</el-button>
              <el-button
                class="penalty-small_button"
                type="primary"
                size="mini"
                @click="submit"
                v-if="isAuditAllowed && !forBrowse"
                :disabled="writInfo.noProcessSignStatus === 1 || currentHasSign"
                >{{ writInfo.isSign === 2 ? '加盖执法专用章' : '加盖公章' }}</el-button
              >
            </div>
            <div class="btn_right" v-if="!forBrowse">
              <button @click="modifyWrit" v-if="isModifyAllowed">修改</button>
              <button @click="delWrit" v-if="isDeleteAllowed">删除</button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="create-tab-title" style="margin-top: -24px;">公章审批流程</div>
        <div class="time_line_lay">
          <time-line :lineData="defaultLineData"></time-line>
        </div>
      </el-col>
    </el-row>
    <el-dialog class="big-dialog" :visible.sync="showPdfDialog" :title="dialogTitle" :before-close="close" width="900px">
      <select-people v-if="dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <show-pdf
      :writName="'案件终止记录单'"
      :pdfId="visibleWritId"
      :buttonList="btnList"
      v-if="showPdf"
      @finishPdf="closePdf"
      @signSuccess="currentHasSign = true"
      @updatePdf="modifyWrit"
      @sealPdf="sealPdf"
      @closePdf="closePdf"
    ></show-pdf>
  </div>
</template>

<script>
import timeLine from '@/components/TimeLine/index'
import ShowPdf from '@/components/showPdf'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { dateFormat } from '@/utils/util'
import { sealAuditStatus, sealAudit } from '@/api/common'
import { deleteWritAndAccessory } from '@api/fileRelated'
import { handleWritStatus, handleBtnList } from '@/utils/audit'

export default {
  name: 'anjianzhongzhiFinishPage',
  components: {
    timeLine,
    ShowPdf,
    selectPeople
  },
  props: {
    currWritId: {
      type: String
    },
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
      defaultLineData: [],
      showPdfDialog: false,
      dialogContent: '',
      visibleWritId: '',
      dialogTitle: '',
      audiReq: {},
      creator: '', // 编制人
      isDeleteAllowed: true, // 是否允许删除文书
      isAuditAllowed: true, // 是否允许提交盖章
      isModifyAllowed: true, // 是否允许修改文书
      showPdf: false,
      btnList: {
        updatePdf: true,
        signPdf: false,
        auditPdf: false,
        sealPdf: true,
        finishPdf: true,
        lawSealPdf: false,
        closePdf: true
      },
      currentHasSign: false
    }
  },
  created() {
    if (this.source) this.preview('created')

    this.initDet()
    this.getWritStat()
  },
  methods: {
    initDet() {
      let user = JSON.parse(localStorage.getItem('res'))
      let _penalty = this.$store.state.penalty
      this.creator = user.userEntity.nickName
      this.writInfo.punishName = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName
    },
    preview(type) {
      if (type === 'created') {
        this.btnList = handleBtnList('ws10052', false)
      } else {
        this.btnList = handleBtnList('ws10052', true)
      }
      this.showPdfDialog = false
      this.showPdf = true
      this.visibleWritId = this.currWritId
      this.dialogTitle = '浏览案件终止记录单'
    },
    submit() {
      if (this.writInfo.isSign === 2) {
        this.preview('created')
        this.btnList.updatePdf = false
      } else {
        this.showPdfDialog = true
        this.dialogContent = 'selectPeople'
        this.dialogTitle = '选择审核人员'
      }
    },
    // 审核审批（盖章）
    submitToAudition(bool, auditor) {
      this.dialogContent = ''
      this.showPdfDialog = false
      if (!bool) return
      this.audiReq = {
        auditTypeCode: 'ta80040',
        handlerDeptId: auditor[0].deptId,
        handlerUserId: auditor[0].id,
        requestUsersIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name, // 承办部门
        requestId: this.currWritId,
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
    close() {
      this.showPdfDialog = false
      this.dialogContent = ''
      this.dialogTitle = ''
    },
    getWritStat() {
      sealAuditStatus({
        requestId: this.writInfo.writId
      })
        .then(res => {
          let lastStatus = res.data[0] // 最后一次审核审批状态
          this.defaultLineData = res.data
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
    modifyWrit() {
      this.$emit('pageChange', 'makePage')
    },
    delWrit() {
      this.$confirm('确定删除案件终止记录单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delReq = { writId: this.currWritId, type: 'AJCXJLD' }
        deleteWritAndAccessory(delReq)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.$parent.initStatus()
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
    closePdf() {
      this.showPdf = false
    },
    sealPdf(obj) {
      let _penalty = this.$store.state.penalty
      sealAudit({
        auditTypeCode: 'ta80040',
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
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.getWritStat()
          this.closePdf()
        })
        .catch(err => console.info(err))
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
      .btn_left {
        height: 28px;
      }
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
  .casetit.subject-long {
    width: 150px;
  }
  .time_line_lay {
    padding-top: 20px;
  }
  .big-dialog {
    /deep/.el-dialog {
      width: 900px;
      height: auto;
      padding-bottom: 10px;
      .content {
        margin-bottom: 0;
      }
    }
  }
}
</style>
