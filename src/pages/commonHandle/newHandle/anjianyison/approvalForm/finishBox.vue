<template>
  <div class="lasp-container">
    <div class="tab-left">
      <el-row class="listBox">
        <el-col :span="item.span" class="flex align-items-center" v-for="(item, index) in dataList" :key="index">
          <span class="label" :class="item.class">{{ item.label }}</span>
          <span class="fonts">{{ item.value }}</span>
        </el-col>
      </el-row>

      <el-divider></el-divider>
      <div class="button-container">
        <div class="left">
          <el-button type="primary" @click="preview" size="mini">浏览案件移送审批表</el-button>
          <!-- <el-button type="primary" :disabled="hasSign" @click="preview('sign')" size="mini" v-if="isAuditAllowed && !forBrowse"
            >{{ hasSign ? '已' : '' }}签名</el-button
          > -->
          <el-button type="primary" @click="preview('sign')" size="mini" v-if="isAuditAllowed && !forBrowse"
            >签名</el-button
          >
          <el-button type="primary" @click="submit" size="mini" v-if="isAuditAllowed && !forBrowse">提交审核</el-button>
        </div>
        <div v-if="!forBrowse">
          <el-button type="text" size="mini" @click="modify" v-if="isModifyAllowed">修改</el-button>
          <el-button type="text" style="color:#FF4B3D;" @click="deleteWrit" size="mini" v-if="isDeleteAllowed">删除</el-button>
        </div>
      </div>
    </div>

    <div class="tab-right">
      <div class="create-tab-title" style="margin-bottom: 16px;">审核审批流程</div>
      <sn-timeline class :lineData="auditProcesses"></sn-timeline>
    </div>
    <el-dialog :before-close="beforeClose" class="preview_dialog" :visible.sync="showDialog" width="900px" :title="dialogTitle">
      <select-people v-if="dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <ShowPdf
      :writName="'案件移送审批表'"
      v-if="showPdf"
      :pdfId="previewId"
      :buttonList="btnList"
      @finishPdf="finishPdf"
      @updatePdf="modify"
      @auditPdf="auditPdf"
      @closePdf="finishPdf"
      @signSuccess="hasSign = true"
    ></ShowPdf>
  </div>
</template>
<script>
import snTimeline from '@/components/TimeLine'
import ShowPdf from '@/components/showPdf'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { sealAudit, sealAuditStatus } from '@api/common'
import { deleteWrit, queryWritState } from '@api/fileRelated'
import { dateFormat } from '@/utils/util'

export default {
  name: 'approvalFormFinishBox',
  components: {
    snTimeline,
    ShowPdf,
    selectPeople
  },
  props: ['writInfo', 'source', 'forBrowse'],
  data() {
    return {
      caseData: [], //案件转移数据
      creator: '', // 编制人
      showDialog: false,
      audiReq: {}, // 提交审核的信息
      dialogContent: '',
      previewId: '', // 文书浏览的id
      dialogTitle: '', // 弹出框标题
      auditProcesses: [], // 审核审批流程信息
      isModifyAllowed: true, // 是否可以修改
      isAuditAllowed: true, // 提交审核
      isDeleteAllowed: true, // 是否可以删除
      showPdf: false,
      dataList: [
        {
          label: '文书种类',
          value: this.writInfo.writTitle,
          class: 'narrow'
        },
        {
          label: '文书编号',
          value: this.writInfo.writNoName,
          class: 'narrow'
        },
        {
          label: '文书名称',
          value: this.writInfo.writTitle,
          class: 'narrow'
        },
        {
          label: '编制时间',
          value: this.writInfo.creatorTime,
          class: 'narrow'
        },
        {
          label: '编制人',
          value: this.writInfo.creatName,
          class: 'narrow'
        }
      ],
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
    this.initCaseTrans()
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
    initCaseTrans() {
      this.getWritStat()
    },
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
            if (code === 'a01' || code === 'a002' || code === 'a004' || code === 'a006' || code === 't03') {
              this.isModifyAllowed = false
              this.isAuditAllowed = false
            } else if (code === 'a001' || code === 'a003' || code === 'a005' || code === 't01') {
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
        auditTypeCode: 'ta80020',
        handlerDeptId: auditor[0].deptId,
        handlerUserId: auditor[0].id,
        requestUsersIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name, // 承办部门
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
      this.dialogTitle = '案件移送审批表'
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
    // 删除文书
    deleteWrit() {
      this.$confirm('确定删除案件移送审批表吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let req = {
          writId: this.writInfo.writId
        }
        deleteWrit(req)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.$parent.initInfo()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
          })
      })
    },
    // 修改
    modify() {
      this.$parent.setComponentId('editBox')
    },
    finishPdf() {
      this.showPdf = false
    },

    auditPdf(obj) {
      let _penalty = this.$store.state.penalty
      // let task = this.$store.state.processes.get("AJSL")
      //   ? JSON.parse(this.$store.state.processes.get("AJSL"))
      //   : [];
      sealAudit({
        auditTypeCode: 'ta80020',
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        // parentTaskId: task[0].taskId,
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
      }).then(res => {
        this.$message({
          type: 'success',
          message: '提交审核成功！'
        })
        this.finishPdf()
        this.initCaseTrans()
      })
    }
  }
}
</script>
<style lang="less" scope>
/deep/ .content {
  padding-right: 8px;
}
.lasp-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 250px;

  .tab-left {
    width: calc(65% - 15px);

    .button-container {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .left .el-button {
        height: 28px;
        padding: 7px 8px;
        margin-left: 0;
        background: rgba(0, 153, 255, 1);
        &.is-disabled {
          background-color: #a0cfff;
        }
      }
    }
  }

  .tab-middle {
    width: 1px;
    background-color: #e0e0e0;
  }

  .tab-right {
    width: calc(35% - 15px);
    margin-top: -24px;
  }
}

.listBox {
  padding: 5px 16px;
  box-sizing: border-box;
}

.label {
  width: 60px;
  line-height: 30px;
  position: relative;
  text-align: justify;
  text-align-last: justify;
  padding-right: 20px;
  &:after {
    content: ":";
    position: absolute;
  }
  &.narrow {
    width: 60px;
  }
}
</style>
