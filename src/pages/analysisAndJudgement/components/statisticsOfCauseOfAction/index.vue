<template>
  <div class="statisticsOfCauseOfAction">
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="deptCode"
      border
      lazy
      :load="load"
      v-loading="loading"
      :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
      stripe
    >
      <el-table-column prop="deptName" label="县（市、区、开发区）" min-width="220" align="left">
        <template slot-scope="scope">
          <i class="iconBg"></i>
          <span style="margin-left: 4px">{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rc30001" label="安全生产行政许可类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产行政许可类违法', 'rc30001')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30001 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30002" label="安全生产管理机构和管理人员类违法" min-width="160" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产管理机构和管理人员类违法', 'rc30002')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30002 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30003" label="安全生产建设工程项目类违法" min-width="120" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产建设工程项目类违法', 'rc30003')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30003 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30004" label="安全生产规章制度类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产规章制度类违法', 'rc30004')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30004 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30005" label="安全生产培训教育类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产培训教育类违法', 'rc30005')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30005 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30006" label="安全生产资金投入类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产资金投入类违法', 'rc30006')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30006 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30007" label="安全生产隐患管理类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产隐患管理类违法', 'rc30007')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30007 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30008" label="安全生产事故应急救援类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产事故应急救援类违法', 'rc30008')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30008 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30009" label="安全生产承包租赁类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产承包租赁类违法', 'rc30009')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30009 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30010" label="安全生产警示标志类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产警示标志类违法', 'rc30010')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30010 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30011" label="安全生产中介机构类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产中介机构类违法', 'rc30011')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30011 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30012" label="安全设备使用维护类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全设备使用维护类违法', 'rc30012')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30012 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30013" label="重大危险源管理类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '重大危险源管理类违法', 'rc30013')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30013 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30014" label="生产经营单位作业现场管理类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '生产经营单位作业现场管理类违法','rc30014')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30014 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30015" label="生产安全事故报告类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '生产安全事故报告类违法', 'rc30015')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30015 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30016" label="生产安全事故责任类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '生产安全事故责任类违法', 'rc30016')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30016 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30018" label="安全生产职业健康类违法" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '安全生产职业健康类违法', 'rc30018')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30018 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="rc30017" label="其他情况" min-width="100" align="center">
        <template slot-scope="scope">
          <span
            @click="showView(scope.row, '其他情况', 'rc30017')"
            :class="{ 'click-perm': scope.row.perm }"
            >{{ scope.row.rc30017 }}</span
          >
        </template>
      </el-table-column>
    </el-table>
    <!--展示列表弹窗 start-->
    <div v-if="modalVisiable" class="dialog-container">
      <el-dialog :title="modalTitle" :visible.sync="modalVisiable" width="1078px" height="600px" :close-on-click-modal="false">
        <component :is="'causeOfActionNum'" :startTime="sTime1" :module="'caseReason'" :endTime="eTime1" :tabletype="sign" :deptcode="selectDeptCode"></component>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getAYTJData } from '@/api/manageSystem/index.js'
import causeOfActionNum from '../../analysisCommon/detail/unincorporateNum'
export default {
  name: '',
  components: {
    causeOfActionNum
  },
  data() {
    return {
      // table data
      tableData: [],
      // sTime: '2019-01-01 00:00:00',
      sTime: '',
      eTime: '',
      sTime1: '',
      eTime1: '',
      loading: false,
      modalVisiable: false,
      modalTitle: '',
      sign: '',
      selectDeptCode: '',
      modalCom: '',
      cacheTreeCodes: [],
      cacheResolves: []
    }
  },
  methods: {
    getAYTJList(deptCode, sTime, eTime) {
      this.sTime1 = sTime
      this.eTime1 = eTime
      this.sTime = sTime
      this.eTime = eTime
      this.loading = true
      if(this.cacheTreeCodes.length) {
        this.cacheTreeCodes.map((item, index) => {
          this.load({deptCode: item}, null, this.cacheResolves[index], true)
        })
      }
      getAYTJData({
        deptCode: deptCode,
        endTime: this.eTime || '',
        startTime: this.sTime || ''
      }).then(res => {
        this.loading = false
        if (res.code === '0') {
          res.data.map(item => {
            item.isHasChild = item.isHasChild === true
            item.data.map(i => {
              item[i.item] = i.num
            })
          })
          this.tableData = res.data
        }
      })
    },
    load(tree, treeNode, resolve, active) {
      if(!active) {
        this.cacheTreeCodes.push(tree.deptCode)
        this.cacheResolves.push(resolve)
      }
      getAYTJData({
        deptCode: tree.deptCode,
        endTime: this.eTime || '',
        startTime: this.sTime || ''
      }).then(res => {
        if (res.code === '0') {
          res.data.map(item => {
            item.isHasChild = item.isHasChild === true || '1'
            // 只取num
            item.data.map(i => {
              item[i.item] = i.num
            })
          })
          console.info('sonData', res.data)
          resolve(res.data)
        }
      })
    },
    showView(row, titleName, type) {
      if (row.perm) {
        this.sign = type
        this.selectDeptCode = row.deptCode
        this.modalTitle = row.deptName.split('市')[0] + titleName
        this.modalVisiable = true
      }
    }
  },
  created() {
    this.getAYTJList('')
  }
}
</script>
<style lang="less" scoped>
.statisticsOfCauseOfAction {
  background: rgba(46, 67, 106, 1);
  border-radius: 8px;
  box-sizing: border-box;
  padding: 10px;

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
  .click-perm {
    text-decoration: underline;
    color: rgba(2, 204, 255, 1);
    cursor: pointer;
  }
  // 表头
  /deep/.el-table .el-table__header thead .is-leaf {
    background: #192f5e !important;
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

  /deep/.el-table,
  .el-table__expanded-cell {
    background-color: transparent;
  }

  /deep/.el-table {
    border-radius: 0px;

    .el-loading-mask {
      background-color: transparent;
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
