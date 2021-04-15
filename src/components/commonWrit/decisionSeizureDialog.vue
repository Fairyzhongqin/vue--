<template>
  <div>
    <div class="decisionSeizureDialog_content">
      <el-form
        ref="seizureFormRef"
        :model="seizureFormRef"
        label-width="140px"
        :rules="seizureFormRefrules"
        :show-message="false"
      >
        <el-row>
          <el-form-item label="" prop="unitname">
              <div slot="label" class="slot_label">单位名称</div>
            <el-input v-model="seizureFormRef.unitname" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="existQuestion">
              <div slot="label" class="slot_label">存在的问题</div>
            <el-input v-model="seizureFormRef.existQuestion" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="relativeRegular">
              <div slot="label" class="slot_label">相关规定</div>
            <el-input v-model="seizureFormRef.relativeRegular" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="measure">
              <div slot="label" class="slot_label">强制措施</div>
              <el-input v-model="seizureFormRef.measure" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="limitDatetIME">
            <el-form-item label="" prop="limitDate">
              <div slot="label" class="slot_label">期限</div>
              <el-date-picker
                v-model="seizureFormRef.limitDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="goveron">
              <div slot="label" class="slot_label">复议人民政府</div>
              <el-input v-model="seizureFormRef.goveron" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="fullDeptName">
              <div slot="label" class="slot_label">复议应急管理局</div>
              <el-input v-model="seizureFormRef.fullDeptName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="court">
              <div slot="label" class="slot_label">行政诉讼法院</div>
              <el-input v-model="seizureFormRef.court" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="value" >
            <div slot="label" class="slot_label">查封扣押清单号</div>
              <el-select v-model="seizureFormRef.value" placeholder="选择查封扣押单号">
                <el-option
                  v-for="item in num"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div
      class="dialog-footer"
      style=" margin-top:40px; text-align: right; border-top: 1px solid #ccc; padding-top: 10px;
    padding-right: 10px; padding-bottom: 10px;"
    >
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成查封扣押决定书</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, stringToDate } from '@/utils/util'
import { getWritInfo, getWritDataByWritId } from '@/api/fileRelated'
import { previewWrit, sealWrit, queryWritState } from '@/api/fileRelated'
import Bus from '@/bus'

export default {
  props: {
    info: {
      type: Object
    }
  },
  name: 'decisionSeizureDialog',
  data() {
    return {
      isDisabled: false,
      seizureFormRef: {
        unitname: '', //单位名称
        existQuestion: '', //存在的问题：
        relativeRegular: '', //相关规定
        measure: '', //强制措施：
        limitDate: '', //期限
        goveron: '', //复议人民政府：
        fullDeptName: '', //复议应急管理局：
        court: '', //行政诉讼法院：
        value: null //查封扣押清单号：
      },
      num: [],
      seizureFormRefrules: {
        unitname: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        existQuestion: [{ required: true, message: '请输入存在的问题', trigger: 'blur' }],
        relativeRegular: [{ required: true, message: '请输入相关规定', trigger: 'blur' }],
        measure: [{ required: true, message: '请输入强制措施', trigger: 'blur' }],
        limitDate: [{ required: true, message: '请输入期限', trigger: 'blur' }],
        goveron: [{ required: true, message: '请输入复议人民政府', trigger: 'blur' }],
        fullDeptName: [{ required: true, message: '请输入复议应急管理局', trigger: 'blur' }],
        court: [{ required: true, message: '请输入行政诉讼法院', trigger: 'blur' }],
        value: [{ required: true, message: '请选择查封扣押清单号', trigger: 'change' }]
      }
    }
  },
  mounted() {
    getWritInfo({
      sourceId: this.info.auditInfo.sourceId,
      type: 'CFKYQD'
    }).then(res => {
      console.log(res.data)
      if (res.data && res.data.length > 0) {
        this.num = res.data.reduce((total, item) => {
          total.push({
            label: item.writNoName,
            value: item.writNoName,
            writId: item.writId
          })
          return total
        }, [])
      }
      /* else {
        this.$alert('请先上传查封扣押清单', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
      } */
    })
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        time = []
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.unitname = item.tagContent
            break
          case 'tag3':
            total.existQuestion = item.tagContent
            break
          case 'tag4':
            total.relativeRegular = item.tagContent
            break
          case 'tag5':
            total.measure = item.tagContent
            break
          case 'tag6':
            let temp = item.tagContent
              .replace('年', '-')
              .replace('月', '-')
              .replace('日', '')
            time[0] = stringToDate(temp)
            break
          case 'tag7':
            let endTemp = item.tagContent
              .replace('年', '-')
              .replace('月', '-')
              .replace('日', '')
            time[1] = stringToDate(endTemp)
            break
          case 'tag8':
            total.goveron = item.tagContent
            break
          case 'tag9':
            total.fullDeptName = item.tagContent
            break
          case 'tag10':
            total.court = item.tagContent
            break
          /*   case 'tag11':
            total.value = item.tagContent
            break */
          case 'listNo':
            total.value = item.tagContent
            break
        }
        return total
      }, {})
      inputInfo.limitDate = time
      this.seizureFormRef = inputInfo
      console.log('seizureFormRef', this.seizureFormRef)
    } else {
      this.initInfo()
    }
  },
  methods: {
    // 加盖执法专用章
    // seal() {
    //   let audiReq = {
    //     auditTypeCode: "ta80040", // 盖章审核
    //     handlerDeptId: "", // 审核人部门 id
    //     handlerUserId: "", // 审核人
    //     requestDeptName: JSON.parse(localStorage.getItem("res")).userEntity
    //       .deptName, // 承办人部门，现在先不填
    //     requestId:  this.submitId, // 文书 writId
    //     requestTime: void 0,
    //     requestUsersName: this.info.auditInfo.responsiblePerson, // 承办人名称
    //     submitterCause: this.info.auditInfo.companyName // 案件名称 或 企业名称
    //   };
    //   this.$emit("toSeal", audiReq);
    // },
    seal() {
      this.isLoading = true
      queryWritState({ writId: this.submitId }).then(res => {
        console.log(res, '-----------===========')
        this.canSealLaw = res.data.noProcessSignStatus
        this.writId = res.data.writId
        if (this.canSealLaw === 0) {
          sealWrit({
            writId: this.submitId,
            signType: 'SINGLE_LAW'
          })
            .then(res => {
              if (res.code === '0') {
                this.$message({
                  message: '加盖执法专用章成功',
                  type: 'success'
                })
                this.isDisabled = false
                this.$emit('previewWrit', this.writId, '查封扣押决定书', {
                  closePdf: true
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.isDisabled = true
        }
      })
    },
    //初始化文书数据
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.seizureFormRef = {
        unitname: this.info.auditInfo.companyName, //单位名称
        existQuestion: '', //存在的问题：
        relativeRegular: '', //相关规定
        measure: '', //强制措施：
        limitDate: [new Date(), this.getNextMonth()], //期限
        goveron: user.sysDeptEntity.government, //复议人民政府：
        fullDeptName: user.sysDeptEntity.bureau, //复议应急管理局：
        court: user.sysDeptEntity.court, //行政诉讼法院
        value: null
      }
    },
    sure() {
      this.$refs.seizureFormRef.validate(valid => {
        if (valid) {
          // 提交
          let listOrder = this.seizureFormRef.value
          let listOrderStr = listOrder ? listOrder.match(/〕(\S*)号/)[1] : ''
          let data = getWritParams({
            tag2: this.seizureFormRef.unitname.trim(),
            tag3: this.seizureFormRef.existQuestion,
            tag4: this.seizureFormRef.relativeRegular,
            tag5: this.seizureFormRef.measure,
            tag6: dateFormat(this.seizureFormRef.limitDate[0], 'yyyy年mm月dd日'),
            tag7: dateFormat(this.seizureFormRef.limitDate[1], 'yyyy年mm月dd日'),
            tag8: this.seizureFormRef.goveron,
            tag9: this.seizureFormRef.fullDeptName,
            tag10: this.seizureFormRef.court,
            // 第几号 只传几数字
            tag11: this.seizureFormRef.value ? listOrderStr : '',
            // tag11: this.seizureFormRef.value?this.seizureFormRef.value.substr(this.seizureFormRef.value.length-2,this.seizureFormRef.value.length-1):"",
            listNo: this.seizureFormRef.value //查封扣押清单号
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'CFKYJDS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          // this.$emit("createWrit", params);
          this.getSeizureList(params)
          this.isDisabled = true
        } else {
          console.info('error submit')
        }
      })
      // let listOrder = this.seizureFormRef.value
      // let listOrderStr = listOrder ? listOrder.match(/〕(\S*)号/)[1] : ''
      // /* this.$refs.seizureFormRef.validate(val => {
      //   if (val) { */
      // let data = getWritParams({
      //   tag2: this.seizureFormRef.unitname.trim(),
      //   tag3: this.seizureFormRef.existQuestion,
      //   tag4: this.seizureFormRef.relativeRegular,
      //   tag5: this.seizureFormRef.measure,
      //   tag6: dateFormat(this.seizureFormRef.limitDate[0], 'yyyy年mm月dd日'),
      //   tag7: dateFormat(this.seizureFormRef.limitDate[1], 'yyyy年mm月dd日'),
      //   tag8: this.seizureFormRef.goveron,
      //   tag9: this.seizureFormRef.fullDeptName,
      //   tag10: this.seizureFormRef.court,
      //   // 第几号 只传几数字
      //   tag11: this.seizureFormRef.value ? listOrderStr : '',
      //   // tag11: this.seizureFormRef.value?this.seizureFormRef.value.substr(this.seizureFormRef.value.length-2,this.seizureFormRef.value.length-1):"",
      //   listNo: this.seizureFormRef.value //查封扣押清单号
      // })
      // let params = {
      //   contractorIds: this.info.auditInfo.udtIds,
      //   writType: 'CFKYJDS',
      //   sourceId: this.info.auditInfo.sourceId,
      //   data: data
      // }
      // // this.$emit("createWrit", params);
      // this.getSeizureList(params)
      // this.isDisabled = true
      // /* } else {
      //     console.log("校验失败");
      //   } */
      // // });
    },
    getSeizureList(params) {
      let temp = -1
      console.info('清单号', this.num)
      if (!this.num || this.num.length === 0) {
        this.$alert('请上传查封扣押清单', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return
      }
      this.num.some((item, index) => {
        temp = index
        return item.value === this.seizureFormRef.value
      })

      getWritDataByWritId({ writId: this.num[temp].writId }).then(res => {
        console.log(res.data)
        let arr = []
        res.data.forEach(item => {
          let first = Number(item.tagName.split('-')[0].slice(6)) - 1,
            second = item.tagName.split('-')[1]
          if (!arr[first]) {
            arr[first] = {}
          }
          switch (second) {
            case 'col1':
              arr[first].ordeNumber = item.tagContent
              break
            case 'col2':
              arr[first].evidence = item.tagContent
              break
            case 'col3':
              arr[first].model = item.tagContent
              break
            case 'col4':
              arr[first].company = item.tagContent
              break
            case 'col5':
              arr[first].count = item.tagContent
              break
            case 'col6':
              arr[first].remark = item.tagContent
              break
          }
        })
        params.data.push({
          tagName: 'xiaoying',
          tagContent: JSON.stringify({
            name: this.seizureFormRef.value,
            list: arr
          })
        })
        this.$emit('createWrit', params)
      })
    },
    //点击取消按钮事件
    close() {
      this.$emit('close')
    },
    //处理日期
    getNextMonth() {
      var year = new Date().getFullYear() //获取当前日期的年份
      var month = new Date().getMonth() + 1 //获取当前日期的月份
      var day = new Date().getDate() //获取当前日期的日

      var date = new Date(year, month, day)

      return date
    }
  }
}
</script>

<style lang="less" scoped>
.decisionSeizureDialog_content {
  padding: 10px 16px 0px 16px;
  /deep/ .el-form-item__label {
    color: #333 !important;
  }
  // /deep/ .el-form-item__label::before {
  //   content: '' !important;
  // }
  // .qiangzhiMeasure {
  //   /deep/ .el-input__inner {
  //     width: 95% !important;
  //   }
  // }
  .limitDatetIME {
    /deep/ .el-form-item__label {
      padding-left: 5px;
    }
    /deep/ .el-range-editor.el-input__inner {
      padding: 0px 10px !important;
      height: 30px !important;
      width: 100%;
    }
  }
}
.selectDan {
  /deep/ .el-form-item__label {
    padding: 0 !important;
  }
  /deep/ .el-select {
    width: 100%;
  }
}
.el-form-item {
  margin-bottom: -5px;
  // margin-top: 10px;
  /deep/ .el-form-item__label {
    text-align: left;
  }
  /deep/.el-form--label-top .el-form-item__label {
    padding: 0 0 -8px;
  }
}
.fullDeptName {
  /deep/.el-form-item__label {
    width: 120px !important;
  }
}
// .wdthspecial {
//   /deep/ .el-form-item__label {
//     width: 122px !important;
//   }
//   /deep/ .el-input {
//     width: 95.5%;
//   }
// }
// .xingzhengcourt {
//   /deep/ .el-input {
//     width: 88% !important;
//   }
// }
// .el-row {
//   // margin-bottom:10px;
// }
</style>
