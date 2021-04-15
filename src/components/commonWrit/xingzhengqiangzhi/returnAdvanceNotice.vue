<template>
  <div>
    <div class="return-notice_content writ-overflow">
      <el-form ref="notice" :model="notice" :rules="rules" label-position="right" label-width="160px" :show-message="false">
        <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
          <el-input v-model="notice.caseName" placeholder="案件名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="unit">
              <div slot="label" class="slot_label">受送达单位/个人</div>
          <el-input v-model="notice.unit" placeholder="受送达单位（个人）"></el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="name">
              <div slot="label" class="slot_label">送达文书编号</div>
              <el-input v-model="notice.name" placeholder="送达文书名称、文号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" placeholder="送达方式">
              <div slot="label" class="slot_label">送达方式</div>
              <el-select v-model="notice.way">
                <el-option label="直接送达" value="直接送达"></el-option>
                <el-option label="委托送达" value="委托送达"></el-option>
                <el-option label="邮寄送达" value="邮寄送达"></el-option>
                <el-option label="留置送达" value="留置送达"></el-option>
                <el-option label="公告送达" value="公告送达"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="address">
              <div slot="label" class="slot_label">送达地点</div>
              <el-input v-model="notice.address" placeholder="送达地点"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">
              <div slot="label" class="slot_label">送达日期</div>
              <el-date-picker v-model="notice.date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="" prop="remark">
              <div slot="label" class="slot_label">备注</div>
          <el-input v-model="notice.remark" type="textarea" :autosize="{ minRows: 1 }" placeholder="备注"> </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成行政强制执行事先催告书送达回执</el-button>
      <!-- <el-button type="primary" @click="lawSeal" :disabled="lawDisabled">加盖执法专用章</el-button> -->
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat, stringToDate, reflectEntity, getFirstErrMsg } from '@/utils/util'
import { sealWrit } from '@/api/fileRelated'
import { getWritInfo } from '@api/fileRelated'

export default {
  props: ['info'],
  data() {
    return {
      lawDisabled: false,
      notice: {
        caseName: '', //案件名称
        unit: '', //单位
        remark: '', //备注
        name: '', //送达文书名称、文号
        people: '', //收件人签名或者盖章
        address: '', //送达地点
        date: '', //送达日期
        way: '', //送达方式
        server: '' //送达人
      },
      rules: {
        caseName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入案件名称'
          }
        ],
        unit: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入受送达单位/个人'
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入送达文书编号'
          }
        ],
        address: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入送达地点'
          }
        ],
        date: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入送达日期'
          }
        ],
        way: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择送达方式'
          }
        ]
      }
    }
  },
  created() {
    if (this.info.writInfo) {
      this.reflect()
    } else {
      this.initInfo()
    }
  },
  methods: {
    sure() {
      this.$refs.notice.validate((val,errInfo) => {
        if (val) {
          let data = getWritParams({
            tag2: this.notice.caseName,
            tag3: this.notice.unit,
            tag10: this.notice.remark,
            'entity1-col1': this.notice.name,
            'entity1-col2': this.notice.address,
            'entity1-col3': dateFormat(this.notice.date, 'yyyy年mm月dd日'),
            'entity1-col4': this.notice.way,
            'entity1-col5': this.notice.people,
            'entity1-col6': this.notice.server
          })
          // data = data.concat(dataInfo);

          let params = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XZQZZXSXCGSSDHZ',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    // 提交盖执法章
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
          this.$message({
            message: err,
            type: 'warning'
          })
        })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },

    // 文书回显
    reflect() {
      let inputInfo = this.info.writInfo.reduce((total, item) => {
        switch (item.tagName) {
          case 'tag2':
            total.caseName = item.tagContent
            break
          case 'tag3':
            total.unit = item.tagContent
            break
          case 'tag10':
            total.remark = item.tagContent
            break
          case 'entity1-col1':
            total.name = item.tagContent
            break
          case 'entity1-col2':
            total.address = item.tagContent
            break
          case 'entity1-col3':
            total.date = item.tagContent
              ? stringToDate(
                  item.tagContent
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                )
              : ''
            break
          case 'entity1-col4':
            total.way = item.tagContent
            break
          case 'entity1-col5':
            total.people = item.tagContent
            break
          case 'entity1-col6':
            total.server = item.tagContent
            break
        }
        return total
      }, {})
      this.notice = inputInfo
    },
    // 初始化文书
    initInfo() {
      console.info(this.info)
      this.info.docList.map(item => {
        if (item.writTypeName == 'XZQZZXSQCGS') {
          this.notice.name = item.writNoName
        }
      })
      let user = JSON.parse(localStorage.getItem('res'))
      this.notice.unit = this.info.auditInfo.subject
      this.notice.caseName = this.info.auditInfo.caseName
      //  + "案";
      this.notice.address = ''
      this.notice.server = ''
    }
  }
}
</script>

<style lang="less" scoped>
.return-notice_content {
  padding: 10px 16px 10px 16px;

  /deep/ .el-form-item {
    margin-bottom: 0;
  }

  /deep/ .el-select.el-select {
    width: 100%;
  }

  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

  .el-textarea {
    margin: 5px 0;
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
  padding-right: 16px;
  padding-bottom: 10px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}

.return-notice_content.writ-overflow {
  overflow: inherit;
}
</style>
