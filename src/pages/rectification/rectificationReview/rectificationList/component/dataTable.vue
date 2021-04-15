<template>
  <!-- 整改复查本查 -->
  <div class="body" id="zgfc_body">
    <tips v-if="!compBrowseShow" :tipName="['综合','浏览']" @clickHandle="clickHandle"></tips>
    <div class="lay">
      <el-table
        :data="tableData"
        border
        fit
        v-loading="loading"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        stripe
        highlight-current-row
        :default-sort="{prop: 'date', order: 'descending'}"
        @row-click="rowClick"
        header-row-class-name="headerclass"
        :header-cell-style="getCellClass"
        ref="goodsDetailTable"
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
        <el-table-column
          label="整改复查项"
          width="110"
          align="center"
          show-overflow-tooltip
          style="padding-left:0;padding-right:0;"
        >
          <template slot-scope="scope">
            <span>{{scope.row.reviewNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="整改时限" min-width="110" align="center">
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
        <el-table-column
          label="复查合格项"
          width="110"
          align="center"
          show-overflow-tooltip
          style="padding-left:0;padding-right:0;"
        >
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
        <el-table-column label="复查人员" min-width="120" align="center" show-overflow-tooltip>
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
        <el-table-column label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" class="shortBut" @click="seeReview(scope.row)">复查</el-button>
            <!-- 只有在一次复查和未复查状态  才可以转办 -->
            <el-button
              type="primary"
              class="shortBut"
              v-if="scope.row.reviewStatus === '0' &&  scope.row.reviewType === 1 "
              @click="enterPush(scope.row)"
            >转办</el-button>
            <el-button type="primary" class="shortBut" @click="seeDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :total="totalCount"
          :current-page.sync="currentPage"
          :page-size="10"
          @current-change="getNewList"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
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

    <el-dialog title="选择转办人员" width="900px" height="600px" :visible.sync="showEnterPush">
      <select-people :minNum="2" @getPeople="getSelectedPeople" v-if="showEnterPush"></select-people>
    </el-dialog>
    <comprehensive-browse
      v-if="compBrowseShow"
      nowMenu="400101"
      :inspectId="inspectId"
      @closeFrame="compBrowseShow=false"
    ></comprehensive-browse>
  </div>
</template>

<script>
import { saveRectificationReview, showRectificationReviewList, saveRectificationDelayDetail, showReviewListNormal } from '@/api/rectification/index'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import showPdf from '@/components/showPdf/index'
import baseUrl from '@/utils/webIp'
import { splitToLine } from '@/utils/util'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
import { mapState } from 'vuex'
import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
export default {
  components: {
    selectPeople,
    showPdf,
    companyForm,
    tips,
    comprehensiveBrowse
  },
  name: 'dataTable',
  data() {
    return {
      content: '',
      isShow: true,
      currentPage: 1,
      totalCount: 0,
      tableData: [],
      loading: true,
      showEnterPush: false,
      dialogContent: null,
      dialogTitle: '浏览文书',
      dialogClass: 'big-dialog',
      pdfId: null,
      showPdfDialog: false,
      parentMsg: '',
      uploadFileUrl: '', // 上传路径
      headers: { token: '' }, // 授权信息
      id: '',
      params: {
        writId: '',
        type: '0' // 0 签字附件 1 其他附件
      },
      examineDelay: {
        reviewId: ''
      },
      pageCache: 1,
      dialogVisible: false,
      compFormType: '', // 选择企业弹框的类型
      currentEnterpriseId: '',
      isDisabled: false,
      compBrowseShow: false,
      inspectId: ''
    }
  },
  props: {
    searchData: {
      type: Object
    }
  },
  methods: {
    splitToLine,
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 9) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    // 根据 ReviewStatus 来 改变 行背景颜色
    tableRowClassName({ row, rowIndex }) {
      if (row.reviewStatus === '3') {
        return 'red-row'
      } else if (row.reviewStatus === '4') {
        return 'red-row'
      } else if (row.reviewStatus === '5') {
        return 'yellow-row'
      }
    },

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
    // 上传签字文书
    toWritList(val) {
      this.$store.commit('setDetailId', {
        id: val.id,
        flag: 'flagDetail',
        isRectificationWrit: true
      })
      this.$store.commit('setRectificationCurrentComponent', 'newRectification')
    },
    // 复查
    seeReview(data) {
      this.$store.commit('setDetailId', { id: data.id, flag: 'flagSee' })
      this.$store.commit('setRectificationCurrentComponent', 'newRectification')
    },
    // 详情
    seeDetail(data) {
      this.$store.commit('setDetailId', { id: data.id, flag: 'flagDetail' })
      this.$store.commit('setRectificationCurrentComponent', 'newRectification')
    },
    //修改
    updataReview(data) {
      this.$store.commit('setDetailId', { id: data.id, flag: 'flagUpdate' })
      this.$store.commit('setRectificationCurrentComponent', 'newRectification')
    },
    //转办
    enterPush(data) {
      this.parentMsg = data.id
      this.showEnterPush = !this.showEnterPush
      this.content = 'selectPeople'
      // this.getshowRectificationReviewList();
    },
    getSelectedPeople(state, val) {
      if (val) {
        console.log('选择人员时', state, val)
        let ids = val.length >= 3 ? `${val[0].id},${val[1].id},${val[2].id}` : `${val[0].id},${val[1].id}`
        let params = {
          id: this.parentMsg,
          reviewNameId: ids
        }
        saveRectificationReview(params).then(res => {
          this.$message({
            type: 'success',
            message: '转办成功！'
          })
          this.showEnterPush = false
          this.getshowRectificationReviewList()
        })
      } else {
        this.showEnterPush = false
      }
    },
    //浏览文书
    seeBook(val) {
      if (val.writId && val.writId !== '') {
        this.pdfId = val.writId
        this.showPdfDialog = true
        this.dialogClass = 'big-dialog'
        this.dialogContent = 'pdf'
        this.dialogTitle = '查看整改复查意见书'
      } else {
        this.$alert('该条数据没有文书', null, {
          confirmButtonText: '确定'
        })
      }
    },
    setDialog() {
      this.dialogContent = null
      this.pdfId = null
      this.showPdfDialog = false
    },
    //上传签字文书
    uploadDoc(val) {
      this.params = {
        writId: val.writId,
        type: '0'
      }
    },
    uploadSuccessful(info) {
      if (info.code === '0') {
        this.$message({
          type: 'success',
          message: '文件上传成功！'
        })
        this.$emit('afterUpload')
      } else {
        this.$message({
          type: 'error',
          message: info.msg
        })
      }
    },
    beforeUpload(file) {
      let typeList = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (typeList.indexOf(file.type) < 0) {
        this.$message({
          type: 'error',
          message: '请上传正确的附件格式：图片或PDF文件！'
        })
      }
    },
    //展示延期整改复查——整改复查列表
    getshowRectificationReviewList(val) {
      this.loading = true
      showRectificationReviewList({
        ...val,
        limit: '10',
        page: this.currentPage.toString()
      })
        .then(res => {
          if (res.code === '0') {
            // console.log('整改复查列表', res)
            this.tableData = res.data.list
            this.currPage = res.data.currPage
            this.totalCount = res.data.totalCount

            if (this.tableData) {
              this.loading = false
            }
            this.pageCache = res.data.currPage
          }
        })
        .catch(err => {
          console.info(err)
        })
    },

    // 请求对应页数的数据list
    getNewList(val) {
      this.currPage = val
      sessionStorage.setItem('rectificationListCurrPage', this.currentPage)
      this.getshowRectificationReviewList(this.searchData)
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
    if (sessionStorage.getItem('rectificationListCurrPage')) {
      this.currentPage = Number(sessionStorage.getItem('rectificationListCurrPage'))
    }
    if (this.$store.state.reloadListFlag) {
      this.getshowRectificationReviewList(this.searchData)
      this.$store.commit('resetReloadList', false)
    }
  },
  activated() {
    this.getshowRectificationReviewList(this.searchData)

    this.inspectId = ''
  },

  watch: {
    // 监控搜索条件，调用查询接口
    searchData: {
      handler: function(val, oldVal) {
        this.getshowRectificationReviewList(val)
      },
      deep: true
    }
  },
  computed: {
    getDialogClass() {
      return this.dialogClass
    }
  }
}
</script>

<style lang="less" scoped>
#zgfc_body {
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
    /deep/ .el-table--border {
      border: none;
      th {
        color: #222222;
        font-size: 16px;
      }
    }
  }
}
/deep/.el-table .cell.el-tooltip {
  text-overflow: clip;
}
.showPdfStyle {
  width: 100%;
}
.shortBut {
  width: 40px;
  height: 24px;
  font-size: 14px;
  padding: 7px 3px !important;
}
.body {
  margin: 8px 8px 0;
  width: 98.5%;
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
  // 若是溢出就省略号
  .oneLine {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  // fixed 的背景
  /deep/.el-table__fixed-right::before {
    background: transparent;
  }
}
/deep/ .el-table--border th {
  border-color: #e0e0e0;
}
.el-button--danger:active,
.el-button--danger:focus {
  background: #fef0f0;
  color: #dd6161;
  border-color: #fbc4c4;
}
.dialog_container {
  height: 500px;
  overflow-y: scroll;
}
/deep/.el-table__fixed-right {
  width: 200px;
  height: 348px;
  top: 8px;
}
</style>
