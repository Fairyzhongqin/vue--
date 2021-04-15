<template>
  <div style="height: 100%">
    <div class="show-pdf-content">
      <el-dialog :modal-append-to-body="false" :visible="!isWorkArea" :before-close="closeDialog" :title="writName" class="writ-dialog">
        <iframe :src="url" frameborder="0" id="iframe" v-if="hasPdf && !isLoading" class="pdf-iframe"></iframe>
        <div v-if="!hasPdf && !isLoading" class="tips warn">暂无文书</div>
        <div v-if="isLoading" class="tips">正在加载...</div>
        <div class="seal-button" v-show="hasPdf && !isLoading && isReady">
          <span class="button-list">
            <el-button @click="handleClick('closePdf')" v-if="buttonList.closePdf" type="danger" plain>退出</el-button>
            <el-button @click="handleClick('updatePdf')" v-if="buttonList.updatePdf" type="primary">回退编辑</el-button>
            <el-button @click="handleClick('word')" v-if="buttonList.updatePdf" type="primary">
              <!-- <a class="word" style="width:100%;height:100%;" :href="wordHref"></a> -->
              预览并编辑文书
            </el-button>
            <el-button v-if="buttonList.updatePdf" @click="downloadWord" type="primary">
              下载word文书
            </el-button>

            <el-upload
              style="display:inline-block;padding: 0 9px;"
              :action="uploadWordUrl"
              multiple
              ref="upload"
              :show-file-list="false"
              :headers="headers"
              :data="params"
              v-if="buttonList.updatePdf"
              :before-upload="beforeUpload"
              :on-success="uploadSuccessful"
              :on-error="uploadFailed"
            >
              <el-button class="button_style" type="primary" slot="trigger">上传word文书</el-button>
            </el-upload>

            <el-button @click="handleClick('signPdf')" v-if="buttonList.signPdf && !isNotZcr && canCurrUserSign" type="primary" :disabled="canSign"
              >{{ canSign ? '已' : '' }}签名</el-button
            >
            <el-button
              v-if="buttonList.signPdf && !isGroupSign && this.writTypeCode !== 'ws10029' && canCurrUserSign"
              type="primary"
              @click="handleClick('otherSign')"
            >
              签名+
            </el-button>
            <el-button @click="handleClick('sealPdf')" v-if="buttonList.sealPdf" type="primary" :disabled="!sealBtnCanUse">加盖公章</el-button>
            <el-button @click="handleClick('lawSealPdf')" v-if="buttonList.lawSealPdf" :disabled="disabled" type="primary">加盖执法专用章</el-button>
            <el-button @click="handleClick('auditPdf')" v-if="buttonList.auditPdf" type="primary" :disabled="!sealBtnCanUse">{{ auditBtnDes }}</el-button>
            <el-button @click="handleClick('finishPdf')" v-if="buttonList.finishPdf" type="primary">完成</el-button>
            <!-- <el-button @click="closeDialog">修改</el-button> -->
            <!-- <el-button type="primary" @click="seal" v-show="isUserSign === 1">签名</el-button> -->
          </span>
        </div>
      </el-dialog>
      <div style="height: 100%; position: relative" v-if="isWorkArea">
        <iframe :src="url" height="100%" frameborder="0" width="100%" id="iframe" v-if="hasPdf && !isLoading"></iframe>
        <div v-if="!hasPdf && !isLoading" class="tips warn">暂无文书</div>
        <div v-if="isLoading" class="tips">正在加载...</div>
        <!-- <div class="seal-button" v-show="hasPdf && !isLoading && isReady && isUserSign === 1">
          <span class="button-list">
            <el-button type="primary" @click="seal">签名</el-button>
          </span>
        </div>-->
      </div>
    </div>
    <el-dialog :title="`选择${selectTitle}人员`" width="900px" height="600px" :visible.sync="selectPeople" class="special-class-name-sy">
      <select-people @getPeople="getPeople" :selectNum="1" v-if="selectPeople"></select-people>
    </el-dialog>
    <el-dialog title="选择执法章" width="900px" height="600px" :visible="signatureVisible" @close="closeSign">
      <signature-group :signatureList="signatureList" @close="closeSign" @sentToSign="signMultiple"></signature-group>
    </el-dialog>
    <el-dialog
      title="签名+"
      width="400px"
      height="600px"
      :modal-append-to-body="false"
      :visible.sync="otherSignVisible"
      @close="closeSignDialog"
      class="other_form"
    >
      <el-form :model="otherForm" status-icon ref="otherForm" :rules="rules" :show-message="false" label-width="110px" v-if="otherSignVisible">
        <el-form-item label="" prop="username">
            <div slot="label" class="slot_label">签名人账号</div>
          <el-input type="text" v-model="otherForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
            <div slot="label" class="slot_label">签名人密码</div>
          <el-input type="password" v-model="otherForm.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div class="dialog-footer" style="text-align: right">
        <el-button @click="closeSignDialog">取消</el-button>
        <el-button type="primary" @click="signOther" :loading="signOtherLoading">签名</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseUrl from '@/utils/webIp'
import { debounce } from '@/utils/util'
import { previewWrit, sealWrit, queryWritState, signLogin } from '@/api/fileRelated'
import { showSignature } from '@/api/common'
import signatureGroup from '@/components/signatureGroup/index'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { mapState } from 'vuex'
export default {
  name: 'showPdf',
  components: {
    selectPeople,
    signatureGroup
  },
  props: {
    // 文书id
    pdfId: {
      type: String,
      required: true
    },
    // 工作台审核审批单独样式
    isWorkArea: {
      type: Boolean,
      required: false
    },
    pdfType: {
      // 浏览哪类 PDF
      type: String
    },
    // 文书的名字
    writName: {
      type: String,
      required: false,
      default: '浏览文书'
    },
    writTypeCode: { // ws开头
      type: String,
      required: false
    },
    // 父组件是否取消审核
    cancelAudit: {
      type: Boolean,
      default: false
    },
    isGroupSign: {
      type: Boolean,
      default: false
    },
    // 浏览文书上需要展示的按钮
    buttonList: {
      type: Object,
      required: false,
      default: function() {
        return {
          updatePdf: false, // 回退编辑
          signPdf: false, // 签名
          auditPdf: false, // 提交审核
          sealPdf: false, // 加盖公章
          finishPdf: false, // 完成
          lawSealPdf: false, // 加盖执法专用章
          closePdf: true // 退出
        }
      }
    },
    isNotZcr: {
      // 不是主持人不能签名的情况
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      auditBtnDes: '提交审核', // 提交审核按钮内容
      url: '',
      hasPdf: false,
      isLoading: true,
      isReady: false,
      selectPeople: false,
      sealState: '',
      auditTypeCode: null,
      sealType: null,
      disabled: false,
      canSign: false,
      canSealLaw: true,
      sealBtnCanUse: true,
      writTypeName: '', // 文书名称拼音首字母
      isAllSigned: '', // 是否所有承办人员已签名
      signatureVisible: false, //执法章弹窗
      signatureList: false, //执法章数据
      canCurrUserSign: true, // 当前用户是否可签名
      wordHref: '',
      uploadWordUrl: '',
      headers: { Authorization: '' }, // 授权信息
      params: {
        writId: '',
        type: '2' // 0 签字附件 1 其他附件 2 word文书
      },
      otherSignVisible: false,
      otherForm: {
        username: '',
        password: ''
      },
      signOtherLoading: false,
      rules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      selectTitle: '审核'
    }
  },
  methods: {
    closeSign() {
      this.signatureVisible = false
    },
    getSignInfo() {
      let userId = JSON.parse(sessionStorage.userInfo).userEntity.id
      showSignature({
        type: 2,
        userId: userId
      })
        .then(res => {
          if (res.code !== '0') return
          this.signatureList = res.data
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    updateAllSign() {
      queryWritState({ writId: this.pdfId }).then(res => {
        // 若当前用户无签名权限，签名与签名+按钮均不显示
        if (!res.data.currUserHasSignPerm) {
          this.canCurrUserSign = false
        }
        this.canSign = res.data.currUserIdSign
        this.canSealLaw = res.data.noProcessSignStatus == 0
        if (res.data.writTypeCode === 'ws10029') {
          this.isAllSigned = res.data.isAllUserSign
        } else {
          this.isAllSigned = res.data.isUserSign === 1 ? res.data.isAllUserSign : true
        }
      })
    },
    // 签名 & 加盖执法专用章 单章
    seal() {
      this.isLoading = true
      sealWrit({
        writId: this.pdfId,
        signType: this.sealType
      }).then(
        () => {
          this.updateAllSign()

          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.isLoading = false
          this.$emit('signSuccess')
        },
        err => {
          this.$message({
            message: err,
            type: 'error'
          })
          this.isLoading = false
        }
      )
    },
    // 盖执法章 多章
    signMultiple(data) {
      let signId = data.signId
      this.isLoading = true
      sealWrit({
        writId: this.pdfId,
        signType: this.sealType,
        signId: signId
      }).then(
        () => {
          this.updateAllSign()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.disabled = true
          this.signatureVisible = false
          this.isLoading = false
          this.$emit('signSuccess')
        },
        err => {
          this.$message({
            message: err,
            type: 'error'
          })
          this.isLoading = false
        }
      )
    },
    // 关闭签名弹框
    closeSignDialog() {
      this.otherSignVisible = false
      this.$store.commit('UPT_ARCHIVE_MODAL', false)
    },
    // 退出
    closeDialog() {
      // let iframes = document.getElementsByTagName("iframe");
      // let iframe1 = iframes[0].contentWindow.document;
      // let pdf1 = iframe1.getElementById("viewerContainer");
      // console.log(pdf1.scrollTop, 'hello', iframe1.body.scrollTop, 'world', iframe1.documentElement.scrollTop)
      this.$store.commit('UPT_MODAL_SHOW', false)
      if (this.writName === '电子卷宗首页' || this.writName === '卷内目录') {
        this.$store.commit('UPT_ARCHIVE_MODAL', false)
      }

      this.$emit('closePdf')
    },
    /**
     *  updatePdf    回退编辑
     *  signPdf    签名
     *  auditPdf    提交审核
     *  sealPdf    加盖公章
     *  finishPdf    完成
     *  lawSealPdf    加盖执法专用章
     *  closePdf    退出
     */
    handleClick(val) {
      if (val === 'signPdf') {
        this.sealType = 'MULTI_PERSION'
        this.seal()
      } else if (val === 'otherSign') {
        this.sealType = 'MULTI_PERSION'
        this.otherSignVisible = true
      } else if (val === 'lawSealPdf') {
        this.sealType = 'SINGLE_LAW'
        if (this.signatureList && this.signatureList.length > 1) {
          this.signatureVisible = true
        } else {
          this.seal()
          this.disabled = true
        }
      } else if (val === 'auditPdf' || val === 'sealPdf') {
        if (!this.isAllSigned && this.writTypeCode !== 'ws10059') {
          if (this.writTypeCode === 'ws10029') {
            this.$message({
              type: 'warning',
              message: '需要主持人签名。'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请耐心等待所有承办人员签名。'
            })
          }
          return
        }
        this.sealState = val
        if (['先行登记保存证据审批表', '先行登记保存证据处理审批表'].includes(this.writName)) {
          this.selectTitle = '审查'
        } else {
          this.selectTitle = this.auditBtnDes === '提交部门负责人' ? '部门负责' : val === 'auditPdf' ? '审核' : '盖章'
        }
        this.selectPeople = true
        // this.disabled = true;
      } else if (val === 'updatePdf') {
        let writArr = [
          '立案审批表',
          '案件调查报告',
          '行政处罚法制审核意见书',
          '结案审批表',
          '案件延期审批表',
          '案件移送审批表',
          '案件移送书',
          '案件终止记录单',
          '案件终止审批表',
          '电子卷宗首页',
          '卷内目录',
          '现场检查方案',
          '现场检查记录',
          '现场处理措施决定书',
          '责令限期整改指令书',
          '整改复查意见书'
        ]
        console.info('showPDF writName', this.writName)
        if (writArr.indexOf(this.writName) < 0) {
          this.$store.commit('UPT_MODAL_SHOW', true)
        }
        if (this.writName === '电子卷宗首页' || this.writName === '卷内目录') {
          this.$store.commit('UPT_ARCHIVE_MODAL', true)
        }
        this.$emit('updatePdf', this.pdfId)
      } else if (val === 'word') {
        window.location.href = this.wordHref
        // this.loadWord()
      } else {
        this.closeDialog()
      }
    },
    getPeople(state, val) {
      if (state) {
        this.$emit(this.sealState, {
          pdfId: this.pdfId,
          peopleId: val[0].id,
          peopleName: val[0].nickName,
          deptId: val[0].deptId,
          auditTypeCode: this.auditTypeCode,
          writTypeName: this.writTypeName,
          writName: this.writName
        })
        this.sealBtnCanUse = false
      }
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.selectPeople = false
    },
    reloadWord() {
      const s = document.createElement('script')
      const s2 = document.createElement('script')
      s.type = 'text/javascript'
      s2.type = 'text/javascript'
      s.src = baseUrl + '/aj/pageoffice.js'
      s2.src = baseUrl + '/aj/jquery.min.js'
      s.id = 'po_js_main'
      document.body.appendChild(s2)
      document.body.appendChild(s)

      this.wordHref = `javascript:POBrowser.openWindowModeless('${baseUrl}/aj/word?writId=${this.pdfId}','fullscreen=yes');`
    },
    pageofficeUpdated(data) {
      console.info('FFF')
      // reload
      let url = this.url
      this.url = ''
      this.$nextTick(() => {
        this.url = url
      })
    },
    downloadWord() {
      let token = localStorage.getItem('token')
      window.location.href = `${baseUrl}/aj/writ?writId=${this.pdfId}&token=${token}&flag=${new Date().getTime()}&fileType=1`
    },
    // word上传前
    beforeUpload(file) {
      let typeList = 'docx/doc/'
      typeList += typeList.toUpperCase()
      if (file.size >= 1024 * 1000 * 10) {
        this.$message({
          type: 'error',
          message: '请上传10M以内的文件！'
        })
        return false
      }

      let fileNameReg = /[#$@&%',;=?$/]/gi
      if (typeList.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) < 0) {
        this.$message({
          type: 'error',
          message: '请上传正确的附件格式：word文件！'
        })
        return false
      } else if (fileNameReg.test(file.name)) {
        this.$alert('文件名不能包含特殊字符，请修改后再试', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return false
      } else {
        this.$loading.showLoading()
        return true
      }
    },
    uploadSuccessful(info) {
      this.$loading.hiddenLoading()
      if (info.code === '0') {
        this.$message({
          type: 'success',
          message: '文件上传成功！'
        })
        this.pageofficeUpdated()
        this.canSign = false
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
        type: 'success',
        message: err
      })
    },
    signOther() {
      this.$refs.otherForm.validate(valid => {
        if (valid) {
          this.signOtherLoading = true
          signLogin(this.otherForm)
            .then(
              res => {
                console.info('AS', res)
                if (res.code === '0') {
                  return res.sign[0].userId
                }
              },
              err => {
                this.$message({
                  message: err,
                  type: 'error'
                })
                this.signOtherLoading = false
              }
            )
            .then(id => {
              if (!id) {
                return
              }
              sealWrit({
                writId: this.pdfId,
                signType: this.sealType,
                userId: id
              }).then(
                () => {
                  this.$message({
                    message: '签名成功',
                    type: 'success'
                  })
                  this.signOtherLoading = false
                  this.otherSignVisible = false
                  this.pageofficeUpdated()
                  this.updateAllSign()
                  this.$emit('signSuccess')
                },
                err => {
                  this.signOtherLoading = false
                  this.otherSignVisible = false
                  this.$message({
                    message: err,
                    type: 'error'
                  })
                }
              )
            })
        } else {
          return false
        }
      })
    }
  },
  created() {
    // 执法章数据
    this.getSignInfo()
    let token = localStorage.getItem('token')
    if (this.pdfType && this.pdfType === 'accessory') {
      // 文书 签字附件
      this.url =
        '/static/pdf/web/viewer.html?file=' +
        encodeURIComponent(`${baseUrl}/aj/writ/accessory/download?accessoryId=${this.pdfId}&token=${token}&flag=${new Date().getTime()}`)
      this.isLoading = false
      this.hasPdf = true
      this.isReady = true
      return
    }
    this.url = '/static/pdf/web/viewer.html?file=' + encodeURIComponent(`${baseUrl}/aj/writ?writId=${this.pdfId}&token=${token}&flag=${new Date().getTime()}`)
    previewWrit({ writId: this.pdfId }).then(res => {
      this.hasPdf = res !== ''
      this.isLoading = false
      this.isReady = true
    })
    this.updateAllSign()

    this.getPeople = debounce(this.getPeople, 300)

    window['pageofficeUpdated'] = data => {
      this.pageofficeUpdated(data)
      this.canSign = false
    }
    this.reloadWord()
    // 准备上传word
    this.uploadWordUrl = baseUrl + '/aj/writ/uploadWritAccessory'
    this.headers.Authorization = localStorage.getItem('token')
    this.params.writId = this.pdfId
  },
  mounted() {
    if (this.writTypeCode === 'ws10059' || this.writTypeCode === 'ws10060') {
      this.auditBtnDes = '提交部门负责人'
    } else {
      this.auditBtnDes = '提交审核'
    }
    this.writTypeInfo = JSON.parse(sessionStorage.getItem('writTypeInfo'))
    if (this.writTypeCode && this.writTypeCode !== '') {
      this.writTypeInfo.some(item => {
        this.auditTypeCode = item.auditTypeCode
        this.writTypeName = item.type
        return item.id === this.writTypeCode
      })
    }
  },
  watch: {
    cancelAudit: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.sealBtnCanUse = true
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#pdf_viewer {
  width: 800px;
  height: 600px;
}
.tips {
  margin: auto;
  text-align: center;
  margin-top: 100px;
  font-size: 28px;
}
// .warn {
//   // color: #FF4B3D;
// }
.seal-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  bottom: 17px;
  left: -8px;
  width: 100%;
  .button-list {
    display: inline-block;
    /deep/.el-button {
      position: relative;
      a.word {
        width: 130px;
        height: 30px;
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
.show-pdf-content {
  height: 100%;
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
        height: 98vh;
        .pdf-iframe {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
.is-no {
  background: rgba(255, 75, 61, 0.1);
  /deep/ span {
    color: #ff4b3d;
  }
}
/* .special-class-name-sy{
  z-index: 3000!important;
} */
.other_form {
  /deep/ .el-dialog {
    margin-top: 30vh;
    .el-dialog__body {
      padding: 5px 0;
      .el-form-item {
        margin-bottom: 0;
        padding: 0 20px;
      }
      .el-button {
        margin: 5px 0 0 5px;
        .el-icon-loading {
          line-height: 0;
        }
      }
    }
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid #e0e0e0;
      padding: 5px 16px 5px 0;
    }
  }
}
</style>
