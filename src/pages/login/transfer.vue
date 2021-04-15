<template>
  <div></div>
</template>

<script>
import { transferLogin,getWritTypeInfo } from '@/api/login/login'
import { mapState } from 'vuex'
export default {
  created() {
    this.loginByUrl()
  },
  methods: {
    loginByUrl(){
      transferLogin({
        userId: this.$route.query.userId
      }).then(res => {
        // if (this.websocketObj == null) {
        //   this.$store.commit('CREAT_WEBSOCKET')
        // }




        this.afterLogin()



        // this.$router.push('/commonHandle')
      })
    },
    afterLogin() {
      if (this.websocketObj == null) {
        this.$store.commit('CREAT_WEBSOCKET')
      }
      getWritTypeInfo().then(
        res => {
          sessionStorage.setItem('writTypeInfo', JSON.stringify(res.data))
          sessionStorage.setItem('originVuexInfo', JSON.stringify(this.$store.state))

          
          if (this.$route.query.target === 'cb') {
            sessionStorage.setItem('role_permision', `common,行政处罚`)
            console.info(this.$route.query.penaltyId)
            this.$router.push({
              path: '/commonHandle',
              query: {
                penaltyId: this.$route.query.penaltyId
              }
            })

          }
          if (this.$route.query.target === 'cr') {
            this.$store.commit('SET_TOKEN', res.data.token)
            localStorage.setItem('token', res.data.token)
            sessionStorage.setItem('token', res.data.token)
            this.$router.push('/login')
          }


        },
        err => {
          sessionStorage.setItem('originVuexInfo', JSON.stringify(this.$store.state))
        }
      )
    }
  },
  watch: {
    websocketObj: {
      handler: function(val, oldVal) {
        if (val && oldVal == null) {
          val.createWs()
        }
        if (val) {
          this.message = val.msg
          this.$store.commit('SET_WEBSOCKET_MSG', this.message)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['websocketObj', 'websocketMsgNumber', 'websocketMsg'])
  }
}
</script>

<style lang="less" scoped>

</style>