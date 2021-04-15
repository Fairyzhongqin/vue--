<template>
    <div class="innerReview">
      <component :is="innerReviewComponent"></component>
    </div>
</template>
<script>
import { mapState } from "vuex";
import searchBar from "@components/searchBar";
import InnerReviewList from './innerReviewList/index';
import NewInnerReview from './newInnerReview/index'
export default {
    name:"innerReview",
    components:{
        InnerReviewList,
        NewInnerReview
    },
    created() {
        this.$store.dispatch("switchCompStatus", "/rectificationReviewDelay");
    },
    computed:{
        ...mapState(["innerReviewComponent"])
    }
}
</script>
<style lang="less" scoped>
</style>