<template>
  <el-checkbox-group v-model="checkList" @change="filterData" :disabled="disabled">
    <el-checkbox label="0">重大隐患</el-checkbox>
    <el-checkbox label="1">一般隐患</el-checkbox>
  </el-checkbox-group>  
</template>

<script>
export default {
  model: {
    prop: 'targetValue',
    event: 'change'
  },
  props: {
    targetValue: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkList: [],
      currValue: this.targetValue
    }
  },
  methods: {
    filterData(val) {
      if(this.checkList.length > 1) {
        this.checkList.shift();
      }
      if(this.checkList.length === 0) {
        this.checkList.push('2')
      }
      this.$emit("change", this.checkList[0])
    }
  },
  mounted() {
    this.checkList.push(this.targetValue)
  }
}
</script>

<style lang="less" scoped>
.el-checkbox-group {
  /deep/ .el-checkbox__inner {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border-color: #CCCCCC;
    transition: none;
  }
  /deep/ .is-checked {
    .el-checkbox__inner {
      background-color: #FF4B3D;
      border-color: #FF4B3D;
      transition: none;
      &::after {
        height: 11px;
        width: 5px;
        left: 6px;
        top: 2px;
        transition: none;
      }
    }
  }
  /deep/ .is-checked .el-checkbox__label {
    color: #FF4B3D
  }
}
</style>