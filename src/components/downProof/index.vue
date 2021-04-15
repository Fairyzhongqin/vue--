<template>
  <div>
    <div class="proof-show">
      <img :src="encodeURI(proof.accessoryUrl + '&token=' + token)" class="img-style" />
      <div class="proof-oper" v-if="!canDel">
        <i class="el-icon-view public no-del-left" @click="showDetail"></i>
        <i class="el-icon-download public no-del-right" @click="downLoad"></i>
        <span class="down-file-name">{{ proof.accessoryName }}</span>
      </div>
      <div class="proof-oper" v-if="canDel">
        <i class="el-icon-view public del-left" @click="showDetail"></i>
        <i class="el-icon-download public del-middle" @click="downLoad"></i>
        <i
          class="el-icon-delete public del-right"
          @click="delProof(proof.id, proof.accessoryId, proof.type)"
        ></i>
        <span class="down-file-name" :title="proof.accessoryName">{{ proof.accessoryName }}</span>
      </div>
    </div>
    <!-- img -->
    <el-dialog
      width="800px"
      height="800px"
      :before-close="closeDialog"
      :visible.sync="showDialog"
      class="proof-show-dialog"
      v-if="showDialog"
      append-to-body
    >
      <img :src="proof.accessoryUrl" width="100%" height="100%" alt />
    </el-dialog>
    <!--  -->
    <show-pdf
      :pdfId="applyInfoId"
      v-if="applyInfoDialog"
      :pdfType="'accessory'"
      @closePdf="closePdf"
      :writName="writName"
    ></show-pdf>
  </div>
</template>

<script>
import { delInspectionProof, delReviewProof } from '@api/onSiteInspection/index'
import { delProof } from '@/api/filingRegister' // 新增立案处
import { deleteFile } from '@/api/common' // 处罚裁量
import { delFile } from '@api/anjianshenli' // 案件调查、处罚告知、案件调查报告、案件移送书、案件终止
import showPdf from '@/components/showPdf/index'

export default {
  components: {
    showPdf
  },
  data() {
    return {
      showDialog: false, // 查看图片详情的开关,
      token: null,
      applyInfoId: '', //企业资料申请的PDFid
      applyInfoDialog: false, //企业资料申请PDF
      writName: '' //浏览的名字
    }
  },
  props: {
    proof: {
      type: Object,
      required: true,
      default: {
        accessoryDownUrl: '', // 附件下载url
        accessoryId: '', // 附件id
        accessoryName: '', // 附件名字
        accessoryType: '', // 附件类型
        accessoryUrl: '', // 附件在线显示url
        id: '', // 证据关联的id
        type: '' // 证据的类型 ： 公共的证据、检查项的证据
      }
    },
    canDel: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      // 来自哪个模块
      type: String
    }
  },
  methods: {
    // 下载附件
    downLoad() {
      window.location.href = this.proof.accessoryDownUrl + '&token=' + this.token
    },
    // 关闭查看详情弹窗
    closeDialog() {
      this.showDialog = false
    },
    // 展示详情弹窗
    showDetail() {
      console.log('viewview', this.proof, this.$route.fullPath)
      if (this.proof.accessoryType === '.pdf' && this.$route.fullPath === '/rectificationDelay') {
        this.applyInfoId = this.proof.accessoryId
        this.applyInfoDialog = true
        this.writName = '企业申请资料'
      } else if (this.proof.accessoryType === '.pdf' && this.$route.fullPath !== '/rectificationDelay') {
        this.applyInfoId = this.proof.accessoryId
        this.applyInfoDialog = true
      } else {
        // 图片
        this.showDialog = true
      }
    },
    closePdf() {
      this.applyInfoDialog = false
    },
    // 删除证据
    delProof(id, accessoryId, type) {
      if (this.type === 'newRegister') {
        // 一般行政处罚 新增立案处
        delProof({
          penaltyId: id,
          accessoryId: accessoryId
        }).then(res => {
          this.$emit('afterDel', accessoryId)
        })
        return
      }
      if (this.type === 'penaltyDiscretion') {
        // 一般行政处罚 处罚裁量
        deleteFile({
          accessoryIds: accessoryId
        }).then(res => {
          this.$emit('afterDel', accessoryId)
        })
        return
      }
      if (this.type === 'deleteAccessory') {
        // 一般行政处罚：案件调查报告、案件移送、案件终止、案件调查部分、处罚告知
        delFile({
          accessoryId: accessoryId
        }).then(res => {
          this.$emit('afterDel', accessoryId)
        })
        return
      }
      if (this.type === 'review') {
        delReviewProof({
          id,
          accessoryId,
          type
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$emit('removeProof', accessoryId)
        })
        return
      }
      if (id) {
        delInspectionProof({
          id,
          accessoryId,
          type
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$emit('removeProof', accessoryId)
        })
      } else {
        // 延期申请审批企业资料
        this.$emit('removeProof', accessoryId)
      }
    }
  },
  mounted() {
    this.token = localStorage.getItem('token')
    this.proof.accessoryUrl += '&token=' + this.token
  }
}
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
// /deep/.el-dialog__wrapper .el-dialog__header {
//   padding: 25px;
// }
.proof-show {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  width: 220px !important;
  height: 146px;
  .img-style {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .proof-oper {
    visibility: hidden;
    width: 220px;
    height: 146px;
  }
  &:hover {
    .proof-oper {
      visibility: visible;
      position: relative;
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 30px;
      color: #ffffff;
      .public {
        position: absolute;
        top: 40%;
        &:hover {
          cursor: pointer;
        }
      }
      .no-del-left {
        left: 30%;
      }
      .no-del-right {
        right: 30%;
      }
      .del-left {
        left: 20%;
      }
      .del-middle {
        left: 42%;
      }
      .del-right {
        right: 20%;
      }
      .down-file-name {
        display: inline-block;
        max-height: 60px;
        text-align: center;
        width: 100%;
        font-size: 14px;
        position: absolute;
        bottom: 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}

.proof-show-dialog.proof-show-dialog {
  /deep/.el-dialog__headerbtn.el-dialog__headerbtn {
    top: 0;
    right: 4px;
  }
}
</style>