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
          <li :class="{ 'others': (item.type=='sendNewMessage' || item.type=='sendImg') && item.userName!=userName, 'money': item.type=='sendMoney','myText': (item.type=='sendNewMessage' || item.type=='sendImg') && item.userName==userName, 'system': (item.type=='newUser' || item.type=='deleUser' || item.type=='getMoney') }" v-for="(item, index) in chatHis" :key="index">
            <div v-if="(item.type=='sendNewMessage' || item.type=='sendImg') && item.userName!=userName">
              <span class="head">{{ item.userName.slice(-1) }}</span>
              <div class="text">
                <p v-if="item.type=='sendImg'">
                  <img @click="lookImgUrl=item.url;showImg=true;" :src="item.url" alt="">
                </p>
                <p v-else v-html="filterEmoj(item.message)">{{ filterEmoj(item.message) }}</p>
              </div>
            </div>
            <div v-if="(item.type=='sendNewMessage' || item.type=='sendImg') && item.userName==userName">
              <div class="text">
                <p v-if="item.type=='sendImg'">
                  <img @click="lookImgUrl=item.url;showImg=true;" :src="item.url" alt="">
                </p>
                <p v-else v-html="filterEmoj(item.message)">{{ filterEmoj(item.message) }}</p>
              </div>
              <span class="head">{{ item.userName.slice(-1) }}</span>
            </div>
            <div v-if="item.type=='newUser'">
              <span>{{ item.userName }} 加入聊天室</span>
            </div>
            <div v-if="item.type=='deleUser'">
              <span>{{ item.userName }} 离开了聊天室</span>
            </div>
            <div v-if="item.type=='getMoney'">
              <span>{{ item.userName }} 获得了 {{ item.money }} 元</span>
            </div>
            <div v-if="item.type=='sendMoney'">
              <div class="text">
                <h2 @click="randMoney">
                  <i class="moneyIcon"></i>
                  抢红包!
                </h2>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="btns">
        <div class="inp">
          <input type="text" placeholder="说点什么" @focus="showFace=false" v-model="sayCont">
          <span class="disable" @click="sendMessage">发送</span>
        </div>
        <div class="other">
          <b class="colorIcon"></b>
          <b class="imgIcon imgButton">
            <label for="img">
              <input @change="uploadImg" type="file" id="img" name="img" v-show="0">
            </label>
          </b>
          <b class="faceIcon" @click="showFace=!showFace"></b>
          <b v-if="userName=='sinbada' || userName=='杨理想' || userName=='理想' || userName=='system'" class="moneyIcon" @click="sendMoney"></b>
        </div>
      </div>
      <transition name="boceIn">
        <div class="moneyWrap" v-if="showMoney">
          <div class="moneyBox">
            <div class="top">
              <h6 class="close">
                <i @click="showMoney=false">&#10006;</i>
              </h6>
              <div class="head">
                <span>{{ userName.slice(-1) }}</span>
                <h4>{{ userName }}</h4>
              </div>
              <p>{{ moneyObj.warning }}</p>
            </div>
            <div class="bottom">
              <h5>@copyRight by lx</h5>
            </div>
          </div>
        </div>
      </transition>
      <transition name="slideUp">
        <div class="faceBox" v-show="showFace">
          <ul>
            <li v-for="index in 68" :key="index">
              <img :src="faceSrc(index)" alt="face" @click="chooseFace(index)">
            </li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </transition>
      <div @click="showImg=false" class="lookImg" v-show="showImg">
        <img :src="lookImgUrl" alt="">
      </div>
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
      showMoney: false,
      showImg: false,
      lookImgUrl: '',
      moneyObj: {
        money: 0,
        firstGet: true,
        warning: ''
      },
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
      this.common(obj)
    },
    addUserSuccess (obj) {
      this.common(obj)
    },
    deleUserSuccess (obj) {
      this.common(obj)
    },
    sendNewMessageSuccess (obj) {
      this.common(obj)
    },
    sendImgSuccess (obj) {
      this.common(obj)
    },
    sendMoneySuccess (obj) {
      this.common(obj)
    },
    getMoneySuccess (obj) {
      console.log(obj)
      this.common(obj)
    }
  },
  methods: {
    common (obj) {
      this.userList = obj.userList
      this.chatHis = obj.chatHis
      this.$nextTick(() => {
        this.$refs.chatCont.scrollTop = this.$refs.chatCont.scrollHeight
      })
    },
    // 随机函数
    randNum (m, n) {
      let num = Math.floor(Math.random() * (n - m + 1) + m)
      return num
    },
    // 发送消息
    sendMessage () {
      if (this.sayCont) {
        this.$socket.emit('sendNewMessage', this.sayCont)
        this.sayCont = ''
      }
    },
    // 发红包
    sendMoney () {
      this.$socket.emit('sendMoney')
    },
    // 随机钱数大小
    randMoney () {
      if (this.moneyObj.firstGet) {
        let money = 12.5
        let randNum = Math.random() * 11
        let addOrDel = this.randNum(0, 1) ? 1 : (-1)
        console.log(money, randNum, addOrDel)
        this.moneyObj.money = (money + randNum * addOrDel).toFixed(2)
        this.moneyObj.warning = `恭喜你获得 ${this.moneyObj.money} 元红包`
        this.$socket.emit('getMoney', this.moneyObj)
        this.moneyObj.firstGet = false
      } else {
        this.moneyObj.warning = `你已经抢过这个红包获得了 ${this.moneyObj.money} 元, 给被人留点吧!`
      }
      this.showMoney = true
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
        sessionStorage.setItem('__chatRoomUserName__', this.userName.trim())
        this.nameOk = false
        clearInterval(this.time)
      }
    },
    // 发送图片
    uploadImg (e) {
      let file = e.target.files[0]
      let reader = new FileReader()
      let imageType = /image.*/
      if (file.type.match(imageType)) {
        reader.onload = (ev) => {
          let url = ev.target.result
          this.$socket.emit('sendImg', url)
        }
        reader.readAsDataURL(file)
      }
    },
    // 渲染表情图片
    faceSrc (index) {
      let src = require(`../assets/emoji/${index + 1}.gif`)
      return src
    },
    filterEmoj (val) {
      let em = val.replace(/\[emoj:(\d+)\]/g, (item, index) => {
        let url = require(`../assets/emoji/${index - 0 + 1}.gif`)
        return `<span style='background: url(${url}) no-repeat;background-size:100%;display: inline-block;width:4rem;height:4rem;'></span>`
      })
      return em
    },
    // 点击表情
    chooseFace (index) {
      this.showFace = false
      this.sayCont += `[emoj:${index}]`
    }
  },
  mounted () {
    this.time = setInterval(this.randColor, 2000)
    setTimeout(() => {
      if (sessionStorage.getItem('__chatRoomUserName__')) {
        let name = sessionStorage.getItem('__chatRoomUserName__')
        this.$socket.emit('addUser', name)
        this.userName = name
        clearInterval(this.time)
        this.nameOk = false
      }
    }, 500)
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
            img
              width 10rem
              max-height 20rem
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
            img
              width 10rem
              max-height 20rem
        .system
          justify-content center
          span
            font-size 1.2rem
            line-height 3rem
            color #ffffff
        .money
          justify-content center
          h2
            width 15rem
            padding 1.5rem
            font-size 1.4rem
            line-height 3rem
            color #ffffff
            background #F56C6C
            border-radius 4px
            i
              display inline-block
              width 3rem
              height 3rem
              margin-right 0.5rem
              vertical-align middle
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
  .moneyWrap
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.6)
    .moneyBox
      position absolute
      display flex
      flex-direction column
      overflow hidden
      top 0
      right 0
      bottom 0
      left 0
      margin auto
      width 80%
      height 60%
      background rgb(215, 0, 15)
      border-radius 4px
      .top
        flex 1
        display flex
        flex-direction column
        padding 1.5rem
        background rgb(222, 49, 33)
        box-sizing border-box
        border-bottom-left-radius 20%
        border-bottom-right-radius 20%
        box-shadow 0 1px 0px #ff3341
        i
          font-size 1.4rem
          line-height 2rem
          color rgb(50, 50, 50)
        .head
          text-align center
          margin-top 1rem
          margin-bottom 2rem
          span
            display inline-block
            width 3rem
            height 3rem
            border-radius 4px
            font-size 1.4rem
            background rebeccapurple
            line-height 3rem
            color #ffffff
          h4
            font-size 1.2rem
            margin-top 1rem
            margin-bottom 1rem
            color rgb(244, 200, 75)
        p
          font-size 1.6rem
          line-height 3rem
          color rgb(255, 200, 0)
          text-align center
          flex 1
      .bottom
        box-sizing border-box
        padding 1.5rem
        height 30%
        display flex
        text-align center
        h5
          flex 1
          align-self center
          font-size 1.2rem
  .boceIn-enter-active
    animation boceIn 0.5s ease-in
    @keyframes boceIn
      0%, 20%, 40%, 60%, 80%, 100%
        -webkit-transition-timing-function cubic-bezier(0.215, 0.61, 0.355, 1)
        transition-timing-function cubic-bezier(0.215, 0.61, 0.355, 1)
      0%
        opacity 0
        -webkit-transform scale3d(0.3, 0.3, 0.3)
        transform scale3d(0.3, 0.3, 0.3)
      20%
        -webkit-transform scale3d(1.1, 1.1, 1.1)
        transform scale3d(1.1, 1.1, 1.1)
      40%
        -webkit-transform scale3d(0.9, 0.9, 0.9)
        transform scale3d(0.9, 0.9, 0.9)
      60%
        opacity 1
        -webkit-transform scale3d(1.03, 1.03, 1.03)
        transform scale3d(1.03, 1.03, 1.03)
      80%
        -webkit-transform scale3d(0.97, 0.97, 0.97)
        transform scale3d(0.97, 0.97, 0.97)
      100%
        opacity 1
        -webkit-transform scale3d(1, 1, 1)
        transform scale3d(1, 1, 1)
  .boceIn-leave-active
    animation boceOut 0.5s ease-in
    @keyframes boceOut
      0%
        opacity 1
      100%
        opacity 0
  .boceIn-enter, .boceIn-leave-to
    transition all 0.5s
  .lookImg
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.8)
    overflow auto
    img
      position absolute
      top 0
      bottom 0
      margin auto 0
      width 100%
</style>

