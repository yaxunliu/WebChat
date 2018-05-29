<template>
<!-- 聊天内容组件 -->
  <div class="chat-warapper">
    <div class="chat-header">
      {{chatObj.nick}}
      <audio ref="audio"></audio>
    </div>
    <div class="chat-content">
      <ul ref="chatscroll">
        <li v-for="item in chathistory" :key="item.msg_id" ref="chatitem">
        <Chatimage v-if="item.msg_type === '2'" :item="item" :resendimage="_resendmessage"></Chatimage>
        <Chattext v-if="item.msg_type === '1'" :item="item" :resendtext="_resendmessage"></Chattext>
        <Chatvoice v-if="item.msg_type === '3'" :item="item" :playVoice='_playvoice'></Chatvoice>
        </li>
      </ul>
    </div>
    <div class="chat-input">
      <Chatemojilist v-if="showemojilist" class="emojilist" :selectEmoji="_selectEmoji"></Chatemojilist>
      <div class="chat-emoji-icon">
        <a href="#" @click="_showEmojiList"><img src="../../assets/images/emoji.png"></a>
        <a href="#" @click="_selectImage"><img src="../../assets/images/picture.png"></a>
        <input type="file" accept="image/gif, image/jpeg, image/png" ref="imgpicker" @change='_onInputchange'>
      </div>
      <div class="chat-input-text">
        <div id="editarea" contenteditable=true @click="_begainEdit" @keyup.enter="_keydown" ref="innercontent">
        </div>
      </div>
      <div class="chat-send-button">
        <a href="#" @click="_sendText">发送</a>
      </div>
    </div>
  </div>
</template>
<script>
import { baseUrl, jsonp } from '../../common/fetch.js'
import Chatvoice from './chatVoice/chatvoice.vue'
import Chattext from './ChatText/Chattext.vue'
import Chatimage from './ChatImage/Chatimage.vue'
import Chatemojilist from './chatEmoji/chatEmojiList'
import emojiJson from '../../assets/images/emoji.json'
import { replcestr } from '../../common/category.js'
export default {
  data () {
    return {
      'chathistory': [ ], // 聊天历史数据
      'unreachQueue': {}, // 正在发送中的消息队列
      'unreachWebitemQueue': {}, // 正在发送的消息item显示在web上的
      'showemojilist': false,
      'emojipath': '/static/emjoy/'
    }
  },
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
        return [ ]
      }
    },
    reachedmid: { // 对方已经收到的消息mid
      type: [ Number ],
      default: function () {
        return null
      }
    },
    newMessage: { // 收到新的消息
      type: [Object]
    }
  },
  watch: {
    chatObj: function () {
      // 加载聊天历史数据
      this._loadHistoryData()
    },
    reachedmid: function () {
      let obj = this.unreachWebitemQueue[this.reachedmid]
      obj.status = 0
      delete this.unreachQueue[this.reachedmid]
      delete this.unreachWebitemQueue[this.reachedmid]
    },
    newMessage: function () {
      if (this.newMessage.from_id !== this.chatObj.id) { return }
      let minus = this.newMessage['ctime'] - new Date(this.chathistory[this.chathistory.length - 1].ctime).getTime()
      this.newMessage['showtime'] = minus > 60000
      this.newMessage['from_head_img'] = this.chatObj.head_img
      this.newMessage['to_head_img'] = this.loginInfo.header
      this.newMessage['receiver'] = true
      if (this.newMessage['msg_type'] === '1') { // 文字消息
        let gifSrc = this._filterGifEmojiSrc(this.newMessage.content)
        if (gifSrc !== null) {
          this.newMessage['msg_type'] = '2'
          this.newMessage['src'] = gifSrc
        } else {
          this.newMessage['msg_type'] = '1'
          this.newMessage['innerHTML'] = this._filterText(this.newMessage['content'])
        }
      } else if (this.newMessage['msg_type'] === '2') { // 图片消息
        // 图片消息暂时不需要处理
      }
      this._insertChatItem(this.newMessage)
    }
  },
  updated () {
    var height = this.$refs.chatitem.reduce((pre, cur) => {
      var preheight = 0
      if (typeof pre === 'object') {
        preheight = pre.offsetHeight
      } else {
        preheight = pre
      }
      return preheight + cur.offsetHeight
    })
    this.$refs.chatscroll.scrollTop = height
  },
  mounted () {
    this._loadHistoryData()
  },
  methods: {
    _keydown (item) {
      this._sendText()
    },
    _playvoice (item) { // 播放或者暂停
      this._stopCurrentPlayVoice()
      if (item.play) { // 播放
        this.currentPlayitem = item
        this._begainPlayCurrentVoice()
      }
    },
    _loadHistoryData () {
      jsonp('/sixin/get_liaotian', {'from': 'im3', 'user_id': this.chatObj.id}).then((res) => {
        res.map((value, index, arr) => {
          // 1.过滤表情符号
          if (index === 0) {
            this._filterReceiveText(0, value)
          } else {
            this._filterReceiveText(arr[index - 1], value)
          }
        })
        this.chathistory = null
        this.chathistory = res
      })
    },
    _filterReceiveText (lastitem, item) {
      // 1.初始化状态值
      if (item['msg_type'] === '3') { // 对语音进行处理
        item.play = false
        item.voicelen = JSON.parse(item.ext_info).voice_len
      } else if (item['msg_type'] === '1') {
        // 1.有可能是gif图片
        let gifSrc = this._filterGifEmojiSrc(item.content)
        if (gifSrc !== null) {
          item['msg_type'] = '2'
          item['src'] = gifSrc
        } else {
          // 过滤表情图片
          item.innerHTML = this._filterText(item.content)
        }
      }
      item.status = 0
      var interval = new Date(item.ctime).getTime()
      item.ctime = interval
      // 2.判断当前消息是否显示时间
      item.showtime = lastitem === 0 ? true : this._isShowTime(lastitem, item)
      // 3.当前用户是否是消息接收者
      item.receiver = item.to_uid === this.loginInfo.uid
    },
    /* 编辑区事件 */
    // 选择表情
    _selectEmoji (isgif, emojiitem) {
      let emojisrc = this.emojipath + emojiitem.img
      this.showemojilist = false
      if (isgif) {
        // 1.发送文本消息给服务器
        let timeinterval = this._sendTextMessageToServer(emojiitem.title)
        // 2.显示gif图片在web服务器
        this._insertImageMessageToWeb(timeinterval, emojisrc)
      } else {
        let ele = `${'<img style="display: inline-block;height: 20px; vertical-align: middle"'} src="${emojisrc}" text="${emojiitem.title}">`
        this.$refs.innercontent.innerHTML += ele
      }
    },
    // 选择图片
    _selectImage () {
      this.$refs.imgpicker.click()
    },
    // 选择了图片
    _onInputchange (e, type) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      if (files[0].type.indexOf('image') < 0) {
        alert('上传了非图片')
        return
      }
      if (files[0].size > 5 * 1000000) {
        alert('上传文件过大')
        return
      }
      let reader = new FileReader()
      reader.onload = (eve) => {
        let src = eve.currentTarget.result
        this._sendImage(src)
      }
      if (e.target.files.length > 0) {
        reader.readAsDataURL(e.target.files[0])
      }
    },
    // 发送文本
    _sendText () {
      // 1.过滤文本(这里只是包含文字信息和表情信息)
      let innerHTML = this._filterSpace(this.$refs.innercontent.innerHTML)
      let innerText = this.$refs.innercontent.textContent
      innerText = innerText.replace(/^[\s]*/gi, '').replace(/[\s]*$/gi, '')
      if (innerHTML === '' && innerText.length === 0) {
        alert('不能发送空白内容')
        return
      }
      this.$refs.innercontent.innerHTML = ''
      let content = this._filterHTML(innerHTML, innerText)
      // 2.发送到服务器
      let timeinterval = this._sendTextMessageToServer(content)
      // 3.显示文本和表情消息到web服务器
      this._insertMessageItemToweb(timeinterval, content, innerHTML)
    },
    _filterSpace (html) {
      let divReg = /<div>(<br>)*<\/div>/g
      html = html.replace(divReg, '')
      let spanReg = /div/g
      html = html.replace(spanReg, 'span')
      return html
    },
    _sendTextMessageToServer (text) {
      let timeinterval = new Date().getTime()
      let msgId = timeinterval
      let jsonstr = JSON.stringify({'action': 'post_text', 'mid': msgId, 'data': {'target': this.chatObj.id, 'target_type': 'user', 'content': text}})
      this.unreachQueue[msgId] = jsonstr
      this._sendMessage(jsonstr)
      return timeinterval
    },
    _insertMessageItemToweb (timeinterval, content, innerHTML) {
      let textitem = {'msg_id': timeinterval, content: content, 'from_id': this.loginInfo.uid, 'msg_type': '1'}
      let minus = timeinterval - new Date(this.chathistory[this.chathistory.length - 1].ctime).getTime()
      textitem['showtime'] = minus > 60000
      textitem['from_head_img'] = this.loginInfo.header
      textitem['to_uid'] = this.chatObj.id
      textitem['to_head_img'] = this.chatObj.head_img
      textitem['status'] = 1
      textitem['ctime'] = timeinterval
      textitem['innerHTML'] = innerHTML
      this._insertChatItem(textitem)
      this.unreachWebitemQueue[timeinterval] = textitem
    },
    // 将富文本过滤生成文字返回
    _filterHTML (html, text) {
      // 过滤表情图片
      var imgReg = /<img.*?(?:>|\/>)/gi
      var textReg = /text=['|"]?([^|'|"]*)[|'|"]?/i
      var arr = html.match(imgReg)
      if (arr !== null) { // 有图片
        let content = ''
        arr.forEach(element => {
          var results = element.match(textReg)
          if (results[1]) {
            content = html.replace(element, results[1])
          }
        })
        return content
      } else { // 没有图片
        return text
      }
    },
    // 将文本过滤生成富文本
    _filterText (content) {
      // 1.匹配表情
      var emojiReg = /\[[\u4e00-\u9fa5]{1,4}]/g
      var emojiTitles = [ ]
      var result = null
      do {
        result = emojiReg.exec(content)
        if (result == null) break
        emojiTitles.push(result)
      } while (1)
      if (emojiTitles) {
        emojiTitles = emojiTitles.reverse()
        for (let index in emojiTitles) {
          let locations = emojiTitles[index]
          let title = locations['0']
          let locationIndex = locations['index']
          let src = this._filterEmojiSrc(title)
          if (src === undefined) { continue } // 过滤不存在的emoji
          let ele = `${'<img style="display: inline-block;height: 20px; vertical-align: middle"'} src="${src}" text="${title}">`
          content = replcestr(content, locationIndex, title, ele)
        }
      }
      return content
    },
    _filterEmojiSrc (title) {
      // 1.过滤普通表情
      let emojis = emojiJson[0].list
      let results = emojis.filter((emoji) => {
        return emoji.title === title
      })
      if (results.length !== 0) {
        return '/static/emjoy/' + results[0].img
      }
    },
    _filterGifEmojiSrc (title) {
      // 过滤gif表情
      let gifemojis = emojiJson[1].list
      let gifResult = gifemojis.filter((emoji) => {
        return emoji.title === title
      })
      if (gifResult.length !== 0) {
        return '/static/emjoy/' + gifResult[0].img
      }
      return null
    },
    // 发送图片
    _sendImage (src) {
      if (src.length === 0 || src === undefined) { return }
      // 1.将图片消息发送到服务器
      let timeinterval = this._sendImageMessageToServer(src)
      // 2.显示图片消息到web
      this._insertImageMessageToWeb(timeinterval, src)
    },
    _sendImageMessageToServer (src) {
      // /priapi1/im_send_image
      let timeinterval = new Date().getTime()
      let msgId = timeinterval
      let jsonstr = JSON.stringify({'action': 'post_image', 'mid': msgId, 'data': {'content': src.split(',')[1], 'target': this.chatObj.id, 'target_type': 'user', 'type': 'binary', 'encode': 'base64', 'file_ext': 'png'}})
      this.unreachQueue[msgId] = jsonstr
      this._sendMessage(jsonstr)
      return timeinterval
    },
    _insertImageMessageToWeb (timeinterval, src) {
      let imgitem = {'msg_id': timeinterval, 'from_id': this.loginInfo.uid, 'msg_type': '2', 'src': src}
      let minus = timeinterval - new Date(this.chathistory[this.chathistory.length - 1].ctime).getTime()
      imgitem['showtime'] = minus > 60000
      imgitem['from_head_img'] = this.loginInfo.header
      imgitem['to_uid'] = this.chatObj.id
      imgitem['to_head_img'] = this.chatObj.head_img
      imgitem['status'] = 1
      imgitem['ctime'] = timeinterval
      this._insertChatItem(imgitem)
      this.unreachWebitemQueue[timeinterval] = imgitem
    },
    // 父组件发送数据
    _sendMessage (jsonstr) {
      this.$attrs.sendChatData && typeof this.$attrs.sendChatData === 'function' && this.$attrs.sendChatData(jsonstr)
      setTimeout(() => {
        this.unreachWebitemQueue.length && this.unreachWebitemQueue.map((item) => {
          item.status = 100
        })
      }, 10000)
    },
    // 开始编辑文字
    _begainEdit () {
      if (this.showemojilist) {
        this._showEmojiList()
      }
    },
    // 显示emojilist
    _showEmojiList () {
      this.showemojilist = !this.showemojilist
    },
    // 插入发送的数据
    _insertChatItem (item) {
      if (typeof item === typeof Object) {
        return 0
      }
      this.chathistory.push(item)
    },
    /* 语音播放相关事件 */
    // 停止当前播放的语音
    _stopCurrentPlayVoice () {
      if (this.currentPlayitem) {
        var audio = this.$refs.audio
        if (audio.ended !== undefined) {
          audio.pause()
        }
        this.currentPlayitem.play = false
        this.currentPlayitem = null
      }
    },
    // 开始播放当前选择的语音
    _begainPlayCurrentVoice () {
      if (this.currentPlayitem === null) {
        return
      }
      let voiceurl = null
      if (this.currentPlayitem.mp3_url.indexOf('http') === 0) {
        voiceurl = this.currentPlayitem.mp3_url
      } else {
        voiceurl = baseUrl + this.currentPlayitem.mp3_url
      }
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
    /* 聊天记录区域 */
    // 播放聊天记录区域语音
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
    /* 数据初始化计算 */
    _isShowTime (last, current) {
      var lasttime = new Date(last.ctime)
      var currenttime = new Date(current.ctime)
      var minustime = currenttime.getTime() - lasttime.getTime()
      return minustime > 60000
    },
    /* 重新发送消息 */
    _resendmessage (msgid) {
      if (this.unreachQueue[msgid] !== undefined && typeof this.unreachQueue[msgid] === 'string') {
        this._sendMessage(this.unreachQueue[msgid])
        setTimeout(() => {
          for (let key in this.chathistory) {
            let value = this.chathistory[key]
            if (value['msg_id'] === msgid) {
              value['status'] = 0
            }
          }
          delete this.unreachQueue[msgid]
        }, 2000)
      }
    }
  },
  components: {
    Chatvoice,
    Chattext,
    Chatimage,
    Chatemojilist
  }
}
</script>
<style lang="stylus" scoped>
@import '../../css/mixin.styl'
@import '../../css/chat.styl'
// 聊天内容
.chat-warapper
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
  .chat-input
    height 180px
    background-color #eaeaea
    position relative
    .emojilist
      position absolute
      margin-top -440px
      margin-left -168px
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
      input
        display none
    .chat-input-text
      height 76px
      #editarea
        box-sizing border-box
        word-wrap break-word
        overflow auto
        width 100%
        height 100%
        border none
        outline none
        -webkit-tap-highlight-color rgba(0,0,0,0)
        background-color rgba(0,0,0,0)
        padding 0 20px
        text-decoration none
        font-size 14px
        line-height 20px
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
