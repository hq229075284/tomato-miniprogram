// miniprogram/pages/taskInfo/taskInfo.js
const tool = require('../../util/tool.js')
const constant = require('../../util/constant.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskTree: {},
    type: '',
    isShowDialog: false,
    // currentEditTask: null,
    // turnNum: 1,
    newSubTaskName: '',
    dialogTitle: '预计番茄钟个数'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if(!getApp().taskTree){
    //   wx.switchTab({
    //     url:'../taskList/taskList'
    //   })
    // }
    if (options.type === constant.NEW) {
      this.data.type = constant.NEW
      this.data.taskTree = tool.createTaskFromTemplate()
    } else {
      this.data.taskTree = app.globalData.taskTree
    }
    console.log(this)
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
  onChangeMainTaskName(e) {
    this.data.taskTree.name = e.detail.value
  },

  // 子任务
  editNewSubTask(e) {
    this.data.newSubTaskName = e.detail.value
  },
  addNewSubTask() {
    const taskTree = this.data.taskTree
    taskTree.children.push({
      id: tool.createId(),
      name: this.data.newSubTaskName,
      isComplete: false,
    })
    this.setData({
      taskTree: taskTree,
      newSubTaskName: ''
    })
  },

  // 备注
  saveRemark(e) {
    this.data.taskTree.remark = e.detail.value
  },

  checkVariable() {
    const checkers = [
      { key: 'name', validator: function (v) { return !!v }, message: '请输入任务名称' },
      { key: 'turnNum', validator: function (v) { return v > 0 }, message: '请输入设定预计番茄数量' },
    ]

    for (let i = 0; i < checkers.length; i++) {
      const pass = checkers[i].validator(this.data.taskTree[checkers[i].key])
      if (!pass) {
        wx.showToast({
          icon:'none',
          title: checkers[i].message
        })
        return false
      }
    }
    return true
  },
  onSaveTask() {
    if (!this.checkVariable()) return
    if (this.data.type === constant.NEW) {
      app.globalData.taskList.push(this.data.taskTree)
    }
    wx.navigateBack()
  },

  // 弹框相关的功能
  openDialog() {
    this.setData({
      isShowDialog: true
    })
  },
  onChangeInput(e) {
    this.data.nextTurnNum = e.detail.value
  },
  onSave() {
    this.data.taskTree.turnNum = this.data.nextTurnNum
    this.setData({
      isShowDialog: false,
      nextTurnNum: '',
      taskTree: this.data.taskTree
    })
  },
  onCancel() {
    this.setData({ isShowDialog: false })
  },

})