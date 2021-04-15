<template>
  <div>
    <div class="editFreeCoefficien">
      <div @click="backToFreeCoefficienList" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="editFreeCoefficienForm">
        <el-form
          :model="editFreeCoefficienForm"
          ref="editFreeCoefficienForm"
          label-width="110px"
          class="demo-ruleForm"
          :label-position="labelPosition"
          :rules="rules"
          :show-message="false"
        >
          <el-form-item label="" prop="value">
            <div slot="label" class="slot_label">影响值</div>
            <el-input v-model="editFreeCoefficienForm.value" autocomplete="off" placeholder="影响值"></el-input>
          </el-form-item>
          <el-form-item label="" prop="radio">
            <div slot="label" class="slot_label">类型</div>
            <!-- <el-input type="textarea" v-model="editFreeCoefficienForm.type"></el-input> -->
            <div class="radioBox">
              <el-radio v-model="editFreeCoefficienForm.radio" label="1">从重处罚</el-radio>
              <el-radio v-model="editFreeCoefficienForm.radio" label="2">事前态度因子</el-radio>
              <el-radio v-model="editFreeCoefficienForm.radio" label="3">事故态度因子</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="" prop="remark">
            <div slot="label" class="slot_label">备注</div>
            <el-input v-model="editFreeCoefficienForm.remark" type="textarea" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="button-group">
      <el-row class="ct">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm('editFreeCoefficienForm')">保存</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { editData } from "@/api/knowledgeBase/coefficientOfDiscretion";
export default {
  name: "editFreeCoefficien",
  data() {
    return {
      // labelPosition
      labelPosition: "left",
      editFreeCoefficienForm: {
        value: "",
        radio: "",
        remark: "",
        id: JSON.parse(sessionStorage.editFreeCoefficienData).id
      },
      rules: {
        value: [{ required: true, trigger: "blur" }],
        radio: [{ required: true, trigger: "change" }],
        remark: [{ required: true, trigger: "blur" }]
      }
    };
  },
  methods: {
    //   back to the home page
    backToFreeCoefficienList() {
      // this.$store.commit("closeTags", {
      //   name: "修改自由裁量系数",
      //   path: "/editFreeCoefficien"
      // });
      // this.$router.push("/freeCoefficien");
       this.$store.commit("changeFreeEditStatus",false)
    },
    // submit form
    submitForm() {
      this.$refs.editFreeCoefficienForm.validate(val => {
        if (val) {
          //验证成功
          editData({
            effectNum: this.editFreeCoefficienForm.value
              ? this.editFreeCoefficienForm.value
              : JSON.parse(sessionStorage.editFreeCoefficienData).effectNum,
            type: this.editFreeCoefficienForm.radio
              ? this.editFreeCoefficienForm.radio
              : JSON.parse(sessionStorage.editFreeCoefficienData).type,
            // radio:this.editFreeCoefficienForm.radio ? this.editFreeCoefficienForm.radio :(JSON.parse(sessionStorage.editFreeCoefficienData)).type === "1" ?"从重处罚" :(JSON.parse(sessionStorage.editFreeCoefficienData)).type === "2"?"事前态度因子":"事故态度因子",
            remark: this.editFreeCoefficienForm.remark
              ? this.editFreeCoefficienForm.remark
              : JSON.parse(sessionStorage.editFreeCoefficienData).remark,
            id: this.editFreeCoefficienForm.id,
            createTime: "",
            createUser: "",
            updateTime: "",
            updateUser: ""
          })
            .then(res => {
              console.log("修改自由裁量参数信息", res);
              if (res.code === "0") {
                // this.resetForm();
                this.backToFreeCoefficienList();
                sessionStorage.removeItem("editFreeCoefficienData");
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
          return false;
        }
      });
    },
    resetForm() {
      this.backToFreeCoefficienList();
      this.editFreeCoefficienForm.value = null;
      this.editFreeCoefficienForm.radio = null;
      this.editFreeCoefficienForm.remark = null;
      this.editFreeCoefficienForm.id = null;
    },
    //赋值
    editDataFromFreeCoefficienList() {
      console.log("原始数据",sessionStorage.editFreeCoefficienData)
      if (sessionStorage.editFreeCoefficienData) {
        console.log(JSON.parse(sessionStorage.editFreeCoefficienData));
        this.editFreeCoefficienForm.value = JSON.parse(
          sessionStorage.editFreeCoefficienData
        ).effectNum;
        this.editFreeCoefficienForm.radio = JSON.parse(
          sessionStorage.editFreeCoefficienData
        ).type;
        this.editFreeCoefficienForm.remark = JSON.parse(
          sessionStorage.editFreeCoefficienData
        ).remark;
        // 取到新值 然后分别赋值给这三个值
      } else {
        this.editFreeCoefficienForm = null;
      }
    }
  },
  mounted() {
    this.editDataFromFreeCoefficienList();
  }
};
</script>
<style scoped lang="less">
.editFreeCoefficien {
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
.editFreeCoefficienForm {
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