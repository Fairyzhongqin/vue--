<template>
  <div>
    <div class="extendClosedTime_content">
      <el-form
        ref="extendTimeInfo"
        :model="extendTimeInfo"
        :rules="rules"
        label-width="140px"
        label-position="left"
        :show-message="false"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="" prop="companyName">
              <div slot="label" class="slot_label">单位名称</div>
              <el-input v-model="extendTimeInfo.companyName" placeholder="请输入单位名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="location">
              <div slot="label" class="slot_label">所在地区</div>
              <el-input v-model="extendTimeInfo.location" placeholder="请输入所在地区" clearable></el-input>
            </el-form-item>
          </el-col>

                    <el-col :span="12">
            <el-form-item label="" prop="closedTime">
              <div slot="label" class="slot_label">查封扣押日期</div>
              <el-date-picker
                v-model="extendTimeInfo.closedTime"
                type="date"
                placeholder="请选择查封扣押日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="" prop="lastCloseWritLabel" label-width="180px">
              <div slot="label" class="slot_label">查封扣押决定书文号</div>
              <el-select v-model="extendTimeInfo.lastCloseWritLabel" placeholder="请选择查封扣押决定书文号">
                <el-option
                  :key="index"
                  v-for="(item, index) in writList"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="itemName">
              <div slot="label" class="slot_label">物品名称</div>
              <el-input v-model="extendTimeInfo.itemName" placeholder="请输入物品名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="forcedActions">
              <div slot="label" class="slot_label">强制措施</div>
              <el-input v-model="extendTimeInfo.forcedActions" placeholder="请输入强制措施" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="postponeReason">
              <div slot="label" class="slot_label">延期原因</div>
              <el-input v-model="extendTimeInfo.postponeReason" placeholder="请输入延期原因" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="endTime">
              <div slot="label" class="slot_label">延期结束日期</div>
              <el-date-picker v-model="extendTimeInfo.endTime" type="date" placeholder="请选择延期结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="reDiscussGovn">
              <div slot="label" class="slot_label">复议人民政府</div>
              <el-input v-model="extendTimeInfo.reDiscussGovn" placeholder="请输入复议人民政府" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="safeSupDept">
              <div slot="label" class="slot_label">复议应急管理局</div>
              <el-input v-model="extendTimeInfo.safeSupDept" placeholder="请输入复议应急管理局" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="court">
              <div slot="label" class="slot_label">行政诉讼法院</div>
              <el-input v-model="extendTimeInfo.court" placeholder="请输入行政诉讼法院" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="distrainInventory">
              <div slot="label" class="slot_label">查封扣押清单号</div>
              <el-input v-model="extendTimeInfo.distrainInventory" disabled></el-input>
            </el-form-item>
            <!-- <el-form-item label="查封扣押清单号：" prop="num" class="spetial">
              <el-select v-model="extendTimeInfo.value" placeholder="选择查封扣押单号">
                <el-option
                  v-for="item in somethingList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>-->
            <!-- </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="margin-top: 40px;text-align: right;padding-bottom:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成延长查封扣押期限决定书</el-button>
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
    },
    editStatusFromDoc: {
      type: Boolean
    }
  },
  data() {
    return {
      extendTimeInfo: {
        companyName: '', //单位名称
        location: '', //所在地区
        closedTime: '', // 查封扣押日期
        lastCloseWritLabel: '', //查封扣押决定书文号
        itemName: '', //物品名称
        forcedActions: '', //强制措施
        postponeReason: '', //延期原因
        endTime: '', //延期结束日期
        reDiscussGovn: '', // 复议人民政府
        safeSupDept: '', // 复议应急管理局
        court: '', // 行政诉讼法院
        distrainInventory: '' // 查封扣押清单号
      },
      writList: [
        {
          label: '没有label',
          value: '1'
        },
        {
          label: '没有label-2',
          value: '2'
        }
      ], // 文书列表
      somethingList: [],
      rules: {
        companyName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        location: [{ required: true, message: '请输入所在地区', trigger: 'blur' }],
        closedTime: [{ required: true, message: '请输入查封扣押日期', trigger: 'blur' }],
        lastCloseWritLabel: [
          {
            required: true,
            message: '请输入查封扣押决定书文号',
            trigger: 'blur'
          }
        ],
        itemName: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        forcedActions: [{ required: true, message: '请输入强制措施', trigger: 'blur' }],
        postponeReason: [{ required: true, message: '请输入延期原因', trigger: 'blur' }],
        endTime: [{ required: true, message: '请输入延期结束日期', trigger: 'blur' }],
        reDiscussGovn: [{ required: true, message: '请输入复议人民政府', trigger: 'blur' }],
        safeSupDept: [{ required: true, message: '请输入复议应急管理局', trigger: 'blur' }],
        court: [{ required: true, message: '请输入行政诉讼法院', trigger: 'blur' }],
        distrainInventory: [{ required: true, message: '请输入查封扣押清单号', trigger: 'blur' }]
      },
      flag: true,
      isDisabled: false
    }
  },
  mounted() {
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        time = []
      console.info('回显', this.info.writInfo)
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.companyName = item.tagContent
            break
          case 'tag3':
            total.closedTime = item.tagContent
              ? stringToDate(
                  item.tagContent
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                )
              : ''
            break
          case 'tag4_location':
            total.location = item.tagContent
            break
          case 'tag4':
            total.lastCloseWritLabel = item.tagContent
            break
          case 'tag5':
            total.itemName = item.tagContent
            break
          case 'tag6':
            total.forcedActions = item.tagContent
            break
          case 'tag7':
            total.postponeReason = item.tagContent
            break
          case 'tag8':
            total.endTime = item.tagContent
              ? stringToDate(
                  item.tagContent
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                )
              : ''
            break
          case 'tag9':
            total.distrainInventory = item.tagContent
            break
          case 'tag10':
            total.reDiscussGovn = item.tagContent
            break
          case 'tag11':
            total.safeSupDept = item.tagContent
            break
          case 'tag12':
            total.court = item.tagContent
            break
        }
        return total
      }, {})
      this.extendTimeInfo = inputInfo
    } else {
      this.initInfo()
    }
    this.getDecisionWrit()
  },
  methods: {
    // 提交盖章
    /* seal() {
      let _audiReq = {
        auditTypeCode: "ta80040", // 盖章审核
        handlerDeptId: "", // 审核人部门 id
        handlerUserId: "", // 审核人
        requestDeptName: JSON.parse(localStorage.getItem("res")).userEntity
          .deptName, // 承办人部门，现在先不填
        requestId: this.info.auditInfo.writId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.info.auditInfo.responsiblePerson, // 承办人名称
        submitterCause: this.info.auditInfo.companyName // 案件名称 或 企业名称
      };
      this.$emit("toSeal", _audiReq);
    }, */
    // 初始化文书数据
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.extendTimeInfo = {
        companyName: this.info.auditInfo.companyName, //单位名称
        location: '', //所在地区
        closedTime: void 0, // 查封扣押日期
        lastCloseWritLabel: '', //查封扣押决定书文号
        itemName: '', //物品名称
        forcedActions: '', //强制措施
        postponeReason: '', //延期原因
        endTime: void 0, //延期结束日期
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
              value: val.writNoName,
              writId: val.writId
            })
          })
        })
        .catch(err => console.info(err))
    },
    // 点击确定按钮事件
    sure() {
      // extendTimeInfo
      this.$refs.extendTimeInfo.validate(valid => {
        if (valid) {
          // 验证成功
          let listOrder = this.extendTimeInfo.distrainInventory
          let listOrderStr = listOrder ? listOrder.match(/(\d+)/g).pop() : ''
          if (this.editStatusFromDoc === false) {
            let data = getWritParams({
              tag2: this.extendTimeInfo.companyName,
              tag3: dateFormat(this.extendTimeInfo.closedTime, 'yyyy年mm月dd日'),
              tag4: this.extendTimeInfo.lastCloseWritLabel,
              tag4_location: this.extendTimeInfo.location,
              tag5: this.extendTimeInfo.itemName,
              tag6: this.extendTimeInfo.forcedActions,
              tag7: this.extendTimeInfo.postponeReason,
              tag8: dateFormat(this.extendTimeInfo.endTime, 'yyyy年mm月dd日'),
              tag9: listOrderStr,
              tag10: this.extendTimeInfo.reDiscussGovn,
              tag11: this.extendTimeInfo.safeSupDept,
              tag12: this.extendTimeInfo.court
            })
            let params = {
                companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
              contractorIds: this.info.auditInfo.udtIds,
              writType: 'YCCFKYQXJDS',
              sourceId: this.info.auditInfo.sourceId,
              data: data
            }
            console.log(data)
            this.$emit('createWrit', params)
            this.isDisabled = true
          } else {
            // 修改
            let data = getWritParams({
              tag2: this.extendTimeInfo.companyName,
              tag3: dateFormat(this.extendTimeInfo.closedTime, 'yyyy年mm月dd日'),
              tag4: this.extendTimeInfo.lastCloseWritLabel,
              tag4_location: this.extendTimeInfo.location,
              tag5: this.extendTimeInfo.itemName,
              tag6: this.extendTimeInfo.forcedActions,
              tag7: this.extendTimeInfo.postponeReason,
              tag8: dateFormat(this.extendTimeInfo.endTime, 'yyyy年mm月dd日'),
              tag9: listOrderStr,
              tag10: this.extendTimeInfo.reDiscussGovn,
              tag11: this.extendTimeInfo.safeSupDept,
              tag12: this.extendTimeInfo.court
            })
            let params = {
              contractorIds: this.info.auditInfo.udtIds,
              writType: 'YCCFKYQXJDS',
              sourceId: this.info.auditInfo.sourceId,
              data: data
            }
            console.log('修改传递的参数', params)
            this.$emit('createWrit', params)
          }
        } else {
          console.info('error submit')
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  },
  watch: {
    'extendTimeInfo.lastCloseWritLabel': {
      handler: function(val, oldVal) {
        if (!val || val === '' || this.flag) return
        let temp = null
        this.writList.forEach((item, index) => {
          if (item.value === this.extendTimeInfo.lastCloseWritLabel) {
            temp = index
          }
        })
        getWritDataByWritId({ writId: this.writList[temp].writId }).then(res => {
          console.log(res.data)
          let arr = [],
            device = null
          res.data.forEach(item => {
            switch (item.tagName) {
              case 'tag5':
                this.extendTimeInfo.forcedActions = item.tagContent
                break
              case 'tag6':
                this.extendTimeInfo.closedTime = stringToDate(
                  item.tagContent
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                )
                break
              case 'xiaoying':
                device = JSON.parse(item.tagContent)
                break
            }
          })
          this.extendTimeInfo.distrainInventory = device.name
          let nameArr = device.list.reduce((total, item) => {
            total.push(item.evidence)
            return total
          }, [])
          this.extendTimeInfo.itemName = nameArr.join(',')
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.leftStyle {
  /deep/ .el-input {
    margin-left: 48px;
    // width: 86% !important;
  }
}
// .chafengDesic {
//   /deep/ .el-input {
//     width: 160% !important;
//   }
// }
/deep/.el-select {
  width: 100%;
}
.leftStyleone {
  /deep/ .el-input {
    margin-left: 26px;
  }
}
.extendClosedTime_content {
  // padding-left: 22px;
  // padding-right: 36px;
  padding: 15px 16px 20px 16px;
  /deep/ .el-form-item__label {
    color: #333 !important;
  }
}
.el-form-item {
  margin-bottom: -5px;
  // margin-top: 10px;
  white-space: nowrap;
}
.el-col-11 {
  margin-right: 16px;
}
/deep/.el-col-12 {
  width: 45%;
  /deep/ .el-input {
    width: 100%;
  }
  // /deep/ .el-input__inner {
  //   width: 80%;
  // }
  &:last-child {
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}
.spetial {
  /deep/ .el-form-item__content .el-select {
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
  margin-top: 30px;
}
.widthdoc {
  /deep/ .el-form-item__label {
    width: 149px !important;
  }
  // /deep/ .el-input {
  //   width: 144%;
  // }
}
.kayaStyle {
  /deep/ .el-form-item__label {
    width: 123px !important;
  }
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
