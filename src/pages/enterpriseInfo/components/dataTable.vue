<template>
  <div class="body">
    <div class="body-content">
      <el-row type="flex" justify="space-between">
        <el-button type="primary" @click="addOrModify('add')">新增企业</el-button>
        <div class="external-link">
          <span>附链接：</span>
          <a
            href="http://www.jsgsj.gov.cn:58888/ecipplatform/login.jsp"
            target="_blank"
          >国家企业信用信息公示系统（江苏）</a>
        </div>
      </el-row>
      <el-table
        :data="tableData"
        border
        fit
        v-loading="loading"
        style="width: 100%"
        row-class-name="lineheight"
        header-row-class-name="headerclass"
        :header-cell-style="getCellClass"
        stripe
        highlight-current-row
      >
        <el-table-column prop="num" label="序号" width="70" show-overflow-tooltip align="center"></el-table-column>

        <el-table-column label="企业名称" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.companyName">{{scope.row.companyName}}</span>
            <span v-if="scope.row.companyName == null">-</span>
          </template>
        </el-table-column>
        <el-table-column label="监管行业类别" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.jgfl">{{scope.row.jgfl}}</span>
            <span v-if="scope.row.jgfl == null">-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="examineNum"
          show-overflow-tooltip
          label="历次检查记录"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">
            <span
              style="cursor: pointer; text-decoration: underline;color: dodgerblue"
              @click="previousRecords(scope.row)"
            >{{scope.row.examineNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="主要负责人" min-width="110" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.legalPerson">{{scope.row.legalPerson}}</span>
            <span v-if="scope.row.legalPerson == null">-</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" min-width="100" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.contactPhone">{{scope.row.contactPhone}}</span>
            <span v-if="scope.row.contactPhone == null">-</span>
          </template>
        </el-table-column>
        <el-table-column label="经营状态" min-width="85" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.companyOperationStatus">{{scope.row.companyOperationStatus}}</span>
            <span v-if="scope.row.companyOperationStatus == null">-</span>
          </template>
        </el-table-column>
        <el-table-column label="启用与否" min-width="85" align="center">
          <template slot-scope="scope">
            <div class="isenabled" :style="{'color':+ scope.row.isWork == 0?'#1cc19c':'#ff2525'}">
              <span
                class="point"
                :style="{'backgroundColor':+ scope.row.isWork == 0?'#1cc19c':'#ff2525'}"
              ></span>
              <span style="dis">{{scope.row.isWork == '0'?'已启用':'已停用'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              class="shortBut"
              @click="addOrModify('modify',scope.row)"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              class="shortBut"
              v-if="scope.row.isWork == 0"
              @click="updateState(scope.row)"
            >停用</el-button>
            <el-button
              type="success"
              plain
              size="mini"
              class="shortBut"
              v-else-if="scope.row.isWork == -1"
              @click="updateState(scope.row)"
            >启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-drawer
          v-loading="loading"
          :title="title"
          :destroy-on-close="true"
          :visible.sync="drawer"
          :direction="direction"
          size="100%"
        >
          <check-information :recordInfo="recordInfo"></check-information>
        </el-drawer>
      </div>
      <div class="pagination">
        <el-pagination
          :total="totalCount"
          :current-page.sync="currentPage"
          :page-size="10"
          @current-change="getNewList"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getlistOfsiteinspectionRecord,
  getExamineCheckRecord
} from "@api/ProcessingofInspectionResult/index.js";
import { getTableList, updateStateFunc } from "@api/enterpriseInfo/index";
import checkInformation from "@/pages/inspectionResultHandle/inspectionResult/previousRecords/components/checkInformation";
export default {
  name: "dataTable",
  components: {
    checkInformation
  },
  props: {
    searchData: {
      type: Object,
      default: {
        companyName: "",
        jgfl: "",
        isWork: ""
      }
    }
  },
  data() {
    return {
      companyName1: "",
      loading: false,
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      loading: true,
      drawer: false,
      direction: "btt",
      title: "",
      companyInfo: {},
      recordInfo: []
    };
  },
  watch: {
    // 监控搜索条件，调用查询接口
    searchData: {
      handler: function(val, oldVal) {
        this.getTableData(val);
      },
      deep: true
    }
  },
  created() {
    if (sessionStorage.getItem("enterpriseInfoCurrPage")) {
      this.currentPage = Number(
        sessionStorage.getItem("enterpriseInfoCurrPage")
      );
    }
    this.getTableData(this.searchData);
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
    //进入历次检查记录页面
    previousRecords(data) {
      console.log(data, "111111111111");
      this.drawer = true;
      this.title = data.companyName;
      this.InfoId = data.id;
      this.showGetExamineCheckRecord();
    },
    //历次检查记录展示
    showGetExamineCheckRecord() {
      this.loading = true;
      getExamineCheckRecord({ companyId: this.InfoId })
        .then(res => {
          console.log(res, "1111111111222222222");
          this.companyInfo = res.data.companyDto;
          this.recordInfo = res.data.examineDtoList;
          if (this.recordInfo) {
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateState({ id, isWork, num }) {
      console.log(id, num, "12233");
      isWork = isWork == 0 ? -1 : 0;
      updateStateFunc({
        id,
        isWork
      }).then(res => {
        this.tableData[num - 1].isWork = isWork;
      });
    },
    getTableData(val) {
      console.log(this.searchData, "987987");
      console.log(val, "val");
      this.loading = true;
      getTableList({
        ...val,
        page: String(this.currentPage),
        limit: "10"
      }).then(res => {
        this.loading = false;
        this.totalCount = res.page.totalCount;
        this.tableData = res.page.list;
        this.tableData.forEach((item, index) => {
          item.num = (this.currentPage - 1) * 10 + index + 1;
        });
      });
    },
    getNewList(val) {
      this.currentPage = val;
      this.getTableData(this.searchData);
      sessionStorage.setItem("enterpriseInfoCurrPage", this.currentPage);
    },
    addOrModify(type, row) {
      this.$store.commit("setNewRectificationShow");
      this.$store.commit("SET_KEEP_IN_ENTERPRISE", false);
      this.$emit("addOrModify", type, row);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.el-table .cell.el-tooltip {
  text-overflow: clip;
}
.body {
  padding: 8px 8px 0;
  .body-content {
    background: #ffffff;
    padding: 16px 16px 0;
    border-radius: 8px;
    /deep/ .el-table--border th {
      border-color: #e0e0e0;
    }
    .lineheight {
      height: 37px;
    }
    .el-table /deep/ thead {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
    }
    .el-table /deep/ tr.headerclass {
      height: 50px !important;
    }
    /deep/ .el-row {
      margin-bottom: 15px;
      .external-link {
        display: flex;
        align-items: center;
        a {
          width: 256px;
          height: 23px;
          line-height: 23px;
          font-size: 16px;
          font-weight: bold;
          text-decoration: underline;
          color: rgba(18, 115, 235, 1);
        }
      }
    }
    .el-table--border {
      border-radius: 8px;
    }
    /deep/.el-table {
      border-radius: 0px;
    }
    /deep/ .is-leaf {
      background: #e3eef6;
    }
    .isenabled {
      display: inline-block;
      line-height: 23px;
      padding-left: 5px;
      span {
        display: inline-block;
      }
    }
    /deep/.el-button + .el-button {
      margin: 0px;
    }
    .point {
      width: 5px;
      height: 5px;
      line-height: 23px;
      border-radius: 50%;
      background-color: inherit;
    }
    .pagination {
      display: flex;
      flex-direction: row-reverse;
      padding: 10px 0;
    }
  }
}
.shortBut {
  width: 40px;
  height: 24px;
  font-size: 14px;
  padding: 7px 3px !important;
}
/deep/.el-drawer__header {
  border-bottom: 1px solid #ccc;
  padding: 10px 15px;
  margin: 0px !important;
}
/deep/.el-drawer__body {
  overflow-y: auto;
  padding-top: 35px;
  padding-left: 15px;
}
</style>
