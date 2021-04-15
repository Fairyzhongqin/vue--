<template>
  <div class="lasp-container">
    <div class="tab-left">
      <div class="create-tab-title">结案审批</div>
      <div class="content-list">
        <el-row>
          <el-col :span="2">
            文书种类：
          </el-col>
          <el-col :span="8">
            案件移送审批表
          </el-col>
          <el-col :span="2">
            文书编号：
          </el-col>
          <el-col :span="8">
            （锡）应急监支案报告[2019]1号
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            文书名称：
          </el-col>
          <el-col :span="8">
            案件移送审批
          </el-col>
          <el-col :span="2">
            编制时间：
          </el-col>
          <el-col :span="8">
            2019/08/17
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            编制人：
          </el-col>
          <el-col :span="8">
            王晓明
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>

      <div class="button-container">
        <div>
          <el-button type="primary" size="mini" @click="edit">浏览案件移送审批表</el-button>
          <el-button type="primary" size="mini">提交审核</el-button>
        </div>
        <div>
          <el-button type="text" size="mini">修改</el-button>
          <el-button type="text" style="color:#FF4B3D;" size="mini">删除</el-button>
        </div>
      </div>
    </div>
    <div class="tab-middle"></div>
    <div class="tab-right">
      <div class="create-tab-title">审核审批流程</div>
      <sn-time-line></sn-time-line>
    </div>
  </div>
</template>

<script>
import snTimeLine from '@/components/TimeLine'

export default {
  components: {
    snTimeLine
  },
  methods: {
    edit() {
      this.$parent.setComponentId('closingCase')
    }
  }
}
</script>
<style lang="less" scoped>
.content-list {
  line-height: 40px;
  // padding: 14px;
  color: #333333;
}
.lasp-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 250px;
  .tab-left {
    width: calc(65% - 15px);
    .button-container {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  .tab-middle {
    width: 1px;
    background-color: #e0e0e0;
  }
  .tab-right {
    width: calc(35% - 15px);
  }
}
/deep/.el-col-2 {
  width: 13%;
  padding-left: 10px;
}
</style>
