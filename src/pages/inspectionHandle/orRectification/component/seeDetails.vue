<template>
  <div class="content">
    <div @click="backPage" class="back-button">
      <i class="el-icon-arrow-left"></i> 返回
    </div>

    <div class="font18">
      查看责令限期整改
    </div>

    <div class="flex justify-content-space-between top-pading">
      <div class="left-bar">
        <div class="tit">现场处理</div>
        <div class="content-list">
          <el-row>
            <el-col :span="3">
              企业名称：
            </el-col>
            <el-col :span="9">
              江阴市五彩斑斓家具有限公司
            </el-col>
            <el-col :span="3">
              检查来源：
            </el-col>
            <el-col :span="9">
              举报投诉
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              检查场所：
            </el-col>
            <el-col :span="9">
              生产车间办公室
            </el-col>
            <el-col :span="3">
              检查部门：
            </el-col>
            <el-col :span="9">
              科技和信息化处
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              检查时间：
            </el-col>
            <el-col :span="9">
              2019/08/07
            </el-col>
            <el-col :span="3">
              检查方式：
            </el-col>
            <el-col :span="9">
              现场检查
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              执法部门：
            </el-col>
            <el-col :span="9">
              支队领导
            </el-col>
            <el-col :span="3">
              执法人员：
            </el-col>
            <el-col :span="9">
              王晓明、姜小虎
            </el-col>
          </el-row>
        </div>

        <div class="tit">限期整改</div>
        <div class="pad15">
          <div class="color6">
            检查项目类别：烟花爆竹类
          </div>
          <div class="color3">
            不合格内容：任何部门和个人是否存在生产、经营、使用国家禁止生产、经营、使用的危险化学品的行为。
          </div>
          <upload-proof></upload-proof>

        </div>

        <div class="tit-list">
          <el-row>
            <el-col :span="8" class="flex justify-content-space-between align-items-center">
              <div class="tit-label"> 
                整改时限：
              </div>
              <div class="tit-content">
                2019年8月1日
              </div>
            </el-col>
            <el-col :span="16" class="flex justify-content-space-between align-items-center">
              <div class="tit-label"> 
                延期至：
              </div>
              <div class="tit-content">
                2019年8月10日
              </div>
            </el-col>
          </el-row>
          <div class="flex justify-content-space-between align-items-center">
            <div class="tit-label"> 
              整改要求：
            </div>
            <div class="tit-content">
              整改期间，你部门应当采取措施，确保安全生产，对安全生产违法行为，将依法予以行政处罚。
            </div>
          </div>
          <div class="flex justify-content-space-between align-items-center">
            <div class="tit-label"> 
              备注：
            </div>
            <div class="tit-content color-gury">
              暂无
            </div>
          </div>
        </div>
      </div>

      <div class="right-bar">
        <div class="tit">公章审核流程</div>
        <div class="time-line">
          <time-line></time-line>

        </div>
      </div>
    </div>

    <div class="button-group">
      <button-group @click-button="preview" :buttonList="buttonList"></button-group>
    </div>
  </div>
</template>
<script>
import uploadProof from '@/components/uploadProof/index';
import buttonGroup from '@/components/buttonGroup/index';
import timeLine from '@/components/TimeLine/index';
export default {
  components: {
    uploadProof,
    buttonGroup,
    timeLine
  },
  data() {
    return {
      buttonList:[{
        name: '浏览文书',
        type: 'primary'
      }]
    }
  },
  methods: {
    backPage(){ // 返回
      this.$store.commit('setInspectionHandleorRectificationisShow');
    },
    preview() { // 

    }
  },
}
</script>
<style lang="less" scope>
  .content{
    background: #fff;
    padding: 8px;
    margin: 8px;
    box-sizing: border-box;
    width: calc(100% - 16px);
    padding: 16px 82px 33px;
    border-radius: 8px;
    position: relative;
  }
  .back-button{
    position: absolute;
    left: 16px;
    top: 18px;
    color: #0099FF;
    cursor: pointer;
    &:hover{
      color: #409EFF;
    }
  }
  .font18{
    font-size: 18px;
    color: #333333;
  }
  .top-pading{
    padding-top: 36px;

  }
  .left-bar{
    width: 70%;
    border-right: 1px solid #E0E0E0;
    padding-right: 17px;
  }
  .right-bar{
    width: 30%;
    padding-left: 17px;
  }
  .tit{
    background: #E3EEF6;
    font-size: 16px;
    color: #333333;
    text-indent: 15px;
    height: 24px;
    font-weight: bold;
  }
  .content-list{
    line-height: 30px;
    padding: 14px;
    color: #333333;
  }
  .pad15{
    padding: 14px;
    box-sizing: border-box;
  }
  .color6{
    color: #666666;
    font-size: 14px;
    line-height: 22px;
  }
  .color3{
    color: #333333;
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
    padding-bottom: 10px;
  }
  .tit-list{
    padding: 10px 15px;
    background: #E3EEF6;
    font-weight: bold;
  }
  .tit-label{
    width: 80px;
    color: #0099FF;
  }
  .tit-content{
    width: calc(100% - 80px);
    line-height: 30px;
  }
  .time-line{
    padding-top: 15px;
    .el-timeline{
      padding: 0;
    }
  }
  .time-tit{
    color: #333333;
    font-size: 16px;
  }
  .color9{
    color: #999999;
  }
  .time-line-success{
    color: #1CC19C;
  }
  .time-line-wait{
    color: #0099FF;
  }
  .preview{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 52px;
    background: #ffffff;
  }
  .color-gury{
    color: #999999;
  }
</style>