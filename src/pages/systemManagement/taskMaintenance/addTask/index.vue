<template>
  <div>
    <div class="addDiscretionary_content">
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"/> 返回
      </div>
      <section class="shared_part">
        <el-form label-position="left" label-width="90" :model="taskInfo" :rules="rules" ref="ruleForm">
          <el-row :gutter="40">
            <el-col v-for="(item, index) in formData" :span="item.span" :key="index">
              <el-form-item :label="item.label" label-width="100" :class="item.class" :prop="item.codeName">
                <component v-if="item.codeName !== 'jobName' && item.codeName !==  'groupName'"
                           :is="item.componentName"
                           v-model="taskInfo[item.codeName]"
                           :placeholder="item.placeholder"
                           :type="item.type"
                           :maxlength="item.maxlength"
                           :min="item.min"
                           :max="item.max"
                           @focus="handleDialog(item.codeName)"
                           autosize
                           :disabled="item.disabled"
                >
                </component>
                <component v-if="item.codeName === 'jobName' || item.codeName === 'groupName'"
                           :is="item.componentName"
                           v-model="taskInfo[item.codeName]"
                           :placeholder="item.placeholder"
                           :type="item.type"
                           :maxlength="item.maxlength"
                           :min="item.min"
                           :max="item.max"
                           @focus="handleDialog(item.codeName)"
                           autosize
                           :disabled="keyDisabled"
                >
                </component>
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
  import bottomBar from "@/components/bottomBar";

  import {
    addJob, updateJob
  } from '@api/systemManagement/taskMaintenance'


  export default {
    components: {
      bottomBar,
    },
    data() {
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
        taskInfo: {
          className: '',
          groupName: '',
          jobName: '',
          cronExp: '',
        },
        fileData:
          {id: ''},
        keyDisabled : false,
        // 填充的数据
        formData: [
          {
            label: 'class类型',
            value: '',
            codeName: 'className',
            componentName: 'el-input',
            placeholder: '输入class类型',
            type: 'text',
            maxlength: 100,
            span: 12,
            disabled: this.keyDisabled,
          },
          {
            label: '任务组名',
            value: '',
            codeName: 'groupName',
            componentName: 'el-input',
            placeholder: '输入任务组名',
            type: 'text',
            maxlength: 100,
            span: 12,
            disabled: this.keyDisabled,
          },
          {
            label: '任务名',
            value: '',
            codeName: 'jobName',
            componentName: 'el-input',
            placeholder: '输入任务名',
            type: 'text',
            maxlength: 100,
            span: 12,
            disabled: false,
          },

          {
            label: 'CRON表达式',
            value: '',
            codeName: 'cronExp',
            componentName: 'el-input',
            placeholder: '输入CRON表达式',
            type: 'text',
            maxlength: 100,
            span: 12,
            disabled: false,
          },

    ]
    }
    },
    created() {
      this.initInfo()
    },
    activated() {
      if (this.$store.state.jobInfo) {
        this.keyDisabled = true
      }
    },
    mounted() {
      if (this.$store.state.jobInfo) {
        this.keyDisabled = true
      }
    },
    methods: {

      initInfo() {
        // console.log('修改页面标记', this.$store.state.writTypeEnumId)
        if (this.$store.state.jobInfo) {
          this.taskInfo = this.$store.state.jobInfo
          this.keyDisabled = true
        }
      },
      // 返回  组件的切换
      backPage() {
        this.$store.commit('setCurrtaskComp', {
          component: 'dataDisplay'
        })
        this.$store.commit('setJobInfo', null);
      },
      // 保存获取修改实体
      saveOrUpdate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            if (this.$store.state.jobInfo) {
              this.taskInfo = this.$store.state.jobInfo
              updateJob(this.taskInfo)
                .then(
                  res => {
                    if (res.code === '0') {
                      let info = '保存'
                      // if (this.writTypeEnumInfo.id) {
                      //   info = '修改'
                      // }
                      // this.$message({
                      //   type: 'success',
                      //   message: info + '成功！'
                      // })
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
              // 修改
              addJob(this.taskInfo)
                .then(
                  res => {
                    if (res.code === '0') {
                      let info = '保存'
                      // if (this.writTypeEnumInfo.id) {
                      //   info = '修改'
                      // }
                      // this.$message({
                      //   type: 'success',
                      //   message: info + '成功！'
                      // })
                      this.backPage()
                    } else {
                      this.$message({
                        type: 'error',
                        message: info + '失败！'
                      })
                    }
                  }
                )
            }


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

  .rule__class {
    margin-left: 13px;
  }

  .el-form-item__error {
    display: none;
  }

  .el-textarea {
    margin-top: 10px;
  }

  .el-input-number__decrease, .el-input-number__increase {
    line-height: 25px;
    width: 25px;
    height: 25px;
    top: 7px;
  }
</style>
