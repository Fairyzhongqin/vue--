<template>
  <div>
    <div class="writ-overflow decision-content">
      <el-form ref="decision" :model="notice" :rules="rules" :inline-message="true" :show-message="false" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="8">
            <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">被处罚单位</div>
              <el-input v-model="notice.subject" placeholder="被处罚单位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="deci-pad-left" label="" prop="person">
              <div slot="label" class="slot_label">法定代表人</div>
              <el-input v-model="notice.person" placeholder="法定代表人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="deci-pad-left" label="" prop="position">
              <div slot="label" class="slot_label">职务</div>
              <el-input v-model="notice.position" placeholder="职务"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="" prop="objectAddress">
              <div slot="label" class="slot_label">地址</div>
              <el-input v-model="notice.objectAddress" placeholder="地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="deci-pad-left" label="" prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="notice.phone" placeholder="联系电话" maxlength="12"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="deci-pad-left" label="" prop="postCode">
              <div slot="label" class="slot_label">邮政编码</div>
              <el-input v-model="notice.postCode" placeholder="邮政编码" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" class="mb5" prop="illeAndEvi">
              <div slot="label" class="slot_label">违法事实及证据</div>
            <el-input class="vabo" type="textarea" v-model="notice.illeAndEvi" :autosize="{ minRows: 1 }" placeholder="违法事实"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" class="mb5" prop="laws">
              <div slot="label" class="slot_label">法律规定</div>
            <el-input class="vabo" type="textarea" v-model="notice.laws" :autosize="{ minRows: 1 }" placeholder="法律规定"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="处罚依据：" class="mb5" prop="punish">
              <div slot="label" class="slot_label">笔录时间</div>
            <el-input class="vabo" type="textarea" v-model="notice.punish" :autosize="{ minRows: 1 }" placeholder="处罚依据"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="penaltyDecision">
              <div slot="label" class="slot_label">处罚决定</div>
            <el-input type="textarea" v-model="notice.penaltyDecision" :autosize="{ minRows: 1 }" placeholder="处罚决定"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="" prop="penaltyAmount">
              <div slot="label" class="slot_label">处罚金额</div>
              <el-input v-model="notice.penaltyAmount" placeholder="处罚金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="deci-pad-left" label="" prop="bank">
              <div slot="label" class="slot_label">缴纳银行</div>
              <el-input v-model="notice.bank" placeholder="请输入缴纳银行"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="deci-pad-left" label="" prop="bankAccount">
              <div slot="label" class="slot_label">银行账号</div>
              <el-input v-model="notice.bankAccount" placeholder="请输入银行账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成行政处罚决定书（单位/个人）</el-button>
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat, getFirstErrMsg } from '@/utils/util'
import { getComInfo } from '@/api/onSiteInspection/index'
import { getCritBasicInfo } from '@/api/anjianshenli'
import { getDataInfo } from '@/api/enterpriseInfo'
import { getWritInfo, getWritDataByWritId } from '@/api/fileRelated'

export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      rules: {
        subject: [{ required: true, message: '请输入被处罚单位', trigger: 'blur' }],
        objectAddress: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
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
        ],
        person: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
        position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
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
        illeAndEvi: [{ required: true, message: '请输入违法事实及证据', trigger: 'blur' }],
        laws: [{ required: true, message: '请输入法律规定', trigger: 'blur' }],
        punish: [{ required: true, message: '请输入处罚依据', trigger: 'blur' }],
        penaltyDecision: [{ required: true, message: '请输入处罚决定', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入缴纳银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入缴纳账号', trigger: 'blur' }],
        government: [{ required: true, message: '请输入政府', trigger: 'blur' }],
        fullDeptName: [{ required: true, message: '请输入应急管理局', trigger: 'blur' }],
        court: [{ required: true, message: '请输入法院', trigger: 'blur' }],
        penaltyAmount: [{ required: true, message: '请输入处罚金额', trigger: 'blur' }]
      },
      notice: {
        subject: '', //被处罚单位: tag2
        objectAddress: '', //公司地址: tag3
        postCode: '', //邮编: tag4
        person: '', //法定代表人: tag5
        position: '', // 职务： tag6
        phone: '', //联系方式: tag7
        illeAndEvi: '', // 违法事实及证据: tag8
        laws: '', //法律规定: tag9
        punish: '', //处罚依据: tag10
        penaltyDecision: '', //处罚决定: tag11
        bank: '', //缴纳银行: tag12
        bankAccount: '', // 缴纳账号：tag13
        government: '', // 政府：tag14
        fullDeptName: '', // 应急管理局：tag15
        court: '', // 法院： tag16
        penaltyAmount: '' //处罚金额 penaltyAmount_Reech
      }
    }
  },
  created() {
    if (this.info.writInfo) {
      this.reflect()
    } else {
      this.initInfo()
    }
  },
  methods: {
    // 提交盖章
    seal() {
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: '', // 审核人部门 id
        handlerUserId: '', // 审核人
        requestDeptName: JSON.parse(localStorage.getItem('res')).userEntity.deptName, // 承办人部门，现在先不填
        requestId: this.info.writId, // 文书 writId
        requestWritType: 'XXCFJDSDW',
        requestTime: void 0,
        requestUsersName: this.info.responsiblePerson, // 承办人名称
        submitterCause: this.info.companyName // 案件名称 或 企业名称
      }
      this.$emit('toSeal', _audiReq)
    },
    sure() {
      this.$refs.decision.validate((valid, errInfo) => {
        if (valid) {
          let data = getWritParams({
            tag2: this.notice.subject,
            tag3: this.notice.objectAddress,
            tag4: this.notice.postCode,
            tag5: this.notice.person,
            tag6: this.notice.position,
            tag7: this.notice.phone,
            tag8: this.notice.illeAndEvi,
            tag9: this.notice.laws,
            tag10: this.notice.punish,
            tag11: this.notice.penaltyDecision,
            tag12: this.notice.bank,
            tag13: this.notice.bankAccount,
            tag14: this.notice.government,
            tag15: this.notice.fullDeptName,
            tag16: this.notice.court,
            penaltyAmount_Reech: this.notice.penaltyAmount
          })
          let params = {
            companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XXCFJDSDW',
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
    // 回显文书
    reflect() {
      let inputInfo = this.info.writInfo.reduce((total, item) => {
        switch (item.tagName) {
          case 'tag2':
            total.subject = item.tagContent
            break
          case 'tag3':
            total.objectAddress = item.tagContent
            break
          case 'tag4':
            total.postCode = item.tagContent
            break
          case 'tag5':
            total.person = item.tagContent
            break
          case 'tag6':
            total.position = item.tagContent
            break
          case 'tag7':
            total.phone = item.tagContent
            break
          case 'tag8':
            total.illeAndEvi = item.tagContent
            break
          case 'tag9':
            total.laws = item.tagContent
            break
          case 'tag10':
            total.punish = item.tagContent
            break
          case 'tag11':
            total.penaltyDecision = item.tagContent
            break
          case 'tag12':
            total.bank = item.tagContent
            break
          case 'tag13':
            total.bankAccount = item.tagContent
            break
          case 'tag14':
            total.government = item.tagContent
            break
          case 'tag15':
            total.fullDeptName = item.tagContent
            break
          case 'tag16':
            total.court = item.tagContent
            break
          case 'penaltyAmount_Reech':
            total.penaltyAmount = item.tagContent
            break
        }
        return total
      }, {})
      this.notice = inputInfo
    },
    initInfo() {
      let arr = [],
        laws = [],
        punish = [],
        evidence = ''
      let user = JSON.parse(localStorage.getItem('res'))

      getWritInfo({
        sourceId: this.info.auditInfo.sourceId,
        type: 'XXCFGZ'
      })
        .then(res => {
          return getWritDataByWritId({
            writId: res.data[0].writId
          })
        })
        .then(res => {
          res.data.map(_item => {
            if (_item.tagName === 'tag4') {
              evidence = _item.tagContent
            }
            this.notice.penaltyDecision = this.info.auditInfo.conclusion
            if (_item.tagName === 'penaltyAmount_Shaw') {
              this.notice.penaltyAmount = _item.tagContent
            }
          })
          return getDataInfo({ id: this.info.auditInfo.punishCompanyId })
        })
        // 获取当前案件的处罚信息
        .then(res => {
          this.notice = {
            subject: this.info.auditInfo.subject,
            objectAddress: res.data.businessAddressFull,
            postCode: this.info.auditInfo.postCode,
            person: res.data.legalPerson,
            position: res.data.primaryPersonJob,
            phone: res.data.legalPersonMobilephone,
            /* illeAndEvi: `${this.handleTags(
              "actName",
              "违法事实："
            )}\n证据：${evidence}`, */
            illeAndEvi: `${this.handleTags('actName', '违法事实：')}\n${evidence}`,
            laws: this.handleTags('lawContentRule', '法律规定条款：'),
            punish: this.handleTags('penaltyAcdNameRule', '处罚依据条款：'),
            penaltyDecision: this.info.auditInfo.conclusion,
            bank: user.sysDeptEntity.bank,
            bankAccount: user.sysDeptEntity.bankAccount,
            government: user.sysDeptEntity.government,
            fullDeptName: user.sysDeptEntity.bureau,
            court: user.sysDeptEntity.court,
            penaltyAmount: this.notice.penaltyAmount // 处罚金额
          }
        })
    },
    // 处理违法事实，法律规定内容，处罚依据内容
    handleTags(type, char) {
      let arr = []
      let spliter = type === 'actName' ? '；' : '、'
      this.info.auditInfo.blcList.map(item => {
        arr.push(item[type])
      })
      return arr.filter(Boolean).join(spliter)
    }
  }
}
</script>
<style lang="less" scoped>
.decision-content {
  padding: 0 16px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  .deci-pad-left /deep/ .el-form-item__label {
    padding-left: 10px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 30px;
}
</style>
