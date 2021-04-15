<template>
  <div class="appr-delay_content">
    <el-form ref="delayPay" :model="apprDelayInfo" :rules="rules" label-width="130px" label-position="left" :show-message="false">
      <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">当事人</div>
        <el-input v-model="apprDelayInfo.subject" placeholder="请输入当事人"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="decisionTime">
              <div slot="label" class="slot_label">决定时间</div>
            <el-date-picker v-model="apprDelayInfo.decisionTime" type="date" format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="writNoName">
              <div slot="label" class="slot_label">文书编号</div>
            <el-input v-model="apprDelayInfo.writNoName" placeholder="请输入文书编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="payMoney">
              <div slot="label" class="slot_label">罚款金额</div>
            <el-input v-model="apprDelayInfo.payMoney" placeholder="请输入罚款金额"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="" prop="radio">
              <div slot="label" class="slot_label">延期分期</div>
        <el-radio v-model="apprDelayInfo.radio" label="1">延期缴纳罚款</el-radio>
        <el-radio v-model="apprDelayInfo.radio" label="2">分期缴纳罚款</el-radio>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" v-if="apprDelayInfo.radio == '1'" prop="deadline">
              <div slot="label" class="slot_label">最后截止日期</div>
            <el-date-picker v-model="apprDelayInfo.deadline" type="date" format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="apprDelayInfo.radio == '2'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="term">
              <div slot="label" class="slot_label">第几期</div>
            <el-input v-model="apprDelayInfo.term" placeholder="请输入这是第几期" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="installmentDate">
              <div slot="label" class="slot_label">截止日期</div>
            <el-date-picker v-model="apprDelayInfo.installmentDate" type="date" format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="apprDelayInfo.radio === '2'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="pay">
              <div slot="label" class="slot_label">缴纳罚款金额</div>
            <el-input v-model="apprDelayInfo.pay" placeholder="请输入缴纳罚款金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="left">
              <div slot="label" class="slot_label">未缴纳金额</div>
            <el-input v-model="apprDelayInfo.left" placeholder="请输入未缴纳金额"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成延期（分期）缴纳罚款批准书</el-button>
      <!-- <el-button type="primary" @click="lawSeal" :disabled="lawDisabled">加盖执法专用章</el-button> -->
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat, toSuperMoney, toSuperDate, getFirstErrMsg, handleDateRef } from '@/utils/util'
import { getWritInfo, getWritDataByWritId, sealWrit } from '@api/fileRelated'
import { getCritBasicInfo } from '@/api/anjianshenli'

export default {
  props: ['info'],
  data() {
    return {
      rules: {
        subject: [{ required: true, trigger: 'blur', message: '请输入当事人' }],
        decisionTime: [{ required: true, trigger: 'blur', message: '请选择决定时间' }],
        writNoName: [{ required: true, trigger: 'blur', message: '请输入文书号' }],
        payMoney: [{ required: true, trigger: 'blur', message: '请输入罚款金额' }],
        radio: [{ required: true, trigger: 'blur', message: '请输入延期分期' }],
        deadline: [{ required: true, trigger: 'blur', message: '请选择最后截止日期' }],
        term: [{ required: true, trigger: 'blur', message: '请输入第几期' }],
        installmentDate: [{ required: true, trigger: 'blur', message: '请选择截止日期' }],
        pay: [{ required: true, trigger: 'blur', message: '请输入缴纳罚款金额' }],
        left: [{ required: true, trigger: 'blur', message: '请输入未缴纳金额' }]
      },
      radio: '1',
      lawDisabled: false,
      apprDelayInfo: {
        subject: '', // 当事人：tag2
        decisionTime: '', // 决定时间: tag3
        writNoName: '', // 行政处罚决定书文号: tag4
        payMoney: 0, // 罚款金额: tag5
        radio: '1', // 1 延期缴纳罚款 fineType1; 2 分期缴纳罚款 fineType2
        deadline: '', // 延期缴纳最后截止日期: tag6
        term: '一', // 第几期: tag7
        installmentDate: '', // 分期截止日期：tag8
        pay: '', // 本期缴纳罚款金额：tag9
        left: '' // 未缴纳金额: tag10
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
    // 提交盖执法章
    lawSeal() {
      sealWrit({
        writId: this.info.auditInfo.writId,
        signType: 'SINGLE_LAW'
      })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              message: '加盖执法专用章成功',
              type: 'success'
            })
            this.lawDisabled = true
            this.$emit('toLawSeal')
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'warning'
          })
        })
    },
    sure() {
      this.$refs.delayPay.validate((valid, errInfo) => {
        if (valid) {
          if (this.apprDelayInfo.radio === '1') {
            // 延期缴纳
            this.apprDelayInfo.term = ''
            this.apprDelayInfo.installmentDate = ''
            this.apprDelayInfo.pay = ''
            this.apprDelayInfo.left = ''
          } else {
            this.apprDelayInfo.deadline = ''
          }
          let data = getWritParams({
            tag2: this.apprDelayInfo.subject,
            tag3: dateFormat(this.apprDelayInfo.decisionTime, 'yyyy年mm月dd日'),
            tag4: this.apprDelayInfo.writNoName,
            tag5: toSuperMoney(this.apprDelayInfo.payMoney),
            payMoney_tag5: this.apprDelayInfo.payMoney,
            tag6: this.apprDelayInfo.deadline ? toSuperDate(this.apprDelayInfo.deadline, 'yyyy年mm月dd日') : '',
            deadline_tag6: dateFormat(this.apprDelayInfo.deadline, 'yyyy年mm月dd日'),
            tag7: this.apprDelayInfo.term,
            tag8: this.apprDelayInfo.installmentDate ? toSuperDate(this.apprDelayInfo.installmentDate, 'yyyy年mm月dd日') : '',
            installmentDate_tag8: dateFormat(this.apprDelayInfo.installmentDate, 'yyyy年mm月dd日'),
            tag9: toSuperMoney(this.apprDelayInfo.pay),
            pay_tag9: this.apprDelayInfo.pay,
            tag10: toSuperMoney(this.apprDelayInfo.left),
            left_tag10: this.apprDelayInfo.left,
            fineType1: this.apprDelayInfo.radio === '1' ? true : false,
            fineType2: this.apprDelayInfo.radio === '1' ? false : true
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'YQJNFKPZS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          this.$message({
            type: 'warning',
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
      this.info.writInfo.map(item => {
        switch (item.tagName) {
          case 'tag2':
            this.apprDelayInfo.subject = item.tagContent
            break
          case 'tag3':
            this.apprDelayInfo.decisionTime = handleDateRef(item.tagContent)
            break
          case 'tag4':
            this.apprDelayInfo.writNoName = item.tagContent
            break
          case 'payMoney_tag5':
            this.apprDelayInfo.payMoney = item.tagContent
            break
          case 'deadline_tag6':
            this.apprDelayInfo.deadline = item.tagContent ? handleDateRef(item.tagContent) : ''
            break
          case 'tag7':
            this.apprDelayInfo.term = item.tagContent
            break
          case 'installmentDate_tag8':
            this.apprDelayInfo.installmentDate = handleDateRef(item.tagContent)
            break
          case 'pay_tag9':
            this.apprDelayInfo.pay = item.tagContent
            break
          case 'left_tag10':
            this.apprDelayInfo.left = item.tagContent
            break
          case 'fineType1':
            this.apprDelayInfo.radio = item.tagContent === 'true' ? '1' : '2'
            break
          default:
            return
        }
      })
    },
    // 初始化文书
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res')),
        writNoName = '',
        _time = null
      console.info(this.info.auditInfo.objectType)
      getWritInfo({
        sourceId: this.info.auditInfo.sourceId,
        type: this.info.auditInfo.objectType === '0' ? 'XXCFJDSDW' : 'XXCFJDSGR'
      })
        .then(
          // 获取文书号
          res => {
            console.info(333, res)
            writNoName = !!res.data[0] ? res.data[0].writNoName : ''
            _time = !!res.data[0] ? res.data[0].creatorTime : ''
            return getWritDataByWritId({
              writId: res.data[0] ? res.data[0].writId : ''
            })
          }
        )
        .then(res => {
          return getCritBasicInfo({
            penaltyId: this.info.auditInfo.sourceId
          })
        })
        .then(res => {
          // 获取罚款金额
          this.apprDelayInfo = {
            subject: this.info.auditInfo.subject,
            decisionTime: handleDateRef(_time),
            writNoName: writNoName,
            payMoney: res.data.sumMoney ? Number(res.data.sumMoney) : 0,
            radio: '1',
            deadline: new Date(),
            term: '一',
            installmentDate: void 0,
            pay: 0,
            left: 0
          }
        })
    },
    // 将 年月日 转化为 日期 格式以便回显
    handleDateRef(dateStr) {
      let dateArr = dateStr.split(/[^\d]/)
      dateArr.pop()
      dateArr[1] = Number(dateArr[1]) - 1
      return new Date(...dateArr)
    }
  }
}
</script>
<style lang="less" scoped>
.appr-delay_content {
  padding: 0 16px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}
</style>
