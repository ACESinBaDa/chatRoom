import Vue from 'vue'
import Router from 'vue-router'
import socket from '@/components/socket'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'socket',
    component: socket
  }],
  mode: 'history'
})
