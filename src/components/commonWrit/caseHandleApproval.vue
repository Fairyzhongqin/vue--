<template>
  <!-- 案件处理呈批表 -->
  <div>
    <div class="case_handle_approval_content penalty-writ-form_content writ-overflow">
      <el-form ref="approvalInfo" :model="approvalInfo" :rules="rules" label-width="187px" label-position="right" :show-message="false">
        <el-row>
          <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
            <p class="input_text">{{ approvalInfo.caseName }}</p>
            <!-- <el-input v-model="approvalInfo.caseName" placeholder="案件名称" clearable></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20" v-if="approvalInfo.punishType === '0'">
          <el-col :span="24">
            <el-form-item label="" prop="compName">
              <div slot="label" class="slot_label">被处罚单位</div>
              <el-input v-model="approvalInfo.compName" placeholder="被处罚单位" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="compAddress">
              <div slot="label" class="slot_label">地址</div>
              <el-input v-model="approvalInfo.compAddress" placeholder="地址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label-width="94px" prop="compPostCode">
              <div slot="label" class="slot_label">邮政编码</div>
              <el-input v-model="approvalInfo.compPostCode" placeholder="邮政编码" maxlength="6" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="approvalInfo.punishType === '0'">
          <el-col :span="12">
            <el-form-item label="" prop="legalPerson">
              <div slot="label" class="slot_label">法定代表人/负责人</div>
              <el-input v-model="approvalInfo.legalPerson" placeholder="负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="93px" label="" prop="compJob">
              <div slot="label" class="slot_label">职务</div>
              <el-input v-model="approvalInfo.compJob" placeholder="职务" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="approvalInfo.punishType === '1'">
          <el-col :span="12">
            <el-form-item label="" prop="personName">
              <div slot="label" class="slot_label">被处罚人</div>
              <el-input v-model="approvalInfo.personName" placeholder="被处罚人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="94px" label="" prop="personAge">
              <div slot="label" class="slot_label">年龄</div>
              <el-input v-model="approvalInfo.personAge" placeholder="年龄" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="85px" label="" prop="personSex">
              <div slot="label" class="slot_label">性别</div>
              <el-select v-model="approvalInfo.personSex" placeholder="性别" @change="change_select">
                <el-option label="男" value="0"></el-option>
                <el-option label="女" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="personPhone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="approvalInfo.personPhone" placeholder="联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label-width="94px" prop="personPostCode">
              <div slot="label" class="slot_label">邮政编码</div>
              <el-input v-model="approvalInfo.personPostCode" placeholder="邮政编码" maxlength="6" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" prop="personComName">
              <div slot="label" class="slot_label">所在单位</div>
              <el-input v-model="approvalInfo.personComName" placeholder="所在单位" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" prop="personComAddress">
              <div slot="label" class="slot_label">单位地址</div>
              <el-input v-model="approvalInfo.personComAddress" placeholder="单位地址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" prop="personHomeAddress">
              <div slot="label" class="slot_label">家庭住址</div>
              <el-input v-model="approvalInfo.personHomeAddress" placeholder="家庭住址" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" class="mb5" prop="factAndPunishBasis">
              <div slot="label" class="slot_label">违法事实及处罚依据</div>
            <el-input
              type="textarea"
              v-model="approvalInfo.factAndPunishBasis"
              :autosize="{ minRows: 1 }"
              placeholder="违法事实及处罚依据"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" class="mb5" prop="explain">
              <div slot="label" class="slot_label">当事人的申辩意见</div>
            <el-input type="textarea" v-model="approvalInfo.explain" placeholder="当事人的申辩意见" :autosize="{ minRows: 1 }" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" class="mb5" prop="reviewOpinion">
              <div slot="label" class="slot_label">复核意见</div>
            <el-input
              type="textarea"
              v-model="approvalInfo.reviewOpinion"
              placeholder="对当事人的申辩意见的复核意见"
              :autosize="{ minRows: 1 }"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="" prop="contractor">
              <div slot="label" class="slot_label">承办人</div>
              <el-input v-model="approvalInfo.contractor" placeholder="承办人" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" class="mb5" prop="contractorIdea">
              <div slot="label" class="slot_label">承办人意见</div>
            <el-input v-model="approvalInfo.contractorIdea" type="textarea" :autosize="{ minRows: 1 }" placeholder="处理意见" clearable></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="padding: 10px;text-align: right;padding-right: 10px;">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成案件处理呈批表</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, getFirstErrMsg } from '@/utils/util'
import { getEnterpriseInfo } from '@/api/inspectionScheme'
import { getWritDataByWritId } from '@api/fileRelated'
export default {
  data() {
    return {
      rules: {
        caseName: [{ required: true, trigger: 'blur', message: '请输入案件名称' }],
        compName: [{ required: true, trigger: 'blur', message: '请输入被处罚单位' }],
        compAddress: [{ required: true, trigger: 'blur', message: '请输入地址' }],
        compPostCode: [
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
        ],
        legalPerson: [{ required: true, trigger: 'blur', message: '请输入法定代表人/负责人' }],
        compJob: [{ required: true, trigger: 'blur', message: '请输入职务' }],
        personName: [{ required: true, trigger: 'blur', message: '请输入被处罚人' }],
        personAge: [{ required: true, trigger: 'blur', message: '请输入年龄' }],
        personSex: [{ required: true, trigger: 'blur', message: '请选择性别' }],
        personComName: [{ required: true, trigger: 'blur', message: '请输入所在单位' }],
        personComAddress: [{ required: true, trigger: 'blur', message: '请输入单位地址' }],
        personHomeAddress: [{ required: true, trigger: 'blur', message: '请输入家庭住址' }],
        personPhone: [
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
        personPostCode: [
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
        ],
        factAndPunishBasis: [{ required: true, trigger: 'blur', message: '请输入违法事实及处罚依据' }],
        explain: [{ required: true, trigger: 'blur', message: '请输入当事人的申辩意见' }],
        reviewOpinion: [{ required: true, trigger: 'blur', message: '请输入复核意见' }],
        contractor: [{ required: true, trigger: 'blur', message: '请输入承办人' }],
        contractorIdea: [{ required: true, trigger: 'blur', message: '请输入承办人意见' }]
      },
      approvalInfo: {
        caseName: '', // 案件名称 tag2
        punishType: '', // 处罚类型
        compName: '', // 被处罚单位 tag3
        compAddress: '', // 地址 tag4
        legalPerson: '', // 法定代表人 tag5
        compJob: '', // 职务 tag6
        compPostCode: '', // 邮政编码 tag7
        personName: '', // 被处罚人 tag8
        personAge: '', // 年龄 tag9
        personSex: '0', // 性别 tag10
        personComName: '', // 所在单位 tag11
        personComAddress: '', // 单位地址 tag12
        personHomeAddress: '', // 家庭住址 tag13
        personPhone: '', // 联系电话 tag14
        personPostCode: '', // 邮政编码 tag15
        factAndPunishBasis: '', // 违法事实及处理依据 tag16
        explain: '', // 当事人的申辩意见 tag17
        reviewOpinion: '', // 复核意见 tag18
        contractorIdea: '', // 承办人意见 tag19
        contractor: '' // 承办人
      }
    }
  },
  props: {
    info: {
      type: Object
    }
  },
  mounted() {
    if (this.info && this.info.writInfo) {
      this.echo(this.info.writInfo)
    } else {
      this.initInfo()
    }
  },
  methods: {
    change_select() {
      this.$forceUpdate()
    },
    initInfo() {
      let _penalty = this.$store.state.penalty
      if (this.info.auditInfo.objectType === '0') {
        // 单位
        getEnterpriseInfo({
          id: _penalty.penaltyUndEntity.punishCompanyId
        }).then(res => {
          this.approvalInfo = {
            caseName: this.info.auditInfo.caseName,
            punishType: this.info.auditInfo.objectType,
            contractor: this.info.auditInfo.responsiblePerson, // 这个字段文书里没用到
            factAndPunishBasis: this.handleTag(),
            explain: '无', // 当事人的申辩意见
            reviewOpinion: '无',
            contractorIdea: this.info.auditInfo.caseOpinion, // 承办意见
            compName: _penalty.punishCompanyName,
            legalPerson: res.data.legalPerson ? res.data.legalPerson : '',
            compJob: res.data.primaryPersonJob ? res.data.primaryPersonJob : '',
            compPostCode: this.info.auditInfo.postCode,
            compAddress: _penalty.penaltyUndEntity.objectAddress,
            contractor: _penalty.udtNames
          }
        })
      }
      if (this.info.auditInfo.objectType === '1') {
        this.approvalInfo = {
          caseName: this.info.auditInfo.caseName,
          punishType: this.info.auditInfo.objectType,
          contractor: this.info.auditInfo.responsiblePerson, // 这个字段文书里没用到
          factAndPunishBasis: this.handleTag(), // 违法事实 area
          explain: '无', // 当事人的申辩意见
          reviewOpinion: '无',
          contractorIdea: this.info.auditInfo.caseOpinion, // 承办意见
          personName: _penalty.penaltyUndEntity.punishPersonName,
          personAge: _penalty.penaltyUndEntity.age, // 年龄 tag9
          personSex: _penalty.penaltyUndEntity.sex, // 性别 tag10
          personComName: _penalty.penaltyUndEntity.currentCompany, // 所在单位 tag11
          personComAddress: _penalty.penaltyUndEntity.currentCompanyAddress, // 单位地址 tag12
          personHomeAddress: _penalty.penaltyUndEntity.objectAddress, // 家庭住址 tag13
          personPhone: _penalty.penaltyUndEntity.telphone, // 联系电话 tag14
          personPostCode: _penalty.penaltyUndEntity.postCode, // 邮政编码 tag15
          contractor: _penalty.udtNames
        }
      }
    },
    // 处理违法行为及处罚依据
    handleTag() {
      let lawArr = [],
        basisArr = [],
        actArr = []
      let subject = this.info.auditInfo.objectType === '0' ? '该公司' : this.info.auditInfo.punishPersonName
      this.info.auditInfo.blcList.map(item => {
        lawArr.push(item.lawContentRule)
        basisArr.push(item.penaltyAcdNameRule)
        actArr.push(item.actName)
      })
      lawArr = lawArr.filter(Boolean)
      basisArr = basisArr.filter(Boolean)
      actArr = actArr.filter(Boolean)
      let str = `发现${subject}${actArr.join(',')}，其行为违反了${lawArr.join(',')}。依据${basisArr.join('')}，应当给与行政处罚。`
      return str
    },
    echo(info) {
      this.approvalInfo.contractor = this.$store.state.penalty.udtNames
      this.approvalInfo.punishType = this.info.auditInfo.objectType
      info.map(item => {
        switch (item.tagName) {
          case 'tag2':
            this.approvalInfo.caseName = item.tagContent
            break
          case 'tag3':
            this.approvalInfo.compName = item.tagContent
            break
          case 'tag4':
            this.approvalInfo.compAddress = item.tagContent
            break
          case 'tag5':
            this.approvalInfo.legalPerson = item.tagContent
            break
          case 'tag6':
            this.approvalInfo.compJob = item.tagContent
            break
          case 'tag7':
            this.approvalInfo.compPostCode = item.tagContent
            break
          case 'tag8':
            this.approvalInfo.personName = item.tagContent
            break
          case 'tag9':
            this.approvalInfo.personAge = item.tagContent
            break
          case 'tag10':
            this.approvalInfo.personSex = item.tagContent
            break
          case 'tag11':
            this.approvalInfo.personComName = item.tagContent
            break
          case 'tag12':
            this.approvalInfo.personComAddress = item.tagContent
            break
          case 'tag13':
            this.approvalInfo.personHomeAddress = item.tagContent
            break
          case 'tag14':
            this.approvalInfo.personPhone = item.tagContent
            break
          case 'tag15':
            this.approvalInfo.personPostCode = item.tagContent
            break
          case 'tag16':
            this.approvalInfo.factAndPunishBasis = item.tagContent
            break
          case 'tag17':
            this.approvalInfo.explain = item.tagContent
            break
          case 'tag18':
            this.approvalInfo.reviewOpinion = item.tagContent
          case 'tag19':
            this.approvalInfo.contractorIdea = item.tagContent
            break
          default:
            return
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.approvalInfo.validate((valid, errInfo) => {
        if (valid) {
          // 根据punishType判断
          let data = getWritParams({
            tag2: this.approvalInfo.caseName,
            tag3: this.approvalInfo.compName,
            tag4: this.approvalInfo.compAddress,
            tag5: this.approvalInfo.legalPerson,
            tag6: this.approvalInfo.compJob,
            tag7: this.approvalInfo.compPostCode,
            tag8: this.approvalInfo.personName,
            tag9: this.approvalInfo.personAge,
            tag10: this.approvalInfo.punishType === '1' ? (this.approvalInfo.personSex === '0' ? '男' : '女') : '',
            tag11: this.approvalInfo.personComName,
            tag12: this.approvalInfo.personComAddress,
            tag13: this.approvalInfo.personHomeAddress,
            tag14: this.approvalInfo.personPhone,
            tag15: this.approvalInfo.personPostCode,
            tag16: this.approvalInfo.factAndPunishBasis,
            tag17: this.approvalInfo.explain,
            tag18: this.approvalInfo.reviewOpinion,
            tag19: this.approvalInfo.contractorIdea
          })
          let params = {
            companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'AJCLCPB',
            sourceId: this.info.auditInfo.sourceId,
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
    seal() {
      let _audiReq = {
        auditTypeCode: 'ta80018',
        handlerDeptId: '', // 审核人部门 id
        handlerUserId: '', // 审核人
        requestDeptName: JSON.parse(localStorage.getItem('res')).userEntity.deptName, // 承办人部门
        requestId: this.info.writId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.info.responsiblePerson, // 承办人名称
        submitterCause: this.info.caseName //companyName
      }
      this.$emit('toSeal', _audiReq)
    }
  }
}
</script>

<style lang="less" scoped>
.case_handle_approval_content {
  padding: 4px 16px;
  .el-form-item {
    margin-bottom: 0;
  }
}
p.input_text {
  margin: 0;
  line-height: 40px;
}
</style>
