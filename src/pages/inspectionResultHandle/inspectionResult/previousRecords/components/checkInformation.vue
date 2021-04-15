<template>
  <div class="checkInformation_body">
    <el-button type="text" class="check-info-back" icon="el-icon-arrow-left" @click="back">返回</el-button>
    <el-container style="display:block;width:100%;">
      <el-timeline>
        <div class="checkInformation_el-timeline-item" v-if="recordInfo.length > 0">
          <el-timeline-item
            v-for="(item,index) in data"
            :key="index"
            color="rgba(0, 153, 255, 1)"
            placement="bottom"
            size="large"
          >
            <el-header>
              <el-row :gutter="24" class="checkInformation_el-row">
                <el-col :span="6">
                  <div class="bg-purple_data">
                    <span>{{item.examineStartTime}}</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content_bg-purple">一般隐患：{{item.problemNum}}</div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content_bg-purple">重大隐患：{{item.greatProblemNum}}</div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content_bg-purple">执法人员：{{item.executorName}}</div>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="primary"
                    class="shortBut"
                    @click="showDetail('detailFlag',item)"
                  >详情</el-button>
                </el-col>
              </el-row>
            </el-header>

            <el-main>
              <check-content :data="item.penaltyDtoList"></check-content>
            </el-main>
          </el-timeline-item>
        </div>
      </el-timeline>
      <div class="checkInformation_el-dialog" v-if="dialogVisible">
        <el-dialog
          title="检查结果处理详情"
          top="5vh"
          :visible.sync="dialogVisible"
          width="90%"
          height="500px"
          :destroy-on-close="true"
          :modal-append-to-body="false"
          :before-close="handleClose"
        >
          <see-inspection :detailInfo="detailInfo"></see-inspection>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
import checkContent from '../components/checkContent'
import seeInspection from '@/pages/onSiteInspection/seeInspection/index'
import { getExamineInfo } from '@api/ProcessingofInspectionResult/index.js'

import { mapState } from 'vuex'
export default {
  name: 'checkInformation',
  components: {
    checkContent,
    seeInspection
  },
  props: ['recordInfo'],
  created() {
    console.log(this.recordInfo, '++++++')
  },
  data() {
    return {
      data:[],
      dialogVisible: false,
      detailInfo: {}
    }
  },
  methods: {
    showDetail(val, item) {
      this.detailId = item.id
      getExamineInfo({
        id: this.detailId
      })
        .then(res => {
          this.detailInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
      this.detailVal = val
      this.dialogVisible = true
      // console.log(this.detailVal, "121122");
      this.$store.commit('Identification', this.detailVal)
    },
    handleClose() {
      this.dialogVisible = false
      this.detailVal = ''
      this.$store.commit('Identification', this.detailVal)
    },
    back() {
      this.$emit('back')
    }
  },
  watch: {
    recordInfo(val){
      console.info(val)
     this.data = val
    },
    deep: true
  }
}
</script>

<style lang="less" scoped>
.checkInformation_body {
  position: relative;
  .check-info-back {
    position: absolute;
    top: -40px;
    left: -5px;
  }
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-header {
  background: rgba(227, 238, 246, 1);
  border: 1px solid rgba(160, 192, 230, 1);
  color: #333;
  height: 50px !important;
  line-height: 50px;
  width: 98%;
  padding-left: 10px;
}

.el-main {
  // display: flex;
  width: 98%;
  color: #333;
  border-right: 1px solid rgba(160, 192, 230, 1);
  border-left: 1px solid rgba(160, 192, 230, 1);
  // border-bottom:1px solid rgba(160, 192, 230, 1);
  //   line-height: 160px;
  padding: 0px !important;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.bg-purple_data {
  span {
    height: 19px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(0, 153, 255, 1);
    line-height: 22px;
    padding-left: 10px;
  }
}
.grid-content_bg-purple {
  font-size: 14px;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
// /deep/.el-timeline-item__wrapper {
//   top: -18px;
//   // border:1px solid yellowgreen !important;
// }
/deep/.el-timeline-item__tail {
  border-left: 1px solid rgba(0, 153, 255, 1);
}
/deep/.el-timeline {
  margin: 1px;
}
.shortBut {
  width: 40px;
  height: 24px;
  font-size: 14px;
  padding: 7px 3px !important;
}
.el-col-2 {
  text-align: center;
}
</style>