<template>
  <div>
    <div class="take_evidence_content">
      <el-form ref="takeEvidenceInfo" :model="takeEvidenceInfo" label-width="120px" :rules="rules" :inline-message="true" :show-message="false">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="checkTimeStart">
              <div slot="label" class="slot_label">取证开始时间</div>
              <el-date-picker
                v-model="takeEvidenceInfo.checkTimeStart"
                type="datetime"
                placeholder="请选择取证开始时间"
                align="left"
                :picker-options="pickerStart"
                format="yyyy-MM-dd HH:mm"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="checkTimeEnd">
              <div slot="label" class="slot_label">取证结束时间</div>
              <el-date-picker
                v-model="takeEvidenceInfo.checkTimeEnd"
                type="datetime"
                placeholder="请选择取证结束时间"
                align="left"
                :picker-options="pickerEnd"
                format="yyyy-MM-dd HH:mm"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="takenSubject">
              <div slot="label" class="slot_label">被抽样取证人</div>
              <el-input v-model="takeEvidenceInfo.takenSubject" placeholder="请输入被抽样取证人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="chargePerson">
              <div slot="label" class="slot_label">现场负责人</div>
              <el-input v-model="takeEvidenceInfo.chargePerson" placeholder="请输入现场负责人" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-form-item class="margin_left" prop="address">
            <div slot="label" class="slot_label">地址</div>
            <el-input v-model="takeEvidenceInfo.address" placeholder="请输入地址" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="takeEvidenceInfo.phone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="postCode">
              <div slot="label" class="slot_label">邮政编码</div>
              <el-input v-model="takeEvidenceInfo.postCode" placeholder="请输入邮政编码" maxlength="6" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-form-item class="margin_left" prop="evidenceSpot">
            <div slot="label" class="slot_label">抽样地点</div>
            <el-input v-model="takeEvidenceInfo.evidenceSpot" placeholder="请输入抽样地点" clearable></el-input>
          </el-form-item>
        </el-row>
        <div style="paddingTop:5px">
          抽样取证物品
          <el-button type="primary" style="margin-left: 12px;" size="mini" @click="add">+ 新增</el-button>
        </div>
        <el-row :gutter="20" v-for="(item, index) in takeEvidenceInfo.evidenceEntity" :key="index" style="display: flex; align-items: flex-end">
          <el-col :span="7">
            <el-form-item label-width="100px" :prop="`evidenceEntity[${index}].name`" :rules="evidenceRules.evidenceName">
              <div slot="label" class="slot_label">物品名称</div>
              <el-input v-model="item.name" placeholder="请输入物品名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="80px" :prop="`evidenceEntity[${index}].size`" :rules="evidenceRules.evidenceSize">
              <div slot="label" class="slot_label">规格</div>
              <el-input v-model="item.size" placeholder="请输入规格" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="80px" :prop="`evidenceEntity[${index}].amount`" :rules="evidenceRules.evidenceAmount">
              <div slot="label" class="slot_label">数量</div>
              <el-input v-model="item.amount" placeholder="请输入数量" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="mini" @click="del(index)">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right;padding:10px 0;padding-right:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成抽样取证凭证</el-button>
      <!-- <el-button type="primary" @click="lawSeal" :disabled="lawDisabled">加盖执法专用章</el-button> -->
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, handleDateRef, getFirstErrMsg } from '@/utils/util'
import { sealWrit } from '@/api/fileRelated'

export default {
  name: 'takeEvidence',
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      takeEvidenceInfo: {
        takenSubject: '', // 抽样取证人
        chargePerson: '', // 现场负责人
        address: '', // 地址
        phone: '', // 电话
        postCode: '', // 邮政编码
        checkTimeStart: void 0, // 取证结束时间
        checkTimeEnd: void 0, // 取证开始时间
        evidenceSpot: '', // 抽样地址
        evidenceEntity: [
          // 抽样取证物品
          {
            name: '', // 物品名称
            size: '', // 规格
            amount: '' // 数量
          }
        ]
      },
      pickerStart: {}, // 开始时间选择限制
      pickerEnd: {}, // 结束时间选择限制
      evidenceRules: {
        evidenceName: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        evidenceSize: [{ required: true, message: '请输入物品规格', trigger: 'blur' }],
        evidenceAmount: [{ required: true, message: '请输入物品数量', trigger: 'blur' }]
      },
      createReq: {
        sourceId: '',
        userId: '',
        contractorIds: '',
        writType: 'CYQYPZ',
        data: []
      },
      rules: {
        takenSubject: [{ required: true, message: '请输入被抽样取证人', trigger: 'blur' }],
        chargePerson: [{ required: true, message: '请输入现场负责人', trigger: 'blur' }],
        checkTimeStart: [{ required: true, message: '请选择取证开始时间', trigger: 'blur' }],
        checkTimeEnd: [{ required: true, message: '请选择取证结束时间', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        phone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入联系电话'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        postCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入邮政编码'
          },
          {
            pattern: /^(0[1234567]|1[012356]|2[01234567]|3[0123456]|4[01234567]|5[1234567]|6[1234567]|7[012345]|8[013456])\d{4}$/,
            trigger: ['blur', 'change'],
            message: '您输入的邮编格式不正确'
          }
        ],
        evidenceSpot: [{ required: true, message: '请输入抽样地点', trigger: 'blur' }]
      },
      lawDisabled: false
    }
  },
  created() {
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        time = []
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.takenSubject = item.tagContent
            break
          case 'tag3':
            total.chargePerson = item.tagContent
            break
          case 'tag4':
            total.address = item.tagContent
            break
          case 'tag5':
            total.phone = item.tagContent
            break
          case 'tag6':
            total.postCode = item.tagContent
            break
          case 'tag7':
            total.checkTimeStart = handleDateRef(item.tagContent)
            break
          case 'tag8':
            total.checkTimeEnd = handleDateRef(item.tagContent)
            break
          case 'tag9':
            total.evidenceSpot = item.tagContent
            break
        }
        return total
      }, {})
      let arr = []
      this.info.writInfo.forEach(item => {
        let first = Number(item.tagName.split('-')[0].slice(6)) - 1,
          second = item.tagName.split('-')[1]
        if (!arr[first]) {
          arr[first] = {}
        }
        switch (second) {
          // case 'col1':
          //   arr[first].ordeNumber = item.tagContent;
          //   break;
          case 'col2':
            arr[first].name = item.tagContent
            break
          case 'col3':
            arr[first].size = item.tagContent
            break
          case 'col4':
            arr[first].amount = item.tagContent
            break
        }
      })
      inputInfo.evidenceEntity = arr
      this.takeEvidenceInfo = inputInfo
    } else {
      this.initInfo()
    }
  },
  methods: {
    // 盖执法私章
    // lawSeal() {
    //   sealWrit({
    //     writId: this.info.auditInfo.writId,
    //     signType: "SINGLE_LAW"
    //   })
    //     .then(res => {
    //       if (res.code === "0") {
    //         this.$message({
    //           message: "加盖执法专用章成功",
    //           type: "success"
    //         });
    //         this.lawDisabled = true;
    //         this.$emit("toLawSeal");
    //       }
    //     })
    //     .catch(err => {
    //       console.info(err);
    //     });
    // },
    del(index) {
      this.takeEvidenceInfo.evidenceEntity.splice(index, 1)
    },
    //新增
    add() {
      this.takeEvidenceInfo.evidenceEntity.push({
        name: '',
        size: '',
        amount: ''
      })
    },
    // 时间选择限制
    handlePicker() {
      let startDate, startTime, endDate, endTime, startArr, endArr
      let infoStart = this.takeEvidenceInfo.checkTimeStart
      let infoEnd = this.takeEvidenceInfo.checkTimeEnd
      startArr = infoStart ? dateFormat(infoStart, 'yyyy-mm-dd HH:MM:ss').split(' ') : ['', '']
      endArr = infoEnd ? dateFormat(infoEnd, 'yyyy-mm-dd HH:MM:ss').split(' ') : ['', '']
      startDate = startArr[0]
      startTime = startArr[1]
      endDate = endArr[0]
      endTime = endArr[1]
      let start = new Date(startDate + ' 00:00:00').getTime()
      let end = endDate ? new Date(endDate + ' 23:59:59').getTime() : ''
      this.pickerStart = {
        disabledDate: time => {
          let res
          if (end) {
            res = time.getTime() >= end
          }
          return res
        },
        selectableRange: startDate === endDate ? '00:00:00 - ' + endTime : '00:00:00 - 23:59:59'
      }
      this.pickerEnd = {
        disabledDate: time => {
          let res
          if (start) {
            res = time.getTime() < start
          }
          return res
        },
        selectableRange: startDate === endDate ? startTime + ' - 23:59:59' : '00:00:00 - 23:59:59'
      }
    },
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.takeEvidenceInfo.checkTimeStart = new Date()
      this.takeEvidenceInfo.checkTimeEnd = void 0
      this.createReq = {
        companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
        sourceId: this.info.auditInfo.sourceId,
        contractorIds: this.info.auditInfo.udtIds,
        writType: 'CYQZPZ',
        data: []
      }
    },
    // 生成文书里表格的参数
    handleEvidence() {
      let evidence = []
      this.takeEvidenceInfo.evidenceEntity.forEach((evi, index) => {
        evidence.push({
          tagContent: index + 1,
          tagName: `entity${index + 1}-col1`
        })
        for (let key in evi) {
          if (key === 'name') {
            evidence.push({
              tagContent: evi[key],
              tagName: `entity${index + 1}-col2`
            })
          } else if (key === 'size') {
            evidence.push({
              tagContent: evi[key],
              tagName: `entity${index + 1}-col3`
            })
          } else {
            evidence.push({
              tagContent: evi[key],
              tagName: `entity${index + 1}-col4`
            })
          }
        }
      })
      return evidence
    },
    sure() {
      this.$refs.takeEvidenceInfo.validate((val, errInfo) => {
        if (val) {
          let takeEvidenceData = getWritParams({
            tag2: this.takeEvidenceInfo.takenSubject, // 被抽样取证人
            tag3: this.takeEvidenceInfo.chargePerson, // 现场负责人
            tag4: this.takeEvidenceInfo.address, // 地址
            tag5: this.takeEvidenceInfo.phone, // 联系电话
            tag6: this.takeEvidenceInfo.postCode, // 邮政编码
            tag7: dateFormat(this.takeEvidenceInfo.checkTimeStart, 'yyyy年mm月dd日HH时MM分'), // 抽样取证开始时间
            tag8: dateFormat(this.takeEvidenceInfo.checkTimeEnd, 'yyyy年mm月dd日HH时MM分'), // 抽样取证结束时间
            tag9: this.takeEvidenceInfo.evidenceSpot // 抽样地点
          })
          let evidence = this.handleEvidence()
          takeEvidenceData = takeEvidenceData.concat(evidence)
          this.createReq.data = takeEvidenceData
          this.$emit('createWrit', this.createReq)
          this.isDisabled = true
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
    }
  },
  watch: {
    'takeEvidenceInfo.checkTimeStart': function(no, vo) {
      this.handlePicker()
    },
    'takeEvidenceInfo.checkTimeEnd': function(no, vo) {
      this.handlePicker()
    }
  }
}
</script>

<style lang="less" scoped>
.take_evidence_content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 16px 10px 16px;
  .query-pad-left {
    padding-left: 0 !important;
  }
  .query-pad-right {
    padding-right: 0 !important;
  }
}
.el-form-item {
  margin-bottom: -5px;
  margin-top: 2px;
  white-space: nowrap;
  &.margin_left {
    margin-right: 10px;
    margin-left: 10px;
  }
}
.el-col-12 {
  /deep/ .el-input {
    width: 100%;
  }
  /deep/ .el-input__inner {
    width: 100%;
  }
  &:last-child {
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
  height: 30px;
  padding-left: 0 0 0 10px;
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
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
  margin-top: 5px;
}
// .time_picker {
//   display: flex;
//   height: 40px;
//   line-height: 35px;
// }
.time_picker .el-form-item__content {
  display: flex;
}
/deep/.el-col-2 {
  margin-left: 20px;
  margin-bottom: 5px;
}
/deep/.el-date-editor .el-range-input {
  width: 80%;
}
</style>
