<template>
  <div>
    <div class="create-container">
      <div class="create-bar">
        <!--输入框 begin-->
        <div class="bar-left">
          <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
        </div>
        <div class="bar-middle">
          <div v-for="(form, index) in formList" :key="index" style="margin-top:40px;">
            <el-row :gutter="20">
              <el-col class="input-bar comNameWrap" :span="16" style="display: flex;">
                <div class="input-name"><span class="required" /> 企业名称：</div>
                <div style="flex-grow: 1;">
                  <sn-dialog-select
                    :value="form.company"
                    placeholder="请选择企业"
                    :callBackValue="index"
                    :parentToChild="value"
                    ref="companyName"
                    @clickHandle="openCom"
                    @clickHandleEdit="editCom(form, 'modify')"
                  ></sn-dialog-select>
                </div>
              </el-col>
              <el-col class="input-bar inspe-time" :span="8">
                <div class="input-name-long"><span class="required" /> 计划检查时间：</div>
                <el-date-picker v-model="form.date" type="date" value-format="yyyy-MM-dd" ref="date" placeholder="请选择日期"></el-date-picker>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:8px;">
              <div>
                <el-col :span="8" class="input-bar">
                  <div class="input-name"><span class="required" /> 检查形式：</div>
                  <sn-select
                    v-model="form.checkType"
                    :data-url="'/aj/sys/sysdict/list'"
                    :requertData="{ type: 'source_examine' }"
                    :immediate="true"
                    placeholder="请选择检查形式"
                    @getText="getcheckTypeName"
                  ></sn-select>
                </el-col>
                <el-col :span="8" class="input-bar">
                  <div class="input-name"><span class="required" /> 执法部门：</div>
                  <sn-dialog-select
                    :value="form.dept.name"
                    class="dialog-input"
                    placeholder="请选择执法部门"
                    :callBackValue="index"
                    ref="companyName"
                    @clickHandle="openDept"
                  ></sn-dialog-select>
                </el-col>
              </div>

              <el-col :span="8" class="input-bar enforce-reverse">
                <sn-dialog-select
                  :value="form.person"
                  class="dialog-input"
                  placeholder="选择≥2人"
                  :callBackValue="index"
                  ref="person"
                  @clickHandle="openPeople(index)"
                ></sn-dialog-select>
                <div class="input-name"><span class="required" /> 执法人员：</div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:8px;">
              <el-col :span="17" class="input-bar examineType">
                <div class="input-name"><span class="required" /> 检查方式：</div>
                <sn-select
                  v-model="form.examineTypeCode"
                  :data-url="'/aj/sys/sysdict/list'"
                  :requertData="{ type: 'type_examine' }"
                  :immediate="true"
                  placeholder="请选择检查方式"
                  @getText="getExamineTypeName"
                ></sn-select>
              </el-col>

              <el-col :span="6" style="text-align:right;">
                <el-button type="text" style="margin-right:15px;color:#0099FF" @click="addCompany()" v-if="index + 1 === formList.length && !checkId"
                  >+新增检查企业</el-button
                >
                <el-button type="text" style="color:#FF3030;margin-right:8px" v-if="formList.length !== 1" @click="delCompany(index)">删除</el-button>
              </el-col>
            </el-row>
            <!-- 备注 单独拉一行 -->
            <el-row :gutter="20" style="margin-top:8px;">
              <el-col :span="24" class="input-bar remarkSpe">
                <span class="remarkSpeInnerSpan">&nbsp;备&#12288; &nbsp;&nbsp;注：</span>
                <el-input placeholder="请输入备注" v-model="form.remark" maxlength="120" type="textarea" :autosize="{ minRows: 1 }" clearable></el-input>
              </el-col>
            </el-row>
          </div>
          <!-- btn -->
          <div class="add-is" v-if="!nodeStatus">
            <span @click.prevent="dialogOpen()">+ 选择检查内容</span>
            <el-divider direction="vertical"></el-divider>
            <span @click="newAdd">+ 新增检查项</span>
            <el-divider v-if="!checkId" direction="vertical"></el-divider>
            <span v-if="!checkId" @click="showTemp">使用模板</span>
          </div>
          <div class="add-is-has" v-else>
            <span class="left">检查内容({{ checkedNodes.length }})</span>
            <span class="right">
              <i @click.prevent="dialogOpen()">+ 选择检查内容</i>
              <el-divider direction="vertical"></el-divider>
              <i @click.prevent="newAdd">+ 新增检查项</i>
              <el-divider v-if="!checkId" direction="vertical"></el-divider>
              <span v-if="!checkId" @click="showTemp">使用模板</span>
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
            ></check-node>
          </div>
          <!--选择企业弹窗 start-->
          <div v-if="comVisiable">
            <el-dialog title="选择企业" :visible.sync="comVisiable" width="990px" height="570px" :close-on-click-modal="false">
              <select-com :closeOrgDialog="closeCom" :selectNum="2" :comCache="comCache" @getCom="getSelectedCom"></select-com>
            </el-dialog>
          </div>
          <!--选择企业弹窗 end-->
          <el-dialog width="1200px" title="企业信息" :visible.sync="addCompDialog">
            <div class="dialog_container" v-if="addCompDialog">
              <company-form ref="compForm" :isDialog="true" :enterpriseId="currentEnterpriseId" :type="compFormType"></company-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addCompDialog = false">取 消</el-button>
              <el-button type="primary" @click="compSure">保 存</el-button>
            </span>
          </el-dialog>
          <!-- 编辑企业信息 -->
          <!--选择执法人员弹窗 start-->
          <div v-if="peopleVisiable">
            <el-dialog title="选择执法人员" :visible.sync="peopleVisiable" width="900px" height="600px" :close-on-click-modal="false">
              <select-people @getPeople="getSelectedPeople" :minNum="2" :peopleCache="peopleCache"></select-people>
            </el-dialog>
          </div>
          <!--选择执法人员弹窗 end-->

          <!--选择执法部门弹窗 start-->
          <el-dialog title="选择部门" width="640px" height="570px" :before-close="handleOrg" :visible.sync="deptVisiable">
            <select-org :closeOrgDialog="handleOrg" @getOrg="getSelectedOrg"></select-org>
          </el-dialog>
          <!--选择执法部门弹窗 end-->
          <!--选择审核人员弹窗 start-->
          <div v-if="peopleReviewVisiable">
            <el-dialog title="选择审核人员" :visible.sync="peopleReviewVisiable" width="900px" height="600px" :close-on-click-modal="false">
              <select-people @getPeople="getSelectedReviewer" :selectNum="1"></select-people>
            </el-dialog>
          </div>
          <!--选择审核人员弹窗 end-->
          <!--选择检查方案模板 start-->
          <div v-if="tempVisible">
            <el-dialog title="选择检查方案模板" class="temp-dialog" :visible.sync="tempVisible" width="990px" height="570px" :close-on-click-modal="false">
              <inspection-template :from="'scheme'" @selectTemp="selectTemp"></inspection-template>
              <div class="temp-dialog-footer">
                <el-button @click="sureTemp(false)">取消</el-button>
                <el-button type="primary" @click="sureTemp(true)">确定</el-button>
              </div>
            </el-dialog>
          </div>
          <!--选择检查方案模板 end-->
        </div>
      </div>
    </div>
    <select-check v-if="showDialog" :tipsCache="checkList" @close="showDialog = false" @getSelectedTips="getSelectedTips"></select-check>
    <!--pdf begin-->
    <show-pdf
      :pdfId="pdfId"
      v-if="pdfDialog"
      @closePdf="closePdf"
      :buttonList="writButton"
      @updatePdf="closePdf"
      @auditPdf="submitAudit"
      :writName="writName"
    ></show-pdf>
    <!--pdf end-->

    <bottom-bar>
      <el-button size="medium" @click="cancel()">取消</el-button>
      <el-button type="primary" size="medium" :loading="saveLoadStatus" @click="saveTri()">保存</el-button>
      <el-button type="primary" size="medium" v-if="formList.length === 1" :disabled="!sourceId" @click="editDoc()">生成检查方案文书</el-button>
      <el-button type="primary" size="medium" v-if="formList.length === 1" :disabled="!pdfId" :loading="submitLoadStatus" @click="peopleReviewVisiable = true"
        >提交审核</el-button
      >
    </bottom-bar>
  </div>
</template>

<script>
import { submitReview, saveBatch, saveUpdate, info, getEnterpriseInfo, delCheckItem } from '@/api/inspectionScheme'
import { getNowFormatDate } from '@/utils/util'
import { createWrit, updateWrit } from '@/api/fileRelated'
import { getTempDetail } from '@/api/inspectionTemplate'
import snSelect from '@/components/snSelect'
import bottomBar from '@/components/bottomBar'
import snDialogSelect from '@/components/snDialogSelect'
import showPdf from '@/components/showPdf/index'
import addCheck from '../components/addCheck'
import checkNode from '../components/checkNode'
import selectCom from '../../onSiteInspection/newInspection/component/selectCom'
import selectPeople from '../../onSiteInspection/newInspection/component/selectPeople'
import selectOrg from '../../onSiteInspection/newInspection/component/selectOrg'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
import inspectionTemplate from '@/pages/inspectionTemplate/dataTable'
import { Throttle, debounce, handleDateRef, dateFormat } from '@/utils/util.js'
import selectCheck from '@/pages/onSiteInspection/newInspection/component/selectCheck'
export default {
  name: '',
  props: {
    param: {
      type: String
    }
  },
  components: {
    snSelect,
    bottomBar,
    snDialogSelect,
    showPdf,
    addCheck,
    checkNode,
    selectCom,
    inspectionTemplate,
    selectPeople,
    selectOrg,
    companyForm,
    selectCheck
  },
  data() {
    return {
      currTemp:{}, // 当前选中的检查方案模板信息
      tempVisible: false, // 展示检查方案模板列表
      compFormType: '', // 选择企业弹框的类型
      currentEnterpriseId: '',
      addCompDialog: false,
      value: '检查方案',
      selectNum: 2,
      formList: [
        {
          company: {
            companyName: ''
          },
          date: '',
          checkType: '',
          checkTypeName: '',
          examineTypeCode: '',
          examineTypeName: '',
          person: '',
          personID: '',
          // 检查部门
          dept: {
            id: null,
            name: null,
            children: [],
            remark: null
          },
          remark: ''
        }
      ],
      checkId: '', // 检查方案ID
      sourceId: null, // 文书来源，关联的对象
      input: '',
      writButton: {
        closePdf: true,
        updatePdf: true,
        auditPdf: true
      },
      checkContent: [],
      comVisiable: false, // 选择企业弹框状态
      comSelectIndex: 0, // 当前选择企业的序号 （批量新增）
      peopleVisiable: false, // 选择执法人员弹框状态
      peopleReviewVisiable: false, // 选择审核人员弹框
      deptVisiable: false, // 选择执法部门弹框
      deptSelectIndex: 0, // 当前执法部门的序号 （批量新增）
      peoSelectIndex: 0, // 当前选择执法人员的序号 （批量新增）
      dialogVisible: false, // 检查内容弹出框状态
      checkNum: 0,
      checkList: [], // 选择的检查内容
      checkListCache: [], // 选择的检查内容缓存 点击确定后移送到checkList
      customCheckListCache: [], // 自定义检查内容的缓存
      customCheck: [], // 自定义检查内容 弹出框回显用
      pdfId: null,
      pdfDialog: false,
      writName: '',
      saveLoadStatus: false, // 保存按钮加载状态
      submitLoadStatus: false, // 审核按钮加载状态
      // diy
      // diyNewAddStatus: false
      showDialog: false,
      // loading: true //整个页面内容的loading
      peopleCache: [], //选择执法人员的缓存
      comCache: [], // 选择企业的缓存
      examineTypeList: [
        {
          value: '现场检查',
          label: '现场检查'
        },
        {
          value: '资料检查',
          label: '资料检查'
        },
        {
          value: '现场加资料检查',
          label: '现场加资料检查'
        }
      ],
      positionStatus: false //新增和选择检查项时自动跳转
    }
  },
  created() {
    this.checkId = this.param
    this.getPageData()
    if (this.checkId === '') {
      const tempDept = JSON.parse(localStorage.getItem('userInfo'))
      this.formList[0].dept.id = tempDept.sysDeptEntity.id
      this.formList[0].dept.name = tempDept.sysDeptEntity.name
    }
    this.saveTri = debounce(this.saveTri, 1000, true)
    this.editDoc = debounce(this.editDoc, 1000, true)
    this.newAdd = debounce(this.newAdd, 200, true)
  },
  mounted() {
    let clientWidth = document.documentElement.clientWidth
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
      // if (this.checkList) {
      //   if (this.checkedNodes.length > 0) {
      //     return true;
      //   }
      // }
      if (this.checkList && this.checkList.length > 0) {
        return true
      }
      return false
    }
  },

  methods: {
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
    // 展示模板列表
    showTemp() {
      this.tempVisible = true
    },
    // 选择某个模板
    selectTemp(row) {
      this.currTemp = row
    },
    // 模板替换数据
    sureTemp(bool) {
      if (!bool) {
        this.tempVisible = false
        return
      }
      getTempDetail({id: this.currTemp.id}).then(res => {
        if (res.code === '0') {
          this.checkList = res.data.probList
          this.checkList.forEach(res => {
            res.id = ""
            if (res.children && res.children.length > 0) {
              res.children.forEach(r => {
                r.id = ""
              })
            } 
          })
          this.tempVisible = false
        }
      }).catch(err => console.info(err))
    },
    back() {
      this.$emit('changeView', 'isList')
    },
    returnComp() {
      this.addCompDialog = false
    },
    addCompany(org) {
      // 新增检查企业
      const tempDept = JSON.parse(localStorage.getItem('userInfo'))

      this.formList.push({
        company: org ? org : {},
        date: '',
        // 检查部门
        dept: {
          id: tempDept.sysDeptEntity.id,
          name: tempDept.sysDeptEntity.name
        },
        checkType: '',
        checkTypeName: '',
        person: '',
        personID: '',
        remark: ''
      })
    },
    delCompany(val) {
      // 删除企业
      this.formList.splice(val, 1)
    },
    openCom(index) {
      // 打开企业选择框
      this.comCache = []
      this.formList.forEach(item => {
        if (item.company.companyName) {
          this.comCache.push(item.company)
        }
      })
      this.comVisiable = true
      this.comSelectIndex = index
    },
    editCom(form, type) {
      //打开编辑企业信息框
      this.compFormType = type
      if (this.compFormType === 'modify') {
        this.currentEnterpriseId = form.company.id
      } else {
        this.currentEnterpriseId = ''
      }
      this.addCompDialog = true
    },
    //编辑企业信息保存
    compSure() {
      this.$refs.compForm.saveOrUpdate()
      this.addCompDialog = false
    },
    openDept(index) {
      // 打开部门选择框
      this.deptVisiable = true
      this.deptSelectIndex = index
    },
    closeCom() {
      // 关闭企业选择框
      this.comVisiable = false
    },
    getSelectedCom(org) {
      // 获取选择的企业
      // let filterCom = this.filterCom(org)
      if (!isNaN(org.length)) {
        if (org.length === 1) {
          this.formList[this.comSelectIndex].company = org[0]
        } else {
          /* this.formList.forEach(form => {
            if (ids.indexOf(form.company.id)>=0) {
              arr.push(form)
            }
          }) */
          org.map((res, index) => {
            if (index > 0) {
              this.addCompany(org[index])
            } else {
              this.formList[this.comSelectIndex + index].company = org[index]
            }
          })
        }
      } else {
        this.formList[this.comSelectIndex].company = org
      }
    },
    /* // 将选择而来的企业与原有企业对比去重
    filterCom(org) {
      let arr = []
      let rawOrg = this.formList.map(item => {
        return item.company
      })
      arr = rawOrg.concat(org)
      arr = _.uniqWith(arr, _.isEqual)
      return arr
    }, */
    openPeople(index) {
      // 打开执法人员选择框
      let personArr = this.formList[index].person ? this.formList[index].person.split(',') : []
      let personIDArr = this.formList[index].personID ? this.formList[index].personID.split(',') : []
      this.peopleCache = personArr.reduce((total, item, itemInd) => {
        total.push({
          id: personIDArr[itemInd],
          nickName: item
        })
        return total
      }, [])
      this.peopleVisiable = true
      this.peoSelectIndex = index
    },
    getSelectedPeople(state, val) {
      // 获取选择的执法人员
      if (state) {
        const nameList = []
        const idList = []
        val.forEach(item => {
          nameList.push(item.nickName)
          idList.push(item.id)
        })
        this.formList[this.peoSelectIndex].person = nameList.join(',')
        this.formList[this.peoSelectIndex].personID = idList.join(',')
      }
      this.peopleVisiable = false
    },
    handleOrg() {
      // 打开执法部门关闭
      this.deptVisiable = false
    },
    getSelectedOrg(org) {
      // 获取检查部门
      this.formList[this.deptSelectIndex].dept = org
    },
    getSelectedReviewer(state, val) {
      // 选择审核人员
      if (state) {
        this.submit(val[0].deptId, val[0].id)
      }
      this.peopleReviewVisiable = false
    },

    getSelectedTips(val) {
      this.positionStatus = true
      this.checkList = val
      this.showDialog = false
    },

    dialogOpen() {
      this.showDialog = true
      // 打开弹窗
      // this.customCheck = [];
      // this.dialogVisible = true;
      // let data = JSON.parse(JSON.stringify(this.checkList));
      // const child = [];
      // data.map(res => {
      //   if (res.hasBussinessRule) {
      //     if (res.children.length > 0 && !res.dataType) {
      //       // 有子节点 且非自定义的检查项
      //       res.children.map(r => {
      //         child.push(r);
      //       });
      //       res.children = res.oldChildren;
      //     } else if (
      //       res.dataType === "custom" ||
      //       (!res.discId && !res.discRulesId)
      //     ) {
      //       // 自定义的检查项
      //
      //       this.customCheck.push(res);
      //     }
      //   }
      // });
      // data = data.concat(child);
      // this.checkListCache = data;
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

      /* const data = _.filter(cache, function(o) {
        // 过滤自定义检查项
        if (
          o.hasBussinessRule &&
          !o.dataType &&
          (o.discId || o.discRulesId || o.discretionId)
        ) {
          return true;
        }
      });
      // this.checkList = data.concat(this.customCheckListCache); */
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
            if (son.labelID === val.labelID) {
              j = a
              return true
            } else {
              return false
            }
          })
          if (result) {
            i = [index, j]
            return true
          }
        } else {
          if (item.discretionId === val.discretionId) {
            i.push(index)
            return true
          }
        }
      })
      if (i.length > 1) {
        list[i[0]].children[i[1]].label = content
        list[i[0]].children[i[1]].checkContent = content
      } else {
        list[i[0]].label = content
        list[i[0]].checkContent = content
      }
      this.checkList = list
    },
    // 删除检查项
    delNode(obj) {
      console.info('del', obj)
      if (obj.sonIndex !== null) {
        // 有子项删除子项的这条数据
        this.checkList[Number(obj.fatherIndex)].children.splice(Number(obj.sonIndex), 1)
        console.info('此时的checkList', this.checkList)
        if (this.checkList[Number(obj.fatherIndex)].children.length === 0) {
          // 如果子项数据等于0 了 就删除父项的这条数据  需要调用后台接口删除父项
          delCheckItem({ id: this.checkList[Number(obj.fatherIndex)].id })
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
      console.info('delNodeHandle', obj)
      if (!obj.item.id) {
        this.delNode(obj)
      } else {
        console.info('obj.item.id', obj.item.id)
        delCheckItem({ id: obj.item.id }).then(
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
    // 查询详情
    getPageData() {
      // 获取页面数据（修改、二次保存时调用）
      if (this.checkId) {
        // 如果传入检查方案编号 则为修改页
        info({
          id: this.checkId
        }).then(res => {
          // 基础数据
          getEnterpriseInfo({
            id: res.data.companyId
          }).then(res => {
            this.formList[0].company = res.data
          })
          // this.formList[0].company = { id: res.data.companyId, companyName: res.data.companyName }
          // 斜杠时间转化为专业时间格式
          this.formList[0].date = handleDateRef(res.data.examineTime)
          this.formList[0].checkType = res.data.examSocCode
          this.formList[0].checkTypeName = res.data.examSocCodeName
          this.formList[0].examineTypeCode = res.data.examineType
          this.formList[0].person = res.data.executorName
          this.formList[0].personID = res.data.executorId
          this.formList[0].remark = res.data.remark
          this.formList[0].dept.id = res.data.executorDeptId
          this.formList[0].dept.name = res.data.executorDeptName
          this.sourceId = res.data.id
          this.pdfId = res.data.writId
          // 处罚裁量list
          if (res.data.probList) {
            // 关闭loading
            // this.loading = false;
            this.checkList = res.data.probList.map(res => {
              res.discretionId = res.discId
              res.label = res.checkContent
              /* if (res.label && res.label !== "") {
                if (res.label.charAt(res.label.length - 1) != "。") {
                  res.label += "。";
                }
              } */
              if (res.discId) {
                res.labelID = res.discId
              } else {
                res.labelID = res.id
              }
              res.isOldTips = true
              res.hasBussinessRule = '0'
              if (res.children) {
                if (res.children.length > 0) {
                  res.hasBussinessRule = '1'
                  res.children.map(r => {
                    r.discretionId = r.discId
                    r.label = r.checkContent
                    r.labelID = r.discRulesId || r.discId
                    r.isOldTips = true
                  })
                }
              }
              return res
            })
          }
        })
      }
    },
    cancel() {
      // 取消
      // this.$confirm('即将放弃当前的编辑内容, 是否继续?', '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$emit('changeView', 'isList')
      // })
      this.$emit('changeView', 'isList')
    },
    // 输出错误信息
    alterErrorMsg(errorMsg) {
      this.$message({
        type: 'error',
        message: errorMsg,
        duration: 500
      })
    },
    // 验证用户数据
    validateUserData() {
      if (!this.formList || this.formList.length == 0) return
      let result = true
      this.formList.some(item => {
        if (!item.company.companyName) {
          result = false
          this.alterErrorMsg('请选择企业名称！')
          return true
        }
        if (!item.date) {
          this.alterErrorMsg('请选择计划检查时间!')
          result = false
          return true
        }
        if (!item.person) {
          this.alterErrorMsg('请选择执法人员！')
          result = false
          return true
        }
        if (!item.checkType) {
          this.alterErrorMsg('请选择检查形式！')
          result = false
          return true
        }
        if (!item.examineTypeCode) {
          this.alterErrorMsg('请选择检查方式！')
          result = false
          return true
        }
        if (!this.checkedNodes.length > 0) {
          this.alterErrorMsg('请选择检查内容！')
          this.saveLoadStatus = false
          result = false
          return true
        }
      })
      return result
    },
    saveTri() {
      this.saveLoadStatus = true
      if (this.checkId) {
        this.saveChange()
      } else {
        this.save()
      }
    },
    save() {
      if (this.validateUserData()) {
        const baseList = this.formList.map(res => {
          return {
            companyId: res.company.id,
            examineTime: res.date !== '' && res.date ? res.date.replace(/\//g, '-') + ' 00:00:00' : '',
            examSocCode: res.checkType,
            examineType: res.examineTypeCode,
            executorId: res.personID,
            executorDeptId: res.dept.id,
            remark: res.remark
          }
        })

        const probList = this.checkList.map(res => {
          const children = []
          if (res.children && res.children.length > 0) {
            res.children.map(r => {
              children.push({
                discRulesId: r.discretionRulesId ? r.discretionRulesId : r.discRulesId, // 自由裁量细则id
                checkContent: r.label ? r.label : r.checkContent, // 检查内容
                negativeDesc: r.violateRules ? r.violateRules : r.negativeDesc, // 检查描述
                checkItem: r.label ? r.label : r.checkItem,
                confirmRules: r.confirmRules
              })
            })
          }
          return {
            discId: res.discretionId ? res.discretionId : res.discId, // 自由裁量id
            checkContent: res.label ? res.label : res.checkContent, // 检查内容
            discretionTypeCode: res.discretionTypeCode, // 自由裁量分类code
            negativeDesc: res.unlawfulAct ? res.unlawfulAct : res.negativeDesc, // 检查描述
            confirmRules: res.confirmRules,
            isManual: res.isManual ? res.isManual : '1',
            children
          }
        })

        saveBatch({
          baseList,
          probList
        }).then(
          res => {
            if (res.code === '0') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.sourceId = res.data
              this.checkId = res.data
              this.getPageData()
              if (this.formList.length > 1) {
                this.$emit('changeView', 'isList')
              }
              this.saveLoadStatus = false
            } else {
              this.$message({
                message: '保存失败',
                type: 'error'
              })
              this.saveLoadStatus = false
            }

            // eslint-disable-next-line handle-callback-err
          },
          err => {
            this.$message({
              message: '网络错误',
              type: 'error'
            })
            this.saveLoadStatus = false
          }
        )
      } else {
        this.saveLoadStatus = false
        return false
      }
    },
    editDoc() {
      if (this.validateUserData()) {
        getEnterpriseInfo({
          id: this.formList[0].company.id
        }).then(res => {
          this.formList[0].company = res.data

          /*  if (this.pdfId) {
            // 重新生成文书前 先重新保存检查方案
            this.saveChange();
          } */
          if (!this.sourceId) {
            return
          }
          let date = ''
          if (this.formList[0].date && this.formList[0].date !== '') {
            const d = this.formList[0].date ? new Date(this.formList[0].date) : new Date()
            date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
          }
          let data = [
            {
              tagContent: this.formList[0].company.companyName,
              tagName: 'tag2'
            },
            {
              tagContent: this.formList[0].company.businessAddress,
              tagName: 'tag3'
            },
            {
              tagContent: this.formList[0].company.legalPerson,
              tagName: 'tag4'
            },
            {
              // tagContent: this.formList[0].company.jghydlName,
              tagContent: this.formList[0].company.jghydlName,
              tagName: 'tag5'
            },
            {
              tagContent: date,
              tagName: 'tag6'
            },
            {
              tagContent: this.$refs.person['0'].value.replace(/，/g, '、'),
              tagName: 'tag7'
            },
            {
              tagContent: this.formList[0].checkTypeName,
              tagName: 'tag9'
            },
            {
              tagContent: this.formList[0].remark,
              tagName: 'tag10'
            }
          ]
          let checkInfo = this.checkList.reduce((total, item) => {
            let sonInfo = []
            if (item.children && item.children.length > 0) {
              sonInfo = item.children.reduce((t, i) => {
                t.push({
                  tagName: 'tag8Item',
                  tagContent: i.label
                })
                // t += i.label;
                return t
              }, [])
            } else {
              total.push({
                tagContent: item.label,
                tagName: 'tag8Item'
              })
            }
            // total += sonInfo + item.label;
            // 父项检查项
            /*   total.push({
            tagContent: item.label,
            tagName: "tag8Item"
          })
          total = [...total, ...sonInfo]; */
            total = [...total, ...sonInfo]
            return total
          }, [])
          data = [...data, ...checkInfo]
          // this.checkList.map(res => {
          //   if (res.children && res.children.length > 0) {
          //     res.children.forEach(item => {
          //       data.push({
          //         tagContent: item.label,
          //         tagName: "tag8"
          //       });
          //     });
          //   } else {
          //     data.push({
          //       tagContent: res.label,
          //       tagName: "tag8"
          //     });
          //   }
          // });
          if (!this.pdfId) {
            // 未生成文书 则新建
            createWrit({
              contractorIds: this.formList[0].personID,
              sourceId: this.sourceId,
              userId: 'test',
              writType: 'XCJCFA',
              data
            }).then(
              res => {
                this.pdfId = res.writId
                this.pdfDialog = true
                this.setWritBtn(res.writType)
                this.$message({
                  message: '制作成功',
                  type: 'success'
                })
                // eslint-disable-next-line handle-callback-err
              },
              err => {
                this.$message({
                  message: '制作失败',
                  type: 'error'
                })
              }
            )
          } else {
            // 已生成文书 则修改
            updateWrit(
              {
                writId: this.pdfId
              },
              data
            ).then(
              res => {
                this.setWritBtn(res.writType)
                this.pdfDialog = true
                this.$message({
                  message: '制作成功',
                  type: 'success'
                })
                // eslint-disable-next-line handle-callback-err
              },
              err => {
                this.$message({
                  message: '制作失败',
                  type: 'error'
                })
              }
            )
          }
        })
      } else {
        return false
      }
    },
    // 设置文书按钮状态
    setWritBtn(code) {
      let writTypeInfo = JSON.parse(sessionStorage.writTypeInfo)
      let item = writTypeInfo.find(i => {
        return i.id === code
      })
      this.writButton = {
        closePdf: true, //退出
        updatePdf: true, //回退编辑
        auditPdf: item.isAudit == 1, // 提交审核
        sealPdf: item.isSign == 1, // 加盖公章
        signPdf: item.userType == 1, // 签名
        lawSealPdf: item.isSign == 2, // 加盖执法专用章
        finishPdf: true //完成
      }
      this.writName = item.typeName
    },
    submitAudit(val) {
      this.submit(val.deptId, val.peopleId)
    },
    submit(deptId, id) {
      // 提交审核
      this.submitLoadStatus = true
      submitReview({
        auditTypeCode: 'ta80003',
        handlerDeptId: deptId,
        handlerUserId: id,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name,
        requestId: this.pdfId,
        requestTime: getNowFormatDate(),
        requestUsersName: this.formList[0].person,
        submitterCause: this.formList[0].company.companyName,
        requestUsersIds: this.formList[0].personID, //承办人id
        partyName: this.formList[0].company.companyName,
        partyId: this.formList[0].company.id
      }).then(
        res => {
          if (res.code === '0') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$emit('changeView', 'isList')
          } else {
            this.$message({
              message: '提交失败',
              type: 'error'
            })
            this.submitLoadStatus = false
          }
          // eslint-disable-next-line handle-callback-err
        },
        err => {
          this.$message({
            message: '网络错误',
            type: 'error'
          })
          this.submitLoadStatus = false
        }
      )
    },
    async saveChange() {
      // // 保存修改
      if (this.validateUserData()) {
        const probList = this.checkList.map(res => {
          console.info('save change ', res)
          const children = []

          if (res.children && res.children.length > 0) {
            res.children.map(r => {
              children.push({
                id: r.id,
                discRulesId: r.discretionRulesId, // 自由裁量细则id
                checkContent: r.label, // 检查内容
                negativeDesc: r.violateRules, // 检查描述
                confirmRules: r.confirmRules
              })
            })
          }
          return {
            discId: res.discretionId, // 自由裁量id
            id: res.id,
            checkContent: res.checkContent ? res.checkContent : res.label, // 检查内容
            discretionTypeCode: res.discretionTypeCode ? res.discretionTypeCode : res.discretionType, // 自由裁量分类code
            negativeDesc: res.unlawfulAct, // 检查描述
            confirmRules: res.confirmRules,
            isManual: res.isManual ? res.isManual : '1',
            children
          }
        })
        const baseList = this.formList.map(res => {
          // console.info('res date', res.date)
          // console.info('res date type', typeof res.date)
          // 标准日期格式是一个对象
          if (res.date !== '' && res.date) {
            if (typeof res.date === 'object') {
              res.date = dateFormat(res.date, 'yyyy-mm-dd HH:MM:ss')
            } else {
              res.date = res.date + ' 00:00:00'
            }
          }
          return {
            id: this.checkId,
            companyId: res.company.id,
            examineTime: res.date ? res.date : '',
            // examineTime: res.date !== '' && res.date ? res.date.replace(/\//g, '-') + ' 00:00:00' : '',
            examSocCode: res.checkType,
            examineType: res.examineTypeCode,
            executorId: res.personID,
            executorDeptId: res.dept.id,
            remark: res.remark,
            probList
          }
        })
        await saveUpdate(baseList[0]).then(
          res => {
            if (res.code === '0') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.sourceId = res.id
              this.getPageData()
              this.saveLoadStatus = false
              // this.$emit('changeView', 'isList')
            }
            // eslint-disable-next-line handle-callback-err
          },
          err => {
            this.saveLoadStatus = false
            this.$message({
              message: '保存失败',
              type: 'error'
            })
          }
        )
      } else {
        return false
      }
    },
    getcheckTypeName(val) {
      // 检查形式label值
      if (this.formList.length === 1) {
        this.formList[0].checkTypeName = val
      }
    },
    getExamineTypeName(val) {
      // 检查形式label值
      if (this.formList.length === 1) {
        this.formList[0].examineTypeName = val
      }
    },
    hasEmpty() {
      // 检查空值
      let r = false
      for (const k in this.formList) {
        for (const j in this.formList[k]) {
          if ((this.formList[k][j] === null || this.formList[k][j] === '') && j !== 'remark') {
            r = true
          }
        }
      }
      if (this.checkList.length === 0) {
        r = true
      }
      return r
    },
    closePdf() {
      this.pdfDialog = false
    }
  },
  watch: {
    checkList: {
      handler: function(val, oldVal) {
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
.company-wrapper {
  width: 100%;
  height: 400px;
  display: grid;
  grid-template-columns: 70% 33%;
  grid-template-rows: 1fr 1fr 1fr;
}
.me-border {
  border: 1px solid gray;
}
.pdfDiag {
  /deep/ .el-dialog__header {
    padding-top: 23px !important;
  }
}
.create-container {
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

      .input-bar {
        display: flex;
        flex-direction: row;
        &.enforce-reverse {
          flex-direction: row-reverse;
          /deep/ .dialog-input {
            margin-right: 12px;
          }
        }
        .input-name {
          line-height: 30px;
          width: 80px;
        }
        &.inspe-time {
          float: right;
          margin-left: 25px;
        }
        .input-name-long {
          line-height: 30px;
          width: 107px;
          padding-left: 10px;
        }
        .dialog-input {
          flex-shrink: 0;
          width: calc(100% - 129px);
        }
        .el-input {
          flex-shrink: 0;
          width: calc(100% - 129px);
        }
        .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
        .el-date-editor {
          /deep/ .el-range__icon {
            line-height: 22px;
          }
          /deep/.el-range-separator {
            line-height: 22px;
          }
        }
        .el-select {
          width: calc(100% - 129px);
          .el-input {
            width: 100%;
          }
        }
        .el-date-editor {
          width: calc(100% - 129px);
        }
      }
      // 检查方式
      .examineType {
        width: 66.66666%;
        // 检查方式的宽度
        /deep/.el-input .el-input--suffix {
          /deep/.el-input__inner {
            width: 91.55% !important;
          }
        }
      }
      .remarkSpe {
        /deep/.el-textarea {
          width: calc(100% - 90px);
        }
        .remarkSpeInnerSpan {
          width: 80px;
          flex-shrink: 0;
          line-height: 30px;
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

      .dialog-footer {
        .count-text {
          margin-right: 20px;
          .count-num {
            padding: 0 5px;
            color: #0099ff;
          }
        }
      }
    }
  }

  /deep/ .el-select-dropdown__wrap {
    max-height: auto !important;
  }
  .temp-dialog {
    /deep/ .open-bar {
      position: absolute;
      top: 46px;
      right: 0;
    }
  }
  .temp-dialog-footer {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
/deep/ .el-dialog {
  margin-top: calc(50vh - 295px) !important;
}
.delete {
  color: #f56c6c;
}
.required {
  display: inline-block;
  height: 0.8em;
  position: relative;
}
.required:before {
  position: absolute;
  content: '*';
  color: rgb(245, 108, 108);
  margin-left: -5px;
  margin-top: -7px;
  transform: translate(0, -1px);
  vertical-align: middle;
  font-size: 12px;
  height: 100%;
}
/deep/.el-col-16 {
  width: 63.33333%;
}
/deep/.el-textarea {
  margin: 0px;
}
.dialog_container {
  height: 500px;
  overflow-y: scroll;
}
</style>
