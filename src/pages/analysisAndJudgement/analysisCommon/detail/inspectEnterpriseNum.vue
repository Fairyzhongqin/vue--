<template>
  <div class="main">
    <el-row class="retrieval-container">
      <el-col :span="24" class="detail-container">
        <el-table :data="tableData" style="width: 100%" v-loading="isLoading"  stripe>
          <el-table-column type="index" width="50" align="left"></el-table-column>
          <el-table-column label="监管行业类别" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.jgfl ? scope.row.jgfl : "-"}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="企业名称"
            align="left"
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.companyName ? scope.row.companyName : "-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="legalPerson" label="主要负责人" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.legalPerson ? scope.row.legalPerson : "-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contactPhone" label="手机号" align="left" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.contactPhone ? scope.row.contactPhone : "-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="postalCode" label="邮政编码" align="left" width="90">
            <template slot-scope="scope">
              <span>{{scope.row.postalCode ? scope.row.postalCode : "-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyOperationStatus" label="企业经营状态" align="left" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.companyOperationStatus ? scope.row.companyOperationStatus : "-"}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page" v-if="tableData && tableData.length > 0">
          <el-pagination
            layout="total,prev, pager, next, jumper"
            :current-page="currPage"
            :total="total"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { inspectExamineList, listReviewCompany } from '@/api/manageSystem/index'
export default {
  name: 'inspectEnterpriseNum',
  props: {
    tabletype: {
      type: String,
      default: ''
    },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    deptcode: { type: String, default: '' },
    classId: String // 监管行业id
  },
  data() {
    return {
      currPage: 1,
      pageSize: 10,
      total: 0,
      deptCode: null,
      isLoading: false,
      tableData: []
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currPage = val
      this.getInspectList()
    },
    // 获取检查企业列表
    getInspectList() {
      this.isLoading = true
      let opt = {
        deptCode: this.deptcode,
        endTime: this.endTime,
        lastEndTime: '',
        lastStartTime: '',
        limit: '',
        num: 0,
        page: this.currPage,
        perm: true,
        startTime: this.startTime,
        jghyId: this.classId
      }
      let params = {}
      if (this.tabletype == 'sjjcqys') {
        //实际检查企业数  不传
      } else if (this.tabletype === 'jcgsqys') {
        //规上企业数
        params = { isGreat: '1' }
      } 
       
      inspectExamineList(params, opt).then(res => {
        this.isLoading = false
        this.tableData = res.page.list
        this.currPage = res.page.currPage
        this.total = res.page.totalCount
      })
    }
  },
  mounted() {
    this.getInspectList()
  }
}
</script>

<style lang="less" scoped>
.main {
  padding: 8px 16px 0;
  .retrieval-container {
    max-height: 436px;
    .detail-container {
      overflow: auto;
      color: #222222;
      border: none;
      height: 100%;
      overflow-y: auto;
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

      /deep/.el-table {
        border-radius: 0;

        .el-loading-mask {
          background-color: transparent;
        }
        td {
          border-bottom: none;
        }
        th {
          &:not(:nth-last-child(2)) {
            border-right: 1px solid #4e5878;
          }
          &.is-leaf {
            border-bottom: none;
            font-size: 16px;
          }
        }
        .el-table__header thead .is-leaf {
          background: #1d3157;
        }
        tr {
          background-color: rgba(46, 67, 106, 1);
          td {
            &:not(:last-child) {
              border-right: 1px solid #4e5878;
            }
          }
        }
        thead {
          font-size: 18px;
          font-family: PingFang SC;
          color: rgba(255, 255, 255, 1);
          line-height: 24px;
        }
        .cell {
          color: #fff;
        }
        &::before {
          height: 0;
        }
      }

      /deep/.el-table,
      .el-table__expanded-cell {
        background-color: transparent;
      }

      /deep/.el-table--border td {
        border-right: none;
      }

      /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
        background: rgba(29, 49, 87, 1);
      }

      // rgba(78,88,120,1)
      /deep/.el-table--border {
        th {
          border-right: none;
        }
        &::after {
          height: 0;
        }
        th {
          border-bottom: 1px solid rgba(78, 88, 120, 1);
        }
      }

      /deep/.el-table--border,
      .el-table--group {
        border: 1px solid rgba(78, 88, 120, 1);
      }

      // highlight color background:rgba(9,26,57,1);
      /* 用来设置当前页面element全局table 选中某行时的背景色*/
      /deep/.el-table__body tr.current-row > td {
        background-color: rgba(9, 26, 57, 1) !important;
        /* color: #f19944; */
        /* 设置文字颜色，可以选择不设置 */
      }

      /* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
      /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: rgba(9, 26, 57, 1);
        color: #fff;
        /* 设置文字颜色，可以选择不设置 */
      }
      .page {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin: 10px 0px;
        /deep/.el-pagination {
          position: none;
          .el-pagination__total,
          .btn-prev,
          .el-pager li:not(.active),
          .btn-next {
            background: #2e436a;
            color: #c0c4cc;
          }
          .el-pager li {
            background: #2e436a;
          }
          .el-pagination__jump {
            color: #c0c4cc;
            .el-input__inner {
              background: #2e436a;
              border: 1px solid #c0c4cc;
              color: #c0c4cc;
            }
          }
        }
      }
    }
  }
}
/deep/.el-divider--horizontal {
  margin: 6px 0;
}
/deep/.el-tree .el-tree-node__expand-icon {
  min-width: 12px;
  min-height: 12px;
  line-height: 12px;
  border-radius: 4px;
  margin-left: 6px;
}
/deep/.el-icon-loading {
  line-height: 0;
}
</style>
