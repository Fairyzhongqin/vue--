<template>
  <div>
    <div class="body">
      <el-button type="primary" @click="addDepart">新增部门</el-button>
      <el-table
        height="385"
        v-loading="loading"
        class="formTable"
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :header-cell-style="getCellClass"
        :tree-props="{children: 'child'}"  
      >
        <el-table-column prop="name" label="部门名称" min-width="280" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentName" label="上级部门" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderNum" label="排序号" min-width="80" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="level" label="级别" min-width="80" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="code" label="部门编号" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              class="shortBut"
              @click="updateDepartment(scope.row)"
            >修改</el-button>
            <el-button
              class="shortBut"
              type="danger"
              plain
              @click="deleteAdmin(scope.row.id)"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="copyright">Copyright © 2019 All Rights Reserved</div>
  </div>
</template>
<script>
import {
  departmentTree,
  deleteDepartment
} from "@/api/systemManagement/departmentManagement/index";
export default {
  data() {
    return {
      tableData: [],
      loading: true
    };
  },
  methods: {
    // 给表头设置单独样式
    getCellClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 5) {
        return "background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em"
      } else {
        return ''
      }
    },
    //新增部门
    addDepart() {
      this.$store.commit("setAdd", { flag: "addFlag" });
      this.$store.commit("setDepartment");
    },
    //修改部门
    updateDepartment(data) {
      this.$store.commit("setUpdata", { id: data.id, flag: "updataFlag" });
      this.$store.commit("setDepartment");
    },
    //展示部门列表
    getDepartmentTree() {
      departmentTree()
        .then(res => {
          console.log(res);
          this.tableData = res.data;
          if (this.tableData) {
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除部门
    deleteAdmin(id) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handleDeleteDepartment(id);
        })
        .catch(() => {});
    },
    handleDeleteDepartment(id) {
      deleteDepartment({ id: id })
        .then(res => {
          this.$message({
            type: "success",
            message: "刪除成功！"
          });
          this.getDepartmentTree();
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "删除失败!"
          });
        });
    }
  },
  created() {
    this.getDepartmentTree();
  }
};
</script>

<style lang="less" scoped>
.body {
  margin: 8px 8px 0;
  padding: 16px 16px 8px 16px;
  background: #fff;
  border-radius: 8px;
  height: 450px;
}
/deep/.el-table {
  border-radius: 0px;
}
/deep/.el-table--border {
  border: 0px;
}
.formTable {
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 400px;
  .el-table /deep/ tr.headerclass {
    height: 50px !important;
    font-weight: bold;
    color: rgba(34, 34, 34, 1);
    font-size: 16px;
    font-family: PingFang SC;
  }
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
/deep/.el-table::before {
  width: 0px;
}
/deep/.el-table--border th {
  border-right: 1px solid #e0e0e0;
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