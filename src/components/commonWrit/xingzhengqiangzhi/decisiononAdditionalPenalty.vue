<template>
  <div class="content">
    <el-form ref="decisiononAdditionalPenalty" :model="addiPenaltyInfo" label-position="right" :rules="rules" :show-message="false" label-width="140px">
      <el-row>
        <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
          <el-input v-model="addiPenaltyInfo.caseName" placeholder="请输入案件名称"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">加处罚款对象</div>
          <el-input v-model="addiPenaltyInfo.subject" placeholder="请输入加处罚款对象"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="">
              <div slot="label" class="slot_label">决定时间</div>
            <span>{{ dateFormat(addiPenaltyInfo.decisionTime, 'yyyy年mm月dd日') }}</span>
            <!-- <el-date-picker v-model="addiPenaltyInfo.decisionTime" type="date" placeholder="选择日期时间"></el-date-picker> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="">
              <div slot="label" class="slot_label">文书号</div>
            <span>{{ addiPenaltyInfo.writNoName }}</span>
            <!-- <el-input v-model="addiPenaltyInfo.writNoName" placeholder="请输入文书号"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="fineTime">
              <div slot="label" class="slot_label">截止罚款时间</div>
            <el-date-picker v-model="addiPenaltyInfo.fineTime" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="reminderTime">
              <div slot="label" class="slot_label">催告截止时间</div>
            <el-date-picker v-model="addiPenaltyInfo.reminderTime" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="fineMoney">
              <div slot="label" class="slot_label">罚款金额</div>
            <el-input v-model="addiPenaltyInfo.fineMoney" placeholder="请输入罚款金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="addFineMoney">
              <div slot="label" class="slot_label">加处罚款金额</div>
            <el-input v-model="addiPenaltyInfo.addFineMoney" placeholder="请输入加处罚金额"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="" prop="fineBank">
              <div slot="label" class="slot_label">缴纳罚款银行</div>
          <el-input v-model="addiPenaltyInfo.fineBank" placeholder="请输入缴纳罚款银行"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成加处罚款决定书</el-button>
    </span>
  </div>
</template>

<script>
import { individualInfo } from '@api/common'
import { getWritInfo, getWritDataByWritId } from '@api/fileRelated'
import { getCritBasicInfo } from '@api/anjianshenli'
import { getWritParams, dateFormat, toSuperMoney, toCommonMoney } from '@/utils/util'
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      addiPenaltyInfo: {
        caseName: '', //案件名称：
        subject: '', //加处罚款对象：
        decisionTime: '', //决定时间：
        writNoName: '', //文书号：
        fineMoney: '', //罚款金额：
        fineTime: '', //截止罚款时间：
        reminderTime: '', //催告截止时间：
        addFineMoney: '', //加处罚款金额：
        fineBank: '', //缴纳罚款银行：
        government: '',
        fullDeptName: '',
        court: ''
      },
      rules: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        subject: [{ required: true, message: '请输入加处罚款对象', trigger: 'blur' }],
        decisionTime: [{ required: true, message: '请选择决定时间', trigger: 'blur' }],
        writNoName: [{ required: true, message: '请输入文书号', trigger: 'blur' }],
        fineMoney: [{ required: true, message: '请输入罚款金额', trigger: 'blur' }],
        fineTime: [{ required: true, message: '请输入截止罚款时间', trigger: 'blur' }],
        reminderTime: [{ required: true, message: '请输入催告截止时间', trigger: 'blur' }],
        addFineMoney: [{ required: true, message: '请输入加处罚金额', trigger: 'blur' }],
        fineBank: [{ required: true, message: '请输入缴纳罚款银行', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initInfo()
  },
  methods: {
    // 点击确定按钮事件
    sure() {
      console.info(this.addiPenaltyInfo)
      this.$refs.decisiononAdditionalPenalty.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.addiPenaltyInfo.subject,
            tag3: dateFormat(this.addiPenaltyInfo.decisionTime, 'yyyy年mm月dd日'),
            tag4: this.addiPenaltyInfo.writNoName,
            tag5: toSuperMoney(this.addiPenaltyInfo.fineMoney),
            tag6: dateFormat(this.addiPenaltyInfo.fineTime, 'yyyy年mm月dd日'),
            tag7: dateFormat(this.addiPenaltyInfo.reminderTime, 'yyyy年mm月dd日'),
            tag8: toSuperMoney(this.addiPenaltyInfo.addFineMoney),
            tag8_Reese: this.addiPenaltyInfo.addFineMoney,
            tag9: this.addiPenaltyInfo.fineBank,
            tag10: this.addiPenaltyInfo.government,
            tag11: this.addiPenaltyInfo.fullDeptName,
            tag12: this.addiPenaltyInfo.court
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'JCFKJDS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          console.log('hhh')
        }
      })
    },
    dateFormat(date) {
      return dateFormat(date, 'yyyy年mm月dd日')
    },
    close() {
      this.$emit('close')
    },
    initInfo() {
      if (this.info.writInfo) {
        this.info.writInfo.map(item => {
          this.addiPenaltyInfo.caseName = this.info.auditInfo.caseName
          switch (item.tagName) {
            case 'tag2':
              this.addiPenaltyInfo.subject = item.tagContent
              break
            case 'tag3':
              this.addiPenaltyInfo.decisionTime = item.tagContent ? this.handleDateRef(item.tagContent) : null
              break
            case 'tag4':
              this.addiPenaltyInfo.writNoName = item.tagContent
              break
            case 'tag5':
              this.addiPenaltyInfo.fineMoney = toCommonMoney(item.tagContent)
              break
            case 'tag6':
              this.addiPenaltyInfo.fineTime = item.tagContent ? this.handleDateRef(item.tagContent) : null
              break
            case 'tag7':
              this.addiPenaltyInfo.reminderTime = item.tagContent ? this.handleDateRef(item.tagContent) : null
              break
            case 'tag8':
              this.addiPenaltyInfo.addFineMoney = toCommonMoney(item.tagContent)
              break
            case 'tag9':
              this.addiPenaltyInfo.fineBank = item.tagContent
              break
            case 'tag10':
              this.addiPenaltyInfo.government = item.tagContent
              break
            case 'tag11':
              this.addiPenaltyInfo.fullDeptName = item.tagContent
              break
            case 'tag12':
              this.addiPenaltyInfo.court = item.tagContent
              break
            default:
              return
          }
        })
      } else {
        let user = JSON.parse(localStorage.getItem('res'))
        getWritInfo({
          sourceId: this.info.auditInfo.sourceId,
          type: this.info.auditInfo.objectType === '0' ? 'XXCFJDSDW' : 'XXCFJDSGR'
        })
          .then(
            res => {
              this.addiPenaltyInfo = {
                subject: this.info.auditInfo.subject,
                caseName: this.info.auditInfo.caseName,
                writNoName: !!res.data[0] ? res.data[0].writNoName : '',
                fineMoney: 0,
                decisionTime: res.data[0] ? this.handleDateRef(res.data[0].creatorTime) : null,
                fineTime: void 0,
                reminderTime: void 0,
                addFineMoney: 0,
                fineBank: user.sysDeptEntity.bank,
                government: user.sysDeptEntity.government,
                fullDeptName: user.sysDeptEntity.bureau, // 这里要取上级部门
                court: user.sysDeptEntity.court
              }
              if (res.data[0]) {
                return getWritDataByWritId({
                  writId: res.data[0].writId
                })
              }
            },
            err => console.info(err)
          )
          .then(res => {
            res.data.map(_item => {
              if (this.info.auditInfo.objectType === '0') {
                if (_item.tagName === 'penaltyAmount_Reech') {
                  this.addiPenaltyInfo.fineMoney = _item.tagContent
                }
                if (_item.tagName === 'tag12') {
                  if (_item.tagContent) {
                    this.addiPenaltyInfo.fineBank = _item.tagContent
                  }
                }
              }
              if (this.info.auditInfo.objectType === '1') {
                if (_item.tagName === 'penaltyAmount_Maud') {
                  this.addiPenaltyInfo.fineMoney = _item.tagContent
                }
                if (_item.tagName === 'tag15') {
                  if (_item.tagContent) {
                    this.addiPenaltyInfo.fineBank = _item.tagContent
                  }
                }
              }
            })
          })
      }
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
.content {
  padding: 10px 16px 10px 16px;

  .dialog-footer {
    padding-bottom: 10px;
  }
}

.el-form-item {
  margin-bottom: -5px;
  white-space: nowrap;
}

.el-col-12 {
  /deep/ .el-input {
    width: 100%;
  }

  /deep/ .el-input__inner {
    width: 100%;
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
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

.time_picker {
  display: flex;
  align-items: flex-end;
}

.time_picker .el-form-item__content {
  display: flex;
}
</style>
