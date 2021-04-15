<template>
  <div class="create-container">
    <div class="create-bar">
      <div class="flex_box">
        <div class="bar-left">
          <slot name="button">
          </slot>
        </div>
        <div class="bar-middle">
          <slot>
            <!-- 此处内容 -->
          </slot>
        </div>
      </div>

      <p class="copyright_main">Copyright © 2019 All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'snPageBar',
  props: {

  },
  methods: {
    back () {
      this.$emit('handleBack')
    }
  }
}
</script>

<style lang="less">
.create-container {
  padding: 8px 8px 70px 8px;
  color: #333333;
  .create-bar {
    .flex_box {
      min-height: 60vh;
      border-radius: 8px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(221, 221, 221, 1);
      box-shadow: 0px 2px 4px 0px rgba(220, 229, 230, 1);
      padding: 16px 16px;
      display: flex;
      flex-direction: row;
      .bar-left {
        width: 5%;
        .el-button {
          height: 24px;
          padding: 0;
        }
      }
      .bar-middle {
        width: 94%;
        .bar-title {
          font-size: 18px;
          color: #333333;
          font-weight: 500;
        }
      }
    }
    p.copyright_main{
      color: #BBBBBB;
      font-size: 14px;
      line-height: 30px;
      text-align: center
    }

  }
}
</style>