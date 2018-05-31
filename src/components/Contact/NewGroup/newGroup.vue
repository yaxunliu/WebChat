<!-- 创建分组 "/sixin/create_group?token=<?=$token;?>
             "/sixin/edit_del_group?token=<?=$token;?>
             "/sixin/userlist?token=<?=$token;?>
             "/sixin/del_user?token=<?=$token;?>
-->
<template>
  <div class="group" @click="_clickSpaceArea">
    <div class="group-enter" @click.stop="_clickInputArea">
      <div class="title">创建分组</div>
      <div class="bottom">
        <input type="text" ref="geoupName" placeholder="请输入要创建分组的名称">
        <a href="#" @click.stop="_createNewGroup" class="certainButton">确定</a>
      </div>
    </div>
  </div>
</template>

<script>
import { jsonp } from '../../../common/fetch.js'

export default {
  methods: {
    _clickInputArea () {
      console.log('点击了input区域')
    },
    _clickSpaceArea () {
      // 阻止事件冒泡
      typeof this.$attrs.createGroupSuccess === 'function' && this.$attrs.createGroupSuccess(false)
    },
    _createNewGroup () {
      let groupName = this.$refs.geoupName.value
      let str = groupName.replace(/\s+/g, '')
      str === '' && alert('请输入新的分组名称!')
      str !== '' && jsonp('/sixin/create_group_action', {'groupname': groupName}).then((res) => {
        typeof this.$attrs.createGroupSuccess === 'function' && this.$attrs.createGroupSuccess(true)
      }).catch((err) => {
        if (err.err_info) {
          alert(err.err_info)
        }
      })
    }
  }
}
</script>
<style lang='stylus' scoped>
.group
  z-index 1000
  position fixed
  background-color rgba(#000, 0.5)
  top 0
  left 0
  right 0
  bottom 0
  display flex
  justify-content center
  align-items center
  .group-enter
    width 371px
    height 208px
    background-color white
    border-radius 10px
    .title
      height 46px
      line-height 46px
      text-align center
      border-bottom #eaeaea solid 1px
    .bottom
      background-color white
      input
        height 38px
        width 80%
        box-sizing border-box
        margin-top 30px
        margin-left 10%
        font-size 16px
        padding-left 10px
      input::-webkit-input-placeholder
        color #ddd
      input::-moz-placeholder
        color #ddd
      input:-ms-input-placeholder
        color #ddd
      .certainButton
        height 44px
        display block
        margin-top 20px
        width 80%
        height 40px
        color white
        background-color #2991ee
        border-radius 4px
        text-align center
        line-height 40px
        margin-left 10%
        font-size 16px
        text-decoration none
</style>
