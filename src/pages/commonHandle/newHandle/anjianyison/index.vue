<template>
  <el-row class="trans_content penalty-nodes">
    <el-col :span="4" :class="{'scroll-fix': scrollTop > 170}">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :class="activity.component === currComponent ? 'timeline-large': ''"
          class="time-tail-active"
          :color="index <= currTransPro ? '#0099FF': ''"
          :key="index"
        >
          <span
            class="component_name"
            :class="index > currTransPro ? 'textGray':''"
            :style="activity.component === currComponent ? 'color: #0099FF': ''"
            @click="switchAct(activity, index)"
          >{{activity.name}}</span>
        </el-timeline-item>
      </el-timeline>
    </el-col>
    <el-col :span="20" :class="{'scroll-fix-right': scrollTop > 170}">
      <component :is="currComponent" v-bind="$attrs"></component>
    </el-col>
  </el-row>
</template>
<script>
import approvalForm from "./approvalForm";
import transferBook from "./transferBook";
import { mapState } from "vuex";

export default {
  name: "anjianyison",
  components: {
    approvalForm,
    transferBook
  },
  data() {
    return {
      activities: [
        {
          name: "案件移送审批表",
          component: "approvalForm"
        },
        {
          name: "案件移送书",
          component: "transferBook"
        }
      ],
      currComponent: "approvalForm",
      progress: 1
    };
  },
  computed: {
    ...mapState(["currTransPro", 'scrollTop'])
  },
  methods: {
    switchAct(act, index) {
      let currIndex = this.$store.state.currTransPro;
      if (currIndex >= index) {
        this.currComponent = act.component;
      }
    }
  }
};
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
.trans_content {
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