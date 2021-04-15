<template>
  <div>
    <div style="margin-top: 24px;" v-if="proofList.length === 0 && noDataShow && !forBrowse && !justHide">
      <sn-add-button @buttonClick="addProof" :text="btnText"></sn-add-button>
      <sn-empty-data :text="emptyText"></sn-empty-data>
    </div>

    <section :class="proofContainer" class="proof-list_penalty">
      <div v-for="(item, index) in proofList" :key="index" class="proof">
        <down-proof v-if="!!item" :type="'deleteAccessory'" :proof="item" :canDel="!forBrowse" @afterDel="afterDelProof"></down-proof>
      </div>
      <div class="upload-proof" v-if="!forBrowse">
        <upload-proof
          ref="proof"
          v-show="!noDataShow || proofList.length > 0"
          :uploadType="'uploadAccessory'"
          :fileDetail="uploadReq"
          @afterDel="afterDelProof"
          @getUploadMsg="afterUpload"
        ></upload-proof>
      </div>
    </section>
  </div>
</template>

<script>
import baseUrl from '@/utils/webIp'
import { getFile } from '@api/anjianshenli'
import snAddButton from '@/components/snAddButton'
import snEmptyData from '@/components/snEmptyData'
import downProof from '@components/downProof/index'
import uploadProof from '@components/uploadProof/index'

export default {
  name: 'anjianzhongzhiMakePage',
  components: {
    downProof,
    uploadProof,
    snAddButton,
    snEmptyData
  },
  props: {
    forBrowse: {
      // 是否综合浏览
      type: Boolean,
      default: false
    },
    sourceType: {
      // 哪个模块
      type: String
    },
    btnText: {
      // 按钮文字
      type: String
    },
    justHide: { // 因新需求而导致的上传按钮是否隐藏
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      proofContainer: '',
      emptyText: '', // 无附件时占位符描述
      noDataShow: true, // 无上传数据时默认页面
      uploadReq: {
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        sourceType: ''
      }, // 上传附件需要的参数
      proofList: [
        /* {
          accessoryDownUrl: "", // 附件下载url
          accessoryId: "", // 附件id
          accessoryName: "", // 附件名字
          accessoryType: "", // 附件类型
          accessoryUrl: "", // 附件在线显示url
          id: "" // 证据关联的id
        } */
      ], // 证据列表
      penalty: {}
    }
  },
  mounted() {
    this.uploadReq.sourceType = this.sourceType
    this.emptyText = '暂无' + this.btnText
    this.getProofs()
  },
  methods: {
    getProofs() {
      getFile(this.uploadReq)
        .then(res => {
          let _proofs = res.data
          this.proofList = []
          _proofs.forEach(proof => {
            let proofObj = this.getProofObj(proof)
            this.proofList.push(proofObj)
          })
        })
        .catch(err => console.info(err))
    },
    addProof() {
      this.noDataShow = false
      this.$refs.proof.$refs.inner_upload.$children[0].handleClick()
    },
    // 删除证据后
    afterDelProof(accessoryId) {
      let delIndex
      this.proofList.forEach((proof, index) => {
        if (proof.accessoryId === accessoryId) {
          delIndex = index
        }
      })
      this.proofList.splice(delIndex, 1)
    },
    // 上传附件后
    afterUpload(res) {
      let proofObj = this.getProofObj(res.data)
      this.proofList.push(proofObj)
    },
    // 处理证据
    getProofObj(proof) {
      return {
        accessoryDownUrl: proof.accessoryUrl, // 附件下载url
        accessoryId: proof.accessoryId, // 附件id
        accessoryName: proof.accessoryName, // 附件名字
        accessoryType: '', // 附件类型
        accessoryUrl: proof.accessoryImgUrl, // 附件在线显示url
        id: proof.penaltyId // 证据关联的id
      }
    }
  },
  watch: {
    proofList: {
      handler: function(nv, ov) {
        if (nv.length > 0) {
          console.info('hahah我被调用了')
          this.$emit('getEnoughProof', false)
        } else if (nv.length === 0) {
          this.$emit('getEnoughProof', true)
        }
      }
    }
  }
}
</script>

<style lang="less" scope>
.proof-list_penalty {
  display: flex;
  width: auto;
  justify-content: flex-start;
  flex-wrap: wrap;
  // overflow: scroll;
  margin-top: 21px;
  .proof {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  /deep/ .proof-show {
    // width: auto !important;
    /deep/ .proof-oper {
      width: auto;
    }
  }
}

.three-grid {
  grid: repeat(3, 32%);
  grid-template-columns: repeat(3, 32%);
}
</style>
