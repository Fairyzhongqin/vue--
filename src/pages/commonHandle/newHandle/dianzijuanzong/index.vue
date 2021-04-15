<template>
  <div class="dzjz-container penalty-bottom_button">
    <div class="create-tab-title">电子卷宗</div>
    <div class="button-bar-top" v-if="!forBrowse">
      <el-button type="primary" size="mini" @click="popView">制作电子卷宗</el-button>
    </div>
    <section v-if="archArr.length!==0" class="jz-doc-container">
      <doc-card
        v-for="(doc, index) of archArr"
        :key="index"
        :docData="doc"
        @afterDelete="getArchWrit"
        @modifyWrit="popView"
        @previewWrit="preview"
      ></doc-card>
    </section>
    <sn-empty-data text="暂无卷宗" v-if="archArr.length === 0"></sn-empty-data>
    <archive-frame class="animated" :class="animateClass" v-if="showFrame" @closeFrame="closeFrame"></archive-frame>
    <bottom-bar v-if="!forBrowse">
      <el-button :disabled="!isExist" :type="isExist ? 'primary' : 'info'" @click="exportArchive">导出电子卷宗</el-button>
      <a ref="download" :href="archiveUrl"></a>
    </bottom-bar>
    <show-pdf
      :pdfId="currWritId"
      @closePdf="closePdf"
      @finishPdf="closePdf"
      v-if="showPdf"
      :buttonList="btnList"
      :writName="writName"
    ></show-pdf>
  </div>
</template>

<script>
import snEmptyData from "@/components/snEmptyData";
import archiveFrame from "./components/archiveFrame";
import bottomBar from "@/components/bottomBar";
import docCard from "@/components/docCard";
import { getDownloadURL, getArchiveWrit } from "@/api/dossier";
import showPdf from "@/components/showPdf";

export default {
  name: "dianzijuanzong",
  components: {
    snEmptyData,
    archiveFrame,
    bottomBar,
    docCard,
    showPdf
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isExist: false, // 是否已制作过电子卷宗
      showFrame: false,
      animateClass: "slideInUp",
      archiveUrl: "", // 电子卷宗下载链接
      archArr: [],
      btnList: {
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: false, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true
      },
      showPdf: false,
      currWritId: "", // 浏览文书的 id
      writName: "" // 浏览文书的名称
    };
  },
  created() {
    this.getUrl();
    this.getArchWrit();
    // 存入电子卷宗所需 moduleId
    this.$store.commit(
      "setModuleId",
      this.$store.state.penalty.penaltyUndEntity.penaltyId
    );
  },
  methods: {
    // 获取电子卷宗文书列表
    getArchWrit() {
      getArchiveWrit({
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId
      }).then(res => {
        this.archArr = res.data;
      });
    },
    // 浏览电子卷宗文书
    preview(id, title, status) {
      if (status) this.btnList = status;
      this.btnList.updatePdf = false
      this.writName = title;
      this.currWritId = id;
      this.showPdf = true;
    },
    // 获取电子卷宗下载链接
    getUrl() {
      getDownloadURL({
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        fileType: this.type === "audit" ? "1" : "0" //0-大卷宗  1-小卷宗
      }).then(res => {
        if(res.code === '0') {
          if(res.data) {
            let token = localStorage.getItem("token");
            this.archiveUrl = res.data.accessoryUrl + "&token=" + token;
            this.isExist = true
          } else {
            this.isExist = false
          }
        }
      });
    },
    // 展开卷宗制作页面
    popView() {
      this.showFrame = true;
    },
    // 关闭卷宗制作页面
    closeFrame() {
      this.getUrl()
      this.getArchWrit()
      this.animateClass = "slideOutDown";
      setTimeout(() => {
        this.showFrame = false;
        this.animateClass = "slideInUp";
      }, 1000);
    },
    // 导出电子卷宗
    exportArchive() {
      if (!this.archiveUrl) {
        this.$message({
          type: "warning",
          message: "请先制作电子卷宗！"
        });
        return;
      }
      this.$refs.download.click();
    },
    // 关闭浏览
    closePdf() {
      this.getArchWrit()
      this.showPdf = false;
      this.writName = "";
      this.currWritId = "";
    }
  }
};
</script>

<style lang="less" scoped>
.dzjz-container {
  position: relative;
  .button-bar-top {
    height: 62px;
    line-height: 62px;
  }
  &.penalty-bottom_button {
    /deep/ .bottom-button-container {
      right: 0;
    }
  }
  .jz-doc-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .doc-card {
      margin-bottom: 18px;
    }
  }
}
</style>
