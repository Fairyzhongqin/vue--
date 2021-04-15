<template>
  <div>
    <div class="proof-show">
      <img :src="encodeURI(proof.sealPath)" class="img-style" />
      <div class="proof-oper">
        <i class="el-icon-view public del-left" @click="showDetail"></i>
        <i class="el-icon-delete public del-right" @click="delProof"></i>
      </div>
    </div>
    <div class="proof-name">
      {{ proof.sealName }}
    </div>
    <el-dialog width="800px" height="800px" :before-close="closeDialog" :visible.sync="showDialog">
      <img :src="encodeURI(proof.sealPath)" width="100%" height="100%" alt v-if="showDialog" />
    </el-dialog>
  </div>
</template>

<script>
import { deleteSeal } from "@/api/common";

export default {
  data() {
    return {
      showDialog: false, // 查看图片详情的开关,
      token: null
    };
  },
  props: {
    proof: {
      type: Object,
      required: true,
      default: {
        certName: "seal.pfx", // 证书名字
        certPath: "", // 证书地址
        sealName: "seal.svg", // 签章名字
        sealPath: "", // 签章地址
        sealType: "0", // 签章种类
        signId: "SG233168255072604160", // 签章id；
        userId: "USER233157830360698880" // 关联的用户id
      }
    },
    sealIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    // 关闭查看详情弹窗
    closeDialog() {
      this.showDialog = false;
    },
    // 展示详情弹窗
    showDetail() {
      this.showDialog = true;
    },
    // 删除证据
    delProof() {
      let { signId, sealType} = this.proof;
      deleteSeal({
        signId
      }).then(res => {
        this.$message('删除成功')
        this.$emit("delSeal", sealType, this.sealIndex)
      });
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.proof.sealPath += "&token=" + this.token;
  }
};
</script>

<style lang="less" scoped>
.file-name {
  display: block;
  position: absolute;
  bottom: 0;
  color: #ffffff;
  background: #000000;
  opacity: 0.5;
  width: 100%;
  text-align: center;
}
.proof-name {
  width: 150px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #999999;
  margin-top: 5px;
  background: rgba(240,240,240,1);
  border-radius: 5px;
}
.proof-show {
  position: relative;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  overflow: hidden;
  width: 150px;
  height: 150px;
  background: #EEF5F9;
  .img-style {
    width: 136px;
    height: 42px;
    position: absolute;
    top: 40%;
    left: 0;
  }
  .proof-oper {
    visibility: hidden;
    width: 150px;
    height: 150px;
  }
  &:hover {
    .proof-oper {
      visibility: visible;
      position: relative;

      background-color: rgba(0, 0, 0, 0.5);
      font-size: 30px;
      color: #ffffff;
      .public {
        position: absolute;
        top: 40%;
        &:hover {
          cursor: pointer;
        }
      }
      .no-del-left {
        left: 30%;
      }
      .no-del-right {
        right: 30%;
      }
      .del-left {
        left: 20%;
      }
      .del-middle {
        left: 42%;
      }
      .del-right {
        right: 20%;
      }
    }
  }
}
</style>