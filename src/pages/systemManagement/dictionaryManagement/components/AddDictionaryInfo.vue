<template>
  <div>
    <div class="addDictionaryInfo">
      <div @click="backToDictionaryList" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="addDictionaryForm">
        <el-form
          :model="addDictionaryForm"
          ref="addDictionaryForm"
          label-width="100px"
          :rules="addDictionaryFormRules"
          :label-position="labelPosition"
          :show-message="false"
          
        >
          <el-form-item label="" prop="name">
            <div slot="label" class="slot_label">字典名称</div>
            <el-input v-model="addDictionaryForm.name" placeholder="字典名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="type">
            <div slot="label" class="slot_label">字典类型</div>
            <el-input v-model="addDictionaryForm.type" placeholder="字典类型" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="code" >
            <div slot="label" class="slot_label">字典代码</div>
            <el-input v-model="addDictionaryForm.code" placeholder="字典代码" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="value">
            <div slot="label" class="slot_label">字典值</div>
            <el-input v-model="addDictionaryForm.value" placeholder="字典值" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="order">
            <div slot="label" class="slot_label">排序</div>
            <el-input v-model.number="addDictionaryForm.order" placeholder="排序" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="remark">
            <div slot="label" class="slot_label">注释</div>
            <el-input v-model="addDictionaryForm.remark" placeholder="注释" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="parentId">
            <div slot="label" class="slot_label">注释上级类别</div>
            <el-input v-model="addDictionaryForm.parentId" placeholder="上级类别" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="button-group">
      <el-row class="ct">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm('addDictionaryForm')">保存</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { addDictionaryData } from "@/api/systemManagement/dictionaryManagement";
export default {
  name: "addDictionaryInfo",
  data() {
    // 验证字典排序

    let checkOrder = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("排序不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          /* if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            } */
          callback();
        }
      }, 100);
    };
    return {
      labelPosition: "left",
      addDictionaryForm: {
        name: "",
        code: "",
        remark: "",
        value: "",
        type: "",
        order: ""
      },
      addDictionaryFormRules: {
        name: [{ required: true, trigger: "blur" }],
        code: [{ required: true, trigger: "blur" }],
        value: [{ required: true, trigger: "blur" }],
        remark: [{ required: true, trigger: "blur" }],
        type: [{ required: true, trigger: "blur" }],
        order: [{ validator: checkOrder, required: true, trigger: "blur" }]
      }
    };
  },
  methods: {
    backToDictionaryList() {
      // this.$store.commit("closeTags", {
      //   name: "新增字典信息",
      //   path: "/addDictionaryInfo"
      // });
      // this.$router.push("/dictionaryManagement");
      this.$store.commit("changeDicAddStatus", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addDictionaryData({
            code: this.addDictionaryForm.code,
            name: this.addDictionaryForm.name,
            remark: this.addDictionaryForm.remark,
            type: this.addDictionaryForm.type,
            orderNum: this.addDictionaryForm.order,
            value: this.addDictionaryForm.value
          })
            .then(res => {
              console.info(res);
              if (res.code === "0") {
                this.backToDictionaryList();
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
              }
            })
            .catch(error => {
              if (error === "字典表的code已经存在了") {
                this.$message({
                  message: "字典码已存在,请重新输入",
                  type: "warning"
                });
              } else {
                throw new Error(error);
              }
            });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.addDictionaryForm = {};
      this.backToDictionaryList();
    }
  },
  created() {},
  mounted() {},
  destroyed() {}
};
</script>
<style scoped lang="less">
.addDictionaryInfo {
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
.addDictionaryForm {
  width: 41%;
  margin: 30px 0 0 60px;
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
  margin:0px;
}
</style>
