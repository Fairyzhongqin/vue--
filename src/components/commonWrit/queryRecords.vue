<template>
  <div>
    <section class="query-flex">
      <div class="query-records-content">
        <el-form ref="queryRecordsInfo" :model="queryRecordsInfo" :rules="rules" label-width="94px" :inline-message="true" :show-message="false">
          <el-row :gutter="20">
            <el-col :span="12" class="query-pad-left">
              <el-form-item prop="queryTimeStart">
                <div slot="label" class="slot_label">开始时间</div>
                <el-date-picker
                  placeholder="请选择开始时间"
                  v-model="queryRecordsInfo.queryTimeStart"
                  type="datetime"
                  class="picker-hooker"
                  align="left"
                  :picker-options="pickerStart"
                  format="yyyy-MM-dd HH:mm"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="query-pad-right">
              <el-form-item prop="queryTimeEnd">
                <div slot="label" class="slot_label">结束时间</div>
                <el-date-picker
                  placeholder="请选择结束时间"
                  type="datetime"
                  class="picker-hooker"
                  v-model="queryRecordsInfo.queryTimeEnd"
                  align="left"
                  :picker-options="pickerEnd"
                  format="yyyy-MM-dd HH:mm"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-form-item prop="question">
              <div slot="label" class="slot_label">询问事由</div>
              <el-input v-model="queryRecordsInfo.question" placeholder="请输入询问事由" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-col class="query-pad-left" :span="14">
              <el-form-item prop="queryAddress">
                <div slot="label" class="slot_label">询问地点</div>
                <el-input v-model="queryRecordsInfo.queryAddress" placeholder="请输入询问地点" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="query-pad-right" :span="10">
              <el-form-item prop="times">
                <div slot="label" class="slot_label">询问次数</div>
                <el-input v-model="queryRecordsInfo.times" placeholder="请输入询问次数" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col class="query-pad-left" :span="14">
              <el-form-item prop="subjectName">
                <div slot="label" class="slot_label">被询问人</div>
                <el-input v-model="queryRecordsInfo.subjectName" placeholder="请输入被询问人姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="query-pad-right" :span="10">
              <el-form-item prop="sex">
                <div slot="label" class="slot_label">性别</div>
                <el-select v-model="queryRecordsInfo.sex" placeholder="请选择">
                  <el-option value="女" label="女"></el-option>
                  <el-option value="男" label="男"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col class="query-pad-left" :span="14">
              <el-form-item prop="idCardNum">
                <div slot="label" class="slot_label">身份证号</div>
                <el-input @change.native="changeId" v-model="queryRecordsInfo.idCardNum" placeholder="请输入身份证号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="query-pad-right" :span="10">
              <el-form-item prop="age">
                <div slot="label" class="slot_label">年龄</div>
                <el-input v-model="queryRecordsInfo.age" placeholder="请输入年龄" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-form-item prop="subjectCompany">
              <div slot="label" class="slot_label">工作单位</div>
              <el-input v-model="queryRecordsInfo.subjectCompany" placeholder="请输入工作单位" clearable></el-input>
            </el-form-item>
          </el-row>

          <el-row :gutter="20">
            <el-col class="query-pad-left" :span="14">
              <el-form-item prop="position">
                <div slot="label" class="slot_label">职务</div>
                <el-input v-model="queryRecordsInfo.position" placeholder="请输入职务" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="query-pad-right" :span="10">
              <el-form-item prop="phone">
                <div slot="label" class="slot_label">电话</div>
                <el-input v-model="queryRecordsInfo.phone" placeholder="请输入电话" maxlength="12" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-form-item prop="address">
              <div slot="label" class="slot_label">住址</div>
              <el-input v-model="queryRecordsInfo.address" placeholder="请输入住址" clearable></el-input>
            </el-form-item>
          </el-row>
          <div class="person-detail_wrapper">
            <div class="person_detail" v-for="(person, ind) in queryRecordsInfo.queryPerArr" :key="ind">
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item :prop="`queryPerArr[${ind}].name`" :rules="queryPerRules.name">
                    <div slot="label" class="slot_label">询问人员</div>
                    <el-input v-model="person.name" @focus="checkPeople(person, '询问人员')" placeholder="选择询问人员">
                      <i class="el-icon-more" slot="suffix" @click="checkPeople(person, '询问人员')"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <el-form-item :prop="`queryPerArr[${ind}].position`" :rules="queryPerRules.position">
                    <div slot="label" class="slot_label">职务</div>
                    <el-input v-model="person.position" placeholder="请输入职务" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item :prop="`queryPerArr[${ind}].depart`" :rules="queryPerRules.depart">
                    <div slot="label" class="slot_label">单位</div>
                    <el-input v-model="person.depart" placeholder="请输入单位" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <div class="delete_buttons">
                    <span @click="addDetail('query')" v-if="ind === queryRecordsInfo.queryPerArr.length - 1">增加询问人员</span>
                    <span class="delete" v-if="ind === queryRecordsInfo.queryPerArr.length - 1" @click="deleteRule(ind, 'query')">删除</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="person_detail" v-for="(recorder, ex) in queryRecordsInfo.recorderArr" :key="'d_' + ex">
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item :prop="`recorderArr[${ex}].name`" :rules="recorderRules.name">
                    <div slot="label" class="slot_label">记录人员</div>
                    <el-input v-model="recorder.name" @focus="checkPeople(recorder, '记录人员')" placeholder="选择记录人员">
                      <i class="el-icon-more" slot="suffix" @click="checkPeople(recorder, '记录人员')"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <el-form-item :prop="`recorderArr[${ex}].position`" :rules="recorderRules.position">
                    <div slot="label" class="slot_label">职务</div>
                    <el-input v-model="recorder.position" placeholder="请输入职务" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col class="query-pad-left" :span="14">
                  <el-form-item :prop="`recorderArr[${ex}].depart`" :rules="recorderRules.depart">
                    <div slot="label" class="slot_label">单位</div>
                    <el-input v-model="recorder.depart" placeholder="请输入单位" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="query-pad-right" :span="10">
                  <div class="delete_buttons">
                    <span @click="addDetail('record')" v-if="ex === queryRecordsInfo.recorderArr.length - 1">增加记录人员</span>
                    <span class="delete" v-if="ex === queryRecordsInfo.recorderArr.length - 1" @click="deleteRule(ex, 'record')">删除</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-row :gutter="20">
            <el-form-item prop="witness">
              <div slot="label" class="slot_label">在场人员</div>
              <el-input v-model="queryRecordsInfo.witness" placeholder="请输入在场人员" clearable></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="query-record-text">
        <p>笔录问答信息：</p>
        <div class="detail_part">
          <el-input type="textarea" class="queryRecords" placeholder="请输入笔录问答信息" v-model="queryRecordsInfo.recordContent"></el-input>
        </div>
      </div>
    </section>

    <div class="dialog-footer" style="text-align: right;padding:10px 40px 10px 0;margin-top: 10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成询问笔录</el-button>
    </div>
    <el-dialog width="900px" height="500px" :visible.sync="showPdfDialog" :title="dialogTitle" :append-to-body="true">
      <select-people v-if="showPdfDialog" @getPeople="getPeople" :selectNum="1"></select-people>
    </el-dialog>
  </div>
</template>

<script>
import { getWritParams, dateFormat, stringToDate, reflectEntity, GetAge, getFirstErrMsg } from '@/utils/util'
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
      pickerStart: {}, // 开始时间选择限制
      pickerEnd: {}, // 结束时间选择限制
      dialogVisible: true,
      queryRecordsInfo: {
        queryTimeStart: void 0,
        queryTimeEnd: void 0,
        times: '1', // 询问次数
        queryAddress: '', // 询问地点
        subjectName: '', // 被询问人姓名
        sex: '', // 性别
        age: '', // 年龄
        idCardNum: '', // 身份证号
        address: '', // 住址
        phone: '', // 电话
        subjectCompany: '', // 工作单位
        position: '', // 职务
        question: '', // 询问事由
        witness: '', // 在场人员
        fullDeptName: '', // 执法人所在部门
        recordContent: '', //询问笔录
        queryPerArr: [
          {
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ],
        recorderArr: [
          {
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ]
      },
      createReq: {
        sourceId: '',
        userId: '',
        contractorIds: '',
        writType: 'XWBL',
        data: []
      },
      rules: {
        queryTimeStart: [{ required: true, message: '询问开始时间', trigger: 'blur' }],
        queryTimeEnd: [{ required: true, message: '询问结束时间', trigger: 'blur' }],
        times: [{ required: true, message: '请输入询问次数', trigger: 'blur' }],
        queryAddress: [{ required: true, message: '请输入询问地点', trigger: 'blur' }],
        subjectName: [{ required: true, message: '请输入被询问人姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        idCardNum: [
          { required: true, trigger: ['blur', 'change'], message: '请填写身份证号' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            trigger: ['blur', 'change'],
            message: '您输入的身份证号码格式不正确'
          }
        ],
        address: [{ required: true, message: '请输入住址', trigger: 'blur' }],
        phone: [
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
        subjectCompany: [{ required: true, message: '请输入工作单位', trigger: 'blur' }],
        position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
        question: [{ required: true, message: '请输入询问事由', trigger: 'blur' }],
        witness: [{ required: true, message: '请输入在场人员', trigger: 'blur' }],
        fullDeptName: [{ required: true, message: '请输入执法人所在部门', trigger: 'blur' }],
        recordContent: [{ required: true, message: '请输入询问笔录', trigger: 'blur' }]
      },
      queryPerRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        depart: [{ required: true, message: '请输入部门', trigger: 'blur' }],
        position: [{ required: true, message: '请输入职位', trigger: 'blur' }]
      },
      recorderRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        depart: [{ required: true, message: '请输入部门', trigger: 'blur' }],
        position: [{ required: true, message: '请输入职位', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null

      this.reflectArr()
      this.info.writInfo.map(item => {
        switch (item.tagName) {
          case 'tag2':
            this.queryRecordsInfo.queryTimeStart = stringToDate(
              item.tagContent
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', ' ')
                .replace('时', ':')
                .replace('分', ':') + '00'
            )
            break
          case 'tag3':
            this.queryRecordsInfo.queryTimeEnd = stringToDate(
              item.tagContent
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', ' ')
                .replace('时', ':')
                .replace('分', ':') + '00'
            )
            break
          case 'tag4':
            this.queryRecordsInfo.times = item.tagContent
            break
          case 'tag5':
            this.queryRecordsInfo.queryAddress = item.tagContent
            break
          case 'tag6':
            this.queryRecordsInfo.subjectName = item.tagContent
            break
          case 'tag7':
            this.queryRecordsInfo.sex = item.tagContent
            break
          case 'tag8':
            this.queryRecordsInfo.age = item.tagContent
            break
          case 'tag9':
            this.queryRecordsInfo.idCardNum = item.tagContent
            break
          case 'tag10':
            this.queryRecordsInfo.subjectCompany = item.tagContent
            break
          case 'tag11':
            this.queryRecordsInfo.position = item.tagContent
            break
          case 'tag12':
            this.queryRecordsInfo.address = item.tagContent
            break
          case 'tag13':
            this.queryRecordsInfo.phone = item.tagContent
            break
          case 'tag14':
            this.queryRecordsInfo.queryPerson = item.tagContent
            break
          case 'tag15':
            this.queryRecordsInfo.queryCompany = item.tagContent
            break
          case 'tag16':
            this.queryRecordsInfo.queryPosition = item.tagContent
            break
          case 'tag17':
            this.queryRecordsInfo.recorder = item.tagContent
            break
          case 'tag18':
            this.queryRecordsInfo.recorderCompany = item.tagContent
            break
          case 'tag19':
            this.queryRecordsInfo.recorderPosition = item.tagContent
            break
          case 'tag20':
            this.queryRecordsInfo.witness = item.tagContent
            break
          case 'tag21':
            this.queryRecordsInfo.fullDeptName = item.tagContent
            break
          case 'tag24':
            this.queryRecordsInfo.question = item.tagContent
            break
          case 'tag25':
            this.queryRecordsInfo.recordContent = item.tagContent
            break
        }
      })
    } else {
      this.initInfo()
    }
  },
  mounted() {
    /* let hookers = document.getElementsByClassName('picker-hooker')
    for (var hooker of hookers) {
      hooker.firstElementChild.addEventListener('change', ()=> alert('xx'))
      console.info('hooker.firstElement', hooker.firstElementChild)
    } */
  },
  methods: {
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.queryRecordsInfo = {
        queryTimeStart: new Date(),
        queryTimeEnd: void 0,
        times: '1',
        queryAddress: user.sysDeptEntity.deptAddress, // 询问住址 - 当前登录人的部门住址
        subjectName: '',
        sex: '',
        age: this.info.auditInfo.objectType === '0' ? '' : this.info.auditInfo.age,
        idCardNum: this.info.auditInfo.objectType === '0' ? '' : this.info.auditInfo.idCard,
        address: this.info.auditInfo.objectAddress,
        phone: '',
        subjectCompany: this.info.auditInfo.objectType === '0' ? this.info.auditInfo.subject : this.info.auditInfo.currentCompany,
        position: '',
        question: '',
        witness: '',
        fullDeptName: user.sysDeptEntity.fullDeptName,
        recordContent: '', // 询问笔录
        queryPerArr: [
          {
            name: '', // 名字
            depart: '', // 部门
            position: '' // 职位
          }
        ],
        recorderArr: [
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
        contractorIds: this.info.auditInfo.udtIds,
        writType: 'XWBL',
        data: []
      }
    },
    // 时间选择限制
    handlePicker() {
      let startDate = this.queryRecordsInfo.queryTimeStart ? dateFormat(this.queryRecordsInfo.queryTimeStart, 'yyyy-mm-dd HH:MM:ss').split(' ')[0] : ''
      let startTime = this.queryRecordsInfo.queryTimeStart ? dateFormat(this.queryRecordsInfo.queryTimeStart, 'yyyy-mm-dd HH:MM:ss').split(' ')[1] : ''
      let endDate = this.queryRecordsInfo.queryTimeEnd ? dateFormat(this.queryRecordsInfo.queryTimeEnd, 'yyyy-mm-dd HH:MM:ss').split(' ')[0] : ''
      let endTime = this.queryRecordsInfo.queryTimeEnd ? dateFormat(this.queryRecordsInfo.queryTimeEnd, 'yyyy-mm-dd HH:MM:ss').split(' ')[1] : ''
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
    // 处理询问人，记录人员的默认带值
    handlePeople() {
      const user = JSON.parse(localStorage.getItem('res'))
      this.queryRecordsInfo.recorderArr = [
        {
          name: user.userEntity.nickName, // 名字
          depart: user.sysDeptEntity.fullDeptName, // 部门
          position: user.userEntity.position // 职位
        }
      ]
      let userArr = this.info.auditInfo.udtIds.split(',')
      this.queryRecordsInfo.queryPerArr = []
      userArr.forEach(user => {
        getUserInfoById({ id: user }).then(res => {
          this.queryRecordsInfo.queryPerArr.push({
            name: res.data.userEntity.nickName,
            depart: res.data.sysDeptEntity.fullDeptName,
            position: res.data.userEntity.position
          })
        })
      })
    },
    // 删除询问问答记录
    deleteRule(ind, type) {
      let arr, msg
      if (type === 'query') {
        arr = this.queryRecordsInfo.queryPerArr
        msg = '请保证至少有一位询问人员'
      } else if (type === 'record') {
        arr = this.queryRecordsInfo.recorderArr
        msg = '请保证至少有一位记录人员'
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
        this.queryRecordsInfo.queryPerArr.push({
          name: '',
          depart: '',
          position: ''
        })
        return
      }
      if (type === 'record') {
        this.queryRecordsInfo.recorderArr.push({
          name: '',
          depart: '',
          position: ''
        })
        return
      }
    },
    // 回显询问人，记录人员，问答
    reflectArr() {
      let queryList = [],
        recordList = [],
        quesList = []
      this.info.writInfo.forEach(item => {
        if (item.tagName.slice(-6) === 'table1') {
          recordList.push(item)
        } else if (item.tagName.slice(-6) === 'table2') {
          quesList.push(item)
        } else if (item.tagName.slice(-5) === 'table') {
          queryList.push(item)
        }
      })
      this.queryRecordsInfo.recorderArr = reflectEntity(recordList, ['name', 'depart', 'position'])
      this.queryRecordsInfo.queryPerArr = reflectEntity(queryList, ['name', 'depart', 'position'])
    },
    // 处理问答参数
    handleInfo(entityArr, fieldArr, type) {
      let table = type === 'que' ? '' : type === 'rec' ? '1' : '2'
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
    sure() {
      if (this.queryRecordsInfo.recordContent.trim().length === 0) {
        this.$message({
          type: 'warning',
          message: '请填写询问笔录'
        })
        return
      }
      this.$refs.queryRecordsInfo.validate((val, errInfo) => {
        if (val) {
          let queryRecordsData = getWritParams({
            tag2: dateFormat(this.queryRecordsInfo.queryTimeStart, 'yyyy年mm月dd日HH时MM分'),
            tag3: dateFormat(this.queryRecordsInfo.queryTimeEnd, 'yyyy年mm月dd日HH时MM分'),
            tag4: this.queryRecordsInfo.times,
            tag5: this.queryRecordsInfo.queryAddress,
            tag6: this.queryRecordsInfo.subjectName,
            tag7: this.queryRecordsInfo.sex,
            tag8: this.queryRecordsInfo.age,
            tag9: this.queryRecordsInfo.idCardNum,
            tag10: this.queryRecordsInfo.subjectCompany,
            tag11: this.queryRecordsInfo.position,
            tag12: this.queryRecordsInfo.address,
            tag13: this.queryRecordsInfo.phone,
            tag20: this.queryRecordsInfo.witness,
            tag21: this.queryRecordsInfo.fullDeptName, // 应急管理局
            tag24: this.queryRecordsInfo.question,
            tag25: this.queryRecordsInfo.recordContent
          })
          const arrQue = this.handleInfo(
            this.queryRecordsInfo.queryPerArr,
            [
              { num: 1, name: 'name' },
              { num: 2, name: 'depart' },
              { num: 3, name: 'position' }
            ],
            'que'
          )
          const arrRec = this.handleInfo(
            this.queryRecordsInfo.recorderArr,
            [
              { num: 1, name: 'name' },
              { num: 2, name: 'depart' },
              { num: 3, name: 'position' }
            ],
            'rec'
          )
          this.createReq.data = [...queryRecordsData, ...arrQue, ...arrRec]
          // this.createReq.data = [...queryRecordsData]
          this.$emit('createWrit', this.createReq)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    // 选择人员框
    checkPeople(person, titleName) {
      this.person = person
      this.dialogTitle = `请选择${titleName}`
      this.showPdfDialog = true
    },
    // 选择人员
    getPeople(bool, item) {
      if (bool) {
        this.person.name = item[0].nickName
        this.person.depart = item[0].deptName
        this.person.position = item[0].position
      }
      this.showPdfDialog = false
    },
    // 年龄根据身份证号算出
    changeId() {
      let age = GetAge(this.queryRecordsInfo.idCardNum)
      this.queryRecordsInfo.age = age ? age : ''
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  },
  watch: {
    'queryRecordsInfo.queryTimeStart': function(no, vo) {
      this.handlePicker()
    },
    'queryRecordsInfo.queryTimeEnd': function(no, vo) {
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
  position: absolute;
  bottom: 45px;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
}

.time_picker .el-form-item__content {
  display: flex;
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
