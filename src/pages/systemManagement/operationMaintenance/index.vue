<template>
  <div class="body">
    <div class="body-content">
      <div class="upload-buttons">
        <el-radio-group v-model="deptRadio">
          <el-radio :label="0" >不删除元数据</el-radio>
          <el-radio :label="1">删除元数据</el-radio>
        </el-radio-group>
        <el-upload
          :action="deptExportUrl"
          :headers="header"
          :on-success="successUpload"
          :on-error="error"
          name="file"
          :multiple="false"
          :show-file-list="false"
          :data="{ isDelete:deptRadio }"
          :before-upload="checkFile"
          accept=".xlsx"
        >
          <el-button size="small" type="primary">部门导入</el-button>
        </el-upload>
      </div>
      <div class="upload-buttons">
        <el-radio-group v-model="userRadio">
          <el-radio :label="0">不删除元数据</el-radio>
          <el-radio :label="1">删除元数据</el-radio>
        </el-radio-group>
        <el-upload
          :action="userExportUrl"
          :headers="header"
          :on-success="successUpload"
          :on-error="error"
          name="file"
          :multiple="false"
          :show-file-list="false"
          :data="{ isDelete:userRadio }"
          :before-upload="checkFile"
          accept=".xlsx"
        >
          <el-button size="small" type="primary">人员导入</el-button>
        </el-upload>
      </div>
      <div class="upload-buttons">
        <el-upload
          :action="jsonExportUrl"
          :headers="header"
          :on-success="successUpload"
          :on-error="error"
          name="file"
          :multiple="false"
          :show-file-list="false"
          :before-upload="checkJsonFile"
          accept=".json"
        >
          <el-button size="small" type="primary">假期json导入</el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapState} from 'vuex'
    import baseUrl from '@/utils/webIp'

    export default {
        name: 'maintenanceSys',
        data() {
            return {
                deptExportUrl: `${baseUrl}/aj/af/data/exportDept`,
                userExportUrl: `${baseUrl}/aj/af/data/exportUser`,
                jsonExportUrl: `${baseUrl}/aj/af/msg/uploadDateJson`,
                header: {},
                tableData: [],
                signIds: '', // 选中人员的ids
                currPage: 1,
                totalCount: 0,
                currPageCache: 1,
                pageSize: 10,
                loading: true,
                deptRadio:0,
                userRadio:0
            }
        },
        methods: {
            checkFile(file) {
                let name = file.name.substring(file.name.lastIndexOf('.') + 1)
                let result = '.xlsx'.indexOf(name)
                if (result === -1) {
                    this.$alert('请选择正确的文件格式', null, {
                        confirmButtonText: '确定',
                        callback: action => {}
                    })
                }
                return result !== -1
            },
            checkJsonFile(file) {
                let name = file.name.substring(file.name.lastIndexOf('.') + 1)
                let result = '.json'.indexOf(name)
                if (result === -1) {
                    this.$alert('请选择正确的文件格式', null, {
                        confirmButtonText: '确定',
                        callback: action => {}
                    })
                }
                return result !== -1
            },
            // 成功上传
            successUpload(res) {
                if (res.code == 0) {
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    })
                }
            },
            error() {
                console.log('error')
                this.$alert('上传失败，请重试', null, {
                    confirmButtonText: '确定',
                    callback: action => {}
                })
            },
        },
        created() {
            let token = localStorage.getItem('token')
            this.header = { Authorization: token }
        },
        computed: {
            ...mapState(['maintenanceSys'])
        }
    }
</script>

<style lang="less" scoped>
  .body {
    padding: 8px 8px 0;

    .body-content {
      background: #ffffff;
      padding: 16px 16px 0;
      border-radius: 8px;

      /deep/ .is-leaf {
        background: #e3eef6;
      }

      /deep/ .table_header th:first-child {
        .cell {
          text-align: left;
          margin-left: 8px;
        }
      }

      .upload-buttons {
        display: flex;

        .el-button {
          margin-left: 10px;
        }
      }

      .upload-status {
        color: #0099ff;

        &::before {
          content: '•';
          margin-right: 7px;
        }

        &.uploaded {
          color: #1cc09b;
        }
      }

      .pagination {
        padding: 15px 0px 20px 0px;
        text-align: right;
      }

      .check-button {
        padding: 9px 15px;
        width: 111px;
        margin-bottom: 16px;
      }

      .check-button[data-v-6d351e54] {
        /*padding: 9px 15px;*/
        width: 194px;
        /*margin-bottom: 16px;*/
      }

      td {
        button[data-v-6d351e54] {
          margin: 3px;
        }

        div[data-v-6d351e54] {
          float: left;
        }
      }

      .el-table {
        border-radius: 0;

        /deep/ .table_header {
          height: 50px;
          background: rgba(227, 238, 246, 1);
          font-size: 16px;
          font-weight: bold;
          color: #222222;

          th {
            border-right: 1px solid #e0e0e0;
          }
        }

        /deep/ .el-table__header {
          table-layout: auto;
        }

        /deep/ .el-table__body {
          width: auto !important;
        }

        /deep/ .el-button + .el-button {
          margin-left: 0;
        }

        // /deep/ .el-button {
        //   height: 28px;
        //   padding: 7px 8px;
        //   font-size: 12px;
        // }
        /deep/ .strip_row {
          background: #f4f8fa;
        }

        .status::before {
          content: '•';
          margin-right: 8px;
        }

        .green {
          color: #1cc09b;
        }

        &.red {
          color: #ff2525;
        }
      }
    }
  }

  .big-dialog {
    /deep/ .el-dialog {
      width: 800px;
      overflow: hidden;
    }
  }

  /deep/ .el-table--scrollable-x .el-table__body-wrapper {
    overflow: hidden;
  }

  .el-table__body .cell .shortBtn {
    width: 40px;
    height: 24px;
    font-size: 14px;
    padding: 7px 2px !important;
  }

  .dialog-type {
    overflow: auto;

    /deep/ .el-dialog {
      height: 600px;
      margin-top: 5vh !important;

      .el-dialog__body {
        padding-left: 10px;
        padding-right: 10px;
        height: 87%;
        overflow: auto;
        position: relative;

        .bu-table-body {
          height: 94%;
          width: 100%;
          overflow: auto;
        }

        .bu-table-page-number {
          border-top: 1px solid #e0e0e0;
          height: 5%;
          text-align: right;
          padding-top: 2px;
        }

        .save-backup-form {
          /*position: absolute;*/
          /*bottom: 0;*/
          /*left: 10px;*/
          /*z-index: 100;*/
        }
      }
    }
  }
</style>
