<!-- chat image -->
<template>
  <div v-if="item === null"></div>
  <div v-else-if="item.receiver" class="chat-receive-image-warapper">
    <p v-if="item.showtime" class="chat-time">{{_transformTime(item.ctime)}}</p>
    <img class="chat-receive-header" :src="_transformImgSrc(item.from_head_img)">
    <div class="chat-receive-image">
      <a href="#" @click="_showReceiveImage(item)"><img class="send-image" :src="_bindSrc(item)"></a>
    </div>
  </div>
  <div v-else class="chat-send-image-warapper">
    <p v-if="item.showtime" class="chat-time">{{_transformTime(item.ctime)}}</p>
    <div class="send-image-content">
      <a v-if="item.status === 0"></a>
      <img v-else-if="item.status === 1" src="../../../assets/images/loading.gif" class="send-loading">
      <a v-else href="#" @click="_resendmessage(item)"><img class="send-loading" src="../../../assets/images/error.png"></a>
      <a href="#" @click="_showSendImage(item)"><img class="send-image" :src="_bindSrc(item)"></a>
      <img class="chat-send-header" :src="_transformImgSrc(item.from_head_img)">
    </div>
  </div>
</template>

<script>
import { baseUrl } from '../../../common/fetch.js'
import { currentTime } from './../../../common/category.js'

export default {
  data () {
    return {
      'item': null,
      'baseUrl': '',
      'resendfn': null
    }
  },
  mounted () {
    this.resendfn = this.$attrs.resendimage
    this.baseUrl = baseUrl
    this.item = this.$attrs.item
  },
  methods: {
    _showReceiveImage (item) {
      window.open(baseUrl + item.url)
    },
    _showSendImage (item) {
      if (item.url !== undefined) {
        window.open(baseUrl + item.url)
      }
    },
    _transformImgSrc (src) {
      let reg = /^http/g
      return reg.test(src) ? src : baseUrl + src
    },
    _transformTime (ctime) {
      return currentTime(false, ctime)
    },
    _bindSrc: (item) => {
      if (item.src === undefined) {
        return baseUrl + item.url
      } else {
        return item.src
      }
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
<style lang='stylus' scoped>
@import '../../../css/chat.styl'
@import '../../../css/mixin.styl'
// 图片发送消息样式
.chat-send-image-warapper
  width 100%
  .send-image-content
    display flex
    flex-direction row
    justify-content flex-end
    align-items center
    padding 20px 0
    .chat-send-header
      align-self flex-start
      margin-top 0
    .send-image
      margin-right 10px
      display inline-block
      max-width 200px
      min-width 40px
      max-height 380px
      border-radius 6px
    .send-loading
      height 20px
      width 20px
      margin-right 10px
// 图片接收消息样式
.chat-receive-image-warapper
  width 100%
  padding-bottom 20px
  clearfix()
  .chat-receive-image
    width 100%
    font-size 0
    a
      display block
      width 100%
      img
        margin-top 20px
        margin-left 10px
        display inline-block
        min-width 40px
        max-width 200px
        max-height 380px
        border-radius 6px
</style>
