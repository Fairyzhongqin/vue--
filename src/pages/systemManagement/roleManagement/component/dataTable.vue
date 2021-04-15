<template>
  <div>
    <div class="main">
      <el-button type="primary" @click="addRole">新增角色</el-button>
      <el-table :data="peopleList" border fit v-loading="loading" header-row-class-name="headerclass" :header-cell-style="getCellClass">
        <el-table-column type="selection" align="center" width="55" :index="indexMethod"></el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="编制时间" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="updateRole(scope.row)" size="mini" class="shortBut">修改</el-button>
            <el-button type="danger" plain @click="deleteRoleList(scope.row.id)" size="mini" class="shortBut">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :total="totalCount"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="getNewList"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <div class="copyright">Copyright © 2019 All Rights Reserved</div>
  </div>
</template>
<script>
import { showRoleList, deleteRole } from '@/api/systemManagement/roleManagement/index'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      peopleList: [],
      currentPage: 1,
      currPageCache: 1,
      totalCount: 0,
      pageSize: 10,
      loading: true
    }
  },
  props: {
    searchData: {
      type: Object
    }
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 4) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    indexMethod(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
    },
    //新增角色
    addRole() {
      this.$store.commit('setAdd', { flag: 'addFlag' })
      this.$store.commit('setRoleManagement')
    },
    //修改角色
    updateRole(data) {
      this.$store.commit('setUpdata', { id: data.id, flag: 'updataFlag' })
      this.$store.commit('setRoleManagement')
    },
    //删除角色
    deleteRoleList(id) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          this.getDeleteRole(id)
        })
        .catch(_ => {})
    },
    getDeleteRole(id) {
      deleteRole({ id: id })
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getShowRoleList()
          // hack 删除时 本页恰好无数据且显示暂无数据问题 强制跳到首页
          if (this.totalCount === this.currentPage * this.pageSize - 9) {
            this.currentPage = '1'
            this.getShowRoleList()
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        })
    },
    //展示角色列表
    getShowRoleList(val) {
      showRoleList({
        ...val,
        limit: '10',
        page: this.currentPage.toString(),
        isPaging: 'true'
      })
        .then(res => {
          console.log(res)
          this.peopleList = res.page.list
          if (this.peopleList) {
            this.loading = false
          }
          this.currPageCache = res.page.currPage
          this.totalCount = res.page.totalCount
          this.pageCache = res.page.currPage
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 请求对应页数的数据list
    getNewList(val) {
      this.loading = true
      this.getShowRoleList(this.searchData)
      this.currentPage = val
      sessionStorage.setItem('roleManagementCurrPage', this.currentPage)
    }
  },
  activated() {
    this.loading = true
    this.getShowRoleList(this.searchData)
  },
  created() {
    if (sessionStorage.getItem('roleManagementCurrPage')) {
      this.currentPage = Number(sessionStorage.getItem('roleManagementCurrPage'))
    }
    this.getShowRoleList(this.searchData)
  },
  watch: {
    // 监控搜索条件，调用查询接口
    searchData: {
      handler: function(val, oldVal) {
        this.getShowRoleList(val)
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  margin: 8px 8px 0;
  padding: 16px 8px 8px 16px;
  background: #fff;
  border-radius: 8px;
}
/deep/ .table_header th:first-child {
  .cell {
    text-align: left;
    margin-left: 8px;
  }
}
.shortBut {
  width: 40px;
  height: 24px;
  font-size: 14px;
  padding: 7px 3px !important;
}
.fourBtn {
  width: 66px;
  height: 24px;
  font-size: 13px;
  padding: 7px 2px !important;
}
.el-table {
  margin-top: 10px;
}
.page {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 10px;
  .el-pagination {
    position: none;
  }
}
/deep/.el-table--border th {
  border-right: 1px solid #e0e0e0;
}
.el-table /deep/ thead {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
}
/deep/.el-table th {
  padding: 10px 0;
}
/deep/.el-table {
  border-radius: 0px;
}
/deep/.el-table--border {
  border: 0px;
}
/deep/.el-button + .el-button {
  margin: 0px;
}
.copyright {
  margin: 15px 0px;
  text-align: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(187, 187, 187, 1);
  // margin-bottom: 58px;
}
</style>
