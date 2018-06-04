<!-- 小秘书显示面板 // /sixin/update_remake user_id  remake-->
<template>
  <div class="customerPlane">
    <div class="header"><a href="#" @click="selectLeft" :class="router === 0 ? 'left left-select' : 'left'">设备与渠道</a><a href="#" @click="selectRight" :class="router === 1 ? 'right right-select' : 'right'">聊天记录</a></div>
    <div class="chathistory" v-if="router === 1">
      <userHistory hiddenHeader="1" :chatObj="chatObj" :loginInfo="loginInfo"></userHistory>
    </div>
    <div v-if="deviceInfo && router === 0" class="userdetail">
      <div class="remarks">备注: <input :readonly="!canEdit" ref="remarkEdit"  @input="_editNewRemark" @blur="loseBlur" :value="deviceInfo.remark" class="remarkedit">
        <a href="#" @click="_edit" class="edit-btn" ref="editBtn" v-text="canEdit ? '完成' : '[编辑]'"></a>
      </div>
      <div class="userid">用户ID: {{deviceInfo.user_id}}</div>
      <div class="push_channel">推送渠道: {{deviceInfo.channel.channel_name}}</div>
      <div class="push_channel_id">渠道user_id: {{deviceInfo.channel.channel_id}}</div>
      <div class="device_type">设备型号: {{deviceInfo.channel.device_model}}</div>
      <div class="phone_band">手机品牌: {{deviceInfo.phoneBrand}}</div>
      <div class="version">手机版本号: {{deviceInfo.channel.app_version}}</div>
      <div class="uniqueid">设备唯一ID: {{deviceInfo.channel.device_guid}}</div>
      <div class="sys">系统: {{deviceInfo.sysname}}</div>
    </div>
  </div>
</template>

<script>
import { jsonp } from '../../../common/fetch.js'
import userHistory from '../userHistory/userHistory'
export default {
  components: {
    userHistory
  },
  data () {
    return {
      'deviceInfo': null,
      'canEdit': false,
      'newRemark': null,
      'router': 0,
      'chatObj': null,
      'loginInfo': null
    }
  },
  mounted () {
    this.chatObj = this.$attrs.chatObj
    this.loginInfo = this.$attrs.loginInfo
    this._reloadDeviceInfo()
  },
  methods: {
    loseBlur () {
      this.$refs.remarkEdit.focus()
    },
    _edit () {
      this.canEdit = !this.canEdit
      if (this.canEdit) {
        this.$refs.remarkEdit.focus()
        return 0
      }
      if (this.newRemark === this.deviceInfo.remark || !this.newRemark) { return 0 }
      jsonp('/sixin/update_remark', {'user_id': this.chatObj.id, 'remark': this.newRemark}).then((res) => {
        this.deviceInfo.remark = this.newRemark
        this.newRemark = null
        alert('修改成功')
      }).catch((err) => {
        alert('修改失败')
        console.log('err', err)
      })
    },
    _editNewRemark (ele) {
      this.newRemark = ele.target.value
    },
    _reloadDeviceInfo () {
      jsonp('/pubapi1/get_user_channel', {'user_id': this.chatObj.id}).then((res) => {
        console.log('res', res)
        if (res.device_type === '3') {
          res.sysname = 'Android'
        } else if (res.device_type === '4') {
          res.sysname = 'iOS'
        } else {
          res.sysname = '未知系统: ' + res.device_type
        }
        res.phoneBrand = res.channel.mobile_brand === '' ? '暂时无此手机型号记录' : res.mobile_brand
        this.deviceInfo = res
        console.log('this.deviceInfo', this.deviceInfo)
      }).catch((err) => {
        console.log(err)
      })
    },
    selectRight () {
      this.router = 1
    },
    selectLeft () {
      this.router = 0
    }
  }
}
</script>
<style lang='stylus' scoped>
.customerPlane
  background-color white
  .header
    width 100%
    display flex
    justify-content flex-start
    align-items center
    height 65px
    text-align center
    .left
      width 50%
      text-decoration none
      height 28px
      line-height 28px
      box-sizing border-box
      color #d4d4d4
      border-right #e5e5e5 solid 1px
      background url('../../../assets/images/device_normal.png') no-repeat 15%||50%
      padding-left 5%
    .right
      text-decoration none
      width 50%
      line-height 28px
      box-sizing border-box
      display inline-block
      color #d4d4d4
      background url('../../../assets/images/chat_normal.png') no-repeat 20%||50%
      padding-left 5%
    .left-select
      background url('../../../assets/images/device_select.png') no-repeat 15%||50%
      color #3091f2
    .right-select
      background url('../../../assets/images/chat_select.png') no-repeat 20%||50%
      color #3091f2
  .chathistory
    background-color white
  .userdetail
    background-color white
    color #333
    padding-left 7%
    div
      font-size 15px
      line-height 35px
    .remarks
      width 100%
      .remarkedit
        border none
      .edit-btn
        text-decoration none
        color #3091f2
</style>
