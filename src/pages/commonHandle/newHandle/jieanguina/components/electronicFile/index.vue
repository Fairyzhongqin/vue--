<template>
   <el-row class="body">
        <div class="tit">电子卷宗</div>
       <div class="body-content-button">
           <el-button type="primary" class="body-button" @click="dialogFormVisible = true">+ 制作卷宗首页</el-button>
           <el-button type="primary" class="body-button">+ 制作卷宗目录/内容</el-button>
       </div>
          <div class="img">
            <img src="../../../../../../assets/imgs/list_empty.png" alt="" style="width:193px;height:102px">
            <p class="text">暂无卷宗</p>
          </div>

          <el-dialog title="卷宗首页信息" :visible.sync="dialogFormVisible"> 
                <div class="form-body-center">
                <el-form :model="form">
                    <el-form-item label="案件名称：" :label-width="ruleformLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" placeholder="请输入案件名称"></el-input>
                    </el-form-item>
                    <el-form-item label="案由：" :label-width="ruleformLabelWidth">
                    <el-input v-model="form.event" autocomplete="off" placeholder="请输入案由"></el-input>
                    </el-form-item>
                    <el-form-item label="处理结果：" :label-width="ruleformLabelWidth">
                    <textarea v-model="form.result" autocomplete="off" style="resize:none"></textarea>
                    </el-form-item>
                    <div class="input">
                    <el-form-item label="立案日期：" :label-width="ruleformLabelWidth">
                    <input class="input-1" type="text" v-model="form.filDate" placeholder="输入立案日期">
                    </el-form-item>
                    <el-form-item label="结案日期：" :label-width="ruleformLabelWidth">
                    <input class="input-1" type="text" v-model="form.closeDate" placeholder="输入结案日期">
                    </el-form-item>
                    </div>
                     <div class="input">
                    <el-form-item label="归档日期：" :label-width="ruleformLabelWidth">
                    <input class="input-1" type="text" v-model="form.filingDate" placeholder="输入归档日期">
                    </el-form-item>
                    <el-form-item label="归档号：" :label-width="ruleformLabelWidth">
                    <input class="input-1" type="text" v-model="form.filingNumber" placeholder="输入归档号">
                    </el-form-item>
                    </div>
                     <div class="input">
                    <el-form-item label="承办人：" :label-width="ruleformLabelWidth">
                    <input class="input-1" type="text" v-model="form.contractor" placeholder="输入承办人">
                    </el-form-item>
                    <el-form-item label="保存期限：" :label-width="ruleformLabelWidth">
                    <input class="input-1" type="text" v-model="form.duration" placeholder="输入保存期限，比如“10年”">
                    </el-form-item>
                    </div>
                </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">制作卷宗首页</el-button>
                </div>
                </el-dialog>
    </el-row> 
</template>

<script>
export default {
  data() {
    return{
       dialogFormVisible: false,
       form:{
          name:'',
          event:'',
          result:'',
          filDate:'',
          closeDate:'',
          filingDate:'',
          filingNumber:'',
          duration:''
          },
          ruleformLabelWidth: '105px',
    }
  }   
}
</script>
<style lang="less" scoped>
    .tit{
    background: #E3EEF6;
    font-size: 16px;
    color: #333333;
    text-indent: 15px;
    font-family:PingFang SC;
    font-weight:bold;
    }
   .body-content-button{
        padding-top:18px;
        .body-button{
        height:30px;
        background:#0099FF;
        border-radius:5px;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:6px;
    }
    .body-button-bottom{
            padding-top:18px;
        }
  }
  .img{
        width: 100%;
        height: 100%;
        padding-top:50px;
        text-align: center;
      .text{
        width:56px;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:500;
        color:#ccc;
        padding-left:47%;
      }
    }
    .el-form-item{
      margin-bottom:0px;
    }
    /deep/.el-input__inner{
      width:95.7%;
      height:30px;
      border:1px solid rgba(204, 204, 204, 1);
      border-radius:5px;
    }
    /deep/.el-form-item__label{
      text-align: left;
      width: 0px;
      padding-left:23px;
    }
    textarea{
      width:94.3%;
      height:122px;
      border:1px solid rgba(204, 204, 204, 1);
      border-radius:5px;
      margin-top:6px;
      padding:5px;
    }
    .input{
      display: flex;
    }
    .input-1{
      width:349px;
      height:26px;
      border:1px solid rgba(204, 204, 204, 1);
      border-radius:5px;
      margin-bottom:5px;
      padding:0px 10px;
    }
    /deep/.el-dialog__title{
      width:96px;
      height:16px;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:38px;
    }
    /deep/.el-dialog__header{
      margin-bottom:10px;
    }
    /deep/.el-dialog__body{
       height: 450px;
    }
    /deep/.el-dialog{
        width:990px;
        background:rgba(255,255,255,1);
        border-radius:5px;
    }
</style>