<!-- 用户信息组件 -->
<template>
  <div class="userinfo-warapper">
    <UserHistory v-if="loginInfo.usertype === 0" :chatObj="chatObj" :loginInfo="loginInfo"></UserHistory>
    <customerService v-else-if="loginInfo.usertype === 1 && loginInfo.uid === '12'" :chatObj="chatObj" :loginInfo="loginInfo"></customerService>
    <expert v-else :chatObj="chatObj" :loginInfo="loginInfo"></expert>
  </div>
</template>

<script>
import UserHistory from './userHistory/userHistory'
import customerService from './customService/customServic'
import expert from './expert/expert'
export default {
  props: {
    chatObj: { // 当前聊天对象的用户信息
      type: [Object],
      default: function () {
        return null
      }
    },
    loginInfo: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  data () {
    return {
    }
  },
  components: {
    UserHistory,
    customerService,
    expert
  }
}
</script>

<style lang="stylus" scoped>
.userinfo-warapper
  background-color red
</style>
