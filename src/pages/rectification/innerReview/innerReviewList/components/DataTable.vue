<template>
  <!-- 延期整改复查的整改复查 -->
  <div class="innerReviewTable" id="yqzgfc_body">
    <tips v-if="!compBrowseShow" :tipName="['综合','浏览']" @clickHandle="clickHandle"></tips>
    <div class="lay">
      <el-table
        :data="tableData"
        border
        fit
        v-loading="loading"
        style="width: 100%"
        stripe
        :row-class-name="tableRowClassName"
        highlight-current-row
        :default-sort="{prop: 'date', order: 'descending'}"
        header-row-class-name="headerclass"
        @row-click="rowClick"
        :header-cell-style="getCellClass"
      >
        <el-table-column type="index" label="序号" width="70" :index="dataIndex" align="center"></el-table-column>
        <el-table-column prop="companyName" label="企业名称" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              style="cursor: pointer; text-decoration: underline;color: dodgerblue;"
              @click="viewEnterpriseInformation(scope.row.companyId,'modify','isDisabled')"
            >{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="整改复查项" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.reviewNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="整改时限" min-width="120" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <div v-html="splitToLine(scope.row.rectifyDisc)" slot="content"></div>
              <span
                v-html="splitToLine(scope.row.rectifyDisc)"
                class="oneLine"
              >{{scope.row.rectifyDisc}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="复查时间" min-width="120" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <div v-html="splitToLine(scope.row.reviewTimeDisc)" slot="content"></div>
              <span
                v-html="splitToLine(scope.row.reviewTimeDisc)"
                class="oneLine"
              >{{scope.row.reviewTimeDisc}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="复查合格项" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedNum}}</span>
          </template>
        </el-table-column>
        <!-- reviewType  复查类型  1-一次  2-二次  3-三次 4-四次 -->
        <el-table-column label="复查类型" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.reviewType === 1 ">一次复查</span>
            <span v-if="scope.row.reviewType === 2 ">二次复查</span>
            <span v-if="scope.row.reviewType === 3 ">三次复查</span>
            <span v-if="scope.row.reviewType === 4 ">四次复查</span>
            <span
              v-if="scope.row.reviewType == null || scope.row.reviewType == '' || !scope.row.reviewType "
            >复查类型出错,请联系管理员</span>
          </template>
        </el-table-column>

        <el-table-column label="复查人员" min-width="120" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.reviewName}}</span>
          </template>
        </el-table-column>
        <!-- @ApiModelProperty(value = "复查状态 0-待复查 1-已复查 2-复查中 3-超期未复查 4-超期复查中 5-超期已复查")
        private String reviewStatus;-->
        <el-table-column label="复查状态" min-width="115" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.reviewStatus === '0'">待复查</span>
            <span v-if="scope.row.reviewStatus === '1'">已复查</span>
            <span v-if="scope.row.reviewStatus === '2'">复查中</span>
            <span v-if="scope.row.reviewStatus === '3'">超期未复查</span>
            <span v-if="scope.row.reviewStatus === '4'">超期复查中</span>
            <span v-if="scope.row.reviewStatus === '5'">超期已复查</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" class="shortBut" @click="seeReview(scope.row)">复查</el-button>
            <!-- <el-button
              type="primary"
              class="shortBut"
              v-show="scope.row.reviewNum !== scope.row.qualifiedNum"
              @click="enterPush(scope.row)"
            >转办</el-button>-->
            <el-button type="primary" class="shortBut" @click="seeDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="企业信息" :visible.sync="dialogVisible" width="1200px" top="8vh">
        <div class="dialog_container" v-if="dialogVisible">
          <companyForm
            :isDialog="true"
            :enterpriseId="currentEnterpriseId"
            :type="compFormType"
            :isDisabled="isDisabled"
          ></companyForm>
        </div>
      </el-dialog>
      <!-- pagination -->
      <div class="pagination">
        <el-pagination
          :total="totalCount"
          :current-page.sync="currentPage"
          :page-size="10"
          @current-change="getPageData"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <!-- 转办人员 -->
    <!--  <el-dialog title="选择转办人员" width="990px" height="570px" :visible.sync="showEnterPush">
      <select-people :minNum="2" @getPeople="getSelectedPeople" v-if="showEnterPush"></select-people>
    </el-dialog>-->
    <comprehensive-browse
      v-if="compBrowseShow"
      nowMenu="400101"
      :inspectId="inspectId"
      @closeFrame="compBrowseShow=false"
    ></comprehensive-browse>
  </div>
</template>
<script>
import { showReviewListNormal, saveRectificationReview, saveRectificationDelayDetail } from '@/api/rectification/index'
import baseUrl from '@/utils/webIp'
import { splitToLine } from '@/utils/util'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
import { mapState } from 'vuex'
import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
export default {
  name: 'innerReviewTable',
  components: {
    selectPeople,
    companyForm,
    tips,
    comprehensiveBrowse
  },
  data() {
    return {
      loading: true,
      //   表格数据
      tableData: [],
      currentPage: 1,
      totalCount: 0,
      pageCache: '',
      //   转办人员
      showEnterPush: false,
      parentMsg: '',
      headers: { token: '' }, // 授权信息
      dialogVisible: false,
      compFormType: '', // 选择企业弹框的类型
      currentEnterpriseId: '',
      isDisabled: false,
      compBrowseShow: false,
      inspectId: ''
    }
  },
  methods: {
    /*  turnToNewPage() {
      this.$store.commit("setInnerReviewComponent", "NewInnerReview");
    }, */
    splitToLine,
    // 表格样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 9) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    // 根据 ReviewStatus 来 改变 行背景颜色
    tableRowClassName({ row, rowIndex }) {
      if (row.reviewStatus === '4') {
        return 'red-row'
      } else if (row.reviewStatus === '5') {
        return 'yellow-row'
      }
    },
    // index
    dataIndex(val) {
      return (this.pageCache - 1) * 10 + val + 1
    },
    //查看企业信息
    viewEnterpriseInformation(companyId, type, isDisabled) {
      if (isDisabled) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
      this.$store.commit('setNewRectificationShow')
      this.compFormType = type
      if (this.compFormType === 'modify') {
        this.currentEnterpriseId = companyId
      }
      this.dialogVisible = true
    },
    getListData(val) {
      this.loading = true
      showReviewListNormal({
        ...val,
        limit: '10',
        page: this.currentPage.toString()
      }).then(res => {
        if (res.code === '0') {
          // console.log("lalalalla的数据", res);
          this.tableData = res.data.list
          // console.log(this.tableData, "11111");
          this.currentPage = res.data.currPage
          this.totalCount = res.data.totalCount
          if (this.tableData) {
            this.loading = false
          }
          this.pageCache = res.data.currPage
        }
      })
    },
    //转办
    /*  enterPush(data) {
      this.parentMsg = data.reviewId; //延期整改复查——整改复查列表数据的reviewID
      this.showEnterPush = !this.showEnterPush;
      this.content = "selectPeople";
    }, */
    /*     getSelectedPeople(state, val) {
      if (val) {
        let ids =
          val.length >= 3
            ? `${val[0].id},${val[1].id},${val[2].id}`
            : `${val[0].id},${val[1].id}`;
        let params = {
          id: this.parentMsg,
          reviewNameId: ids
        };
        saveRectificationReview(params).then(res => {
          this.$message({
            type: "success",
            message: "转办成功！"
          });
          this.showEnterPush = false;
          this.getListData();
        });
      } else {
        this.showEnterPush = false;
      }
    }, */
    // pagination
    getPageData(val) {
      this.currentPage = val
      this.getListData(this.searchData)
      sessionStorage.setItem('innerReviewCurrPage', this.currentPage)
    },
    // 详情
    seeDetail(data) {
      console.log('延期整改复查详情啊啊啊啊啊=》》》', data)
      this.$store.commit('SET_NEW_REVIEW_STATUS', { id: data.id, flag: 'flagNewDetail' })
      this.$store.commit('setInnerReviewComponent', 'NewInnerReview')
    },
    // 复查
    seeReview(data) {
      console.log('复查___', data)
      this.$store.commit('SET_NEW_REVIEW_STATUS', { id: data.id, flag: 'flagNewReview' })
      this.$store.commit('setInnerReviewComponent', 'NewInnerReview')
    },
    clickHandle() {
      if (this.inspectId) {
        this.compBrowseShow = true
      } else {
        this.$message({
          type: 'warning',
          message: '请先选中一个案件'
        })
      }
    },
    rowClick(row) {
      this.inspectId = row.examineId
    }
  },
  created() {
    this.uploadFileUrl = baseUrl + '/aj/writ/uploadWritAccessory'
    this.headers.Authorization = localStorage.getItem('token')
    if (sessionStorage.getItem('innerReviewCurrPage')) {
      this.currentPage = Number(sessionStorage.getItem('innerReviewCurrPage'))
    }
  },
  mounted() {
    this.getListData()
  },
  activated() {
    this.inspectId = ''
  },
  watch: {
    searchData: {
      handler: function(val, oldVal) {
        this.getListData(val)
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['writTypeInfo'])
  }
}
</script>
<style lang="less" scoped>
.innerReviewTable {
  margin: 8px 8px 0;
  width: 98.5%;
  &#yqzgfc_body {
    position: relative;
    /deep/.all-writ-group {
      background: transparent;
      padding: 0;
      top: 12px;
    }
    .lay {
      background-color: #fff;
      border-radius: 8px;
      padding: 8px 8px 0;
      text-align: right;
      /deep/ .el-dialog__header {
        text-align: left;
      }
      /deep/ .el-table--border {
        border: none;
        th {
          color: #222222;
          font-size: 16px;
        }
      }
      // /deep/.el-table--scrollable-x .el-table__body-wrapper {
      //   overflow-x: hidden;
      // }
      // 若是溢出就省略号
      .oneLine {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  div:first-child {
    background: #ffffff;
    padding: 8px 8px 0;
    border-radius: 8px;
    .lineheight {
      height: 37px;
    }
    .el-table /deep/ tr.headerclass {
      height: 50px !important;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      font-size: 16px;
      font-family: PingFang SC;
    }
    .el-table td div {
      display: inline-block;
    }
    /deep/.el-table .cell,
    .el-table th div {
      padding-left: 10px;
    }
    .el-table--border {
      border: 0px;
    }
    // /deep/ .is-leaf {
    //   background: #e3eef6;
    // }
    .pagination {
      display: flex;
      flex-direction: row-reverse;
      height: 52px;
      line-height: 52px;
    }
    .check-button {
      padding: 9px 15px;
      height: 30px;
      line-height: 12px;
      width: 111px;
      margin-bottom: 16px;
    }
  }
  .el-button + .el-button {
    margin-left: 0px;
  }
  /deep/.el-table .cell td div {
    color: #222222;
    padding-left: 20px;
  }
  /deep/.el-table--border::after,
  .el-table--group::after {
    background: none;
  }
  /deep/.el-pagination__jump {
    margin-left: 0px;
  }
  /deep/.el-table th {
    padding: 12px 0px;
  }
  /deep/ .router-link-active {
    color: #1273eb;
  }
  /deep/.el-table--border th {
    border-right: 1px solid #e0e0e0;
  }
}
.dialog_container {
  height: 500px;
  overflow-y: scroll;
}
/deep/.el-table__fixed-right {
  width: 160px;
  height: 348px;
  top: 8px;
}
/deep/.el-table__fixed-right::before {
  height: 0;
}
</style>
