<template>
  <div class="lasp-container">
    <div class="tab-left">
      <el-row class="listBox">
        <el-col class="flex listLine" v-for="(item, index) in dataList" :key="index">
          <span class="label">{{ item.label }}</span>
          <span class="fonts" v-if="item.value" v-html="item.value"></span>
          <div v-if="item.child">
            <div v-if="item.child.length === 0 || !item.child">暂无</div>
            <div>
              <div class="accessory" v-for="(itm, ind) in item.child" :key="ind" v-show="item.allShow ? true : ind < 2">
                <i class="el-icon-paperclip" style="color: #0099ff"></i>
                <span @click="previewFile(itm)" class="color-blue hoverLine">{{ itm.accessoryName }}</span>
                <i class="el-icon-error del-this"></i>
              </div>
              <div v-if="item.child.length > 2" class="color-blue" @click="item.allShow = !item.allShow">
                <i :class="item.allShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                {{ item.allShow ? '收起附件' : `展开其余${item.child.length - 2}个附件` }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-divider></el-divider>
      <div class="button-container">
        <div class="left">
          <el-button type="primary" size="mini" @click="preview">浏览案件移送书</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="writInfo.noProcessSignStatus === 1 || currentHasSign"
            v-if="isAuditAllowed && !forBrowse"
            @click="submit"
            >{{ writInfo.isSign === 2 ? '加盖执法专用章' : '加盖公章' }}</el-button
          >
        </div>
        <div class="buttons" v-if="!forBrowse">
          <el-button type="text" size="mini" @click="modify" v-if="isModifyAllowed">修改</el-button>
          <el-button type="text" style="color:#FF4B3D;" size="mini" v-if="isDeleteAllowed" @click="deleteWrit">删除</el-button>
          <el-upload
            :action="uploadFileUrl"
            multiple
            ref="upload"
            :show-file-list="false"
            :headers="headers"
            :data="params"
            :before-upload="beforeUpload"
            :on-success="uploadSuccessful"
            :on-error="uploadFailed"
          >
            <!--<el-button type="text" size="mini" slot="trigger">上传签字文书</el-button>-->
          </el-upload>
        </div>
      </div>
    </div>

    <div class="tab-right">
      <div class="create-tab-title" style="margin-bottom: 16px;">公章审核流程</div>
      <sn-timeline class :lineData="auditProcesses"></sn-timeline>
    </div>
    <el-dialog :before-close="beforeClose" class="preview_dialog" :visible.sync="showDialog" width="900px" :title="dialogTitle">
      <img :src="previewAsset" alt v-if="dialogContent === 'img' && showDialog" class="show-img" />
      <select-people v-if="dialogContent === 'selectPeople'" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <ShowPdf
      :writName="'案件移送书'"
      v-if="showPdf"
      :pdfId="previewAsset"
      :buttonList="btnList"
      @finishPdf="closeWrit"
      @signSuccess="currentHasSign = true"
      @updatePdf="modify"
      @sealPdf="submitFormPdf"
      @closePdf="closeWrit"
    ></ShowPdf>
  </div>
</template>
<script>
import snTimeline from '@/components/TimeLine'
import ShowPdf from '@/components/showPdf'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import baseUrl from '@/utils/webIp'
import { sealAudit, sealAuditStatus } from '@api/common'
import { deleteWritAndAccessory } from '@api/fileRelated'
import { dateFormat } from '@/utils/util'
import { handleBtnList } from '@/utils/audit'
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
      auditProcesses: [], // 审核审批流程信息
      isModifyAllowed: true, // 是否可以修改
      isAuditAllowed: true, // 提交审核
      isDeleteAllowed: true, // 是否可以删除
      dataList: [
        {
          label: '文书种类',
          value: this.writInfo.writTitle,
          span: 10
        },
        {
          label: '文书编号',
          value: this.writInfo.writNoName,
          span: 14
        },
        {
          label: '文书名称',
          value: this.writInfo.writTitle,
          span: 10
        },
        {
          label: '编制时间',
          value: this.writInfo.creatorTime,
          span: 14
        },
        {
          label: '编制人',
          value: this.writInfo.creatName,
          span: 24
        } /*,
        {
          label: "文件附件",
          span: 24,
          allShow: false,
          child: this.writInfo.lst
        }*/
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
      currentHasSign: false
    }
  },
  created() {
    console.info(this.writInfo)
    if (this.source) this.preview('created')
    this.uploadFileUrl = baseUrl + '/aj/writ/uploadWritAccessory'
    this.headers.Authorization = localStorage.getItem('token')
    this.initTransWrit()
  },
  methods: {
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
    submitFormPdf(auditor) {
      let _auditor = [
        {
          deptId: auditor.deptId,
          id: auditor.peopleId
        }
      ]
      this.submitToAudition(true, _auditor)
    },
    submitToAudition(bool, auditor) {
      this.beforeClose()
      if (!bool) return
      this.audiReq = {
        auditTypeCode: 'ta80040',
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
          this.showPdf = false
          this.getWritStat()
        })
        .catch(err => console.info(err))
    },
    preview(type) {
      if (type === 'created') {
        this.btnList = handleBtnList('ws10044', false)
      } else {
        this.btnList = handleBtnList('ws10044', true)
      }
      this.showDialog = false
      this.dialogTitle = '案件移送书'
      this.showPdf = true
      this.previewAsset = this.writInfo.writId
    },
    submit() {
      if (this.writInfo.isSign === 2) {
        this.preview('created')
        this.btnList.updatePdf = false
      } else {
        this.dialogContent = 'selectPeople'
        this.dialogTitle = '选择审核人员'
        this.showDialog = true
      }
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
      this.$confirm('确定删除案件移送书吗？', '提示', {
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
    uploadSuccessful(info) {
      this.$loading.hiddenLoading()
      if (info.code === '0') {
        this.$message({
          type: 'success',
          message: '文件上传成功！'
        })
        this.$parent.initInfo()
      } else {
        this.$message({
          type: 'error',
          message: info.msg
        })
      }
    },
    uploadFailed(err) {
      this.$loading.hiddenLoading()
      this.$message({
        type: 'success',
        message: err
      })
    },
    // 上传签字文书的校验
    beforeUpload(file) {
      let typeList = 'image/jpeg/image/jpg/image/png/application/pdf/JPEG/JPG/PNG/PDF'
      let fileNameReg = /[#$@&%',;=?$/]/gi
      if (typeList.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) < 0) {
        this.$message({
          type: 'error',
          message: '请上传正确的附件格式：图片或PDF文件！'
        })
        return false
      } else if (fileNameReg.test(file.name)) {
        this.$alert('文件名不能包含特殊字符，请修改后再试', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return false
      } else {
        this.$loading.showLoading()
        return true
      }
    },
    // 浏览签字文书
    previewFile(val) {
      this.showDialog = false
      if (val.accessoryType === '.pdf') {
        this.previewAsset = val.accessoryId
        this.showPdf = true
      } else {
        this.previewAsset = val.accessoryUrl + '&token=' + this.headers.Authorization
        this.dialogContent = 'img'
      }
    }
  },
  watch: {
    writInfo: {
      handler: function(newVal, oldVal) {
        for (let val of this.dataList) {
          if (val.label === '文件附件') {
            val.child = newVal.lst
          }
        }
      },
      deep: true
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
      .left .el-button {
        height: 28px;
        padding: 7px 8px;
        margin-left: 0;
        background: rgba(0, 153, 255, 1);
        &.is-disabled {
          background-color: #a0cfff;
          border-color: #a0cfff;
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
  width: 60px;
  position: relative;
  text-align: justify;
  text-align-last: justify;
  padding-right: 20px;
  &:after {
    content: ':';
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
