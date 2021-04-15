<template>
  <div>
    <div class="addDiscretionary_content">
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <section class="shared_part">
        <el-form label-position="left" label-width="110px" :model="discInfo.discretionEntity" :rules="rules" ref="ruleForm">
          <el-row :gutter="40">
            <el-col v-for="(item, index) in formData" :span="item.span" :key="index">
              <el-form-item label-width="140px" :class="item.class" :prop="item.codeName">
                
                <div slot="label" class="slot_label">{{item.label}}</div>
                <component v-if="item.componentName != 'sn-select'"
                           :is="item.componentName"
                           v-model="discInfo.discretionEntity[item.codeName]"
                           :placeholder="item.placeholder"
                           :type="item.type"
                           :maxlength="item.maxlength"
                           :min="item.min"
                           :max="item.max"
                           @focus="handleDialog(item.codeName)"
                           autosize
                >
                </component>
                <component v-if="item.componentName == 'sn-select' && !item.hide"
                           :is="item.componentName"
                           v-model="discInfo.discretionEntity[item.codeName]"
                           :placeholder="item.placeholder"
                           :ref="item.codeName"
                           :data-url="item.url"
                           :requertData="item.data"
                           :immediate="item.noImmediate?false:true"
                           :multiple="item.multiple"
                           :codeName="item.codeName"
                ></component>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <section class="detail_part">
        <div>
          <label class="el-form-item__label">有业务细则：</label>
          <el-switch
            class="el-form-item__content rule__class"
            v-model="hasBussinessRule"
            active-color="#3CBB88"
            inactive-color="#BBBBBB"
            :active-value="'1'"
            :inactive-value="'0'"
            @change="changeHasBuss"
          ></el-switch>
        </div>
        <div v-show="hasBussinessRule">
          <div class="detail" v-for="(detail, index) in discInfo.discretionRulesList" :key="index">
            <el-row>
              <label class="el-form-item__label">{{index+1}}、业务条款：</label>
              <el-input class="el-form-item__content" v-model="detail.rules" placeholder="输入业务条款"></el-input>
            </el-row>
            <el-row>
              <label class="el-form-item__label">违反业务条款：</label>
              <el-input class="el-form-item__content" v-model="detail.violateRules" placeholder="输入违反业务条款"></el-input>
            </el-row>
            <el-row>
              <label class="el-form-item__label">肯定描述：</label>
              <el-input class="el-form-item__content" v-model="detail.confirmRules" placeholder="输入肯定描述"></el-input>
            </el-row>
            <div class="delete_buttons">
              <span @click="addDetail" v-if="index===discInfo.discretionRulesList.length-1">新增业务细则</span>
              <span class="delete" @click="deleteRule(index)">删除</span>
            </div>
          </div>
        </div>
      </section>
      <penalty-part :discretionLevelList="discInfo.discretionLevelList" :hasLevel="hasLevel"
                    @changeHasLevel="changeHasLevel"></penalty-part>
    </div>
    <footer>
      <el-button @click="backPage" plain>取消</el-button>
      <el-button type="primary" @click="save('ruleForm')">保存</el-button>
    </footer>
    <el-dialog
      title="选择监管行业分类"
      width="660px"
      :visible.sync="showTrade"
    >
      <!-- 中间内容部分 -->
      <select-type :chooseType="'tradeType'" :specialVal="specialVal" :isCheck="true" @closeDialog="closeDialog" @getType="getSelected"></select-type>
    </el-dialog>
    <el-dialog
      title="选择专项检查分类"
      width="660px"
      :visible.sync="showSpecial"
    >
      <!-- 中间内容部分 -->
      <select-type :chooseType="'specialType'" :specialVal="specialVal" :isCheck="true" @closeDialog="closeDialog" @getType="getSelected"></select-type>
    </el-dialog>
  </div>

</template>

<script>
  import penaltyPart from "../components/penaltyPart";
  import selectType from "../components/selectType";
  import snSelect from '@/components/snSelect'
  import {saveOrUpdateDisc, discDetail,deleteRule} from "@api/systemManagement/discretionManagement";

  export default {
    components: {
      penaltyPart,
      snSelect,
      selectType
    },
    data() {
      return {
        rules:
          {
            discretionCode: [
              {required: true, trigger: 'blur'}
            ],

            orderNum: [
              {required: true, trigger: 'blur'}
            ]
          }
        , // 业务细则条款列表
        hasBussinessRule: "0", // 是否有业务细则
        hasLevel: "0",//是否有上下限
        discInfo: {
          discretionEntity: {
            discretionCode:"",
            discretionTypeCode:"",
            tradeCodeArr:[],
            tradeCode:"",
            lawCodeArr:[],
            lawCode:"",
            examineContent:"",
            unlawfulAct:"",
            lawProvisionRule:"",
            lawProvisionsContent:"",
            penalizeBasisRule:"",
            penalizeBasisContent:"",
            orderNum:1
          },
          discretionLevelList: [{
            discretionLevelEntity: {
              levelContent: "",//处罚档次内容
              discretionRangeContent: "",//裁量幅度内容
              levelType: "", //档次类型：0- 正常 1-事故登记划分
              paramType: "0",//0 正常 1 违法所得 2 年收入
            },
            discretionValueList: [ //自由裁量上下线
              {
                objectType: "0",//处罚对象类型 1：个人 0：单位
                fixSum: null,//固定金额
              }, {
                objectType: "1",//处罚对象类型 1：个人 0：单位
                fixSum: null,//固定金额
              }
            ]
          }],
          discretionRulesList: [],
        },//自由裁量内容
        formData: [
          {
            label: "自由裁量编号",
            value: "",
            codeName: "discretionCode",
            componentName: "el-input",
            placeholder: "输入自由裁量编号",
            type: "text",
            maxlength: 20,
            span: 12
          },
          {
            label: "自由裁量分类",
            value: "",
            codeName: "discretionTypeCode",
            placeholder: "选择自由裁量分类",
            span: 12,
            componentName: "sn-select",
            url: '/aj/sys/sysdict/list',
            data: {type: 'free_court'},
            multiple: false
          },
          {
            label: "监管行业分类",
            value: "",
            codeName: "tradeName",
            componentName: "el-input",
            placeholder: "选择监管行业分类",
            type: "text",
            maxlength: 20,
            span: 12
          },
          {
            label: "专项检查分类",
            value: "",
            codeName: "specialName",
            componentName: "el-input",
            placeholder: "选择专项检查分类",
            type: "text",
            maxlength: 20,
            span: 12
          },
          {
            label: "法律条例",
            value: "",
            codeName: "lawCodeArr",
            placeholder: "选择法律条例",
            span: 24,
            componentName: "sn-select",
            url: '/aj/sys/sysdict/list',
            data: {type: 'free_lawt',parentId:''},
            multiple: true
          },
          {
            label: "检查内容",
            value: "",
            codeName: "examineContent",
            componentName: "el-input",
            placeholder: "输入检查内容",
            type: "textarea",
            maxlength: 2000,
            span: 24
          },
          {
            label: "肯定描述",
            value: "",
            codeName: "confirmRules",
            componentName: "el-input",
            placeholder: "输入肯定描述",
            type: "textarea",
            maxlength: 2000,
            span: 24
          },
          {
            label: "违法行为",
            value: "",
            codeName: "unlawfulAct",
            componentName: "el-input",
            placeholder: "输入违法行为",
            type: "textarea",
            maxlength: 2000,
            span: 24
          },
          {
            label: "法律规定条款",
            value: "",
            codeName: "lawProvisionRule",
            componentName: "el-input",
            placeholder: "输入法律规定条款",
            type: "textarea",
            maxlength: 2000,
            span: 24
          },
          {
            label: "法律规定内容",
            value: "",
            codeName: "lawProvisionsContent",
            componentName: "el-input",
            placeholder: "法律规定内容",
            type: "textarea",
            maxlength: 2000,
            span: 24
          },
          {
            label: "处罚依据条款",
            value: "",
            codeName: "penalizeBasisRule",
            componentName: "el-input",
            placeholder: "输入处罚依据条款",
            type: "textarea",
            maxlength: 2000,
            span: 24
          },
          {
            label: "处罚依据内容",
            value: "",
            codeName: "penalizeBasisContent",
            componentName: "el-input",
            placeholder: "输入处罚依据内容",
            type: "textarea",
            maxlength: 2000,
            span: 24
          },
          {
            label: "排序",
            value: "",
            codeName: "orderNum",
            componentName: "el-input-number",
            placeholder: "输入排序",
            placeholder: "",
            type: "number",
            maxlength: 10,
            min:1,
            max:999,
            span: 12
          }

        ],
        hasClick: false,
        showTrade:false,
        showSpecial:false,
        specialVal: []
      };
    },
    created() {
      this.initInfo();
    },
    mounted() {

    },
    methods: {
      handleDialog(val){
        if(val=='tradeName'){
          this.specialVal = this.discInfo.discretionEntity.tradeCode ? this.discInfo.discretionEntity.tradeCode.split(',') : []
          this.showTrade=true;
        }else if(val=='specialName'){
          this.specialVal = this.discInfo.discretionEntity.specialCode ? this.discInfo.discretionEntity.specialCode.split(',') : []
          this.showSpecial=true;
        }
      },
      closeDialog(val){
        if(val=='tradeType'){
          this.showTrade=false;
        }else if(val=='specialType'){
          this.showSpecial=false;
        }
      },
      getSelected(val,type){
        let code="";
        let name="";

        val.forEach((item, index) => {
          code=code+item.code+",";
          name=name+item.value+",";
        });
        if(type=='tradeType'){
          this.discInfo.discretionEntity.tradeCode="";
          this.discInfo.discretionEntity.tradeName="";
          this.discInfo.discretionEntity.tradeCode=code?code.substring(0,code.length-1):"";
          this.discInfo.discretionEntity.tradeName=name?name.substring(0,name.length-1):"";
        }else if(type=='specialType'){
          this.discInfo.discretionEntity.specialCode="";
          this.discInfo.discretionEntity.specialName="";
          this.discInfo.discretionEntity.specialCode=code?code.substring(0,code.length-1):"";
          this.discInfo.discretionEntity.specialName=name?name.substring(0,name.length-1):"";
        }

      },
      // firstClick (val) {
      //   if(val === 'lawCodeArr') {
      //     this.formData[3].data = {
      //       type: 'free_lawt',
      //       parentId: this.discInfo.discretionEntity.discretionTypeCode
      //     }
      //     setTimeout(()=>{
      //       this.$refs.lawCodeArr[0].initLoad()
      //     },0)
      //   }
      // },
      initInfo() {
        console.log("修改页面标记", this.$store.state.discId)
        if (this.$store.state.discId) {
          //有id的时候进行数据处理
          discDetail({discretionId: this.$store.state.discId})
            .then(res => {
              if (res.code === '0') {
                console.log("获取详情", res);
                this.discInfo = res.data;
                //是否有业务细则  -- 获取详情后重新赋值
                this.hasBussinessRule = this.discInfo.discretionEntity.hasBussinessRule;
                //是否有上下限  -- 获取详情后重新赋值
                this.hasLevel = this.discInfo.discretionEntity.hasLevel;
                //
                this.$set(this.discInfo.discretionEntity, 'tradeCodeArr', this.discInfo.discretionEntity.tradeCode ? this.discInfo.discretionEntity.tradeCode.split(",") : [])
                this.$set(this.discInfo.discretionEntity, 'lawCodeArr', this.discInfo.discretionEntity.lawCode ? this.discInfo.discretionEntity.lawCode.split(",") : [])

              } else {
                this.$message({
                  type: "error",
                  message: "获取详情失败！"
                });
              }
            });
        }

      },
      // 新增业务细则
      addDetail(ind) {
        this.discInfo.discretionRulesList.push({
          rules: "",//业务条款
          violateRules: "",//违反业务条款
          confirmRules:""
        });
      },
      // 删除业务细则
      deleteRule(ind) {
        if (this.discInfo.discretionRulesList.length == 1) {
          this.$message.error('请保证至少有一条业务细则');
        } else {
          if(this.discInfo.discretionRulesList[ind].discretionRulesId){
            console.log("要删除的id",this.discInfo.discretionRulesList[ind].discretionRulesId);
            this.$confirm('此操作将永久删除该自由裁量细则, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {

              deleteRule({
                ruleId: this.discInfo.discretionRulesList[ind].discretionRulesId
              })
                .then(res => {
                  if (res.code === '0') {
                    this.discInfo.discretionRulesList.splice(ind, 1);
                    this.$message.success('删除成功')
                  } else {
                    this.$message.error('删除失败')
                  }
                }) // eslint-disable-next-line handle-callback-err
                .catch(error => {
                  this.$message.error('网络错误')
                })
            })
          }else{
            this.discInfo.discretionRulesList.splice(ind, 1);
          }

        }

      },
      backPage() {
        this.$store.commit("setCurrDiscreComp", {
          component: "dataDisplay"
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("双向数据绑定", this.discInfo);
            this.discInfo.discretionEntity.lawCode = this.discInfo.discretionEntity.lawCodeArr.join(","); //法律条例
            //是否有业务细则
            this.discInfo.discretionEntity.hasBussinessRule = this.hasBussinessRule;
            //是否有上下限
            this.discInfo.discretionEntity.hasLevel = this.hasLevel;
            //业务细则数据封装
            /*this.detailList.forEach(val => {
              this.discInfo.discretionRulesList.push(val);
            });*/
            console.log("处理处罚档次之前的数据", this.discInfo);
            //处罚档次数据封装 有无上下限 有上下限的时候对数据进行处理
            if (this.hasLevel === '1') {
              //因为后台针对数据进行操作的时候 每个档次都处理了区分正常档次和涉及事故划分 所以重新封装数据格式
              this.discInfo.discretionLevelList.forEach(levelMapping => {
                //档次list罚款类型 0 正常金额 1 违法所得 2 年收入

                //因为后台中把具体的罚款类型区分为moneyType(0 金额 1 倍数) 和 paramType(0 正常 1 违法所得 2 年收入)两种类型
                //moneyType和 paramType 需要存储
                levelMapping.discretionValueList.forEach(valueItem => {
                  let paramType = valueItem.paramType;
                  if (paramType == '0') {
                    valueItem.moneyType = "0";
                  } else {
                    valueItem.moneyType = "1";
                  }
                })

              })
            }


            console.log("保存的info", this.discInfo);
            //return ;
            // 修改
            saveOrUpdateDisc(this.discInfo)
              .then(
                res => {
                if (res.code === '0') {
                    let info = "保存";
                    if(this.discInfo.discretionEntity.discretionId){
                        info = "修改";
                    }
                  this.$message({
                    type: "success",
                    message: info + "成功！"
                  });
                  this.backPage();
                } else {
                  this.$message({
                    type: "error",
                    message: info + "失败！"
                  });
                }
              },
                err => {
                  this.$message.error("自由裁量编号已存在");
                });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      changeHasLevel(val) {
        this.hasLevel = val;
      },
      changeHasBuss(val) {
        if (val === '1') {
          this.discInfo.discretionRulesList = [{
            rules: "",//业务条款
            violateRules: "",//违反业务条款
            confirmRules:""
          }];
        } else {
          this.discInfo.discretionRulesList = [];
        }
      }
    },
    // watch:{
    //   "discInfo.discretionEntity.discretionTypeCode": {
    //     handler: function(val, oldVal) {
    //       if(!oldVal) return
    //       this.formData[3].data={type: 'free_lawt',parentId:val};
    //       this.discInfo.discretionEntity.lawCodeArr = [];
    //       this.formData[3].hide = true
    //       this.$nextTick(()=>{
    //         this.formData[3].hide = false
    //         this.formData[3].noImmediate = true
    //       })
    //     },
    //     deep: true
    //   },
    //   "discInfo.discretionEntity.lawCodeArr": {
    //     handler: function(val, oldVal) {
    //       console.log("lawCodeArr",val)
    //     },
    //     deep: true
    //   }
    // }
  };
</script>

<style lang="less">
  .addDiscretionary_content {
    background: #fff;
    padding: 8px;
    margin: 8px 8px 54px 8px;
    box-sizing: border-box;
    width: calc(100% - 16px);
    padding: 16px 82px 33px;
    border-radius: 8px;
    height: 100%;
    position: relative;
    .shared_part {
      margin-top: 20px;
    }
    .detail_part {
      line-height: 40px;
      .detail {
        position: relative;
        padding: 9px 16px 30px 17px;
        margin-bottom: 9px;
        background: #eef5f9;
        &:last-child {
          margin-bottom: 0;
        }
        .el-form-item__label {
          width: 130px;
          text-align: left;
        }
        .el-row {
          display: flex;
          .el-input {
            flex-grow: 1;
          }
        }
        .delete_buttons {
          position: absolute;
          bottom: -8px;
          right: 17px;
          margin-top: 8px;
          font-size: 0;
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
    .back-button {
      position: absolute;
      left: 16px;
      top: 18px;
      color: #0099ff;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
      /deep/ .el-form-item__content {
        margin-left: 111px;
      }
      /deep/ .el-select {
        width: 100%;
      }
      &.radio /deep/ .el-form-item__content {
        margin-left: 50px;
      }
    }
    /deep/ .el-switch {
      vertical-align: middle;
    }
  }

  footer {
    height: 52px;
    text-align: center;
    background: white;
    line-height: 52px;
  }

  .rule__class{
    margin-left: 13px;
  }
  .el-form-item__error{
    display: none;
  }
  .el-textarea{
    margin-top: 10px;
  }
  .el-input-number__decrease ,.el-input-number__increase{
    line-height: 25px;
    width: 25px;
    height: 25px;
    top: 7px;
  }
</style>
