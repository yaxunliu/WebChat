<!-- 移动用户 /sixin/move_user_to_group
import { jsonp } from '../../../common/fetch';
-->
<template>
  <div class="move-warapper">
    <div class="move-plane">
      <div class="move-title">
        <a href="#" class="close-btn" @click="_closeMoveUser"><img src="../../../assets/images/delete.png"></a><span class="title-label">移动用户至分组</span>
      </div>
      <div class="move-content">
        <div class="left">
          <div class="left-title">选择要移动的分组</div>
          <div class="move-groups">
            <div v-for="group in groups" :key="group.id" class="move-group-warapper">
              <div class="group-header">
                <a href="#" class="checkbox"><img :src="group.select ? require('../../../assets/images/checkbox_select.png') : require('../../../assets/images/checkbox_unselect.png')" @click="_selectMoveGroupCheckbox(group)"></a>
                <span class="move-group-nick">{{group.name}}</span>
              </div>
              <ul v-if="group.select" class="users-warapper">
                <li v-for="user in group.data" :key="user.id" class="user-warapper">
                  <a href="#" class="user-checkbox"><img :src="user.select ? require('../../../assets/images/checkbox_select.png') : require('../../../assets/images/checkbox_unselect.png')" @click="_selectMoveGroupUserCheckbox(user)"></a>
                  <div class="move-user-nick">{{user.name}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="right-title">选择要移入的分组</div>
          <div v-if="toGroups && toGroups.length !== 0" v-for="group in toGroups" :key="group.id" class="to-groups-warapper">
            <div class="to-group-header">
                <a href="#" class="to-checkbox"><img :src="group.toSelect ? require('../../../assets/images/checkbox_select.png') : require('../../../assets/images/checkbox_unselect.png')" @click="_selectToGroupCheckbox(group)"></a>
                <span class="to-group-nick">{{group.name}}</span>
            </div>
          </div>
          <div v-if="!toGroups || toGroups.length === 0" class="placeholder">
            <img src="../../../assets/images/placeholder.png">
            <p>没有可移入的分组</p>
          </div>
        </div>
      </div>
      <div class="move-footer">
        <a href="#" class="certain-btn" @click="_moveUser">确定</a>
      </div>
    </div>
  </div>
</template>

<script>
import {jsonp} from '../../../common/fetch.js'

export default {
  data () {
    return {
      'groups': [ ], // 所有的分组
      'selectGroup': null, // 当前选择准备移动的用户分组
      'toGroups': null, // 可以移入的全部分组
      'selectToGroups': [ ] // 选中的移入分组列表
    }
  },
  mounted () {
    this.$attrs.usergroups !== undefined && this._reloadGroups(this.$attrs.usergroups)
  },
  methods: {
    _closeMoveUser () {
      typeof this.$attrs.closeMoveUser === 'function' && this.$attrs.closeMoveUser(false)
    },
    _reloadGroups (value) {
      if (value === null) { return null }
      let moveGrouplist = []
      value.map((group) => {
        let users = {'name': group.name, 'select': false, 'toSelect': false, 'id': group.group_id}
        let userArr = []
        typeof group.data.map === 'function' && group.data.map((groupuser) => {
          let user = {'id': groupuser.id, 'select': true, 'name': groupuser.nick}
          userArr.push(user)
        })
        users.data = userArr
        moveGrouplist.push(users)
      })
      this.groups = moveGrouplist
      this.toGroups = moveGrouplist.filter((group) => {
        if (group.id === undefined || group.id === -1) { return false }
        return true
      })
    },
    _selectMoveGroupCheckbox (group) {
      if (group === this.selectGroup) { return 0 }
      if (this.selectGroup) {
        this.selectGroup.select = false
      }
      group.select = !group.select
      if (group.select) {
        this.selectGroup = group
        this.toGroups = this.groups.filter((ele) => {
          ele.toSelect = false
          if (ele.id === undefined || ele.id === -1) { return false }
          if (ele === this.selectGroup) { return false }
          return true
        })
        this.selectToGroups = []
      }
    },
    _selectMoveGroupUserCheckbox (user) {
      user.select = !user.select
    },
    _selectToGroupCheckbox (group) {
      group.toSelect = !group.toSelect
      if (group.toSelect) {
        this.selectToGroups.push(group)
      } else {
        let index = this.selectToGroups.indexOf(group)
        this.selectToGroups = this.selectToGroups.slice(index, 1)
      }
    },
    _moveUser () {
      let selectUsers = this.selectGroup.data.filter((ele) => {
        return ele.select
      })
      if (this.selectGroup === null) {
        alert('请选择要移动的用户名单')
        return 0
      } else if (selectUsers.length === 0) {
        alert('当前分组下没有用户')
      } else if (this.selectToGroups.length === 0) {
        alert('请选择要移入的分组')
        return 0
      }
      let groupids = null
      if (this.selectToGroups.length === 1) {
        groupids = this.selectToGroups[0].id
      } else {
        groupids = this.selectToGroups.reduce((last, cur) => {
          return last.id + ',' + cur.id
        })
      }
      let uids = null
      let users = this.selectGroup.data.filter((group) => {
        return group.select
      })
      if (users.length === 1) {
        uids = users[0].id
      } else {
        uids = users.reduce((last, cur) => {
          return last.id + ',' + cur.id
        })
      }
      jsonp('/sixin/move_user_to_group', {'groupid': groupids, 'user_id': uids}).then((res) => {
        alert('移动成功')
        this._closeMoveUser()
      }).catch((err) => {
        alert('移动失败')
        console.log('err', err)
      })
    }
  }
}
</script>
<style lang='stylus' scoped>
.move-warapper
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
  .move-plane
    width 600px
    height 526px
    background-color white
    border-radius 6px
    .move-title
      height 46px
      width 100%
      border-bottom #d9d9d9 solid 1px
      .close-btn
        float right
        width 46px
        height 46px
        img
          display block
          margin-left 15px
          margin-top 15px
      .title-label
        width 80%
        margin-left 10%
        display inline-block
        text-align center
        line-height 46px
        img
          width 16px
          height 16px
    .move-content
      width 100%
      height 395px
      display flex
      flex-direction row
      padding-top 14px
      box-sizing border-box
      .left
        color #9a9a9a
        width 50%
        height 100%
        border-right #d9d9d9 solid 1px
        padding-left 30px
        padding-right 30px
        box-sizing border-box
        overflow auto
        .left-title
          height 16px
          width 100%
          text-align center
          color #2991ee
          font-size 16px
        .move-groups
          margin-top 20px
          height 345px
          .move-group-warapper
            width 100%
            .group-header
              height 50px
              width 100%
              position relative
              border-bottom #f4f4f4 solid 1px
            .checkbox
              display inline-block
              width 30px
              height 30px
              margin-top 10px
              font-size 0
              img
                display block
                margin-left 7px
                margin-top 7px
            .move-group-nick
              position absolute
              line-height 50px
              margin-left 10px
            .users-warapper
              width 100%
              .user-warapper
                width 100%
                padding-left 20px
                box-sizing border-box
                height 50px
                position relative
                border-bottom #f4f4f4 solid 1px
                .user-checkbox
                  display inline-block
                  width 30px
                  height 30px
                  margin-top 10px
                  img
                    display block
                    margin-left 7px
                    margin-top 7px
                .move-user-nick
                  display inline-block
                  position absolute
                  line-height 50px
      .right
        width 50%
        height 100%
        border-left #d9d9d9 solid 1px
        padding-right 30px
        box-sizing border-box
        overflow auto
        padding 0 30px
        .right-title
          width 100%
          height 16px
          text-align center
          color red
          font-size 16px
          padding-bottom 20px
        .placeholder
          height 345px
          display flex
          flex-direction column
          justify-content center
          align-items center
          img
            margin-bottom 40px
          p
            color #b4b4b4
        .to-groups-warapper
          height 50px
          .to-group-header
            height 50px
            width 100%
            position relative
            border-bottom #f4f4f4 solid 1px
            .to-checkbox
              display inline-block
              width 30px
              height 30px
              margin-top 10px
              font-size 0
              img
                display block
                margin-left 7px
                margin-top 7px
            .to-group-nick
              position absolute
              line-height 50px
              margin-left 10px
    .move-footer
      height 85px
      width 100%
      .certain-btn
        width 36%
        display inline-block
        background-color #2991ee
        height 40px
        text-align center
        text-decoration none
        color white
        border-radius 6px
        line-height 40px
        margin-top 26px
        margin-left 30%
</style>
