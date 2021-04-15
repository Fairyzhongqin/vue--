<template>
  <div>
    <div class="editParameterInfo">
      <div @click="backToParameterList" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="editParameterForm">
        <el-form
          :model="editParameterForm"
          ref="editParameterForm"
          label-width="100px"
          class="demo-ruleForm"
          :show-message="false"
          :label-position="labelPosition"
          :rules="rules"
        >
          <el-form-item label="" prop="name">
            <div slot="label" class="slot_label">参数名</div>
            <el-input v-model="editParameterForm.name" placeholder="请输入参数名" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="value">
            <div slot="label" class="slot_label">参数值</div>
            <el-input type="textarea" v-model="editParameterForm.value" placeholder="请输入参数值"></el-input>
          </el-form-item>
          <el-form-item label="" prop="remark">
            <div slot="label" class="slot_label">备注</div>
            <el-input v-model="editParameterForm.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="button-group">
      <el-row class="ct">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm('editParameterForm')">保存</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { editParameterData } from "@/api/systemManagement/parameterManagement";
export default {
  name: "editParameterInfo",
  data() {
    return {
       labelPosition:"left",
      editParameterForm: {
        name: "",
        value: "",
        remark: "",
        id: JSON.parse(sessionStorage.editParameterData).id,
        orderNum: 0
      },
      rules: {
        name: [{ required: true, trigger: "blur" }],
        value: [{ required: true, trigger: "blur" }],
        remark: [{ required: true, trigger: "blur" }]
      }
    };
  },
  methods: {
    backToParameterList() {
      this.$store.commit("changeParamsEditStatus", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editParameterData({
            name: this.editParameterForm.name,
            value: this.editParameterForm.value,
            remark: this.editParameterForm.remark,
            id: this.editParameterForm.id,
            orderNum: this.editParameterForm.orderNum
          })
            .then(res => {
              if (res.code === "0") {
                // this.resetForm();
                sessionStorage.removeItem("editParameterData");
                this.backToParameterList();
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
              }
            })
            .catch(error => {
              throw new Error(error);
            });
        } else {
          console.info("保存失败");
          return false;
        }
      });
    },
    resetForm() {
      this.backToParameterList();
      this.editParameterForm.name = null;
      this.editParameterForm.value = null;
      this.editParameterForm.remark = null;
    },
    editDataFromParameterList() {
      if (sessionStorage.editParameterData) {
        // console.log(JSON.parse(sessionStorage.editParameterData));
        this.editParameterForm.name = JSON.parse(
          sessionStorage.editParameterData
        ).name;
        this.editParameterForm.value = JSON.parse(
          sessionStorage.editParameterData
        ).value;
        this.editParameterForm.remark = JSON.parse(
          sessionStorage.editParameterData
        ).remark;
        // 取到新值 然后分别赋值给这三个值
      } else {
        this.editParameterForm = null;
      }
    },
    // notice
    open() {
      this.$alert("保存成功", "提示", {
        confirmButtonText: "确定",
        callback: action => {
          this.backToParameterList();
        }
      });
    }
  },
  created() {
    this.editDataFromParameterList();
  },
  mounted() {},
  destroyed() {}
};
</script>
<style scoped lang="less">
.editParameterInfo {
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
.editParameterForm {
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
/deep/.el-form-item{
  margin:10px;
}
</style>