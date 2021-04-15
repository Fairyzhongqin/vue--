<template>
  <!-- 违法行为 -->
  <div>
    <div class="xzcf-vio-wrapper">
      <el-row>
        <el-col :span="18">违法行为</el-col>
        <el-col :span="6" class="violation_source" v-if="!isDetail">
          <span class="xzcf-vio-span" @click="dialogOpen">选择违法行为 |</span>
          <span class="xzcf-vio-span" @click="addViolation">新增违法行为</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <!-- 选择检查内容 -->
      <select-check :from="'violation'" v-if="showDialog" :tipsCache="checkList" @close="showDialog = false" @getSelectedTips="getSelectedTips"></select-check>
    </div>

    <el-row class="violation" v-for="(vio, index) in checkList" :key="index">
      <section class="violation_title" v-if="vio">
        <div :class="{ title: vio.editStatus }">
          <span class="text">{{ index + 1 }}、</span>
          <span v-if="!vio.editStatus" class="text">{{ vio.actName }}</span>
          <el-input
            class="vio"
            type="textarea"
            :autosize="{ minRow: 1, maxRow: 3 }"
            v-if="vio.editStatus"
            @blur="doneMod(vio, index)"
            v-model="vio.actName"
          ></el-input>
        </div>
        <div class="operations" v-if="!vio.editStatus">
          <span class="violation_button_2" v-if="!vio.isCustom" @click="vio.showDetail = !vio.showDetail">
            <a class="vio-anchor">{{ vio.showDetail ? '收起详情' : '详情' }}</a>
          </span>
          <span class="vio-mo-span cp" @click="modify(vio, index)" v-if="!isDetail">修改</span>
          <span class="vio-de-span cp" @click="delFatherVio(vio, index)" v-if="!isDetail">删除</span>
        </div>
      </section>
      <div class="violation_v" v-show="vio.showDetail">
        <ul class="p-text">
          <span>违法行为：</span>
          <li>
            <pre>{{ vio.actName }}</pre>
          </li>
        </ul>
        <ul class="p-text">
          <span>违反法律：</span>
          <li>
            <pre>{{ vio.lawContent }}</pre>
          </li>
        </ul>
        <ul class="p-text">
          <span>处罚依据：</span>
          <li>
            <pre>{{ vio.penaltyAcdName }}</pre>
          </li>
        </ul>
        <ul class="p-text">
          <span>处罚档次：</span>
          <li>
            <pre>{{ vio.levelContent }}</pre>
          </li>
        </ul>
        <ul class="p-text">
          <span>裁量幅度：</span>
          <li>
            <pre>{{ vio.discretionRangeContent }}</pre>
          </li>
        </ul>
      </div>
      <section class="child violation_title" v-if="vio.children">
        <div v-for="(child, childIndex) in vio.children" :key="childIndex" class="child_violation_title">
          <div :class="{ title: child.editStatus }">
            <span class="circle text">{{ childIndex + 1 }}</span>
            <span class="text" v-if="!child.editStatus">{{ child.violateRules }}</span>
            <el-input
              class="xzcf-child-input vio"
              type="textarea"
              :autosize="{ minRow: 1, maxRow: 3 }"
              v-if="child.editStatus"
              @blur="child.editStatus = false"
              v-model="child.violateRules"
            ></el-input>
          </div>
          <div class="operations" v-if="!child.editStatus">
            <span class="vio-mo-span cp" @click="modify(child, childIndex)" v-if="!isDetail">修改</span>
            <span class="vio-de-span cp" @click="delChildVio(child, childIndex, index)" v-if="!isDetail">删除</span>
          </div>
        </div>
      </section>
    </el-row>
  </div>
</template>

<script>
import selectCheck from '../../../onSiteInspection/newInspection/component/selectCheck'
import { delLawCase } from '@/api/filingRegister'
export default {
  name: 'violation',
  components: {
    selectCheck
  },
  props: {
    blcCache: {
      // 修改 or 详情 的违法行为
      type: Array
    },
    isDetail: {
      // 是否为查看详情
      type: Boolean
    }
  },
  data() {
    return {
      showDialog: false, // 是否显示违法行为选择框
      checkList: [] // 选择的检查项
    }
  },
  watch: {
    blcCache: {
      handler: function(n, o) {
        this.checkList = JSON.parse(JSON.stringify(n))
        console.info('violation checkList', this.checkList)
      },
      deep: true
    },
    checkList: {
      handler: function(n, o) {
        this.$emit('afterHan', n)
      },
      deep: true
    }
  },
  created() {},
  methods: {
    // 获取选择的检查项
    getSelectedTips(arr) {
      this.checkList = arr.reduce((total, item) => {
        if (item.children && item.children.length > 0) {
          // 有子项
          let middle = item.children
          let list = middle.reduce((t, i) => {
            if (i.isOldTips) {
              // 如果是修改的旧数据
              t.push(i)
            } else {
              // 新选中的子项
              this.$set(i, 'editStatus', false)
              t.push(i)
            }
            return t
          }, [])
          if (!item.isOldTips) {
            // 处理带子项的父项
            item.children = list
            this.initFather(item)
          }
          // coding 看能否 delete 掉children这个属性，话说我一直想看 delete这个语句
          total.push(item)
        } else {
          // 无子项
          if (item.isOldTips || item.isCustom) {
            total.push(item)
          } else {
            this.initFather(item)
            total.push(item)
          }
        }
        return total
      }, [])
      this.showDialog = false
    },
    // 初始化父项字段
    initFather(item) {
      item.checkContent = item.examineContent
      item.checkDesc = item.checkContent
      item.lawContent = item.lawProvisionsContent
      item.penaltyAcdName = item.penalizeBasisContent
      this.$set(item, 'actName', item.unlawfulAct)
      this.$set(item, 'showDetail', false)
      this.$set(item, 'editStatus', false)
    },
    // 违法行为修改完成
    doneMod(vio, ind) {
      let trimAct = vio.actName.trim()
      if (trimAct.length === 0 && !vio.discretionId) {
        // this.checkList.splice(ind, 1)
      } else {
        vio.editStatus = false
      }
    },
    // 修改违法行为
    modify(vio, ind) {
      vio.editStatus = true
      this.$nextTick(() => {
        let vioInputs = document.getElementsByClassName('vio')
        let vio = vioInputs[0].firstElementChild.focus()
      })
    },
    // 删除父级检查项
    delFatherVio(vio, ind) {
      if (vio.breakLawCaseId) {
        // 已存库的父项
        delLawCase({ breakLawCaseId: vio.breakLawCaseId }).then(res => {
          this.checkList.splice(ind, 1)
        })
      } else {
        this.checkList.splice(ind, 1)
      }
    },
    // 删除子级检查项
    delChildVio(vio, cIn, fIn) {
      // 已存库的子项
      let children = this.checkList[fIn].children
      if (vio.breakLawCaseId) {
        delLawCase({ breakLawCaseId: vio.breakLawCaseId }).then(res => {
          children.splice(cIn, 1)
          if (children.length === 0) {
            // 如果子项全部删光
            this.delFatherVio(this.checkList[fIn], fIn)
          }
        })
      } else {
        children.splice(cIn, 1)
        if (children.length === 0) {
          // 如果子项全部删光
          this.delFatherVio(this.checkList[fIn], fIn)
        }
      }
    },
    // 打开选择检查项窗口
    dialogOpen() {
      this.showDialog = true
    },
    // 添加自定义违法行为
    addViolation() {
      this.checkList.push({
        children: null,
        actName: '', // 违法行为
        breakLawCaseId: '',
        checkContent: '',
        checkDesc: '',
        discretionId: '',
        lawContent: '', // 法律详情
        penaltyAcdName: '', // 处罚依据
        discretionRulesId: '',
        editStatus: true, // 是否在修改状态
        isCustom: true // 是否是自定义新增的
      })
      this.$nextTick(() => {
        let vioInputs = document.getElementsByClassName('vio')
        let vio = vioInputs[0].firstElementChild.focus()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.xzcf-vio-wrapper {
  background: #e3eef6;
  font-size: 14px;
  color: #999999;
  text-indent: 15px;
  height: 46px;
  font-weight: 500;
  line-height: 46px;
}

.xzcf-vio-span {
  color: #0099ff;
  cursor: pointer;
}

.violation.el-row {
  margin-top: 15px;
}

.violation_title {
  display: flex;
  flex-wrap: wrap;

  &.child {
    display: block;
    padding-left: 20px;
  }

  /* 
  /deep/ .el-textarea textarea {
    height: auto !important;
  } */
  .child_violation_title {
    display: flex;
    flex-wrap: wrap;

    .xzcf-child-input {
      margin-left: 10px;
    }
  }

  .operations {
    display: inline-block;
    margin-left: 30px;
    align-self: center;
    .vio-anchor {
      text-decoration: none;
      color: #1cc19c;
    }

    .vio-mo-span {
      color: #0099ff;
    }

    .vio-de-span {
      color: #ff4b3d;
    }
  }

  .cp {
    cursor: pointer;
  }

  .title {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .text {
    line-height: 22px;
    height: 16px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }

  .circle {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-top: 6px;
    margin-right: 2px;
    text-align: center;
    line-height: 16px;
    border: 1px solid #999999;
    border-radius: 50%;
  }
}

.violation_button_2 {
  color: #1cc19c;
  cursor: pointer;
}

.p-text {
  display: flex;
  padding-left: 30px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  pre {
    margin: 0;
    overflow: hidden;
    white-space: pre-line;
  }
  span {
    display: block;
    width: 95px;
    flex-shrink: 0;
  }

  li {
    padding-right: 30px;
    list-style: none;
  }
}
</style>
