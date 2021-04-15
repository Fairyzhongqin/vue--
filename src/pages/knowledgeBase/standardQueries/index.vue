<template>
  <div class="body">
    <el-row v-for="(item, index) in buttonList" :key="index" class="check-card-sq">
      <el-col :span="12" v-for="(child, i) in item" :key="i">
        <el-card class="card-style-sq">
          <div :class="child.style" class="button-style-sq"></div>
          <div class="card-text-sq">
            <p> {{ child.content }} </p>
            <p> 查询网址：<a :href="child.path" target="_Blank">{{ child.path }}</a> </p>
            <p v-if="child.wxCode"> 查询公众号：{{ child.wxCode }} </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                buttonList: [
                    [
                        {
                            style: 'tzzy-content',
                            content: '特种作业操作证（管理单位：应急管理部（安监总局））',
                            path: 'http://cx.mem.gov.cn/',
                            wxCode: '“国家安全生产考试”微信公众号'
                        },
                        {
                            style: 'tzsb-content',
                            content: '特种设备从业人员（特种设备操作证）(管理单位：质检总局)',
                            path: 'http://www.cnse.gov.cn/',
                            wxCode: ''
                        }

                    ],
                    [
                        {
                            style: 'jzsg-content',
                            content: '建筑施工特种作业（管理单位：住建部）',
                            path: 'http://www.mohurd.gov.cn',
                            wxCode: ''
                        },
                        {
                            style: 'gjbz-content',
                            content: '国家标准全文公开系统',
                            path: 'http://openstd.samr.gov.cn/bzgk/gb/index',
                            wxCode: ''
                        }
                    ]
                ]
            }
        },

    }
</script>
<style lang="less" scoped>
  .check-card-sq {
    height: 220px;
    padding: 8px 4px 0;

    .el-col {
      padding: 0 4px;
      height: 220px;
    }
  }

  .card-style-sq /deep/ .el-card__body {
    display: flex;
    flex-direction: row;
    position: relative;
    cursor: pointer;
    height: 150px;
  }

  .card-text-sq {
    padding-left: 10px;
    font-size: 18px;
    font-weight: bold;
    p{
      display: block;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      color: #666;
      a {
        color: #0063dd;
      }
    }
  }

  .tzzy-content {
    background: url('~@/assets/imgs/wjj.png') no-repeat center;
  }
  .tzsb-content {
    background: url('~@/assets/imgs/xrr.png') no-repeat center;
  }
  .jzsg-content {
    background: url('~@/assets/imgs/qzj.png') no-repeat center;
  }
  .gjbz-content {
    background: url('~@/assets/imgs/xbb.png') no-repeat center;
  }


  .button-style-sq {
    width: 150px;
    height: 150px;
  }

  .body {
    height: 80vh;
    position: relative;
  }

</style>
