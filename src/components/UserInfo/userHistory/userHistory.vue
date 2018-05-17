<!-- 用户端历史记录组件 -->
<template>
  <div class="user-history-waraaper">
      <div class="user-history-header">
        <p>聊天记录</p>
      </div>
      <div class="user-history-content">
        <ul style="overflow:auto;height:100%"><li v-for="item in currentPageHistory" :key="item.msg_id" style="font-size: 14px; line-height: 20px;">
          <span v-if="item.from_nick === loginnick" class="history-header" style="color: #f29930; padding: 0 18px">{{item.from_nick}}    {{item.ctime.replace(/-/g,'/')}}</span>
          <span v-else style="color: #3091f2; padding: 0 18px">{{item.from_nick}}      {{item.ctime.replace(/-/g,'/')}}</span>
          <p v-if="item.msg_type === '1'" style="color: #333; padding: 8px 18px;">{{item.content}}</p>
          <a v-else-if="item.msg_type === '3'" class="history-voice-wraaper" href="#">
            <span>5"</span>
            <img src="../../../assets/images/historyvoice.png">
          </a>
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
  data () {
    return {
      'loginnick': this.$attrs.usernick,
      'currentPageHistory': [ ],
      'allHistory': {},
      'page': 1,
      'lastPageCantouch': false,
      'baseurl': ''
    }
  },
  mounted () {
    console.log('baseUrl', baseUrl)
    this.baseUrl = baseUrl
    jsonp('/sixin/get_liaotian', {'from': 'im3', 'user_id': '5552'}).then((res) => {
      this.currentPageHistory = res
      this.allHistory[this.page] = res
    }).catch((err) => {
      console.log('other error', err)
    })
  },
  methods: {
    _clickNextPage () {
      if (this.allHistory[this.page + 1] !== undefined) {
        this.page += 1
        this.currentPageHistory = this.allHistory[this.page]
        return 0
      }
      jsonp('/sixin/get_liaotian', {'from': 'im3', 'user_id': '5552', 'msg_id': this.currentPageHistory[0].msg_id}).then((res) => {
        this.currentPageHistory = res
        this.page += 1
        this.allHistory[this.page] = res
        this.lastPageCantouch = true
      }).catch((err) => {
        console.log('err', err)
      })
    },
    _clikcLastPage () {
      if (this.page === 1) {
        this.lastPageCantouch = false
        return 0
      } else {
        this.page -= 1
        if (this.page === 1) {
          this.lastPageCantouch = false
        }
        this.currentPageHistory = this.allHistory[this.page]
      }
    },
    _palyHistoryVoice (url) {
      alert('播放音乐')
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
      width 100px
      height 34px
      background-color  #3091f2
      margin-left 40px
      border-radius 4px
      position relative
      span
        leftarrowbubble(-8px,8px,4px,#3091f2)
        line-height 33px
        margin-left 4px
        font-size 12px
        color white
        float left
      img
        display block
        float left
        width 20px
        height 20px
        margin-top 7px
        margin-left 5px
    .history-img-wraaper
      display block
      margin-left 40px
      max-width 100px
      max-height 300px
      padding 10px 0
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
