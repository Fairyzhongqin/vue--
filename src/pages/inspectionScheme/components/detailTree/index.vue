<template>
  <div class="detail-tree">
    <el-tree
      :data="data"
      show-checkbox
      :default-expand-all="true"
      node-key="labelID"
      :indent="10"
      ref="tree"
      highlight-current
      :expand-on-click-node="true"
      :props="defaultProps"
      :default-checked-keys="defaultChecked"
      @check="check"
      @check-change="checkChange"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span class="button-bar" v-if="node.level === 1">
          <el-button type="text" @click="() => showDetail(data)">详情</el-button>
          <el-button
            type="text"
            v-if="!cancel && !type"
            style="color:#1CC19C"
            @click="() => setUsual(node, data)"
          >设为常用检查项</el-button>
          <el-button
            type="text"
            v-if="cancel"
            style="color:#1CC19C"
            @click="() => cancelUsual(node, data)"
          >取消常用检查项</el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import {
  discretioncustomSave,
  discretioncustomDelete
} from "@/api/inspectionScheme";

export default {
  props: {
    data: Array,
    checkListCache: Array,
    cancel: {
      // 是否为取消常用检查项
      type: Boolean,
      default: false
    },
    type: { // 是否来自违法行为
      type: Boolean
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultChecked: []
    };
  },
  watch: {
    checkListCache: {
      handler: function(newVal, oldVal) {
        let children = [];
        this.defaultChecked = [];
        setTimeout(() => { // 给监听一点时间，否则用的就是最初的值，就无法取消选中了
          if (this.checkListCache && this.checkListCache.length > 0) {
            this.checkListCache.map(res => {
              if (res.discretionRulesId || res.discRulesId) {
                // 子项
                this.defaultChecked.push(res.labelID);
              } else if (
                (res.children && res.children.length === 0) ||
                res.hasBussinessRule === "0" || !res.discRulesId
              ) {
                // 无子项的父项
                this.defaultChecked.push(res.labelID);
              }
            });
          }
        });
      },
      immediate: true
    }
  },
  methods: {
    showDetail(data) {
      this.$emit("showDetail", data);
    },
    setUsual(node, data) {
      discretioncustomSave({
        discretionId: data.discretionId,
        hasBussinessRule: data.hasBussinessRule,
        ruleIds: data.children
          ? data.children
              .map(r => {
                return r.discretionRulesId;
              })
              .join(",")
          : "",
        ruleNum: data.children ? data.children.length : 0
      }).then(res => {
        if (res.code === "0") {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: "添加失败",
            type: "error"
          });
        }
      });
    },
    cancelUsual(node, data) {
      discretioncustomDelete({
        discretionCustomId: data.discretionId
      }).then(res => {
        if (res.code === "0") {
          this.$message({
            showClose: true,
            message: "取消成功",
            type: "success"
          });
          this.$emit("refresh");
        } else {
          this.$message({
            showClose: true,
            message: "取消失败",
            type: "error"
          });
        }
      });
    },
    check(val1, val2) {
      // 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
      this.$emit("checkDetail", val2);
    },
    checkChange(val1, val2, val3) {
      // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
      const nodeData = { node: val1, status: val2, pstatus: val3 };
      // this.$store.commit('setInspectionCheckListCache', nodeData)
      this.$emit("detailNodeClick", nodeData);
    }
  },
  mounted() {
    // console.log("detailTree里的checkListCache",this.checkListCache)
  }
};
</script>

<style lang="less">
.detail-tree {
  height: 350px;
  padding: 5px 5px;
  .el-tree-node {
    .el-tree-node__content {
      height: auto;
      position: relative;
      padding: 8px 0;
      .el-checkbox {
        position: absolute;
        left: 18px;
        top: 10px;
        .el-checkbox__inner {
          border: 1px solid #828282;
        }
      }
      .el-tree-node__expand-icon {
        padding: 0;
        font-size: 20px;
      }
      .custom-tree-node {
        white-space: normal;
        font-size: 15px;
        font-weight: bold;
        padding-left: 26px;
        width: 100%;
        .button-bar {
          float: right;
          .el-button {
            padding: 0;
          }
        }
      }
    }
    .el-tree-node__children {
      .custom-tree-node {
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
}
</style>
