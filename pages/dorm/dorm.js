// pages/dorm/dorm.js
import WxRequest from '../../assets/plugins/wx-request/lib/index'
const { $Message } = require('../../dist/base/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    depart5m:0,
    depart5w: 0,
    depart8m: 0,
    depart8w: 0,
    depart9m: 0,
    depart9w: 0,
    depart13m: 0,
    depart13w: 0,
    depart14m: 0,
    depart14w: 0,


    size2m:0,
    size2w:0,
    size3m:0,
    size3w:0,
    size4m:0,
    size4w:0,
    size5m:0,
    size5w:0,



    step1title:"选择中",
    step1content:"选择舍友",

    step2title:"未选择",
    step2content:"选择宿舍楼",

    step3title:"未选择",
    step3content: "选择宿舍大小",
    

    singlemode:true,
    multimode:false,
  



    choose:false,
    current:0,
    btlinfo:"等等再选",
    btlable:true,
    btrinfo:"下一步",
    btrload:false,

    multiarr:["000","000"],

    departarr:[{id:"5",choose:""},
      { id: "8", choose: "" },
      { id: "9", choose: "" },
      { id: "13", choose: "" },
      { id: "14", choose: "" },
      { id: "0", choose: "" }],

    departinfoarr:[
      { mlast: 200, wlast: 200, info: "单人间、双人间、4人间、5人间" },
      { mlast: 200, wlast: 200, info: "单人间、双人间、4人间、5人间" },
      { mlast: 200, wlast: 200, info: "单人间、双人间、4人间、5人间" },
      { mlast: 200, wlast: 200, info: "单人间、双人间、4人间、5人间" },
      { mlast: 200, wlast: 200, info: "单人间、双人间、4人间、5人间" },
      { mlast: 200, wlast: 200, info: "单人间、双人间、4人间、5人间" },
    ],

    departnum:[[],[],[],[],[]],

    sizearr:[1,2,3,4],

    departchoose:["","","","","","选中"],

    sizechoose: ["", "", "", "",  "选中"],

    stunumber:[],
    depart:"",
    size:0,
    floor:0,
    dorm:"",
    bed:"",

    chooseok:false,
    chooseres:"",
  


    tipvisible:false,
    actions: [
      {
        name: '提交',
        color: '#ed3f14'
      }
    ],


    
  },
 
  chooseLeftClick:function(){
        this.setData({
          singlemode: true,
          multimode: false,
        })
  },
  chooseRightClick:function(){
    this.setData({
      singlemode: false,
      multimode: true,
    })
  },
  confirmChoose:function(){
    var that =this
    wx.request({
      url: 'http://47.93.193.91:80/wx/myinfo',
      data: '',
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session")},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        if(res.data.status==35){
          that.setData({
            choose:false
          })
          $Message({
            content: '请先进行数据绑定,自动跳转到绑定页面',
            type: 'warning',
            duration: 3
          });
          setTimeout(function () {
            wx.switchTab({    //跳转到tabBar页面，并关闭其他所有tabBar页面
              url: "/pages/index/index"
            })
          }, 1000)
        
        }else if(res.data.status==0){
          that.setData({
            choose: !that.data.choose
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
   
  },
  handleLeftClick(){
    if(this.data.current==2){
      this.setData({
        current: this.data.current-1,
        btrinfo:"下一步",
        step2title:"进行中",
        step3title: "未选择",
      })
    }else if(this.data.current==0){
        this.setData({
          choose:false
        })
    }else if(this.data.current==1){
      this.setData({
        current: this.data.current - 1,
        btlinfo: "等等再选",
        step1title: "进行中",
        step2title: "未进行",
      })
    }
    console.log(this.data.current)
  }, 
  handleRightClick() {
    if(this.data.current==1){
      this.setData({
        current: this.data.current + 1,
        btrinfo:"提交",
        step3title: "进行中",
        step2title: "已完成",
      })
    }else if(this.data.current==2){
      this.setData({
        tipvisible:true,
        step3title: "未选择",
        step1title: "选择中",
      })
    }else if(this.data.current==0){
      this.setData({
        current: this.data.current + 1,
        btlinfo: "上一步",
        step2title: "选择中",
        step1title: "已完成",
      })
    }
    console.log(this.data.current)
  },
  submit:function(){
    var that =this
    wx.request({
      url: 'http://47.93.193.91:80/wx/distr',
      data: {
        depart: that.data.depart,
        size: that.data.size,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session")},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
          if (res.data.status == 0 && res.statusCode == 200){
            that.setData({
              chooseok:true,
              chooseres:res.data.data[0],
              depart: res.data.data[0].substring(0, res.data.data[0].length - 5),
              size: res.data.data[1].substring(res.data.data[1].length - 2, res.data.data[1].length - 1),
              floor: res.data.data[0].substring(res.data.data[0].length - 4, res.data.data[0].length - 3),
              dorm: res.data.data[0].substring(0, res.data.data[0].length - 1),
              bed: res.data.data[0].substring(res.data.data[0].length - 1, res.data.data[0].length),
              tipvisible: false,  
              actions: [{
                name: '提交',
                color: '#ed3f14',
                loading: false
              }],
              current: 0,
              choose: false,
              btrinfo: "下一步",
            });
            console.log(that.data.chooseres)


            $Message({
              content: '提交成功！',
              type: 'success'
            });
 
        }else{
          if(res.data.status==4){
            that.setData({
              chooseok:true
            })
          }
          that.setData({
            chooseres: res.data.data,
            tipvisible: false,
            actions: [{
              name: '提交',
              color: '#ed3f14',
              loading: false
            }],
            current: 0,
            choose: false,
            btrinfo: "下一步",
          });

          $Message({
            content: res.data.Error,
            type: 'error'
          });
        }
      },
      fail: function(res) {
        action[0].loading = false;
        that.setData({
          tipvisible: false,
          actions: action,
          current: 0,
          choose: false,
          btrinfo: "下一步",
        });

        $Message({
          content: res.data.Error,
          type: 'error'
        });
      },
      complete: function(res) {},
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: 'http://47.93.193.91:80/wx/wtcho',
      data: '',
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session") },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200){
          if(res.data.status==55){
            $Message({
              content: res.data.Error,
              type: "warning"
            });
          }else if(res.data.status==0){
            that.setData({
              chooseok: true,
              chooseres: res.data.data[0],
              depart: res.data.data[0].substring(0, res.data.data[0].length - 5),
              size: res.data.data[1].substring(res.data.data[1].length - 2, res.data.data[1].length - 1),
              floor: res.data.data[0].substring(res.data.data[0].length - 4, res.data.data[0].length - 3),
              dorm: res.data.data[0].substring(0, res.data.data[0].length - 1),
              bed: res.data.data[0].substring(res.data.data[0].length - 1, res.data.data[0].length),
            })
      
            console.log(that.data.chooseres)
            console.log(that.data.depart)
            console.log(that.data.size)
            console.log(that.data.floor)
            console.log(that.data.dorm)
            console.log(that.data.bed)
           
            $Message({
              content: '您已成功选宿舍！',
              type: 'success'
            });
          }
        }else{
          $Message({
            content: res.data.Error,
            type: 'fail'
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.request({
      url: 'http://47.93.193.91:80/wx/bed/toremain',
      data: '',
      header: {'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session")},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        for(var i=0;i<res.data.data.DepartInfo.length;i++){
          if(res.data.data.DepartInfo[i].Depart=="5B"){
            that.data.departnum[0].push(res.data.data.DepartInfo[i])
          } else if (res.data.data.DepartInfo[i].Depart == "8F" ){
            that.data.departnum[1].push(res.data.data.DepartInfo[i])
          } else if (res.data.data.DepartInfo[i].Depart == "9D" ){
            that.data.departnum[2].push(res.data.data.DepartInfo[i])
          } else if (res.data.data.DepartInfo[i].Depart == "13E") {
            that.data.departnum[3].push(res.data.data.DepartInfo[i])
          } else if (res.data.data.DepartInfo[i].Depart == "14A") {
            that.data.departnum[4].push(res.data.data.DepartInfo[i])
          }
        }
          console.log(that.data.departnum)
      
        that.setData({
          depart5w: parseInt(that.data.departnum[0][0].Num + that.data.departnum[0][1].Num + that.data.departnum[0][2].Num + that.data.departnum[0][3].Num),
          depart5m: parseInt(that.data.departnum[0][4].Num + that.data.departnum[0][5].Num + that.data.departnum[0][6].Num + that.data.departnum[0][7].Num),
          depart8w: parseInt(that.data.departnum[1][0].Num + that.data.departnum[1][1].Num + that.data.departnum[1][2].Num + that.data.departnum[1][3].Num),
          depart8m: parseInt(that.data.departnum[1][4].Num + that.data.departnum[1][5].Num + that.data.departnum[1][6].Num + that.data.departnum[1][7].Num),
          depart9w: parseInt(that.data.departnum[2][0].Num + that.data.departnum[2][1].Num + that.data.departnum[2][2].Num + that.data.departnum[2][3].Num),
          depart9m: parseInt(that.data.departnum[2][4].Num + that.data.departnum[2][5].Num + that.data.departnum[2][6].Num + that.data.departnum[2][7].Num),
          depart13w: parseInt(that.data.departnum[3][0].Num + that.data.departnum[3][1].Num + that.data.departnum[3][2].Num + that.data.departnum[3][3].Num),
          depart13m: parseInt(that.data.departnum[3][4].Num + that.data.departnum[3][5].Num + that.data.departnum[3][6].Num + that.data.departnum[3][7].Num),
           depart14w: parseInt(that.data.departnum[4][0].Num + that.data.departnum[4][1].Num + that.data.departnum[4][2].Num + that.data.departnum[4][3].Num),
          depart14m: parseInt(that.data.departnum[4][4].Num + that.data.departnum[4][5].Num + that.data.departnum[4][6].Num + that.data.departnum[4][7].Num),
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */

  handleCancel:function(){
    this.setData({
      tipvisible:false
    })
  }, 
  handleClickItem() {
    const action = [...this.data.actions];
    action[0].loading = true;

    this.setData({
      actions: action
    });
    this.submit()

    setTimeout(() => {
      
    }, 4000);
  },
  onShareAppMessage: function () {

  }
  , chooseDepart0: function (e) {
    this.setData({
      departchoose:["选中","","","","",""],
      depart:"5B",
      size2w: parseInt(this.data.departnum[0][0].Num),
      size2m: parseInt(this.data.departnum[0][4].Num),
      size3m: parseInt(this.data.departnum[0][5].Num),
      size3w: parseInt(this.data.departnum[0][1].Num),
      size4m: parseInt(this.data.departnum[0][6].Num),
      size4w: parseInt(this.data.departnum[0][2].Num),
      size5m: parseInt(this.data.departnum[0][7].Num),
      size5w: parseInt(this.data.departnum[0][3].Num),

    })
  },
  chooseDepart1: function (e) {
    this.setData({
      departchoose: ["", "选中", "", "", "", ""],
      depart: "8F",
      size2w: parseInt(this.data.departnum[1][0].Num),
      size2m: parseInt(this.data.departnum[1][4].Num),
      size3m: parseInt(this.data.departnum[1][5].Num),
      size3w: parseInt(this.data.departnum[1][1].Num),
      size4m: parseInt(this.data.departnum[1][6].Num),
      size4w: parseInt(this.data.departnum[1][2].Num),
      size5m: parseInt(this.data.departnum[1][7].Num),
      size5w: parseInt(this.data.departnum[1][3].Num),
    })
  },
  chooseDepart2: function (e) {
    this.setData({
      departchoose: ["", "", "选中", "", "", ""],
      depart: "9D",
      size2w: parseInt(this.data.departnum[2][0].Num),
      size2m: parseInt(this.data.departnum[2][4].Num),
      size3m: parseInt(this.data.departnum[2][5].Num),
      size3w: parseInt(this.data.departnum[2][1].Num),
      size4m: parseInt(this.data.departnum[2][6].Num),
      size4w: parseInt(this.data.departnum[2][2].Num),
      size5m: parseInt(this.data.departnum[2][7].Num),
      size5w: parseInt(this.data.departnum[2][3].Num),
    })
  },
  chooseDepart3: function (e) {
    this.setData({
      departchoose: ["", "", "", "选中", "", ""],
      depart: "13E",
      size2w: parseInt(this.data.departnum[3][0].Num),
      size2m: parseInt(this.data.departnum[3][4].Num),
      size3m: parseInt(this.data.departnum[3][5].Num),
      size3w: parseInt(this.data.departnum[3][1].Num),
      size4m: parseInt(this.data.departnum[3][6].Num),
      size4w: parseInt(this.data.departnum[3][2].Num),
      size5m: parseInt(this.data.departnum[3][7].Num),
      size5w: parseInt(this.data.departnum[3][3].Num),
    })
  }, chooseDepart4: function (e) {
    this.setData({
      departchoose: ["", "", "", "", "选中", ""],
      depart: "14A",
      size2w: parseInt(this.data.departnum[4][0].Num),
      size2m: parseInt(this.data.departnum[4][4].Num),
      size3m: parseInt(this.data.departnum[4][5].Num),
      size3w: parseInt(this.data.departnum[4][1].Num),
      size4m: parseInt(this.data.departnum[4][6].Num),
      size4w: parseInt(this.data.departnum[4][2].Num),
      size5m: parseInt(this.data.departnum[4][7].Num),
      size5w: parseInt(this.data.departnum[4][3].Num),
    })
  },
  chooseDepart5: function (e) {
    this.setData({
      departchoose: ["", "", "", "", "", "选中"],
      depart: ""
    })
  },




  chooseSize1: function (e) {
    this.setData({
      sizechoose: ["选中", "", "", "", ""],
      size:2
    })
  },
  chooseSize2: function (e) {
    this.setData({
      sizechoose: ["", "选中", "", "", ""],
      size: 3
    })
  },
  chooseSize3: function (e) {
    this.setData({
      sizechoose: ["", "", "选中", "", ""],
      size:4
    })
  },
  chooseSize4: function (e) {
    this.setData({
      sizechoose: ["", "", "", "选中", ""],
      size:5
    })
  },
  chooseSize5: function (e) {
    this.setData({
      sizechoose: ["", "", "", "", "选中"],
      size:0
    })
  },
  onPullDownRefresh: function () {
    var that = this
    wx.request({
      url: 'http://47.93.193.91:80/wx/wtcho',
      data: '',
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'cookie': wx.getStorageSync("gin-session") },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.status == 55) {

          } else if (res.data.status == 0) {
            that.setData({
              chooseok: true,
              chooseres: res.data.data[0],
              depart: res.data.data[0].substring(0, res.data.data[0].length - 5),
              size: res.data.data[1].substring(res.data.data[1].length - 2, res.data.data[1].length - 1),
              floor: res.data.data[0].substring(res.data.data[0].length - 4, res.data.data[0].length - 3),
              dorm: res.data.data[0].substring(0, res.data.data[0].length - 1),
              bed: res.data.data[0].substring(res.data.data[0].length - 1, res.data.data[0].length),
            })
            console.log(that.data.chooseres)
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})