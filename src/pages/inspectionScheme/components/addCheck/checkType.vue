<template>
  <el-row class="retrieval-container">
    <el-col :span="8" v-if="queryType !== 3" class="sort-container">
      <el-tree
        :data="data"
        :props="defaultProps"
        node-key="id"
        :default-expand-all="true"
        @node-click="sortNodeClick"
      ></el-tree>
    </el-col>
    <el-col :span="queryType !== 3?15:24" class="detail-container" v-loading="loading">
      <detail-tree
        @showDetail="showDetail"
        v-bind="$attrs"
        v-on="$listeners"
        :data="detailData"
        :type="type === 'illegal'"
        :cancel="queryType===3?true:false"
        ref="detailTree"
        @refresh="getDetailList"
      ></detail-tree>
    </el-col>
    <el-pagination
      :page-size="10"
      :pager-count="7"
      layout="prev, pager, next"
      :total="totalNum"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <el-dialog
      width="30%"
      title="详情"
      :visible.sync="innerVisible"
      append-to-body
      class="detail-dialog"
    >{{lawDetail}}</el-dialog>
  </el-row>
</template>

<script>
import detailTree from "../../components/detailTree";
import { discretionList, listDiscByType } from "@/api/inspectionScheme";

export default {
  components: {
    detailTree
  },
  props: {
    typeSelect: String,
    searchValue: String,
    law: [Object, String],
    type: String // 展示违法行为或检查内容
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      detailData: [],
      currentPage: 1,
      queryType: 0, // 查询类型 0-按监管行业分类 1-按专项检查分类 2-按自由裁量分类 3-常用检查项，不传默认0
      treeId: "", // 查询id(左侧树节点)
      innerVisible: false, // 详情弹框
      lawDetail: "",
      totalNum: 0,
      loading: false
    };
  },
  watch: {
    typeSelect: {
      handler(newVal, oldVal) {
        this.treeId = "";
        this.currentPage = 1;
        let dataList = {};
        switch (newVal) {
          case "按监管行业分类":
            this.queryType = 0;
            dataList = {
              type: "discretion_class"
            };
            break;
          case "按专项检查分类":
            this.queryType = 1;
            break;
          case "按自由裁量分类":
            this.queryType = 2;
            dataList = {
              type: "free_court"
            };
            break;
          case "常用检查项":
            this.queryType = 3;
            break;
        }
        if (this.queryType !== 3) {
          discretionList(dataList).then(res => {
            const newTeam = function(data, parentId) {
              const itemArr = [];
              for (let i = 0; i < data.length; i++) {
                const node = data[i];
                if (node.parentId === parentId) {
                  const newNode = {};
                  newNode.labelID = node.code;
                  newNode.label = node.value;
                  newNode.parentId = node.parentId;
                  newNode.children = newTeam(data, node.code);
                  itemArr.push(newNode);
                }
              }
              return itemArr;
            };
            this.data = newTeam(res.page.list, "0"); // json数据递归成树结构
          });
        }
        this.getDetailList();
      },
      immediate: true
    }
  },
  mounted() {
    this.getDetailList();
  },
  methods: {
    sortNodeClick(val) {
      this.treeId = val.labelID;
      this.getDetailList();
    },
    showDetail(val) {
      this.innerVisible = !this.innerVisible;
      this.lawDetail = val.lawProvisionsContent;
    },
    getDetailList() {
      const requestData = {
        page: this.currentPage.toString(),
        queryType: this.queryType.toString(),
        treeId: this.treeId.toString()
      };
      requestData.lawId = this.law !== "" ? this.law : "";
      requestData.content = this.searchValue !== "" ? this.searchValue : "";
      this.detailData = [];
      this.loading = true; // 加载框显示
      listDiscByType(requestData).then(res => {
        this.detailData = res.data.list.map(r => {
          r.label = this.type === "illegal" ? r.unlawfulAct : r.examineContent;
          r.labelID = r.discretionId;
          if (r.children && r.children.length !== 0) {
            r.children.map(d => {
              d.label = this.type === "illegal" ? d.violateRules : d.rules;
              d.labelID = d.discretionRulesId;
            });
          }
          return r;
        });
        this.totalNum = res.data.totalCount;
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDetailList();
    }
  }
};
</script>

<style lang="less" scoped>
.retrieval-container {
  height: 392px;
  margin-top: 5px;
  .sort-container {
    background-color: #eef5f9;
    overflow: auto;
    height: 100%;
  }
  .detail-container {
    width: 66.5%;
    height: 361px;
    overflow: auto;
    // /deep/ .el-checkbox {
    //   left: 25px;
    // }
  }

  // .detail-tree {
  //   // margin-bottom: 32px;
  // }
  .el-pagination {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
.detail-dialog {
  .el-dialog__body {
    padding: 15px;
  }
}
/deep/.el-col-15 {
  width: 66.5%;
}
</style>
