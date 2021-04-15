<template>
  <div>
    <component
      :is="currHearingComp"
      :pageType="pageType"
      @commitItemInfo="commitItemInfo"
      :itemInfo="itemInfo"
    ></component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dataDisplay from './dataDisplay'
import hearing from './hearing'

export default {
  components: {
    dataDisplay,
    hearing
  },
  data() {
    return {
      itemInfo: {},
      pageType: 'preview',
      path: ''
    }
  },
  created() {
    console.info(this.$route.fullPath)
    this.$store.dispatch('switchCompStatus', '/Hearing')
  },
  methods: {
    commitItemInfo(data, type) {
      this.itemInfo = data
      this.pageType = type
    }
  },
  computed: {
    ...mapState(['currHearingComp'])
  },
  watch: {
    $route(to, from) {
      // this.showList = true;
      if(to.fullPath === '/doneHear') {
        this.path = "done"
      }
      if (to.fullPath === '/todoHear') {
        this.path = 'todo'
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
