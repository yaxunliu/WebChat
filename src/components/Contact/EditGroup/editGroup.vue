<!-- 编辑与删除分组 /sixin/edit_action?groupname=xx&groupid=xx //修改分组名称 /sixin/del_group?groupid=xx // 提示用户慎重操作 /sixin/del_group_action?group_action=xx // 删除操作
/sixin/del_user_action?token=xx&userlist=user_id,user_id,user_id&grouplist=group_id
 -->
<template>
  <div class="edit-area">
    <div class="wrapper">
      <div class="title">
        <span class="label">编辑</span>
        <span class="close"><a href="#" @click="clickClose"><img src="../../../assets/images/delete.png"></a></span>
      </div>
      <div  v-if="editlist" class="editlist">
        <div v-for="editem in editlist" class="group-edit-warapper" :key="editem.name">
          <div class="header">
            <a href="#" class="checkbox" @click="_selectGroup(editem)"><img :src="_bindSelectSrc(editem)"></a>
            <input type="text" :value="editem.name" class="name" v-focus="editem.canEdit" :disabled="!editem.canEdit" @input="_begainEdit" @blur="inputBlur(editem)">
            <a href="#" class="editbtn" @click="_editGroup(editem)" v-html="editem.canEdit? '完成编辑' : '编辑'" :style="_bindEditBtnStyle(editem)"></a>
          </div>
          <div v-if="editem.select && editem.data.length" class="group-user-warapper">
            <div v-for="subitem in editem.data" :key="subitem.nick" class="user-warapper" @click="_selectUser(subitem)"><a href="#" class="user-check"><img :src="subitem.select ? require('../../../assets/images/checkbox_select.png') : require('../../../assets/images/checkbox_unselect.png')"></a><span class="user-nick">{{subitem.nick}}</span></div>
          </div>
        </div>
      </div>
      <div class="del">
        <a href="#" class="delbtn" @click="_delSelectGroups">删除</a>
      </div>
    </div>
  </div>
</template>

<script>
import { jsonp } from '../../../common/fetch.js'

export default {
  data () {
    return {
      'editlist': null,
      'lastfocus': null,
      'editName': null,
      'selectGroup': null
    }
  },
  mounted () {
    console.log('this.$attrs.datalist', this.$attrs)
    this.$attrs.datalist !== undefined && this.reloadDatalist(this.$attrs.datalist)
  },
  directives: {
    focus: {
      update: function (el, {value}) {
        if (value) {
          console.log('el.value', el.value)
          el.focus()
        }
      }
    }
  },
  methods: {
    reloadDatalist (value) {
      if (value === null) { return 0 }
      let list = []
      typeof value.map === 'function' && value.map((element) => {
        let item = {}
        item.name = element.name
        item.id = element.group_id
        let data = []
        element.data.forEach((subitem) => {
          let user = {'nick': subitem.nick, 'select': false, 'id': subitem.id}
          data.push(user)
        })
        item.data = data
        item.select = false
        item.canEdit = false
        item.data.length && item.data.map((user) => {
          user.select = true
        })
        list.push(item)
      })
      this.editlist = list
    },
    _bindEditBtnStyle (editem) {
      if ((editem.id === undefined || editem.id === -1)) {
        return {color: '#bfbfbf'}
      }
      return {color: '#3793ef'}
    },
    _bindSelectSrc (item) {
      if (item.id === -1 || item.id === undefined) {
        console.log('forbiden=> item', item)
        return require('../../../assets/images/forbiden-select.png')
      }
      return item.select ? require('../../../assets/images/checkbox_select.png') : require('../../../assets/images/checkbox_unselect.png')
    },
    _delSelectGroups () {
      if (this.selectGroup === null) { // 没有选择分组
        alert('你还没有选择分组')
      } else if (this.selectGroup.id === undefined) { // 系统定义分组无法删除
        alert('系统分组无法删除')
      } else if (this.selectGroup.data.length === 0) { // 删除分组 (黑名单分组和非黑名单分组)
        if (this.selectGroup.id === -1) {
          alert('黑名单分组无法删除')
          return
        }
        jsonp('/sixin/del_group_action', {'groupid': this.selectGroup.id}).then((res) => {
          let groups = this.editlist.filter((group) => {
            return group !== this.selectGroup
          })
          this.selectGroup = null
          this.editlist = groups
          alert('删除成功')
        }).catch((err) => {
          alert('删除失败')
          console.log('错误', err)
        })
      } else if (this.selectGroup.data.length > 0) { // 删除分组内被选中用户
        if (this.selectGroup.id === -1 || this.selectGroup.id === undefined) {
          alert('系统分组用户暂时不可以删除')
          return
        }
        let delUsers = this.selectGroup.data.filter((user) => {
          return user.select === true
        })
        let ids = null
        if (delUsers.length === 1) {
          ids = delUsers[0].id
        } else {
          ids = delUsers.reduce((lastuser, user) => {
            console.log('lastuser', lastuser, 'user', user)
            return lastuser.id + ',' + user.id
          })
        }
        jsonp('/sixin/del_user_action', {'userlist': ids, 'grouplist': this.selectGroup.id}).then((res) => {
          let delAll = delUsers.length === this.selectGroup.data.length
          if (!delAll) { // 删除全部用户
            let lastUsers = this.selectGroup.data.filter((user) => {
              return !delUsers.indexOf(user)
            })
            this.selectGroup.data = lastUsers
          } else {
            this.selectGroup.data = []
          }
          alert('删除成功')
          console.log('after this.selectGroup.data', this.selectGroup.data)
        }).catch((err) => {
          console.log('err', err)
          alert('删除错误')
        })
      }
    },
    inputBlur (item) {
      // 完成编辑
      item.canEdit = false
      // 判断当前的编辑完成的标题是否和之前的一样
      console.log('this.editName', this.editName)
      console.log('item.name', item, item.name)
      if (this.editName === item.name || !this.editName) {
        alert('组名没有更换')
      } else {
        jsonp('/sixin/edit_action', {groupname: this.editName, groupid: item.id}).then((res) => {
          item.name = this.editName
          this.editName = null
          alert('修改成功')
        }).catch((err) => {
          (err.err_info !== null && alert(err.err_info)) && alert('修改失败')
        })
      }
    },
    clickClose () {
      typeof this.$attrs.closeEdit === 'function' && this.$attrs.closeEdit(false, true)
    },
    _selectGroup (item) {
      if (item.id === -1 || item.id === undefined) { return }
      if (this.selectGroup !== null) {
        this.selectGroup.select = false
      }
      item.select = !item.select
      this.selectGroup = item
      console.log('this.selectGroup', this.selectGroup)
    },
    _selectUser (user) {
      user.select = !user.select
    },
    _editGroup (item) {
      if (item.id === undefined || item.id === -1) { return }
      if (this.lastfocus !== null && !item.canEdit) {
        this.lastfocus.canEdit = false
      }
      if (item.canEdit) { // 点击完成编辑
        console.log('点击完成编辑')
      }
      item.canEdit = !item.canEdit
      this.lastfocus = item
    },
    _begainEdit (text) {
      this.editName = text.target.value
    }
  }
}
</script>
<style lang='stylus' scoped>
@import '../../../css/mixin.styl'
.edit-area
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
  .wrapper
    background-color white
    width 371px
    height 528px
    border-radius 6px
    .title
      text-align center
      line-height 46px
      height 46px
      display inline-block
      width 100%
      border-bottom #e5e5e5 solid 1px
      .label
        margin-left 48px
        line-height 46px
      .close
        float right
        width 32px
        height 46px
        margin-right 16px
    .editlist
      height 410px
      box-sizing border-box
      border-bottom #e5e5e5 solid 1px
      overflow auto
      .group-edit-warapper
        width 90%
        margin-left 5%
        border-bottom #e5e5e5 solid 1px
        .header
          line-height 46px
          height 46px
          width 100%
          .checkbox
            width 16px
            height 16px
          .name
            margin-left 10px
            font-size 15px
            width 200px
            border none
            padding-top 10px
            padding-bottom 10px
            display inline-block
          .editbtn
            float right
            margin-right 10px
            text-decoration none
            color #3793ef
            font-size 15px
      .group-user-warapper
        min-height 40px
        padding-left 24px
        border-top #e5e5e5 solid 1px
        font-size 0px
        .user-warapper
          display flex
          flex-direction row
          justify-content flex-start
          align-items center
          height 40px
          border-bottom #e5e5e5 solid 1px
          .user-check
            width 16px
            height 16px
            img
              width 16px
              height 16px
          .user-nick
            margin-left 10px
            font-size 12px
        .user-warapper:last-child
          border-bottom none
    .group-edit-warapper:last-child
      border-bottom none
    .del
      height 72px
      .delbtn
        display inline-block
        width 74%
        border-radius 6px
        line-height 40px
        text-align center
        color white
        height 40px
        margin-left 13%
        margin-top 16px
        background-color #3793ef
        text-decoration none
</style>
