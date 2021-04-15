<template>
  <div class="legal-todo-list">
    <search-bar :searchList="searchList" @searchTrigger="searchTrigger"></search-bar>

    <div class="list-container">
      
      <tips v-if="!compBrowseShow" :tipName="['综合','浏览']" @clickHandle="clickHandle"></tips>
      <div class="list">
        <el-row class="table-bar">
          <el-table
            :data="tableData"
            header-row-class-name="table_header"
            :header-cell-style="getCellClass"
            :row-class-name="getRowClass"
            border
            style="width: 100%"
            highlight-current-row
            v-loading="loading"
            @row-click="rowClick"
          >
            <el-table-column min-width="70" label="序号" align="center" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <!-- <el-table-column prop="caseName" label="案件名称" min-width="100" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="partyName" label="当事人" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="听证告知书送达时间" align="center" min-width="170" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  v-if="scope.row.authorizedTime"
                >{{scope.row.authorizedTime?scope.row.authorizedTime:''}}</span>
                <span v-if="!scope.row.authorizedTime">-</span>
              </template>

            </el-table-column>
            <el-table-column label="申请听证时间" align="center" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  v-if="scope.row.applyTime"
                >{{scope.row.applyTime?scope.row.applyTime:''}}</span>
                <span v-if="!scope.row.applyTime">-</span>
              </template>
            </el-table-column>
            <el-table-column label="组织听证时间" align="center" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  v-if="scope.row.hearTime"
                >{{scope.row.hearTime?scope.row.hearTime:''}}</span>
                <span v-if="!scope.row.hearTime">-</span>
              </template>
            </el-table-column>
            <el-table-column prop="executorDeptName" label="执法部门" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="executorName" label="执法人员" min-width="100" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column
              prop="caseCrimeTime"
              label="立案时间"
              min-width="100"
              align="center"
              show-overflow-tooltip
            ></el-table-column> -->
            <el-table-column width="150" label="操作" show-overflow-tooltip fixed="right">
              <template slot-scope="scope">
                <el-button
                  class="shortBtn fourBtn"
                  type="primary"
                  size="mini"
                  @click="prepareHearing(scope.row,'work')"
                  v-if="scope.row.isFinish==='0'"
                >组织听证</el-button>
                <el-button
                  class="shortBtn"
                  type="primary"
                  size="mini"
                  @click="prepareHearing(scope.row,'preview')"
                >详情</el-button>
                <!-- <el-button
                  type="danger"
                  size="mini"
                  plain
                  v-if="scope.row.isFinish==='0'&&scope.row.writNum>0"
                  @click="finishHearing(scope.row)"
                >结束听证</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalNum"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <!--选择执法人员弹窗 start-->
    <div v-if="peopleVisiable">
      <el-dialog
        title="选择执法人员"
        :visible.sync="peopleVisiable"
        width="990px"
        height="570px"
        :close-on-click-modal="false"
      >
        <select-people @getPeople="getSelectedPeople" :selectNum="1"></select-people>
      </el-dialog>
    </div>
    <!--选择执法人员弹窗 end-->

    <!--选择执法部门弹窗 start-->
    <el-dialog
      title="选择执法部门"
      width="300px"
      height="570px"
      :before-close="handleOrg"
      :visible.sync="deptVisiable"
    >
      <select-org :closeOrgDialog="handleOrg" @getOrg="getSelectedOrg"></select-org>
    </el-dialog>
    <!--选择执法部门弹窗 end-->
    <comprehensive-browse v-if="compBrowseShow" @closeFrame="compBrowseShow=false"></comprehensive-browse>
  </div>
</template>

<script>
import searchBar from "@/components/searchBar";
import selectPeople from "@/pages/onSiteInspection/newInspection/component/selectPeople";
import selectOrg from "../../onSiteInspection/newInspection/component/selectOrg";
import { getPenaltyhearList, penaltyhearComplete } from "@/api/penatlyHear";
import tips from "@/components/writGroup/tips"
import comprehensiveBrowse from "@/pages/comprehensiveBrowse"
import { getFilingRegister } from "@/api/filingRegister/index";
export default {
  name: "list",
  components: {
    searchBar,
    selectPeople,
    selectOrg,
    tips,
    comprehensiveBrowse
  },
  data() {
    return {
      searchList: [
        {
          name: "当事人",
          codeName: "dsr",
          type: "text",
          value: ""
        },
        {
          name: "执法人员",
          codeName: "zfry",
          type: "dialog",
          value: "",
          event: this.selectPeople
        },
        // {
        //   name: "执法部门",
        //   codeName: "zfbm",
        //   type: "orgDialog",
        //   value: '',
        //   event: this.selectOrg
        // },
        // {
        //   name: "立案时间",
        //   codeName: "sj",
        //   type: "date",
        //   value: ""
        // }
      ],
      searchInfo: {
        ajmc: "",
        dsr: "",
        ay: "",
        zfry: "",
        zfbm: "",
        sj: ""
      },
      tableData: [], // 列表数据
      currentPage: 1, // 翻页 当前页
      totalNum: 0, // 翻页 总页数
      peopleVisiable: false,
      deptVisiable: false,
      loading: true,
      compBrowseShow: false,
      currRow: {},
      isFinish: '0'// 1 已听证，0 待
    };
  },
  created() {
    if(this.$route.path === '/doneHear') {
      this.isFinish = '1'
    } else if (this.$route.path === '/overdueHear') {
      this.isFinish = '2'
    } else {
      this.isFinish = '0'
    }
    this.getList();
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 8) {
        return "background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em";
      } else {
        return "";
      }
    },
    prepareHearing(data, type) {
      this.$emit("commitItemInfo", data, type);
      this.$store.commit("setCurrHearingComp", "hearing");
    },
    searchTrigger(val) {
      // 搜索栏 回调
      this.searchInfo = val;
      this.getList();
    },
    getList() {
      // 搜索列表数据
      getPenaltyhearList({
        isFinish: this.isFinish,
        caseName: this.searchInfo.ajmc,
        endTime: this.searchInfo.sj ? this.searchInfo.sj[1] : "",
        executorId: this.searchInfo.zfry ? this.searchInfo.zfry.id : "",
        limit: "10",
        page: this.currentPage + "",
        partyName: this.searchInfo.dsr,
        startTime: this.searchInfo.sj ? this.searchInfo.sj[0] : ""
      }).then(res => {
        if (res.code === "0") {
          this.tableData = res.page.list;
          if (this.tableData) {
            this.loading = false;
          }
          this.totalNum = res.page.totalCount;
        }
      });
    },
    handleCurrentChange() {
      // 翻页事件
      this.getList();
    },
    hearing(val) {
      // 列表-组织听证
    },
    post(val) {
      // 列表-派发预审
    },
    examine(val) {
      // 列表-审核
      this.$emit("changePage", "examine");
    },
    // 给间隔行设置样式
    getRowClass({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "strip_row";
      }
    },
    // 获取执法人员弹框返回数据
    getSelectedPeople(bool, auditor) {
      this.peopleVisiable = false;
      if (!bool) return;
      if (auditor.length === 0) {
        this.$message({
          showClose: true,
          message: "请选择审核人员",
          type: "error"
        });
      } else {
        this.searchList[1].value = auditor[0];
      }
    },
    selectPeople() {
      this.peopleVisiable = true;
    },
    handleOrg() {
      // 打开执法部门关闭
      this.deptVisiable = false;
    },
    getSelectedOrg(org) {
      this.searchList[2].value = JSON.parse(JSON.stringify(org));
    },
    selectOrg() {
      this.deptVisiable = true;
    },
    finishHearing(row) {
      penaltyhearComplete({
        id: row.id
      }).then(res => {
        if (res.code === "0") {
          this.getList();
        }
      });
    },
    rowClick(row, column, event) {
      getFilingRegister({
        penalty: row.caseId
      }).then(res => {
        this.currRow = res.data;
        this.$store.commit("setPenalty", res.data);
      })
    },
    clickHandle() {
      //..
      if (this.currRow.penaltyUndEntity ? this.currRow.penaltyUndEntity.penaltyId : false) {
        this.compBrowseShow = true
      } else {
        this.$message({
          type: "warning",
          message: "请先选中一个案件"
        });
      }
    },
  },
  watch: {
    $route(to, from) {
      this.tableData = [];
      this.totalNum = 0;
      this.currentPage = 1;
      this.searchList.forEach(item => {
        item.value =
          item.value instanceof Array
            ? []
            : item.value instanceof Object
            ? {}
            : "";
      });
      if (to.path === "/doneHear") {
        this.isFinish = '1'
      } else if (to.path === "/overdueHear") {
        this.isFinish = '2'
      } else {
        this.isFinish = '0'
      }
      this.getList()
    },
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-table--border th {
  border-color: #e0e0e0;
}
.legal-todo-list {
  position: relative;
  .list-container {
    padding: 8px;
    .list {
      border-radius: 8px;
      background-color: #fff;
      border: 1px solid rgba(221, 221, 221, 1);
      box-shadow: 0px 2px 4px 0px rgba(220, 229, 230, 1);
      padding: 16px;
      .pagination {
        display: flex;
        flex-direction: row-reverse;
      }
    }
  }
  .el-table {
    border-radius: 0;
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
    /deep/ .el-button + .el-button {
      margin-left: 0;
    }
    .el-table__body .cell .shortBtn {
      width: 40px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px !important;
    }
    .el-table__body .cell .fourBtn {
      width: 67px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px;
    }
  }
}
</style>
