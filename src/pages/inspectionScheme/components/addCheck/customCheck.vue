<template>
  <div class="custom-check">
    <div class="check-content">
      <!-- <div class="name">检查项目类别：</div> -->
      <el-checkbox label="检查项目类别：" v-model="data.checked"></el-checkbox>
      <div>
        <sn-select
          class="select"
          v-model="data.discretionTypeCode"
          :data-url="'/aj/sys/sysdict/list'"
          :requertData="{type: 'discretion_class'}"
          :immediate="true"
          @input="getValue"
          @getText="getText"
          placeholder="请选择检查项目类别"
        ></sn-select>
      </div>
    </div>
    <div class="check-content">
      <div class="name">检查内容：</div>
      <div class="textarea">
        <el-input
          type="textarea"
          :autosize="{minRows:1}"
          placeholder="请输入检查内容"
          v-model="data.label"
          maxlength="200"
          clearable
        ></el-input>
      </div>
    </div>
    <div class="custom-operations">
      <el-button @click="save" type="text">保存</el-button>
      <el-button class="delete" type="text" @click="deleteNode()">删除</el-button>
    </div>
  </div>
</template>

<script>
import snSelect from "@/components/snSelect";
import { addCustomExamine } from "@api/common";

export default {
  components: {
    snSelect
  },
  props: {
    indexShow: {
      type: [String, Number]
    },
    index: {
      type: Number
    },
    data: {
      type: Object
    },
    type: {
      // 检查内容 or 违法行为
      type: String
    }
  },
  data() {
    return {
      input: "",
      addReq: {
        discretionInfo: "", // 检查内容
        discretionCode: "" // 检查类别
      }
    };
  },
  methods: {
    // 保存自定义检查项
    save() {
      this.addReq.discretionInfo = this.data.label;
      addCustomExamine(this.addReq)
        .then(res => {
          this.getMessage("success", "检查项保存成功！");
          this.$emit('afterSave', this.index)
        })
        .catch(err => {
          this.getMessage("error", "检查项保存失败！");
        });
    },
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      });
    },
    deleteNode() {
      this.$emit("deleteNode", this.index);
    },
    getValue(val) {
      this.addReq.discretionCode = val;
      this.data.discretionCode = val
    },
    getText(val) {
      this.data.discretionTypeName = val;
    }
  }
};
</script>

<style lang="less" scoped>
.custom-check {
  padding: 10px;
  position: relative;
  .custom-operations {
    text-align: -webkit-right;
  }
  .check-content {
    display: flex;
    flex-direction: row;
    padding-bottom: 5px;
    line-height: 30px;
    .name {
      height: 38px;
      line-height: 38px;
      width: 110px;
      color: #333333;
      text-align: left;
      margin-left: 24px;
    }
    .select {
      width: 330px;
    }
    .textarea {
      width: 97%;
    }
  }
  .delete {
    text-decoration: underline;
    color: #f56c6c;
  }
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333333;
}
</style>
