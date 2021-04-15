<template>
  <div>
    <div v-if="!newDelayStatus">
      <div v-if="!newRectificationDelayShow">
        <data-table :searchInfo="getSearchinfo"></data-table>
      </div>
      <div v-if="newRectificationDelayShow">
        <new-rectificationDelay></new-rectificationDelay>
      </div>
    </div>
    <div v-if="newDelayStatus">
      <delay-ws></delay-ws>
    </div>
  </div>
</template>

<script>
import dataTable from './component/dataTable'
import newRectificationDelay from './component/newRectificationDelay'
import delayWs from '../innerReview/newInnerReview/components/DelayWS'
import { mapState } from 'vuex'

export default {
  name: 'rectificationDelayIndex',
  components: {
    dataTable,
    newRectificationDelay,
    delayWs
  },
  data() {
    return {}
  },
  created() {
    this.$store.dispatch('switchCompStatus', '/rectificationDelay')
  },
  computed: {
    ...mapState(['newRectificationDelayShow', 'inspectionWordButtonIsShow', 'newDelayStatus']),
    getSearchinfo() {
      return this.searchInfo
    }
  }
}
</script>

<style lang="less" scoped>
</style>