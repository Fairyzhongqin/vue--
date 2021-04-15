<template>
    <div class="content-list">
          <el-row>
            <el-col :span="2">
              被处罚单位：
            </el-col>
            <el-col :span="8">
              江阴市五彩斑斓家具有限公司
            </el-col>
            <el-col :span="2">
              法人：
            </el-col>
            <el-col :span="8">
              陈建
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              负责人：
            </el-col>
            <el-col :span="8">
              陈建
            </el-col>
            <el-col :span="2">
              职务：
            </el-col>
            <el-col :span="8">
              董事长
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              单位电话：
            </el-col>
            <el-col :span="8">
              1552405215
            </el-col>
           <el-col :span="2">
              邮政编码：
            </el-col>
            <el-col :span="8">
              —— ——
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="2">
              地址：
            </el-col>
            <el-col :span="8">
              江阴市啥啥区幸福大道252号清扬村二组
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="2">
              承办人：
            </el-col>
            <el-col :span="8">
              王晓明、孙亚亚
            </el-col>
           <el-col :span="2">
              承办单位：
            </el-col>
            <el-col :span="8">
              安全生产监察大队
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              处理结果：
            </el-col>
            <el-col :span="8">
              <textarea name="" id="" cols="61" rows="3" 
              style="resize:none" 
              v-model="textarea">
            </textarea>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              执行情况：
            </el-col>
            <el-col :span="8">
              <el-input v-model="input" placeholder="请输入执行情况"></el-input>
            </el-col>
          </el-row>
          <div class="button-group">
            <button-group :buttonList="buttonList"></button-group>
          </div>
        </div>
        
</template>
<script>
import buttonGroup from '@/components/buttonGroup/index';
export default {
  components:{
    buttonGroup
  },
    data() {
        return {
        textarea: '',
        input:'',
         buttonList: [
        {
          type: 'primary',
          name: '保存'
        },{
          type: 'primary',
          name: '制作结案审批表',
          fun: () => {
            this.$parent.setComponentId('previewCase');
          }
        }
      ]
        }
  }
}
</script>

<style lang="less" scoped>
.content-list{
    line-height: 30px;
    // padding: 14px;
    color: #333333;
  }
  textarea{
    border:1px solid rgba(204, 204, 204, 1);
    border-radius:5px;
    padding:8px;
    width:872px;
    height:103px;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:22px;
    }
    /deep/.el-input > .el-input__inner{
        width:890px;
        height:30px;
        border:1px solid rgba(204, 204, 204, 1);
        border-radius:5px;
    }
    .el-col-8{
        width: 38%;
    }
    .el-col-2{
        width: 9%;
    }
    .el-row{
        padding-bottom:5px;
        
    }
</style>