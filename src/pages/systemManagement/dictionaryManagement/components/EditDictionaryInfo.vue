<template>
  <div>
    <div class="editDictionaryInfo">
      <div @click="backToDictionaryList" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="editDictionaryForm">
        <el-form
          :model="editDictionaryForm"
          ref="editDictionaryForm"
          label-width="100px"
          :rules="editDictionaryFormRules"
          :label-position="labelPosition"
          :show-message="false"
        >
          <el-form-item label="" prop="name">
            <div slot="label" class="slot_label">字典名称</div>
            <el-input v-model="editDictionaryForm.name" placeholder="字典名称" clearable></el-input>
          </el-form-item>          
          <el-form-item label="" prop="type">
            <div slot="label" class="slot_label">字典类型</div>
            <el-input v-model="editDictionaryForm.type" placeholder="字典类型" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="code">
            <div slot="label" class="slot_label">字典码</div>
            <el-input v-model="editDictionaryForm.code" placeholder="字典码" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="value">
            <div slot="label" class="slot_label">字典值</div>
            <el-input v-model="editDictionaryForm.value" placeholder="字典值" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="order">
            <div slot="label" class="slot_label">排序</div>
            <el-input v-model="editDictionaryForm.order" placeholder="排序" maxlength="3" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="remark">
            <div slot="label" class="slot_label">注释</div>
            <el-input v-model="editDictionaryForm.remark" placeholder="注释" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="parentId">
            <div slot="label" class="slot_label">上级类别</div>
            <el-input v-model="editDictionaryForm.parentId" placeholder="上级类别" clearable></el-input>
          </el-form-item>


        </el-form>
      </div>
    </div>
    <div class="button-group">
      <el-row class="ct">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm('editDictionaryForm')">保存</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { editDictionaryData } from "@/api/systemManagement/dictionaryManagement";
export default {
  name: "editDictionaryInfo",
  data() {
    return {
      // labelPosition
      labelPosition: "left",
      // form data
      editDictionaryForm: {
        name: "",
        code: "",
        remark: "",
        value: "",
        type: "",
        order: "",
        id: "",
        parentId: ""
      },
      editDictionaryFormRules: {
        name: [{ required: true, trigger: "blur" }],
        code: [{ required: true, trigger: "blur" }],
        value: [{ required: true, trigger: "blur" }],
        remark: [{ required: true, trigger: "blur" }],
        type: [{ required: true, trigger: "blur" }],
        order: [{ required: true, trigger: "blur" }]
      }
    };
  },
  methods: {
    backToDictionaryList() {
      // this.$store.commit("closeTags", {
      //   name: "修改字典信息",
      //   path: "/editDictionaryInfo"
      // });
      // this.$router.push("/dictionaryManagement");
      this.$store.commit("changeDicEditStatus", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editDictionaryData({
            id: this.editDictionaryForm.id,
            name: this.editDictionaryForm.name,
            code: this.editDictionaryForm.code,
            remark: this.editDictionaryForm.remark,
            value: this.editDictionaryForm.value,
            parentId: this.editDictionaryForm.parentId,
            type: this.editDictionaryForm.type,
            orderNum: Number(this.editDictionaryForm.order)
          })
            .then(res => {
              console.log("字典数据修改", res);
              if (res.code === "0") {
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
                this.backToDictionaryList();
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
      this.editDictionaryForm = null;
      this.backToDictionaryList();
    },
    //  get data from sessionStorage
    getEditDictionaryData() {
      if (sessionStorage.sendToEditData) {
        // console.log(JSON.parse(sessionStorage.sendToEditData));
        this.editDictionaryForm.name = JSON.parse(
          sessionStorage.sendToEditData
        ).name;
        this.editDictionaryForm.code = JSON.parse(
          sessionStorage.sendToEditData
        ).code;
        this.editDictionaryForm.remark = JSON.parse(
          sessionStorage.sendToEditData
        ).remark;
        this.editDictionaryForm.value = JSON.parse(
          sessionStorage.sendToEditData
        ).value;
        this.editDictionaryForm.status =
          JSON.parse(sessionStorage.sendToEditData).status === ""
            ? "正常"
            : JSON.parse(sessionStorage.sendToEditData).status === "-1"
            ? "注销"
            : "正常";
        this.editDictionaryForm.type = JSON.parse(
          sessionStorage.sendToEditData
        ).type;
        this.editDictionaryForm.order = JSON.parse(
          sessionStorage.sendToEditData
        ).orderNum;
        this.editDictionaryForm.id = JSON.parse(
          sessionStorage.sendToEditData
        ).id;
        this.editDictionaryForm.parentId = JSON.parse(
          sessionStorage.sendToEditData
        ).parentId;
      } else {
        this.editParameterForm = null;
      }
    }
  },
  created() {
    this.getEditDictionaryData();
  },
  mounted() {},
  destroyed() {}
};
</script>
<style scoped lang="less">
.editDictionaryInfo {
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
.editDictionaryForm {
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
/deep/.el-form-item{
  margin:0px;
}
</style>
