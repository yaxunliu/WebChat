<!-- 联系人cell -->
<template>
  <li v-if="contacterinfo" :class="_exchangeSelectCls()" @click="_clickContactCell()">
    <img :src="contacterinfo.head_img">
    <span  v-if="contacterinfo.newtip && !contacterinfo.select" id="tip"></span>
    <span class="nick">{{contacterinfo.nick}}</span>
    <span class="lastmessage">{{contacterinfo.lastMessage}}</span>
    <span class="lastmessagetime">{{contacterinfo.lastTime}}</span>
  </li>
</template>

<script>
export default {
  data () {
    return {
      'contacterinfo': null
    }
  },
  mounted () {
    this.contacterinfo = this.$attrs.item
  },
  methods: {
    _exchangeSelectCls () {
      return this.contacterinfo.select ? 'contact-cell' + ' ' + 'select-contact-cell' : 'contact-cell'
    },
    _clickContactCell () {
      typeof this.$attrs.clickContactCell === 'function' && this.$attrs.clickContactCell(this.contacterinfo)
    }
  }
}
</script>

<style lang='stylus' scoped>
.contact-cell
  border-top 1px solid #333
  height 60px
  width 100%
  position relative
  color #999
  #tip
    background-color red
    width 6px
    height 6px
    border-radius 3px
    position absolute
    left 57px
    top 7px
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
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    width 80px
  .lastmessage
    position absolute
    left 70px
    bottom 12px
    font-size 12px
    overflow hidden
    width 147px
    max-height 12px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  .lastmessagetime
    font-size 12px
    float right
    margin-right 16px
    margin-top 12px
    color #999999
.select-contact-cell
  color white
  background-color #3b3b3b
  .lastmessage
    color white
</style>
