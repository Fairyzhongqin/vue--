<template>
  <div class="new-inspection">
    <div>
      <sn-page-bar>
        <template slot="button">
          <el-button type="text" icon="el-icon-arrow-left" @click="backToList">返回</el-button>
        </template>
        <!-- 延期页面 -->
        <div class="delayContent">
          <true-delay-page
            :option="option"
            :originProbList="originProbList"
            :proofList="proofList"
            :alreadySave="alreadySave"
            ref="detail"
          ></true-delay-page>
        </div>
        <sn-empty-data text="暂无检查内容" v-if="!originProbList || originProbList.length === 0"></sn-empty-data>
      </sn-page-bar>
    </div>
    <!-- button group -->
    <buttonGroup :buttonList="buttonList"></buttonGroup>
    <!-- 文书展示 -->
    <show-pdf
      :pdfId="writId"
      v-if="showPdfDialog"
      @closePdf="closePdf"
      :buttonList="writButton"
      :writName="writName"
      @updatePdf="updatePdf"
      @auditPdf="auditPdf"
    ></show-pdf>
    <!-- 审批表 -->
    <el-dialog
      title="制作延期申请审批表"
      :before-close="closeDialogSpb"
      :visible.sync="dialogFormVisible"
      class="make-writ-dialog"
    >
      <apply-approval
        :writIdInSPB="writIdInSPB"
        @handleClose="handleCloseForm"
        @createPdf="createPdf"
        @cancel="closeDialogSpb"
        @updateWrit="updateWrit"
        :applyFromDelayStatus="applyFromDelayStatus"
        ref="delayForm"
      ></apply-approval>
    </el-dialog>
  </div>
</template>
<script>
import trueDelayPage from './TrueDelayPage'
import snPageBar from '@components/snPageBar/index'
import buttonGroup from '@components/buttonGroup/index'
import ApplyApproval from '@/components/commonWrit/DelayApplyApprovalForm'
import { showRectificationReviewDetail } from '@/api/rectification'
import { Throttle, dateFormat } from '@/utils/util'
import showPdf from '@/components/showPdf/index'
import { getInvesWrits, createWrit, updateWrit, deleteWrit, getWritInfo, getWritDataByWritId } from '@api/fileRelated' //新建文书
import { sealAudit } from '@api/common'
import snEmptyData from '@/components/snEmptyData'
import { mapState } from 'vuex'
export default {
  name: 'delayWs',
  components: {
    trueDelayPage,
    snPageBar,
    buttonGroup,
    ApplyApproval,
    showPdf,
    snEmptyData
  },
  data() {
    return {
      option: {
        examineInfo: {}
      },
      originProbList: [],
      proofList: [],
      alreadySave: new Date(),
      // btn
      buttonList: [
        {
          name: '返回',
          type: '',
          disable: false,
          fun: this.backToList
        },
        {
          name: '延期并制作延期申请审批表',
          type: 'primary',
          disable: true, //数据刷新好了才能点击延期 不然就是disabled状态
          fun: this.makeApprovalForm
        }
      ],
      writId: '', //文书id
      showPdfDialog: false,
      writButton: {
        closePdf: true,
        updatePdf: true,
        signPdf: true,
        finishPdf: true
      },
      writName: '',
      // 审批表
      dialogFormVisible: false,
      applyFromDelayStatus: false,
      writIdInSPB: '',
      writTypeCode: '',
      requestUsersIds: '',
      caseName: '',
      submitNames: '',
      newDelayArrList: [] //延期选中的检查项
    }
  },

  methods: {
    closeDialogSpb() {
      this.dialogFormVisible = false
      // 先清空文书id和各种信息
      console.info('reffffff', this.$refs.delayForm)
      this.$refs.delayForm.showPerson = false
      this.$refs.delayForm.showCompany = true
      this.$refs.delayForm.updateId = null
      this.applyFromDelayStatus = false
      this.$refs.delayForm.updateWritStatus = false
      this.$refs.delayForm.ruleForm.address = null
      this.$refs.delayForm.ruleForm.delayReason = null
      this.$refs.delayForm.ruleForm.appMatter = null
      this.$refs.delayForm.ruleForm.delayTime = {}
      this.$refs.delayForm.ruleForm.decisionTime = {}
      this.$refs.delayForm.ruleForm.decisionTime = {}
      this.$refs.delayForm.ruleForm.targetName = null
      this.$refs.delayForm.ruleForm.phone = null
      this.$refs.delayForm.ruleForm.personName = null
      this.$refs.delayForm.ruleForm.unitAddress = null
      this.$refs.delayForm.ruleForm.homeAddress = null
      // 再刷新状态
      this.initData()
      this.$store.commit('UPT_MODAL_SHOW', false)
    },
    initData() {
      showRectificationReviewDetail({
        id: this.delayDataId,
        isDelay: '0'
      })
        .then(res => {
          if (res.code === '0') {
            //   做数据处理
            if (res.data && res.data.probList.length > 0) {
              this.originProbList = res.data.probList.map(item => {
                if (item.children && item.children.length > 0) {
                  item.children.forEach(i => {
                    i.checked = false
                    i.reviewTime = null
                    i.reviewOpinion = null
                  })
                } else {
                  item.checked = false
                  item.reviewOpinion = null
                  item.reviewTime = null
                }
                return item
              })
            } else {
              //没有检查项的时候  延期并制作延期申请审批表置灰操作
              this.buttonList[1].disable = true
            }
            // 赋值企业相关信息
            this.option = res.data
            this.requestUsersIds = res.data.reviewNameId
            this.caseName = res.data.examineInfo.companyName
            this.submitNames = res.data.examineInfo.executorName
            // 赋值证据相关信息
            this.proofList = this.originProbList.reduce((total, item) => {
              let arr = []
              if (item.children && item.children.length > 0) {
                arr = item.children.reduce((sum, i) => {
                  i.flag = i.isQualified === '0'
                  if (i.recordList && i.recordList.length > 0) {
                    i.recordList.forEach(handlerItem => {
                      handlerItem.reviewTime =
                        handlerItem.reviewTime &&
                        handlerItem.reviewTime
                          .replace('/', '-')
                          .replace('/', '-')
                          .split(' ')[0]
                    })
                  }
                  if (i.accessoryList && i.accessoryList.length > 0) {
                    i.accessoryList.forEach(proof => {
                      proof.id = i.id
                      proof.type = '1'
                    })
                    sum = [...i.accessoryList]
                  }
                  return sum
                }, [])
              } else {
                item.flag = item.isQualified === '0'
                if (item.recordList && item.recordList.length > 0) {
                  item.recordList.forEach(handlerItem => {
                    if (handlerItem.reviewTime) {
                      handlerItem.reviewTime = handlerItem.reviewTime
                        .replace('/', '-')
                        .replace('/', '-')
                        .split(' ')[0]
                    }
                  })
                }
                if (item.accessoryList && item.accessoryList.length > 0) {
                  item.accessoryList.forEach(proof => {
                    proof.id = item.id
                    proof.type = '1'
                  })
                  arr = [...item.accessoryList]
                }
              }
              total = [...total, ...arr]
              return total
            }, [])
            if (res.data.accessoryList && res.data.accessoryList.length > 0) {
              res.data.accessoryList.forEach(item => {
                item.id = res.data.id
                item.type = '0'
              })
              this.proofList = [...this.proofList, ...res.data.accessoryList]
            }
            // 数据准备完毕 才可以点击延期
            this.buttonList[1].disable = false
          }
        })
        .catch(err => {
          console.info(err)
        })
    },
    backToList() {
      this.$store.commit('SET_NEW_DELAY_STATUS')
    },
    auditPdf(val) {
      let userInfo = JSON.parse(sessionStorage.userInfo)
      let params = {
        auditTypeCode: this.writTypeCode,
        handlerDeptId: val.deptId,
        handlerUserId: val.peopleId,
        parentTaskId: '',
        requestDeptName: userInfo.userEntity.deptName,
        requestId: val.pdfId,
        requestTime: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        requestUsersName: this.submitNames,
        submitterCause: this.caseName,
        requestUsersIds: this.requestUsersIds,
        partyName: this.option.examineInfo.companyName,
        partyId: this.option.examineInfo.companyId ? this.option.examineInfo.companyId : ''
      }
      sealAudit(params).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.initData()
        this.showPdfDialog = false
        this.dialogFormVisible = false
      })
    },
    // 制作文书
    makeApprovalForm: Throttle(function() {
      let detailInfo = this.$refs.detail
      if (detailInfo.selectedList && detailInfo.selectedList.length > 0) {
        this.newDelayArrList = [] //先置空 避免重复选中 往数组累加
        this.enterDelay()
      } else {
        this.$message({
          message: '请选择要处理的检查项',
          type: 'error'
        })
      }
    }, 2000),
    //延期
    enterDelay() {
      let detailInfo = this.$refs.detail
      this.newDelayArrList = this.handleTreeList(detailInfo.selectedList).reduce((total, item) => {
        total.push(item.id)
        return total
      }, [])
      this.$store.commit('SET_NEW_DELAY_ARR', this.newDelayArrList)
      this.dialogFormVisible = true
      this.applyFromDelayStatus = true
    },
    // 处理树状结构的数据
    handleTreeList(tree) {
      let arr = tree.reduce((total, item) => {
        let temp = []
        if (item.children && item.children.length > 0) {
          temp = item.children.reduce((sum, i) => {
            sum.push(i)
            return sum
          }, [])
        }
        // 存父项id
        temp.push(item)
        total = [...total, ...temp]
        return total
      }, [])
      return arr
    },
    // 生成审批表
    createPdf(params) {
      createWrit(params)
        .then(res => {
          if (res.code === '0') {
            this.setWritBtn(res.writType)
            this.writId = res.writId
            this.showPdfDialog = true
            // 为了解决在关闭文书后 数据刷新步骤还没走完的hack
            this.buttonList[1].disable = true
          }
        })
        .catch(err => {
          console.info(err)
        })
    },
    updatePdf() {
      this.showPdfDialog = false
      this.$refs.delayForm.updateWritStatus = true
      this.$refs.delayForm.updateId = this.writId
    },
    updateWrit(data) {
      updateWrit({ writId: data.writId }, data.data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '制作成功！'
          })
          this.writId = res.writId
          this.showPdfDialog = true
        })
        .catch(err => console.info(err))
      return
    },
    // 设置文书按钮状态
    setWritBtn(code) {
      let writTypeInfo = JSON.parse(sessionStorage.writTypeInfo)
      let item = writTypeInfo.find(i => {
        return i.id === code
      })
      this.writButton = {
        closePdf: true, //退出
        updatePdf: true, //回退编辑
        auditPdf: item.isAudit == 1, // 提交审核
        sealPdf: item.isSign == 1, // 加盖公章
        signPdf: item.userType == 1, // 签名
        lawSealPdf: item.isSign == 2, // 加盖执法专用章
        finishPdf: true //完成
      }
      this.writTypeCode = item.auditTypeCode //提交审核 传的 auditTypeCode
      this.writName = item.typeName //浏览文书名
    },
    // 关闭文书
    closePdf() {
      this.initData() //留在延期页面
      this.$refs.detail.selectedList = []
      this.applyFromDelayStatus = false
      setTimeout(() => {
        this.$refs.delayForm.initDelayData()
        this.dialogFormVisible = false
        this.showPdfDialog = false
        this.writId = null
      }, 10)
    },
    // 关闭申请表
    handleCloseForm() {
      this.dialogFormVisible = false
      this.initData()
      this.$store.commit('SET_NEW_DELAY_STATUS')
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  computed: {
    ...mapState(['delayExecutorId', 'delayDataId', 'delayFlag', 'delayCompanyId', 'delayPerson', 'delayStartTime', 'delayPersonName', 'delayCompanyName'])
  },
  watch: {}
}
</script>
<style lang="less" scoped>
.delayContent {
  margin-top: 40px;
}
.make-writ-dialog {
  /deep/ .el-dialog {
    width: 700px;
  }
}
</style>
