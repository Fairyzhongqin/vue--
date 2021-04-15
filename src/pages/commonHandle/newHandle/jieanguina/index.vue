<template>
  <div class="content">
    <el-row>
      <el-col :span="4">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :size="index == caseHandlejieanguinaProgress ? 'large': 'normal'"
            :color="index <= caseHandlejieanguinaProgress ? '#0099FF': ''"
            :key="index">
            <span :style="index == caseHandlejieanguinaProgress ? 'color: #0099FF': ''">{{activity.name}}</span>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="20">
        <component :is="activities[caseHandlejieanguinaProgress].component"></component>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import examinationClosure from './components/examinationClosure/index'  // 结案审批
import electronicFile from './components/electronicFile/index'  // 电子卷宗
import { mapState } from 'vuex';
export default {
  components: {
    examinationClosure,
    electronicFile,
  },
  computed: {
    ...mapState([
      'caseHandlejieanguinaProgress'
    ])
  },
  data() {
    return {
      activities: [
        {
          name: '结案审批',
          component: examinationClosure
        }, 
        {
          name: '电子卷宗',
          component: electronicFile
        },
      ],
    }
  },
}
</script>
<style lang="less" scoped>
  .el-timeline {
    padding: 0;
  }
  .content{
    margin-bottom: 50px;
  }
</style>