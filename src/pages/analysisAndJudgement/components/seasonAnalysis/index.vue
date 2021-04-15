<template>
  <div class="safelyProduction">
    <div class="safelyProductionInner wrapper-hooker">
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="deptCode"
        :load="load"
        v-loading="loading"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
        stripe
      >
        <el-table-column prop="deptName" label="设区市" min-width="220" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="iconBg"></i>
            <span style="margin-left: 4px">{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="行政处罚程序" align="center">
          <el-table-column prop="simple" label="简易程序（件）" min-width="80" align="center"></el-table-column>
          <el-table-column prop="penalty" label="一般程序（件）" min-width="80" align="center"></el-table-column>
          <el-table-column prop="hearing" label="听证程序（件）" min-width="80" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="处罚执行" align="center">
          <el-table-column prop="autoExecute" label="自动履行（起）" min-width="80" align="center"></el-table-column>
          <el-table-column prop="forceExecute" label="申请强制（起）" min-width="80" align="center"></el-table-column>
        </el-table-column>
        <!-- <el-table-column prop="888" label="案件移送" align="center">
          <el-table-column prop="d1" label="移送公安机关（件）" min-width="85" align="center"></el-table-column>
          <el-table-column prop="d1" label="移送其他机关（件）" min-width="85" align="center"></el-table-column>
        </el-table-column> -->
        <el-table-column prop="888" label="行政强制" align="center">
          <el-table-column prop="cf" label="查封、扣押（起）" min-width="90" align="center"></el-table-column>
          <el-table-column prop="tzgd" label="停止供电（供应民爆物品）（起）" min-width="115" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="888" label="事前处罚（5-10万元案件）" align="center">
          <el-table-column prop="levelFirstPrePenalty" label="立案数（件）" min-width="65" align="center"></el-table-column>
          <el-table-column prop="lyLevelFirstPrePenaltyPerc" label="与上年同比（%）" min-width="70" align="center"></el-table-column>
          <el-table-column prop="levelFirstPrePenaltyPercPrePenalty" label="与事前立案数占比（%）" min-width="95" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="888" label="事前处罚（10万元案件）" align="center">
          <el-table-column prop="levelSecondPrePenalty" label="立案数（件）" min-width="65" align="center"></el-table-column>
          <el-table-column prop="lyLevelSecondPrePenaltyPerc" label="与上年同比（%）" min-width="70" align="center"></el-table-column>
          <el-table-column prop="levelSecondPrePenaltyPercPrePenalty" label="与事前立案数占比（%）" min-width="95" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <!--展示列表弹窗 start-->
    <div v-if="modalVisiable" class="dialog-container">
      <el-dialog :title="modalTitle" :visible.sync="modalVisiable" width="1078px" height="600px" :close-on-click-modal="false">
        <component :is="modalCom" :startTime="sTime1" :endTime="eTime1" :tabletype="inspectType" :deptcode="selectDeptCode"></component>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getAQSCData } from '@/api/manageSystem/index.js'
import punishmentExecutionNum from '../../analysisCommon/detail/unincorporateNum'
export default {
  name: 'aqsc',
  components: {
    punishmentExecutionNum
  },
  data() {
    return {
      // data start
      tableData: [],
      startTime: '',
      endTime: '',
      loading: false,
      modalVisiable: false,
      modalTitle: '',
      inspectType: '',
      selectDeptCode: '',
      modalCom: '',
      cacheTreeCodes: [],
      cacheResolves: []
    }
  },
  created() {
    this.getList('')
  },
  methods: {
    load(tree, treeNode, resolve, active) {
      if(!active) {
        this.cacheTreeCodes.push(tree.deptCode)
        this.cacheResolves.push(resolve)
      }
      getAQSCData({
        deptCode: tree.deptCode,
        endTime: this.endTime || '',
        startTime: this.startTime || ''
      }).then(res => {
        if (res.code === '0') {
          resolve(res.data)
        }
      })
    },
    getList(deptCode, startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.loading = true
      if(this.cacheTreeCodes.length) {
        this.cacheTreeCodes.map((item, index) => {
          this.load({deptCode: item}, null, this.cacheResolves[index], true)
        })
      }
      getAQSCData({
        deptCode: deptCode,
        endTime: this.endTime || '',
        startTime: startTime || ''
      })
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.tableData = res.data
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    showView(type, deptName, deptCode, titleName, com) {
      this.inspectType = type
      this.selectDeptCode = deptCode
      this.modalCom = com
      this.modalTitle = deptName.split('市')[0] + titleName
      this.modalVisiable = true
    }
  }
}
</script>
<style lang="less" scoped>
.safelyProduction {
  height: max-560px;
  background: rgba(46, 67, 106, 1);
  border-radius: 8px;
  box-sizing: border-box;
  padding: 10px;
  max-height: 76vh;

  .safelyProductionInner {
    width: 100%;
    height: 100%;
    max-height: 72vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 72px;
      background: transparent;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
      background: rgba(91, 108, 130, 1);
      // background: rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
      // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: transparent;
      // background: rgba(0, 0, 0, 0.1);
    }
    .click-perm {
      text-decoration: underline;
      color: rgba(2, 204, 255, 1);
      cursor: pointer;
    }
    .iconBg {
      display: inline-block;
      width: 12px;
      height: 16px;
      background-image: url('~@/assets/imgs/tree/index1.png');
      background-size: 12px 16px;
      // background-position: 4px;
      background-repeat: no-repeat;
      // text-indent: 26px;
      // line-height: 26px;
      vertical-align: middle;
    }

    // 表头
    /deep/.el-table .el-table__header thead .is-leaf {
      background: #192f5e !important;
    }
    // 表头错位
    /deep/ .el-table th.gutter {
      display: table-cell !important;
    }
    /deep/.el-table thead.is-group th {
      background: #192f5e !important;
    }

    /deep/ .el-table--border th {
      border-right: 1px solid #465c89;
    }

    /deep/.el-table td {
      background: #2e436a;
      border-bottom: 1px solid #465c89;
      color: #fff;
    }

    /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
      background: #1d3258;
    }

    /deep/.el-table {
      border-radius: 0px;

      .el-loading-mask {
        background-color: transparent;
      }
    }

    /deep/.el-table--border,
    .el-table--group {
      border: none;
    }

    /deep/.el-table--border td {
      border-right: 1px solid #465c89;
    }

    /deep/.el-table th.is-leaf {
      border-bottom: 1px solid #465c89;
    }

    /deep/.el-table,
    .el-table__expanded-cell {
      background-color: transparent;
    }

    /deep/.el-table--border::after,
    .el-table--group::after {
      top: 0;
      right: 0;
      width: 0;
      height: 100%;
    }

    /deep/.el-table--border th,
    .el-table__fixed-right-patch {
      border-bottom: 1px solid #465c89;
    }

    /deep/.el-table::before {
      height: 0;
    }

    /* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
    /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: rgba(9, 26, 57, 1);
      color: #fff;
      /* 设置文字颜色，可以选择不设置 */
    }

    /deep/.el-icon-arrow-right:before {
      content: '\e6e0';
      color: #fff;
    }

    // 滚动条
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      /*横向滚动条样式*/
      height: 12px;
      background: transparent;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
      background: rgba(91, 108, 130, 1);
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
      border-radius: 0;
      background: #2e436a;
    }
  }
  /deep/.dialog-container {
    .el-dialog__wrapper {
      .el-dialog {
        background: #2e436a;
        .el-dialog__header {
          border-bottom: 1px solid #4e5878;
          .el-dialog__title {
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
