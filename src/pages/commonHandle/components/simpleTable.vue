<template>
  <div class="simple-table-container">
    <el-row> </el-row>
    <el-row>
      <el-col>
        <span class="table-name">案件名称</span>
        <span class="table-value" :title="info.caseName">{{ info.caseName }}</span>
      </el-col>
      <el-col>
        <span class="table-name">案由</span> <span class="table-value" :title="info.caseReasonNames">{{ info.caseReasonNames }}</span>
      </el-col>
      <el-col>
        <span class="table-name">当事人</span>
        <span :span="20" class="table-value" :title="info.subject">{{ info.subject ? info.subject : '暂无' }}</span>
      </el-col>
      <el-col :span="12">
        <span class="table-name">案件来源</span>
        <span :span="8" class="table-value" :title="info.caseSourceName">{{ info.caseSourceName }}</span>
      </el-col>
      <el-col :span="12">
        <span class="table-name">检查时间</span>
        <span :span="8" class="table-value" :title="info.examineTime">{{ info.examineTime }}</span>
      </el-col>
      <el-col :span="12">
        <span class="table-name">承办人</span>
        <span class="table-value" :title="info.udtNames">{{ info.udtNames }}</span>
      </el-col>
      <el-col>
        <span class="table-name">案件情况</span>
        <span class="table-value" :title="info.caseSituation">{{ info.caseSituation }}</span>
      </el-col>
      <el-col>
        <span class="table-name">承办人意见</span>
        <span class="table-value" :title="info.suggestion">{{ info.suggestion }}</span>
      </el-col>
      <el-col>
        <span class="table-name">审核状态</span>
        <span :span="8" class="table-value" :title="info.statusDes">{{ info.statusDes }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object
    }
  }
}
</script>

<style lang="less">
.simple-table-container {
  margin-top: 10px;
  font-size: 14px;
  .table-name {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    width: 75px;
    text-align: left;
    color: #333333;
    text-align: justify;
    text-align-last: justify;
    position: relative;
    padding-right: 20px;
    float: left;
    &:after {
      content: ':';
      position: absolute;
    }
  }
  .table-value {
    min-height: 38px;
    line-height: 38px;
    //overflow: hidden;
    word-break: break-all;
    word-wrap: break-word;
    text-overflow: ellipsis;
    white-space: normal;
    color: #333333;
  }
}
</style>
