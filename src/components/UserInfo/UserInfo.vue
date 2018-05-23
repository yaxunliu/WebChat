<!-- 用户信息组件 -->
<template>
  <div class="userinfo-warapper">
    <UserHistory :chatObj="chatObj" :loginInfo="loginInfo"></UserHistory>
  </div>
</template>

<script>
import UserHistory from './userHistory/userHistory'
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
    UserHistory
  }
}
</script>

<style lang="stylus" scoped>
.userinfo-warapper
  background-color red
</style>
