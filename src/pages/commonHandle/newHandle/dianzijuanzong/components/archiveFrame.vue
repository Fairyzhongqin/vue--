<template>
  <div class="wrapper" v-loading="reqLoading" element-loading-background="rgba(255,255,255,0.5)">
    <header>
      <h4>制作电子卷宗</h4>
      <i class="el-icon-close" size="large" @click="closeFrame"></i>
      <!-- <i class="iconfont iconzhankai" @click="closeFrame"></i> -->
    </header>
    <!-- 导入树的组件 -->
    <section>
      <aside v-loading="menuLoading" element-loading-text="正在加载卷宗菜单" element-loading-spinner="el-icon-loading" element-loading-background="#EEF5F9">
        <slideBar ref="slideBar" :type="type" @selectNode="selectNode" @loadingFinish="loadingFinish"></slideBar>
      </aside>
      <content>
        <container-page :treeNode="treeNode" @numUpdate="numUpdate" @treeLoading="setTreeLoading"></container-page>
      </content>
    </section>
    <footer>
      <div class="buttons">
        <el-button v-if="type !== 'audit'" size="mini" type="primary" @click="checkType('cover')">制作卷宗首页</el-button>
        <el-button v-if="type !== 'audit'" size="mini" type="primary" @click="checkType('directory')">制作卷宗目录</el-button>
        <el-button size="mini" type="primary" @click="checkType('archive')">制作电子卷宗</el-button>
        <el-button size="mini" :disabled="!isExist" :type="isExist ? 'primary' : 'info'" @click="checkType('export')">导出卷宗</el-button>
        <a ref="download" :href="archiveUrl"></a>
      </div>
    </footer>
    <el-dialog :modal-append-to-body="false" custom-class="dialog_class" :visible.sync="showDialog" :title="dialogTitle" :before-close="close">
      <front-page v-if="dialogContent === 'frontPage'" @createFr="initTree(0)" @afterMath="afterFrPage"></front-page>
      <directory v-if="dialogContent === 'directory'" @createDire="initTree(1)" @afterMath="afterDirectory"></directory>
    </el-dialog>
    <show-pdf
      :pdfId="archiveId"
      @closePdf="closePdf"
      v-if="showPdf"
      :pdfType="'accessory'"
      :buttonList="{
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true
      }"
      :writName="'电子卷宗'"
    ></show-pdf>
    <div v-if="archiveModal" class="v-modal" tabindex="0" style="z-index: 1900"></div>
  </div>
</template>

<script>
import showPdf from '@/components/showPdf'
import snEmptyData from '@/components/snEmptyData'
import slideBar from './slideBar'
import directory from './directory'
import frontPage from './frontPage'
import containerPage from './containerPage'
import { createArchive, getDownloadURL } from '@/api/dossier'
import { mapState } from 'vuex'

export default {
  name: 'archiveFrame',
  components: {
    snEmptyData,
    slideBar,
    directory,
    frontPage,
    containerPage,
    showPdf
  },
  props: {
    type: {
      // audit 法制审核
      type: String
    }
  },
  data() {
    return {
      archiveShow: true, // 电子卷宗专用模态框
      isExist: false, // 是否已制作过电子卷宗
      treeNode: {}, // 所选菜单树的 node
      showDialog: false, // 是否显示弹出框
      dialogTitle: '', // 弹出框的标题
      dialogContent: '', // 弹出框呈现的内容
      menuLoading: true,
      archiveId: '', // 电子卷宗 id
      archiveUrl: '', // 电子卷宗下载地址
      showPdf: false,
      token: '',
      reqLoading: false
    }
  },
  computed: {
    ...mapState(['moduleId', 'archiveModal'])
  },
  created() {
    this.token = localStorage.getItem('token')
    this.getUrl()
  },
  methods: {
    setTreeLoading(bol) {
      console.info(bol)
      this.reqLoading = bol
    },
    // 更新节点的文书数量
    numUpdate(num, node) {
      this.$refs.slideBar.setNum(num, node)
    },
    // 获取电子卷宗下载链接
    getUrl() {
      getDownloadURL({
        penaltyId: this.moduleId,
        fileType: this.type === 'audit' ? '1' : '0' //0-大卷宗  1-小卷宗
      }).then(res => {
        if (res.data) {
          let token = localStorage.getItem('token')
          this.archiveUrl = res.data.accessoryUrl + '&token=' + this.token
          this.isExist = true
        } else {
          this.isExist = false
        }
      })
    },
    close() {
      this.$store.commit('UPT_ARCHIVE_MODAL', false)
      this.showDialog = false
      this.dialogTitle = ''
      this.dialogContent = ''
    },
    // 关闭制作电子文书整个组件
    closeFrame() {
      this.$emit('closeFrame')
    },
    // 点击按钮
    checkType(type) {
      switch (type) {
        case 'cover':
          this.showDialog = true
          this.dialogContent = 'frontPage'
          this.dialogTitle = '制作卷宗首页'
          break
        case 'directory':
          this.showDialog = true
          this.dialogContent = 'directory'
          this.dialogTitle = '制作卷宗目录'
          break
        case 'archive':
          this.createArchive()
          break
        case 'export':
          this.exportArchive()
          break
        default:
          return
      }
    },
    // 导出电子卷宗
    exportArchive() {
      if (!this.archiveUrl) {
        this.getMessage('warning', '请先制作电子卷宗！')
        return
      }
      this.$refs.download.click()
    },
    // 制作电子卷宗
    createArchive() {
      createArchive({
        penaltyId: this.moduleId,
        fileType: this.type === 'audit' ? '1' : '0' //0-大卷宗  1-小卷宗
      })
        .then(res => {
          if (res.data.accessoryUrl) {
            this.getMessage('success', '制作电子卷宗成功！')
            this.getUrl()
            this.showPdf = true
            this.archiveId = res.data.accessoryId
          }
        })
        .catch(err => {
          this.getMessage('warning', err)
        })
    },

    // 选择树节点后
    selectNode(node) {
      this.treeNode = node
    },
    loadingFinish(node) {
      this.menuLoading = false
    },
    // 制作目录或首页后需重新获取树
    initTree(index) {
      this.$refs.slideBar.queryTreeInfo(index)
    },
    // 制作卷宗目录后的回调
    afterDirectory(val) {
      if (val) {
        // 单纯用来激活 containerPage watch
        let id = this.treeNode.id
        this.treeNode.id = ''
        this.treeNode.id = id
      }
      this.close()
    },
    // 制作卷宗首页后的回调
    afterFrPage(val) {
      if (val) {
        // 单纯用来激活 containerPage watch
        let id = this.treeNode.id
        this.treeNode.id = ''
        this.treeNode.id = id
      }
      this.close()
    },
    // 关闭制作电子卷宗的 pdf 浏览
    closePdf() {
      this.showPdf = false
    },
    // 提示信息
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background: white;
  header {
    border-bottom: 1px solid #e0e0e0;
    h4 {
      padding: 14px 0 10px 16px;
      margin: 0;
      font-size: 16px;
      height: 22px;
      color: #333333;
    }
    .el-icon-close {
      position: absolute;
      right: 15px;
      top: 14px;
      font-size: 22px;
      color: #666666;
      cursor: pointer;
    }
  }
  > section {
    display: flex;
    justify-content: space-between;
    background: #ebeef6;
    height: calc(100vh - 90px);
    aside {
      width: 268px;
      background-color: #eef5f9;
      overflow-y: scroll;
      /deep/ .el-loading-mask {
        z-index: 1899; // 不可高于 1900
      }
    }
    content {
      flex-grow: 1;
      overflow-y: auto;
    }
    aside::-webkit-scrollbar,
    content::-webkit-scrollbar {
      width: 10px;
      border: none;
    }

    aside::-webkit-scrollbar-thumb,
    content::-webkit-scrollbar-thumb {
      background: rgba(91, 108, 130, 0.1);
      border-radius: 4px;
      width: 7px;
      border: none;
      margin-right: 3px;
    }

    aside:hover::-webkit-scrollbar-thumb,
    content:hover::-webkit-scrollbar-thumb {
      background: rgba(91, 108, 130, 0.3);
    }

    // aside:hover::-webkit-scrollbar-track {
    //   background: hsla(0, 0%, 53%, 0.1);
    // }
  }
  footer {
    position: absolute;
    width: 100%;
    height: 30px;
    line-height: 30px;
    bottom: 0;
    padding: 6px 0;
    margin: 0 auto;
    background: #fff;
    text-align: center;
    border-top: 1px solid #e0e0e0;
  }
  /deep/ .dialog_class {
    z-index: 2020;
    width: 72%;
  }
}
</style>
