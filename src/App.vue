<template>
  <div id="app">
    <ContactList id="contactlist" :selectChat="_selectChatObj" :loginInfo="loginInfo" :updateMessage="updateMessage" :contactListNewTip="contactListNewTip" :contactOfflineMessages="contactOfflineMessages" :searchSelectChatObj="_searchSelectChatObj"></ContactList>
    <Chat v-if="chatObject" id="chat" :sendChatData="_sendMessage" :chatObj="chatObject" :loginInfo="loginInfo" :reachedmid="reachedMid" :newMessage="newMessage"></Chat>
    <Userinfo v-if="chatObject" id="userinfo" :chatObj="chatObject" :loginInfo="loginInfo"></Userinfo>
    <Placeholder v-if="!chatObject" id="placeholder"></Placeholder>
    <audio ref="aaa"><source src="./assets/voice/twitter.mp3" type="audio/mpeg"></audio>
  </div>
</template>

<script>
import ContactList from '../src/components/Contact/ContactList'
import Chat from '../src/components/Chat/Chat'
import Userinfo from '../src/components/UserInfo/UserInfo'
import Placeholder from '../src/components/Placeholder/Placeholder'

export default {
  name: 'App',
  components: {
    ContactList,
    Chat,
    Userinfo,
    Placeholder
  },
  data () {
    return {
      'chatObject': null, // 当前聊天对象
      'loginInfo': null,
      'socketTimer': null,
      'reachedMid': null,
      'updateMessage': null, // 发送一条消息 更新消息的状态
      'contactListNewTip': null, // 联系人列表新消息提示
      'newMessage': null,
      'contactOfflineMessages': []
    }
  },
  mounted () {
    document.clear = this.clear
    document.addEventListener('click', function () {
      this.clear()
    })
    document.addEventListener('mouseover', function () {
      this.clear()
    })
    this.loginInfo = {'nick': '官方测试账号(请勿订阅)', 'uid': '5552', 'token': '8d72dad621622623c6327955d24e60b8', 'header': 'http://www.weicaixun.com/upload/head/2018/2/201802011019187269.jpg', 'usertype': 0}
    this._startConnectWs()
  },
  methods: {
    _searchSelectChatObj (chatObj) {
      this.chatObject = chatObj
    },
    // 发送socket消息
    _sendMessage (jsonstr) {
      if (jsonstr !== '1') {
        this.updateMessage = JSON.parse(jsonstr)
      }
      if (window.ws.readyState === 1) { // socket处于连接状态
        window.ws.send(jsonstr)
      } else { // 连接失败
        this._clearTimer()
      }
    },
    // 选中聊天对象开始聊天
    _selectChatObj (chatObj) {
      if (this.chatObject === chatObj) { return 0 }
      this.newMessage = null
      this.chatObject = chatObj
    },
    _startConnectWs () {
      const wsurl = 'ws://182.92.112.212:8765/?token=8d72dad621622623c6327955d24e60b8&myclient=pc&myversion=1.0&user_guid=8d72dad621622623c6327955d24e60b8'
      let wsClient = new WebSocket(wsurl)
      window.ws = wsClient
      wsClient.onopen = (socket) => {
        this._startTimer()
      }
      wsClient.onclose = (socket) => {
        console.log('socket连接关闭')
        alert('与服务器失去连接, 请刷新重试或者重新登录')
        this._clearTimer()
      }
      wsClient.onerror = (socket) => {
        console.log('socket连接失败', socket)
        alert('连接失败')
      }
      wsClient.onmessage = (message) => {
        let json = JSON.parse(message.data)
        // 2.2在线消息状态确认
        if (json.code === 10000) {
          this._handleMessageStatus(json)
          return 0
        }
        // 3.错误码消息
        if (json.code >= 10001) {
          this._handleErrorMessage(json)
          return 0
        }
        this.show()
        this._playNewmessageTipVoice() // 播放语音提示
        // 1.离线消息
        if (json.chat_type === 2) { this._handleOfflineMessage(json) }
        // 2.在线消息
        if (json.chat_type === 1) { this._handleOnlineMessage(json) }
      }
    },
    _handleOfflineMessage (json) { // 处理离线消息
      if (json.data && json.data.length > 0) {
        this.contactOfflineMessages = Array.from(json.data)
      }
    },
    _handleOnlineMessage (json) {
      // 1收到新的在线消息 -> 联系人列表新的消息 -> 更新到正在聊天的消息中
      // 1.转发给联系人列表有新消息提示
      this.contactListNewTip = json
      // 2.转发到正在聊天的信息中
      // this.chatObject
      if (this.chatObject === null) { return 0 }
      if (json.from_id !== this.chatObject.id) { return 0 }
      if (json.body.type === 'txt') {
        let textitem = {'msg_id': json.msg_id, content: json.body.content, 'from_id': json.from_id, 'msg_type': '1'}
        textitem['ctime'] = json.timestamp
        textitem['to_uid'] = this.chatObject.id
        textitem['status'] = 0
        this.newMessage = textitem
      } else if (json.body.type === 'img') {
        let imgitem = {'msg_id': json.msg_id, content: json.body.content, 'from_id': json.from_id, 'msg_type': '2'}
        imgitem['ctime'] = json.timestamp
        imgitem['to_uid'] = this.chatObject.id
        imgitem['status'] = 0
        imgitem['src'] = json.body.url
        this.newMessage = imgitem
      } else {
        let voiceItem = {'msg_id': json.msg_id, content: json.body.content, 'from_id': json.from_id, 'msg_type': '3'}
        voiceItem['ctime'] = json.timestamp
        voiceItem['to_uid'] = this.chatObject.id
        voiceItem['status'] = 0
        voiceItem['voicelen'] = json.body.voice_len
        voiceItem['play'] = false
        voiceItem['mp3_url'] = json.body.mp3_url
        this.newMessage = voiceItem
      }
    },
    _handleMessageStatus (json) {
      this.reachedMid = json.mid
    },
    _handleErrorMessage (json) {

    },
    _clearTimer () {
      clearInterval(window.socketTimer)
      window.socketTimer = null
    },
    _startTimer () {
      var that = this
      window.socketTimer = setInterval(function () {
        that._sendMessage('1')
      }, 6000)
    },
    _playNewmessageTipVoice () {
      this.$refs.aaa.play().then(() => {
      })
    },
    show () {
      var step = 0
      var _title = document.title
      var timer = setInterval(function () {
        step++
        if (step === 3) {
          step = 1
        }
        if (step === 1) {
          document.title = '【　　】' + _title
        }
        if (step === 2) {
          document.title = '【新消息】' + _title
        }
      }, 500)
      document.blikTimer = timer
    },
    clear () {
      clearInterval(document.blikTimer)
      document.title = '私信'
    }
  }
}
</script>

<style lang="stylus" scoped>
#app
  height: 730px
  width: 1200px
  margin: 60px auto 10px auto
  box-shadow: #dbdbda 0 0 10px 2px
  display flex
  flex-direction row
  border-radius 4px
  #contactlist
    width: 224px
    height: 100%
  #chat
    width: 626px
    background-color: #f5f5f5
    height: 100%
  #userinfo
    width: 354px
    background-color: white
    height: 100%
  #placeholder
    width 976px
</style>
