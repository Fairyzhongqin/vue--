<template>
  <div class="onsite_content">
    <div class="indexPosit">{{ indexKey + 1 }}、</div>

    <div class="lineCon">
      <span>检查项目类别：</span>
      <span>{{ selectedList.discretionTypeName }}</span>
    </div>
    <div style="font-size:16px;color:rgba(51,51,51,1);font-weight:700" class="lineCon">
      <span>检查内容：</span>
      <span>{{ selectedList.checkContent ? selectedList.checkContent : selectedList.checkItem }}</span>
    </div>
    <div class="lineCon">
      <span>检查描述：</span>
      <span>{{ selectedList.negativeDesc }}</span>
    </div>
    <el-form :model="measureForm" label-width="100px" :rules="measureRules" ref="measureForm" :show-message="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item class="flex-item" prop="valuehandle" label="">
            <div slot="label" class="slot_label">处理措施</div>
            <sn-select
              placeholder="请选择处理措施"
              :data-url="'/aj/sys/sysdict/list'"
              :requertData="{ type: 'processing_measures' }"
              :immediate="true"
              v-model="measureForm.valuehandle"
              :multiple="true"
              @getText="getMeasure"
              ref="selectMeasure"
            ></sn-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="flex-item" prop="rectifyTime" label="" label-width="135px">
            <div slot="label" class="slot_label">承诺整改时限</div>
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="picker" v-model="measureForm.rectifyTime" placeholder="选择承诺整改时限"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="legalvalue" label="" class="flex-item">
            <div slot="label" class="slot_label">法律依据</div>
        <!--  <sn-select
          placeholder="请选择"
          :data-url="'/aj/sys/sysdict/list'"
          :requertData="{type: 'law_info'}"
          :immediate="true"
          v-model="measureForm.legalvalue"
          :multiple="true"
          @getText="getLegal"
          ref="legalSelect"
        ></sn-select>-->
        <el-input type="textarea" placeholder="请输入法律依据" v-model="measureForm.legalvalue" ref="legalSelect" :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
      <el-form-item prop="suggestion" class="flex-item" label="">
            <div slot="label" class="slot_label">处理意见</div>
        <el-input v-model="measureForm.suggestion" @input="suggestionChange" placeholder="请输入处理意见" type="textarea" :autosize="true"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { refrainWithPro, refrainWithProId, getFirstErrMsg } from '@/utils/util'
import snSelect from '@/components/snSelect/index'
import { dropDownBoxByPost } from '@/api/dropDownBox'

export default {
  data() {
    return {
      opinionColor: false,
      handleOptions: [],
      picker: {},
      measureForm: {
        suggestion: '',
        rectifyTime: void 0, // 承诺整改时限
        legalvalue: '', // 法律依据
        valuehandle: [] // 处理措施
      },
      lawLabel: [], //legal value
      lawCode: [], //法律依据id
      lawObject: [], //一个检查项的法律依据，去重后的
      lawWritInfo: [], //所有检查项的法律依据，去重后的
      rewritLawLabel: [], //修改的lawValue
      rewritLawCode: [], //修改的lawCode
      // value:'',
      itemValue: '',
      legalSelect: [],
      legalOptions: [],
      legalMap: new Map(),
      // chanSuggestion:[],
      selectedLegal: [], //取到的法律依据
      selectedMeasure: [],
      measureRules: {
        suggestion: [{ required: true, trigger: 'blur', message: '请输入处理意见' }],
        legalvalue: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入法律依据'
          }
        ],
        valuehandle: [
          {
            required: true,
            trigger: 'change',
            message: '请选择处理措施'
          }
        ]
      },
      lawOption: []
    }
  },
  components: {
    snSelect
  },

  props: {
    selectedList: {
      type: Object
    },
    indexKey: {
      type: Number
    }
  },
  methods: {
    getMeasure(arr) {
      this.lawLabel = []
      this.lawObject = []
      this.lawCode = []
      this.lawWritInfo = []
      this.legalSelect = []
      // get the measureCode
      if (arr && arr.length > 0) {
        let lawItem = {}
        for (let i = 0; i < arr.length; i++) {
          let lawWritArr = []
          for (let j = 0; j < this.lawOption.length; j++) {
            // this.lawOption.forEach(item => {
            if (this.lawOption[j].parentId === arr[i].value) {
              this.legalSelect.push({
                id: this.lawOption[j].parentId,
                value: this.lawOption[j].value,
                remark: this.lawOption[j].remark,
                code: this.lawOption[j].code,
                name: this.lawOption[j].name
              })
              if (this.lawOption[j].name.includes('《安全生产法》')) {
                lawWritArr = [
                  {
                    id: this.lawOption[j].parentId,
                    value: this.lawOption[j].value,
                    remark: this.lawOption[j].remark,
                    code: this.lawOption[j].code,
                    name: this.lawOption[j].name
                  }
                ]
                lawWritArr = refrainWithPro(lawWritArr)
                break
              } else {
                lawWritArr.push({
                  id: this.lawOption[j].parentId,
                  value: this.lawOption[j].value,
                  remark: this.lawOption[j].remark,
                  code: this.lawOption[j].code,
                  name: this.lawOption[j].name
                })
                lawWritArr = refrainWithPro(lawWritArr)
              }
            }
          }
          if (lawWritArr.length > 0) {
            this.lawObject = this.lawObject.concat(lawWritArr)
          }
        }
        // 单个检查项的法律依据
        this.lawObject = refrainWithPro(this.lawObject)
        // 所有检查项的法律依据 用作文书显示
        this.lawWritInfo = refrainWithProId(this.lawWritInfo.concat(this.lawObject))
        // 取legalValue
        this.lawWritInfo.forEach(item => {
          this.lawLabel.push(item.remark)
          this.lawCode.push(item.code)
        })
        this.lawLabel = Array.from(new Set(this.lawLabel))
        this.lawCode = Array.from(new Set(this.lawCode))
        // 用作页面显示的法律依据的值
        this.$set(this.measureForm, 'legalvalue', this.lawLabel.join(''))
        // 若用ToString会将数组内的逗号原样输出  join('') 分隔符为空则不会
      } else {
        this.measureForm.legalvalue = ''
      }

      // get suggestion automaticly
      let suggestionStr = ''
      for (let i = 0; i < arr.length; i++) {
        suggestionStr += arr[i].label + '、'
      }
      this.measureForm.suggestion = suggestionStr.slice(0, suggestionStr.length - 1)
    },
    getLawOption() {
      dropDownBoxByPost('/aj/sys/sysdict/list', { type: 'law_info' }, 'post').then(res => {
        this.lawOption = res.page.list
      })
    },
    suggestionChange(val) {
      this.measureForm.suggestion = val
    },
    //子组件校验，传递到父组件
    validateForm() {
      // getFirstErrMsg
      let flag = null
      this.$refs['measureForm'].validate((valid, obj) => {
        if (valid) {
          flag = false
        } else {
          flag = getFirstErrMsg(obj)
        }
      })
      return flag
    }
  },
  created() {
    this.picker = {
      disabledDate: time => {
        let res = time.getTime() >= new Date().setMonth(new Date().getMonth() + 6) || time.getTime() < new Date().getTime() - 24*3600*1000
        return res
      }
    }
    this.getLawOption()
  },
  mounted() {
    //  修改编辑页重新赋值
    this.measureForm.rectifyTime = this.selectedList.rectifyTime ? new Date(this.selectedList.rectifyTime) : null
    this.measureForm.suggestion = this.selectedList.disposeOpinion
    this.measureForm.valuehandle = this.selectedList.measuresCode && this.selectedList.measuresCode.length > 0 ? this.selectedList.measuresCode.split(',') : []
    // 法律依据的值 挨个取
    this.rewritLawCode = this.selectedList.lawCode ? this.selectedList.lawCode.split(',') : [] //use lawCode to get law details
    this.lawCode = JSON.parse(JSON.stringify(this.rewritLawCode))

    dropDownBoxByPost('/aj/sys/sysdict/list', { type: 'law_info' }, 'post').then(res => {
      // 重新取一遍 然后重新赋值 回去
      if (this.measureForm.valuehandle && this.measureForm.valuehandle.length > 0) {
        let lawItem = {}
        for (let i = 0; i < this.measureForm.valuehandle.length; i++) {
          let lawWritArr = []
          for (let j = 0; j < res.page.list.length; j++) {
            // this.lawOption.forEach(item => {
            if (res.page.list[j].parentId === this.measureForm.valuehandle[i]) {
              this.legalSelect.push({
                id: res.page.list[j].parentId,
                value: res.page.list[j].value,
                remark: res.page.list[j].remark,
                code: res.page.list[j].code,
                name: res.page.list[j].name
              })
              if (res.page.list[j].name.includes('《安全生产法》')) {
                lawWritArr = [
                  {
                    id: res.page.list[j].parentId,
                    value: res.page.list[j].value,
                    remark: res.page.list[j].remark,
                    code: res.page.list[j].code,
                    name: res.page.list[j].name
                  }
                ]
                lawWritArr = refrainWithPro(lawWritArr)
                break
              } else {
                lawWritArr.push({
                  id: res.page.list[j].parentId,
                  value: res.page.list[j].value,
                  remark: res.page.list[j].remark,
                  code: res.page.list[j].code,
                  name: res.page.list[j].name
                })
                lawWritArr = refrainWithPro(lawWritArr)
              }
            }
          }
          if (lawWritArr.length > 0) {
            this.lawObject = this.lawObject.concat(lawWritArr)
          }
        }
        // 单个检查项的法律依据
        this.lawObject = refrainWithPro(this.lawObject)
        // 所有检查项的法律依据 用作文书显示
        this.lawWritInfo = refrainWithProId(this.lawWritInfo.concat(this.lawObject))
        // 取legalValue
        this.lawWritInfo.forEach(item => {
          this.lawLabel.push(item.remark)
          this.lawCode.push(item.code)
        })
        this.lawLabel = Array.from(new Set(this.lawLabel))
        this.lawCode = Array.from(new Set(this.lawCode))
        // 用作页面显示的法律依据的值
        this.$set(this.measureForm, 'legalvalue', this.lawLabel.join(''))
      }
    })
  },
  watch: {},
  activated() {
    this.getLawOption()
  }
}
</script>

<style lang="less" scoped>
.onsite_content {
  position: relative;
  margin-top: 20px;
  padding-left: 46px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-form {
    padding-right: 30px;
    margin-bottom: 10px;
  }
  // .flex-item {
  //   display: flex;
  //   /deep/ .el-form-item__content {
  //     flex-grow: 1;
  //     .el-select,
  //     .el-date-editor {
  //       width: 100%;
  //     }
  //   }
  // }
}
.el-select {
  /deep/.el-input {
    width: 100%;
  }
}
.indexPosit {
  position: absolute;
  top: 0px;
  left: 20px;
  font-size: 14px;
  color: #333;
  font-weight: 700;
}
</style>
