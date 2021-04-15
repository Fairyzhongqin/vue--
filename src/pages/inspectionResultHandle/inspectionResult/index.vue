<template>
  <div>
    <div class="inspection_content" v-if="showMulitList">
      <!-- 头部 -->
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <!-- <div class="font18">处置检查</div> -->
      <div class="tabStyle">
        <el-tabs type="card" @tab-click="tabClick">
          <el-tab-pane label="检查结果处理">
            <inspectionResult-header v-if="tabClickIndex == 0" :tableHeadInfo="tableHeadInfo"></inspectionResult-header>
            <mutile-choose v-if="tabClickIndex == 0" @showDiag="showDiag" :needUpdate="needUpdate"></mutile-choose>
          </el-tab-pane>
          <el-tab-pane label="检查结果处理文书汇总" @tab-click="initDocuList" :lazy="false">
            <div class="docStyle" v-if="docDatalist && docDatalist.length > 0">
              <make-document
                v-for="(item, index) in docDatalist"
                :key="index"
                :docData="item"
                :auditInfo="auditInfo"
                @afterDelete="afterDelete"
                @previewWrit="previewWrit"
                @toSeal="toSeal"
                @toLawSeal="toLawSeal"
                @modifyWrit="chooseWrit"
                @afterUpload="initDocuList"
                @submit="submitToApproval"
              ></make-document>
            </div>
            <sn-empty-data text="暂无检查结果处理文书汇总" v-if="!docDatalist || docDatalist.length === 0"></sn-empty-data>
          </el-tab-pane>
        </el-tabs>
        <!-- <span class="line"></span>
        <span class="lineSecond"></span>-->
      </div>
    </div>
    <!-- 展示建议行政处罚页面 -->
    <div v-if="showSimplePenality">
      <simpleAdmin-penality></simpleAdmin-penality>
    </div>

    <!-- <div class="copyright">Copyright © 2019 All Rights Reserved</div> -->
    <show-pdf
      :pdfId="visibleWritId"
      v-if="seePdf"
      @closePdf="closePdfDialog"
      :writName="writName"
      :buttonList="writButton"
      @updatePdf="updatePdf"
      @auditPdf="auditPdf"
      @sealPdf="sealPdf"
    ></show-pdf>
    <el-dialog
      :class="{ dialogClass, 'query-record': showTitle === '询问笔录' || showTitle === '勘验笔录' }"
      :title="showTitle"
      :before-close="closeDialog"
      :visible.sync="writDialogVisible"
      class="common-dialog"
      :close-on-click-modal="false"
      width="960px"
    >
      <common-writ
        v-if="writDialogVisible && dialogContent === 'commonWrit'"
        :info="info"
        :writType="showTitle"
        @createWrit="createOtherWrit"
        @toSeal="toSeal"
        @toLawSeal="toLawSeal"
        @close="close"
        :ableToAudit="ableToAuditHandle"
        :ableToZhifa="ableToZhifa"
        :editStatusFromDoc="editStatusFromDoc"
      ></common-writ>
      <select-people
        v-if="dialogContent === 'selectPeople'"
        :selectNum="1"
        @getPeople="submitToAudition"
      ></select-people>
    </el-dialog>
    <!-- width="900px" height="600px" -->
    <!-- 现场处理措施弹框 -->
    <el-dialog
      title="现场处理措施"
      :visible.sync="onSiteTreatmentMeasuresVisible"
      class="limitDate"
      :close-on-click-modal="false"
    >
      <div v-if="onSiteTreatmentMeasuresVisible" class="dialog-content">
        <onSiteTreatment-measures
          :selectedList="item"
          v-for="(item, index) in updateTipsList"
          :key="`index${index}`"
          :indexKey="index"
          ref="siteOperation"
        ></onSiteTreatment-measures>
      </div>
      <span slot="footer">
        <el-button @click="cancleonSiteTreatment">取 消</el-button>
        <el-button @click="updateInspectionWrit" type="primary">保存并生成现场处理措施决定书</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="modifyTimeVisible"
      class="limitDate"
      title="责令限期整改"
      :close-on-click-modal="false"
    >
      <div v-if="modifyTimeVisible" class="dialog-content">
        <modify-time
          :selectedList="item"
          v-for="(item, index) in updateTipsList"
          :key="index"
          :indexKey="index"
          ref="modifyTime"
        ></modify-time>
      </div>
      <span slot="footer">
        <el-button @click="cancleLimitModify">取 消</el-button>
        <el-button @click="updateLimitWrit" type="primary">保存并生成责令限期整改指令书</el-button>
      </span>
    </el-dialog>
    <!-- 行政强制审批表的修改回显 -->
    <el-dialog
      :visible.sync="compulsoryVisible"
      title="行政强制审批表"
      class="common-dialog"
      :close-on-click-modal="false"
      width="960px"
    >
      <div>
        <compulsoryApprovalForm :info="info" @createOtherWrit="createOtherWrit" @close="close"></compulsoryApprovalForm>
      </div>
    </el-dialog>
    <!-- 单独的审核审批 -->
    <el-dialog :visible.sync="ToApprovalStatus" width="900px" height="600px" :title="showTitle">
      <select-people :selectNum="1" @getPeople="submitToApprovalCheck"></select-people>
    </el-dialog>
  </div>
</template>

<script scoped>
import snEmptyData from '@/components/snEmptyData'
import snPageBar from '@components/snPageBar'
import commonWrit from '@components/commonWrit'
import ShowPdf from '@/components/showPdf'
import inspectionResultHeader from './components/inspectionResultHeader'
import mutileChoose from './components/mutilechoose'
import buttonGroup from '@components/buttonGroup/index'

import makeDocument from '@components/docCard/index'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import chooseMakeDocumentDialog from '../componments/chooseMakeDocumentdialog'
import { mapState } from 'vuex'
import { queryDocument, getExamineInfo } from '@api/ProcessingofInspectionResult/index.js'
import simpleAdminPenality from './components/simpleAdminPenality'
import { createWrit, getWritInfo, updateWrit, getWritDataByWritId, sealWrit } from '@api/fileRelated'
import { sealAudit } from '@api/common'
import { dateFormat, getWritParams } from '@/utils/util'
// import writTypeMap from "@/utils/writType";
import { rectificationDetail, inspectionDetail, toInspectionHandle, toRectification, getInspectionWritList } from '@/api/onSiteInspection/index'
import onSiteTreatmentMeasures from '../componments/onSiteTreatmentMeasures'
import modifyTime from '../componments/modifyTime'
import compulsoryApprovalForm from '@/components/commonWrit/compulsoryApprovalform'
import Bus from '@/bus'

export default {
  data() {
    return {
      // updateStatusCompulsory:false,
      dialogClass: 'big-dialog',
      info: {},
      ableToZhifa: false, // 执法专用章是否可用
      ableToAuditHandle: false, //提交审核审批是否可用
      isActive: true,
      showTitle: '', //制作行政强制措施 文书标题
      visibleWritId: '', // 浏览文书的文书id
      dialogContent: '', // dialog 类型
      ToApprovalStatus: false, //单独的审核审批
      docDatalist: [],
      tableHeadInfo: '',
      writDialogVisible: false,

      checkAll: false,
      isIndeterminate: false,
      selectedNum: 2,
      canOper: true,
      checkList: [],
      checkedList: [],
      selectedList: [], // 被选择的检查项
      docForm: {
        title: '',
        docNum: '',
        date: ''
      },
      time: null,
      currWritId: null, // 当前正在操作的文书 id
      auditInfo: {}, // 传给文书卡片的审核数据
      audiReq: {}, // 文书提交审核的参数
      onSiteTreatmentMeasuresVisible: false,
      modifyTimeVisible: false,
      inspectionDetail: null,
      rectificationDetail: null,
      updateTipsList: [],
      updateWritInfo: null,
      writName: '',
      writButton: {},
      seePdf: false,
      writTypeCode: null,
      backToEditId: '',
      needUpdate: new Date(),
      tabClickIndex: '0',
      wsTitle: '',
      submitInfo: {}, //提交审核审批从doc传来的数据
      editStatusFromDoc: false, //editStatusFromDoc
      compulsoryVisible: false //doccard的行政强制审批表
    }
  },
  methods: {
    submitToApproval(data) {
      if (['ta80008', 'ta80011'].includes(data.auditTypeCode)) {
        this.showTitle = '选择审查人员'
      } else {
        this.showTitle = '选择审核人员'
      }
      this.ToApprovalStatus = true
      this.submitInfo = data
    },
    submitToApprovalCheck(bool, data) {
      if (bool === false) {
        // 关闭弹框
        this.ToApprovalStatus = false
      } else {
        let params = {
          auditTypeCode: this.submitInfo.auditTypeCode,
          handlerDeptId: data[0].deptId, //审核人部门 id
          handlerUserId: data[0].id, //审核人
          parentTaskId: '',
          requestDeptName: JSON.parse(localStorage.getItem('res')).userEntity.deptName, //承办人部门
          requestId: this.submitInfo.requestId, // 文书 writId
          requestTime: void 0,
          requestUsersName: this.tableHeadInfo.executorName, // 承办人名称
          submitterCause: this.tableHeadInfo.companyName, //companyName
          requestUsersIds: this.tableHeadInfo.executorId,
          partyId: this.tableHeadInfo.companyId,
          partyName: this.tableHeadInfo.companyName
        }
        sealAudit(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '提交成功！'
            })
            this.ToApprovalStatus = false
            this.initDocuList()
          })
          .catch(err => console.info(err))
      }
    },
    // 审核审批
    submitToAudition(bool, auditor) {
      console.info('submitToAudition')
      this.dialogContent = ''
      this.writDialogVisible = false
      if (!bool) return
      this.audiReq.requestDeptName = JSON.parse(sessionStorage.getItem('userInfo')).userEntity.deptName
      this.audiReq.handlerDeptId = auditor[0].deptId
      this.audiReq.handlerUserId = auditor[0].id
      this.audiReq.requestTime = dateFormat(new Date(), 'yyyy年mm月dd日')
      this.audiReq.partyId = this.tableHeadInfo.companyId
      this.audiReq.partyName = this.tableHeadInfo.companyName
      // 调用接口向下走流程
      sealAudit(this.audiReq)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.initDocuList()
        })
        .catch(err => console.info(err))
    },
    // 修改责令限期整改信息并生成文书
    updateLimitWrit() {
      let _flag = true
      this.$nextTick(() => {
        for (let i = 0; i < this.updateTipsList.length; i++) {
          if (this.$refs.modifyTime[i].validateForm()) {
            this.$message.error(this.$refs.modifyTime[i].validateForm())
            _flag = false
            break
          }
        }
        if (_flag) {
          console.info('submit')
          let user = JSON.parse(localStorage.getItem('res'))
          let list = []
          let numList = []
          let arrayList = JSON.parse(JSON.stringify(this.rectificationDetail.probList))
          let num = 0
          arrayList.forEach((item, index) => {
            if (item.children && item.children.length > 0) {
              item.rectifyTime = item.rectifyTime ? item.rectifyTime.replace(/(\/)/g, '-') + ':00' : null
              item.children.forEach((i, j) => {
                i.rectifyDemand = this.$refs.modifyTime[num].modifyTimeForm.request
                i.rectifyTime = this.$refs.modifyTime[num].modifyTimeForm.time
                list.push({
                  tagName: 'tag3Item',
                  tagContent: i.negativeDesc
                })
                numList.push({
                  currIndex: num + 1,
                  currTime: this.$refs.modifyTime[num].modifyTimeForm.time
                    ? this.$refs.modifyTime[num].modifyTimeForm.time
                        .split(' ')[0]
                        .replace('-', '年')
                        .replace('-', '月') + '日'
                    : null
                })
                num += 1
              })
            } else {
              item.rectifyDemand = this.$refs.modifyTime[num].modifyTimeForm.request
              item.rectifyTime = this.$refs.modifyTime[num].modifyTimeForm.time
              list.push({
                tagName: 'tag3Item',
                tagContent: item.negativeDesc
              })
              numList.push({
                currIndex: num + 1,
                currTime:
                  this.$refs.modifyTime[num].modifyTimeForm.time
                    .split(' ')[0]
                    .replace('-', '年')
                    .replace('-', '月') + '日'
              })
              num += 1
            }
          })
          let timeMap = new Map()
          let timeArr = []
          numList.forEach(item => {
            if (timeMap.get(item.currTime)) {
              timeMap.set(item.currTime, timeMap.get(item.currTime) + `、${item.currIndex}`)
            } else {
              timeMap.set(item.currTime, item.currIndex)
            }
          })
          timeArr = Array.from(timeMap)
          let timeList = timeArr.reduce((total, item, index) => {
            let num = {
              tagName: `entity${index + 1}-col1`,
              tagContent: item[1].toString()
            }
            let time = {
              tagName: `entity${index + 1}-col2`,
              tagContent: item[0]
            }
            total.push(num)
            total.push(time)
            return total
          }, [])
          let otherParams = getWritParams({
            tag2: this.rectificationDetail.examineInfo ? this.rectificationDetail.examineInfo.companyName : '',
            tag6: user.sysDeptEntity.government,
            tag7: user.sysDeptEntity.bureau,
            tag8: user.sysDeptEntity.court
          })
          let params = [...list, ...otherParams, ...timeList]
          toRectification({
            companyId: this.rectificationDetail.examineInfo.companyId,
            examineId: this.rectificationDetail.examineId,
            probList: arrayList,
            executorId: this.rectificationDetail.examineInfo.executorId,
            id: this.rectificationDetail.id
          })
            .then(res => {
              if (res.code === '0') {
                updateWrit({ writId: this.visibleWritId }, params).then(res => {
                  this.setWritButton(res.writType)
                  this.seePdf = true
                  this.visibleWritId = this.visibleWritId
                  this.backToEditId = this.visibleWritId
                  this.initDocuList()
                })
              }
            })
            .catch(err => {
              if (err === '已存在关联的复查文书，无法修改') {
                this.$message.error('已存在关联的复查文书，无法修改！')
              } else {
                throw new Error(err)
              }
            })
        }
      })
    },
    //  修改现场措施信息并生成文书
    updateInspectionWrit() {
      let _flag = true
      this.$nextTick(() => {
        for (let i = 0; i < this.updateTipsList.length; i++) {
          if (this.$refs.siteOperation[i].validateForm()) {
            this.$message.error(this.$refs.siteOperation[i].validateForm())
            _flag = false
            break
          }
        }
        if (_flag) {
          // submit
          console.info('提交')
          let user = JSON.parse(localStorage.getItem('res'))
          let list = [],
            suggestion = [],
            hadleInfo = [],
            legalInfoContent = []
          let arrayList = JSON.parse(JSON.stringify(this.updateTipsList))
          console.info('update arrayList', arrayList)
          let num = 0
          arrayList.forEach((item, index) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach((i, j) => {
                i.disposeOpinion = this.$refs.siteOperation[num].measureForm.suggestion
                i.lawCode = this.$refs.siteOperation[num].lawCode.join(',')
                i.legalvalue = this.$refs.siteOperation[num].measureForm.legalvalue
                i.measuresCode = this.$refs.siteOperation[num].measureForm.valuehandle.join(',')
                let s = this.$refs.siteOperation[num].measureForm.suggestion
                 // 整改承诺时限
                if (this.$refs.siteOperation[num].measureForm.rectifyTime) {
                  i.rectifyTime = dateFormat(this.$refs.siteOperation[num].measureForm.rectifyTime, 'yyyy-mm-dd') + ' 00:00:00'
                } else {
                  let date = new Date()
                  let newDate = date.setMonth(date.getMonth() + 6)
                  i.rectifyTime = dateFormat(new Date(newDate), 'yyyy-mm-dd') + ' 00:00:00'
                }
                if (s && s !== '') {
                  suggestion.push({
                    tagName: 'tag6Item',
                    tagContent: this.$refs.siteOperation[num].measureForm.suggestion
                  })
                }
                this.$refs.siteOperation[num].lawWritInfo.forEach(law => {
                  legalInfoContent.push(law.value)
                })
                list.push({
                  tagName: 'tag4Item',
                  tagContent: i.negativeDesc
                })
                num += 1
              })
            } else {
              item.disposeOpinion = this.$refs.siteOperation[num].measureForm.suggestion
              item.lawCode = this.$refs.siteOperation[num].lawCode.join(',')
              item.legalvalue = this.$refs.siteOperation[num].measureForm.legalvalue
              item.measuresCode = this.$refs.siteOperation[num].measureForm.valuehandle.join(',')
               // 整改承诺时限
              if (this.$refs.siteOperation[num].measureForm.rectifyTime) {
                item.rectifyTime = dateFormat(this.$refs.siteOperation[num].measureForm.rectifyTime, 'yyyy-mm-dd') + ' 00:00:00'
              } else {
                let date = new Date()
                let newDate = date.setMonth(date.getMonth() + 6)
                item.rectifyTime = dateFormat(new Date(newDate), 'yyyy-mm-dd') + ' 00:00:00'
              }
              list.push({
                tagName: 'tag4Item',
                tagContent: item.negativeDesc
              })
              let s = this.$refs.siteOperation[num].measureForm.suggestion
              if (s && s !== '') {
                suggestion.push({
                  tagName: 'tag6Item',
                  tagContent: this.$refs.siteOperation[num].measureForm.suggestion
                })
              }
              this.$refs.siteOperation[num].lawWritInfo.forEach(law => {
                legalInfoContent.push(law.value)
              })
              //
              num += 1
            }
          })
          legalInfoContent = Array.from(new Set(legalInfoContent))
          let startTimeList = this.inspectionDetail.examineInfo.examineStartTime.split(' ')[0].split('/')
          let startTime = startTimeList[0] + '年' + startTimeList[1] + '月' + startTimeList[2] + '日'

          let otherParams = getWritParams({
            tag2: this.inspectionDetail.examineInfo.companyName,
            tag3: startTime,
            tag5: legalInfoContent.join('、'),
            tag7: user.sysDeptEntity.government,
            tag8: user.sysDeptEntity.bureau,
            tag9: user.sysDeptEntity.court
          })
          let params = [...list, ...suggestion, ...otherParams]
          toInspectionHandle({
            companyId: this.inspectionDetail.examineInfo.companyId,
            examineId: this.inspectionDetail.examineId,
            probList: arrayList,
            executorId: this.inspectionDetail.examineInfo.executorId,
            id: this.inspectionDetail.id
          })
            .then(res => {
              if (res.code === '0') {
                updateWrit({ writId: this.visibleWritId }, params).then(res => {
                  this.backToEditId = res.writId
                  this.setWritButton(res.writType)
                  this.seePdf = true
                  this.initDocuList()
                })
              }
            })
            .catch(err => {
              if (err === '已存在关联的复查文书，无法修改') {
                this.$message.error('已存在关联的复查文书，无法修改！')
              } else {
                throw new Error(err)
              }
            })
        }
      })
    },
    // 修改文书
    chooseWrit(title, type, id, bussinessId, button) {
      this.writButton = button
      this.visibleWritId = id
      if (title.indexOf('现场处理') !== -1) {
        inspectionDetail({ id: bussinessId }).then(res => {
          console.info('现场处理措施的详情', res)
          this.inspectionDetail = res.data
          let list = res.data.probList.reduce((total, item) => {
            let tempList = []
            if (item.children && item.children.length > 0) {
              tempList = item.children.reduce((t, i) => {
                t.push(i)
                return t
              }, [])
            } else {
              tempList.push(item)
            }
            total = [...total, ...tempList]
            return total
          }, [])
          this.updateTipsList = list
          console.info('updateTipsList', this.updateTipsList)
          this.onSiteTreatmentMeasuresVisible = true
        })
      } else if (title.indexOf('责令限期整改') !== -1) {
        rectificationDetail({ id: bussinessId }).then(res => {
          this.rectificationDetail = res.data
          let list = res.data.probList.reduce((total, item) => {
            let tempList = []
            if (item.children && item.children.length > 0) {
              tempList = item.children.reduce((t, i) => {
                i.rectifyTime = i.rectifyTime ? i.rectifyTime.replace(/(\/)/g, '-') + ':00' : null
                t.push(i)
                return t
              }, [])
            } else {
              item.rectifyTime = item.rectifyTime ? item.rectifyTime.replace(/(\/)/g, '-') + ':00' : null
              tempList.push(item)
            }
            total = [...total, ...tempList]
            return total
          }, [])
          this.updateTipsList = list
          this.modifyTimeVisible = true
        })
      } else if (title === '现场检查记录') {
        this.$message.error('请到现场检查记录页面修改')
      } else {
        console.info('路由', this.$route.fullPath)
        if (this.$route.fullPath === '/inspectionResultHandle' && title === '行政强制审批表') {
          this.currWritId = id
          getWritDataByWritId({ writId: id }).then(res => {
            this.updateWritInfo = res.data

            let auditInfo = {
              subject: this.tableHeadInfo ? this.tableHeadInfo.companyName : '',
              sourceId: this.tableHeadInfo ? this.tableHeadInfo.id : '',
              udtIds: this.tableHeadInfo ? this.tableHeadInfo.executorId : '',
              companyName: this.tableHeadInfo ? this.tableHeadInfo.companyName : '',
              checkTime: new Date(this.tableHeadInfo.examineStartTime), //承办时间
              responsiblePerson: this.tableHeadInfo ? this.tableHeadInfo.executorName : '', //承办人
              companyId: this.tableHeadInfo ? this.tableHeadInfo.companyId : '' //企业Id
            }
            // 处理值传给文书
            console.info('传值给文书', this.updateWritInfo)
            this.info = { writInfo: this.updateWritInfo, auditInfo }
            this.compulsoryVisible = true
            // this.updateStatusCompulsory = true;
          })
        } else {
          this.currWritId = id
          getWritDataByWritId({ writId: id }).then(res => {
            this.updateWritInfo = res.data
            this.showDiag(title, type)
            this.editStatusFromDoc = true
          })
        }
      }
    },
    //生成文书
    createOtherWrit(createReq) {
      if (this.currWritId) {
        // 重新创建
        let isUpt = 0
        if (createReq.writType === 'KYBL') {
          isUpt = 1
        }
        updateWrit({ writId: this.currWritId, isUpt: isUpt }, createReq.data)
          .then(res => {
            this.setWritButton(res.writType)
            this.$message({
              type: 'success',
              message: '修改文书成功！'
            })
            this.visibleWritId = this.currWritId
            this.seePdf = true
            this.initDocuList()
            this.updateWritInfo = null
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      } else {
        // 新建
        createWrit(createReq)
          .then(res => {
            if (res.code === '0') {
              this.ableToZhifa = true //执法专用章可用
              this.ableToAuditHandle = true //回退编辑页面的提交审核审批是否可用
              this.setWritButton(res.writType)
              this.$message({
                type: 'success',
                message: '制作成功'
              })
              this.visibleWritId = res.writId
              this.currWritId = res.writId
              this.backToEditId = res.writId
              this.seePdf = true
              this.initDocuList()
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      }
    },
    updatePdf() {
      /* 调修改 */
      this.seePdf = false
      getWritDataByWritId({ writId: this.backToEditId }).then(res => {
        this.updateWritInfo = res.data
      })
    },
    setWritButton(code) {
      let writTypeInfo = JSON.parse(sessionStorage.writTypeInfo)
      let item = writTypeInfo.find(i => {
        return i.id === code
      })
      this.writButton = {
        closePdf: true,
        updatePdf: true,
        auditPdf: item.isAudit == 1,
        sealPdf: item.isSign == 1,
        signPdf: item.userType == 1,
        lawSealPdf: item.isSign == 2,
        finishPdf: true
      }
      this.writName = item.typeName //文书名字
      this.writTypeCode = item.auditTypeCode //提交审核 传的 auditTypeCode
    },
    // 盖公章
    toSeal(audiReq) {
      console.info('audiReq', audiReq)
      this.audiReq = audiReq
      this.writDialogVisible = true
      this.showTitle = '选择盖章人员'
      this.dialogContent = 'selectPeople'
    },
    toLawSeal(audiReq) {
      this.audireqAllowed = true
      this.visibleWritId = audiReq.id
      this.seePdf = true
      this.initDocuList()
      this.writButton = {
        closePdf: true //只展示退出按钮
      }
    },
    // 关闭文书弹出框及选择人员弹出框前的回调
    closeDialog() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.writDialogVisible = false
      this.showTitle = ''
      this.currWritId = null
      this.updateWritInfo = null
      this.seePdf = false
    },
    previewWrit(id, name, button, data) {
      if (id) {
        // 从文书卡片传来的id 签名
        this.visibleWritId = id
        this.writName = name
        this.seePdf = true
        this.setWritButton(data.writTypeCode)
        // 覆盖按钮
        this.writButton = button
        this.writButton.updatePdf = false
      } else {
        this.seePdf = true
        this.writButton = {
          closePdf: true
        }
      }
    },
    // 关闭showPDF的回调
    closePdfDialog() {
      this.initDocuList()
      this.dialogContent = null
      this.currWritId = null //清除现在正在操作的文书
      this.backToEditId = null
      this.writDialogVisible = false
      this.modifyTimeVisible = false
      this.onSiteTreatmentMeasuresVisible = false
      this.compulsoryVisible = false
      this.seePdf = false
    },
    // 关闭文书制作框的回调
    close() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      console.info('此时的文书id', this.backToEditId)
      this.currWritId = null
      this.backToEditId = null
      this.updateWritInfo = null
      this.writDialogVisible = false
      this.compulsoryVisible = false
    },
    tabClick(val) {
      if (val.index == 1) {
        this.auditInfo = {
          requestUsersName: this.tableHeadInfo.executorName, // 承办人
          caseName: this.tableHeadInfo.companyName // 企业名称
        }
        this.initDocuList()
      }
      this.tabClickIndex = val.index
    },
    // 初始化文书列表
    initDocuList(val) {
      queryDocument({
        ...val,
        id: this.tableId
      }).then(
        res => {
          if (res.code === '0') {
            this.docDatalist = res.data
          }
        },
        err => {
          this.$message({
            type: 'error',
            message: err
          })
        }
      )
    },
    afterDelete() {
      this.initDocuList()
      this.needUpdate = new Date()
    },
    backPage() {
      this.$store.commit('setInspectionResultComponent', 'isList')
    },
    // 取消现场检查措施
    cancleonSiteTreatment() {
      this.onSiteTreatmentMeasuresVisible = false
      // this.selectedList = [];
    },
    // 取消责令期限整改
    cancleLimitModify() {
      this.modifyTimeVisible = false
    },
    // 生成其他文书
    showDiag(content, type) {
      console.info('show dialog', content, type)
      this.wsTitle = content
      let question = ''
      if (content === '非职责范围安全问题移交单') {
        this.selectedList.forEach((selected, index) => {
          question += `${index + 1}、${selected.negativeDesc};`
          if (index + 1 === this.selectedList.length) {
            // 最后一项以句号结尾
            question = question.slice(0, -1) + '。'
          }
        })
      }
      let auditInfo = {
        subject: this.tableHeadInfo ? this.tableHeadInfo.companyName : '',
        sourceId: this.tableHeadInfo ? this.tableHeadInfo.id : '',
        udtIds: this.tableHeadInfo ? this.tableHeadInfo.executorId : '',
        companyName: this.tableHeadInfo ? this.tableHeadInfo.companyName : '',
        checkTime: new Date(this.tableHeadInfo.examineStartTime), //承办时间
        responsiblePerson: this.tableHeadInfo ? this.tableHeadInfo.executorName : '', //承办人
        companyId: this.tableHeadInfo ? this.tableHeadInfo.companyId : '', //企业Id
        transQuestion: question // 非职责范围安全问题移交书 问题字段
      }
      // 处理值传给文书
      console.info('传值给文书', this.updateWritInfo)
      this.info = { writInfo: this.updateWritInfo, auditInfo }
      this.showTitle = content
      this.writDialogVisible = true
      this.dialogContent = 'commonWrit'
    },

    /*  fatherChecked(index) {
      const item = this.checkList[index];
      console.info("fatherChecked",item)
      if (item.child.length > 0) {
        item.child.forEach((e, num) => {
          if (!e.isOk) {
            item.checked = temp;
            e.checked = temp;
            this.canOper = !temp;
          }
        });
      } else {
        item.checked = temp;
      }
    }, */
    // 初始化现场检查列表数据封装
    getExamineInfoInit() {
      getExamineInfo({
        id: this.tableId
      }).then(
        res => {
          this.tableHeadInfo = res.data
          this.$store.commit('settableHeadInfo', this.tableHeadInfo)
        },
        err => {
          this.$message({
            type: 'error',
            message: err
          })
        }
      )
    },
    // 文书PDF上的提交审批审核按钮
    auditPdf(val) {
      let params = {
        auditTypeCode: this.writTypeCode,
        handlerDeptId: val.deptId,
        handlerUserId: val.peopleId,
        parentTaskId: '',
        requestDeptName: this.tableHeadInfo.executorDeptName,
        requestId: val.pdfId,
        requestTime: void 0,
        requestUsersName: this.tableHeadInfo.executorName,
        submitterCause: this.tableHeadInfo.companyName,
        requestUsersIds: this.tableHeadInfo.executorId,
        partyId: this.tableHeadInfo.companyId ? this.tableHeadInfo.companyId : '',
        partyName: this.tableHeadInfo.companyName ? this.tableHeadInfo.companyName : ''
      }
      sealAudit(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
          // 提交审核成功后 应该清楚文书回退编辑状态
          this.currWritId = null
          this.seePdf = false
          this.writDialogVisible = false
          this.initDocuList()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    },
    // 加盖公章 也要选人
    sealPdf(val) {
      let params = {
        auditTypeCode: 'ta80040',
        handlerDeptId: val.deptId,
        handlerUserId: val.peopleId,
        parentTaskId: '',
        requestDeptName: this.tableHeadInfo.executorDeptName,
        requestId: val.pdfId,
        requestTime: this.tableHeadInfo.examineStartTime.replace(/(\/)/g, '-') + ':00',
        requestUsersName: this.tableHeadInfo.executorName,
        submitterCause: this.tableHeadInfo.companyName,
        requestUsersIds: this.tableHeadInfo.executorId,
        partyId: this.tableHeadInfo.companyId,
        partyName: this.tableHeadInfo.companyName
      }
      if (val.writName === '责令限期整改指令书') {
        params.auditTypeCode = 'ta80053'
      }
      if (val.writName === '现场处理措施决定书') {
        params.auditTypeCode = 'ta80052'
      }
      sealAudit(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    }
  },
  components: {
    snEmptyData,
    buttonGroup,
    ShowPdf,
    chooseMakeDocumentDialog,
    inspectionResultHeader,
    mutileChoose,
    makeDocument,
    simpleAdminPenality,
    commonWrit,
    selectPeople,
    snPageBar,
    onSiteTreatmentMeasures,
    modifyTime,
    compulsoryApprovalForm
  },
  watch: {
    checkAll: {
      handler: function(val, oldVal) {
        if (this.checkList.length === 0) return
        this.checkList.forEach(item => {
          if (item.child.length > 0) {
            item.child.forEach(e => {
              if (e.isOk) return false
              e.checked = val
              item.checked = val
              if (item.checkedList) {
                item.checkedList.push(e)
              } else {
                item.checkedList = []
                item.checkedList.push(e)
              }
            })
            if (item.checkedList && item.checkedList.length > 0) {
              this.checkedList.push(item)
            }
          } else {
            if (!item.isOk) {
              item.checked = val
              this.checkedList.push(item)
            }
          }
        })
      }
    },
    tabClickIndex: {
      handler: function(val, oldVal) {
        if (val == '0') {
          this.docDatalist = []
        }
      }
    }
  },
  computed: {
    ...mapState([
      'tableId',
      'showMulitList',
      'showSimplePenality'
      // "writTypeInfo"
    ])
  },
  created() {
    // this.initDocuList();
    this.getExamineInfoInit()
    /*  if (!this.writTypeInfo) {
      this.writTypeInfo = JSON.parse(sessionStorage.writTypeInfo);
    } */
  }
}
</script>

<style lang="less" scoped>
.tabStyle {
  width: 104%;
  margin-top: 30px;
  /deep/ .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
    border: none;
    .el-tabs__item {
      border: 1px solid #e4e7ed;
      color: #0099ff;
      background-color: rgba(18, 115, 235, 0.1);
      &:first-child {
        margin-right: 10px;
      }
    }
    .is-active {
      border-bottom-color: #ffffff;
      background-color: #ffffff;
    }
  }
}
/deep/ .el-button--danger.el-button--danger:focus {
  background: #fef0f0;
  color: #dd6161;
  border-color: #fbc4c4;
}
/deep/ .el-dialog__header {
  padding: 15px 20px 10px;
}
.query-record.query-record {
  overflow: hidden;
  // top: auto;
  /deep/ .el-dialog {
    height: 100% !important;
    width: 100vw !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    /deep/ .el-dialog__body {
      position: relative;
      height: 100% !important;
    }
  }
}
/deep/ .el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
  top: 12px;
  right: 15px;
  font-size: 24px;
}
/deep/ .el-dialog__wrapper .el-dialog__footer {
  margin: 57px 0px 42px;
  padding: 0;
  line-height: 42px;
  padding-right: 10px;
}
/deep/ .el-dialog__title {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.el-checkbox {
  /deep/ .el-checkbox__inner {
    width: 20px;
    height: 20px;
    &::after {
      left: 6px;
      top: 3px;
      height: 9px;
    }
  }
}
.el-dialog {
  padding: 20px;
  .el-dialog__footer {
    margin-top: 40px;
    border-top: 0px solid #e0e0e0 !important;
  }
}
.inspection_content {
  background: #fff;
  // padding: 8px;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 16px 82px 33px;
  border-radius: 8px;
  position: relative;
}
.back-button {
  position: absolute;
  left: 16px;
  top: 18px;
  color: #0099ff;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.el-upload--picture-card {
  width: 220px;
  height: 146px;
  margin-top: 30px;
}
.el-date-editor--datetimerange.el-input__inner {
  width: 210px;
  height: 30px;
}
.el-form-item__label {
  padding: 0 -4px 0 0 !important;
}

/deep/.el-form-item__content {
  color: 'pink';
}
.big-dialog {
  /deep/ .el-dialog {
    width: 990px;
    // height:570px;
  }
}
.docStyle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
}
.limitDate {
  /deep/.el-dialog {
    width: 70%;
    /deep/ .el-dialog__header {
      height: 3%;
    }
    /deep/ .el-dialog__body {
      padding-left: 16px;
      max-height: 385px;
      overflow-y: auto;
    }
    /deep/ .el-dialog__footer {
      margin: 0;
    }
  }
}
.common-dialog {
  div {
    white-space: nowrap;
  }
}
</style>
