<template>
  <div id="app">
    <ContactList id="contactlist" :selectChat="_selectChatObj" :loginInfo="loginInfo"></ContactList>
    <Chat v-if="chatObject" id="chat" :sendChatData="_sendMessage" :chatObj="chatObject" :loginInfo="loginInfo"></Chat>
    <Userinfo v-if="chatObject" id="userinfo" :chatObj="chatObject" :loginInfo="loginInfo"></Userinfo>
    <Placeholder v-if="!chatObject" id="placeholder"></Placeholder>
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
      'loginInfo': null
    }
  },
  mounted () {
    this.loginInfo = {'nick': 'Swifter', 'uid': '109486', 'token': 'a415e232527adada58afe3f0d445bc70', 'header': 'http://www.weicaixun.com/upload/head/2018/2/201802011019187269.jpg', 'usertype': 1}
  },
  methods: {
    // 发送socket消息
    _sendMessage: (jsonstr) => {
    },
    // 选中聊天对象开始聊天
    _selectChatObj (chatObj) {
      if (this.chatObject === chatObj) { return 0 }
      this.chatObject = chatObj
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
