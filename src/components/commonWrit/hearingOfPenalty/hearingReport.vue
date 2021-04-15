<template>
  <div>
    <!-- 听证报告 -->
    <div class="hear_report_content">
      <el-form
        ref="reportInfo"
        :model="reportInfo"
        :rules="rules"
        label-position="right"
        label-width="110px"
        class="hearingReportForm"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
              <p class="caseName">{{reportInfo.caseName}}</p>
            </el-form-item>
          </el-col>


          <el-col :span="8">

            <el-form-item label=""  prop="moderator.nickName">
              <div slot="label" class="slot_label">主持人</div>
              <el-input placeholder="选择主持人"
                v-model="reportInfo.moderator.nickName"
                @focus="checkPeople('moderator', reportInfo.moderator)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('moderator', reportInfo.moderator)"></i>
              </el-input>
            </el-form-item>



          </el-col>
          <el-col :span="8">

            <el-form-item label="" prop="hearings">
              <div slot="label" class="slot_label">听证员</div>
              <el-input placeholder="选择听证员"
                v-model="reportInfo.hearings"
                @focus="checkPeople('hearings', reportInfo.hearings)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('hearings', reportInfo.hearings)"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=""  prop="clerk.nickName">
              <div slot="label" class="slot_label">书记员</div>
              <el-input placeholder="选择书记员"
                v-model="reportInfo.clerk.nickName"
                @focus="checkPeople('clerk', reportInfo.clerk)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('clerk', reportInfo.clerk)"></i>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col class="lh_22">
            <el-form-item label="" prop="baseInfo">
              <div slot="label" class="slot_label">听证会基本情况摘要</div>
              <el-input
                v-model="reportInfo.baseInfo"
                type="textarea"
                :autosize="{minRows:2}"
                placeholder="请输入基本情况"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="" prop="moderatorIdea">
              <div slot="label" class="slot_label">主持人意见</div>
              <el-input type="textarea" :autosize="{minRows:1}" v-model="reportInfo.moderatorIdea" placeholder="请输入意见"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <!-- <el-row>
          <el-col>
            <el-form-item label="负责人审核意见：" prop="auditIdea">
              <el-input v-model="reportInfo.auditIdea" placeholder="请输入意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>-->
      </el-form>

      <div class="dialog-footer" style="text-align: right">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="sure" :disabled="sureDisabled">保存并生成听证会报告书</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import snDialogSelect from "@/components/snDialogSelect";
import { getWritParams, debounce } from "@/utils/util";
import { getWritDataByWritId, getWritInfo } from "@/api/fileRelated";
export default {
  components: {
    snDialogSelect
  },
  props: {
    info: {
      type: Object
    },
    selectedPeople: {
      type: Array
    }
  },
  data() {
    return {
      rules: {},
      reportInfo: {
        moderator: {
          nickName: ""
        },
        hearings: '',
        positions: '',
        hearingsId: '',
        clerk: {
          nickName: ""
        }
      },
      sureDisabled: false,
      rules: {
        'moderator.nickName': [
          { required: true, trigger: "blur" }
        ],
        'hearings': [
          { required: true, trigger: "change" }
        ],
        'clerk.nickName': [
          { required: true, trigger: "change" }
        ],
        baseInfo: [

          { required: true, trigger: "blur" }
        ],
        moderatorIdea: [

          { required: true, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.reportInfo.caseName = this.info.caseName;
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (this.info.writId) {
      this.echoed();
    } else {
      this.initWrite();
    }
  },
  mounted() {
    this.sure = debounce(this.sure, 3000);
  },
  methods: {
    initWrite() {
      this.reportInfo.moderator.nickName = this.userInfo.userEntity.nickName;
      this.reportInfo.moderator.id = this.userInfo.userEntity.id
      getWritInfo({
        businessId: this.info.id,
        type: "XXCFTZHTZS"
      })
        .then(res => {
          if (res.data[0]) {
            return getWritDataByWritId({
              writId: res.data[0].writId
            });
          }
        })
        .then(res => {
          res.data.map(item => {
            switch (item.tagName) {
              case "tag8":
                // 主持人
                this.reportInfo.moderator.nickName = item.tagContent;
                break;
              case "tag8_id":
                // 主持人
                this.reportInfo.moderator.id = item.tagContent;
                break;
              case "tag14_id":
                this.reportInfo.clerk.id = item.tagContent;
                // 书记员
                break;
              case "tag14":
                this.reportInfo.clerk.nickName = item.tagContent;
                // 书记员
                break;
              case "hearings":
                this.reportInfo.hearings = item.tagContent;

                break;
              case "positions":
                this.reportInfo.positions = item.tagContent;

                break;
              case "hearingsId":
                this.reportInfo.hearingsId = item.tagContent;

                break;
              default:
                break;
            }
          });
          this.$set(this.reportInfo)
        });
    },
    checkPeople(type,cache) {
      this.$emit("selectPeople", type, cache);
    },
    sure() {
      this.sureDisabled = true;
      setTimeout(() => {
        this.sureDisabled = false;
      }, 3000);
      this.$refs.reportInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.info.caseName,
            tag3: this.reportInfo.moderator.nickName,
            tag3_id: this.reportInfo.moderator.id,
            Zcr: this.reportInfo.moderator.id,
            tag4: this.reportInfo.hearings,
            tag5: this.reportInfo.clerk.nickName,
            tag5_id: this.reportInfo.clerk.id,
            tag6: this.reportInfo.baseInfo,
            tag7: this.reportInfo.moderatorIdea,
            hearings: this.reportInfo.hearings,
            positions: this.reportInfo.positions,
            hearingsId: this.reportInfo.hearingsId,

            // tag8: this.reportInfo.auditIdea
          });
          let params = {
              companyId: this.info.companyId,//执法检查模块制作文书传company_id
            businessId: this.info.id,
            contractorIds: this.userInfo.userEntity.id,
            writType: "TZHBGS",
            sourceId: this.info.caseId,
            data: data
          };
          this.$emit("createWrit", params);
        }
      });
    },
    // 点击取消按钮事件
    close() {
      this.$emit("close");
    },
    choicePeople(val) {
      if(val[0]._selfType === 'hearings') {
        this.reportInfo.hearings = ''
        this.reportInfo.positions = ''
        this.reportInfo.hearingsId = ''
        val.map((v,i) => {
          if (!i) {
            this.reportInfo.hearings += v.nickName?v.nickName:''
            this.reportInfo.positions += v.position?v.position:''
            this.reportInfo.hearingsId += v.id?v.id:''
          } else {
            this.reportInfo.hearings += v.nickName?`,${v.nickName}`:''
            this.reportInfo.positions += v.position?`,${v.position}`:''
            this.reportInfo.hearingsId += v.id?`,${v.id}`:''
          }
        })
      } else {

        this.reportInfo[val[0]._selfType] = val[0];
      }
    },
    echoed() {
      getWritDataByWritId({
        writId: this.info.writId
      }).then(res => {
        if (res.code === "0") {
          res.data.map(item => {
            switch (item.tagName) {
              case "tag3":
                this.reportInfo.moderator.nickName = item.tagContent;
                break;
              case "tag3_id":
                this.reportInfo.moderator.id = item.tagContent;
                break;
              case "tag4":
                this.reportInfo.hearings = item.tagContent;
                break;
              case "tag5":
                this.reportInfo.clerk.nickName = item.tagContent;
                break;
              case "tag5_id":
                this.reportInfo.clerk.id = item.tagContent;
                break;
              case "tag6":
                this.$set(this.reportInfo, "baseInfo", item.tagContent);
                break;
              case "tag7":
                this.$set(this.reportInfo, "moderatorIdea", item.tagContent);
                break;
              case 'hearings':
                this.reportInfo.hearings = item.tagContent;
                break;
              case 'positions':
                this.reportInfo.positions = item.tagContent;
                break;
              case 'hearingsId':
                this.reportInfo.hearingsId = item.tagContent;
                break;
              /* case "tag8":
                this.$set(this.reportInfo, 'auditIdea', item.tagContent)
                break; */
              default:
                break;
            }
          });
        }
      });
    },
    checkPeoples(type) {
      let cache = []
      if (this.reportInfo.hearingsId) {
        this.reportInfo.hearingsId.split(',').map((item,i) => {
          cache.push({
            id: item,
            position: this.reportInfo.positions.split(',')[i],
            nickName: this.reportInfo.hearings.split(',')[i]
          })
        })
      }

      this.$emit("selectPeoples", type, cache)
    },
  },
  watch: {
    selectedPeople: {
      handler: function(val, oldVal) {
        this.choicePeople(val);
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.hear_report_content {
  padding: 8px 16px 0;
  .hearingReportForm {
    display: flex;
    flex-direction: column;
    .el-row {
      margin-bottom: 5px;
      // border: 1px solid salmon;
      // &:nth-child(3) {
      //   height: 60px;
      // }
      .lh_22 {

        /deep/.el-form-item__label {
          line-height: 22px;
        }
      }
      .el-form-item {
        margin-bottom: 0;
        .el-input {
          width: 70%;
        }
      }
    }
  }
  p.caseName {
    line-height: 40px;
    margin: 0;
    color: #333333;
    font-weight: 500;
  }
  /deep/.el-col {
    padding-left: 10px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
}
</style>
