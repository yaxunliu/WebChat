<!-- 联系人列表组件 -->
<template>
  <div class="contact-warapper" ref="warapper">
      <div class="header" ref="top">
        <div class="header-user">
          <img src="../../assets/images/user-icon.png">
          <span>孙雄连</span>
        </div>
        <div class="header-search" v-if="user === 0">
          <span></span>
          <input type="search" placeholder="输入用户昵称">
        </div>
      </div>
      <div class="contact-list" ref="contactlist">
        <div class="contact-group-item" v-for = "item in contactlist" :key="item.name">
          <img v-if="item.show" src="../../assets/images/arrow.png" style="transform:rotate(90deg)">
          <img v-else src="../../assets/images/arrow.png">
          <span class="groupname" @click="clickGroup(item)">{{item.name}}</span>
          <ul v-if="item.show">
            <li v-for = "subitem in item.data" :key="subitem.id" class="contact-detail-item" @click="clickSubitem(subitem)">
              <img v-lazy="subitem.head_img">
              <span class="nick">{{subitem.nick}}</span>
              <span v-if="subitem.select" class="lastmessage selectitem">[2条]广告费发给我</span>
              <span v-else class="lastmessage">[2条]广告费发给我</span>
              <span class="lastmessagetime">11:30</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="user === 0" class="group-send">
        <a href="#">群发</a>
        <a href="#">编辑</a>
      </div>
  </div>
</template>

<script>
import { jsonp } from '../../common/fetch'

export default {
  data () {
    return {
      'user': 0, // 0表示是老师登录 1表示是普通用户登录
      'contactlist': [ ],
      'test': 'http://www.weicaixun.com/upload/imglib/thumb/210_140/finance_201701101039045852.jpg'
    }
  },
  mounted () {
    jsonp('/priapi1/get_puber_contacters').then((res) => {
      for (let index in res) {
        let item = res[index]
        item.show = false
        for (const subindex in item.data) {
          item.data[subindex].select = false
        }
      }
      this.contactlist = res
    }).catch((err) => {
      console.log(err)
    })
    var topheight = this.$refs.top.offsetHeight
    var contactlistheight = this.$refs.warapper.offsetHeight - topheight
    this.$refs.contactlist.style.height = contactlistheight + 'px'
  },
  methods: {
    clickGroup: (item) => {
      item.show = !item.show
    },
    clickSubitem: (item) => {
      item.select = !item.select
      console.log(item)
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
        margin-left 52px
      .contact-detail-item
        border-top 1px solid #333
        height 60px
        width 100%
        position relative
        color #999
        img
          position absolute
          left 20px
          top 10px
          width 40px
          height 40px
          border-radius 4px
        .nick
          position absolute
          top 12px
          left 70px
          font-size 12px
          color white
        .lastmessage
          position absolute
          left 70px
          bottom 12px
          font-size 12px
        .lastmessagetime
          font-size 12px
          float right
          margin-right 16px
          margin-top 12px
          color #999999
        .selectitem
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
