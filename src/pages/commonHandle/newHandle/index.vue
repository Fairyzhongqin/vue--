<template>
  <div>
    <div class="bar_wrapper">
      <section class="node_bar">
        <div>
          <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
        </div>
        <!-- <div class="benefit">
          <el-input placeholder="请输入执行到的流程节点" v-model="endNode" type="primary"></el-input>
          <el-button @click="startPro">开始(支持到案件调查报告)</el-button>
        </div>-->
        <div class="nodes_wrapper">
          <div
            class="flow-node"
            :key="index"
            v-for="(flowNode, index) of flowNodes"
            :class="[index<flowNodes.length-1 ? '' : 'last_node',flowNode.activated?'node_active':'']"
          >
            <div @click="nodeClick(flowNode, index)" class="node_img">
              <img :src="flowNode.activated?flowNode.img2:flowNode.img" class="flow-img" />
              <div
                class="flow-txt"
                :style="currNode === flowNode.name?'color:#0099FF':''"
              >{{flowNode.name}}</div>
            </div>
            <img
              class="flow-right"
              v-if="index<flowNodes.length-1"
              :src="flowNode.activated?require('@/assets/imgs/caseHandle/righta.png'):require('@/assets/imgs/caseHandle/right.png')"
            />
          </div>
        </div>
      </section>
      <section class="node_bar inde_nodes">
        <div
          class="flow-node"
          v-for="(indeNode, index) of independentNodes"
          :class="[index===0?'first_node':'', indeNode.activated?'node_active':'']"
          :key="index"
          @click="nodeClick(indeNode, index)"
        >
          <div class="node_img">
            <img :src="indeNode.activated?indeNode.img2:indeNode.img" class="flow-img" />
            <div
              class="flow-txt"
              :style="currNode === indeNode.name?'color:#0099FF':''"
            >{{indeNode.name}}</div>
          </div>
        </div>
      </section>
    </div>
    <sn-page-bar>
      <component :is="componentId" @initNodes="initStatus" ref="childEvent"></component>
    </sn-page-bar>
  </div>
</template>

<script>
// 后面可以注释掉这三个 import
import {
  kindleCaseProcess,
  getCurrentProcess
} from "@/api/filingRegister/index";
import { finishPro } from "@api/common";
import {debounce} from '../../../utils/util'
import { endGroupDiscussLazy } from "@api/lawExamine";

import snPageBar from "@/components/snPageBar/index";
import lianshenpi from "./lianshenpi";
import anjiandiaocha from "./anjiandiaocha";
import anjianshenli from "./anjianshenli";
import anjianyanqi from "./anjianyanqi/index";
import chufashishi from "./chufashishi/index"; //处罚决定
import xingzhengqiangzhi from "./xingzhengqiangzhi/index"; //行政强制
import anjianyison from "./anjianyison"; // 案件移送
import wenshusongda from "./wenshusongda/index"; //其它文书送达
import jieanguina from "./jieanguina/index";
import dianzijuanzong from "./dianzijuanzong/index"; // 电子卷宗
import jieanshenpi from "./jieanshenpi/index"; // 结案审批
import anjianzhongzhi from "./anjianzhongzhi/index"; // 案件终止
export default {
  name: "newHandle",
  components: {
    snPageBar,
    lianshenpi,
    anjiandiaocha,
    anjianshenli,
    anjianyanqi,
    chufashishi,
    xingzhengqiangzhi,
    anjianyison,
    wenshusongda,
    jieanguina,
    dianzijuanzong,
    jieanshenpi,
    anjianzhongzhi
  },
  data() {
    return {
      endNode: "", // 结束流程拼音大写
      input: "",
      checkContent: [],
      dialogVisible: false,
      componentId: "lianshenpi",
      flowNodes: [
        {
          activated: false,
          type: "LASP",
          name: "立案审批",
          componentId: "lianshenpi",
          img: require("@/assets/imgs/caseHandle/1.png"),
          img2: require("@/assets/imgs/caseHandle/1.png")
        },
        {
          activated: false,
          type: "AJDC",
          name: "案件调查",
          componentId: "anjiandiaocha",
          img: require("@/assets/imgs/caseHandle/2.png"),
          img2: require("@/assets/imgs/caseHandle/2a.png")
        },
        {
          activated: false,
          type: "AJSL",
          name: "案件审理",
          componentId: "anjianshenli",
          img: require("@/assets/imgs/caseHandle/3.png"),
          img2: require("@/assets/imgs/caseHandle/3a.png")
        },
        {
          activated: false,
          type: "CFJD",
          name: "处罚决定",
          componentId: "chufashishi",
          img: require("@/assets/imgs/caseHandle/4.png"),
          img2: require("@/assets/imgs/caseHandle/4a.png")
        },
        {
          activated: false,
          type: "JASP",
          name: "结案审批",
          componentId: "jieanshenpi",
          img: require("@/assets/imgs/caseHandle/9.png"),
          img2: require("@/assets/imgs/caseHandle/9a.png")
        }
      ],
      progressNow: 4,
      independentNodes: [
        {
          activated: false,
          type: "AJYQ",
          name: "案件延期",
          componentId: "anjianyanqi",
          img: require("@/assets/imgs/caseHandle/10.png"),
          img2: require("@/assets/imgs/caseHandle/10a.png")
        },
        {
          activated: false,
          type: "XZQZ",
          name: "行政强制",
          componentId: "xingzhengqiangzhi",
          img: require("@/assets/imgs/caseHandle/5.png"),
          img2: require("@/assets/imgs/caseHandle/5a.png")
        },
        {
          activated: false,
          type: "AJYS",
          name: "案件移送",
          componentId: "anjianyison",
          img: require("@/assets/imgs/caseHandle/6.png"),
          img2: require("@/assets/imgs/caseHandle/6a.png")
        },
        {
          activated: false,
          type: "AJZZ",
          name: "案件终止",
          componentId: "anjianzhongzhi",
          img: require("@/assets/imgs/caseHandle/11.png"),
          img2: require("@/assets/imgs/caseHandle/11a.png")
        },
        {
          activated: false,
          type: "DZJZ",
          name: "电子卷宗",
          componentId: "dianzijuanzong",
          img: require("@/assets/imgs/caseHandle/12.png"),
          img2: require("@/assets/imgs/caseHandle/12a.png")
        }
      ],
      currNode: "" // 页面当前显示节点
    };
  },
  created() {
    this.initStatus();
  },
  activated() {
    this.activatePro();
  },
  methods: {
    activatePro() {
      getCurrentProcess({
        businessKey: this.$store.state.penalty.penaltyUndEntity.penaltyId
      }).then(res => {
        this.$store.commit("setCurrProcesses", res.data);
        this.initStatus();
        this.$refs.childEvent.initInfo();
      });
    },
    initStatus() {
      let currProTypes = this.$store.state.processesTypes;
      let findIndex = 0;
      if (currProTypes[0] === "GAME OVER") {
        // 流程已走完
        findIndex = 4;
      } else if (currProTypes.length === 2) {
        // 流程在立案审批及案件调查处，默认展示立案审批节点
        findIndex = 0;
      } else {
        this.flowNodes.map((flow, index) => {
          // 找出 流程走到的最新大节点的索引值
          currProTypes.forEach(type => {
            if (type == flow.type) {
              findIndex = index;
            }
          });
        });
      }

      this.flowNodes.forEach((flow, index) => {
        // 设置 大节点 置亮/置灰, 案件调查节点一直亮
        if (index <= findIndex || index === 1) {
          if (index === findIndex) {
            // 页面为当前大节点的组件
            this.componentId = flow.componentId;
            this.currNode = flow.name;
          }
          flow.activated = true;
        } else {
          flow.activated = false;
        }
        // flow.activated = true // 记得一定要删掉这行
      });

      // 只有当立案审批节点走过后，independentNodes才能激活
      if (currProTypes.indexOf("LASP") < 0) {
        this.independentNodes.forEach(node => {
          node.activated = true;
        });
      }
    },
    back() {
      this.$store.commit("setCurrentComponent", "generalPenalties");
    },
    dialogClose() {
      this.dialogVisible = false;
    },
    nodeClick(val) {
      if (!val.activated) return;
      this.componentId = val.componentId;
      this.currNode = val.name;
    },
    // 开始流程
    async startPro() {
      let proList = [
        "案件调查",
        "立案审批",
        "处罚裁量",
        "案件调查报告",
        "提交法制审核",
        "集体讨论",
        "处罚告知",
        "组织听证",
        "集体讨论（可选）",
        "处罚决定",
        "罚款执行",
        "结案审批"
      ];
      for (let value of proList) {
        let user = JSON.parse(localStorage.getItem("res"));
        let req = {
          businessKey: this.$store.state.penalty.penaltyUndEntity.penaltyId
        };
        let currProRes = await getCurrentProcess(req);
        if (value === "集体讨论") {
          // 结束集体讨论流程
          await endGroupDiscussLazy({
            taskId: currProRes.data[0].myTaskList[0].taskId
          });
        } else if (currProRes.data[0].activiName !== value) {
          continue;
        } else {
          await finishPro({
            // 结束流程
            taskId: currProRes.data[0].myTaskList[0].taskId,
            undertakerIds: user.userEntity.id
          });
        }
        if (value === this.endNode) {
          this.$message({
            type: "success",
            message: "已走完指定流程"
          });
          this.activatePro();
          return false;
        }
      }
    }
  }
};
</script>

<style lang="less">
.bar_wrapper {
  display: flex;
  padding: 8px 8px 0 8px;
  .node_bar {
    width: 60%;
    border-radius: 8px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(221, 221, 221, 1);
    box-shadow: 0px 2px 4px 0px rgba(220, 229, 230, 1);
    padding: 16px 16px;
    .bar-title {
      display: inline-block;
      font-size: 18px;
    }
    .nodes_wrapper {
      display: flex;
      margin-left: 55px;
      margin-top: 13px;
      .flow-node {
        flex: 1;
        position: relative;
        margin-right: 3%;
        padding-right: 43px;
        text-align: center;
        .node_img {
          padding: 2px;
          border-radius: 9px;
          &.curr_node {
            background: #046ed426;
          }
        }
        .flow-img {
          margin-bottom: 15px;
        }
        .flow-txt {
          white-space: nowrap;
          &.curr_node {
            color: white;
          }
        }
        .flow-right {
          position: absolute;
          right: 0;
          top: 12%;
        }
        &.last_node {
          padding-right: 0;
          margin-right: 8px;
        }
        &.node_active > div {
          cursor: pointer;
        }
        &.node_active > div:hover .flow-txt {
          color: #0099ff;
        }
      }
    }
  }
  .inde_nodes.node_bar {
    display: flex;
    margin-left: 8px;
    flex-grow: 1;
    width: 35%;
    .flow-node {
      flex: 1;
      position: relative;
      padding-left: 2%;
      align-self: flex-end;
      text-align: center;
      &.node_active > div:hover .flow-txt {
        color: #0099ff;
      }
      &.node_active > div {
        cursor: pointer;
      }
      &::before {
        content: "|";
        position: absolute;
        font-size: 20px;
        color: rgba(119, 149, 158, 1);
        opacity: 0.3;
        left: 0;
        top: 12%;
      }
      &.first_node {
        margin-left: 8px;
        padding-left: 0;
      }
      &.first_node::before {
        content: "";
      }
      .node_img {
        padding: 2px;
        border-radius: 9px;
        &.curr_node {
          background: #046ed426;
        }
      }
      .flow-img {
        margin-bottom: 15px;
      }
      .flow-txt {
        white-space: nowrap;
        &.curr_node {
          color: white;
        }
      }
    }
  }
}
/deep/ .content {
  padding: 0 !important;
}
.benefit {
  display: flex;
  position: absolute;
  top: 19px;
  left: 35px;
  margin-top: 10px;
  margin-left: 52px;
  width: 70%;
  .el-input {
    width: 300px;
  }
  .el-button {
    margin-left: 10px;
  }
}
</style>