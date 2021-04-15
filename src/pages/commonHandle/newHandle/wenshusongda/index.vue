<template>
   <el-row class="body">
        <div class="tit">其他文书送达</div>
       <div class="body-content-button">
           <el-button type="primary" class="body-button">+ 查封扣押决定书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 延长查封扣押期限决定书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 查封扣押处理决定书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 停止供电（供应民用爆炸物品）通知书送达回执</el-button>
           
           <div class="body-button-bottom">
           <el-button type="primary" class="body-button">+ 停止供电（供应民用爆炸物品）决定书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 恢复供电（供应民用爆炸物品）通知书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 询问通知书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 先行登记保存证据处理决定书送达回执</el-button>
           </div>
           <div class="body-button-bottom">
           <el-button type="primary" class="body-button">+ 行政处罚听证会通知书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 缴纳罚款催告书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 加处罚款决定书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 延期（分期）缴纳罚款批准书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 案件移送书送达回执</el-button>
           </div>
           <div class="body-button-bottom">
           <el-button type="primary" class="body-button">+ 行政强制执行事先催告书送达回执</el-button>
           <el-button type="primary" class="body-button">+ 其他送达回执</el-button>
           </div>
       </div>
          <div class="img">
            <img src="../../../../assets/imgs/receipt.jpg" alt="" style="width:193px;height:102px">
            <p class="text">暂无回执</p>
          </div>
    </el-row> 
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
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
        padding-left:48%;
      }
    }
    .tit{
    background: #E3EEF6;
    font-size: 16px;
    color: #333333;
    text-indent: 15px;
    height: 24px;
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
  .matter{
    font-size: 14px;
    color: #333333;
    padding: 16px;
    box-sizing: border-box;
    height: 200px;
  }
  .matter-tit{
    width: 75px;
    margin-bottom:10px;
  }
  .matter-val{
    width: calc(100% - 75px);
    margin-bottom:10px;
  }
  .el-row {
    .el-col{
      padding-top: 16px;
    }
  }
  .card-footer{
    border-top: 1px solid #eeeeee;
    height: 46px;
    padding: 0 16px;
  }

  .status{
    background:#1CC19C;
    width: 105px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
  }
  .statuss{
    background:#1CC19C;
    width: 105px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
  }

  .status-waits{
     &:extend(.statuss);
    color:#FEFFFF;
    margin-top:8px;
  }
  .status-error{
    &:extend(.status);
    color: #ff0000;
  }

  .hover-font{
    color: #0099FF;
    padding:0 5px;
    &:hover{
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .align-items-center {
      align-items:normal;
  }
  .align-items-center-1{
      line-height: 47px;
  }
  .el-col-lg-8{
      width: 33%;
  }
</style>