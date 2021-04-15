<template>
  <div class="all-writ-see-group">
    <tips @clickHandle="initList"></tips>
    <div class="show-pdf-content">
      <el-dialog title="文书合集" :visible.sync="showPdf" class="writ-dialog" :before-close="close">
        <div class="writ-dialog-content">
          <div class="writ-dialog-content-name-list">
            <div v-for="(item, index) in writList" :key="index" class="writ-dialog-content-name" :class="{isClick: item.isClick}" @click="seePdf(item)">
              <span class="writ-dialog-content-name-span">{{ item.writTitle }}</span>
            </div>
          </div>
          <div class="writ-dialog-content-pdf">
            <show-pdf :isWorkArea="true" :pdfType="pdfType" :pdfId="writId" v-if="writId !== '' && imgUrl === ''"></show-pdf>
            <img :src="imgUrl" v-if="writId === '' && imgUrl !==''" class="writ-all-img">
            <div class="writ-dialog-content-upload-pdf" v-show="writId !== '' && isUpload == 1">
              <el-upload
                :action="uploadFileUrl"
                multiple
                ref="upload"
                :show-file-list="false"
                :headers="headers"
                :data="params"
                :before-upload="beforeUpload"
                :on-success="uploadSuccessful"
                :on-error="uploadFailed"
              >
                <el-button type="primary" @click="setParams">上传签字文书</el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getWritInfo } from "@/api/fileRelated";
import showPdf from "@/components/showPdf";
import baseUrl from "@/utils/webIp";
import tips from "@/components/writGroup/tips"
export default {
  components: {
    showPdf,
    tips
  },
  props: {
    allWritInfo: {
      type: Object,
      required: true,
      default: function() {
        return {
          sourceId: "",
          type: ""
        };
      }
    }
  },
  data() {
    return {
      showPdf: false,
      writList: [],
      writId: "",
      headers: {},
      params: {
        type: "0",
        writId: ""
      },
      uploadFileUrl: "",
      isUpload: 0, // 是否需要上传签字文书：0-否；1-是
      imgUrl: "",
      pdfType: null,
    };
  },
  methods: {
    initList() {
      if(this.allWritInfo.sourceId && this.allWritInfo.sourceId !== '') {
        getWritInfo({
          sourceId: this.allWritInfo.sourceId,
          // type: this.allWritInfo.type
        }).then(res => {
          this.writList = res.data;
          if(res.data && res.data.length > 0) {
            res.data[0].isClick = true;
            this.writId = res.data[0].writId;
            this.isUpload = res.data[0].isUpload;
            this.writList = res.data.reduce((total, item) => {
              let arr = [];
              if(item.lst && item.lst.length > 0) {
                arr = item.lst.reduce((t, i) => {
                  i.writTitle = i.accessoryName.split(".")[0];
                  t.push(i);
                  return t;
                }, [])
              }
              total.push(item);
              total = [...total, ...arr];
              return total;
            }, [])
            this.showPdf = true;
          } else {
            this.$message({
              message: "该条数据没有生成文书",
              type: "warning"
            })
          }
        });
      } else {
        this.$message({
          message: "请先选中一条记录",
          type: "warning"
        })
      }
    },
    seePdf(val) {
      console.log(val)
      this.writList.forEach(item => {
        item.isClick = false;
      })
      val.isClick = true;
      this.writId = "";
      this.isUpload = 0;
      this.pdfType = null;
      this.imgUrl = "";
      Promise.resolve().then(() => {
        if(val.writId && val.writId !== "") {
          this.writId = val.writId;
          this.isUpload = val.isUpload;
          return;
        } 
        if(val.accessoryName && val.accessoryName !== "") {
          let token = sessionStorage.getItem("token");
          let imgType = ".png.jpeg.jpg";
          this.imgUrl = imgType.indexOf(val.accessoryType) !== -1 ? val.accessoryUrl + '&token=' + token : "";
          this.writId = val.accessoryType === '.pdf' ? val.accessoryUrl.split("accessoryId=")[1] : "";
          this.pdfType = val.accessoryType === '.pdf' ? "accessory" : null;
          this.isUpload = 0;
        }
      })
    },
    beforeUpload(file) {
      // console.info("writId", this.docData.writId);
      let typeList = "image/jpeg/image/jpg/image/png/application/pdf/JPEG/JPG/PNG/PDF";
      let fileNameReg = /[#$@&%',;=?$/]/gi
      if (
        typeList.indexOf(file.name.substring(file.name.lastIndexOf(".") + 1)) <
        0
      ) {
        this.$message({
          type: "error",
          message: "请上传正确的附件格式：图片或PDF文件！"
        });
        return false;
      } else if (fileNameReg.test(file.name)) {
        this.$alert("文件名不能包含特殊字符，请修改后再试", null, {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return false
      } else {
        this.$loading.showLoading()
        return true;
      }
    },
    uploadSuccessful(info) {
      this.$loading.hiddenLoading()

      if (info.code === '0') {
        this.$message({
          type: "success",
          message: "文件上传成功！"
        });
        this.initList();
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
    setParams() {
      this.params.writId = this.writId;
    },
    close() {
      this.writId = "";
      this.showPdf = false;
    }
  },
  created() {
    this.uploadFileUrl = baseUrl + "/aj/writ/uploadWritAccessory";
    this.headers.Authorization = localStorage.getItem("token");
  }
};
</script>

<style lang="less" scoped>
.all-writ-see-group {
  .show-pdf-content {
    .el-dialog__wrapper {
      overflow: hidden !important;
      /deep/ .el-dialog {
        margin: 0 !important;
        width: 100vw;
        height: 100vh;
        .el-dialog__header {
          height: 2vh;
        }
        .el-dialog__body {
          height: 95vh;
          .pdf-iframe {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
    .writ-dialog {
      z-index: 3336 !important;
      .writ-dialog-content {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        .writ-dialog-content-name-list {
          width: 20%;
          height: 100%;
          overflow-y: auto;
          .writ-dialog-content-name {
            height: 42px;
            line-height: 42px;
            color: #333333;
            padding-left: 18px;
            &:hover {
              cursor: pointer;
            }
            .writ-dialog-content-name-span {
              width: 100%;
              display: inline-block;
              overflow-x: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .isClick {
            position: relative;
            color: #0099FF;
            background-color: #EEF5F9;
            &::before {
              content: "";
              display: block;
              position: absolute;
              color: #0099FF;
              width: 5px;
              height: 42px;
              background-color: #0099FF;
              left: 0;
              top: 0;
            }
          }
        }
        .writ-dialog-content-pdf {
          position: relative;
          width: 100%;
          background-color: #EBEEF6;
          .writ-dialog-content-upload-pdf {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 42px;
            line-height: 42px;
            background-color: #FFFFFF;
            text-align: center;
            border: 1px solid #E0E0E0;
            border-bottom-color: transparent;
          }
          .writ-all-img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>