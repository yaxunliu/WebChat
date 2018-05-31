<!-- 联系人列表组件 -->
<template>
  <div v-if="loginInfo" class="contact-warapper" ref="warapper">
      <div class="header" ref="top">
        <div class="header-user">
          <img :src="loginInfo.header">
          <span>{{loginInfo.nick}}</span>
        </div>
        <div v-if="loginInfo.usertype === 0" class="header-search">
          <span></span>
          <input type="search" placeholder="输入用户昵称" @input="_search" ref="searchinput">
        </div>
        <ul v-if="searchResult !== null" class="search-result">
          <li v-for="result in searchResult" class="result" @click="_selectSearchResult(result)" :key="result.id">{{result.nick}}</li>
        </ul>
      </div>
      <div class="contact-list" ref="contacterlist" :style="loginInfo.usertype === 0 ? 'height:551px' : 'height:606px'">
        <div v-if="contactlist !== null" v-for = "group in contactlist" :key="group.name" class="contact-group-item">
          <img v-if="group.show" src="../../assets/images/arrow.png" style="transform:rotate(90deg)">
          <img v-else src="../../assets/images/arrow.png">
          <a href="#" class="groupname" @click="_clickGroupItem(group)">{{group.name}}<span v-if="group.newtips" class="newtip"></span></a>
          <ul v-if="group.show">
            <ContactCell v-for = "subitem in group.data" :key="subitem.id" :item="subitem" :clickContactCell="_clickContactCell"></ContactCell>
          </ul>
        </div>
      </div>
      <div v-if="loginInfo.usertype === 0" class="group-send">
        <a href="#" class="send">群发</a>
        <a href="#" class="edit" @mouseover="_showEditArea" @mouseout="_hiddenEditArea">编辑</a>
        <ul v-if="showEditArea" class="editlist" @mouseout="_hiddenEditArea">
          <li @mouseover="_showEditArea(true)"><a href="#" class="edit-item" @click="_showCreateGroup(true)">创建分组</a></li>
          <li @mouseover="_showEditArea(true)"><a href="#" class="edit-item" @click="_showEditGroup(true, false)">编辑/删除分组</a></li>
          <li @mouseover="_showEditArea(true)"><a href="#" class="edit-item">移动用户至分组</a></li>
        </ul>
      </div>
      <newGroup v-if="showCreateGroup" :createGroupSuccess="_createGroupSuccess"></newGroup>
      <editGroup v-if="showEditGroup" :datalist="contactlist" :closeEdit="_showEditGroup"></editGroup>
  </div>
</template>

<script>
import { jsonp } from '../../common/fetch'
import ContactCell from './ContactCell/ContacterCell'
import { currentTime } from '../../common/category'
import newGroup from '../../components/Contact/NewGroup/newGroup'
import editGroup from '../../components/Contact/EditGroup/editGroup'

export default {
  components: {
    ContactCell,
    newGroup,
    editGroup
  },
  props: {
    loginInfo: {
      type: Object,
      default: function () {
        return [ ]
      }
    },
    newMessage: { // 有新的消息(收到的消息)
      type: [Object]
    },
    updateMessage: { // 更新消息的最后一条消息
      type: [Object]
    },
    contactListNewTip: { // 新消息提示
      type: [Object]
    },
    contactOfflineMessages: { // 离线消息列表
      type: [Array, Object]
    }
  },
  data () {
    return {
      'showCreateGroup': false, // 是否显示创建分组组件
      'showEditGroup': false, // 是否显示编辑分组
      'showEditArea': false, // 是否显示编辑区
      'searchResult': [ ],
      'contactlist': null,
      'contactSortList': {}, // 排列后的联系列表通过用户的id快速查到对应的单聊模型(数组)
      'contactSortGroupList': {}, // 排列后的组数据通过用户的id快读查询到对应的组模型(数组)
      'selectItem': null, // 选择的聊天对象
      'tempData': null, // 临时数据存储用来数据转换
      'dataReady': false // 数据是否准备完成
    }
  },
  watch: {
    dataReady: function () {
      if (this.contactListNewTip) {
        this.dataReady && this._receiveNewMessage([this.contactListNewTip])
      } else {
        this.dataReady && this._receiveNewMessage(this.contactOfflineMessages)
      }
    },
    newMessage: function () { // 有新的消息
    },
    updateMessage: function () { // 自己发送的内容更新联系人列表最新发送的消息内容和时间
      // 1.准备更新内容
      let content = null
      let id = this.updateMessage.data.target
      let time = currentTime(false, this.updateMessage.mid)
      if (this.updateMessage.action === 'post_text') { // 文本
        content = this.updateMessage.data.content
      } else { // 图片
        content = '[图片]'
      }
      // 2.更新消息发送的状态
      this.contactSortList[id].map((item) => {
        if (item.id === id) {
          item.lastMessage = content
          item.lastTime = time
        }
      })
    },
    contactListNewTip: function () { // 新的消息提示
      if (this.dataReady) {
        this._receiveNewMessage([this.contactListNewTip])
      }
    },
    contactOfflineMessages: function () {
      if (this.dataReady) {
        this._receiveNewMessage(this.contactOfflineMessages)
      }
    }
  },
  methods: {
    _createGroupSuccess (success) {
      this._showCreateGroup(false)
      if (success) { this._initialData() }
    },
    _showEditGroup (show, reload) {
      this.showEditGroup = show
      if (reload) {
        console.log('reload')
        this._initialData()
      }
    },
    _showCreateGroup (show) {
      this.showCreateGroup = show
    },
    _hiddenEditArea () {
      this.timer = setTimeout(() => {
        this.showEditArea = false
      }, 500)
    },
    _showEditArea () {
      this.timer !== null && clearTimeout(this.timer)
      this.showEditArea = true
    },
    _selectSearchResult (result) {
      this.$refs.searchinput.value = ''
      this.searchResult = [ ]
      let groups = this.contactSortGroupList[result.id]
      groups[0].show = true
      groups[0].data.map((chat) => {
        if (chat.id === result.id) {
          if (this.selectItem !== null) {
            this.selectItem.select = false
          }
          chat.select = true
          this.selectItem = chat
          typeof this.$attrs.searchSelectChatObj === 'function' && this.$attrs.searchSelectChatObj(chat)
        }
      })
    },
    _search () {
      let searchText = this.$refs.searchinput.value
      if (searchText === '') {
        this.searchResult = [ ]
      } else {
        this.searchResult = [ ]
        typeof this.contactlist.map === 'function' && this.contactlist.map((item) => {
          item.data.map((subitem) => {
            let index = subitem.nick.indexOf(searchText)
            if (index < 0) { return }
            let fles = this.searchResult.filter((result) => {
              return result.id === subitem.id
            })
            fles.length === 0 ? this.searchResult.push(subitem) : console.log('重复的id', fles)
          })
        })
        console.log('result', this.searchResult)
      }
    },
    _clickGroupItem (item) {
      item.show = !item.show
    },
    _filterMessage (nick, messagelist) {
      if (messagelist === null) {
        console.log('messagelist', nick, messagelist)
        return {}
      }
      let items = messagelist.filter((message) => {
        if (message.nick === '' || message.nick === undefined || message.nick === null) {
          message.nick = '用户' + message.from_id
        }
        return message.nick === nick
      })
      if (items === null || items === undefined || items.length <= 0) {
        return null
      }
      return items[0]
    },
    _clickContactCell (item) {
      if (item === undefined || item === null || this.selectItem === item) { return }
      let groups = this.contactSortGroupList[item.id]
      if (groups) {
        groups.map((group) => {
          if (group.newMessageTipList.length !== 0) { // 有新消息提示
            delete group.newMessageTipList[item.id]
            group.newtips = JSON.stringify(group.newMessageTipList) !== '{}'
          }
        })
      }
      if (this.selectItem) {
        this.selectItem.select = false
        this.selectItem.newtip = false
      }
      item.select = !item.select
      this.selectItem = item
      typeof this.$attrs.selectChat === 'function' && this.$attrs.selectChat(item)
    },
    _receiveNewMessage (messages) {
      if (!this.dataReady || !messages) {
        return 0
      }
      console.log('message', messages, '离线message列表', this.contactOfflineMessages)
      typeof messages.map === 'function' && messages.map((message) => {
        // 1.更新消息内容
        let time = currentTime(false, message.timestamp * 1000)
        let content = null
        if (message.body.type === 'txt') {
          content = message.body.content
        } else if (message.body.type === 'img') {
          content = '[图片]'
        } else {
          content = '[语音消息]'
        }
        if (this.contactSortGroupList[message.from_id] && this.contactSortGroupList[message.from_id].length > 0) { // 用户在列表内
          let selectList = this.contactSortList[message.from_id].filter((item) => {
            return item.select
          })
          console.log('selectList', selectList)
          if (selectList === null || selectList.length === 0) { // 没有聊天被选中 => 提示消息未读
            console.log('没有聊天被选中')
            this.contactSortGroupList[message.from_id].map((group) => {
              console.log('分组找到', group)
              group.newMessageTipList[message.from_id] = content
              group.newtips = JSON.stringify(group.newMessageTipList) !== '{}'
            })
          }
          this.contactSortList[message.from_id].map((item) => {
            item.lastMessage = content
            item.lastTime = time
            item.newtip = true
          })
        } else { // 用户不在列表内
          let obj = {'head_img': message.from_head_img, 'id': message.from_id, 'lastMessage': content, 'lastTime': currentTime(message.from_id.timestamp), 'newtip': true, 'nick': message.from_nick, 'select': false}
          let latestGroup = this.contactlist[this.contactlist.length - 1]
          this.contactSortList[message.from_id] = [obj]
          this.contactSortGroupList[message.from_id] = [latestGroup]
          latestGroup.newMessageTipList[message.from_id] = content
          latestGroup.data.push(obj)
        }
      })
    },
    _initialData () {
      // 获取到最近聊天记录数据
      jsonp('/priapi1/get_chat_history').then((res) => {
        if (this.tempData === null) { // 分组数据还没有加载出来
          this.tempData = res
        } else { // 分组数据加载完成
          this.tempData.map((groupinfo) => {
            if (groupinfo.data) {
              groupinfo.data.map((subitem) => {
                if (subitem.nick === '' || subitem.nick === undefined || subitem.nick === null) {
                  subitem.nick = '用户' + subitem.id
                }
                let messageitem = this._filterMessage(subitem.nick, res)
                if (messageitem === null) {
                  subitem.lastMessage = '最近无聊天记录'
                  subitem.lastTime = ''
                } else {
                  subitem.lastMessage = messageitem.msg
                  subitem.lastTime = currentTime(false, messageitem.ctime)
                }
              })
            }
          })
          this.contactlist = this.tempData
          this.tempData = null
          this.dataReady = true
        }
      }).catch((err) => {
        console.log(err)
      })
      // 获取到分组数据
      jsonp('/priapi1/get_puber_contacters').then((res) => {
        console.log('分组数据', res)
        // 1.对分组数据进行初始化处理
        res.map((item) => {
          item.show = false
          item.newMessageTipList = {}
          item.newtips = false
          if (item.data) {
            item.data.map((subitem) => {
              subitem.select = false
              subitem.lastMessage = ' '
              subitem.lastTime = ' '
              subitem.newtip = false
              if (!this.contactSortGroupList[subitem.id]) {
                this.contactSortGroupList[subitem.id] = [item]
              } else {
                this.contactSortGroupList[subitem.id].push(item)
              }
              if (!this.contactSortList[subitem.id]) {
                this.contactSortList[subitem.id] = new Array(subitem)
              } else {
                this.contactSortList[subitem.id].push(subitem)
              }
            })
          }
        })
        if (this.tempData === null) { // 历史数据还没有加载完成
          this.tempData = res
        } else { // 历史数据加载完成 将聊天数据注入到最终的数据中
          res.map((groupinfo) => {
            if (groupinfo.data) {
              groupinfo.data.map((subitem) => {
                if (subitem.nick === '' || subitem.nick === undefined || subitem.nick === null) {
                  subitem.nick = '用户' + subitem.id
                }
                let messageitem = this._filterMessage(subitem.nick, this.tempData)
                if (messageitem === null) {
                  subitem.lastMessage = '暂无聊天记录'
                  subitem.lastTime = '...'
                } else {
                  subitem.lastMessage = messageitem.msg
                  subitem.lastTime = currentTime(false, messageitem.ctime)
                }
              })
              this.tempData = null
            }
          })
          this.contactlist = res
          this.dataReady = true
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this._initialData()
    if (this.$refs.top === undefined) { return }
    var topheight = this.$refs.top.offsetHeight
    var contactlistheight = this.$refs.warapper.offsetHeight - topheight
    this.$refs.contacterlist.style.height = contactlistheight + 'px'
  }
}

</script>
<style lang="stylus" scoped>
@importc '../../css/mixin.styl'
.contact-warapper
  width 100%
  height 100%
  background-color #333
  border-top-left-radius 4px
  border-bottom-left-radius 4px
  position relative
  .header
    .header-user
      height 76px
      color white
      font-size 18px
      position relative
      img
        width 42px
        height 42px
        margin 17px 10px
        border-radius 4px
      span
        position absolute
        left 62px
        line-height 76px
        max-width 140px
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
    .header-search
      height 48px
      position relative
      span
        background url('../../assets/images/search.png') no-repeat
        display inline-block
        width 15px
        height 15px
        position absolute
        left 25px
        top 17px
      input
        display inline
        border none
        height 30px
        margin-top 9px
        margin-left 17px
        width 190px
        padding-left 26px
        border-radius 4px
    .search-result
      position absolute
      z-index 1000
      left 17px
      top 114px
      .result
        background-color white
        padding-left 20px
        font-size 14px
        line-height 24px
        box-sizing border-box
        width 190px
        height 24px
  .contact-list
    color red
    overflow auto
    .contact-group-item
      background-color #3d3d3d
      border-bottom 1px solid #333
      position relative
      box-sizing border-box
      overflow hidden
      img
        width 10px
        height 10px
        position absolute
        left 16px
        top 15px
      .groupname
        display inline-block
        width 100%
        height 40px
        line-height 40px
        font-size 14px
        padding-left 52px
        text-decoration none
        box-sizing border-box
        color white
        .newtip
          position absolute
          width 6px
          height 6px
          margin-top 27px
          margin-left 6px
          border-radius 3px
          background-color red
      ul
        overflow hidden
  .group-send
    height 55px
    position absolute
    bottom 0px
    left 0px
    width 100%
    color #3091f2
    background-color red
    font-size 14px
    line-height 55px
    text-align center
    background-color #333
    border-bottom-left-radius 4px
    border-bottom-right-radius 4px
    .send
      padding-right 10px
      border-right 1px solid #3091f2
      text-decoration none
      color #3091f2
    .edit
      color #3091f2
      padding-left 10px
      text-decoration none
    .editlist
      background-color white
      z-index 1000
      border-radius 4px
      position absolute
      height 120px
      width 152px
      right -54px
      top -110px
      border #d5d5d5 solid 1px
      li
        height 40px
        color #000
        line-height 40px
        border-bottom #d5d5d5 solid 1px
        a
          text-decoration none
          color #000
      li:hover
        background-color #eaeaea
      li:last-child
        border none
</style>
