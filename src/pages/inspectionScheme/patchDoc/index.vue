<template>
  <div>
    <div class="patch-doc">
      <div class="patch-doc-back">
        <el-button type="text" icon="el-icon-arrow-left" @click="giveUp()">返回</el-button>
      </div>
      <div class="patch-doc-title">补录签字文书</div>
      <div class="patch-doc-container">
        <el-row type="flex">
          <el-button type="primary" size="mini" @click="dialogVisiable = true">关联现场检查记录</el-button>
          <el-upload
            style="margin-left:10px"
            :action="action"
            :headers="header"
            :data="params"
            :on-success="uploadSuccessful"
            :on-error="uploadFailed"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            multiple
            :disabled="Object.keys(info).length ==0"
          >
            <el-button
              plain
              icon="el-icon-upload2"
              size="mini"
              type="primary"
              :disabled="Object.keys(info).length ==0"
            >上传签字文书</el-button>
          </el-upload>
        </el-row>
        <div class="patch-doc-container-info" v-if="Object.keys(info).length !=0">
          <!-- <div class="create-tab-title">基本信息</div> -->
          <el-row>
            <el-col :span="10">
              <span>企业名称：</span>
              <span>{{info.companyName}}</span>
            </el-col>
            <el-col :span="10">
              <span>检查时间：</span>
              <span>{{info.examineTime}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <span>检查方式：</span>
              <span>{{info.examineTypeName}}</span>
            </el-col>
            <el-col :span="10">
              <span>执法人员：</span>
              <span>{{info.executorName}}</span>
            </el-col>
          </el-row>
          <el-row type="flex">
            <span>签字文书：</span>
            <div>
              <div v-for="(doc, index) in info.accessoryList" :key="index">
                <el-button
                  type="text"
                  icon="el-icon-paperclip"
                  size="mini"
                  @click="fileUrl(doc)"
                >{{doc.accessoryName}}</el-button>
              </div>
            </div>
          </el-row>
        </div>
        <sn-empty-data text="暂无签字文书" v-else></sn-empty-data>
        <!--弹出框-->
        <el-dialog
          title="关联现场检查记录"
          :visible.sync="dialogVisiable"
          :before-close="close"
          width="1000px"
          :close-on-click-modal="false"
        >
          <el-form :inline="true" :model="formInline">
            <el-form-item label="企业名称：">
              <el-input v-model="formInline.companyName" placeholder="请输入企业名称"></el-input>
            </el-form-item>
            <el-form-item label="检查时间：">
              <el-date-picker
                v-model="formInline.date"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="yyyy/MM/dd"
                type="daterange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
          <!--列表-->
          <el-table
            :data="tableData"
            :border="true"
            stripe
            style="margin-top:10px"
            highlight-current-row
            @current-change="handleSelectionChange"
          >
            <el-table-column width="80">
              <template slot-scope="scope">
                <div class="mixed-column flex flex-row">
                  <div class="index-num">{{scope.$index + 1}}</div>
                  <el-checkbox v-model="scope.row.checked" class="check"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="examineStartTime" label="实际检查时间"></el-table-column>
          </el-table>
          <!-- 分页 -->
           <el-row type="flex" justify="end" style="margin-top:10px">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="totalCount"
              ></el-pagination>
            </el-row>
          <!-- 操作 -->
          <el-row type="flex" justify="end" style="margin-top:10px">
            <el-button type="primary" size="mini" @click="submit">确定</el-button>
            <el-button size="mini" style="margin-right:8px" @click="close">取消</el-button>
          </el-row>
        </el-dialog>
        <el-dialog :visible.sync="isPreviewVis" :before-close="closeDialog" :class="dialogClass">
          <img :src="previewAsset" v-if="dialogContent === 'img'" />
          <!-- <show-pdf :pdfId="previewAsset"  v-if="dialogContent === 'showPdf'" :pdfType="'accessory'">
          </show-pdf>-->
        </el-dialog>
        <show-pdf
          :pdfId="previewAsset"
          v-if="dialogContent === 'showPdf'"
          :pdfType="'accessory'"
          @closePdf="dialogContent = null"
        ></show-pdf>
      </div>
    </div>
    <div class="buttonStyle">
      <el-button @click="backPage()" :disabled="Object.keys(info).length ==0">保存并关闭</el-button>
      <el-button @click="giveUp()" :disabled="Object.keys(info).length ==0">放弃</el-button>
    </div>
  </div>
</template>

<script>
import snPageBar from "@/components/snPageBar";
import snEmptyData from "@/components/snEmptyData";
import { getInspectionData } from "@/api/onSiteInspection";
import { supplementPlan, upload } from "@api/enterpriseInfo/index";
import { dateFormat } from "@/utils/util";
import baseUrl from "@/utils/webIp";
import { info, delexamine } from "@api/inspectionScheme/index";
import showPdf from "@/components/showPdf/index";
export default {
  components: {
    snPageBar,
    snEmptyData,
    showPdf
  },
  data() {
    return {
      relationId: "", //关联的id
      isPreviewVis: false,
      dialogClass: "",
      dialogContent: "",
      info: {},
      showInfo: false,
      dialogVisiable: false,
      formInline: {
        companyName: "",
        date: []
      },
      currentPage: 1,
      totalCount: 0,
      tableData: [],
      currentRow: {},
      params: {
        id: ""
      },
      header: "",
      action: `${baseUrl}/aj/planexamine/upload`
    };
  },
  created() {
    this.timeInit();
    let token = localStorage.getItem("token");
    this.header = { Authorization: token };
    this.search();
  },
  methods: {
    //放弃
    giveUp() {
      if (Object.keys(this.info).length == 0) {
        this.backPage();
      } else {
        this.$confirm("是否放弃关联现场检查记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning"
        }).then(() => {
          delexamine({
            id: this.relationId
          })
            .then(res => {
              if (res.code === "0") {
                this.$message.success("放弃成功");
                this.backPage();
              } else {
                this.$message.error("放弃失败");
              }
            })
            .catch(error => {
              this.$message.error("网络错误");
            });
        });
      }
    },
    //关联现场检查记录
    open() {
      this.timeInit();
      this.search();
      this.dialogVisiable = true;
    },
    //初始时间
    timeInit() {
      let endTime = new Date();
      let startTime = new Date();
      startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 30);
      this.formInline.date[0] = startTime;
      this.formInline.date[1] = endTime;
      this.$set(this.formInline.date);
    },
    //取消
    close() {
      this.timeInit();
      this.search();
      this.dialogVisiable = false;
    },
    closeDialog() {
      this.previewAsset = "";
      this.isPreviewVis = false;
      this.dialogContent = "";
      this.dialogClass = "";
    },
    uploadSuccessful(info) {
      this.$loading.hiddenLoading()
      if (info.code === '0') {
        this.$message({
          type: "success",
          message: "文件上传成功！"
        });
        this.getInfo();
      } else {
          this.$message({
          type: 'error',
          message: info.msg
        })
      }
    },
    uploadFailed(err) {
      this.$loading.hiddenLoading()
      this.$message({
        type: "success",
        message: err
      });
    },
    beforeAvatarUpload(file) {
      let typeList = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"
      ];
      let fileNameReg = /[#$@&%',;=?$/]/gi
      if (typeList.indexOf(file.type) < 0) {
        this.$message({
          type: "error",
          message: "请上传正确的附件格式：图片或PDF文件！"
        });
        return false
      } 
      if (fileNameReg.test(file.name)) {
        this.$alert("文件名不能包含特殊字符，请修改后再试", null, {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return false
      }
      
      this.$loading.showLoading()
      return true
    },

    getInfo() {
      let id = this.$store.state.planexamineId;
      this.params = {
        id: id
      };
      if (id) {
        info({ id: id }).then(result => {
          this.info = result.data;
        });
      }
    },
    backPage() {
      this.$emit("changeView", "isList");
    },
    getTableData(val) {
      getInspectionData({
        ...val,
        limit: "10",
        isAdd: "1",
        page: this.currentPage.toString()
      }).then(res => {
        this.tableData = res.data.list;
        this.totalCount = res.data.totalCount;
      });
    },
    search() {
      var info = {
        companyName: this.formInline.companyName,
        startTime: this.formInline.date[0],
        endTime: this.formInline.date[1]
      };
      this.getTableData(info);
    },
    handleSelectionChange(row) {
      this.tableData.forEach(item => {
        // 排他,每次选择时把其他选项都清除
        if (item && item.id) {
          if (item.id !== row.id) {
            item.checked = false;
          } else if (item.id === row.id && !item.checked) {
            item.checked = true;
          }
        }
      });
      this.currentRow = row;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      var info = {
        companyName: this.formInline.companyName,
        startTime: this.formInline.date[0],
        endTime: this.formInline.date[1]
      };
      this.getTableData(info);
    },
    submit() {
      supplementPlan({
        examineId: this.currentRow.id
      })
        .then(res => {
          this.relationId = res.data;
          console.log(res.data);
          this.dialogVisiable = false;
          this.showInfo = true;
          this.$store.commit("planexamineId", res.data);
          this.params = {
            id: res.data
          };
          this.getInfo();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    fileUrl(val) {
      // this.isPreviewVis = true
      if (val.accessoryType == ".pdf") {
        this.previewAsset = val.accessoryId;
        this.dialogClass = "big-dialog";
        this.dialogContent = "showPdf";
      } else {
        this.isPreviewVis = true;
        this.previewAsset = val.accessoryDownUrl;
        this.dialogClass = "small-dialog";
        this.dialogContent = "img";
      }
      console.log(val);
    }
  }
};
</script>

<style lang='less' scoped>
/deep/ .el-table--border th {
  border-color: #e0e0e0;
}
.shangchuang {
  font-size: 16px;
  color: #0099ff;
}
.patch-doc {
  margin: 8px;
  padding: 15px 80px;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
  &-back {
    padding: 0;
    position: absolute;
    left: 15px;
    /deep/ .el-button {
      padding: 0;
    }
  }
  &-title {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #333333;
    margin-bottom: 20px;
  }
  &-container {
    /deep/ .el-button--primary {
      padding: 0 10px;
    }
    &-info {
      margin-top: 20px;
      color: #333333;
      line-height: 38px;
      .create-tab-title {
        margin-bottom: 15px;
      }
    }
  }
  /deep/ .el-dialog {
    margin-top: 10vh !important;
    /deep/ .el-dialog__body {
      padding: 10px 15px;
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    .el-date-editor {
      width: 250px;
      height: 30px;
      /deep/ .el-range__icon {
        line-height: 22px;
      }
      /deep/ .el-range-separator {
        line-height: 22px;
      }
      /deep/ .el-range__close-icon {
        line-height: 22px;
      }
    }
    .mixed-column {
      position: relative;
      justify-content: space-around;
      /* .div-hover {
        height: 23px;
        width: 59px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      } */
      .check {
        /deep/ .el-checkbox__inner {
          border-radius: 50%;
          width: 20px;
          height: 20px;
        }
        /deep/ .el-checkbox__inner::after {
          top: 3px;
          left: 7px;
        }
      }
    }
  }
  .big-dialog {
    /deep/ .el-dialog {
      width: 830px;
    }
  }
  .small-dialog {
    /deep/ .el-dialog {
      width: 300px;
      .el-dialog__body {
        padding: 15px;
        text-align: center;
      }
      .el-dialog__header {
        border-bottom: none;
      }
    }
  }
}
.buttonStyle {
  background: #fff;
  position: fixed;
  bottom: 0;
  text-align: center;
  padding: 12px 0;
  width: calc(100% - 230px);
}
</style>
