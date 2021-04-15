<template>
  <div class="powerCutDecision">
    <el-form ref="powerCutInfo" :model="powerCutInfo" label-width="120px" :rules="rules" :show-message="false" label-position="right">
      <el-row>
        <el-form-item label="" label-width="160px" prop="subject">
              <div slot="label" class="slot_label">停止供电对象</div>
          <el-input v-model="powerCutInfo.subject" placeholder="请输入停止供电对象"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" label-width="160px" prop="stopDecidedTime">
              <div slot="label" class="slot_label">决定停止供电时间</div>
            <el-date-picker v-model="powerCutInfo.stopDecidedTime" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" label-width="110px" prop="decision">
              <div slot="label" class="slot_label">行政决定</div>
            <el-input v-model="powerCutInfo.decision" placeholder="请输入行政决定"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" label-width="160px" prop="stopPowerTime">
              <div slot="label" class="slot_label">停止供电时间</div>
            <el-date-picker v-model="powerCutInfo.stopPowerTime" format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="spcCol">
          <el-form-item label="" label-width="110px" prop="measures">
              <div slot="label" class="slot_label">强制措施</div>
            <el-select v-model="powerCutInfo.measures" placeholder="请选择">
              <el-option label="停止供电" value="停止供电"></el-option>
              <el-option label="停止供应民用爆炸物品" value="停止供应民用爆炸物品"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="" label-width="160px" prop="government">
              <div slot="label" class="slot_label">复议人民政府</div>
          <el-input v-model="powerCutInfo.government" placeholder="请输入复议人民政府"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="" label-width="160px" prop="fullDeptName">
              <div slot="label" class="slot_label">复议应急管理局</div>
          <el-input v-model="powerCutInfo.fullDeptName" placeholder="请输入复议应急管理局"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="" label-width="160px" prop="court">
              <div slot="label" class="slot_label">行政诉讼法院</div>
          <el-input v-model="powerCutInfo.court" placeholder="请输入行政诉讼法院"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成停止供电（供应民用爆炸物品）决定书</el-button>
    </div>
  </div>
</template>
<script>
import { individualInfo } from '@api/common'
import { getWritParams, dateFormat, handleDateRef } from '@/utils/util'

export default {
  name: 'powerCutDecision',
  props: ['info'],
  data() {
    return {
      powerCutInfo: {
        subject: '', // 当事人：tag2
        stopDecidedTime: void 0, // 决定停止供电时间：tag3
        decision: '', // 行政决定：tag4
        stopPowerTime: void 0, // 停止供电时间: tag5
        measures: '', // 强制措施：tag6
        government: '', // 复议人民政府：tag7
        fullDeptName: '', // 复议应急管理局：tag8
        court: '' // 行政诉讼法院：tag9
      },
      rules: {
        subject: [{ required: true, message: '请输入停止供电对象', trigger: 'blur' }],
        stopDecidedTime: [{ required: true, message: '请选择决定停止供电时间', trigger: 'blur' }],
        decision: [{ required: true, message: '请输入行政决定', trigger: 'blur' }],
        stopPowerTime: [{ required: true, message: '请选择停止供电时间', trigger: 'blur' }],
        measures: [{ required: true, message: '请选择强制措施', trigger: 'blur' }],
        government: [{ required: true, message: '请输入复议人民政府', trigger: 'blur' }],
        fullDeptName: [{ required: true, message: '请输入复议应急管理局', trigger: 'blur' }],
        court: [{ required: true, message: '请输入行政诉讼法院', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initInfo()
  },
  methods: {
    initInfo() {
      if (this.info.writInfo) {
        this.info.writInfo.map(item => {
          switch (item.tagName) {
            case 'tag2':
              this.powerCutInfo.subject = item.tagContent
              break
            case 'tag3':
              this.powerCutInfo.stopDecidedTime = handleDateRef(item.tagContent)
              break
            case 'tag4':
              this.powerCutInfo.decision = item.tagContent
              break
            case 'tag5':
              this.powerCutInfo.stopPowerTime = handleDateRef(item.tagContent)
              break
            case 'tag6':
              this.powerCutInfo.measures = item.tagContent
              break
            case 'tag7':
              this.powerCutInfo.government = item.tagContent
              break
            case 'tag8':
              this.powerCutInfo.fullDeptName = item.tagContent
              break
            case 'tag9':
              this.powerCutInfo.court = item.tagContent
              break
            default:
              return
          }
        })
      } else {
        let user = JSON.parse(localStorage.getItem('res'))
        this.powerCutInfo = {
          subject: this.info.auditInfo.subject,
          stopDecidedTime: void 0,
          decision: '',
          stopPowerTime: void 0,
          measures: '',
          government: user.sysDeptEntity.government,
          fullDeptName: user.sysDeptEntity.bureau,
          court: user.sysDeptEntity.court
        }
        console.info('powerCutInfo', this.powerCutInfo)
      }
    },
    sure() {
      this.$refs.powerCutInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.powerCutInfo.subject,
            tag3: dateFormat(new Date(this.powerCutInfo.stopDecidedTime), 'yyyy年mm月dd日'),
            tag4: this.powerCutInfo.decision,
            tag5: dateFormat(this.powerCutInfo.stopPowerTime, 'yyyy年mm月dd日 HH时MM分').replace(/\s*/g, ''),
            tag6: this.powerCutInfo.measures,
            tag7: this.powerCutInfo.government,
            tag8: this.powerCutInfo.fullDeptName,
            tag9: this.powerCutInfo.court
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'TZGDJDS',
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
    }
  }
}
</script>

<style lang="less" scoped>
.powerCutDecision {
  padding: 0 16px;
  .dialog-footer {
    text-align: right;
    padding-bottom: 10px;
    padding-top: 10px;
    margin-top: 10px;
  }
  .el-form-item {
    margin-bottom: -5px;
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
        width: 90%;
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
  .spcCol {
    padding-left: 10px;
    /deep/ .el-select {
      width: 100%;
    }
  }
}
</style>
