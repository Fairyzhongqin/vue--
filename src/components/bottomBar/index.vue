<template>
  <div class="bottom-button-container"
       :style="collStatus?'width: calc(100% - 220px)':'width: 100%'">
    <div class="button-bar">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import bus from '@/bus/index'
import {mapState} from 'vuex'

export default {
  /* data () {
    return {
      collStatus: true // 默认展开
    }
  }, */
  /* created () {
    bus.$on('collChange', this.collChange)
  },
  methods: {
    collChange () {
      this.collStatus = !this.collStatus
    }
  }, */
  computed: {
    ...mapState(["collStatus"])
  }
}
</script>

<style lang="less">
.bottom-button-container {
  position: fixed;
  height: 52px;
  background-color: #fff;
  bottom: 0px;
  // width: calc(100% - 220px);
  // line-height: 52px;
  box-sizing: border-box;
  padding: 10px 0;
  z-index: 1;
  .button-bar {
    display: flex;
    justify-content: center;
    // margin-left: calc(50% - 290px);
  }
}
</style>
