<!-- 聊天内容组件 -->
<template>
  <div class="chat-warraper">
    <div class="chat-header">
      天天老师
    </div>
    <div class="chat-content">
      <ul>
        <li class="chat-receive-text-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-receive-header" src="../../assets/images/user-icon.png">
          <div class="chat-receive-text">因为链接地就需要在cmyb链接地就需要在cmybtn14_3 a链接地就需cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 atn14_3 a的配置</div>
        </li>
        <li class="chat-send-text-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-send-header" src="../../assets/images/user-icon.png">
          <div class="chat-send-text">因为链接地就需要在cmyb链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 a链接地就需要在cmybtn14_3 atn14_3 a的链接</div>
        </li>
        <li class="chat-receive-text-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-receive-header" src="../../assets/images/user-icon.png">
          <div class="chat-receive-text">因为链接地就需要在cmybtn14_3 a的配置</div>
        </li>
        <li class="chat-send-text-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-send-header" src="../../assets/images/user-icon.png">
          <div class="chat-send-text">因为链接</div>
        </li>
        <li class="chat-receive-text-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-receive-header" src="../../assets/images/user-icon.png">
          <div class="chat-receive-text">因为链接地就需要在cmybtn14_3 a的配置</div>
        </li>
        <li class="chat-send-text-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-send-header" src="../../assets/images/user-icon.png">
          <div class="chat-send-text">因为链接</div>
        </li>
        <li class="chat-send-image-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-send-header" src="../../assets/images/user-icon.png">
          <div class="chat-send-image">
            <a href="#"><img class="send-image" src="../../assets/images/search.png"></a>
          </div>
        </li>
        <li class="chat-receive-image-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-receive-header" src="../../assets/images/user-icon.png">
          <div class="chat-receive-image">
            <a href="#"><img class="send-image" src="../../assets/images/beauty.jpg"></a>
          </div>
        </li>
        <li class="chat-send-voice-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-send-header" src="../../assets/images/user-icon.png">
          <div class="chat-send-voice">
            <a href="#"><img src="../../assets/images/send_voice.png"></a>
          </div>
          <span>5s</span>
        </li>
        <li class="chat-receive-voice-warapper">
          <p class="chat-time">09:56:23</p>
          <img class="chat-receive-header" src="../../assets/images/user-icon.png">
          <div class="chat-receive-voice">
            <a href="#"><img src="../../assets/images/receive_voice.png"></a>
          </div>
          <span>5s</span>
        </li>
      </ul>
    </div>
    <div class="chat-input">
      <div class="chat-emoji-icon">
        <a href="#"><img src="../../assets/images/emoji.png"></a>
        <a href="#"><img src="../../assets/images/picture.png"></a>
      </div>
      <div class="chat-input-text">
        <textarea></textarea>
      </div>
      <div class="chat-send-button">
        <a href="#">发送</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    test: () => {
      alert('test')
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../css/mixin.styl'
// 通用样式
.chat-send-header
          float right
          margin-right 20px
          margin-top 20px
          width 40px
          height 40px
          border-radius 4px
.chat-receive-header
          float left
          display inline-block
          width 40px
          height 40px
          margin-left 20px
          margin-top 20px
          border-radius 4px
.chat-time
          text-align center
          width 100%
// 聊天内容
.chat-warraper
  .chat-header
    text-align center
    height 76px
    line-height 76px
    font-size 20px
    color #333
  .chat-content
    height 474px
    width 100%
    background-color #f5f5f5
    ul
      color #c0c0c0
      height 100%
      overflow auto
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
          max-width 506px
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
        padding-bottom 20px
        text-align center
        clearfix()
        .chat-send-text
          box-shadow 0 0 10px 2px #e4e4e4
          float right
          position relative
          color white
          margin-right 10px
          margin-top 20px
          max-width 506px
          line-height 26px
          text-align right
          padding 7px 10px
          background-color #3091f2
          border-radius 4px
          rightarrowbubble(-12px,14px,6px,#3091f2)
      // 图片发送消息样式
      .chat-send-image-warapper
        width 100%
        padding-bottom 20px
        clearfix()
        a
          display inline-block
          float right
          margin-top 20px
          margin-right 10px
          .send-image
            display block
            max-width 200px
            min-width 40px
            max-height 380px
            border-radius 6px
      // 图片接收消息样式
      .chat-receive-image-warapper
        width 100%
        padding-bottom 20px
        clearfix()
        .chat-receive-image
          width 100%
          font-size 0
          img
            margin-top 20px
            margin-left 10px
            display inline-block
            width 100%
            max-width 200px
            max-height 380px
            border-radius 6px
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
          color #aaa
          margin-top 20px
          line-height 40px
          margin-right 16px
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
          width 100px
          border-radius 4px
          background-color white
          a
            display inline-block
            width 100%
            leftarrowbubble(-12px,14px,6px,#fff)
            height 40px
            img
              width 30px
              height 30px
              float left
              margin-top 5px
              margin-left 4px
        span
          float left
          color #aaa
          margin-top 20px
          line-height 40px
          margin-left 10px
  .chat-input
    height 180px
    background-color #eaeaea
    .chat-emoji-icon
      height 54px
      a
        margin-left 20px
        margin-top 15px
        display inline-block
        img
          display block
          width 24px
          height 24px
    .chat-input-text
      height 76px
      textarea
        box-sizing border-box
        width 100%
        height 100%
        border none
        outline none
        -webkit-tap-highlight-color rgba(0,0,0,0)
        background-color rgba(0,0,0,0)
        padding 0 20px
        text-decoration none
        font-size 18px
        line-height 24px
    .chat-send-button
      a
        float right
        margin-right 18px
        width 82px
        height 30px
        background-color #3091f2
        color white
        text-decoration none
        text-align center
        line-height 30px
        font-size 15px
        border-radius 4px
        margin-left 20px
</style>
