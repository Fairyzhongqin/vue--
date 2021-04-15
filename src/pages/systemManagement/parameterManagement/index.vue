<template>
  <div class="parameterManagement">
    <div class="parameterWrap" v-if="this.$store.state.addParamsInfoStatus === false && this.$store.state.editParamsInfoStatus === false">
      <div v-if="!isDataList">
        <search-bar :searchList="searchList" @searchTrigger="setSearchData"></search-bar>
      </div>
      <div class="main">
        <el-button type="primary" @click="addInfo">新增</el-button>
        <el-table
          :data="parameterList"
          border
          fit
          v-loading="loading"
          header-row-class-name="table_header"
          :row-class-name="getRowClass"
          :header-cell-style="getCellClass"
          style="width: 100%"
        >
          <el-table-column type="index" width="70" label="序号" :index="indexMethod" align="center"></el-table-column>
          <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="参数名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="value" label="参数值" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
          <el-table-column prop="action" label="操作" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="editInfo(scope.row)" size="mini" class="shortBut">修改</el-button>
              <el-button type="danger" plain @click="deleteInfo(scope.$index, scope.row)" size="mini" class="shortBut">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            :total="totalCount"
            :current-page="Number(currPage)"
            :page-size="Number(pageSize)"
            @current-change="handlePagesChange($event, 'curr')"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
      <!-- <router-view></router-view> -->
      <div class="copyright">Copyright © 2019 All Rights Reserved</div>
    </div>
    <div class="addWrap" v-if="this.$store.state.addParamsInfoStatus === true">
      <AddParameterCom></AddParameterCom>
    </div>
    <div class="editWrap" v-if="this.$store.state.editParamsInfoStatus === true">
      <EditParameterCom></EditParameterCom>
    </div>
  </div>
</template>
<script>
import searchBar from '@components/searchBar'
import { getPamameterList, deleteParameterData } from '@/api/systemManagement/parameterManagement/index'
import AddParameterCom from './components/AddParameterInfo'
import EditParameterCom from './components/EditParameterInfo'
import { mapState } from 'vuex'

export default {
  name: 'parameterManagement',
  components: {
    searchBar,
    AddParameterCom,
    EditParameterCom
  },
  data() {
    return {
      parameterList: [],
      currPage: '1',
      pageSize: '10',
      totalCount: 0,
      loading: true,
      parameterId: '',
      sendToEditData: null,
      // search data
      searchList: [
        {
          name: '参数名称',
          codeName: 'name',
          type: 'text',
          value: ''
        }
      ],
      searchData: {}
    }
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 5) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    // indexMethod
    indexMethod(index) {
      return index + 1 + (this.currPage - 1) * this.pageSize
    },
    getList() {
      getPamameterList({
        isPaging: 'true',
        limit: this.pageSize,
        page: this.currPage,
        ...this.searchData
      })
        .then(res => {
          // console.log(res);
          if (res.code === '0') {
            this.parameterList = res.page.list
            this.loading = false
            this.totalCount = Number(res.page.totalCount)
          }
        })
        .catch(error => {
          console.info(error)
        })
    },
    addInfo() {
      // this.$router.push("/addParameterInfo");
      this.$store.commit('changeParamsAddStatus', true)
    },
    editInfo(row) {
      this.sendToEditData = row
      sessionStorage.setItem('editParameterData', JSON.stringify(this.sendToEditData))
      // this.$router.push("/editParameterInfo");
      this.$store.commit('changeParamsEditStatus', true)
    },
    // delete
    deleteInfo(index, row) {
      this.parameterId = row.id
      console.log('要删除的id', this.parameterId)
      this.$confirm('此操作将永久删除该参数信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          deleteParameterData({
            id: this.parameterId,
            delFlag: '-1'
          })
            .then(res => {
              if (res.code === '0') {
                this.$message.success('删除成功')
                this.getList()
                // hack 删除时 本页恰好无数据且显示暂无数据问题 强制跳到首页
                if (this.totalCount === this.currPage * this.pageSize - 9) {
                  this.currPage = '1'
                  this.getList()
                }
              } else {
                this.$message.error('删除失败')
              }
            }) // eslint-disable-next-line handle-callback-err
            .catch(error => {
              this.$message.error('网络错误')
            })
        })
        .catch(() => {
          document.activeElement.blur()
        })
    },
    // pagenation
    handlePagesChange(e, type) {
      if (type === 'curr') {
        this.currPage = e + ''
        this.getList()
        this.loading = true
      }
    },
    // search data
    setSearchData(val) {
      this.searchData = val
    },
    // 给间隔行设置样式
    getRowClass({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'strip_row'
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  destroyed() {},
  watch: {
    $route(to, from) {
      // to , from 分别表示从哪跳转到哪，都是一个对象
      // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
      // if (
      //   from.path === "/addParameterInfo" ||
      //   from.path === "/editParameterInfo"
      // ) {
      //   this.getList();
      // }
      // be forced to turn the currpage to the first page
      if (to.path === '/parameterManagement') {
        this.currPage = '1'
        this.getList()
      }
    },
    searchData: {
      handler: function(val, oldVal) {
        this.getList()
      },
      deep: true
    },
    addParamsInfoStatus: {
      handler: function(val, oldVal) {
        if (val === false && oldVal === true) {
          this.getList()
        }
      },
      deep: true
    },
    editParamsInfoStatus: {
      handler: function(val, oldVal) {
        if (val === false && oldVal === true) {
          this.getList()
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['isDataList', 'addParamsInfoStatus', 'editParamsInfoStatus'])
  }
}
</script>
<style lang="less" scoped>
.main {
  margin: 8px 8px 0;
  padding: 16px 8px 8px 16px;
  background: #fff;
  border-radius: 8px;
  /deep/.el-button + .el-button {
    margin-left: 0;
  }
  /deep/.el-table--border th {
    border-right: 1px solid #e0e0e0;
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
  font-size: 14px;
  padding: 7px 2px !important;
}
.el-table {
  border-radius: 0px;
  margin-top: 10px;
  /deep/ .table_header {
    height: 50px;
    background: rgba(227, 238, 246, 1);
    font-size: 16px;
    font-weight: bold;
    color: #222222;
  }
  /deep/ .strip_row {
    background: #f4f8fa;
  }
}
.page {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 10px;
}
.el-pagination {
  position: none;
}
.el-dialog__wrapper .el-dialog__header {
  border-bottom: none;
}
.el-dialog__wrapper .el-dialog__footer {
  border-top: none;
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
/deep/.el-table--border th {
  border-right: 1px solid #e0e0e0;
}
</style>
