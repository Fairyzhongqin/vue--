<template>
  <div>
    <div class="addFreeCoefficien">
      <div @click="backToFreeCoefficienList" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="addFreeCoefficienForm">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addForm"
          label-width="110px"
          :label-position="labelPosition"
          :show-message="false"
        >
          <el-form-item label="影响值" prop="effectNum">
            <div slot="label" class="slot_label">影响值</div>
            <el-input v-model="addForm.effectNum" autocomplete="off" placeholder="影响值"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="radio">
            <div slot="label" class="slot_label">类型</div>
            <div class="radioBox">
              <el-radio v-model="addForm.radio" label="1">从重处罚</el-radio>
              <el-radio v-model="addForm.radio" label="2">事前态度因子</el-radio>
              <el-radio v-model="addForm.radio" label="3">事故态度因子</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <div slot="label" class="slot_label">备注</div>
            <el-input type="textarea" v-model="addForm.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="button-group">
      <el-row class="ct">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { saveData } from "@/api/knowledgeBase/coefficientOfDiscretion.js";
export default {
  name: "addFreeCoefficien",
  data() {
    return {
      // labelPosition
      labelPosition: "left",
      addForm: {
        effectNum: null,
        radio: "1",
        remark: ""
      },
      addFormRules: {
        effectNum: [{ required: true, trigger: "blur" }],
        radio: [{ required: true, trigger: "change" }],
        remark: [{ required: true, trigger: "change" }]
      }
    };
  },
  methods: {
    backToFreeCoefficienList() {
      // this.$store.commit("closeTags", {
      //   name: "新增自由裁量系数",
      //   path: "/addFreeCoefficien"
      // });
      // this.$router.push("/freeCoefficien");
      this.$store.commit("changeFreeAddStatus", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // add save function
    saveData() {
      saveData({
        effectNum: this.addForm.effectNum,
        remark: this.addForm.remark,
        type: this.addForm.radio
      })
        .then(res => {
          if (res.code === "0") {
            this.backToFreeCoefficienList();
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          }
        })
        .catch(error => {
          throw new Error(error);
        });
    },
    resetForm() {
      this.addForm.effectNum = null;
      this.addForm.radio = null;
      this.addForm.remark = null;
      this.backToFreeCoefficienList();
    }
  }
};
</script>
<style scoped lang="less">
.addFreeCoefficien {
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
.addFreeCoefficienForm {
  width: 40%;
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
</style>