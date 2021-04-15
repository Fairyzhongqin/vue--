<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :show-file-list="showFileList"
      :auto-upload="false"
      ref="inner_upload"
      :on-error="error"
      :on-success="successUpload"
      accept=".svg, .pfx,"
      :on-change="getChangeInfo"
      :multiple="true"
      :limit="limitNum"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div class="el-upload__text">
        <div class="seal-title">
          {{ fileType=== '0' ? '点击上传私章和证书' : (fileType === '1' ? '点击上传公章和证书' : (fileType === '2' ? '点击上传执法专用章和证书' : null)) }}</div>
        <div class="tips">(只限.svg)</div>
      </div>
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          v-if="file.raw.type.indexOf('image') !== -1"
        />
        <span class="file-name">{{file.name}}</span>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="showDetail(file)">
            <i class="el-icon-view"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="remove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <div class="proof-name">
      {{ fileType=== '0' ? '暂无私章证书' : (fileType === '1' ? '暂无公章证书' : (fileType === '2' ? '暂无执法专用章证书' : null)) }}
    </div>
    <el-dialog width="500px" height="400px" :before-close="closeDialog" :visible.sync="showDialog">
      <img :src="imgUrl" width="100%" height="100%" alt />
    </el-dialog>
  </div>
</template>

<script>
import { deleteSeal, uploadSeal } from "@api/common";

export default {
  data() {
    return {
      showFileList: true, // 上传后是否显示上传文件 list
      showDialog: false, // 查看图片详情的开关
      imgUrl: null, // 图片url
      uploadFileList: [], // 要上传的文件
      limitNum: -1
    };
  },
  props: {
    fileDetail: {
      type: Object,
      required: false
    },
    fileType: {
      type: String,
      required: true
    },
    isOnlyOne: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    // 删除附件
    remove(file) {
      console.log(file, '88888888')
      let fun = this.$refs.inner_upload.handleRemove;
      let temp = this.$refs.inner_upload.uploadFiles;
      if(file.signId && file.signId !== '') {
        deleteSeal({signId: file.signId}).then(res => {
          temp.forEach(item => {
            if(item.signId === file.signId) {
              fun(item);
              fun(file)
            }
          })
        })
      } else {
        fun(file);
        this.uploadFileList = [];
      }
    },
    // 报错信息
    error(val) {
      console.log("error", val);
      this.$alert("上传失败，请重试", null, {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    // 关闭查看详情弹窗
    closeDialog() {
      this.showDialog = false;
    },
    // 展示详情弹窗
    showDetail(file) {
      if (file.raw.type.indexOf("image") !== -1) {
        this.imgUrl = file.url;
      } else {
        this.imgUrl = require("../../assets/logo.png");
      }
      this.showDialog = true;
    },
    // 成功上传回调函数
    successUpload(res) {
      this.$message("上传成功");
    },
    // 选取文件
    getChangeInfo(file, fileList) {
      let name = file.name.substring(file.name.lastIndexOf(".") + 1);
      console.log(name, '0000000000000')
      if((name === 'pfx' || name === 'svg') && this.uploadFileList.length < 2) {
        if(this.uploadFileList.length === 1) {
          let name1 = this.uploadFileList[0].name.substring(this.uploadFileList[0].name.lastIndexOf(".") + 1);
          if((name1 === 'pfx' && name === 'svg') || (name1 === 'svg' && name === 'pfx')) {
            this.uploadFileList.push(file)
          } else {
            this.$refs.inner_upload.uploadFiles.pop();
          }
        } else {
          this.uploadFileList.push(file)
        }
      } else {
        this.$refs.inner_upload.uploadFiles.pop();
        this.$alert("请同时上传.svg和.pfx格式的文件", null, {
          confirmButtonText: "确定",
          callback: action => {}
        });
      }
    },
    // 上传方法
    newUpload() {
      let fileData = new FormData();
      let files = this.$refs.inner_upload.uploadFiles;
      let uidList = [this.uploadFileList[0].uid, this.uploadFileList[1].uid];
      fileData.append('file', this.uploadFileList[0].raw);
      fileData.append('file', this.uploadFileList[1].raw);
      fileData.append("userId", this.fileDetail.userId);
      fileData.append("type", this.fileType);
      uploadSeal(fileData).then(res => {
        files.forEach(element => {
          if(element.uid === uidList[0] || element.uid === uidList[1]) {
            element.signId = res.data.signId;
          }
        });
      })
    },
  },
  watch: {
    uploadFileList: {
      handler: function(val, oldVal) {
        if(val.length === 2) {
          this.newUpload();
          this.uploadFileList = [];
        }
      },
      deep: true
    }
  },
  created() {
    this.limitNum = this.isOnlyOne ? 2 : 10000;
  }
};
</script>

<style lang="less" scoped>
.file-name {
  display: block;
  position: absolute;
  bottom: 0;
  color: #ffffff;
  background: #000000;
  opacity: 0.5;
  width: 100%;
  text-align: center;
}
/deep/ .el-upload--picture-card {
  width: 150px;
  height: 150px;
  background: #EEF5F9;
}
.tips {
  width: 90px;
  padding-left: 30px;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
.seal-title {
  width: 90px;
  padding-left: 30px;
  line-height: 20px;
  color: #0099FF;
}
.proof-name {
  width: 150px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #999999;
  margin-top: 5px;
  background: rgba(240,240,240,1);
  border-radius: 5px;
}
</style>
