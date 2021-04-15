<template>
  <div class="time-line-content">
    <el-timeline v-if="lineData.length !== 0">
      <el-timeline-item v-for="(item, index) in lineData"
                        :key="index"
                        hide-timestamp
                        :icon="iconHandle(item)"
                        :color="colorHandle(item)"
                        size="large">
        <div v-if="item.auditTypeCode === '0'">
          <div class="time-tit">提交人：{{item.submitterUserName}}</div>
          <div class="time-line-wait word-break">提交事由：{{item.submitterCause ? item.submitterCause : '暂无'}}</div>
          <div class="color9">提交部门：{{item.submitDeptName}}</div>
          <div class="color9">提交时间：{{item.submitTime}}</div>
        </div>
  
        <div v-if="item.auditTypeCode !== '0' && item.auditTypeCode !== '2'">
          <div class="time-tit">{{ item.title.indexOf('审核') !== -1 ? '审核' : item.title.indexOf('审批') !== -1 ? '审批' : item.title.indexOf('预审') !== -1 ? '预审' : '审查' }}人：{{item.handlerUserName}}</div>
          <div :class="item.auditResult.indexOf('不') !== -1 || item.auditResult === '退回' ?'time-line-error':'time-line-success'">{{ item.title.indexOf('审核') !== -1 ? '审核' : item.title.indexOf('审批') !== -1 ? '审批' : item.title.indexOf('预审') !== -1 ? '预审' : '审查' }}意见：{{item.auditResultOption ? item.auditResultOption : '暂无'}}</div>
          <div :class="item.auditResult.indexOf('不') !== -1 || item.auditResult === '退回' ?'time-line-error':'time-line-success'">{{ item.title.indexOf('审核') !== -1 ? '审核' : item.title.indexOf('审批') !== -1 ? '审批' : item.title.indexOf('预审') !== -1 ? '预审' : '审查' }}结果：{{item.auditResult ? item.auditResult : '暂无'}}</div>
          <div class="color9">{{ item.title.indexOf('审核') !== -1 ? '审核' : item.title.indexOf('审批') !== -1 ? '审批' : item.title.indexOf('预审') !== -1 ? '预审' : '审查' }}部门：{{item.handlerDeptName}}</div>
          <div class="color9">{{ item.title.indexOf('审核') !== -1 ? '审核' : item.title.indexOf('审批') !== -1 ? '审批' : item.title.indexOf('预审') !== -1 ? '预审' : '审查' }}时间：{{item.handlerTime}}</div>
        </div>
        <div v-if="item.auditTypeCode === '2'">
          <div class="time-tit">待{{ item.title.indexOf('审核') !== -1 ? '审核' : item.title.indexOf('审批') !== -1 ? '审批' : item.title.indexOf('预审') !== -1 ? '预审' : '审查' }}人：{{item.handlerUserName}}</div>
          <div class="color9">{{ item.title.indexOf('审核') !== -1 ? '审核' : item.title.indexOf('审批') !== -1 ? '审批' : item.title.indexOf('预审') !== -1 ? '预审' : '审查' }}部门：{{item.handlerDeptName}}</div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <sn-empty-data v-if="lineData.length === 0"
                   type="type2"
                   text="暂无审核审批"></sn-empty-data>
  </div>
</template>

<script>
import snEmptyData from '@/components/snEmptyData'

export default {
  props: {
    lineData: {
      type: Array,
      default: () => [
        {
          type: 1, // 0 审核过 1 审批过 2 提交过
          userName: '王晓明',
          auditTime: '2019/08/07 12:23:25',
          comment: '同意', // 意见 & 事由
          pass: '0', // 审核结果
          deptName: '支队领导' // 审核部门
        },
        {
          auditResultCode: 'a002', // 审核审批结果
          auditResult: '拟同意',
          auditResultOption: '拟同意', // 审核审批意见
          auditTypeCode: 'ta80003', // 审核类型
          handlerDeptId: '996639851869126658', // 处理部门
          handlerDeptName: '', // 处理部门名字
          handlerTime: '', // 处理时间
          handlerUserId: 'test1', // 处理人
          handlerUserName: '', // 处理人
          msgContent: '', // 消息内容
          requestDeptName: '无锡市应急管理局', // 来源 部门名字
          requestId: 'A56', // 来源
          requestTime: '2019年8月29日', // 来源 时间
          requestUsersName: '李四，张三', // 来源 承办人名字
          submitDeptId: '1002750309063720961', // 提交部门
          submitDeptName: '', // 提交部门名字
          submitTime: '', // 提交时间
          submitterCause: '人口失踪案', // 提交事由，企业名字或者案件名字
          submitterUserId: 'test', // 提交人 id
          submitterUserName: '', // 提交人 名字
          title: '' //
        }
      ]
    }
  },
  components: {
    snEmptyData
  },
  methods: {
    iconHandle(item) {
      console.info('111',item)
      if (item.type == 2 || item.auditTypeCode === '0') {
        return ''
      } else if (item.auditTypeCode === '2') {
        return 'el-icon-time'
      } else {
        if (item.pass == 1 || item.auditResult.indexOf('不') !== -1) {
          return 'iconfont iconicon_function_shenhetuihui-copy'
        } else {
          return 'el-icon-check'
        }
      }

      // item.type == 2 || item.auditTypeCode === '0' ? '' : (item.pass == 1 || item.auditResult.indexOf('不') !== -1 ? 'iconfont iconicon_function_shenhetuihui-copy': 'el-icon-check')
    },
    colorHandle(item) {
      if (item.type == 2 || item.auditTypeCode === '0') {
        return '#0099FF'
      } else if (item.auditTypeCode === '2') {
        return '#e6a23c'
      } else {
        if (item.pass == 1 || item.auditResult.indexOf('不') !== -1) {
          return '#FF4B3D'
        } else {
          return '#1CC19C'
        }
      }

      // item.type == 2 || item.auditTypeCode === '0' ?'#0099FF': item.pass == 1 || item.auditResult.indexOf('不') !== -1? '#FF4B3D': '#1CC19C'
    }
  }
}
</script>

<style lang="less" scoped>
.time-line-content {
  padding-left: 5px;
}
.time-line {
  padding-top: 15px;

  .el-timeline {
    padding: 0;
  }
}

.time-tit {
  color: #333333;
  font-size: 16px;
}

.color9 {
  color: #999999;
  white-space: nowrap;
}

.time-line-success {
  color: #1cc19c;
}

.time-line-wait {
  color: #0099ff;
}

.time-line-error {
  color: #ff0000;
}
.el-timeline {
  padding-left: 0;
}
</style>
