<template>
  <div>
    <component :is="currWritTypeEnumComp"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dataDisplay from './dataDisplay'
import addWritTypeEnum from './addWritTypeEnum'

export default {
  name: 'writTypeEnum',
  components: {
    dataDisplay,
    addWritTypeEnum
  },
  data () {
    return {
      writTypeEnumId: ''
    }
  },
  methods: {
    // 从列表组件传值
    /* getDiscDetail(id) {
        console.log("修改的时候传的id",info);
        this.discId = id;
      } */
  },
  computed: {
    ...mapState(['currWritTypeEnumComp'])
  }
}
</script>

<style lang="less" scoped>
</style>
