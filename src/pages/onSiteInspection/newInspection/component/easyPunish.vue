<template>
  <div>
    <!-- <div class="bar-title" >转简易程序行政处罚</div> -->
    <div class="btnGroup">
      <el-button type="primary" class="el-button-first" @click="addDefenseRecords">
        <span>+ 当事人申辩笔录</span>
      </el-button>
      <el-button type="primary" class="el-button-second" @click="addOnTheSpotDecision">+ 行政（当场）处罚决定书（单位/个人）</el-button>
    </div>
    <!-- dialogFormVisibles = true -->
    <div class="docListWrap" v-loading="loading">
      <div class="check-bac bac" v-if="docCardList.length === 0 && loading === false"></div>
      <div class="writ-list" v-if="docCardList.length > 0">
        <doc-card
          v-for="(item, index) in docCardList"
          :key="index"
          :docData="item"
          :auditInfo="auditInfo"
          v-on="$listeners"
          @afterDelete="getSimpleWritList"
          @afterUpload="getSimpleWritList"
          @modifyWrit="chooseWrit"
          @toSeal="toSeal"
          @toLawSeal="toLawSeal"
          @previewWrit="getWrit"
          @userSign="userSign"
        ></doc-card>
      </div>
    </div>
    <!-- 当事人申辩笔录 -->
    <el-dialog title="当事人陈述申辩笔录" width="70%" height="100%" :visible.sync="dialogFormVisible" :before-close="queryWritList">
      <div class="form-body-center" v-if="dialogFormVisible">
        <div class="easyPunish_form-left">
          <el-form :model="form" ref="form" :rules="formRules" :inline-message="false" :show-message="false">
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
              <el-input v-model="form.caseName" autocomplete="off" placeholder="请输入案件名称" clearable></el-input>
            </el-form-item>
            <el-form-item class="demonstration" label="" prop="time" :label-width="ruleformLabelWidth">
              <div slot="label" class="slot_label">笔录时间</div>
              <el-date-picker v-model="form.time" type="datetimerange" align="left" format="yyyy-MM-dd HH:mm"></el-date-picker>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="place">
              <div slot="label" class="slot_label">笔录地点</div>
              <el-input v-model="form.place" autocomplete="off" placeholder="请输入地点" clearable></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="name">
              <div slot="label" class="slot_label">申辩人</div>
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入申辩人姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="gender">
              <div slot="label" class="slot_label">性别</div>
              <el-select v-model="form.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="form.phone" autocomplete="off" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="workUnit">
              <div slot="label" class="slot_label">工作单位</div>
              <el-input v-model="form.workUnit" autocomplete="off" placeholder="请输入工作单位" clearable></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="address">
              <div slot="label" class="slot_label">联系地址</div>
              <el-input v-model="form.address" autocomplete="off" placeholder="请输入联系地址" clearable></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="post">
              <div slot="label" class="slot_label">职务</div>
              <el-input v-model="form.post" autocomplete="off" placeholder="请输入职务" clearable></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="zipCode">
              <div slot="label" class="slot_label">邮编</div>
              <el-input v-model="form.zipCode" autocomplete="off" placeholder="请输入邮编" maxlength="6" clearable></el-input>
            </el-form-item>
            <el-form-item
              label=""
              :label-width="ruleformLabelWidth"
              prop="executorName
            "
            >
              <div slot="label" class="slot_label">承办人</div>
              <el-input v-model="form.executorName" autocomplete="off" placeholder="请输入承办人" clearable></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="ruleformLabelWidth" prop="userName">
              <div slot="label" class="slot_label">记录人</div>
              <el-input v-model="form.userName" autocomplete="off" placeholder="请输入记录人" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-right">
          <p class="easyPunishRequired">陈述申辩记录：</p>
          <div class="detail_part">
            <el-input type="textarea" placeholder="请输入笔录" v-model="form.desc" autosize class="defenseDetail"></el-input>

          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="queryWritList">取 消</el-button>
        <el-button type="primary" @click="saveAndmakeWriting('form')">保存并生成笔录文书</el-button>
      </div>
    </el-dialog>
    <!-- 处罚决定书 -->
    <el-dialog title="行政（当场）处罚决定书" width="70%" :visible.sync="dialogFormVisibles" :before-close="queryWritList">
      <div class="easyPunish_content" v-if="dialogFormVisibles">
        <div class="easyPunish_content-list">
          <div class="easyPunish_form-left">
            <el-form :model="ruleForm" ref="ruleForm" label-width="120px" :rules="ruleFormRules" :inline-message="false" :show-message="false">
              <el-form-item label="">
              <div slot="label" class="slot_label">责任主体</div>
                <el-radio-group v-model="select">
                  <el-radio label="单位" value="单位" :disabled="unitDisabled"></el-radio>
                  <el-radio label="个人" value="个人" :disabled="personalDisabled"></el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="select === '单位'">
                <el-form-item label="" prop="punishedUnit">
              <div slot="label" class="slot_label">被处罚单位</div>
                  <el-input v-model="ruleForm.punishedUnit" placeholder="请输入被处罚单位" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="address">
              <div slot="label" class="slot_label">单位地址</div>
                  <el-input v-model="ruleForm.address" placeholder="请输入单位地址" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="zipCode">
              <div slot="label" class="slot_label">邮编</div>
                  <el-input v-model="ruleForm.zipCode" placeholder="请输入邮编" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="representative">
              <div slot="label" class="slot_label">法定代表人</div>
                  <el-input v-model="ruleForm.representative" placeholder="请输入法定代表人" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="job">
              <div slot="label" class="slot_label">职务</div>
                  <el-input v-model="ruleForm.job" placeholder="请输入职务" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
                  <el-input v-model="ruleForm.phone" placeholder="请输入联系电话" clearable></el-input>
                </el-form-item>
              </div>

              <div v-if="select === '个人'">
                <el-form-item label="" prop="personName">
              <div slot="label" class="slot_label">责任人</div>
                  <el-input v-model="ruleForm.personName" placeholder="请输入责任人" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="sex">
              <div slot="label" class="slot_label">性别</div>
                  <el-select v-model="ruleForm.sex" placeholder="请选择性别">
                    <el-option value="男"></el-option>
                    <el-option value="女"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" prop="age">
              <div slot="label" class="slot_label">年龄</div>
                  <el-input v-model="ruleForm.age" placeholder="请输入年龄" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="idCard">
              <div slot="label" class="slot_label">身份证</div>
                  <el-input v-model="ruleForm.idCard" placeholder="请输入身份证" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="job">
              <div slot="label" class="slot_label">职务</div>
                  <el-input v-model="ruleForm.job" placeholder="请输入职务" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="homeAddress">
              <div slot="label" class="slot_label">家庭住址</div>
                  <el-input v-model="ruleForm.homeAddress" placeholder="请输入家庭住址" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="companyName">
              <div slot="label" class="slot_label">所在单位</div>
                  <el-input v-model="ruleForm.companyName" placeholder="请输入所在单位" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="unitAddress">
              <div slot="label" class="slot_label">单位地址</div>
                  <el-input v-model="ruleForm.unitAddress" placeholder="请输入单位地址" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="contactNumber">
              <div slot="label" class="slot_label">联系电话</div>
                  <el-input v-model="ruleForm.contactNumber" placeholder="请输入联系电话" clearable></el-input>
                </el-form-item>
              </div>

              <el-form-item label="" prop="region">
              <div slot="label" class="slot_label">处罚决定</div>
                <el-select v-model="ruleForm.region" placeholder="请输入处罚决定" @change="selectChange">
                  <!-- <el-option label="罚款" value="罚款"></el-option>
                  <el-option label="警告" value="警告"></el-option>-->
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="isShow">
                <el-form-item label="" prop="decision">
              <div slot="label" class="slot_label">当场缴纳</div>
                  <el-radio-group v-model="ruleForm.decision">
                    <el-radio :label="1" value="是">是</el-radio>
                    <el-radio :label="2" value="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="number">
              <div slot="label" class="slot_label">罚款金额</div>
                  <el-input v-model="ruleForm.number" placeholder="请输入罚款金额" clearable>
                    <span slot="prefix" class="money_prefix">¥</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="" prop="bank">
              <div slot="label" class="slot_label">缴纳银行</div>
                  <el-input v-model="ruleForm.bank" placeholder="请输入缴纳银行" clearable></el-input>
                </el-form-item>
                <el-form-item label="" prop="bankAccount">
              <div slot="label" class="slot_label">银行账号</div>
                  <el-input v-model="ruleForm.bankAccount" placeholder="请输入银行账号" clearable></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="form-right">
            <div class="lawWrap">
              <span class="easyPunishRequired">违法事实及依据：</span>
              <textarea class="input-right" v-model="ruleForm.descA"></textarea>
            </div>
            <div class="lawWrap">
              <span class="easyPunishRequired">法律法规：</span>
              <textarea v-model="ruleForm.descB" class="input-right" />
            </div>
            <div class="lawWrap">
              <span class="easyPunishRequired">处罚依据：</span>
              <textarea class="input-right" v-model="ruleForm.descC"></textarea>
            </div>
          </div>
        </div>

        <div slot="footer" class="dialog-footer" style="padding-top:10px;padding-bottom:10px;padding-right:10px;border-top:1px solid #ccc">
          <el-button @click="queryWritList">取 消</el-button>
          <el-button type="primary" @click="makePunishWrit('ruleForm')">保存并制作处罚决定书</el-button>
        </div>
      </div>
    </el-dialog>
    <show-pdf
      :pdfId="pdfId"
      v-if="dialogContent === 'showPdf'"
      @closePdf="queryWritList"
      :writName="writName"
      :buttonList="writBtnList"
      @sealPdf="submitSeal"
      @updatePdf="updatePdf"
    ></show-pdf>
    <el-dialog width="900px" height="600px" :visible.sync="showPdfDialog" :before-close="queryWritList" title="选择盖章人员">
      <select-people v-if="dialogContent === 'selectPeople' && showPdfDialog" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
  </div>
</template>

<script>
import snPageBar from '@/components/snPageBar/index'
import { makeDisposalDocument, enterPriseInquireByid, simpleDocumentList } from '@api/ProcessingofInspectionResult'
import { mapState } from 'vuex'
import { sealAudit } from '@api/common'
import { dateFormat, getWritParams, debounce, toSuperMoney, toCommonMoney, getFirstErrMsg,reflectEntity } from '@/utils/util'
import showPdf from '@/components/showPdf/index'
import docCard from '@components/docCard/index'
import buttonGroup from '@components/buttonGroup/index'
import selectPeople from './selectPeople'
import { getWritDataByWritId, updateWrit } from '@/api/fileRelated.js'
import Bus from '@/bus'

export default {
  data() {
    return {
      options: [
        {
          value: '警告',
          label: '警告'
        },
        {
          value: '罚款',
          label: '罚款'
        }
      ],
      unitDisabled: false,
      personalDisabled: false,
      loading: true,
      // 当事人申辩笔录
      flagEnter: false,
      //当事人申辩记录表格数据
      defenseRecordList: [
        {
          question: '', //问
          answer: '' //答
        }
      ],
      // colorFlag:false,
      showPdfDialog: false,
      writName: '',
      pdfId: '',
      userInfo: '',
      dialogFormVisible: false,
      value: '',
      form: {
        time: [new Date(), new Date(new Date().getTime() + 60 * 120 * 1000)], //笔录时间
        caseName: '',
        place: '',
        name: '',
        gender: '',
        workUnit: '',
        phone: '',
        address: '',
        post: '',
        zipCode: '',
        executorName: '',
        userName: '',
        desc: '',

        contractor: '',
        noteTaker: ''
      },
      formRules: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        time: [{ required: true, message: '请选择笔录时间', trigger: 'change' }],
        place: [{ required: true, message: '请输入笔录地点', trigger: 'blur' }],
        name: [{ required: true, message: '请输入申辩人', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phone: [
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
        workUnit: [{ required: true, message: '请输入工作单位', trigger: 'blur' }],
        address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
        post: [{ required: true, message: '请输入职务：', trigger: 'blur' }],
        zipCode: [
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
        ],
        executorName: [{ required: true, message: '请输入承办人', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入记录人', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入陈述申辩记录', trigger: 'blur' }]
      },
      ruleformLabelWidth: '105px',
      // 处罚决定书(单位/个人)
      dialogFormVisibles: false,
      ruleForm: {
        address: '',
        zipCode: '',
        representative: '',
        job: '',
        phone: '',
        region: '',
        decision: 1, //1 是 2否
        RMB: '人民币',
        number: '',
        punishedUnit: '', //被处罚单位
        companyName: '',
        bank: '',
        bankAccount: '',

        personName: '',
        sex: '',
        age: '',
        idCard: '',
        homeAddress: '',
        unitAddress: '',
        contactNumber: '',

        descA: '',
        descB: '',
        descC: ''
      },
      ruleFormRules: {
        punishedUnit: [{ required: true, message: '请输入被处罚单位', trigger: 'blur' }],
        address: [{ required: true, message: '请输入单位地址', trigger: 'blur' }],
        zipCode: [
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
        ],
        representative: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
        job: [{ required: true, message: '请输入职务', trigger: 'blur' }],
        phone: [
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
        personName: [{ required: true, message: '请输入责任人', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        idCard: [
          { required: true, trigger: ['blur', 'change'], message: '请填写身份证号' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            trigger: ['blur', 'change'],
            message: '您输入的身份证号码格式不正确'
          }
        ],
        homeAddress: [{ required: true, message: '请输入家庭住址', trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入所在单位', trigger: 'blur' }],
        unitAddress: [{ required: true, message: '请输入单位地址', trigger: 'blur' }],
        contactNumber: [
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
        region: [{ required: true, message: '请输入处罚决定', trigger: 'blur' }],
        decision: [{ required: true, message: '请选择是否当场缴纳', trigger: 'change' }],
        number: [{ required: true, message: '请输入罚款金额', trigger: 'change' }],
        bank: [{ required: true, message: '请输入缴纳银行', trigger: 'change' }],
        bankAccount: [{ required: true, message: '请输入银行账号', trigger: 'change' }]
      },
      // gotActsFromCheckAgain: [], //从简易程序行政处罚点击处置传过来的
      // 违法事实及依据
      illegalFactsAndBasisArr: [],
      illegalFactsAndBasis: '',
      // 法律法规
      lawsAndRegulationsArr: [],
      lawsAndRegulations: '',
      // 处罚依据
      punishmentBasisArr: [],
      punishmentBasis: '',
      isShow: false,
      select: '单位',
      docCardList: [],
      buttonList: [
        {
          name: '关闭',
          type: '',
          disable: false,
          fun: this.close
        }
      ],
      audiReq: null,
      dialogContent: null,
      dialogTitle: null,
      auditInfo: null,
      isUpdate: false,
      updateWritId: null,
      writBtnList: {}
    }
  },
  props: {
    // 简易程序行政处罚id
    sourceId: {
      type: String,
      required: true
    },
    headerInfo: {
      type: Object,
      required: true
    },
    selectedTips: {
      type: Array,
      required: false
    }
  },
  created() {
    // console.info("easy punish",this.actsFromCheckAgain)
    this.userInfo = JSON.parse(localStorage.getItem('res'))
    console.log(this.userInfo)
    this.auditInfo = {
      requestUsersName: this.headerInfo.people,
      caseName: this.headerInfo.company.companyName
    }
    this.initenterPriseInquireByid()
    this.getSimpleWritList()
    this.form.caseName = this.headerInfo.company.companyName //案件名称
    this.form.executorName = this.headerInfo.people.replace(/，/g, '、') //承办人
    this.form.workUnit = this.headerInfo.company.companyName //工作单位
    this.form.userName = this.userInfo.userEntity.nickName //记录人
    this.ruleForm.bank = this.userInfo.sysDeptEntity.bank
    this.ruleForm.bankAccount = this.userInfo.sysDeptEntity.bankAccount
    this.ruleForm.punishedUnit = this.headerInfo.company.companyName //被处罚单位
    this.ruleForm.companyName = this.headerInfo.company.companyName //所在单位
    this.saveAndmakeWriting = debounce(this.saveAndmakeWriting, 2000)
    this.makePunishWrit = debounce(this.makePunishWrit, 2000)
    // 取违法行为
    //箭头函数内部不会产生新的this，这边如果不用=>,this指代实例
    //   console.log(
    //   "别处传过来的违法信息需要数组",
    //   this.actsFromCheckAgain
    // );
    // this.gotActsFromCheckAgain = this.actsFromCheckAgain;
    this.actsFromCheckAgain.forEach(item => {
      // this.illegalFactsAndBasisArr.push(
      //   item.unlawfulAct + item.penalizeBasisRule
      // );
      // this.lawsAndRegulationsArr.push(
      //   item.lawProvisionRule + item.lawProvisionsContent
      // );
      // this.punishmentBasisArr.push(item.penalizeBasisContent);
      if (item.unlawfulAct && item.penalizeBasisRule !== null) {
        this.illegalFactsAndBasisArr.push(item.unlawfulAct + item.penalizeBasisRule)
        for (let i = 0; i < this.illegalFactsAndBasisArr.length; i++) {
          this.illegalFactsAndBasis += this.illegalFactsAndBasisArr[i]
        }
      }
      if (item.lawProvisionRule && item.lawProvisionsContent !== null) {
        this.lawsAndRegulationsArr.push(item.lawProvisionRule + item.lawProvisionsContent)
        for (let i = 0; i < this.lawsAndRegulationsArr.length; i++) {
          this.lawsAndRegulations += this.lawsAndRegulationsArr[i]
        }
      }
      if (item.penalizeBasisContent !== null) {
        this.punishmentBasisArr.push(item.penalizeBasisContent)
        for (let i = 0; i < this.punishmentBasisArr.length; i++) {
          this.punishmentBasis += this.punishmentBasisArr[i]
        }
      }
    })
    // Bus.$on("actsFromCheckAgain", actsFromCheckAgain => {
    //   this.gotActsFromCheckAgain = actsFromCheckAgain;
    //   // 遍历
    //   this.gotActsFromCheckAgain.forEach(item => {
    //     this.illegalFactsAndBasisArr.push(
    //       item.unlawfulAct + item.penalizeBasisRule
    //     );
    //     this.lawsAndRegulationsArr.push(
    //       item.lawProvisionRule + item.lawProvisionsContent
    //     );
    //     this.punishmentBasisArr.push(item.penalizeBasisContent);
    //     console.info(
    //       this.illegalFactsAndBasisArr,
    //       this.lawsAndRegulationsArr,
    //       this.punishmentBasisArr
    //     );
    //     /*     if (item.unlawfulAct && item.penalizeBasisRule !== null) {
    //       this.illegalFactsAndBasisArr.push(
    //         item.unlawfulAct + item.penalizeBasisRule
    //       );
    //     }
    //     if (item.lawProvisionRule && item.lawProvisionsContent !== null) {
    //       this.lawsAndRegulationsArr.push(
    //         item.lawProvisionRule + item.lawProvisionsContent
    //       );
    //     }
    //     if (item.penalizeBasisContent !== null) {
    //       this.punishmentBasisArr.push(item.penalizeBasisContent);
    //     } */
    //     for (let i = 0; i < this.punishmentBasisArr.length; i++) {
    //       this.punishmentBasis += this.punishmentBasisArr[i];
    //     }
    //     for (let i = 0; i < this.illegalFactsAndBasisArr.length; i++) {
    //       this.illegalFactsAndBasis += this.illegalFactsAndBasisArr[i];
    //     }
    //     for (let i = 0; i < this.lawsAndRegulationsArr.length; i++) {
    //       this.lawsAndRegulations += this.lawsAndRegulationsArr[i];
    //     }
    //   });
    // });
  },
  components: {
    snPageBar,
    showPdf,
    docCard,
    buttonGroup,
    selectPeople
  },
  methods: {
    toLawSeal(info) {
      this.dialogContent = 'showPdf'
      this.writName = info.title
      this.pdfId = info.id
      this.buttonList = {
        closePdf: true
      }
    },
    // 新增当事人申辩记录
    addDefenseRecords() {
      ;(this.defenseRecordList = [
        {
          question: '', //问
          answer: '' //答
        }
      ]),
        (this.dialogFormVisible = true)
    },
    // 当事人申辩问答
    // 新增
    addDetail() {
      // console.log("触发新增了");
      this.defenseRecordList.push({
        question: '', //问
        answer: '' //答
      })
    },
    handleInfo() {
      let arr = this.defenseRecordList.reduce((total, item, index) => {
        total.push({
          tagName: `entity${index + 1}-col1`,
          tagContent: item.question
        })
        total.push({
          tagName: `entity${index + 1}-col2`,
          tagContent: item.answer
        })
        return total
      }, [])
      // console.log("arr", arr);
      return arr
    },
    // 删除
    // 删除申辩回答记录
    deleteRule(ind) {
      if (this.defenseRecordList.length == 1) {
        this.$message.error('请保证至少有一条申辩记录')
      } else {
        this.defenseRecordList.splice(ind, 1)
      }
    },
    // 切换处罚
    selectChange() {
      if (this.ruleForm.region == '罚款') {
        this.isShow = true
        this.ruleForm.decision = 1
      } else {
        this.isShow = false
      }
    },
    // 新增当场处罚决定书
    addOnTheSpotDecision() {
      this.unitDisabled = false
      this.personalDisabled = false
      // 从列表详情点击处置传过来的id 违法行为
      // console.log(this.actsFromCheckAgain, "ahahahah");
      if (this.actsFromCheckAgain) {
        this.ruleForm.descA = this.illegalFactsAndBasis
        this.ruleForm.descB = this.lawsAndRegulations
        this.ruleForm.descC = this.punishmentBasis
        this.dialogFormVisibles = true
      }
    },
    toSeal(audiReq) {
      this.audiReq = audiReq
      this.showPdfDialog = true
      this.dialogContent = 'selectPeople'
      this.dialogTitle = '选择审核人员'
    },
    submitSeal(value) {
      let data = {
        auditTypeCode: 'ta80040',
        handlerDeptId: value.deptId,
        handlerUserId: value.peopleId,
        requestDeptName: this.headerInfo.dept.name,
        requestId: value.pdfId,
        requestTime:
          this.headerInfo.time instanceof Array
            ? dateFormat(this.headerInfo.time[0], 'yyyy年mm月dd日')
            : this.headerInfo.time.replace('-', '年').replace('-', '月') + '日',
        requestUsersName: this.headerInfo.people,
        submitterCause: this.headerInfo.company.companyName,
        requestUsersIds: this.headerInfo.peopleId,
        partyName: this.headerInfo.company.companyName,
        partyId: this.headerInfo.company.id
      }
      // console.log("选择审核人员data", data);
      sealAudit(data).then(
        () => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.showPdfDialog = false
          this.dialogContent = null
          this.getSimpleWritList()
        },
        err => {
          console.log('提交审核失败', err)
          this.$message({
            type: 'error',
            message: '提交审核失败'
          })
        }
      )
    },
    submitToAudition(bool, auditor) {
      // console.log("选择审核人员", bool);
      // console.log("选择审核人员", auditor);
      if (bool) {
        let data = {
          auditTypeCode: this.audiReq.auditTypeCode,
          handlerDeptId: auditor[0].deptId,
          handlerUserId: auditor[0].id,
          requestDeptName: this.headerInfo.dept.name,
          requestId: this.audiReq.requestId,
          requestTime:
            this.headerInfo.time instanceof Array
              ? dateFormat(this.headerInfo.time[0], 'yyyy年mm月dd日')
              : this.headerInfo.time.replace('-', '年').replace('-', '月') + '日',
          requestUsersName: this.audiReq.requestUsersName,
          submitterCause: this.audiReq.submitterCause,
          requestUsersIds: this.headerInfo.peopleId,
          partyName: this.headerInfo.company.companyName,
          partyId: this.headerInfo.company.id
        }
        // console.log("选择审核人员data", data);
        sealAudit(data).then(
          () => {
            this.$message({
              type: 'success',
              message: '提交审核成功！'
            })
            this.showPdfDialog = false
            this.dialogContent = null
            this.getSimpleWritList()
          },
          err => {
            console.log('提交审核失败', err)
            this.$message({
              type: 'error',
              message: '提交审核失败'
            })
          }
        )
      } else {
        this.showPdfDialog = false
        this.dialogContent = null
      }
    },
    // 回退编辑
    updatePdf(id) {
      // console.log("得到回退编辑后的文书id", id);
      this.updateWritId = id // 防止重做事生成新的文书
      this.isUpdate = true

      this.dialogContent = null
      if (this.writTypeCode === 'ws10025') {
        this.dialogFormVisible = true
      }
      if (this.writTypeCode === 'ws10032') {
        this.dialogFormVisibles = true
        this.personalDisabled = true
        this.unitDisabled = true
      }
      if (this.writTypeCode === 'ws10033') {
        this.dialogFormVisibles = true
        this.personalDisabled = true
        this.unitDisabled = true
      }
    },
    preview(id) {
      // console.log("笔录信息", id);
      this.showPdf = true
      this.updateWritId = id
      this.isUpdate = false
    },
    // 文书生成成功回调
    getWrit(id, name, button) {
      this.pdfId = id
      this.writBtnList = button
      this.dialogContent = 'showPdf'
    },
    // 选择生成文书开始
    chooseWrit(key, type, id) {
      /*   console.log("选择生成文书传入的key  ==", key);
      console.log("选择生成文书传入的 type ==", type);
      console.log("选择生成文书传入的id ==", id); */
      // 获取该数据的违法犯罪行为
      getWritDataByWritId({ writId: id }).then(res => {
        this.isUpdate = true
        this.updateWritId = id
        // 个人申辩记录
        if (key.indexOf('申辩') !== -1) {
          let infoList = res.data.filter(item => {
            if (item.tagName.indexOf('entity') !== -1) {
              return item
            }
          })
          this.writBtnList = {
            closePdf: true,
            updatePdf: true,
            signPdf: true
          }
          /*   let qaArr = ["question", "answer"];
          this.defenseRecordList = reflectEntity(infoList, qaArr); */
          // 正常回显数据
          res.data.forEach(item => {
            switch (item.tagName) {
              case 'tag2':
                this.form.time[0] = item.tagContent
                  ? item.tagContent
                      .replace('年', '-')
                      .replace('月', '-')
                      .replace('日', ' ')
                      .replace('时', ':')
                      .replace('分', '') + ':00'
                  : ''
                break
              case 'tag3':
                this.form.time[1] = item.tagContent
                  ? item.tagContent
                      .replace('年', '-')
                      .replace('月', '-')
                      .replace('日', ' ')
                      .replace('时', ':')
                      .replace('分', '') + ':00'
                  : ''
                break
              case 'tag4':
                this.form.place = item.tagContent
                break
              case 'tag5':
                this.form.name = item.tagContent
                break
              case 'tag6':
                this.form.gender = item.tagContent
                break
              case 'tag7':
                this.form.post = item.tagContent
                break
              case 'tag8':
                this.form.workUnit = item.tagContent
                break
              case 'tag9':
                this.form.phone = item.tagContent
                break
              case 'tag10':
                this.form.address = item.tagContent
                break
              case 'tag11':
                this.form.zipCode = item.tagContent
                break
              case 'tag12':
                this.form.executorName = item.tagContent
                break
              case 'tag13':
                this.form.userName = item.tagContent
                break
              case 'tag18':
                this.form.desc = item.tagContent
                break
            }
          })
          this.dialogFormVisible = true
        }
        // 单位处罚决定书
        if (key.indexOf('单位') !== -1) {
          this.writBtnList = {
            closePdf: true,
            updatePdf: true,
            sealPdf: true,
            signPdf: true,
            finishPdf: true
          }
          res.data.forEach(item => {
            switch (item.tagName) {
              case 'tag2':
                this.ruleForm.punishedUnit = item.tagContent
                break
              case 'tag3':
                this.ruleForm.address = item.tagContent
                break
              case 'tag4':
                this.ruleForm.zipCode = item.tagContent
                break
              case 'tag5':
                this.ruleForm.representative = item.tagContent
                break
              case 'tag6':
                this.ruleForm.job = item.tagContent
                break
              case 'tag7':
                this.ruleForm.phone = item.tagContent
                break
              case 'tag8':
                this.ruleForm.descA = item.tagContent
                break
              case 'tag9':
                this.ruleForm.descB = item.tagContent
                break
              case 'tag10':
                this.ruleForm.descC = item.tagContent
                break
              case 'tag11':
                this.ruleForm.region = item.tagContent.substring(0, 2)
                // this.ruleForm.number = toCommonMoney(
                //   item.tagContent.substring(5)
                // );
                break
              // case "tag12":
              //   this.ruleForm.bank = item.tagContent;
              //   break;
              // case "tag13":
              //   this.ruleForm.bankAccount = item.tagContent;
              //   break;
              case 'tag121':
                this.ruleForm.decision = item.tagContent == 'true' ? 1 : 2
                break
              case 'tag122':
                this.ruleForm.decision = item.tagContent == 'true' ? 2 : 1
                break
              case 'tagMoney':
                this.ruleForm.number = item.tagContent
                break
            }
          })
          this.isShow = this.ruleForm.region.indexOf('罚款') !== -1
          this.dialogFormVisibles = true
          this.unitDisabled = true
          this.personalDisabled = true
        }
        // 个人处罚决定书
        if (key.indexOf('个人') !== -1) {
          this.select = '个人'
          this.writBtnList = {
            closePdf: true,
            updatePdf: true,
            sealPdf: true,
            signPdf: true,
            finishPdf: true
          }
          res.data.forEach(item => {
            switch (item.tagName) {
              case 'tag2':
                this.ruleForm.personName = item.tagContent
                break
              case 'tag3':
                this.ruleForm.sex = item.tagContent
                break
              case 'tag4':
                this.ruleForm.age = item.tagContent
                break
              case 'tag14':
                this.ruleForm.region = item.tagContent.substring(0, 2)
                // this.ruleForm.number = toCommonMoney(
                //   item.tagContent.substring(5)
                // );
                break
              case 'tag5':
                this.ruleForm.idCard = item.tagContent
                break
              case 'tag6':
                this.ruleForm.homeAddress = item.tagContent
                break
              case 'tag7':
                this.ruleForm.companyName = item.tagContent
                break
              case 'tag8':
                this.ruleForm.job = item.tagContent
                break
              case 'tag9':
                this.ruleForm.unitAddress = item.tagContent
                break
              case 'tag10':
                this.ruleForm.contactNumber = item.tagContent
                break
              case 'tag121':
                this.ruleForm.decision = item.tagContent == 'true' ? 1 : 2
                break
              case 'tag122':
                this.ruleForm.decision = item.tagContent == 'true' ? 2 : 1
                break
              case 'tag11':
                this.ruleForm.descA = item.tagContent
                break
              case 'tag12':
                this.ruleForm.descB = item.tagContent
                break
              case 'tag13':
                this.ruleForm.descC = item.tagContent
                break
              case 'tagMoney':
                this.ruleForm.number = item.tagContent
                break
            }
          })
          this.isShow = this.ruleForm.region.indexOf('罚款') !== -1
          this.dialogFormVisibles = true
          this.unitDisabled = true
          this.personalDisabled = true
        }
      })
    },
    // 选择生成文书以上结束
    //根据企业id查询企业信息
    initenterPriseInquireByid() {
      enterPriseInquireByid({
        id: this.headerInfo.company.id
      }).then(res => {
        // console.log(res, "2312312");
        this.form.place = res.data.businessAddress //笔录地点
        this.form.address = res.data.businessAddress //(笔录)联系地址
        this.form.zipCode = res.data.postalCode //(笔录)邮编
        this.ruleForm.zipCode = res.data.postalCode //(单位)邮编
        this.ruleForm.address = res.data.businessAddress //(单位)单位地址
        this.ruleForm.unitAddress = res.data.businessAddress //(个人)单位地址

        this.ruleForm.personName = res.data.primaryPerson //责任人(个人)
        this.ruleForm.representative = res.data.legalPerson //法定代表人(单位)
        this.form.post = res.data.primaryPersonJob //职务(笔录)
        this.ruleForm.job = res.data.primaryPersonJob //职务(单位加个人)
        // this.form.phone = res.data.legalPersonMobilephone; //联系电话(笔录)
        this.ruleForm.phone = res.data.legalPersonMobilephone //联系电话(单位)
        this.ruleForm.contactNumber = res.data.primaryPersonMobilephone //责任人联系电话(个人)
      }),
        err => {
          console.log(err)
        }
    },
    // 处理tag16检查描述数据
    handleResponId(data) {
      let temp = []
      data.forEach(item => {
        temp.push({
          tagName: 'tag16Item',
          tagContent: item
        })
      })
      return temp
    },
    // 处理tag19
    handleId(data) {
      let temp = []
      data.forEach(item => {
        temp.push({
          tagName: 'tag19Item',
          tagContent: item
        })
      })
      return temp
    },
    handleResponName(data) {
      let temp = []
      data.forEach(item => {
        // console.log(item, "0000000");
        temp.push({
          tagName: 'tag15Item',
          tagContent: item
        })
      })
      return temp
    },
    // 获取简易行政处罚文书列表
    getSimpleWritList() {
      simpleDocumentList({
        id: this.sourceId
      }).then(res => {
        this.loading = false
        this.docCardList = res.data
        this.form.name = null
        this.form.gender = null
        this.form.desc = null
        // // this.form.phone = null;
        // // this.form.post = null;
        // this.form.desc = null;
        // // this.ruleForm.zipCode = null;
        // // this.ruleForm.job = null;
        // // this.ruleForm.phone = null;
        // this.ruleForm.personName = null
        this.ruleForm.region = '警告'
        this.isShow = false
        // this.ruleForm.descA = null
        // this.ruleForm.descB = null
        // this.ruleForm.descC  = null
        // this.ruleForm.decision = null;
        this.ruleForm.number = null
        // // this.ruleForm.personName = null;
        this.ruleForm.sex = null
        this.ruleForm.age = null
        this.ruleForm.idCard = null
        this.ruleForm.homeAddress = null
        this.dialogContent = ''
        // this.showPdfDialog = false;
        // this.dialogFormVisibles = false;
        // this.dialogFormVisible = false;
      })
    },
    //清空表单数据
    clearDataInfo() {
      for (let item in this.ruleForm) {
        this.select = '单位'
      }
    },
    // 当事人陈述申辩笔录文书制作
    saveAndmakeWriting(form) {
      this.$refs[form].validate((valid, errInfo) => {
        if (valid) {
          console.info('valid easy punish', valid)
          // 如果申辩笔录为空 报错
          if (!this.form.desc || this.form.desc === '') {
            this.$message.error('陈述申辩笔录不能为空！')
          } else {
            // 验证通过后
            let initstartTime = this.form.time[0]
            let initendTime = this.form.time[1]
            let startTime = dateFormat(initstartTime, 'yyyy年mm月dd日HH时MM分')
            let endTime = dateFormat(initendTime, 'yyyy年mm月dd日HH时MM分')
            let responsibleId = this.headerInfo.peopleId.split(',')
            let responIdList = this.handleResponId(responsibleId)
            let responName = this.headerInfo.people.split(',')
            let responNameList = this.handleResponName(responName)
            let responIdListtwo = this.handleId(responsibleId)
            let arr = this.handleInfo()
            let params = {
              companyId: this.headerInfo.company.id, //制作文书传company_id
              contractorIds: this.headerInfo.peopleId,
              data: [
                ...responIdListtwo,
                ...responIdList,
                ...responNameList,
                {
                  tagName: 'tag2',
                  tagContent: startTime
                },
                {
                  tagName: 'tag3',
                  tagContent: endTime
                },
                {
                  tagName: 'tag4',
                  tagContent: this.form.place
                },
                {
                  tagName: 'tag5',
                  tagContent: this.form.name
                },
                {
                  tagName: 'tag6',
                  tagContent: this.form.gender
                },
                {
                  tagName: 'tag7',
                  tagContent: this.form.post
                },
                {
                  tagName: 'tag8',
                  tagContent: this.form.workUnit
                },
                {
                  tagName: 'tag9',
                  tagContent: this.form.phone
                },
                {
                  tagName: 'tag10',
                  tagContent: this.form.address
                },
                {
                  tagName: 'tag11',
                  tagContent: this.form.zipCode
                },
                {
                  tagName: 'tag12',
                  tagContent: this.form.executorName
                },
                {
                  tagName: 'tag13',
                  tagContent: this.form.userName
                },
                {
                  tagName: 'tag14',
                  tagContent: JSON.parse(localStorage.getItem('res')).sysDeptEntity.fullDeptName
                    ? JSON.parse(localStorage.getItem('res')).sysDeptEntity.fullDeptName
                    : ''
                },
                {
                  tagName: 'tag18',
                  tagContent: this.form.desc
                },
                {
                  tagName: 'tag17',
                  tagContent: this.form.caseName
                }
              ],
              sourceId: this.sourceId,
              writType: 'DSRCSSBBL'
            }
            this.writBtnList = {
              closePdf: true,
              updatePdf: true,
              signPdf: true,
              finishPdf: true
            }
            if (this.isUpdate && this.updateWritId) {
              updateWrit({ writId: this.updateWritId }, params.data).then(res => {
                this.isUpdate = false
                this.pdfId = this.updateWritId
                this.preview(this.pdfId)
                this.writTypeCode = res.writType
                this.writName = '当事人陈述申辩笔录'
                this.dialogContent = 'showPdf'
                if (this.ruleForm.region == '罚款') {
                  this.isShow = true
                }
                if (this.ruleForm.region == '警告') {
                  this.isShow = false
                }
              })
            } else {
              makeDisposalDocument(params).then(
                res => {
                  this.pdfId = res.writId
                  this.preview(this.pdfId)
                  this.writTypeCode = res.writType
                  this.writName = '当事人陈述申辩笔录'
                  this.dialogFormVisible = false
                  this.dialogContent = 'showPdf'
                },
                err => {
                  console.log('请求失败', err)
                }
              )
            }
          }
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    // 查询文书列表
    queryWritList() {
      this.getSimpleWritList()
      this.clearDataInfo()
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.showPdfDialog = false
      this.dialogContent = null
      this.isUpdate = false
      this.updateWritId = null
      this.writBtnList = {}
      this.dialogFormVisible = false
      this.dialogFormVisibles = false
    },
    // 行政处罚的文书
    makePunishWrit(ruleForm) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 再依次验证处罚依据 法律规定
          if (this.ruleForm.descA === '' || this.ruleForm.descA == null) {
            this.$message.error('违法事实及依据不能为空')
          } else if (this.ruleForm.descB === '' || this.ruleForm.descB == null) {
            this.$message.error('法律法规不能为空')
          } else if (this.ruleForm.descC === '' || this.ruleForm.descC == null) {
            this.$message.error('处罚依据不能为空')
          } else {
            // 正常验证通过
            // 再次验证验证
            if (this.ruleForm.region == '罚款' && this.ruleForm.number == null) {
              this.$message.error('罚款金额不能为空!')
            } else {
              if (this.ruleForm.region == '罚款' && this.ruleForm.number <= 0) {
                this.$message.error('罚款金额要大于0!')
              } else {
                let params = {
                  companyId: this.headerInfo.company.id, //制作文书传company_id
                  contractorIds: this.headerInfo.peopleId,
                  sourceId: this.sourceId
                }
                this.writBtnList = {
                  closePdf: true,
                  updatePdf: true,
                  sealPdf: true,
                  signPdf: true,
                  finishPdf: true
                }
                if (this.select === '单位') {
                  params.writType = 'XXDCCFJDSDW'
                  params.data = getWritParams({
                    tag2: this.ruleForm.punishedUnit,
                    tag3: this.ruleForm.address,
                    tag4: this.ruleForm.zipCode,
                    tag5: this.ruleForm.representative,
                    tag6: this.ruleForm.job,
                    tag7: this.ruleForm.phone,
                    tag8: this.ruleForm.descA,
                    tag9: this.ruleForm.descB,
                    tag10: this.ruleForm.descC,
                    tag17: this.ruleForm.RMB,
                    tag11: this.ruleForm.region
                      ? this.ruleForm.region == '警告'
                        ? this.ruleForm.region + ''
                        : this.ruleForm.region + this.ruleForm.RMB + (this.ruleForm.number ? toSuperMoney(this.ruleForm.number) : '')
                      : '',
                    tag121: this.ruleForm.region == '警告' ? 'false' : this.ruleForm.region == '罚款' && this.ruleForm.decision == 1 ? 'true' : 'false',
                    tag122: this.ruleForm.region == '警告' ? 'false' : this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? 'true' : 'false',
                    tag12: this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? this.ruleForm.bank : '',
                    tag13: this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? this.ruleForm.bankAccount : '',
                    tag14: this.userInfo.sysDeptEntity.government,
                    tag15: this.userInfo.sysDeptEntity.bureau,
                    tag16: this.userInfo.sysDeptEntity.court,
                    tagMoney: this.ruleForm.number
                  })
                } else {
                  params.writType = 'XXDCCFJDSGR'
                  params.data = getWritParams({
                    tag2: this.ruleForm.personName,
                    tag3: this.ruleForm.sex,
                    tag4: this.ruleForm.age,
                    tag5: this.ruleForm.idCard,
                    tag6: this.ruleForm.homeAddress,
                    tag7: this.ruleForm.companyName,
                    tag8: this.ruleForm.job,
                    tag9: this.ruleForm.unitAddress, // 单位地址
                    tag10: this.ruleForm.contactNumber, // 联系电话
                    tag11: this.ruleForm.descA,
                    tag12: this.ruleForm.descB,
                    tag13: this.ruleForm.descC,
                    tag20: this.ruleForm.RMB,
                    tag14: this.ruleForm.region
                      ? this.ruleForm.region == '警告'
                        ? this.ruleForm.region + ''
                        : this.ruleForm.region + this.ruleForm.RMB + (this.ruleForm.number ? toSuperMoney(this.ruleForm.number) : '')
                      : '', // 罚款
                    tag121: this.ruleForm.region == '警告' ? 'false' : this.ruleForm.region == '罚款' && this.ruleForm.decision == 1 ? 'true' : 'false',
                    tag122: this.ruleForm.region == '警告' ? 'false' : this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? 'true' : 'false',
                    tag15: this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? this.ruleForm.bank : '', // 缴款单位
                    tag16: this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? this.ruleForm.bankAccount : '', // 缴款账号
                    tag17: this.userInfo.sysDeptEntity.government, // 人民政府单位
                    tag18: this.userInfo.sysDeptEntity.bureau,
                    tag19: this.userInfo.sysDeptEntity.court, // 人民法院
                    tagMoney: this.ruleForm.number
                  })
                }
                if (this.isUpdate && this.updateWritId) {
                  updateWrit({ writId: this.updateWritId }, params.data).then(res => {
                    this.isUpdate = false
                    this.writTypeCode = res.writType
                    this.pdfId = this.updateWritId
                    this.preview(this.pdfId)
                    this.writName = '行政（当场）处罚决定书'
                    this.dialogContent = 'showPdf'
                    // this.ruleForm.region = null;
                    // this.ruleForm.personName = null;
                    // this.ruleForm.sex = null;
                    // this.ruleForm.age = null;
                    // this.ruleForm.idCard = null;
                    // this.ruleForm.homeAddress = null;
                    // this.ruleForm.companyName = null;
                    // this.ruleForm.job = null;
                    // this.ruleForm.unitAddress;
                    // this.ruleForm.contactNumber;
                    // this.ruleForm.descA;
                    // this.ruleForm.descB;
                    // this.ruleForm.descC;
                    // this.ruleForm.number;
                    // this.ruleForm.bank
                    // this.ruleForm.bankAccount
                    // this.updateWritId = null;
                  })
                } else {
                  makeDisposalDocument(params).then(res => {
                    this.pdfId = res.writId
                    this.preview(this.pdfId)
                    this.writTypeCode = res.writType
                    this.dialogContent = 'showPdf'
                    this.dialogFormVisibles = false
                    this.writName = '行政（当场）处罚决定书'
                    // this.ruleForm.personName = null;
                    // this.ruleForm.sex = null;
                    // this.ruleForm.age = null;
                    // this.ruleForm.idCard = null;
                    // this.ruleForm.homeAddress = null; //家庭住址
                    // this.ruleForm.companyName = null; //所在单位
                    // this.ruleForm.job = null;
                    // this.ruleForm.unitAddress;
                    // this.ruleForm.contactNumber;
                    // this.ruleForm.descA;
                    // this.ruleForm.descB;
                    // this.ruleForm.descC;
                    // this.ruleForm.region = null;
                    // this.ruleForm.number;
                  })
                }
              }
            }
          }
        } else {
          // 规则验证不通过
          console.info('error submit')
          return false
        }
      })
    },
    userSign(id, title, button) {
      this.writBtnList = button
      this.pdfId = id
      this.writName = title
      this.dialogContent = 'showPdf'
    }
  },
  mounted() {},
  computed: {
    ...mapState(['actsFromCheckAgain'])
  }
}
</script>

<style lang="less" scoped>
.penityStyle {
  /deep/ .el-col-5 {
    width: 84px;
  }
  /deep/ .dialog-footer {
    padding-top: 6px;
    padding-bottom: 6px;
    border-top: 1px solid #e0e0e0;
    margin-top: 60px;
  }
}
.fontStyle {
  text-decoration: underline !important;
}
.input-text {
  width: 383px;
  height: 30px;
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 5px;
  padding: 0 19px 0 10px;
  margin-bottom: 10px;
}
.answerAndQuestion {
  border: 1px solid #ccc;
  width: 450px;
  height: 385px;
  overflow: auto;
  text-decoration: none;
}
.btnGroup {
  margin-top: 40px;
}
.check-bac {
  margin: 50px auto 100px;
  height: 131px;
  width: 193px;
  background: url('~@/assets/imgs/receipt.jpg') no-repeat 50% 24px;
  background-size: 194px 97px;
  &::after {
    content: '暂无简易处罚';
    position: relative;
    top: 122px;
    left: 27%;
    color: #999999;
  }
  .bac {
    height: 179px;
  }
}
.form-body-center {
  display: flex;
}
.easyPunish_form-left {
  width: 48%;
  margin-left: 20px;
  margin-bottom: 10px;
}
.form-right {
  width: 48%;
  padding-left: 15px;
  li {
    list-style: none;
    height: 14px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 14px;
    padding: 10px 0px;
  }
  .lawWrap {
    display: flex;
    flex-direction: column;
  }
}
/deep/.el-form-item {
  padding: 0px;
  margin-bottom: 0px;
  text-align: left;
}
/deep/.el-range-editor.el-input__inner {
  height: 31px;
  padding: 0px 3px 0 10px;
  margin: 8px 0 6px 33px;
}
// .el-button-select{
//     padding-top:60px;
// }
/deep/.el-button-first {
  width: 140px;
  height: 30px;
  background: rgba(0, 153, 255, 1);
  border-radius: 5px;
  padding: 0 13px 12px;
  span {
    width: 110px;
    height: 14px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 26px;
  }
}
/deep/ .el-button-second {
  width: 268px;
  height: 30px;
  background: rgba(0, 153, 255, 1);
  border-radius: 5px;
  padding: 0 13px 12px;
  span {
    width: 249px;
    height: 14px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 26px;
  }
}
// /deep/.el-input__inner {
//   width: 330px;
// }
/deep/.el-dialog__wrapper .el-dialog__header .el-dialog__title {
  width: 142px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
/deep/ .el-dialog__body {
  overflow: auto;
  height: 100%;
}

/deep/.el-form-item__label {
  text-align: left;
  color: #333;
}
/deep/.demonstration {
  .el-range-editor {
    height: 30px;
    margin: 0;
    width: 83%;
  }
}
textarea {
  width: 408px;
  height: 52px;
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 5px;
  resize: none;
}
.input-second {
  width: 414px;
  height: 30px;
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 5px;
}

.el-form-item {
  margin-bottom: 0px;
}
/deep/ .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px;
}

/deep/ .el-dialog__wrapper .el-dialog__footer {
  padding-top: 0;
  line-height: 55px;
  padding-right: 10px;
  height: 55px;
}
.writ-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 40px;
  padding-bottom: 20px;
}
.easyPunish_content-list {
  line-height: 40px;
  color: #333333;
  width: 100%;
  border-bottom: none;
  display: flex;
}
.dialog-footer {
  text-align: right;
  // padding: 10px 10px 10px 0;
  // margin-top: 20px;
}
// .el-row {
//   margin-bottom: 5px;
// }
/deep/.el-date-editor .el-range-separator {
  line-height: 28px;
}
/deep/.el-icon-time:before {
  content: '';
}
/deep/.el-date-editor .el-range-input {
  width: 100%;
}
/deep/.el-date-editor .el-range__close-icon {
  width: 30px;
  line-height: 28px;
}
/deep/.demonstration .el-range-editor {
  width: 100%;
}
/deep/.el-select {
  width: 100%;
}
.detail_part {
  /*  line-height: 40px;
  height: 400px;
  overflow-y: auto; */
  margin-right: 10px;
  .defenseDetail {
    min-height: 350px;
    /deep/ .el-textarea__inner {
      min-height: 350px !important;
    }
  }
  /*   .detail {
    position: relative;
    padding: 9px 10px 30px 10px;
    // padding: 9px 16px 30px 17px;
    background: #eef5f9;

    &:last-child {
      margin-bottom: 0;
    }
    .el-form-item__label {
      // width: 60px;
      text-align: left;
    }
    .el-row {
      display: flex;
      .el-input {
        flex-grow: 1;
      }
    }
    .delete_buttons {
      position: absolute;
      bottom: -8px;
      right: 17px;
      margin-top: 8px;
      font-size: 0;
      span {
        font-size: 14px;
        color: #0099ff;
        cursor: pointer;
        & + span {
          margin-left: 16px;
        }
        &.delete {
          color: #ff3030;
        }
      }
    }
  } */
}
.money_prefix {
  width: 15px;
  height: 11px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 73, 1, 1);
  line-height: 38px;
  padding-left: 4px;
}
/deep/.el-dialog {
  margin-top: 5vh !important;
}

.easyPunishRequired {
  position: relative;
}
.easyPunishRequired:before {
  position: absolute;
  content: '*';
  color: rgb(245, 108, 108);
  margin-left: -10px;
  margin-top: 4px;
  transform: translate(0, -1px);
  vertical-align: middle;
  font-size: 12px;
  height: 100%;
}
</style>
