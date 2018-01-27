let express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io').listen(server)
let appObj = {
  userList: [],
  chatHis: []
}

app.use('/', express.static('./dist'))

server.listen(process.env.PORT || 8889)

io.sockets.on('connection', (socket) => {
  // 链接成功
  // socket.emit('connectSuccess', appObj)

  // 新用户登录
  socket.on('login', (nickName) => {
    console.log(`${nickName} joined`)
  })

  socket.on('addUser', (userName) => {
    if (appObj.userList.indexOf(userName) < 0) {
      socket.userName = userName
      appObj.userList.push(userName)
      appObj.chatHis.push({
        userName: userName,
        type: 'newUser'
      })
      socket.broadcast.emit('addUserSuccess', appObj)
      socket.emit('addUserSuccess', appObj)
    }
  })

  // 用户发送消息
  socket.on('sendNewMessage', (message) => {
    console.log(message)
    appObj.chatHis.push({
      userName: socket.userName,
      message: message,
      type: 'sendNewMessage'
    })
    socket.broadcast.emit('sendNewMessageSuccess', appObj)
    socket.emit('sendNewMessageSuccess', appObj)
  })

  // 管理者发红包
  socket.on('sendMoney', () => {
    appObj.chatHis.push({
      userName: socket.userName,
      type: 'sendMoney'
    })
    socket.broadcast.emit('sendMoneySuccess', appObj)
    socket.emit('sendMoneySuccess', appObj)
  })

  // 发送图片
  socket.on('sendImg', (url) => {
    appObj.chatHis.push({
      userName: socket.userName,
      type: 'sendImg',
      url: url
    })
    socket.broadcast.emit('sendImgSuccess', appObj)
    socket.emit('sendImgSuccess', appObj)
  })

  // 领取红包
  socket.on('getMoney', (moneyObj) => {
    appObj.chatHis.push({
      userName: socket.userName,
      type: 'getMoney',
      money: moneyObj.money
    })
    socket.broadcast.emit('getMoneySuccess', appObj)
    socket.emit('getMoneySuccess', appObj)
  })

  // 用户离开
  socket.on('disconnect', () => {
    if (socket.userName) {
      appObj.userList.splice(appObj.userList.indexOf(socket.userName), 1)
      appObj.chatHis.push({
        type: 'deleUser',
        userName: socket.userName
      })
      socket.broadcast.emit('deleUserSuccess', appObj)
    }
  })
})