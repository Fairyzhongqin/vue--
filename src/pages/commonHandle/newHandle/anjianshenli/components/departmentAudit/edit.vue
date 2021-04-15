<template>
  <div class="penalty-bottom_button">
    <div class="depart-audit_content">
      <el-form
        label-width="100px"
        label-position="left"
        :rules="rules"
        ref="departmentAudit"
        :model="deptAuditInfo"
        :show-message="false"
      >
        <el-row>
          <el-col v-for="(item, index) in formData" :key="index" :span="item.span">
            <el-form-item
              :label-width="item.labelWidth"
              :prop="item.codeName"
            >
              <div slot="label" class="slot_label">{{item.label}}</div>
              <component
                :is="item.compont"
                v-model="deptAuditInfo[item.codeName]"
                :placeholder="item.placeholder"
                :type="item.type"
                :maxlength="item.maxlength"
                :autosize="item.autosize"
              >
                <span v-if="item.compont=='div'">{{ deptAuditInfo[item.codeName] }}</span>
                <component
                  v-for="(itm, ind) in item.child"
                  :key="ind"
                  :is="itm.compont"
                  :label="itm.label"
                  :value="itm.value"
                ></component>
              </component>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <br />

    <offence :actions="crit.breakLawCaseList" :isfolded="'yes'" :type="'look'"></offence>

    <bottom-bar>
      <el-button class="depart_cancel penalty-small_button" @click="goBack">取消</el-button>
      <el-button
        type="primary"
        class="penalty-small_button"
        @click="saveDepartAudit"
      >保存并生成行政处罚法制审核意见书</el-button>
    </bottom-bar>
  </div>
</template>
<script>
import bottomBar from '@/components/bottomBar'
import offence from '../component/offence' // 违法行为
import { getWritParams, dateFormat, handleDateRef } from '@/utils/util'
import { getWritDataByWritId } from '@api/fileRelated'
import { mapState } from 'vuex'
export default {
  name: 'departmentAuditEdit',
  components: {
    offence,
    bottomBar
  },
  props: ['crit', 'auditInfo'],
  data() {
    return {
      formData: [
        {
          label: '案件名称',
          codeName: 'caseName',
          compont: 'div',
          name: '',
          value: '',
          span: 24
        },
        {
          label: '案件来源',
          codeName: 'caseSource',
          compont: 'div',
          name: '',
          value: '',
          span: 12
        },
        {
          label: '呈报人',
          codeName: 'exerPerson',
          compont: 'div',
          name: '',
          value: '',
          span: 12,
          labelWidth: ''
        },
        {
          label: '呈报部门',
          codeName: 'exerDept',
          compont: 'div',
          name: '',
          value: '',
          span: 12,
          labelWidth: ''
        },

        {
          label: '呈报日期',
          compont: 'el-date-picker',
          codeName: 'repoTime',
          name: '',
          value: '',
          placeholder: '请选择呈报日期',
          span: 12
        }
        // {
        //   label: "审批事项",
        //   codeName: "repoItems",
        //   compont: "el-input",
        //   name: "",
        //   value: "",
        //   placeholder: "请输入审批事项",
        //   type: "textarea",
        //   maxlength: 2000,
        //   span: 24,
        //   autosize: { minRows: 1}
        // }
      ],
      deptAuditInfo: {
        // 行政处罚法制审核意见书所需信息
        caseName: '', // 案件名称 tag2
        caseSource: '', // 案件来源 tag5
        exerDept: '', // 呈报部门 tag3
        exerPerson: '', // 呈报人 tag4
        repoTime: '' // 呈报日期 tag6
        // repoItems: "法制审核材料" // 审批事项 tag7
      },
      rules: {
        /* exerOpinion: [
          { required: true, message: "请输入处理意见", trigger: "blur" }
        ] */
      }
    }
  },
  created() {
    if (this.auditInfo && this.auditInfo.writId) {
      this.reflect()
    } else {
      this.initDetail()
    }
  },
  methods: {
    initDetail() {
      let penalty = this.$store.state.penalty
      let user = JSON.parse(localStorage.getItem('res'))
      this.deptAuditInfo = {
        caseName: penalty.penaltyUndEntity.caseName, // 案件名称
        caseSource: penalty.caseSourceName, // 处罚单位
        exerDept: user.sysDeptEntity.name ? user.sysDeptEntity.name : '暂无', // 呈报部门
        exerPerson: user.userEntity.nickName, // 呈报人
        repoTime: new Date() // 呈报日期
        // repoItems: "法制审核材料" // 审批事项
      }
    },
    // 回显文书
    reflect() {
      getWritDataByWritId({ writId: this.auditInfo.writId }).then(res => {
        let inputInfo = res.data.reduce((total, item) => {
          switch (item.tagName) {
            case 'tag2':
              total.caseName = item.tagContent
              break
            case 'tag3':
              total.exerDept = item.tagContent
              break
            case 'tag4':
              total.exerPerson = item.tagContent
              break
            case 'tag5':
              total.caseSource = item.tagContent
              break
            case 'tag6':
              total.repoTime = handleDateRef(item.tagContent)
              break
            // case "tag7":
            //   total.repoItems =item.tagContent;
            //   break;
          }
          return total
        }, {})
        this.deptAuditInfo = inputInfo
      })
    },
    // 返回
    goBack() {
      this.$parent.getAudit()
    },
    // 制作行政处罚法制审核意见书，即提交法制审核处文书
    saveDepartAudit() {
      this.$refs.departmentAudit.validate(val => {
        if (val) {
          let _penalty = this.$store.state.penalty
          let data = getWritParams({
            tag2: this.deptAuditInfo.caseName, // 案件名称
            tag3: this.deptAuditInfo.exerDept, // 案件来源
            tag4: this.deptAuditInfo.exerPerson, // 呈报部门
            tag5: this.deptAuditInfo.caseSource, // 审批事项
            tag6: dateFormat(this.deptAuditInfo.repoTime, 'yyyy年mm月dd日') // 呈报日期
            // tag7: this.deptAuditInfo.repoItems // 审批事项
          })
          let params = {
              companyId: _penalty.penaltyUndEntity.punishCompanyId, //制作文书传company_id
            contractorIds: _penalty.penaltyUndEntity.udtIds,
            writType: 'XZCFJDFZSHYJS',
            sourceId: _penalty.penaltyUndEntity.penaltyId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          console.log('hhh')
        }
      })
    }
  }
}
</script>
<style lang="less" scope>
.depart-audit_content {
  padding: 12px 32px 0 16px !important;
  /deep/ .el-form-item {
    margin-bottom: 0;
    /deep/ textarea {
      margin-bottom: 10px;
    }
  }
}
.depart_cancel {
  background: white !important;
}
.penalty-bottom_button /deep/ .bottom-button-container {
  right: 0;
}
</style>
