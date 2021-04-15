<template>
  <div>
    <div class="decision-person-content">
      <el-form ref="personDeci" :rules="rules" :model="notice" :inline-message="true" :show-message="false" label-width="100px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="" prop="nickName">
              <div slot="label" class="slot_label">被处罚人</div>
              <el-input v-model="notice.nickName" placeholder="被处罚人员"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="sex">
              <div slot="label" class="slot_label">性别</div>
              <el-select v-model="notice.sex" placeholder="请选择性别">
                <el-option label="女" value="女"></el-option>
                <el-option label="男" value="男"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="age">
              <div slot="label" class="slot_label">年龄</div>
              <el-input v-model="notice.age" placeholder="年龄"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="" prop="idCard">
              <div slot="label" class="slot_label">身份证号</div>
              <el-input v-model="notice.idCard" placeholder="请输入身份证号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="location">
              <div slot="label" class="slot_label">家庭住址</div>
              <el-input v-model="notice.location" placeholder="请输入家庭住址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="position">
              <div slot="label" class="slot_label">职务</div>
              <el-input v-model="notice.position" placeholder="请输入职务"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="" prop="company">
              <div slot="label" class="slot_label">所在单位</div>
              <el-input v-model="notice.company" placeholder="请输入所在单位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="companyAddr">
              <div slot="label" class="slot_label">单位地址</div>
              <el-input v-model="notice.companyAddr" placeholder="请输入单位地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="postCode">
              <div slot="label" class="slot_label">邮政编码</div>
              <el-input v-model="notice.postCode" placeholder="请输入单位邮政编码" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" class="mt5" prop="illeAndEvidence">
              <div slot="label" class="slot_label">违法事实及证据</div>
            <el-input v-model="notice.illeAndEvidence" class="vab" :autosize="{ minRows: 1 }" type="textarea" placeholder="请输入违法事实及证据"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" class="mt5" prop="laws">
              <div slot="label" class="slot_label">法律规定</div>
            <el-input class="vab" v-model="notice.laws" type="textarea" :autosize="{ minRows: 1 }" placeholder="请输入法律规定"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" class="mt5" prop="punish">
              <div slot="label" class="slot_label">处罚依据</div>
            <el-input class="vab" v-model="notice.punish" type="textarea" :autosize="{ minRows: 1 }" placeholder="请输入处罚依据"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" class="mt5" prop="penaltyDecision">
              <div slot="label" class="slot_label">处罚决定</div>
            <el-input class="vab" v-model="notice.penaltyDecision" type="textarea" :autosize="{ minRows: 1 }" placeholder="请输入处罚决定"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="" prop="penaltyAmount">
              <div slot="label" class="slot_label">处罚金额</div>
              <el-input v-model="notice.penaltyAmount" placeholder="请输入处罚金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="bank">
              <div slot="label" class="slot_label">缴纳银行</div>
              <el-input v-model="notice.bank" placeholder="请输入缴纳银行"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="bankAccount">
              <div slot="label" class="slot_label">银行账号</div>
              <el-input v-model="notice.bankAccount" placeholder="请输入银行账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="dialog-footer" style="margin-top: 20px;text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成行政处罚决定书（个人）</el-button>
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat, getFirstErrMsg } from '@/utils/util'
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
        nickName: [{ required: true, message: '请输入被处罚人', trigger: 'blur' }],
        sex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        idCard: [
          { required: true, trigger: ['blur', 'change'], message: '请填写身份证号' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            trigger: ['blur', 'change'],
            message: '您输入的身份证号码格式不正确'
          }
        ],
        location: [{ required: true, message: '请输入家庭住址', trigger: 'blur' }],
        company: [{ required: true, message: '请输入所在单位', trigger: 'blur' }],
        position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
        companyAddr: [{ required: true, message: '请输入单位地址', trigger: 'blur' }],
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
        illeAndEvidence: [{ required: true, message: '请输入违法行为及证据', trigger: 'blur' }],
        laws: [{ required: true, message: '请输入法律规定', trigger: 'blur' }],
        punish: [{ required: true, message: '请输入处罚依据', trigger: 'blur' }],
        penaltyDecision: [{ required: true, message: '请输入处罚决定', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        government: [{ required: true, message: '请输入政府', trigger: 'blur' }],
        fullDeptName: [{ required: true, message: '请输入应急管理局', trigger: 'blur' }],
        court: [{ required: true, message: '请输入法院', trigger: 'blur' }],
        penaltyAmount: [{ required: true, message: '请输入处罚金额', trigger: 'blur' }]
      },
      notice: {
        nickName: '', // 被处罚人：tag2
        sex: '', // 性别：tag3
        age: '', // 年龄：tag4
        idCard: '', // 身份证号：tag5
        location: '', // 家庭住址：tag6
        company: '', // 所在单位：tag7
        position: '', // 职务：tag8
        companyAddr: '', // 单位地址：tag9
        postCode: '', // 邮政编码：tag10
        illeAndEvidence: '', // 违法行为及证据：tag11
        laws: '', // 法律规定: tag12
        punish: '', // 处罚依据：tag13
        penaltyDecision: '', // 处罚决定: tag14
        bank: '', // 银行：tag15
        bankAccount: '', // 银行账号：tag16
        government: '', // 政府：tag17
        fullDeptName: '', // 应急管理局：tag18
        court: '', // 法院：tag19
        penaltyAmount: ''
      }
    }
  },
  mounted() {
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
        requestWritType: 'XXCFJDSGR',
        requestTime: void 0,
        requestUsersName: this.info.responsiblePerson, // 承办人名称
        submitterCause: this.info.companyName // 案件名称 或 企业名称
      }
      this.$emit('toSeal', _audiReq)
    },
    sure() {
      this.$refs.personDeci.validate((valid, errInfo) => {
        if (valid) {
          let data = getWritParams({
            tag2: this.notice.nickName,
            tag3: this.notice.sex,
            tag4: this.notice.age,
            tag5: this.notice.idCard,
            tag6: this.notice.location,
            tag7: this.notice.company,
            tag8: this.notice.position,
            tag9: this.notice.companyAddr,
            tag10: this.notice.postCode,
            tag11: this.notice.illeAndEvidence,
            tag12: this.notice.laws,
            tag13: this.notice.punish,
            tag14: this.notice.penaltyDecision,
            tag15: this.notice.bank,
            tag16: this.notice.bankAccount,
            tag17: this.notice.government,
            tag18: this.notice.fullDeptName,
            tag19: this.notice.court,
            penaltyAmount_Maud: this.notice.penaltyAmount
          })
          let params = {
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XXCFJDSGR',
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
            total.nickName = item.tagContent
            break
          case 'tag3':
            total.sex = item.tagContent
            break
          case 'tag4':
            total.age = item.tagContent
            break
          case 'tag5':
            total.idCard = item.tagContent
            break
          case 'tag6':
            total.location = item.tagContent
            break
          case 'tag7':
            total.company = item.tagContent
            break
          case 'tag8':
            total.position = item.tagContent
            break
          case 'tag9':
            total.companyAddr = item.tagContent
            break
          case 'tag10':
            total.postCode = item.tagContent
            break
          case 'tag11':
            total.illeAndEvidence = item.tagContent
            break
          case 'tag12':
            total.laws = item.tagContent
            break
          case 'tag13':
            total.punish = item.tagContent
            break
          case 'tag14':
            total.penaltyDecision = item.tagContent
            break
          case 'tag15':
            total.bank = item.tagContent
            break
          case 'tag16':
            total.bankAccount = item.tagContent
            break
          case 'tag17':
            total.government = item.tagContent
            break
          case 'tag18':
            total.fullDeptName = item.tagContent
            break
          case 'tag19':
            total.court = item.tagContent
            break
          case 'penaltyAmount_Maud':
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

          // 获取当前案件的处罚信息
          this.notice = {
            nickName: this.info.auditInfo.subject,
            sex: this.info.auditInfo.sex === '1' ? '女' : '男',
            age: this.info.auditInfo.age,
            idCard: this.info.auditInfo.idCard,
            location: this.info.auditInfo.objectAddress,
            company: this.info.auditInfo.currentCompany,
            position: this.info.auditInfo.job,
            companyAddr: this.info.auditInfo.currentCompanyAddress,
            postCode: this.info.auditInfo.postCode,
            illeAndEvidence: `${this.handleTags('actName')}\n${evidence}`,
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
.decision-person-content {
  padding: 0 16px;
  /deep/ .el-form-item {
    margin-bottom: 0;
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
