<template>
  <div>
    <div class="new-inspection" id="insp-scroll-hook">
      <sn-page-bar>
        <template slot="button">
          <el-button type="text" icon="el-icon-arrow-left" @click="backPage">返回</el-button>
        </template>
        <div
          v-show="(!dataId || (dataId && isShowUpdate)) && tabContent === 'check' && !isEasyPunish"
        >
          <inspection-header
            ref="header"
            :isChanged="isUpdate"
            :getHeader="headerInfo"
            @chooseTab="chooseTab"
            :schemeId="getSchemeId"
          ></inspection-header>
          <inspection-detail
            ref="detail"
            :getDetailInfo="detailInfo"
            :isUpdate="isUpdate"
            :isNewUpdate="isNewUpdate"
            :getSourceId="sourceId"
            @afterUpload="save('afterUpload')"
            @delTips="getNewDetail"
          ></inspection-detail>
        </div>
      </sn-page-bar>
      <!-- 制作其他文书 行政强制文书 文书浏览 -->
      <show-pdf
        :pdfId="pdfId"
        v-if="dialogContent === 'showPdf'"
        :buttonList="writButtonList"
        :writName="writName"
        @closePdf="closePdf"
        @updatePdf="closePdf"
        @finishPdf="closePdf"
      ></show-pdf>
      <el-dialog
        :class="getDialogClass"
        :visible.sync="showPdfDialog"
        :title="dialogTitle"
        :before-close="closeDialog"
      >
        <select-people
          v-if="dialogContent === 'selectPeople'"
          :selectNum="1"
          @getPeople="submitToAudition"
        ></select-people>
        <select-tips
          v-if="dialogContent === 'confirmTips'"
          :checkList="confirmCheckList"
          @getSelectTips="getSelectTips"
          @cancel="close"
        ></select-tips>
      </el-dialog>
    </div>
    <buttonGroup :buttonList="buttonList"></buttonGroup>
  </div>
</template>

<script>
import inspectionHeader from './component/inspectionHeader'
import snPageBar from '@components/snPageBar/index'
import buttonGroup from '@components/buttonGroup/index'
import inspectionDetail from './component/newInspectionDetail'
import { inspectionSave, getInspectionDetail, updateInspectionDetail, getComInfo, toRectification, toInspectionHandle } from '@/api/onSiteInspection/index'
import { createWrit, getWritInfo, updateWrit } from '@/api/fileRelated'
import { sealAudit } from '@api/common'
import showPdf from '@/components/showPdf/index'
import { mapState } from 'vuex'
import { dateFormat, stringToDate, getWritParams, debounce, toCommonMoney } from '@/utils/util'
import { addFilingRegister } from '@/api/filingRegister/index'
import { saveSimpleAdministration } from '@/api/ProcessingofInspectionResult/index'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import selectTips from './component/selectTips'
// 获取人员详细信息
import { getUserInfoById } from '@/api/common'

export default {
  name: 'newInspection',
  props: {
    dataId: {
      type: String,
      required: false
    },
    schemeId: {
      required: false
    }
  },
  components: {
    inspectionHeader,
    snPageBar,
    buttonGroup,
    showPdf,
    inspectionDetail,
    selectPeople,
    selectTips
  },
  data() {
    return {
      agentId: null, // 执法人员ID
      createInspectionAllowed: true,
      createLimitAllowed: true,
      buttonList: [
        {
          name: '取消',
          type: '',
          disable: false,
          fun: this.backPage
        },
        {
          name: '保存',
          type: 'primary',
          disable: false,
          fun: debounce(this.save),
          isLoading: false
        },
        {
          name: '生成现场检查记录文书',
          type: 'primary',
          disable: true,
          fun: debounce(this.confirmTips)
        }
      ],
      sourceId: null, // 新增现场检查保存成功的id
      pdfId: null, // 生成成功的pdf id
      showPdfDialog: false, // 展示pdf浏览
      detailInfo: null, // 查询详情返回的现场检查详细信息
      isUpdate: false, // 新增现场检查修改信息
      headerInfo: null, // 查询详情返回的现场检查基本信息
      isNewUpdate: false, // 修改模块修改信息
      isShowUpdate: false, // 从list页面跳转到当前页面，为修改状态
      dialogContent: '', // showPdf, otherWrit
      dialogClass: 'big-dialog', // dialog动态样式
      dialogTitle: '', // 弹出框标题
      contractorIds: '', // 生成文书承办人
      tabContent: 'check',
      info: {}, // 传入文书弹框的信息
      writType: '', // 文书类型
      writName: '', // 文书名称
      selectedList: [],
      isStopProduce: false, // 是否停产停业
      limitTime: void 0, // 整改期限时间
      isEasyPunish: false, // 是否展示简易处罚的页面
      currWritId: '', // 当前正在操作的文书 id
      audiReq: {}, // 文书 提交审核 或 盖章流程 参数
      auditInfo: {}, // 传入文书卡片的审核所需信息（为了保持文书弹框与文书卡片在审核审批处参数的一致）
      easyPunishId: null,
      detailIsChanged: false,
      confirmCheckList: [], // 制作文书之前确认选中的检查项
      selectTips: [], // 选择检查项
      signType: null,
      // 浏览文书上需要展示的按钮
      writButtonList: {
        updatePdf: true, // 回退编辑
        signPdf: true, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      // detail的证据
      exactProofList: null
    }
  },
  methods: {
    closePdf() {
      this.dialogContent = false
    },
    // 返回上一页
    backPage() {
      if (this.isEasyPunish) {
        this.isEasyPunish = false
      } else {
        this.$store.commit('setInspectionCurrentComponent', 'inspectionList')
        this.$store.commit('setRouteInspectionId', null)
        this.$store.commit('setRouteSchemeId', null)
        this.$emit('backPage')
      }
    },
    // 制作现场检查文书
    getInspectionWritParams() {
      let header = this.$refs.header.headerInfo
      let detail = this.$refs.detail
      let startTime = header.time[0]
        .replace('-', '年')
        .replace('-', '月')
        .replace(' ', '日')
        .replace(':', '时')
        .replace(':', '分钟')
        .split('钟')[0]
      let endTime = header.time[1]
        .replace('-', '年')
        .replace('-', '月')
        .replace(' ', '日')
        .replace(':', '时')
        .replace(':', '分钟')
        .split('钟')[0]
      let probList = this.selectTips
      let people =
        header.people.split('，').length < 3
          ? header.people.split('，')
          : header.people.split('，').reduce((total, val, index) => {
              if (index <= 2) {
                total.push(val)
              }
              return total
            }, [])
      let peopleId =
        header.peopleId.split(',').length < 3
          ? header.peopleId.split(',')
          : header.peopleId.split(',').reduce((total, val, index) => {
              if (index <= 2) {
                total.push(val)
              }
              return total
            }, [])
      // 取执法人员的cardId
      this.agentId = peopleId
      let fullDeptNameS = JSON.parse(sessionStorage.getItem('userInfo')).sysDeptEntity.fullDeptName
      Promise.all(this.agentId.map(id => getUserInfoById({ id })))
        .then(res => {
          console.log('人员详情', res)
          this.agentId = res.map(item => item.data.userEntity.cardId)
          // let fullDeptName = res.map(
          //   item => item.data.sysDeptEntity.fullDeptName
          // );
          if (!header.company.legalPerson) {
            getComInfo({ id: header.company.id }).then(
              res => {
                let params = getWritParams({
                  tag2: res.data.companyName,
                  tag3: res.data.businessAddress,
                  tag4: res.data.legalPerson,
                  tag5: res.data.primaryPersonJob,
                  tag6: res.data.legalPersonMobilephone,
                  tag7: header.place,
                  tag8: startTime,
                  tag9: endTime,
                  tag10: fullDeptNameS,
                  // tag10: header.dept.name,
                  tag11: people.join('、'),
                  tag12: this.agentId.join('、'),
                  // tag12: peopleId.join("、"),
                  tag13: header.exampleData,
                  tag14Item: probList
                })

                let data = {
                  data: params,
                  writType: 'XCJCJL',
                  sourceId: this.sourceId,
                  companyId: header.company.id, //执法检查模块制作文书传company_id
                  // contractorIds: this.agentId.join("、")
                  contractorIds: peopleId.join(',')
                }
                this.isUserSign = 1
                this.makeInspectionWrit(data, true)
              },
              err => {
                console.log(err)
              }
            )
          } else {
            // console.log("没有查公司详情的")
            let params = getWritParams({
              tag2: header.company.companyName,
              tag3: header.company.businessAddress,
              tag4: header.company.legalPerson,
              tag5: header.company.primaryPersonJob,
              tag6: header.company.legalPersonMobilephone,
              tag7: header.place,
              tag8: startTime,
              tag9: endTime,
              tag10: fullDeptNameS,
              // tag10: header.dept.name,
              tag11: people.join('、'),
              tag12: this.agentId.join('、'),
              // tag12: peopleId.join("、"),
              tag13: header.exampleData,
              tag14Item: probList
            })
            let data = {
              data: params,
              userId: 'test',
              writType: 'XCJCJL',
              sourceId: this.sourceId,
              // contractorIds: this.agentId.join(",")
              contractorIds: peopleId.join(',')
            }
            this.makeInspectionWrit(data, true)
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 处理tag4, tag3, tag6检查描述数据
    handleData(data = [], tagName) {
      let temp = []
      data.forEach(item => {
        temp.push({
          tagName: tagName,
          tagContent: tagName === 'tag6Item' ? item : item.negativeDesc
        })
      })
      return temp
    },
    // 输出错误信息
    alterErrorMsg(errorMsg) {
      this.$message({
        type: 'error',
        message: errorMsg,
        duration: 1000
      })
    },
    // 验证用户数据
    validateUserData() {
      if (!this.$refs.header.headerInfo.company.companyName) {
        this.alterErrorMsg('请选择企业名称!')
        return false
      }
      if (!this.$refs.header.headerInfo.time) {
        this.alterErrorMsg('请选择检查时间!')
        return false
      }
      if (!this.$refs.header.headerInfo.place) {
        this.alterErrorMsg('请选择检查场所!')
        return false
      }
      if (!this.$refs.header.headerInfo.sourceName) {
        this.alterErrorMsg('请选择检查形式！')
        return false
      }
      /*  if (!this.$refs.header.headerInfo.examineType) {
        this.alterErrorMsg('请选择检查方式！')
        return false
      } */
      if (!this.$refs.header.headerInfo.people && !this.$refs.header.headerInfo.peopleId) {
        this.alterErrorMsg('请选择执法人员！')
        return false
      }
      if (!this.$refs.header.headerInfo.dept) {
        this.alterErrorMsg('请选择执法部门！')
        return false
      }
      if (!this.$refs.header.headerInfo.exampleData) {
        this.alterErrorMsg('请输入检查情况！')
        return false
      }
      if (!this.$refs.detail.checkList.length > 0) {
        this.alterErrorMsg('请选择检查内容！')
        return false
      }
      console.info(this.$refs.detail.checkList)
      let overflow = false
      this.$refs.detail.checkList.map(item => {
        if (item.checkDesc && item.checkDesc.length > 1500) {
          overflow = true
        }
        if(item.children && item.children.length > 0) {
          item.children.map(i => {
            if (i.checkDesc && i.checkDesc.length > 1500) {
              overflow = true
            }
          })
        }
      })
      if (overflow) {
        this.alterErrorMsg('检查描述的长度不能超过1500字！')
      }
      return !overflow
    },
    // 基本信息作非空判断
    save(type) {
      // 在保存中上传证据
      if (type === 'afterUpload') {
        if (this.isUpdate) {
          this.updateInfo(type)
        }
        return
      }
      if (this.validateUserData()) {
        this.buttonList[1].isLoading = true
        if (this.isUpdate) {
          this.updateInfo()
        } else {
          this.saveData()
        }
      }
      // console.log("点击保存的时候", this.$refs.header.headerInfo);
      // let header = this.$refs.header.headerInfo,
      //   isNull = false;
      // for (let k in header) {
      //   console.log(k,"=+++++++")
      //   if (header[k] === null) {
      //      isNull = true;
      //   }
      // }
      // if (
      //   header.company.companyName === "" ||
      //   header.company.companyName === null
      // ) {
      //   isNull = true;
      // }
      // if (!isNull) {
      // } else {
      //   // this.$message({
      //   //   message: "请完善基本信息",
      //   //   type: "warning"
      //   // });
      // }
    },
    // 保存现场检查信息
    saveData() {
      let data = this.getParams()
      console.log('保存现场检查信息', data)
      inspectionSave(data).then(res => {
        this.buttonList[1].isLoading = false
        this.$message({
          message: '保存成功!',
          type: 'success'
        })
        this.sourceId = res.id
        this.detailIsChanged = false
        this.getNewDetail()
      })
    },
    // 获取现场检查详情
    getNewDetail() {
      getInspectionDetail({
        id: this.sourceId
      }).then(
        res => {
          console.log('获取现场检查记录详情', res)
          this.$refs.detail.$refs.proof.$children[0].uploadFiles = []
          this.isShowUpdate = true
          this.$store.commit('setNewInspectionCanOper', true)
          // 设置新增检查检查项
          let publicProof = res.data.evidenceId ? res.data.evidenceId.split(',') : ''
          let proofList = []
          this.isUpdate = true
          // 查找公共证据
          if (res.data.evidenceList && res.data.evidenceList.length > 0) {
            res.data.evidenceList.forEach(item => {
              item.id = res.data.id
              item.type = '0'
            })
            proofList = [...proofList, ...res.data.evidenceList]
          }
          // 查找检查项中的证据
          if (res.data.probList && res.data.probList.length > 0) {
            res.data.probList.forEach(item => {
              if (item.children && item.children.length > 0) {
                item.children.forEach(i => {
                  i.isOldTips = true
                  if (i.accessoryList && i.accessoryList.length > 0) {
                    i.accessoryList.forEach(j => {
                      j.id = i.id
                      j.type = '1'
                    })
                    proofList = [...proofList, ...i.accessoryList]
                  }
                  i.content = i.isGreat === '2' ? i.checkDesc : i.negativeDesc
                })
              } else {
                item.isOldTips = true
                if (item.accessoryList && item.accessoryList.length > 0) {
                  item.accessoryList.forEach(i => {
                    i.id = item.id
                    i.type = '1'
                  })
                  proofList = [...proofList, ...item.accessoryList]
                }
                item.content = item.isGreat === '2' ? item.checkDesc : item.negativeDesc
              }
            })
          }

          this.detailInfo = {
            checkList: res.data.probList,
            evidenceId: publicProof,
            proofList: proofList
          }
          let startTime = null,
            endTime = null,
            time = null
          if (res.data.examineStartTime && res.data.examineEndTime) {
            startTime = res.data.examineStartTime.replace(/(\/)/g, '-') + ':00'
            endTime = res.data.examineEndTime.replace(/(\/)/g, '-') + ':00'
            time = [startTime, endTime]
          }
          this.headerInfo = {
            time: time,
            place: res.data.examineSite,
            exampleData: res.data.examineSituation,
            dept: {
              id: res.data.executorDeptId,
              name: res.data.executorDeptName,
              children: [],
              remark: null
            },
            company: {
              id: res.data.companyId,
              companyName: res.data.companyName
            },
            people: res.data.executorName,
            peopleId: res.data.executorId,
            source: res.data.examineSource,
            sourceName: res.data.examineSourceName,
            examineType: res.data.examineType,
            examineTypeName: res.data.examineTypeName
          }
          // this.pdfId = res.data.writId;
        },
        err => {
          console.log(err)
        }
      )
    },
    // 修改现场检查信息
    updateInfo(type) {
      this.isUpdate = false
      let data = this.getParams()
      data.id = this.sourceId
      updateInspectionDetail(data).then(
        res => {
          this.buttonList[1].isLoading = false
          if (!type) {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            })
          }

          this.getNewDetail()
          this.detailIsChanged = false
          this.isUpdate = true
        },
        err => {
          this.buttonList[1].isLoading = false
          console.log(err)
        }
      )
    },
    // 准备保存数据实体参数
    getParams() {
      let header = this.$refs.header.headerInfo
      console.info('header', header)
      let detail = this.$refs.detail
      let pulicProof = detail.evidenceId && detail.evidenceId.length > 0 ? detail.evidenceId.join(',') : ''
      let startTime = header.time && header.time[0] ? dateFormat(header.time[0], 'yyyy-mm-dd HH:MM:ss') : ''
      let endTime = header.time && header.time[1] ? dateFormat(header.time[1], 'yyyy-mm-dd HH:MM:ss') : ''
      console.info('getParams', detail.checkList)
      return {
        companyId: header.company.id,
        companyName: header.company.companyName,
        examineSite: header.place,
        examineSituation: header.exampleData,
        // examineSource: this.$refs.header.checkTypeId,
        examineSource: header.source,
        examineSourceName: header.sourceName,
        examineType: header.examineType,
        examineTypeName: header.examineTypeName,
        evidenceId: pulicProof,
        examineStartTime: startTime,
        examineEndTime: endTime,
        executorDeptId: header.dept.id,
        executorDeptName: header.dept.name,
        executorId: header.peopleId,
        executorName: header.people,
        probList: detail.checkList,
        problemNum: 0
      }
    },
    // 文书生成成功回调
    getWrit(id, key) {
      this.pdfId = id
      this.isUserSign = key
      // this.showPdfDialog = true;
      this.dialogTitle = '浏览文书'
      this.dialogContent = 'showPdf'
      this.dialogClass = 'big-dialog'
    },
    // 制作其他文书
    makeInspectionWrit(params, flag) {
      console.log('=======', params)
      if (this.currWritId && this.currWritId !== '' && flag) {
        updateWrit({ writId: this.currWritId, contractorIds: params.contractorIds }, params.data).then(
          res => {
            this.$message({
              message: '制作成功',
              type: 'success'
            })
            // this.showPdfDialog = true;
            this.dialogContent = 'showPdf'
            this.dialogClass = 'big-dialog'
            this.pdfId = this.currWritId
            this.writName = '现场检查记录'
            if (this.tabContent === 'writ' && !this.isEasyPunish) {
              this.$refs.writList.getWritList() // 文书卡片修改文书后再次获取文书列表信息
            }
            this.isUpdate = false
            this.getNewDetail()
          },
          err => {
            this.$message({
              message: '制作失败',
              type: 'error'
            })
            console.log(err)
          }
        )
      } else {
        createWrit(params).then(
          res => {
            this.$message({
              message: '制作成功',
              type: 'success'
            })
            this.pdfId = res.writId
            this.writName = '现场检查记录'
            // this.showPdfDialog = true;
            this.dialogContent = 'showPdf'
            this.dialogClass = 'big-dialog'
            this.isUpdate = false
            this.getNewDetail()
            if (this.tabContent === 'writ' && !this.isEasyPunish) {
              this.$refs.writList.getWritList() // 文书卡片修改文书后再次获取文书列表信息
            }
          },
          err => {
            console.log(err)
            this.$message({
              message: '制作失败',
              type: 'error'
            })
          }
        )
      }
    },
    // 生成文书弹框点击取消按钮事件
    close() {
      this.showPdfDialog = false
      this.dialogContent = ''
    },
    // 模拟标签页功能
    chooseTab(val) {
      this.auditInfo = {
        requestUsersName: this.headerInfo.people, // 承办人
        caseName: this.headerInfo.company.companyName // 企业名称
      }
      if (val === 'check') {
        this.tabContent = 'check'
      } else {
        this.tabContent = 'writ'
      }
    },
    // 查询当前的文书
    queryWrit(type) {
      console.log('查询当前文书的type==', type)
      if (this.detailIsChanged) {
        this.$alert('请先保存更改的数据', null, {
          confirmButtonText: '确定'
        })
      } else {
        getWritInfo({
          sourceId: this.sourceId,
          type: type ? type : 'XCJCJL'
        })
          .then(res => {
            // console.log("生成生成生成生成生成", res);
            if (type) {
              // 制作其他文书 及 行政强制措施文书
              this.currWritId = res.data[0] ? res.data[0].writId : ''
              this.info.writId = this.currWritId
              this.dialogContent = 'writDialog'
              this.dialogClass = 'big-dialog'
              this.showPdfDialog = true
            } else {
              this.currWritId = res.data[0] ? res.data[0].writId : ''
              this.getInspectionWritParams()
            }
            this.isUserSign = res.data[0] ? res.data[0].isUserSign : 0
          })
          .catch(err => {
            throw new Error(err)
          })
      }
    },
    closeDialog() {
      this.pdfId = null
      this.dialogContent = null
      this.showPdfDialog = false
      this.createInspectionAllowed = true
      this.createLimitAllowed = true
    },
    // 确认制作现场检查文书的检查项
    confirmTips() {
      let arr = []
      if (this.$refs.detail.checkList && this.$refs.detail.checkList.length > 0) {
        this.$refs.detail.checkList.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(i => {
              let content = i.isGreat === '2' ? i.checkDesc : i.negativeDesc
              arr.push(content)
              content = undefined
            })
          } else {
            let content = item.isGreat === '2' ? item.checkDesc : item.negativeDesc
            arr.push(content)
            content = undefined
          }
        })
      }
      /* console.info("yayayayyaya==>arr", arr);
      console.info("yayayayyaya==>confirmCheckList", this.confirmCheckList); */
      this.confirmCheckList = arr
      this.dialogTitle = '核对带入文书的现场检查内容'
      this.showPdfDialog = true
      this.dialogContent = 'confirmTips'
    },
    // 制作现场检查记录文书
    getSelectTips(val) {
      this.selectTips = val
      this.dialogTitle = '查看现场检查记录文书'
      this.showPdfDialog = false
      this.dialogContent = ''
      // 确认修改或生成
      this.queryWrit()
    }
  },
  mounted() {
    console.info('headerInfo', this.headerInfo)
    let id = null
    if (this.dataId && this.dataId !== '') {
      id = this.dataId
    }
    if (this.routeInspectionId && this.routeInspectionId !== '') {
      id = this.routeInspectionId
    }
    this.sourceId = id // 现场检查id， 生成文书用
    this.isNewUpdate = true
    if (this.sourceId) {
      this.getNewDetail()
    }
    this.createTransTimeLimit = debounce(this.createTransTimeLimit)
  },
  computed: {
    ...mapState(['routeInspectionId', 'routeSchemeId']),
    getDialogClass() {
      return this.dialogClass
    },
    getSchemeId() {
      if (this.schemeId && this.schemeId !== '') return this.schemeId
      if (this.routeSchemeId && this.routeSchemeId !== '') return this.routeSchemeId
    }
  },
  watch: {
    sourceId: {
      handler: function(val, oldVal) {
        if (val !== '') {
          this.buttonList[2].disable = false
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.icondaojishi {
  color: #0099ff;
}
.footStyle {
  /deep/.el-dialog__footer {
    margin-top: 60px;
  }
}
.big-dialog {
  /deep/ .el-dialog {
    width: 990px;
    // height: 70%;
    // overflow: auto;
  }
}
.specialDiag {
  /deep/ .el-dialog {
    height: 262px !important;
  }
}
.query-notice {
  padding: 0 16px;
}
.limit_dialog {
  /deep/ .el-dialog__body {
    padding-left: 16px;
  }
  /deep/ .el-dialog__footer {
    margin-top: 70px;
  }
  .dashLine {
    display: inline-block;
    width: 98%;
    // height: 1px;
    border: 1px dashed #e0e0e0;
  }
}
.modifyTime {
  margin-top: 10px;
}
.marLeft {
  margin-left: 50px;
}
.punish-style {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 21px;
  .el-button {
    margin-left: 0;
    margin-bottom: 12px;
  }
}
/deep/ .el-row {
  white-space: nowrap;
}
/deep/ .el-icon-loading {
  line-height: 0;
}
</style>
