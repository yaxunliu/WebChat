<!-- chat text -->
<template>
  <div v-if="item === null"></div>
  <div v-else-if="item.receiver" class="chat-receive-text-warapper">
    <p v-if="item.showtime" class="chat-time">{{_transformTime(item.ctime)}}</p>
    <img class="chat-receive-header" :src="_transformImgSrc(item.from_head_img)">
    <div class="chat-receive-text" v-html="item.innerHTML"></div>
  </div>
  <div v-else class="chat-send-text-warapper">
    <p  v-if="item.showtime" class="chat-time">{{_transformTime(item.ctime)}}</p>
    <div class="chat-text-content">
      <a v-if="item.status === 0"></a>
      <img v-else-if="item.status === 1" src="../../../assets/images/loading.gif" class="send-loading">
      <a v-else href="#" @click="_resendmessage(item)"><img class="send-loading" src="../../../assets/images/error.png"></a>
      <div class="chat-send-text" v-html="item.innerHTML"></div>
      <img class="chat-header" :src="_transformImgSrc(item.from_head_img)">
    </div>
  </div>
</template>

<script>
import { formatMsgTime } from './../../../common/timeformat.js'
import { baseUrl } from '../../../common/fetch.js'

export default {
  data () {
    return {
      'item': null,
      'baseUrl': '',
      'resendfn': null
    }
  },
  mounted () {
    this.resendfn = this.$attrs.resendtext
    this.item = this.$attrs.item
  },
  methods: {
    _transformImgSrc (src) {
      let reg = /^http/g
      return reg.test(src) ? src : baseUrl + src
    },
    _transformTime (ctime) {
      return formatMsgTime(ctime)
    },
    _resendmessage: function (item) {
      if (this.resendfn !== undefined && typeof this.resendfn === 'function') {
        item.status = 1
        this.resendfn(item.msg_id)
      }
    }
  }
}

</script>
<style lang="stylus" scoped>
@import '../../../css/chat.styl'
@import '../../../css/mixin.styl'
// 收到文本消息样式
.chat-receive-text-warapper
  display inline-block
  width 100%
  font-size 14px
  padding-bottom 20px
  clearfix()
  .chat-receive-text
    box-shadow 0 0 10px 2px #e4e4e4
    color black
    float left
    margin-top 20px
    margin-left 10px
    max-width 406px
    min-width 20px
    word-wrap break-word
    overflow auto
    line-height 26px
    text-align left
    padding 7px 10px
    background-color #fff
    border-radius 4px
    position relative
    leftarrowbubble(-12px,14px,6px,#fff)
// 发送文本消息样式
.chat-send-text-warapper
  width 100%
  font-size 14px
  text-align center
  .chat-text-content
    display flex
    flex-direction row
    justify-content flex-end
    align-items center
    padding 20px 0
    .send-loading
      width 20px
      height 20px
      margin-right 10px
    .chat-send-text
      border-radius 4px
      margin-right 10px
      max-width 406px
      white-space normal
      word-wrap break-word
      color white
      line-height 26px
      min-width 20px
      padding 7px 10px
      position relative
      text-align left
      background-color #3091f2
      rightarrowbubble(-12px,14px,6px,#3091f2)
    .chat-header
      align-self flex-start
      width 40px
      height 40px
      border-radius 4px
      margin-right 20px
</style>
