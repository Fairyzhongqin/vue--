<template>
  <div>
    <snPage-bar>
      <template slot="button">
        <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
      </template>
      <!-- <div class="bar-title">转简易程序行政处罚</div> -->
      <div class="btnGroup">
        <el-button type="primary" class="el-button-first" @click="addDenfenseRecordsList">+ 当事人申辩笔录</el-button>
        <el-button
          type="primary"
          class="el-button-second"
          @click="addDecisionOnAdministrativePenalty"
        >+ 行政（当场）处罚决定书（单位/个人）</el-button>
      </div>
      <!-- dialogFormVisibles = true -->
      <!-- 底部背景图 -->
      <div class="check-bac bac" v-show="!docCardList || docCardList.length === 0"></div>
      <div class="writ-list" v-if="docCardList && docCardList.length > 0">
        <doc-card
          v-for="(item, index) in docCardList"
          :key="index"
          :docData="item"
          :auditInfo="auditInfo"
          @afterDelete="getSimpleWritList"
          @afterUpload="getSimpleWritList"
          @modifyWrit="chooseWrit"
          @toSeal="toSeal"
          @previewWrit="previewWrit"
          @toLawSeal="toLawSeal"
        ></doc-card>
      </div>
    </snPage-bar>

    <div class="marTop">
      <el-button size="mini" @click="close">关闭</el-button>
    </div>
    <!-- 当事人申辩笔录 -->
    <el-dialog
      title="当事人陈述申辩笔录"
      :visible.sync="dialogFormVisible"
      width="70%"
      :before-close="resetState"
    >
      <div class="form-body-center" v-if="dialogFormVisible">
        <div class="Record_form-left">
          <el-form
            :model="form"
            size="small"
            :label-width="ruleformLabelWidth"
            :rules="rulesBilu"
            ref="form"
            :inline-message="true"
            :show-message="false"
          >
            <el-form-item :label-width="ruleformLabelWidth" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
              <el-input v-model="form.caseName" autocomplete="off" placeholder="请输入案件名称" clearable></el-input>
            </el-form-item>
            <el-form-item prop="value">
              <div slot="label" class="slot_label">笔录时间</div>
              <el-date-picker
                v-model="form.value"
                type="datetimerange"
                align="left"
                format="yyyy-MM-dd HH:mm"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="place">
              <div slot="label" class="slot_label">笔录地点</div>
              <el-input v-model="form.place" autocomplete="off" placeholder="请输入地点" clearable></el-input>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="name">
              <div slot="label" class="slot_label">申辩人</div>
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入申辩人姓名" clearable></el-input>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="gender">
              <div slot="label" class="slot_label">性别</div>
              <el-select v-model="form.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="form.phone" autocomplete="off" placeholder="请输入联系电话" clearable></el-input>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="companyName">
              <div slot="label" class="slot_label">工作单位</div>
              <el-input
                v-model="tableHeadInfo.companyName"
                autocomplete="off"
                placeholder="请输入工作单位"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="NXaddress">
              <div slot="label" class="slot_label">联系地址</div>
              <el-input v-model="form.NXaddress" autocomplete="off" placeholder="请输入联系地址" clearable></el-input>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="post">
              <div slot="label" class="slot_label">职务</div>
              <el-input v-model="form.post" autocomplete="off" placeholder="请输入职务" clearable></el-input>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="zipCode">
              <div slot="label" class="slot_label">邮编</div>
              <el-input v-model="form.zipCode" autocomplete="off" placeholder="请输入邮编" clearable></el-input>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="executorName">
              <div slot="label" class="slot_label">承办人</div>
              <el-input
                v-model="tableHeadInfo.executorName"
                autocomplete="off"
                placeholder="请输入承办人"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item :label-width="ruleformLabelWidth" prop="nickName">
              <div slot="label" class="slot_label">记录人</div>
              <el-input
                v-model="userInfo.userEntity.nickName"
                autocomplete="off"
                placeholder="请输入记录人"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-right">
          <p class="simpleAdminPenaltyRequired">陈述申辩记录：</p>
          <div class="detail_part">

            <el-input
              type="textarea"
              placeholder="请输入笔录"
              v-model="form.desc"
              autosize
              class="defenseDetail"
            ></el-input>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMake">取 消</el-button>
        <el-button type="primary" @click="saveAndmakeWriting('form')">保存并生成笔录文书</el-button>
      </div>
    </el-dialog>

    <!-- 处罚决定书 -->
    <el-dialog
      title="行政（当场）处罚决定书"
      :visible.sync="dialogFormVisibles"
      width="70%"
      class="penaltyStyle"
      :before-close="resetState"
    >
      <!-- <div class="content"> -->
      <div class="flex justify-content-space-between" v-if="dialogFormVisibles">
        <div class="content-list">
          <div class="simp_form-left">
            <el-row>
              <el-col :span="5" class="col_label">责任主体</el-col>
              <el-col :span="9">
                <el-radio-group v-model="select">
                  <el-radio label="单位" :disabled="unitDisabled"></el-radio>
                  <el-radio label="个人" :disabled="personalDisabled"></el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <!-- 单位 -->
            <div v-show="select === '单位'">
              <el-row>
                <el-col :span="5" class="col_label">被处罚单位</el-col>
                <el-col :span="19">
                  <el-input v-model="tableHeadInfo.companyName" placeholder="请输入被处罚单位" clearable></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">单位地址</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.address" placeholder="请输入单位地址" clearable></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">邮编</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.zipCode" placeholder="请输入邮编" maxlength="6" clearable></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">法定代表人</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.representative" placeholder="请输入法定代表人" clearable></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">职务</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.personPost" placeholder="请输入职务" clearable></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">联系电话</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.phone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
                </el-col>
              </el-row>
            </div>
            <!-- 个人 -->
            <div v-show="select === '个人'">
              <el-row>
                <el-col :span="5" class="col_label">责任人</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.personName" placeholder="请输入责任人" clearable></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="5" class="col_label">性别</el-col>
                <el-col :span="19">
                  <el-select v-model="ruleForm.sex" placeholder="请选择性别" class="select">
                    <el-option value="男"></el-option>
                    <el-option value="女"></el-option>
                  </el-select>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="5" class="col_label">年龄</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.age" placeholder="请输入年龄" clearable></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="5" class="col_label">身份证</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.idCard" placeholder="请输入身份证" clearable></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="5" class="col_label">职务</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.post" placeholder="请输入职务" clearable></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="5" class="col_label">家庭住址</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.homeAddress" placeholder="请输入家庭住址" clearable></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="5" class="col_label">所在单位</el-col>
                <el-col :span="19">
                  <el-input v-model="tableHeadInfo.companyName" placeholder="请输入所在单位" clearable></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">单位地址</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.unitAddress" placeholder="请输入单位地址" clearable></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">联系电话</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.contactPhone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
                </el-col>
              </el-row>
            </div>

            <el-row>
              <el-col :span="5" class="col_label">处罚决定</el-col>
              <el-col :span="19">
                <el-select
                  v-model="ruleForm.region"
                  placeholder="请输入处罚决定"
                  @change="selectChange"
                  class="select"
                >
                  <el-option label="罚款" value="罚款"></el-option>
                  <el-option label="警告" value="警告"></el-option>
                </el-select>
              </el-col>
            </el-row>

            <div v-if="isShow">
              <el-row>
                <el-col :span="5" class="col_label">当场缴纳</el-col>
                <el-col :span="19">
                  <el-radio-group v-model="ruleForm.decision" @change="change">
                    <el-radio :label="1" value="是">是</el-radio>
                    <el-radio :label="2" value="否">否</el-radio>
                  </el-radio-group>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">罚款金额</el-col>
                <el-col :span="19">
                  <el-input v-model="ruleForm.number" placeholder="请输入罚款金额" clearable>
                    <span slot="prefix" class="money_prefix">¥</span>
                  </el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">缴纳银行</el-col>
                <el-col :span="19">
                  <el-input
                    v-model="ruleForm.bankP"
                    placeholder="请输入缴纳银行"
                    clearable
                    v-if="select === '个人'"
                  ></el-input>
                  <el-input v-model="ruleForm.bank" placeholder="请输入缴纳银行" clearable v-else></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="col_label">银行账号</el-col>
                <el-col :span="19">
                  <el-input
                    v-model="ruleForm.bankAccountP"
                    placeholder="请输入银行账号"
                    clearable
                    v-if="select === '个人'"
                  ></el-input>
                  <el-input v-model="ruleForm.bankAccount" placeholder="请输入银行账号" clearable v-else></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="form-right_text">
            <span>违法事实及依据：</span>
            <textarea class="input-right" v-model="ruleForm.descA"></textarea>
            <span class="span-1">法律法规：</span>
            <!-- <input type="textarea" v-model="ruleForm.descB" class="input-text" /> -->
            <textarea v-model="ruleForm.descB" class="input-right"></textarea>
            <span>处罚依据：</span>
            <textarea class="input-right" v-model="ruleForm.descC"></textarea>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" v-if="select === '单位'">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveOrgPenaltyDecision">保存并制作处罚决定书</el-button>
      </div>

      <div slot="footer" class="dialog-footer" v-if="select === '个人'">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="savePerPenaltyDecision">保存并制作处罚决定书</el-button>
      </div>
      <!-- </div> -->
    </el-dialog>

    <!-- <el-dialog width="800px" height="6000px" :visible.sync="showPdfDialog"> -->
    <show-pdf
      :pdfId="pdfId"
      v-if="showPdfDialog"
      @closePdf="queryWritList"
      @updatePdf="updatePdf"
      :buttonList="writBtnList"
      @sealPdf="submitSeal"
      :writName="writName"
    ></show-pdf>
    <!-- </el-dialog> -->
    <el-dialog
      width="1000px"
      height="600px"
      :visible.sync="isSelectPeople"
      title="选择审核人员"
    >
      <select-people v-if="isSelectPeople" :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
  </div>
</template>

<script>
import snPageBar from '@/components/snPageBar/index'
import { makeDisposalDocument, enterPriseInquireByid, simpleDocumentList } from '@api/ProcessingofInspectionResult'
import { mapState } from 'vuex'
import { dateFormat, toSuperMoney, toCommonMoney, getFirstErrMsg } from '@/utils/util'
import showPdf from '@/components/showPdf/index'
import docCard from '@components/docCard/index'
import { sealAudit } from '@api/common'
import { getWritDataByWritId, updateWrit } from '@/api/fileRelated.js'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
// import Bus from "@/bus";
import { simpleHandleInfo } from '@/api/simpleHandle'
export default {
  components: {
    snPageBar,
    showPdf,
    docCard,
    selectPeople
  },
  data() {
    return {
      writName: '',
      unitDisabled: false,
      personalDisabled: false,
      labelPosition: 'top',
      // 当事人申辩笔录
      defenseRecordList: [
        {
          question: '', //问
          answer: '' //答
        }
      ],
      showPdfDialog: false,
      pdfId: '',
      userInfo: '',
      selectedStatus: '',
      dialogFormVisible: false,
      dialogFormVisibles: false,
      form: {
        value: [new Date(), new Date(new Date().getTime() + 60 * 120 * 1000)], //笔录时间：,
        caseName: '',
        place: '',
        name: '',
        gender: '',
        phone: '',
        work: '',
        post: '',
        zipCode: '',
        desc: '',
        NXaddress: ''
      },
      // 申辩笔录的必填校验
      rulesBilu: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        value: [{ required: true, message: '请选择笔录时间', trigger: 'change' }],
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
        // companyName: [{ required: true, message: '请输入工作单位：', trigger: 'blur' }],
        NXaddress: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
        post: [{ required: true, message: '请输入职务', trigger: 'blur' }],
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
        // executorName: [{ required: true, message: '请输入承办人：', trigger: 'blur' }],
        // nickName: [{ required: true, message: '请输入记录人：', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入陈述申辩记录', trigger: 'blur' }]
      },
      ruleformLabelWidth: '110px',
      ruleForm: {
        place: '',
        address: '',
        zipCode: '',
        representative: '',
        phone: '',
        contactPhone: '',
        region: '',
        decision: 1, //1 是 2否
        number: null,
        bank: '',
        bankAccount: '',
        bankP: '',
        bankAccountP: '',
        personName: '',
        sex: '',
        age: '',
        idCard: '',
        personPost: '',
        post: '',
        homeAddress: '',
        unitAddress: '',
        descA: '',
        descB: '',
        descC: ''
      },
      select: '单位',
      isShow: false,
      docCardList: [],
      auditInfo: {},
      audiReq: null,
      isSelectPeople: false,
      isUpdate: false,
      updateWritId: null,
      writBtnList: {}
    }
  },

  created() {
    console.log(this.tableHeadInfo, 'simpleAdminPenalty')
    this.userInfo = JSON.parse(localStorage.getItem('res'))
    // console.log("的时间方便快捷", this.simpleId,);
    console.log(this.userInfo, '484451')
    // console.log(this.tableHeadInfo,  this.tableId);
    // console.log("银行",this.userInfo.sysDeptEntity.bankAccount)
    this.ruleForm.bank = this.userInfo.sysDeptEntity.bank //银行
    this.ruleForm.bankAccount = this.userInfo.sysDeptEntity.bankAccount //银行账户
    this.ruleForm.bankP = this.userInfo.sysDeptEntity.bank //个人银行
    this.ruleForm.bankAccountP = this.userInfo.sysDeptEntity.bankAccount //个人银行账户
    this.initenterPriseInquireByid()
    this.getSimpleWritList()
    this.auditInfo = {
      requestUsersName: this.tableHeadInfo.executorName,
      caseName: this.tableHeadInfo.companyName
    }
  },
  methods: {
    cancelMake() {
      this.getSimpleWritList()
      // 手动关掉回退编辑模态框
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.dialogFormVisible = false
      // 取消更新状态
      this.resetState()
    },
    toLawSeal(info) {
      this.showPdfDialog = true
      this.pdfId = info.id
      this.writName = info.title
      this.writBtnList = {
        closePdf: true
      }
      this.getSimpleWritList()
    },
    // 当事人申辩笔录
    // 点击新增
    addDenfenseRecordsList() {
      this.dialogFormVisible = true
      this.clearInfo()
    },
    // 新增
    addDetail() {
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
    // 回退编辑
    updatePdf(id) {
      console.log('得到回退编辑后的文书id', id)
      this.updateWritId = id // 防止重做事生成新的文书
      this.isUpdate = true
      this.showPdfDialog = false
      if (this.writTypeCode === 'ws10025') {
        this.dialogFormVisible = true
        this.dialogFormVisibles = false
      } else {
        this.dialogFormVisible = false
        this.dialogFormVisibles = true
      }
      this.personalDisabled = true
      this.unitDisabled = true
      // this.dialogFormVisibles = true;
      // if (this.writTypeCode === "ws10032") {
      //   this.dialogFormVisibles = true;
      // }
      // if (this.writTypeCode === "ws10033") {
      //   this.dialogFormVisibles = true;
      // }
    },
    preview(id) {
      console.log('笔录信息', id)
      this.showPdfDialog = true
      this.updateWritId = id
      this.isUpdate = false
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
    //根据企业id查询企业信息
    cancel() {
      this.resetState()
      this.clearDataInfo()
      this.dialogFormVisibles = false
      this.dialogFormVisible = false
    },
    initenterPriseInquireByid() {
      // console.log(this.tableHeadInfo.companyId);
      enterPriseInquireByid({
        id: this.tableHeadInfo.companyId
      }).then(res => {
        console.log(res, '321111111')
        this.form.caseName = res.data.companyName //案件名称
        this.form.place = res.data.businessAddress //笔录地点
        this.form.NXaddress = res.data.businessAddress //联系地址
        this.ruleForm.address = res.data.businessAddress //单位地址(单位)
        this.ruleForm.unitAddress = res.data.businessAddress //单位地址(个人)
        this.form.zipCode = res.data.postalCode //邮编 (笔录)
        this.ruleForm.zipCode = res.data.postalCode //邮编(单位)

        this.ruleForm.phone = res.data.legalPersonMobilephone //联系电话
        this.ruleForm.representative = res.data.legalPerson //法定代表人

        this.form.post = res.data.primaryPersonJob //笔录职务
        this.ruleForm.post = res.data.primaryPersonJob //个人职务
        this.ruleForm.personPost = res.data.primaryPersonJob //单位职务
        this.ruleForm.personName = res.data.primaryPerson //责任人(个人)
        this.ruleForm.unitAddress = res.data.businessAddress //单位地址(个人)
        this.ruleForm.contactPhone = res.data.primaryPersonMobilephone //责任人的联系电话
      }),
        err => {
          console.info(err)
        }
    },
    // 新增行政当场处罚决定书
    addDecisionOnAdministrativePenalty() {
      ;(this.unitDisabled = false), (this.personalDisabled = false), (this.dialogFormVisibles = true)
      this.clearInfo()
      // 取当前企业行政处罚的违法信息
      simpleHandleInfo({
        id: this.simpleId
      })
        .then(res => {
          console.log('点击新增行政处罚行政书', res)
          if (res.code === '0') {
            console.log('取到了当前检查项的违法信息', res.data.probList)
            // 违法事实及依据
            let illegalFactsAndBasisArr = []
            let illegalFactsAndBasis = ''
            // 法律法规
            let lawsAndRegulationsArr = []
            let lawsAndRegulations = ''
            // 处罚依据
            let punishmentBasisArr = []
            let punishmentBasis = ''
            // 遍历
            res.data.probList.forEach(item => {
              if (item.unlawfulAct && item.penalizeBasisRule !== null) {
                illegalFactsAndBasisArr.push(item.unlawfulAct + item.penalizeBasisRule)
              }
              if (item.lawProvisionRule && item.lawProvisionsContent !== null) {
                lawsAndRegulationsArr.push(item.lawProvisionRule + item.lawProvisionsContent)
              }
              if (item.penalizeBasisContent !== null) {
                punishmentBasisArr.push(item.penalizeBasisContent)
              }

              if (punishmentBasisArr) {
                for (let i = 0; i < punishmentBasisArr.length; i++) {
                  punishmentBasis += punishmentBasisArr[i]
                }
              }
              if (illegalFactsAndBasisArr && illegalFactsAndBasisArr.length > 0) {
                for (let i = 0; i < illegalFactsAndBasisArr.length; i++) {
                  illegalFactsAndBasis += illegalFactsAndBasisArr[i]
                }
              }
              if (lawsAndRegulationsArr) {
                for (let i = 0; i < lawsAndRegulationsArr.length; i++) {
                  lawsAndRegulations += lawsAndRegulationsArr[i]
                }
              }
            })
            this.ruleForm.descA = illegalFactsAndBasis ? illegalFactsAndBasis : ''
            this.ruleForm.descB = lawsAndRegulations ? lawsAndRegulations : ''
            this.ruleForm.descC = punishmentBasis ? punishmentBasis : ''
          }
        })
        .catch(err => {
          throw new Error(err)
        })
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
        temp.push({
          tagName: 'tag15Item',
          tagContent: item
        })
      })
      return temp
    },
    back() {
      this.$store.commit('setShowMulitList')
      this.$store.commit('setShowSimplePenality')
    },
    close() {
      this.$store.commit('setShowMulitList')
      this.$store.commit('setShowSimplePenality')
    },
    saveAndmakeWriting(form) {
      this.$refs.form.validate((valid, errInfo) => {
        if (valid) {
          // 校验通过
          // 如果申辩笔录为空 报错
          if (!this.form.desc || this.form.desc === '') {
            this.$message.error('陈述申辩笔录不能为空！')
          } else {
            // 校验通过
            let initstartTime = this.form.value[0]
            let initendTime = this.form.value[1]
            let startTime = dateFormat(initstartTime, 'yyyy年mm月dd日HH时MM分')
            let endTime = dateFormat(initendTime, 'yyyy年mm月dd日HH时MM分')
            let responsibleId = this.tableHeadInfo.executorId.split(',')
            let responIdList = this.handleResponId(responsibleId)
            let responName = this.tableHeadInfo.executorName.split('、')
            let responNameList = this.handleResponName(responName)
            let responIdListtwo = this.handleId(responsibleId)
            // let arr = this.handleInfo()
            let params = {
              contractorIds: this.tableHeadInfo.executorId,
              data: [
                ...responIdListtwo,
                ...responIdList,
                ...responNameList,
                // ...arr,
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
                  tagContent: this.tableHeadInfo.companyName
                },
                {
                  tagName: 'tag9',
                  tagContent: this.form.phone
                },
                {
                  tagName: 'tag10',
                  tagContent: this.form.NXaddress
                },
                {
                  tagName: 'tag11',
                  tagContent: this.form.zipCode
                },
                {
                  tagName: 'tag12',
                  tagContent: this.tableHeadInfo.executorName.replace(/，/g, '、')
                },
                {
                  tagName: 'tag13',
                  tagContent: this.userInfo.userEntity.nickName
                },
                {
                  tagName: 'tag14',
                  tagContent: this.userInfo.sysDeptEntity.fullDeptName ? this.userInfo.sysDeptEntity.fullDeptName : ''
                },

                {
                  tagName: 'tag17',
                  tagContent: this.form.caseName
                },
                {
                  tagName: 'tag18',
                  tagContent: this.form.desc
                }
              ],

              sourceId: this.simpleId,
              writType: 'DSRCSSBBL'
            }

            this.writBtnList = {
              closePdf: true,
              updatePdf: true,
              signPdf: true,
              finishPdf: true
            }
            this.writName = '当事人陈述申辩笔录'
            console.info('update', this.isUpdate)
            if (this.isUpdate === true && this.updateWritId) {
              updateWrit({ writId: this.updateWritId }, params.data).then(res => {
                this.pdfId = this.updateWritId
                this.preview(this.pdfId)
                this.writTypeCode = res.writType
                this.showPdfDialog = true
                this.isUpdate = false
                this.getSimpleWritList()
                this.clearDataInfo()
              })
            } else {
              makeDisposalDocument(params).then(
                res => {
                  console.log('makeDisposalDocument', res)
                  this.pdfId = res.writId
                  this.preview(this.pdfId)
                  this.writTypeCode = res.writType
                  this.showPdfDialog = true
                  this.getSimpleWritList()
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

    // 单位
    saveOrgPenaltyDecision() {
      console.log('我在单位里制作行政处罚决定书')
      if (this.ruleForm.region === '罚款' && this.ruleForm.number === null) {
        this.$message.error('罚款金额不能为空!')
      } else {
        if (this.ruleForm.region === '罚款' && this.ruleForm.number <= 0) {
          this.$message.error('罚款金额要大于0!')
        } else {
          this.writBtnList = {
            closePdf: true,
            updatePdf: true,
            sealPdf: true,
            signPdf: true,
            finishPdf: true
          }
          let params = {
            contractorIds: this.tableHeadInfo.executorId,
            sourceId: this.simpleId,
            userId: 'test1',
            writType: 'XXDCCFJDSDW',
            data: [
              {
                tagName: 'tag2',
                tagContent: this.tableHeadInfo.companyName
              },
              {
                tagName: 'tag3',
                tagContent: this.ruleForm.address
              },
              {
                tagName: 'tag4',
                tagContent: this.ruleForm.zipCode
              },
              {
                tagName: 'tag5',
                tagContent: this.ruleForm.representative
              },
              {
                tagName: 'tag6',
                tagContent: this.ruleForm.personPost
              },
              {
                tagName: 'tag7',
                tagContent: this.ruleForm.phone
              },
              {
                tagName: 'tag8',
                tagContent: this.ruleForm.descA
              },
              {
                tagName: 'tag9',
                tagContent: this.ruleForm.descB
              },
              {
                tagName: 'tag10',
                tagContent: this.ruleForm.descC
              },
              {
                tagName: 'tag11',
                tagContent: this.ruleForm.region
                  ? this.ruleForm.region == '警告'
                    ? this.ruleForm.region + ''
                    : this.ruleForm.region + '人民币' + (this.ruleForm.number ? toSuperMoney(this.ruleForm.number) : '')
                  : ''
              },
              {
                tagName: 'tag12',
                tagContent: this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? this.ruleForm.bank : ''
              },
              {
                tagName: 'tag13',
                tagContent: this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? this.ruleForm.bankAccount : ''
              },
              {
                tagName: 'tag14',
                tagContent: this.userInfo.sysDeptEntity.government
              },
              {
                tagName: 'tag15',
                tagContent: this.userInfo.sysDeptEntity.bureau
              },
              {
                tagContent: this.userInfo.sysDeptEntity.court,
                tagName: 'tag16'
              },
              {
                tagContent: this.ruleForm.region == '警告' ? 'false' : this.ruleForm.region == '罚款' && this.ruleForm.decision == 1 ? 'true' : 'false',
                tagName: 'tag121'
              },
              {
                tagContent: this.ruleForm.region == '警告' ? 'false' : this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? 'true' : 'false',
                tagName: 'tag122'
              },
              {
                tagContent: this.ruleForm.number,
                tagName: 'tagMoney'
              }
            ]
          }
          // this.writName = "行政（当场）处罚决定书";
          if (this.isUpdate && this.updateWritId) {
            updateWrit({ writId: this.updateWritId }, params.data).then(res => {
              console.log('更改单位制作行政处罚决定书', params, res)
              this.isUpdate = false
              this.writTypeCode = res.writType
              this.pdfId = this.updateWritId
              this.preview(this.pdfId)
              this.setWritBtn(res.writType)
              this.getSimpleWritList()
              this.showPdfDialog = true
              this.clearDataInfo()
            })
          } else {
            makeDisposalDocument(params)
              .then(res => {
                console.log('制作单位制作行政处罚决定书', params, res)
                this.pdfId = res.writId
                this.preview(this.pdfId)
                this.writTypeCode = res.writType
                this.showPdfDialog = true
                this.dialogFormVisibles = false
                this.getSimpleWritList()
                this.setWritBtn(res.writType)
                this.clearDataInfo()
              })
              .catch(err => {
                console.log('请求失败', err)
              })
          }
        }
      }
    },
    // 设置文书按钮状态
    setWritBtn(code) {
      let writTypeInfo = JSON.parse(sessionStorage.writTypeInfo)
      let item = writTypeInfo.find(i => {
        return i.id === code
      })
      // console.info("item==>", item);
      this.writBtnList = {
        closePdf: true, //退出
        updatePdf: true, //回退编辑
        auditPdf: item.isAudit == 1, // 提交审核
        sealPdf: item.isSign == 1, // 加盖公章
        signPdf: item.userType == 1, // 签名
        lawSealPdf: item.isSign == 2, // 加盖执法专用章
        finishPdf: true //完成
      }
      this.writTypeCode = item.auditTypeCode //提交审核 传的 auditTypeCode
      this.writName = item.typeName
    },
    clearInfo() {
      for (let item in this.form) {
        if (item == 'caseName' || item == 'value' || item == 'NXaddress' || item == 'place' || item == 'zipCode') continue
        this.form[item] = null
      }
      this.select = '单位'
      this.ruleForm.region = '警告'
      this.ruleForm.decision = 1
      this.isShow = false
      for (let item in this.ruleForm) {
        if (
          item == 'address' ||
          item == 'zipCode' ||
          item == 'representative' ||
          item == 'personName' ||
          item == 'phone' ||
          item == 'region' ||
          item == 'homeAddress' ||
          item == 'unitAddress' ||
          item == 'contactPhone' ||
          item == 'post' ||
          item == 'personPost' ||
          item == 'decision' ||
          item == 'bankP' ||
          item == 'bank' ||
          item == 'bankAccountP' ||
          item == 'bankAccount'
        )
          continue
        this.ruleForm[item] = null
      }
      // console.log(this.form);
      // console.log(this.ruleForm);
    },
    // 清空表单数据
    clearDataInfo() {
      for (let item in this.ruleForm) {
        this.select = '单位'
      }
    },
    //个人
    savePerPenaltyDecision() {
      console.info('制作个人新增行政处罚决定书')
      if (this.ruleForm.region == '罚款' && this.ruleForm.number == null) {
        this.$message.error('罚款金额不能为空!')
      } else {
        if (this.ruleForm.region == '罚款' && this.ruleForm.number <= 0) {
          this.$message.error('罚款金额要大于0!')
        } else {
          this.writBtnList = {
            closePdf: true,
            updatePdf: true,
            sealPdf: true,
            signPdf: true,
            finishPdf: true
          }
          let params = {
            contractorIds: this.tableHeadInfo.executorId,
            sourceId: this.simpleId,
            userId: 'test1',
            writType: 'XXDCCFJDSGR',
            data: [
              {
                tagName: 'tag2',
                tagContent: this.ruleForm.personName
              },
              {
                tagName: 'tag3',
                tagContent: this.ruleForm.sex
              },
              {
                tagName: 'tag4',
                tagContent: this.ruleForm.age
              },
              {
                tagName: 'tag5',
                tagContent: this.ruleForm.idCard
              },
              {
                tagName: 'tag6',
                tagContent: this.ruleForm.homeAddress
              },
              {
                tagName: 'tag7',
                tagContent: this.tableHeadInfo.companyName
              },
              {
                tagName: 'tag8',
                tagContent: this.ruleForm.post
              },
              {
                tagName: 'tag9',
                tagContent: this.ruleForm.unitAddress
              },
              {
                tagName: 'tag10',
                tagContent: this.ruleForm.contactPhone
              },
              {
                tagName: 'tag11',
                tagContent: this.ruleForm.descA
              },
              {
                tagName: 'tag12',
                tagContent: this.ruleForm.descB
              },
              {
                tagName: 'tag13',
                tagContent: this.ruleForm.descC
              },
              {
                tagName: 'tag14',
                tagContent: this.ruleForm.region
                  ? this.ruleForm.region == '警告'
                    ? this.ruleForm.region + ''
                    : this.ruleForm.region + '人民币' + (this.ruleForm.number ? toSuperMoney(this.ruleForm.number) : '')
                  : ''
              },
              {
                tagName: 'tag15',
                tagContent: this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? this.ruleForm.bankP : ''
              },
              {
                tagName: 'tag16',
                tagContent: this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? this.ruleForm.bankAccountP : ''
              },
              {
                tagName: 'tag17',
                tagContent: this.userInfo.sysDeptEntity.government
              },
              {
                tagName: 'tag18',
                tagContent: this.userInfo.sysDeptEntity.bureau
              },
              {
                tagName: 'tag19',
                tagContent: this.userInfo.sysDeptEntity.court
              },
              {
                tagContent: this.ruleForm.region == '警告' ? 'false' : this.ruleForm.region == '罚款' && this.ruleForm.decision == 1 ? 'true' : 'false',
                tagName: 'tag121'
              },
              {
                tagContent: this.ruleForm.region == '警告' ? 'false' : this.ruleForm.region == '罚款' && this.ruleForm.decision == 2 ? 'true' : 'false',
                tagName: 'tag122'
              },
              {
                tagContent: this.ruleForm.number,
                tagName: 'tagMoney'
              }
            ]
          }
          // this.writName = "行政（当场）处罚决定书";
          if (this.isUpdate && this.updateWritId) {
            updateWrit({ writId: this.updateWritId }, params.data).then(res => {
              this.pdfId = this.updateWritId
              this.showPdfDialog = true
              this.isUpdate = false
              this.setWritBtn(res.writType)
              this.getSimpleWritList()
              // this.dialogFormVisibles = false;
              // this.updateWritId = null;
              // this.writTypeCode = res.writType;
              // this.preview(this.pdfId);
              // this.clearDataInfo();
            })
          } else {
            makeDisposalDocument(params)
              .then(res => {
                this.pdfId = res.writId
                this.showPdfDialog = true
                this.setWritBtn(res.writType)
                this.getSimpleWritList()
                // this.writTypeCode = res.writType;
                // this.preview(this.pdfId);
                // this.dialogFormVisibles = false;
              })
              .catch(err => {
                console.info('请求失败', err)
              })
          }
        }
      }
    },
    // 切换处罚
    selectChange() {
      if (this.ruleForm.region == '罚款') {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    change(val) {
      this.ruleForm.decision = val
      // console.log(val, "qqq");
    },
    // 获取简易行政处罚文书列表
    getSimpleWritList() {
      simpleDocumentList({
        id: this.simpleId
      }).then(res => {
        this.docCardList = res.data
      })
    },
    toSeal(audiReq) {
      this.audiReq = audiReq
      this.isSelectPeople = true
    },
    // 查询文书列表
    queryWritList() {
      // this.isSelectPeople = false
      this.showPdfDialog = false
      this.writBtnList = {}
      this.getSimpleWritList()
      this.dialogFormVisibles = false
      this.dialogFormVisible = false
    },
    submitSeal(val) {
      let data = {
        auditTypeCode: 'ta80040',
        handlerDeptId: val.deptId,
        handlerUserId: val.peopleId,
        requestDeptName: this.tableHeadInfo.executorDeptName,
        requestId: val.pdfId,
        requestTime: this.tableHeadInfo.examineStartTime
          ? this.tableHeadInfo.examineStartTime
              .split(' ')[0]
              .replace('/', '年')
              .replace('/', '月') + '日'
          : '',
        requestUsersName: this.tableHeadInfo.executorName,
        submitterCause: this.tableHeadInfo.companyName,
        requestUsersIds: this.tableHeadInfo.executorId,
        partyId: this.tableHeadInfo.companyId ? this.tableHeadInfo.companyId : '',
        partyName: this.tableHeadInfo.companyName ? this.tableHeadInfo.companyName : ''
      }
      sealAudit(data).then(
        () => {
          this.$message({
            type: 'success',
            message: '提交审核成功！'
          })
          this.showPdfDialog = false
          this.dialogContent = null
          this.isSelectPeople = false
          this.getSimpleWritList()
        },
        () => {
          this.$message({
            type: 'error',
            message: '提交审核失败'
          })
        }
      )
    },
    submitToAudition(bool, auditor) {
      if (bool === false) {
        this.isSelectPeople = false
      } else {
        let data = {
          auditTypeCode: this.audiReq.auditTypeCode,
          handlerDeptId: auditor[0].deptId,
          handlerUserId: auditor[0].id,
          requestDeptName: this.tableHeadInfo.executorDeptName,
          requestId: this.audiReq.requestId,
          requestTime: this.tableHeadInfo.examineStartTime
            ? this.tableHeadInfo.examineStartTime
                .split(' ')[0]
                .replace('/', '年')
                .replace('/', '月') + '日'
            : '',
          requestUsersName: this.audiReq.requestUsersName,
          submitterCause: this.audiReq.submitterCause,
          requestUsersIds: this.tableHeadInfo.executorId,
          partyId: this.tableHeadInfo.companyId ? this.tableHeadInfo.companyId : '',
          partyName: this.tableHeadInfo.companyName ? this.tableHeadInfo.companyName : ''
        }
        sealAudit(data).then(
          () => {
            this.$message({
              type: 'success',
              message: '提交审核成功！'
            })
            this.showPdfDialog = false
            this.dialogContent = null
            this.isSelectPeople = false
            this.getSimpleWritList()
          },
          () => {
            this.$message({
              type: 'error',
              message: '提交审核失败'
            })
          }
        )
      }
    },
    // 文书生成成功回调
    previewWrit(id, name, button, data) {
      console.info('simple admin penalty', id, name, button, data)
      if (id) {
        this.pdfId = id
        this.showPdfDialog = true
        this.writName = name
        this.writBtnList = button
        this.writTypeCode = data.writTypeCode
      } else {
        this.writBtnList = {
          closePdf: true
        }
      }
      this.clearDataInfo()
    },
    // 选择生成文书
    chooseWrit(key, type, id) {
      console.log('修改文书key', key)
      console.log('修改文书type', type)
      console.log('修改文书id', id)
      getWritDataByWritId({ writId: id }).then(res => {
        console.log('调chooseWrit返回的数据', res)
        let temp = []
        this.isUpdate = true
        this.updateWritId = id
        if (key.indexOf('申辩') !== -1) {
          this.writBtnList = {
            closePdf: true,
            updatePdf: true,
            signPdf: true
          }
          res.data.forEach(item => {
            switch (item.tagName) {
              case 'tag2':
                temp[0] = item.tagContent
                  ? item.tagContent
                      .replace('年', '-')
                      .replace('月', '-')
                      .replace('日', ' ')
                      .replace('时', ':')
                      .replace('分', '') + ':00'
                  : ''
                break
              case 'tag3':
                temp[1] = item.tagContent
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
              case 'tag9':
                this.form.phone = item.tagContent
                break
              case 'tag10':
                this.form.address = item.tagContent
                break
              case 'tag11':
                this.form.zipCode = item.tagContent
                break
              case 'tag17':
                this.form.caseName = item.tagContent
                break
              case 'tag18':
                this.form.desc = item.tagContent
                break
            }
          })
          this.dialogFormVisible = true
        }
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
                this.ruleForm.personPost = item.tagContent
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
              // case "tag12":
              //   this.ruleForm.bank = item.tagContent;
              //   break;
              // case "tag13":
              //   this.ruleForm.bankAccount = item.tagContent;
              //   break;
              case 'tag11':
                this.ruleForm.region = item.tagContent.substring(0, 2)
                // console.info("转数字", toCommonMoney(item.tagContent));
                // this.ruleForm.number = toCommonMoney(item.tagContent);
                break
              case 'tag121':
                this.ruleForm.decision = item.tagContent == 'true' ? 1 : 2
                break
              case 'tag122':
                this.ruleForm.decision = item.tagContent == 'true' ? 2 : 1
                break
              // case "tagMoney":
              //   this.ruleForm.number = item.tagContent;
              //   break;
            }
          })
          this.isShow = this.ruleForm.region.indexOf('罚款') !== -1
          this.dialogFormVisibles = true
          this.personalDisabled = true
          this.unitDisabled = true
        }
        // 个人处罚决定书
        if (key.indexOf('个人') !== -1) {
          this.writBtnList = {
            closePdf: true,
            updatePdf: true,
            sealPdf: true,
            signPdf: true,
            finishPdf: true
          }
          this.select = '个人'
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
                // this.ruleForm.number = toCommonMoney(item.tagContent);
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
                this.ruleForm.post = item.tagContent
                break
              case 'tag9':
                this.ruleForm.unitAddress = item.tagContent
                break
              case 'tag10':
                this.ruleForm.contactPhone = item.tagContent
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
        this.value = temp
      })
    },
    resetState() {
      this.isUpdate = false
      this.updateWritId = null
      this.dialogFormVisible = false
      this.dialogFormVisibles = false
      // 手动关掉回退编辑模态框
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.clearDataInfo()
    }
  },
  computed: {
    ...mapState([
      'tableHeadInfo',
      'tableId',
      'simpleId'
      // "businessAddressFull",
      // "postalCode",
      // "contactPhone"
    ])
  },
  mounted() {
    // Bus.$on("simplePenaltyId", simplePenaltyId => {
    //   this.simplePenaltyId = simplePenaltyId;
    //   sessionStorage.setItem("simplePenaltyId", this.simplePenaltyId);
    //   // console.log("从处理传过来的id",this.simplePenaltyId)
    // });
  }
}
</script>

<style lang='less' scoped>
.penaltyStyle {
  /deep/ .el-col-5 {
    width: 84px;
  }
}
.answerAndQuestion {
  border: 1px solid #ccc;
  width: 95%;
  height: 365px;
  overflow: auto;
  text-decoration: none;
  resize: none;
  border-radius: 5px;
}
.simpleAdminPenaltyRequired {
  position: relative;
}
.simpleAdminPenaltyRequired:before {
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
.marTop {
  position: fixed;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  padding: 0 40%;
  left: auto;
  z-index: 999;
  bottom: 0px;
}
.btnGroup {
  margin-top: 40px;
}
.check-bac {
  margin: 100px auto 100px;
  height: 131px;
  width: 193px;
  background: url('~@/assets/imgs/receipt.jpg') no-repeat 50% 24px;
  background-size: 194px 97px;
  &::after {
    content: '暂无简易处罚';
    position: relative;
    top: 122px;
    left: 29%;
    color: #999999;
  }
  .bac {
    height: 179px;
  }
}
.form-body-center {
  display: flex;
}
.Record_form-left {
  width: 46%;
  height: 100%;
  margin: 10px 20px 10px 20px;
}
.simp_form-left {
  width: 46%;
  height: 100%;
  margin: 0px 20px 10px 20px;
}
.form-right {
  width: 48%;
  height: 100%;
  color: #333;
  li {
    list-style: none;
    height: 14px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 14px;
    padding: 10px 0px;
  }
}
/deep/.el-form-item {
  margin-bottom: 5px;
}

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
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 26px;
  }
}
/deep/.el-dialog__wrapper .el-dialog__header .el-dialog__title {
  width: 142px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}

/deep/.el-form-item__label {
  text-align: left;
}
/deep/.el-form--label-top .el-form-item__label {
  padding: 0px;
}
.input-second {
  width: 414px;
  height: 30px;
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 5px;
}

// /deep/ .el-dialog__wrapper .el-dialog__footer {
//   // margin: 10px 0px 42px;
//   // padding: 1px;
//   padding-right: 10px;
//   margin-top: 40px;
// }

.simple_content {
  box-sizing: border-box;
  width: 100%;
  border-radius: 8px;
  height: 100%;
}
.content-list {
  line-height: 40px;
  color: #333333;
  width: 100%;
  border-bottom: none;
  display: flex;
}
/deep/.el-dialog__body {
  padding: 0;
}
/deep/.el-radio-group {
  margin-left: 0px;
}
.form-right_text {
  width: 50%;
  height: 100%;
  color: #333;
  padding-top: 50px;
  span {
    display: block;
    width: 400px;
    height: 20px;
    line-height: 20px;
    margin-bottom: 5px;
  }
  .span-1 {
    margin-bottom: 0px;
  }
  .input-text {
    width: 91%;
    height: 30px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 5px;
    padding: 0 2% 0 2%;
    margin-bottom: 10px;
  }
}
.input-right {
  border: 1px solid #ccc;
  width: 92%;
  height: 40px;
  resize: none;
  padding: 6px 7px;
  border-radius: 5px;
}
/deep/.el-select {
  width: 100%;
}
.el-date-editor--datetimerange.el-input__inner {
  width: 100%;
}
/deep/.el-dialog__wrapper .el-dialog__footer {
  margin: 0px;
}
/deep/.el-icon-time:before {
  content: '';
}
/deep/.el-date-editor .el-range-input {
  width: 80%;
}
.writ-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 17px;
}
//  /deep/.el-input__icon{
//    width: 0px;
//  }
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
  width: 9px;
  height: 11px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 73, 1, 1);
  padding-left: 4px;
}
/deep/.el-dialog {
  margin-top: 5vh !important;
}
/deep/.el-form-item--small {
  margin-bottom: 5px !important;
}
.col_label {
  text-align: justify;
  text-align-last: justify;
  padding-right: 20px;
  width: 90px!important;
  position: relative;
  &:after {
    content: ':';
    position: absolute;
    right: 12px;
  }
}
</style>
