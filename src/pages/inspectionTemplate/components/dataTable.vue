<template>
  <div class="body">
    <div class="body-content">
      <el-table :data="list" border v-loading="loading" style="width: 100%" stripe highlight-current-row @row-click="rowClick">
        <el-table-column type="index" label="序号" :index="indexMethod" width="70" align="center"></el-table-column>
        <el-table-column prop="templateName" label="模板名称" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip min-width="100" align="center"> </el-table-column>
        <el-table-column prop="createUserName" label="创建人" align="center" show-overflow-tooltip min-width="100"></el-table-column>

        <el-table-column v-if="!from" label="操作" min-width="280">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.createUser == userId" class="shortBtn" @click="clickBtn(scope.row, 'mod')">修改</el-button>
            <el-button type="danger"  class="shortBtn" plain @click="clickBtn(scope.row, 'del')">删除</el-button>
            <el-button type="primary" v-if="scope.row.createUser == userId"  class="shortBtn" @click="clickBtn(scope.row, 'sha')">分享</el-button>
            <el-button type="primary" class="shortBtn" @click="clickBtn(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-button v-if="!from" class="selectButton" type="primary" style="margin-bottom: 10px" @click="addTemp">新增模板</el-button>
        <el-pagination
          :total="totalCount"
          :current-page.sync="currPage"
          :page-size="10"
          @current-change="getNewList"
          @size-change="handleSizeChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="选择分享人员" width="900px" height="600px" :visible.sync="showEnterPush">
      <select-people @getPeople="getSelectedPeople" :minNum="1" v-if="showEnterPush" :peopleCache="peopleCache"></select-people>
    </el-dialog>
  </div>
</template>

<script>
import { getTempList, delTemp, shareTemp } from '@/api/inspectionTemplate'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople' //选择转办人员
export default {
  name: 'dataTable',
  components: {
    selectPeople
  },
  props: {
    searchBarInfo: {
      type: [Object, Array]
    },
    from: String // 是否正被引用
  },
  data() {
    return {
        userId:JSON.parse(localStorage.getItem('userInfo')).userEntity.id,
      currTempId: '', // 当前操作的模板id
      list: [],
      totalCount: 0,
      currPage: 1,
      currPageCache: 1,
      pageSize: 10,
      showEnterPush: false,
      loading: true,
      penalty: {}, // 要进行转办的案件信息
      peopleCache: [] // 转办人员回显值
    }
  },
  created() {
    // coding
    /* if (sessionStorage.getItem('commonHandleCurrPage')) {
      this.currPage = Number(sessionStorage.getItem('commonHandleCurrPage'))
    } */
    this.getTemplateList()
  },
  activated() {
    this.getTemplateList(this.searchBarInfo)
    this.currRow = {}
  },
  methods: {
    // 获取模板列表
    getTemplateList(info) {
      this.loading = true
      getTempList({
        templateName: info ? info.tempName : '',
        limit: '10',
        page: this.currPage.toString()
      })
        .then(res => {
          this.totalCount = res.page.totalCount
          this.currPageCache = res.page.currPage
          this.list = res.page.list
          if (this.list) {
            this.loading = false
          }
        })
        .catch(err => console.info(err))
    },
    // 点击操作按钮
    clickBtn(row, type) {
      if (type === 'mod') {
        this.$store.commit('setTempInfo', row)
        this.$store.commit('switchInspTemplate', 'templateDetail')
      } else if (type === 'del') {
        this.deleteTemp(row)
      } else if (type === 'sha') {
        this.currTempId = row.id
        this.showEnterPush = true
      } else {
        row.isDetail = true
        this.$store.commit('setTempInfo', row)
        this.$store.commit('switchInspTemplate', 'templateDetail')
      }
    },
    // 删除模板
    deleteTemp(row) {
      this.$confirm('确认删除'+ row.templateName +'？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          delTemp({ id: row.id })
            .then(res => {
              if ((this.totalCount - 1) % (this.currPage - 1) === 0) {
                // 所删数据是当前页的最后一条数据时
                this.currPage = this.currPage - 1
              }
              this.getTemplateList(this.searchBarInfo)
              this.$message({
                type: 'success',
                message: '刪除成功！'
              })
              document.activeElement.blur()
            })
            .catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          document.activeElement.blur()
        })
    },
    // 跳转新增页面
    addTemp() {
      this.$store.commit('setTempInfo', {})
      this.$store.commit('switchInspTemplate', 'templateDetail')
    },
    // 分享模板
    getSelectedPeople(bool, arr) {
      if (!bool) return
      let userIds = []
      arr.forEach(p => {
        userIds.push(p.id)
      })
      shareTemp({
        id: this.currTempId,
        userIds: userIds.join(',')
      }).then(res => {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: '分享成功！'
          })
        }
        this.showEnterPush = false
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '分享失败！'
        })
        this.showEnterPush = false
      })
    },
    // 选中某条模板
    rowClick(row){
      this.$emit('selectTemp', row)
    },
    // 请求对应页数的数据list
    getNewList(val) {
      // coding
      // sessionStorage.setItem('commonHandleCurrPage', this.currPage)
      this.getTemplateList(this.searchBarInfo)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTemplateList(this.searchBarInfo)
    },
    indexMethod(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
    }
  },
  watch: {
    searchBarInfo: {
      handler: function(val, oldVal) {
        this.currPage = 1
        this.getTemplateList(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-table .cell.el-tooltip {
  text-overflow: clip;
}

.body {
  width: 98.5%;
  padding: 8px 8px 0;
  .body-content {
    background: #ffffff;
    padding: 8px 11px 0;
    border-radius: 8px;
    position: relative;
    .el-table /deep/ thead {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
    }
    /deep/ .el-table--border th {
      border-color: #e0e0e0;
    }

    .el-table {
      padding: 8px;
    }
    .lineheight {
      height: 37px;
    }
    .el-table /deep/ tr.headerclass {
      height: 50px !important;
    }
    .el-table--border {
      border: 0px;
    }
    /deep/ .is-leaf {
      background: #e3eef6;
    }
    .pagination {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px 5px;
    }
    .check-button {
      padding: 9px 15px;
      height: 30px;
      line-height: 12px;
      width: 111px;
      margin-bottom: 16px;
    }
    .el-button--danger:active,
    .el-button--danger:focus {
      background: #fef0f0;
      color: #dd6161;
      border-color: #fbc4c4;
    }
  }
  .el-button + .el-button {
    margin-left: 0px;
  }
  .el-table__body .cell .shortBtn {
    width: 40px;
    height: 24px;
    font-size: 14px;
    padding: 7px 2px !important;
  }
  /deep/ .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: none;
  }
  /deep/ .el-pagination__jump {
    margin-left: 0px;
  }
  /deep/ .el-table th {
    padding: 12px 0px;
  }
  .el-table thead {
    color: #222222;
    font-size: 16px;
    font-family: PingFang SC;
  }
}
</style>
