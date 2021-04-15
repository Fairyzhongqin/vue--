<template>
  <div class="penalty-inspection-table">
    <div class="table-wrapper">
      <div class="enforcementInspection-inner wrapper-hooker">
        <!-- table -->
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-key="module === 'class' ? 'id' : 'deptCode'"
          border
          lazy
          :height="height"
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
          stripe
        >
          <el-table-column :prop="module === 'class' ? 'dataName' : 'deptName'" :label="
          module === 'class' ? '监管行业领域' : '设区市'" show-overflow-tooltip min-width="220">
            <template slot-scope="scope">
              <i class="iconBg"></i>
              <span style="margin-left: 4px">{{ module === 'class' ? scope.row.dataName : scope.row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="执法检查情况" align="center">
            <!-- 有弹窗：实际检查企业数（家） -->
            <el-table-column prop="actualExamine" label="实际检查企业数（家）" min-width="70" align="center">
              <template slot-scope="scope">
                <span
                  @click="showView(scope.row, '实际检查企业数（家）',  'inspectEnterpriseNum', 'sjjcqys')"
                  :class="{ 'click-perm': scope.row.perm }"
                  >{{ scope.row.actualExamine }}</span
                >
              </template>
            </el-table-column>

            <el-table-column prop="lyactualExaminePerc" label="实际检查数与上年同比（%）" min-width="95" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.lyactualExaminePerc }}</span>
              </template>
            </el-table-column>

            <!-- 有弹窗：检查规上企业数（家） -->
            <el-table-column prop="largeCompany" label="检查规上企业数（家）" min-width="80" align="center">
              <template slot-scope="scope">
                <span
                  @click="showView(scope.row, '检查规上企业数（家）', 'inspectEnterpriseNum', 'jcgsqys')"
                  :class="{ 'click-perm': scope.row.perm }"
                  >{{ scope.row.largeCompany }}</span
                >
              </template>
            </el-table-column>

            <el-table-column prop="largeComPercActualExam" label="检查规上企业数与实际检查企业总数占比（%）" min-width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.largeComPercActualExam }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="writNum" label="出具执法文书总数" min-width="60" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.writNum }}</span>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="chufaya" label="执法检查中发现的隐患及整改情况" align="center">
            <el-table-column prop="shiqianfakuan" label="一般隐患" align="center">
              <el-table-column prop="commonProb" label="隐患数量" show-overflow-tooltip min-width="55" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.commonProb }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="commonProbReview" label="整改数量" min-width="55">
                <template slot-scope="scope">
                  <span>{{ scope.row.commonProbReview }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="commonProbPercReview" label="整改率（%）" show-overflow-tooltip min-width="67" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.commonProbPercReview }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="重大隐患" align="center">
              <el-table-column prop="greatProb" label="隐患数量" show-overflow-tooltip min-width="55" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.greatProb }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="greatProbReview" label="整改数量" min-width="55">
                <template slot-scope="scope">
                  <span>{{ scope.row.greatProbReview }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="greatProbPercReview" label="整改率（%）" min-width="67" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.greatProbPercReview }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column prop="allProb" label="隐患总数" show-overflow-tooltip min-width="55" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.allProb }}</span>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="zip" label="立案情况" align="center">
            <!-- 有弹窗：立案总数（件） -->
            <el-table-column prop="allcase" label="立案总数（件）" min-width="63" align="center">
              <template slot-scope="scope">
                <span
                  @click="showView(scope.row, '立案总数（件）', 'unincorporateNum', '')"
                  :class="{ 'click-perm': scope.row.perm }"
                  >{{ scope.row.allcase }}</span
                >
              </template>
            </el-table-column>
            <!-- 有弹窗：事故立案数（件） -->
            <el-table-column prop="accidCase" label="事故立案数（件）" min-width="63" align="center">
              <template slot-scope="scope">
                <span
                  @click="showView(scope.row, '事故立案数（件）', 'unincorporateNum', '0')"
                  :class="{ 'click-perm': scope.row.perm }"
                  >{{ scope.row.accidCase }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="事前立案" align="center">
              <el-table-column label="立案数（件）" min-width="63" align="center">
                <!-- 有弹窗：总数（件） -->
                <el-table-column prop="preCase" label="总数（件）" min-width="86" align="center">
                  <template slot-scope="scope">
                    <span
                      @click="showView(scope.row, '事前立案总数（件）', 'unincorporateNum', '1')"
                      :class="{ 'click-perm': scope.row.perm }"
                      >{{ scope.row.preCase }}</span
                    >
                  </template>
                </el-table-column>
                <!-- 未实施经济处罚（件） -->
                <el-table-column prop="preCaseNoMoney" label="未实施经济处罚（件）" min-width="86" align="center">
                  <template slot-scope="scope">
                    <span
                      @click="showView(scope.row, '事前未实施经济处罚（件）', 'unincorporateNum', '4')"
                      :class="{ 'click-perm': scope.row.perm }"
                      >{{ scope.row.preCaseNoMoney }}</span
                    >
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="lyPreCasePerc" label="与上年同比（%）" min-width="90" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.lyPreCasePerc }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="prePercAll" label="与立案总数占比（%）" min-width="118" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.prePercAll }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="prePercActual" label="与实际检查企业数占比（%）" min-width="118" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.prePercActual }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="zip" label="经济处罚情况（万元）" align="center">
            <el-table-column prop="sumMoney" label="罚款总额" min-width="100" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sumMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="acciMoney" label="事故罚款额" min-width="100" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.acciMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column label="事前罚款" align="center">
              <el-table-column prop="preMoney" label="罚款额" min-width="100" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.preMoney }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="lyPreMoneyPerc" label="与上年同比（%）" min-width="75" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.lyPreMoneyPerc }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="preMPercAllM" label="与罚款总额占比（%）" min-width="80" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.preMPercAllM }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="preAvgMoney" label="案均值（万元/件）" min-width="95" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.preAvgMoney }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <!--展示列表弹窗 start-->
      <div v-if="modalVisiable" class="dialog-container">
        <el-dialog :title="modalTitle" :visible.sync="modalVisiable" width="1078px" height="600px" :close-on-click-modal="false">
          <component :is="modalCom" :classId="classId" :startTime="startTime" :endTime="endTime" :tabletype="inspectType" :module="'penalty'" :deptcode="selectDeptCode"></component>
        </el-dialog>
      </div>
    </div>
    <div class="bottomContent">
      <p>实际企业数统计规则：统计查询时间段内检查企业的数量，统计时间段内重复，多次检查计算一次！</p>
    </div>
  </div>
</template>
<script>
import { getZFJCQKData } from '@/api/manageSystem/index.js'
import inspectEnterpriseNum from '../detail/inspectEnterpriseNum'
import dangeExamineNum from '../detail/dangeExamineNum'
import unincorporateNum from '../detail/unincorporateNum'
export default {
  name: '',
  components: {
    inspectEnterpriseNum,
    dangeExamineNum,
    unincorporateNum
  },
  props: { 
    module: String, // 哪个 全省安全生产执法情况月度统计表 使用此组件：'depart' 部门；'class' 监管类别 
    tableData: Array, // 表格数据
    height: [String, undefined],
    startTime: String,
    endTime: String
  },
  data() {
    return {
      modalVisiable: false,
      modalTitle: '',
      inspectType: '',
      selectDeptCode: '',
      modalCom: '',
      classId: "" // 监管行业id
    }
  },
  methods: {
    load(tree, treeNode, resolve) {
      this.$emit('load', tree, treeNode, resolve)
    },
    showView(row, titleName, com, type) {
      if (row.perm) {
        this.selectDeptCode = row.deptCode
        this.modalTitle = row.deptName ? row.deptName.split('市')[0] + titleName : row.dataName + titleName
        this.modalCom = com
        this.inspectType = type
        if (this.module === 'class') {
          this.classId = row.id
        }
        this.modalVisiable = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.penalty-inspection-table {

    .enforcementInspection-inner {
      max-height: 72vh;
      width: 99%;
      /*  overflow-x: auto;
      overflow-y: auto; */
      overflow: auto;

      .iconBg {
        display: inline-block;
        width: 12px;
        height: 16px;
        background-image: url('~@/assets/imgs/tree/index1.png');
        background-size: 12px 16px;
        // background-position: 4px;
        background-repeat: no-repeat;
        // text-indent: 26px;
        // line-height: 26px;
        vertical-align: middle;
      }
      .click-perm {
        text-decoration: underline;
        color: rgba(2, 204, 255, 1);
        cursor: pointer;
      }
      // 表头
      /deep/.el-table .el-table__header thead .is-leaf {
        background: #192f5e !important;
      }

      /deep/.el-table thead.is-group th {
        background: #192f5e !important;
      }

      /deep/ .el-table--border th {
        border-right: 1px solid #465c89;
      }

      /deep/.el-table td {
        background: #2e436a;
        border-bottom: 1px solid #465c89;
        color: #fff;
      }

      /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
        background: #1d3258;
      }

      /deep/.el-table,
      .el-table__expanded-cell {
        background-color: transparent;
      }

      /deep/.el-table {
        border-radius: 0px;


        .el-table__body-wrapper {
          &::-webkit-scrollbar {
            /*横向滚动条样式*/
            height: 12px;
            background: transparent;
            border-radius: 4px;
          }

          &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
            background: rgba(91, 108, 130, 1);
          }

          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
            border-radius: 0;
            background: #2e436a;
          }
        }
      }

      /deep/.el-table--border,
      .el-table--group {
        border: none;
      }

      /deep/.el-table--border td {
        border-right: 1px solid #465c89;
      }

      /deep/.el-table th.is-leaf {
        border-bottom: 1px solid #465c89;
      }

      /deep/.el-table--border::after,
      .el-table--group::after {
        top: 0;
        right: 0;
        width: 0;
        height: 100%;
      }

      /deep/.el-table--border th,
      .el-table__fixed-right-patch {
        border-bottom: 1px solid #465c89;
      }

      /deep/.el-table::before {
        height: 0;
      }

      /* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
      /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: rgba(9, 26, 57, 1);
        color: #fff;
        /* 设置文字颜色，可以选择不设置 */
      }

      /deep/.el-icon-arrow-right:before {
        content: '\e6e0';
        color: #fff;
      }
    }

    /*竖项滚动条样式*/
    .enforcementInspection-inner::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 72px;
      background: transparent;
      border-radius: 4px;
    }

    .enforcementInspection-inner::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
      background: rgba(91, 108, 130, 1);
      // background: rgba(0, 0, 0, 0.2);
    }

    .enforcementInspection-inner::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
      // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: transparent;
      // background: rgba(0, 0, 0, 0.1);
    }
    /deep/.dialog-container {
      .el-dialog__wrapper {
        .el-dialog {
          background: #2e436a;
          .el-dialog__header {
            border-bottom: 1px solid #4e5878;
            .el-dialog__title {
              color: #ffffff;
            }
          }
        }
      }
    }

  // 下面的字
  .bottomContent {
    margin-top: 20px;
    margin: 0 auto;
    width: 640px;
    height: 15px;
    line-height: 15px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
  }
}
</style>
