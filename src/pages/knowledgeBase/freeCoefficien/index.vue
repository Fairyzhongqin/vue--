<template>
  <div class="body">
    <div
      class="addAndEditWrap"
      v-if="this.$store.state.addFreeInfoStatus === false && this.$store.state.editFreeInfoStatus === false"
    >
      <div class="body-content">
        <!--  v-if="$route.fullPath === '/freeCoefficien'" -->
        <div style="margin-bottom:10px;">
          <el-button type="primary" @click="addInfo" class="check_button">
            <span>新增自由裁量系数</span>
          </el-button>
        </div>
        <el-table
          :data="tableData"
          border
          fit
          header-row-class-name="table_header"
          :header-cell-style="getCellClass"
          :row-class-name="getRowClass"
          ref="tableData"
          @current-change="handleCurrentChange"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号" width="70" :index="indexMethod" align="center"></el-table-column>
          <el-table-column prop="effectNum" label="影响值" align="center" width="100" show-overflow-tooltip />
          <el-table-column label="类型" width="120" show-overflow-tooltip>
            <template
              slot-scope="scope"
            >{{ scope.row.type === "1"?"从重处罚":scope.row.type === "2" ? "事前态度因子":"事故态度因子" }}</template>
          </el-table-column>
          <el-table-column prop="remark" label="描述" show-overflow-tooltip />
          <!-- action button -->
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div>
                <el-button class="shortBtn" type="primary" @click="editInfo(scope.$index, scope.row)">修改</el-button>
                <el-button class="shortBtn" type="danger" plain @click="deleteInfo(scope.$index, scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :total="totalCount"
            :current-page="Number(currPage)"
            :page-size="Number(pageSize)"
            @current-change="pagiChange($event, 'curr')"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
      <!-- <router-view></router-view> -->
    </div>
    <div class="addWrap" v-if="this.$store.state.addFreeInfoStatus === true">
      <AddFreeCoefficien />
    </div>
    <div class="editWrap" v-if="this.$store.state.editFreeInfoStatus === true">
      <EditFreeCoefficien />
    </div>
  </div>
</template>
<script>
import {
  getCoefficientOfDiscretionData,
  deleteData
} from "@/api/knowledgeBase/coefficientOfDiscretion.js";
import AddFreeCoefficien from "./compomnents/AddFreeCoefficien";
import EditFreeCoefficien from "./compomnents/EditFreeCoefficien";
import { mapState } from "vuex";
export default {
  name: "freeCoefficien",
  components: {
    AddFreeCoefficien,
    EditFreeCoefficien
  },
  data() {
    return {
      tableData: [],
      totalCount: 0,
      currPage: "1", //页数
      pageSize: "10",
      formLabelWidth: "120px",
      sendToEditCoefficienData: null,
      // edit dialog
      dialogEdit: false,
      dialogEditForm: {
        effectNum: null,
        radio: "1",
        remark: "",
        id: null
      },
      dialogEditRules: {
        effectNum: [{ required: true, message: "影响值不能为空" }],
        radio: [{ required: true, message: "请选择类型", trigger: "change" }],
        remark: [{ required: true, message: "请填写描述", trigger: "change" }]
      },
      loading: true
    };
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 4) {
        return "background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em";
      } else {
        return "";
      }
    },
    // pagenation
    pagiChange(e, type) {
      if (type === "curr") {
        this.currPage = e + "";
        this.getData();
        this.loading = true
      }
    },
    // indexMethod
    indexMethod(index) {
      return index + 1 + (this.currPage - 1) * this.pageSize;
    },
    getData() {
      getCoefficientOfDiscretionData({
        isPaging: "true",
        limit: this.pageSize,
        page: this.currPage,
        type: ""
      })
        .then(res => {
          if (res.code === "0") {
            this.tableData = res.data.list;
            this.loading = false;
            this.totalCount = Number(res.data.totalCount);
          }
        })
        .catch(error => {
          throw new Error(error);
        });
    },
    addInfo() {
      // this.$router.push("/addFreeCoefficien");
      this.$store.commit("changeFreeAddStatus", true);
    },
    // edit
    editInfo(index, row) {
      this.sendToEditCoefficienData = row;
      console.log(this.sendToEditCoefficienData);
      sessionStorage.setItem(
        "editFreeCoefficienData",
        JSON.stringify(this.sendToEditCoefficienData)
      );
      // this.$router.push("/editFreeCoefficien");
      this.$store.commit("changeFreeEditStatus", true);
    },
    // delete
    deleteInfo(index, row) {
      this.dialogEditForm.id = row.id;
      this.$confirm("此操作将永久删除该自由裁量系数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      }).then(() => {
        deleteData({
          id: this.dialogEditForm.id
        })
          .then(res => {
            if (res.code === "0") {
              this.$message.success("删除成功");
              this.getData();
              // hack 删除时 本页恰好无数据且显示暂无数据问题 强制跳到首页
              if (this.totalCount === this.currPage * this.pageSize - 9) {
                this.currPage = "1";
                this.getData();
              }
            } else {
              this.$message.error("删除失败");
            }
          }) // eslint-disable-next-line handle-callback-err
          .catch(error => {
            this.$message.error("网络错误");
          });
      });
    },
    handleCurrentChange(val) {
      this.currentRow = val;

    },
    // 给间隔行设置样式
    getRowClass({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "strip_row";
      }
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    $route(to, from) {
      // be forced to turn the currpage to the first page
      if (to.path === "/freeCoefficien") {
        this.currPage = "1";
        this.getData();
      }
    },
    addFreeInfoStatus: {
      handler: function(val, oldVal) {
        if (val === false && oldVal === true) {
          this.getData();
        }
      },
      deep: true
    },
    editFreeInfoStatus: {
      handler: function(val, oldVal) {
        if (val === false && oldVal === true) {
          this.getData();
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(["addFreeInfoStatus", "editFreeInfoStatus"])
  }
};
</script>
<style lang="less" scoped>
.body {
  // padding: 8px 8px 0;
  .body-content {
    margin: 8px;
    .check_button {
      padding: 9px 15px;
      width: 148px;
      margin-bottom: 6px;
    }
    background: #ffffff;
    padding: 16px 16px 0;
    border-radius: 8px;
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
    }
    /deep/ .is-leaf {
      background: #e3eef6;
    }
    .pagination {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding: 10px;
      .el-pagination {
        position: none;
      }
      /deep/.el-input {
        border: none;
      }
    }
    /deep/.el-table--border th {
      border-right: 1px solid #e0e0e0;
    }
    /deep/.el-button + .el-button {
      margin-left: 0;
    }
  }
  // hack  active css after delete
  .el-button--danger:active,
  .el-button--danger:focus {
    background: #fef0f0;
    color: #dd6161;
    border-color: #fbc4c4;
  }
}
.el-table__body .cell .shortBtn {
  width: 40px;
  height: 24px;
  font-size: 14px;
  padding: 7px 2px !important;
}
</style>
