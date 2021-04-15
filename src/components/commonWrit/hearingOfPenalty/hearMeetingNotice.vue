<template>
  <div>
    <!-- 行政处罚听证会通知书 -->
    <div class="content">
      <el-form
        ref="noticeInfo"
        :rules="rules"
        :model="noticeInfo"
        :show-message="false"
        label-width="110px"
        label-position="left"
        class="hearingMeetNoticeForm"
      >
        <el-row>
          <el-form-item label="">
            
              <div slot="label" class="slot_label">当事人</div>
            <p class="caseName">{{ noticeInfo.partyName }}</p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="">
            
              <div slot="label" class="slot_label">案件名称</div>
            <p class="caseName">{{ noticeInfo.caseName }}</p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="place">
            
              <div slot="label" class="slot_label">听证会地点</div>
            <el-input v-model="noticeInfo.place" placeholder="输入地点"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="timeFrame">
              
              <div slot="label" class="slot_label">听证会时间</div>
              <el-date-picker v-model="noticeInfo.timeFrame" format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="noticeInfo.open !== null">
            <el-form-item>
              <el-switch v-model="noticeInfo.open" active-text="公开听证" inactive-text="不公开听证"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 以下四个人需要选择 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="moderator.nickName">
              
              <div slot="label" class="slot_label">主持人</div>
              <el-input placeholder="选择主持人" v-model="noticeInfo.moderator.nickName" @focus="checkPeople('moderator', noticeInfo.moderator)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('moderator', noticeInfo.moderator)"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="hearings">
              
              <div slot="label" class="slot_label">听证员</div>
              <el-input placeholder="选择听证员" v-model="noticeInfo.hearings" @focus="checkPeoples('hearings', noticeInfo.hearings)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('hearings', noticeInfo.hearings)"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="clerk.nickName">
              
              <div slot="label" class="slot_label">书记员</div>
              <el-input placeholder="选择书记员" v-model="noticeInfo.clerk.nickName" @focus="checkPeople('clerk', noticeInfo.clerk)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('clerk', noticeInfo.clerk)"></i>
              </el-input>
              <!-- <sn-dialog-select
                placeholder="选择书记员"
                v-model="noticeInfo.clerk.nickName"
                @clickHandle="checkPeople('clerk', noticeInfo.clerk)"
              ></sn-dialog-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="lxr.nickName">
              
              <div slot="label" class="slot_label">联系人</div>
              <el-input placeholder="选择联系人" v-model="noticeInfo.lxr.nickName" @focus="checkPeople('lxr', noticeInfo.lxr)">
                <i class="el-icon-more" slot="suffix" @click="checkPeople('lxr', noticeInfo.lxr)"></i>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="" prop="postCode">
              
              <div slot="label" class="slot_label">邮政编码</div>
              <el-input v-model="noticeInfo.postCode" maxlength="6" placeholder="输入邮政编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="lxr.mobile">
              
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="noticeInfo.lxr.mobile" maxlength="12" placeholder="输入联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="" prop="address">
              
              <div slot="label" class="slot_label">部门地址</div>
              <el-input v-model="noticeInfo.address" placeholder="输入地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="sure">保存并生成行政处罚听证会通知书</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, stringToDate, debounce, getFirstErrMsg } from '@/utils/util'
import { getWritDataByWritId } from '@/api/fileRelated'
import snDialogSelect from '@/components/snDialogSelect'
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
  mounted() {
    this.sure = debounce(this.sure, 3000)
  },
  data() {
    return {
      noticeInfo: {
        caseName: '',
        partyName: '',
        timeFrame: '',
        place: '',
        open: true,
        moderator: {
          nickName: ''
        },
        hearings: '',
        positions: '',
        hearingsId: '',
        clerk: {
          nickName: ''
        },
        lxr: {
          nickName: ''
        }
      },
      rules: {
        place: [{ required: true, trigger: 'blur', message: '请输入地点' }],
        timeFrame: [{ required: true, trigger: 'blur', message: '请选择时间' }],
        'moderator.nickName': [{ required: true, trigger: 'blur', message: '请选择主持人' }],
        hearings: [{ required: true, trigger: 'blur', message: '请选择听证员' }],
        'clerk.nickName': [{ required: true, trigger: 'blur', message: '请选择书记员' }],
        'lxr.nickName': [{ required: true, trigger: 'blur', message: '请选择联系人' }],
        'lxr.mobile': [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入电话号码'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        address: [{ required: true, trigger: 'blur', message: '请填写地址' }],
        postCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入邮编'
          },
          {
            pattern: /^(0[1234567]|1[012356]|2[01234567]|3[0123456]|4[01234567]|5[1234567]|6[1234567]|7[012345]|8[013456])\d{4}$/,
            trigger: ['blur', 'change'],
            message: '您输入的邮编格式不正确'
          }
        ]
      },
      userInfo: {}
    }
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.noticeInfo.caseName = this.info.caseName
    this.noticeInfo.partyName = this.info.partyName
    if (this.info.writId) {
      this.echoed()
    } else {
      this.noticeInfo.moderator = {
        id: this.userInfo.userEntity.id,
        nickName: this.userInfo.userEntity.nickName,
        position: this.userInfo.userEntity.position
      }
      this.noticeInfo.lxr = {
        id: this.userInfo.userEntity.id,
        nickName: this.userInfo.userEntity.nickName,
        position: this.userInfo.userEntity.position,
        mobile: this.userInfo.userEntity.mobile
      }
      this.$set(this.noticeInfo, 'address', this.userInfo.sysDeptEntity.deptAddress)
      this.$set(this.noticeInfo, 'postCode', this.userInfo.sysDeptEntity.postCode)

      // noticeInfo.moderator
    }
  },
  methods: {
    echoed() {
      getWritDataByWritId({
        writId: this.info.writId
      }).then(res => {
        // 回显
        if (res.code === '0') {
          res.data.map(item => {
            switch (item.tagName) {
              case 'tag4':
                this.noticeInfo.timeFrame = stringToDate(
                  item.tagContent
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', ' ')
                    .replace('时', ':')
                    .replace('分', ':') + '00'
                )
                break
              case 'tag5':
                this.$set(this.noticeInfo, 'place', item.tagContent)
                // .place = item.tagContent;
                break
              case 'tag6':
                this.noticeInfo.open = item.tagContent === 'false' ? false : true
                break
              // case "tag7":
              //   this.noticeInfo.open = item.tagContent ? true : false;
              //   break;
              case 'tag8_id':
                this.noticeInfo.moderator.id = item.tagContent
                break
              case 'tag8':
                this.noticeInfo.moderator.nickName = item.tagContent
                break
              case 'tag9':
                this.noticeInfo.moderator.position = item.tagContent
                break

              case 'tag14_id':
                this.noticeInfo.clerk.id = item.tagContent
                break
              case 'tag14':
                this.noticeInfo.clerk.nickName = item.tagContent
                break
              case 'tag15':
                this.noticeInfo.clerk.position = item.tagContent
                break
              case 'tag16':
                this.$set(this.noticeInfo, 'address', item.tagContent)
                break
              case 'tag17':
                this.$set(this.noticeInfo, 'postCode', item.tagContent)
                break
              case 'tag18_id':
                this.noticeInfo.lxr.id = item.tagContent
                break
              case 'tag18':
                this.noticeInfo.lxr.nickName = item.tagContent
                break
              case 'tag19':
                this.$set(this.noticeInfo.lxr, 'mobile', item.tagContent)
              // this.noticeInfo.lxr.mobile = item.tagContent
              case 'hearings':
                this.noticeInfo.hearings = item.tagContent
                break
              case 'positions':
                this.noticeInfo.positions = item.tagContent
                break
              case 'hearingsId':
                this.noticeInfo.hearingsId = item.tagContent
                break
              default:
                break
            }
          })
        }
      })
    },
    close() {
      this.$emit('close')
    },
    sure() {
      console.info(this.noticeInfo)
      this.$refs['noticeInfo'].validate((val, errInfo) => {
        if (val) {
          let data = getWritParams({
            tag2: this.info.partyName,
            tag3: this.info.caseName,
            tag4: dateFormat(this.noticeInfo.timeFrame, 'yyyy年mm月dd日HH时MM分'),
            tag5: this.noticeInfo.place,
            tag6: this.noticeInfo.open ? true : false,
            tag7: !this.noticeInfo.open ? true : false,
            tag8_id: this.noticeInfo.moderator.id,
            tag8: this.noticeInfo.moderator.nickName, // 主持人
            tag9: this.noticeInfo.moderator.position,
            tag14_id: this.noticeInfo.clerk.id,
            tag14: this.noticeInfo.clerk.nickName, // 书记员
            tag15: this.noticeInfo.clerk.position,
            tag16: this.noticeInfo.address, // 应急管理局地址
            tag17: this.noticeInfo.postCode, // 邮编
            tag18: this.noticeInfo.lxr.nickName, // 联系人
            tag19: this.noticeInfo.lxr.mobile, // 电话
            hearTime: dateFormat(this.noticeInfo.timeFrame, 'yyyy-mm-dd HH:MM:ss'),
            hearings: this.noticeInfo.hearings,
            positions: this.noticeInfo.positions,
            hearingsId: this.noticeInfo.hearingsId
          })
          data = [...data, ...this.readyData()]
          let params = {
            companyId: this.info.companyId, //执法检查模块制作文书传company_id
            businessId: this.info.id,
            contractorIds: this.info.executorId,
            writType: 'XXCFTZHTZS',
            sourceId: this.info.caseId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    readyData() {
      let obj = []
      this.noticeInfo.hearingsId.split(',').map((item, index) => {
        obj.push({
          tagContent: this.noticeInfo.hearings.split(',')[index],
          tagName: `entity${index + 1}-col1`
        })
        obj.push({
          tagContent: this.noticeInfo.positions.split(',')[index],
          tagName: `entity${index + 1}-col2`
        })
      })
      return obj
    },
    checkPeople(type, cache) {
      this.$emit('selectPeople', type, cache)
    },
    checkPeoples(type) {
      let cache = []
      if (this.noticeInfo.hearingsId) {
        this.noticeInfo.hearingsId.split(',').map((item, i) => {
          cache.push({
            id: item,
            position: this.noticeInfo.positions.split(',')[i],
            nickName: this.noticeInfo.hearings.split(',')[i]
          })
        })
      }

      this.$emit('selectPeoples', type, cache)
    },
    choicePeople(val) {
      this.$nextTick(() => {
        if (val[0]._selfType === 'hearings') {
          this.noticeInfo.hearings = ''
          this.noticeInfo.positions = ''
          this.noticeInfo.hearingsId = ''
          val.map((v, i) => {
            if (!i) {
              this.noticeInfo.hearings += v.nickName ? v.nickName : ''
              this.noticeInfo.positions += v.position ? v.position : ''
              this.noticeInfo.hearingsId += v.id ? v.id : ''
            } else {
              this.noticeInfo.hearings += v.nickName ? `,${v.nickName}` : ''
              this.noticeInfo.positions += v.position ? `,${v.position}` : ''
              this.noticeInfo.hearingsId += v.id ? `,${v.id}` : ''
            }
          })
        } else {
          this.$set(this.noticeInfo, val[0]._selfType, val[0])
          this.$set(this.noticeInfo[val[0]._selfType], 'nickName', val[0].nickName)
          this.$set(this.noticeInfo[val[0]._selfType], 'position', val[0].position)
        }
      })
      // this.noticeInfo[val[0]._selfType] = val[0];
    }
  },
  watch: {
    selectedPeople: {
      handler: function(val, oldVal) {
        // this.$nextTick(()=>{
        this.choicePeople(val)
        // })
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 8px 16px 0;
  .hearingMeetNoticeForm {
    display: flex;
    flex-direction: column;
    .el-row {
      margin-bottom: 5px;
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
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
}
</style>
