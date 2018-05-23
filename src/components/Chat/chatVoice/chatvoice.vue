<!-- voice -->
<template>
  <li v-if="item === null"></li>
  <li v-else-if="item.receiver" class="chat-receive-voice-warapper">
    <p v-if="item.showtime" class="chat-time">{{item.ctime}}</p>
    <img class="chat-receive-header" :src="_transformImgSrc(item.from_head_img)">
    <div class="chat-receive-voice" :style="_initinalVoiceStyle(item)">
      <a href="#"><img src="../../../assets/images/receive_voice.png"></a>
    </div>
    <span>{{JSON.parse(item.ext_info).voice_len}}"</span>
  </li>
  <li v-else class="chat-send-voice-warapper">
    <p v-if="item.showtime" class="chat-time">{{item.ctime}}</p>
    <img class="chat-send-header" :src="_transformImgSrc(item.from_head_img)">
    <div class="chat-send-voice" :style="_initinalVoiceStyle(item)">
      <a href="#"><img src="../../../assets/images/send_voice.png"></a>
    </div>
    <span>{{JSON.parse(item.ext_info).voice_len}}"</span>
  </li>
</template>

<script>
import { baseUrl } from '../../../common/fetch.js'

export default {
  data () {
    return {
      'item': null,
      'baseUrl': ''
    }
  },
  mounted () {
    this.baseUrl = baseUrl
    this.item = this.$attrs.item
  },
  methods: {
    _initinalVoiceStyle: (item) => {
      let sec = parseInt(JSON.parse(item.ext_info).voice_len)
      return {width: (sec / 2 * 10) + 60 + 'px'}
    },
    _transformImgSrc (src) {
      console.log(src)
      let reg = /^http/g
      return reg.test(src) ? src : baseUrl + src
    }
  }
}

</script>
<style lang="stylus" scoped>
@import '../../../css/chat.styl'
@import '../../../css/mixin.styl'
// 接收语音的样式
.chat-receive-voice-warapper
  width 100%
  clearfix()
  padding-bottom 20px
  .chat-receive-voice
    position relative
    float left
    height 40px
    margin-top 20px
    margin-left 10px
    border-radius 4px
    background-color white
    a
      display inline-block
      width 100%
      leftarrowbubble(-12px,14px,6px,#fff)
      height 40px
      font-size 0px
      img
        display block
        width 30px
        height 30px
        float left
        margin-top 5px
        margin-left 4px
  span
    float left
    margin-top 20px
    line-height 40px
    margin-left 15px
// 发送语音的样式
.chat-send-voice-warapper
  width 100%
  clearfix()
  padding-bottom 20px
  .chat-send-voice
    float right
    margin-top 20px
    margin-right  10px
    height 40px
    background-color #3091f2
    border-radius 4px
    position relative
    width 100px
    rightarrowbubble(-12px,14px,6px,#3091f2)
    img
      display inline-block
      float right
      width 30px
      height 30px
      margin-top 5px
      margin-right 4px
  span
    float right
    line-height 40px
    margin-top 20px
    margin-right 15px
</style>
