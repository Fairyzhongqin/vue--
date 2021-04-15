<template>
  <div class="sn-empty-data"
       :class="{'img': type === 'type1', 'img2': type === 'type2'}">
    <div class="empty-text">{{text}}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '暂无内容'
    },
    type: {
      type: String,
      default: 'type1'
    }
  }
}
</script>

<style lang="less" scoped>
.sn-empty-data {
  height: 300px;
  width: 100%;
  background-repeat: no-repeat;
  background-position: 50% 40%;
  position: relative;
  .empty-text {
    width: 100%;
    font-size: 14px;
    color: #999999;
    text-align: center;
    position: absolute;
    top: calc(40% + 67px);
  }
}
.img {
  background-image: url("~@/assets/imgs/list_empty.png");
}
.img2 {
  background-image: url("~@/assets/imgs/list_empty2.png");
}
</style>
