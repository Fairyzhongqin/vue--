<template>
  <div class="stopPower">
    <el-form
      ref="stopPower"
      :model="stopPower"
      label-width="170px"
      :rules="rules"
      :show-message="false"
      label-position="right"
    >
      <el-row>
        <el-form-item label="供电公司名称：" prop="powerProvider">
              <div slot="label" class="slot_label">供电公司名称</div>
          <el-input v-model="stopPower.powerProvider" placeholder="请输入供电公司名称"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="停止供电对象：" prop="subject">
              <div slot="label" class="slot_label">停止供电对象</div>
          <el-input v-model="stopPower.subject" placeholder="请输入停止供电对象"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="决定停止供电时间：" label-width="170px" prop="stopDecidedTime">
              <div slot="label" class="slot_label">决定停止供电时间</div>
            <el-date-picker v-model="stopPower.stopDecidedTime" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="行政决定：" label-width="88px" prop="decision">
              <div slot="label" class="slot_label">行政决定</div>
            <el-input v-model="stopPower.decision" placeholder="请输入行政决定"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="停止供电时间：" label-width="170px" prop="stopPowerTime">
              <div slot="label" class="slot_label">停止供电时间</div>
            <el-date-picker
              v-model="stopPower.stopPowerTime"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="spcCol">
          <!-- <el-form-item label="强制措施：">
            <el-input v-model="stopPower.measures" placeholder="请输入强制措施"></el-input>
          </el-form-item>-->
          <el-form-item label="强制措施：" label-width="88px" prop="measures">
              <div slot="label" class="slot_label">强制措施</div>
            <el-select v-model="stopPower.measures" placeholder="请选择">
              <el-option label="停止供电" value="停止供电"></el-option>
              <el-option label="停止供应民用爆炸物品" value="停止供应民用爆炸物品"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成停止供电（供应民用爆炸物品）通知书</el-button>
    </div>
  </div>
</template>

<script>
import { individualInfo } from '@api/common'
import { getWritParams, dateFormat } from '@/utils/util'

export default {
  name: 'stopPower',
  props: ['info'],
  data() {
    return {
      stopPower: {
        powerProvider: '', // 供电公司名称：tag2
        subject: '', // 停止供电对象：tag3
        stopDecidedTime: void 0, // 决定停止供电时间：tag4
        decision: '', // 行政决定：tag5
        measures: '', // 强制措施：tag6 & tag8
        stopPowerTime: '' // 停止供电时间: tag7
      },
      rules: {
        powerProvider: [{ required: true, message: '请输入供电公司名称', trigger: 'blur' }],
        subject: [{ required: true, message: '请输入停止供电对象', trigger: 'blur' }],
        stopDecidedTime: [{ required: true, message: '请选择决定停止供电时间', trigger: 'blur' }],
        decision: [{ required: true, message: '请输入行政决定', trigger: 'blur' }],
        measures: [{ required: true, message: '请输入强制措施', trigger: 'blur' }],
        stopPowerTime: [{ required: true, message: '请选择停止供电时间', trigger: 'blur' }]
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
              this.stopPower.powerProvider = item.tagContent
              break
            case 'tag3':
              this.stopPower.subject = item.tagContent
              break
            case 'tag4':
              this.stopPower.stopDecidedTime = this.handleDateRef(item.tagContent)
              break
            case 'tag5':
              this.stopPower.decision = item.tagContent
              break
            case 'tag6':
              this.stopPower.measures = item.tagContent
              break
            case 'tag7':
              this.stopPower.stopPowerTime = this.handleDateRef(item.tagContent)
              break
            default:
              return
          }
        })
      } else {
        let user = JSON.parse(localStorage.getItem('res'))
        this.stopPower = {
          powerProvider: '',
          subject: this.info.auditInfo.subject,
          stopDecidedTime: void 0,
          decision: '',
          measures: '',
          stopPowerTime: void 0
        }
        console.info('stopPower', this.stopPower)
      }
    },
    sure() {
      this.$refs.stopPower.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.stopPower.powerProvider,
            tag3: this.stopPower.subject,
            tag4: dateFormat(this.stopPower.stopDecidedTime, 'yyyy年mm月dd日'),
            tag5: this.stopPower.decision,
            tag6: this.stopPower.measures,
            //去掉日和时之间的空格
            tag7: dateFormat(this.stopPower.stopPowerTime, 'yyyy年mm月dd日 HH时MM分').replace(/\s*/g, ''),
            tag8: this.stopPower.measures
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'TZGDTZS',
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
.stopPower {
  padding: 0 16px;
  .dialog-footer {
    padding-bottom: 10px;
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid #e0e0e0;
    text-align: right;
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
      width: 80%;
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
        width: 90%;
      }
    }
  }
  .spcCol {
    /deep/.el-input.el-input--suffix {
      width: 100%;
    }
    /deep/.el-select {
      width: 100%;
    }
    // @media screen and (min-width: 1440px) and (max-width: 1456px) {
    //   /deep/.el-input.el-input--suffix {
    //     width: 202px;
    //   }
    // }
    // @media screen and (min-width: 1560px) and (max-width: 1920px) {
    //   /deep/.el-select {
    //     width: 100%;
    //   }
    // }
  }
}
</style>
