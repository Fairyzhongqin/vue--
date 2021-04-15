<template>
  <el-upload  :action="url"
              :headers="header"
              :on-success="successUpload"
              :on-error="error"
              name = "file"
              :multiple = "false"
              :show-file-list = "false"
              :data = "fileInfo"
              :limit="1"
              :before-upload="checkFileStyle"
              accept = ".ftl"
  >
    <el-button size="small" type="primary">上传模板</el-button>
  </el-upload>
</template>

<script>

import baseUrl from "@/utils/webIp";
export default {
  name: 'jw-upload',
  props: {
    fileInfo: {
      type: Object,
      required: true
    },
  },
  data(){
    return{
      url: `${baseUrl}/aj/writ/writtypeenum/uploadWritModel`,
      header: {},
    }
  },
  created() {
    let token = localStorage.getItem("token");
    this.header = { Authorization: token };
    console.log(this.fileInfo)
  },
  methods: {
    error() {
      this.$loading.hiddenLoading()
      this.$alert("上传失败，请重试", null, {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    successUpload(res) {
      this.$loading.hiddenLoading()
      this.$emit("getUploadMsg", res);
      if (this.uploadType === "applyInfo") {
        return;
      }
      this.$message({
        message: "上传成功",
        type: "success"
      });
    },
    checkFileStyle(file) {

      if(!this.fileInfo.id){
        this.$alert("请先保存信息，再上传文件", null, {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return false;
      }
      console.log(file);
      let name = file.name.substring(file.name.lastIndexOf(".") + 1);
      let result = ".ftl".indexOf(
        name
      );
      if (result === -1) {
        this.$alert("请选择正确的文件格式", null, {
          confirmButtonText: "确定",
          callback: action => {}
        });
      }
      if (result !== -1) {
        this.$loading.showLoading()
      }
      return result !== -1;
    }
  }
}
</script>
