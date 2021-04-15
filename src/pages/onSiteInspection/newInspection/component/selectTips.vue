<template>
  <div class="body">
    <el-row class="title row-border">
      <el-col :span="4">
        <span class="check-index">全选</span>
        <el-checkbox @change="selectAll" :checked="true"></el-checkbox>
      </el-col>
      <el-col :span="20" class="col-border">
        <div class="title-content">现场检查内容</div>
      </el-col>
    </el-row>
    <el-row v-for="(item, index) in cacheList" :key="index" class="row-border">
      <el-col :span="4" class="check-select">
        <span class="check-index">{{ index + 1 }}</span>
        <el-checkbox @change="setData(index,item.checked)" v-model="item.checked"></el-checkbox>
      </el-col>
      <el-col :span="20" class="col-border">
        <div class="content-pad">{{ item.label }}</div>
      </el-col>
    </el-row>
    <div class="body-button">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="getTips" type="primary">确定</el-button>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils/util'
export default {
  props: {
    checkList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      confirmTips: [],
      cacheList: [],
      checkAll: false
    }
  },
  methods: {
    getTips() {
      this.confirmTips = [...new Set(this.confirmTips)]
      this.$emit('getSelectTips', this.confirmTips)
    },
    selectAll(val) {
      this.confirmTips = val ? [...this.checkList] : []
      this.cacheList.forEach(item => {
        item.checked = val
      })
    },
    setData(index, checked) {
      let item = this.checkList[index]
      let state = this.confirmTips.indexOf(item)
      if (state === -1) {
        if (checked === true) {
          this.confirmTips.push(item)
        }
      } else {
        if (checked === false) {
          this.confirmTips.splice(state, 1)
        }
      }
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  mounted() {
    // console.log('checkList==>', this.checkList)
    // console.log('cacheList==>', this.cacheList)
    this.getTips = debounce(this.getTips)
    this.confirmTips = [...this.checkList]
    this.checkList.forEach(item => {
      this.cacheList.push({ checked: true, label: item })
    })
  }
}
</script>

<style lang="less" scoped>
.body {
  padding: 8px 16px 0;
  .body-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 6px;
    padding-bottom: 10px;
  }
  .el-checkbox {
    /deep/ .el-checkbox__inner {
      width: 20px;
      height: 20px;
      &::after {
        height: 10px;
        width: 5px;
      }
    }
  }
  .title {
    background-color: #e3eef6;
    height: 50px;
    line-height: 50px;
    .title-content {
      font-size: 16px;
      font-weight: bold;
      padding-left: 16px;
    }
  }
  .row-border {
    border-bottom: 1px solid #e0e0e0;
  }
  .col-border {
    border-left: 1px solid #e0e0e0;
  }
  .content-pad {
    padding: 5px 7px 5px 16px;
    line-height: 22px;
    white-space: normal;
    word-wrap: break-word;
  }
  .check-index {
    display: inline-block;
    width: 55px;
    height: 100%;
    font-size: 14px;
    text-align: center;
  }
  .check-select {
    padding: 5px 0 5px;
  }
}
</style>
