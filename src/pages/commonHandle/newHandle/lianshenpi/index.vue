<template>
  <div class="lasp-container">
    <div class="tab-left">
      <div class="create-tab-title">立案审批</div>
      <simple-table v-show="isPreviewAvailable || prevAndDelReq.writId" :info="regisInfo"></simple-table>
      <el-divider v-if="isPreviewAvailable || prevAndDelReq.writId"></el-divider>
      <div class="button-container">
        <div class="left_buttons">
          <el-button type="primary" size="mini" @click="makeRegisterFile">{{ isPreviewAvailable ? '浏览立案审批表' : '生成立案审批表' }}</el-button>
          <!-- 原先的按钮控制 -->
          <!-- v-if="(isFirstCreated&&isPreviewAvailable&&!isSubmitDone)||(createdOnceMore&&isPreviewAvailable)" -->
          <template v-if="!forBrowse">
            <el-button
              v-if="(isFirstCreated && isPreviewAvailable && !isSubmitDone) || (!isFirstCreated && !isSubmitDone)"
              type="primary"
              size="mini"
              @click="toSeal"
              :disabled="isPenaltyInfoUpdated"
              >提交审核</el-button
            >
            <el-button
              v-if="(prevAndDelReq.writId && isFirstCreated && isPreviewAvailable) || (!isFirstCreated && !isSubmitDone && isPreviewAvailable)"
              type="primary"
              size="mini"
              @click="signFile"
              >{{ hasSign ? '签名' : '签名' }}</el-button
            >
            <!-- <el-button
              v-if="(prevAndDelReq.writId && isFirstCreated && isPreviewAvailable) || (!isFirstCreated && !isSubmitDone && isPreviewAvailable)"
              type="primary"
              :disabled="hasSign"
              size="mini"
              @click="signFile"
              >{{ hasSign ? '已签名' : '签名' }}</el-button
            > -->
          </template>

          <el-button type="primary" size="mini" @click="modifyWrit('detail')" v-if="!forBrowse">详情</el-button>
        </div>
        <div class="right_buttons">
          <el-button v-if="(prevAndDelReq.writId && isFirstCreated) || (!isFirstCreated && !isSubmitDone)" @click="modifyWrit" type="text" size="mini"
            >修改</el-button
          >
          <el-button v-if="prevAndDelReq.writId && isFirstCreated" type="text" style="color:#FF4B3D;" size="mini" @click="deleteFile">删除</el-button>
        </div>
      </div>
    </div>
    <div class="tab-right">
      <div class="audit create-tab-title">审核审批流程</div>
      <sn-time-line :lineData="auditProcesses"></sn-time-line>
    </div>
    <ShowPdf
      v-if="isPreviewVisible"
      :pdfId="prevAndDelReq.writId"
      :buttonList="btnList"
      :writName="'立案审批表'"
      @signSuccess="getSignSta"
      @auditPdf="auditPdf"
      @updatePdf="updatePdf"
      @closePdf="isPreviewVisible = false"
    ></ShowPdf>

    <el-dialog class="auditor_dialog" width="1000px" title="选择审核人员" :visible.sync="isAuditorVisible">
      <SelectPeople v-if="isAuditorVisible" v-on:getPeople="submitToAudition" :selectNum="1" :peopleCache="peopleCache"></SelectPeople>
    </el-dialog>
  </div>
</template>

<script>
import snTimeLine from '@/components/TimeLine'
import simpleTable from '../../components/simpleTable'
import ShowPdf from '@/components/showPdf'
import SelectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { createWrit, deleteWrit, updateWrit, getWritInfo, queryWritState } from '@api/fileRelated'
import { sealAuditStatus, sealAudit } from '@api/common'
import { getWritParams, dateFormat } from '@/utils/util'
import { mapState } from 'vuex'

export default {
  name: 'lianshenpi',
  components: {
    snTimeLine,
    simpleTable,
    ShowPdf,
    SelectPeople
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      penalty: {
        blcList: [
          {
            breakLawCaseId: 6,
            penaltyId: '',
            actName: '',
            checkContent: '',
            checkDesc: '',
            lawContent: '',
            penaltyAcdName: '',
            dataSource: '',
            ruleId: '',
            discretionId: '',
            penaltyAmount: ''
          }
        ],
        penaltyUndEntity: {
          punishCompanyId: '',
          punishPersonName: '',
          age: 0,
          sex: '',
          currentCompany: '',
          objectAddress: '',
          idCard: '',
          job: '',
          telphone: '',
          penaltyId: '',
          caseReasonCode: '',
          caseName: '',
          caseSourceId: '',
          objectType: '',
          caseSituation: '',
          suggestion: '',
          udtIds: '1',
          executorDeptId: '',
          creatorId: '',
          creatorTime: '',
          accessoryId: '',
          caseStateId: '',
          updTime: '',
          updPersonId: '',
          caseCrimeTime: null,
          caseEndTime: ''
        },
        punishCompanyName: ''
      },
      fileCreatedReq: {
        contractorIds: '', // 承办人
        data: [],
        sourceId: '', // 来源
        userId: '', // 本人
        writType: 'LASPB' // 文书类型
      },
      prevAndDelReq: {
        writId: ''
      },
      isPreviewAvailable: false, // 是否可浏览 即 是否制作过
      isPreviewVisible: false, // 浏览弹出框
      isAuditorVisible: false, // 审核人员弹出框
      isSubmitDone: false, // 是否已提交审核
      isFirstCreated: true, // 是否是第一次制作
      hasSign: false, // 是否置灰签名按钮
      regisInfo: {}, // 立案信息
      task: '', // 流程任务
      auditProcesses: [], // 审核流程
      userInfo: {}, //登陆人信息
      btnList: {
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      peopleCache: [] // 审核人员回显值
    }
  },
  created() {
    this.initDetail()
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
  },
  computed: {
    // 为了方便本地 computed 定义
    ...mapState(['isPenaltyInfoUpdated', 'createdOnceMore'])
  },
  methods: {
    initDetail() {
      this.penalty = this.$store.state.penalty

      let infoReq = {
        sourceId: this.penalty.penaltyUndEntity.penaltyId,
        type: 'LASPB'
      }
      getWritInfo(infoReq) // 获取文书 并 判断是否存在
        .then(data => {
          if (data.code == 0) {
            if (data.data.length > 0) {
              this.prevAndDelReq.writId = data.data[0].writId
              this.getWritStat()
              this.getSignSta(this.prevAndDelReq.writId)
            } else {
              this.isPreviewAvailable = false
            }
          }
        })
        .catch(err => console.info(err))
    },
    // 获取文书审核审批状态
    getWritStat() {
      sealAuditStatus({
        requestId: this.prevAndDelReq.writId
      })
        .then(res => {
          let lastStatus = res.data[0] // 最后一次审核审批状态
          let _entity = this.penalty.penaltyUndEntity,
            statusDes = ''

          this.auditProcesses = res.data
          if (lastStatus) {
            this.isFirstCreated = false
            this.isSubmitDone = lastStatus.pass == 1 ? false : true
          } else {
            statusDes = '待提交'
            console.info(this.isPenaltyInfoUpdated)
            this.isPreviewAvailable = this.isPenaltyInfoUpdated ? false : true
          }

          this.regisInfo = {
            // 展示的文书信息
            // 立案详情
            caseName: _entity.caseName, // 案件名称
            subject: _entity.objectType == 0 ? this.penalty.punishCompanyName : _entity.punishPersonName, // 责任主体
            caseSourceName: this.penalty.caseSourceName, // 案件来源
            caseReasonNames: this.penalty.caseReasonNames, // 案由
            udtNames: this.penalty.udtNames, // 承办人
            caseSituation: _entity.caseSituation, // 案件基本情况
            suggestion: _entity.suggestion, // 承办人意见
            postCode: _entity.postCode, // 邮编
            telphone: _entity.telphone, // 联系电话
            objectAddress: _entity.objectAddress, // 地址
            examineTime: _entity.examineTime // 检查时间
          }

          // 如果没有提交过审核就不用判断了
          if (lastStatus) {
            switch (lastStatus.auditResultCode) {
              case 'a01': // 待审核：不可以制作 不可以提交
                statusDes = '待审核'
                this.isPreviewAvailable = true
                break
              case 'a001': //审核不通过：可以制作 可以提交
                statusDes = '审核不通过'
                this.isPreviewAvailable = this.isPenaltyInfoUpdated ? false : true
                this.isSubmitDone = false
                break
              case 'a002': // 审核通过:不可以制作 不可以提交
                statusDes = '待审批'
                this.isPreviewAvailable = true
                this.isSubmitDone = true
                break
              case 'a003': // 审批不通过：可以制作 可以提交
                statusDes = '审批不通过'
                this.isPreviewAvailable = this.isPenaltyInfoUpdated ? false : true
                this.isSubmitDone = false
                break
              case 'a004': // 审批通过：不可以制作 不可以提交
                statusDes = '审批通过'
                this.isPreviewAvailable = true
                this.isSubmitDone = true
                break
              case 'a005': // 审查不通过：可以制作 可以提交
                statusDes = '审查不通过'
                this.isPreviewAvailable = this.isPenaltyInfoUpdated ? false : true
                this.isSubmitDone = false
                break
              case 'a006': // 审查通过：不可以制作 不可以提交
                statusDes = '审查通过'
                this.isPreviewAvailable = true
                this.isSubmitDone = true
                break
              case 't01': // 审核返回上一级：可以制作 可以提交
                statusDes = '待提交'
                this.isPreviewAvailable = this.isPenaltyInfoUpdated ? false : true
                this.isSubmitDone = false
                break
              case 't03': // 审批返回上一级：不可以制作 不可以提交
                statusDes = '待审核'
                this.isPreviewAvailable = true
                this.isSubmitDone = true
                break
              default:
                console.info('It is over.')
            }
          }

          this.regisInfo.statusDes = statusDes
        })
        .catch(err => console.info(err))
    },
    // 获取签名状态
    getSignSta(id) {
      let writId = id ? id : this.prevAndDelReq.writId
      queryWritState({ writId: writId }).then(res => {
        if (res.code === '0') {
          this.hasSign = res.data.currUserIdSign
        }
      })
    },
    // 生成文书
    makeRegisterFile(type) {
      if (this.isPreviewAvailable) {
        this.previewFile()
      } else {
        this.modifyWrit()
      }
      // 下面生成文书的功能移到立案详情那里了
      return
      let _entity = this.penalty.penaltyUndEntity
      let _dataFields = getWritParams({
        tag2: this.penalty.caseReasonNames, // 案由
        tag3: this.penalty.caseSourceName, // 案件来源
        tag4: _entity.creatorTime, // 时间
        tag5: _entity.caseName, // 案件名称
        tag6: _entity.objectType === '0' ? this.penalty.punishCompanyName : _entity.punishPersonName, // 当事人
        tag7: _entity.telphone, // 电话
        tag8: '', // 负责人 暂不填 coding
        tag9: _entity.objectAddress, // 地址
        tag10: _entity.postCode, // 邮编
        tag11: _entity.caseSituation, // 案件基本情况
        tag12: _entity.suggestion // 承办人意见
      })

      this.fileCreatedReq = {
        contractorIds: _entity.udtIds, // 承办人
        data: _dataFields,
        sourceId: this.penalty.penaltyUndEntity.penaltyId,
        userId: '1', // coding 待定
        writType: 'LASPB'
      }
      // 文书存在 && 已被修改
      if (this.prevAndDelReq.writId && this.isPenaltyInfoUpdated) {
        updateWrit(this.prevAndDelReq, _dataFields)
          .then(data => {
            this.$store.commit('setIsPenaltyInfoUpdated', false)
            this.$store.commit('setCreatedOnceMore', true)
            this.initDetail()
            this.$message({
              type: 'success',
              message: '制作成功！'
            })
          })
          .catch(err => console.info(err))
        return
      }
      // 创建全新文书
      createWrit(this.fileCreatedReq)
        .then(data => {
          this.$store.commit('setIsPenaltyInfoUpdated', false)
          this.prevAndDelReq.writId = data.writId
          this.initDetail()
          this.$message({
            type: 'success',
            message: '制作成功！'
          })
        })
        .catch(err => console.info(err))
    },
    // 签名文书
    signFile() {
      this.btnList = {
        updatePdf: false, // 回退编辑
        signPdf: true, // 签名
        auditPdf: true, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      }
      this.isPreviewVisible = true
    },
    // 浏览文书
    previewFile() {
      this.btnList = {
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: false, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      }
      this.isPreviewVisible = true
    },
    // 修改文书
    modifyWrit(type) {
      if (type === 'detail') {
        this.penalty.isDetail = true
        this.$store.commit('setPenalty', this.penalty)
      }
      this.$store.commit('updateFrom', 'lianshenpi')
      this.$store.commit('setCurrentComponent', 'newFilingRegister')
    },
    updatePdf() {
      this.isPreviewVisible = false
      this.modifyWrit()
    },
    // 删除文书
    deleteFile() {
      deleteWrit(this.prevAndDelReq)
        .then(data => {
          this.prevAndDelReq.writId = ''
          this.initDetail()
        })
        .catch(err => {
          console.info(err)
          this.$message({
            type: 'error',
            message: '删除失败！'
          })
        })
    },
    // 弹出选择人员框
    toSeal() {
      queryWritState({ writId: this.prevAndDelReq.writId }).then(res => {
        if (res.data.isUserSign === 1 && !res.data.isAllUserSign) {
          this.$message({
            type: 'warning',
            message: '请耐心等待所有承办人员签名。'
          })
        } else {
          this.isAuditorVisible = true
        }
      })
    },
    // 提交审核
    submitToAudition(bool, auditor) {
      this.isAuditorVisible = false
      if (!bool) return
      // 获取立案审批的流程任务
      this.task = this.$store.state.processes.get('LASP') ? JSON.parse(this.$store.state.processes.get('LASP')) : []
      let _audiReq = {
        auditTypeCode: 'ta80005',
        handlerDeptId: auditor[0].deptId,
        handlerUserId: auditor[0].id,
        requestDeptName: this.userInfo.sysDeptEntity.name,
        requestId: this.prevAndDelReq.writId,
        requestUsersIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
        requestTime: dateFormat(new Date(), 'yyyy年mm月dd日'),
        requestUsersName: this.penalty.udtNames,
        submitterCause: this.penalty.penaltyUndEntity.caseName,
        parentTaskId: this.task[0].taskId, // 流程 taskId
        partyName: this.penalty.penaltyUndEntity.objectType === '0' ? this.penalty.punishCompanyName : this.penalty.penaltyUndEntity.punishPersonName,
        partyId: this.penalty.penaltyUndEntity.objectType === '0' ? this.penalty.punishCompanyId : ''
      }

      // 调用接口向下走流程
      sealAudit(_audiReq)
        .then(res => {
          this.$store.commit('setCreatedOnceMore', false)
          this.getWritStat()
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
        })
        .catch(err => console.info(err))
    },
    auditPdf(obj) {
      this.task = this.$store.state.processes.get('LASP') ? JSON.parse(this.$store.state.processes.get('LASP')) : []
      let _audiReq = {
        auditTypeCode: 'ta80005',
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        requestDeptName: this.userInfo.sysDeptEntity.name,
        requestUsersIds: this.penalty.penaltyUndEntity.udtIds,
        requestId: this.prevAndDelReq.writId,
        requestTime: dateFormat(new Date(), 'yyyy年mm月dd日'),
        requestUsersName: this.penalty.udtNames,
        submitterCause: this.penalty.penaltyUndEntity.caseName,
        parentTaskId: this.task[0].taskId, // 流程 taskId       
        partyName: this.penalty.penaltyUndEntity.objectType === '0' ? this.penalty.punishCompanyName : this.penalty.penaltyUndEntity.punishPersonName,
        partyId: this.penalty.penaltyUndEntity.objectType === '0' ? this.penalty.punishCompanyId : ''
      }
      // 调用接口向下走流程
      sealAudit(_audiReq)
        .then(res => {
          this.isPreviewVisible = false
          this.$store.commit('setCreatedOnceMore', false)
          this.getWritStat()
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
        })
        .catch(err => console.info(err))
    }
  }
}
</script>

<style lang="less" scoped>
.lasp-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 250px;
  .tab-left {
    width: calc(65% - 15px);
    .button-container {
      height: 62px;
      line-height: 62px;
      padding: 0 15px 0 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .left_buttons {
        /deep/ .el-button {
          height: 28px;
          padding: 7px 8px;
          margin-left: 0;
          &:not(.is-disabled) {
            background: rgba(0, 153, 255, 1);
          }
        }
      }
      .right_buttons {
        .el-button {
          font-size: 14px;
        }
      }
    }
  }
  .tab-right {
    width: calc(35% - 15px);
    margin-top: 0;
    overflow: auto;
    // border: 1px solid salmon;
    height: 600px;
    .audit {
      margin-bottom: 16px;
    }
  }
}
.preview_dialog {
  .el-dialog__wrapper .el-dialog__header {
    padding: 24px 20px 10px;
  }
}

.lasp-container {
  .el-timeline {
    padding-left: 2px;
    padding-top: 10px;
  }
}
</style>
