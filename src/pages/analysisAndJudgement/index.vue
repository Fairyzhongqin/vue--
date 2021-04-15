<template>
  <div class="analysisWrap">
    <judge-content></judge-content>
  </div>
</template>

<script>
import judgeContent from './components/judgeWrap'
export default {
  name: 'judge',
  components: {
    judgeContent
  }
}
</script>

<style lang="less" scoped>
.analysisWrap {
  width: 100%;
  height: 100%;
}
</style>
