<template>
  <div>
    <div class="pay-fine-content">
      <el-form ref="payFine" :rules="rules" :model="payFineInfo" label-position="right" label-width="140px" :show-message="false">
        <el-row>
          <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">处罚对象</div>
            <el-input v-model="payFineInfo.subject" placeholder="请输入处罚对象"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="address">
              <div slot="label" class="slot_label">地址</div>
            <el-input v-model="payFineInfo.address" placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="contactor">
              <div slot="label" class="slot_label">联系人</div>
              <el-input v-model="payFineInfo.contactor" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="payFineInfo.phone" placeholder="请输入联系电话" maxlength="12"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" class="width-special" prop="paytime">
              <div slot="label" class="slot_label">缴纳截止日期</div>
              <el-date-picker v-model="payFineInfo.paytime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item style="margin-top: 10px;" label="" prop="paySite">
              <div slot="label" class="slot_label">缴纳地点</div>
            <el-input class="vab" v-model="payFineInfo.paySite" type="textarea" :autosize="{ minRows: 1 }" placeholder="缴纳地点"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成缴纳罚款催告书</el-button>
    </span>
  </div>
</template>

<script>
import { getWritInfo, getWritDataByWritId } from '@api/fileRelated'
import { getWritParams, dateFormat, stringToDate, getFirstErrMsg } from '@/utils/util'
export default {
  name: 'payFine',
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      value2: '',
      dialogVisible: true,
      payFineInfo: {
        subject: '', //处罚对象：
        address: '', //地址：
        contactor: '', //联系人
        phone: '', //联系电话：
        paytime: '', //缴纳截止日期：
        paySite: '', //缴纳地点：
        writNoName: '' // 行政处罚决定书 文书编号
      },
      rules: {
        subject: [{ required: true, message: '请输入处罚对象', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        contactor: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入电话号码'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        paytime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        paySite: [{ required: true, message: '请输入缴纳地点', trigger: 'blur' }]
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
              this.payFineInfo.subject = item.tagContent
              break

            case 'tag5':
              let dateArr = item.tagContent.split(/[^\d]/).slice(0, 3)
              dateArr[1] = Number(dateArr[1]) - 1
              this.payFineInfo.paytime = new Date(...dateArr)
              break
            case 'tag6':
              this.payFineInfo.paySite = item.tagContent
              break
            case 'tag7':
              this.payFineInfo.address = item.tagContent
              break
            case 'tag8':
              this.payFineInfo.contactor = item.tagContent
              break
            case 'tag9':
              this.payFineInfo.phone = item.tagContent
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
        }).then(
          res => {
            this.payFineInfo = {
              subject: this.info.auditInfo.subject,
              address: user.sysDeptEntity.deptAddress,
              contactor: user.userEntity.nickName,
              paySite: user.sysDeptEntity.bank,
              phone: user.userEntity.mobile,
              paytime: new Date(),
              writNoName: !!res.data[0] ? res.data[0].writNoName : '',
              creatorTime: !!res.data[0] ? new Date(res.data[0].creatorTime) : void 0
            }
            // if (!!res.data[0]) {
            //   return getWritDataByWritId({
            //     writId: res.data[0].writId
            //   })
            // }
          },
          err => console.info(err)
        )
        // .then(
        //   res => {
        //     this.payFineInfo.creatorTime = stringToDate(res.data.)
        //   }
        // )
      }
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.payFine.validate((val, errInfo) => {
        if (val) {
          let data = getWritParams({
            tag2: this.payFineInfo.subject,
            tag3: dateFormat(this.payFineInfo.creatorTime, 'yyyy年mm月dd日'),
            tag4: this.payFineInfo.writNoName, // 行政处罚决定书文书编号
            tag5: dateFormat(this.payFineInfo.paytime, 'yyyy年mm月dd日'),
            tag6: this.payFineInfo.paySite,
            tag7: this.payFineInfo.address,
            tag8: this.payFineInfo.contactor,
            tag9: this.payFineInfo.phone
          })
          let params = {
            companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'JNFKCGS',
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
    }
  }
}
</script>

<style lang="less" scoped>
.pay-fine-content {
  padding: 0 16px;
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  padding-bottom: 10px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}
.width-special {
  display: flex;
  /deep/.el-form-item__label {
    width: 100px;
    flex-shrink: 0;
    padding-right: 0;
  }
  /deep/.el-form-item__content {
    width: 100%;
    margin-left: 0 !important;
  }
  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
