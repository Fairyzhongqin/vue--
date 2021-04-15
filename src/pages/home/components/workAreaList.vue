<template>
  <div class="body">
    <el-row v-for="(item, index) in buttonList" :key="index" class="check-card">
      <el-col :span="8" v-for="(child, i) in item" :key="i" @click.native="toPage(child.path)">
        <el-card class="card-style">
          <div :class="child.style" class="button-style"></div>
          <div class="card-text">{{ child.content }}</div>
          <span class="total-num" v-show="child.num !== null && child.num < 100">{{ child.num }}</span>
          <span
            class="total-num"
            v-show="child.num !== null && child.num >= 100"
            style="font-size: 12px"
          >99+</span>
        </el-card>
      </el-col>
    </el-row>
    <!-- <canvas id="canvas" width="500px" height="500px" style="background:#fff"></canvas> -->
    <p class="copyright">Copyright © 2019 All Rights Reserved</p>
  </div>
</template>

<script>
import { todoNum } from '@/api/workArea'

import SignaturePad from 'signature_pad'
// import { signaturePad } from '@/utils/signaturePad'
export default {
  data() {
    return {
      buttonList: [
        [
          {
            style: 'scheme',
            content: '检查方案',
            path: 'inspectionScheme'
          },
          {
            style: 'inspection',
            content: '现场检查',
            path: 'onSiteInspection',
            num: 0
          },
          {
            style: 'result',
            content: '检查结果处理',
            path: 'inspectionResultHandle'
          }
        ],
        [
          {
            style: 'rectification',
            content: '整改复查',
            path: 'rectificationReview'
          },
          {
            style: 'normal-punish',
            content: '一般行政处罚',
            path: 'commonHandle',
            num: 0
          },
          {
            style: 'easy-punish',
            content: '简易行政处罚',
            path: 'simpleHandle'
          }
        ]
      ]
    }
  },
  methods: {
    toPage(val) {
      this.$router.push({ path: val })
    },
    loadSign() {
      let canvas = document.querySelector("#canvas");
      let signaturePad = new SignaturePad(canvas);
    }
  },
  mounted() {
    todoNum().then(res => {
      this.buttonList[0][1].num = res.examineCnt
      this.buttonList[1][1].num = res.panaltyCnt
    })
    // this.loadSign()

  }
}
</script>

<style lang="less" scoped>
.check-card {
  padding: 8px 4px 0;
  .el-col {
    padding: 0 4px;
  }
}
.card-style /deep/ .el-card__body {
  display: flex;
  flex-direction: row;
  position: relative;
  cursor: pointer;
}
.card-text {
  padding-left: 10px;
  font-size: 18px;
  font-weight: bold;
  line-height: 100px;
}
.scheme {
  background: url('~@/assets/imgs/solution.png') no-repeat center;
  background-color: rgba(89, 182, 204, 0.1);
}
.inspection {
  background: url('~@/assets/imgs/inspection.png') no-repeat center;
  background-color: rgba(255, 168, 88, 0.1);
}
.result {
  background: url('~@/assets/imgs/result.png') no-repeat center;
  background-color: rgba(76, 137, 229, 0.1);
}
.rectification {
  background: url('~@/assets/imgs/rectification.png') no-repeat center;
  background-size: 50% 40% !important;
  background-color: rgba(220, 98, 145, 0.1);
}
.normal-punish {
  background: url('~@/assets/imgs/UI_icon2_normal-punish.png') no-repeat center;
  background-color: rgba(111, 214, 185, 0.1);
}
.easy-punish {
  background: url('~@/assets/imgs/easy-punish.png') no-repeat center;
  background-color: rgba(188, 149, 212, 0.1);
}
.button-style {
  width: 100px;
  height: 100px;
  background-size: 50% 50%;
}
.body {
  height: 80vh;
  position: relative;
}
.copyright {
  color: #bbbbbb;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.total-num {
  position: absolute;
  top: 40%;
  right: 20px;
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background: #ff0000;
  color: #ffffff;
  text-align: center;
}
</style>