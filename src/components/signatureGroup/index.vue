<template>
  <div class="signature">
    <div class="signatureWrap">
      <div
        v-for="(item,index) in signatureList"
        :key="index"
        class="div-show"
        :class="{'actived':activeList===index}"
        @click="chooseSingleImg(index)"
      >
        <img :src="item.sealPath " alt="盖章数据" />
      </div>
    </div>
    <div class="signatureBtn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="sentToSign">确定</el-button>
    </div>
  </div>
</template>
<script>
import { Throttle } from '@/utils/util.js'
export default {
  name: 'signatureWrap',
  props: {
    signatureList: {
      type: Array
    }
  },
  components: {},
  data() {
    return {
      info: {},
      activeList: null //此时active index
    }
  },
  methods: {
    chooseSingleImg(idx) {
      console.info('signatureList', this.signatureList[idx])
      this.info = this.signatureList[idx]
      if (this.activeList === idx) {
        this.activeList = null
      } else {
        this.activeList = idx
      }
    },
    sentToSign: Throttle(function() {
      if (!this.info.signId || this.activeList === null) {
        this.$message({
          message: '请选择您所要盖的章',
          type: 'error'
        })
      } else {
        this.$emit('sentToSign', this.info)
      }
    }, 3000),
    cancel() {
      this.$emit('close')
    }
  },
  created() {
    console.info('签章图片', this.signatureList)
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.signature {
  position: relative;
  width: 100%;
  .signatureWrap {
    display: flex;
    justify-content: space-around;
    padding-top: 20px;
    //   active
    .div-show {
      width: 200px;
      height: 100%;
      position: relative;
      cursor: pointer;
      &:hover {
        > img {
          transform: scale(1.05)
        }
      }
      &.actived {
        &::before {
          content: '';
          display: block;
          position: absolute;
          right: 0;
          bottom: 0;
          border: 17px solid #32cd32;
          border-top-color: transparent;
          border-left-color: transparent;
          color: #fff;
        }
        &::after {
          content: '';
          display: block;
          width: 5px;
          height: 12px;
          position: absolute;
          right: 6px;
          bottom: 6px;
          border: 2px solid #fff;
          border-top-color: transparent;
          border-left-color: transparent;
          transform: rotate(45deg);
        }
      }
      img {
        width: 100%;
      }
    }
  }
  .signatureBtn {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 30px;
    box-sizing: border-box;
    padding-bottom: 10px;
  }
}
</style>
