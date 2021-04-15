<template>
  <div>
    <div class="closeAndDistrainDecision_content">
      <el-form
        ref="distrainInfo"
        :model="distrainInfo"
        :rules="rules"
        label-width="120px"
        label-position="left"
        :inline-message="true"
        :show-message="false"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="" prop="companyName" class="title">
              <div slot="label" class="slot_label">单位名称</div>
              <el-input v-model="distrainInfo.companyName" placeholder="请输入单位名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="leftStyle">
            <el-form-item label="" prop="location">
              <div slot="label" class="slot_label">所在地区</div>
              <el-input v-model="distrainInfo.location" placeholder="请输入所在地区" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="time_picker">
            <el-form-item label="" prop="closeStartTime">
              <div slot="label" class="slot_label">查封扣押日期</div>
              <el-date-picker v-model="distrainInfo.closeStartTime" type="date" placeholder="开始时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="closeWritLabel" label-width="190px">
              <div slot="label" class="slot_label">查封扣押决定书文号</div>
              <el-select v-model="distrainInfo.closeWritLabel" placeholder="请选择查封扣押决定书文号">
                <el-option
                  :key="index"
                  v-for="(item, index) in writList"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="" prop="itemName" class="wuping">
              <div slot="label" class="slot_label">查封物品</div>
              <el-input v-model="distrainInfo.itemName" placeholder="请输入物品名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="forcemeasure">
            <el-form-item label="" prop="forcedActions">
              <div slot="label" class="slot_label">强制措施</div>
              <el-input v-model="distrainInfo.forcedActions" placeholder="请输入强制措施" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="padding-right:10px">
            <el-form-item label="" prop="relatedRules" style="margin-bottom:3px;">
              <div slot="label" class="slot_label">相关规定内容</div>
              <el-input
                v-model="distrainInfo.relatedRules"
                placeholder="请输入相关规定内容"
                clearable
                type="textarea"
                autosize
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="padding-right:10px">
            <el-form-item label="" prop="decision" style="margin-bottom:3px;">
              <div slot="label" class="slot_label">处理决定</div>
              <el-input
                v-model="distrainInfo.decision"
                placeholder="请输入决定"
                clearable
                type="textarea"
                autosize
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="fuyi">
            <el-form-item label="" prop="reDiscussGovn">
              <div slot="label" class="slot_label">复议人民政府</div>
              <el-input v-model="distrainInfo.reDiscussGovn" placeholder="请输入复议人民政府" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="fuyianjian">
            <el-form-item label="" prop="safeSupDept" label-width="118px">
              <div slot="label" class="slot_label">复议应急管理局</div>
              <el-input v-model="distrainInfo.safeSupDept" placeholder="请输入复议应急管理局" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="xingzhen">
            <el-form-item label="" prop="court">
              <div slot="label" class="slot_label">行政诉讼法院</div>
              <el-input v-model="distrainInfo.court" placeholder="请输入行政诉讼法院" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="margin-top: 25px;text-align: right;padding-bottom:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成查封扣押处理决定书</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, stringToDate } from '@/utils/util'
import { getWritInfo, getWritDataByWritId } from '@api/fileRelated'

export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      distrainInfo: {
        companyName: '', //单位名称
        closeStartTime: '', // 查封扣押开始时间
        closeWritLabel: '', //查封扣押决定书文号
        itemName: '', //物品名称
        forcedActions: '', //强制措施
        relatedRules: '', //相关规定内容
        decision: '', //决定
        reDiscussGovn: '', // 复议人民政府
        safeSupDept: '', // 复议应急管理局
        court: '', // 行政诉讼法院
        distrainInventory: '', // 查封扣押清单号
        location: null
      },
      writList: [
        {
          label: '没有label'
        }
      ], // 文书列表
      flag: true,
      rules: {
        companyName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        closeStartTime: [{ required: true, message: '请输入查封扣押开始时间', trigger: 'blur' }],
        location: [{ required: true, message: '请输入查封扣押结束时间', trigger: 'blur' }],
        closeWritLabel: [
          {
            required: true,
            message: '请输入查封扣押决定书文号',
            trigger: 'blur'
          }
        ],
        itemName: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        forcedActions: [{ required: true, message: '请输入强制措施', trigger: 'blur' }],
        relatedRules: [{ required: true, message: '请输入相关规定内容', trigger: 'blur' }],
        decision: [{ required: true, message: '请输入决定', trigger: 'blur' }],
        reDiscussGovn: [{ required: true, message: '请输入复议人民政府', trigger: 'blur' }],
        safeSupDept: [{ required: true, message: '请输入复议应急管理局', trigger: 'blur' }],
        court: [{ required: true, message: '请输入行政诉讼法院', trigger: 'blur' }],
        distrainInventory: [{ required: true, message: '请输入查封扣押清单号', trigger: 'blur' }]
      },
      isDisabled: false
    }
  },
  mounted() {
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        time = []
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.companyName = item.tagContent
            break
          case 'tag3':
            total.closeStartTime = stringToDate(
              item.tagContent
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', '')
            )
            break
          /*  case "tag4":
            total.location = item.tagContent;
            break; */
          case 'tag4':
            total.closeWritLabel = item.tagContent
            break
          case 'tag5':
            total.itemName = item.tagContent
            break
          case 'tag6':
            total.forcedActions = item.tagContent
            break
          case 'tag7':
            total.relatedRules = item.tagContent
            break
          case 'tag8':
            total.decision = item.tagContent
            break
          case 'tag9':
            total.reDiscussGovn = item.tagContent
            break
          case 'tag10':
            total.safeSupDept = item.tagContent
            break
          case 'tag11':
            total.court = item.tagContent
            break
        }
        return total
      }, {})
      this.distrainInfo = inputInfo
    } else {
      this.initInfo()
    }
    this.getDecisionWrit()
  },
  methods: {
    // 初始化文书数据
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.distrainInfo = {
        companyName: this.info.auditInfo.companyName, //单位名称
        closeStartTime: '', // 查封扣押开始时间
        closeEndTime: '', // 查封扣押结束时间
        closeWritLabel: '', //查封扣押决定书文号
        itemName: '', //物品名称
        forcedActions: '', //强制措施
        relatedRules: '', //相关规定内容
        decision: '', //决定
        reDiscussGovn: user.sysDeptEntity.government, // 复议人民政府
        safeSupDept: user.sysDeptEntity.bureau, // 复议应急管理局
        court: user.sysDeptEntity.court, // 行政诉讼法院
        distrainInventory: '' // 查封扣押清单号
      }
    },
    getDecisionWrit() {
      this.writList = []
      let req = {
        sourceId: this.info.auditInfo.sourceId,
        type: 'CFKYJDS'
      }
      getWritInfo(req)
        .then(res => {
          this.flag = false
          res.data.forEach(val => {
            this.writList.push({
              label: val.writNoName,
              writId: val.writId
            })
          })
        })
        .catch(err => console.info(err))
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.distrainInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.distrainInfo.companyName,
            tag3: dateFormat(this.distrainInfo.closeStartTime, 'yyyy年mm月dd日'),
            // tag4: this.distrainInfo.location,
            tag4: this.distrainInfo.closeWritLabel,
            tag5: this.distrainInfo.itemName,
            tag6: this.distrainInfo.forcedActions,
            tag7: this.distrainInfo.relatedRules,
            tag8: this.distrainInfo.decision,
            tag9: this.distrainInfo.reDiscussGovn,
            tag10: this.distrainInfo.safeSupDept,
            tag11: this.distrainInfo.court
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'CFKYCLJDS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
          this.isDisabled = true
        } else {
          console.log('error submit')
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  },
  watch: {
    'distrainInfo.closeWritLabel': {
      handler: function(val, oldVal) {
        if (!val || val === '' || this.flag) return
        let temp = null
        this.writList.some((item, index) => {
          temp = index
          return item.value === this.distrainInfo.closeWritLabel
        })
        getWritDataByWritId({ writId: this.writList[temp].writId }).then(res => {
          console.log(res.data)
          let arr = [],
            device = null
          res.data.forEach(item => {
            switch (item.tagName) {
              case 'tag6':
                this.distrainInfo.closeStartTime = stringToDate(
                  item.tagContent
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                )
                break
              case 'tag5':
                this.distrainInfo.forcedActions = item.tagContent
                break
              case 'tag4':
                this.distrainInfo.relatedRules = item.tagContent
                break
              case 'xiaoying':
                device = JSON.parse(item.tagContent)
                break
            }
          })
          let nameArr = device.list.reduce((total, item) => {
            total.push(item.evidence)
            return total
          }, [])
          this.distrainInfo.itemName = nameArr.join(',')
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.closeAndDistrainDecision_content {
  padding: 10px 16px 0px 16px;
}
.el-form-item {
  margin-bottom: -5px;
  white-space: nowrap;
}
/deep/.el-col-11 {
  margin-right: 30px;
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
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
// .title {
//   /deep/ .el-form-item__content .el-input .el-input__inner {
//     width: 90%;
//   }
// }
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 30px;
}
.time_picker {
  /deep/ .el-form-item {
    width: 100%;
    // /deep/ .el-form-item__content {
    //   width: 89%;
    // }
  }
}
.time_picker .el-form-item__content {
  display: flex;
}
.chafeng {
  /deep/ .el-form-item__label {
    width: 150px !important;
  }
}
/deep/.el-select {
  width: 89%;
}
/deep/.el-form-item__content {
  margin: 0px;
}
</style>
