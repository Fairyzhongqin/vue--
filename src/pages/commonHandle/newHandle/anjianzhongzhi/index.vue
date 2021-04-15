<template>
  <el-row class="case-end_content">
    <!-- <el-col :span="4" :class="{ 'scroll-fix': scrollTop > 170 }">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :size="activity.component === currComponent ? 'large' : 'normal'"
          :color="index <= currCaseEndPro ? '#0099FF' : ''"
          :key="index"
        >
          <span class="component_name"
            :class="index > currCaseEndPro ? 'textGray':''"
            :style="activity.component === currComponent ? 'color: #0099FF' : ''"
            @click="switchAct(activity, index)">{{
            activity.name
          }}</span>
        </el-timeline-item>
      </el-timeline>
    </el-col>
    <el-col :span="20" :class="{ 'scroll-fix-right': scrollTop > 170 }"> -->
      <!-- <component is="endCaseAudit" v-bind="$attrs"></component> -->
      <endCaseAudit v-bind="$attrs"></endCaseAudit>
    <!-- </el-col> -->
  </el-row>
</template>
<script>
import endCaseRecord from './endCaseRecord'
import endCaseAudit from './endCaseAudit'
import { mapState } from 'vuex'

export default {
  name: 'anjianzhongzhi',
  components: {
    endCaseRecord,
    endCaseAudit
  },
  data() {
    return {
      activities: [
        {
          name: '案件终止记录单',
          component: 'endCaseRecord'
        },
        {
          name: '案件终止审批表',
          component: 'endCaseAudit'
        }
      ],
      currComponent: 'endCaseRecord'
    }
  },
  computed: {
    ...mapState(['currCaseEndPro', 'scrollTop'])
  },
  methods: {
    switchAct(act, index) {
      let currIndex = this.$store.state.currCaseEndPro
      if (currIndex >= index) {
        this.currComponent = act.component
      }
    }
  }
}
</script>
<style lang="less" scope>
.el-timeline {
  padding: 0;
  .component_name {
    cursor: pointer;    
    &.textGray {
      color: #999;
    }
  }
}
.case-end_content {
  margin-bottom: 50px;
}
.scroll-fix {
  position: fixed;
  top: 130px;
}
.scroll-fix-right {
  margin-left: 16.6666%;
}
</style>
