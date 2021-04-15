<template>
  <div class="button">
    <span v-for="(item, index) in buttonList" :key="index">
      <el-button
        :type="item.type"
        v-if="!item.hideBackBtn"
        :disabled="item.disable"
        @click="clickButtonGroup(item.fun)"
        :class="item.className"
        :loading="item.isLoading"
        >{{ item.name }}</el-button
      >
    </span>
  </div>
</template>

<script>
export default {
  name: 'buttonGroup',
  props: {
    buttonList: {
      type: Array,
      required: true,
      // 默认值
      default: [
        {
          name: '', // 按钮的名字
          type: '', // 按钮类型
          disable: false, //是否可以点击
          fun: '', // 函数
          className: null, // 按钮的特殊样式
          isLoading: false,
          hideBackBtn: false
        }
      ]
    }
  },
  methods: {
    clickButtonGroup(fun) {
      if (typeof fun === 'function') {
        fun()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0px;
  width: 100%;
  background: #ffffff;
  line-height: 52px;
  height: 52px;
  z-index: 1;
  .el-button {
    margin-right: 10px;
  }
}
.is-no {
  background: rgba(255, 75, 61, 0.1);
  /deep/ span {
    color: #ff4b3d;
  }
}
</style>
