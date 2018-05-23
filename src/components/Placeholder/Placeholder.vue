<!-- 占位图 -->
<template>
  <div>
    <img id="placeimage" src="../../assets/images/placeholder.png">
    <p>暂无聊天信息</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang='stylus' scoped>
div
  display flex
  flex-direction column
  justify-content center
  align-items center
  color #b6b6b6
  #placeimage
    margin-bottom 40px
</style>
