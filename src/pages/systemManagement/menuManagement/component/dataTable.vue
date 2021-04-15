<template>
  <div>
    <div class="body">
      <el-button type="primary" @click="addMenu">新增菜单</el-button>
      <el-table
        height="405"
        fixed
        class="formTable"
        :data="tableData"
        v-loading="loading"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :header-cell-style="getCellClass"
        :tree-props="{children: 'child'}"
      >
        <el-table-column prop="name" label="菜单名称" min-width="200" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="parentName" label="上级菜单" min-width="100" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="icon" label="图标" min-width="100" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="type" label="类型" min-width="100" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0" class="start">目录</span>
            <span v-if="scope.row.type == 1" class="stop">菜单</span>
            <span v-if="scope.row.type == 2" class="start">按钮</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序号" min-width="100" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="url" label="菜单URL" min-width="120" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="perms" label="授权标识" min-width="100" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="shortBut" @click="updateMenu(scope.row)">修改</el-button>
            <el-button
              type="danger"
              plain
              @click="deleteMenu(scope.row.id)"
              size="mini"
              class="shortBut"
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
  menuTree,
  deleteMenu
} from "@/api/systemManagement/menuManagement/index";
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      loading: true
    };
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 7) {
        return "background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em"
      } else {
        return "";
      }
    },
    //新增
    addMenu() {
      this.$store.commit("setAdd", { flag: "addFlag" });
      this.$store.commit("setMenu");
    },
    //修改
    updateMenu(data) {
      this.$store.commit("setUpdata", { id: data.id, flag: "updataFlag" });
      this.$store.commit("setMenu");
    },
    //删除
    deleteMenu(id) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getDeleteMenu(id);
        })
        .catch(() => {
        });
    },
    getDeleteMenu(id) {
      deleteMenu({ id: id })
        .then(res => {
          this.$message({
            type: "success",
            message: "刪除成功！"
          });
          this.showMenuTree();
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "删除失败!"
          });
        });
    },
    //展示菜单列表
    showMenuTree() {
      menuTree()
        .then(res => {
          console.log("geiwo ceshi de de ==>",res);
          this.tableData = res.data;
          if (this.tableData) {
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.showMenuTree();
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
.formTable {
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 400px;
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
