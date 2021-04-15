<template>
  <div>
    <div class="content">
      <el-form ref="discussionInfo" :rules="rules" :model="discussionInfo" label-position="right" label-width="110px" :show-message="false">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="caseName">
            <div slot="label" class="slot_label">案件名称</div>
              <p class="caseName">{{ discussionInfo.caseName }}</p>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item prop="startTime">
            <div slot="label" class="slot_label">开始时间</div>
              <el-date-picker v-model="discussionInfo.startTime" :picker-options="pickerStart" type="datetime" placeholder="开始时间" format="yyyy-MM-dd HH:mm"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="endTime">
            <div slot="label" class="slot_label">结束时间</div>
              <el-date-picker v-model="discussionInfo.endTime" :picker-options="pickerEnd" type="datetime" placeholder="结束时间" format="yyyy-MM-dd HH:mm"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="discussSpace">
            <div slot="label" class="slot_label">讨论地点</div>
              <el-input v-model="discussionInfo.discussSpace" placeholder="输入讨论地点" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="moderator.nickName">
            <div slot="label" class="slot_label">主持人</div>
              <el-input
                v-model="discussionInfo.moderator.nickName"
                @focus="checkPeople('moderator', discussionInfo.moderator)"
                placeholder="选择主持人"

              >
                <i class="el-icon-more" slot="suffix" @click="checkPeople('moderator', discussionInfo.moderator)"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="reporter.nickName">
            <div slot="label" class="slot_label">汇报人</div>
              <el-input v-model="discussionInfo.reporter.nickName" @focus="checkPeople('reporter', discussionInfo.reporter)" placeholder="选择汇报人" >
                <i class="el-icon-more" slot="suffix" @click="checkPeople('reporter', discussionInfo.reporter)"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="recorder.nickName">
            <div slot="label" class="slot_label">记录人</div>
              <el-input v-model="discussionInfo.recorder.nickName" @focus="checkPeople('recorder', discussionInfo.recorder)" placeholder="选择记录人" >
                <i class="el-icon-more" slot="suffix" @click="checkPeople('recorder', discussionInfo.recorder)"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="attendee">
            <div slot="label" class="slot_label">出席人</div>
              <el-input v-model="discussionInfo.attendee" @focus="checkPeoples('attendee', discussionInfo.attendee)" placeholder="选择出席人" >
                <i class="el-icon-more" slot="suffix" @click="checkPeoples('attendee', discussionInfo.attendee)"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="discussInfo">
            <div slot="label" class="slot_label">讨论内容</div>
            <el-input type="textarea" autosize v-model="discussionInfo.discussInfo" placeholder="讨论内容" ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="discussRecord">
            <div slot="label" class="slot_label">讨论记录</div>
            <el-input type="textarea" autosize v-model="discussionInfo.discussRecord" placeholder="讨论记录" ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="conclusion">
            <div slot="label" class="slot_label">结论性意见</div>
            <el-input type="textarea" autosize v-model="discussionInfo.conclusion" placeholder="结论性意见" ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="sure">保存并生成集体讨论记录</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, stringToDate, debounce, getFirstErrMsg } from '@/utils/util'
import { getWritDataByWritId } from '@/api/fileRelated'
export default {
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
      discussionInfo: {
        caseName: '',
        startTime: null,
        endTime: null,
        discussSpace: '',
        moderator: {
          nickName: ''
        },
        reporter: {
          nickName: ''
        }, // 汇报人
        recorder: {
          nickName: ''
        }, // 记录人
        attendee: '', // 出席人 select
        attendeeNames: '',
        positions: '',
        attendeeId: '',
        discussInfo: '', // 讨论内容
        discussRecord: '', // 讨论记录
        conclusion: '' // 结论性意见
      },
      pickerStart: {}, // 开始时间选择限制
      pickerEnd: {}, // 结束时间选择限制
      rules: {
        startTime: [{ required: true, trigger: 'blur', message: '请选择讨论开始时间' }],
        endTime: [{ required: true, trigger: 'blur', message: '请选择讨论结束时间' }],
        discussSpace: [{ required: true, trigger: 'blur', message: '请选择讨论地点' }],
        'moderator.nickName': [{ required: true, trigger: 'change', message: '请选择主持人' }],
        'recorder.nickName': [{ required: true, trigger: 'change', message: '请选择记录人' }],
        'reporter.nickName': [{ required: true, trigger: 'change', message: '请选择汇报人' }],
        attendee: [{ required: true, trigger: 'change', message: '请选择出席人' }],
        discussInfo: [{ required: true, trigger: 'blur', message: '请填写讨论内容' }],
        discussRecord: [{ required: true, trigger: 'blur', message: '请填写讨论记录' }],
        conclusion: [{ required: true, trigger: 'blur', message: '请填写结论性意见' }]
      }
    }
  },
  created() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.discussionInfo.caseName = this.info.caseName
    if (this.info.writId) {
      this.echoed()
    } else {
      this.discussionInfo.moderator = {
        id: userInfo.userEntity.id,
        nickName: userInfo.userEntity.nickName,
        position: userInfo.userEntity.position
      }
    }

    this.sure = debounce(this.sure, 2000)
  },
  mounted() {
    this.discussionInfo.startTime = new Date()
  },
  methods: {
    echoed() {
      getWritDataByWritId({
        writId: this.info.writId
      }).then(res => {
        if (res.code === '0') {
          res.data.map(item => {
            switch (item.tagName) {
              case 'tag3':
                this.discussionInfo.startTime = item.tagContent
                  ? stringToDate(
                      item.tagContent
                        .replace('年', '-')
                        .replace('月', '-')
                        .replace('日', ' ')
                        .replace('时', ':')
                        .replace('分', ':') + '00'
                    )
                  : ''
                break
              case 'tag4':
                this.discussionInfo.endTime = item.tagContent
                  ? stringToDate(
                      item.tagContent
                        .replace('年', '-')
                        .replace('月', '-')
                        .replace('日', ' ')
                        .replace('时', ':')
                        .replace('分', ':') + '00'
                    )
                  : ''
                break
              case 'tag5':
                this.discussionInfo.discussSpace = item.tagContent
                break
              case 'tag6':
                this.discussionInfo.moderator.nickName = item.tagContent
                break
              case 'tag6_id':
                this.discussionInfo.moderator.id = item.tagContent
                break
              case 'tag7':
                this.discussionInfo.reporter.nickName = item.tagContent
                break
              case 'tag7_id':
                this.discussionInfo.reporter.id = item.tagContent
                break
              case 'tag8':
                this.discussionInfo.recorder.nickName = item.tagContent
                break
              case 'tag8_id':
                this.discussionInfo.recorder.id = item.tagContent
                break
              case 'tag9':
                this.discussionInfo.attendee = item.tagContent // 出席人及职务 coding
                break
              case 'attendeeNames':
                this.discussionInfo.attendeeNames = item.tagContent
                break
              case 'positions':
                this.discussionInfo.positions = item.tagContent
                break
              case 'attendeeId':
                this.discussionInfo.attendeeId = item.tagContent
              case 'Cxr':
                this.discussionInfo.Cxr = item.tagContent
                break
              case 'tag10':
                this.discussionInfo.discussInfo = item.tagContent
                break
              case 'tag11':
                this.discussionInfo.discussRecord = item.tagContent
                break
              case 'tag12':
                this.discussionInfo.conclusion = item.tagContent
                break
            }
          })
          this.cacheFn()
        }
      })
    },
    // 人员选择回显
    cacheFn() {
      return
      let _peopleCache = [],
        _attendee = this.discussionInfo.attendee.split(',')
      this.discussionInfo.attendeeId.map((item, index) => {
        _peopleCache.push({
          id: item,
          nickName: _attendee[index]
        })
      })
      this.$emit('cachePeople', _peopleCache)
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },
    sure() {
      this.$refs.discussionInfo.validate((val, errInfo) => {
        if (val) {
          let data = getWritParams({
            tag2: this.info.caseName,
            tag3: dateFormat(this.discussionInfo.startTime, 'yyyy年mm月dd日HH时MM分'),
            tag4: dateFormat(this.discussionInfo.endTime, 'yyyy年mm月dd日HH时MM分'),
            tag5: this.discussionInfo.discussSpace,
            tag6: this.discussionInfo.moderator.nickName,
            tag6_id: this.discussionInfo.moderator.id,
            tag7: this.discussionInfo.reporter.nickName,
            tag6_id: this.discussionInfo.reporter.id,
            tag8: this.discussionInfo.recorder.nickName,
            tag8_id: this.discussionInfo.recorder.id,
            tag9: this.discussionInfo.attendee, // 出席人及职务
            attendeeNames: this.discussionInfo.attendeeNames,
            attendeeId: this.discussionInfo.attendeeId,
            Cxr: this.discussionInfo.attendeeId,
            positions: this.discussionInfo.positions,
            tag10: this.discussionInfo.discussInfo,
            tag11: this.discussionInfo.discussRecord,
            tag12: this.discussionInfo.conclusion,
            discTime: dateFormat(this.discussionInfo.startTime, 'yyyy-mm-dd HH:MM:ss') //集体讨论开始时间
          })
          let params = {
            companyId: this.info.companyId,//执法检查模块制作文书传company_id
            attendeeId: this.discussionInfo.attendeeId,
            businessId: this.info.businessId,
            contractorIds: this.info.executorId,
            writType: this.info.flag === 1 ? 'XXCFJTTLJL' : 'XXCFJTTLJL2',
            sourceId: this.info.caseId,
            isUpt: 1,
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
    // 时间选择限制
    handlePicker() {
      let startDate, startTime, endDate, endTime, startArr, endArr
      let infoStart = this.discussionInfo.startTime
      let infoEnd = this.discussionInfo.endTime
      startArr = infoStart ? dateFormat(infoStart, 'yyyy-mm-dd HH:MM:ss').split(' ') : ['', '']
      endArr = infoEnd ? dateFormat(infoEnd, 'yyyy-mm-dd HH:MM:ss').split(' ') : ['', '']
      startDate = startArr[0]
      startTime = startArr[1]
      endDate = endArr[0]
      endTime = endArr[1]
      let start = new Date(startDate + ' 00:00:00').getTime()
      let end = endDate ? new Date(endDate + ' 23:59:59').getTime() : ''
      this.pickerStart = {
        disabledDate: time => {
          let res
          if (end) {
            res = time.getTime() >= end
          }
          return res
        },
        selectableRange: startDate === endDate ? '00:00:00 - ' + endTime : '00:00:00 - 23:59:59'
      }
      this.pickerEnd = {
        disabledDate: time => {
          let res
          if (start) {
            res = time.getTime() < start
          }
          return res
        },
        selectableRange: startDate === endDate ? startTime + ' - 23:59:59' : '00:00:00 - 23:59:59'
      }
    },
    selectPeople() {
      this.$emit('selectPeople')
    },
    showPeople(val) {
      // 显示人员
      if (val[0]._selfType === 'attendee') {
        this.discussionInfo.attendee = ''
        this.discussionInfo.attendeeId = ''
        this.discussionInfo.attendeeNames = ''
        this.discussionInfo.positions = ''

        val.map((v, i) => {
          this.discussionInfo.attendeeId += !i ? v.id : `,${v.id}`
          this.discussionInfo.attendeeNames += !i ? v.nickName : `,${v.nickName}`
          this.discussionInfo.positions += !i ? v.position : `,${v.position}`
          this.discussionInfo.attendee += !i ? `${v.nickName} (${v.position})` : `,${v.nickName} (${v.position})`
        })
        // 回显
        this.cacheFn()
      } else {
        this.discussionInfo[val[0]._selfType] = val[0]
      }
    },
    checkPeople(type, cache) {
      this.$emit('selectPeople', type, cache)
    },
    checkPeoples(type) {
      let cache = []
      console.info(this.discussionInfo.attendeeId, this.discussionInfo.positions, this.discussionInfo.attendee)
      if (this.discussionInfo.attendeeId) {
        this.discussionInfo.attendeeId.split(',').map((item, i) => {
          cache.push({
            id: item,
            position: this.discussionInfo.positions.split(',')[i],
            nickName: this.discussionInfo.attendeeNames.split(',')[i]
          })
        })
      }
      console.info('cache', cache)
      this.$emit('selectPeoples', type, cache)
    }
  },
  watch: {
    selectedPeople: {
      handler: function(val, oldVal) {
        this.showPeople(val)
      },
      deep: true
    },
    'discussionInfo.startTime': function(no, vo) {
      this.handlePicker()
    },
    'discussionInfo.endTime': function(no, vo) {
      this.handlePicker()
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 8px 16px 20px 16px;
  overflow-y: auto;
  p.caseName {
    line-height: 40px;
    margin: 0;
    color: #333333;
    font-weight: 500;
  }
  .el-form-item {
    margin-bottom: 0px;
    .el-date-editor.el-date-editor--datetime {
      width: 306px;
    }
  }
}
.el-col-12 {
  margin-right: 35px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
}
</style>
