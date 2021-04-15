<template>
  <div>
    <div class="body-content-add-check_newInspection" v-show="addCheckTip">
      <div class="check">
        <div class="check-title">
          <span @click="getSelectCheck">+ 选择检查内容</span>
          <el-divider direction="vertical"></el-divider>
          <span @click="addCheckItem">+ 新增检查项</span>
        </div>
        <div class="check-bac bac"></div>
      </div>
    </div>
    <div v-if="!addCheckTip" class="check-tip_newInspection">
      <div class="title">
        <span @click="getSelectCheck">+ 选择检查内容</span>
        <el-divider direction="vertical"></el-divider>
        <span @click="addCheckItem">+ 新增检查项</span>
      </div>

      <!-- 展示选中的检查项 -->
      <div v-show="checkList && checkList.length > 0">
        <div v-for="(tips, index) in checkList" :key="tips.discretionId" class="first">
          <div class="first-index">{{ index + 1 }}</div>
          <div class="first-content">
            <!-- 检查项目类别 自定义 -->
            <div class="contentCategory">
              <div class="first-content-type left-indent" v-if="tips.checkContentEditable">
                <div
                  class="first-content-type left-indent"
                  :style="{ marginTop: tips.checkContentEditable ? '0' : '10px' }"
                >检查项目类别：</div>
                <sn-select
                  class="select"
                  v-model="tips.discretionTypeCode"
                  :data-url="'/aj/sys/sysdict/list'"
                  :requertData="{ type: 'free_court' }"
                  :immediate="true"
                  style="margin-top: -3px"
                  placeholder="请选择检查项目类别"
                ></sn-select>

                <!--    @getObj="getObj($event, tips)" free_court 自由裁量分类 :requertData="{type: 'discretion_class'}" -->
              </div>
              <!-- 检查项目类别 正常 -->
              <div
                class="first-content-type left-indent"
                v-else
              >检查项目类别：{{ tips.discretionTypeName }}</div>
            </div>
            <!-- 检查内容 自定义 -->
            <div class="checkContentInner">
              <div class="first-content-primary-tip" v-if="tips.checkContentEditable">
                <div
                  class="descCheck"
                  :style="{ marginRight: tips.checkContentEditable ? '5px' : '0' }"
                >检查内容：</div>
                <el-input placeholder="输入检查内容" v-model="tips.checkContent" type="textarea" autosize></el-input>
              </div>
              <!-- 检查内容 正常 -->
              <div class="first-content-primary-tip" v-else>
                <h3>检查内容：{{ tips.checkContent }}</h3>
              </div>
            </div>
            <!-- 有子项 -->
            <div v-if="tips.children && tips.children.length > 0">
              <div v-for="(item, sonIndex) in tips.children" :key="item.discRulesId">
                <div class="second" @click="setWarn(item)">
                  <h3>
                    <span class="second-index">{{ sonIndex + 1 }}</span>
                    {{ item.checkItem !== null ? item.checkItem : item.checkContent }}
                  </h3>
                </div>
                <div class="input-des left-indent">
                  <div style="line-height: 32px">检查描述：</div>
                  <el-input
                    placeholder="请输入检查描述"
                    v-model="item.checkDesc"
                    type="textarea"
                    autosize
                    v-if="item.isGreat === '2'"
                    :disabled="item.examineContent && item.examineContent !== ''"
                  ></el-input>
                  <el-input
                    placeholder="请输入检查描述"
                    v-model="item.negativeDesc"
                    type="textarea"
                    autosize
                    v-if="item.isGreat !== '2'"
                    :disabled="item.examineContent && item.examineContent !== ''"
                  ></el-input>
                </div>
                <div
                  class="handle left-indent"
                  :style="{ visibility: !item.children || item.children.length === 0 ? 'visible' : 'hidden' }"
                >
                  <div
                    class="handle-state"
                    :style="{ visibility: item.examineContent ? 'visible' : 'hidden' }"
                  >
                    处理方式：
                    <span>{{ item.examineContent }}</span>
                  </div>
                  <div class="handle-oper">
                    <span class="label" @click.prevent="getIndex(item.discRulesId)">上传证据</span>
                    <span
                      style="color: #ff4b3d"
                      class="choose-text"
                      @click="delTips(false, index, sonIndex)"
                    >删除</span>
                    <span>
                      <radio-check
                        v-model="item.isGreat"
                        @change="setIsGreat(false, index, sonIndex)"
                        :disabled="item.examineContent && item.examineContent !== ''"
                      ></radio-check>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="!tips.children || tips.children.length === 0" class="left-indent">
              <!-- 没有子项 检查描述可编辑 -->
              <div class="checkDesc" v-if="tips.checkContentEditable">
                <div style="line-height: 32px;display:inline-block;">检查描述：</div>
                <el-input
                  placeholder="请输入检查描述"
                  v-model="tips.checkDesc"
                  type="textarea"
                  autosize
                  v-if="tips.isGreat === '2'"
                  :disabled="tips.examineContent && tips.examineContent !== ''"
                ></el-input>
                <el-input
                  placeholder="请输入检查描述"
                  v-model="tips.negativeDesc"
                  type="textarea"
                  autosize
                  v-if="tips.isGreat !== '2'"
                  :disabled="tips.examineContent && tips.examineContent !== ''"
                ></el-input>
              </div>
              <!-- 没有子项 检查描述不可编辑 -->
              <div class="checkDesc" v-else>
                <div style="line-height: 32px;display:inline-block;">检查描述：</div>
                <el-input
                  placeholder="请输入检查描述"
                  v-model="tips.checkDesc"
                  type="textarea"
                  autosize
                  v-if="tips.isGreat === '2'"
                  :disabled="tips.examineContent && tips.examineContent !== ''"
                ></el-input>
                <el-input
                  placeholder="请输入检查描述"
                  v-model="tips.negativeDesc"
                  v-if="tips.isGreat !== '2'"
                  type="textarea"
                  autosize
                  :disabled="tips.examineContent && tips.examineContent !== ''"
                ></el-input>
              </div>
            </div>
            <div v-if="!tips.children || tips.children.length === 0" class="handle left-indent">
              <!-- 自定义 隐患状态可编辑 -->
              <div class="noChildren" v-if="tips.checkContentEditable">
                <div
                  class="handle-state"
                  :style="{ visibility: tips.examineContent ? 'visible' : 'hidden' }"
                >
                  处理方式：
                  <span>{{ tips.examineContent }}</span>
                </div>
                <div class="handle-oper">
                  <span class="label" @click.prevent="getIndex(tips.discId)">上传证据</span>
                  <span style="color: #ff4b3d" class="choose-text" @click="delTips(true, index)">删除</span>
                  <span>
                    <radio-check
                      v-model="tips.isGreat"
                      @change="setIsGreat(true, index)"
                      :disabled="tips.examineContent && tips.examineContent !== ''"
                    ></radio-check>
                  </span>
                </div>
              </div>
              <!--  隐患状态不可编辑 -->
              <div class="noChildren" v-else>
                <div
                  class="handle-state"
                  :style="{ visibility: tips.examineContent ? 'visible' : 'hidden' }"
                >
                  处理方式：
                  <span>{{ tips.examineContent }}</span>
                </div>
                <div class="handle-oper">
                  <span class="label" @click.prevent="getIndex(tips.discId)">上传证据</span>
                  <span style="color: #ff4b3d" class="choose-text" @click="delTips(true, index)">删除</span>
                  <span>
                    <radio-check
                      v-model="tips.isGreat"
                      @change="setIsGreat(true, index)"
                      :disabled="tips.examineContent && tips.examineContent !== ''"
                    ></radio-check>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 如果有null  先把null判断放在前面 -->
      <div v-show="checkList == null ||checkList.length === 0 || !checkList ">
        <div class="withoutList_bac"></div>
      </div>
    </div>
    <!-- 添加现场证据 -->
    <div class="body-content-add-check_newInspection" ref="addProof" v-show="addCheckProof">
      <div class="check">
        <div class="check-title" @click="uploadFile">+ 添加现场证据</div>
        <div class="proof-bac bac"></div>
      </div>
    </div>
    <!-- 下载证据组件/上传证据组件 -->
    <div class="proof-list_inspection" ref="proofHook">
      <div v-for="(item, index) in tipsProofList" :key="index" class="proof" width="60%">
        <down-proof
          v-if="!!item && showProofList"
          :proof="item"
          :canDel="true"
          @removeProof="delProof"
        ></down-proof>
      </div>
      <div v-show="!addCheckProof" class="upload-proof">
        <upload-proof
          ref="proof"
          @getUploadMsg="getMsg"
          :fileDetail="fileData"
          :uploadType="'inspection'"
          :isUpdate="isUpdate"
          v-bind="$attrs"
          :sourceId="getSourceId"
          @delProof="newDelProof"
        ></upload-proof>
      </div>
    </div>
    <div>
      <!-- 选择检查内容 -->
      <select-check
        v-if="showDialog"
        :tipsCache="checkList"
        @close="showDialog = false"
        @getSelectedTips="getSelectedTips"
      ></select-check>
    </div>
  </div>
</template>

<script>
import uploadProof from '@components/uploadProof/index'
import downProof from '@components/downProof/index'
import addCheck from '@/pages/inspectionScheme/components/addCheck/index'
import { mapState } from 'vuex'
import { delTip } from '@api/onSiteInspection/index'
import radioCheck from '@components/radioCheck/index'
import { debounce } from '@/utils/util'
import selectCheck from './selectCheck'
import snSelect from '@/components/snSelect'

export default {
  name: 'inspectionDetail',
  components: {
    uploadProof,
    addCheck,
    downProof,
    radioCheck,
    selectCheck,
    snSelect
  },
  inheritAttrs: false,
  props: {
    // 查询详情返回的数据
    getDetailInfo: {
      type: Object
    },
    // 是否处于新增页面修改状态
    isUpdate: {
      type: Boolean
    },
    // 是否处于修改状态
    isNewUpdate: {
      type: Boolean,
      required: false
    },
    //
    getSourceId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      showDialog: false, // 显示选择检查项的弹窗
      fileData: null, // 上传的证据的关联id
      addCheckTip: true, // 控制显示检查项的开关
      addCheckProof: true, // 控制显示上传证据的开关
      evidenceId: [], // 公共证据存放list
      checkListCache: [], // 选择的检查项的缓存
      checkList: [], // 选择的检查项
      showPdfDialog: false, // 浏览pdf文书弹窗的开关
      selectedList: [], // 选中的检查项,
      isChange: false, // 是否处于新增页面的修改状态
      showProofList: false, // 是否显示修改状态下的证据列表
      customCheckListCache: [], // 自定义检查内容的缓存
      customCheck: [], // 自定义检查内容 弹出框回显用
      tipsProofList: [],
      picDetailId: '',
      addCheckIteemPicList: [], //新增检查项每项的证据
      positionStatus: false //新增和选择检查项时自动跳转
    }
  },
  created() {
    this.delTipsi = debounce(this.delTips, 1000, true)
  },
  methods: {
    getSelectCheck() {
      this.showDialog = true
      // 代表定位为true
      this.positionStatus = true
    },
    addCheckItem() {
      this.positionStatus = true
      this.$store.commit('setCheckFlag', 'checkFlag')
      this.addCheckTip = false
      // 自定义检查项
      const radomID = Math.floor(Math.random() * 1000000000 + +1)
      // 如果检查项列表为空 或者是不存在 则置为空数组
      if (this.checkList == null || !this.checkList) {
        this.checkList = []
      }
      this.checkList.push({
        labelID: radomID.toString(),
        dataType: 'custom',
        hasBussinessRule: '0',
        discretionCode: '',
        children: [],
        discretionTypeCode: '',
        discretionTypeName: '', // 类型
        examineContent: null, // 内容
        checkContent: null,
        checkDesc: '',
        negativeDesc: '',
        label: '',
        isGreat: '2',
        checkContentEditable: true, //是不是来自新增检查项
        isManual: '0',
        // discId: radomID.toString(),
        accessoryList: [],
        accessoryId: '',
        discId: new Date().getTime().toString()
      })
    },
    // 获取选择的检查项
    getSelectedTips(arr) {
      this.checkList = arr.reduce((total, item) => {
        if (item.children && item.children.length > 0) {
          let list = item.children.reduce((t, i) => {
            if (typeof i !== 'object') {
              console.info('xixixixi', i)
            }
            if (i.isOldTips) {
              t.push(i)
            } else {
              i.discRulesId = i.discretionRulesId
              this.$set(i, 'negativeDesc', i.negativeDesc && i.negativeDesc !== '' ? i.negativeDesc : i.violateRules)
              this.$set(i, 'checkDesc', i.checkDesc && i.checkDesc !== '' ? i.checkDesc : i.confirmRules)
              this.$set(i, 'isGreat', i.isGreat ? i.isGreat : '2')
              this.$set(i, 'examineContent', null)
              i.checkItem = i.rules
              t.push(i)
            }
            return t
          }, [])
          if (!item.isOldTips) {
            item.isGreat = item.isGreat ? item.isGreat : '2'
            item.negativeDesc = item.negativeDesc && item.negativeDesc !== '' ? item.negativeDesc : item.unlawfulAct
            item.discId = item.discretionId
            item.checkDesc = item.checkDesc && item.checkDesc !== '' ? item.checkDesc : item.confirmRules
            item.checkContent = item.label
            item.examineContent = null
          }
          item.children = list
          total.push(item)
        } else {
          if (item.isOldTips) {
            total.push(item)
          } else {
            item.discId = item.discretionId
            this.$set(item, 'negativeDesc', item.negativeDesc && item.negativeDesc !== '' ? item.negativeDesc : item.unlawfulAct)
            this.$set(item, 'checkDesc', item.checkDesc && item.checkDesc !== '' ? item.checkDesc : item.confirmRules)
            this.$set(item, 'isGreat', item.isGreat ? item.isGreat : '2')
            this.$set(item, 'examineContent', null)
            item.checkContent = item.label ? item.label : item.checkContent
            total.push(item)
          }
        }
        return total
      }, [])
      this.showDialog = false
      this.addCheckTip = false
    },
    // 选择有隐患的检查项
    selectTips(state, index, secondIndex) {
      let id = state ? this.checkList[index].discId : this.checkList[index].children[secondIndex].discRulesId
      let father = this.checkList[index]
      let son = state ? null : this.checkList[index].children[secondIndex]
      let fatherIndex = -1
      let sonIndex = -1
      this.selectedList.forEach((item, i) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((tips, j) => {
            if (tips.discRulesId === id) {
              fatherIndex = i
              sonIndex = j
            }
          })
        }
        if (item.discId === father.discId) {
          fatherIndex = i
        }
      })
      if (state) {
        if (fatherIndex !== -1) {
          this.selectedList.splice(fatherIndex, 1)
        } else {
          this.selectedList.push(this.checkList[index])
        }
      } else {
        if (fatherIndex === -1) {
          let obj = JSON.parse(JSON.stringify(father))
          obj.children = [son]
          this.selectedList.push(obj)
        } else {
          if (sonIndex === -1) {
            this.selectedList[fatherIndex].children.push(son)
          } else {
            this.selectedList[fatherIndex].children.splice(sonIndex, 1)
            if (this.selectedList[fatherIndex].children.length === 0) {
              this.selectedList.splice(fatherIndex, 1)
            }
          }
        }
      }
    },
    // 将关联的检查项id传给要上传的证据
    getIndex(id) {
      console.info('xizneng ', id, this.isChange)
      this.addCheckProof = false
      this.fileData = { sourceId: id, flag: new Date() }
      console.info('this.$refs', this.$refs)
      if (this.isChange == true) {
        // 修改用0
        this.$refs.proof.$refs.inner_upload.$children[0].handleClick()
      } else {
        // 新增用1
        this.$refs.proof.$refs.inner_upload.$children[1].handleClick()
      }
    },
    uploadFile() {
      this.addCheckProof = false
      if (this.isChange == true) {
        // 修改用0
        this.$refs.proof.$refs.inner_upload.$children[0].handleClick()
      } else {
        // 新增用1
        this.$refs.proof.$refs.inner_upload.$children[1].handleClick()
      }
    },
    // 关闭选择检查项的弹窗
    dialogClose() {
      this.showDialog = false
    },
    // 上传证据成功之后和相应的检查项进行关联
    getMsg(uploadInfo) {
      let id = uploadInfo.sourceId
      if (id) {
        this.checkList.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(i => {
              if (i.discRulesId === id) {
                // i.accessoryList = i.accessoryList ? i.accessoryList : [];
                // i.accessoryList.push(uploadInfo.accessoryId);
                // i.accessoryId = i.accessoryList.join(",");
                // i.accessoryList = [];
                i.accessoryId = i.accessoryId && i.accessoryId !== '' ? i.accessoryId + `,${uploadInfo.accessoryId}` : uploadInfo.accessoryId
              }
            })
          } else {
            if (item.discId === id) {
              //没有children
              // if (item.accessoryId === "") {
              //   item.accessoryId = uploadInfo.accessoryId;
              //   this.addCheckIteemPicList.push(item.accessoryId);
              // } else {
              //   let IDListAll = [];
              //   IDListAll.push(uploadInfo.accessoryId);
              //   this.addCheckIteemPicList = [
              //     ...this.addCheckIteemPicList,
              //     ...IDListAll
              //   ];
              //   item.accessoryId = this.addCheckIteemPicList.join(",");
              // }
              item.accessoryId = item.accessoryId && item.accessoryId !== '' ? item.accessoryId + `,${uploadInfo.accessoryId}` : uploadInfo.accessoryId
            }
          }
        })
      } else {
        this.evidenceId.push(uploadInfo.accessoryId)
      }
      this.$emit('afterUpload')
    },
    // 删除检查项
    delTips: function(state, index, sonIndex) {
      let item = state ? this.checkList[index] : this.checkList[index].children[sonIndex]
      if (item.id && item.id !== '') {
        if (this.checkList.length === 1) {
          this.$message({
            message: '请至少保留一条有效数据检查项',
            type: 'error'
          })
        } else {
          if (item.examineContent) {
            this.$message({
              message: '已经处置过的检查项不能删除',
              type: 'error'
            })
          } else {
            delTip({ id: item.id }).then(
              res => {
                // 若是已经存储的数据 也要删除其证据项
                this.$emit('afterUpload')
                // this.$emit('delTips')
                // 避免删除子项的时候把父项一起删除
                this.checkList[index].children.splice(sonIndex, 1)
                if (this.checkList[index].children.length === 0) {
                  this.checkList.splice(index, 1)
                }
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              },
              err => {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                })
              }
            )
          }
        }
      } else {
        if (state) {
          this.checkList.splice(index, 1)
        } else {
          this.checkList[index].children.splice(sonIndex, 1)
          if (this.checkList[index].children.length === 0) {
            this.checkList.splice(index, 1)
          }
        }
      }
    },
    // 设置检查项是否有重大隐患
    setIsGreat(state, index, sonIndex) {
      let item = !state ? this.checkList[index].children[sonIndex] : this.checkList[index]
      if (item.isManual == '0') {
        let content = item.checkDesc && item.checkDesc !== '' ? item.checkDesc : item.negativeDesc && item.negativeDesc !== '' ? item.negativeDesc : ''
        item.checkDesc = content
        item.negativeDesc = content
      }
      if ((!item.checkDesc || item.checkDesc === '') && item.negativeDesc && item.negativeDesc !== '') {
        item.checkDesc = item.negativeDesc
      }
      if (item.checkDesc && item.checkDesc !== '' && (!item.negativeDesc || item.negativeDesc === '')) {
        item.negativeDesc = item.checkDesc
      }
    },
    // 删除
    delProof(id) {
      let index = -1
      let result = this.tipsProofList.some((item, i) => {
        index = i
        return item.accessoryId === id
      })

      this.tipsProofList.splice(index, 1)
      this.$emit('delTips')
    },
    newDelProof() {
      this.$emit('delTips')
    }
  },
  computed: {
    ...mapState(['newInspectionCanOper']),
    checkedNum() {
      return _.filter(this.checkListCache, function(o) {
        if (!o.hasBussinessRule) {
          return true
        } else if (o.hasBussinessRule === '0') {
          return true
        }
      })
      // return this.checkListCache.length;
    },
    // 控制能否对检查项进行处理的开关
    canOper: function() {
      let result = true
      if (this.newInspectionCanOper) {
        if (this.selectedList.length > 0) {
          result = false
        }
      }
      return result
    },
    // 控制能否生成文书
    writCanOper: function() {
      let result = true
      if (this.newInspectionCanOper && this.getSourceId) {
        result = false
      }
      return result
    },
    // 返回被选中的不合格的检查项
    selectedNum: function() {
      return this.selectedList.length
    }
  },
  watch: {
    // 查询详情接口返回的数据
    getDetailInfo: {
      handler: function(val, oldVal) {
        if (val.checkList && val.checkList.length > 0) {
          val.checkList.forEach(item => {
            if (item.children && item.children.length > 0) {
              item.children.forEach(i => {
                i.isOldTips = true
                i.greatCache = i.isGreat
              })
            }
            item.isOldTips = true
            item.greatCache = item.isGreat
          })
        }
        this.checkList = JSON.parse(JSON.stringify(val.checkList))
        this.evidenceId = val.evidenceId ? JSON.parse(JSON.stringify(val.evidenceId)) : []
        if (val.checkList && val.checkList.length > 0) {
          this.addCheckTip = false
        }
        this.tipsProofList = val.proofList && val.proofList.length > 0 ? JSON.parse(JSON.stringify(val.proofList)) : []
        const that = this
        if (this.isNewUpdate) {
          this.showProofList = true
          this.addCheckProof = false
        }
        setTimeout(() => {
          that.isChange = true
          // this.$refs.proof.$children[0].uploadFiles = [];
        }, 100)
      },
      deep: true
    },
    // 选中的检查项
    checkList: {
      handler: function(val, oldval) {
        this.$nextTick(() => {
          if (this.positionStatus === true) {
            let proofsHeight = this.$refs.addProof.clientHeight + this.$refs.proofHook.clientHeight
            let checkListContainer = document.getElementById('insp-scroll-hook')
            checkListContainer.scrollTop = checkListContainer.scrollHeight - proofsHeight - 500
            this.positionStatus = false
          }
        })

        if (this.isChange) {
          this.$parent.$parent.detailIsChanged = true
          this.$nextTick(() => {
            this.$store.commit('setNewInspectionCanOper', false)
          })
        }
      },
      deep: true
    },
    // 是否处于修改状态
    isUpdate: {
      handler: function(val, oldval) {
        if (!val) {
          this.isChange = false
          this.$refs.proof.$children[0].uploadFiles = []
        }
      },
      deep: true
    },
    // 公共证据是否有变化
    evidenceId: {
      handler: function(val, oldval) {
        if (this.isChange) {
          this.$parent.$parent.detailIsChanged = true
          this.$nextTick(() => {
            this.$store.commit('setNewInspectionCanOper', false)
          })
        }
      }
    },
    checkListCache: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          console.info(val.length)
        }
      },
      deep: true
    },
    discretionTypeCode: {
      handler: function(val, oldVal) {
        // console.info("val====>",val)
        // console.info("oldVal====>",oldVal)
        // console.log("obj====>",this.addCheckObj)
        // if(this.addCheckObj.value === val){
        //   console.info("hhhhhhhh")
        // }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.body-content-add-check_newInspection {
  min-height: 225px;
  margin-top: 16px;
  .check {
    height: 225px;
    .check-title {
      background: #eef5f9;
      text-align: center;
      height: 46px;
      line-height: 46px;
      color: #0099ff;
      cursor: pointer;
      span {
        color: #0099ff;
        margin-right: 12px;
        &:last-child {
          margin-left: 12px;
        }
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
      .el-divider--vertical {
        height: 2em;
        margin-top: 6px;
      }
      /* .el-divider--vertical {
        height: 2em;
      } */
    }
    .bac {
      height: 179px;
    }
    .proof-bac {
      background: url('~@/assets/imgs/proof.png') no-repeat 50% 24px;
      background-size: 193px 109px;
      &::after {
        content: '暂无现场证据';
        position: relative;
        top: 142px;
        left: 47%;
        color: #999999;
      }
    }
    .check-bac {
      background: url('~@/assets/imgs/list_empty.png') no-repeat 50% 24px;
      background-size: 193px 109px;
      &::after {
        content: '暂无检查内容';
        position: relative;
        top: 142px;
        left: 47%;
        color: #999999;
      }
    }
  }
}
.check-tip_newInspection {
  margin-top: 15px;
  .title {
    background: #eef5f9;
    height: 46px;
    line-height: 46px;
    padding-left: 16px;
    // margin-top: 25px;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    justify-content: center;
    span {
      color: #0099ff;
      margin-right: 12px;
      &:last-child {
        margin-left: 12px;
      }
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .el-divider--vertical {
      height: 2em;
      margin-top: 10px;
    }
    .tips {
      display: flex;
      line-height: 46px;
      white-space: nowrap;
      // overflow: auto;
      width: 100%;
      b {
        color: #0099ff;
        font-size: 18px;
        margin: 0 3px;
      }
      .el-button {
        height: 30px;
        padding: 7px 3px;
        width: 126px;
        align-self: center;
      }
    }
    /*     span {
      display: inline-block;
      margin-right: 24px;
      &:last-child {
        margin-right: 20px;
        color: #0099ff;
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
    } */
  }
  .first {
    display: flex;
    flex-direction: row;
    .first-index {
      width: 45px;
      text-align: center;
      line-height: 38px;
      font-weight: bold;
      border-bottom: 1px solid #e0e0e0;
    }
    .first-content {
      // border-left: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      width: 100%;

      .first-content-type {
        color: #666666;
        margin: 10px 0 7px;
        font-size: 14px;
        white-space: normal;
      }
      .first-content-primary-tip {
        display: flex;
        align-items: center;
        margin: 2px 0px;
      }
      .second {
        display: flex;
        flex-direction: row;
        line-height: 25px;
        .second-index {
          display: inline-block;
          border: 1px solid #333333;
          width: 15px;
          height: 15px;
          border-radius: 15px;
          text-align: center;
          line-height: 15px;
          font-size: 13px;
        }
      }
      .input-des {
        margin-bottom: 11px;
        .state-check {
          display: flex;
          flex-direction: row-reverse;
          padding-top: 12px;
          span {
            display: inline-block;
            margin-right: 24px;
            cursor: pointer;
            &:first-child {
              margin-right: 0;
              cursor: default;
            }
          }
        }
      }
      .handle {
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        .noChildren {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .handle-state {
          min-width: 62%;
          // display: inline-block;
          span {
            color: #0099ff;
          }
        }
        .handle-oper {
          // overflow-x: auto;
          box-sizing: border-box;
          padding-right: 5px;
          // display: inline-block;
          span {
            display: inline-block;
            margin-right: 24px;
            &:last-child {
              margin-right: 0;
            }
          }
          .label {
            display: inline;
            color: #1cc19c;
            &:hover {
              cursor: pointer;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  .choose-text {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  h3 {
    font-size: 16px;
    margin: 0 0 7px;
    white-space: normal;
    // margin-left: 52px;
  }
  div {
    white-space: nowrap;
  }
  .el-checkbox {
    margin: 0 16px;
    /deep/ .el-checkbox__inner {
      width: 20px;
      height: 20px;
      &::after {
        left: 6px;
        top: 3px;
        height: 9px;
      }
    }
  }
  .el-input {
    width: 94%;
  }
  .withoutList_bac {
    height: 178px;
    background: url('~@/assets/imgs/list_empty.png') no-repeat 50% 24px;
    background-size: 193px 109px;
    &::after {
      content: '暂无检查内容';
      position: relative;
      top: 142px;
      left: 47%;
      color: #999999;
    }
  }
}
.proof-list_inspection {
  display: flex;
  width: auto;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 21px;
  .proof {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  /deep/ .proof-show {
    /deep/ .proof-oper {
      width: auto;
    }
  }
}
.el-tree {
  background: #eef5f9;
  height: 39.2rem;
  /deep/ .el-tree-node__label {
    color: #0099ff;
  }
}
.dialog-footer_newInspection {
  .count-text {
    margin-right: 20px;
    .count-num {
      padding: 0 5px;
      color: #0099ff;
    }
  }
}
.proof-list_newInspection {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 21px;
  .proof {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
// .special-button {
//   border: 1px solid #ff6000;
//   /deep/ span {
//     color: #ff6000;
//   }
// }
.left-indent {
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  // padding-left: 52px;
  .checkDesc {
    width: 92%;
    // border: 1px solid red;
  }
}
.total-proof-list_newInspection {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
/deep/.el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
  top: 4px;
}
/deep/.el-dialog__wrapper .el-dialog__header {
  padding: 15px 20px 20px;
}
/deep/.el-textarea {
  margin-top: 0px;
  vertical-align: top !important;
}
.descCheck {
  line-height: 30px;
}
</style>
