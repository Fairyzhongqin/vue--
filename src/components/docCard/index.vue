<template>
  <!-- 文书卡片 -->
  <div class="doc-card-wrapper">
    <el-card shadow="hover">
      <div class="card-main">
        <el-row class="margin_bottom">
          <el-col :span="6">文书种类：</el-col>
          <el-col class="ellipsis_style" :span="18">{{ docData.writTitle }}</el-col>
        </el-row>
        <el-row class="margin_bottom" v-if="docData.writTypeCode != 'ws10048'">
          <el-col :span="6">文书编号：</el-col>
          <el-col class="ellipsis_style" :span="18" :title="docData.writNoName">{{ docData.writNoName }}</el-col>
        </el-row>
        <el-row class="margin_bottom">
          <el-col :span="6">制作时间：</el-col>
          <el-col :span="18">{{ docData.creatorTime }}</el-col>
        </el-row>
        <el-row class="margin_bottom seal-title" @click.native="showAuditPro" v-if="auditType === 'audit'">
          <el-col :span="docData.writTypeName === 'TZHBGS' ? 6 : 8">审核{{ docData.writTypeName === 'TZHBGS' ? '' : '审批' }}状态：</el-col>
          <el-col :span="docData.writTypeName === 'TZHBGS' ? 18 : 16" class="audit_desc" :class="statusClass">{{ docData.auditStatusValue }}</el-col>
        </el-row>
        <el-row
          class="margin_bottom"
          :class="{ 'seal-title': docData.isSign === 1 }"
          v-if="docData.isSign || autoSeal"
          @click.native="showAuditPro"
          :title="docData.isSign === 1 ? docData.officeSignRecord : this.autoSeal ? '此文书为自动盖章' : ''"
        >
          <el-col :span="6">盖章状态：</el-col>
          <el-col class="audit_desc" :class="statusClass" :span="18">{{ docData.auditStatusValue }}</el-col>
        </el-row>
        <el-row v-if="docData.isUpload">
          <el-col :span="6">签字文书：</el-col>
          <el-col v-if="docData.lst && docData.lst.length <= 0" :span="18" style="color: #999999">暂无</el-col>
          <el-col v-if="docData.lst && docData.lst.length > 0" :span="18">
            <div v-if="docData.lst && docData.lst" class="file-bar">
              <span v-for="(file, index) of docData.lst" v-show="index < 1 || showAll" :key="index" class="file-item">
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
              <span v-if="docData.lst && docData.lst.length >= 2" class="file-more" @click="showAll = !showAll">
                <i :class="{ 'el-icon-arrow-down': !showAll, 'el-icon-arrow-up': showAll }"></i>
                {{ showAll ? `收起附件` : `展开其余${docData.lst.length - 1}个附件` }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="button_wrapper">
        <div class="doc-card-buttons" ref="cardButtons">
          <el-button
            type="primary"
            size="mini"
            class="button_style audit_back"
            :disabled="isFlowDis"
            v-if="docData.isAudit && !readOnly && final"
            @click="handleEvent('submit')"
            >提交审核</el-button
          >
          <el-upload
            :action="uploadFileUrl"
            multiple
            ref="upload"
            :show-file-list="false"
            :headers="headers"
            :data="params"
            v-if="docData.isUpload && !readOnly && final"
            :before-upload="beforeUpload"
            :on-success="uploadSuccessful"
            :on-error="uploadFailed"
          >
            <el-button class="button_style" type="primary" size="mini" slot="trigger" icon="el-icon-upload2" @click="handleEvent('upload')"
              >上传签字文书</el-button
            >
          </el-upload>
          <el-button
            type="primary"
            class="button_style"
            :disabled="isFlowDis"
            size="mini"
            v-if="docData.isSign === 1 && docData.isOfficial && !readOnly && final"
            @click="handleEvent('seal')"
            >盖公章</el-button
          >
          <el-button
            type="primary"
            class="button_style"
            size="mini"
            :disabled="isFlowDis"
            v-if="docData.isSign === 2 && !readOnly && final && docData.noProcessSignStatus !== 1"
            @click="handleEvent('lawSeal')"
            >盖执法章</el-button
          >
          <el-button
            type="primary"
            size="mini"
            class="button_style"
            @click="handleEvent('userSign')"
            :disabled="isFlowDis"
            v-if="docData.isUserSign && final && !readOnly && docData.currUserHasSignPerm"
            >{{ docData.currUserIdSign ? '签名' : '签名' }}</el-button
          >
          <el-button type="primary" size="mini" class="button_style" @click="handleEvent('view')" v-if="final && docData.isView">浏览</el-button>
          <el-button type="danger" plain size="mini" class="button_style" v-if="docData.isDeleteAllowed && !readOnly && final" @click="handleEvent('del')"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="mini"
            class="button_style"
            v-if="docData.isModifyAllowed && !readOnly && canUpdate && final"
            @click="handleEvent('change')"
            >修改</el-button
          >
        </div>
      </div>

      <div class="book-mark" v-if="docData.writTitle.slice(-2) === '笔录'">
        <div class="text">笔录</div>
      </div>
    </el-card>
    <show-pdf :pdfId="previewAsset" v-if="dialogContent === 'showPdf'" :pdfType="'accessory'" @closePdf="dialogContent = null"></show-pdf>
    <el-dialog :modal="false" :visible.sync="isPreviewVis" :before-close="closeDialog" :class="dialogClass">
      <img :src="previewAsset" alt v-if="dialogContent === 'img' && isPreviewVis" class="show-img" />
    </el-dialog>
    <el-dialog title="选择执法章" width="900px" height="600px" :visible="signatureVisible" @close="closeSign">
      <signature-group :signatureList="signatureList" @close="closeSign" @sentToSign="signMultiple"></signature-group>
    </el-dialog>
    <el-dialog
      :title="auditType === 'audit' ? (docData.writTypeName === 'TZHBGS' ? '审核流程' : '审核审批流程') : '公章审批流程'"
      width="300px"
      class="audit-pro"
      height="600px"
      :visible="isAudiProShow"
      append-to-body
      @close="isAudiProShow = false"
    >
      <sn-timeline :lineData="auditProcesses"></sn-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { deleteWrit, uploadFile, sealWrit, deleteFile } from '@api/fileRelated'
import { sealAuditStatus, downloadFile } from '@api/common'
import writTypeMap from '@/utils/writType'
import baseUrl from '@/utils/webIp'
import writType from '@/utils/writType'
import { handleBtnList } from '@/utils/audit'
import { showSignature } from '@/api/common'
import snTimeline from '@/components/TimeLine'
import signatureGroup from '@/components/signatureGroup/index'
import showPdf from '@/components/showPdf/index'
import { delRectificationWrit, delInspectionWrit } from '@api/onSiteInspection/index'
import { delSPB, deleteRectificationWrit } from '@/api/rectification/index'

export default {
  components: {
    showPdf,
    signatureGroup,
    snTimeline
  },
  props: {
    docData: {
      type: Object
    },
    docList: {
      // 处罚告知里文书卡片列表
      type: Array
    },
    auditInfo: {
      // 提交审核时需要的信息
      type: Object
    },
    docLogin: {
      type: Boolean
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    canUpdate: {
      type: Boolean,
      default: true
    },
    isRecalled: {
      // 是否是回退流程中的文书，用以按钮判断
      type: String
    },
    processVersion: {
      // 流程回退第几次
      type: Number
    }
  },
  data() {
    return {
      auditProcesses: [], // 流程数据
      isAudiProShow: false, // 是否显示审核审批/盖章流程弹出框
      final: false, // 当按钮状态稳定后显示，防止闪烁
      showAll: false,
      uploadFileUrl: '', // 上传路径
      headers: { Authorization: '' }, // 授权信息
      params: {
        writId: '',
        type: '0' // 0 签字附件 1 其他附件
      },
      auditType: '', // 当前文书审核类型
      buttonClientHeight: 0, //  .doc-card-buttons 的 clientHeight 值
      isScrollVisible: false,
      statusClass: '', // 审核状态的颜色
      dialogContent: '',
      previewAsset: '', // 浏览图片时的url or 浏览pdf时的id
      isPreviewVis: false,
      isFlowDis: false, // 与流程有关的按钮是否置灰：盖公章，盖执法章
      dialogClass: '',
      buttonList: {
        // 浏览文书时的按钮
        updatePdf: false, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: false, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: false // 退出
      },
      tooltipFlag: false, //是否显示tooltip
      tooltipIndex: null,
      autoSeal: false, // 是否是后台自动盖章
      signatureVisible: false, //执法章弹窗
      signatureList: [] //执法章数据
    }
  },
  mounted() {
    this.uploadFileUrl = baseUrl + '/aj/writ/uploadWritAccessory'
    this.headers.Authorization = localStorage.getItem('token')
    this.overWidth()
    this.discernAuto()
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
    // 执法章 多章
    signMultiple(data) {
      let signId = data.signId
      sealWrit({
        writId: this.docData.writId,
        signType: 'SINGLE_LAW',
        signId: signId
      })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              message: '加盖执法专用章成功',
              type: 'success'
            })
            this.signatureVisible = false
            let obj = {
              id: this.docData.writId,
              writType: this.docData.writTypeName, // 拼音首字母
              title: this.docData.writTitle,
              typeCode: this.docData.writTypeCode // WS 开头的文书号
            }
            this.$emit('toLawSeal', obj)
          }
        })
        .catch(err => {
          console.info(err)
        })
    },
    initWritCard() {
      //先判断是否现场检查记录文书(修改/删除去除)
      if (this.docData.writTypeName === 'XCJCJL') {
        this.docData.isModifyAllowed = false
        this.docData.isDeleteAllowed = false
        this.$set(this.docData, 'isView', true) // 是否可文书浏览
      } else {
        // 初始化使能所有按钮
        this.$set(this.docData, 'isModifyAllowed', true) // 是否可修改
        this.$set(this.docData, 'isDeleteAllowed', true) // 是否可删除
        this.$set(this.docData, 'isView', true) // 是否可文书浏览
        this.$set(this.docData, 'isFirstCreated', true) // 是否为第一次创建的文书
        if (this.docData.writTypeName === 'JNML' || this.docData.writTypeName === 'AJ') {
          this.docData.isModifyAllowed = false
        }
      }
      // 根据文书 审核审批状态 判断按钮状态
      if (this.docData.isAudit) {
        // 审查审核审批流程
        this.auditType = 'audit'
        this.getStatus()
      } else if (this.docData.isSign === 1) {
        //盖公章
        this.auditType = 'seal'
        this.$set(this.docData, 'isOfficial', true) // 控制盖公章按钮字段
        this.getSignInfo()
        this.getStatus()
      } else if (this.docData.isSign === 2) {
        // 盖执法章
        this.getSignInfo()
        this.setLawSealBtn()
      } else {
        this.final = true
        this.auditType = ''
      }
    },
    // 盖执法章时按钮控制
    setLawSealBtn() {
      if (this.isRecalled === '1' && this.docData.noProcessSignStatus === 0 && this.processVersion > this.docData.writVersion) {
        // 当流程回退时 且文书未重新制作 且已盖过执法章
        this.docData.isDeleteAllowed = true
        this.isFlowDis = true
        return
      } else {
        this.isFlowDis = false
      }
      if (this.docData.noProcessSignStatus === 1) {
        this.statusClass = 'passed'
        this.docData.auditStatusValue = '已盖章'
      } else {
        this.statusClass = ''
        this.docData.auditStatusValue = '未盖章'
      }
      this.final = true
      this.auditType = ''
    },
    // 根据可进入流程的文书id获取流程信息 并 加以判断
    getStatus(id) {
      let writId = id ? id : this.docData.writId

      let req = { requestId: writId }
      sealAuditStatus(req)
        .then(res => {
          this.auditProcesses = res.data
          let lastStatus = res.data[0]
          if (!lastStatus) {
            this.docData.auditStatusValue = '待提交'
            this.flowBack()
          } else {
            this.docData.isDeleteAllowed = false
            switch (lastStatus.auditResultCode) {
              case 'a01':
                if (this.auditType === 'seal') {
                  this.setButtons('未盖章')
                } else {
                  this.setButtons('待审核')
                }
                break
              case 'a011':
                if (this.auditType === 'seal') {
                  this.setButtons('未盖章')
                } else {
                  this.setButtons('待审查')
                  // this.setButtons('待审核')
                }
                break
              case 'a001':
                this.statusClass = 'failed'
                this.docData.auditStatusValue = '审核不通过'
                break
              case 'a002':
                // this.setButtons('审核通过')
                this.setButtons('待审批')
                break
              case 'a003':
                if (this.auditType === 'seal') {
                  this.docData.auditStatusValue = '盖章审批不通过'
                } else {
                  if (lastStatus.auditTypeCode == 'ta80049') {
                    this.docData.auditStatusValue = '审核不通过'
                  } else {
                    this.docData.auditStatusValue = '审批不通过'
                  }
                }
                this.statusClass = 'failed'
                break
              case 'a004':
                if (this.auditType === 'seal') {
                  this.setButtons('已盖章')
                } else {
                  let t = this.docData.writTypeName === 'TZHBGS' ? '审核通过' : '审批通过'
                  this.setButtons(t)
                }
                break
              case 'a005':
                this.statusClass = 'failed'
                this.docData.auditStatusValue = '审核不通过'
                break
              case 'a006':
                // this.setButtons('审查通过')
                this.setButtons('待审核')
                break
              case 'b042':
                this.setButtons('审核不同意')
                this.statusClass = 'failed'
                break
              case 'b02':
                this.setButtons('部门审核不同意')
                this.statusClass = 'failed'
                this.docData.isUserSign = false
                this.docData.isModifyAllowed = false
                this.docData.isAudit = false
                this.docData.isOfficial = false
                this.docData.isDeleteAllowed = false
                break
              case 't03' || 't02' || 't01':
                this.flowToLast(lastStatus)
                break
            }
          }
          if (this.autoSeal) {
            this.docData.auditStatusValue = this.docData.autoSignStatus === 1 ? '已盖章' : '未盖章'
            this.statusClass = this.docData.autoSignStatus === 1 ? 'passed' : ''
          }
          this.final = true
        })
        .catch(err => console.info(err))
    },
    setButtons(val) {
      if(val !== '返回上一级') {
        this.statusClass = 'passed'
      }
      this.docData.auditStatusValue = val
      if (!this.flowBack()) return
      this.docData.isUserSign = false
      this.docData.isModifyAllowed = false
      this.docData.isAudit = false
      this.docData.isOfficial = false
    },
    // 返回上一级的按钮控制
    flowToLast(flow) {
      let onceArr = ['ta80040', 'ta80007', 'ta80049', 'ta80052', 'ta80053'] // 一步流程
      let thriceArr = ['ta80008', 'ta80009', 'ta80010', 'ta80011', 'ta80012'] // 三步流程
      let one, two, three
      one = onceArr.indexOf(flow.auditTypeCode) > -1 && flow.auditResultCode === 't03' // 是否是一步流程的最后退回
      three = thriceArr.indexOf(flow.auditTypeCode) > -1 && flow.auditResultCode === 't02'// 是否是三步流程的最后退回
      two = !one && !two && flow.auditResultCode === 't01'// 是否是二步流程的最后退回
      if (!one && !two &&!three) {
        this.setButtons('待提交')
      } else {
        this.flowBack()
      }
    },
    // 判断回退及回退流程的按钮控制
    flowBack() {
      if (this.isRecalled === '1' && this.processVersion > this.docData.writVersion) {
        // 当流程回退时 且审核审批信息为回退前，按钮不加控制，但不许提交流程
        this.docData.isDeleteAllowed = true
        this.isFlowDis = true
        return false
      } else {
        this.isFlowDis = false
        return true
      }
    },
    // 判断文书是否是自动盖章的
    discernAuto() {
      const autoArr = ['XXCFGZ', 'CFHZ', 'BYXZCFJDS', 'XXCFJDSDW', 'XXCFJDSGR', 'XZCFJDSSDHZ']

      if (autoArr.indexOf(this.docData.writTypeName) >= 0) {
        this.autoSeal = true
        if (this.docData.autoSignStatus === 1) {
          this.docData.auditStatusValue = '已盖章'
          this.statusClass = 'passed'
          if (!this.flowBack()) return
          this.docData.isModifyAllowed = false
          this.docData.isDeleteAllowed = false
          this.final = true
        } else {
          this.docData.auditStatusValue = '未盖章'
          this.statusClass = ''
        }
      } else {
        this.autoSeal = false
      }
      // 案件告知审批表/案件处理呈批表控制其相关联自动盖章文书
      let informDocs = ['XXCFGZ', 'CFHZ']
      let decisionDocs = ['BYXZCFJDS', 'XXCFJDSDW', 'XXCFJDSGR', 'XZCFJDSSDHZ']
      let docType = ''

      if (informDocs.indexOf(this.docData.writTypeName) > -1) {
        docType = 'AJGZSPB'
      } else if (decisionDocs.indexOf(this.docData.writTypeName) > -1) {
        docType = 'AJCLCPB'
      }
      if (this.docList && this.docList.length > 0 && docType) {
        this.docList.forEach(doc => {
          if (doc.writTypeName === docType) {
            this.getStatus(doc.writId)
          }
        })
      }
    },
    // 显示盖章或审核审批流程
    showAuditPro() {
      if (this.autoSeal || this.auditProcesses.length === 0) {
        return
      }
      this.isAudiProShow = true
    },
    // 浏览签字文书文件
    openFileLink(val) {
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
    // 删除签字文书文件
    delFile(file, index) {
      this.$confirm('确定删除签字文书？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let delReq = {
          accessoryId: file.accessoryId,
          writId: this.docData.writId,
          type: '0'
        }
        deleteFile(delReq)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.docData.lst.splice(index, 1)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
          })
      })
    },
    closeDialog() {
      this.previewAsset = ''
      this.isPreviewVis = false
      this.dialogContent = ''
      this.dialogClass = ''
    },
    // 暂不使用
    downloadFile(file) {
      let req = {
        accessoryId: file.accessoryId
      }
      if (window.navigator.msSaveBlob) {
        downloadFile(req)
          .then(res => {
            navigator.msSaveBlob(res, file.accessoryName)
          })
          .catch(err => console.info(err))
      } else {
        let a = document.createElement('a')
        a.download = file.accessoryName
        a.href = file.accessoryUrl + '&token=' + this.headers.Authorization
        document.body.append(a)
        a.click()
        a.remove()
      }
    },
    // 处理提供给父辈组件的审核参数
    handleAudit(auditType) {
      console.info('审核参数', auditType)
      console.info('docData', this.docData)
      let writTypeInfo = JSON.parse(sessionStorage.getItem('writTypeInfo'))
      let _audiReq = {
        auditTypeCode: '', // 盖章审核
        handlerDeptId: '', // 审核人部门 id
        handlerUserId: '', // 审核人
        requestDeptName: JSON.parse(localStorage.getItem('res')).userEntity.deptName, // 承办人部门
        requestId: this.docData.writId, // 文书 writId
        requestTime: this.docData.creatorTime,
        requestUsersName: this.auditInfo ? this.auditInfo.requestUsersName : '', // 承办人名称
        submitterCause: this.auditInfo ? this.auditInfo.caseName : '', // 案件名称 或 企业名称
        partyName: this.auditInfo ? this.auditInfo.partyName : ''
      }
      if (auditType !== 'lawSeal' && this.docData.isUserSign === 1 && !this.docData.isAllUserSign) {
        if (this.docData.writTypeCode === 'ws10029') {
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
      // 处理听证报告书当前登录人不是主持人的情况
      if (auditType !== 'lawSeal' && this.docData.isUserSign === 0 && !this.docData.isAllUserSign) {
        if (this.docData.writTypeCode === 'ws10029') {
          this.$message({
            type: 'warning',
            message: '需要主持人签名。'
          })
          return
        }
      }
      if (auditType === 'seal') {
        if (this.docData.writTypeName === 'XCCLCS') {
          _audiReq.auditTypeCode = 'ta80052'
        } else if (this.docData.writTitle === '责令限期整改指令书') {
          _audiReq.auditTypeCode = 'ta80053'
        } else {
          _audiReq.auditTypeCode = 'ta80040'
        }
        this.$emit('toSeal', _audiReq, this.docData)
      } else if (auditType === 'lawSeal') {
        // 多章
        if (this.signatureList && this.signatureList.length > 1) {
          this.signatureVisible = true
        } else {
          // 单章
          sealWrit({
            writId: this.docData.writId,
            signType: 'SINGLE_LAW'
          })
            .then(res => {
              if (res.code === '0') {
                this.$message({
                  message: '加盖执法专用章成功',
                  type: 'success'
                })
                let obj = {
                  id: this.docData.writId,
                  writType: this.docData.writTypeName, // 拼音首字母
                  title: this.docData.writTitle,
                  typeCode: this.docData.writTypeCode // WS 开头的文书号
                }
                this.$emit('toLawSeal', obj)
              }
            })
            .catch(err => {
              console.info(err)
            })
        }
      } else if (auditType === 'submit') {
        writTypeInfo.forEach(doc => {
          if (this.docData.writTypeCode === doc.typeCode) {
            let _penalty = this.$store.state.penalty;
            _audiReq.partyName = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName
            _audiReq.auditTypeCode = doc.auditTypeCode
            this.$emit('submit', _audiReq, this.docData)
          }
        })
      } else {
        writTypeInfo.forEach(doc => {
          if (this.docData.writTypeCode === doc.typeCode) {
            _audiReq.auditTypeCode = doc.auditTypeCode
            this.$emit('toSeal', _audiReq, this.docData.writVersion)
          }
        })
      }
    },
    // 浏览/签名/修改等按钮控制
    handleUserSign(type) {
      let writTypeInfo = JSON.parse(sessionStorage.getItem('writTypeInfo'))

      if (writTypeInfo && writTypeInfo.length > 0 && type !== 'view') {
        writTypeInfo.forEach(writ => {
          if (writ.typeCode === this.docData.writTypeCode) {
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
            this.docData.writTitle, // 文书名
            this.docData.writTypeName, // 文书名拼音首字母
            this.docData.writId, // 文书号
            this.docData.businessId, // 业务Id
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
          this.$emit('previewWrit', this.docData.writId, this.docData.writTitle, this.buttonList, this.docData)
          break
        case 'seal':
          // 盖公章
          this.handleAudit('seal')
          break
        case 'lawSeal':
          // 盖私章
          this.handleAudit('lawSeal')
          break
        case 'upload':
          // 上传
          // 使用elment-ui upload组件默认的上传行为
          break
        case 'submit':
          // 提交审查审核审批
          this.handleAudit('submit')
          // this.$emit("submit")
          break
        case 'userSign':
          // 签名
          this.handleUserSign('userSign')
          this.$emit('previewWrit', this.docData.writId, this.docData.writTitle, this.buttonList, this.docData)
        default:
          return
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
        message: err
      })
    },
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
        return true
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
    delWrit() {
      this.$confirm(`确定删除${this.docData.writTitle}？`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let delReq = { writId: this.docData.writId }
          // 对不起 实在是不知道怎么写条件 把整改复查意见书 拉出来了 可以优化的 请一定要告诉我
          if (this.docData.writTypeName === 'ZGFCYJS') {
            deleteRectificationWrit(delReq)
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
          } else {
            if (this.docData.businessId && this.docData.businessId !== '') {
              if (this.docData.writTypeName === 'ZLXQZGZLS') {
                delRectificationWrit({ id: this.docData.businessId }).then(
                  res => {
                    console.log('ceshishuju', res)
                    this.$message({
                      type: 'success',
                      message: '删除成功！'
                    })
                    this.$emit('afterDelete')
                  },
                  err => {
                    this.$message({
                      type: 'error',
                      message: err
                    })
                  }
                )
              }
              if (this.docData.writTypeName === 'XCCLCS') {
                delInspectionWrit({
                  id: this.docData.businessId
                }).then(
                  res => {
                    this.$message({
                      type: 'success',
                      message: '删除成功！'
                    })
                    this.$emit('afterDelete')
                  },
                  err => {
                    this.$message({
                      type: 'error',
                      message: err
                    })
                  }
                )
              }
              // 删除整改复查延期审批表
              if (this.docData.writTypeName === 'ZGFCYQSQSPB') {
                delSPB({
                  busId: this.docData.businessId,
                  writId: this.docData.writId
                }).then(
                  () => {
                    this.$message({
                      type: 'success',
                      message: '删除成功！'
                    })
                    this.$emit('afterDelete')
                  },
                  () => {
                    this.$message({
                      type: 'error',
                      message: err
                    })
                  }
                )
              }
              // 听证相关文书和集体讨论
              if (['TZBL', 'TZHBGS', 'XXCFTZHTZS', 'XXCFJTTLJL', 'XXCFJTTLJL2', 'XZCFTZHTZSSDHZ'].indexOf(this.docData.writTypeName) !== -1) {
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
              }
            } else {
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
            }
          }
          document.activeElement.blur()
        })
        .catch(() => {
          document.activeElement.blur()
        })
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
        this.discernAuto()
        this.params.writId = newVal.writId
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.doc-card-wrapper {
  width: 360px;
  // height: 135px;
  position: relative;
  margin-bottom: 8px;
  margin-right: 5px;

  /deep/ .el-card {
    border: 1px solid #d4d7da;
  }

  /deep/ .el-card__body {
    padding: 0;
  }

  .card-main {
    height: 135px;
    border-bottom: 1px solid #e0e0e0;
    padding: 16px;

    .card-main-text {
      // height: 30px;
      line-height: 30px;
      word-break: keep-all;
      white-space: pre-wrap;
    }

    .file-bar {
      display: flex;
      flex-direction: column;
      height: 55px;
      margin-right: -27px;
      overflow-y: auto;

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

      .audit_desc {
        color: #999999;

        &::before {
          content: '•';
          margin-right: 9px;
          font-size: 12px;
        }

        &.passed {
          color: #1cc19c;
        }

        &.failed {
          color: #ff2525;
        }
      }
    }
    .seal-title {
      cursor: pointer;
    }
  }

  .ellipsis_style {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .button_wrapper {
    // overflow: hidden;
    height: 36px;
  }

  .doc-card-buttons {
    height: 36px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    flex-flow: row-reverse;
    overflow-x: auto;
    overflow-y: hidden;

    .button_style {
      height: 24px;
      margin-left: 4px;
      padding: 0px 4px;
      &.audit_back:not(.is-disabled) {
        background: #1cc19c;
      }
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

  .book-mark {
    width: 36px;
    height: 30px;
    background-color: #1cc19c;
    position: absolute;
    top: 0;
    right: 10px;

    .text {
      width: 36px;
      text-align: center;
      font-size: 14px;
      line-height: 27px;
      color: #fff;
      position: absolute;
      top: 0;
    }

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-width: 18px;
      border-style: solid;
      border-color: #1cc19c #1cc19c #fff #1cc19c;
      top: 6px;
      left: 0;
      position: absolute;
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

.audit-pro {
  /deep/ .el-dialog__body {
    padding: 20px;
    max-height: 450px;
    overflow: auto;
  }
}

.show-img {
  width: 100%;
  height: 100%;
}
</style>
