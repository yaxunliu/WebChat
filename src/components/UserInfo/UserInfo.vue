<!-- 用户信息组件 -->
<template>
  <div class="userinfo-warapper">
    <UserHistory :usernick="this.loginnick"></UserHistory>
  </div>
</template>

<script>
import UserHistory from './userHistory/userHistory'
export default {
  components: {
    UserHistory
  },
  data () {
    return {
      'isuser': true,
      'loginnick': 'Swifter'
    }
  }
}
</script>

<style lang="stylus" scoped>
.userinfo-warapper
  background-color red
</style>
