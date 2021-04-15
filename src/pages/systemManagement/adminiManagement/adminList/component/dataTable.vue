<template>
  <div>
    <div class="main" v-show="isShowList">
      <el-button type="primary" @click="addAdmin">新增用户</el-button>
      <el-button type="primary" @click="grant">授权</el-button>
      <el-dialog title="授权" :visible.sync="dialogVisible" width="300px" top="5vh">
        <ul>
          <li>
            <el-checkbox-group v-model="checkRoleList">
              <el-checkbox v-for="(item, index) in roleList" :key="index" :label="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </li>
        </ul>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </span>
      </el-dialog>
      <el-row class="retrieval-container">
        <el-col :span="5" class="sort-container">
          <div class="branchTree">
            <span>所属部门</span>
          </div>
          <div class="branchList">
            <el-tree
              v-loading="loading"
              :data="orgList"
              :props="defaultProps"
              node-key="id"
              default-expand-all
              :accordion="true"
              @node-click="sortNodeClick"
              :expand-on-click-node="false"
              :highlight-current="true"
            ></el-tree>
          </div>
        </el-col>
        <el-col :span="18" class="detail-container">
          <el-table
            :data="peopleList"
            border
            fit
            v-loading="loading"
            highlight-current-row
            header-row-class-name="headerclass"
            :header-cell-style="getCellClass"
            @selection-change="toSelect"
          >
            <el-table-column type="selection" width="40" :index="dataIndex"></el-table-column>
            <el-table-column prop="username" label="用户名" min-width="60" show-overflow-tooltip></el-table-column>
            <el-table-column prop="nickName" label="姓名" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cardId" label="执法证号" min-width="75" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="所属部门" min-width="75" show-overflow-tooltip></el-table-column>
            <el-table-column prop="position" label="职位" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="mobile" label="手机号" min-width="65" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态" min-width="60" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0" class="stop">• 禁用</span>
                <span v-if="scope.row.status == 1" class="start">• 正常</span>
              </template>
            </el-table-column>
            <el-table-column prop="roleNameList" label="角色" min-width="60" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="200">
              <template slot-scope="scope">
                <el-button type="primary" @click="updateAdmin(scope.row)" size="mini" class="shortBut">修改</el-button>
                <el-button type="primary" @click="signature(scope.row)" size="mini" class="shortBut">签章</el-button>
                <el-button type="primary" v-if="scope.row.status == 0" @click="startAdmin(scope.row.id)" size="mini" class="shortBut">启用</el-button>
                <el-button type="danger" plain v-if="scope.row.status == 1" @click="stopAdmin(scope.row.id)" size="mini" class="shortBut">禁用</el-button>
                <el-button type="primary" @click="resetPwd(scope.row.id)" size="mini" class="fourBtn">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="page">
        <el-pagination
          :total="totalCount"
          :current-page.sync="currentPage"
          :page-size="10"
          @current-change="getNewList"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <div class="copyright">Copyright © 2019 All Rights Reserved</div>
  </div>
</template>

<script>
import { getOrgList, getPeopleList } from '@/api/onSiteInspection/index'
import { saveUser, showUserList, toGrant, initPsw } from '@/api/systemManagement/adminiManagement/index'
import { mapState } from 'vuex'

export default {
  name: 'dataTable',
  components: {},
  props: {
    selectNum: {
      type: Number
    },
    searchData: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      arr: [],
      peopleList: [],
      locationList: [],
      orgList: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      selectedOrg: null,
      // name: null, // 查询条件：企业名字
      // code: null, // 查询条件：信用代码
      isShowList: true,
      selectedOrgList: [],
      currentPage: 1,
      totalCount: 0,
      dialogVisible: false,
      checkRoleList: [],
      roleList: [],
      pageCache: 1,
      loading: true
    }
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 9) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    toSelect(val) {
      let arr = []
      val.map(item => {
        arr.push(item.id)
      })
      this.arr = arr
    },
    dataIndex(val) {
      return (this.pageCache - 1) * 10 + val + 1
    },
    //授权
    grant() {
      if (this.arr.length > 0) {
        this.dialogVisible = true
        this.getShowUserList()
      } else {
        this.$message({
          type: 'error',
          message: '请先勾选需要授权的用户!'
        })
      }
    },
    getShowUserList(data = {}) {
      showUserList(data)
        .then(res => {
          this.roleList = res.page.list
        })
        .catch(err => {
          console.log(err)
        })
    },
    //授权确定
    sure() {
      this.dialogVisible = false
      this.getToGrant()
    },
    getToGrant() {
      let ids = []
      this.arr.map(item => {
        ids.push(item)
      })
      let roles = []
      this.checkRoleList.map(i => {
        roles.push(i)
        console.log(i)
      })
      let req = {
        ids,
        roles
      }
      toGrant(req)
        .then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '授权成功!'
          })
          this.initPeopleList(this.searchData)
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '授权失败!'
          })
        })
    },
    //增加
    addAdmin() {
      this.$store.commit('setsearchList',this.searchData)
      this.$store.commit('setAdd', { flag: 'addFlag' })
      this.$store.commit('setAdminiManagementCurrentComponent', 'addAdministrator')
    },
    //修改
    updateAdmin(data) {
      this.$store.commit('setsearchList',this.searchData)
      this.$store.commit('setUpdata', { id: data.id, flag: 'updataFlag' })
      this.$store.commit('setAdminiManagementCurrentComponent', 'addAdministrator')
    },
    //状态启用禁用
    startAdmin(id) {
      this.getstartSaveUser(id)
    },
    getstartSaveUser(id) {
      saveUser({ id: id, status: 1 })
        .then(res => {
          this.$message({
            type: 'success',
            message: '启用成功！'
          })
          this.initPeopleList()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '启用失败!'
          })
        })
    },
    stopAdmin(id) {
      this.getstopSaveUser(id)
    },
    getstopSaveUser(id) {
      saveUser({ id: id, status: 0 })
        .then(res => {
          this.$message({
            type: 'success',
            message: '禁用成功！'
          })
          this.initPeopleList()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '禁用失败!'
          })
        })
    },
    resetPwd(id) {
      this.$confirm('确认重置该用户密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          //重置密码
          initPsw({ userId: id })
            .then(res => {
              this.$message({
                type: 'success',
                message: '重置成功！'
              })
              this.initPeopleList()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '重置失败!'
              })
            })
        })
        .catch(_ => {})
    },
    //签章
    signature(data) {
      // console.log(data.id, '--------------------')
      this.$store.commit('setSignature', { id: data.id, flag: 'signFlag' })
      this.$store.commit('setAdminiManagementCurrentComponent', 'addAdministrator')
    },
    sortNodeClick(val) {
      console.log(val, '----------')
      this.selectedOrg = val
      this.initPeopleList(this.searchData)
      this.$store.commit('savaOrgData', val)
    },
    // 获取相应地区的企业列表
    initOrgList(data = {}) {
      getOrgList(data)
        .then(res => {
          this.orgList = res.data
          if (this.orgList) {
            this.loading = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取人员列表
    initPeopleList(val, id) {
      // console.log(val);
      getPeopleList({
        ...val,
        deptCode: this.selectedOrg ? this.selectedOrg.code : '',
        limit: '10',
        page: this.currentPage.toString(),
        isPaging: 'true'
      })
        .then(res => {
          // res.page.list.forEach(item => {
          //   item.checked = false
          // })
          this.peopleList = res.page.list
          console.log(this.peopleList)
          if (this.peopleList) {
            this.loading = false
          }
          this.currPage = res.page.currPage
          this.totalCount = res.page.totalCount
          this.pageCache = res.page.currPage
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 模糊查询
    search() {
      this.initOrgList({
        limit: '10',
        page: '1',
        companyCode: this.code,
        companyName: this.name
      })
    },
    // 请求对应页数的数据list
    getNewList(val) {
      this.currPage = val
      this.loading = true
      this.initPeopleList(this.searchData)
    }
  },
  computed: {
    ...mapState(['searchcurrPagechange', 'OrgData'])
  },
  destroyed() {
    this.$store.commit('setcurrPage', this.currentPage)
  },
  created() {
    this.currentPage = this.searchcurrPagechange
    this.selectedOrg = this.OrgData
  },

  mounted() {
    // this.initLocationList();
    this.initOrgList({ limit: '10', page: '1' })
    this.initPeopleList(this.searchData)
  },
  watch: {
    // 监控搜索条件，调用查询接口
    searchData: {
      handler: function(val, oldVal) {
        if (Array.isArray(val)) {
          this.selectedOrg = null
        }
        this.initPeopleList(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.body {
  margin: 0;
}
/deep/ .table_header th:first-child {
  .cell {
    text-align: left;
    margin-left: 8px;
  }
}
.main {
  margin: 8px 8px 0;
  padding: 16px 8px 8px 16px;
  background: #fff;
  border-radius: 8px;
  ul {
    padding-left: 0px;
    margin: 0px !important;
  }
  li {
    list-style: none;
    padding: 5px 0px 5px 20px;
    height: 446px;
    overflow: auto;
  }

  /deep/.el-table {
    border-radius: 0px;
  }
  .branchTree {
    height: 50px;
    line-height: 50px;
    background: rgba(227, 238, 246, 1);
    span {
      width: 80px;
      height: 16px;
      display: block;
      padding-left: 15px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
    }
  }
  .branchList {
    background-color: #eef5f9;
    height: 368px;
    overflow: auto;
    /deep/ .el-tree {
      background-color: #eef5f9;
    }
  }
  .retrieval-container {
    padding-top: 10px;
    height: 430px;
    .sort-container {
      height: 100%;
      border: 1px solid #e0e0e0;
      margin-right: 10px;
    }
    .detail-container {
      overflow: auto;
      color: #222222;
      height: 100%;
      overflow-y: auto;
      .el-table /deep/ tr.headerclass {
        height: 50px !important;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
        font-size: 16px;
        font-family: PingFang SC;
      }
      .box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .org {
          margin-left: 16px;
          height: 42px;
          line-height: 42px;
          word-break: break-all;
          .el-divider--horizontal {
            margin: 0;
          }
          span {
            color: #222222;
            display: inline-block;
          }
          span:nth-of-type(1) {
            width: 30px;
          }
        }
        .oper {
          padding-right: 22px;
          line-height: 42px;
        }
      }
      /deep/.el-tree {
        background: #eef5f9;
      }
    }
  }
  .page {
    text-align: right;
    padding: 10px 10px 5px 0;
    /deep/ .el-pagination {
      display: inline-block;
    }
  }
  /deep/.el-button + .el-button {
    margin-left: 0px;
  }
  /deep/.el-table__header-wrapper .el-table__header {
    height: 50px;
  }
  /deep/.el-table--border th {
    border-right: 1px solid #e0e0e0;
  }
  /deep/.el-table--border {
    border: 0px;
  }
  /deep/.el-col-18 {
    width: 77.5%;
  }
  .shortBut {
    width: 40px;
    height: 24px;
    font-size: 14px;
    padding: 7px 3px !important;
  }
  .shortButton {
    width: 40px;
    height: 24px;
    font-size: 13px;
    padding: 7px 3px !important;
  }
  .fourBtn {
    width: 66px;
    height: 24px;
    font-size: 14px;
    padding: 7px 2px !important;
  }
  .el-checkbox {
    width: 100%;
    display: block;
    height: 25px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
    // margin-left: 12px;
  }
  .start {
    color: #1cc09b;
  }
  .stop {
    color: #ff2525;
  }
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
/deep/.el-tree .el-tree-node__expand-icon {
  margin-left: 12px;
}
/deep/.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-image: linear-gradient(to left, #fffffff5 0%, white 100%);
}
</style>
