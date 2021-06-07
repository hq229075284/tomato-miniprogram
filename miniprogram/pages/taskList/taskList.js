// miniprogram/pages/task/task.js
const {createId} =require('../../util/tool')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: app.globalData.taskList,
    checkedTasks: []
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
    this.setData({taskList:app.globalData.taskList})
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
  onCheckboxChange(e) {
    this.data.checkedTasks = e.detail.value
  },
  toggleCheckTask(e) {
    const { id } = e.currentTarget.dataset
    console.log(id)
    const idx = this.data.checkedTasks.indexOf(id)
    if (idx > -1) {
      this.data.checkedTasks.splice(idx, 1)
    } else {
      this.data.checkedTasks.push(id)
    }
    this.setData({
      checkedTasks: this.data.checkedTasks
    })
  },
  newTask() {
    // getApp().globalData.taskTree={
    //   id: createId(),
    //   name: '',
    //   turnNum: 0,
    //   remark: '',
    //   isComplete: false,
    //   children: []
    // }
    wx.navigateTo({
      url: '../taskInfo/taskInfo?type=new'
    })
  }
})