// miniprogram/pages/index/index.js
const { pixelRatio: dpr, screenWidth } = getApp().globalData.systemInfo
const d = 8
const padding = 4
const R = screenWidth / 4 - padding
const constant = require('../../util/constant')
const app = getApp()
const innerCircleBackgroundColor = '#91b7ef'
const outerCircleBackgroundColor = '#e4e8eb'
Page({

  /**
   * 页面的初始数据
   */
  data: {// 以下都是逻辑值，未乘以canvas的坐标倍率
    // canvas画板逻辑宽度
    width: screenWidth / 2,
    // canvas画板逻辑高度
    height: screenWidth / 2,
    // 圆环到画板边界的距离(px)
    padding,
    // 圆环圆心x轴坐标
    cx: screenWidth / 4,
    // 圆环圆心y轴坐标
    cy: screenWidth / 4,
    // 大圆半径
    R,
    // 圆环间距
    d: d,
    // 小圆半径
    r: R - d,
    l: screenWidth / 6,
    // 设定的总时间
    originTime: 0,
    // 剩余时间
    remainTime: 0,
    // 剩余时间的格式字符串
    timeString: '00:00',
    // 定时器指示器
    timer: null,
    taskList: [],
    stage: app.globalData.stage
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.remainTime = app.globalData.remainTime
    this.data.taskList = app.globalData.taskList
    this.data.timeString = this.formatTime(this.data.remainTime)
    switch (app.globalData.stage) {
      case constant.PROCESSING: {
        this.data.originTime = app.globalData.isolateOriginTime
        break
      }
      case constant.REST: {
        this.data.originTime = app.globalData.isolateRestTime
        break
      }
      case constant.PENDING: {
        this.data.originTime = app.globalData.isolateOriginTime = app.globalData.settings.turnTime
        break
      }
    }
    this.setData({
      taskList: app.globalData.taskList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(wx.createSelectorQuery().select('#myCanvas'))
    // this.data.remainTime = this.data.originTime = 1000000
    // this.data.remainTime=0
    // app.globalData.stage=constant.PROCESSING
    wx.createSelectorQuery().select('#myCanvas').fields({ node: true, size: true }).exec((res) => {
      const canvasNode = res[0].node
      canvasNode.width = dpr * this.data.width
      canvasNode.height = dpr * this.data.width
      this.ctx = canvasNode.getContext('2d')
      this.draw()
    })
    // this.countDown()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.data.width * dpr, this.data.height * dpr)
    // 外圆
    ctx.beginPath()
    ctx.arc(this.data.cx * dpr, this.data.cy * dpr, this.data.R * dpr, 0, 2 * Math.PI)
    ctx.fillStyle = outerCircleBackgroundColor
    ctx.fill()

    // 内圆
    ctx.beginPath()
    ctx.arc(this.data.cx * dpr, this.data.cy * dpr, this.data.r * dpr, 0, 2 * Math.PI)
    ctx.fillStyle = innerCircleBackgroundColor
    ctx.fill()

    const percent = this.data.originTime === 0 || app.globalData.stage === constant.PENDING
      ? 0
      : 1 - Math.floor(this.data.remainTime / 1000) / Math.floor(this.data.originTime / 1000)
    const L = Math.PI * 2 * percent
    if (percent > 0) {
      ctx.beginPath()
      // 外层弧线
      ctx.arc(this.data.cx * dpr, this.data.cy * dpr, this.data.R * dpr, -0.5 * Math.PI, L - 0.5 * Math.PI)
      // 尾部圆弧
      ctx.arc(
        (this.data.cx + (this.data.r + this.data.d / 2) * Math.sin(L)) * dpr,
        (this.data.cy - (this.data.r + this.data.d / 2) * Math.cos(L)) * dpr,
        this.data.d / 2 * dpr,
        -0.5 * Math.PI + L,
        -0.5 * Math.PI + L + Math.PI
      )
      // 内层弧线
      ctx.arc(this.data.cx * dpr, this.data.cy * dpr, this.data.r * dpr, L - 0.5 * Math.PI, -0.5 * Math.PI, true)
      // 头部部圆弧
      ctx.arc(this.data.cx * dpr, (this.data.d / 2 + this.data.padding) * dpr, this.data.d / 2 * dpr, 0.5 * Math.PI, 1.5 * Math.PI)
      // ctx.strokeStyle = '#389fec'
      // ctx.lineWidth = 2 * dpr
      // ctx.stroke()
      if (app.globalData.stage === constant.REST) {
        ctx.fillStyle = '#77e0b5'
      } else {
        ctx.fillStyle = '#389fec'
      }
      ctx.fill()
    }

    if (app.globalData.stage === constant.PENDING) {
      // 播放箭头
      ctx.beginPath()
      const x = Math.sqrt(3) / 6 * this.data.l * dpr
      ctx.moveTo(this.data.cx * dpr - x, this.data.cy * dpr - this.data.l * dpr / 2)
      ctx.lineTo(this.data.cx * dpr - x, this.data.cy * dpr + this.data.l * dpr / 2)
      ctx.lineTo(this.data.cx * dpr + 2 * x, this.data.cy * dpr)
      ctx.closePath()
      ctx.fillStyle = '#fff'
      ctx.fill()
    } else {
      // 时间文本
      const textHeightInCanvas = screenWidth / 414 * 60 * dpr
      ctx.font = textHeightInCanvas + "px serif";
      ctx.fillStyle = "#fff"
      // ctx.textBaseline = "middle"
      // const { width: textWidthInCanvas } = ctx.measureText(this.data.timeString)
      // console.log(textWidthInCanvas, textHeightInCanvas)
      // ctx.fillText(this.data.timeString, this.data.cx * dpr - textWidthInCanvas / 2, this.data.cy * dpr + textHeightInCanvas / 2)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(this.data.timeString, this.data.cx * dpr, this.data.cy * dpr)
    }
  },
  countDown() {
    this.timer = setTimeout(() => {
      let rest = this.data.remainTime - 1000
      rest = rest < 0 ? 0 : rest
      if (rest > 0) {
        this.setRemainTime(rest)
        this.draw()
        this.countDown()
      } else {
        this.countDownOver()
      }
    }, 1000)
  },
  setRemainTime(v) {
    this.data.remainTime = v
    this.data.timeString = this.formatTime(v)
  },
  countDownOver() {
    switch (app.globalData.stage) {
      case constant.PROCESSING: {
        app.globalData.tomatoNum += 1
        app.globalData.stage = constant.REST
        this.iactx.stop()
        let restTime
        if (app.globalData.tomatoNum % app.globalData.settings.longRestInterval === 0) {
          restTime = app.globalData.settings.longRestTime
        } else {
          restTime = app.globalData.settings.restTime
        }
        this.setRemainTime(restTime)
        this.data.originTime = app.globalData.isolateRestTime = restTime
        this.draw()
        this.countDown()
        break
      }
      case constant.REST: {
        app.globalData.stage = constant.PENDING
        this.data.originTime = app.globalData.isolateOriginTime = app.globalData.settings.turnTime
        this.draw()
        break
      }
    }
    this.setData({
      stage: app.globalData.stage
    })
  },
  formatTime(timestamp) {
    const hour = 60 * 60 * 1000
    const minute = 60 * 1000
    const second = 1000
    const h = Math.floor(timestamp / hour)
    const m = Math.floor((timestamp - hour * h) / minute)
    const s = Math.floor((timestamp - hour * h - minute * m) / second)
    const tmp = []
    if (h > 0) tmp.push(h)
    tmp.push(m)
    tmp.push(s)
    return tmp.map(one => one > 9 ? one : '0' + one).join(':')
  },
  tapCanvas() {
    if (app.globalData.stage === constant.PENDING) {
      app.globalData.stage = constant.PROCESSING
      this.iactx = wx.createInnerAudioContext()
      this.iactx.src = 'http://downsc.chinaz.net/Files/DownLoad/sound1/201501/5373.wav'
      this.iactx.autoplay = this.iactx.loop = true
      this.iactx.obeyMuteSwitch = false
      wx.setInnerAudioOption({
        mixWithOther: true,
        obeyMuteSwitch: false
      })
      this.setData({
        stage: constant.PROCESSING
      })
      // 此时的turnTime和isolateOriginTime一定保持同步
      this.data.remainTime = app.globalData.settings.turnTime
      this.data.originTime = app.globalData.settings.turnTime
      this.countDown()
    }
  },
})