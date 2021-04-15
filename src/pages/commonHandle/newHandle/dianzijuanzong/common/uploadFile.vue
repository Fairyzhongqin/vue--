<template>
  <div class="archive-upload-file">
    <el-upload
      :action="url"
      :headers="header"
      list-type="picture-card"
      :show-file-list="false"
      :auto-upload="false"
      ref="inner_upload"
      :on-error="error"
      :on-success="successUpload"
      :data="fileInfo"
      :on-change="resetFileInfo"
      accept=".jpg, .jpeg, .png, .pdf"
      :before-upload="checkFileStyle"
    >
      <div class="upload-proof-tips">
        <i slot="default" class="iconfont iconshangchuan"></i>
        <span class="tips-title">点击上传签字文书</span>
        <span class="tips-type">(只限.png.jpg.pdf.jpeg)</span>
      </div>
    </el-upload>
  </div>
</template>

<script>
import baseUrl from "@/utils/webIp";
export default {
  name: "uploadFile",
  data() {
    return {
      header: {},
      fileInfo: null,
      url: `${baseUrl}/aj/case/casefileaccessory/upload`
    };
  },
  props: {
    fileDetail: {
      type: Object,
      required: false
    },
    // 信息保存之后，如果用户要在当前页面删除公共的组件，则需要传入当前记录的id
    sourceId: {
      type: String,
      required: false
    }
  },
  methods: {
    // 报错信息
    error() {
      this.$loading.hiddenLoading()
      this.$alert("上传失败，请重试", null, {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    // 成功上传回调函数
    successUpload(res) {
      this.$loading.hiddenLoading()
      this.$message({
        message: "上传成功",
        type: "success"
      });
      this.$emit("getUploadMsg", res);
    },
    resetFileInfo() {
      this.$refs.inner_upload.submit();
    },
    // 上传文件类型判断
    checkFileStyle(file) {
      let name = file.name.substring(file.name.lastIndexOf(".") + 1);
      let suffix = ".jpg,.jpeg,.png,.pdf"
      suffix += suffix.toUpperCase()
      let result = suffix.indexOf(name);
      if (result === -1) {
        this.$alert("请选择正确的文件格式", null, {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return false
      }
      // let fileNameReg = /[#$@&/\\{}[\] ]/gi
      let fileNameReg = /[#$@&%',;=?$/]/gi

      if (fileNameReg.test(file.name)) {
        this.$alert("文件名不能包含特殊字符，请修改后再试", null, {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return false
      }
      this.$loading.showLoading()
      return true
      
    }
  },
  watch: {
    fileDetail: {
      handler: function(val, oldVal) {
        this.fileInfo = val;
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    let token = localStorage.getItem("token");
    this.header = { Authorization: token };
  }
};
</script>

<style lang="less" scoped>
.archive-upload-file {
  height: 100%;
  > div {
    height: 100%;
  }
  /deep/ .el-upload--picture-card {
    width: 180px;
    height: 85%;
    position: relative;
    background: rgba(238, 245, 249, 1);
    .upload-proof-tips {
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 0;
      width: 180px;
      height: auto;
      margin-top: 45%;
      line-height: 20px;
      .tips-title {
        margin-bottom: 6px;
        font-size: 14px;
        color: #0099ff;
      }
      .iconshangchuan {
        color: #0099ff;
      }
      .tips-type {
        color: #999999;
        font-size: 12px;
      }
    }
    i {
      margin-bottom: 17px;
      vertical-align: bottom;
    }
  }
}
</style>
