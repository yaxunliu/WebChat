<!-- voice -->
<template>
  <li v-if="item === null"></li>
  <li v-else-if="item.receiver" class="chat-receive-voice-warapper">
    <p v-if="item.showtime" class="chat-time">{{_transformTime(item.ctime)}}</p>
    <img class="chat-receive-header" :src="_transformImgSrc(item.from_head_img)">
    <div class="chat-receive-voice" :style="_initinalVoiceStyle(item)">
      <a href="#" @click="_playVoice(item)"><img :src="item.play ? require('../../../assets/images/receiveVoicePlay.gif') : require('../../../assets/images/receive_voice.png')"></a>
    </div>
    <span>{{item.voicelen}}"</span>
  </li>
  <li v-else class="chat-send-voice-warapper">
    <p v-if="item.showtime" class="chat-time">{{_transformTime(item.ctime)}}</p>
    <img class="chat-send-header" :src="_transformImgSrc(item.from_head_img)">
    <div class="chat-send-voice" :style="_initinalVoiceStyle(item)">
      <a href="#" @click="_playVoice(item)"><img :src="item.play ? require('../../../assets/images/sendVociePlay.gif') : require('../../../assets/images/send_voice.png')"></a>
    </div>
    <span>{{item.voicelen}}"</span>
  </li>
</template>

<script>
import { baseUrl } from '../../../common/fetch.js'
import { currentTime } from './../../../common/category.js'

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
      let sec = item.voicelen
      let width = (sec / 2 * 10) + 60
      if (width > 400) {
        width = 400
      }
      return {width: width + 'px'}
    },
    _transformImgSrc (src) {
      let reg = /^http/g
      return reg.test(src) ? src : baseUrl + src
    },
    _transformTime (ctime) {
      return currentTime(false, ctime)
    },
    _playVoice (item) {
      item.play = !item.play
      typeof this.$attrs.playVoice === 'function' && this.$attrs.playVoice(item)
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
