<template>
  <!-- 一般行政处罚新增  -->
  <div class="special-penalty_button">
    <div class="content">
      <div @click="backPage" class="back-button"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="flex justify-content-space-between top-pading">
        <div class="content-list">
          <el-form label-position="left" label-width="110px" :model="entity" :rules="rules" ref="ruleForm" :show-message="false">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="caseReasonNames">
                  <div slot="label" class="slot_label">案由</div>
                  <el-input v-model="entity.caseReasonNames" placeholder="请选择案由" style="width:100%" readonly :disabled="isDetail" @focus="handleCause">
                    <i class="el-icon-more" v-if="!isDetail" slot="suffix" @click="handleCause"></i>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="文书号：" prop="writNo">
                  <div slot="label" class="slot_label">文书号</div>
                  <el-input v-model="entity.writNo" placeholder="自动分配" style="width:100%" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="objectType">
                  <div slot="label" class="slot_label">责任主体</div>
                  <el-select v-model="entity.objectType" placeholder="请选择责任主体" @change="selectChange()" :disabled="isDetail">
                    <el-option label="单位" value="0"></el-option>
                    <el-option label="个人" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="entity.objectType == '0'">
                <el-form-item prop="punishCompanyName">
                  <div slot="label" class="slot_label">当事人</div>
                  <div>
                    <el-input @focus="handleCom" v-model="entity.punishCompanyName" placeholder="请选择当事人" readonly :disabled="isDetail">
                      <i class="el-icon-more" slot="suffix" @click="handleCom" v-if="!isDetail"></i>
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20" v-if="entity.objectType == '1'">
              <el-col :span="12">
                <el-form-item prop="punishPersonName">
                  <div slot="label" class="slot_label">当事人</div>
                  <el-input v-model="entity.punishPersonName" placeholder="请输入当事人" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="idCard">
                  <div slot="label" class="slot_label">身份证号码</div>
                  <el-input v-model="entity.idCard" placeholder="请输入身份证号码" maxlength="18" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="sex">
                  <div slot="label" class="slot_label">性别</div>
                  <el-select v-model="entity.sex" placeholder="请选择性别" :disabled="isDetail">
                    <el-option label="男" value="0"></el-option>
                    <el-option label="女" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="age">
                  <div slot="label" class="slot_label">年龄</div>
                  <el-input v-model="entity.age" placeholder="请输入当事人年龄" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item prop="telphone">
                  <div slot="label" class="slot_label">当事人电话</div>
                  <el-input v-model="entity.telphone" placeholder="请输入电话号码" maxlength="12" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="currentCompany">
                  <div slot="label" class="slot_label">单位名称</div>
                  <el-input v-model="entity.currentCompany" placeholder="请输入单位名称" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="birthday">
                  <div slot="label" class="slot_label">出生年月</div>
                  <el-date-picker
                    v-model="entity.birthday"
                    type="date"
                    placeholder="选择出生年月时间"
                    format="yyyy/MM/dd"
                    :disabled="isDetail"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="currentCompanyAddress">
                  <div slot="label" class="slot_label">单位地址</div>
                  <el-input v-model="entity.currentCompanyAddress" placeholder="请输入单位地址" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="caseSourceId">
                  <div slot="label" class="slot_label">案件来源</div>
                  <el-select @change="changeCaseSource" v-model="entity.caseSourceId" placeholder="请选择案件来源" :disabled="isDetail">
                    <el-option v-for="item in sourceList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="examineTime">
                  <div slot="label" class="slot_label">检查时间</div>
                  <el-date-picker
                    v-model.trim="entity.examineTime"
                    type="datetime"
                    placeholder="选择检查时间"
                    format="yyyy/MM/dd HH:mm"
                    :disabled="isDetail"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="height:54px;">
              <el-col :span="24">
                <el-form-item prop="caseName">
                  <div slot="label" class="slot_label">案件名称</div>
                  <el-input
                    class="case_name_area"
                    :autosize="{ minRows: 1, maxRows: 2 }"
                    v-model.trim="entity.caseName"
                    placeholder="请输入案件名称"
                    :clearable="true"
                    :disabled="isDetail"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="objectAddress">
                  <div slot="label" class="slot_label">详细地址</div>
                  <el-input v-model.trim="entity.objectAddress" placeholder="请输入详细地址" :disabled="isDetail" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="telphone">
                  <div slot="label" class="slot_label">电话号码</div>
                  <el-input v-model.trim="entity.telphone" placeholder="请输入电话号码" maxlength="12" :disabled="isDetail" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="udtNames">
                  <div slot="label" class="slot_label">承办人</div>
                  <div>
                    <el-input @focus="handleContractor" v-model="entity.udtNames" placeholder="请选择承办人" readonly clearable :disabled="isDetail">
                      <i class="el-icon-more" slot="suffix" @click="handleContractor"></i>
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="postCode">
                  <div slot="label" class="slot_label">邮政编码</div>
                  <el-input v-model.trim="entity.postCode" placeholder="请输入邮政编码" maxlength="6" :disabled="isDetail" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item prop="caseSituation">
                  <div slot="label" class="slot_label">案件情况</div>
                  <el-input
                    v-model.trim="entity.caseSituation"
                    placeholder="简述案件情况"
                    clearable
                    :disabled="isDetail"
                    maxlength="2000"
                    type="textarea"
                    :autosize="{ minRows: 1 }"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="el-row-1 example" v-show="!isDetail">
              <div>
                <span style="color: #0099ff;cursor:pointer;position: absolute;bottom: -10px;right: 9px;" @click="handleExample">（示例）</span>
              </div>
            </el-row>

            <el-row>
              <el-form-item prop="suggestion">
                  <div slot="label" class="slot_label">承办人意见</div>
                <el-input
                  v-model.trim="entity.suggestion"
                  placeholder="请输入承办人意见"
                  :clearable="true"
                  :disabled="isDetail"
                  maxlength="2000"
                  type="textarea"
                  :autosize="{ minRows: 1 }"
                ></el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </div>
      <violation :blcCache="blcCache" :isDetail="isDetail" @afterHan="selectVio"></violation>
      <section class="new proof-list">
        <div v-for="(item, index) in proofList" :key="index" class="proof">
          <down-proof v-if="!!item" :type="'newRegister'" :proof="item" :canDel="isDetail ? false : true" @afterDel="afterDelProof"></down-proof>
        </div>
        <div class="upload-proof">
          <upload-proof :uploadType="'newRegister'" v-if="!isDetail" @afterDel="afterDelProof" @getUploadMsg="afterUpload"></upload-proof>
        </div>
      </section>
      <!-- <div >
          <el-button size="mini" @click="close">关闭</el-button>
      </div>-->
      <el-dialog title="选择企业" width="990px" height="570px" :before-close="handleCom" :visible.sync="showComList">
        <select-com :closeOrgDialog="handleCom" @getCom="getSelectedCom"></select-com>
      </el-dialog>
      <el-dialog title="选择承办人员" width="900px" height="600px" :before-close="handleContractor" :visible.sync="showContractorList" v-if="!isDetail">
        <select-people @getPeople="getSelectedPeople" :peopleCache="peopleCache" :minNum="2"></select-people>
      </el-dialog>
      <el-dialog
        title="查看示例"
        :visible.sync="showExample"
        width="660px"
        height="476px"
        :close-on-click-modal="false"
        :before-close="handleExample"
        class="exampleStyle"
      >
        <span>
          <check-example :type="'penalty'" @setExampleVal="setExampleVal" @handleExample="handleExample"></check-example>
        </span>
      </el-dialog>
      <el-dialog title="选择案由" width="660px" :before-close="handleCause" :visible.sync="showCauseList">
        <!-- 中间内容部分 -->
        <select-cause :closeOrgDialog="handleCause" @getCause="getSelectedCause"></select-cause>
      </el-dialog>

      <el-dialog title="选择审核人员" width="900px" height="600px" :visible.sync="isAuditorVisible">
        <select-people v-on:getPeople="submitToAudition" :selectNum="1"></select-people>
      </el-dialog>
    </div>
    <!-- <div class="copyright">Copyright © 2019 All Rights Reserved</div> -->

    <show-pdf
      v-if="showPdfDialog"
      :pdfId="visibleWritId"
      @closePdf="closePdf"
      @updatePdf="closePdf"
      @auditPdf="auditFromPdf"
      :buttonList="{
        updatePdf: true, // 回退编辑
        signPdf: true, // 签名
        auditPdf: true, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      }"
      :writName="'立案审批表'"
    ></show-pdf>
    <bottom-bar v-if="!isDetail">
      <el-button @click="backPage">取消</el-button>
      <el-button type="primary" @click="save" :disabled="!isSaveAllowed">保存</el-button>
      <el-button type="primary" @click="createWrit" :disabled="!isCreateAllowed">生成立案审批表文书</el-button>
      <el-button type="primary" @click="goToAudition" :disabled="!isAuditAllowed || isPenaltyInfoUpdated">提交审核</el-button>
    </bottom-bar>

    <bottom-bar v-if="isDetail">
      <el-button @click="backPage" class="closeButton">返回</el-button>
    </bottom-bar>
  </div>
</template>

<script>
import uploadProof from '../../../components/uploadProof/index'
import downProof from '@components/downProof/index'
import baseUrl from '@/utils/webIp'
import buttonGroup from '@/components/buttonGroup/index'
import violation from './component/violation'
import bottomBar from '@/components/bottomBar'
import selectCom from '../../onSiteInspection/newInspection/component/selectCom' // 选择企业名称
import selectPeople from '../../onSiteInspection/newInspection/component/selectPeople' // 选择承办人员
import checkExample from '@/components/selectExample' // 查看示例
import selectCause from './component/selectCause'
import { getWritParams, dateFormat, getNowFormatDate, debounce, getFirstErrMsg, GetAge, GetSex, GetBirthday } from '@/utils/util'
import { sealAuditStatus, sealAudit } from '@api/common'
import { getKindled, handleWritStatus } from '@/utils/audit'
import { getEnterpriseInfo } from '@/api/inspectionScheme'
import { addFilingRegister, showCaseStatus, updateFilingRegister, getFilingRegister } from '@/api/filingRegister'
import ShowPdf from '@/components/showPdf'
import { createWrit, updateWrit, getWritInfo, queryWritState } from '@api/fileRelated'
import { enterPriseInquireByid } from '@api/ProcessingofInspectionResult'
import { mapState } from 'vuex'

export default {
  name: 'newFilingRegister',
  components: {
    uploadProof,
    downProof,
    bottomBar,
    buttonGroup,
    selectCom,
    selectPeople,
    selectCause,
    checkExample,
    ShowPdf,
    violation
  },
  data() {
    return {
      rules: {
        // writNo: [{ required: true, trigger: 'blur', message: '请选择案由' }],
        caseReasonNames: [{ required: true, trigger: 'blur', message: '请选择案由' }],
        caseSourceId: [{ required: true, trigger: 'blur', message: '请选择案件来源' }],
        examineTime: [{ required: true, trigger: 'blur', message: '请选择检查时间' }],
        caseName: [{ required: true, trigger: 'blur', message: '请输入案件名称' }],
        objectType: [{ required: true, trigger: 'blur', message: '请选择责任主体' }],
        punishPersonName: [{ required: true, trigger: 'blur', message: '请输入当事人' }],
        punishCompanyName: [{ required: true, trigger: 'blur', message: '请选择当事人' }],
        caseSituation: [{ required: true, trigger: 'blur', message: '请简述案件情况' }],
        suggestion: [{ required: true, trigger: 'blur', message: '请输入承办人意见' }],
        udtNames: [{ required: true, trigger: 'blur', message: '请选择承办人' }],
        idCard: [
          { required: true, trigger: ['blur', 'change'], message: '请填写身份证号' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            trigger: ['blur', 'change'],
            message: '您输入的身份证号码格式不正确'
          }
        ],
        objectAddress: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入详细地址'
          }
        ],
        telphone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入电话号码'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        postCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入邮编'
          },
          {
            pattern: /^(0[1234567]|1[012356]|2[01234567]|3[0123456]|4[01234567]|5[1234567]|6[1234567]|7[012345]|8[013456])\d{4}$/,
            trigger: ['blur', 'change'],
            message: '您输入的邮编格式不正确'
          }
        ]
      }, // 业务细则条款列表

      proofList: [], // 证据列表
      visibleWritId: '', // 浏览的文书 id
      showPdfDialog: false, // 浏览文书弹出框
      writId: '', // 立案审批表 id
      isAuditorVisible: false, // 是否可见审核人员弹出框
      isCreateAllowed: false, // 是否可创建文书
      isAuditAllowed: false, // 是否可提交审核
      isSaveAllowed: true, // 是否可修改立案信息
      addReq: {
        blcList: [],
        penaltyUndEntity: {},
        caseSourceName: '',
        caseReasonNames: '',
        punishCompanyName: '',
        udtNames: ''
      },
      blcDetails: [], // 违法记录
      entity: {
        currentCompanyAddress: '',
        accessoryId: '',
        age: '',
        birthday: '',
        caseCrimeTime: '',
        caseEndTime: '',
        caseName: '', // 案件名称
        caseReasonNames: '', // 案由数据
        caseReasonCode: '', // 案由code
        caseSituation: '',
        caseSourceId: '', // 案件来源
        caseStateId: '',
        creatorId: '',
        examineTime: '',
        currentCompany: '',
        executorDeptId: '',
        idCard: '',
        job: '',
        objectAddress: '',
        objectType: '',
        penaltyId: '',
        punishCompanyId: '',
        punishCompanyName: '', // 立案对象公司名字
        punishPersonName: '',
        sex: '',
        suggestion: '',
        telphone: '',
        udtIds: '', // 承办人员id
        udtNames: '', // 承办人名字
        updPersonId: '',
        updTime: '',
        postCode: '', // 邮政编码
        writNo: '' // 文书号
      },
      sourceList: [], // 案件来源列表
      isShow: false,
      invokeCount: 0, // 当修改了立案信息并保存后 blcDetail 监听会被handleDetail及selectVio两个方法触发
      showContractorList: false,
      isDetail: false, // 是否是查看详情
      isUpt: true, // 文书号修改
      task: [], // 立案审批流程 task
      peopleCache: [],
      blcCache: [] // 修改 or 详情的违法行为
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    closePdf() {
      getFilingRegister({
        penalty: this.$store.state.penalty.penaltyUndEntity.penaltyId
      }).then(res => {
        if (res.code === '0') {
          // this.$store.commit('setIsPenaltyInfoUpdated', true)
          this.$store.commit('setPenalty', res.data) // 存储修改后的信息
          this.isCreateAllowed = true
          this.handleDetails() // 以防保存后又删除，获取不到 descretionId
          this.initData()
        }
      })
      this.showPdfDialog = false
    },
    initData() {
      // 判断是否为 查看详情 或 修改
      const _penalty = this.$store.state.penalty
      if (!_penalty) {
        return
      }
      // this.isUpt = true;
      if (_penalty.isDetail) this.isDetail = _penalty.isDetail // 2.是否是查看详情
      // 3.是修改
      // 回显
      let _entity = _penalty.penaltyUndEntity
      for (let field in this.entity) {
        if (field === 'examineTime') {
          // 将String变为Date格式
          this.entity[field] = new Date(_entity[field])
        } else {
          this.entity[field] = _entity[field]
        }
      }
      // 检查结果处理转一般行政处罚企业信息的获取
      if (_entity.sourceId && _entity.punishCompanyId) {
        this.handleComInfo(_entity.punishCompanyId)
      }
      // 承办人员回显值
      this.handlePeopleCache(_penalty.penaltyUndEntity.udtIds, _penalty.udtNames)
      // 初始化违法行为
      this.handleDetails()
      // 初始化附件
      this.initProof()
      // 初始化修改参数
      this.addReq = {
        blcList: [],
        penaltyUndEntity: {},
        caseReasonNames: _penalty.caseReasonNames,
        caseSourceName: _penalty.caseSourceName,
        punishCompanyName: _penalty.punishCompanyName,
        udtNames: _penalty.udtNames
      }
      this.entity.caseReasonNames = _penalty.caseReasonNames
      this.entity.caseSourceName = _penalty.caseSourceName
      this.entity.punishCompanyName = _penalty.punishCompanyName
      this.entity.udtNames = _penalty.udtNames
      // 获取文书信息
      this.initWritInfo()
    },
    // 承办人员回显值
    handlePeopleCache(ids, names) {
      this.peopleCache = []
      const idArr = ids.split(',')
      const nameArr = names.split('，')
      idArr.forEach((id, ind) => {
        this.peopleCache.push({
          id: id,
          nickName: nameArr[ind]
        })
      })
    },
    // 初始化违法行为
    handleDetails(type) {
      this.blcCache = []
      this.blcDetails = this.$store.state.penalty.blcList // 用于 回显
      this.blcDetails.forEach(detail => {
        this.$set(detail, 'showDetail', false)
        this.$set(detail, 'editStatus', false)
        this.$set(detail, 'labelID', detail.discretionId) // 用于修改案件时判断违法行为是否存在
        detail.isOldTips = true
        if (!detail.discretionId) {
          // 自定义项没有discretionId
          detail.isCustom = true
        }
        this.blcCache.push(detail)
        if (detail.children && detail.children.length > 0) {
          detail.children.forEach(child => {
            this.$set(child, 'editStatus', false)
            this.$set(child, 'labelID', child.discretionRulesId) // 用于弹框对子项的回显
            child.isOldTips = true
          })
        }
      })
    },
    // 初始化附件
    initProof() {
      const proofIds = this.$store.state.penalty.penaltyUndEntity.accessoryId
      let proofs = []
      if (!proofIds) return
      proofs = proofIds.split(',')
      this.proofList = []
      proofs.forEach(proof => {
        this.proofList.push({
          accessoryDownUrl: `${baseUrl}/aj/writ/accessory/download?accessoryId=${proof}`, // 附件下载url
          accessoryId: proof, // 附件id
          accessoryName: '', // 附件名字
          accessoryType: '', // 附件类型
          accessoryUrl: `${baseUrl}/aj/writ/accessory/downLoadByImg?accessoryId=${proof}`, // 附件在线显示url
          id: this.$store.state.penalty.penaltyUndEntity.penaltyId // 证据关联的id
        })
      })
    },
    // 上传附件后
    afterUpload(res) {
      const penalty = this.$store.state.penalty
      const typeInd = res.path.lastIndexOf('.')
      this.proofList.push({
        accessoryDownUrl: `${baseUrl}/aj/writ/accessory/download?accessoryId=${res.accessoryId}`, // 附件下载url
        accessoryId: res.accessoryId, // 附件id
        accessoryName: '', // 附件名字
        accessoryType: res.path.slice(typeInd), // 附件类型
        accessoryUrl: `${baseUrl}/aj/writ/accessory/downLoadByImg?accessoryId=${res.accessoryId}`, // 附件在线显示url
        id: penalty ? penalty.penaltyUndEntity.penaltyId : '' // 证据关联的id
      })
    },
    // 删除附件后
    afterDelProof(accessoryId) {
      let delIndex
      this.proofList.forEach((proof, index) => {
        if (proof.accessoryId === accessoryId) {
          delIndex = index
        }
      })
      this.proofList.splice(delIndex, 1)
    },
    // 获得 accessoryId
    getAccessory() {
      const _idArr = []
      this.proofList.forEach(proof => {
        _idArr.push(proof.accessoryId)
      })
      return _idArr.join(',')
    },
    // 获取立案审批流程任务
    getTask() {
      this.task = this.$store.state.processes.get('LASP') ? JSON.parse(this.$store.state.processes.get('LASP')) : []
    },
    // 切换单位和个人
    selectChange() {
      if (this.entity.objectType == 0) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    // 返回
    backPage() {
      const from = this.$store.state.from
      if (!from) {
        // 从列表而来
        this.$store.commit('setCurrentComponent', 'generalPenalties')
      } else {
        // 从立案审批处来
        this.$store.commit('setCurrentComponent', 'newHandle')
        this.$store.commit('updateFrom', null)
      }
      this.$store.state.penalty.isDetail = false
    },
    // 案由
    handleCause() {
      if (this.isDetail) return
      this.$store.commit('setCauseDialog')
    },
    // 处理选择案由后
    getSelectedCause(causes) {
      this.addReq.caseReasonNames = ''
      this.entity.caseReasonNames = ''
      this.entity.caseReasonCode = ''
      causes.forEach(cause => {
        this.addReq.caseReasonNames += cause.value + '、'
        this.entity.caseReasonNames += cause.value + '、'
        this.entity.caseReasonCode += cause.code + ','
      })
      this.addReq.caseReasonNames = this.addReq.caseReasonNames.slice(0, -1)
      this.entity.caseReasonNames = this.entity.caseReasonNames.slice(0, -1)
      this.entity.caseReasonCode = this.entity.caseReasonCode.slice(0, -1)
      if (this.entity.caseReasonNames) {
        this.$refs.ruleForm.clearValidate('caseReasonNames')
      }
    },
    // 企业名称
    handleCom() {
      if (this.isDetail) return
      this.$store.commit('setComDialog')
    },
    // 检查结果处理转一般行政处罚
    handleComInfo(id) {
      const _penalty = this.$store.state.penalty
      getEnterpriseInfo({
        id: id
      }).then(res => {
        this.entity.postCode = _penalty.penaltyUndEntity.postCode ? _penalty.penaltyUndEntity.postCode : res.data.postalCode // 邮编
        this.entity.objectAddress = _penalty.penaltyUndEntity.objectAddress ? _penalty.penaltyUndEntity.objectAddress : res.data.businessAddress // 地址
        this.entity.telphone = _penalty.penaltyUndEntity.telphone ? _penalty.penaltyUndEntity.telphone : res.data.contactPhone // 联系方式
      })
    },
    // 处理处罚企业字段
    getSelectedCom(org) {
      this.entity.punishCompanyId = org.id // 企业 id
      this.addReq.punishCompanyName = org.companyName // 企业名
      this.entity.punishCompanyName = org.companyName
      this.entity.postCode = org.postalCode ? org.postalCode : '暂无' // 邮编
      this.entity.objectAddress = org.businessAddress // 地址
        ? org.businessAddress
        : '暂无'
      this.entity.telphone = org.contactPhone ? org.contactPhone : '暂无' // 联系方式
      if (this.entity.punishCompanyName) {
        // 校验
        this.$refs.ruleForm.clearValidate('punishCompanyName')
      }
    },
    // 承办人员
    handleContractor() {
      this.showContractorList = !this.showContractorList
    },
    // 处理承办人员字段
    getSelectedPeople(state, val) {
      // this.peopleCache = val
      if (state) {
        const nameList = []
        const idList = []
        val.forEach(item => {
          nameList.push(item.nickName)
          idList.push(item.id)
        })
        this.addReq.udtNames = nameList.join(',')
        this.entity.udtNames = nameList.join(',')
        this.entity.udtIds = idList.join(',')
        let ids = idList.join(',')
        let names = nameList.join('，')
        this.handlePeopleCache(ids, names)
        this.handleContractor()
      } else {
        this.handleContractor()
      }
      if (this.entity.udtNames) {
        this.$refs.ruleForm.clearValidate('udtNames')
      }
    },
    beforeExmClose() {
      console.info('showExample', this.showExample)
    },
    // 查看示例
    handleExample() {
      this.$store.commit('setExampleDialog')
    },
    // 查看示例回调
    setExampleVal(val) {
      this.entity.caseSituation = val
    },
    // 立案登记生成 or 修改
    save() {
      if (typeof this.entity.examineTime === 'object') {
        this.entity.examineTime = dateFormat(this.entity.examineTime, 'yyyy-mm-dd HH:MM:ss')
      } else if (this.entity.examineTime) {
        this.entity.examineTime = this.entity.examineTime.split(' ')[0].replace(/\//g, '-') + ' 00:00:00'
      }
      this.blcDetails = this.blcDetails.filter(blc => {
        return blc.actName
      })
      if (!this.blcDetails || this.blcDetails.length == 0) {
        this.$message({
          type: 'error',
          message: '请添加违法行为！'
        })
        return
      }
      this.$refs.ruleForm.validate((valid, errInfo) => {
        if (valid) {
          this.addReq.blcList = this.blcDetails
          this.entity.accessoryId = this.getAccessory()
          this.entity.updTime = null
          this.addReq.penaltyUndEntity = this.entity
          if (this.$store.state.penalty) {
            // 修改
            updateFilingRegister(this.addReq).then(res => {
              if (res.code === '0') {
                let msg = this.writId ? '保存成功，请重新制作立案审批表！' : '保存成功，请制作立案审批表！'
                this.$message({
                  type: 'success',
                  message: msg
                })
                this.$store.commit('setIsPenaltyInfoUpdated', true)
                this.$store.commit('setPenalty', res.data) // 存储修改后的信息
                this.isCreateAllowed = true
                this.invokeCount = 0
                this.handleDetails() // 以防保存后又删除，获取不到 descretionId
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失敗！'
                })
              }
            })
          } else {
            // 新建
            addFilingRegister(this.addReq)
              .then(async res => {
                this.$message({
                  type: 'success',
                  message: '保存成功，请制作立案审批表！'
                })
                // this.isUpt = true
                this.$store.commit('setPenalty', res.data) // 存储修改后的信息
                // 新增立案成功后 要获取当前立案审批的 taskId, 以防提交审核审批要用
                this.addReq.penaltyUndEntity.penaltyId = res.data.penaltyUndEntity.penaltyId
                await getKindled(this.addReq.penaltyUndEntity, res.data.penaltyUndEntity.penaltyId)
                this.isCreateAllowed = true
                this.invokeCount = 0
                this.handleDetails() // 以防保存后又删除，获取不到 descretionId
              })
              .catch(err => {
                this.$message({
                  type: 'error',
                  message: '保存失敗'
                })
              })
          }
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    // 展示案件状态
    getShowCaseStatus() {
      const sourceReq = {
        delFlag: '0',
        type: 'case_origin'
      }
      showCaseStatus(sourceReq)
        .then(res => {
          this.sourceList = res.page.list
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择案件来源
    changeCaseSource(data) {
      this.sourceList.forEach(source => {
        if (source.id === data) {
          this.addReq.caseSourceName = source.value
          this.entity.caseSourceName = source.value
        }
      })
    },
    // 选择违法行为
    selectVio(arr) {
      this.blcDetails = arr
    } /* 有关文书 */,
    // 获取立案审批表文书
    initWritInfo() {
      const infoReq = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: 'LASPB'
      }
      getWritInfo(infoReq) // 获取文书 并 判断是否存在
        .then(data => {
          if (data.code == 0) {
            this.writId = data.data[0] ? data.data[0].writId : ''
            this.initButtons()
          }
        })
        .catch(err => console.info(err))
    },
    // 提交审核弹出框
    goToAudition() {
      queryWritState({ writId: this.writId }).then(res => {
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
    // 提交审核审批
    submitToAudition(bool, auditor) {
      const user = JSON.parse(localStorage.getItem('res'))
      this.isAuditorVisible = false
      if (!bool) return
      // 获取立案审批 task
      this.getTask()

      const _audiReq = {
        auditTypeCode: 'ta80005',
        handlerDeptId: auditor[0].deptId,
        handlerUserId: auditor[0].id,
        requestDeptName: user.sysDeptEntity.name, // 当前登陆人所在的部门
        requestId: this.writId,
        requestTime: dateFormat(new Date(), 'yyyy年mm月dd日'),
        requestUsersIds: this.entity.udtIds,
        requestUsersName: this.addReq.udtNames,
        submitterCause: this.entity.caseName,
        parentTaskId: this.task[0].taskId, // 流程 taskId
        partyName: this.entity.objectType === '0' ? this.$store.state.penalty.punishCompanyName : this.entity.punishPersonName,
        partyId: this.entity.objectType === '0' ? this.$store.state.penalty.punishCompanyId : ''
      }
      // 调用接口向下走流程
      sealAudit(_audiReq)
        .then(res => {
          this.$store.commit('setCreatedOnceMore', false)
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
          this.initButtons()
        })
        .catch(err => console.info(err))
    },
    // 制作立案审批表文书
    createWrit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let resPerson = ''
          if (this.entity.objectType === '0') {
            const compRes = await enterPriseInquireByid({
              id: this.entity.punishCompanyId
            })
            resPerson = compRes.data.legalPerson ? compRes.data.legalPerson : '暂无'
          } else {
            resPerson = this.entity.punishPersonName
          }
          let _dataFields = getWritParams({
            tag2: this.addReq.caseReasonNames, // 案由
            tag3: this.addReq.caseSourceName, // 案件来源
            tag4: dateFormat(new Date(this.entity.examineTime), 'yyyy年mm月dd日'), // 时间
            tag5: this.entity.caseName, // 案件名称
            tag6: this.entity.objectType === '0' ? this.addReq.punishCompanyName : this.entity.punishPersonName, // 当事人
            tag7: this.entity.telphone, // 电话
            tag8: resPerson, // 法人/负责人
            tag9: this.entity.objectAddress, // 地址
            tag10: this.entity.postCode, // 邮编
            tag11: this.entity.caseSituation, // 案件基本情况
            tag12: this.entity.suggestion // 承办人意见
          })
          const fileCreatedReq = {
            companyId: this.entity.punishCompanyId, //执法检查模块制作文书传company_id
            contractorIds: this.entity.udtIds, // 承办人
            data: _dataFields,
            sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
            writType: 'LASPB'
          }

          // 文书存在 && 已被修改
          if (this.writId) {
            updateWrit({ writId: this.writId, contractorIds: this.entity.udtIds }, fileCreatedReq.data)
              .then(data => {
                this.$store.commit('setIsPenaltyInfoUpdated', false)
                this.$store.commit('setCreatedOnceMore', true)
                this.$message({
                  type: 'success',
                  message: '制作成功！'
                })
                this.preview(this.writId)
              })
              .catch(err => console.info(err))
            return
          }
          // 创建全新文书
          createWrit(fileCreatedReq)
            .then(data => {
              this.$store.commit('setIsPenaltyInfoUpdated', false)
              this.writId = data.writId
              this.$message({
                type: 'success',
                message: '制作成功！'
              })
              this.preview(data.writId)
              this.isAuditAllowed = true
            })
            .catch(err => console.info(err))
        } else {
          this.$message({
            type: 'error',
            message: '还有未填数据，请填写并保存！'
          })
          return
        }
      })
    },
    // 浏览文书
    preview(id) {
      this.showPdfDialog = true
      this.visibleWritId = id
    },
    // 设置按钮状态
    initButtons() {
      const res = handleWritStatus(this.writId)
      res.then(data => {
        if (data) {
          this.isCreateAllowed = data.isCreateAllowed
          this.isAuditAllowed = data.isAuditAllowed
        }
        // 是否能修改立案信息
        if (!data.isAuditAllowed && this.writId) {
          this.isSaveAllowed = false
        }
      })
    },
    // 文书弹框中的提交审核
    auditFromPdf(obj) {
      this.getTask()
      const _penalty = this.$store.state.penalty

      sealAudit({
        auditTypeCode: 'ta80005',
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        parentTaskId: this.task[0].taskId,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name,
        requestUsersIds: this.entity.udtIds,
        requestId: obj.pdfId,
        requestTime: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        requestUsersName: _penalty.udtNames,
        submitterCause: _penalty.penaltyUndEntity.caseName,
        partyName: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName,
        partyId: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
      }).then(res => {
        this.showPdfDialog = false
        this.$store.commit('setCreatedOnceMore', false)
        this.$message({
          type: 'success',
          message: '提交审核成功！'
        })
        this.initButtons()
      })
    },
    // 获取签名状态
    getSignSta(id) {
      // let writId = id ? id : this.writId
      // queryWritState({ writId: writId }).then(res => {
      //   if (res.code === '0') {
      //     this.hasSign = res.data.currUserIdSign
      //   }
      // })
    }
  },
  created() {
    this.save = debounce(this.save)
    this.createWrit = debounce(this.createWrit)
    this.getShowCaseStatus()
  },
  computed: {
    ...mapState(['showComList', 'showCauseList', 'isPenaltyInfoUpdated']),
    showExample: {
      get() {
        return this.$store.state.showExample
      },
      set() {}
    }
  },
  watch: {
    entity: {
      handler: function(nv, ov) {
        this.isCreateAllowed = false
        this.isAuditAllowed = false
      },
      deep: true
    },
    blcDetails: {
      handler: function(nv, ov) {
        /* // 简单粗暴  可以按照你自己的喜好做出相应的更改
        this.$nextTick(() => {
          let checkListContainer = document.querySelector('.main-container')
          checkListContainer.scrollTop = checkListContainer.scrollHeight
        }) */
        this.invokeCount++
        if (this.invokeCount >= 3) {
          /** 数据初始化时 无效的 handleDetails 及 selectVio 两次监听完成后
           * 可真正触发
           */
          if (!this.isDetail && nv.length > ov.length) {
            this.$nextTick(() => {
              let checkListContainer = document.querySelector('.main-container')
              checkListContainer.scrollTop = checkListContainer.scrollHeight
            })
          }
          this.isCreateAllowed = false
          this.isAuditAllowed = false
        }
      },
      deep: true
    },
    'entity.idCard': {
      handler: function(nv, ov) {
        console.info(this.entity.birthday)
        let g = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if (g.test(nv)) {
          this.entity.sex = GetSex(nv) ? '0' : '1'
          this.entity.age = GetAge(nv)
          this.entity.birthday = GetBirthday(nv)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-input.is-disabled .el-input__inner {
  color: #333333 !important;
}
.exampleStyle {
  /deep/ .dialog-footer {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
.el-dialog__wrapper {
  top: -40px;
}
.lian_dialog {
  /deep/ .el-dialog {
    margin-top: 12vh !important;
  }
}
/deep/.el-main.main-container {
  position: relative;
}
.content {
  background: #fff;
  margin: 8px 8px 100px 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 44px 81px 52px;
  border-radius: 8px;
  height: 100%;
  position: relative;
}
.case_name_area {
  margin-top: 0 !important;
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
.font18 {
  width: 87px;
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  // font-family:PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.content-list {
  line-height: 30px;
  padding: 14px 14px 14px 0px;
  color: #333333;
  width: 100%;
}
/deep/.el-col-15 {
  width: 64.6%;
}
/deep/.el-col-2 {
  width: 9%;
}
.el-select {
  width: 100%;
}
.el-row {
  padding-bottom: 2px;
}
.body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.ct {
  padding-right: 320px;
  text-align: center;
}
.copyright {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(187, 187, 187, 1);
  margin-bottom: 58px;
}
/deep/.button {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #fff;
}
/deep/.el-col-1 {
  padding-left: 90px;
  color: #0099ff;
  cursor: pointer;
  width: 13%;
}
/deep/.el-col-4 {
  width: 20%;
  margin-right: 39px;
}
/deep/.el-col-7 {
  width: 36%;
  margin-right: 60px;
}
/deep/.el-col-9 {
  width: 36%;
}
/deep/.el-col-5 {
  width: 21.1%;
}
/deep/.el-row-1 {
  padding-bottom: 0px;
  &.example {
    width: 100px;
  }
}
// [class*='el-col-'] {
//   // height: 38px;
// }
.el-form-item {
  margin-bottom: 0;
}
.dialog-footer {
  .count-text {
    margin-right: 20px;
    .count-num {
      padding: 0 5px;
      color: #0099ff;
    }
  }
}
/deep/.el-date-editor.el-input {
  width: 100%;
}
.proof-list.new {
  display: grid;
  grid: repeat(4, 24%);
  grid-template-columns: repeat(4, 22%);
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  .proof {
    margin: 0 5px 5px 0;
  }
}
// .el-form-item:not(.is-required) {
//   margin-left: 10px;
//   /deep/ .el-form-item__label {
//     width: 100px !important;
//   }
//   /deep/ .el-form-item__content {
//     margin-left: 100px !important;
//   }
// }
// /deep/.el-form-item__error {
//   display: none;
// }
.closeButton {
  text-align: center;
}
.special-penalty_button {
  /deep/ .bottom-button-container {
    width: 100%;
    right: 0;
  }
}
</style>
