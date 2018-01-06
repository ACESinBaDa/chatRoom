<template>
  <div class="myApp">
    <transition name="zoomout">
      <div class="coverWrap" v-if="nameOk">
        <div class="cover" ref="cover">
          <ul class="inputs">
            <li>
              <input type="text" v-model="userName" @focus="warning=''" placeholder="输入姓名">
              <p :class="{ 'fadeIn': !warning, 'fadeOut': warning }">
                {{ warning }}
              </p>
            </li>
            <li>
              <b @click="confirmName">确&nbsp;&nbsp;定</b>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <div class="chatBox">
      <div class="online">
        <h2>
          <i class="onlineIcon"></i>{{ userList ? userList.length : 0 }}人在线
        </h2>
        <ul class="chatCont" ref="chatCont">
          <li :class="{ 'others': item.type=='sendNewMessage' && item.userName!=userName, 'myText': item.type=='sendNewMessage' && item.userName==userName, 'system': (item.type=='newUser' || item.type=='deleUser') }" v-for="(item, index) in chatHis" :key="index">
            <div v-if="item.type=='sendNewMessage' && item.userName!=userName">
              <span class="head">{{ item.userName.slice(-1) }}</span>
              <div class="text">
                <p>{{ item.message }}</p>
              </div>
            </div>
            <div v-if="item.type=='sendNewMessage' && item.userName==userName">
              <div class="text">
                <p>{{ item.message }}</p>
              </div>
              <span class="head">{{ item.userName.slice(-1) }}</span>
            </div>
            <div v-if="item.type=='newUser'">
              <span>{{ item.userName }} 加入聊天室</span>
            </div>
            <div v-if="item.type=='deleUser'">
              <span>{{ item.userName }} 离开了聊天室</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="btns">
        <div class="inp">
          <input type="text" placeholder="说点什么" v-model="sayCont">
          <span class="disable" @click="sendMessage">发送</span>
        </div>
        <div class="other">
          <b class="colorIcon"></b>
          <b class="imgIcon imgButton">
            <label for="img">
              <input type="file" id="img" name="img" v-show="0">
            </label>
          </b>
          <b class="faceIcon" @click="showFace=!showFace"></b>
          <b class="moneyIcon"></b>
        </div>
      </div>
      <transition name="slideUp">
        <div class="faceBox" v-show="showFace">
          <ul>
            <li v-for="index in 68" :key="index">
              <img :src="faceSrc(index)" alt="face">
            </li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, 'http://10.0.0.42:8889')
export default {
  name: 'HelloWorld',
  data () {
    return {
      time: '',
      nameOk: true,
      userName: '',
      warning: '',
      sayCont: '',
      showFace: false,
      userList: [],
      chatHis: []
    }
  },
  // computed: {
  //   userList: {
  //     get () {
  //       let arr = this.appObj.userList
  //       return arr
  //     },
  //     set (val) {
  //       return val
  //     }
  //   },
  //   chatHis: {
  //     get () {
  //       let arr = this.appObj.chatHis
  //       return arr
  //     },
  //     set (val) {
  //       return val
  //     }
  //   }
  // },
  sockets: {
    connectSuccess (obj) {
      console.log(obj)
      this.userList = obj.userList
      this.chatHis = obj.chatHis
    },
    addUserSuccess (obj) {
      console.log(obj)
      this.userList = obj.userList
      this.chatHis = obj.chatHis
    },
    deleUserSuccess (obj) {
      this.userList = obj.userList
      this.chatHis = obj.chatHis
    },
    sendNewMessageSuccess (obj) {
      console.log(obj)
      this.userList = obj.userList
      this.chatHis = obj.chatHis
      this.$nextTick(() => {
        this.$refs.chatCont.scrollTop = this.$refs.chatCont.scrollHeight
      })
    },
    login (value) {
      console.log(value)
    }
  },
  methods: {
    abc () {
      this.$socket.emit('login', 1111)
    },
    // 发送消息
    sendMessage () {
      if (this.sayCont) {
        this.$socket.emit('sendNewMessage', this.sayCont)
        this.sayCont = ''
      }
    },
    randColor () {
      let r = Math.floor(Math.random() * 255 + 1)
      let g = Math.floor(Math.random() * 255 + 1)
      let b = Math.floor(Math.random() * 255 + 1)
      this.$nextTick(() => {
        this.$refs.cover.style.background = `rgba(${r}, ${g}, ${b}, 0.2)`
      })
    },
    confirmName () {
      if (this.userName.trim() === '') {
        this.warning = '输入点什么呗!'
      } else if (this.userList.indexOf(this.userName) > -1) {
        this.warning = '名字已存在,换个试试!'
      } else {
        this.$socket.emit('addUser', this.userName.trim())
        this.nameOk = false
        clearInterval(this.time)
      }
    },
    // 渲染表情图片
    faceSrc (index) {
      let src = require(`../assets/emoji/${index + 1}.gif`)
      return src
    }
  },
  mounted () {
    this.time = setInterval(this.randColor, 2000)
  }
}
</script>

<style lang="stylus" scoped>
.myApp
  width 100%
  height 100%
  overflow hidden
  .fadeOut
    animation fadeOut 0.4s ease-in
    @keyframes fadeIn
      from
        font-weight normal
        opacity 0
      to
        font-weight bold
        opacity 1
  .fadeIn
    animation fadeIn 0.4s ease-out
    @keyframes fadeOut
      from
        font-weight bold
        opacity 1
      to
        font-weight normal
        opacity 0
  .coverWrap
    background #ffffff
    width 100%
    height 100%
    position fixed
    z-index 999
    top 0
    left 0
  .cover
    color #000000
    position fixed
    transition all 1s
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.2)
    .inputs
      width 80%
      max-height 10rem
      position absolute
      text-align center
      top 0
      left 0
      right 0
      bottom 0
      margin auto
      li
        margin 0 0 2rem
        input
          font-size 1.6rem
          background transparent
          outline none
          line-height 2rem
          box-shadow 0 1px 0 orange
          text-align center
        p
          margin-top 1rem
          min-height 1.2rem
          font-size 1.2rem
          color #ff3341
          line-height 1
          transition all 0.4s
        b
          display inline-block
          width 7rem
          height 3rem
          line-height 3rem
          border-radius 4px
          background #F56C6C
          color #ffffff
          &:active
            opacity 0.8
  .zoomout-enter-active
    animation zoom 1s
  .zoomout-leave-active
    animation zoom 1s reverse
  @keyframes zoom
    0%
      opacity 0
    100%
      opacity 1
  .chatBox
    width 100%
    height 100%
    display flex
    flex-direction column
    background skyblue
    .online
      flex 1
      display flex
      flex-direction column
      overflow auto
      h2
        line-height 2rem
        left 2rem
        font-size 1.2rem
        letter-spacing 0.1rem
        text-align center
        color #0DBC79
        background rgba(255, 255, 255, 0.6)
      .onlineIcon
        display inline-block
        width 1rem
        height 1rem
        margin-right 1rem
      .chatCont
        flex 1
        overflow auto
        padding 0 0.5rem
        li
          display flex
          margin 2rem 0
          >div
            display flex
          .head
            display inline-block
            width 3rem
            height 3rem
            border-radius 50%
            background #000000
            text-align center
            color #ffffff
            line-height 3rem
            font-size 1.6rem
          .text
            flex 1
            position relative
            margin-left 2rem
            margin-right 2rem
            p
              display inline-block
              padding 1rem
              font-size 1.4rem
              color #000000
              line-height 2rem
              border 1px solid rgba(255, 255, 255, 0.6)
              border-radius 4px
              box-shadow 0 0 2px rgba(0, 0, 0, 0.2)
        .others
          justify-content flex-start
          p
            &:before
              content ''
              position absolute
              top 1rem
              left -0.5rem
              width 1rem
              height 1rem
              background skyblue
              border-top 1px solid rgba(255, 255, 255, 0.6)
              border-left 1px solid rgba(255, 255, 255, 0.6)
              box-shadow -1px -1px 1px rgba(0, 0, 0, 0.2)
              transform rotateZ(-45deg)
        .myText
          justify-content flex-end
          p
            &:after
              content ''
              position absolute
              top 1rem
              right -0.5rem
              width 1rem
              height 1rem
              background skyblue
              border-top 1px solid rgba(255, 255, 255, 0.6)
              border-left 1px solid rgba(255, 255, 255, 0.6)
              box-shadow -1px -1px 1px rgba(0, 0, 0, 0.2)
              transform rotateZ(135deg)
        .system
          justify-content center
          span
            font-size 1.2rem
            line-height 3rem
            color #ffffff
    .btns
      padding 1rem 1rem 0
      // box-shadow 0 -1px 0px #dedede
      .inp
        line-height 3rem
        display flex
        font-size 1.4rem
        input
          flex 1
          border-radius 4px
          padding 0 0.5rem
          outline none
        span
          width 6rem
          height 3rem
          line-height 3rem
          text-align center
          background #F56C6C
          color #ffffff
          font-size 1.2rem
          border-radius 4px
          margin-left 0.5rem
          &:active
            opacity 0.8
      .other
        line-height 3.6rem
        .imgButton
          position relative
          label
            position absolute
            top 0
            left 0
            width 100%
            height 100%
        b
          display inline-block
          width 1.8rem
          height 1.8rem
          vertical-align middle
          margin-right 2rem
    .slideUp-enter-active, .slideUp-leave-active
      transition all 0.5s
    .slideUp-enter, .slideUp-leave-to
      transform translate3d(0, 14rem, 0)
    .faceBox
      padding 1rem
      background rgba(255, 255, 255, 0.2)
      ul
        max-height 14rem
        overflow auto
        display flex
        flex-grow 0.2rem
        justify-content space-around
        flex-wrap wrap
        li
          width 3rem
          height 3rem
          margin 0.2rem
          text-align center
          img
            width 100%
            height 100%
</style>

