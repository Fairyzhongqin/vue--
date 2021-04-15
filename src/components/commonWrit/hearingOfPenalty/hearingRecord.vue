<template>
  <div>
    <!-- 听证笔录 -->
    <div class="hear_content">
      <el-form
        ref="hearInfo"
        :model="hearInfo"
        :rules="rules"
        label-width="130px"
        label-position="left"
        class="hearingRecordForm"
        :show-message="false"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="" prop="caseName">
              
              <div slot="label" class="slot_label">案件名称</div>
              <p class="caseName">{{hearInfo.caseName}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="" prop="deptName">
              
              <div slot="label" class="slot_label">主持听证机关</div>
              <p class="caseName">{{hearInfo.deptName}}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="" prop="place">
              
              <div slot="label" class="slot_label">听证会地点</div>
              <el-input v-model="hearInfo.place" placeholder="输入地点"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="startTime">
              
              <div slot="label" class="slot_label">开始时间</div>
              <el-date-picker
                v-model="hearInfo.startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="endTime">
              
              <div slot="label" class="slot_label">结束时间</div>
              <el-date-picker
                v-model="hearInfo.endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label=""  prop="moderator.nickName">
              
              <div slot="label" class="slot_label">主持人</div>
              <el-input placeholder="选择主持人"
                v-model="hearInfo.moderator.nickName"
                @focus="checkPeople('moderator', hearInfo.moderator)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('moderator', hearInfo.moderator)"></i>
              </el-input>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="hearings">
              
              <div slot="label" class="slot_label">听证员</div>
              <el-input placeholder="选择听证员"
                v-model="hearInfo.hearings"
                @focus="checkPeoples('hearings', hearInfo.hearings)">
                <i class="el-icon-more" slot="suffix" @click="checkPeoples('hearings', hearInfo.hearings)"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=""  prop="clerk.nickName">
              
              <div slot="label" class="slot_label">书记员</div>
              <el-input placeholder="选择书记员"
                v-model="hearInfo.clerk.nickName"
                @focus="checkPeople('clerk', hearInfo.clerk)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('clerk', hearInfo.clerk)"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
           <el-form-item label="" prop="investigators">
             
              <div slot="label" class="slot_label">调查人员</div>
              <el-input placeholder="选择调查人员"
                v-model="hearInfo.investigators"
                @focus="checkPeoples('investigators', hearInfo.investigators)">
                <i class="el-icon-more" slot="suffix" @click="checkPeoples('investigators', hearInfo.investigators)"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="8">
            <el-form-item label-width="200px" label="" prop="personName">
              
              <div slot="label" class="slot_label">申请听证人(个人)姓名</div>
              <el-input v-model="hearInfo.personName" placeholder="输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="60px" label="性别" prop="personSex">
              
              <el-input v-model="hearInfo.personSex" placeholder="输入性别"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="60px" label="年龄" prop="personAge">
              
              <el-input v-model="hearInfo.personAge" placeholder="输入年龄"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="150px" label="" prop="personJob">
              
              <div slot="label" class="slot_label">工作单位(职务)</div>
              <el-input v-model="hearInfo.personJob" placeholder="工作单位(职务)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label-width="200px" label="" prop="compName">
              
              <div slot="label" class="slot_label">申请听证人(单位)名称</div>
              <el-input v-model="hearInfo.compName" placeholder="输入名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label-width="145px" label="" prop="partyName">
            
              <div slot="label" class="slot_label">法定代表人</div>
              <el-input v-model="hearInfo.partyName" placeholder="输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="性别" prop="partySex" label-width="60px">
              
              <el-input v-model="hearInfo.partySex" placeholder="请输入性别"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="年龄" prop="partyAge" label-width="60px">
              
              <el-input v-model="hearInfo.partyAge" placeholder="输入年龄"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="partyJob">
              
              <div slot="label" class="slot_label">职务</div>
              <el-input v-model="hearInfo.partyJob" placeholder="请输入职务"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="" label-width="145px" prop="agentName">
              
              <div slot="label" class="slot_label">委托代理人</div>
              <el-input v-model="hearInfo.agentName" placeholder="输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="性别" prop="agentSex" label-width="60px">
              
              <el-input v-model="hearInfo.agentSex" placeholder="输入性别"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="年龄" prop="agentAge" label-width="60px">
              
              <el-input v-model="hearInfo.agentAge" placeholder="输入年龄"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="agentComp" label-width="150px">
              
              <div slot="label" class="slot_label">工作单位(职务)</div>
              <el-input v-model="hearInfo.agentComp" placeholder="输入工作单位(职务)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="" label-width="145px" prop="agentName2">
              
              <div slot="label" class="slot_label">委托代理人</div>
              <el-input v-model="hearInfo.agentName2" placeholder="输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="性别" prop="agentSex2" label-width="60px">
              
              <el-input v-model="hearInfo.agentSex2" placeholder="输入性别"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="年龄" prop="agentAge2" label-width="60px">
              
              <el-input v-model="hearInfo.agentAge2" placeholder="输入年龄"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="agentComp2" label-width="150px">
              
              <div slot="label" class="slot_label">工作单位(职务)</div>
              <el-input v-model="hearInfo.agentComp2" placeholder="输入工作单位(职务)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="" prop="thirdPerson">
              
              <div slot="label" class="slot_label">第三人</div>
              <el-input v-model="hearInfo.thirdPerson" placeholder="输入第三人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="otherPerson">
              
              <div slot="label" class="slot_label">其他参与人员</div>
              <el-input v-model="hearInfo.otherPerson" placeholder="其他参与人员"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="" prop="hearRecord">
              
              <div slot="label" class="slot_label">听证记录</div>
              <el-input v-model="hearInfo.reporter" type="textarea" placeholder="其他听证记录"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer" style="text-align: right">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="sure" :disabled="sureDisabled">保存并生成听证笔录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getWritParams,
  dateFormat,
  stringToDate,
  debounce
} from "@/utils/util";
import snDialogSelect from "@/components/snDialogSelect";
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
  created() {

    this.hearInfo.caseName = this.info.caseName;
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.hearInfo.deptName = this.userInfo.sysDeptEntity.parentName;
    if (this.info.writId) {
      this.echoed();
    } else {
      this.initWrite()

    }
  },
  mounted() {
    this.sure = debounce(this.sure, 3000);
  },
  data() {
    return {
      hearInfo: {
        caseName: "",
        deptName: "",
        moderator: {
          nickName: ""
        },
        hearings: '',
        positions: '',
        hearingsId: '',
        clerk: {
          nickName: ""
        },
        startTime: null,
        endTime: null
      },
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
        'investigators': [
          { required: true, trigger: "blur"}
        ],
        startTime: [{ required: true, trigger: "blur"}],
        endTime: [{ required: true, trigger: "blur"}],
      },
      userInfo: {},
      sureDisabled: false,
      investigators: '',
      investigatorsIds: '',
      investigatorsCardIds: ''
    };
  },
  methods: {
    initWrite() {
      this.hearInfo.moderator = {
        id: this.userInfo.userEntity.id,
        nickName: this.userInfo.userEntity.nickName,
        position: this.userInfo.userEntity.position
      };
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
                this.hearInfo.moderator.nickName = item.tagContent;
                break;
              case "tag8_id":
                // 主持人
                this.hearInfo.moderator.id = item.tagContent;
                break;
              case "tag14_id":
                this.hearInfo.clerk.id = item.tagContent;
                // 书记员
                break;
              case "tag14":
                this.hearInfo.clerk.nickName = item.tagContent;
                // 书记员
                break;
              case "hearings":
                this.hearInfo.hearings = item.tagContent;
                break;
              case "positions":
                this.hearInfo.positions = item.tagContent;
                break;
              case "hearingsId":
                this.hearInfo.hearingsId = item.tagContent;
                break;
              case "investigators":
                this.hearInfo.investigators = item.tagContent;
                break;
              case "investigatorsIds":
                this.hearInfo.investigatorsIds = item.tagContent;
                break;
              case "investigatorsCardIds":
                this.hearInfo.investigatorsCardIds = item.tagContent;
                break;

              default:
                break;
            }
          });
          this.$set(this.hearInfo)
        });
      this.$set(this.hearInfo)
    },
    checkPeople(type, cache) {
      this.$emit("selectPeople", type, cache);
    },
    // 点击取消按钮事件
    close() {
      this.$emit("close");
    },
    choicePeople(val) {
      console.info(val)
      if(val[0]._selfType === 'hearings') {
        this.hearInfo.hearings = ''
        this.hearInfo.positions = ''
        this.hearInfo.hearingsId = ''
        val.map((v,i) => {
          if (!i) {
            this.hearInfo.hearings += v.nickName ? v.nickName : ''
            this.hearInfo.positions += v.position ? v.position : ''
            this.hearInfo.hearingsId += v.id ? v.id : ''
          } else {
            this.hearInfo.hearings += v.nickName?`,${v.nickName}`:''
            this.hearInfo.positions += v.position?`,${v.position}`:''
            this.hearInfo.hearingsId += v.id?`,${v.id}`:''
          }
        })
      } else if (val[0]._selfType === 'investigators') {
        let _investigators = ''
        let _investigatorsIds = ''
        let _investigatorsCardIds = ''
        val.map((v,i) => {
          if (!i) {
            _investigators += v.nickName ? v.nickName : ''
            _investigatorsCardIds += v.cardId ? v.cardId : ''
            _investigatorsIds += v.id ? v.id : ''
          } else {
            _investigators += v.nickName?`,${v.nickName}`:''
            _investigatorsCardIds += v.cardId?`,${v.cardId}`:''
            _investigatorsIds += v.id?`,${v.id}`:''
          }
        })
        this.$nextTick(()=> {

          this.$set(this.hearInfo, 'investigators', _investigators)
          this.$set(this.hearInfo, 'investigatorsIds', _investigatorsIds)
          this.$set(this.hearInfo, 'investigatorsCardIds', _investigatorsCardIds)
        })
      } else {
        this.hearInfo[val[0]._selfType] = val[0];
      }
      console.info(this.hearInfo.investigators)
    },
    sure() {
      this.sureDisabled = true;
      setTimeout(() => {
        this.sureDisabled = false;
      }, 3000);
      console.info('听证笔录 hearInfo', this.hearInfo)
      this.$refs.hearInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.info.caseName,
            tag3: this.hearInfo.deptName,
            tag4: this.hearInfo.place,
            tag5: dateFormat(this.hearInfo.startTime, "yyyy年mm月dd日HH时MM分"),
            tag6: dateFormat(this.hearInfo.endTime, "yyyy年mm月dd日HH时MM分"),
            tag7: this.hearInfo.moderator.nickName,
            tag7_id: this.hearInfo.moderator.id,
            tag8: this.hearInfo.hearings,
            tag9: this.hearInfo.clerk.nickName,
            tag9_id: this.hearInfo.clerk.id,
            tag14: this.hearInfo.personName,
            tag15: this.hearInfo.personSex,
            tag16: this.hearInfo.personAge,
            tag17: this.hearInfo.personJob,
            tag18: this.hearInfo.compName,
            tag19: this.hearInfo.partyName,
            tag20: this.hearInfo.partySex,
            tag21: this.hearInfo.partyAge,
            tag22: this.hearInfo.partyJob,
            tag23: this.hearInfo.agentName,
            tag24: this.hearInfo.agentSex,
            tag25: this.hearInfo.agentAge,
            tag26: this.hearInfo.agentComp,
            tag27: this.hearInfo.agentName2,
            tag28: this.hearInfo.agentSex2,
            tag29: this.hearInfo.agentAge2,
            tag30: this.hearInfo.agentComp2,
            tag31: this.hearInfo.thirdPerson,
            tag32: this.hearInfo.otherPerson,
            tag33: this.hearInfo.reporter,
            Zcr: this.hearInfo.moderator.id, // 主持人
            Tzr: this.hearInfo.hearingsId, // 听证员
            Sjy: this.hearInfo.clerk.id, // 书记员
            hearings: this.hearInfo.hearings,
            positions: this.hearInfo.positions,
            hearingsId: this.hearInfo.hearingsId,
            investigators: this.hearInfo.investigators,
            investigatorsIds: this.hearInfo.investigatorsIds,
            investigatorsCardIds: this.hearInfo.investigatorsCardIds
          });

          data = [...data, ...this.readyData()]
          let params = {
              companyId: this.info.companyId,//执法检查模块制作文书传company_id
            businessId: this.info.id,
            contractorIds: this.info.executorId,
            isUpt: 1,
            writType: "TZBL",
            sourceId: this.info.caseId,
            data: data
          };
          this.$emit("createWrit", params);
        }
      });
    },
    echoed() {
      getWritDataByWritId({
        writId: this.info.writId
      }).then(res => {
        if (res.code === "0") {
          res.data.map(item => {
            switch (item.tagName) {
              case "tag4":
                // this.hearInfo.place = item.tagContent;
                this.$set(this.hearInfo, 'place', item.tagContent)
                break;
              case "tag5":
                this.hearInfo.startTime = item.tagContent ? stringToDate(item.tagContent
                    .replace("年", "-")
                    .replace("月", "-")
                    .replace("日", " ")
                    .replace("时", ":")
                    .replace("分", ":") + "00") : '';
                break;
              case "tag6":
                this.hearInfo.endTime = item.tagContent ? stringToDate(item.tagContent
                    .replace("年", "-")
                    .replace("月", "-")
                    .replace("日", " ")
                    .replace("时", ":")
                    .replace("分", ":") + "00") : '';
                break;
              case "tag7":
                this.hearInfo.moderator.nickName = item.tagContent;
                break;
              case "tag7_id":
                this.hearInfo.moderator.id = item.tagContent;
                break;
              case "tag8":
                this.hearInfo.hearings = item.tagContent;
                break;
              case "tag8_id":
                this.hearInfo.hearing.id = item.tagContent;
                break;
              case "tag9":
                this.hearInfo.clerk.nickName = item.tagContent;
                break;
              case "tag9_id":
                this.hearInfo.clerk.id = item.tagContent;
                break;

              case "tag14":
                // this.hearInfo.personName = item.tagContent;
                this.$set(this.hearInfo, 'personName', item.tagContent)
                break;
              case "tag15":
                // this.hearInfo.personSex = item.tagContent;
                this.$set(this.hearInfo, 'personSex', item.tagContent)
                break;
              case "tag16":
                // this.hearInfo.personAge = item.tagContent;
                this.$set(this.hearInfo, 'personAge', item.tagContent)
                break;
              case "tag17":
                // this.hearInfo.personJob = item.tagContent;
                this.$set(this.hearInfo, 'personJob', item.tagContent)
                break;
              case "tag18":
                // this.hearInfo.compName = item.tagContent;
                this.$set(this.hearInfo, 'compName', item.tagContent)
                break;
              case "tag19":
                // this.hearInfo.partyName = item.tagContent;
                this.$set(this.hearInfo, 'partyName', item.tagContent)
                break;
              case "tag20":
                // this.hearInfo.partySex = item.tagContent;
                this.$set(this.hearInfo, 'partySex', item.tagContent)
                break;
              case "tag21":
                // this.hearInfo.partyAge = item.tagContent;
                this.$set(this.hearInfo, 'partyAge', item.tagContent)
                break;
              case "tag22":
                // this.hearInfo.partyJob = item.tagContent;
                this.$set(this.hearInfo, 'partyJob', item.tagContent)
                break;
              case "tag23":
                // this.hearInfo.agentName = item.tagContent;
                this.$set(this.hearInfo, 'agentName', item.tagContent)
                break;
              case "tag24":
                // this.hearInfo.agentSex = item.tagContent;
                this.$set(this.hearInfo, 'agentSex', item.tagContent)
                break;
              case "tag25":
                // this.hearInfo.agentAge = item.tagContent;
                this.$set(this.hearInfo, 'agentAge', item.tagContent)
                break;
              case "tag26":
                // this.hearInfo.agentComp = item.tagContent;
                this.$set(this.hearInfo, 'agentComp', item.tagContent)
                break;
              case "tag27":
                // this.hearInfo.agentName2 = item.tagContent;
                this.$set(this.hearInfo, 'agentName2', item.tagContent)
                break;
              case "tag28":
                // this.hearInfo.agentSex2 = item.tagContent;
                this.$set(this.hearInfo, 'agentSex2', item.tagContent)
                break;
              case "tag29":
                // this.hearInfo.agentAge2 = item.tagContent;
                this.$set(this.hearInfo, 'agentAge2', item.tagContent)
                break;
              case "tag30":
                // this.hearInfo.agentComp2 = item.tagContent;
                this.$set(this.hearInfo, 'agentComp2', item.tagContent)
                break;
              case "tag31":
                // this.hearInfo.thirdPerson = item.tagContent;
                this.$set(this.hearInfo, 'thirdPerson', item.tagContent)
                break;
              case "tag32":
                // this.hearInfo.otherPerson = item.tagContent;
                this.$set(this.hearInfo, 'otherPerson', item.tagContent)
                break;
              case "tag33":
                // this.hearInfo.reporter = item.tagContent;
                this.$set(this.hearInfo, 'reporter', item.tagContent)
                break;
              case 'hearings':
                this.hearInfo.hearings = item.tagContent;
                break;
              case 'positions':
                this.hearInfo.positions = item.tagContent;
                break;
              case 'hearingsId':
                this.hearInfo.hearingsId = item.tagContent;
                break;
              case 'investigators':
                this.hearInfo.investigators = item.tagContent;
                break;
              case 'investigatorsCardIds':
                this.hearInfo.investigatorsCardIds = item.tagContent;
                break;
              case 'investigatorsIds':
                this.hearInfo.investigatorsIds = item.tagContent;
                break;

              default:
                break;
            }
          });
        }
      });
    },
    readyData() {
      let obj = []
      this.hearInfo.investigatorsIds.split(',').map((item, index) => {
        obj.push({
          tagContent: this.hearInfo.investigators.split(',')[index],
          tagName: `entity${index+1}-col1`
        })
        obj.push({
          tagContent: this.hearInfo.investigatorsCardIds.split(',')[index],
          tagName: `entity${index+1}-col2`
        })
      })
      return obj
    },
    checkPeoples(type) {
      let cache = []
      if (this.hearInfo.hearingsId && type === 'hearings') {
        this.hearInfo.hearingsId.split(',').map((item,i) => {
          cache.push({
            id: item,
            position: this.hearInfo.positions.split(',')[i],
            nickName: this.hearInfo.hearings.split(',')[i]
          })
        })
      }
      if (this.hearInfo.investigatorsIds && type === 'investigators') {
        this.hearInfo.investigatorsIds.split(',').map((item,i) => {
          cache.push({
            id: item,
            nickName: this.hearInfo.investigators.split(',')[i],
            cardId: this.hearInfo.investigatorsCardIds.split(',')[i]
          })
        })
      }
      console.info('cache',cache)
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
.hear_content {
  padding: 8px 16px 0;
  .hearingRecordForm {
    display: flex;
    flex-direction: column;
    .el-row {
      // border: 1px solid salmon;
      margin-bottom: 5px;
      &:last-child {
        height: 62px;
      }
      .el-form-item {
        margin-bottom: 0;
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
