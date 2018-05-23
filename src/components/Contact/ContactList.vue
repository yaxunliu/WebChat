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
          <input type="search" placeholder="输入用户昵称">
        </div>
      </div>
      <div class="contact-list" ref="contacterlist">
        <div v-if="contactlist !== null" v-for = "group in contactlist" :key="group.name" class="contact-group-item">
          <img v-if="group.show" src="../../assets/images/arrow.png" style="transform:rotate(90deg)">
          <img v-else src="../../assets/images/arrow.png">
          <a href="#" class="groupname" @click="_clickGroupItem(group)">{{group.name}}</a>
          <ul v-if="group.show">
            <ContactCell v-for = "subitem in group.data" :key="subitem.id" :item="subitem" :clickContactCell="_clickContactCell"></ContactCell>
          </ul>
        </div>
      </div>
      <div v-if="loginInfo.usertype === 0" class="group-send">
        <a href="#">群发</a>
        <a href="#">编辑</a>
      </div>
  </div>
</template>

<script>
import { jsonp } from '../../common/fetch'
import ContactCell from './ContactCell/ContacterCell'
export default {
  components: {
    ContactCell
  },
  props: {
    loginInfo: {
      type: Object,
      default: function () {
        return [ ]
      }
    }
  },
  data () {
    return {
      'contactlist': null,
      'selectItem': null, // 选择的聊天对象
      'tempData': null // 临时数据存储用来数据转换
    }
  },
  watch: {
    selecitem: {

    }
  },
  mounted () {
    // 获取到最近聊天记录数据
    jsonp('/priapi1/get_chat_history').then((res) => {
      if (this.tempData === null) { // 分组数据还没有加载出来
        this.tempData = res
      } else { // 分组数据加载完成
        this.tempData.map((groupinfo) => {
          if (groupinfo.data) {
            groupinfo.data.map((subitem) => {
              let messageitem = this._filterMessage(subitem.nick, res)
              subitem.lastMessage = messageitem.msg
              subitem.lastTime = messageitem.ctime
            })
          }
        })
        this.contactlist = this.tempData
      }
    }).catch((err) => {
      console.log(err)
    })
    // 获取到分组数据
    jsonp('/priapi1/get_puber_contacters').then((res) => {
      // 1.对分组数据进行初始化处理
      res.map((item) => {
        item.show = false
        if (item.data) {
          item.data.map((subitem) => {
            subitem.select = false
            subitem.lastMessage = ' '
            subitem.lastTime = ' '
          })
        }
      })
      if (this.tempData === null) { // 历史数据还没有加载完成
        this.tempData = res
      } else { // 历史数据加载完成 将聊天数据注入到最终的数据中
        res.map((groupinfo) => {
          if (groupinfo.data) {
            groupinfo.data.map((subitem) => {
              let messageitem = this._filterMessage(subitem.nick, this.tempData)
              subitem.lastMessage = messageitem.msg
              subitem.lastTime = messageitem.ctime
            })
          }
        })
        this.contactlist = res
      }
    }).catch((err) => {
      console.log(err)
    })
    if (this.$refs.top === undefined) { return }
    var topheight = this.$refs.top.offsetHeight
    var contactlistheight = this.$refs.warapper.offsetHeight - topheight
    this.$refs.contacterlist.style.height = contactlistheight + 'px'
  },
  methods: {
    _clickGroupItem (item) {
      item.show = !item.show
    },
    _filterMessage (nick, messagelist) {
      let items = messagelist.filter((message) => {
        return message.nick === nick
      })
      if (items === null || items === undefined || items.length <= 0) {
        return null
      }
      return items[0]
    },
    _clickContactCell (item) {
      if (item === undefined || item === null || this.selectItem === item) { return }
      if (this.selectItem) {
        this.selectItem.select = false
      }
      item.select = !item.select
      this.selectItem = item
      typeof this.$attrs.selectChat === 'function' && this.$attrs.selectChat(item)
    }
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
     .header-search
      height 48px
      position relative
      span
        background url('../../assets/images/search.png') no-repeat
        display inline-block
        width 15px
        height 15px
        position absolute
        left 60px
        top 17px
      input
        display inline
        border none
        height 30px
        margin-top 9px
        margin-left 17px
        width 190px
        padding-left 68px
        border-radius 4px
  .contact-list
    color white
    overflow auto
    .contact-group-item
      background-color #474647
      border-bottom 1px solid #333
      position relative
      box-sizing border-box
      overflow hidden
      img
        width 10px
        height 10px
        position absolute
        left 16px
        top 25px
      .groupname
        display inline-block
        width 100%
        height 60px
        line-height 60px
        font-size 14px
        padding-left 52px
        text-decoration none
        box-sizing border-box
        color white
  .group-send
    height 55px
    position absolute
    bottom 0px
    left 0px
    width 100%
    color #3091f2
    font-size 14px
    line-height 55px
    text-align center
    background-color #333
    border-bottom-left-radius 4px
    border-bottom-right-radius 4px
    a:first-child
      padding-right 10px
      border-right 1px solid #3091f2
      text-decoration none
      color #3091f2
    a:last-child
      color #3091f2
      padding-left 10px
      text-decoration none
</style>
