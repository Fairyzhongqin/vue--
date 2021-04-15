<template>
  <div class="content">
    <div @click="backPage" class="back-button"><i class="el-icon-arrow-left"></i> 返回</div>

    <div class="font18">
      查看行政强制措施
    </div>

    <el-row :gutter="23">
      <el-col :lg="8" :md="12" :sm="24">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <div class="matter">
            <div class="flex justify-content-space-between align-items-center">
              <div class="matter-tit">
                文书标题：
              </div>
              <div class="matter-val">
                行政强制审批表
              </div>
            </div>
            <div class="flex justify-content-space-between align-items-center">
              <div class="matter-tit">
                文书编号：
              </div>
              <div class="matter-val">
                （宁）应急强审[2019]1号
              </div>
            </div>
            <div class="flex justify-content-space-between align-items-center">
              <div class="matter-tit">
                时间：
              </div>
              <div class="matter-val">
                2019年08月13日
              </div>
            </div>
            <div class="flex justify-content-space-between align-items-center">
              <div class="matter-tit">
                文书附件：
              </div>
              <div class="matter-val">
                <span class="color-gury">暂无</span>
                <a href="" class="hover-font">行政强制审批表.pdf</a>
              </div>
            </div>
          </div>
          <div class="card-footer flex justify-content-space-between align-items-center">
            <div class="status-wait">
              ● 待审核
            </div>

            <div>
              <span class="hover-font">文书浏览</span>
              <span class="hover-font">盖章</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="button-group">
      <button-group @click-button="preview" :buttonList="buttonList"></button-group>
    </div>
  </div>
</template>
<script>
import uploadProof from '@/components/uploadProof/index'
import buttonGroup from '@/components/buttonGroup/index'
export default {
  components: {
    uploadProof,
    buttonGroup
  },
  data() {
    return {
      buttonList: [
        {
          name: '返回',
          type: ''
        },
        {
          name: '继续生成行政强制措施',
          type: 'primary'
        }
      ]
    }
  },
  methods: {
    backPage() {
      // 返回
      this.$store.commit('setInspectionHandleadMeasuresisShow')
    },
    preview() {
      //
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  background: #fff;
  padding: 8px;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 16px 82px 33px;
  border-radius: 8px;
  position: relative;
}
.back-button {
  position: absolute;
  left: 16px;
  top: 18px;
  color: #0099ff;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.font18 {
  font-size: 18px;
  color: #333333;
}
.matter {
  font-size: 14px;
  color: #333333;
  padding: 16px;
  box-sizing: border-box;
  height: 200px;
}
.matter-tit {
  width: 75px;
}
.matter-val {
  width: calc(100% - 75px);
}
.el-row {
  .el-col {
    padding-top: 16px;
  }
}
.color-gury {
  color: #666666;
}
.card-footer {
  border-top: 1px solid #eeeeee;
  height: 46px;
  // line-height: 46px;
  padding: 0 16px;
}

.status {
  background: #eeeeee;
  width: 105px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
}

.status-wait {
  &:extend(.status);
  color: #1cc19c;
}

.status-error {
  &:extend(.status);
  color: #ff0000;
}

.hover-font {
  color: #0099ff;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
