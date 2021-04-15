<template>
  <div class="content">
    <el-form ref="advanceNotice" label-position="right" :model="adNoticeInfo" label-width="130px" :show-message="false" :rules="rules">
      <el-row>
        <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
          <el-input v-model="adNoticeInfo.caseName" placeholder="请输入案件名称"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">罚款批准对象</div>
          <el-input v-model="adNoticeInfo.subject" placeholder="罚款批准对象"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="decisionTime">
              <div slot="label" class="slot_label">决定时间</div>
            <el-date-picker v-model="adNoticeInfo.decisionTime" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" prop="radio">
          <el-form-item label="" prop="radio">
              <div slot="label" class="slot_label">罚款/立即执行</div>
            <template>
              <el-radio-group v-model="adNoticeInfo.radio">
                <el-radio :label="1">罚款缴纳</el-radio>
                <el-radio :label="2">立即执行</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="" prop="writNoName">
              <div slot="label" class="slot_label">处罚决定文书</div>
          <el-input v-model="adNoticeInfo.writNoName" placeholder="请输入文书"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="20" v-if="adNoticeInfo.radio == 1">
        <el-col :span="12">
          <el-form-item label="" prop="deadline">
              <div slot="label" class="slot_label">截止日期</div>
            <el-date-picker v-model="adNoticeInfo.deadline" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="fineMoney">
              <div slot="label" class="slot_label">罚款金额</div>
            <el-input v-model="adNoticeInfo.fineMoney" placeholder="请输入罚款金额"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="adNoticeInfo.radio == 1">
        <el-col :span="8">
          <el-form-item label="" prop="addMoney">
              <div slot="label" class="slot_label">加处罚款</div>
            <el-input v-model="adNoticeInfo.addMoney" placeholder="请输入加处罚款"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="sum">
              <div slot="label" class="slot_label">总计</div>
            <el-input v-model="adNoticeInfo.sum" placeholder="请输入总计"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="bank">
              <div slot="label" class="slot_label">缴纳地址</div>
            <el-input v-model="adNoticeInfo.bank" placeholder="请输入缴纳地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="adNoticeInfo.radio == 2">
        <el-form-item label="" prop="decision">
              <div slot="label" class="slot_label">行政决定</div>
          <el-input v-model="adNoticeInfo.decision" type="textarea" :rows="2" placeholder="请输入行政决定"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成行政强制执行事先催告书</el-button>
    </span>
  </div>
</template>

<script>
import { getWritInfo, getWritDataByWritId } from '@api/fileRelated'
import { getWritParams, dateFormat, toSuperMoney, toCommonMoney } from '@/utils/util'
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      adNoticeInfo: {
        radio: 1, //  1 罚款 2立即执行：tag5 tag11
        caseName: '', // /案件名称
        subject: '', //罚款批准对象： tag2
        decisionTime: '', //决定时间：tag3
        writNoName: '', //文书号：tag4
        deadline: '', //截止日期：tag6
        fineMoney: 0, //罚款金额：tag7
        addMoney: 0, //加处罚款：tag8
        sum: 0, //总计：tag9
        bank: '', //缴纳地址：tag10
        decision: '' // 行政决定: tag12
      },
      rules: {
        radio: [{ required: true, message: '请选择罚款执行类型', trigger: 'blur' }],
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        subject: [{ required: true, message: '请输入罚款批准对象', trigger: 'blur' }],
        decisionTime: [{ required: true, message: '请选择决定时间', trigger: 'blur' }],
        writNoName: [{ required: true, message: '请输入文书', trigger: 'blur' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'blur' }],
        fineMoney: [{ required: true, message: '请输入罚款金额', trigger: 'blur' }],
        addMoney: [{ required: true, message: '请输入加处罚款', trigger: 'blur' }],
        sum: [{ required: true, message: '请输入总计', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入缴纳地址', trigger: 'blur' }],
        decision: [{ required: true, message: '请输入行政决定', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.initInfo()
  },
  methods: {
    initInfo() {
      if (this.info.writInfo) {
        this.info.writInfo.map(item => {
          this.adNoticeInfo.caseName = this.info.auditInfo.caseName
          switch (item.tagName) {
            case 'tag2':
              this.adNoticeInfo.subject = item.tagContent
              break
            case 'tag3':
              this.adNoticeInfo.decisionTime = item.tagContent ? this.handleDateRef(item.tagContent) : ''
              break
            case 'tag4':
              this.adNoticeInfo.writNoName = item.tagContent
              break
            case 'tag5':
              this.adNoticeInfo.radio = item.tagContent === 'true' ? 1 : 2
              break
            case 'tag6':
              this.adNoticeInfo.deadline = item.tagContent ? this.handleDateRef(item.tagContent) : ''
              break
            case 'tag7_Reese':
              this.adNoticeInfo.fineMoney = item.tagContent
              break
            case 'tag8_Finch':
              this.adNoticeInfo.addMoney = toCommonMoney(item.tagContent)
              break
            case 'tag9_Shoot':
              this.adNoticeInfo.sum = item.tagContent
              break
            case 'tag10':
              this.adNoticeInfo.bank = item.tagContent
              break
            case 'tag12':
              this.adNoticeInfo.decision = item.tagContent
              break
            default:
              return
          }
        })
      } else {
        let user = JSON.parse(localStorage.getItem('res'))
        let _penalty = this.$store.state.penalty
        getWritInfo({
          sourceId: _penalty.penaltyUndEntity.penaltyId,
          type: _penalty.penaltyUndEntity.objectType === '0' ? 'XXCFJDSDW' : 'XXCFJDSGR'
        })
          .then(
            res => {
              if (res.data && res.data.length > 0) {
                let _writNoName = res.data[0] ? `行政处罚决定${res.data[0].writNoName}` : '暂无'
                this.adNoticeInfo = {
                  radio: 1,
                  subject: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName,
                  caseName: _penalty.penaltyUndEntity.caseName,
                  writNoName: _writNoName,
                  fineMoney: 0,
                  decisionTime: res.data[0] ? new Date(res.data[0].creatorTime) : void 0,
                  deadline: new Date(),
                  addMoney: 0,
                  sum: 0,
                  bank: user.sysDeptEntity.bank,
                  decision: ''
                }
              }
              return getWritDataByWritId({
                writId: !!res.data[0] ? res.data[0].writId : ''
              })
            },
            err => console.info(err)
          )
          .then(res => {
            if (res.data.length !== 0) {
              res.data.map(_item => {
                if (_penalty.penaltyUndEntity.objectType === '0') {
                  if (_item.tagName === 'penaltyAmount_Reech') {
                    this.adNoticeInfo.fineMoney = _item.tagContent
                  }
                } else {
                  if (_item.tagName === 'penaltyAmount_Maud') {
                    this.adNoticeInfo.fineMoney = _item.tagContent
                  }
                }

                this.adNoticeInfo.sum = this.adNoticeInfo.fineMoney
              })
              return getWritInfo({
                sourceId: this.info.auditInfo.sourceId,
                type: 'JCFKJDS'
              })
            } else {
              return null
            }
          })
          .then(res => {
            if (res && res.data.length > 0) {
              if (res.data[0].writNoName) {
                this.adNoticeInfo.writNoName += res.data[0] ? `和加处罚决定${res.data[0].writNoName}` : ''
              }
              return getWritDataByWritId({
                writId: !!res.data[0] ? res.data[0].writId : ''
              })
            } else {
              return null
            }
          })
          .then(res => {
            if (res && res.data.length !== 0) {
              res.data.map(_item => {
                if (_item.tagName === 'tag8_Reese') {
                  this.adNoticeInfo.addMoney = Number(_item.tagContent)
                }
              })
              this.adNoticeInfo.sum = this.adNoticeInfo.addMoney * 1 + this.adNoticeInfo.fineMoney * 1
            }
          })
          .catch(err => console.info(err))
      }
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.advanceNotice.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.adNoticeInfo.subject,
            tag3: this.adNoticeInfo.decisionTime ? dateFormat(this.adNoticeInfo.decisionTime, 'yyyy年mm月dd日') : '',
            tag4: this.adNoticeInfo.writNoName,
            tag5: this.adNoticeInfo.radio === 1 ? true : false,
            tag6: this.adNoticeInfo.radio === 1 ? (this.adNoticeInfo.deadline ? dateFormat(this.adNoticeInfo.deadline, 'yyyy年mm月dd日') : '') : '',
            tag7: this.adNoticeInfo.radio === 1 ? (this.adNoticeInfo.fineMoney ? toSuperMoney(this.adNoticeInfo.fineMoney) : '') : '',
            tag7_Reese: this.adNoticeInfo.fineMoney,
            tag8: this.adNoticeInfo.radio === 1 ? (this.adNoticeInfo.addMoney ? toSuperMoney(this.adNoticeInfo.addMoney) : '') : '',
            tag8_Finch: this.adNoticeInfo.addMoney,
            tag9: this.adNoticeInfo.radio === 1 ? (this.adNoticeInfo.sum ? toSuperMoney(this.adNoticeInfo.sum) : '') : '',
            tag9_Shoot: this.adNoticeInfo.sum,
            tag10: this.adNoticeInfo.radio === 1 ? this.adNoticeInfo.bank : '',
            tag11: this.adNoticeInfo.radio === 1 ? false : true,
            tag12: this.adNoticeInfo.radio !== 1 ? this.adNoticeInfo.decision : ''
          })

          let params = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XZQZZXSQCGS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          console.log('hhh')
        }
      })
    },
    close() {
      this.$emit('close')
    },
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
.content {
  padding: 10px 16px 10px 16px;
}

.el-form-item {
  margin-bottom: -5px;
  white-space: nowrap;
}

.el-col-12 {
  /deep/ .el-input {
    width: 100%;
  }

  &:last-child {
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}

.special {
  margin-top: 24px;

  .el-checkbox {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  span {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }

  .el-row:nth-child(4) {
    /deep/.el-input__inner {
      width: 85%;
    }
  }
}

.only {
  /deep/ .el-form-item__content {
    margin-left: 125px !important;
  }
}

/deep/ .el-dialog__header {
  padding: 17px 20px 10px;
}

/deep/ .el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
  top: 12px;
  right: 15px;
  font-size: 24px;
}

/deep/ .el-dialog__body {
  padding-left: 16px;
  padding-right: 29px;
}

/deep/ .el-dialog__wrapper .el-dialog__footer {
  margin-top: 15px;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
