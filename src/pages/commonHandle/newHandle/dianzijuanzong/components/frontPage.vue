<template>
  <div>
    <section class="front_page">
      <div>
        <el-form
          ref="frontPage"
          :rules="rules"
          :model="frontPageData"
          label-width="100px"
          label-position="left"
          :show-message="false"
        >
          <el-row>
            <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
              <el-input v-model="frontPageData.caseName" placeholder="请输入案件名称"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="" prop="caseReason">
              <div slot="label" class="slot_label">案由</div>
              <el-input v-model="frontPageData.caseReason" placeholder="请输入案由"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="" prop="result">
              <div slot="label" class="slot_label">处理结果</div>
              <el-input v-model="frontPageData.result" type="textarea" placeholder="请输入处理结果"></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="" prop="creatorTime">
              <div slot="label" class="slot_label">立案日期</div>
                <el-date-picker
                  readonly
                  v-model="frontPageData.creatorTime"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="请选择立案日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" prop="endTime">
              <div slot="label" class="slot_label">结案日期</div>
                <el-date-picker
                  v-model="frontPageData.endTime"
                  format="yyyy-MM-dd"
                  placeholder="请选择结案日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="" prop="fileTime">
              <div slot="label" class="slot_label">归档日期</div>
                <el-date-picker
                  v-model="frontPageData.fileTime"
                  format="yyyy-MM-dd"
                  placeholder="请选择归档日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" prop="fileNo">
              <div slot="label" class="slot_label">归档号</div>
                <el-input v-model="frontPageData.fileNo" placeholder="请输入归档号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="" prop="udtNames">
              <div slot="label" class="slot_label">承办人</div>
                <el-input v-model="frontPageData.udtNames" placeholder="请输入承办人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" prop="reserveDuring">
              <div slot="label" class="slot_label">保存期限</div>
                <el-input v-model="frontPageData.reserveDuring" placeholder="输入保存期限，比如“10年”"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成卷宗首页</el-button>
    </div>
    <show-pdf
      :pdfId="frontWritId"
      v-if="showPdf"
      @updatePdf="updatePdf"
      @closePdf="closePdf"
      @finishPdf="closePdf"
      :buttonList="{
        updatePdf: true, // 回退编辑
        signPdf: true, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true
      }"
      :writName="'电子卷宗首页'"
    ></show-pdf>
  </div>
</template>

<script>
import { dateFormat, handleDateRef, getWritParams, getFirstErrMsg } from '@/utils/util'
import showPdf from '@/components/showPdf'
import { createWrit, updateWrit, getWritInfo, getWritDataByWritId } from '@/api/fileRelated'
import { mapState } from 'vuex'
export default {
  name: 'frontPage',
  components: {
    showPdf
  },
  data() {
    return {
      showPdf: false, // 是否展示文书浏览
      rules: {
        caseName: [{ required: true, trigger: 'blur', message: '请输入案件名称' }],
        caseReason: [{ required: true, trigger: 'blur', message: '请输入案由' }],
        result: [{ required: true, trigger: 'blur', message: '请输入处理结果' }],
        creatorTime: [{ required: true, trigger: 'blur', message: '请选择立案日期' }],
        endTime: [{ required: true, trigger: 'blur', message: '请选择结案日期：' }],
        fileTime: [{ required: true, trigger: 'blur', message: '请选择归档日期' }],
        fileNo: [{ required: true, trigger: 'blur', message: '请输入归档号' }],
        udtNames: [{ required: true, trigger: 'blur', message: '请输入承办人' }],
        reserveDuring: [{ required: true, trigger: 'blur', message: '请输入保存期限' }]
      },
      frontPageData: {
        caseName: '', // 案件名称
        caseReason: '', // 案由
        result: '', // 处理结果
        creatorTime: '', // 立案日期
        endTime: '', // 结案日期
        fileTime: '', // 归档日期
        fileNo: '', // 归档号
        udtNames: '', // 承办人
        reserveDuring: '' // 保存期限
      },
      frontWritId: '' // 电子卷宗首页文书Id
    }
  },
  computed: {
    ...mapState(['moduleId'])
  },
  created() {
    this.getFrontPage()
  },
  methods: {
    getFrontPage() {
      let req = {
        sourceId: this.moduleId,
        type: 'AJ'
      }
      getWritInfo(req).then(res => {
        if (res.data && res.data[0]) {
          this.frontWritId = res.data[0].writId
          this.reflect(this.frontWritId)
        } else {
          this.initData()
        }
      })
    },
    // 初始化文书数据
    initData() {
      let _penalty = this.$store.state.penalty
      let req = {
        sourceId: this.moduleId,
        type: 'JASPB'
      }
      getWritInfo(req)
        .then(res => {
          let writ = res.data[0]
          if (writ) {
            return getWritDataByWritId({ writId: writ.writId })
          }
        })
        .then(info => {
          if (info.data) {
            info.data.forEach(v => {
              if (v.tagName === 'tag16') {
                this.frontPageData.result = v.tagContent
              }
            })
          }
        })
      console.info('frontPage', _penalty)
      this.frontPageData = {
        caseName: _penalty.penaltyUndEntity.caseName, // 案件名称
        caseReason: _penalty.caseReasonNames, // 案由
        result: '', // 处理结果
        creatorTime: new Date(_penalty.penaltyUndEntity.caseCrimeTime), // 立案日期
        endTime: '', // 结案日期
        fileTime: '', // 归档日期
        fileNo: '', // 归档号
        udtNames: _penalty.udtNames, // 承办人
        reserveDuring: '' // 保存期限
      }
    },
    // 回显文书数据
    reflect() {
      getWritDataByWritId({ writId: this.frontWritId }).then(res => {
        let inputInfo = res.data.reduce((total, item, index) => {
          switch (item.tagName) {
            case 'tag2':
              total.caseName = item.tagContent
              break
            case 'tag3':
              total.caseReason = item.tagContent
              break
            case 'tag4':
              total.result = item.tagContent
              break
            case 'tag5':
              total.creatorTime = handleDateRef(item.tagContent)
              break
            case 'tag6':
              total.endTime = handleDateRef(item.tagContent)
              break
            case 'tag7':
              total.udtNames = item.tagContent
              break
            case 'tag8':
              total.fileTime = handleDateRef(item.tagContent)
              break
            case 'tag9':
              total.fileNo = item.tagContent
              break
            case 'tag10':
              total.reserveDuring = item.tagContent
              break
          }
          return total
        }, {})
        this.frontPageData = inputInfo
      })
    },
    sure() {
      this.$refs.frontPage.validate((valid, errInfo) => {
        if (valid) {
          let data = getWritParams({
            tag2: this.frontPageData.caseName,
            tag3: this.frontPageData.caseReason,
            tag4: this.frontPageData.result,
            tag5: dateFormat(this.frontPageData.creatorTime, 'yyyy年mm月dd日'),
            tag6: dateFormat(this.frontPageData.endTime, 'yyyy年mm月dd日'),
            tag7: this.frontPageData.udtNames,
            tag8: dateFormat(this.frontPageData.fileTime, 'yyyy年mm月dd日'),
            tag9: this.frontPageData.fileNo,
            tag10: this.frontPageData.reserveDuring
          })
          let params = {
              companyId: this.$store.state.penalty.penaltyUndEntity.punishCompanyId, //制作文书传company_id
            contractorIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
            writType: 'AJ',
            sourceId: this.moduleId,
            data: data
          }
          this.createWrit(params)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    // 制作电子卷宗首页文书
    createWrit(params) {
      if (this.frontWritId) {
        updateWrit({ writId: this.frontWritId }, params.data)
          .then(res => {
            this.frontWritId = res.writId
            this.showPdf = true
            this.getMessage('success', '制作成功！')
            this.$emit('createFr')
          })
          .catch(err => {
            this.getMessage('error', '制作失败！')
          })
      } else {
        createWrit(params)
          .then(res => {
            this.frontWritId = res.writId
            this.showPdf = true
            this.getMessage('success', '制作成功！')
            this.$emit('createFr')
          })
          .catch(err => {
            this.getMessage('error', '制作失败！')
          })
      }
    },
    // 关闭卷宗首页制作弹框
    cancel() {
      this.$emit('afterMath', false)
    },
    // 提示信息
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    // 回退编辑
    updatePdf() {
      this.showPdf = false
    },
    // 关闭卷宗首页浏览
    closePdf() {
      this.$emit('afterMath', true)
      this.showPdf = false
    }
  }
}
</script>

<style lang="less" scoped>
.front_page {
  padding: 8px 16px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.dialog-footer {
  padding: 6px 16px 6px 0;
  border: 1px solid #e0e0e0;
  background: white;
  text-align: right;
}
</style>
