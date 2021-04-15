<template>
  <div class="is-view-container" :class="forBrowse?'for_browse':''" v-loading="fullscreenLoading">
    <sn-page-bar>
      <template slot="button">
        <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
      </template>
      <!-- <div class="bar-title">检查方案详情页面</div> -->

      <el-row class="is-view-content">
        <el-col :span="16" class="view-detail">
          <div class="create-tab-title">基本信息</div>
          <div class="basic-content">
            <el-row>
              <div>企业名称：{{basicData.companyName}}</div>
            </el-row>
            <el-row>
              <div>计划检查时间：{{basicData.examineTime}}</div>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div>检查方式：{{basicData.examineTypeName}}</div>
              </el-col>
              <el-col :span="12">
                <div>检查形式：{{basicData.examSocCodeName}}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div>执法人员：{{basicData.executorName}}</div>
              </el-col>
              <el-col :span="12">
                <div>执法部门：{{basicData.executorDeptName}}</div>
              </el-col>
            </el-row>
            <el-row class="remark">
              <el-col :span="24">
                <span class="beizhu">备注：{{basicData.remark}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="create-tab-title">检查内容</div>
          <check-node
            v-for="(nodeData, index) in basicData.probList"
            :delStatus="false"
            :nodeData="nodeData"
            :key="index"
            :indexShow="index"
            :view="true"
          ></check-node>
        </el-col>
        <el-col :span="8" class="view-timeline">
          <div class="create-tab-title">审核审批流程</div>
          <sn-time-line :lineData="auditList"></sn-time-line>
        </el-col>
      </el-row>
    </sn-page-bar>
    <bottom-bar>
      <el-button v-if="!forBrowse" @click="close()">返回</el-button>
      <el-button type="primary" @click="editDoc()">浏览检查方案文书</el-button>
    </bottom-bar>

    <!--pdf begin-->
    <!-- <el-dialog width="800px"
               height="6000px"
               top="0vh"
               :visible.sync="pdfDialog"
               class="sepcialyulanDialog">
      <show-pdf :pdfId="pdfId"></show-pdf>
    </el-dialog>-->
    <show-pdf :pdfId="pdfId" v-if="pdfDialog" @closePdf="pdfDialog = false" :writName="writName"></show-pdf>
    <!-- <loading-gif :showLoading="showLoading"></loading-gif> -->
    <!--pdf end-->
  </div>
</template>

<script>
import { info, flow } from '@/api/inspectionScheme'
import bottomBar from '@/components/bottomBar'
import snPageBar from '@/components/snPageBar/index'
import snTimeLine from '@/components/TimeLine'
import checkNode from '../components/checkNode'
import showPdf from '@/components/showPdf/index'
// import LoadingGif from '@/components/LoadingGif/index'

export default {
  props: {
    param: {
      type: [Number, String, Array, Object]
    },
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  components: {
    bottomBar,
    snPageBar,
    snTimeLine,
    checkNode,
    showPdf
    // LoadingGif,
  },
  data() {
    return {
      basicData: {},
      checkList: [
        {
          discretionId: '1001',
          discretionTypeCode: 'fl006',
          discretionTypeName: '安全技术服务类',
          tradeCode: 'd01',
          lawCode: 'fl001',
          examineContent: '测试检查内容信息',
          unlawfulAct: '违法信息',
          lawProvisionRule: '相关的内容规则细腻在',
          lawProvisionsContent: '数据库的咖啡121暗黑法师开始',
          penalizeBasisRule: null,
          penalizeBasisContent: null,
          hasLevel: '0',
          hasBussinessRule: '1',
          superviseItemCode: null,
          orderNum: '1',
          children: [
            {
              discretionRulesId: '1',
              discretionId: '1001',
              rules: '问问',
              violateRules: '121',
              label: '问问',
              id: 10010001
            },
            {
              discretionRulesId: '2',
              discretionId: '1001',
              rules: '2饿4312',
              violateRules: '413',
              label: '2饿4312',
              id: 10010002
            }
          ],
          label: '测试检查内容信息',
          id: 1001,
          oldChildren: [
            {
              discretionRulesId: '1',
              discretionId: '1001',
              rules: '问问',
              violateRules: '121',
              label: '问问',
              id: 10010001
            },
            {
              discretionRulesId: '2',
              discretionId: '1001',
              rules: '2饿4312',
              violateRules: '413',
              label: '2饿4312',
              id: 10010002
            }
          ]
        },
        {
          discretionId: '1002',
          discretionTypeCode: 'fl001',
          discretionTypeName: '综合类',
          tradeCode: 'd02',
          lawCode: 'fl002',
          examineContent: '测试内容1123123',
          unlawfulAct: '上帝就发阿斯蒂芬',
          lawProvisionRule: '啊打发士大夫啊打发',
          lawProvisionsContent: '啊打发士大夫啊打发',
          penalizeBasisRule: null,
          penalizeBasisContent: null,
          hasLevel: '0',
          hasBussinessRule: '1',
          superviseItemCode: null,
          orderNum: '1',
          children: [
            {
              discretionRulesId: '3',
              discretionId: '1002',
              rules: '123',
              violateRules: '12312',
              label: '123',
              id: 10020003
            }
          ],
          label: '测试内容1123123',
          id: 1002,
          oldChildren: [
            {
              discretionRulesId: '3',
              discretionId: '1002',
              rules: '123',
              violateRules: '12312',
              label: '123',
              id: 10020003
            }
          ]
        }
      ],
      auditList: [], // 审核审批信息
      pdfDialog: false,
      pdfId: null,
      writName: '',
      // showLoading:false,
      fullscreenLoading: true
    }
  },
  created() {
    console.info('let me see ', this.param)
    info({
      id: this.param
    }).then(res => {
      if (res.code === '0') {
        this.auditList = res.auditList
        if (this.auditList) {
          this.fullscreenLoading = false
        }
        // console.info("检查方案的详情",res)
        this.basicData = res.data
        if (res.data.writId) {
          this.showFlow(res.data.writId)
        }
      }
    })
  },
  methods: {
    back() {
      this.$emit('changeView', 'isList')
    },
    close() {
      this.$emit('changeView', 'isList')
    },
    showFlow(id) {
      // 获取审核审批流程
      flow({
        requestId: id
      }).then(res => {
        if (res.code === '0') {
          this.auditList = res.data
        }
      })
    },
    editDoc() {
      // 浏览文书
      if (!this.basicData.writId) {
        this.$message({
          showClose: true,
          message: '未生成检查方案文书',
          type: 'warning'
        })
      } else {
        this.writName = '现场检查方案'
        this.pdfId = this.basicData.writId
        this.pdfDialog = true
      }
    }
  }
}
</script>

<style lang="less">
.sepcialyulanDialog {
  /deep/ .el-dialog__header {
    padding: 33px 20px 10px;
  }
}
.beizhu {
  word-break: break-all;
}
.is-view-container {
  // 综合浏览样式
  &.for_browse {
    .create-container {
      padding: 0;
      .create-bar {
        .flex_box {
          padding: 0;
          border: none;
          box-shadow: none;
          .bar-left {
            display: none;
            .is-view-content {
              margin-top: 0;
            }
          }
        }
        p.copyright_main {
          display: none;
        }
      }
    }
  }
  .is-view-content {
    margin-top: 20px;
    /deep/ .el-timeline {
      padding-left: 20px;
      padding-top: 10px;
    }
    .view-timeline {
      padding-left: 15px;
    }
    .view-detail {
      padding-right: 25px;
      box-shadow: 1px 0 0px 0px #ccc;
      .basic-content {
        padding-top: 10px;
        padding-left: 10px;
        padding-bottom: 25px;
        /deep/ .el-row:not(.remark) {
          height: 30px;
          // line-height: 38px;
        }
      }
    }
  }
}
</style>
