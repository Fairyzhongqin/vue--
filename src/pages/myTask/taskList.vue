<template>
  <div>
    <search-bar :searchList="searchList" @searchTrigger="setSearchData"></search-bar>
    <!--选择执法人员弹窗 start-->
      <div v-if="peopleVisiable">
        <el-dialog title="请选择提交人"
                   :visible.sync="peopleVisiable"
                   width="900px"
                   height="600px"
                   :close-on-click-modal="false">
          <select-people @getPeople="getSelectedPeople"
                         :selectNum="1"></select-people>
        </el-dialog>
      </div>

    <div class="table-zone">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        fit
        stripe
        v-loading="loading"
        highlight-current-row
        :default-sort="{prop: 'date', order: 'descending'}"
        header-row-class-name="header"
        :header-cell-style="getCellClass"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="70" align="center"></el-table-column>
        
        <el-table-column prop="partyName" show-overflow-tooltip label="当事人" min-width="90" align="center"></el-table-column>
        <el-table-column prop="title" show-overflow-tooltip label="审核审批事项" min-width="120" >
          <!-- <template slot-scope="scope">
            <router-link to="/">{{ scope.row.title}}</router-link>
          </template>-->
        </el-table-column>
        <el-table-column prop="msgContent" show-overflow-tooltip label="内容" min-width="220" align="center"></el-table-column>
        <el-table-column prop="submitTime" show-overflow-tooltip label="提交时间" min-width="120" align="center"></el-table-column>
        <el-table-column prop="submitDeptName" show-overflow-tooltip label="提交部门" min-width="120" align="center"></el-table-column>
        <el-table-column prop="submitterUserName" show-overflow-tooltip label="提交人" min-width="80" align="center"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope" v-if="scope.row">
            <el-button type="primary" @click="toDetail(scope.row)" v-if="realPath === 'done'&&scope.row.auditTypeCode!=='ta80007'">详情</el-button>
            <el-button type="primary" @click="handle(scope.row)" v-if="realPath === 'todo'&&scope.row.auditTypeCode!=='ta80007'">处置</el-button>
            <el-button type="primary" @click="discussNotice(scope.row)" v-if="scope.row.auditTypeCode==='ta80007'">{{realPath==='done'?'详情':'查收'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :total="totalCount"
          :current-page.sync="currPage"
          :page-size="10"
          @current-change="getNewPageList"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <!-- groupNotice -->
    <el-dialog
      title="集体讨论通知"
      :visible.sync="groupNoticeDialog">
      <el-row class="groupNoticeDialog">
        <el-col :span="24">
          <p><span>案件名称：</span>{{groupNotice.caseName}}</p>
        </el-col>
        <el-col :span="24">
          <p><span>会议名称：</span>{{groupNotice.discussName}}</p>
        </el-col>
        <el-col :span="24">
          <p><span>讨论时间：</span>{{groupNotice.time}}</p>
        </el-col>
        <el-col :span="24">
          <p><span>地点：</span>{{groupNotice.address}}</p>
        </el-col>
        <el-col :span="24">
          <p><span>通知人员：</span>{{groupNotice.peoples}}</p>
        </el-col>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="groupNoticeDialog=false">关 闭</el-button>
        <el-button type="primary" @click="joinGroup" v-if="realPath === 'todo'">确定参与</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchBar from "@components/searchBar";
import selectPeople from '../onSiteInspection/newInspection/component/selectPeople'
import { getDoneList, getTodoList, submitTodoInfo } from "@/api/workArea";
import { getNoticeInfo } from "@/api/groupDiscussion";
import { stringToDate, debounce } from "@/utils/util";
import { getFilingRegister } from "@/api/filingRegister/index";
export default {
  components: {
    searchBar,
    selectPeople
  },
  props: {
    path: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchList: [
        {
          name: "审核审批事项",
          codeName: "auditTypeCode",
          type: "select",
          url: "/aj/sys/sysdict/list",
          value: "",
          data: { type: "type_audit" }
        },
        {
          name: "提交时间",
          codeName: "time",
          type: "date",
          value: ""
        },
        {
          name: "提交人",
          codeName: "submitPeople",
          type: "dialog",
          value: {},
          event: this.selectPeople,
          placeholder: "请选择提交人"
        },
        {
          name: "提交部门",
          codeName: "submitDept",
          type: "chooseOrg",
          value: {},
          placeholder: "执法部门"
        }
      ],
      peopleVisiable: false, // 人员选择框
      auditSimpleDto: {},
      currPage: 1,
      tableData: [],
      realPath: null,
      currPageCache: 1,
      pageSize: 10,
      totalCount: 0,
      loading: true,
      groupNoticeDialog: false,
      groupNotice: {
        caseName: '',
        time: '',
        address: '',
        peoples: '',
        peopleIds: '',
        groupInfo: ''
      },
      currentRow: {}
    };
  },
  methods: {
    selectPeople() {
        // 打开选择人员弹框
        this.peopleVisiable = true
      },
      
      getSelectedPeople(state, val) {
        // 选择执法人员
        if (state) {
          this.searchList[2].value = val[0];
        }
        this.peopleVisiable = false
      },
    discussNotice(row) {
      this.currentRow = row;
      getNoticeInfo({
        id: row.requestId.split(':')[0]
      }).then(res => {
        this.groupNotice = {
          caseName: res.data.caseName,
          discussName: res.data.discussName,
          time: res.data.discussTime,
          address: res.data.discussAddress,
          peoples: res.data.acceptNames,
          peopleIds: res.data.acceptIds
        }
        this.groupNoticeDialog = true;
      })
    },
    joinGroup() {
      submitTodoInfo({
        auditResultCode: '',
        auditResultOption: '',
        auditTypeCode: 'ta80007',
        handlerDeptId: this.currentRow.handlerDeptId,
        parentTaskId: this.currentRow.parentTaskId,
        handlerUserId: this.currentRow.handlerUserId,
        requestDeptName: this.currentRow.requestDeptName,
        requestId: this.currentRow.requestId,
        requestTime: this.currentRow.requestTime,
        requestUsersName: this.currentRow.requestUsersName,
        submitterCause: this.currentRow.submitterCause
      }).then(res => {
        this.groupNoticeDialog = false;
        this.initTodoList();
        this.$message({
          type: "success",
          message: "确认成功！"
        });
      })
    },
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 7) {
        return "background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em";
      } else {
        return "";
      }
    },
    setSearchData(val) {
      let { auditTypeCode, time, submitDept, submitPeople } = val;
      let startTime = time[0];
      let endTime = time[1];
      this.auditSimpleDto = {
        auditTypeCode,
        submitDeptId: submitDept.id,
        submitId: submitPeople.id,
        startTime,
        endTime
      };
      console.log(val);
      console.log(this.auditSimpleDto);
    },
    setPageInfo(res) {
      this.tableData = res.data.list;
      this.totalCount = res.data.totalCount;
      this.pageSize = res.data.pageSize;
      this.currPageCache = res.data.currPage;
    },
    // 查询待办列表
    initTodoList: debounce(function() {
      this.loading = true;
      getTodoList({
        auditSimpleDto: this.auditSimpleDto,
        limit: "10",
        page: this.currPage.toString()
      }).then(
        res => {
          console.log("待办", res);
          this.loading = false;
          this.setPageInfo(res);
        },
        err => {
          this.loading = false;
          console.log(err);
        }
      );
    },2000),
    // 查询已办列表
    initDoneList: debounce(function() {
      this.loading = true;
      getDoneList({
        auditSimpleDto: this.auditSimpleDto,
        limit: "10",
        page: this.currPage.toString()
      }).then(
        res => {
          this.loading = false;
          this.setPageInfo(res);
        },
        err => {
          this.loading = false;
          console.log(err);
        }
      );
    },2000),
    getNewPageList() {
      this.loading = true;
       sessionStorage.setItem("myTaskCurrPage", this.currPage);
      if (this.realPath === "done") {
        this.initDoneList();
      } else {
        this.initTodoList();
      }
     
    },
    toDetail(item) {
      this.$emit("showCheck", item, true);
    },
    handle(item) {
      this.$emit("showCheck", item, false);
    },
    indexMethod(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1;
    }
  },
  watch: {
    $route(to, from) {
      this.loading = true
      console.log(to, from)
      // this.tableData = [];
      this.totalCount = 0;
      this.currPage = 1;
      this.auditSimpleDto = {};
      this.searchList.forEach(item => {
        item.value =
          item.value instanceof Array
            ? []
            : item.value instanceof Object
            ? {}
            : "";
      });
      if (to.path === "/doneTask") {
        this.realPath = "done";
        this.initDoneList();
      } else {
        this.realPath = "todo";
        this.initTodoList();
      }
    },
    //搜索
    auditSimpleDto: {
      handler: function(val, oldVal) {
        if (this.realPath === "done") {
          this.initDoneList();
        } else {
          this.initTodoList();
        }
      },
      deep: true
    },
  },
  created() {

    if (sessionStorage.getItem("myTaskCurrPage")) {
      this.currPage = Number(sessionStorage.getItem("myTaskCurrPage"));
    }
    this.realPath = this.path;
    if (this.path === "done") {
      this.initDoneList();
    } else {
      this.initTodoList();
    }
  },
  // beforeDestroy() {
  //   sessionStorage.setItem("myTaskCurrPage", 1);
  // }
};
</script>

<style lang="less" scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}
.el-table {
  border-radius: 0px;
  /deep/ .header {
    height: 50px;
    th {
      border-right: 1px solid #e0e0e0;
    }
  }
  /deep/ .tbody {
    .el-table__row {
      height: 37px;
    }
  }
}
.table-zone {
  margin: 8px;
  padding: 18px;
  background-color: #ffffff;
  border-radius: 10px;
}
.groupNoticeDialog {
  padding: 0 20px;
}
.dialog-footer {
  text-align: right;
  padding: 10px 10px 10px 0;
  border-top: 1px solid #E0E0E0;
}
</style>