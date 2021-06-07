// miniprogram/pages/setting/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchColor: '#f00',
    settings: app.globalData.settings,
    isShowDialog: false,
    dialogTitle: '番茄时长',
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    wx.setStorageSync('settings', this.data.settings)
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
  onSave() {
  },
  toggleShowDialog(e) {
    const nextState = !this.data.isShowDialog
    if (nextState) {
      this.onSave = (e) => {
        if (this.data.inputValue) {
          this[e.currentTarget.dataset['fnName']]()
        } else {
          this.toggleShowDialog()
        }
      }
      this.data.inputValue = ''
    }
    this.setData({ isShowDialog: nextState, inputValue: this.data.inputValue })
  },
  onChangeDialogInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  set(key) {
    return {
      to: (value, opt) => {
        this.data.settings[key] = value
        if (opt && opt.reRender) {
          this.setData({ settings: this.data.settings })
        }
      }
    }
  },
  setTipSoundEffect(e) {
    this.set('isOpenTipSoundEffect').to(e.detail.value)
  },
  setWorkingSoundEffect(e) {
    this.set('workingSoundEffect').to(e.detail.value)
  },
  getTimeStamp(timestr) {
    const minute = 60 * 1000
    return (timestr - 0) * minute
  },
  setTurnTime(e) {
    this.toggleShowDialog()
    this.set('turnTime').to(this.getTimeStamp(this.data.inputValue), { reRender: true })
  },
  setRestTime(e) {
    this.toggleShowDialog()
    this.set('restTime').to(this.getTimeStamp(this.data.inputValue), { reRender: true })
  },
  setLongRestTime(e) {
    this.toggleShowDialog()
    this.set('longRestTime').to(this.getTimeStamp(this.data.inputValue), { reRender: true })
  },
  setLongRestInterval(e) {
    this.toggleShowDialog()
    this.set('longRestInterval').to(this.getTimeStamp(this.data.inputValue), { reRender: true })
  },
  setDarkTheme(e) {
    this.set('isDark').to(e.detail.value, { reRender: true })
  },
})