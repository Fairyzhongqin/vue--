<template>
  <el-row>
    <el-button
        type="primary"
        @click="finishCheckType('0')">
        通过
    </el-button>
    <el-button
        type="danger"
        @click="finishCheckType('1')">
        不通过
    </el-button>
  </el-row>
</template>

<script>
import { penaltydiscComplete } from "@/api/groupDiscussion"
export default {
  props: {
    currentId: {
      type: String
    }
  },
  methods: {
    finishCheckType(type) {
      penaltydiscComplete({
        id: this.currentId, //currentRow.id
        isPass: type
      }).then(res => {
        if(res.code === '0'){
          this.$message({
            type: "success",
            message: "集体讨论已结束！"
          });
          this.$emit('hasFinish')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-row {
    text-align: center;
    padding: 10px 0
  }
</style>