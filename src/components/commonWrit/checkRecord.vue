<template>
  <div>
    <section class="query-flex">
      <div class="query-records-content">
        <el-form
          :rules="rules"
          ref="checkRecordInfo"
          :inline-message="true"
          :show-message="false"
          :model="checkRecordInfo"
          label-width="80px"
          label-position="right"
        >
          <el-row :gutter="20">
            <el-col :span="12" class="query-pad-left">
              <el-form-item prop="checkTimeStart">
                <div slot="label" class="slot_label">开始时间</div>
                <el-date-picker
                  placeholder="请选择开始时间"
                  v-model="checkRecordInfo.checkTimeStart"
                  type="datetime"
                  align="left"
                  :picker-options="pickerStart"
                  format="yyyy-MM-dd HH:mm"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="query-pad-right">
              <el-form-item prop="checkTimeEnd">
                <div slot="label" class="slot_label">结束时间</div>
                <el-date-picker
                  placeholder="请选择结束时间"
                  v-model="checkRecordInfo.checkTimeEnd"
                  type="datetime"
                  align="left"
                  :picker-options="pickerEnd"
                  format="yyyy-MM-dd HH:mm"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-form-item class="margin_left" prop="checkAddress">
              <div slot="label" class="slot_label">勘验场所</div>
              <el-input v-model="checkRecordInfo.checkAddress" placeholder="请输入勘验场所" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item class="margin_left" prop="weather">
              <div slot="label" class="slot_label">天气情况</div>
              <el-input v-model="checkRecordInfo.weather" placeholder="请输入天气情况" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-col class="query-pad-left" :span="14">
              <el-form-item prop="recordPerson">
                <div slot="label" class="slot_label">记录人</div>
                <el-input v-model="checkRecordInfo.recordPerson" placeholder="请输入记录人名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="query-pad-right" :span="10">
              <el-form-item prop="recordCompany">
                <div slot="label" class="slot_label">单位</div>
                <el-input v-model="checkRecordInfo.recordCompany" placeholder="请输入记录人单位" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col class="query-pad-left" :span="14">
              <el-form-item prop="recordPosition">
                <div slot="label" class="slot_label">职务</div>
                <el-input v-model="checkRecordInfo.recordPosition" placeholder="请输入记录人职务" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="person-detail_wrapper">
            <div class="person_detail" v-for="(person, ind) in checkRecordInfo.checkPerArr" :key="ind">
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item :prop="`checkPerArr[${ind}].name`" :rules="personRules.name">
                    <div slot="label" class="slot_label">勘验人员</div>
                    <el-input v-model="person.name" @focus="checkPeople(person, '勘验人员')" placeholder="选择勘验人员">
                      <i class="el-icon-more" slot="suffix" @click="checkPeople(person, '勘验人员')"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <el-form-item :prop="`checkPerArr[${ind}].position`" :rules="personRules.position">
                    <div slot="label" class="slot_label">职务</div>
                    <el-input v-model="person.position" placeholder="请输入职务" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item :prop="`checkPerArr[${ind}].depart`" :rules="personRules.depart">
                    <div slot="label" class="slot_label">单位</div>
                    <el-input v-model="person.depart" placeholder="请输入单位" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <div class="delete_buttons">
                    <span @click="addDetail('query')" v-if="ind === checkRecordInfo.checkPerArr.length - 1">增加勘验人员</span>
                    <span class="delete" v-if="ind === checkRecordInfo.checkPerArr.length - 1" @click="deleteRule(ind, 'query')">删除</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="person_detail" v-for="(recorder, ex) in checkRecordInfo.litigantArr" :key="'d_' + ex">
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item :prop="`litigantArr[${ex}].name`" :rules="personRules.name">
                    <div slot="label" class="slot_label">当事人</div>
                    <el-input v-model="recorder.name" placeholder="请输入当事人">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <el-form-item :prop="`litigantArr[${ex}].position`" :rules="personRules.position">
                    <div slot="label" class="slot_label">职务</div>
                    <el-input v-model="recorder.position" placeholder="请输入职务" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item :prop="`litigantArr[${ex}].depart`" :rules="personRules.depart">
                    <div slot="label" class="slot_label">单位</div>
                    <el-input v-model="recorder.depart" placeholder="请输入单位" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <div class="delete_buttons">
                    <span @click="addDetail('record')" v-if="ex === checkRecordInfo.litigantArr.length - 1">增加当事人</span>
                    <span class="delete" v-if="ex === checkRecordInfo.litigantArr.length - 1" @click="deleteRule(ex, 'record')">删除</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="person_detail" v-for="(invite, inv) in checkRecordInfo.invitePerArr" :key="'v_' + inv">
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item>
                    <div slot="label" class="slot_label">被邀请人</div>
                    <el-input v-model="invite.name" placeholder="请选择被邀请人">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <el-form-item>
                    <div slot="label" class="slot_label">职务</div>
                    <el-input v-model="invite.position" placeholder="请输入职务" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item>
                    <div slot="label" class="slot_label">单位</div>
                    <el-input v-model="invite.depart" placeholder="请输入单位" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <div class="delete_buttons">
                    <span @click="addDetail('invite')" v-if="inv === checkRecordInfo.invitePerArr.length - 1">增加被邀请人</span>
                    <span class="delete" v-if="inv === checkRecordInfo.invitePerArr.length - 1" @click="deleteRule(inv, 'invite')">删除</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
      <div class="query-record-text">
        <p>勘验笔录信息：</p>
        <div class="detail_part">
          <el-input type="textarea" class="queryRecords" placeholder="请输入笔录问答信息" v-model="checkRecordInfo.recordContent"></el-input>
        </div>
      </div>
    </section>

    <div class="dialog-footer" style="text-align: right;padding:10px 40px 10px 0;margin-top: 10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成勘验笔录</el-button>
    </div>
    <el-dialog width="900px" height="500px" :visible.sync="showPdfDialog" :title="dialogTitle" :append-to-body="true">
      <select-people v-if="showPdfDialog" @getPeople="getPeople" :selectNum="1"></select-people>
    </el-dialog>
  </div>
</template>

<script>
import { getWritParams, dateFormat, handleDateRef, reflectEntity, GetAge } from '@/utils/util'
import { getUserInfoById } from '@api/common'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'

export default {
  name: 'queryRecords',
  components: {
    selectPeople
  },
  props: ['info'], // 文书创建从别处带来的信息
  data() {
    return {
      person: {}, // 当前操作的人员
      showPdfDialog: false,
      dialogTitle: '请选择执法人员',

      dialogVisible: true,
      checkRecordInfo: {
        checkTimeStart: void 0,
        checkTimeEnd: void 0,
        checkAddress: '', // 勘验场所
        weather: '', // 天气情况
        recordContent: '', //
        recordPerson: '', // 记录人
        recordId: '', // 记录人id
        recordCompany: '', // 记录人单位
        recordPosition: '', // 记录人职务
        recorderName: '', // 执法人员名称
        recorderCode: '', // 执法人员执法号
        checkPerArr: [
          // 勘验人员  table
          {
            id: '',
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ],
        litigantArr: [
          // 当事人 table1
          {
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ],
        invitePerArr: [
          // 被邀请人  table2
          {
            id: '',
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ]
      },
      pickerStart: {}, // 开始时间选择限制
      pickerEnd: {}, // 结束时间选择限制
      createReq: {
        sourceId: '',
        userId: '',
        isUpt: 1,
        contractorIds: '',
        writType: 'KYBL',
        data: []
      },
      rules: {
        checkTimeStart: [{ required: true, message: '勘验开始时间', trigger: 'blur' }],
        checkTimeEnd: [{ required: true, message: '勘验结束时间', trigger: 'blur' }],
        checkAddress: [{ required: true, message: '请输入勘验场所', trigger: 'blur' }],
        weather: [{ required: true, message: '请输入天气情况', trigger: 'blur' }],
        recordPerson: [{ required: true, message: '请输入记录人名称', trigger: 'blur' }],
        recordCompany: [{ required: true, message: '请输入记录人单位', trigger: 'blur' }],
        recordPosition: [{ required: true, message: '请输入记录人职务', trigger: 'blur' }]
      },
      personRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        depart: [{ required: true, message: '请输入部门', trigger: 'blur' }],
        position: [{ required: true, message: '请输入职位', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        checkIds = '',
        inviteIds = ''
      this.info.writInfo.map(item => {
        switch (item.tagName) {
          case 'tag2':
            this.checkRecordInfo.checkTimeStart = handleDateRef(item.tagContent)
            break
          case 'tag3':
            this.checkRecordInfo.checkTimeEnd = handleDateRef(item.tagContent)
            break
          case 'tag4':
            this.checkRecordInfo.checkAddress = item.tagContent
            break
          case 'tag5':
            this.checkRecordInfo.weather = item.tagContent
            break
          case 'tag16':
            this.checkRecordInfo.recordPerson = item.tagContent
            break
          case 'tag17':
            this.checkRecordInfo.recordCompany = item.tagContent.split(' ')[0]
            this.checkRecordInfo.recordPosition = item.tagContent.split(' ')[1]
            break
          case 'tag21':
            this.checkRecordInfo.recordContent = item.tagContent
            break
          case 'Jlr':
            this.checkRecordInfo.recordId = item.tagContent
            break
          case 'Kyr':
            checkIds = item.tagContent
            break
          case 'Yqr':
            inviteIds = item.tagContent
            break
        }
      })
      this.reflectArr(checkIds.split(','), inviteIds.split(','))
    } else {
      this.initInfo()
    }
  },
  methods: {
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.checkRecordInfo = {
        checkTimeStart: new Date(),
        checkTimeEnd: void 0,
        checkAddress: this.info.auditInfo.objectAddress, // 勘验场所
        weather: '',
        recordContent: '', //
        recordPerson: user.userEntity.nickName, // 记录人
        recordCompany: user.sysDeptEntity.fullDeptName, // 记录人单位
        recordPosition: user.userEntity.position, // 记录人职务
        recorderName: '', // 执法人员名称
        recorderCode: '', // 执法人员执法号
        recordId: user.userEntity.id,
        checkPerArr: [
          {
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ],
        litigantArr: [
          {
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ],
        invitePerArr: [
          {
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ]
      }
      this.handlePeople()
      this.createReq = {
        companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
        sourceId: this.info.auditInfo.sourceId,
        userId: user.userEntity.id,
        isUpt: 1,
        contractorIds: this.info.auditInfo.udtIds,
        writType: 'KYBL',
        data: []
      }
    },
    // 处理勘验人的默认带值
    handlePeople() {
      let userArr = this.info.auditInfo.udtIds.split(',')
      this.checkRecordInfo.checkPerArr = []
      userArr.forEach(user => {
        getUserInfoById({ id: user }).then(res => {
          this.checkRecordInfo.checkPerArr.push({
            id: user,
            name: res.data.userEntity.nickName,
            depart: res.data.sysDeptEntity.fullDeptName,
            position: res.data.userEntity.position
          })
        })
      })
    },
    // 时间选择限制
    handlePicker() {
      let startDate, startTime, endDate, endTime, startArr, endArr
      let infoStart = this.checkRecordInfo.checkTimeStart
      let infoEnd = this.checkRecordInfo.checkTimeEnd
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
    // 删除人员
    deleteRule(ind, type) {
      let arr, msg
      if (type === 'query') {
        arr = this.checkRecordInfo.checkPerArr
        msg = '请保证至少有一位勘验人员'
      } else if (type === 'record') {
        arr = this.checkRecordInfo.litigantArr
        msg = '请保证至少有一位当事人'
      } else if (type === 'invite') {
        arr = this.checkRecordInfo.invitePerArr
        msg = '请保证至少有一位被邀请人'
      }
      if (arr.length == 1) {
        this.$message.error(msg)
      } else {
        arr.pop()
      }
    },
    // 新增
    addDetail(type) {
      if (type === 'query') {
        this.checkRecordInfo.checkPerArr.push({
          name: '',
          depart: '',
          position: ''
        })
        return
      }
      if (type === 'record') {
        this.checkRecordInfo.litigantArr.push({
          name: '',
          depart: '',
          position: ''
        })
        return
      }
      if (type === 'invite') {
        this.checkRecordInfo.invitePerArr.push({
          name: '',
          depart: '',
          position: ''
        })
        return
      }
    },
    // 回显勘验人，当事人，被邀请人
    reflectArr(checkIds, inviteIds) {
      let checkList = [],
        litiList = [],
        inviteList = []
      this.info.writInfo.forEach(item => {
        if (item.tagName.slice(-6) === 'table1') {
          litiList.push(item)
        } else if (item.tagName.slice(-6) === 'table2') {
          inviteList.push(item)
        } else if (item.tagName.slice(-5) === 'table') {
          checkList.push(item)
        }
      })
      this.checkRecordInfo.invitePerArr = reflectEntity(inviteList, ['name', 'depart', 'position'])
      this.checkRecordInfo.litigantArr = reflectEntity(litiList, ['name', 'depart', 'position'])
      this.checkRecordInfo.checkPerArr = reflectEntity(checkList, ['name', 'depart', 'position'])
      this.checkRecordInfo.checkPerArr.forEach((per, index) => {
        per.id = checkIds[index]
      })
      this.checkRecordInfo.invitePerArr.forEach((per, index) => {
        per.id = inviteIds[index]
      })
    },
    // 处理问答参数
    handleInfo(entityArr, fieldArr, type) {
      let table = type === 'check' ? '' : type === 'liti' ? '1' : '2'
      const arr = entityArr.reduce((total, item, index) => {
        fieldArr.forEach(field => {
          total.push({
            tagName: `entity${index + 1}-col${field.num}-table${table}`,
            tagContent: item[field.name]
          })
        })
        return total
      }, [])
      return arr
    },
    // 获取签名 id
    getIds(type) {
      let arr = [],
        ids = []
      if (type === 'check') {
        arr = this.checkRecordInfo.checkPerArr
      } else if (type === 'invite') {
        arr = this.checkRecordInfo.invitePerArr
      }
      arr.forEach(per => {
        ids.push(per.id)
      })
      return ids.join(',')
    },
    sure() {
      if (this.checkRecordInfo.recordContent.trim().length === 0) {
        this.$message({
          type: 'warning',
          message: '请填写勘验笔录信息'
        })
        return
      }
      this.$refs.checkRecordInfo.validate(val => {
        if (val) {
          let queryRecordsData = getWritParams({
            tag2: dateFormat(this.checkRecordInfo.checkTimeStart, 'yyyy年mm月dd日HH时MM分'),
            tag3: dateFormat(this.checkRecordInfo.checkTimeEnd, 'yyyy年mm月dd日HH时MM分'),
            tag4: this.checkRecordInfo.checkAddress,
            tag5: this.checkRecordInfo.weather,
            tag16: this.checkRecordInfo.recordPerson,
            tag17: this.checkRecordInfo.recordCompany + ' ' + this.checkRecordInfo.recordPosition,
            tag18: this.checkRecordInfo.recordCompany,
            tagUserNamelst: this.checkRecordInfo.recorderName, // 执法人员名称
            tagUserSignLst: this.checkRecordInfo.recorderCode, // 执法号
            tag21: this.checkRecordInfo.recordContent,
            Kyr: this.getIds('check'), // 勘验人签名 id
            Yqr: this.getIds('invite'), // 被邀请人签名 id
            Jlr: this.checkRecordInfo.recordId // 记录人签名 id
          })
          const checkArr = this.handleInfo(
            this.checkRecordInfo.checkPerArr,
            [
              { num: 1, name: 'name' },
              { num: 2, name: 'depart' },
              { num: 3, name: 'position' }
            ],
            'check'
          )
          const litiArr = this.handleInfo(
            this.checkRecordInfo.litigantArr,
            [
              { num: 1, name: 'name' },
              { num: 2, name: 'depart' },
              { num: 3, name: 'position' }
            ],
            'liti'
          )
          console.info(this.checkRecordInfo.invitePerArr)
          if(this.checkRecordInfo.invitePerArr.length > 1 || this.checkRecordInfo.invitePerArr.name) {
            const inviteArr = this.handleInfo(
              this.checkRecordInfo.invitePerArr,
              [
                { num: 1, name: 'name' },
                { num: 2, name: 'depart' },
                { num: 3, name: 'position' }
              ],
              'invite'
            )
            this.createReq.data = [...queryRecordsData, ...checkArr, ...litiArr, ...inviteArr]
          } else {
            this.createReq.data = [...queryRecordsData, ...checkArr, ...litiArr]
          }

          this.$emit('createWrit', this.createReq)
        } else {
          console.info('hhhh')
        }
      })
    },
    // 选择人员框
    checkPeople(person, title) {
      this.person = person
      this.dialogTitle = `请选择${title}`
      this.showPdfDialog = true
    },
    // 选择人员
    getPeople(bool, item) {
      if (bool) {
        this.person.id = item[0].id
        this.person.name = item[0].nickName
        this.person.depart = item[0].deptName
        this.person.position = item[0].position
      }
      this.showPdfDialog = false
    },
    // 年龄根据身份证号算出
    changeId() {
      this.checkRecordInfo.age = GetAge(this.checkRecordInfo.idCardNum)
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  },
  watch: {
    'checkRecordInfo.checkTimeStart': function(no, vo) {
      this.handlePicker()
    },
    'checkRecordInfo.checkTimeEnd': function(no, vo) {
      this.handlePicker()
    }
  }
}
</script>

<style lang="less" scoped>
.query-flex {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  overflow-y: auto;
  max-height: 85vh;
  .person-detail_wrapper {
    height: 100%;
    margin-top: 10px;
    /* padding: 0 20px 10px 20px;
    background: #eef5f9;
    border-radius: 5px; */
  }
  .person_detail {
    .delete_buttons {
      position: absolute;
      right: 0;
      bottom: 3px;
      span {
        font-size: 14px;
        color: #0099ff;
        cursor: pointer;
        & + span {
          margin-left: 16px;
        }
        &.delete {
          color: #ff3030;
        }
      }
    }
  }
}
.query-record-text {
  flex-grow: 1;
  margin-left: 20px;
}
.query-records-content {
  padding: 10px 16px 0px 16px;
  width: 44%;
  .query-pad-left {
    padding-left: 0 !important;
  }
  .query-pad-right {
    padding-right: 0 !important;
  }
  .detail_part {
    line-height: 40px;
  }
}
.queryRecords {
  /deep/ .el-textarea__inner {
    height: 77vh !important;
    overflow-y: auto;
  }
}
.el-form-item {
  margin-bottom: 0;
  white-space: nowrap;
}
.el-col-12 {
  /deep/ .el-input {
    width: 100%;
  }
  /deep/ .el-input__inner {
    width: 100%;
  }
  &:last-child {
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}
.special {
  margin-top: 24px;
  .el-checkbox {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  span {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  .el-row:nth-child(4) {
    /deep/.el-input__inner {
      width: 85%;
    }
  }
}
/deep/ .el-row {
  position: relative;
}
.only {
  /deep/ .el-form-item__content {
    margin-left: 125px !important;
  }
}
/deep/ .el-dialog__header {
  padding: 17px 20px 10px;
}
/deep/ .el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
  top: 12px;
  right: 15px;
  font-size: 24px;
}
/deep/ .el-dialog__body {
  padding-left: 16px;
  padding-right: 29px;
}
/deep/ .el-dialog__wrapper .el-dialog__footer {
  padding: 0;
  line-height: 42px;
  padding-right: 10px;
}
/deep/ .el-dialog__title {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
  position: absolute;
  bottom: 45px;
  right: 0;
  width: 100%;
}

.time_picker {
  margin-left: -10px;
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
  height: 30px;
  padding-left: 0 0 0 10px;
}
/deep/ .el-date-editor .el-range__icon,
/deep/ .el-date-editor .el-range__close-icon {
  line-height: 24px;
}
/deep/ .el-date-editor .el-range-separator {
  line-height: 20px;
}
/deep/.el-select {
  width: 100%;
}
/deep/.el-date-editor .el-range-input {
  width: 65%;
}
</style>
