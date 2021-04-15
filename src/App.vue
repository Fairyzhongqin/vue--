<template>
  <div id="app">
    <iframe
      style="visibility:hidden"
      width="0"
      height="0"
      src="/static/pdf/web/viewer.html"
      frameborder="0"
    ></iframe>
    <!-- 文书PDF回退编辑的模态框 -->
    <div v-if="modalShow" class="v-modal" tabindex="0" style="z-index: 1900"></div>
    <router-view />
  </div>
</template>

<script>
import { security } from '@/utils/security'
import { mapState } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      url: ''
    }
  },
  components: {},
  created() {
    security()
    // this.loadPdfPlugin()
    let token = sessionStorage.getItem('token')
    if (token && token !== '') {
      this.$store.commit('CREAT_WEBSOCKET')
    }
  },
  methods: {
    loadPdfPlugin() {
      this.url = '/static/pdf/web/viewer.html'
    }
  },
  beforeDestroy() {
    if (this.websocketObj) {
      this.websocketObj.closeWs()
    }
    this.$store.commit('DESTROY_WEBSOCKET')
  },
  watch: {
    websocketObj: {
      handler: function(val, oldVal) {
        if (val && oldVal == null) {
          val.createWs()
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['websocketObj', 'websocketMsgNumber', 'modalShow'])
  }
}
</script>

<style lang="less">
body .el-table colgroup.gutter {
  display: table-cell !important;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less" scoped>
.home-header {
  height: 100%;
  width: 100%;
  background-color: blue;
}
#app > iframe {
  position: fixed;
  width: 0;
  height: 0;
  left: 0;
  top: 0;
}

// /deep/.el-table--border th.gutter:last-of-type {
//     display: block!important;
//     width: 17px!important;
// }
</style>
