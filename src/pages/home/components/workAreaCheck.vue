<template>
  <div>
    <div class="new-inspection">
      <tips v-if="tipsShow && !compBrowseShow" :tipName="['综合', '浏览']" @clickHandle="clickHandle"></tips>
      <sn-page-bar>
        <template slot="button">
          <el-button type="text" icon="el-icon-arrow-left" @click="backPage">返回</el-button>
        </template>
        <!-- <div class="title">{{ item.title }}</div> -->
        <el-row>
          <el-col :span="18">
            <div class="see-pdf-body">
              <show-pdf :pdfId="pdfId" ref="pdf" :isWorkArea="true" v-if="pdfDownload && pdfUpdate"></show-pdf>
              <div v-if="!pdfDownload" class="text-warn">暂无文书</div>
              <div v-if="!pdfUpdate" class="text-warn">正在加载...</div>
            </div>
          </el-col>
          <el-col :span="1">
            <div style="visibility: hidden">嘻嘻嘻，安监组都是帅哥美女嘿！</div>
          </el-col>
          <el-col :span="5" v-show="getFullInfo">
            <el-button type="primary" class="back-to-last" :disabled="!canUpdate" v-if="!seeDetail && item.auditTypeCode !== 'ta80014'" @click="backToLast">返回上一级</el-button>
            <div class="check-result">
              <div class="input-bar" v-if="isHearRep">
                <div class="check-title">发起集体讨论</div>
                <div class="hear-radio">
                  <el-radio :disabled="seeDetail || isHearDisable" v-model="isHearDiscussion" label="1">是</el-radio>
                  <el-radio :disabled="seeDetail || isHearDisable" v-model="isHearDiscussion" label="0">否</el-radio>
                </div>
              </div>
              <div class="check-title left-indent">{{ isHearRep ? '审核结果' : `${operType}结果` }}</div>
              <div class="left-indent check-tips check-radio">
                {{ isHearRep ? '审核结果' : `${operType}结果` }}
                <!-- <span class="indent"></span> -->
                <el-radio
                  v-model="radio"
                  label="1"
                  :disabled="!canUpdate || seeDetail || cantAgree"
                  v-if="item.auditTypeCode !== 'ta80040' && operType !== '审批' && !isHearRep"
                  >拟同意</el-radio
                >
                <el-radio
                  v-model="radio"
                  label="1"
                  :disabled="!canUpdate || seeDetail || cantAgree"
                  v-if="item.auditTypeCode === 'ta80040' || operType === '审批' || isHearRep"
                  >同意</el-radio
                >
                <el-radio v-model="radio" label="2" :disabled="!canUpdate || seeDetail">不同意</el-radio>
              </div>
              <div class="left-indent check-tips">
                {{ isHearRep ? '负责人审核意见：' : `${operType}意见:` }}
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入意见"
                  v-model="checkContent"
                  :disabled="!canUpdate || seeDetail || hearOpiDis"
                ></el-input>
              </div>
              <div class="left-indent check-tips check-radio">
                {{ isHearRep ? '审核时间' : `${operType}时间: ` }}
                <span class="indent"></span>
                {{ getNowTime }}
              </div>
              <div class="doubleButton" v-show="!seeDetail">
                <el-button
                  :loading="item.loading"
                  :type="item.type"
                  v-for="(item, index) in doubleButtonList"
                  :key="index"
                  @click="item.fun"
                  :disabled="item.disable"
                  :plain="item.name === '退回编辑'"
                  >{{ item.name }}</el-button
                >
              </div>
            </div>
            <div class="check-order">
              <div class="check-title left-indent">{{ orderType }}</div>
              <time-line :lineData="lineData"></time-line>
            </div>
          </el-col>
        </el-row>
        <el-dialog :title="isHearRep ? '选择发起集体讨论人员' : `选择${selectTitle}人员`" width="900px" height="600px" :visible.sync="showPeopleList">
          <select-people :sureIsLoading="sureIsLoading" :selectNum="1" @getPeople="getSelectedPeople"></select-people>
        </el-dialog>
        <el-dialog title="选择签章" width="900px" height="600px" :visible="signatureVisible" :before-close="closeSign" @close="closeSign">
          <signature-group :signatureList="signatureList" @close="closeSign" @sentToSign="signMultiple"></signature-group>
        </el-dialog>
      </sn-page-bar>
    </div>
    <button-group :buttonList="buttonList" v-show="!seeDetail"></button-group>

    <comprehensive-browse v-if="compBrowseShow" @closeFrame="compBrowseShow = false" :workAreaId="item.requestId"></comprehensive-browse>
  </div>
</template>
<script>
import snPageBar from '@components/snPageBar/index'
import showPdf from '@/components/showPdf/index'
import timeLine from '@/components/TimeLine/index'
import signatureGroup from '@/components/signatureGroup/index'
import { dateFormat, debounce } from '@/utils/util'
import { setCaseDetail } from '@/utils/audit'
import { getTodoProcedure, submitTodoInfo, submitSignWrit, submitLawInfo, getSealState } from '@/api/workArea'
import { showSignature } from '@/api/common'
import { getWritInfo } from '@/api/fileRelated'
import buttonGroup from '@/components/buttonGroup/index'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'

import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
import { getFilingRegister } from '@/api/filingRegister/index'
export default {
  components: {
    snPageBar,
    showPdf,
    timeLine,
    buttonGroup,
    selectPeople,
    tips,
    comprehensiveBrowse,
    signatureGroup
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: 'EA215101646668042240'
    },
    seeDetail: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isBackToLast: false, // 是否是返回上一级
      signatureList: [], //签章图片
      signatureVisible: false, //签章数据弹窗
      isHearDisable: false, // 是否可以操作提请集体讨论（可选）
      isHearRep: false, // 是否是听证会报告书
      hearOpiDis: false, // 是否可以修改负责人审核意见
      pdfId: null, // 浏览pdfid
      checkContent: '拟同意。', // 审核/审批意见
      operType: null, // 审核审批类型
      orderType: '审核审批流程', // 审核审批流程类型
      radio: '1', // 同意/不同意单选
      lineData: [], // 流程信息
      pdfDownload: true, // pdf是否已经加载
      isHearDiscussion: '0', // 是否提请集体讨论
      buttonList: [
        {
          name: '取消',
          type: '',
          disable: false,
          fun: this.backPage
        }
      ],
      doubleButtonList: [],
      // 操作按钮
      handleButton: {
        name: '签名',
        type: 'primary',
        disable: false,
        fun: this.sign,
        loading: false
      },
      // 提交按钮
      submitButton: {
        name: '提交',
        type: 'primary',
        disable: true,
        fun: this.selectPeople,
        loading: false
      },
      notAgreeButton: {
        name: '不同意',
        type: 'danger',
        disable: false,
        fun: this.submitByNotAgree,
        loading: false
      },
      canUpdate: true,
      showPeopleList: false,
      pdfUpdate: true,
      infoTime: null,
      getFullInfo: false,
      compBrowseShow: false,
      tipsShow: false,
      hasSubmit: false, // 防抖在接口返回时无效，立flag，成功后防止重复提交
      sureIsLoading: false,
      selectTitle: '审批',
      cantAgree: false, // 只能同意
      submitType: 'agree',
      notAgreeType: '', //  back notAgree
      souceType: '' // 来源流程节点，默认从执法来
    }
  },
  created() {
    this.getSignInfo() //取签章数据
    // 判断是否是听证会报告书
    if (this.item.auditTypeCode === 'ta80049') {
      this.isHearRep = true
      this.orderType = '审核流程'
    } else {
      this.isHearRep = false
    }
    // if (
    //   [
    //     'ta80005',
    //     'ta80006',
    //     'ta80018',
    //     'ta80019',
    //     'ta80043',
    //     'ta80044',
    //     'ta80024',
    //     'ta80025',
    //     'ta80020',
    //     'ta80021',
    //     'ta80022',
    //     'ta80023',
    //     'ta80026',
    //     'ta80027',
    //     'ta80047',
    //     'ta80048'
    //   ].indexOf(this.item.auditTypeCode) !== -1
    // ) {
    //   this.tipsShow = true
    // }
    if (['ta80003','ta80004'].indexOf(this.item.auditTypeCode) === -1) {
      this.tipsShow = true
    }
    this.operType = this.item.title.indexOf('审核') === -1 ? (this.item.title.indexOf('审批') === -1 ? '审查' : '审批') : '审核'
    if (this.item.auditTypeCode === 'ta80040') {
      this.orderType = '公章审批流程'
      this.handleButton.name = '盖章'
    }
    if (this.item.auditTypeCode === 'ta80052') {
      this.orderType = '公章审批流程（现场处理措施）'
      this.handleButton.name = '盖章'
    }
    if (this.item.auditTypeCode === 'ta80053') {
      this.orderType = '公章审批流程（责令限期整改）'
      this.handleButton.name = '盖章'
    }
    this.checkContent = this.item.auditTypeCode === 'ta80040' || this.operType === '审批' || this.isHearRep ? '同意。' : '拟同意。'

    if (this.item.auditTypeCode === 'ta80014') {
      this.selectTitle = '法制审核'
      this.orderType = '法制审核流程'
    }
    this.pdfId = this.item.requestId
    this.pdfDownload = true
    this.doubleButtonList.push(this.handleButton, this.submitButton)
    this.doubleButtonList[1].disable = true
    if (this.seeDetail) {
      let demo = 'a002a004a006'
      this.checkContent = this.item.auditResultOption
      this.infoTime = this.item.handlerTime
      this.radio = demo.indexOf(this.item.auditResultCode) !== -1 ? '1' : '2'
    }
    // 获取当前id关联的流程信息
    let req = { requestId: this.item.requestId }
    if (this.item.auditTypeCode === 'ta80014') {
      req.type = 'lawAudit'
    }
    getTodoProcedure(req).then(res => {
      this.lineData = res.data && res.data.length > 0 ? res.data : []
      this.souceType = res.data[0].auditResultCode
      console.info('268', this.souceType)

      this.getFullInfo = true
    })
    getSealState({
      taskId: this.item.taskId
    }).then(res => {
      if (this.souceType === 'tfs01' || this.souceType === 'b042' || this.souceType === 'b052') {
        // 回退的不需要更新签名状态
        return 
      }
      this.doubleButtonList[0].disable = res.data.isSign == 1
      if (res.data.isSign == 1) {
        this.doubleButtonList[0].name = this.doubleButtonList[0].name === '签名' ? '已签名' : '已盖章'
        this.doubleButtonList[1].disable = false
        this.canUpdate = false
        // 听证会报告书签名后不允许修改负责人审核意见
        this.hearOpiDis = true
        this.isHearDiscussion = this.item.param.isNeed
      } else {
        this.hearOpiDis = false
      }
      this.doubleButtonList[1].disable = res.data.isSign == 0
      if (this.operType === '审批' || this.item.auditTypeCode === 'ta80040') {
        this.doubleButtonList[1].fun = this.submit
      }
    })
    if (this.operType === '审批' || this.isHearRep) {
      this.submitButton.name = '完成'
      this.submitButton.fun = this.submit
    }
    // this.sign = debounce(this.sign);
  },
  methods: {
    closeSign() {
      this.signatureVisible = false
      this.doubleButtonList[0].loading = false
    },
    clickHandle() {
      // getFilingRegister({
      //   penalty: this.item.caseId
      // }).then(res => {
      //   this.$store.commit("setPenalty", res.data);
      // })
      this.compBrowseShow = true
    },
    // 返回上一页
    backPage() {
      this.$emit('backPage', null, this.seeDetail)
    },
    // 处理提交code值+1
    handleCode(value = String) {
      let code = null
      if (this.operType !== '审批') {
        code = value.split('').reverse()
        code[0] = Number(code[0]) + 1
        if (code[0] === 10) {
          code.splice(1, 1)
        }
        code = code.reverse().join('')
      } else {
        code = value
      }
      return code
    },
    handleFlow(code = String) {
      let result = null
      if (code === 'ta80040') {
        result = this.radio === '1' ? 'a004' : 'a003'
      } else if (code === 'ta80014') {
        if (this.submitType === 'back') {
          result = this.radio === '1' ? 'b01' : 'tfs02'
        } else {
          result = this.radio === '1' ? 'b01' : 'b02'
        }
      } else if (code === 'ta80049') {
        // 组织听证听证会通知书
        result = this.radio === '1' ? 'a004' : 'a003'
      } else {
        result =
          this.operType === '审核'
            ? this.radio === '1'
              ? 'a002'
              : 'a001'
            : this.operType === '审批'
            ? this.radio === '1'
              ? 'a004'
              : 'a003'
            : this.radio === '1'
            ? 'a006'
            : 'a005'
      }
      return result
    },
    backToLast() {
      this.isBackToLast = true
      this.submit()
    },
    // 返回上一级
    handleBackFlow(code = String) {
      let result = ''
      let onceArr = ['ta80040', 'ta80007', 'ta80049', 'ta80052', 'ta80053']
      let thriceArr = ['ta80008', 'ta80009', 'ta80010', 'ta80011', 'ta80012', 'ta80013']
      if (onceArr.indexOf(code) >= 0) {
        // 一步
        result = 't03'
      } else if (thriceArr.indexOf(code) >= 0) {
        // 三步
        if (code === 'ta80008' || code === 'ta80011') {
          result = 't02'
        } else if (code === 'ta80009' || code === 'ta80012') {
          result = 't01'
        } else if (code === 'ta80010' || code === 'ta80013') {
          result = 't03'
        }
      } else {
        // 二步
        if (this.operType === '审核') {
          result = 't01'
        } else {
          result = 't03'
        }
      }
      return result
    },
    handleBackCode(value = String) {
      let code
      let onceArr = ['ta80040', 'ta80007', 'ta80049', 'ta80052', 'ta80053', 'ta80008', 'ta80011']
      if (onceArr.indexOf(value) >= 0) {
        code = value
      } else {
        if (this.operType === '审核' && value !== 'ta80009' && value !== 'ta80012') {
          return value
        }
        let num = Number(value.slice(5)),
          tail = ''
        if (num <= 10) {
          tail = '0' + String(num - 1)
        } else {
          tail = '' + num - 1
        }
        code = 'ta800' + tail
      }
      return code
    },
    // 处理提交的参数
    handleDataInfo(peopleId, deptId) {
      let code, result
      if (this.isBackToLast) {
        code = this.handleBackCode(this.item.auditTypeCode)
        result = this.handleBackFlow(this.item.auditTypeCode)
      } else {
        code = this.handleCode(this.item.auditTypeCode)
        result = this.handleFlow(this.item.auditTypeCode)
      }
      let dataInfo = {
        auditResultCode: result,
        auditResultOption: this.checkContent,
        auditTypeCode: this.isHearRep ? 'ta80049' : code,
        handlerDeptId: this.isBackToLast ? '' : deptId,
        parentTaskId: this.lineData[this.lineData.length - 1].parentTaskId,
        handlerUserId:
          this.submitType === 'back' || this.submitType === 'notAgree' || this.isBackToLast ? null : typeof peopleId === 'string' ? peopleId : null,
        requestDeptName: this.item.requestDeptName,
        requestId: this.item.requestId,
        requestTime: this.item.requestTime,
        requestUsersName: this.item.requestUsersName,
        requestUsersIds: this.item.requestUsersIds,
        submitterCause: this.item.submitterCause,
        partyId: this.item.partyId,
        partyName: this.item.partyName,
        param: this.isHearRep && !this.isBackToLast ? { isNeed: this.isHearDiscussion } : {}
      }
      return dataInfo
    },
    submitByNotAgree() {
      this.submitType = 'notAgree'

      // 执法过来a01
      // b042
      // tfs01
      if (this.lineData[0].auditResultCode === 'b042' || this.lineData[0].auditResultCode === 'b052') {
        // 直接提交
        this.submit()
        // this.doubleButtonList[0].name = '不同意'
        // this.doubleButtonList[1].disable = true
      } else {
        // 先签字再提交不同意
        this.sign(true)
      }
    },
    submitBack() {
      this.submitType = 'back'
      this.submit()
    },
    // 提交
    submit: debounce(function(peopleId, deptId) {
      if (this.operType === '审批' && this.doubleButtonList[1] && !this.isBackToLast) {
        this.doubleButtonList[1].loading = true
      }
      // 处理提交的参数
      let dataInfo = this.handleDataInfo(peopleId, deptId)
      let result = dataInfo.auditResultCode
      if (result === 'b01' || result === 'b02') {
        // 来自法制审核
        dataInfo.executorId = this.item.executorId
        dataInfo.caseId = this.item.caseId
        dataInfo.caseName = this.item.caseName
        dataInfo.partyName = this.item.partyName
        submitLawInfo(dataInfo).then(
          res => {
            this.successHandle()
            // 获取案件信息，更新流程正常回退状态
            setCaseDetail(dataInfo.caseId)
          },
          err => {
            this.failHandle(err)
          }
        )
      } else {
        if (this.item.requestWritType) {
          // 处罚决定处 三份决定书
          dataInfo.requestWritType = this.item.requestWritType
          dataInfo.parentTaskId = this.item.parentTaskId
        }
        submitTodoInfo(dataInfo).then(
          res => {
            this.successHandle()
          },
          err => {
            this.failHandle(err)
          }
        )
      }
    }, 2000),
    // 提交/退回成功之后的提示信息
    successHandle() {
      if (this.doubleButtonList[1]) {
        this.doubleButtonList[1].loading = false
      }
      this.sureIsLoading = false
      let info, type
      if (this.isBackToLast) {
        info = '返回成功'
        type = 'warning'
      } else {
        info = this.radio === '1' ? '提交成功' : '退回成功'
        type = this.radio === '1' ? 'success' : 'warning'
      }
      this.$message({
        message: info,
        type: type
      })
      this.showPeopleList = false
      this.backPage()
    },
    // 提交/退回失败之后的提示信息
    failHandle(err) {
      if (this.doubleButtonList[1]) {
        this.doubleButtonList[1].loading = false
      }
      this.sureIsLoading = false
      this.$message({
        message: err,
        type: 'warning'
      })
    },
    // 从公章页面传来的数据 盖章
    signMultiple(data) {
      let signId = data.signId
      submitSignWrit({
        writId: this.pdfId,
        signType: 'SINGLE_OFFICE',
        signId: signId
      }).then(
        res => {
          
          this.pdfUpdate = false
          setTimeout(()=> {

            this.pdfUpdate = true
          },0)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.doubleButtonList[0].name = this.doubleButtonList[0].name === '签名' ? '已签名' : '已盖章'
          this.doubleButtonList[0].disable = true
          this.doubleButtonList[1].disable = false
          this.canUpdate = false
          this.doubleButtonList[1].fun = this.submit
          this.doubleButtonList[1].disable = false
          // 关闭盖章弹窗
          this.signatureVisible = false
        },
        err => {
          this.$message({
            message: err,
            type: 'error'
          })
          // this.pdfUpdate = true
          // this.pdfDownload = false
          this.doubleButtonList[1].disable = true
        }
      )
    },
    // 签名
    sign: debounce(function(toSubmit) {
      this.doubleButtonList[0].loading = true
      let type = null
      // ta80040 盖公章  ta80052 现场处理措施  ta80053 责令限期整改
      if (this.item.auditTypeCode === 'ta80040' || this.item.auditTypeCode === 'ta80052' || this.item.auditTypeCode === 'ta80053') {
        type = 'SINGLE_OFFICE'
        // 区分数据 直接盖还是选择盖
        if (this.signatureList && this.signatureList.length > 1) {
          this.signatureVisible = true
          // 取选中的数据
        } else {
          // 单条 数据 直接盖章
          submitSignWrit({
            writId: this.pdfId,
            signType: type
          }).then(
            res => {
            this.pdfUpdate = false
            setTimeout(()=> {
              this.pdfUpdate = true
            },0)
              this.doubleButtonList[0].loading = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.doubleButtonList[0].name = this.doubleButtonList[0].name === '签名' ? '已签名' : '已盖章'
              this.doubleButtonList[0].disable = true
              this.doubleButtonList[1].disable = false
              this.canUpdate = false
              /*  if (this.operType === '审批' || this.item.auditTypeCode === 'ta80040') {
                this.doubleButtonList[1].fun = this.submit
                this.doubleButtonList[1].disable = false
              } */
              this.doubleButtonList[1].fun = this.submit
              this.doubleButtonList[1].disable = false
            },
            err => {
              this.$message({
                message: err,
                type: 'error'
              })
              // this.pdfUpdate = true
              // this.pdfDownload = false
              this.doubleButtonList[1].disable = true
            }
          )
        }
      } else {
        type =
          this.operType === '审核'
            ? this.radio === '2'
              ? 'SHR_NO'
              : 'SHR_OK'
            : this.operType === '审批'
            ? this.radio === '2'
              ? 'SPR_NO'
              : 'SPR_OK'
            : this.radio === '2'
            ? 'SCR_NO'
            : 'SCR_OK'

        // action start
        submitSignWrit({
          text: '',
          writId: this.pdfId,
          signType: this.isHearRep ? 'SPR_OK' : type
        }).then(
          res => {
            
            this.pdfUpdate = false
            setTimeout(()=>{
              this.pdfUpdate = true
            },0)
            this.doubleButtonList[0].loading = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            if (this.doubleButtonList[0].name !== '不同意') {
              this.doubleButtonList[0].name = this.doubleButtonList[0].name === '签名' ? '已签名' : '已盖章'
            }
            this.doubleButtonList[0].disable = true
            this.doubleButtonList[1].disable = false
            this.canUpdate = false
            if (this.operType === '审批' || this.item.auditTypeCode === 'ta80040') {
              this.doubleButtonList[1].fun = this.submit
              this.doubleButtonList[1].disable = false
            }

            if (toSubmit === true) {
              // 第一次就不同意要签名再提交
              this.submit()
            } else {
              // this.doubleButtonList[0].name = '不同意'
              // this.doubleButtonList[1].disable = true
            }
          },
          err => {
            this.doubleButtonList[0].loading = false
            this.$message({
              message: err,
              type: 'error'
            })
            // this.pdfUpdate = true
            // this.pdfDownload = false
            this.doubleButtonList[1].disable = true
          }
        )
        // action end
      }
    }, 1000),
    getSelectedPeople(val, list) {
      if (val) {
        this.submit(list[0].id, list[0].deptId)
        this.sureIsLoading = true
      } else {
        this.showPeopleList = false
      }
    },
    selectPeople: debounce(function() {
      if (this.item.auditTypeCode === 'ta80040') {
        this.sign()
        return
      }
      this.showPeopleList = true
    }),
    getSignInfo() {
      let userId = JSON.parse(sessionStorage.userInfo).userEntity.id
      showSignature({
        type: 1,
        userId: userId
      })
        .then(res => {
          if (res.code !== '0') return
          this.signatureList = res.data
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    souceTypeHandler(val) {
      if (val === 'tfs01') {
        this.radio = '2'
      }
      if (val === 'b042' || val === 'b052') {
        this.radio = '2'
      }
    }
  },
  computed: {
    // 设置当前时间
    getNowTime() {
      return this.seeDetail ? this.infoTime : dateFormat(new Date(), 'yyyy/mm/dd HH:MM')
    }
  },
  watch: {
    radio: {
      handler: function(val, oldval) {
        if (!this.seeDetail) {
          if (val === '1') {
            if (this.item.auditTypeCode === 'ta80014') {
              this.doubleButtonList.splice(0, 2)
            } else {
              this.doubleButtonList.splice(0, 1)
            }
            this.submitButton.name = this.operType == '审批' ? '完成' : '提交'
            this.submitButton.disable = true
            this.isHearDisable = false
            this.submitButton.className = null
            this.submitButton.type = 'primary'
            this.submitButton.fun = this.operType == '审批' ? this.submit : this.selectPeople
            this.doubleButtonList.push(this.handleButton, this.submitButton)
            this.checkContent = this.item.auditTypeCode === 'ta80040' ? '同意。' : '拟同意。'
          } else {
            this.doubleButtonList.splice(0, 1)
            if (this.item.auditTypeCode === 'ta80014') {
              this.submitButton.name = '退回编辑'
              this.doubleButtonList.splice(0, 0, this.notAgreeButton)
            } else {
              this.submitButton.name = '退回'
            }
            this.submitButton.className = 'is-no'
            if (this.souceType !== 'b042' && this.souceType !== 'b052') {
              this.submitButton.disable = false
              console.info(JSON.parse(JSON.stringify(this.doubleButtonList)))
              console.info(111,this.doubleButtonList)
            }
            if (this.souceType === 'tfs01') {
              this.doubleButtonList[0].disable = true
              this.doubleButtonList[1].disable = false
              // this.notAgreeButton.disable = true
              // this.submitButton.disable = false
              this.cantAgree = true
              console.info(JSON.parse(JSON.stringify(this.doubleButtonList)))
              console.info(222,this.doubleButtonList)
            }
            if (this.souceType === 'b042' || this.souceType === 'b052') {
              this.doubleButtonList[0].disable = false
              this.doubleButtonList[1].disable = true
              // this.submitButton.disable = true
              // this.notAgreeButton.disable = false
              this.cantAgree = true
              console.info(JSON.parse(JSON.stringify(this.doubleButtonList)))
              console.info(333,this.doubleButtonList)
            }

            this.isHearDisable = true
            this.submitButton.fun = this.submitBack
            this.submitButton.type = 'danger'
            this.checkContent = '不同意。'
            console.info('souceTypeHandler', this.souceType)

            

          }
        }
      }
    },
    isHearDiscussion: {
      handler: function(nv, ov) {
        if (this.isHearRep) {
          if (nv === '1') {
            this.submitButton.name = '提交'
            this.submitButton.fun = this.selectPeople
          } else {
            this.submitButton.name = '完成'
            this.submitButton.fun = this.submit
          }
        }
      },
      immediate: true
    },
    souceType: {
      handler: function(val, oldval) {
        // 执法过来a01
        // 不同意过来b042
        // 回退编辑过来tfs01
        
        console.info('souceTypeHandler', val)
        this.souceTypeHandler(val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.back-to-last {
  margin-bottom: 10px;
}
.title {
  font-size: 18px;
  line-height: 27px;
  font-weight: 500;
}
.left-indent {
  padding-left: 17px;
  margin-bottom: 10px;
  .el-textarea {
    top: 5px;
  }
}
.check-tips {
  color: #333333;
}
.check-radio {
  white-space: nowrap;
}
.el-radio {
  margin-right: 15px;
}
.check-title {
  background-color: #e3eef6;
  height: 24px;
  line-height: 24px;
  font-size: 16px;
  font-weight: bold;
  min-width: 230px;
}
.text-warn {
  text-align: center;
  margin-top: 100px;
  font-size: 28px;
}

.el-row {
  margin-top: 30px;
}
.el-col-16 {
  overflow-y: hidden;
}
.indent {
  display: inline-block;
  width: 16px;
  height: 100%;
}
.doubleButton {
  padding-left: 18px;
  padding-bottom: 10px;
  width: 120%;
  /deep/.el-icon-loading {
    line-height: 0;
  }
}
.see-pdf-body {
  position: relative;
  width: 100%;
  height: 550px;
}
.input-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  line-height: 35px;
  .check-title {
    padding-left: 17px;
  }
  .hear-radio {
    padding-left: 17px;
  }
}
</style>
