<template>
  <div class="new-inspection">
    <div class="body">
      <sn-page-bar>
        <template slot="button">
          <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
        </template>
        <!-- 文书 -->
        <div v-loading="delayLoading">
          <div class="body-content-button" v-if="isDetail">
            <el-button type="primary" class="body-button" @click="uploadComInfo">+ 企业申请资料上传</el-button>
            <el-button type="primary" class="body-button" @click="seeDelayApply" :disabled="this.comUploadSuc === true">+ 延期申请</el-button>
            <el-button type="primary" class="body-button" @click="answerWS" :disabled="comUploadSuc">+ 延期答复书</el-button>
            <!-- 整改复查延期申请答复书 -->
            <el-dialog title="整改复查延期申请答复书" :visible.sync="DisOuterVisible" :before-close="initStatus" class="make-writ-dialog">
              <div class="letterReply_content">
                <div class="content-list">
                  <el-form :model="ruleForm" ref="ruleForm" :label-position="labelPosition" label-width="110px" :rules="rules" :show-message="false">
                    <el-form-item label="" prop="targetName">
                      <div slot="label" class="slot_label">当事人名称</div>
                      <el-input v-model="ruleForm.targetName" placeholder="请输入当事人名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="decision">
                      <div slot="label" class="slot_label">处理方式</div>
                      <el-input v-model="ruleForm.decision" placeholder="请输入处理方式" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="" prop="value">
                      <div slot="label" class="slot_label">文书编号</div>
                      <el-select v-model="ruleForm.value" placeholder="请选择文书编号" clearable @change="selectChange($event)">
                        <el-option v-for="(item, index) in wsLists" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="" prop="decisionTime">
                      <div slot="label" class="slot_label">处理时间</div>
                      <el-date-picker v-model="ruleForm.decisionTime" type="date" placeholder="请选择处理时间" clearable disabled></el-date-picker>
                    </el-form-item>
                    <el-form-item label="" prop="category">
                      <div slot="label" class="slot_label">是否延期</div>
                      <el-select style="paddingBottom:5px" v-model="ruleForm.category" placeholder="请选择是否延期" @change="selectChanged('ruleForm')">
                        <el-option label="是" value="0"></el-option>
                        <el-option label="否" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="" v-if="ShowTime" prop="delayTime">
                      <div slot="label" class="slot_label">延期时间</div>
                      <el-date-picker
                        v-model="ruleForm.delayTime"
                        type="date"
                        placeholder="请选择延期时间"
                        clearable
                        :picker-options="pickerOptions"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="" v-if="ShowCause" label-width="150px" prop="delayReason">
                      <div slot="label" class="slot_label">不同意延期原因</div>
                      <el-input type="textarea" v-model="ruleForm.delayReason" clearable></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button @click="callOfs">取 消</el-button>
                <el-button type="primary" @click="makeReplyApplicationPdf('ruleForm')">保存并生成延期申请答复书</el-button>
              </div>
            </el-dialog>
          </div>
          <div class="picture" v-if="docCardList.length === 0">
            <img src="../../../../assets/imgs/list_empty.png" />
            <li>暂无文书</li>
          </div>
          <div class="writ-list" v-if="docCardList.length > 0">
            <doc-card
              v-for="(item, index) in docCardList"
              :key="index"
              :docData="item"
              :auditInfo="auditInfo"
              v-on="$listeners"
              @afterDelete="getWritList"
              @afterUpload="getWritList"
              @modifyWrit="chooseWrit"
              @toSeal="toSeal"
              @previewWrit="previewWrit"
              :canUpdate="canUpdate"
              @submit="submit"
              @toLawSeal="toLawSeal"
              :readOnly="readOnly"
            ></doc-card>
          </div>
        </div>
        <!-- 申请资料 -->
        <br />
        <template>
          <section class="proof-list_penalty">
            <div v-for="(item, index) in this.applyInfoList" :key="index" class="proof">
              <down-proof v-if="!!item" :proof="item" @removeProof="delProof" type="applyInfo" :canDel="canDel"></down-proof>
            </div>
            <div v-if="delayFlag !== 'flagDetail'">
              <upload-proof ref="proof" @getUploadMsg="getMsg" :uploadType="'applyInfo'" v-bind="$attrs" @delProof="newApplyInfo"></upload-proof>
            </div>
          </section>
        </template>
      </sn-page-bar>
    </div>
    <show-pdf
      :pdfId="pdfId"
      v-if="showPdfDialog"
      :writTypeCode="writTypeCode"
      :buttonList="writBtnList"
      @closePdf="closePdf"
      @auditPdf="auditPdf"
      @lawSealPdf="lawSealPdf"
      :writName="writName"
      @updatePdf="updatePdf"
      @sealPdf="sealPdf"
    ></show-pdf>

    <el-dialog width="900px" height="600px" :visible.sync="choosePeople" :title="chooseTitle">
      <select-people :selectNum="1" @getPeople="getPeople"></select-people>
    </el-dialog>
    <buttonGroup :buttonList="buttonList"></buttonGroup>
    <!-- 修改回显 -->
    <el-dialog :visible.sync="outerVisible" title="整改复查延期申请审批表" :before-close="handleSpbClose">
      <apply-form v-if="outerVisible" :writIdInSPB="writIdInSPB" @cancel="cancel" ref="updateSpbinfo" @updateWrit="updateWrit" :spbInfo="spbInfo"></apply-form>
    </el-dialog>
  </div>
</template>
<script>
import snPageBar from '@/components/snPageBar/index'
import uploadProof from '@components/uploadProof/index'
import downProof from '@components/downProof/index'
import { getInvesWrits, createWrit, updateWrit, deleteWrit, getWritInfo, getWritDataByWritId } from '@api/fileRelated' //文书
import docCard from '@/components/docCard'
import showPdf from '@/components/showPdf/index'
import { dateFormat, getWritParams, debounce } from '@/utils/util'
import { showRectificationReviewDetail, saveRectificationReview, saveDelayInfo, deleteDelayAcc } from '@/api/rectification/index'
import { mapState } from 'vuex'
import { makeDisposalDocument, enterPriseInquireByid, simpleDocumentList } from '@api/ProcessingofInspectionResult'
import buttonGroup from '@components/buttonGroup/index'
import { getInspectionWritList, getComInfo } from '@/api/onSiteInspection/index'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { sealAudit } from '@/api/common'
import ApplyForm from '@/components/commonWrit/DelayApplyApprovalForm'
import writTypeMap from '@/utils/writType'
import { Throttle, handleDateRef } from '@/utils/util'

export default {
  components: {
    snPageBar,
    showPdf,
    docCard,
    buttonGroup,
    selectPeople,
    ApplyForm,
    uploadProof,
    downProof
  },
  data() {
    return {
      labelPosition: 'left',
      isUserSign: 0,
      ruleForm: {
        category: '',
        unitName: '',
        person: '',
        phone: '',
        value: '',
        sex: '',
        personPhone: '',
        address: '',
        companyCode: '',
        personCode: '',
        personName: '',
        companyName: '',
        unitAdress: '',
        homeAdress: '',
        personPhone: '',
        delayReason: '',
        appMatter: '',
        delayTime: '',
        targetName: '',
        number: '',
        decision: '责令限期整改',
        delayReason: '',
        category: '',
        decisionTime: ''
      },
      rules: {
        targetName: [{ required: true, message: '请输入当事人名称', trigger: 'blur' }],
        decision: [{ required: true, message: '请输入处理方式', trigger: 'blur' }],
        delayReason: [{ required: true, message: '请输入不同意延期理由', trigger: 'blur' }],
        category: [{ required: true, message: '请选择是否延期', trigger: 'change' }],
        decisionTime: [{ required: true, message: '请选择决定时间', trigger: 'change' }],
        delayTime: [{ required: true, message: '请选择延期时间', trigger: 'change' }],
        value: [{ required: true, message: '请选择文书编号', trigger: 'change' }]
      },
      isShow: true,
      isDetail: true,
      options: [],
      option: [],
      docCardList: [],
      outerVisible: false,
      DisOuterVisible: false,
      showPdfDialog: false,
      showCompany: false,
      showPerson: false,
      pdfId: null,
      sourceId: null,
      ShowTime: false,
      ShowCause: false,
      buttonList: [
        {
          name: '返回',
          type: '',
          disable: false,
          fun: this.back
        }
      ],
      auditInfo: {},
      choosePeople: false,
      chooseTitle: '选择审核人员',
      canUpdate: true,
      writBtnList: {},
      writTypeCode: null,
      writName: '',
      spbInfo: [], //审批表回显
      writIdInSPB: '',
      answerDisableSatus: true,
      // 文书编号列表
      wsLists: [],
      value: '',
      submitData: {},
      data: {},
      isUpdate: false,
      applyInfoList: [], //资料列表
      readOnly: false, //是否是详情  只展示浏览按钮
      // 禁止选择当前时间之前的检查时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      comUploadSuc: true, //必须企业资料上传成功或者是有企业资料才能操作延期或者是答复书
      delayLoading: false, //延期申请审批页的delayLoading
      canDel: true //可不可以有删除 默认false 是可以删除 详情页 不可以删除 应该传true
    }
  },
  computed: {
    ...mapState([
      'delayExecutorId',
      'delayDataId',
      'delayFlag',
      'delayCompanyId',
      'delayPerson',
      'delayStartTime',
      'delayPersonName',
      'delayCompanyName'
      // "writTypeInfo"
    ])
  },
  watch: {
    applyInfoList: {
      handler: function(newVal, oldVal) {
        if (this.applyInfoList && this.applyInfoList.length > 0) {
          this.comUploadSuc = false
        } else {
          this.comUploadSuc = true
        }
      },
      deep: true
    }
  },
  mounted() {
    let flag = this.delayFlag
    if (flag == 'flagDetail') {
      this.isShow = false
      this.isDetail = false
      this.canUpdate = false
      this.readOnly = true
      this.canDel = false
    }
    if (flag == 'flagSee') {
      this.isShow = true
      this.isDetail = true
      this.canDel = true
    }
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.getWritList()
    getComInfo({ id: this.delayCompanyId }).then(res => {
      if (!res.data) return
      // 答复书
      this.ruleForm.targetName = res.data.companyName
      this.ruleForm.unitName = res.data.companyName
      this.ruleForm.person = res.data.legalPerson
      this.ruleForm.address = res.data.businessAddress
      this.ruleForm.companyCode = res.data.postalCode
    })
    this.makeReplyApplicationPdf = debounce(this.makeReplyApplicationPdf)
    this.getDetail()
  },
  methods: {
    // 取企业神奇资料数据
    getDetail() {
      showRectificationReviewDetail({
        id: this.delayDataId,
        isDelay: '0'
      }).then(res => {
        if (!res.data) return
        this.data = res.data
        this.applyInfoList = res.data.delayAccList
      })
    },
    // 点击+延期答复书按钮
    answerWS: Throttle(function() {
      if (this.answerDisableSatus === true) {
        this.$message({
          showClose: true,
          message: '请先填写延期申请审批表',
          type: 'warning'
        })
      } else {
        this.getAnswerOptionList()
        this.initStatus()
        this.DisOuterVisible = true
      }
    }, 2000),
    selectChange(value) {
      if (!value) {
        this.wsLists = []
        this.getWritList()
      } else {
        // 决定时间 decisionTime
        let decisionItem = this.wsLists.find(i => {
          return i.value === value
        })
        this.ruleForm.decisionTime = decisionItem.creatorTime
      }
    },
    uploadComInfo() {
      // 以前索引是1 现在是0  不知道为啥
      this.$refs.proof.$refs.inner_upload.$children[0].handleClick()
    },
    seeDelayApply() {
      /*  if (this.comUploadSuc === false) {
        this.$store.commit('SET_NEW_DELAY_STATUS')
      } else {
        this.$message({
          showClose: true,
          message: '请先上传企业申请资料',
          type: 'warning'
        })
      } */
      this.$store.commit('SET_NEW_DELAY_STATUS')
    },
    delProof(id) {
      deleteDelayAcc({ id: this.delayDataId, delayAccId: id })
        .then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDetail()
        })
        .catch(err => {
          throw new Error('网络错误，请稍后再试', err)
        })
    },
    getMsg(data) {
      // 保存
      saveDelayInfo({
        id: this.delayDataId,
        delayAccId: data.accessoryId
      }).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.comUploadSuc = false
          // 调用企业申请资料数据方法
          this.getDetail()
        }
      })
    },
    // 加盖公章
    sealPdf(val) {
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: val.deptId, // 审核人部门 id
        handlerUserId: val.peopleId, // 审核人 只能有一个
        requestDeptName: this.userInfo.sysDeptEntity.name, // 承办人部门，现在先不填
        requestId: val.pdfId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.data.reviewName, // 复查人名称
        submitterCause: this.ruleForm.unitName, // 案件名称 或 企业名称
        requestUsersIds: this.data.reviewNameId, //复查人ids
        partyName: this.delayCompanyName,
        partyId: this.delayCompanyId
      }
      sealAudit(_audiReq).then(
        res => {
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
          this.showPdfDialog = false
          this.DisOuterVisible = false
          this.ruleForm.value = null
          this.ruleForm.decisionTime = null
          this.getWritList()
        },
        () => {
          this.$message({
            type: 'error',
            message: '提交失败！'
          })
        }
      )
    },
    newApplyInfo() {},
    cancel() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.outerVisible = false
      this.getWritList()
      // 不论是生成文书时点击取消还是回退编辑点击取消 都要刷新状态
      console.info('cancel ', this)
    },
    handleSpbClose() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.outerVisible = false
    },
    submit: Throttle(function(data) {
      this.chooseTitle = '请选择审核人员'
      this.choosePeople = true
      this.submitData = data
    }, 1000),
    // 盖执法章
    toLawSeal(data) {
      this.pdfId = data.id
      this.writName = data.title
      this.showPdfDialog = true
      this.writBtnList = {
        closePdf: true
      }
    },
    // 浏览pdf
    previewWrit(id, name, button, data) {
      if (id) {
        this.pdfId = id
        this.writName = name
        this.setWritBtn(data.writTypeCode)
        this.writBtnList = button
        this.writBtnList.updatePdf = false
        this.showPdfDialog = true
      } else {
        this.showPdfDialog = true
        this.writBtnList = {
          closePdf: true
        }
      }
    },
    //修改文书
    updateWrit(params) {
      updateWrit({ writId: params.writId }, params.data)
        .then(res => {
          if (res.code === '0') {
            this.setWritBtn(res.writType)
            this.pdfId = res.writId
            this.showPdfDialog = true
          }
        })
        .catch(err => {
          console.info(err)
        })
    },
    // 加盖公章
    toSeal(val) {
      this.chooseTitle = '请选择盖章人员'
      this.choosePeople = true
      this.submitData.auditTypeCode = val.auditTypeCode
      this.submitData.requestId = val.requestId
    },
    updatePdf() {
      this.showPdfDialog = false
      // 也要刷新 谨防点击取消编辑页面时文书列表没有刷新
      this.refreshWritList()
      this.delayLoading = false
      this.isUpdate = true
      console.info('回退编辑状态')
    },
    // 提交审核审批人
    getPeople(val, person) {
      if (!val) {
        this.choosePeople = false
        return
      }
      this.auditInfo.handlerDeptId = person[0].deptId
      this.auditInfo.handlerUserId = person[0].id
      let params = {
        auditTypeCode: this.submitData.auditTypeCode,
        handlerDeptId: person[0].deptId,
        handlerUserId: person[0].id,
        parentTaskId: '',
        requestDeptName: JSON.parse(localStorage.getItem('res')).userEntity.deptName, //承办人部门
        requestId: this.submitData.requestId, //文书id
        requestTime: void 0,
        requestUsersName: this.data.reviewName,
        submitterCause: this.ruleForm.unitName,
        requestUsersIds: this.data.reviewNameId,
        partyId: this.delayCompanyId,
        partyName: this.delayCompanyName
      }
      this.choosePeople = false
      sealAudit(params).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.getWritList()
      })
    },
    //返回
    back() {
      this.$store.commit('setNewRectificationDelayShow')
      this.$router.push({
        path: '/rectificationDelay'
      })
    },
    // 取消按钮
    callOfs() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.DisOuterVisible = false
      this.ruleForm.value = null
      this.ruleForm.decisionTime = null
    },
    // 刷新文书卡片列表
    refreshWritList() {
      this.getWritList()
      this.showPdfDialog = false
    },
    // 选择是否延期
    selectChanged(ruleForm) {
      if (this.ruleForm.category == '') {
        this.ShowTime = false
        this.ShowCause = false
      } else if (this.ruleForm.category == '0') {
        this.ShowTime = true
        this.ShowCause = false
        this.ruleForm.delayReason = null
        this.ruleForm.personName = null
        // this.ruleForm.value = null;
        this.ruleForm.homeAdress = null
        this.ruleForm.personPhone = null
        this.ruleForm.personCode = null
      } else {
        this.ShowTime = false
        this.ShowCause = true
        this.ruleForm.delayTime = null
        this.ruleForm.person = null
        this.ruleForm.phone = null
        this.ruleForm.address = null
        this.ruleForm.companyCode = null
      }
    },
    //修改
    chooseWrit(key, type, id, val) {
      this.isUpdate = true
      this.pdfId = id
      this.writIdInSPB = id
      getWritDataByWritId({ writId: id }).then(res => {
        if (type === 'ZGFCYQSQSPB') {
          this.outerVisible = true
          this.spbInfo = res.data
          /* this.$nextTick(() => {
            this.$refs.updateSpbinfo.editFormData()
          }) */
        } else {
          this.getReplyApplicationInfo(res.data)
          this.DisOuterVisible = true
        }
      })
    },
    // 状态初始化
    initStatus() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.isUpdate = false
      this.DisOuterVisible = false
      this.outerVisible = false
      this.ruleForm.value = null
      this.ruleForm.decisionTime = null
      this.ruleForm.category = null
      this.ruleForm.delayTime = null
      this.ruleForm.delayReason = null
      this.ShowTime = false
      this.ShowCause = false
    },
    // 获取文书列表
    getWritList() {
      this.delayLoading = true
      let str = ['ZGFCYQSQSPB', 'ZGYQSQDFS'].join(',')
      let params = {
        sourceId: this.delayDataId,
        type: str
      }
      getWritInfo(params).then(res => {
        if (res.code === '0') {
          this.docCardList = res.data
          this.delayLoading = false
          // 遍历取到 writNoName
          this.getAnswerOptionList()
        }
      })
    },
    // 答复书
    getAnswerOptionList() {
      this.wsLists = []
      this.docCardList.forEach(item => {
        if (item.writTitle.includes('审批表')) {
          this.wsLists.push({
            value: item.writNoName,
            labal: item.writNoName,
            id: item.writId,
            creatorTime: item.creatorTime ? item.creatorTime : ''
          })
          this.answerDisableSatus = false
        }
      })
    },
    // 生成延期申请答复文书
    makeReplyApplicationPdf(ruleForm) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let date = new Date(this.ruleForm.decisionTime)
          let params = {
            companyId: this.delayCompanyId, //执法检查模块制作文书传company_id
            contractorIds: this.delayExecutorId,
            sourceId: this.delayDataId,
            writType: 'ZGYQSQDFS'
          }
          let data = getWritParams({
            tag2: this.ruleForm.targetName ? this.ruleForm.targetName.trim() : '',
            tag3: this.ruleForm.decisionTime ? dateFormat(date, 'yyyy年mm月dd日') : '',
            tag4: this.ruleForm.decision,
            // tag5: this.ruleForm.number,
            tag6: this.ruleForm.category == 0,
            tag7: this.ruleForm.delayTime ? dateFormat(this.ruleForm.delayTime, 'yyyy年mm月dd日') : '',
            tag8: this.ruleForm.category == 1,
            tag9: this.ruleForm.delayReason,
            delayTime: dateFormat(this.ruleForm.delayTime, 'yyyy年mm月dd日')
          })
          params.data = data
          if (this.isUpdate === true) {
            updateWrit({ writId: this.pdfId }, data).then(
              res => {
                this.showPdfDialog = true
                this.setWritBtn(res.writType)
              },
              err => {
                console.info(err)
              }
            )
          } else {
            createWrit(params).then(
              res => {
                this.pdfId = res.writId
                this.showPdfDialog = true
                this.setWritBtn(res.writType)
              },
              err => {
                console.info(err)
              }
            )
          }
        } else {
          console.info('error ~~~ submit')
        }
      })
    },
    // 获取文书详情
    getReplyApplicationInfo(arr) {
      arr.forEach(item => {
        switch (item.tagName) {
          case 'tag1':
            this.ruleForm.value = item.tagContent
            break
          case 'tag2':
            this.ruleForm.targetName = item.tagContent
            break
          case 'tag3':
            this.ruleForm.decisionTime =
              item.tagContent && item.tagContent !== ''
                ? item.tagContent
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                : null
            break
          case 'tag4':
            this.ruleForm.decision = item.tagContent
            break
          case 'tag5':
            this.ruleForm.number = item.tagContent
            break
          case 'tag6':
            this.ruleForm.category = item.tagContent === 'true' ? '0' : '1'
            this.ShowTime = this.ruleForm.category === '0' ? true : false
            this.ShowCause = this.ruleForm.category === '1' ? true : false
            break
          case 'tag7':
            this.ruleForm.delayTime =
              typeof item.tagContent === 'string' &&
              item.tagContent
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', '')
            break
          case 'tag8':
            this.ruleForm.category = item.tagContent === 'false' ? '0' : '1'
            break
          case 'tag9':
            this.ruleForm.delayReason = item.tagContent
            break
          case 'delayTime':
            this.ruleForm.delayTime = item.tagContent ? handleDateRef(item.tagContent) : ''
            break
        }
      })
    },
    // 设置文书按钮状态
    setWritBtn(code) {
      let writTypeInfo = JSON.parse(sessionStorage.writTypeInfo)
      let item = writTypeInfo.find(i => {
        return i.id === code
      })
      this.writBtnList = {
        closePdf: true,
        updatePdf: true,
        auditPdf: item.isAudit == 1,
        sealPdf: item.isSign == 1,
        signPdf: item.userType == 1,
        lawSealPdf: item.isSign == 2,
        finishPdf: true
      }
      this.writName = item.typeName
      this.writTypeCode = item.auditTypeCode //提交审核 传的 auditTypeCode
    },
    closePdf() {
      this.getWritList()
      this.showPdfDialog = false
      this.outerVisible = false
      this.DisOuterVisible = false
      this.writBtnList = {}
      // 只要是关掉了PDF都应该刷新列表
      this.refreshWritList()
    },
    lawSealPdf() {},
    checkAudit() {
      if (this.docCardList && this.docCardList.length >= 1) {
        this.$message({
          message: '请不要重复操作',
          type: 'error'
        })
      } else {
        this.outerVisible = true
      }
    },
    checkAnswer() {
      if (this.docCardList && this.docCardList.length === 0) {
        this.$message({
          message: '请先提交延期审批',
          type: 'error'
        })
      } else if (this.docCardList && this.docCardList.length === 2) {
        this.$message({
          message: '请不要重复操作',
          type: 'error'
        })
      } else {
        this.DisOuterVisible = true
      }
    },
    // 提交审核
    auditPdf(val) {
      let params = {
        auditTypeCode: val.auditTypeCode ? val.auditTypeCode : this.writTypeCode,
        handlerDeptId: val.deptId,
        handlerUserId: val.peopleId,
        parentTaskId: '',
        requestDeptName: this.userInfo.userEntity.deptName,
        requestId: val.pdfId,
        requestTime: void 0,
        requestUsersName: this.delayPersonName,
        requestUsersIds: this.delayExecutorId,
        submitterCause: this.delayCompanyName ? this.delayCompanyName : this.ruleForm.unitName,
        partyId: this.delayCompanyId,
        partyName: this.delayCompanyName
      }
      sealAudit(params).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.showPdfDialog = false
        this.outerVisible = false
        this.getWritList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.body-content-button {
  padding-top: 40px;
  .body-button {
    // width: 210px;
    height: 30px;
    background: rgba(0, 153, 255, 1);
    border-radius: 5px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
  // 被覆盖了的禁用样式
  /deep/.el-button--primary.is-disabled {
    color: #fff;
    background-color: #a0cfff;
    border-color: #a0cfff;
  }
}
.proof-list_penalty {
  display: flex;
  width: auto;
  justify-content: flex-start;
  flex-wrap: wrap;
  // overflow: scroll;
  margin-top: 21px;
  .proof {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  /deep/ .proof-show {
    // width: auto !important;
    /deep/ .proof-oper {
      width: auto;
    }
  }
}
.approvalForm_content {
  background: #fff;
  padding: 10px 16px 10px 16px;
  box-sizing: border-box;
  border-radius: 8px;
  position: relative;
}
.card-footer {
  border-top: 1px solid #eeeeee;
  height: 46px;
  padding: 0 16px;
}
.body {
  position: relative;
  /deep/.el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
    top: 4px;
  }
}
.ct {
  padding-right: 220px;
}
.picture {
  padding: 60px 0px 70px 0px;
  text-align: center;
  width: 100%;
  li {
    list-style: none;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    line-height: 38px;
  }
}
.letterReply_content {
  padding: 10px 16px 10px 16px;
  box-sizing: border-box;
  // width: calc(100% - 16px);
  border-radius: 8px;
  height: 100%;
}
.content-list {
  // line-height: 40px;
  color: #333333;
  width: 100%;
  border-bottom: none;
}
.writ-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 17px;
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 40.5%;
}
/deep/.el-form-item {
  margin-bottom: 0px;
}
.pdf {
  width: 916px;
}
.make-writ-dialog {
  /deep/ .el-dialog {
    width: 700px;
  }
}
.special-style {
  /deep/ .el-row .el-col .el-form-item .el-form-item__content {
    margin-left: 0 !important;
  }
}

/deep/.el-select {
  width: 100%;
  // width: 40.5%;
}
.el-textarea {
  padding-bottom: 5px;
}
</style>
