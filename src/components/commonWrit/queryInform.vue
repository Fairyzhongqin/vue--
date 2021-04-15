<template>
  <div>
    <div class="content">
      <el-form ref="queryInformInfo" :model="queryInformInfo" label-width="120px" :rules="rules" :inline-message="true" :show-message="false">
        <el-row>
          <el-form-item prop="caseName">
            <div slot="label" class="slot_label">案件名称</div>
            <el-input v-model="queryInformInfo.caseName" placeholder="请输入案件名称" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row class="query-flex">
          <el-col :span="11">
            <el-form-item prop="subject">
              <div slot="label" class="slot_label">询问对象</div>
              <el-input v-model="queryInformInfo.subject" placeholder="请输入询问人名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="query-flex-grow">
            <el-form-item prop="queryTime">
              <div slot="label" class="slot_label">询问时间</div>
              <el-date-picker format="yyyy-MM-dd HH:mm" v-model="queryInformInfo.queryTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row></el-row>
        <el-row>
          <el-form-item prop="queryAddress">
            <div slot="label" class="slot_label">询问地点</div>
            <el-input v-model="queryInformInfo.queryAddress" placeholder="请输入询问地点" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="material">
            <div slot="label" class="slot_label">携带证件材料</div>
            <div class="query_special">
              <el-row>
                <el-checkbox v-model="queryInformInfo.idCard"></el-checkbox>
                <span>1、身份证</span>
              </el-row>
              <el-row>
                <el-checkbox v-model="queryInformInfo.certificate"></el-checkbox>
                <span>2、营业执照</span>
              </el-row>
              <el-row>
                <el-checkbox v-model="queryInformInfo.corporateCert"></el-checkbox>
                <span>3、法定代表人身份证明或者委托书</span>
              </el-row>
              <el-row>
                <el-checkbox v-model="queryInformInfo.otherCert"></el-checkbox>
                <span>4、其他</span>
                <el-input v-model="queryInformInfo.material" placeholder="请输入其他需要携带的证件材料" style="margin-left:13px; "></el-input>
              </el-row>
            </div>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item prop="deptAddress">
            <div slot="label" class="slot_label">部门地址</div>
            <el-input v-model="queryInformInfo.deptAddress" placeholder="请输入部门地址" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20" class="query-flex">
          <el-col :span="11">
            <el-form-item prop="contactor">
              <div slot="label" class="slot_label">联系人</div>
              <el-input v-model="queryInformInfo.contactor" placeholder="请输入联系人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="query-flex-grow">
            <el-form-item prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="queryInformInfo.phone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right;padding-bottom:10px;padding-top:10px;margin-top:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成询问通知书</el-button>
      <!-- <el-button type="primary" @click="lawSeal" :disabled="lawDisabled">加盖执法专用章</el-button> -->
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, stringToDate, getFirstErrMsg } from '@/utils/util'
import { sealWrit } from '@/api/fileRelated'

export default {
  props: {
    info: {
      type: Object
    },
    ableToZhifa: {
      type: Boolean
    },
    isRecalled: {
      // 是否是流程回退
      type: String
    }
  },
  data() {
    return {
      queryInformInfo: {
        caseName: '', // 案件名称
        subject: '', // 询问对象
        queryTime: undefined, // 询问时间
        queryAddress: '', // 询问地点
        material: '', // 证件材料
        deptAddress: '', // 部门地址
        contactor: '', // 联系人
        phone: '', // 联系电话
        idCard: true, // 身份证
        certificate: true, // 营业执照
        corporateCert: true, // 身份证明或者委托书
        otherCert: false // 其他
      },
      rules: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        subject: [{ required: true, message: '请输入询问对象', trigger: 'blur' }],
        queryTime: [{ required: true, message: '请输入询问时间', trigger: 'blur' }],
        queryAddress: [{ required: true, message: '请输入询问地点', trigger: 'blur' }],
        deptAddress: [{ required: true, message: '请输入部门地址', trigger: 'blur' }],
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
        ]
      },
      lawDisabled: false
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
            total.subject = item.tagContent
            break
          case 'tag3':
            total.caseName = item.tagContent
            break
          case 'tag4':
            total.queryTime = stringToDate(
              item.tagContent
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', ' ')
                .replace('时', ':') + '00:00'
            )
            break
          case 'tag5':
            total.queryAddress = item.tagContent
            break
          case 'tag6':
            total.idCard = item.tagContent === 'true'
            break
          case 'tag7':
            total.certificate = item.tagContent === 'true'
            break
          case 'tag8':
            total.corporateCert = item.tagContent === 'true'
            break
          case 'tag9':
            total.otherCert = item.tagContent === 'true'
            break
          case 'tag10':
            total.material = item.tagContent
            break
          case 'tag11':
            total.deptAddress = item.tagContent
            break
          case 'tag12':
            total.contactor = item.tagContent
            break
          case 'tag13':
            total.phone = item.tagContent
            break
        }
        return total
      }, {})
      this.queryInformInfo = inputInfo
    } else {
      this.initInfo()
    }
  },
  methods: {
    // // 提交盖执法章
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
    //       this.$message({
    //         message: err,
    //         type: "warning"
    //       });
    //     });
    // },
    // 初始化文书数据
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.queryInformInfo = {
        caseName: this.info.auditInfo.caseName, // 案件名称
        subject: this.info.auditInfo.subject, // 询问对象
        queryTime: new Date(), // 询问时间
        queryAddress: user.sysDeptEntity.deptAddress, // 询问地点
        material: '', // 证件材料
        deptAddress: user.sysDeptEntity.deptAddress, // 部门地址
        contactor: user.userEntity.nickName, // 联系人
        phone: user.userEntity.mobile, // 联系电话
        idCard: true, // 身份证
        certificate: true, // 营业执照
        corporateCert: true, // 身份证明或者委托书
        otherCert: false // 其他
      }
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.queryInformInfo.validate((val, errInfo) => {
        if (val) {
          console.log(this.queryInformInfo.queryTime)
          let data = getWritParams({
            tag2: this.queryInformInfo.subject ? this.queryInformInfo.subject.trim() : '',
            tag3: this.queryInformInfo.caseName,
            tag4: dateFormat(this.queryInformInfo.queryTime, 'yyyy年mm月dd日HH时'),
            tag5: this.queryInformInfo.queryAddress,
            tag6: this.queryInformInfo.idCard,
            tag7: this.queryInformInfo.certificate,
            tag8: this.queryInformInfo.corporateCert,
            tag9: this.queryInformInfo.otherCert,
            tag10: this.queryInformInfo.material,
            tag11: this.queryInformInfo.deptAddress,
            tag12: this.queryInformInfo.contactor,
            tag13: this.queryInformInfo.phone
          })
          let params = {
            companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XWTZS',
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
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 10px 16px 0px 16px;
}
.query-flex {
  display: flex;
  .query-flex-grow {
    flex-grow: 1;
  }
}
.el-form-item {
  margin-bottom: -5px;
  // margin-top: 6px;
  white-space: nowrap;
}
.el-col-12 {
  /deep/ .el-input {
    width: 100%;
  }
  // /deep/ .el-input__inner {
  //   width: 88%;
  // }
  &:last-child {
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}
.query_special {
  // margin-top: 24px;
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
  .el-row {
    display: flex;
  }
}
// .only {
//   /deep/ .el-form-item__content {
//     margin-left: 125px !important;
//   }
// }
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
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
  margin-top: 30px;
}
.el-col-11 {
  margin-right: 10px;
}
</style>
