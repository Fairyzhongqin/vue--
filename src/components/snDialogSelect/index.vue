<template>
  <div>
    <div :class="!disabled ? 'sn-dialog-select' : ''" @click="handle()">
      <el-input
        v-if="!this.parentToChild"
        v-model="inputName"
        suffix-icon="el-icon-more"
        :placeholder="placeholder"
        :disabled="true"
        @blur="blurEvent()"
      ></el-input>
    </div>
    <div :class="!disabled ? 'sn-dialog-select' : ''" v-if="this.parentToChild">
      <el-input
        class="el-input-cc"
        v-model="inputName"
        :placeholder="placeholder"
        @blur="blurEvent()"
        @focus="handle"
      >
        <el-button v-if="isShow" type="text" slot="suffix" @click="edit() ">
          <i class="el-icon-edit"></i>
        </el-button>
        <span slot="suffix" v-if="isShow">|</span>
        <span slot="suffix" @click="handle()">
          <i class="el-icon-more"></i>
        </span>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Object, String, Number]
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    callBackValue: {
      type: [String, Number, Array, Object]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    parentToChild: {
      type: String
    }
  },
  components: {},
  data() {
    return {
      valueFromParent: "",
      isShow: false,
      inputName: ""
    };
  },
  created() {
    if (typeof this.value === "object") {
      this.inputName = this.value ? this.value.companyName : "";
    } else {
      this.inputName = this.value;
    }
    this.valueFromParent = this.parentToChild;
  },
  mounted() {},
  watch: {
    value: {
      handler: function(newVal, oldVal) {
        if (typeof this.value === "object") {
          this.inputName = this.value.companyName;
          this.isShow = true;
        } else {
          this.inputName = this.value;
        }
      },
      deep: true
    }
  },
  methods: {
    handle() {
      if (this.disabled) {
        return;
      }
      this.$emit("clickHandle", this.callBackValue);
    },
    edit() {
      if (this.disabled) {
        return;
      }
      this.$emit("clickHandleEdit");
    },
    blurEvent() {
      this.$emit("blur");
    }
  }
};
</script>

<style lang='less' scoped>
.sn-dialog-select {
  cursor: pointer;
  display: flex;
  /deep/ .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    cursor: pointer;
    color: #606266;
    border: 1px solid #dcdfe6;
  }
  /deep/ .el-input.is-disabled .el-input__icon {
    cursor: pointer;
  }
  /deep/.input > .el-input__inner {
    padding-right: 30px;
  }
  //   .el-input-cc .el-input.el-input--suffix{
  //   /deep/.el-input__inner{
  //     padding-right:50px !important
  //   }
  // }
}
.shortBut {
  width: 42px;
  height: 20px;
  font-size: 14px;
  padding: 14px 6px !important;
}
// /deep/.el-icon-edit {
//   line-height: 0px;
// }
/deep/.el-icon-more {
  width: 15px;
  line-height: 30px;
}
/deep/.el-icon-edit {
  line-height: 0px;
}
</style>
