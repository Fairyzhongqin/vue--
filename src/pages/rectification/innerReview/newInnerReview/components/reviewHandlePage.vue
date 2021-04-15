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
          <el-col :span="7">复查人员：{{option.reviewName}}</el-col>
        </el-row>
      </div>
      <!-- originProbList 就是data里的problist -->
      <div v-show="originProbList && originProbList.length > 0">
        <div v-for="(tips, index) in originProbList" :key="tips.id" class="first_content">
          <!-- 项目类别 -->
          <div class="first-content-type left-indent">
            <span>{{ index + 1}}</span>
            检查项目类别：{{tips.discretionTypeName}}
          </div>
          <!-- 检查项内容 -->
          <div class="first-content-primary-tip">
            <!-- 详情时 -->
            <el-checkbox
              v-if="newReviewflag === 'flagNewDetail'"
              v-model="tips.checked"
              @change="selectTips(true, index)"
              :disabled="(newReviewflag === 'flagNewDetail') || (tips.isReview === '1' && tips.isDelay === '2') || (tips.isReview === '1' && tips.isDelay === '3')"
              :style="{visibility: (!tips.children || tips.children.length === 0) ? 'visible' : 'hidden'}"
            ></el-checkbox>
            <!-- 复查时 -->
            <el-checkbox
              v-if="newReviewflag === 'flagNewReview' "
              :disabled="(tips.isReview === '1' && tips.isDelay === '2') || (tips.isReview === '1' && tips.isDelay === '3')  || (tips.isReview === '0' && tips.isQualified === '0')"
              v-model="tips.checked"
              @change="selectTips(true, index)"
              :style="{visibility: (!tips.children || tips.children.length === 0) ? 'visible' : 'hidden'}"
            ></el-checkbox>
            <h3>
              <span>检查内容：{{tips.checkItem !== null ? tips.checkItem : tips.checkContent}}</span>
              <span v-if="!tips.children || tips.children.length === 0" class="fatherDangerLogo">
                &#12288;&#12288;
                <img src="../../../../../assets/imgs/标签.png" />
                <span>{{ tips.isGreat === '1' ? '一般隐患' : '重大隐患' }}</span>
              </span>
            </h3>
          </div>
          <!-- problist 有子项 -->
          <div v-if="tips.children && tips.children.length > 0">
            <!-- <div v-for="(item, sonIndex) in tips.children" :key="item.discRulesId"> -->
            <div v-for="(item, sonIndex) in tips.children" :key="item.id">
              <!-- 子项检查项 -->
              <div class="second-content-primary-item">
                <el-checkbox
                  v-if="newReviewflag === 'flagNewDetail'"
                  v-model="item.checked"
                  :disabled="(newReviewflag === 'flagNewDetail' ) || (item.isReview === '0') || (item.isReview === '1' && item.isDelay === '2') || (item.isReview === '1' && item.isDelay === '3')"
                  @change="selectTips(false, index, sonIndex)"
                ></el-checkbox>
                <el-checkbox
                  v-if="newReviewflag === 'flagNewReview'"
                  :disabled="(item.isReview === '1' && item.isDelay === '2') || (item.isReview === '1' && item.isDelay === '3') || (item.isReview === '0' && item.isQualified === '0')"
                  v-model="item.checked"
                  @change="selectTips(false, index, sonIndex)"
                ></el-checkbox>
                <h3>
                  <span class="second-content-primary-item-index">{{ sonIndex + 1 }}</span>
                  {{item.checkItem}}
                  &#12288;&#12288;
                  <img
                    src="../../../../../assets/imgs/标签.png"
                  />
                  <span>{{ item.isGreat === '1' ? '一般隐患' : '重大隐患' }}</span>
                </h3>
              </div>
              <!-- 子项检查描述 -->
              <div class="left-indent">
                <div style="line-height: 32px">检查描述：{{ item.negativeDesc }}</div>
              </div>
              <div>
                <!-- <div v-if="newReviewflag !== 'flagNewDetail'"> -->
                <div class="input-des left-indent noSureLogo">
                  <span>整改时限：{{!item.expireTime ? '暂无':item.expireTime}}</span>
                </div>
                <!-- 已复查 不可操作  -->
                <div v-if="item.isReview === '0'">
                  <div class="input-des left-indent">
                    <span class="reviewCheckSure">复查时间：{{item.reviewTime}}</span>
                  </div>
                  <div class="input-des left-indent">
                    <span class="reviewCheckSure">复查意见：{{item.reviewOpinion}}</span>
                  </div>
                </div>
                <!-- 未复查 可操作 -->
                <div v-if="item.isReview === '1' && item.isDelay === '1'">
                  <div class="input-des left-indent">
                    <span class="reviewCheckSure">复查时间：</span>
                    <el-date-picker
                      v-model="item.reviewTime"
                      type="date"
                      format="yyyy-MM-dd"
                      placeholder="请选择复查时间"
                      value-format="yyyy-MM-dd "
                      :picker-options="pickerOptions"
                      v-if="newReviewflag === 'flagNewReview'"
                    ></el-date-picker>
                    <span v-if="newReviewflag === 'flagNewDetail'">暂无</span>
                  </div>
                  <div class="input-des left-indent">
                    <span class="reviewCheckSure">复查意见：</span>
                    <el-input
                      placeholder="请输入复查意见"
                      v-model="item.reviewOpinion"
                      type="textarea"
                      autosize
                      v-if="newReviewflag === 'flagNewReview'"
                    ></el-input>
                    <span v-if="newReviewflag === 'flagNewDetail'">暂无</span>
                  </div>
                </div>
                <!-- 延期中 不展示 时间和意见 和结论 -->
                <div v-if="item.isReview === '0' && item.isDelay === '2'">
                  <div class="input-des left-indent">
                    <span class="isDelay">&nbsp; 延期中</span>
                  </div>
                </div>
                <!-- 延期通过 -->
                <div v-if="item.isReview === '0' && item.isDelay === '3'">
                  <div class="input-des left-indent">
                    <span class="isDelay">&nbsp; 延期通过</span>
                  </div>
                </div>
              </div>
              <div class="conclusion">
                <!-- 未复查时 -->
                <span v-if=" item.isReview === '1' && item.isDelay === '1'">
                  复查结论：
                  <el-switch
                    v-model="item.isQualified"
                    active-value="0"
                    inactive-value="1"
                    active-color="#13ce66"
                    inactive-color="#ccc"
                    v-if="newReviewflag === 'flagNewReview'"
                  ></el-switch>
                  <span v-if="newReviewflag === 'flagNewDetail'">暂无</span>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <i
                    class="isReviewYet"
                    v-if="item.isReview === '1' && item.isDelay === '1'"
                  >未复查</i>
                  <i class="isReviewQuestion" v-if="!item.isReview">复查状态出错，请联系管理员</i>
                </span>
                <!-- 已复查 -->
                <span v-if="item.isReview === '0'">
                  复查结论: &nbsp;{{ item.isQualified === '0' ? "合格" :item.isQualified === '1'? '不合格':'复查结论出错，请联系管理员'}}
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <i
                    class="isReviewAlready"
                    v-if="item.isReview === '0'"
                  >已复查</i>
                </span>
                <span
                  class="label"
                  @click.prevent="getIndex(item.id)"
                  v-if="newReviewflag === 'flagNewReview' && item.isReview === '1'"
                >上传证据</span>
                <!-- @click.prevent="getIndex(item.discRulesId)" -->
              </div>

              <div class="handle-state left-indent">
                <span class="handle-state-punish exContentSty">{{item.examineContent}}</span>
                <span
                  class="handle-state-delay"
                  v-if="newReviewflag === 'flagNewDelay'"
                >{{item.isDelay === "2" ? "延期中":item.isDelay === "3" ? "延期通过" :''}}</span>
              </div>
              <br />
            </div>
          </div>
          <!-- problist 无子项 -->
          <div v-show="!tips.children || tips.children.length === 0" class="left-indent">
            <div style="line-height: 32px">检查描述：{{ tips.negativeDesc }}</div>
          </div>
          <div v-if="!tips.children || tips.children.length === 0">
            <div class="input-des left-indent noSureLogo">
              <span>整改时限：{{!tips.expireTime ? '暂无':tips.expireTime}}</span>
            </div>
            <!--  isReview === '0' 已复查 不可操作 -->
            <div v-if="tips.isReview === '0'">
              <div class="input-des left-indent">
                <span class="reviewCheckSure">复查时间：{{tips.reviewTime}}</span>
              </div>
              <div class="input-des left-indent">
                <span class="reviewCheckSure">复查意见：{{tips.reviewOpinion}}</span>
              </div>
            </div>
            <!-- 未复查 可以操作  isReview === 1 和 isDelay ===1 -->
            <div v-if="tips.isReview === '1' && tips.isDelay === '1'">
              <div class="input-des left-indent">
                <span class="reviewCheckSure">复查时间：</span>
                <el-date-picker
                  v-model="tips.reviewTime"
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="请选择复查时间"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  v-if="newReviewflag === 'flagNewReview'"
                ></el-date-picker>
                <span v-if="newReviewflag === 'flagNewDetail'">暂无</span>
              </div>
              <div class="input-des left-indent">
                <span class="reviewCheckSure">复查意见：</span>
                <el-input
                  placeholder="请输入复查意见"
                  v-model="tips.reviewOpinion"
                  :autosize="true"
                  type="textarea"
                  v-if="newReviewflag === 'flagNewReview'"
                ></el-input>
                <span v-if="newReviewflag === 'flagNewDetail'">暂无</span>
              </div>
            </div>
            <!-- 延期中  isReview === 1 和  isDelay === 2 -->
            <div v-if="tips.isReview === '1' && tips.isDelay === '2'">
              <div class="input-des left-indent">
                <span class="isDelay">&nbsp; 延期中</span>
              </div>
            </div>
            <!-- 延期通过  isReview === 1 和  isDelay === 2 -->
            <div v-if="tips.isReview === '1' && tips.isDelay === '3'">
              <div class="input-des left-indent">
                <span class="isDelay">&nbsp; 延期通过</span>
              </div>
            </div>
          </div>
          <!-- 复查结论 -->
          <div class="conclusion" v-if="!tips.children || tips.children.length === 0">
            <!-- 未复查 -->
            <span v-if="tips.isReview === '1' && tips.isDelay === '1'">
              复查结论：
              <el-switch
                v-model="tips.isQualified"
                active-value="0"
                inactive-value="1"
                active-color="#13ce66"
                inactive-color="#ccc"
                v-if="newReviewflag === 'flagNewReview'"
              ></el-switch>
              <span v-if="newReviewflag === 'flagNewDetail'">暂无</span>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <i
                class="isReviewYet"
                v-if="tips.isReview === '1' && tips.isDelay === '1'"
              >未复查</i>
              <i class="isReviewQuestion" v-if="!tips.isReview">复查状态出错，请联系管理员</i>
            </span>
            <!-- 已复查 -->
            <span v-if="tips.isReview === '0'">
              复查结论: &nbsp;{{ tips.isQualified === '0' ? "合格" :tips.isQualified === '1'? '不合格':'复查结论出错，请联系管理员'}}
              &nbsp; &nbsp; &nbsp; &nbsp;
              <i
                class="isReviewAlready"
                v-if="tips.isReview === '0'"
              >已复查</i>
            </span>
            <span
              class="label"
              @click.prevent="getIndex(tips.id)"
              v-if="newReviewflag === 'flagNewReview' && tips.isReview === '1' && tips.isDelay === '1'"
            >上传证据</span>
            <!-- @click.prevent="getIndex(tips.discId)" -->
          </div>

          <div class="handle" v-if="!tips.children || tips.children.length === 0">
            <div class="handle-state left-indent">
              <span class="handle-state-punish">{{tips.examineContent}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 延期功能页面 不展示证据列表 -->
    <div class="total-proof-list_handlePage">
      <div v-if="proofList && proofList.length > 0" class="proof-list_handlePage">
        <div v-for="(item, index) in proofList" :key="index" class="proof_handlePage">
          <down-proof
            :proof="item"
            :canDel="newReviewflag !== 'flagNewDetail'"
            @removeProof="delProof"
            type="review"
          ></down-proof>
        </div>
      </div>
      <div class="check-proof_handlePage" v-if="newReviewflag === 'flagNewReview'">
        <upload-proof
          ref="proof"
          @getUploadMsg="getMsg"
          :fileDetail="fileData"
          :uploadType="'rectificationDelay'"
          v-bind="$attrs"
          @delProof="newDelProof"
        ></upload-proof>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import uploadProof from '@components/uploadProof/index'
import downProof from '@components/downProof/index'
import { saveRectificationReview } from '@/api/rectification/index'
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
      // fileData: {}, // 上传证据返回的信息
      fileData: {
        sourceId: this.$store.state.newReviewId,
        type: '0'
      }, // 设置上传检查项证据材料的参数
      publicProof: [], // 公共证据
      // delayCheckBoxStatus: false,
      // 禁止选择当前时间之前的检查时间
      pickerOptions: {
        /* disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        } */
        // 设置选择三天之前到今天的日期
        disabledDate(time) {
          let curDate = new Date().getTime()
          let three = 3 * 24 * 3600 * 1000
          let threeDays = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeDays
        }
      },
      // saveProofOnly: false,//以前用的只是单纯的存储证据的标志
      addCheckItemPicList: [] //检查项证据id的临时缓存项
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
    // 在复查页面下 上传证据操作
    getIndex(id) {
      // newReviewflag: new Date(),
      this.fileData = { sourceId: id, type: '1' }
      // 以前的索引是1  现在是0
      this.$refs.proof.$refs.inner_upload.$children[0].handleClick()
    },
    // 上传证据成功之后和相应的检查项进行关联
    getMsg(uploadInfo) {
      // 先判断是不是公共证据 若是的话 直接提示保存成功
      // 若是检查项证据 则走检查项证据数据处理 type 0 公共证据 1 检查项证据
      let id = uploadInfo.sourceId
      let type = uploadInfo.type
      if (type === '0') {
        if (uploadInfo.msg === 'success') {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          // 重新刷新证据数据
          this.$emit('needUpdate')
        } else {
          this.$message({
            type: 'error',
            message: '上传失败，请重试!'
          })
        }
      } else if (type === '1') {
        // 检查项证据
        // 检查项证据
        if (uploadInfo.msg === 'success') {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.$emit('needUpdate')
          // 检查项证据
          /*   this.originProbList.forEach(item => {
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
                this.addCheckItemPicList.push(item.accessoryId)
              } else {
                let IDListAll = []
                IDListAll.push(uploadInfo.accessoryId)
                this.addCheckItemPicList = [...this.addCheckItemPicList, ...IDListAll]
                item.accessoryId = this.addCheckItemPicList ? this.addCheckItemPicList.join(',') : ''
              }
            }
          }) */
        } else {
          this.$message({
            type: 'error',
            message: '上传失败，请重试!'
          })
        }
        /*   this.originProbList.forEach(item => {
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
              this.addCheckItemPicList.push(item.accessoryId)
            } else {
              let IDListAll = []
              IDListAll.push(uploadInfo.accessoryId)
              this.addCheckItemPicList = [...this.addCheckItemPicList, ...IDListAll]
              item.accessoryId = this.addCheckItemPicList ? this.addCheckItemPicList.join(',') : ''
            }
          }
        }) */
      } else {
        throw new Error('undefined type')
      }
      // if (id) {
      //   this.originProbList.forEach(item => {
      //     if (item.children && item.children.length > 0) {
      //       item.children.forEach(i => {
      //         if (i.discRulesId === id) {
      //           i.accessoryList = i.accessoryList ? i.accessoryList : []
      //           i.accessoryList.push(uploadInfo.accessoryId)
      //           i.accessoryId = i.accessoryList.join(',')
      //         }
      //       })
      //     }
      //     if (item.discId === id) {
      //       //没有children
      //       if (item.accessoryId === '') {
      //         item.accessoryId = uploadInfo.accessoryId
      //         this.addCheckItemPicList.push(item.accessoryId)
      //       } else {
      //         let IDListAll = []
      //         IDListAll.push(uploadInfo.accessoryId)
      //         this.addCheckItemPicList = [...this.addCheckItemPicList, ...IDListAll]
      //         item.accessoryId = this.addCheckItemPicList.join(',')
      //       }
      //     }
      //   })
      // } else {
      //   // 没有sourceId说明是公共证据 则存在publicProof里
      //   this.publicProof.push(uploadInfo.accessoryId)
      //   this.saveProofOnly = true
      //   this.$emit('save')
      // }
    },
    // 选择有隐患的检查项
    selectTips(state, index, secondIndex) {
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
      // console.info("delProof==>", id);
      let index = -1
      this.proofList.some((item, i) => {
        index = i
        return item.accessoryId === id
      })
      this.proofList.splice(index, 1)
      this.$emit('needUpdate')
    }
    // 重新取下详情的数据
  },
  created() {},
  mounted() {
    /*   console.info('延期整改复查===>originProbList', this.originProbList)
    console.info('延期整改复查===>newReviewflag', this.newReviewflag)
    console.info('延期整改复查===>flag', this.flag) */
  },
  computed: {
    ...mapState(['newReviewflag', 'flag'])
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
      h3 {
        .fatherDangerLogo {
          img {
            width: 11px;
            height: 17px;
            margin-right: 5px;
            vertical-align: middle;
          }
          span {
            color: #ff4b3d;
          }
        }
      }
    }
    .isDelay {
      color: #ff4b3d;
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
        color: #333333;
      }
      h3 {
        img {
          width: 11px;
          height: 17px;
          margin-right: 5px;
          vertical-align: middle;
        }
        span {
          color: #ff4b3d;
        }
      }
    }
    .input-des {
      margin-bottom: 5px;
      white-space: nowrap;
      word-break: break-all;
      line-height: 35px;
      /deep/ .el-textarea {
        width: 90%;
      }
    }
    .handle {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      .handle-state {
        display: flex;
        flex-direction: row;
        .handle-state-punish {
          display: inline-block;
          padding-left: 10px;
          color: #0099ff;
        }
        .handle-state-delay {
          display: inline-block;
          padding-left: 20px;
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
    .conclusion {
      // color: ;
      padding-left: 60px;
      display: flex;
      justify-content: space-between;
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
      .isReviewAlready {
        color: #1cc19c;
        font-style: normal;
        font-weight: normal;
      }
      .isReviewYet {
        color: red;
        font-style: normal;
        font-weight: normal;
      }
      .isReviewQuestion {
        color: orangered;
        font-style: normal;
        font-weight: normal;
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
    .noSureLogo {
      padding-left: 62px;
    }
    .exContentSty {
      display: inline-block;
      padding-left: 10px;
      color: #0099ff;
      margin: 10px 0;
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
  .newReviewflag {
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
