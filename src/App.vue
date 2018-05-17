<template>
  <div id="app">
    <ContactList id="contactlist"></ContactList>
    <Chat id="chat"></Chat>
    <Userinfo id="userinfo"></Userinfo>
  </div>
</template>

<script>
import ContactList from '../src/components/Contact/ContactList'
import Chat from '../src/components/Chat/Chat'
import Userinfo from '../src/components/UserInfo/UserInfo'

export default {
  name: 'App',
  components: {
    ContactList,
    Chat,
    Userinfo
  }
}
</script>
<style>
#app {
  height: 730px;
  width: 1200px;
  margin: 60px auto 10px auto;
  box-shadow: #dbdbda 0 0 10px 2px;
  display: flex;
  flex-direction: row;
  border-radius: 4px
}
#contactlist {
  width: 224px;
  height: 100%;
}
#chat {
  width: 626px;
  background-color: #f5f5f5;
  height: 100%;
}
#userinfo {
  width: 354px;
  background-color: white;
  height: 100%;
}

#app-contains {
}

</style>
