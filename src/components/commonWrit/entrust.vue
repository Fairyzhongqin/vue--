<template>
  <div class="entrust_lay">
    <div class="entrust_content">
      <el-form ref="entrustInfo" :model="entrustInfo" :inline-message="true" :show-message="false" :rules="rules" label-width="100px">
        <el-row>
          <el-form-item prop="require">
            <div slot="label" class="slot_label">送检单位</div>
            <el-input v-model="entrustInfo.entrustOrg" placeholder="请输入送检单位" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <div v-for="(item, index) of entrustInfo.dataInfo" :key="index">
            <el-row>
              <el-form-item :prop="`dataInfo[${index}].name`" :rules="dataInfoRules.dataName">
            <div slot="label" class="slot_label">鉴定物品</div>
                <el-input v-model="item.name" placeholder="请输入鉴定名称" clearable></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :prop="`dataInfo[${index}].model`" :rules="dataInfoRules.dataModel">
            <div slot="label" class="slot_label">规格型号</div>
                  <el-input v-model="item.model" placeholder="请输入规格型号" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :prop="`dataInfo[${index}].count`" :rules="dataInfoRules.dataCount">
            <div slot="label" class="slot_label">数量</div>
                  <el-input v-model="item.count" placeholder="请输入数量" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item class="mt5" prop="remark">
            <div slot="label" class="slot_label">备注</div>
                <el-input class="vab" type="textarea" v-model="item.remark" placeholder="备注" clearable :autosize="{ minRows: 1 }"></el-input>
              </el-form-item>
            </el-row>
            <el-row class="textRight">
              <el-button type="text" @click="del" v-if="entrustInfo.dataInfo.length === 0 || index + 1 === entrustInfo.dataInfo.length" class="colorRed">
                删除</el-button
              >
              <el-button type="text danger" v-if="entrustInfo.dataInfo.length === 0 || index + 1 === entrustInfo.dataInfo.length" @click="add(item)"
                >新增</el-button
              >
            </el-row>
          </div>
          <el-row>
            <el-form-item prop="require" class="mb5">
            <div slot="label" class="slot_label">鉴定要求</div>
              <el-input v-model="entrustInfo.require" type="textarea" class="vabo" :autosize="{ minRows: 1 }" placeholder="请输入鉴定要求" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12" :gutter="20">
              <el-form-item class="date_input" prop="date">
            <div slot="label" class="slot_label">鉴定时限</div>
                <el-date-picker v-model="entrustInfo.date" type="date" placeholder="选择鉴定时限"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="people">
            <div slot="label" class="slot_label">联系人</div>
                <el-input v-model="entrustInfo.people" placeholder="请输入联系人" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="phone">
            <div slot="label" class="slot_label">联系电话</div>
                <el-input v-model="entrustInfo.phone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成鉴定委托书</el-button>
      <!-- <el-button type="primary" @click="lawSeal" :disabled="lawDisabled">加盖执法专用章</el-button> -->
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, handleDateRef, getFirstErrMsg } from '@/utils/util'
import { sealWrit } from '@/api/fileRelated'

export default {
  name: 'takeEvidence',
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      entrustInfo: {
        entrustOrg: '', // 送检单位
        require: '', //鉴定要求
        people: '', //联系人
        phone: '', //联系电话
        date: '', //鉴定时限
        dataInfo: [
          {
            name: '', //名称
            model: '', //规格
            count: '', //数量
            remark: '' //备注
          }
        ]
      },
      dataInfoRules: {
        dataName: [{ required: true, message: '请输入鉴定物品名称', trigger: 'blur' }],
        dataModel: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        dataCount: [{ required: true, message: '请输入数量', trigger: 'blur' }]
      },
      rules: {
        entrustOrg: [{ required: true, message: '请输入送检单位', trigger: 'blur' }],
        require: [{ required: true, message: '请输入鉴定要求', trigger: 'blur' }],
        people: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入电话号码'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        date: [{ required: true, message: '请选择鉴定时限', trigger: 'blur' }]
      },
      createReq: {
        sourceId: '',
        userId: '',
        contractorIds: '',
        writType: 'JDWTS',
        data: []
      },
      lawDisabled: false
    }
  },
  created() {
    //判断是否点击修改  需要的回显数据
    if (this.info.writInfo) {
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.entrustOrg = item.tagContent
            break
          case 'tag3':
            total.require = item.tagContent
            break
          case 'tag4':
            total.date = handleDateRef(item.tagContent)
            break
          case 'tag5':
            total.people = item.tagContent
            break
          case 'tag6':
            total.phone = item.tagContent
            break
        }
        return total
      }, {})
      let arr = [
        {
          name: '', //名称
          model: '', //规格
          count: '', //数量
          remark: '' //备注
        }
      ]
      this.info.writInfo.forEach(item => {
        let first = Number(item.tagName.split('-')[0].slice(6)) - 1,
          second = item.tagName.split('-')[1]
        if (!arr[first]) {
          arr[first] = {}
        }
        switch (second) {
          case 'col1':
            arr[first].name = item.tagContent
            break
          case 'col2':
            arr[first].model = item.tagContent
            break
          case 'col3':
            arr[first].count = item.tagContent
            break
          case 'col4':
            arr[first].remark = item.tagContent
            break
        }
      })
      inputInfo.dataInfo = arr
      this.entrustInfo = inputInfo
    } else {
      this.initInfo()
    }
  },
  methods: {
    del() {
      this.entrustInfo.dataInfo.pop()
    },
    add(item) {
      this.entrustInfo.dataInfo.push({
        name: '', //名称
        model: '', //规格
        count: '', //数量
        remark: '' //备注
      })
    },
    // 提交盖章
    lawSeal() {
      sealWrit({
        writId: this.info.auditInfo.writId,
        signType: 'SINGLE_LAW'
      })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              message: '加盖执法专用章成功',
              type: 'success'
            })
            this.lawDisabled = true
            this.$emit('toLawSeal')
          }
        })
        .catch(err => {
          console.info(err)
        })
    },
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      console.log(user, 122233)
      this.entrustInfo.people = user.userEntity.nickName
      this.entrustInfo.phone = user.userEntity.mobile
      this.createReq = {
        companyId: this.info.auditInfo.companyId, //制作文书传company_id
        sourceId: this.info.auditInfo.sourceId,
        contractorIds: this.info.auditInfo.udtIds,
        writType: 'JDWTS',
        data: []
      }
    },
    handleEvidence() {
      let evidence = []
      this.entrustInfo.dataInfo.forEach((evi, index) => {
        for (let key in evi) {
          if (key === 'name') {
            evidence.push({
              tagContent: evi[key],
              tagName: `entity${index + 1}-col1`
            })
          } else if (key === 'model') {
            evidence.push({
              tagContent: evi[key],
              tagName: `entity${index + 1}-col2`
            })
          } else if (key === 'count') {
            evidence.push({
              tagContent: evi[key],
              tagName: `entity${index + 1}-col3`
            })
          } else if (key === 'remark') {
            evidence.push({
              tagContent: evi[key],
              tagName: `entity${index + 1}-col4`
            })
          }
        }
      })
      return evidence
    },
    sure() {
      this.$refs.entrustInfo.validate((val, errInfo) => {
        let user = JSON.parse(localStorage.getItem('res'))
        if (val) {
          let data = getWritParams({
            tag2: this.entrustInfo.entrustOrg, // 送检单位
            tag3: this.entrustInfo.require,
            tag4: dateFormat(this.entrustInfo.date, 'yyyy年mm月dd日'),
            tag5: user.userEntity.nickName,
            tag6: this.entrustInfo.phone
          })
          let info = this.handleEvidence()
          data = data.concat(info)
          this.createReq.data = data
          this.$emit('createWrit', this.createReq)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.entrust_lay {
  .entrust_content {
    max-height: 56vh;
    overflow-y: auto;
    padding: 10px 16px 10px 16px;

    .el-form {
      margin-top: 10px;
      .el-form-item {
        margin-bottom: 0;
      }

      .el-input__suffix {
        line-height: 20px;
      }
    }
  }

  .date_input {
    margin-right: 10px;

    /deep/ .el-input {
      width: 100%;
    }
  }

  .textRight {
    text-align: right;
  }

  .colorRed {
    color: red;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e0e0e0;
    padding: 5px 16px 5px 0;
  }
}
</style>
