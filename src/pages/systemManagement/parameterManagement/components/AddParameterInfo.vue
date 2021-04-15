<template>
  <div>
    <div class="addParameterInfo">
      <div @click="backToParameterList" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="addParameterForm">
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="110px"
          class="demo-ruleForm"
          :rules="rules"
          :show-message="false"
          :label-position="labelPosition"
        >
          <el-form-item label="" prop="name">
            <div slot="label" class="slot_label">参数名</div>
            <el-input v-model="ruleForm.name" placeholder="请输入参数名" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="desc">
            <div slot="label" class="slot_label">参数值</div>
            <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入参数值"></el-input>
          </el-form-item>
          <el-form-item label="" prop="remark">
            <div slot="label" class="slot_label">备注</div>
            <el-input v-model="ruleForm.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="button-group">
      <el-row class="ct">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  addParameterData,
  getPamameterList
} from "@/api/systemManagement/parameterManagement/index";
export default {
  name: "addParameterInfo",
  data() {
    return {
      labelPosition:"left",
      ruleForm: {
        name: "",
        desc: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, trigger: "blur" }],
        desc: [{ required: true, trigger: "blur" }],
        remark: [{ required: true, trigger: "blur" }]
      }
    };
  },
  methods: {
    backToParameterList() {
      this.$store.commit("changeParamsAddStatus", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addParameterData({
            name: this.ruleForm.name,
            remark: this.ruleForm.remark,
            value: this.ruleForm.desc
          })
            .then(res => {
              console.log(res);
              if (res.code === "0") {
                this.backToParameterList();
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
              }
            })
            .catch(error => {
              if (error === "参数名字已经存在") {
                this.$message.error("该参数名已被占用，请重新输入！");
              } else {
                throw new Error(error);
              }
            });
        } else {
          console.info("提交错误");
        }
      });
    },
    resetForm() {
      this.ruleForm.name = null;
      this.ruleForm.desc = null;
      this.ruleForm.remark = null;
      this.backToParameterList();
    }
  },
  created() {},
  mounted() {},
  destroyed() {}
};
</script>
<style scoped lang="less">
.addParameterInfo {
  background: #fff;
  padding: 8px;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 30px 82px 33px;
  border-radius: 8px;
  height: 100%;
  position: relative;
}
.back-button {
  position: absolute;
  left: 16px;
  top: 18px;
  color: #0099ff;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.addParameterForm {
  width: 41%;
  margin: 30px 0 125px 10px;
}
.button-group {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -1px 0px 0px rgba(224, 224, 224, 1);
  position: fixed;
  //   left: 16%;
  bottom: 0px;
  z-index: 9999;
}
.ct {
  padding-right: 15%;
  text-align: center;
}
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: transparent;
  margin: 0;
}
/deep/.el-form-item{
  margin:10px;
}
</style>