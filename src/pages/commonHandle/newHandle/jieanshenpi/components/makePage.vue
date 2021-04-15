<template>
  <div class="make_lay penalty-bottom_button">
    <div class="create-tab-title">结案审批</div>
    <div class="lay">
      <el-form label-width="110px" label-position="left" :model="submitData" ref="submitData" :rules="rules" :show-message="false">
        <el-row>
          <el-col v-for="(item, index) in formData" v-show="!item.hide" :key="index" :span="item.span">
            <el-form-item :class="item.class" :prop="item.codeName" label-width="110px">
              
              <div slot="label" class="slot_label">{{item.label}}</div>
              <component
                :class="item.class ? 'vab' : ''"
                :is="item.compont"
                v-model="submitData[item.codeName]"
                :placeholder="item.placeholder"
                :type="item.type"
                autosize
              >
                <span v-if="item.compont == 'div'">{{ submitData[item.codeName] }}</span>
                <component v-for="(itm, ind) in item.child" :key="ind" :is="itm.compont" :label="itm.label" :value="itm.value"></component>
              </component>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <bottom-bar>
      <el-button class="end penalty-small_button" @click="goBack">取消</el-button>
      <el-button type="primary" class="penalty-small_button" @click="makeCase">保存并生成结案审批表</el-button>
    </bottom-bar>
  </div>
</template>

<script>
import { getDataInfo } from '@/api/enterpriseInfo'
import { getWritParams } from '@/utils/util'
import { createWrit, updateWrit, getWritInfo, getWritDataByWritId } from '@api/fileRelated'
import { getCurrentProcess } from '@/api/filingRegister/index'
import bottomBar from '@/components/bottomBar'

export default {
  name: 'jieanshenpiMakePage',
  components: {
    bottomBar
  },
  data() {
    let penalty = this.$store.state.penalty
    // this.
    return {
      formData: [],
      penalty: {},
      companyInfo: {},
      rules: {
        situation: [{ required: true, message: '执行情况', trigger: 'blur' }]
      },
      submitData: {
        punishObject: '',
        legalPerson: '',
        primaryPerson: '',
        primaryPersonJob: '',
        telphone: '',
        postCode: '',
        objectAddress: '',
        udtNames: '',
        deptName: '',
        result: '',
        situation: '',
        opinion: ''
      },
      formData: [
        {
          codeName: 'punishObject',
          label: '当事人',
          compont: 'div',
          name: '',
          value: '',
          span: 12,
          labelWidth: '100px'
        },
        {
          codeName: 'legalPerson',
          label: '法定代表人',
          compont: 'div',
          name: '',
          value: '',
          span: 12,
          hide: penalty.penaltyUndEntity.objectType !== '0'
        },
        {
          codeName: 'primaryPerson',
          label: '负责人',
          compont: 'div',
          name: '',
          value: '',
          span: 12,
          hide: penalty.penaltyUndEntity.objectType !== '0'
        },
        {
          codeName: 'primaryPersonJob',
          label: '职务',
          compont: 'div',
          name: '',
          value: '',
          span: 12
        },
        {
          codeName: 'telphone',
          label: '单位电话',
          compont: 'div',
          name: '',
          value: '',
          span: 12
        },
        {
          codeName: 'postCode',
          label: '邮政编码',
          compont: 'div',
          name: '',
          value: '',
          span: 12
        },
        {
          codeName: 'objectAddress',
          label: '地址',
          compont: 'div',
          name: '',
          value: '',
          span: 24
        },
        {
          codeName: 'udtNames',
          label: '承办人',
          compont: 'div',
          name: '',
          value: '',
          span: 12
        },
        {
          codeName: 'deptName',
          label: '承办单位',
          compont: 'div',
          name: '',
          value: '',
          span: 12
        },
        {
          codeName: 'result',
          label: '处理结果',
          compont: 'el-input',
          name: '',
          value: '',
          placeholder: '输入处理结果',
          type: 'textarea',
          span: 24
        },
        {
          codeName: 'situation',
          label: '执行情况',
          compont: 'el-input',
          name: '',
          value: '',
          type: 'textarea',
          placeholder: '输入执行情况',
          span: 24,
          rule: 'zxqk'
        },
        {
          codeName: 'opinion',
          label: '承办人意见',
          compont: 'el-input',
          name: '',
          type: 'textarea',
          value: '',
          placeholder: '请输入承办人意见',
          span: 24
        }
      ]
    }
  },
  props: ['writInfo'],
  created() {
    this.getPunishWrit()
    this.initPage()
  },
  methods: {
    initPage() {
      this.penalty = this.$store.state.penalty
      let _entity = this.penalty.penaltyUndEntity
      if (_entity.objectType === '0') {
        this.getCompanyInfo(_entity.punishCompanyId)
      } else {
        this.setFormData()
      }
    },
    // 获取处罚决定书
    getPunishWrit() {
      let types = ['XXCFJDSDW', 'XXCFJDSGR', 'BYXZCFJDS']
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: types.join(',')
      }
      getWritInfo(req).then(res => {
        let desWrits = res.data
        desWrits.forEach(doc => {
          if (types.indexOf(doc.writTypeName) >= 0) {
            this.getCaseOpinion(doc.writTypeName, doc)
          }
        })
      })
    },
    // 获取处罚决定书决定
    getCaseOpinion(type, doc) {
      let tagInd
      if (type === 'BYXZCFJDS') {
        tagInd = 'tag5'
      } else if (type === 'XXCFJDSDW') {
        tagInd = 'tag11'
      } else {
        tagInd = 'tag14'
      }
      console.info('tagInd', tagInd)

      getWritDataByWritId({ writId: doc.writId }).then(info => {
        info.data.forEach(tag => {
          if (tag.tagName === tagInd) {
            console.info('tag', tag)
            this.submitData.opinion = tag.tagContent
            // this.formData[11].value = tag.tagContent
          }
        })
      })
    },
    makeCase() {
      this.$refs['submitData'].validate(val => {
        if (val) {
          let _entity = this.penalty.penaltyUndEntity
          let companyInfo = this.companyInfo
          let _isComp = _entity.objectType === '0'
          let data = getWritParams({
            tag2: _entity.caseName,
            tag3: _isComp ? this.penalty.punishCompanyName : '',
            tag4: _isComp ? _entity.objectAddress : '', // 地址
            tag5: _isComp ? companyInfo.legalPerson : '', // 法人
            tag6: this.submitData.primaryPersonJob, // 主要负责人职务
            tag7: _isComp ? _entity.postCode : '',
            tag8: _isComp ? '' : _entity.punishPersonName,
            tag9: _isComp ? '' : _entity.age,
            tag10: _isComp ? '' : _entity.sex === '1' ? '女' : '男',
            tag11: _isComp ? '' : _entity.currentCompany,
            tag12: _isComp ? '' : _entity.currentCompanyAddress, // 企业地址/单位地址
            tag13: _isComp ? '' : _entity.objectAddress, // 家庭地址
            tag14: _isComp ? '' : _entity.telphone,
            tag15: _isComp ? '' : _entity.postCode,
            tag16: this.submitData.result, // 处理结果
            tag17: this.submitData.situation, // 执行情况
            tag18: this.submitData.opinion // 承办人意见
          })
          let params = {
              companyId: _entity.punishCompanyId, //制作文书传company_id
            contractorIds: _entity.udtIds,
            writType: 'JASPB',
            sourceId: _entity.penaltyId,
            data: data
          }
          // 创建文书
          this.createWrit(params)
        } else {
          this.$message({
            type: 'warning',
            message: '还有必填项没有填写！'
          })
        }
      })
      // if(this.searchformData("执行情况").value == ''){
      //    this.$message.error('请输入执行情况！');
      //    return false
      // }else{

      // }
    },
    // 回到上一页
    goBack() {
      this.$parent.initStatus()
    },
    // 生成文书
    createWrit(reqData) {
      if (this.writInfo && this.writInfo.writId) {
        updateWrit({ writId: this.writInfo.writId }, reqData.data).then(
          res => {
            this.getMessage('success', '制作成功！')
            this.$parent.initStatus('afterCreated')
          },
          err => {
            this.getMessage('error', '制作失败！')
          }
        )
        return
      }
      createWrit(reqData)
        .then(res => {
          this.getMessage('success', '制作成功！')
          this.$parent.initStatus('afterCreated')
        })
        .catch(err => {
          this.getMessage('error', '制作失败！')
        })
    },
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    getCompanyInfo(id) {
      getDataInfo({
        id: id
      }).then(res => {
        this.companyInfo = res.data
        // 获取完整企业信息才能展示
        this.setFormData()
      })
    },
    setFormData() {
      let _companyInfo = this.companyInfo
      let _penalty = this.penalty
      let _entity = _penalty.penaltyUndEntity
      this.submitData = {
        punishObject: _entity.objectType === '0' ? _penalty.punishCompanyName : _entity.punishPersonName,
        legalPerson: _companyInfo.legalPerson || '暂无',
        primaryPerson: _companyInfo.primaryPerson || '暂无',
        primaryPersonJob: _companyInfo.primaryPersonJob || '暂无',
        telphone: _entity.telphone || '暂无',
        postCode: _entity.postCode || '暂无',
        objectAddress: _entity.objectAddress || '暂无',
        udtNames: _penalty.udtNames || '暂无',
        deptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name,
        result: '',
        situation: '',
        opinion: ''
      }

      this.setResult(_penalty) // 查询处理处罚决定中的处理结果
    },
    setResult(_penalty) {
      getWritInfo({
        sourceId: _penalty.penaltyUndEntity.penaltyId,
        type: _penalty.penaltyUndEntity.objectType === '0' ? 'XXCFJDSDW' : 'XXCFJDSGR'
      })
        .then(res => {
          return getWritDataByWritId({
            writId: res.data[0].writId
          })
        })
        .then(res => {
          let cfjd = '',
            obj = '',
            wf = '',
            yj = ''
          // 单位tag11是处罚决定，个人tag14是处罚决定
          res.data.map(_item => {
            if (_item.tagName === 'tag2') {
              // 处罚对象
              obj = _item.tagContent
            }
            // 违反了
            if (_item.tagName === 'tag9' && _penalty.penaltyUndEntity.objectType === '0') {
              wf = _item.tagContent
            }
            if (_item.tagName === 'tag12' && _penalty.penaltyUndEntity.objectType === '1') {
              wf = _item.tagContent
            }
            // 依据
            if (_item.tagName === 'tag10' && _penalty.penaltyUndEntity.objectType === '0') {
              yj = _item.tagContent
            }
            if (_item.tagName === 'tag13' && _penalty.penaltyUndEntity.objectType === '1') {
              yj = _item.tagContent
            }
            // 处罚决定
            if (_item.tagName === 'tag11') {
              if (_penalty.penaltyUndEntity.objectType === '0') {
                cfjd = _item.tagContent
              }
            }
            if (_item.tagName === 'tag14') {
              if (_penalty.penaltyUndEntity.objectType === '1') {
                cfjd = _item.tagContent
              }
            }
          })
          this.submitData.result = `${obj}违反了${wf}依据${yj}的规定，决定给予${cfjd}的行政处罚`
          // this.formData[9].value = `${obj}违反了${wf}依据${yj}的规定，决定给予${cfjd}的行政处罚`
        })
    },
    searchformData(label) {
      let value
      this.formData.map(data => {
        if (data.label === label) {
          value = data
        }
      })
      return value
    },
    echo() {
      //
      getWritInfo({
        sourceId: this.penalty.penaltyUndEntity.penaltyId,
        type: 'JASPB'
      })
        .then(res => {
          return getWritDataByWritId({
            writId: res.data[0].writId
          })
        })
        .then(res => {
          res.data.map(_item => {
            if (_item.tagName === 'tag16') {
              this.submitData.result = _item.tagContent
              // this.formData[9].value = _item.tagContent
            }
            if (_item.tagName === 'tag17') {
              this.submitData.situation = _item.tagContent
              // this.formData[10].value = _item.tagContent
            }
            if (_item.tagName === 'tag18') {
              this.submitData.opinion = _item.tagContent
              // this.formData[11].value = _item.tagContent
            }
          })
        })
    }
  }
}
</script>

<style lang="less" scope>
.make_lay {
  .el-form-item {
    margin-bottom: 0px;
  }
  .lay {
    padding: 0 16px;
  }
}
.penalty-bottom_button {
  /deep/ .bottom-button-container {
    right: 0;
  }
  .end {
    background: #ffffff;
  }
  &.transfer_book_content {
    padding: 3px 16px 0;
  }
}
</style>
