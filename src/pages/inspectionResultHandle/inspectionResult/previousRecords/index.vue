<template>
  <div>
    <div class="previous_Records_content">
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="previous_Records_header">
        <el-row>
          <el-col :span="12">
            <span>企业名称：{{companyInfo.companyName}}</span>
          </el-col>
          <el-col :span="12">
            <span>监管行业：{{companyInfo.jghydl}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span>法定负责人：{{companyInfo.legalPerson}}</span>
          </el-col>
          <el-col :span="12">
            <span>职务：{{companyInfo.legalJob}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span>企业地址：{{companyInfo.fullAddress}}</span>
          </el-col>
        </el-row>
      </div>
      <div>
        <checkInformation :recordInfo="recordInfo"></checkInformation>
      </div>
    </div>
    <!-- <buttonGroup :buttonList="buttonList"></buttonGroup> -->
  </div>
</template>

<script>
import snPageBar from "@components/snPageBar/index";
import buttonGroup from "@components/buttonGroup/index";
import checkInformation from "../previousRecords/components/checkInformation";
import { getExamineCheckRecord } from "@api/ProcessingofInspectionResult/index.js";
import { mapState } from "vuex";

export default {
  name: "previousRecords",
  components: {
    snPageBar,
    buttonGroup,
    checkInformation
  },
  data() {
    return {
      buttonList: [
        {
          name: "返回",
          type: "",
          disable: false,
          fun: this.backPage
        }
      ],
      companyInfo:{},
      recordInfo:[]
    };
  },
  created() {
    this.showGetExamineCheckRecord()
  },
  methods: {
    backPage() {
      this.$store.commit("setInspectionResultComponent", "isList");
    },
    showGetExamineCheckRecord() {
      getExamineCheckRecord({
        companyId:this.InfoId
      })
        .then(res => {
          console.log(res);
          this.companyInfo = res.data.companyDto
          this.recordInfo = res.data.examineDtoList
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    ...mapState(["InfoId"])
  }
};
</script>

<style lang="less" scoped>
.previous_Records_content {
  background: #fff;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 50px 75px 33px;
  // margin-bottom:60px;
  border-radius: 8px;
  height: 100%;
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
.previous_Records_header {
  background: rgba(227, 238, 246, 1);
  margin-bottom: 15px;
}
.el-row {
  padding-bottom: 6px;
}
</style>

