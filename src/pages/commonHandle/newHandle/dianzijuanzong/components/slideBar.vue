<template>
  <div class="slide_bar_lay">
    <el-menu :default-openeds="openIndex" :default-active="activeCode" @select="handleSelect">
      <!-- 第一层 -->
      <template v-for="item1 in treeInfo">
        <template v-if="item1.child">
          <el-submenu :index="item1.id" :key="item1.id">
            <span slot="title" class="fw_b">
              <i class="icon"></i>
              {{item1.treeName}}
            </span>
            <!-- 第二层 -->
            <template v-for="item2 in item1.child">
              <template v-if="item2.child">
                <el-submenu :index="item2.id" :key="item2.id">
                  <span slot="title" class="fw_b line">
                    <i class="icon"></i>
                    {{item2.treeName}}
                  </span>
                  <!-- 第三层 -->
                  <template v-for="item3 in item2.child">
                    <template v-if="item3.child">
                      <el-submenu :index="item3.id" :key="item3.id">
                        <span slot="title" class="line">
                          <i class="icon"></i>
                          {{item3.treeName}}
                        </span>
                        <!-- 第四层 -->
                        <template v-for="item4 in item3.child">
                          <template v-if="item4.child">
                            <el-submenu :index="item4.id" :key="item4.id">
                              <span slot="title" class="line">
                                <i class="icon"></i>
                                {{item4.treeName}}
                              </span>
                              <!-- 第五层 -->
                              <template v-for="item5 in item4.child">
                                <template v-if="item5.child">
                                  <el-submenu :index="item5.id" :key="item5.id">
                                    <span slot="title" class="line">
                                      <i class="icon"></i>
                                      {{item5.treeName}}
                                    </span>
                                  </el-submenu>
                                </template>
                                <template v-else>
                                  <el-menu-item :index="item5.id" :key="item5.id">
                                    <span slot="title" class="line" :style="item5.color===2?'color:#409EFF':item5.color===1?'color:red':''" :class="item5.hasLoadNum?'hasData':'gray'" @click="colorful($event,item5)">
                                      <i class="icon"></i>
                                      {{item5.treeName}}{{item5.hasLoadNum?`（${item5.hasLoadNum}）`:''}}
                                    </span>
                                  </el-menu-item>
                                </template>
                              </template>
                            </el-submenu>
                          </template>
                          <template v-else>
                            <el-menu-item :index="item4.id" :key="item4.id">
                              <span slot="title" class="line" :style="item4.color===2?'color:#409EFF':item4.color===1?'color:red':''" :class="item4.hasLoadNum?'hasData':'gray'" @click="colorful($event,item4)">
                                <i class="icon"></i>
                                {{item4.treeName}}{{item4.hasLoadNum?`（${item4.hasLoadNum}）`:''}}
                              </span>
                            </el-menu-item>
                          </template>
                        </template>
                      </el-submenu>
                    </template>
                    <template v-else>
                      <el-menu-item :index="item3.id" :key="item3.id">
                        <span slot="title" class="line" :style="item3.color===2?'color:#409EFF':item3.color===1?'color:red':''" :class="item3.hasLoadNum?'hasData':'gray'" @click="colorful($event,item3)">
                          <i class="icon"></i>
                          {{item3.treeName}}{{item3.hasLoadNum?`（${item3.hasLoadNum}）`:''}}
                        </span>
                      </el-menu-item>
                    </template>
                  </template>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="item2.id" :key="item2.id">
                  <span slot="title" class="fw_b line" :style="item2.color===2?'color:#409EFF':item2.color===1?'color:red':''" :class="item2.hasLoadNum?'hasData':'gray'" @click="colorful($event,item2)">
                    <i class="icon"></i>
                    {{item2.treeName}}{{item2.hasLoadNum?`（${item2.hasLoadNum}）`:''}}
                  </span>
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item1.id" :key="item1.id">
            <span slot="title" class="fw_b" :style="item1.color===2?'color:#409EFF':item1.color===1?'color:red':''" :class="item1.hasLoadNum?'hasData':'gray'" @click="colorful($event,item1)">
              <i class="icon"></i>
              {{item1.treeName}}{{item1.hasLoadNum?`（${item1.hasLoadNum}）`:''}}
            </span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { queryTreeInfo } from "@/api/dossier";
import { mapState } from "vuex";
export default {
  name: "fileSlideBar",
  props: {
    type: {
      // audit 法制审核模块
      type: String
    }
  },
  data() {
    return {
      treeInfo: [],
      activeCode: '1001'
    };
  },
  mounted() {
    this.queryTreeInfo();
  },
  methods: {
    setNum(num, node) {
      console.info('setNum', num, node)
      const fn = (_treeInfo) => {
        _treeInfo.map(item => {
          if (node.id === item.id) {
            item.hasLoadNum = num;
            item.color = 2
            return
          }
          if (item.child && item.child.length > 0) {
            fn(item.child)
          }
        })
      }
      fn(this.treeInfo)
    },
    colorful(event ,item){
      // if (item.hasLoadNum !== 0){
      //   event.target.style.color = '#409EFF'
      // }
    },
    handleSelect(key, keyPath) {
      let node = JSON.parse(JSON.stringify(this.treeInfo)),
        indexArr = [];
      if (this.type === "audit") { // 法制审核模块 需递归磨平 node数组
        let res = this.getFlattenNodes(node, []);
        res.forEach(v => {
          if (v.id === key) {
             this.$emit("selectNode", v);
          }
        })
      } else { // 电子卷宗模块 node.id 有规律 
        // 获得所选 node 的父辈及自身 index
        indexArr = key
          .slice(3)
          .split("")
          .map(Number);
        indexArr.forEach(ind => {
          if (node.child) {
            node = node.child[ind - 1];
          } else {
            node = node[ind - 1];
          }
        });
        this.$emit("selectNode", node);
      }
    },
    // 获取降维的 node数组 by recursive
    getFlattenNodes(nodes, accu) {
      let result = nodes.reduce((accumulator, currentValue) => {
        if (currentValue.child) {
          accumulator = accumulator.concat(currentValue);
          return this.getFlattenNodes(currentValue.child, accumulator);
        } else {
          return accumulator.concat(currentValue);
        }
      }, accu);
      return result
    },
    queryTreeInfo(index) {
      if(index === 0) {
        this.activeCode = '1001'
      }
      if(index === 1){
        this.activeCode = '1002'
      }
      queryTreeInfo({
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: this.type === "audit" ? "1" : "0"
      }).then(res => {
        this.treeInfo = res.data;
        this.$emit("selectNode", this.treeInfo[index?index:0]); // 首屏默认节点
        this.$emit("loadingFinish");
      });
    }
  },
  computed: {
    openIndex() {
      let arr = []
      getId(this.treeInfo)
      function getId(data) {
        data.map(res => {
          if(res.child && res.child.length > 0) {
            arr.push(res.id)
            getId(res.child)
          }
        })
      }
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
.slide_bar_lay {
  color: #333;
  font-size: 14px;
  border: none;
  span.fw_b {
    font-weight: bold;
  }
  span.hasData{
    color: red;
  }
  span.gray {
    // filter: grayscale(100%);
    // filter: gray;
  }
  /deep/.el-menu-item,
  /deep/.el-submenu__title {
    height: 42px;
    line-height: 42px;
  }
  /deep/.el-menu {
    background-color: transparent;
    border: none;
    .el-menu-item {
      border-left: 4px solid transparent;
      > span > i.icon {
        display: inline-block;
        margin-left: 5px;
        width: 12px;
        height: 16px;
        background-image: url(../../../../../assets/imgs/tree/index2.png);
        background-repeat: no-repeat;
        padding-left: 5px;
      }
      &.is-active {
        background-color: #ffffff;
        border-left: 4px solid #0099ff;
      }
      &:hover {
        background-color: #ffffff;
        border-left: 4px solid #0099ff;
      }
    }
    .el-submenu__title {
      border-left: 4px solid transparent;
      > span > i.icon {
        display: inline-block;
        margin-left: 5px;
        width: 14px;
        height: 16px;
        background-image: url(../../../../../assets/imgs/tree/index1.png);
        background-repeat: no-repeat;
        padding-left: 5px;
      }
      &:hover {
        background-color: #ffffff;
        border-left: 4px solid #0099ff;
      }
    }
    span.line {
      position: relative;
      display: inline-block;
      &:before {
        content: "";
        position: absolute;
        left: -9px;
        top: -20px;
        width: 8px;
        height: 40px;
        border-left: 1px dotted #e0e0e0;
        border-bottom: 1px dotted #e0e0e0;
      }
    }
  }
}
</style>
