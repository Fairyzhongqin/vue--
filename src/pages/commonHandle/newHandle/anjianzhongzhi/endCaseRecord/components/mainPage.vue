<template>
  <div class="main_lay">
    <div class="create-tab-title">案件终止记录单</div>
    <div class="lay">
      <el-button v-if="!forBrowse" type="primary" class="penalty-small_button" size="mini" @click="makeEndCaseAudit">制作案件终止记录单</el-button>
      <!-- 缺图，暂时用这个 bu -->
      <snEmptyData text="暂无案件终止记录单" type="type1"></snEmptyData>
    </div>
  </div>
</template>
<script>
import snEmptyData from "@/components/snEmptyData";
export default {
  name: 'anjianzhongzhiMainPage',
  components: {
    snEmptyData
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    makeEndCaseAudit() {
      this.$emit('pageChange', 'makePage')
    }
  }
}
</script>
<style lang="less" scoped>
.main_lay {
  .lay {
    padding: 16px 14px 16px 0;
  }
}
</style>