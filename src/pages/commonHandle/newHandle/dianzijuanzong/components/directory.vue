<template>
  <div>
    <section class="directory_table">
      <div class="table_header">
        <span>
          <el-checkbox class="dt-check-all" :indeterminate="isIndeterminate" v-model="isCheckAll" @change="checkAll">全选 </el-checkbox>
        </span>
        <span>文件名称及编号</span>
        <span>页码</span>
      </div>
      <draggable v-if="writData.length !== 0" v-model="writData" @end="initWritData">
        <tr class="table_row" :class="{ strip_row: index % 2 === 1 }" v-for="(item, index) in writData" :key="index">
          <td>
            <el-checkbox :label="item.orderNum" :key="item.orderNum" v-model="item.catalog"></el-checkbox>
          </td>
          <td>
            <span class="dt-filename-span" @click="preview(item)">{{ item.fileName }}</span>
          </td>
          <td>{{ item.endPage ? `${item.startPage}-${item.endPage}` : item.startPage }}</td>
        </tr>
      </draggable>

      <p class="jz-no-data" v-if="writData.length === 0">暂无卷宗目录数据</p>
    </section>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成卷宗目录</el-button>
    </div>
    <show-pdf
      :pdfId="direcWritId"
      v-if="showPdf"
      @updatePdf="updatePdf"
      @closePdf="closePdf"
      @finishPdf="closePdf"
      :buttonList="{
        updatePdf: true, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true
      }"
      :writName="'卷内目录'"
    ></show-pdf>
    <el-dialog :visible.sync="isPreviewVis" :before-close="closeDialog" :title="dialogTitle" :modal-append-to-body="false">
      <img :src="previewAsset" class="show-img" />
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import showPdf from '@/components/showPdf'
import { getDireMaterial, saveDirectory } from '@/api/dossier'
import { dateFormat } from '@/utils/util'
import { createWrit, updateWrit, getWritInfo } from '@api/fileRelated'
import baseUrl from '@/utils/webIp'
import { mapState } from 'vuex'

export default {
  name: 'directory',
  components: {
    draggable,
    showPdf
  },
  data() {
    return {
      isPreviewVis: false, // 是否浏览图片
      previewAsset: '', // 浏览文书图片的 url
      dialogTitle: '', // 浏览文书图片弹出框标题
      showPdf: false, // 是否展示文书浏览
      isCheckAll: false, // 是否已全选
      isIndeterminate: false, // 表示 checkbox 的不确定状态
      direcWritId: '', // 电子卷宗目录文书Id
      col: [
        {
          width: '95',
          prop: 'index',
          label: '序号'
        },
        {
          width: 'auto',
          prop: 'writNo',
          label: '文件名称及编号'
        },
        {
          width: '95',
          prop: 'pageNo',
          label: '页码'
        }
      ],
      writParams: {}, // 制作卷宗目录文书所用参数
      writData: [
        /* {
             id: "",
            createUser: null,
            createTime: null,
            penaltyId: "",
            accessoryId: "",
            fileName: "",
            pageNum: 1,
            startPage: null,
            endPage: null,
            orderNum: 1
          }*/
      ]
    }
  },
  computed: {
    ...mapState(['moduleId'])
  },
  mounted() {
    this.initDirectory()
  },
  methods: {
    // 获取目录结构表数据
    initDirectory() {
      let req = {
        penaltyId: this.moduleId
      }
      getDireMaterial(req)
        .then(res => {
          if (res.data && res.data.length > 0) {
            let writReq = {
              // 获取目录表格信息
              sourceId: req.penaltyId,
              type: 'JNML'
            }
            this.writData = res.data
            this.initWritData()
            return getWritInfo(writReq) // 获取电子卷宗目录文书信息
          }
        })
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.direcWritId = res.data[0].writId
          }
        })
        .catch(err => console.info(err))
    },
    // 计算目录页数
    initWritData(arr) {
      let writArr = Array.isArray(arr) ? arr : this.writData
      let flag = 0
      writArr = writArr.map((writ, index) => {
        writ.orderNum = index + 1
        if (writ.pageNum === 1) {
          // 只有一页
          writ.startPage = flag + 1
        } else {
          // 有多页
          writ.startPage = flag + 1
          writ.endPage = flag + writ.pageNum
        }
        if (writ.accTime.indexOf('-') < 0) {
          // 处理下时间格式
          writ.accTime = dateFormat(new Date(writ.accTime), 'yyyy-mm-dd HH:MM:ss')
        }
        flag += writ.pageNum
        return writ
      })
    },
    // 全选
    checkAll(val) {
      this.writData.forEach(w => {
        w.catalog = val
      })
      this.isIndeterminate = val ? false : true
    },
    // 生成卷宗目录
    sure() {
      this.handleWritParams()
      saveDirectory(
        // 将卷宗目录保存至库
        { penaltyId: this.moduleId },
        this.writData
      )
        .then(res => {
          if (this.direcWritId) {
            return updateWrit({ writId: this.direcWritId }, this.writParams.data)
          } else {
            return createWrit(this.writParams)
          }
        })
        .then(res => {
          this.direcWritId = res.writId
          this.showPdf = true
          this.getMessage('success', '制作成功！')
          // 重新加载目录树
          this.$emit('createDire')
        })
        .catch(err => {
          this.getMessage('error', '制作失败！')
        })
    },
    // 处理文书参数
    handleWritParams() {
      let entityArr = [],
        selectedArr = []
      selectedArr = JSON.parse(JSON.stringify(this.writData.filter(w => w.catalog)))
      this.initWritData(selectedArr) // 计算页码
      selectedArr.forEach((writ, index) => {
        let arr = [
          {
            tagName: `entity${index + 1}-col1`,
            tagContent: index + 1
          },
          {
            tagName: `entity${index + 1}-col2`,
            tagContent: writ.fileName
          },
          {
            tagName: `entity${index + 1}-col3`,
            tagContent: writ.accTime ? dateFormat(new Date(writ.accTime), 'yyyy年mm月dd日') : '暂无' // 日期
          },
          {
            tagName: `entity${index + 1}-col4`,
            tagContent: writ.endPage ? `${writ.startPage}-${writ.endPage}` : `${writ.startPage}` // 页号
          },
          {
            tagName: `entity${index + 1}-col5`,
            tagContent: writ.remarks // 备注
          }
        ]
        entityArr.push(...arr)
      })
      this.writParams = {
          companyId: this.$store.state.penalty.penaltyUndEntity.punishCompanyId, //制作文书传company_id
        contractorIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
        writType: 'JNML',
        sourceId: this.moduleId,
        data: entityArr
      }
    },
    // 浏览文书图片
    preview(img) {
      /* let token = localStorage.getItem('token')
        this.previewAsset = `${baseUrl}/aj/writ/accessory/download?accessoryId=${img.accessoryId}&token=${token}`;
        this.isPreviewVis = true;
        this.dialogTitle = img.fileName; */
    },
    // 关闭弹出框
    closeDialog() {
      this.previewAsset = ''
      this.dialogTitle = ''
      this.isPreviewVis = false
    },
    // 取消制作
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
  },
  watch: {
    writData: {
      handler: function(n, o) {
        let num = 0
        n.forEach(w => {
          if (w.catalog) {
            num++
          }
        })
        if (num !== 0 && num === n.length) {
          // 所有都选中
          this.isCheckAll = true
          this.isIndeterminate = false
        } else if (num > 0 && num < n.length) {
          // 选中一部分
          this.isIndeterminate = true
        } else {
          // 所有都未选
          this.isIndeterminate = false
          this.isCheckAll = false
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.directory_table {
  width: auto;
  max-height: 60vh;
  padding: 8px 16px;
  overflow-y: auto;
  font-size: 0;

  .table_header {
    display: flex;

    span {
      display: inline-block;
      height: 50px;
      padding-left: 16px;
      border-left: 1px solid #e0e0e0;
      background: #e3eef6;
      line-height: 50px;
      font-size: 16px;
      font-weight: 900;

      &:first-child {
        width: 95px;
        border-left: none;
      }

      &:last-child {
        width: 95px;
      }

      &:nth-child(2) {
        flex-grow: 1;
      }
    }
  }

  .table_row {
    display: flex;
    height: 38px;
    font-size: 14px;
    border-bottom: 1px solid #e0e0e0;

    td {
      padding-left: 16px;
      border-left: 1px solid #e0e0e0;
      line-height: 38px;

      &:first-child {
        width: 95px;
        border-left: none;
      }

      &:last-child {
        width: 95px;
        color: #1273eb;
      }

      &:nth-child(2) {
        flex-grow: 1;
        cursor: pointer;

        .dt-filename-span {
          text-decoration: underline;
          color: #1273eb;
        }
      }
    }

    &.strip_row {
      background: #f4f8fa;
    }
  }

  .jz-no-data {
    text-align: center;
    font-size: 16px;
    color: #999999;
  }

  /deep/ .el-checkbox__input {
    position: absolute;
    right: 0;
    width: 20px;
    height: 20px;
    margin-right: 20px;
  }

  /deep/ .el-checkbox__inner {
    width: 100%;
    height: 100%;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: rotate(45deg) scale(1.5) translate(-50%, -50%);
    top: 50%;
    left: 30%;
  }

  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }

  .dt-check-all {
    height: 100%;

    /deep/ .el-checkbox__label {
      padding-left: 0;
      line-height: 50px;
      font-size: 16px;
      font-weight: 900;
    }

    /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      top: 45%;
    }
  }
}

.el-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row-reverse;
  height: 38px;
}

.el-dialog__wrapper {
  overflow: hidden;
}

/deep/ div.el-dialog {
  margin-top: 5vh !important;
  height: 90vh;
  width: 80%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
    border: none;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(91, 108, 130, 0.1);
    border-radius: 4px;
    width: 7px;
    border: none;
    margin-right: 3px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: rgba(91, 108, 130, 0.3);
  }

  .show-img {
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
