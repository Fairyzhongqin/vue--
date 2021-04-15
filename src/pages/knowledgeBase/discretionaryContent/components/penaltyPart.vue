<template>
  <div>
    <section class="penalty_part">
      <div>
        <label class="el-form-item__label">有罚款上下限：</label>
        <el-switch
          class="el-form-item__content"
          v-model="hasLevel"
          active-color="#3CBB88"
          inactive-color="#BBBBBB"
          active-value="1"
          inactive-value="0"
          @change="changeHasLevel"
        ></el-switch>
      </div>
      <!-- 固定罚款 -->
      <div class="detail fixed" v-if="hasLevel=='0'">
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-for="(detail, index) in discretionLevelList[0].discretionValueList"
            :key="index"
          >
            <label class="el-form-item__label" v-if="detail.objectType=='0'">单位罚款：</label>
            <label class="el-form-item__label" v-if="detail.objectType=='1'">个人罚款：</label>
            <el-input class="el-form-item__content money" v-model="detail.fixSum"></el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 有罚款上下限 -->
      <div v-if="hasLevel=='1'">
        <div class="detail ranged" v-for="(detail, index) in discretionLevelList" :key="index">
          <el-row>
            <label class="el-form-item__label">{{index+1}}、处罚档次内容：</label>
            <el-input
              class="el-form-item__content"
              placeholder="输入处罚档次内容"
              v-model="detail.discretionLevelEntity.levelContent"
            ></el-input>
          </el-row>
          <el-row>
            <label class="el-form-item__label">裁量幅度内容：</label>
            <el-input
              class="el-form-item__content"
              placeholder="输入裁量幅度内容"
              v-model="detail.discretionLevelEntity.discretionRangeContent"
            ></el-input>
          </el-row>
          <!-- 正常的处罚过程 -->
          <div>
            <div v-for="(discValue, dvIndex) in detail.discretionValueList" :key="dvIndex">
              <el-row>
                <label class="el-form-item__label" v-if="discValue.objectType=='0'">单位裁量：</label>
                <label class="el-form-item__label" v-if="discValue.objectType=='1'">个人裁量：</label>
                <div class="flex" style="width: 100%;">
                  <sn-select
                    v-model="discValue.type"
                    class="el-form-item__content range_select"
                    :data-url="'/aj/sys/sysdict/list'"
                    :requertData="{type: 'discretion_penalty'}"
                    :immediate="true"
                    ref="resultCode"
                    placeholder="选择自由裁量处罚分类"
                  ></sn-select>
                  <el-select class="param_type" v-model="discValue.paramType">
                    <el-option value="0" label="正常"></el-option>
                    <el-option value="1" label="违法所得倍数"></el-option>
                    <el-option value="2" label="年收入倍数"></el-option>
                  </el-select>
                </div>
              </el-row>
              <el-row>
                <label class="el-form-item__label"></label>
                <div class="flex" style="width: 100%;">
                  <div class="amount_range">
                    <el-input
                      :class="discValue.paramType=='0'?'money':''"
                      v-model="discValue.rangeMin"
                    ></el-input>
                    <span class="range_dot_line">-</span>
                    <el-input
                      :class="discValue.paramType=='0'?'money':''"
                      v-model="discValue.rangeMax"
                    ></el-input>&nbsp;&nbsp;&nbsp;
                    <el-input
                      v-if="discValue.paramType!='0'"
                      v-model="discValue.uplimit"
                      placeholder="最高上限"
                    ></el-input>
                  </div>

                  <sn-select
                    v-model="discValue.resultCode"
                    class="el-form-item__content range_select"
                    :data-url="'/aj/sys/sysdict/list'"
                    :requertData="{type: 'discretion_result'}"
                    :immediate="true"
                    ref="resultCode"
                    placeholder="选择处置结果"
                  ></sn-select>
                </div>
                <div class="operation_buttons_level">
                  <span
                    v-if="dvIndex===detail.discretionValueList.length-1"
                    @click="addLevelValue(index,dvIndex,'0')"
                  >新增(单位)</span>
                  <span
                    v-if="dvIndex===detail.discretionValueList.length-1"
                    @click="addLevelValue(index,dvIndex,'1')"
                  >新增(个人)</span>
                  <span @click="deleteLevelValue(index,dvIndex)" class="delete">删除</span>
                </div>
              </el-row>
            </div>
          </div>

          <div class="operation_buttons">
            <span
              @click="addPenalty(detail.discretionLevelEntity.levelType)"
              v-if="index===discretionLevelList.length-1"
            >新增处罚档次</span>
            <span @click="deleteLevel(index)" class="delete">删除处罚档次</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import snSelect from "@/components/snSelect";
import {
  deleteLevel,
  deleteValue
} from "@api/systemManagement/discretionManagement";

export default {
  props: {
    discretionLevelList: {
      type: [Object, Array]
    },
    hasLevel: {
      type: String
    }
  },
  components: {
    snSelect
  },
  methods: {
    //新增具体的细则
    addLevelValue(index, dvIndex, objectType) {
      this.discretionLevelList[index].discretionValueList.push({
        objectType: objectType, //处罚对象类型 1：个人 0：单位
        rangeMax: null, //裁量上限
        rangeMin: null, //裁量下限
        resultCode: "", //处罚结果
        paramType: "0", //0 正常 1 违法所得 2 年收入
        type: "zycl001" //裁量类型 0:正常 1:逾期/拒不改正 2：一般事故裁量 : 3:较大事故裁量 4:重大事故裁量 5:特殊事故裁量
      });
    },
    deleteLevelValue(index, dvIndex) {
      if (this.discretionLevelList[index].discretionValueList.length == 1) {
        this.$message.error("请保证至少有一条处罚档次裁量信息");
      } else {
        if (
          this.discretionLevelList[index].discretionValueList[dvIndex]
            .discretionValueId
        ) {
          console.log(
            "要删除的id",
            this.discretionLevelList[index].discretionValueList[dvIndex]
              .discretionValueId
          );
          this.$confirm(
            "此操作将永久删除该自由裁量档次裁量信息, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              closeOnClickModal: false,
              type: "warning"
            }
          ).then(() => {
            deleteValue({
              valueId: this.discretionLevelList[index].discretionValueList[
                dvIndex
              ].discretionValueId
            })
              .then(res => {
                if (res.code === "0") {
                  this.$message.success("删除成功");
                  this.discretionLevelList[index].discretionValueList.splice(
                    dvIndex,
                    1
                  );
                } else {
                  this.$message.error("删除失败");
                }
              }) // eslint-disable-next-line handle-callback-err
              .catch(error => {
                this.$message.error("网络错误");
              });
          });
        } else {
          this.discretionLevelList[index].discretionValueList.splice(
            dvIndex,
            1
          );
        }
      }
    },
    // 新增处罚上下限
    addPenalty(val) {
      //判断处罚类型 val 0-正常  1-涉及事故等级划分
      this.discretionLevelList.push({
        discretionLevelEntity: {
          levelContent: "", //处罚档次内容
          discretionRangeContent: "" //裁量幅度内容
          // levelType: "0", //档次类型：0- 正常 1-事故登记划分
          //paramType: "0",//0 正常 1 违法所得 2 年收入
        },
        discretionValueList: [
          {
            objectType: "0", //处罚对象类型 1：个人 0：单位
            rangeMax: null, //裁量上限
            rangeMin: null, //裁量下限
            resultCode: "", //处罚结果
            paramType: "0", //0 正常 1 违法所得 2 年收入
            type: "zycl001" //裁量类型 0:正常 1:逾期/拒不改正 2：一般事故裁量 : 3:较大事故裁量 4:重大事故裁量 5:特殊事故裁量
          },
          {
            objectType: "1", //处罚对象类型 1：个人 0：单位
            rangeMax: null, //裁量上限
            rangeMin: null, //裁量下限
            resultCode: "", //处罚结果
            paramType: "0", //0 正常 1 违法所得 2 年收入
            type: "zycl001" //裁量类型 0:正常 1:逾期/拒不改正 2：一般事故裁量 : 3:较大事故裁量 4:重大事故裁量 5:特殊事故裁量
          }
        ]
      });
    },
    // 删除处罚上下限
    deleteLevel(ind) {
      if (this.discretionLevelList.length == 1) {
        this.$message.error("请保证至少有一条处罚档次");
      } else {
        if (
          this.discretionLevelList[ind].discretionLevelEntity.discretionLevelId
        ) {
          console.log(
            "要删除的id",
            this.discretionLevelList[ind].discretionLevelEntity
              .discretionLevelId
          );
          this.$confirm("此操作将永久删除该自由裁量档次, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning"
          }).then(() => {
            deleteLevel({
              levelId: this.discretionLevelList[ind].discretionLevelEntity
                .discretionLevelId
            })
              .then(res => {
                if (res.code === "0") {
                  this.discretionLevelList.splice(ind, 1);
                  this.$message.success("删除成功");
                } else {
                  this.$message.error("删除失败");
                }
              }) // eslint-disable-next-line handle-callback-err
              .catch(error => {
                this.$message.error("网络错误");
              });
          });
        } else {
          this.discretionLevelList.splice(ind, 1);
        }
      }
    },
    changeHasLevel(val) {
      console.log("是否有上下限", val);
      //修改是否有上下限 对父组件进行传值  注册监听事件
      this.$emit("changeHasLevel", val);
      if (val === "0") {
        //没有上下限
        this.discretionLevelList = this.discretionLevelList.slice(0, 1);
        this.discretionLevelList[0].discretionValueList = [
          //自由裁量上下线
          {
            objectType: "1", //处罚对象类型 0：个人 1：单位
            fixSum: null //固定金额
          },
          {
            objectType: "0", //处罚对象类型 0：个人 1：单位
            fixSum: null //固定金额
          }
        ];
      } else {
        this.discretionLevelList = this.discretionLevelList.slice(0, 1);
        this.discretionLevelList[0].discretionLevelEntity = {
          levelContent: "", //处罚档次内容
          discretionRangeContent: "", //裁量幅度内容
          levelType: "", //档次类型：0- 正常 1-事故登记划分
          paramType: "0" //0 正常 1 违法所得 2 年收入
        };
        this.discretionLevelList[0].discretionLevelEntity.levelType = "0";
        //有上下限的时候
        this.discretionLevelList[0].discretionValueList = [
          //自由裁量上下线
          {
            objectType: "0", //处罚对象类型 1：个人 0：单位
            rangeMax: null, //裁量上限
            rangeMin: null, //裁量下限
            resultCode: "", //处罚结果
            paramType: "0", //0 正常 1 违法所得 2 年收入
            type: "zycl001" //裁量类型 0:正常 1:逾期/拒不改正 2：一般事故裁量 : 3:较大事故裁量 4:重大事故裁量 5:特殊事故裁量
          },
          {
            objectType: "1", //处罚对象类型 1：个人 0：单位
            rangeMax: null, //裁量上限
            rangeMin: null, //裁量下限
            resultCode: "", //处罚结果
            paramType: "0", //0 正常 1 违法所得 2 年收入
            type: "zycl001" //裁量类型 0:正常 1:逾期/拒不改正 2：一般事故裁量 : 3:较大事故裁量 4:重大事故裁量 5:特殊事故裁量
          }
        ];
      }
    }
  }
};
</script>

<style lang="less">
.penalty_part {
  line-height: 40px;
  .detail {
    position: relative;
    padding: 9px 16px 50px 17px;
    margin-bottom: 8px;
    background: #eef5f9;
    &:last-child {
      margin-bottom: 0;
    }
    &.fixed {
      padding-bottom: 10px;
    }
    .el-form-item__label {
      flex-shrink: 0;
      width: 90px;
      text-align: left;
    }
    &.ranged {
      .el-form-item__label {
        width: 140px;
      }
      .el-radio-group {
        display: flex;
        width: 100%;
        height: 80px;
        flex-direction: column;
        justify-content: space-around;
        .penalty_type {
          display: flex;
          .el-radio {
            align-self: center;
          }
          .el-select {
            flex-grow: 1;
          }
        }
      }
      .rate_range + .rate_range {
        margin-top: 8px;
      }
    }
    .el-row {
      display: flex;
      .el-input {
        flex-grow: 1;
      }
      .amount_range {
        display: flex;
        margin-right: 12px;
        .el-input {
          width: 160px;
          flex-shrink: 0;
        }
        .range_dot_line {
          padding: 0 3px;
          font-size: 14px;
        }
      }
      .range_select {
        width: 160px;
        margin-right: 14px;
      }
      .range_label {
        line-height: 20px;
      }
    }
    .el-col {
      display: flex;
    }
    .money {
      width: 160px;
      position: relative;
      flex-shrink: 0;
      &::before {
        content: "\FFE5";
        display: inline;
        position: absolute;
        left: 7px;
        color: #ff4901;
        font-size: 12px;
      }
      & input {
        padding-left: 20px;
      }
    }
    .operation_buttons_level {
      position: absolute;
      bottom: 35px;
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
      &.add {
        left: 17px;
        .el-button {
          border-radius: 5px;
          span {
            font-size: 14px;
            color: white;
          }
          &:hover {
            background-color: #c6e2ff;
            border-color: #c6e2ff;
            color: #409eff !important;
          }
        }
      }
    }
    .operation_buttons {
      position: absolute;
      bottom: -40px;
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
      &.add {
        left: 17px;
        .el-button {
          border-radius: 5px;
          span {
            font-size: 14px;
            color: white;
          }
          &:hover {
            background-color: #c6e2ff;
            border-color: #c6e2ff;
            color: #409eff !important;
          }
        }
      }
    }
  }
}

/deep/ .el-form-item {
  margin-bottom: 0;
  /deep/ .el-form-item__content {
    margin-left: 100px;
  }
  /deep/ .el-select {
    width: 100%;
  }
}

.param_type {
  width: 160px;
  margin-right: 15px;
}
</style>
