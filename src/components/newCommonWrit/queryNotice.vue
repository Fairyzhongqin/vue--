<template>
  <div>
    <div class="content">
      <el-form
        ref="queryInformInfo"
        :model="queryInformInfo"
        :rules="rules"
        label-width="100px"
        label-position="left"
        :inline-message="true"
        :show-message="false"
        :hide-required-asterisk="true"
      >
        <el-row>
          <el-form-item label="案件名称：" prop="caseName">
            <el-input v-model="queryInformInfo.caseName" placeholder="请输入案件名称"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="询问对象：" prop="subject">
              <el-input v-model="queryInformInfo.subject" placeholder="请输入询问对象"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="询问时间：" prop="queryTime">
              <el-date-picker
                v-model="queryInformInfo.queryTime"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="询问地点：" prop="queryAddress">
            <el-input v-model="queryInformInfo.queryAddress" placeholder="请输入询问地点"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="带上证件材料：" prop="material">
            <div class="special">
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
                <el-input
                  v-model="queryInformInfo.material"
                  placeholder="请输入其他需要带上的证件材料"
                  style="margin-left:13px; "
                ></el-input>
              </el-row>
            </div>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item label="应急管理局地址：" prop="deptAddress">
            <el-input v-model="queryInformInfo.deptAddress" placeholder="请输入应急管理局地址"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人：" prop="contactor">
              <el-input v-model="queryInformInfo.contactor" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="phone">
              <el-input v-model="queryInformInfo.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">生成询问通知书</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat } from "@/utils/util";

export default {
  props: {
    // 承办人
    contractorIds: {
      type: String,
      required: true
    },
    // 保存的数据id
    sourceId: {
      type: String,
      required: true
    },
    // 询问通知文书具体信息
    detailInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      queryInformInfo: {
        caseName: "", // 案件名称
        subject: "", // 询问对象
        queryTime: new Date(), // 询问时间
        queryAddress: "", // 询问地点
        material: "", // 证件材料
        deptAddress: "", // 应急管理局地址
        contactor: "", // 联系人
        phone: "", // 联系电话
        idCard: false, // 身份证
        certificate: false, // 营业执照
        corporateCert: false, // 身份证明或者委托书
        otherCert: false, // 其他
      },
      rules: {
        caseName: [
            { required: true, message: '请输入案件名称', trigger: 'blur' },
          ],
        subject: [
            { required: true, message: '请输入询问对象', trigger: 'blur' },
          ],
        queryTime: [
            { required: true, message: '请输入询问时间', trigger: 'blur' },
          ],
        queryAddress: [
            { required: true, message: '请输入询问地点', trigger: 'blur' },
          ],
        deptAddress: [
            { required: true, message: '请输入应急管理局地址', trigger: 'blur' },
          ],
        contactor: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
          ],
        phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
          ],
      }
    }
  },
  mounted() {
    this.queryInformInfo = this.detailInfo;
  },
  methods: {
    // 点击确定按钮事件
    sure() {
      this.$refs.queryInformInfo.validate((val) => {
        if(val) {
          let data = getWritParams({
            tag2: this.queryInformInfo.subject,
            tag3: this.queryInformInfo.caseName,
            tag4: dateFormat(this.queryInformInfo.queryTime, 'yyyy年mm月dd日'),
            tag5: this.queryInformInfo.queryAddress,
            tag6: this.queryInformInfo.idCard,
            tag7: this.queryInformInfo.certificate,
            tag8: this.queryInformInfo.corporateCert,
            tag9: this.queryInformInfo.otherCert,
            tag10: this.queryInformInfo.material,
            tag11: this.queryInformInfo.deptAddress,
            tag12: this.queryInformInfo.contactor,
            tag13: this.queryInformInfo.phone
          });
          let params = {contractorIds: this.contractorIds, writType: "XWTZS", sourceId: this.sourceId, data: data};
          this.$emit("makeWrit", params)
        } else {
          console.log('hhh')
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit("close")
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding: 0 16px;
}
.el-form-item {
  margin-bottom: -5px;
  margin-top: 10px;
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
</style>
