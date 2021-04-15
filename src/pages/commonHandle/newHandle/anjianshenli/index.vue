<template>
  <div class="anjian_content penalty-nodes">
    <el-row>
      <el-col :span="4" class="left_col" :class="{ 'scroll-fix': scrollTop > 170 }">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :class="[activity.component === currComponent ? 'timeline-large' : '', index < currCaseHandle ? 'time-tail-active' : '']"
            :color="index <= currCaseHandle ? '#0099FF' : ''"
            :key="index"
          >
            <span
              class="component_name"
              :class="index > currCaseHandle ? 'textGray' : ''"
              :style="activity.component === currComponent ? 'color: #0099FF' : ''"
              @click="switchAct(activity, index)"
              >{{ activity.name }}</span
            >
            <div v-if="activity.msg" class="msg">{{ activity.msg }}</div>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="20" :class="{ 'scroll-fix-right': scrollTop > 170 }">
        <component :is="currComponent" :currCom="currComponent" v-bind="$attrs" @initSmallNodes="initInfo" v-on="$listeners"></component>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import penaltyDiscretion from './components/penaltyDiscretion/index' // 处罚裁量
import investigationReport from './components/investigationReport/index' // 案件调查报告
import administrativeNotification from './components/administrativeNotification/index' // 处罚告知
import penaltyOrgHearing from './components/penaltyOrgHearing/index' // 组织听证
import departmentAudit from './components/departmentAudit/index' // 提交法制审核
import groupDiscussion from './components/groupDiscussion/index' // 集体讨论（可选）-> 第一次
import secGroupDiscussion from './components/groupDiscussion/index' // 集体讨论（可选） -> 第二次
import { mapState } from 'vuex'
export default {
  name: 'anjianshenli',
  components: {
    penaltyDiscretion,
    investigationReport,
    administrativeNotification,
    penaltyOrgHearing,
    departmentAudit,
    groupDiscussion,
    secGroupDiscussion
  },
  computed: {
    ...mapState(['currCaseHandle', 'scrollTop'])
  },
  data() {
    return {
      activities: [
        {
          name: '处罚裁量',
          component: 'penaltyDiscretion'
        },
        {
          name: '案件调查报告',
          component: 'investigationReport'
        },
        {
          name: '提交法制审核',
          component: 'departmentAudit'
        },
        {
          name: '集体讨论（可选）',
          component: 'groupDiscussion',
          msg: '供执法人员查看'
        },
        {
          name: '处罚告知',
          component: 'administrativeNotification'
        },
        {
          name: '组织听证',
          component: 'penaltyOrgHearing',
          msg: '供执法人员查看'
        },
        {
          name: '集体讨论（可选）',
          component: 'secGroupDiscussion',
          msg: '供执法人员查看'
        }
      ],
      currComponent: ''
    }
  },
  created() {
    this.initInfo()
  },
  methods: {
    initInfo(from) {
      // 确认走到哪一步
      let currProName = this.$store.state.processesNames

      let currProType = this.$store.state.processesTypes
      if (currProType[0] === 'CFJD' || currProType[0] === 'JASP' || currProType[0] === 'GAME OVER') {
        // 流程走到处罚决定, 结案审批, 或走完时，案件审理节点均可接触
        this.$store.commit('setcurrCaseHandle', {
          index: 6
        })
        this.currComponent = 'penaltyDiscretion'
        return
      }
      // 如果流程走到集体讨论（法核后）要单独处理
      if (currProName[0] === '集体讨论') {
        this.$store.commit('setcurrCaseHandle', {
          index: 3
        })
        this.currComponent = this.activities[3].component
        return
      }
      this.activities.map((act, index) => {
        if (act.name === currProName[0]) {
          this.$store.commit('setcurrCaseHandle', {
            index: index
          })
          if (from === 'fromDP') {
            // 处罚裁量
            this.currComponent = 'penaltyDiscretion'
          } else if (from === 'fromIG') {
            // 案件调查报告
            this.currComponent = 'investigationReport'
          } else {
            this.currComponent = act.component
          }
        }
      })
      /* // 此行为使用方便
        this.currComponent = "administrativeNotification";
        this.$store.commit("setcurrCaseHandle", {
          index: 7
        }); */
    },
    switchAct(act, index) {
      if (this.currCaseHandle >= index) {
        this.currComponent = act.component
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-timeline {
  padding: 0;

  .el-timeline-item:hover .component_name {
    cursor: pointer;

    &.textGray {
      color: #999;
    }

    + .msg {
      display: block;
    }
  }

  .msg {
    display: none;
    position: absolute;
    left: 42px;
    top: -30px;
    line-height: 24px;
    color: #fff;
    font-size: 12px;
    background: rgba(0, 153, 255, 0.7);
    padding: 0 10px;
    border-radius: 4px;

    &:before {
      content: '';
      position: absolute;
      left: 12px;
      bottom: -16px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top-color: rgba(0, 153, 255, 0.7);
    }
  }
}

/deep/ .anjian_content {
  padding: 0 !important;

  /deep/ .el-form-item__label {
    line-height: 25px !important;
  }

  /deep/ .el-form-item__content {
    line-height: 25px !important;
  }
}

/* .left_col {
  position: sticky;
  top: 10px;
} */
.scroll-fix {
  position: fixed;
  width: 12%;
  top: 130px;
}

.el-col-4 {
}

.scroll-fix-right {
  margin-left: 16.6666%;
}
</style>
