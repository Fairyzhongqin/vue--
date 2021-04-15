<template>
  <div class="body">
    <div class="body-content">

      <el-button type="primary" class="check-button"  @click="enterTaskInfo">
        <span>添加任务</span>
      </el-button>

      <el-table
        :data="tableData"
        border
        fit
        header-row-class-name="table_header"
        :header-cell-style="getCellClass"
        :row-class-name="getRowClass"
        v-loading="loading"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="groupName" label="任务组名" min-width="40" show-overflow-tooltip/>
        <el-table-column prop="jobName" label="任务名" min-width="60" show-overflow-tooltip/>
        <el-table-column prop="className" label="类名" min-width="90" show-overflow-tooltip/>
        <el-table-column prop="cronExp" label="CRON表达式" min-width="40" show-overflow-tooltip/>
        <el-table-column prop="statusName" label="运行状态" min-width="30" show-overflow-tooltip/>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <div>
              <el-button class="shortBtn" type="primary" @click="resumeJob(scope.row)" v-if="scope.row.statusCode === 'PAUSED'">恢复</el-button>
              <el-button class="shortBtn" type="primary" @click="pauseJob(scope.row)" v-if="scope.row.statusCode !== 'PAUSED'">暂停</el-button>
              <el-button class="shortBtn" type="primary" @click="deleteJob(scope.row)">删除</el-button>
              <el-button class="shortBtn" type="primary" @click="updateJob(scope.row)">修改</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {
    listAllJob, pauseJob,deleteJob,resumeJob
  } from '@api/systemManagement/taskMaintenance'

  export default {
    name: 'dataTable',
    data() {
      return {
        tableData: [],
        loading: true
      }
    },
    props: {
      searchBarInfo: {
        type: [Object, Array]
      }
    },
    created() {
      this.getList(this.searchBarInfo)
    },
    methods: {
      // 给表头设置单独样式
      getCellClass({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0 && columnIndex === 9) {
          return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
        } else {
          return ''
        }
      },

      enterTaskInfo(){
        this.$store.commit('setCurrtaskComp', {
          component: 'addTask'
        })
        this.$store.commit('setJobInfo', null);
      },

      updateJob(val){
        this.$store.commit('setCurrtaskComp', {
          component: 'addTask'
        })
        this.$store.commit('setJobInfo', val)
      },

      pauseJob(val) {
        pauseJob(val).then(
          res => {
            this.$message({
              type: 'success',
              message:  '暂停成功！'
            })
            this.getList();
          },
          err => console.info(err)
        )
      },

      resumeJob(val) {
        resumeJob(val).then(
          res => {
            this.$message({
              type: 'success',
              message:  '恢复成功！'
            })
            this.getList();
          },
          err => console.info(err)
        )
      },
      deleteJob(val) {
        deleteJob(val).then(
          res => {
            this.$message({
              type: 'success',
              message:  '删除成功！'
            })
            this.getList();
          },
          err => console.info(err)
        )
      },
      getList(val) {
        listAllJob({}).then(
          res => {
            this.loading = false
            this.tableData = res.data
          },
          err => console.info(err)
        )
      },
      // 给间隔行设置样式
      getRowClass({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'strip_row'
        }
      },
    },
    watch: {
      // 监控查询条件，调用接口
      searchBarInfo: {
        handler: function (val, oldVal) {
          this.currPage = 1
          this.getList(val)
        },
        deep: true
      }
    }
  }
</script>

<style lang="less" scoped>
  .body {
    padding: 8px 8px 0;

    .body-content {
      background: #ffffff;
      padding: 16px 16px 0;
      border-radius: 8px;

      /deep/ .is-leaf {
        background: #e3eef6;
      }

      /deep/ .table_header th:first-child {
        .cell {
          text-align: left;
          margin-left: 8px;
        }
      }

      .pagination {
        padding: 15px 0px 20px 0px;
        text-align: right;
      }

      .check-button {
        padding: 9px 15px;
        width: 111px;
        margin-bottom: 16px;
      }

      .el-table {
        border-radius: 0;

        /deep/ .table_header {
          height: 50px;
          background: rgba(227, 238, 246, 1);
          font-size: 16px;
          font-weight: bold;
          color: #222222;

          th {
            border-right: 1px solid #e0e0e0;
          }
        }

        /deep/ .el-table__header {
          table-layout: auto;
        }

        /deep/ .el-table__body {
          width: auto !important;
        }

        /deep/ .el-button + .el-button {
          margin-left: 0;
        }

        // /deep/ .el-button {
        //   height: 28px;
        //   padding: 7px 8px;
        //   font-size: 12px;
        // }
        /deep/ .strip_row {
          background: #f4f8fa;
        }

        .status::before {
          content: "•";
          margin-right: 8px;
        }

        .green {
          color: #1cc09b;
        }

        &.red {
          color: #ff2525;
        }
      }
    }
  }

  .big-dialog {
    /deep/ .el-dialog {
      width: 800px;
      overflow: hidden;
    }
  }

  /deep/ .el-table--scrollable-x .el-table__body-wrapper {
    overflow: hidden;
  }

  .el-table__body .cell .shortBtn {
    width: 40px;
    height: 24px;
    font-size: 14px;
    padding: 7px 2px !important;
  }

  .dialog-type {
    overflow: auto;

    /deep/ .el-dialog {
      height: 600px;
      margin-top: 5vh !important;

      .el-dialog__body {
        padding-left: 10px;
        padding-right: 10px;
        height: 87%;
        overflow: auto;
        position: relative;

        .bu-table-body {
          height: 94%;
          width: 100%;
          overflow: auto;
        }

        .bu-table-page-number {
          border-top: 1px solid #e0e0e0;
          height: 5%;
          text-align: right;
          padding-top: 2px;
        }

        .save-backup-form {
          /*position: absolute;*/
          /*bottom: 0;*/
          /*left: 10px;*/
          /*z-index: 100;*/
        }
      }
    }
  }

</style>
