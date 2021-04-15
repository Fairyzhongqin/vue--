<template>
  <div class="judgeWrap">
    <judge-header></judge-header>
    <judge-content></judge-content>
  </div>
</template>

<script>
import judgeHeader from './judgeHeader'
import judgeContent from './judgeContent/index'
export default {
  name: 'judgeWrap',
  components: {
    judgeHeader,
    judgeContent
  },
  data() {
    return {}
  },
  methods: {},
  created() {}
}
</script>

<style lang="less" scoped>
.judgeWrap {
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/imgs/WechatIMG113.jpeg');
  background-size: cover;
}
</style>
