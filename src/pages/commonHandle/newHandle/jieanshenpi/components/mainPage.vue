<template>
  <!-- 结案审批 -->
  <div class="main_lay">
    <div class="create-tab-title">结案审批</div>
    <div class="lay">
      <el-button v-if="!forBrowse" class="penalty-small_button" type="primary" size="mini" @click="makeEndCaseAudit">生成结案审批表</el-button>
      <!-- 缺图，暂时用这个 -->
      <snEmptyData text="暂无结案审批表" type="type1"></snEmptyData>
    </div>
  </div>
</template>
<script>
import snEmptyData from "@/components/snEmptyData";
export default {
  name: 'jieanshenpiMainPage',
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
    },

  }
}
</script>
<style lang="less" scoped>
.main_lay {
  .lay {
    padding: 16px 14px 16px
  }
}
</style>
