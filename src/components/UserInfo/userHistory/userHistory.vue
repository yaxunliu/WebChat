<!-- 用户端历史记录组件 -->
<template>
  <div class="user-history-waraaper">
      <div class="user-history-header" >
        <p>聊天记录</p>
        <audio ref="audio"></audio>
      </div>
      <div class="user-history-content">
        <ul style="overflow:auto;height:100%"><li v-for="item in currentPageHistory" :key="item.msg_id" style="font-size: 14px; line-height: 20px;padding-bottom: 12px">
          <p v-if="item.from_nick === loginInfo.nick" class="history-header" style="color: #f29930; padding: 0 18px;">{{item.from_nick}}  {{item.ctime.replace(/-/g,'/')}}</p>
          <p v-else style="color: #3091f2; padding: 0 18px;">{{item.from_nick}}      {{item.ctime}}</p>
          <p v-if="item.msg_type === '1'" style="color: #333; padding: 8px 18px 0 18px;">{{item.content}}</p>
          <a v-else-if="item.msg_type === '3'" :style='initinalVoiceStyle(item)' @click="_palyHistoryVoice(item)" class="history-voice-wraaper" href="#"><span>{{JSON.parse(item.ext_info).voice_len}}"</span><img :src="item.play ? require('../../../assets/images/play.gif') : require('../../../assets/images/historyvoice.png')"></a>
          <a v-else class="history-img-wraaper" href="#">
            <img :src="baseUrl + item.url">
          </a>
          </li></ul>
      </div>
      <div class="user-history-pagecontrol">
        <a v-if="this.lastPageCantouch" href="#" @click="this._clikcLastPage">上一页</a>
        <a v-else style="color: #aaa">上一页</a>
        <a href="#" @click="this._clickNextPage" style="padding-left: 20px">下一页</a>
      </div>
    </div>
</template>

<script>
import { jsonp, baseUrl } from '../../../common/fetch'

export default {
  props: {
    chatObj: { // 当前聊天对象的用户信息
      type: [Object],
      default: function () {
        return null
      }
    },
    loginInfo: { // 当前登录用户信息
      type: [Object],
      default: function () {
        return {'nick': 'Swifter'}
      }
    }
  },
  watch: {
    chatObj: function () {
      // 2.重新加载聊天历史数据
      this._loadFirstPageHistory()
    }
  },
  data () {
    return {
      'currentPageHistory': [ ],
      'allHistory': {},
      'page': 1,
      'lastPageCantouch': false,
      'baseurl': '',
      'currentPlayitem': null
    }
  },
  mounted () {
    this.baseUrl = baseUrl
    this._loadFirstPageHistory()
  },
  methods: {
    _loadFirstPageHistory () {
      this.lastPageCantouch = false
      this.allHistory = [ ]
      this.currentPageHistory = null
      this.page = 1
      jsonp('/sixin/get_liaotian', {'from': 'im3', 'user_id': this.chatObj.id}).then((res) => {
        for (let key in res) {
          res[key].play = false
        }
        this.currentPageHistory = res
        this.allHistory[this.page] = res
      }).catch((err) => {
        console.log(err)
      })
    },
    _clickNextPage () {
      if (this.allHistory[this.page + 1] !== undefined) {
        this.page += 1
        this.lastPageCantouch = true
        this.currentPageHistory = this.allHistory[this.page]
        this._stopCurrentPlayVoice()
        return 0
      }
      jsonp('/sixin/get_liaotian', {'from': 'im3', 'user_id': this.chatObj.id, 'msg_id': this.currentPageHistory[0].msg_id}).then((res) => {
        console.log('res', res)
        if (!res) {
          alert('没有更多的聊天记录')
          return
        }
        this._stopCurrentPlayVoice()
        for (let key in res) {
          res[key].play = false
        }
        this.currentPageHistory = res
        this.page += 1
        this.allHistory[this.page] = res
        this.lastPageCantouch = true
      }).catch((err) => {
        console.log(err)
      })
    },
    _clikcLastPage () {
      if (this.page === 1) {
        this.lastPageCantouch = false
        return 0
      } else {
        this._stopCurrentPlayVoice()
        this.page -= 1
        if (this.page === 1) {
          this.lastPageCantouch = false
        }
        this.currentPageHistory = this.allHistory[this.page]
      }
    },
    _stopCurrentPlayVoice () {
      if (this.currentPlayitem !== null) {
        var audio = this.$refs.audio
        if (!audio.ended) {
          audio.pause()
        }
        this.currentPlayitem.play = false
        this.currentPlayitem = null
      }
    },
    _begainPlayCurrentVoice () {
      if (this.currentPlayitem === null) {
        return
      }
      let voiceurl = this.baseUrl + this.currentPlayitem.mp3_url
      var audio = this.$refs.audio
      audio.src = voiceurl
      audio.play().then(() => {
      }).catch(() => {
        alert('您的浏览器无法播放语音')
        this._stopCurrentPlayVoice()
      })
      audio.onended = () => {
        this._stopCurrentPlayVoice()
      }
    },
    _palyHistoryVoice (item) {
      item.play = !item.play
      if (item.play) { // 当前正在播放的
        this._stopCurrentPlayVoice()
        this.currentPlayitem = item
        this._begainPlayCurrentVoice()
      } else {
        this._stopCurrentPlayVoice()
      }
    },
    initinalVoiceStyle (item) {
      let sec = parseInt(JSON.parse(item.ext_info).voice_len)
      return {width: (sec / 20 * 10) + 40 + 'px'}
    }
  }
}

</script>
<style lang="stylus" scoped>
@import '../../../css/mixin.styl'
.user-history-waraaper
  position relative
  height 730px
  .user-history-header
    font-size 20px
    color #333
    height 76px
    width 100%
    text-align center
    line-height 76px
  .user-history-content
    position absolute
    left 0px
    top 0px
    box-sizing border-box
    height 100%
    width 100%
    padding 76px 0 58px 0
    border-top-right-radius 4px
    border-bottom-right-radius 4px
    .history-voice-wraaper
      display inline-block
      max-width 60%
      height 34px
      margin-top 10px
      background-color  #3091f2
      margin-left 40px
      border-radius 4px
      position relative
      span
        leftarrowbubble(-8px,8px,4px,#3091f2)
        line-height 34px
        margin-left 4px
        font-size 8px
        color white
        float left
      img
        display block
        float left
        width 14px
        margin-top 10px
    .history-img-wraaper
      display block
      padding 10px 0
      margin-left 40px
      max-width 100px
      max-height 300px
      min-width 30px
      min-height 30px
      img
        display block
        width 100%
        border-radius 4px
  .user-history-pagecontrol
    position absolute
    bottom 22px
    right 20px
    font-size 14px
    a
      text-decoration none
      color #3091f2
    span
      margin 0 18px
</style>
