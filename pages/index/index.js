//index.js
//获取应用实例
import WxValidate from '../../assets/plugins/wx-validate/WxValidate.js'
const app = getApp()
 
Page({
  data: {
    noticeInfo: " 北京大学软件与微电子学院2020级新生选宿舍预计8月中旬开始，请大家注意通知;",

    binded:false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    genderList:[
      {name:"女",value:0,},
      {name:"男",value:1,}],
    
    genderarr:["女","男"],

    classarr:["求知一苑","求知二苑"],
    classindex:0,
    region: ["省", "市", "区"],
    regionFlag: 1,
    textareaValue: '',

    form:{

    },
    name:"",
    nametip:"",
    stunumber:0,
    stunumbertip:"",
    phone:0,
    phonetip:"",
    gender:0,
    gendertip:"",
    reg:""


  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //事件处理函数
  radioChange:function(e){
    this.setData({
      gender:e.detail.value,
      gendertip: ""
    })
  },
  getNameValue:function(e){
    this.setData({
      name:e.detail.value,
      nametip:""
    })
  },
  getStuValue:function(e){
    this.setData({
      stunumber:e.detail.value,
      stunumbertip:""
    })
  },
  getPhoneValue:function(e){
    this.setData({
    phone:e.detail.value,
    phonetip:""
    })
  },
  bindClassChange:function(e){
    this.setData({
      classindex:e.detail.value
    })
  },
  formSubmit: function (e) {
    var that=this
    let params =e.detail.value;
    if(!this.WxValidate.checkForm(params)){
      for (var i = 0; i < this.WxValidate.errorList.length;i++){
        let error = this.WxValidate.errorList[i];
        switch (error.param) {
          case "names":
            that.setData({
              nametip: error.msg
            })
            break
          case "gender":
            that.setData({
              gendertip: error.msg
            })
            break
          case "stunumbers":
            that.setData({
              stunumbertip: error.msg
            })
            break
          case "phones":
            that.setData({
              phonetip: error.msg
            })
            break
        }
      }
      return
    }
    wx.request({
      url: 'http://47.93.193.91:80/wx/bind/info',
      method:'POST',
      data:{
        name: e.detail.value.names,
        gender: that.data.gender,
        stunumber: e.detail.value.stunumbers,
        phone: e.detail.value.phones,
        classes: that.data.classindex,
        region: e.detail.value.region
      }
    ,
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session")},
    success:function(res){
      console.log(res)
      if(res.statusCode==200){
        that.setData({
          binded:true
        })
        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }else{
        console.log(res)
      }
    },
    fail:function(res){
      wx.showToast({
        title: '网络不稳定',
        icon: 'fail',
        duration: 1000,
        mask: true
      })
    }
    })
  },
  onLoad: function () {
   this.setData({
     userInfo:app.globalData.userInfo
   })
    this.initValidate();
    var that = this
    wx.request({
      url: 'http://47.93.193.91:80/wx/myinfo',
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session") },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        if (res.data.status == 0) {
          that.setData({
            name: res.data.data.StuName,
            stunumber: res.data.data.StuNmber,
            phone: res.data.data.StuTele,
            gender: res.data.data.Gender,
            binded:true,
            reg:res.data.data.Region,
            classindex:res.data.data.Class
          })
        }
    },
    fail: function(res) {
      wx.showToast({
        title: '网络不稳定',
        icon:'请检查网络'
      })
    },
    complete: function(res) {},
  })
    wx.request({
      url: 'http://47.93.193.91:80/wx/classes',
      method:'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session")},
      success:function(res){
        if(res.statusCode===200){
        console.log(res)
        that.setData({
          classarr:res.data.data.items
        })
        }
      }
    })
    
  },
  initValidate:function(){
    let rules={
      names:{
        required:true,
        maxlength:10,
        minlength:2
      },
      stunumbers:{
        required:true,
        number:true,
        range:[1000000000,3000000000],
      },
      phones:{
        required:true,
        tel:true
      },
      gender:{
        required:true,
        number:true,
        max:1
      }
    }
    let message={
      names:{
        required:'姓名为必填项',
        maxlength:'名字不得超过十个字',
        minlength:'名字不得低于两个字',
      },
      stunumbers:{
        required:'学号为必填项',
        number:'学号只能由纯数字组成',
        range:'请输入有效的学号',
      },
      phones:{
        required:'手机号为必填项',
        tel:'请输入有效的手机号',
      }, 
      gender: {
        required: '性别为必选项',
        number:'网页出错，请刷新',
        max: '网页出错，请刷新'
      }
    }
    this.WxValidate=new WxValidate(rules,message);
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }




  , bindRegionChange: function (e) {
    this.setData({ region: e.detail.value, regionFlag: 0 });
  },

  onPullDownRefresh: function () {
    var that =this
    wx.request({
      url: 'http://47.93.193.91:80/wx/myinfo',
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session") },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
         if(res.data.status==0){
     
           that.setData({
             name: res.data.data.StuName,
             stunumber:res.data.data.StuNmber,
             phone:res.data.data.StuTele,
             gender:res.data.data.Gender,
             binded:true
           })
       }
      }
    })
  },
})
