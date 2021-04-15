<template>
  <div class="delay_page">
    <div>
      <div class="content-list_handlePage">
        <el-row>
          <el-col :span="10">
            <div>企业名称：{{option.examineInfo.companyName}}</div>
          </el-col>
          <el-col :span="7">
            <div>检查时间：{{option.examineInfo.examineStartTime}}</div>
          </el-col>
          <el-col :span="7">执法人员：{{option.examineInfo.executorName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="10">检查形式：{{option.examineInfo.examineSourceName}}</el-col>
          <el-col :span="7">检查方式：{{option.examineInfo.examineTypeName}}</el-col>
          <el-col :span="7">
            <div>复查人员：{{option.reviewName}}</div>
          </el-col>
        </el-row>
      </div>
      <!-- originProbList 就是data里的problist -->
      <div v-show="originProbList && originProbList.length > 0">
        <div v-for="(tips, index) in originProbList" :key="tips.id" class="first_content">
          <div class="first-content-type left-indent">
            <span>{{ index + 1}}</span>
            检查项目类别：{{tips.discretionTypeName}}
          </div>
          <div class="first-content-primary-tip">
            <el-checkbox
              v-model="tips.checked"
              @change="selectTips(true, index)"
              :disabled=" tips.isDelay === '2' || tips.isDelay === '3' || tips.isReview === '0'"
              :style="{visibility: (!tips.children || tips.children.length === 0) ? 'visible' : 'hidden'}"
            ></el-checkbox>
            <h3>检查内容：{{tips.checkItem !== null ? tips.checkItem : tips.checkContent}}</h3>
          </div>
          <!-- problist 有子项 -->
          <div v-if="tips.children && tips.children.length > 0">
            <div v-for="(item, sonIndex) in tips.children" :key="item.id">
              <div class="second-content-primary-item">
                <el-checkbox
                  v-model="item.checked"
                  :disabled="item.isDelay === '2' || item.isDelay === '3' || item.isReview === '0' "
                  @change="selectTips(false, index, sonIndex)"
                ></el-checkbox>
                <h3>
                  <span class="second-content-primary-item-index">{{ sonIndex + 1 }}</span>
                  {{item.checkItem ? item.checkItem : item.checkContent}}
                </h3>
              </div>
              <div class="left-indent">
                <div style="line-height: 32px">检查描述：{{ item.negativeDesc }}</div>
              </div>

              <div
                class="handle left-indent"
                :style="{visibility: (!item.children || item.children.length === 0) ? 'visible' : 'hidden'}"
              >
                <div class="handle-state">
                  <img src="../../../../../assets/imgs/标签.png" />
                  <span>{{ item.isGreat === '1' ? '一般隐患' : '重大隐患' }}</span>
                  <span
                    class="handle-state-punish"
                    v-if="delayFlag !== 'flagNewDelay'"
                  >{{item.examineContent}}</span>
                  <span
                    class="reviewStatus"
                  >{{item.isReview === '0'?'已复查' :item.isReview === '1'?'待复查':'状态出错，请联系管理员'}}</span>
                  <!-- <span class="handle-state-delay">{{item.isDelay}}</span> -->
                  <span
                    class="handle-state-delay"
                  >{{item.isDelay === "2" ? "延期中":item.isDelay === "3" ? "延期通过" :''}}</span>
                </div>
                <div class="handle-oper">
                  <span
                    class="label"
                    @click.prevent="getIndex(item.discRulesId)"
                    v-if="flag === 'flagNewReview'"
                  >上传证据</span>
                  <el-switch
                    v-model="item.isQualified"
                    active-value="0"
                    inactive-value="1"
                    active-color="#13ce66"
                    inactive-color="#ccc"
                    :disabled="true"
                  ></el-switch>
                </div>
              </div>
            </div>
          </div>
          <!-- problist 无子项 -->
          <div v-show="!tips.children || tips.children.length === 0" class="left-indent">
            <div style="line-height: 32px">检查描述：{{ tips.negativeDesc }}</div>
          </div>
          <!-- 子项里的复查记录 有recordList -->
          <div
            v-if="((!tips.children || tips.children.length === 0) && tips.recordList && tips.recordList.length > 0 ) && delayFlag !== 'flagNewDelay'"
          >
            <div class="history">
              <div class="history-title history-indent">复查历史记录</div>
              <div v-for="(checkItem, index) in tips.recordList" :key="index" class="history-data">
                <div class="history-content history-indent">实际复查时间：{{ checkItem.reviewTime }}</div>
                <div class="history-content history-indent">复查意见：{{ checkItem.reviewOpinion }}</div>
              </div>
            </div>
          </div>

          <!-- 隐患标签一直都要显示 -->
          <div v-if="!tips.children || tips.children.length === 0" class="handle left-indent">
            <div class="handle-state">
              <img src="../../../../../assets/imgs/标签.png" />
              <span>{{ tips.isGreat === '1' ? '一般隐患' : '重大隐患' }}</span>
              <span class="handle-state-punish">{{tips.examineContent}}</span>
              <span>{{tips.isReview === '0'?'已复查' :tips.isReview === '1'?'待复查':'状态出错，请联系管理员'}}</span>
              <!-- <span class="handle-state-delay">{{tips.isDelay}}</span> -->
              <span
                class="handle-state-delay"
              >{{tips.isDelay === "2" ? "延期中":tips.isDelay === "3" ? "延期通过" :''}}</span>
            </div>
            <div class="handle-oper_handlePage">
              <el-switch
                v-model="tips.isQualified"
                active-value="0"
                inactive-value="1"
                active-color="#13ce66"
                inactive-color="#ccc"
                :disabled="true"
              ></el-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import uploadProof from '@components/uploadProof/index'
import downProof from '@components/downProof/index'
export default {
  name: 'delayPage',
  components: {
    uploadProof,
    downProof
  },
  data() {
    return {
      selectedList: [], // 被选中的检查项
      writId: null, // 文书id
      fileData: {}, // 上传证据返回的信息
      publicProof: [], // 公共证据
      delayCheckBoxStatus: false
    }
  },
  props: {
    //   父组件传值的数据
    originProbList: {
      type: Array,
      required: true
    },
    option: {
      type: Object,
      required: true
    },
    proofList: {
      type: Array,
      required: true
    },
    alreadySave: {
      type: Date,
      required: false
    }
  },
  methods: {
    newDelProof() {
      this.$emit('needUpdate')
    },
    // 在复查页面下 上传证据
    getIndex(id) {
      console.info('在复查页面下iddddddd=>', id)
      this.fileData = { sourceId: id, flag: new Date() }
      console.info('fileData=>', this.fileData)
      this.$refs.proof.$refs.inner_upload.$children[1].handleClick()
    },
    // 上传证据成功之后和相应的检查项进行关联
    getMsg(uploadInfo) {
      console.log('上传证据成功之后和相应的检查项进行关联===>', uploadInfo)
      console.log('originProbList===>', this.originProbList)
      let id = uploadInfo.sourceId
      if (id) {
        this.originProbList.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(i => {
              if (i.discRulesId === id) {
                i.accessoryList = i.accessoryList ? i.accessoryList : []
                i.accessoryList.push(uploadInfo.accessoryId)
                i.accessoryId = i.accessoryList.join(',')
              }
            })
          }
          if (item.discId === id) {
            //没有children
            if (item.accessoryId === '') {
              item.accessoryId = uploadInfo.accessoryId
              this.addCheckIteemPicList.push(item.accessoryId)
            } else {
              let IDListAll = []
              IDListAll.push(uploadInfo.accessoryId)
              this.addCheckIteemPicList = [...this.addCheckIteemPicList, ...IDListAll]
              item.accessoryId = this.addCheckIteemPicList.join(',')
            }
          }
        })
      } else {
        this.publicProof.push(uploadInfo.accessoryId)
      }
    },
    // 选择有隐患的检查项
    selectTips(state, index, secondIndex) {
      console.info('state==>', state)
      console.info('index==>', index)
      console.info('sonIndex==>', sonIndex)
      let id = state ? this.originProbList[index].discId : this.originProbList[index].children[secondIndex].discRulesId
      let father = this.originProbList[index]
      let son = state ? null : this.originProbList[index].children[secondIndex]
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
          this.selectedList.push(this.originProbList[index])
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
    // 删除证据
    delProof(id) {
      console.info('delProof==>', id)
      let index = -1
      this.proofList.some((item, i) => {
        index = i
        return item.accessoryId === id
      })
      this.proofList.splice(index, 1)
      this.$emit('needUpdate')
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(['delayFlag', 'flag'])
  },
  watch: {
    alreadySave: function(val, oldVal) {
      this.$refs.proof.$children[0].uploadFiles = []
      this.selectedList = []
    }
  }
}
</script>
<style lang="less" scoped>
.delay_page {
  .first_content {
    border-bottom: 1px solid #e0e0e0;
    .reviewCheckSure {
      &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
    .first-content-type {
      color: #666666;
      margin: 10px 0 7px;
      font-size: 14px;
      white-space: normal;
    }
    .left-indent {
      padding-left: 50px;
    }
    .first-content-primary-tip {
      display: flex;
    }
    .second-content-primary-item {
      display: flex;
      flex-direction: row;
      line-height: 25px;
      .second-content-primary-item-index {
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
      margin-bottom: 5px;
      white-space: nowrap;
      word-break: break-all;
      line-height: 35px;
      /deep/ .el-textarea {
        width: 91%;
      }
    }
    .handle {
      display: flex;
      margin-bottom: 10px;
      justify-content: space-between;
      margin-top: 10px;
      .handle-state {
        display: flex;
        flex-direction: row;
        img {
          width: 11px;
          height: 17px;
          margin-right: 10px;
        }
        span {
          color: #ff4b3d;
        }
        .handle-state-punish {
          display: inline-block;
          padding-left: 20px;
          color: #0099ff;
        }
        .reviewStatus {
          margin-left: 20px;
        }
        .handle-state-delay {
          display: inline-block;
          padding-left: 20px;
          // color: #ff4b3d;
        }
      }
      .handle-oper {
        // switch start
        display: flex;
        /deep/.el-switch .el-switch__core {
          width: 60px !important;
          &::after {
            content: '不合格';
            text-indent: 20px;
            font-size: 12px;
            display: inline-block;
            word-break: keep-all;
            color: #ffffff;
          }
        }
        /deep/ .is-checked .el-switch__core {
          width: 60px !important;
          &::after {
            content: '合格';
            text-indent: -38px;
            color: #ffffff;
            font-size: 12px;
            display: inline-block;
            word-break: keep-all;
          }
        }
        // switch end
        .label {
          display: inline-block;
          margin-right: 24px;
          color: #1cc19c;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
      .handle-oper_handlePage {
        overflow-x: auto;
        // switch start
        display: flex;
        /deep/.el-switch .el-switch__core {
          width: 60px !important;
          &::after {
            content: '不合格';
            text-indent: 20px;
            font-size: 12px;
            display: inline-block;
            word-break: keep-all;
            color: #ffffff;
          }
        }
        /deep/ .is-checked .el-switch__core {
          width: 60px !important;
          &::after {
            content: '合格';
            text-indent: -38px;
            color: #ffffff;
            font-size: 12px;
            display: inline-block;
            word-break: keep-all;
          }
        }
        // switch end
        span {
          display: inline-block;
          margin-right: 24px;
          // &:last-child {
          //   margin-right: 0;
          // }
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
    .history {
      background-color: #eef5f9;
      margin-left: 45px;
      .history-indent {
        padding-left: 13px;
      }
      .history-title {
        background-color: #0099ff;
        color: #ffffff;
        width: 100px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      .history-data {
        margin-bottom: 5px;
        .history-content {
          word-break: break-all;
        }
      }
    }
  }
  .content-list_handlePage {
    padding-left: 15px;
    border-bottom: 1px solid #e0e0e0;
    .el-row {
      margin-bottom: 10px;
    }
  }
  h3 {
    font-size: 16px;
    margin: 0;
    white-space: normal;
    // margin-left: 52px;
  }
  .el-checkbox {
    margin-left: 15px;
    margin-right: 15px;
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
  .total-proof-list_handlePage {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .proof-list_handlePage {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 21px;
      .proof_handlePage {
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
    .check-proof_handlePage {
      margin-top: 21px;
      white-space: normal;
      /deep/ .el-upload--picture-card {
        margin-top: 0;
      }
      /deep/ .el-upload-list .el-upload-list__item {
        width: 220px;
        // height: 146px;
      }
    }
  }
  .flag {
    display: inline-block;
    position: relative;
    top: 4px;
    left: -10px;
    min-width: 0 !important;
    line-height: 20px;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: rgba(255, 75, 61, 1);
    .right {
      display: inline-block;
      position: absolute;
      min-width: 0 !important;
      top: 4px;
      left: 3px;
      width: 11px;
      height: 6px;
      border-style: solid;
      border-width: 0 0 1px 1px;
      border-color: rgba(255, 255, 255, 1);
      transform: rotate(-45deg);
    }
  }
  /deep/.el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
    top: 4px;
  }
  /deep/.el-dialog__wrapper .el-dialog__header {
    padding: 15px 20px 20px;
  }
  /deep/.el-checkbox:last-of-type {
    margin-right: 15px;
  }
}
</style>
