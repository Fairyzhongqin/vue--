<template>
  <el-dialog
    :title="from !== 'violation' ? '选择检查内容' : '选择违法行为'"
    width="990px"
    height="570px"
    :visible.sync="showTips"
    class="select-tips-dialog"
    :before-close="close"
  >
    <el-row class="select-check-tips-row search-row">
      <el-col :span="8" class="search-col">
        {{ from !== 'violation' ? '查询内容：' : '违法行为：' }}
        <el-input v-model="searchContent" placeholder="请输入内容" clearable @keyup.native="searchTips(true)"></el-input>
      </el-col>
      <el-col :span="10" class="search-col">
        法律法规：
        <sn-select v-model="searchLaw" placeholder="请选择法律法规" data-url="/aj/sys/sysdict/list" :requertData="selectData"></sn-select>
      </el-col>
      <el-col :span="6" class="search-col">
        <el-button @click="searchTips(true)" type="primary">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-col>
    </el-row>
    <el-row class="select-check-tips-row">
      <el-divider></el-divider>
    </el-row>
    <el-row class="select-check-tips-row typeChange">
      <el-radio-group v-model="typeSelect" size="small" class="radioGroup">
        <el-radio-button label="按监管行业分类"></el-radio-button>
        <el-radio-button label="按专项检查分类"></el-radio-button>
        <el-radio-button label="按自由裁量分类"></el-radio-button>
        <el-radio-button v-if="from !== 'violation'" label="常用检查项"></el-radio-button>
        <el-radio-button v-if="from !== 'violation'" label="+自定义检查内容"></el-radio-button>
      </el-radio-group>
      <!-- 先只在违法行为处 可全选 -->
      <!--  <div class="selectCheckAllStyle">
        <el-checkbox v-model="selectCheckAll" size="small" border @change="selectStatusChange">全选</el-checkbox>
      </div>-->
    </el-row>

    <el-row class="tips-content-zone select-check-tips-row">
      <el-col :span="8" class="tips-type-tree" v-show="queryType !== '3' && needSearchType">
        <el-tree
          :data="typeTree"
          :props="defaultTypeProps"
          :expand-on-click-node="false"
          :check-on-click-node="true"
          @node-click="queryTypeTips"
          class="select-check-only"
        >
          <div
            :class="[
              {
                treeFather: data.children && data.children.length > 0 && data.parentId !== '0',
                treeSon: !data.children || data.children.length === 0,
                superFather: data.parentId == '0',
                nodeIsChecked: data.isChecked
              },
              'tree-common'
            ]"
            slot-scope="{ node, data }"
          >
            {{ data.label }}
          </div>
        </el-tree>
      </el-col>
      <el-col :span="queryType !== '3' && needSearchType ? 16 : 24" v-loading="loading" class="tips-content-detail">
        <!-- 自定义检查项的添加按钮 -->
        <div v-show="!needSearchType" class="add-my-tips-button" @click="addMyTips">+ 添加</div>
        <!-- 其他检查项 -->
        <div class="tips-content-tree-detail" v-show="needSearchType">
          <el-tree
            :data="tipsTree"
            :props="defaultTipsProps"
            :expand-on-click-node="false"
            show-checkbox
            node-key="labelID"
            ref="tipsTree"
            default-expand-all
            :default-checked-keys="defaultChecked"
            @check-change="getSelectedTips"
            name="tipsTree"
          >
            <span slot-scope="{ node, data }" class="tips-tree-node">
              <span class="tips-detail">
                {{ node.label }}
                <span v-if="node.level === 1" class="tips-button-bar">
                  <el-button type="text" @click="showDetail(data)">详情</el-button>
                  <el-button
                    type="text"
                    v-if="queryType !== '3' && data.isCustomer == 0 && from !== 'violation'"
                    style="color: #1CC19C"
                    @click="addOftenTip(data)"
                    >设为常用检查项</el-button
                  >
                  <el-button
                    type="text"
                    v-if="queryType === '3' || (data.isCustomer == 1 && from !== 'violation')"
                    style="color: #1CC19C"
                    @click="delOftenTip(data)"
                    >取消常用检查项</el-button
                  >
                </span>
              </span>
            </span>
          </el-tree>
        </div>
        <div class="tips-page-number" v-show="needSearchType">
          <el-pagination layout="prev, pager, next, jumper" :total="totalCount" :current-page="currPage" @current-change="getNewTipsTree"></el-pagination>
        </div>
        <!-- 自定义检查项 -->
        <div v-show="!needSearchType" class="add-my-tips-content">
          <div v-if="myTips.length > 0">
            <div v-for="(item, index) in myTips" :key="index" class="my-tips-new-content" ref="myTips">
              <div class="my-tips-check-type">
                <el-checkbox v-model="item.checked" @change="selectMyTips(index)" :disabled="!item.id || item.id === '' || item.isOldTips"></el-checkbox
                >检查项目类别：
                <sn-select
                  v-model="item.discretionCode"
                  :parentToChildDisabled="item.isOldTips"
                  :data-url="'/aj/sys/sysdict/list'"
                  :requertData="{ type: 'free_court' }"
                  :immediate="true"
                  @getObj="getMyTipsType($event, index)"
                  :class="item.typeIsNull ? 'type-is-null' : 'none'"
                  placeholder="请选择检查项目类别"
                ></sn-select>
              </div>
              <div class="my-tips-check-content">
                <span class="my-tips-check-content-title">检查内容：</span>
                <el-input
                  v-model="item.discretionInfo"
                  type="textarea"
                  :disabled="item.isOldTips"
                  :autosize="{ minRows: 1 }"
                  placeholder="请输入检查内容"
                  :class="item.labelIsNull ? 'label-is-null' : 'none'"
                ></el-input>
              </div>
              <div class="my-tips-check-state">
                <el-button type="text" @click="saveMyTips(index)">保存</el-button>
                <el-button type="text" :disabled="item.isOldTips" @click="delMyTips(index)">删除</el-button>
              </div>
            </div>
            <!-- 自定义检查项的分页 -->
            <div class="tips-page-number">
              <el-pagination
                @current-change="getcurrentPageDIY"
                :current-page.sync="currentPageDIY"
                :page-size="10"
                layout="prev, pager, next, jumper"
                :total="diyTipsTotal"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <span slot="footer">
      <span class="tips-selected-num">
        共选中
        <span class="count-num">{{ from !== 'violation' ? getSelectedTipsNum : defaultChecked.length }}</span
        >项
      </span>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </span>
    <el-dialog width="50%" title="详情" :visible.sync="innerVisible" append-to-body :before-close="closeDetail" class="detail-dialog">
      <discretion-detail :detail="detail"></discretion-detail>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { discretionList, listDiscByType, discretioncustomSave, discretioncustomDelete } from '@/api/inspectionScheme'
import snSelect from '@/components/snSelect'
import discretionDetail from '@/components/discretionDetail'
import { saveMyTips, delMyTips, queryMyTipsList } from '@/api/onSiteInspection/index'
import { isContained } from '@/utils/util'

export default {
  name: 'selectCheck',
  components: {
    snSelect,
    discretionDetail
  },
  props: {
    tipsCache: {
      type: Array,
      required: false,
      default: []
    },
    from: {
      // violation 来自新增立案模块
      type: String
    }
  },
  data() {
    return {
      detail: {
        lawDetail: '', //设定依据 法律规定内容
        punishmentBasis: '', //处罚依据
        unLawfulActs: '', //违法行为
        levelContent: '', //处罚档次
        discretionRangeContent: '' //裁量幅度
      }, // 某条裁量的详情
      typeSelect: '按监管行业分类', // 检查项分类默认值
      loading: true, // 加载状态
      typeLoading: true, // 检查项分类加载状态
      currPage: 1, // 当前页
      searchContent: null, // 模糊查询-查询检查内容
      searchLaw: null, // 模糊查询-法律信息
      leftTreeId: null, // 左侧检查项分类的id
      queryType: '0', // 查询检查项的类别
      tipsTree: [], // 检查项
      typeTree: [], // 检查项的分类
      // 检查项分类 el-tree的默认格式
      defaultTypeProps: {
        children: 'children',
        label: 'label'
      },
      // 检查项 el-tree的默认格式
      defaultTipsProps: {
        children: 'children',
        label: 'label',
        disabled: 'isOldTips'
      },
      showTips: true, // 打开选择选项弹窗
      totalCount: 1, // 检查项的总页数
      defaultChecked: [], // 默认选中的检查项，作回显用
      oldTipIds: [], // 之前选中的检查项ID，且不能进行对其进行操作
      oldTips: [], // 之前选中的检查项
      // 模糊查询法律公共组件传值
      selectData: {
        delFlag: '0',
        isPaging: 'false',
        limit: '10',
        name: '',
        page: '1',
        type: 'free_lawt'
      },
      needSearchType: true, // 自定义检查项控制状态
      myTips: [], // 添加的自定义检查项数组
      innerVisible: false,
      diyTipsTotal: '', //自定义检查内容的分页
      currentPageDIY: null, //自定义检查内容的当前页
      selectCheckAll: false, //全选状态
      pageArr: [], //页码数组
      checkedIdArr: [], //所有选中的检查项的数组
      measureDom: null, //吸顶的DOM元素
      offsetTop: null, //吸顶元素的offsetTop
      searchBarFixed: false //吸顶状态
    }
  },
  methods: {
    // 全选状态变化
    selectStatusChange() {
      if (this.selectCheckAll) {
        //全选
        this.$refs.tipsTree.setCheckedNodes(this.tipsTree)
      } else {
        //取消选中
        this.$nextTick(() => {
          this.$refs.tipsTree.setCheckedKeys([], true)
          this.defaultChecked = []
          this.oldTips = []
        })
      }
    },
    // 全选处理方法 不知道是什么高级东西
    batchSelect(nodes, refs, flag, seleteds) {
      if (typeof nodes != 'undefined') {
        nodes.forEach(element => {
          refs.setChecked(element, flag, true)
        })
      }
      if (typeof seleteds != 'undefined') {
        seleteds.forEach(node => {
          refs.setChecked(node, !flag, true)
        })
      }
    },

    getcurrentPageDIY(val) {
      this.currentPageDIY = val
      this.getMyTips({ page: val.toString() })
    },
    searchTips(params) {
      if (this.needSearchType) {
        this.getTips(params)
      } else {
        this.getMyTips()
      }
    },
    // 获取检查项内容列表
    getTips(params) {
      this.loading = true
      if (params && this.typeTree && this.typeTree.length > 0) {
        this.searchTypeId(null, this.typeTree)
      }
      listDiscByType({
        content: this.searchContent,
        lawId: this.searchLaw,
        page: params ? '1' : this.currPage.toString(),
        queryType: this.queryType,
        queryField: this.from !== 'violation' ? '0' : '1', //查询字段，不传默认查询检查内容 0-检查内容 1-违法行为"
        treeId: params ? '' : this.leftTreeId
      }).then(res => {
        res.data.list.forEach(item => {
          let ids = this.oldTipIds.join(',')
          if (item.children && item.children.length > 0) {
            item.children.forEach(i => {
              i.isOldTips = ids.indexOf(i.discretionRulesId) !== -1
              i.label = this.from !== 'violation' ? i.rules : i.violateRules
              i.labelID = i.discretionRulesId
            })
          }
          item.label = this.from !== 'violation' ? item.examineContent : item.unlawfulAct
          item.isOldTips = ids.indexOf(item.discretionId) !== -1
          item.labelID = item.discretionId
          let that = this
          this.$nextTick(() => {
            res.data.list.forEach(item => {
              if (item.children && item.children.length > 0) {
                item.children.forEach(i => {
                  that.pageArr.push(i.discretionRulesId)
                })
              } else {
                that.pageArr.push(item.discretionId)
              }
            })
          })
        })
        this.totalCount = res.data.totalCount
        this.tipsTree = res.data.list
        // 存当前页码的id 第一次的时候 不存

        if (isContained(this.defaultChecked, this.pageArr) === true) {
          this.selectCheckAll = true
        } else {
          this.selectCheckAll = false
        }

        this.loading = false
      })
    },
    // 获取自定义检查项
    getMyTips(data) {
      let params = {}
      params.searchContent = this.searchContent
      params.page = data ? data.page : ''
      queryMyTipsList(params).then(res => {
        let ids = this.defaultChecked && this.defaultChecked.length > 0 ? this.defaultChecked.join(',') : ''
        res.data.list.forEach(item => {
          if (ids.indexOf(item.id) !== -1) {
            item.checked = true
            this.oldTips.some(i => {
              item.isOldTips = i.isOldTips
              return i.id === item.id
            })
          }
        })
        this.myTips = res.data.list
        this.diyTipsTotal = res.data.totalCount
      })
    },
    // 查看检查项详情
    showDetail(val) {
      this.innerVisible = true
      this.detail.unLawfulActs = val.unlawfulAct !== null && val.unlawfulAct !== '' ? val.unlawfulAct : '无'
      this.detail.lawDetail = val.lawProvisionsContent !== null && val.lawProvisionsContent !== '' ? val.lawProvisionsContent : '【法律规定】 无'
      this.detail.punishmentBasis = val.penalizeBasisContent !== null && val.penalizeBasisContent !== '' ? val.penalizeBasisContent : '【处罚依据】 无'
      this.detail.levelContent = val.levelContent !== null && val.levelContent !== '' ? val.levelContent : '无'
      this.detail.discretionRangeContent = val.discretionRangeContent !== null && val.discretionRangeContent !== '' ? val.discretionRangeContent : '无'
    },
    closeDetail() {
      this.innerVisible = false
      this.lawDetail = null
    },
    // 检查项列表换页
    getNewTipsTree(val) {
      this.pageArr = []
      // 所有的检查项的id的集合

      // 当页码数组里的id在选中的检查项的id的时候  全部都在的时候  那么全选状态就为true

      this.currPage = val
      let item = document.querySelector('.tips-content-tree-detail')
      item.scrollTop = 0
      this.getTips()
    },
    // 确定按钮事件
    sure() {
      this.$emit('getSelectedTips', this.oldTips)
    },
    // 取消按钮事件
    close() {
      this.$emit('close')
    },
    // 处理以前选中的选项，作回显用;不同的模块对检查项有特殊要求，都可以在此操作
    setSelectedTips(val = []) {
      this.defaultChecked =
        val && val.length > 0
          ? val.reduce((total, item) => {
              let list = []
              if (item.children && item.children.length > 0) {
                let middle = item.children
                list = middle.reduce((t, i) => {
                  let id = i.discretionRulesId || i.discRulesId
                  if (i.isOldTips) {
                    this.oldTipIds.push(id)
                  }
                  t.push(id)
                  return t
                }, [])
              } else {
                let id = item.discretionId || item.discId
                if (item.isOldTips && id) {
                  // 自定义违法行为没有 id
                  this.oldTipIds.push(id)
                }
                if (id) {
                  total.push(id)
                }
              }
              total = [...total, ...list]
              // total 为已选检查项ids 数组
              return total
            }, [])
          : []
      this.setAllStatus()
    },
    setAllStatus() {
      if (isContained(this.defaultChecked, this.pageArr) === false) {
        this.selectCheckAll = false
      } else {
        this.selectCheckAll = true
      }
    },
    // 处理选中/取消选中的检查项。
    getSelectedTips(obj, isChecked, children) {
      let tabName = ''
      let tabCode = ''
      switch (this.typeSelect) {
        case '按监管行业分类':
          tabName = '监管行业分类'
          break
        case '按专项检查分类':
          tabName = '专项检查分类'
          break
        case '按自由裁量分类':
          tabName = '自由裁量分类'
          break
      }
      // true
      if (isChecked) {
        if (obj.discretionId && obj.discretionRulesId) { // 是子项
          // 添加自定义选中状态
          obj.checkedAlready = true
          let index = this.findFather(obj.discretionId)
          if (!this.oldTips[index].discretionTypeName) { // 模板里的检查项已存在
            switch (this.typeSelect) {
              case '按监管行业分类':
                this.oldTips[index].discretionTypeName = this.oldTips[index].tradeName
                break
              case '按专项检查分类':
                this.oldTips[index].discretionTypeName = this.oldTips[index].specialName
                break
              case '按自由裁量分类':
                this.oldTips[index].discretionTypeName = this.oldTips[index].discretionTypeName
                break
            }
          }


          // 名称拼接 显示在前端
          let originalName = this.oldTips[index].discretionTypeName
          if (this.oldTips[index].discretionTypeName.includes('-')) {
            originalName = this.oldTips[index].discretionTypeName.split('-')[1]
          } else {
            this.oldTips[index].discretionTypeName = tabName + '-' + originalName
          }
          let code = this.oldTips[index].discretionTypeCode
          // 存code 给后台
          switch (this.typeSelect) {
            case '按监管行业分类':
              this.oldTips[index].discretionTypeCode = code ? code : this.oldTips[index].tradeCode
              break
            case '按专项检查分类':
              this.oldTips[index].discretionTypeCode = code ? code : this.oldTips[index].specialCode
              break
            case '按自由裁量分类':
              this.oldTips[index].discretionTypeCode = this.oldTips[index].discretionTypeCode
              break
          }

          // push进去数据
          this.oldTips[index].children.push(obj)
        } else if (obj.discretionId && !obj.discretionRulesId) { // 不是子项
          let isHave = this.oldTips.some(item => {
            return item.discretionId === obj.discretionId
          })
          if (!isHave) {
            // 没有子项
            if (!obj.children) {
              // 添加自定义选中状态
              obj.checkedAlready = true
              // 显示name
              switch (this.typeSelect) {
                case '按监管行业分类':
                  obj.discretionTypeName = obj.tradeName
                  break
                case '按专项检查分类':
                  obj.discretionTypeName = obj.specialName
                  break
                case '按自由裁量分类':
                  obj.discretionTypeName = obj.discretionTypeName
                  break
              }
              // 存code 给后台
              switch (this.typeSelect) {
                case '按监管行业分类':
                  obj.discretionTypeCode = obj.tradeCode
                  break
                case '按专项检查分类':
                  obj.discretionTypeCode = obj.specialCode
                  break
                case '按自由裁量分类':
                  obj.discretionTypeCode = obj.discretionTypeCode
                  break
              }

              obj.discretionTypeName = tabName + '-' + obj.discretionTypeName
              this.oldTips.push(obj)
            }
          }
        }
        return
      }
      // false
      if (!isChecked) {
        if (obj.discretionId && obj.discretionRulesId) {
          let index = this.findFather(obj.discretionId, true)
          if (this.oldTips[index] && index !== -1 && index !== null) {
            if (this.oldTips[index].children !== null) {
              this.oldTips[index].children = this.oldTips[index].children.reduce((total, item) => {
                if (item.discretionRulesId !== obj.discretionRulesId) {
                  total.push(item)
                }
                return total
              }, [])
              if (this.oldTips[index].children.length === 0) {
                this.oldTips.splice(index, 1)
              }
            }
          }
        } else if (obj.discretionId && !obj.discretionRulesId) {
          if (!obj.children) {
            this.oldTips = this.oldTips.reduce((total, item) => {
              if (item.discretionId !== obj.discretionId) {
                total.push(item)
              }
              return total
            }, [])
          }
          if (obj.children && obj.children.length > 0) {
            let index = this.findFather(obj.discretionId, true)
            if (!children) {
              this.oldTips[index].children = this.oldTips[index].children.reduce((total, item) => {
                if (item.isOldTips) {
                  total.push(item)
                } else {
                  item.isChecked = false
                }
                return total
              }, [])
              if (this.oldTips[index].children.length == 0) {
                this.oldTips.splice(index, 1)
              }
              obj.isChecked = false
            }
          }
        }
        return
      }
    },
    // 为子项查找父项
    findFather(fatherId, state) {
      let index = -1
      let result = this.oldTips.some((item, i) => {
        index = i
        return item.discretionId === fatherId || item.discId === fatherId
      })
      if (!result && !state) {
        let arr = JSON.parse(JSON.stringify(this.tipsTree))
        arr.some((item, i) => {
          index = i
          return item.discretionId === fatherId || item.discId === fatherId
        })
        arr[index].children = []
        this.oldTips.push(arr[index])
        index = this.oldTips.length - 1
      }
      return index
    },
    // 选择检查项分类查询对应类型的检查项
    queryTypeTips(val, node) {
      this.searchTypeId(null, this.typeTree)
      let indexList = this.searchTypeId(val.labelID, this.typeTree)
      let data = null
      if (indexList) {
        indexList.forEach(item => {
          data = data ? data.children[item] : this.typeTree[item]
        })
        data.isChecked = true
      }
      this.leftTreeId = val.labelID
      this.currPage = 1
      this.getTips()
    },
    // 清空模糊搜索条件
    resetSearch() {
      this.leftTreeId = null
      this.searchContent = null
      this.searchLaw = null
      this.currPage = 1
      this.getTips()
      this.getMyTips()
    },
    // 设为常用检查项
    addOftenTip(val) {
      let ruleIds =
        val.hasBussinessRule === '1'
          ? val.children.reduce((t, i) => {
              t += i.discretionRulesId + ','
              return t
            }, '')
          : null
      ruleIds = ruleIds ? ruleIds.slice(0, ruleIds.length - 1) : null
      let ruleNum = val.hasBussinessRule === '1' ? val.children.length.toString() : null
      let data = {
        discretionId: val.discretionId,
        hasBussinessRule: val.hasBussinessRule,
        ruleIds,
        ruleNum
      }
      discretioncustomSave(data).then(
        res => {
          this.getTips()
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        },
        () => {
          this.$message({
            message: '设置失败',
            type: 'error'
          })
        }
      )
    },
    // 取消常用检查项
    delOftenTip(val) {
      discretioncustomDelete({
        discretionCustomId: val.discretionId
      }).then(
        res => {
          this.resetSearch()
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        },
        () => {
          this.$message({
            message: '设置失败',
            type: 'error'
          })
        }
      )
    },
    // 新增自定义检查项
    addMyTips() {
      this.myTips.push({
        discretionCode: null, // 检查类型id
        discretionName: null, // 检查类型name
        discretionInfo: null, // 检查内容
        id: null
      })
    },
    // 设置新增检查项的检查类型
    getMyTipsType(val, index) {
      this.myTips[index].discretionCode = val.value
      this.myTips[index].discretionName = val.label
    },
    // 保存/修改新增的自定义检查项
    saveMyTips(index) {
      let item = this.myTips[index]
      item.typeIsNull = item.discretionCode && item.discretionCode !== '' ? false : true
      item.labelIsNull = item.discretionInfo && item.discretionInfo !== '' ? false : true
      if (!item.typeIsNull && !item.labelIsNull) {
        saveMyTips({
          id: item.id,
          discretionCode: item.discretionCode,
          discretionInfo: item.discretionInfo
        }).then(res => {
          item.id = res.data
          // 修改自定义项后，oldTips也要同步修改
          this.uptMyTipsChange(item)
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
      } else {
        this.$message({
          message: '保存内容不能为空',
          type: 'error'
        })
      }
    },
    // 修改自定义项后修改oldTips
    uptMyTipsChange(item) {
      this.oldTips.forEach(t => {
        if (t.discretionId === item.id && item.checked) {
          t.label = item.discretionInfo
          t.checkContent = item.discretionInfo
        }
      })
    },
    // 删除新增的自定义检查项
    delMyTips(index) {
      let item = this.myTips[index]
      if (item.id && item.id !== '') {
        delMyTips({
          id: item.id
        }).then(
          () => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.myTips.splice(index, 1)
          },
          () => {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        )
      } else {
        this.myTips.splice(index, 1)
      }
    },
    // 选择自定义检查项
    selectMyTips(index) {
      let item = this.myTips[index]
      if (item.checked) {
        let obj = {
          discretionId: item.id, // 检查内容id
          discretionTypeCode: item.discretionCode, // 检查类型id
          unlawfulAct: '', // 否定描述
          confirmRules: '', // 肯定描述
          label: item.discretionInfo, // 检查内容
          checkContent: item.discretionInfo, // 检查内容
          discretionTypeName: item.discretionName //檢查項目類別名字
        }
        this.oldTips.push(obj)
      } else {
        let num = -1
        this.oldTips.some((i, index) => {
          num = index
          return i.discretionId === item.id
        })
        this.oldTips.splice(num, 1)
      }
    },
    searchTypeId(id, arr) {
      let indexArr = []
      let tempIndex = null
      let result = arr.some((item, index) => {
        item.isChecked = false
        tempIndex = index
        if (item.children && item.children.length > 0) {
          let tempResult = this.searchTypeId(id, item.children)
          if (tempResult) {
            indexArr = [...tempResult]
            return true
          } else {
            return false
          }
        } else {
          return item.labelID === id
        }
      })
      if (result) {
        indexArr.unshift(tempIndex)
        return indexArr
      } else {
        return null
      }
    },
    // 吸顶
    handleScroll() {
      // 得到页面滚动的距离
      let scrollTop = this.measureDom.scrollTop
      // 判断页面滚动的距离是否大于吸顶元素的位置
      this.searchBarFixed = scrollTop > this.offsetTop ? true : false
    }
  },
  watch: {
    // 查询对应的监管行业内的检查项信息
    typeSelect: {
      handler: function(val, oldVal) {
        this.currPage = 1
        let dataList = {}
        this.needSearchType = true
        switch (val) {
          case '按监管行业分类':
            this.queryType = '0'
            dataList.type = 'discretion_class'
            break
          case '按专项检查分类':
            this.queryType = '1'
            dataList.type = 'special_class'
            break
          case '按自由裁量分类':
            this.queryType = '2'
            dataList.type = 'free_court'
            break
          case '常用检查项':
            this.queryType = '3'
            break
          case '+自定义检查内容':
            this.needSearchType = false
            break
        }
        if (this.queryType !== '3' && this.needSearchType) {
          this.typeLoading = true
          discretionList(dataList).then(res => {
            this.typeLoading = false
            const newTeam = function(data, parentId) {
              const itemArr = []
              for (let i = 0; i < data.length; i++) {
                const node = data[i]
                if (node.parentId === parentId) {
                  const newNode = {}
                  newNode.labelID = node.code
                  newNode.label = node.value
                  newNode.isChecked = false
                  newNode.parentId = node.parentId
                  newNode.children = newTeam(data, node.code)
                  itemArr.push(newNode)
                }
              }
              return itemArr
            }
            this.typeTree = newTeam(res.page.list, '0') // json数据递归成树结构
          })
        }
        if (this.needSearchType) {
          this.currPage = 1
          this.leftTreeId = ''
          this.getTips()
          this.getMyTips()
        }
        if (!this.needSearchType) {
          this.getMyTips()
        }
      },
      immediate: true
    },
    oldTips: {
      handler: function(val, oldVal) {
        this.setSelectedTips(val)
      },
      deep: true
    }
    // 该watch暂时不需要
    // tipsCache: {
    //   handler: function(val, oldVal) {
    //     console.log("hello world this is a change");
    //     this.setSelectedTips(val);
    //   },
    //   deep: true
    // }
  },
  computed: {
    // 查询共选中了多少项
    getSelectedTipsNum: function() {
      let num = 0
      this.oldTips.forEach(item => {
        if (item.children && item.children.length > 0) {
          num += item.children.length
        } else {
          if (item.isManual != '0') {
            num += 1
          }
        }
      })
      return num
    }
  },
  created() {
    this.setSelectedTips(this.tipsCache)
    this.oldTips = this.tipsCache && this.tipsCache.length > 0 ? JSON.parse(JSON.stringify(this.tipsCache)) : []
  },
  mounted() {
    this.$nextTick(() => {
      this.measureDom = document.querySelector('.add-my-tips-content')
      this.measureDom.addEventListener('scroll', this.handleScroll)
      this.offsetTop = document.querySelector('.add-my-tips-content').offsetTop
    })
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="less" scoped>
pre {
  text-indent: -24px;
  display: block;
  font-family: -moz-fixed;
  white-space: pre;
  margin: 1em 0;
  white-space: pre-wrap; /*css-3*/
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/
  white-space: -pre-wrap; /*Opera4-6*/
  white-space: -o-pre-wrap; /*Opera7*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
  margin: 0;
}

.select-tips-dialog {
  /deep/ .el-dialog {
    height: 575px;
    margin-top: 7vh !important;

    .el-dialog__header {
      padding: 10px 10px 10px;
    }
  }
  // 分页 jump
  .el-pagination__editor.el-input .el-input__inner {
    height: 24px;
  }

  .select-check-tips-row {
    padding: 0 10px;
  }
  /* .typeChange {
    display: flex;
  } */

  /deep/ .search-row {
    margin-top: 8px;

    .search-col {
      .el-select {
        width: 80%;

        .el-input {
          width: 100%;
        }
      }

      .el-input {
        width: 65%;
      }

      &:last-child {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  /deep/ .radioGroup {
    margin-bottom: 5px;

    .el-radio-button__inner {
      border: 1px solid #0099ff;
      color: #0099ff;
      border-right: none;
    }

    .el-radio-button {
      &:last-child {
        .el-radio-button__inner {
          border-right: 1px solid #0099ff;
        }
      }
    }

    .is-active {
      .el-radio-button__inner {
        color: #fff;
      }
    }
  }

  .tips-content-zone {
    height: 400px;

    /deep/ .el-tree {
      width: 100%;
      height: 100%;

      .el-tree__empty-block .el-tree__empty-text {
        font-size: 18px;
      }
    }

    .tips-content-detail {
      height: 100%;
      padding-right: 5px;

      .tips-content-tree-detail {
        height: 370px;
        overflow: auto;

        .tips-tree-node {
          white-space: normal;
          font-size: 15px;
          font-weight: bold;
          padding-left: 45px;
          width: 100%;

          .tips-detail {
            display: inline-block;
            padding-top: 4px;
            width: 100%;

            .tips-button-bar {
              float: right;

              .el-button {
                padding: 0;
                height: 20px;
              }
            }
          }
        }

        /deep/ .el-tree-node {
          .el-tree-node__content {
            height: auto;
            position: relative;
            padding: 8px 0;

            .el-checkbox {
              position: absolute;
              left: 25px;
              top: 13px;

              .el-checkbox__inner {
                border: 1px solid #828282;
              }
            }

            .is-disabled {
              .is-checked {
                .el-checkbox__inner {
                  background-color: #409eff;
                  border-color: #409eff;
                }
              }
            }

            .el-tree-node__expand-icon {
              position: absolute;
              top: 15px;
              left: 4px;
              padding: 0;
              font-size: 16px;
            }
          }

          .el-tree-node__children {
            /deep/ .el-checkbox {
              position: absolute;
              left: 45px;
              top: 10px;
            }

            /deep/ .tips-detail {
              padding: 0;
            }
          }
        }
      }

      .tips-page-number {
        float: right;
        &::after {
          content: '';
          clear: both;
          height: 0;
          visibility: hidden;
          overflow: hidden;
        }
      }
    }

    .tips-type-tree {
      background: #eef5f9;
      height: 100%;
      overflow: auto;
    }

    // 自定义项添加按钮
    .add-my-tips-button {
      width: 100%;
      height: 32px;
      line-height: 32px;
      background-color: #d5eefd;
      color: #09f;
      text-align: center;
      cursor: pointer;
      &:hover {
        box-shadow: 4px 4px 10px #d5eefd;
        transition: all 0.2s;
      }
    }
    .add-my-tips-content {
      height: calc(100% - 42px);
      overflow: auto;
      margin-top: 10px;

      /deep/ .my-tips-new-content {
        margin-top: 10px;

        .my-tips-check-type {
          padding-left: 10px;
          margin-bottom: 5px;

          .el-checkbox {
            margin-right: 5px;

            /deep/ .is-checked .el-checkbox__inner {
              background-color: #409eff !important;
              border-color: #409eff !important;
            }
          }

          .el-select {
            width: 300px;
            /deep/ .el-input.is-disabled .el-input__inner {
              height: 30px !important;
            }
          }

          .type-is-null {
            .el-input .el-input__inner {
              border-color: #f56c6c;
            }
          }
        }

        .my-tips-check-content {
          position: relative;

          .my-tips-check-content-title {
            position: absolute;
            left: 29px;
            top: 5px;
          }

          .el-textarea {
            width: 86%;
            padding-left: 130px;
          }

          .label-is-null {
            .el-textarea__inner {
              border-color: #f56c6c;
            }
          }
        }

        .my-tips-check-state {
          display: flex;
          justify-content: flex-end;

          .el-button--text {
            &:last-child {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }

  .tips-selected-num {
    display: inline-block;
    margin-right: 10px;

    .count-num {
      color: #409eff;
      padding: 0 5px;
    }
  }
}

.detail-dialog {
  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 15px;
    }
  }
}

.select-check-only {
  /deep/ .el-tree-node {
    position: relative;
  }
}
</style>
