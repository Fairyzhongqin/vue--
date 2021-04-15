<template>
  <div>
    <div class="addDiscretionary_content">
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"/> 返回
      </div>

      <section class="shared_part">
        <el-form label-position="left" label-width="90" :model="writTypeEnumInfo" :rules="rules" ref="ruleForm">
          <el-row :gutter="40">
            <el-col v-for="(item, index) in formData" :span="item.span" :key="index">
              <el-form-item :label="item.label" label-width="100" :class="item.class" :prop="item.codeName">
                <component v-if="item.componentName != 'value-select' && item.componentName != 'jw-upload'"
                           :is="item.componentName"
                           v-model="writTypeEnumInfo[item.codeName]"
                           :placeholder="item.placeholder"
                           :type="item.type"
                           :maxlength="item.maxlength"
                           :min="item.min"
                           :max="item.max"
                           @focus="handleDialog(item.codeName)"
                           autosize
                >
                </component>
                <component v-if="item.componentName === 'value-select'"
                           :is="item.componentName"
                           v-model="writTypeEnumInfo[item.codeName]"
                           :placeholder="item.placeholder"
                           :ref="item.codeName"
                           :options="item.options"
                />
                <component v-if="item.componentName === 'jw-upload'"
                           :is="item.componentName" :fileInfo = "fileData"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
    </div>

    <bottom-bar>
      <el-button @click="backPage" plain>取消</el-button>
      <el-button type="primary" @click="saveOrUpdate('ruleForm')">保存</el-button>
    </bottom-bar>
  </div>

</template>



<script>
import valueSelect from '../component/valueSelect'
import jwUpload from '../component/jwUpload'
import bottomBar from "@/components/bottomBar";

import { saveOrUpdate, info } from '@api/systemManagement/writTypeEnumManagement'
import { getWritTypeInfo } from '@/api/login/login'


export default {
  components: {
    valueSelect,
    bottomBar,
    jwUpload
  },
  data () {
    return {
      rules:
          {
            // discretionCode: [
            //   { required: true, trigger: 'blur' }
            // ],
            // orderNum: [
            //   { required: true, trigger: 'blur' }
            // ]
          },
      // 文书类型枚举实体
      writTypeEnumInfo: {
        id: '',
        type: '', // 文书标记
        typeCode: '', // 文书类型编码
        typeName: '', // 文书中文名称
        userType: '', // 签名类型 0-不需要用户签名  1-需要用户签名
        signMatch:'',//加盖公章模式 0 全局  1 部门配置
        isSign: '', // 加盖公章类型 0-不需要加盖公章 1-需要加盖公章 2-加盖执法章
        isAudit: '', // 是否需要审核  0-不需要  1-需要
        isUpload: '', // 是否需要上传签字文书 0-否  1-是
        auditTypeCode: '', // 审查审核审批流程 类型code
        isPenalty: '',// 是否是行政处罚模块的数据
        isMuti :'' // 是否唯一 0 否 1 是
      },
      fileData :
        {id : ''},
      // 填充的数据
      formData: [
        {
          label: '文书中文标记',
          value: '',
          codeName: 'type',
          componentName: 'el-input',
          placeholder: '输入文书标记',
          type: 'text',
          maxlength: 20,
          span: 12
        },
        {
          label: '文书类型编码',
          value: '',
          codeName: 'typeCode',
          componentName: 'el-input',
          placeholder: '输入文书类型编码',
          type: 'text',
          maxlength: 20,
          span: 12
        },
        {
          label: '文书中文名称',
          value: '',
          codeName: 'typeName',
          componentName: 'el-input',
          placeholder: '输入文书中文名称',
          type: 'text',
          maxlength: 20,
          span: 12
        },
        {
          label: '是否用户签名',
          value: '',
          codeName: 'userType',
          componentName: 'value-select',
          placeholder: '请选择是否需要用户签名',
          span: 12,
          options: [{
            value: 1,
            label: '是'
          }, {
            value: 0,
            label: '否'
          }]
        },
        {
            label: '加盖公章模式',
            value: '',
            codeName: 'signMatch',
            componentName: 'value-select',
            placeholder: '请选择加盖公章模式',
            span: 12,
            options: [{
                value: '0',
                label: '全局配置'
            }, {
                value: '1',
                label: '部门配置'
            }]
        },
        {
          label: '加盖公章类型',
          value: '',
          codeName: 'isSign',
          componentName: 'value-select',
          placeholder: '请选择加盖公章类型',
          span: 12,
          options: [{
            value: 0,
            label: '无'
          }, {
            value: 1,
            label: '加盖公章'
          }, {
            value: 2,
            label: '加盖执法章'
          }]
        },
        {
          label: '是否审核',
          value: '',
          codeName: 'isAudit',
          componentName: 'value-select',
          placeholder: '请选择是否需要审核',
          span: 12,
          options: [{
            value: 0,
            label: '否'
          }, {
            value: 1,
            label: '是'
          }]
        },
        {
          label: '上传签字文书',
          value: '',
          codeName: 'isUpload',
          componentName: 'value-select',
          placeholder: '请选择是上传签字文书',
          span: 12,
          options: [{
            value: 0,
            label: '否'
          }, {
            value: 1,
            label: '是'
          }]
        },

        {
          label: '是否行政处罚',
          value: '',
          codeName: 'isPenalty',
          componentName: 'value-select',
          placeholder: '请选择是否是行政处罚模块文书',
          span: 12,
          options: [{
            value: '0',
            label: '否'
          }, {
            value: '1',
            label: '是'
          },
          {
            value: 'init',
            label: '基本线'
          }]
        },

        {
          label: '是否唯一',
          value: '',
          codeName: 'isMuti',
          componentName: 'value-select',
          placeholder: '是否唯一',
          span: 12,
          options: [{
            value: '0',
            label: '否'
          }, {
            value: '1',
            label: '是'
          }]
        },

        {
          label: '审核审批流程',
          value: '',
          codeName: 'auditTypeCode',
          componentName: 'el-input',
          placeholder: '请选择审核审批流程',
          type: 'text',
          maxlength: 20,
          span: 12
        },
        {
          label: '上传文书模板',
          componentName: 'jw-upload',
          span: 12,
          fileData : this.fileData
        }
      ]
    }
  },
  created () {
    this.initInfo()
  },
  mounted () {

  },
  methods: {

    initInfo () {
      console.log('修改页面标记', this.$store.state.writTypeEnumId)
      if (this.$store.state.writTypeEnumId) {
        // 有id的时候进行数据处理
        console.log(this.fileData.id);
        this.fileData.id = this.$store.state.writTypeEnumId
        info({ id: this.$store.state.writTypeEnumId })
          .then(res => {
            if (res.code === '0') {
              this.writTypeEnumInfo = res.data
            } else {
              this.$message({
                type: 'error',
                message: '获取详情失败！'
              })
            }
          })
      }
    },
    // 返回  组件的切换
    backPage () {
      this.$store.commit('setCurrWritTypeEnumComp', {
        component: 'dataDisplay'
      })
    },
    // 保存获取修改实体
    saveOrUpdate (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('保存的info', this.writTypeEnumInfo)
          // 修改
          saveOrUpdate(this.writTypeEnumInfo)
            .then(
              res => {
                if (res.code === '0') {
                  let info = '保存'
                  if (this.writTypeEnumInfo.id) {
                    info = '修改'
                  }
                  getWritTypeInfo().then(
                    res => {
                      sessionStorage.setItem('writTypeInfo', JSON.stringify(res.data))
                    },
                    err => {
                    }
                  )
                  this.$message({
                    type: 'success',
                    message: info + '成功！'
                  })
                  this.backPage()
                } else {
                  this.$message({
                    type: 'error',
                    message: info + '失败！'
                  })
                }
              }
            )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
  .addDiscretionary_content {
    background: #fff;
    margin: 8px 8px 54px 8px;
    box-sizing: border-box;
    width: calc(100% - 16px);
    padding: 16px 82px 33px;
    border-radius: 8px;
    height: 100%;
    position: relative;
    .shared_part {
      margin-top: 20px;
    }
    .detail_part {
      line-height: 40px;
      .detail {
        position: relative;
        padding: 9px 16px 30px 17px;
        margin-bottom: 9px;
        background: #eef5f9;
        &:last-child {
          margin-bottom: 0;
        }
        .el-form-item__label {
          width: 130px;
          text-align: left;
        }
        .el-row {
          display: flex;
          .el-input {
            flex-grow: 1;
          }
        }
        .delete_buttons {
          position: absolute;
          bottom: -8px;
          right: 17px;
          margin-top: 8px;
          font-size: 0;
          span {
            font-size: 14px;
            color: #0099ff;
            cursor: pointer;
            & + span {
              margin-left: 16px;
            }
            &.delete {
              color: #ff3030;
            }
          }
        }
      }
    }
    .back-button {
      position: absolute;
      left: 16px;
      top: 18px;
      color: #0099ff;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
      /deep/ .el-form-item__content {
        margin-left: 111px;
      }
      /deep/ .el-select {
        width: 100%;
      }
      &.radio /deep/ .el-form-item__content {
        margin-left: 50px;
      }
    }
    /deep/ .el-switch {
      vertical-align: middle;
    }
  }

  footer {
    height: 52px;
    text-align: center;
    background: white;
    line-height: 52px;
  }

  .rule__class{
    margin-left: 13px;
  }
  .el-form-item__error{
    display: none;
  }
  .el-textarea{
    margin-top: 10px;
  }
  .el-input-number__decrease ,.el-input-number__increase{
    line-height: 25px;
    width: 25px;
    height: 25px;
    top: 7px;
  }
</style>
