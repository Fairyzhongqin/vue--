<template>
  <div>
    <component :is="currAutoSignComp"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dataDisplay from './dataDisplay'


export default {
  name: 'autoSign',
  components: {
    dataDisplay
  },
  data () {
    return {
      signId: ''
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
    ...mapState(['currAutoSignComp'])
  }
}
</script>

<style lang="less" scoped>
</style>
