<template>
  <div>
    <div class="notice-writ_content writ-overflow">
      <el-form ref="notice" :model="notice" label-width="130px" :rules="rules" label-position="left" :show-message="false">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="subject">
              <div slot="label" class="slot_label">当事人</div>
              <el-input v-model="notice.subject" placeholder="当事人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px">
              <div slot="label" class="slot_label">是否告知听证</div>
              <el-radio :disabled="isHearNeed" v-model="notice.radio" label="1">是</el-radio>
              <el-radio :disabled="isHearNeed" v-model="notice.radio" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item class="mt5" prop="illegal">
            <div slot="label" class="slot_label">违法事实</div>
            <el-input class="vabo" type="textarea" v-model="notice.illegal" :autosize="{ minRows: 1 }" placeholder="违法事实"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="mt5" prop="evidence">
            <div slot="label" class="slot_label">违法证据</div>
            <el-input class="vabo" type="textarea" v-model="notice.evidence" :autosize="{ minRows: 1 }" placeholder="违法证据"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="mt5" prop="laws">
            <div slot="label" class="slot_label">法律规定</div>
            <el-input type="textarea" class="vabo" v-model="notice.laws" :autosize="{ minRows: 1 }" placeholder="法律法规"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="mt5" prop="punish">
            <div slot="label" class="slot_label">处罚依据</div>
            <el-input class="vabo" type="textarea" v-model="notice.punish" :autosize="{ minRows: 1 }" placeholder="处罚依据"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="mt5" prop="penaltyDecision">
            <div slot="label" class="slot_label">处罚决定</div>
            <el-input class="vabo" type="textarea" v-model="notice.penaltyDecision" :autosize="{ minRows: 1 }" placeholder="处罚决定"></el-input>
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="penaltyAmount">
              <div slot="label" class="slot_label">处罚金额</div>
              <el-input @change="changeAmount" v-model="notice.penaltyAmount" placeholder="处罚金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fullDeptName">
              <div slot="label" class="slot_label">处罚单位</div>
              <el-input v-model="notice.fullDeptName" placeholder="处罚单位"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="address">
              <div slot="label" class="slot_label">处罚单位地址</div>
              <el-input v-model="notice.address" placeholder="处罚单位地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="contactor">
              <div slot="label" class="slot_label">联系人</div>
              <el-input v-model="notice.contactor" placeholder="联系人" @focus="handleContractor">
                <i class="el-icon-more" slot="suffix" @click="handleContractor"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="notice.phone" placeholder="联系电话" maxlength="12"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="postCode">
              <div slot="label" class="slot_label">邮政编码</div>
              <el-input v-model="notice.postCode" placeholder="邮政编码" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure" :disabled="!isCreateAllowed">保存并生成行政处罚告知书</el-button>
      <!-- <el-button type="primary" @click="seal" :disabled="!isAuditAllowed">加盖公章</el-button> -->
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat, handleDateRef, toSuperMoney, debounce, getFirstErrMsg, stringToDate } from '@/utils/util'
import { handleWritStatus } from '@/utils/audit'
import { getCritBasicInfo } from '@/api/anjianshenli'
import { getComInfo } from '@/api/onSiteInspection/index'
export default {
  props: ['info', 'isRecalled', 'selectedPeople'],
  data() {
    return {
      isCreateAllowed: false,
      isAuditAllowed: false,
      isHearNeed: false, // 是否必须听证
      notice: {
        subject: '', //被处罚单位: tag2
        illegal: '', //违法事实: tag3
        evidence: '', // 证据: tag4
        laws: '', //法律法规: tag5
        punish: '', //处罚依据: tag6
        penaltyDecision: '', //处罚决定: tag7
        fullDeptName: '', // 应急管理局：tag8
        address: '', // 应急管理局部门地址: tag9
        contactor: '', // 联系人：tag10
        phone: '', // 联系电话: tag11
        postCode: '', // 邮编: tag12
        penaltyAmount: '', // 处罚金额
        decisionTime: void 0, // 决定时间
        radio: '0' // 当事人是否申请听证
      },
      rules: {
        subject: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入当事人'
          }
        ],
        illegal: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入违法事实'
          }
        ],
        evidence: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入违法证据'
          }
        ],
        laws: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入法律规定'
          }
        ],
        punish: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入处罚依据'
          }
        ],
        penaltyDecision: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入处罚决定'
          }
        ],
        penaltyAmount: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入处罚金额'
          }
        ],
        fullDeptName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入处罚单位'
          }
        ],
        address: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入处罚单位地址'
          }
        ],
        contactor: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择联系人'
          }
        ],
        phone: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入联系电话'
          },
          {
            pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        postCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入邮政编码'
          },
          {
            pattern: /^[0-9]\d{5}(?!\d)$/,
            trigger: ['blur', 'change'],
            message: '您输入的邮编格式不正确'
          }
        ]
      },
      currentContactorId: ''
    }
  },
  created() {
    if (this.info.writInfo) {
      let _cId = ''
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.subject = item.tagContent
            break
          case 'tag3':
            total.illegal = item.tagContent
            break
          case 'tag4':
            total.evidence = item.tagContent
            break
          case 'tag5':
            total.laws = item.tagContent
            break
          case 'tag6':
            total.punish = item.tagContent
            break
          case 'tag7':
            total.penaltyDecision = item.tagContent
            break
          case 'tag8':
            total.fullDeptName = item.tagContent
            break
          case 'tag9':
            total.address = item.tagContent
            break
          case 'tag10':
            total.contactor = item.tagContent
            break
          case 'tag11':
            total.phone = item.tagContent
            break
          case 'tag12':
            total.postCode = item.tagContent
            break
          case 'isZZTZ':
            total.radio = item.tagContent
            break
          case 'penaltyAmount_Shaw':
            total.penaltyAmount = item.tagContent
            break
          case 'currentContactorId':
            _cId = item.tagContent
            break
        }
        return total
      }, {})
      this.currentContactorId = _cId
      this.notice = inputInfo
      this.setHear(this.notice.penaltyAmount)
    } else {
      this.initInfo()
    }

    this.initButtons()
  },
  mounted() {
    this.sure = debounce(this.sure, 1000)
  },
  methods: {
    // 设置按钮状态
    initButtons() {
      if (this.isRecalled === '1' && this.info.auditInfo.processVersion > this.info.writVersion) {
        // 当流程回退时 且审核审批信息为回退前
        this.isCreateAllowed = true
        return
      }
      let res = handleWritStatus(this.info.auditInfo.writId)
      res.then(data => {
        if (data) {
          this.isCreateAllowed = data.isCreateAllowed
          this.isAuditAllowed = data.isAuditAllowed
        }
      })
    },
    // 提交盖章
    seal() {
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: '', // 审核人部门 id
        handlerUserId: '', // 审核人
        requestDeptName: JSON.parse(localStorage.getItem('res')).sysDeptEntity.name, // 承办人部门
        requestId: this.info.auditInfo.writId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.info.auditInfo.responsiblePerson, // 承办人名称
        submitterCause: this.info.auditInfo.companyName // 案件名称 或 企业名称
      }
      this.$emit('toSeal', _audiReq)
    },
    sure() {
      this.$refs.notice.validate((val, errInfo) => {
        if (val) {
          let data = getWritParams({
            tag2: this.notice.subject,
            tag3: this.notice.illegal,
            tag4: this.notice.evidence,
            tag5: this.notice.laws,
            tag6: this.notice.punish,
            tag7: this.notice.penaltyDecision,
            tag8: this.notice.fullDeptName,
            tag9: this.notice.address,
            tag10: this.notice.contactor,
            tag11: this.notice.phone,
            tag12: this.notice.postCode,
            isZZTZ: this.notice.radio,
            penaltyAmount_Shaw: this.notice.penaltyAmount,
            currentContactorId: this.currentContactorId
          })
          let params = {
            companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XXCFGZ',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },
    // 是否强制听证
    setHear(amount) {
      if (Number(amount) >= 20000) {
        this.isHearNeed = true
      } else {
        this.isHearNeed = false
      }
    },
    // 修改处罚金额
    changeAmount() {
      this.setHear(this.notice.penaltyAmount)
    },
    initInfo() {
      let arr = [],
        laws = [],
        punish = []
      let user = JSON.parse(localStorage.getItem('res'))
      // 获取当前案件的处罚信息
      getCritBasicInfo({ penaltyId: this.info.auditInfo.sourceId }).then(res => {
        let moneyDes = '，并处人民币' + toSuperMoney(Number(res.data.sumMoney)) + '罚款'
        this.setHear(res.data.sumMoney)
        this.notice = {
          subject: this.info.auditInfo.subject, //被处罚单位: tag2
          illegal: this.handleTags('actName', '违法事实：'), //违法事实: tag3
          evidence: '', // 证据: tag4
          laws: this.handleTags('lawContentRule', '法律规定条款：'), //法律法规: tag5
          punish: this.handleTags('penaltyAcdNameRule', '处罚依据条款：'), //处罚依据: tag6
          penaltyDecision: this.info.auditInfo.handleSuggInfo + moneyDes, //处罚决定: tag7
          fullDeptName: user.sysDeptEntity.fullDeptName, // 应急管理局：tag8
          address: user.sysDeptEntity.deptAddress, // 应急管理局部门地址: tag9
          contactor: user.userEntity.nickName, // 联系人：tag10
          phone: user.userEntity.mobile, // 联系电话: tag11
          postCode: user.sysDeptEntity.postCode, // 邮编: tag12
          penaltyAmount: res.data.sumMoney, // 处罚金额
          decisionTime: new Date(), // 决定时间
          radio: this.isHearNeed ? '1' : '0'
        }
        this.currentContactorId = user.userEntity.id
      })
    },
    handleTags(type, char) {
      let arr = []
      if (this.info.auditInfo.blcList.length === 0) return
      this.info.auditInfo.blcList.map(item => {
        arr.push(item[type])
      })
      if (type === 'actName') {
        return arr.filter(Boolean).join('') + '。'
      } else {
        return arr.filter(Boolean).join(',')
      }
    },
    handleContractor() {
      // type, cache
      this.$emit('selectPeople', 'contactor', {
        id: this.currentContactorId,
        nickName: this.notice.contactor
      })
    },
    choicePeople(val) {
      this.$nextTick(() => {
        this.currentContactorId = val[0].id
        this.$set(this.notice, 'contactor', val[0].nickName)
        this.$set(this.notice, 'phone', val[0].mobile)
      })
    }
  },
  watch: {
    selectedPeople: {
      handler: function(val, oldVal) {
        // this.$nextTick(()=>{
        this.choicePeople(val)
        // })
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.notice-writ_content {
  padding: 0 16px;
  /deep/ .el-form-item {
    margin-bottom: 0;
    /deep/ .el-input {
      width: 100%;
    }
    .el-textarea + .el-textarea {
      margin-top: 10px;
    }
  }
  .hearing {
    /deep/ .el-form-item__label {
      padding: 0;
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
