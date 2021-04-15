<template>
  <el-form :model="enterprise" :disabled="isDisabled">
    <table style="width: 100%">
      <tbody>
        <tr>
        <!-- <tr v-if="!isDialog"> -->
          <td colspan="7" class="bgc-white">
            <el-button v-if="!edit&&!isDialog" type="primary" @click="saveOrUpdate">保存</el-button>

            <a
              class="external-link"
              href="http://www.jsgsj.gov.cn:58888/ecipplatform/login.jsp"
              target="_blank"
            >国家企业信用信息公示系统（江苏）</a>
          </td>
        </tr>

        <!--企业基本信息-->
        <tr class="tr-bg">
          <td rowspan="7">企业基本信息</td>

          <td width="200">
            <span class="required"></span>
            企业名称
          </td>
          <td colspan="5" style="text-align: left;">
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.companyName"
              placeholder="企业名称"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td width="200">
            <span class="required"></span>
            统一社会信用代码
          </td>
          <td colspan="2" style="text-align: left;">
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.companyCode"
              placeholder="统一社会信用代码"
            ></el-input>
          </td>
          <td>企业组织机构代码</td>
          <td colspan="2" style="text-align: left;">
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.companyOrgNo"
              placeholder="企业组织机构代码"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>所在地区</td>
          <td colspan="5" style="text-align: left;">
            <el-select
              :disabled="edit"
              style="width: 23%!important"
              v-model="enterprise.regionProvince"
              clearable
              placeholder="省"
              @change="changeProvince"
            >
              <el-option
                v-for="item in provinceOptions"
                :key="item.id"
                :label="item.dataName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              :disabled="edit"
              style="width: 25%!important"
              v-model="enterprise.regionCity"
              clearable
              placeholder="市"
              @change="changeCity"
            >
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.dataName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              :disabled="edit"
              style="width: 25%!important"
              v-model="enterprise.regionDistrict"
              clearable
              placeholder="区"
              @change="changeDistrict"
            >
              <el-option
                v-for="item in districtOptions"
                :key="item.id"
                :label="item.dataName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              :disabled="edit"
              style="width: 25%!important"
              v-model="enterprise.regionCommunity"
              clearable
              placeholder="镇/街道"
            >
              <el-option
                v-for="item in streetOptions"
                :key="item.id"
                :label="item.dataName"
                :value="item.id"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>生产经营地址</td>
          <td colspan="5">
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.businessAddress"
              placeholder="具体地址(如：xx路（街道）xx号)"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>注册地址</td>
          <td colspan="3">
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.registerAddress"
              placeholder="注册地址"
            ></el-input>
          </td>
          <td>成立时间</td>
          <td>
            <el-date-picker
              class="time_picker_padding"
              :readonly="edit"
              type="date"
              :clearable="false"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              v-model="enterprise.foundedDate"
              placeholder="成立时间"
            ></el-date-picker>
          </td>
        </tr>
        <tr>
          <td>是否为国有企业</td>
          <td>
            <template>
              <el-radio v-model="enterprise.goventflag" label="是">是</el-radio>
              <el-radio v-model="enterprise.goventflag" label="否">否</el-radio>
            </template>
          </td>
          <td>行政隶属关系</td>
          <td>
            <template>
              <el-select
                :disabled="edit"
                v-model="enterprise.administrativeGrade"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in administrativeGradeOptions"
                  :key="item.dataName"
                  :label="item.dataName"
                  :value="item.dataName"
                ></el-option>
              </el-select>
            </template>
          </td>
          <td></td>
          <td></td>
          <!-- <td>行业主管部门</td>
          <td>
          <template>
              <el-select :disabled="edit" v-model="enterprise.industDept" placeholder="请选择">
              <el-option
                  v-for="item in industDeptOptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
              ></el-option>
              </el-select>
          </template>
          </td>-->
        </tr>
        <tr class="row_fading">
          <td class="row_fading_people">法定代表人</td>
          <td class="row_fading_people">
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.legalPerson"
              placeholder="法定代表人"
            ></el-input>
          </td>
          <td class="row_fading_people">法定代表人固定电话</td>
          <td class="row_fading_people">
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.legalPersonTelephone"
              placeholder="法定代表人固定电话"
            ></el-input>
          </td>
          <td class="row_fading_people">法定代表人手机</td>
          <td class="row_fading_people">
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.legalPersonMobilephone"
              placeholder="法定代表人手机"
            ></el-input>
          </td>
        </tr>

        <!-- 相关联系人 -->
        <tr class="tr-bg">
          <td rowspan="7">相关联系人</td>
          <td>联系人</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.contactPerson"
              placeholder="联系人"
            ></el-input>
          </td>
          <td>联系人电话</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.contactPhone"
              placeholder="联系人电话"
            ></el-input>
          </td>
          <td>联系人QQ号</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.contactQq"
              placeholder="联系人QQ号"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>联系人电子邮箱</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.contactEmail"
              placeholder="联系人电子邮箱"
            ></el-input>
          </td>
          <td>联系人微信号</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.contactWechat"
              placeholder="联系人微信号"
            ></el-input>
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>主要负责人</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.primaryPerson"
              placeholder="主要负责人"
            ></el-input>
          </td>
          <td>主要负责人固定电话</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.primaryPersonTelephone"
              placeholder="主要负责人固定电话"
            ></el-input>
          </td>
          <td>主要负责人移动电话</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.primaryPersonMobilephone"
              placeholder="主要负责人移动电话"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>主要负责人职务</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.primaryPersonJob"
              placeholder="主要负责人职务"
            ></el-input>
          </td>
          <td>主要负责人电子邮箱</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.primaryPersonEmail"
              placeholder="主要负责人电子邮箱"
            ></el-input>
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>安全负责人</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.safetyPrimaryPerson"
              placeholder="安全负责人"
            ></el-input>
          </td>
          <td>安全负责人固定电话</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.safetyPrimaryPersonTelephone"
              placeholder="安全负责人固定电话"
            ></el-input>
          </td>
          <td>安全负责人移动电话</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.safetyPrimaryPersonMobilephone"
              placeholder="安全负责人移动电话"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>安全负责人电子邮箱</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.safetyPrimaryPersonEmail"
              placeholder="安全负责人电子邮箱"
            ></el-input>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>安全管理负责人</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.safetyManagePerson"
              placeholder="安全管理负责人"
            ></el-input>
          </td>
          <td>安全管理人员联系电话</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.safetyManagePersonMobilephone"
              placeholder="安全管理人员联系电话"
            ></el-input>
          </td>
          <td></td>
          <td></td>
        </tr>

        <!-- 国民经济分类 -->
        <tr class="tr-bg">
          <td rowspan="5">国民经济分类</td>
          <td>经济类型大类</td>
          <td colspan="2">
            <template>
              <el-select
                :disabled="edit"
                v-model="enterprise.companyEconomicType"
                placeholder="请选择"
                @change="changeCompanyEconomicTypes"
              >
                <el-option
                  v-for="item in companyEconomicTypeOptions"
                  :key="item.id"
                  :label="item.dataName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </td>
          <td>经济类型小类</td>
          <td colspan="2">
            <template>
              <el-select
                :disabled="edit"
                v-model="enterprise.companyEconomicSubtype"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in companyEconomicSubtypeOptions"
                  :key="item.id"
                  :label="item.dataName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </td>
        </tr>
        <tr>
          <td>国民经济分类门类</td>
          <td colspan="5">
            <template>
              <el-select
                multiple
                :disabled="edit"
                v-model="enterprise.industryCategory"
                size="mini"
                @change="changeIndustryCategorys"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in industryCategoryOptions"
                  :key="item.id"
                  :label="item.dataName"
                  :value="item.dataCode"
                ></el-option>
              </el-select>
            </template>
          </td>
        </tr>
        <tr>
          <td>国民经济分类大类</td>
          <td colspan="5">
            <template>
              <el-select
                multiple
                :disabled="edit"
                v-model="enterprise.industryTypeBig"
                size="mini"
                @change="changeIndustryTypeBigs"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in industryTypeBigOptions"
                  :key="item.id"
                  :label="item.dataName"
                  :value="item.dataCode"
                ></el-option>
              </el-select>
            </template>
          </td>
        </tr>
        <tr>
          <td>国民经济分类中类</td>
          <td colspan="5">
            <template>
              <el-select
                multiple
                :disabled="edit"
                v-model="enterprise.industryTypeMiddle"
                size="mini"
                @change="changeIndustryTypeMiddles"
                placeholder="请选择"
                :value-key="valueKey"
              >
                <el-option
                  v-for="item in industryTypeMiddleOptions"
                  :key="item.id"
                  :label="item.dataName"
                  :value="item.dataCode"
                ></el-option>
              </el-select>
            </template>
          </td>
        </tr>
        <tr>
          <td>国民经济分类小类</td>
          <td colspan="5">
            <template>
              <el-select
                multiple
                :disabled="edit"
                v-model="enterprise.industryTypeSmall"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in industryTypeSmallOptions"
                  :key="item.id"
                  :label="item.dataName"
                  :value="item.dataCode"
                ></el-option>
              </el-select>
            </template>
          </td>
        </tr>

        <!-- 行业监管分类 -->
        <tr class="tr-bg">
          <td
            :rowspan="(supervisionIndustryAllTypeOptions?supervisionIndustryAllTypeOptions:[]).length+1"
          >行业监管分类</td>
          <td>行业监管大类</td>
          <td colspan="5" class="td-span-btn">
            <span
              v-for="(item,index) in supervisionIndustryAllTypeOptions"
              :class="(supervisionIndustryAllTypeOptions && supervisionIndustryAllTypeOptions[index] && supervisionIndustryAllTypeOptions[index].childChosed?supervisionIndustryAllTypeOptions[index].childChosed:[]).length>0?'dsd-span':''"
              :key="index"
            >{{item.dataName}}</span>
          </td>
        </tr>

        <tr>
          <td :rowspan="supervisionIndustryAllTypeOptions.length">行业监管小类</td>
          <td colspan="5" class="dc-td-bgFFF">
            <span>{{supervisionIndustryAllTypeOptions[0].dataName}}</span>
            <template>
            <span>(</span>
            <el-checkbox-group
              :disabled="edit"
              v-model="supervisionIndustryAllTypeOptions[0].childChosed"
            >
              <el-checkbox
                v-for="item in supervisionIndustryAllTypeOptions[0].child"
                :key="item.id"
                :value="item.id"
                :label="item.id"
              >{{item.dataName}}</el-checkbox>
            </el-checkbox-group>
            <span>)</span>
            </template>
          </td>
        </tr>

        <tr
          v-for="(item,index) in supervisionIndustryAllTypeOptions"
          v-show="index > 0"
          :key="item.id"
        >
          <td colspan="5" class="dc-td-bgFFF">
            <span>{{item.dataName}}</span>
            <template>
              <span>(</span>
              <el-checkbox-group
                :disabled="edit"
                v-model="supervisionIndustryAllTypeOptions[index].childChosed"
              >
                <el-checkbox
                  v-for="item2 in item.child"
                  :key="item2.id"
                  :value="item2.id"
                  :label="item2.id"
                >{{item2.dataName}}</el-checkbox>
              </el-checkbox-group>
              <span>)</span>
            </template>
          </td>
        </tr>

        <!-- 企业其他信息 -->
        <tr class="tr-bg">
          <td rowspan="9">企业其他信息</td>
          <td>企业类型</td>
          <td colspan="5">
            <template>
              <el-checkbox-group :disabled="edit" v-model="enterprise.enterpriseTypeList">
                <el-checkbox
                  v-for="item in enterpriseTypeArr"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </td>
        </tr>
        <tr>
          <td>是否有专门安全机构</td>
          <td>
            <template>
              <el-radio :disabled="edit" v-model="enterprise.isofSafetyInstitution" label="是">是</el-radio>
              <el-radio :disabled="edit" v-model="enterprise.isofSafetyInstitution" label="否">否</el-radio>
            </template>
          </td>
          <td>标准化等级</td>
          <td>
            <template>
              <el-select :disabled="edit" v-model="enterprise.standardLevel" placeholder="请选择">
                <el-option
                  v-for="item in standardLevelOptions"
                  :key="item.id"
                  :label="item.dataName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </td>
          <td>是否有专职安全人员</td>
          <td>
            <template>
              <el-radio
                :disabled="edit"
                v-model="enterprise.isofProfessionalSafetyStaff"
                label="是"
              >是</el-radio>
              <el-radio
                :disabled="edit"
                v-model="enterprise.isofProfessionalSafetyStaff"
                label="否"
              >否</el-radio>
            </template>
          </td>
        </tr>
        <tr>
          <td>是否存在重大危险源</td>
          <td>
            <template>
              <el-radio :disabled="edit" v-model="enterprise.isofMajorHazardSources" label="是">是</el-radio>
              <el-radio :disabled="edit" v-model="enterprise.isofMajorHazardSources" label="否">否</el-radio>
            </template>
          </td>
          <td>是否有隐患排查治理计划</td>
          <td>
            <template>
              <el-radio :disabled="edit" v-model="enterprise.isofSafetyControlPlan" label="是">是</el-radio>
              <el-radio :disabled="edit" v-model="enterprise.isofSafetyControlPlan" label="否">否</el-radio>
            </template>
          </td>
          <td>是否有隐患排查治理制度</td>
          <td>
            <template>
              <el-radio :disabled="edit" v-model="enterprise.isofSafetyControlRules" label="是">是</el-radio>
              <el-radio :disabled="edit" v-model="enterprise.isofSafetyControlRules" label="否">否</el-radio>
            </template>
          </td>
        </tr>
        <tr>
          <td>是否有应急物资</td>
          <td>
            <template>
              <el-radio :disabled="edit" v-model="enterprise.isofEmergencyMaterials" label="是">是</el-radio>
              <el-radio :disabled="edit" v-model="enterprise.isofEmergencyMaterials" label="否">否</el-radio>
            </template>
          </td>
          <td>是否有职业卫生三同时</td>
          <td>
            <template>
              <el-radio :disabled="edit" v-model="enterprise.isofHealthyThree" label="是">是</el-radio>
              <el-radio :disabled="edit" v-model="enterprise.isofHealthyThree" label="否">否</el-radio>
            </template>
          </td>
          <td>是否有安全设施三同时</td>
          <td>
            <template>
              <el-radio :disabled="edit" v-model="enterprise.isofSafetyEquipmentThree" label="是">是</el-radio>
              <el-radio :disabled="edit" v-model="enterprise.isofSafetyEquipmentThree" label="否">否</el-radio>
            </template>
          </td>
        </tr>
        <tr>
          <td>单位传真</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.companyFaxNo"
              placeholder="单位传真"
            ></el-input>
          </td>
          <td>邮政编码</td>
          <td>
            <el-input
              maxlength="10"
              :readonly="edit"
              type="text"
              v-model="enterprise.postalCode"
              placeholder="邮政编码"
            ></el-input>
          </td>
          <td>规模情况</td>
          <td>
            <template>
              <el-select :disabled="edit" v-model="enterprise.isScalable" placeholder="请选择">
                <el-option
                  v-for="item in isScalableTypeOptions"
                  :key="item.dataCode"
                  :label="item.dataName"
                  :value="item.dataCode"
                ></el-option>
              </el-select>
            </template>
          </td>
        </tr>
        <tr>
          <td>企业规模</td>
          <td>
            <template>
              <el-select :disabled="edit" v-model="enterprise.companyScaleGrade" placeholder="请选择">
                <el-option
                  v-for="item in companyScaleGradeOptions"
                  :key="item.dataName"
                  :label="item.dataName"
                  :value="item.dataName"
                ></el-option>
              </el-select>
            </template>
          </td>
          <td>企业经营状态</td>
          <td>
            <template>
              <el-select
                :disabled="edit"
                v-model="enterprise.companyOperationStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in companyOperationStatusOptions"
                  :key="item.dataName"
                  :label="item.dataName"
                  :value="item.dataName"
                ></el-option>
              </el-select>
            </template>
          </td>
          <td>营业执照类别</td>
          <td>
            <template>
              <el-select
                :disabled="edit"
                v-model="enterprise.businessLicenseType"
                value-key="dataName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in businessLicenseTypeOptions"
                  :key="item.dataName"
                  :label="item.dataName"
                  :value="item.dataName"
                ></el-option>
              </el-select>
            </template>
          </td>
        </tr>
        <tr>
          <td>注册资金</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.registeredCapital"
              placeholder="注册资金"
            ></el-input>
          </td>
          <td>占地面积</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.companyCoverAreaSize"
              placeholder="占地面积"
            ></el-input>
          </td>
          <td>经营范围</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.businessScope"
              placeholder="经营范围"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>(由主管部门设置)专项治理类别</td>
          <td>
            <template>
              <el-select
                :disabled="edit"
                multiple
                size="mini"
                v-model="enterprise.companySupervisionTypes"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in companySupervisionTypeOptions"
                  :key="item.id"
                  :label="item.dataName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </td>
          <td>年销售收入(万元)</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.annualTotalSale"
              placeholder="年销售收入(万元)"
            ></el-input>
          </td>
          <td>年利润(万元)</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.annualProfits"
              placeholder="年利润(万元)"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>资产总额(万元)</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.companyTotalAssets"
              placeholder="资产总额(万元)"
            ></el-input>
          </td>
          <td>集团公司名称</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.groupCorporationName"
              placeholder="集团公司名称"
            ></el-input>
          </td>
          <td>企业官方网站地址</td>
          <td>
            <el-input
              :readonly="edit"
              type="text"
              v-model="enterprise.companyWebsite"
              placeholder="企业官方网站地址"
            ></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form>
</template>

<script>
import { getOptions, getDataInfo, getJglx, saveData, updateStateFunc } from '@api/enterpriseInfo/index'

import { mapState } from 'vuex'
export default {
  props: {
    enterpriseId: {
      type: String
    },
    type: {
      type: String
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      edit: false,
      enterprise: {
        companyName: '', // 企业名称
        companyCode: '', // 统一社会信用代码
        companyOrgNo: '', // 企业组织机构代码
        regionProvince: '', // 所在省
        regionCity: '', // 所在市
        regionDistrict: '', // 所在区
        regionCommunity: '', // 所在镇/街道
        businessAddress: '', // 具体地址
        registerAddress: '', // 注册地址
        foundedDate: '', // 成立时间
        goventflag: '', // 是否为国有企业
        administrativeGrade: '', // 行政隶属关系
        legalPerson: '', // 法定代表人
        legalPersonTelephone: '', // 法定代表人固定电话
        legalPersonMobilephone: '', // 法定代表人手机
        contactPerson: '', // 联系人
        contactPhone: '', // 联系人电话
        contactQq: '', // 联系人QQ号
        contactEmail: '', // 联系人电子邮箱
        contactWechat: '', // 联系人微信号
        primaryPerson: '', // 主要负责人
        primaryPersonTelephone: '', // 主要负责人固定电话
        primaryPersonMobilephone: '', // 主要负责人移动电话
        primaryPersonJob: '', // 主要负责人职务
        primaryPersonEmail: '', // 主要负责人电子邮箱
        safetyPrimaryPerson: '', // 安全负责人
        safetyPrimaryPersonTelephone: '', // 安全负责人固定电话
        safetyPrimaryPersonMobilephone: '', // 安全负责人移动电话
        safetyPrimaryPersonEmail: '', // 安全负责人电子邮箱
        safetyManagePerson: '', // 安全管理负责人
        safetyManagePersonMobilephone: '', // 安全管理人员联系电话
        companyEconomicType: '', // 经济类型大类
        companyEconomicSubtype: '', // 经济类型小类
        industryCategory: '', // 国民经济分类门类
        industryTypeBig: '', // 国民经济分类大类
        industryTypeMiddle: '', // 国民经济分类中类
        industryTypeSmall: '', // 国民经济分类小类
        enterpriseTypeList: [], // 企业类型
        isofSafetyInstitution: '', // 是否有专门安全机构
        standardLevel: '', // 标准化等级
        isofProfessionalSafetyStaff: '', // 是否有专职安全人员
        isofMajorHazardSources: '', // 是否存在重大危险源
        isofSafetyControlPlan: '', // 是否有隐患排查治理计划
        isofSafetyControlRules: '', // 是否有隐患排查治理制度
        isofEmergencyMaterials: '', // 是否有应急物资
        isofHealthyThree: '', // 是否有职业卫生三同时
        isofSafetyEquipmentThree: '', // 是否有安全设施三同时
        companyFaxNo: '', // 单位传真
        postalCode: '', // 邮政编码
        isScalable: '', // 规模情况
        companyScaleGrade: '', // 企业规模
        companyOperationStatus: '', // 企业经营状态
        businessLicenseType: '', // 营业执照类别
        registeredCapital: '', // 注册资金
        companyCoverAreaSize: '', // 占地面积
        businessScope: '', // 经营范围
        companySupervisionTypes: '', // 专项治理类别 111
        annualTotalSale: '', // 年销售收入
        annualProfits: '', // 年利润
        companyTotalAssets: '', // 资产总额
        groupCorporationName: '', // 集团公司名称
        companyWebsite: '', // 企业官方网站地址
        jghydl: ''
      },
      provinceOptions: [
        {
          dataName: ''
        }
      ], // 省列表
      cityOptions: [
        {
          dataName: ''
        }
      ], // 市列表
      districtOptions: [
        {
          dataName: ''
        }
      ], // 区列表
      streetOptions: [
        {
          dataName: ''
        }
      ], // 镇/街道列表
      administrativeGradeOptions: [
        {
          dataName: ''
        }
      ], // 行政隶属关系
      companyEconomicTypeOptions: [
        {
          dataName: ''
        }
      ], // 经济类型大类
      companyEconomicSubtypeOptions: [
        {
          dataName: ''
        }
      ], // 经济类型小类
      industryCategoryOptions: [
        {
          dataName: ''
        }
      ], // 国民经济分类门类
      industryTypeBigOptions: [
        {
          dataName: ''
        }
      ], // 国民经济分类大类
      industryTypeMiddleOptions: [
        {
          dataName: ''
        }
      ], // 国民经济分类中类
      industryTypeSmallOptions: [
        {
          dataName: ''
        }
      ], // 国民经济分类小类
      supervisionIndustryAllTypeOptions: [
        {
          dataName: '',
          id: ''
        }
      ],
      isExplosiveDustCompany: '',
      isAmmoniaRefrigeratingCompany: '',
      isFiniteSpaceCompany: '',
      isMajorHazardsCompany: '',
      isGasCompany: '',
      // 行业监管大类
      enterpriseTypeArr: [
        //企业类型
        {
          value: 'isExplosiveDustCompany',
          label: '涉爆粉尘企业'
        },
        {
          value: 'isAmmoniaRefrigeratingCompany',
          label: '涉氨制冷企业'
        },
        {
          value: 'isFiniteSpaceCompany',
          label: '有限空间企业'
        },
        {
          value: 'isMajorHazardsCompany',
          label: '重大危险源企业'
        },
        {
          value: 'isMetalSmelterCompany',
          label: '金属冶炼企业'
        },
        {
          value: 'isGasCompany',
          label: '冶金煤气企业'
        }
      ],
      standardLevelOptions: [], // 标准化等级
      isScalableTypeOptions: [], // 规模情况
      companyScaleGradeOptions: [], // 企业规模
      companyOperationStatusOptions: [], // 企业经营状态
      businessLicenseTypeOptions: [], // 营业执照类别
      companySupervisionTypeOptions: [], // 专项治理类别
      valueKey: '0' //value-key
    }
  },
  computed: {
    ...mapState(['newRectificationShow'])
  },
  created() {
    if (this.type == 'modify') {
      this.getData()
    }
    if (this.newRectificationShow) {
      this.getLsgxList()
      this.getProvincesList()
      this.getCompanyEconomicTypeList()
      this.getIndustryCategoryList()
      this.getBzhdjList()
      this.getGmqkList()
      this.getQygmList()
      this.getQyjyztList()
      this.getYyzzlbList()
      this.getZxzllxList()
      this.getZxjgList()
    }
  },
  methods: {
    // 获取回显数据
    getData() {
      getDataInfo({
        id: this.enterpriseId
      }).then(res => {
        console.log(res)
        for (let key in res.data) {
          let _value = res.data[key]
          if (_value || (typeof _value === 'object' && _value !== null)) {
            if (['companySupervisionTypes', 'industryCategory', 'industryTypeBig', 'industryTypeMiddle', 'industryTypeSmall'].indexOf(key) !== -1) {
              this.enterprise[key] = _value ? _value.split(',') : ''
            } else if (key === 'isExplosiveDustCompany') {
              if (_value === '是') {
                this.enterprise.enterpriseTypeList.push('isExplosiveDustCompany')
              }
            } else if (key === 'isAmmoniaRefrigeratingCompany') {
              if (_value === '是') {
                this.enterprise.enterpriseTypeList.push('isAmmoniaRefrigeratingCompany')
              }
            } else if (key === 'isFiniteSpaceCompany') {
              if (_value === '是') {
                this.enterprise.enterpriseTypeList.push('isFiniteSpaceCompany')
              }
            } else if (key === 'isMajorHazardsCompany') {
              if (_value === '是') {
                this.enterprise.enterpriseTypeList.push('isMajorHazardsCompany')
              }
            } else if (key === 'isMetalSmelterCompany') {
              if (_value === '是') {
                this.enterprise.enterpriseTypeList.push('isMetalSmelterCompany')
              }
            } else if (key === 'isGasCompany') {
              if (_value === '是') {
                this.enterprise.enterpriseTypeList.push('isGasCompany')
              }
            } else {
              this.enterprise[key] = _value
            }
          }
        }

        // this.enterprise.companySupervisionTypes=res.data.companySupervisionTypes?res.data.companySupervisionTypes.split(','):'';
        // this.enterprise.industryCategory=res.data.industryCategory?res.data.industryCategory.split(','):'';  //国民经济分类门类
        // this.enterprise.industryTypeBig=res.data.industryTypeBig?res.data.industryTypeBig.split(','):'';//
        // this.enterprise.industryTypeMiddle=res.data.industryTypeMiddle?res.data.industryTypeMiddle.split(','):''
        // this.enterprise.industryTypeSmall=res.data.industryTypeSmall?res.data.industryTypeSmall.split(','):''

        // if(this.enterprise.isExplosiveDustCompany&&this.enterprise.isExplosiveDustCompany=='是'){
        //   this.enterprise.enterpriseTypeList = [];
        //   this.enterprise.enterpriseTypeList.push('isExplosiveDustCompany');
        // }
        console.log(this.enterprise, 'enterpriseenterprise')
        this.getProvincesList()
        this.changeProvince('preview')
        this.changeCity('preview')
        this.changeDistrict('preview')
        this.changeCompanyEconomicTypes('preview')
        this.changeIndustryCategorys('preview')
        this.changeIndustryTypeBigs('preview')
        this.changeIndustryTypeMiddles('preview')
      })
    },
    // 保存
    saveOrUpdate() {
      console.log(this.enterprise.enterpriseTypeList)
      if (!this.enterprise.companyName) {
        this.$message.error('请设置企业名称')
        return
      }
      if (!this.enterprise.companyCode) {
        this.$message.error('请设置统一社会信用代码')
        return
      }
      let ids = '' //行业监管大类id
      let id = '' //行业监管小类id
      this.supervisionIndustryAllTypeOptions.map(item => {
        console.log(item, '213123123')
        if (item.id) {
          if (item.childChosed.length > 0) {
            id += item.id + ','
          }
          item.childChosed.map(i => {
            ids += i + ','
          })
        }
      })
      id = id.substring(0, id.length - 1)
      ids = ids.substring(0, ids.length - 1)

      this.enterprise.enterpriseTypeList.map(item => {
        switch (item) {
          case 'isExplosiveDustCompany':
            this.isExplosiveDustCompany = '是'
            break
          case 'isAmmoniaRefrigeratingCompany':
            this.isAmmoniaRefrigeratingCompany = '是'
            break
          case 'isFiniteSpaceCompany':
            this.isFiniteSpaceCompany = '是'
            break
          case 'isMajorHazardsCompany':
            this.isMajorHazardsCompany = '是'
            break
          case 'isMetalSmelterCompany':
            this.isMetalSmelterCompany = '是'
            break
          case 'isGasCompany':
            this.isGasCompany = '是'
            break
        }
      })
      if (this.type == 'add') {
        saveData({
          ...this.enterprise,
          jghydl: id,
          jghyxl: ids,
          isExplosiveDustCompany: this.isExplosiveDustCompany,
          isAmmoniaRefrigeratingCompany: this.isAmmoniaRefrigeratingCompany,
          isFiniteSpaceCompany: this.isFiniteSpaceCompany,
          isMajorHazardsCompany: this.isMajorHazardsCompany,
          isGasCompany: this.isGasCompany,
          enterpriseTypeList: '',
          companySupervisionTypes: this.enterprise && this.enterprise.companySupervisionTypes ? this.enterprise.companySupervisionTypes.toString() : '',
          industryCategory: this.enterprise && this.enterprise.industryCategory ? this.enterprise.industryCategory.toString() : '',
          industryTypeBig: this.enterprise && this.enterprise.industryTypeBig ? this.enterprise.industryTypeBig.toString() : '',
          industryTypeMiddle: this.enterprise && this.enterprise.industryTypeMiddle ? this.enterprise.industryTypeMiddle.toString() : '',
          industryTypeSmall: this.enterprise && this.enterprise.industryTypeSmall ? this.enterprise.industryTypeSmall.toString() : ''
        }).then(res => {
          if (res.code == '0') {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
            this.$emit('backPage')
          }
        })
      } else {
        console.log(this.enterprise, '8888888888')
        this.enterprise.createdTime = this.enterprise.createdTime ? this.enterprise.createdTime.replace(/\//g, '-') + ':00' : ''
        this.enterprise.syncNonEntTime = this.enterprise.syncNonEntTime ? this.enterprise.syncNonEntTime.replace(/\//g, '-') + ':00' : ''
        this.enterprise.updatedTime = this.enterprise.updatedTime ? this.enterprise.updatedTime.replace(/\//g, '-') + ':00' : ''
        updateStateFunc({
          id: this.enterpriseId,
          ...this.enterprise,
          jghyxl: ids,
          jghydl: id,
          isExplosiveDustCompany: this.isExplosiveDustCompany,
          isAmmoniaRefrigeratingCompany: this.isAmmoniaRefrigeratingCompany,
          isFiniteSpaceCompany: this.isFiniteSpaceCompany,
          isMajorHazardsCompany: this.isMajorHazardsCompany,
          isGasCompany: this.isGasCompany,
          enterpriseTypeList: '',
          companySupervisionTypes: this.enterprise && this.enterprise.companySupervisionTypes ? this.enterprise.companySupervisionTypes.toString() : '',
          industryCategory: this.enterprise && this.enterprise.industryCategory ? this.enterprise.industryCategory.toString() : '',
          industryTypeBig: this.enterprise && this.enterprise.industryTypeBig ? this.enterprise.industryTypeBig.toString() : '',
          industryTypeMiddle: this.enterprise && this.enterprise.industryTypeMiddle ? this.enterprise.industryTypeMiddle.toString() : '',
          industryTypeSmall: this.enterprise && this.enterprise.industryTypeSmall ? this.enterprise.industryTypeSmall.toString() : ''
        }).then(res => {
          if (res.code == '0') {
            this.$message({
              type: 'success',
              message: '修改成功！'
            })

            this.$emit('backPage')
          }
        })
      }
    },
    // 获取省份
    getProvincesList() {
      getOptions({
        typeId: '0b8415e08bf3474686e643318c0a497c',
        parentId: -1
      }).then(res => {
        this.provinceOptions = res.data
      })
    },
    // 点击省获取市
    changeProvince(preview, val) {
      if (preview !== 'preview') {
        this.enterprise.regionCity = ''
        this.enterprise.regionDistrict = ''
        this.enterprise.regionCommunity = ''
        this.cityOptions = []
        this.districtOptions = []
        this.streetOptions = []
      }

      getOptions({
        typeId: '0b8415e08bf3474686e643318c0a497c',
        parentId: this.enterprise.regionProvince
      }).then(res => {
        if (res.code === '0') {
          this.cityOptions = res.data
        }
      })
    },
    // 点击市获取区
    changeCity(preview) {
      if (preview !== 'preview') {
        this.enterprise.regionDistrict = ''
        this.enterprise.regionCommunity = ''
        this.districtOptions = []
        this.streetOptions = []
      }

      getOptions({
        typeId: '0b8415e08bf3474686e643318c0a497c',
        parentId: this.enterprise.regionCity
      }).then(res => {
        if (res.code === '0') {
          this.districtOptions = res.data
        }
      })
    },
    // 点击市获取街道
    changeDistrict(preview) {
      if (preview !== 'preview') {
        this.enterprise.regionCommunity = ''
        this.streetOptions = []
      }
      getOptions({
        typeId: '0b8415e08bf3474686e643318c0a497c',
        parentId: this.enterprise.regionDistrict
      }).then(res => {
        if (res.code === '0') {
          this.streetOptions = res.data
        }
      })
    },
    // 获取隶属关系
    getLsgxList() {
      getOptions({
        typeId: 'lsgx',
        parentId: -1
      }).then(res => {
        if (res.code === '0') {
          this.administrativeGradeOptions = res.data
          console.log(this.administrativeGradeOptions, ' this.administrativeGradeOptions')
        }
      })
    },
    // 获取经济类型大类
    getCompanyEconomicTypeList() {
      getOptions({
        typeId: 'jjlx',
        parentId: -1
      }).then(res => {
        if (res.code === '0') {
          this.companyEconomicTypeOptions = res.data
        }
      })
    },
    // 点击大类获取小类
    changeCompanyEconomicTypes(preview) {
      if (preview !== 'preview') {
        this.enterprise.companyEconomicSubtype = ''
        this.companyEconomicSubtypeOptions = []
      }

      getOptions({
        typeId: 'jjlx',
        parentId: this.enterprise.companyEconomicType
      }).then(res => {
        if (res.code === '0') {
          this.companyEconomicSubtypeOptions = res.data
        }
      })
    },
    // 获取国民经济分类门类
    getIndustryCategoryList() {
      getOptions({
        typeId: '564bb95106d04970ae494b32982360ea',
        parentId: -1
      }).then(res => {
        if (res.code === '0') {
          this.industryCategoryOptions = res.data
          console.log(this.industryCategoryOptions)
        }
      })
    },
    // 点击门类获取大类
    changeIndustryCategorys(preview) {
      if (preview !== 'preview') {
        this.industryTypeBigOptions = []
        this.industryTypeMiddleOptions = []
        this.industryTypeSmallOptions = []
        this.enterprise.industryTypeBig = ''
        this.enterprise.industryTypeMiddle = ''
        this.enterprise.industryTypeSmall = ''
      }
      let params = this.enterprise.industryCategory.toString()
      getOptions({
        typeId: '564bb95106d04970ae494b32982360ea',
        parentId: params
      }).then(res => {
        if (res.code === '0') {
          this.industryTypeBigOptions = res.data
        }
      })
    },
    // 点击大类获取中类
    changeIndustryTypeBigs(preview) {
      if (preview !== 'preview') {
        this.industryTypeMiddleOptions = []
        this.industryTypeSmallOptions = []
        this.enterprise.industryTypeMiddle = ''
        this.enterprise.industryTypeSmall = ''
      }
      let params = this.enterprise.industryTypeBig.toString()
      getOptions({
        typeId: '564bb95106d04970ae494b32982360ea',
        parentId: params
      }).then(res => {
        console.log('中类中类', res)
        if (res.code === '0') {
          this.industryTypeMiddleOptions = res.data
        }
      })
    },
    // 点击中类获取小类
    changeIndustryTypeMiddles(preview) {
      if (preview !== 'preview') {
        this.industryTypeSmallOptions = []
        this.enterprise.industryTypeSmall = ''
      }
      let params = this.enterprise.industryTypeMiddle.toString()
      getOptions({
        typeId: '564bb95106d04970ae494b32982360ea',
        parentId: params
      }).then(res => {
        if (res.code === '0') {
          this.industryTypeSmallOptions = res.data
        }
      })
    },
    // 获取标准化等级
    getBzhdjList() {
      getOptions({
        typeId: 'bzhdj',
        parentId: -1
      }).then(res => {
        if (res.code === '0') {
          this.standardLevelOptions = res.data
        }
      })
    },
    // 获取规模情况
    getGmqkList() {
      getOptions({
        typeId: 'gmqk',
        parentId: -1
      }).then(res => {
        this.isScalableTypeOptions = res.data
      })
    },
    // 获取企业规模
    getQygmList() {
      getOptions({
        typeId: 'qygm',
        parentId: -1
      }).then(res => {
        this.companyScaleGradeOptions = res.data
      })
    },
    // 获取企业经营状态
    getQyjyztList() {
      getOptions({
        typeId: 'qyjyzt',
        parentId: -1
      }).then(res => {
        this.companyOperationStatusOptions = res.data
      })
    },
    // 获取营业执照类别
    getYyzzlbList() {
      getOptions({
        typeId: 'yyzzlb',
        parentId: -1
      }).then(res => {
        this.businessLicenseTypeOptions = res.data
      })
    },
    // 获取专项治理类别
    getZxzllxList() {
      getOptions({
        typeId: 'zxzllx',
        parentId: -1
      }).then(res => {
        this.companySupervisionTypeOptions = res.data
      })
    },
    // 获取行业监管大类
    getZxjgList() {
      getJglx().then(res => {
        res.data.forEach(item => {
          item.childChosed = []
        })
        this.supervisionIndustryAllTypeOptions = res.data
        let arr = []
        console.log(this.supervisionIndustryAllTypeOptions, 753)
        arr = this.enterprise.jghyxl ? this.enterprise.jghyxl.split(',') : []
        arr.map(item => {
          this.supervisionIndustryAllTypeOptions.map(i => {
            i.child.map(j => {
              if (j.id == item) {
                i.childChosed.push(item)
              }
            })
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.required {
  width: 10px;
  height: 16px;
  display: inline-block;
  position: relative;
}
.required:before {
  position: absolute;
  content: '*';
  color: rgb(245, 108, 108);
  margin-left: 1px;
  transform: translate(0, -1px);
  vertical-align: middle;
  font-size: 20px;
  height: 100%;
}
/deep/ .el-checkbox-group {
  display: inline-block;
}
.td-span-btn span {
  display: inline-block;
  border: 1px solid #dcdfe6;
  color: #dcdfe6;
  padding: 0px 10px;
  text-align: center;
  min-width: 50px;
  line-height: 26px;
  border-radius: 2px;
  margin: 2px;
}
.td-span-btn .dsd-span {
  color: #fff;
  background: #4281cd;
  border-color: #78a9d7;
}
table {
  border-right: 1px solid #a0c0e6;
  border-collapse: collapse;
  width: 100%;
}
table .bgc-white {
  background-color: #fff !important;
}
.external-link {
  float: right;
  line-height: 30px;
  margin-right: 5px;
}
a:visited {
  color: #1273eb;
}
.tr-bg td:nth-child(1) {
  width: 1em;
  min-width: 1em;
  padding-left: 10px;
  padding-right: 10px;
}
.tr-bg td:nth-child(even),
.tr-bg td:nth-child(1) {
  background-color: #ecf2fa !important;
}
.tr-bg td:nth-child(odd) {
  background-color: #fff !important;
}
.el-form > table > tbody > tr > td {
  border-left: 1px solid #a0c0e6;
  border-top: 1px solid #a0c0e6;
  border-bottom: 1px solid #a0c0e6;
  text-align: left;
  padding: 3px;
  // min-width: 100px;
  font-size: 14px;
}
.el-form > table > tbody > .row_fading > .row_fading_people {
  border-left: 1px solid #a0c0e6;
  border-top: 1px solid #a0c0e6;
  border-bottom: 1px solid #a0c0e6;
  text-align: left;
  padding: 3px;
  // min-width: 100px;
  font-size: 14px;
}
input,
.el-select,
.el-date-editor {
  width: 100% !important;
}
td:nth-child(odd) {
  background-color: #ecf2fa;
}
.dc-td-bgFFF {
  background-color: #fff !important;
}
.time_picker_padding {
  /deep/input {
    &.el-input__inner {
      padding-right: 10px;
    }
  }
}
</style>