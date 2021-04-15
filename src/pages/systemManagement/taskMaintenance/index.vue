<template>
  <div>
    <component :is="currtaskComp"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dataDisplay from './dataDisplay'
import addTask from './addTask'

export default {
  name: 'taskMaintenance',
  components: {
    dataDisplay,
    addTask
  },
  data () {
    return {
      // writTypeEnumId: ''
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
    ...mapState(['currtaskComp'])
  }
}
</script>

<style lang="less" scoped>
</style>
