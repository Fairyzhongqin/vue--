<template>
  <div>
    <div class="template-container">
      <div class="create-bar">
        <!--输入框 begin-->
        <div class="bar-left">
          <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
        </div>
        <div class="bar-middle">
          <div class="template-name">
            <span>模板名称：</span>
            <el-input v-model="tempInfo.templateName" :disabled="isDetail" placeholder="请输入模板名称"></el-input>
          </div>
          <div class="add-is" v-if="!nodeStatus && !isDetail">
            <span @click.prevent="dialogOpen()">+ 选择检查内容</span>
            <el-divider direction="vertical"></el-divider>
            <span @click="newAdd">+新增检查项</span>
          </div>
          <div class="add-is-has" v-else>
            <span class="left">检查内容({{ checkedNodes.length }})</span>
            <span class="right" v-if="!isDetail">
              <i @click.prevent="dialogOpen()">+ 选择检查内容</i>
              <el-divider direction="vertical"></el-divider>
              <i @click.prevent="newAdd">+ 新增检查项</i>
            </span>
          </div>
          <!-- content -->
          <div class="check-list-empty" v-if="!nodeStatus">
            <div class="empty-content">
              <div class="empty-text">暂无检查内容</div>
            </div>
          </div>
          <div v-if="nodeStatus" style="padding-bottom:60px">
            <check-node
              v-for="(nodeData, index) in checkList"
              :nodeData="nodeData"
              @editNodeHandle="editNodeHandle"
              @delNodeHandle="delNodeHandle"
              :indexShow="index"
              :key="index"
              :view="isDetail"
            ></check-node>
          </div>
        </div>
      </div>
    </div>
    <select-check v-if="showDialog" :tipsCache="checkList" @close="showDialog = false" @getSelectedTips="getSelectedTips"></select-check>

    <bottom-bar>
      <el-button size="medium" @click="back">取消</el-button>
      <el-button type="primary" size="medium" v-if="!isDetail" :loading="saveLoadStatus" @click="saveChange">保存</el-button>
    </bottom-bar>
  </div>
</template>

<script>
import { submitReview, saveBatch, saveUpdate, info, getEnterpriseInfo, delCheckItem } from '@/api/inspectionScheme'
import { getNowFormatDate } from '@/utils/util'
import { createWrit, updateWrit } from '@/api/fileRelated'
import { saveTemp, getTempDetail, delProb } from '@/api/inspectionTemplate'
import bottomBar from '@/components/bottomBar'
import addCheck from '@/pages/inspectionScheme/components/addCheck'
import checkNode from '@/pages/inspectionScheme/components/checkNode'
import { Throttle, debounce, handleDateRef, dateFormat } from '@/utils/util.js'
import selectCheck from '@/pages/onSiteInspection/newInspection/component/selectCheck'
export default {
  name: 'templateDetail',
  props: {
    param: {
      type: String
    }
  },
  components: {
    bottomBar,
    addCheck,
    checkNode,
    selectCheck
  },
  data() {
    return {
      isDetail: true, // 当前是否是查看详情
      tempInfo: {
        templateName: '', // 模板名称
        id: '',
        createUser: '',
        createTime: '',
        updateUser: '',
        updateTime: null,
        templateId: '',
        templateName: '',
        templateType: '',
        userId: '',
        createUserName: null
      },
      checkContent: [],
      dialogVisible: false, // 检查内容弹出框状态
      checkNum: 0,
      checkList: [], // 选择的检查内容
      checkListCache: [], // 选择的检查内容缓存 点击确定后移送到checkList
      customCheckListCache: [], // 自定义检查内容的缓存
      customCheck: [], // 自定义检查内容 弹出框回显用
      saveLoadStatus: false, // 保存按钮加载状态
      showDialog: false,
      positionStatus: false //新增和选择检查项时自动跳转
    }
  },
  created() {
    this.newAdd = debounce(this.newAdd, 200, true)
  },
  mounted() {
    let clientWidth = document.documentElement.clientWidth
    let tempInfo = this.$store.state.tempInfo
    this.isDetail = tempInfo.isDetail
    if (tempInfo.id) {
      this.getTempDetail(tempInfo.id)
    }
  },
  computed: {
    checkedNodes() {
      const arr = []
      this.checkList.map(res => {
        arr.push(res)
      })
      return arr
    },
    checkedNum() {
      return _.filter(this.checkListCache, function(o) {
        if (!o.hasBussinessRule) {
          return true
        } else if (o.hasBussinessRule === '0') {
          return true
        }
      })
    },
    nodeStatus() {
      if (this.checkList && this.checkList.length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    // 获取模板详情
    getTempDetail(id) {
      getTempDetail({ id: id })
        .then(res => {
          this.tempInfo = res.data
          this.checkList = res.data.probList
        })
        .catch(err => console.info(err))
    },
    newAdd: function() {
      // 代表定位为true
      this.positionStatus = true
      this.checkList.push({
        discretionId: new Date().getTime().toString(), // 检查内容id
        discretionTypeCode: null, // 检查类型id
        unlawfulAct: '', // 否定描述
        confirmRules: '', // 肯定描述
        label: '', // 检查内容
        discretionTypeName: null,
        isMyTips: true,
        isManual: '0'
      })
    },
    back() {
      this.$store.commit('switchInspTemplate', 'dataTable')
    },
    getSelectedTips(val) {
      this.positionStatus = true
      this.checkList = val
      this.showDialog = false
    },
    detailNodeClick(val) {
      const node = val.node
      const status = val.status
      const pstatus = val.pstatus
      const data = this.checkListCache
      const existIndex = _.findIndex(data, ['labelID', node.labelID]) // 查询是否已有该记录
      if (!(existIndex === -1)) {
        if (!status && !pstatus) {
          // 有记录 传入取消选中 则删除
          _.pullAt(data, existIndex)
          data.push('')
          data.pop()
        }
      } else {
        if (status || pstatus) {
          // 无记录 传入选中 则添加
          data.push(node)
        }
      }
    },
    updateCustomListCache(val) {
      // 自定义检查项
      this.customCheckListCache = val
      val.map(item => {
        let existIndex = _.findIndex(this.checkListCache, ['labelID', item.labelID])
        if (item.checked === true && existIndex < 0) {
          this.checkListCache.push(item)
        }
      })
    },
    comfirmCheckList() {
      // 弹窗 确定
      const cache = JSON.parse(JSON.stringify(this.checkListCache))
      cache.map(res => {
        // 清空子节点 复制一份用于还原
        if (res.hasBussinessRule) {
          res.oldChildren = res.children
          res.children = []
        }
      })
      cache.map(res => {
        // 重新添加子节点
        if (!res.hasBussinessRule) {
          const parent = _.find(cache, {
            discretionId: res.discretionId,
            hasBussinessRule: '1'
          })
          parent.children.push(res)
        }
      })
      this.checkList = cache
      this.dialogClose()
    },
    editNodeHandle(val, content) {
      // 修改节点
      const list = JSON.parse(JSON.stringify(this.checkList))
      let i = []
      list.some((item, index) => {
        if (item.children && item.children.length > 0) {
          let j = null
          let result = item.children.some((son, a) => {
            if ((val.discRulesId && son.discRulesId === val.discRulesId) || (val.labelID && son.labelID === val.labelID)) {
              j = a
              return true
            }
          })
          if (result) {
            i = [index, j]
          }
        } else {
          if ((val.discId && item.discId === val.discId) || (val.labelID && item.labelID === val.labelID)) {
            i.push(index)
          }
        }
      })
      if (i.length > 1) {
        list[i[0]].children[i[1]].label = content
        list[i[0]].children[i[1]].checkItem = content
        list[i[0]].children[i[1]].checkContent = content
      } else {
        list[i[0]].label = content
        list[i[0]].checkContent = content
      }
      this.checkList = list
    },
    // 删除检查项
    delNode(obj) {
      if (obj.sonIndex !== null) {
        // 有子项删除子项的这条数据
        this.checkList[Number(obj.fatherIndex)].children.splice(Number(obj.sonIndex), 1)
        if (this.checkList[Number(obj.fatherIndex)].children.length === 0) {
          // 如果子项数据等于0 了 就删除父项的这条数据  需要调用后台接口删除父项
          delProb({ id: this.checkList[Number(obj.fatherIndex)].id })
            .then(res => {
              this.checkList.splice(Number(obj.fatherIndex), 1)
            })
            .catch(err => {
              throw new Error(err)
            })
        }
      } else {
        this.checkList.splice(Number(obj.fatherIndex), 1)
      }
    },
    // 删除检查项节点
    delNodeHandle(obj) {
      if (!obj.item.id) {
        this.delNode(obj)
      } else {
        delProb({ id: obj.item.id }).then(
          res => {
            this.delNode(obj)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          },
          () => {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        )
      }
    },
    dialogClose() {
      // 关闭弹窗
      this.dialogVisible = false
    },
    // 输出错误信息
    alterErrorMsg(errorMsg) {
      this.$message({
        type: 'error',
        message: errorMsg,
        duration: 500
      })
    },
    // 保存修改
    async saveChange() {
      const probList = this.checkList.map(res => {
        const children = []
        if (res.children && res.children.length > 0) {
          res.children.map(r => {
            children.push({
              id: r.id ? r.id : '',
              discRulesId: r.discRulesId ? r.discRulesId : r.discretionRulesId, // 自由裁量细则id
              checkContent: r.checkContent ? r.checkContent : r.label, // 检查内容
              negativeDesc: r.negativeDesc ? r.negativeDesc : r.violateRules, // 检查描述
              checkItem: r.checkItem ? r.checkItem : r.label,
              confirmRules: r.confirmRules
            })
          })
        }
        return {
          id: res.id ? res.id : '',
          discId: res.discId ? res.discId : res.discretionId, // 自由裁量id
          checkContent: res.checkContent ? res.checkContent : res.label, // 检查内容
          discretionTypeCode: res.discretionTypeCode ? res.discretionTypeCode : res.discretionType, // 自由裁量分类code
          negativeDesc: res.negativeDesc ? res.negativeDesc : res.unlawfulAct, // 检查描述
          confirmRules: res.confirmRules,
          isManual: res.isManual ? res.isManual : '1',
          children
        }
      })
      this.tempInfo.probList = probList
      await saveTemp(this.tempInfo).then(
        res => {
          if (res.code === '0') {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.saveLoadStatus = false
            this.getTempDetail(res.data)
          }
        },
        err => {
          this.saveLoadStatus = false
          this.$message({
            message: '保存失败',
            type: 'error'
          })
        }
      )
    },
    // 打开弹框
    dialogOpen() {
      this.showDialog = true
    }
  },
  watch: {
    checkList: {
      handler: function(val, oldVal) {
        console.info('checkList', val)
        if (this.positionStatus === true) {
          this.$nextTick(() => {
            let checkListContainer = document.querySelector('.main-container')
            checkListContainer.scrollTop = checkListContainer.scrollHeight
            this.positionStatus = false
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.template-container {
  padding: 8px;
  color: #333333;
  .create-bar {
    min-height: 300px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(221, 221, 221, 1);
    box-shadow: 0px 2px 4px 0px rgba(220, 229, 230, 1);
    padding: 9px 16px;
    display: flex;
    flex-direction: row;
    .bar-left {
      width: 5%;
      /deep/ .el-button {
        height: 24px;
        padding: 0;
      }
    }
    .bar-middle {
      width: 93%;
      .bar-title {
        font-size: 18px;
      }
      .template-name {
        display: flex;
        width: 40%;
        margin-top: 20px;
        span {
          flex-basis: 80px;
          flex-shrink: 0;
          line-height: 30px;
          font-size: 15px;
        }
      }

      @media screen and (max-width: 1366px) {
        .comNameWrap {
          width: 62%;
        }
      }
      @media screen and (min-width: 1367px) and (max-width: 1544px) {
        .comNameWrap {
          width: 62.5%;
        }
      }
      @media screen and (min-width: 1545px) and (max-width: 1732px) {
        .comNameWrap {
          width: 63%;
        }
      }
      @media screen and (min-width: 1733px) and (max-width: 1920px) {
        .comNameWrap {
          width: 63.3%;
        }
      }

      .add-is {
        height: 46px;
        width: 100%;
        line-height: 46px;
        margin-top: 20px;
        text-align: center;
        color: #0099ff;
        background-color: #eef5f9;
        cursor: pointer;
        .el-divider--vertical {
          height: 2em;
          margin: 0 12px;
        }
      }
      .add-is-has {
        height: 46px;
        width: 100%;
        line-height: 46px;
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #0099ff;
        background-color: #eef5f9;
        cursor: pointer;
        span {
          margin: 0 15px;
        }
        .left {
          color: #999999;
        }
        .right {
          i {
            font-style: normal;
          }
        }
        .el-divider--vertical {
          height: 2em;
          margin: 0 12px;
        }
      }
      .check-list-empty {
        min-height: 260px;
        height: 42vh;
        width: 100%;
        background-image: url('~@/assets/imgs/list_empty.png');
        background-repeat: no-repeat;
        background-position: 50% 40%;
        position: relative;
        .empty-text {
          width: 100%;
          font-size: 14px;
          color: #999999;
          text-align: center;
          position: absolute;
          top: calc(40% + 67px);
        }
      }
    }
  }
  /deep/ .el-select-dropdown__wrap {
    max-height: auto !important;
  }
}
</style>
