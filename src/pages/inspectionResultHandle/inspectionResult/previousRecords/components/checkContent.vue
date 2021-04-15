<template>
  <div class="body">
    <div class="grid-content_bg-purple_case" v-if="isShow">
      <div class="grid-content_bg-purple_case_text">立案情况</div>
    </div>
    <div v-for="(item,index) in list" :key="index" class="tabs">
      <div v-if="isShow">
        <div class="grid-content_bg-purple_case_text_1">{{index+1}}</div>
        <div class="grid-content_bg-purple_case_content">
          <el-row>
            <el-col :span="2">当事人：</el-col>
            <el-col :span="22">{{item.partyName ? item.partyName:"--" }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="2">处罚结果：</el-col>
            <el-col :span="22">{{item.publishResult ? item.publishResult:"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="2">立案时间：</el-col>
            <el-col :span="22">{{item.caseTime ? item.caseTime :"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="2">结案时间：</el-col>
            <el-col :span="22">{{item.endTime ? item.endTime:"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              处罚金额：
              <span class="RMB">￥{{item.publishMoney ? item.publishMoney:"--"}}</span>
            </el-col>
            <el-col :span="1">
              <span
                style="color:rgba(0,153,255,1);text-decoration:underline;cursor: pointer;"
                @click="seeDetail(item)"
              >详情</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div v-if="compBrowseShow">
      <comprehensive-browse @closeFrame="closeFrame"></comprehensive-browse>
    </div>
  </div>
</template>
<script>
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
import { getFilingRegister } from '@/api/filingRegister/index'
import { mapState } from 'vuex'
export default {
  name: 'checkContent',
  components: {
    comprehensiveBrowse
  },
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      isShow: false,
      compBrowseShow: false,
      list: []
      // penalty: {}
    }
  },
  methods: {
    seeDetail(item) {
      console.log(item)
      getFilingRegister({
        penalty: item.id
      })
        .then(res => {
          this.$store.commit('setPenalty', res.data)
          this.compBrowseShow = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    closeFrame() {
      this.compBrowseShow = false
    }
  },
  created() {
    this.list = JSON.parse(JSON.stringify(this.data))
    console.log(JSON.parse(JSON.stringify(this.data)))
    if (this.list.length !== 0) {
      this.isShow = true;
    }
  },
  watch: {
    data(val) {
      console.info(val)
      this.list = val
      if (this.list.length !== 0) {
        this.isShow = true;
      }

    },
    deep: true

  }
}
</script>
<style lang="less" scoped>
.grid-content_bg-purple_case {
  width: 40px;
  height: 100%;
  font-size: 50px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  background: rgba(236, 242, 250, 1);
  border-right: 1px solid rgba(160, 192, 230, 1);
  border-bottom: 1px solid rgba(160, 192, 230, 1);
  display: table-cell;
  vertical-align: middle;
  .grid-content_bg-purple_case_text {
    padding-left: 14px;
  }
}
.grid-content_bg-purple_case_text_1 {
  width: 40px;
  height: 100%;
  float: left;
  text-align: center;
  padding-top: 50px;
}
.grid-content_bg-purple_case_content {
  float: left;
  width: 95%;
  height: 100%;
  border-left: 1px solid rgba(160, 192, 230, 1);
  padding: 8px 5px;
  word-break: break-all;
}
/deep/.el-col-2 {
  width: 6.3%;
}
.tabs {
  width: 100%;
  display: table;
  border-bottom: 1px solid rgba(160, 192, 230, 1);
  position: relative;
  height: 100%;
}
.body {
  display: table;
  width: 100%;
  overflow: hidden;
}
.RMB {
  color: rgba(255, 73, 1, 1);
}
.el-col-1 {
  text-align: center;
}
</style>