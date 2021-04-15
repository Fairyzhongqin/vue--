<template>
  <div class="check-node-container">
    <div class="check-node-num">{{indexShow + 1}}</div>
    <div class="check-node-content" v-show="!nodeData.isMyTips">
      <div class="check-type">检查项目类别：{{nodeData.discretionTypeName}}</div>
      <div class="check-content">
        <node-item
          :nodeText="nodeData.label?nodeData.label:nodeData.checkContent"
          nodeType="parent"
          :hasChild="nodeData.hasBussinessRule==='1'"
          :node="nodeData"
          @editNode="editNode"
          @deleteNode="deleteNode"
          :view="view"
          v-bind="$attrs"
          v-on="$listeners"
        ></node-item>

        <template v-for="(nodeChild, index) in nodeData.children">
          <node-item
            class="check-child"
            :nodeText="nodeChild.rules?nodeChild.rules:nodeChild.checkContent"
            :key="index"
            :index="index"
            nodeType="child"
            :hasChild="false"
            :node="nodeChild"
            @editNode="editNode"
            @deleteNode="deleteNode"
            :view="view"
          ></node-item>
        </template>
      </div>
    </div>
    <div v-show="nodeData.isMyTips" class="check-node-content">
      <div v-show="nodeData.isMyTips" class="check-type">
        检查项目类别：
        <sn-select
          class="select"
          v-model="nodeData.discretionTypeCode"
          :data-url="'/aj/sys/sysdict/list'"
          :requertData="{type: 'free_court'}"
          :immediate="true"
          style="margin-top: -3px"
          placeholder="请选择检查项目类别"
        ></sn-select>
      </div>
      <div class="my-check-content">
        检查内容:
        <div class="my-check-del-button">
          <el-input type="textarea" v-model="nodeData.label" :autosize="{minRows: 1}"></el-input>
          <el-button type="text" @click="delMyTips">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nodeItem from "./nodeItem";
import snSelect from "@/components/snSelect";

export default {
  props: {
    nodeData: {
      default: {
        discretionId: "1001",
        discretionTypeCode: "fl006",
        tradeCode: "d01",
        lawCode: "fl001",
        examineContent: "测试检查内容信息",
        unlawfulAct: "违法信息",
        lawProvisionRule: "相关的内容规则细腻在",
        lawProvisionsContent: "数据库的咖啡121暗黑法师开始",
        penalizeBasisRule: null,
        penalizeBasisContent: null,
        hasLevel: "0",
        hasBussinessRule: "1",
        superviseItemCode: null,
        orderNum: "1",
        children: [
          {
            discretionRulesId: "1",
            discretionId: "1001",
            rules: "问问",
            violateRules: "121"
          },
          {
            discretionRulesId: "2",
            discretionId: "1001",
            rules: "2饿4312",
            violateRules: "413"
          }
        ]
      }
    },
    indexShow: {
      type: [String, Number]
    },
    view: {
      // true为仅查看 仅查看则隐藏按钮
      type: Boolean,
      default: false
    }
  },
  components: {
    nodeItem,
    snSelect
  },
  data() {
    return {
      circleNumber: [
        "①",
        "②",
        "③",
        "④",
        "⑤",
        "⑥",
        "⑦",
        "⑧",
        "⑨",
        "⑩",
        "⑪",
        "⑫",
        "⑬",
        "⑭",
        "⑮",
        "⑯",
        "⑰",
        "⑱",
        "⑲",
        "⑳"
      ]
    };
  },
  methods: {
    editNode(val, content) {
      // 修改节点
      this.$emit("editNodeHandle", val, content);
    },
    deleteNode(val) {
      // 删除节点
      this.$emit("delNodeHandle", val);
    },
    delMyTips() {
      let obj = {
        item: this.nodeData,
        sonIndex: null,
        fatherIndex: this.indexShow
      };
      this.$emit("delNodeHandle", obj);
    }
  }
};
</script>

<style lang="less" scoped>
.check-node-container {
  display: flex;
  flex-direction: row;
  .check-node-num {
    width: 60px;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
  }
  .check-node-content {
    width: 100%;
    padding: 15px 10px 5px 10px;
    border-bottom: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    .check-type {
      font-size: 14px;
      color: #666666;
      height: 22px;
      line-height: 22px;
    }
    .check-content {
      font-size: 16px;
      color: #404040;
      font-weight: 600;
      .check-child {
        padding-left: 78px;
        .el-button {
          margin-left: 10px;
        }
      }
    }
    .my-check-content {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      line-height: 30px;
      font-size: 16px;
      color: #404040;
      font-weight: 600;
      .my-check-del-button {
        display: flex;
        justify-content: space-between;
        width: 90%;
        .el-textarea {
          margin-left: 35px;
          width: 85%;
        }
      }
    }
  }
}
</style>
