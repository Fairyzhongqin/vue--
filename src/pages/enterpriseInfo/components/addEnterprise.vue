<template>
  <div class="content">
    <div @click="backPage" class="back-button">
      <i class="el-icon-arrow-left"></i> 返回
    </div>

    <!-- <div class="font18">{{ type == 'add' ? '新增企业' : '修改企业' }}</div> -->
    <div class="flex mt15">
      <company-form
        v-bind="$attrs"
        :enterpriseId="propData.enterpriseId"
        :type="propData.type"
        v-on="$listeners"
        @backPage="backPage"
      ></company-form>
    </div>
  </div>
</template>
<script>
import companyForm from "./companyForm";
export default {
  props: ["enterpriseId", "type"],
  data() {
    return {
      propData: {
        enterpriseId: "",
        type: ""
      }
    };
  },
  components: {
    companyForm
  },
  created() {
    console.info(this.type, this.enterpriseId);
    this.propData = {
      enterpriseId: this.enterpriseId,
      type: this.type
    };
    // console.info("status",this.$store.state.keepInEnterprise)
  },
  methods: {
    // 返回
    backPage() {
      this.$store.commit("setNewRectificationShow");
      this.$store.commit("SET_KEEP_IN_ENTERPRISE", true);
    }
  }
};
</script>
<style lang="less" scoped>
// .czq {
//   width: 700px;
//   table {
//     border-right: 1px solid #000;
//     border-collapse: collapse;
//     width: 100%;
//   }
// }
.content {
  background: #fff;
  padding: 8px;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 16px 82px 33px;
  border-radius: 8px;
  position: relative;
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
  .mt15 {
    margin-top: 30px;
  }
}

// .font18 {
//   font-size: 18px;
//   color: #333333;
// }

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>