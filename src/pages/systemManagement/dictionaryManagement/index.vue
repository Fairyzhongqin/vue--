<template>
  <div class="dictionaryManagement">
    <div
      class="dictionaryWrap"
      v-if="this.$store.state.addDicInfoStatus === false && this.$store.state.editDicInfoStatus === false"
    >
      <div v-if="!isDataList ">
        <!-- && $route.fullPath === '/dictionaryManagement' -->
        <search-bar :searchList="searchList" @searchTrigger="setSearchData"></search-bar>
      </div>
      <div class="main">
        <!--  v-if="$route.fullPath === '/dictionaryManagement'" -->
        <el-button type="primary" @click="addDictionaryInfo">新增</el-button>
        <el-table
          :data="dictionaryList"
          border
          fit
          v-loading="loading"
          header-row-class-name="table_header"
          :row-class-name="getRowClass"
          :header-cell-style="getCellClass"
        >
          <el-table-column type="index" width="70" label="序号" :index="indexMethod" align="center"></el-table-column>
          <el-table-column prop="name" label="字典名称" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="type" label="字典类型" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="code" label="字典码" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="value" label="字典值" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="orderNum" label="排序" align="center" show-overflow-tooltip />
          <el-table-column prop="remark" label="注释" align="center" show-overflow-tooltip />
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="editInfo(scope.$index, scope.row)"
                size="mini"
                class="shortBut"
              >修改</el-button>
              <el-button
                type="danger"
                plain
                @click="deleteInfo(scope.$index, scope.row)"
                size="mini"
                class="shortBut"
              >删除</el-button>
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
    <div class="addWrap" v-if="this.$store.state.addDicInfoStatus === true">
      <AddDictionary></AddDictionary>
    </div>
    <div class="editWrap" v-if="this.$store.state.editDicInfoStatus === true">
      <EditDictionary></EditDictionary>
    </div>
  </div>
</template>
<script>
import {
  getDictionaryData,
  deleteDictionaryData,
  getDictionaryType
} from "@/api/systemManagement/dictionaryManagement/index.js";
import { mapState } from "vuex";
import searchBar from "@components/searchBar";
import AddDictionary from "./components/AddDictionaryInfo";
import EditDictionary from "./components/EditDictionaryInfo";

export default {
  name: "dictionaryManagement",
  components: {
    searchBar,
    AddDictionary,
    EditDictionary
  },
  data() {
    return {
      dictionaryList: [],
      currPage: "1",
      pageSize: "10",
      totalCount: 0,
      loading: true,
      sendToEditData: null,
      // search Data
      searchList: [
        {
          name: "字典名称",
          codeName: "name",
          type: "text",
          value: ""
        },
        {
          name: "字典值",
          codeName: "value",
          type: "text",
          value: ""
        }
      ],
      searchData: {},
      // deleteId
      deleteId: ""
    };
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 7) {
        return "background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em";
      } else {
        return "";
      }
    },
    // indexMethod
    indexMethod(index) {
      return index + 1 + (this.currPage - 1) * this.pageSize;
    },
    getList() {
      getDictionaryData({
        isPaging: "true",
        limit: this.pageSize,
        page: this.currPage,
        ...this.searchData
      })
        .then(res => {
          if (res.code === "0") {
            this.dictionaryList = res.page.list;
            this.loading = false;
            this.totalCount = Number(res.page.totalCount);
          }
        })
        .catch(error => {
          console.info(error);
        });
    },
    addDictionaryInfo() {
      // this.$router.push("/addDictionaryInfo");
      this.$store.commit("changeDicAddStatus", true);
    },
    editInfo(index, row) {
      console.log(row);
      this.sendToEditData = row;
      // console.log("要传的数据", this.sendToEditData);
      sessionStorage.setItem(
        "sendToEditData",
        JSON.stringify(this.sendToEditData)
      );
      // this.$router.push("/editDictionaryInfo");
      this.$store.commit("changeDicEditStatus", true);
    },
    deleteInfo(index, row) {
      this.deleteId = row.id;
      this.$confirm("此操作将永久删除该字典数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      }).then(() => {
        deleteDictionaryData({
          id: this.deleteId,
          delFlag: "-1"
        })
          .then(res => {
            if (res.code === "0") {
              this.$message.success("删除成功");
              this.getList();
              // hack 删除时 本页恰好无数据且显示暂无数据问题 强制跳到首页
              if (this.totalCount === this.currPage * this.pageSize - 9) {
                this.currPage = "1";
                this.getList();
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
    handlePagesChange(e, type) {
      if (type === "curr") {
        this.currPage = e + "";
        this.getList();
        this.loading = true
      }
    },
    // search data
    setSearchData(val) {
      this.searchData = val;
      console.info("1", val);
    },
    getType() {
      return this.searchList[1].default.map(item => {
        return item;
      });
    },
    // 给间隔行设置样式
    getRowClass({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "strip_row";
      }
    }
  },
  created() {},
  mounted() {
    this.getList();
  },
  computed: {
    ...mapState(["isDataList", "addDicInfoStatus", "editDicInfoStatus"])
  },

  destroyed() {},
  watch: {
    $route(to, from) {
      // to , from 分别表示从哪跳转到哪，都是一个对象
      // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
      // if (
      //   from.path === "/addDictionaryInfo" ||
      //   from.path === "/editDictionaryInfo"
      // ) {
      //   this.getList();
      // }
      // be forced to turn the currpage to the first page
      if (to.path === "/dictionaryManagement") {
        this.currPage = "1";
        this.getList();
      }
    },
    searchData: {
      handler: function(val, oldVal) {
        this.getList();
      },
      deep: true
    },
    addDicInfoStatus: {
      handler: function(val, oldVal) {
        if (val === false && oldVal === true) {
          this.getList();
        }
      },
      deep: true
    },
    editDicInfoStatus: {
      handler: function(val, oldVal) {
        if (val === false && oldVal === true) {
          this.getList();
        }
      },
      deep: true
    }
  }
};
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
  .el-button--danger:active,
  .el-button--danger:focus {
    background: #fef0f0;
    color: #dd6161;
    border-color: #fbc4c4;
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
  /deep/ thead {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(34, 34, 34, 1);
  }
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
  .el-pagination {
    position: none;
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
</style>