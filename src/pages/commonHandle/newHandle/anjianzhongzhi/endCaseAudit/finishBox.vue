<template>
  <div class="lasp-container">
    <div class="tab-left">
      <el-row class="listBox">
        <el-col :sm="24" :md="item.span" class="flex listLine" v-for="(item, index) in dataList" :key="index">
          <span class="label">{{ item.label }}</span>
          <span class="fonts" v-if="item.value" v-html="item.value"></span>
        </el-col>
      </el-row>

      <el-divider></el-divider>
      <div class="button-container">
        <div class="left">
          <el-button type="primary" size="mini" @click="preview">浏览案件终止审批表</el-button>
          <el-button type="primary" @click="preview('sign')" size="mini" v-if="isAuditAllowed && !forBrowse"
            >签名</el-button
          >
          <el-button type="primary" size="mini" v-if="isAuditAllowed && final && !forBrowse" @click="submit">提交审核</el-button>
        </div>
        <div class="buttons" v-if="!forBrowse">
          <el-button type="text" size="mini" @click="modify" v-if="isModifyAllowed && final">修改</el-button>
          <el-button type="text" style="color:#FF4B3D;" size="mini" v-if="isDeleteAllowed && final" @click="deleteWrit">删除</el-button>
        </div>
      </div>
    </div>

    <div class="tab-right">
      <div class="create-tab-title" style="margin-bottom: 16px;">审核审批流程</div>
      <sn-timeline class :lineData="auditProcesses"></sn-timeline>
    </div>
    <el-dialog :before-close="beforeClose" class="preview_dialog" :visible.sync="showDialog" width="900px" :title="dialogTitle">
      <img :src="previewAsset" alt v-if="dialogContent === 'img' && showDialog" class="show-img" />
      <select-people v-if="dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <ShowPdf
      :writName="'案件终止审批表'"
      v-if="showPdf"
      :pdfId="previewAsset"
      @closePdf="closeWrit"
      @auditPdf="auditPdf"
      @updatePdf="modify"
      @signSuccess="hasSign = true"
      :buttonList="btnList"
    ></ShowPdf>
  </div>
</template>
<script>
import snTimeline from '@/components/TimeLine'
import ShowPdf from '@/components/showPdf'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import baseUrl from '@/utils/webIp'
import { sealAudit, sealAuditStatus } from '@api/common'
import { deleteWritAndAccessory, queryWritState } from '@api/fileRelated'
import { dateFormat } from '@/utils/util'

export default {
  name: 'transferBookFinishBox',
  components: {
    snTimeline,
    ShowPdf,
    selectPeople
  },
  props: ['writInfo', 'source', 'forBrowse'],
  data() {
    return {
      uploadFileUrl: '', // 上传路径
      headers: { Authorization: '' }, // 授权信息
      params: {
        writId: this.writInfo.writId,
        type: '0' // 0 签字附件 1 其他附件
      },
      previewAsset: '', // 浏览图片时的url or 浏览pdf时的id
      creator: '', // 编制人
      showPdf: false, // 浏览文书
      showDialog: false,
      audiReq: {}, // 提交审核的信息
      dialogContent: '',
      dialogTitle: '', // 弹出框标题
      final: false,
      auditProcesses: [], // 审核审批流程信息
      isModifyAllowed: true, // 是否可以修改
      isAuditAllowed: true, // 提交审核
      isDeleteAllowed: true, // 是否可以删除
      btnList: {
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: false, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      dataList: [
        {
          label: '文书种类',
          value: this.writInfo.writTitle,
          span: 24
        },
        {
          label: '文书编号',
          value: this.writInfo.writNoName,
          span: 24
        },
        {
          label: '文书名称',
          value: this.writInfo.writTitle,
          span: 24
        },
        {
          label: '编制时间',
          value: this.writInfo.creatorTime,
          span: 24
        },
        {
          label: '编制人',
          value: this.writInfo.creatName,
          span: 24
        }
      ],
      hasSign: false // 是否已签过名
    }
  },
  created() {
    if (this.source) this.preview('create')
    this.uploadFileUrl = baseUrl + '/aj/writ/uploadWritAccessory'
    this.headers.Authorization = localStorage.getItem('token')
    this.initTransWrit()
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
    initTransWrit() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.creator = user.userEntity.nickName
      // 上传相关的准备
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
            this.final = true
          } else {
            // 无提交: 可以制作 可以提交
            this.isModifyAllowed = true
            this.isAuditAllowed = true
            this.isDeleteAllowed = true
            this.final = true
          }
        })
        .catch(err => console.info(err))
    },
    // pdf 而来的提交审核
    auditPdf(obj) {
      let _penalty = this.$store.state.penalty
      this.audiReq = {
        auditTypeCode: 'ta80047',
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        requestUsersIds: _penalty.penaltyUndEntity.udtIds,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name, // 承办部分
        requestId: this.writInfo.writId,
        requestTime: dateFormat(new Date(), 'yyyy年mm月dd日'),
        requestUsersName: obj.peopleName,
        submitterCause: _penalty.penaltyUndEntity.caseName,
        partyName: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName,
        partyId: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
      }
      this.auditWrit()
    },
    submitToAudition(bool, auditor) {
      this.beforeClose()
      if (!bool) return
      this.audiReq = {
        auditTypeCode: 'ta80047',
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
      this.auditWrit()
    },
    // 提交审核
    auditWrit() {
      sealAudit(this.audiReq)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.getWritStat()
          this.closeWrit()
        })
        .catch(err => console.info(err))
    },
    // 浏览文书
    preview(type) {
      this.setWritBtn(type)
      this.showDialog = false
      this.dialogTitle = '案件终止审批表'
      this.previewAsset = this.writInfo.writId
      this.showPdf = true
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
    // 关闭文书弹框
    closeWrit() {
      this.showPdf = false
    },
    // 删除文书
    deleteWrit() {
      this.$confirm('确定删除案件终止审批表吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let req = {
          writId: this.writInfo.writId,
          type: 'AJYSS'
        }
        deleteWritAndAccessory(req)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.$parent.initInfo()
            this.$parent.setComponentId('')
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
    // 设置文书 PDF 的按钮状态
    setWritBtn(type) {
      if (type === 'create') {
        this.btnList = {
          updatePdf: true, // 回退编辑
          signPdf: true, // 签名
          auditPdf: true, // 提交审核
          sealPdf: false, // 加盖公章
          finishPdf: true, // 完成
          lawSealPdf: false, // 加盖执法专用章
          closePdf: true // 退出
        }
      } else if (type === 'sign') {
        this.btnList = {
          updatePdf: false, // 回退编辑
          signPdf: true, // 签名
          auditPdf: true, // 提交审核
          sealPdf: false, // 加盖公章
          finishPdf: true, // 完成
          lawSealPdf: false, // 加盖执法专用章
          closePdf: true // 退出
        }
      } else {
        this.btnList = {
          updatePdf: false, // 回退编辑
          signPdf: false, // 签名
          auditPdf: false, // 提交审核
          sealPdf: false, // 加盖公章
          finishPdf: false, // 完成
          lawSealPdf: false, // 加盖执法专用章
          closePdf: true // 退出
        }
      }
    }
  }
}
</script>
<style lang="less" scope>
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
      .left .el-button:not(.is-disabled) {
        height: 28px;
        padding: 7px 8px;
        margin-left: 0;
        background: rgba(0, 153, 255, 1);
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

  .buttons > div {
    display: inline-block;
  }

  .show-img {
    width: 100%;
    height: 100%;
  }
}

.listBox {
  padding: 5px 16px;
  box-sizing: border-box;
}

.label {
  width: 75px;
  text-align: justify;
  text-align-last: justify;
  position: relative;
  &:after {
    content: ":";
    position: absolute;
  }
  // line-height: 30px;
}
.listLine {
  line-height: 30px;
}

.del-this {
  color: #ccc;
  cursor: pointer;
  &:hover {
    color: #999;
  }
}
.accessory {
  margin-bottom: 5px;
  padding: 0 3px;
  border-radius: 5px;
  &:hover {
    background: #eef5f9;
  }
}
.color-blue {
  color: #0099ff;
  cursor: pointer;
}
.hoverLine {
  &:hover {
    text-decoration: underline;
  }
}
</style>
