//app.js
const constant = require('./util/constant')

App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    const minute = 60 * 1000
    const defaultSettings = {
      isOpenTipSoundEffect: true,
      workingSoundEffect: 1,
      turnTime: 1* minute,
      restTime: 5 * minute,
      longRestTime: 25 * minute,
      longRestInterval: 4,
      isDark: false
    }

    let settings = wx.getStorageSync('settings') || defaultSettings

    let taskList = wx.getStorageSync('task-list') || []

    const globalData = this.globalData = {
      systemInfo: wx.getSystemInfoSync(),
      settings,
      remainTime:0,
      isolateRestTime: 0,
      isolateOriginTime: 0,
      stage: constant.PENDING,
      tomatoNum:0
    }

    // task-list响应式
    function taskListSet(v) {
      taskList = v
      wx.setStorageSync('task-list', v)
    }
    Object.defineProperty(globalData, 'taskList', {
      get() {
        return taskList
      },
      set: taskListSet
    })
    globalData.taskList.push = function (...rest) {
      Array.prototype.push.call(this, ...rest)
      taskListSet(this)
    }
    globalData.taskList.splice = function (start, deleteNum, ...addItems) {
      Array.prototype.splice.call(this, start, deleteNum, ...addItems)
      taskListSet(this)
    }
  }
})
