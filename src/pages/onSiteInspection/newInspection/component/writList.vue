<template>
  <div>
    <div class="name">修改现场检查</div>
    <div class="writ-tab">
      <div class="tab-title small"
           @click="chooseTab('check')">现场检查</div>
      <div class="tab-title"
           @click="chooseTab('writ')">现场检查文书</div>
    </div>
    <div class="writ-list"
         v-if="docDataList && docDataList.length > 0 && !showPdf">
      <writ-card v-on="$listeners"
                 :auditInfo="auditInfo"
                 :docData="item"
                 v-for="(item, index) in docDataList"
                 :key="index"
                 @modifyWrit="chooseWrit"
                 @afterDelete="getWritList"
                 @toLawSeal="toLawSeal"
                 @afterUpload="getWritList"></writ-card>
    </div>
    <sn-empty-data text="暂无现场检查文书" v-if="!docDataList || docDataList.length === 0"></sn-empty-data>
    <!-- <div class="tips" v-if="!docDataList || docDataList.length === 0">暂无文书123221</div> -->
    <show-pdf :pdfId="pdfId" v-if="dialogContent === 'pdf'" @closePdf="dialogContent = null"></show-pdf>
    <el-dialog class="writ-dialog"
               :visible.sync="showPdfDialog"
               :before-close="closeDialog">
      <common-writ v-if="showPdfDialog && dialogContent === 'writ'"
                   :info="writInfo"
                   :writType="writType"
                   @close="closeDialog"></common-writ>
      <show-pdf :pdfId="pdfId"
              v-if="showPdfDialog && dialogContent === 'pdf'"></show-pdf>
      <div v-if="showPdfDialog && dialogContent === '现场处理措施'">
        <onSiteOperation
          :selectedList="item"
          v-for="(item ,index) in selectedList"
          :key="`index${index}`"
          :indexKey="index"
          ref="siteOperation"
        ></onSiteOperation>
      </div>
      <div v-if="showPdfDialog && dialogContent === '责令限期整改'">
        <div class="modifyTime">
          <i class="iconfont icondaojishi"></i>
          <span>整改时限：</span>
          <el-date-picker
            v-model="limitTime"
            type="date"
            placeholder="选择整改期限"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
        <span class="dashLine"></span>
        <modify-time
          :selectedList="item"
          v-for="(item ,index) in selectedList"
          :key="index"
          :indexKey="index"
          ref="modifyTime"
        ></modify-time>
      </div>
      <span slot="footer" class="dialog-footer" v-if="showPdfDialog && dialogContent === '现场处理措施'">
        <el-button @click="cancelTrans">取 消</el-button>
        <el-button
          @click="createTransOperation"
          type="primary"
        >保存并生成现场处理措施决定书</el-button>
        <el-button
          @click="toSeal"
          type="primary"
        >加盖公章</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="showPdfDialog && dialogContent === '责令限期整改'">
        <el-button @click="cancelTrans">取 消</el-button>
        <el-button @click="createTransTimeLimit" type="primary">保存并生成责令限期整改指令书</el-button>
        <el-button @click="toSeal" type="primary">加盖公章</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import snEmptyData from "@/components/snEmptyData";
import { getInspectionWritList, rectificationDetail, inspectionDetail } from "@/api/onSiteInspection/index";
import writCard from "@components/docCard/index";
import showPdf from "@/components/showPdf/index";
import { getWritDataByWritId, createWrit, updateWrit } from "@/api/fileRelated.js";
import commonWrit from "@/components/commonWrit";
import onSiteOperation from "@/pages/inspectionResultHandle/componments/onSiteTreatmentMeasures";
import {
  dateFormat,
  stringToDate,
  getWritParams,
  debounce
} from "@/utils/util";
import {
  inspectionSave,
  getInspectionDetail,
  updateInspectionDetail,
  getComInfo,
  toRectification,
  toInspectionHandle
} from "@/api/onSiteInspection/index";
import modifyTime from "@/pages/inspectionResultHandle/componments/modifyTime";

export default {
  props: {
    sourceId: {
      type: String,
      required: true
    },
    auditInfo: {
      type: Object
    }
  },
  data () {
    return {
      docDataList: [],
      showPdf: false,
      pdfId: "",
      tabType: "", // tab类型，为了tab初始化
      writInfo: null,
      writType: null,
      showPdfDialog: false,
      selectedList: [],
      inspectionDetail: null,
      rectificationDetail: null,
      dialogContent: null,
      limitTime: null
    };
  },
  components: {
    writCard,
    commonWrit,
    snEmptyData,
    onSiteOperation,
    modifyTime,
    showPdf
  },
  methods: {
    toLawSeal(info) {
      this.dialogContent = 'pdf';
      this.pdfId = info.id;
    },
    chooseTab (val) {
      this.tabType = val;
      if (val === "check") {
        this.$emit("chooseTab", "check");
      } else {
        this.$emit("chooseTab", "writ");
      }
    },
    getWritList () {
      getInspectionWritList({
        id: this.sourceId
      }).then(res => {
        this.docDataList = res.data;
      });
    },
    toSeal() {

    },
    chooseWrit(title, type, id, bussinessId) {
      console.log(title, type, id, bussinessId)
      this.pdfId = id;
      if(title.indexOf('现场处理') !== -1) {
        this.dialogContent = title;
        inspectionDetail({id: bussinessId}).then(res => {
          this.inspectionDetail = res.data;
          let list = res.data.probList.reduce((total, item) => {
            let tempList = [];
            if(item.children && item.children.length > 0) {
              tempList = item.children.reduce((t, i) => {
                t.push(i);
                return t;
              }, [])
            } else {
              tempList.push(item)
            }
            total = [...total, ...tempList];
            return total;
          }, [])
          this.selectedList = list;
          this.showPdfDialog = true;
        })
      } else if(title.indexOf('责令限期整改') !== -1) {
        this.dialogContent = '责令限期整改';
        rectificationDetail({id: bussinessId}).then(res => {
          this.rectificationDetail = res.data;
          this.limitTime = res.data.rectifyTime.split('/').join('-');
          let list = res.data.probList.reduce((total, item) => {
            let tempList = [];
            if(item.children && item.children.length > 0) {
              tempList = item.children.reduce((t, i) => {
                t.push(i);
                return t;
              }, [])
            } else {
              tempList.push(item)
            }
            total = [...total, ...tempList];
            return total;
          }, [])
          this.selectedList = list;
          this.showPdfDialog = true;
        })
      }else if(title === '现场检查记录') {
        this.$alert("请到现场检查修改页面修改", null, {
          confirmButtonText: "确定",
        });
      }else {
        this.dialogContent = 'writ';
        this.writType = title;
        getWritDataByWritId({writId: id}).then(res => {
          this.showPdfDialog = true;
          this.writInfo = {writInfo: res.data, auditInfo: this.auditInfo};
        })
      }
    },
    // 制作现场处理措施文书
    createTransOperation() {
      let user = JSON.parse(localStorage.getItem("res"));
      let list = [], suggestion = [], hadleInfo = [], legalInfoContent = [];
      let arrayList = JSON.parse(
        JSON.stringify(this.selectedList)
      );
      let num = 0;
      arrayList.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((i, j) => {
            i.disposeOpinion = this.$refs.siteOperation[num].suggestion;
            i.lawCode = this.$refs.siteOperation[num].legalvalue.join(',');
            i.measuresCode = this.$refs.siteOperation[num].valuehandle.join(',');
            this.$refs.siteOperation[num].selectedMeasure.forEach(measure => {
                suggestion.push({
                tagName: 'tag6Item',
                tagContent: measure.label
              })
            })
            this.$refs.siteOperation[num].selectedLegal.forEach(law => {
              legalInfoContent.push(law.label)
            })
            list.push({
              tagName: 'tag4Item',
              tagContent: i.negativeDesc,
            });
            num += 1;
          });
        } else {
          item.disposeOpinion = this.$refs.siteOperation[num].suggestion;
          item.lawCode = this.$refs.siteOperation[num].legalvalue.join(',');
          item.measuresCode = this.$refs.siteOperation[num].valuehandle.join(',');
          list.push({
            tagName: 'tag4Item',
            tagContent: item.negativeDesc,
          })
          this.$refs.siteOperation[num].selectedMeasure.forEach(measure => {
                suggestion.push({
                tagName: 'tag6Item',
                tagContent: measure.label
              })
            })
          this.$refs.siteOperation[num].selectedLegal.forEach(law => {
            legalInfoContent.push(law.label)
          })
          num += 1;
        }
      });
      let startTimeList = this.inspectionDetail.examineInfo.examineStartTime.split(' ')[0].split('/');
      let startTime = startTimeList[0] + '年' + startTimeList[1] + '月' + startTimeList[2] + '日';
      let otherParams = getWritParams({
        tag2: this.inspectionDetail.examineInfo.companyName,
        tag3: startTime,
        tag5: legalInfoContent.join(","),
        tag7: user.sysDeptEntity.government,
        tag8: user.sysDeptEntity.fullDeptName,
        tag9: user.sysDeptEntity.court
      });
      let params = [...list, ...suggestion, ...otherParams];
      this.dialogContent = null;
      this.showPdfDialog = false;
      toInspectionHandle({
        companyId: this.inspectionDetail.examineInfo.companyId,
        examineId: this.inspectionDetail.examineId,
        probList: arrayList,
        executorId: this.inspectionDetail.examineInfo.executorId,
        id: this.inspectionDetail.id
      }).then(res => {
        updateWrit({ writId: this.pdfId }, params).then(
          res => {
            console.log("想要回退编辑的res",res)
            // this.showPdfDialog = true;
            this.dialogContent = "pdf";
            this.getWritList();
          },
          err => {
            console.log(err);
          }
        );
      });
    },
    // 制作责令限期整改文书
    createTransTimeLimit() {
      let user = JSON.parse(localStorage.getItem("res"));
      let list = [], numList = [];
      let arrayList = JSON.parse(
        JSON.stringify(this.selectedList)
      );
      let num = 0;
      arrayList.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((i, j) => {
            i.rectifyDemand = this.$refs.modifyTime[num].request;
            list.push({
              tagName: 'tag3Item',
              tagContent: i.negativeDesc,
            });
            numList.push(num + 1);
            num += 1;
          });
        } else {
          item.rectifyDemand = this.$refs.modifyTime[num].request;
          list.push({
            tagName: 'tag3Item',
            tagContent: item.negativeDesc,
          })
          numList.push(num + 1);
          num += 1;
        }
      });
      let startTimeList = this.rectificationDetail.rectifyTime.split('/');
      let startTime = typeof this.limitTime !== 'string' ? dateFormat(this.limitTime, "yyyy年mm月dd日") : startTimeList[0] + '年' + startTimeList[1] + '月' + startTimeList[2] + '日';
      let otherParams = getWritParams({
        tag2: this.rectificationDetail.examineInfo.companyName,
        tag4: numList.join(","),
        tag5: startTime,
        tag6: user.sysDeptEntity.government,
        tag7: user.sysDeptEntity.fullDeptName,
        tag8: user.sysDeptEntity.court
      });
      let params = [...list, ...otherParams];
      this.dialogContent = null;
      this.showPdfDialog = false;
      toRectification({
        companyId: this.rectificationDetail.examineInfo.companyId,
        examineId: this.rectificationDetail.examineId,
        probList: arrayList,
        executorId: this.rectificationDetail.examineInfo.executorId,
        id: this.rectificationDetail.id,
        rectifyTime: typeof this.limitTime !== 'string' ? dateFormat(this.limitTime, 'yyyy-mm-dd HH:MM:ss') : this.limitTime.split('/').join('-') + ' 00:00:00'
      }).then(res => {
        this.limitTime = null;
        updateWrit({ writId: this.pdfId }, params).then(
          res => {
            // this.showPdfDialog = true;
            this.dialogContent = "pdf";
            this.getWritList();
          },
          err => {
            console.log(err);
          }
        );
      });
    },
    cancelTrans() {
      this.dialogContent = null;
      this.showPdfDialog = false;
    },
    // // 制作其他文书
    // makeInspectionWrit (params) {
    //   updateWrit({ writId: this.pdfId }, params.data).then(
    //     res => {
    //       this.showPdfDialog = true;
    //       this.dialogContent = 'pdf';
    //       this.getWritList(); // 文书卡片修改文书后再次获取文书列表信息
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
    // },
    closeDialog() {
      this.showPdfDialog = false;
      this.dialogContent = null;
      this.pdfId = null;
    },
    // toSeal (audiReq) {
    //   this.audiReq = audiReq;
    //   this.showPdfDialog = true;
    //   this.dialogContent = "selectPeople";
    //   this.dialogTitle = "选择审核人员";
    // },
  },
  mounted () {
    this.getWritList();
  }
};
</script>

<style lang="less" scoped>
.name {
  font-size: 18px;
  font-family: "PingFang-SC-Bold";
  font-weight: bold;
  margin: 0 0 30px;
}
.writ-tab {
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  .tab-title {
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    border-bottom: none;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    width: 105px;
    margin-right: 10px;
    margin-bottom: -1px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #0099ff;
    background-color: #ffffff;
    &:hover {
      cursor: pointer;
    }
  }
  .small {
    width: 75px;
    background-color: #e0e0e0;
  }
}
.writ-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.tips {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
.writ-dialog {
  /deep/ .el-dialog {
    // height: 70%;
    width: 60%;
    padding-left:16px;
    padding-right:16px;
  }
  /deep/ .el-dialog__header {
    padding-top:26px;
  }
  /deep/ .el-dialog__body {
    // height: 90%;
    width: 100%;
    overflow: auto;
  }
}
.modifyTime {
  margin-top: 10px;
}
.icondaojishi {
  color: #0099ff;
}
.dashLine {
    display: inline-block;
    width: 98%;
    // height: 1px;
    border: 1px dashed #e0e0e0;
  }
</style>
