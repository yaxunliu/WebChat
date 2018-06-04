<!-- 专家端 -->
<template>
  <div id="expert-warapper">
    <div class="header"><a href="#" @click="selectLeft" :class="router === 0 ? 'left left-select' : 'left'">消费记录</a><a href="#" @click="selectRight" :class="router === 1 ? 'right right-select' : 'right'">聊天记录</a></div>
    <div v-if="router == 0 && payinfo">
      <!-- 消费详情总览 -->
      <div class="custom-total">
        <!-- 备注 -->
        <div class="remarks">备注: <input :readonly="!canEdit" ref="remarkEdit"  @input="_editNewRemark" @blur="loseBlur" :value="payinfo.remark" class="remarkedit"><a class="edit-btn" href="#" v-text="canEdit ? '完成' : '[编辑]'" @click="_edit"></a>
        </div>
        <!-- 加入黑名单 -->
        <div class="blackList"><a href="#">[加入黑名单]</a></div>
        <!-- 消费总计 -->
        <div class="custom-content">
          <div>我的订阅 消费: <span class="redContent">{{payinfo.sub_line.total}} 积分</span> 剩余天数: <span class="redContent">{{payinfo.sub_line.valid_days}}</span></div>
          <div>私人订制 消费: <span class="redContent">{{payinfo.dingzhi_line.total}} 积分</span> 剩余天数: <span class="redContent">{{payinfo.dingzhi_line.valid_days}}</span></div>
          <div>投资报告 消费: <span class="redContent">{{payinfo.baogao_total}} 积分</span></div>
          <div>诊股问答 消费: <span class="redContent">{{payinfo.ask_total}} 积分</span> </div>
          <div>购买FM 消费: <span class="redContent">{{payinfo.fm_total}} 积分</span> </div>
          <div>总消费金额: <span class="redContent">{{payinfo.dingzhi_line.total}} 积分</span> </div>
          <div>总退款金额: <span class="redContent">{{payinfo.tuikuan}} 积分</span></div>
        </div>
      </div>
      <!-- 消费详情 -->
      <div class="custom-detail">
        <div class="nav">
          <a href="#" :class="selectNav === 0 ? 'nav-item select-nav' : 'nav-item'" @click="_clicknav(0)">我的订阅</a>
          <a href="#" :class="selectNav === 1 ? 'nav-item select-nav' : 'nav-item'" @click="_clicknav(1)">私人订制</a>
          <a href="#" :class="selectNav === 2 ? 'nav-item select-nav' : 'nav-item'" @click="_clicknav(2)">投资报告</a>
          <a href="#" :class="selectNav === 3 ? 'nav-item select-nav' : 'nav-item'" @click="_clicknav(3)">诊股问答</a>
          <a href="#" :class="selectNav === 4 ? 'nav-item select-nav' : 'nav-item'" @click="_clicknav(4)">购买FM</a>
        </div>
        <div class="detail-content">
          <div>
            <div class="detail-header">
              <div>开始时间</div>
              <div>订阅天数</div>
              <div>消费金额</div>
              <div>有效时间</div>
              <div>剩余天数</div>
            </div>
            <ul class="custom-detail-warapper" v-if="customlist">
              <li class="single-custom-detail" :key="item.ctime" v-for="item in customlist">
                <div class="begin-time">{{item.ctime}}</div>
                <div class="sub-days">{{item.subDays}}</div>
                <div class="custom-money">{{item.total}}</div>
                <div class="invaild-time">{{item.end_time}}</div>
                <div class="last-days">{{item.lastDays}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="router == 1" class="chathistory">
      <userHistory hiddenHeader="1" :chatObj="chatObj" :loginInfo="loginInfo"></userHistory>
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
      'router': 0,
      'canEdit': false,
      'newRemark': null,
      'payinfo': null,
      'customlist': null, // 消费清单列表
      'selectNav': 0, // 我的订阅 0 私人订制 1...
      'totalCustom': [],
      'chatObj': null,
      'loginInfo': null
    }
  },
  mounted () {
    this.chatObj = this.$attrs.chatObj
    console.log('this.chatObj', this.chatObj)
    this.loginInfo = this.$attrs.loginInfo
    this._reloadPayInfo()
  },
  methods: {
    _reloadPayInfo () {
      jsonp('/priapi1/get_user_pay_info', {'user_id': this.chatObj.id}).then((res) => {
        if (res.remark === '' || !res.remark) { res.remark = '暂无' }
        if (res.sub_line.valid_days < 0) {
          res.sub_line.valid_days = '已过期'
        } else {
          res.sub_line.valid_days += '天'
        }

        if (res.dingzhi_line.valid_days < 0) {
          res.dingzhi_line.valid_days = '已过期'
        } else {
          res.dingzhi_line.valid_days += '天'
        }
        if (!res.baogao_total) { res.baogao_total = 0 }
        if (!res.tuikuan) { res.tuikuan = 0 }
        if (!res.ask_total) { res.ask_total = 0 }
        this.payinfo = res
        this.payinfo.sub_list.map((ele) => {
          let days = (new Date(ele.end_time).getTime() - new Date(ele.ctime).getTime()) / (24 * 60 * 60 * 1000)
          let lastDays = Math.round((new Date(ele.end_time).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))
          ele.subDays = Math.round(days)
          ele.lastDays = lastDays < 0 ? 0 : lastDays
        })
        this.payinfo.dingzhi_list.map((ele) => {
          let days = (new Date(ele.end_time).getTime() - new Date(ele.ctime).getTime()) / (24 * 60 * 60 * 1000)
          let lastDays = Math.round((new Date(ele.end_time).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))
          ele.subDays = Math.round(days)
          ele.lastDays = lastDays < 0 ? 0 : lastDays
        })
        this.payinfo.baogao_list.map((ele) => {
          ele.subDays = ''
          ele.lastDays = ''
        })
        this.payinfo.ask_list.map((ele) => {
          let days = (new Date(ele.end_time).getTime() - new Date(ele.ctime).getTime()) / (24 * 60 * 60 * 1000)
          let lastDays = Math.round((new Date(ele.end_time).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))
          ele.subDays = Math.round(days)
          ele.lastDays = lastDays < 0 ? 0 : lastDays
        })
        this.payinfo.fm_list.map((ele) => {
          let days = (new Date(ele.end_time).getTime() - new Date(ele.ctime).getTime()) / (24 * 60 * 60 * 1000)
          let lastDays = Math.round((new Date(ele.end_time).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))
          ele.subDays = Math.round(days)
          ele.lastDays = lastDays < 0 ? 0 : lastDays
        })
        this.totalCustom = [this.payinfo.sub_list, this.payinfo.dingzhi_list, this.payinfo.baogao_list, this.payinfo.ask_list, this.payinfo.fm_list]
        this.customlist = this.payinfo.sub_list
      }).catch((err) => {
        console.log('err', err)
      })
    },
    selectRight () {
      this.router = 1
    },
    selectLeft () {
      this.router = 0
    },
    _editNewRemark (ele) {
      this.newRemark = ele.target.value
    },
    loseBlur () {
      // this.$refs.remarkEdit.focus()
    },
    _edit () {
      this.canEdit = !this.canEdit
      if (this.canEdit) {
        this.$refs.remarkEdit.focus()
        return 0
      }
      if (this.newRemark === this.payinfo.remark || !this.newRemark) { return 0 }
      jsonp('/sixin/update_remark', {'user_id': this.chatObj.id, 'remark': this.newRemark}).then((res) => {
        this.payinfo.remark = this.newRemark
        this.newRemark = null
        alert('修改成功')
      }).catch((err) => {
        alert('修改失败')
        console.log('err', err)
      })
    },
    _clicknav (index) {
      if (this.selectNav === index) { return }
      this.selectNav = index
      this.customlist = this.totalCustom[index]
    }
  }
}
</script>
<style lang='stylus' scoped>
#expert-warapper
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
      background url('../../../assets/images/wallter_normal.png') no-repeat 15%||50%
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
      background url('../../../assets/images/wallter_select.png') no-repeat 15%||50%
      color #3091f2
    .right-select
      background url('../../../assets/images/chat_select.png') no-repeat 20%||50%
      color #3091f2
  .custom-total
    width 313px
    margin-left 20px
    font-size 15px
    border-bottom #b6b6b6 dashed 2px
    height 255px
    line-height 28px
    color #9a9a9a
    .remarks
      width 100%
      .remarkedit
        border none
      .edit-btn
        text-decoration none
        color #3091f2
    .blackList
      width 100%
      a
        color #3091f2
        text-decoration none
    .custom-content
      width 100%
      .redContent
        color red
  // 消费明细
  .custom-detail
    height 410px
    width 313px
    margin 0 20px
    .nav
      height 46px
      width 100%
      display flex
      flex-direction row
      justify-content space-around
      align-items center
      a
        font-size 12px
        color #999
        text-decoration none
      .select-nav
        color #3091f2
        font-size 15px
    .detail-content
      height 364px
      width 100%
      .detail-header
        display flex
        flex-direction row
        justify-content flex-start
        height 64px
        width 100%
        div
          background-color #328aa4
          color white
          height 63px
          width 46px
          margin-left 1px
          box-sizing border-box
          text-align center
          padding-top 10px
          line-height 20px
          font-size 16px
        div:nth-child(1)
          line-height 63px
          width 86px
          padding-top 0
        div:nth-child(4)
          padding-top 0
          line-height 63px
          width 86px
      .custom-detail-warapper
        overflow auto
        width 100%
        height 282px
        .single-custom-detail
          display flex
          flex-direction row
          height 64px
          margin-top 1px
          font-size 12px
          text-align center
          div
            width 46px
            background-color #e5f1f4
            color black
            margin-left 1px
            line-height 63px
          .begin-time
            width 86px
            line-height 13px
            padding-top 20px
          .invaild-time
            width 86px
            line-height 13px
            padding-top 20px
</style>
