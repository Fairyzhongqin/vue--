<template>
  <div class="restorePowerNotice">
    <el-form
      ref="resPowerInfo"
      :model="resPowerInfo"
      label-width="130px"
      :rules="rules"
      :show-message="false"
      label-position="right"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">停止供电对象</div>
            <el-input v-model="resPowerInfo.subject" placeholder="请输入停止供电对象"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="powerProvider">
              <div slot="label" class="slot_label">供电公司</div>
            <el-input v-model="resPowerInfo.powerProvider" placeholder="请输入供电公司"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="stopPowerTime">
              <div slot="label" class="slot_label">停止供电时间</div>
            <el-date-picker v-model="resPowerInfo.stopPowerTime" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" class="repulsive" prop="measures">
              <div slot="label" class="slot_label">强制措施</div>
            <el-select v-model="resPowerInfo.measures" placeholder="请选择">
              <el-option label="停止供电" value="停止供电"></el-option>
              <el-option label="停止供应民用爆炸物品" value="停止供应民用爆炸物品"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="applyMeaTime">
              <div slot="label" class="slot_label">措施履行时间</div>
            <el-date-picker v-model="resPowerInfo.applyMeaTime" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="restoreTime">
              <div slot="label" class="slot_label">恢复供电时间</div>
            <el-date-picker
              v-model="resPowerInfo.restoreTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="" prop="restoreContent">
              <div slot="label" class="slot_label">恢复内容</div>
          <el-input v-model="resPowerInfo.restoreContent" placeholder="请输入恢复内容"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成恢复供电（供应民用爆炸物品）通知书</el-button>
    </div>
  </div>
</template>

<script>
import { individualInfo } from '@api/common'
import { getWritParams, dateFormat, handleDateRef } from '@/utils/util'

export default {
  name: 'restorePowerNotice',
  props: ['info'],
  data() {
    return {
      resPowerInfo: {
        powerProvider: '', // 供电公司：tag2
        stopPowerTime: void 0, // 停止供电时间：tag3 年月日
        subject: '', // 停止供电公司：tag4
        measures: '', // 强制措施：tag5
        applyMeaTime: void 0, // 履行措施时间: tag6 年月日
        restoreTime: '', // 恢复时间：tag8 年月日 时分
        restoreContent: '' // 恢复内容：tag9
      },
      rules: {
        powerProvider: [{ required: true, message: '请输入供电公司', trigger: 'blur' }],
        stopPowerTime: [{ required: true, message: '请选择停止供电时间', trigger: 'blur' }],
        subject: [{ required: true, message: '请输入停止供电对象', trigger: 'blur' }],
        measures: [{ required: true, message: '请选择强制措施：', trigger: 'blur' }],
        applyMeaTime: [{ required: true, message: '请选择措施履行时间', trigger: 'blur' }],
        restoreTime: [{ required: true, message: '请选择恢复供电时间', trigger: 'blur' }],
        restoreContent: [{ required: true, message: '请输入恢复内容', trigger: 'blur' }]
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
              this.resPowerInfo.powerProvider = item.tagContent
              break
            case 'tag3':
              this.resPowerInfo.stopPowerTime = handleDateRef(item.tagContent)
              break
            case 'tag4':
              this.resPowerInfo.subject = item.tagContent
              break
            case 'tag5':
              this.resPowerInfo.measures = item.tagContent
              break
            case 'tag6':
              this.resPowerInfo.applyMeaTime = handleDateRef(item.tagContent)
              break
            case 'tag8':
              this.resPowerInfo.restoreTime = handleDateRef(item.tagContent)
              break
            case 'tag9':
              this.resPowerInfo.restoreContent = item.tagContent
              break
            default:
              return
          }
        })
      } else {
        this.resPowerInfo = {
          powerProvider: '',
          stopPowerTime: void 0,
          subject: this.info.auditInfo.subject,
          measures: '',
          applyMeaTime: void 0,
          restoreTime: void 0,
          restoreContent: ''
        }
        console.info('resPowerInfo', this.resPowerInfo)
      }
    },
    sure() {
      this.$refs.resPowerInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.resPowerInfo.powerProvider,
            tag3: dateFormat(this.resPowerInfo.stopPowerTime, 'yyyy年mm月dd日').replace(/\s*/g, ''),
            tag4: this.resPowerInfo.subject,
            tag5: this.resPowerInfo.measures,
            tag6: dateFormat(this.resPowerInfo.applyMeaTime, 'yyyy年mm月dd日'),
            tag7: this.resPowerInfo.measures,
            tag8: dateFormat(this.resPowerInfo.restoreTime, 'yyyy年mm月dd日 HH时MM分').replace(/\s*/g, ''),
            tag9: this.resPowerInfo.restoreContent
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'HFGDTZS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          console.log('hhh')
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.restorePowerNotice {
  padding: 0 16px;
  .el-form-item {
    margin-bottom: -5px;

    .el-input {
      width: 100% !important;
    }
  }
  .dialog-footer {
    padding-bottom: 10px;
    padding-top: 10px;
    margin-top: 10px;
    text-align: right;
    border-top: 1px solid #e0e0e0;
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
}
.repulsive {
  /deep/ .el-form-item__content .el-select {
    width: 100%;
  }
}
</style>
