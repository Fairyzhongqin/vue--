<template>
  <div class="container-page-content">
    <section class="container-page">
      <div v-for="(writ, index) in writArr" :key="index">
        <div class="writ" :tabindex="index" v-if="!!writ">
          <!-- @load="loadImg(writ, index)" -->
          <!-- 二选一哈哈哈 -->
          <!-- loading='lazy' -->
          <img
            width="180"
            height="85%"
            class="writImg"
            @load="loadImg(writ, index)"
            @click="preview(writ)"
            :src="writ.picUrl + '&token=' + token"
            :alt="writ.fileName"
          />
          <el-button @click="delWrit(writ, index)" type="danger" class="del-button" size="mini" plain>删除</el-button>
        </div>
        <span class="file-name" v-if="!!writ" :title="writ.fileName">{{ writ.fileName }}</span>
      </div>
      <div v-if="uploadReq.treeCode">
        <upload-file @getUploadMsg="getWrit" :fileDetail="uploadReq"></upload-file>
      </div>
    </section>
    <section v-if="writArr.length === 0" class="container-empty-data">
      <sn-empty-data :text="emptyText"></sn-empty-data>
    </section>
    <progress v-if="loadingRatio !== 1 && startLoading" :value="loadingRatio"></progress>
    <div v-if="loadingRatio !== 1 && startLoading" class="progress-model">
      <span class="jz-progress-model-span">正在加载...</span>
    </div>
    <el-dialog :visible.sync="isPreviewVis" :before-close="closeDialog" :title="dialogTitle" :modal-append-to-body="false">
      <img :src="previewAsset" class="show-img" />
    </el-dialog>
  </div>
</template>

<script>
import { getNodeRelatedWrit, delNodeWrit } from '@/api/dossier'
import { debounce } from '@/utils/util'
import uploadFile from '@/pages/commonHandle/newHandle/dianzijuanzong/common/uploadFile'
import snEmptyData from '@/components/snEmptyData'
import { mapState } from 'vuex'

export default {
  components: {
    snEmptyData,
    uploadFile
  },
  props: {
    treeNode: {
      type: Object
    }
  },
  data() {
    return {
      emptyText: '暂无卷宗首页', // 无文书时占位图文字
      dialogTitle: '', // 弹出框标题
      writArr: [], // 文书列表
      startLoading: false, // 开始加载图片资源
      loadingRatio: 0, // 文书加载进度
      loadedNum: 0, // 已加载的文书及签字文书：img格式
      imgNeedLoad: 0, // 需要加载的图片（有缓存图片，所以需要计算一下）
      isPreviewVis: false, // 弹出框是否显示
      previewAsset: '', // 浏览文书图片的 url
      uploadReq: {
        penaltyId: '',
        treeCode: ''
      },
      token: ''
    }
  },
  computed: {
    ...mapState(['moduleId'])
  },
  created() {
    this.uploadReq.penaltyId = this.moduleId
    this.token = localStorage.getItem('token')
    this.delWrit = debounce(this.delWrit)
  },
  methods: {
    // 获取文书列表信息
    getWrit() {
      let idReq = {
        penaltyId: this.moduleId
      }
      this.$emit('treeLoading', true)
      getNodeRelatedWrit(idReq, this.treeNode).then(res => {
        this.$emit('treeLoading', false)
        this.writArr = res.data
        if (res.data.length > 0) {
          this.$nextTick(() => {
            this.getNeedNum()
          })
          this.$emit('numUpdate', res.hasLoadNum, this.treeNode)
        } else {
          this.startLoading = false
          this.$emit('numUpdate', res.hasLoadNum, this.treeNode)
        }
      })
    },
    // 获取尚需加载的图片数量
    getNeedNum() {
      let imgArr = document.getElementsByClassName('writImg')
      this.imgNeedLoad = 0
      Array.prototype.forEach.call(imgArr, img => {
        if (!img.complete) {
          this.imgNeedLoad++
        }
      })
      if (this.imgNeedLoad === 0) {
        this.startLoading = false
      }
    },
    // 删除文书
    delWrit(writ, index) {
      this.$confirm(`确定删除${writ.fileName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let delReq = {
            accessoryId: writ.accessoryId,
            treeCode: writ.treeCode
          }
          delNodeWrit(delReq)
            .then(res => {
              this.getMessage('success', '删除文书成功！')
              this.getWrit()
            })
            .catch(err => {
              this.getMessage('error', '删除文书失败！')
            })
        })
        .catch(() => {
          document.activeElement.blur()
        })
    },
    // 图片加载成功回调
    loadImg(img, index) {
      this.loadedNum++
      if (this.imgNeedLoad !== 0) {
        this.loadingRatio = this.loadedNum / this.imgNeedLoad
      }
      if (this.loadingRatio === 1) {
        this.startLoading = false
      }
    },
    // 浏览文书图片
    preview(writ) {
      this.previewAsset = writ.picUrl + '&token=' + this.token
      this.isPreviewVis = true
      this.dialogTitle = writ.fileName
    },
    // 关闭弹出框
    closeDialog() {
      this.previewAsset = ''
      this.dialogTitle = ''
      this.isPreviewVis = false
    },
    // 提示信息
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    }
  },
  watch: {
    treeNode: {
      handler: function(newVal, oldVal) {
        if (newVal.id) {
          // 判断非第一次监听到的空值
          this.uploadReq.treeCode = this.treeNode.treeCode
          if (newVal.treeName === '处罚裁量') {
            this.emptyText = `暂无数据`
          } else {
            this.emptyText = `暂无${newVal.treeName}文书`
          }
          this.loadedNum = 0
          this.loadingRatio = 0
          this.startLoading = true
          console.info('watch!!!')
          this.getWrit()
        } else {
          this.uploadReq.treeCode = ''
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.container-page-content {
  position: relative;
  height: 100%;
  .container-page {
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    padding: 16px 0;
    > div {
      height: 300px;
      margin-bottom: 25px;
      text-align: center;
      font-size: 0;
    }
    .writ {
      display: inline-block;
      height: 85%;
      position: relative;
      outline: none;
      &:hover,
      &:focus {
        margin-top: -7px;
        transition: all 0.2s;
      }
      img {
        object-fit: cover;
        height: 100%;
      }
      &:hover,
      &:focus {
        object-fit: cover;
      }
      &:hover img,
      &:focus img {
        width: 190px;
        transition: all 0.2s;
        object-fit: cover;
        cursor: pointer;
      }
      &:hover .del-button,
      &:focus .del-button {
        transform: scale(1.1);
        transition: all 0.2s;
      }
      .del-button {
        position: absolute;
        top: 8px;
        right: 8px;
        &.el-button {
          height: 24px;
          padding: 5px 6px;
        }
      }
    }
    .file-name {
      display: inline-block;
      width: 80%;
      margin-top: 9px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      font-size: 14px;
      color: hsla(0, 0%, 20%, 1);
    }
  }
  .container-empty-data {
    position: absolute;
    width: 100%;
    top: 45%;
    /* .sn-empty-data {
      position: absolute;
      top: 50%;
    } */
  }
  progress::-webkit-progress-bar {
    background: transparent;
  }
  progress {
    position: absolute;
    top: 0;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: hsla(224, 38%, 94%, 1);
    color: hsla(224, 38%, 94%, 1); /* IE 10 */
    overflow: hidden;
  }
  .progress-model {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 4px;
    background: hsla(224, 38%, 94%, 1);
  }
  .jz-progress-model-span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    color: #999999;
  }
}

.el-dialog__wrapper {
  overflow: hidden;
}
/deep/ div.el-dialog {
  margin-top: 5vh !important;
  height: 90vh;
  width: 80%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
    border: none;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(91, 108, 130, 0.1);
    border-radius: 4px;
    width: 7px;
    border: none;
    margin-right: 3px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: rgba(91, 108, 130, 0.3);
  }
  .show-img {
    width: 100%;
  }
}
</style>
