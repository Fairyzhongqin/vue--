<template>
  <div class="discuss-card-content">
    <!-- 集体讨论会签卡片 -->
    <div class="doc-card-wrapper">
      <div class="card-main">
        <div class="card-main-left">
          <el-row class="margin_bottom">
            <el-col class="label-name" :span="6">文书种类：</el-col>
            <el-col class="ellipsis_style" :span="18">{{ writInfo.writTitle }}</el-col>
          </el-row>
          <el-row class="margin_bottom">
            <el-col class="label-name" :span="6">文书编号：</el-col>
            <el-col class="ellipsis_style" :span="18" :title="writInfo.writNoName">{{ writInfo.writNoName }}</el-col>
          </el-row>
          <el-row class="margin_bottom">
            <el-col class="label-name" :span="6">制作时间：</el-col>
            <el-col :span="18">{{ writInfo.creatorTime }}</el-col>
          </el-row>
          <el-row>
            <el-col class="label-name" :span="6">签字文书：</el-col>
            <el-col v-if="writInfo.lst && writInfo.lst.length <= 0" :span="17" style="color: #999999">暂无</el-col>
            <el-col v-if="writInfo.lst && writInfo.lst.length > 0" :span="17">
              <div v-if="writInfo.lst && writInfo.lst" class="file-bar">
                <span v-for="(file, index) of writInfo.lst" v-show="index < 3 || showAll" :key="index" class="file-item">
                  <span @click="openFileLink(file)">
                    <i class="el-icon-paperclip"></i>
                    <el-tooltip placement="top" popper-class="single-tooltip" :disabled="tooltipFlag">
                      <div class="text-wrapper" slot="content">{{ file.accessoryName }}</div>
                      <div class="wrap_one">
                        <i ref="fileNameWrap" style="font-style:normal;">{{ file.accessoryName }}</i>
                      </div>
                    </el-tooltip>
                  </span>
                  <i v-if="!readOnly" @click="delFile(file, index)" class="el-icon-error del-this"></i>
                </span>
                <span v-if="writInfo.lst && writInfo.lst.length > 3" class="file-more" @click="showAll = !showAll">
                  <i :class="{ 'el-icon-arrow-down': !showAll, 'el-icon-arrow-up': showAll }"></i>
                  {{ showAll ? `收起附件` : `展开其余${writInfo.lst.length - 3}个附件` }}
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="card-main-right">
          <el-tabs type="card" @tab-click="tabClick">
            <el-tab-pane label="意见确认">
              <div class="confirmation" v-if="opinionDtos.length > 0">
                <p class="dispatch-time">
                  <span>派发时间：{{ opinionDtos[0].batchTime }}</span>
                </p>
                <div class="confirm-time-item" v-for="(batch, index) in opinionDtos" :key="index">
                  <img v-if="batch.status === '1'" src="../../../assets/imgs/已作废章.png" alt="作废章图" />
                  <p class="confirm-time" v-if="index === 0">
                    {{ writInfo.now }}
                    <i class="iconfont iconicon--" @click="refresh"></i>
                  </p>
                  <p class="confirm-time" v-else>{{ batch.batchTime }}</p>
                  <div v-for="(opinion, opIndex) in batch.opinionList" :key="opIndex">
                    <p>
                      <span class="attendee-name" :title="opinion.acceptName">{{ opIndex + 1 }}.{{ opinion.acceptName ? opinion.acceptName : '暂无' }}</span>
                      <span class="attendee-result" :class="getContent(opinion.auditResult).className">{{ getContent(opinion.auditResult).text }}</span>
                      <span class="attendee-opinion">{{ opinion.auditOpinion ? opinion.auditOpinion : ' 无' }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <sn-empty-data v-else :text="'等待派发确认'"></sn-empty-data>
            </el-tab-pane>
            <el-tab-pane label="签名" :lazy="false">
              <div v-if="toDoSignList.length > 0 || doneSignList.length > 0" class="confirmation sign-items">
                <div class="confirm-time-item">
                  <p class="confirm-time">已签名</p>
                  <p v-for="(done, doneInd) in doneSignList" :key="doneInd">
                    <span class="attendee-name" :title="done.acceptName">{{ doneInd + 1 }}.{{ done.acceptName ? done.acceptName : '暂无' }}</span>
                    <span class="sign-time">{{ done.updateTime }}</span>
                  </p>
                  <p class="done-empty" v-if="doneSignList.length === 0">暂无</p>
                </div>
                <div class="confirm-time-item">
                  <p class="confirm-time">未签名</p>
                  <p v-for="(todo, todoInd) in toDoSignList" :key="todoInd">
                    <span :title="todo.acceptName">{{ todoInd + 1 }}.{{ todo.acceptName ? todo.acceptName : '暂无' }}</span>
                  </p>
                  <p class="done-empty todo-empty" v-if="toDoSignList.length === 0">暂无</p>
                </div>
              </div>
              <sn-empty-data v-else :text="'等待出席人签名'"></sn-empty-data>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="button_wrapper">
        <div class="doc-card-buttons">
          <el-button type="primary" size="mini" class="button_style" @click="popSelect" v-if="final && writInfo.writStatus === 0 && !readOnly"
            >文书派发确认</el-button
          >
        </div>
        <div class="doc-card-buttons others-button" :class="{ 'others-button': writInfo.writStatus !== 2 }">
          <el-upload
            :action="uploadFileUrl"
            multiple
            ref="upload"
            :show-file-list="false"
            :headers="headers"
            :data="params"
            v-if="!readOnly && final"
            :before-upload="beforeUpload"
            :on-success="uploadSuccessful"
            :on-error="uploadFailed"
          >
            <el-button class="button_style" type="primary" size="mini" slot="trigger" icon="el-icon-upload2" @click="handleEvent('upload')"
              >上传签字文书</el-button
            >
          </el-upload>
          <el-button type="primary" size="mini" class="button_style" @click="handleEvent('view')" v-if="final">浏览</el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            class="button_style"
            v-if="writInfo.isDeleteAllowed && !readOnly && final && writInfo.writStatus != 2 && writInfo.writStatus != 3 && opinionDtos.length === 0"
            @click="handleEvent('del')"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="mini"
            class="button_style"
            v-if="writInfo.isModifyAllowed && !readOnly && canUpdate && final && writInfo.writStatus == 0"
            @click="handleEvent('change')"
            >修改</el-button
          >
        </div>
      </div>
      <show-pdf :pdfId="previewAsset" v-if="dialogContent === 'showPdf'" :writName="'签字文书'" :pdfType="'accessory'" @closePdf="closeDialog"></show-pdf>
      <el-dialog :modal="false" :visible.sync="isPreviewVis" :before-close="closeDialog" :class="dialogClass">
        <img :src="previewAsset" alt v-if="dialogContent === 'img' && isPreviewVis" class="show-img" />
      </el-dialog>
      <el-dialog width="900px" height="500px" :visible.sync="showSelectDialog" :title="'选择确认人员'" :before-close="close">
        <select-people v-if="showSelectDialog" :selectNum="1" @getPeople="dispatch"></select-people>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import baseUrl from '@/utils/webIp'
import { dateFormat } from '@/utils/util'
import { getOpinions, getSign, dispatch } from '@/api/groupDiscussion'
import snEmptyData from '@/components/snEmptyData'
import showPdf from '@/components/showPdf/index'
import { deleteWrit, deleteFile } from '@api/fileRelated'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'

export default {
  name: 'discussCard',
  components: {
    snEmptyData,
    selectPeople,
    showPdf
  },
  props: {
    docData: {
      type: Object
    },
    readOnly: {
      // 是否只读
      type: Boolean,
      default: false
    },
    canUpdate: {
      type: Boolean,
      default: true
    },
    now: {
      // 接口返回的服务器当前时间
      type: String
    }
  },
  data() {
    return {
      showSelectDialog: false, // 选择意见确认人员
      doneSignList: [], // 已签名
      toDoSignList: [], // 未签名
      params: {
        writId: '',
        type: '0' // 0 签字附件 1 其他附件
      },
      writInfo: {}, // 会签卡片左边文书信息
      opinionDtos: [], // 会签卡片右边签名及确认信息
      final: false, // 是否已到达按钮最终的控制状态
      uploadFileUrl: '', // 上传签字文书的路径
      headers: { Authorization: '' }, // 授权信息
      isPreviewVis: false,
      previewAsset: '', // 预览资源
      dialogClass: '', // 预览弹框类名
      dialogContent: '', // 弹框展示内容
      tooltipFlag: false, //是否显示tooltip
      showAll: false,
      buttonList: {
        // 浏览文书时的按钮
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: false, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: false // 退出
      }
    }
  },
  created() {},
  mounted() {
    this.uploadFileUrl = baseUrl + '/aj/writ/uploadWritAccessory'
    this.headers.Authorization = localStorage.getItem('token')
    this.overWidth()
  },
  methods: {
    initWritCard() {
      // 初始化使能所有按钮
      this.writInfo = this.docData.writInfo
      this.opinionDtos = this.docData.opinionDtos
      this.$set(this.writInfo, 'now', this.now)
      this.$set(this.writInfo, 'isModifyAllowed', true) // 是否可修改
      this.$set(this.writInfo, 'isDeleteAllowed', true) // 是否可删除
      this.final = true
    },
    // 返回文字类名
    getContent(type) {
      let text = '',
        className = ''
      if (type === '0') {
        text = '同意'
        className = 'green-text'
      } else if (type === '1') {
        text = '不同意'
        className = 'red-text'
      } else if (type === '2') {
        text = '自动同意'
        className = 'green-text'
      } else {
        text = '无'
      }
      return {
        text: text,
        className: className
      }
    },
    // 浏览/签名/修改等按钮控制
    handleUserSign(type) {
      let writTypeInfo = JSON.parse(sessionStorage.getItem('writTypeInfo'))

      if (writTypeInfo && writTypeInfo.length > 0 && type !== 'view') {
        writTypeInfo.forEach(writ => {
          if (writ.typeCode === this.writInfo.writTypeCode) {
            this.buttonList = {
              updatePdf: !(type === 'userSign'), // 回退编辑
              signPdf: writ.userType, // 签名
              auditPdf: writ.isAudit, // 提交审核
              sealPdf: writ.isSign === 1, // 加盖公章
              finishPdf: true, // 完成
              lawSealPdf: writ.isSign === 2, // 加盖执法专用章
              closePdf: true // 退出
            }
          }
        })
      } else if (type === 'view') {
        this.buttonList = {
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
    // 按钮事件
    handleEvent(val) {
      switch (val) {
        case 'change':
          // 修改
          this.handleUserSign()
          this.$emit(
            'modifyWrit',
            this.writInfo.writTitle, // 文书名
            this.writInfo.writTypeName, // 文书名拼音首字母
            this.writInfo.writId, // 文书号
            this.writInfo.businessId, // 业务Id
            this.buttonList
          )
          break
        case 'del':
          // 删除
          this.delWrit()
          break
        case 'view':
          // 查看
          this.handleUserSign('view')
          this.$emit('previewWrit', this.writInfo.writId, this.writInfo.writTitle, this.buttonList, this.writInfo)
          break
        case 'upload':
          // 上传
          // 使用elment-ui upload组件默认的上传行为
          break
          return
      }
    },
    // 删除文书
    delWrit() {
      this.$confirm(`确定删除${this.writInfo.writTitle}？`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let delReq = { writId: this.writInfo.writId }
          deleteWrit(delReq)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.$emit('afterDelete')
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err
              })
            })
        })
        .catch(() => {
          document.activeElement.blur()
        })
    },
    // 删除签字文书文件
    delFile(file, index) {
      this.$confirm('确定删除签字文书？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let delReq = {
          accessoryId: file.accessoryId,
          writId: this.writInfo.writId,
          type: '0'
        }
        deleteFile(delReq)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.writInfo.lst.splice(index, 1)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
          })
      })
    },
    // 上传签字文书前的校验
    beforeUpload(file) {
      let typeList = 'image/jpeg/image/jpg/image/png/application/pdf'
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
          message: '请上传正确的附件格式：图片或PDF文件！'
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
        this.$emit('afterUpload')
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
        type: 'error',
        message: '文件上传失败！'
      })
    },
    // tab 被选中
    tabClick(tab) {
      if (tab.index === '1') {
        this.getSign()
      } else {
        this.refresh()
      }
    },
    // 派发确认
    dispatch(bool, person) {
      if (!bool) {
        this.showSelectDialog = false
        return 
      }
      let req = {
        writId: this.writInfo.writId,
        userId: person[0].id
      }
      dispatch(req)
        .then(() => {
          this.showSelectDialog = false
          this.$message({
            type: 'success',
            message: '确认意见派发成功！'
          })
          this.$emit('afterDispatch')
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '确认意见派发失败！'
          })
        })
    },
    getSign() {
      // 获取签名列表
      getSign({
        writId: this.writInfo.writId
      }).then(res => {
        this.toDoSignList = res.toDoSignList
        this.doneSignList = res.doneSignList
      })
    },
    // 刷新确认意见的情况
    refresh() {
      getOpinions({
        writId: this.writInfo.writId
      }).then(res => {
        this.opinionDtos = res.data
        this.writInfo.now = res.nowTime
      })
    },
    // 浏览签字文书文件
    openFileLink(val) {
      console.info('浏览签字文书', val)
      if (val.accessoryType === '.pdf') {
        this.previewAsset = val.accessoryId
        this.dialogClass = 'big-dialog'
        this.dialogContent = 'showPdf'
      } else {
        this.isPreviewVis = true
        this.previewAsset = val.accessoryUrl + '&token=' + this.headers.Authorization
        this.dialogClass = 'small-dialog'
        this.dialogContent = 'img'
      }
    },
    // 打开选择人员弹框
    popSelect() {
      this.showSelectDialog = true
    },
    close() {
      this.showSelectDialog = false
    },
    // 关闭弹框
    closeDialog() {
      this.previewAsset = ''
      this.isPreviewVis = false
      this.dialogContent = ''
      this.dialogClass = ''
    },
    // 判断是否溢出
    overWidth() {
      this.$nextTick(() => {
        if (this.$refs.fileNameWrap) {
          const contentwidth = this.$refs.fileNameWrap
          // 此处150和 max-width属性的值同步
          if (contentwidth[0].offsetWidth > 150) {
            this.tooltipFlag = false
          } else if (contentwidth[0].offsetWidth <= 150) {
            this.tooltipFlag = true
          }
        }
      })
    }
  },

  watch: {
    docData: {
      handler: function(newVal, oldVal) {
        this.final = false
        this.initWritCard()
        this.params.writId = newVal.writInfo.writId
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.discuss-card-content {
  .doc-card-wrapper {
    width: 66vw;
    position: relative;
    border-left: 1px solid #d4d7da;
    border-bottom: 1px solid #d4d7da;
    margin-bottom: 8px;
    margin-right: 5px;
    .card-main {
      display: flex;
      height: 240px;
      border-bottom: 1px solid #d4d7da;
      overflow: hidden;
      .card-main-left {
        width: 350px;
        flex-shrink: 0;
        padding: 16px;
        border-top: 1px solid #d4d7da;
        .label-name {
          width: 75px;
        }
      }
      .card-main-right {
        flex-grow: 1;
        /deep/ .el-tabs {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        /deep/ .el-tabs__item {
          padding: 0 13px;
          line-height: 36px;
        }
        /deep/ .el-tabs__nav div:first-child {
          margin-right: 10px;
          border-right: 1px solid #d4d7da;
        }
        /deep/ .el-tabs__header {
          margin-bottom: 0;
        }
        /deep/ .el-tabs__content {
          flex-grow: 1;
          border-left: 1px dashed #d4d7da;
          border-right: 1px solid #d4d7da;
          /deep/ .el-tab-pane {
            height: 100%;
            margin-right: 9px;
            overflow-y: auto;
            &::-webkit-scrollbar {
              width: 4px;
              border: none;
            }

            &::-webkit-scrollbar-thumb {
              border-radius: 2px;
              width: 4px;
              border: none;
              margin-right: 3x;
            }

            &:hover::-webkit-scrollbar-thumb {
              background: rgba(91, 108, 130, 0.3);
            }
          }
        }
        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
          border-top: none;
          line-height: 36px;
          .el-tabs__item {
            border-top: 1px solid #d4d7da;
          }
        }
        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:not(.is-active) {
          background: rgba(18, 115, 235, 0.1);
          color: #409eff;
        }
        /deep/ .sn-empty-data {
          height: 100%;
        }
        .confirmation {
          position: relative;
          padding: 10px 9px 10px 14px;

          .dispatch-time.dispatch-time {
            position: absolute;
            right: 10px;
            top: 10px;
            margin-right: 0;
            line-height: 38px;
            color: rgba(153, 153, 153, 1);
            border: none;
          }
          .confirm-time-item {
            position: relative;
            .done-empty {
              font-size: 24px;
              margin-top: 15px;
              margin-left: 100px;
              border-bottom: none;
              color: #999;
            }
            img {
              position: absolute;
              right: 35px;
              top: 20px;
            }
            // 出席人名称
            .attendee-name {
              flex-basis: 15%;
              flex-shrink: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
            }
            .attendee-result {
              flex-basis: 10%;
              flex-shrink: 0;
            }
            .green-text {
              color: #1cc19c;
            }
            .red-text {
              color: #ff2525;
            }
            .confirm-time {
              position: relative;
              .iconicon-- {
                position: absolute;
                margin-left: 4px;
                font-size: 24px;
                color: #0099ff;
                transition: all 0.5s;
                cursor: pointer;
                &:hover {
                  color: gray;
                }
              }
            }

            p:not(.confirm-time) {
              display: flex;
              padding: 0 18px;
              line-height: 26px;
              border-bottom: 1px solid rgba(224, 224, 224, 1);
              span {
                margin-right: 54px;
                &.attendee-opinion {
                  margin-right: 10px;
                  word-break: break-word;
                }
              }
            }
          }
          p {
            margin: 0;
          }

          .confirm-time {
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            line-height: 38px;
          }
        }
        .sign-items.sign-items.confirmation {
          display: flex;
          justify-content: space-between;
          .confirm-time-item {
            width: 48%;
            .done-empty {
              border-bottom: none;
            }
            span {
              margin-right: 20px;
            }
            .sign-time {
              margin-right: 0;
            }
          }
          .attendee-name {
            flex-basis: 30%;
            flex-shrink: 0;
          }
        }
      }

      .file-bar {
        display: flex;
        flex-direction: column;
        height: 130px;
        margin-right: -27px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 4px;
          border: none;
        }

        &::-webkit-scrollbar-thumb {
          background: rgba(91, 108, 130, 0.1);
          border-radius: 2px;
          width: 4px;
          border: none;
          margin-right: 3px;
        }

        &:hover::-webkit-scrollbar-thumb {
          background: rgba(91, 108, 130, 0.3);
        }
        .file-item {
          color: #0099ff;
          cursor: pointer;
          padding: 2px 0;

          &:hover {
            // text-decoration: underline;
            background-color: #eef5f9;
          }
        }

        .file-more {
          color: #0099ff;
          cursor: pointer;
          padding: 2px 0;
        }
      }

      .margin_bottom {
        margin-bottom: 4px;
        font-size: 14px;
        font-family: PingFang-SC-Medium;

        &:first-child .ellipsis_style {
          font-weight: bold;
        }
      }
    }

    .ellipsis_style {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .button_wrapper {
      display: flex;
      flex-direction: row-reverse;
      position: relative;
      height: 36px;
    }

    .doc-card-buttons {
      height: 36px;
      padding: 0 12px 0 0;
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      overflow-x: auto;
      overflow-y: hidden;
      border-right: 1px solid #d4d7da;
      .button_style {
        height: 24px;
        margin-left: 4px;
        padding: 0px 4px;
        &.audit_back:not(.is-disabled) {
          background: #1cc19c;
        }
      }
    }

    .others-button {
      position: absolute;
      width: 382px;
      left: 0;
      padding-left: 0;
      padding-right: 4px;
      border-right: none;
      &::before {
        content: '|';
        padding-left: 8px;
        color: #e0e0e0;
        font-size: 20px;
      }
    }

    .del-this {
      margin-left: 10px;
      color: rgb(248, 124, 124);
      cursor: pointer;

      &:hover {
        color: rgb(221, 98, 98);
      }
    }
    .wrap_one {
      display: inline-block;
      max-width: 150px; // 最大的宽度，必写属性
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 18px;
      cursor: pointer;
    }
  }

  .big-dialog {
    /deep/ .el-dialog {
      width: 1000px;
    }
  }

  .small-dialog {
    /deep/ .el-dialog {
      max-height: 80vh;
      width: 50%;
      overflow: auto;

      .el-dialog__body {
        padding: 15px;
        text-align: center;
      }

      .el-dialog__header {
        border-bottom: none;
      }
    }
  }

  .show-img {
    width: 100%;
    height: 100%;
  }
}
</style>
