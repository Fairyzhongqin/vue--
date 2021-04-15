<template>
  <div class="picture" v-show="isPrivate && isPublic && isPunish">
    <div class="picture-item">
      <down-seal :proof="privateSealList[0]" class="down-proof" v-if="privateSealList.length > 0" :sealIndex="0" @delSeal="delSeal"></down-seal>
      <upload-seal :fileDetail="fileData" fileType="0" :isOnlyOne="true" v-if="privateSealList.length == 0"></upload-seal>
    </div>
    <div class="picture-item">
      <down-seal :proof="item" class="down-proof" v-for="(item, index) in publicSealList" :key="index" :sealIndex="index" @delSeal="delSeal"></down-seal>
      <upload-seal :fileDetail="fileData" fileType="1" :isOnlyOne="false"></upload-seal>
    </div>
    <div class="picture-item">
      <down-seal :proof="item" class="down-proof" v-for="(item, index) in punishSealList" :key="index" :sealIndex="index" @delSeal="delSeal"></down-seal>
      <upload-seal :fileDetail="fileData" fileType="2" :isOnlyOne="false"></upload-seal>
    </div>
  </div>
</template>

<script>
import uploadSeal from "@/components/uploadSeal/index";
import downSeal from "@/components/downSeal/index";
import { showSignature } from "@api/common";

export default {
  components: {
    uploadSeal,
    downSeal
  },
  props: {
    fileData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      proof: {
        accessoryDownUrl: "", // 附件下载url
        accessoryId: "", // 附件id
        accessoryName: "", // 附件名字
        accessoryType: "", // 附件类型
        accessoryUrl: "", // 附件在线显示url
        id: "", // 证据关联的id
        type: "" // 证据的类型 ： 公共的证据、检查项的证据
      },
      privateSealList: [],
      isPrivate: false,
      publicSealList: [],
      isPublic: false,
      punishSealList: [],
      isPunish: false,
    }
  },
  methods: {
     delSeal(type, val) {
       if(type === '0') {
         this.privateSealList.splice(val, 1)
       }
       if(type === '1') {
         this.publicSealList.splice(val, 1)
       }
       if(type === '2') {
         this.punishSealList.splice(val, 1)
       }
     },
  },
  created() {
    showSignature({type: '0', userId: this.fileData.userId}).then(res => {
      // console.log(res)
      this.privateSealList = res.data;
      this.isPrivate = true;
    })
    showSignature({type: '1', userId: this.fileData.userId}).then(res => {
      // console.log(res)
      this.publicSealList = res.data;
      this.isPublic = true;
    })
    showSignature({type: '2', userId: this.fileData.userId}).then(res => {
      // console.log(res)
      this.punishSealList = res.data;
      this.isPunish = true;
    })
  }
};
</script>

<style lang="less" scoped>
.picture {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // width: 800px;
  // height: 400px;
  // height: 100%;
  // overflow-y: auto;
  .picture-item {
    display: flex;
    flex-direction: row;
    // flex-wrap: wrap;
    // height: 230px;
    .down-proof {
      margin-right: 10px;
    }
  }
}
</style>