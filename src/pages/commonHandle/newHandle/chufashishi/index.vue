<template>
  <div class="chufa_content penalty-nodes">
    <el-row>
      <el-col :span="4" class="left_col" :class="{'scroll-fix': scrollTop > 170}">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :class="[activity.component === currComponent ? 'timeline-large': '', index < caseHandlechufashishiProgress ? 'time-tail-active': '']"
            :color="index <= caseHandlechufashishiProgress ? '#0099FF': ''"
            :key="index"
          >
            <span
              class="component_name"
            :class="index > caseHandlechufashishiProgress ? 'textGray':''"
              :style="activity.component === currComponent ? 'color: #0099FF': ''"
              @click="switchAct(activity, index)"
            >{{activity.name}}</span>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="20" :class="{'scroll-fix-right': scrollTop > 170}">
        <component :is="currComponent" @initSmallNodes="initInfo" v-on="$listeners"></component>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import decisionPunishment from "./components/decisionPunishment/index"; // 行政处罚决定
import executionPunishment from "./components/executionPunishment/index"; // 罚款的执行
import { mapState } from "vuex";
export default {
  name: "chufashishi",
  components: {
    decisionPunishment,
    executionPunishment
  },
  computed: {
    ...mapState(["caseHandlechufashishiProgress", "scrollTop"])
  },
  data() {
    return {
      activities: [
        {
          name: "处罚决定",
          component: "decisionPunishment"
        },
        {
          name: "罚款执行",
          component: "executionPunishment"
        }
      ],
      currComponent: ""
    };
  },
  created() {
    this.initInfo();
  },
  methods: {
    initInfo() {
      // 确认走到哪一步
      let currProName = this.$store.state.processesNames;

      let currProType = this.$store.state.processesTypes;
      if (currProType[0] === "JASP" || currProType[0] === "GAME OVER") {
        // 流程走到 结案审批, 走完时，处罚决定节点均可接触
        this.$store.commit("setcaseHandlechufashishiProgress", 1);
        this.currComponent = "decisionPunishment";
        return;
      }

      this.activities.map((act, index) => {
        if (act.name === currProName[0]) {
          this.$store.commit("setcaseHandlechufashishiProgress", index);
          this.currComponent = act.component;
        }
      });
    },
    switchAct(act, index) {
      if (this.caseHandlechufashishiProgress >= index) {
        this.currComponent = act.component;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-timeline {
  padding: 0;
  .component_name {
    cursor: pointer;
    &.textGray {
      color: #999;
    }
  }
}
.chufa_content {
  padding: 0;
  margin-bottom: 50px;
}
/deep/.el-button {
  padding: 12px;
}
.scroll-fix {
  position: fixed;
  top: 130px;
}
.scroll-fix-right {
  margin-left: 16.6666%;
}
</style>