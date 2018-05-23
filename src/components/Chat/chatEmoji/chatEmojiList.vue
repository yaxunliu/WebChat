<!-- emoji list -->
<template>
  <div class='emojilist'>
    <div>
      <ul  v-if="selectitem !== null" :class="_bindemojiWarapperCls()">
        <li v-for="(item, index) in selectitem.list" :key="index">
          <a  :title="item.title" v-if="selectitem.type === 'png'" :class="_bindemojicls(item,'emoji-warapper')" href="#" @mousemove="_mouseMoveInto(item)" @mouseout="_mousemoveout(item)"><img :src="_bindEmoji(item.img)" @click="_selectEmoji(item)"></a>
          <a v-else href="#" :class="_bindemojicls(item,'gifemoji-warapper')" @mousemove="_mouseMoveInto(item)" @mouseout="_mousemoveout(item)"><img :src="_bindEmoji(item.img)" @click="_selectGifEmoji(item)"></a>
        </li>
      </ul>
    </div>
    <ul class="icon_control">
      <li v-for="item in emojilist" :key="item.icon">
        <a :class="_bindClass(item)" @click="_selectIcon(item)" href="#"><img :src="_bindIcon(item.icon)"></a>
      </li>
    </ul>
  </div>
</template>

<script>
import emojiJson from '../../../assets/images/emoji.json'

export default {
  data () {
    return {
      'emojilist': null,
      'emojipath': '/static/emjoy/',
      'iconpath': '/static/icon/',
      'selectitem': null
    }
  },
  mounted () {
    for (let key in emojiJson) {
      if (key === '0') {
        emojiJson[key].selected = true
        this.selectitem = emojiJson[key]
      } else {
        emojiJson[key].selected = false
      }
    }
    this.emojilist = emojiJson
  },
  methods: {
    _bindemojiWarapperCls () {
      if (this.selectitem.type === 'gif') {
        return 'gif_emoji_content'
      }
      return 'emoji_content'
    },
    _bindemojicls (item, basecls) {
      if (item.mousemove === false) {
        return basecls
      }
      return basecls + ' ' + 'emoji-warapper-select'
    },
    _bindIcon (iconname) {
      let path = this.iconpath + iconname
      return path
    },
    _bindEmoji (emojiname) {
      let path = this.emojipath + emojiname
      return path
    },
    _bindClass (item) {
      let clsname = null
      if (item.selected) {
        clsname = 'icon_category_select'
      }
      if (clsname === null) {
        return 'icon_category'
      }
      return 'icon_category' + ' ' + clsname
    },
    _selectIcon (clickitem) {
      if (clickitem === this.selectitem) {
        return
      }
      clickitem.selected = true
      this.selectitem.selected = false
      this.selectitem = clickitem
    },
    _mouseMoveInto (item) {
      item.mousemove = true
    },
    _mousemoveout (item) {
      item.mousemove = false
    },
    _selectGifEmoji (gifitem) {
      gifitem.mousemove = false
      typeof this.$attrs.selectEmoji === 'function' && this.$attrs.selectEmoji(true, gifitem)
    },
    _selectEmoji (emojiitem) {
      emojiitem.mousemove = false
      typeof this.$attrs.selectEmoji === 'function' && this.$attrs.selectEmoji(false, emojiitem)
    }
  }
}
</script>
<style lang='stylus' scoped>
@import '../../../css/mixin.styl'
// 通用样式
.emoji-warapper-select
  background-color #f5f5f5
.emojilist
  height 440px
  width 440px
  background-color #ffffff
  bottomarrowbubble(-20px,190px,10px,#ffffff)
  box-shadow 0 0 10px 2px #b6b6b6
  border 1px solid #B6B6B6
  border-radius 4px
  position relative
  .emoji_content
    height 395px
    width 100%
    padding-left 10px
    padding-top 20px
    display flex
    flex-flow: column wrap
    .emoji-warapper
      display inline-block
      width 42px
      height 42px
      border-radius 4px
      overflow auto
      img
        display block
        width 30px
        height 30px
        margin 6px 6px
  .gif_emoji_content
    height 395px
    width 100%
    padding-left 10px
    padding-top 20px
    display flex
    flex-flow: row wrap
    .gifemoji-warapper
      display inline-block
      width 120px
      border-radius 6px
      overflow auto
      margin-left 20px
      img
        width 100%
  .gif_emoji_select
      background-color #f1f1f1
  .icon_control
    display flex
    flex-direction row
    position absolute
    bottom 0
    left 0
    width 100%
    height 50px
    border-top 1px solid #e2e2e2
    .icon_category
      width 47px
      height 40px
      margin 5px
      border-radius 4px
      display inline-block
      background-color white
      img
        display inline
        width 20px
        height 20px
        margin 10px 13.5px
    .icon_category_select
      background-color #f1f1f1
</style>
