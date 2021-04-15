<template>
  <div class="finish_lay">
    <el-row>
      <el-col :span="17">
        <div class="contain">
          <div class="create-tab-title">结案审批</div>
          <div class="info">
            <el-row style="padding: 16px;">
              <el-col :sm="24" :md="12" class="flex align-items-center">
                <span class="casetit">文书编号</span>
                <span class="caseval" style="width: auto">{{ writInfo.writNoName }}</span>
              </el-col>
              <el-col :sm="24" :md="12" class="flex align-items-center">
                <span class="casetit">文书名称</span>
                <span class="caseval" style="width: auto">{{ writInfo.writTitle }}</span>
              </el-col>
              <el-col :sm="24" :md="12" class="flex align-items-center">
                <span class="casetit">制作时间</span>
                <span class="caseval" style="width: auto">{{ writInfo.creatorTime }}</span>
              </el-col>
              <el-col :sm="24" :md="12" class="flex align-items-center">
                <span class="casetit">制作人</span>
                <span class="caseval" style="width: auto">{{ writInfo.creatName }}</span>
              </el-col>
            </el-row>
          </div>
          <div class="btns">
            <div class="btn_left">
              <el-button class="penalty-small_button" type="primary" size="mini" @click="preview()">浏览结案审批表</el-button>
              <el-button class="penalty-small_button" type="primary" size="mini" @click="sign" v-if="isAuditAd && !forBrowse"
                >{{ hasSign ? '' : '' }}签名</el-button
              >
              <!-- <el-button class="penalty-small_button"
                         type="primary"
                         size="mini"
                         @click="sign"
                         :disabled="hasSign"
                         v-if="isAuditAd && !forBrowse">{{hasSign?'已':''}}签名</el-button> -->
              <el-button class="penalty-small_button" type="primary" size="mini" @click="submit" v-if="isAuditAd && !forBrowse">提交审核</el-button>
            </div>
            <div class="btn_right" v-if="!forBrowse">
              <button @click="modifyWrit" v-if="isModifyAd">修改</button>
              <button @click="delWrit" v-if="isDeleteAd">删除</button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="jieanshenpiStyle">
        <div class="create-tab-title">结案审批流程</div>
        <div class="time_line_lay">
          <time-line :lineData="defaultLineData"></time-line>
        </div>
      </el-col>
    </el-row>
    <el-dialog class="big-dialog" :visible.sync="selectPeopleDialog" :title="dialogTitle" :before-close="close">
      <select-people v-if="dialogContent === 'selectPeople' && selectPeopleDialog" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <show-pdf
      :pdfId="visibleWritId"
      v-if="showPdf"
      @closePdf="closePdf"
      @updatePdf="updatePdf"
      @auditPdf="auditFromPdf"
      @signSuccess="hasSign = true"
      :writName="'结案审批表'"
      :buttonList="buttonList"
    ></show-pdf>
  </div>
</template>

<script>
import timeLine from '@/components/TimeLine/index'
import ShowPdf from '@/components/showPdf'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { dateFormat } from '@/utils/util'
import { sealAuditStatus, sealAudit } from '@/api/common'
import { handleBtnList, setInfo } from '@/utils/audit'
import { deleteWrit, queryWritState } from '@api/fileRelated'
export default {
  name: 'jieanshenpiFinishPage',
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
    showWrit: {
      type: Boolean,
      default: false
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
      selectPeopleDialog: false,
      dialogContent: '',
      visibleWritId: '',
      dialogTitle: '',
      audiReq: {},
      creator: '', // 编制人
      isModifyAd: true, // 是否可以修改
      isAuditAd: true, // 提交审核
      isDeleteAd: true, // 是否可以删除
      showPdf: false,
      buttonList: {},
      hasSign: false
    }
  },
  created() {
    if (this.source) this.preview(true)
    let user = JSON.parse(localStorage.getItem('res'))
    this.creator = user.userEntity.nickName
    this.getFlow()
    this.checkSignType()
  },
  mounted() {
    if (this.showWrit) {
      this.preview()
    }
  },
  methods: {
    checkSignType() {
      queryWritState({
        writId: this.currWritId
      }).then(res => {
        this.hasSign = res.data.currUserIdSign
      })
    },
    sign() {
      this.buttonList = {
        updatePdf: false, // 回退编辑
        signPdf: true, // 签名
        auditPdf: true, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      }
      this.showPdf = true
      this.visibleWritId = this.currWritId
      this.dialogTitle = '结案审批表'
    },
    // 获取文书审核审批信息 并 控制按钮状态
    getFlow() {
      sealAuditStatus({
        requestId: this.writInfo.writId
      })
        .then(res => {
          let lastStatus = res.data[0] // 最后一次审核审批状态
          this.defaultLineData = res.data
          if (lastStatus) {
            // 有提交
            const code = lastStatus.auditResultCode
            this.isDeleteAd = false
            if (code === 'a01' || code === 'a002' || code === 'a004' || code === 'a006' || code === 't03') {
              this.isModifyAd = false
              this.isAuditAd = false
            } else if (code === 'a001' || code === 'a003' || code === 'a005' || code === 't01') {
              this.isModifyAd = true
              this.isAuditAd = true
            }
          } else {
            // 无提交: 可以制作 可以提交
            this.isModifyAd = true
            this.isAuditAd = true
            this.isDeleteAd = true
          }
        })
        .catch(err => console.info(err))
    },
    preview(isCreate) {
      this.buttonList = handleBtnList('ws10046', !isCreate)
      this.selectPeopleDialog = false
      this.showPdf = true
      this.visibleWritId = this.currWritId
      this.dialogTitle = '浏览结案审批表'
    },
    submit() {
      queryWritState({ writId: this.currWritId }).then(res => {
        if (res.data.isUserSign === 1 && !res.data.isAllUserSign) {
          this.$message({
            type: 'warning',
            message: '请耐心等待所有承办人员签名。'
          })
        } else {
          this.selectPeopleDialog = true
          this.dialogContent = 'selectPeople'
          this.dialogTitle = '选择审核人员'
        }
      })
    },
    auditFromPdf(info) {
      let _auditor = [
        {
          deptId: info.deptId,
          id: info.peopleId
        }
      ]
      this.submitToAudition(true, _auditor)
    },
    // 审核审批（盖章）
    submitToAudition(bool, auditor) {
      let task
      this.dialogContent = ''
      this.selectPeopleDialog = false
      if (!bool) return
      // 获取结案审批的流程任务
      task = this.$store.state.processes.get('JASP') ? JSON.parse(this.$store.state.processes.get('JASP')) : []
      this.audiReq = {
        auditTypeCode: 'ta80024',
        handlerDeptId: auditor[0].deptId,
        handlerUserId: auditor[0].id,
        requestUsersIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name, // 承办部门
        requestId: this.currWritId,
        requestTime: dateFormat(new Date(), 'yyyy年mm月dd日'),
        requestUsersName: this.$store.state.penalty.udtNames,
        submitterCause: this.$store.state.penalty.penaltyUndEntity.caseName,
        parentTaskId: task[0].taskId, // 流程 taskId
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
          this.getFlow()
          this.showPdf = false
        })
        .catch(err => console.info(err))
    },
    closePdf() {
      this.showPdf = false
      this.$emit('sourceFalse')
    },
    close() {
      this.selectPeopleDialog = false
      this.dialogContent = ''
      this.dialogTitle = ''
    },

    modifyWrit() {
      this.$emit('pageChange', 'makePage', false, 'modify')
    },
    delWrit() {
      let delReq = { writId: this.currWritId }
      deleteWrit(delReq)
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
    },
    updatePdf(id) {
      this.currWritId = id
      this.closePdf()
      this.modifyWrit()
    }
  }
}
</script>

<style lang="less" scoped>
.finish_lay {
  .contain {
    padding-right: 30px;
    .info {
      font-size: 14px;
      line-height: 37px;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
      .casetit {
        text-align: justify;
        text-align-last: justify;
        width: 60px;
        padding-right: 20px;
        position: relative;
        &:after {
          content: ":";
          position: absolute;

        }
      }
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
  .jieanshenpiStyle {
    // border: 1px solid red;
    height: 600px;
    overflow-y: auto;
    .time_line_lay {
      padding-top: 20px;
    }
  }
  .big-dialog {
    /deep/.el-dialog {
      width: 1000px;
      height: auto;
      padding-bottom: 10px;
      .content {
        margin-bottom: 0;
      }
    }
  }
}
</style>
