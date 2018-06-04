<!-- header 组件 -->
<template>
  <a v-if="!groupSend" href="#" class="groupname" @click="_clickGroupItem"><img src="../../../assets/images/arrow.png" :style="group.show ? 'transform:rotate(90deg)' : ''">{{group.name}}<span v-if="group.newtips" class="newtip"></span></a>
  <a v-else href="#" class="groupname" @click="_clickGroupItem"><img :src="group.groupSelect ? require('../../../assets/images/checkbox_select.png') : require('../../../assets/images/checkbox_unselect.png')" :style="group.show ? 'transform:rotate(90deg)' : ''">{{group.name}}<span v-if="group.newtips" class="newtip"></span></a>
</template>

<script>
export default {
  data () {
    return {
      'groupSend': false, // 是否是群发
      'groupModel': null // 群组header的模型
    }
  },
  props: ['group', 'groupSendModel', 'selectGroup'],
  watch: {
    groupSendModel (val) {
      this.groupSend = val
    }
  },
  methods: {
    _clickGroupItem () {
      if (!this.groupSend) {
        this.group.show = !this.group.show
        return
      }
      this.group.groupSelect = !this.group.groupSelect
      this.group.show = this.group.groupSelect
      this.group.data.map((subitem) => {
        subitem.groupSelect = this.group.groupSelect
      })
      typeof this.selectGroup === 'function' && this.selectGroup(this.group)
    }
  }
}
</script>
<style lang='stylus' scoped>
.groupname
  display inline-block
  width 100%
  height 40px
  line-height 40px
  font-size 14px
  padding-left 40px
  text-decoration none
  box-sizing border-box
  color white
  img
    width 10px
    height 10px
    position absolute
    left 16px
    top 15px
  .newtip
    position absolute
    width 6px
    height 6px
    margin-top 27px
    border-radius 3px
    background-color red
</style>
