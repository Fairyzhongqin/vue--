<template>
  <div class="uploadWrap">
    <el-upload
      :action="url"
      :headers="header"
      list-type="picture-card"
      :show-file-list="showFileList"
      :auto-upload="false"
      ref="inner_upload"
      :on-error="error"
      :on-success="successUpload"
      :data="fileInfo"
      :on-change="resetFileInfo"
      accept=".jpg, .jpeg, .png, .pdf, .xls, .xlsx, .doc, .docx, .webp, .bmp, .pcx, .tif, .gif, .tga, .exif, .fpx, .svg, .psd, .cdr, .pcd, .dxf, .ufo, .eps, .ai, .hdri, .raw, .wmf, .flic, .emf, .ico"
      :before-upload="checkFileStyle"
    >
      <i slot="default" class="el-icon-plus"></i>
      <template>
        <div class="upload-proof-tips" v-if="this.uploadType === 'applyInfo'">
          <span class="tips-title">点击上传企业申请资料</span>
          <span class="tips-type">(只限.png.jpg.pdf)</span>
        </div>
        <div class="upload-proof-tips" v-else>
          <span class="tips-title">点击上传现场证据</span>
          <span class="tips-type">(只限.png.jpg.pdf.xlsx.xls.docx.doc)</span>
        </div>
      </template>
      <div slot="file" slot-scope="{ file }">
        <img
          class="el-upload-list__item-thumbnail"
          src="~@/assets/imgs/proof/excel.jpg"
          v-if="file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1) === 'xlsx' || file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1) === 'xls'"
        />
        <img
          class="el-upload-list__item-thumbnail"
          src="~@/assets/imgs/proof/pdf.jpg"
          v-if="file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1) === 'pdf'"
        />
        <img
          class="el-upload-list__item-thumbnail"
          src="~@/assets/imgs/proof/word.jpg"
          v-if="file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1) === 'docx' || file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1) === 'doc'"
        />
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          v-if="file.raw.type.indexOf('image') !== -1"
        />
        <!-- <pdf :src="pdfsrc" v-if="file.raw.type.indexOf('pdf') === -1"></pdf> -->
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="showDetail(file)">
            <i class="el-icon-view"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="remove(file)">
            <i class="el-icon-delete"></i>
          </span>
          <!-- <span class="el-upload-list__item-delete" @click="downProof(file)">
            <i class="el-icon-download"></i>
          </span>-->
        </span>
        <span class="file-name">{{ file.name }}</span>
      </div>
    </el-upload>
    <el-dialog width="800px" height="600px" :before-close="closeDialog" :visible.sync="showDialog">
      <img :src="imgUrl" width="100%" height="100%" alt />
    </el-dialog>
    <el-dialog
      width="1000px"
      height="800px"
      :before-close="closePdfDialog"
      :visible.sync="showPdfDialog"
    >
      <iframe class="filename" :src="pdfsrc" width="100%" height="800px" frameborder="1"></iframe>
    </el-dialog>
    <el-dialog
      width="600px"
      height="400px"
      center
      :before-close="closeDocDialog"
      :visible.sync="showDocDialog"
    >
      <span style="text-align:center;display:inline-block;">该文件暂不支持浏览，已为您下载。</span>
      <iframe class="filename" :src="docUrl" width="100%" height="100%"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import { delInspectionProof, delReviewProof } from '@/api/onSiteInspection/index'
import baseUrl from '@/utils/webIp'
export default {
  components: {},
  data() {
    return {
      showFileList: true, // 上传后是否显示上传文件 list
      showDialog: false, // 查看图片详情的开关
      imgUrl: null, // 图片url
      header: {},
      fileInfo: null,
      publicId: null, // 公共证据的id
      url: `${baseUrl}/aj/writ/accessory/upload`,
      pdfsrc: '', //pdf地址,
      showPdfDialog: false,
      docUrl: '',
      showDocDialog: false
    }
  },
  props: {
    fileDetail: {
      type: Object,
      required: false
    },
    // 传入相应模块的名字
    uploadType: {
      type: String,
      required: true
    },
    // 信息保存之后，如果用户要在当前页面删除公共的组件，则需要传入当前记录的id
    sourceId: {
      type: String,
      required: false
    },
    isUpdate: {
      // 现场检查记录页面是否是修改状态
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    // 删除附件
    remove(file) {
      let fun = this.$refs.inner_upload.handleRemove
      switch (this.uploadType) {
        case 'inspection':
          delInspectionProof(this.delProof(file)).then(
            res => {
              fun(file)
              this.$emit('delProof')
            },
            err => {
              fun(file)
            }
          )
          break
        case 'review':
          delReviewProof(this.delProof(file)).then(
            res => {
              fun(file)
              this.$emit('delProof')
            },
            err => {
              fun(file)
            }
          )
          break
        case 'applyInfo':
          console.log('type=====>', file)
          delReviewProof(this.delProof(file)).then(
            res => {
              fun(file)
              this.$emit('delProof')
            },
            err => {
              fun(file)
            }
          )
          break
      }
    },
    // 准备要删除的附件的参数
    delProof(file) {
      let accessoryId = file.response.accessoryId,
        type = null,
        id = null
      if (this.uploadType === 'investigation') {
        return {
          accessoryId: file.response.data,
          penaltyId: this.fileDetail.penaltyId
        }
      }
      // 企业申请资料上传
      if (this.uploadType === 'applyInfo') {
        return {
          accessoryId: file.response.data,
          type: '2'
        }
      }
      // console.log(file);
      if (file.response) {
        if (file.response.sourceId && file.response.sourceId !== '') {
          id = file.response.sourceId
          type = '1'
        } else {
          id = this.publicId
          type = '0'
        }
      }
      return { accessoryId, type, id }
    },
    // 下载附件
    downProof(file) {
      console.log('hello world')
    },
    // 报错信息
    error() {
      
      this.$loading.hiddenLoading()
      console.log('error')
      this.$alert('上传失败，请重试', null, {
        confirmButtonText: '确定',
        callback: action => {}
      })
    },
    // 关闭查看详情弹窗
    closeDialog() {
      this.showDialog = false
    },
    closePdfDialog() {
      this.showPdfDialog = false
    },
    closeDocDialog() {
      this.showDocDialog = false
    },
    // 展示详情弹窗
    showDetail(file) {
      console.log('浏览', file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1))
      let valueFormat = file.name.substring(file.name.lastIndexOf('.') + 1) //前面逻辑不用看，至此拿到文件后缀
      // console.log("浏览doc格式", valueFormat);
      if (file.raw.type.indexOf('image') !== -1) {
        this.imgUrl = file.url
        this.showDialog = true
      } else if (file.raw.type.indexOf('pdf') !== -1) {
        this.pdfsrc = file.url
        this.showPdfDialog = true
        // window.open(this.pdfsrc, "_blank");
      } else if (valueFormat == 'doc' || valueFormat == 'docx') {
        this.imgUrl = require('../../assets/imgs/proof/word.jpg')
        this.showDialog = true
      } else if (valueFormat == 'xls' || valueFormat == 'xlsx') {
        this.imgUrl = require('../../assets/imgs/proof/excel.jpg')
        this.showDialog = true
      }
      // else if (
      //   valueFormat == "doc" ||
      //   valueFormat == "docx" ||
      //   valueFormat == "xls" ||
      //   valueFormat == "xlsx"
      // ) {
      //   // console.log("满足doc", file.url);
      //   this.docUrl = file.url;
      //   this.showDocDialog = true;
      //   // window.open(this.docUrl, "_blank");
      // } else {
      //   this.imgUrl = require("../../assets/logo.png");
      //   this.showDialog = true;
      // }
    },
    // 成功上传回调函数
    successUpload(res) {
      this.$loading.hiddenLoading()
      if (res.code === '0') {
        this.$emit('getUploadMsg', res)
        /*  if (this.uploadType === 'applyInfo') {
          return
        }
       */
        switch (this.uploadType) {
          case 'applyInfo':
            break
          case 'rectification':
            break
          case 'rectificationDelay':
            break
          default:
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            break
        }
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    // 清空上次文件上传时关联的id
    resetFileInfo() {
      this.$refs.inner_upload.submit()
      if (
        this.uploadType === 'uploadAccessory' ||
        this.uploadType === 'penaltyDiscretion' ||
        this.uploadType === 'rectification' ||
        this.uploadType === 'rectificationDelay'
      ) {
        return
      }
      this.fileInfo = null
    },
    // 上传文件类型判断
    checkFileStyle(file) {
      let name = file.name.substring(file.name.lastIndexOf('.') + 1)
      let suffix =
        '.jpg,.jpeg,.png,.pdf,.xls,.xlsx,.doc,.docx,.webp,.bmp,.pcx,.tif,.gif,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.hdri,.raw,.wmf,.flic,.emf,.ico'
      suffix += suffix.toUpperCase()
      let result = suffix.indexOf(name)
      if (result === -1) {
        this.$alert('请选择正确的文件格式', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return false
      }
      // let fileNameReg = /[#$@&/\\{}[\] ]/gi
      let fileNameReg = /[#$@&%',;=?$/]/gi

      if (fileNameReg.test(file.name)) {
        this.$alert('文件名不能包含特殊字符，请修改后再试', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return false
      }
      
      this.$loading.showLoading()
      return true
      if (this.uploadType === 'rectification') {
        // 整改复查公共证据 附带参数
        this.url = `${baseUrl}/aj/examinereview/upload`
      }
      if (this.uploadType === 'rectificationDelay') {
        // 整改复查公共证据 附带参数
        this.url = `${baseUrl}/aj/examinereview/upload`
      }
    }
  },
  watch: {
    fileDetail: {
      handler: function(val, oldVal) {
        this.fileInfo = val
        console.info('now fileInfo', this.fileInfo)
      },
      deep: true,
      immediate: true
    },
    sourceId: {
      handler: function(val, oldVal) {
        console.log(val, oldVal)
        this.publicId = val
      }
    },
    isUpdate: {
      handler: function(n, o) {
        if (this.uploadType === 'inspection' && n) {
          // 现场检查记录
          this.showFileList = false
        }
      },
      immediate: true
    }
  },
  created() {
    let token = localStorage.getItem('token')
    this.header = { Authorization: token }

    if (this.uploadType === 'uploadAccessory') {
      // 案件调查报告 && 案件移送书 && 案件终止 && 案件调查 && 处罚告知
      this.showFileList = false
      this.url = `${baseUrl}/aj/penaltyAccessory/uploadAccessory`
    } else if (this.uploadType === 'penaltyDiscretion') {
      // 处罚裁量
      this.showFileList = false
    } else if (this.uploadType === 'newRegister') {
      // 一般行政处罚  新增立案
      this.showFileList = false
    } else if (this.uploadType === 'applyInfo') {
      // 企业申请资料
      this.showFileList = false
    } else if (this.uploadType === 'rectification') {
      // 整改复查公共证据 附带参数
      this.showFileList = false
      this.url = `${baseUrl}/aj/examinereview/upload`
    } else if (this.uploadType === 'rectificationDelay') {
      // 延期整改复查公共证据 附带参数
      this.showFileList = false
      this.url = `${baseUrl}/aj/examinereview/upload`
      // this.fileInfo = { sourceId: this.$store.state.newReviewId, type: '0' }
    }
    if (this.uploadType === 'inspection' && this.isUpdate) {
      // 现场检查记录
      this.showFileList = false
    }
    // 有时PDF文件地址会出现跨域的情况,最好先处理一下
    // this.pdfsrc = pdf.createLoadingTask(this.pdfsrc)
  }
}
</script>

<style lang="less" scoped>
.uploadWrap {
  /deep/.el-dialog__body {
    height: 600px;
    padding: 10px;
  }

  .file-name {
    display: block;
    position: absolute;
    bottom: 0;
    color: #ffffff;
    background: #000000;
    opacity: 0.5;
    width: 100%;
    max-height: 40px;
    text-align: center;
  }
  /deep/ .el-upload--picture-card {
    width: 210px;
    height: 146px;
    position: relative;
    background: rgba(238, 245, 249, 1);
    .upload-proof-tips {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 210px;
      height: auto;
      padding-top: 85px;
      .tips-title {
        display: inline-block;
        width: 100%;
        line-height: 2 !important;
        color: #0099ff;
      }
      .tips-type {
        display: inline-block;
        width: 100%;
        line-height: 1 !important;
        color: #999999;
        font-size: 12px;
      }
    }
  }
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 210px;
}
// .pdf {
//   width: 700px;
//   height: 600px;
//   box-shadow: 5px 5px 5px #ccc;
// }
</style>
