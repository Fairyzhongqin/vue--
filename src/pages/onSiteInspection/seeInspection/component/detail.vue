<template>
  <div v-if="checkList.length > 0">
    <div class="title_detail">
      <span>检查内容({{checkList.length}})</span>
    </div>
    <div v-show="checkList && checkList.length > 0">
      <div v-for="(tips, index) in checkList" :key="tips.content" class="first">
        <div class="first-check">{{ index + 1 }}</div>
        <div class="first-content">
          <h5>检查项目类别：{{tips.discretionTypeName}}</h5>
          <h3>检查内容：{{tips.checkContent}}</h3>
          <div v-show="tips.children && tips.children.length > 0">
            <div v-for="(item, sonIndex) in tips.children" :key="item.discretionRulesId">
              <div class="child-des">
                <h3>
                  <span class="second-index">{{ sonIndex + 1 }}</span>
                  {{item.checkItem}}
                </h3>
              </div>
              <div class="input-des child-des">
                <div
                  class="check-desc"
                >检查描述：{{ item.isGreat === '2' ? item.checkDesc : item.negativeDesc }}</div>
                <div
                  class="handle"
                  :style="{visibility: (!item.children || item.children.length === 0) ? 'visible' : 'hidden'}"
                >
                  <div
                    class="handle-state"
                    :style="{visibility: item.examineContent ? 'visible' : 'hidden'}"
                  >
                    处理方式：
                    <span>{{ item.examineContent }}</span>
                  </div>
                  <div class="handle-oper">
                    <span style="color: #FF4B3D" v-if="item.isGreat === '0'">
                      <span class="flag">
                        <span class="right"></span>
                      </span>重大隐患
                    </span>
                    <span style="color: #FF4B3D" v-if="item.isGreat === '1'">
                      <span class="flag">
                        <span class="right"></span>
                      </span>一般隐患
                    </span>
                    <span class="label" @click="seeProof(false, index, sonIndex)">查看证据</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="!tips.children || tips.children.length === 0" class="input-des">
            <div
              class="check-desc"
            >检查描述：{{ tips.isGreat === '2' ? tips.checkDesc : tips.negativeDesc }}</div>
            <div
              class="handle"
              :style="{visibility: (!tips.children || tips.children.length === 0) ? 'visible' : 'hidden'}"
            >
              <div
                class="handle-state"
                :style="{visibility: tips.examineContent ? 'visible' : 'hidden'}"
              >
                处理方式：
                <span>{{ tips.examineContent }}</span>
              </div>
              <div class="handle-oper">
                <span style="color: #FF4B3D" v-if="tips.isGreat === '0'">
                  <span class="flag">
                    <span class="right"></span>
                  </span>重大隐患
                </span>
                <span style="color: #FF4B3D" v-if="tips.isGreat === '1'">
                  <span class="flag">
                    <span class="right"></span>
                  </span>一般隐患
                </span>
                <span class="label" @click="seeProof(true, index)">查看证据</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail_proof_detail">
      <el-dialog title="关联的证据列表" :visible.sync="showProof" :modal-append-to-body="false" width="70%" >
        <div class="proof_detail">
          <down-proof
            :proof="item"
            :canDel="false"
            v-for="(item, index) in proofList"
            :key="index"
            class="curImgProof"
            style="width:220px;height:146px;display:inline-block;"
          ></down-proof>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { previewPdf } from "@/utils/util";
import downProof from "@components/downProof/index";

export default {
  props: {
    checkList: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      showProof: false,
      proofList: []
    };
  },
  methods: {
    seeProof(state, index, sonIndex) {
      console.log(state, index, sonIndex);
      let item = state
        ? this.checkList[index]
        : this.checkList[index].children[sonIndex];
      console.log(item);
      if (item.accessoryList && item.accessoryList.length > 0) {
        this.showProof = true;
        this.proofList = item.accessoryList;
      } else {
        this.$message({
          message: "该检查项没有关联证据",
          type: "error"
        });
      }
    }
  },
  components: {
    downProof
  },
  mounted() {
    console.info("现场检查记录详情");
  }
};
</script>

<style lang="less" scoped>
.title_detail {
  background: #eef5f9;
  height: 46px;
  line-height: 46px;
  padding-left: 16px;
}
.check-desc {
  word-break: break-all;
}
.first {
  display: flex;
  flex-direction: row;
  .first-check {
    padding-top: 14px;
    font-weight: bold;
    width: 45px;
    border-bottom: 1px solid #e0e0e0;
    text-indent: 15px;
  }
  .first-content {
    // border-left: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    // padding-left: 16px;
    width: 100%;
    h5 {
      color: #666666;
      margin: 14px 0 7px;
      font-size: 14px;
      white-space: normal;
    }
    h3 {
      font-size: 16px;
      margin: 0 0 8px;
      white-space: normal;
    }
  }
}
.input-des {
  margin-bottom: 14px;
  .handle {
    display: flex;
    margin-bottom: 10px;
    margin-top: 9px;
    justify-content: space-between;
    .handle-state {
      min-width: 63%;
      span {
        color: #0099ff;
      }
    }
    .handle-oper {
      overflow-x: auto;
      white-space: nowrap;
      span {
        display: inline-block;
        margin-right: 24px;
        min-width: 100px;
        text-align: right;
        &:last-child {
          margin-right: 0;
        }
      }
      .label {
        display: inline;
        color: #1cc19c;
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
}
.child-des {
  .second-index {
    display: inline-block;
    border: 1px solid #333333;
    width: 16px;
    height: 16px;
    border-radius: 15px;
    text-align: center;
    line-height: 16px;
    font-size: 11px;
  }
}
.second {
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  .second-check {
    margin-right: 17px;
  }
}
.el-checkbox {
  /deep/ .el-checkbox__inner {
    width: 20px;
    height: 20px;
    &::after {
      left: 6px;
      top: 3px;
      height: 9px;
    }
  }
}
.el-input {
  width: 94%;
}
.flag {
  display: inline-block;
  position: relative;
  top: 4px;
  left: -10px;
  min-width: 0 !important;
  line-height: 20px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: rgba(255, 75, 61, 1);
  .right {
    display: inline-block;
    position: absolute;
    min-width: 0 !important;
    top: 4px;
    left: 3px;
    width: 11px;
    height: 6px;
    border-style: solid;
    border-width: 0 0 1px 1px;
    border-color: rgba(255, 255, 255, 1);
    transform: rotate(-45deg);
  }
}
.proof-list_seeInspection {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px 0;
}
.detail_proof_detail {
  display: flex;
  justify-content: space-between;
  /deep/.el-dialog__header {
    padding: 18px 20px 10px !important;
  }
}
</style>
