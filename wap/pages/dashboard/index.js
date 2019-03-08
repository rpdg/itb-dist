define('pages/dashboard/index.ts', function(require, exports, module) {

  "use strict";
  /// <reference path="../../@types/jquery.d.ts" />
  /// <reference path="../../@types/mui.d.ts" />
  /// <reference path="../../@types/custom.d.ts" />
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      GetCurrentUserInfoAndMenus: 'user/GetCurrentUserInfoAndMenus?type=0',
      getSlider: 'canrousel/GetAllCanrousel',
      getMsg: 'message/GetMessageByCurrentUser?status=0',
      exhibition_getList: 'exhibition/GetExhibitionWishlist',
      exhibition_result: 'exhibition/ExhibitionWishListResult',
      buyer_getList: 'buyer/GetBuyerWishlist',
      buyer_result: 'buyer/BuyerWishListResult',
      'signIn!post': 'userscore/SignActivityOrMeeting3',
      'insertRemoteCameraMonitor!post': 'AppRemote/InsertRemoteCameraMonitor',
      getBuyerByBarCode: 'buyer/GetBuyerByBarCode',
      'appscan!post': 'AppRemote/AppScanAppointment'
  });
  api_1.api.getMsg(function (data) {
      if (data.length) {
          $('#myMsg1,#myMsg2').text(data.length);
      }
      else {
          $('#myMsg1,#myMsg2').hide();
      }
  });
  api_1.api.exhibition_getList.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'GetExhibitionWishlist_Error01') {
          //location.href = __uri('../wishlist/result.html?isemployee=1');
          var errorMsg = util_1.Languages.package['tips'];
          mui.alert("" + errorMsg, '', util_1.Languages.package['okb']);
      }
  });
  api_1.api.appscan.set('onError', function (code, error, callback) {
      ;
  });
  api_1.api.signIn.set('onError', function (code, error, callback) {
      var errorMsg = util_1.Languages.package['signError'];
      mui.alert("" + errorMsg, '', util_1.Languages.package['okb']);
  });
  util_1.Store.set('taskvalue', '');
  var menu = {
      Wishlist: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/woshouW.png?__=a766712',
          //url: __uri('../wishlist/wishlist.html'),
          url: '/itb-dist/wap/pages/wishlist/result.html?__=81352a7',
      },
      Schedule: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/calendarW.png?__=473429b',
          url: '/itb-dist/wap/pages/schedule/mine.html?__=7057d97',
      },
      MessageBox: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/messageBoxW.png?__=d2c5a45',
          url: '/itb-dist/wap/pages/msgBox/msgBox.html?__=eef8418',
      },
      Exhibitors: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/exhibitorsW.png?__=e739ce2',
          url: '/itb-dist/wap/pages/exhibitors/old_exhibitors1.html?__=ae06b37',
      },
      Buyers: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/buyersW.png?__=6bf7746',
          url: '/itb-dist/wap/pages/buyer/old_buyer1.html?__=0e5d293',
      },
      Events: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/networkingW.png?__=5164272',
          url: '/itb-dist/wap/pages/meetings/activity.html?__=83c031c',
      },
      Meetings: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/hyW.png?__=e055eec',
          url: '/itb-dist/wap/pages/meetings/meeting.html?__=57a9b4d',
      },
      Navigation: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/navigationW.png?__=0a9f339',
          url: '/itb-dist/wap/pages/navigation/index.html?__=9482ac8',
      },
      PhotoGallary: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/photoGallaryW.png?__=54578cb',
          url: '/itb-dist/wap/pages/gallery/gallery.html?__=06681f6',
      },
      ExhibitionInfo: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/infoW.png?__=87adcd7',
          url: '/itb-dist/wap/pages/exhibitionInfo/index.html?__=db9afb6',
      },
      Press: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/pressW.png?__=b8a7df9',
          url: '/itb-dist/wap/pages/press/index.html?__=d49300e',
      },
      News: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/newsW.png?__=77c2d6b',
          url: '/itb-dist/wap/pages/news/list.html?__=7cfa739',
      },
      MyScore: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/operationW.png?__=902c6e3',
          url: '/itb-dist/wap/pages/wishlist/score.html?__=c75efc5',
      },
      Moments: {
          icon: '/itb-dist/wap/pages/dashboard/assets/icon/momentsW.png?__=53f19c0',
          url: '/itb-dist/wap/pages/moments/index.html?__=a625a86',
      },
  };
  var barcode = "";
  api_1.api.GetCurrentUserInfoAndMenus(function (data) {
      util_1.Store.set('RoleName', data.RoleName);
      var curStage = data.stage[0].name.toLowerCase();
      util_1.Store.set('Stage', curStage);
      barcode = data.barcode;
      util_1.Store.set('barcode', barcode);
      if (curStage === 'wishlist') {
          var act = data.RoleName === 'exhibition' ? 'exhibition' : 'buyer';
          var wCounts_1 = 0, checkFull_1 = true;
          $.when(api_1.api[act + '_getList'](function (res) {
              wCounts_1 = res.length;
          }), api_1.api[act + '_result'](function (res) {
              checkFull_1 = (res.selected - res.max === 0);
          })).then(function () {
              var isWishListBack = util_1.request['s'] && util_1.request['s'] === 'wishlist';
              var sessionStore = window['sessionStorage'];
              if (!isWishListBack) {
                  isWishListBack = sessionStore.getItem('iswishlistback') || 0;
              }
              else {
                  sessionStore.setItem('iswishlistback', '1');
              }
              if (wCounts_1 > 0 && !checkFull_1 && !isWishListBack) {
                  //location.href = menu.Wishlist.url;
                  location.href = '/itb-dist/wap/pages/wishlist/wishlist.html?__=1552033839575';
              }
              else {
                  bindMainData(data);
              }
          });
      }
      else {
          bindMainData(data);
      }
      if (data.RoleName.toLowerCase() === 'buyer') {
          api_1.api.getBuyerByBarCode({ barcode: barcode }, function (data) {
              if (data[0].N == "Fully") {
                  var lmMyTrip2 = document.getElementById('lmMyTrip2');
                  lmMyTrip2.style.cssText += ';display:list-item';
                  lmMyTrip2.addEventListener('tap', function () {
                      location.href = '/itb-dist/wap/pages/operation/mytrip.html?__=9bf0e70';
                  });
                  $("#lmMyTrip2").show();
              }
              if (data[0].N == "Fully" || data[0].N == "Partial") {
                  if (curStage === 'pre-exhibiton' || curStage === 'exhibition') {
                      var lmMyScore2 = document.getElementById('lmMyScore2');
                      lmMyScore2.style.cssText += ';display:list-item';
                      lmMyScore2.addEventListener('tap', function () {
                          location.href = '/itb-dist/wap/pages/score/myScore.html?__=3f8da76';
                      });
                      $("#lmMyScore2").show();
                  }
                  else {
                      var lmMyScore2 = document.getElementById('lmMyScore2');
                      lmMyScore2.style.cssText += ';display:list-item';
                      lmMyScore2.addEventListener('tap', function () {
                          location.href = '/itb-dist/wap/pages/score/description.html?__=4156521';
                      });
                      $("#lmMyScore2").show();
                  }
              }
          });
      }
  });
  function bindMainData(data) {
      if (data.RoleName === 'exhibition') {
          $('.onlyForExhibition').show();
          $('.notForExhibition').hide();
      }
      var userMenu = data.menus;
      userMenu.forEach(function (v, i) {
          var m = menu[v.name];
          if (m) {
              v.icon = m.icon;
              v.url = m.url;
              v.txt = util_1.Languages.package['menu'][v.name];
              if (v.name === 'Wishlist') {
                  var curStage = data.stage[0].name.toLowerCase();
                  if (curStage === 'wishlist') {
                      v.url = '/itb-dist/wap/pages/wishlist/wishlist.html?__=5e365e2';
                  }
              }
          }
          else {
              console.warn(v);
              v.icon = '';
              v.url = '';
              v.txt = v.name;
          }
      });
      document.getElementById('board').innerHTML = template('tpl-board', data);
      //document.getElementById('spUserName').innerText = Store.get('userName');
      document.getElementById('spUserName').innerText = "" + data.company;
      document.getElementById('spRealName').innerText = data.firstName + " " + data.lastName;
  }
  mui('#myScroll').scroll();
  //console.log(Languages.package['leftMenu']);
  //document.getElementById('ulLeftMenu').innerHTML = template('tpl-leftMenu', Languages.package);
  mui('#swLgn').switch();
  document.getElementById('swLgn').addEventListener('toggle', function (event) {
      util_1.Store.set(util_1.Languages.configKeyName, util_1.Languages.names[util_1.Languages.current === util_1.Languages.names.cn ? 'en' : 'cn']);
      setTimeout(function () {
          location.href = './index.html?t=' + (new Date()).getTime();
      }, 300);
  });
  /*document.getElementById('lmWishList').addEventListener('tap', function () {
      location.href = '../wishlist/result.html';
  });*/
  document.getElementById('lmMyBooth').addEventListener('tap', function () {
      mui.alert(util_1.Languages.package['leftMenu'].tipMessage, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
  });
  document.getElementById('lmMyTrip').addEventListener('tap', function () {
      mui.alert(util_1.Languages.package['leftMenu'].tipMessage, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
  });
  document.getElementById('lmMyInfo').addEventListener('tap', function () {
      location.href = '/itb-dist/wap/pages/msgBox/msgBox.html?__=1552033839575';
  });
  document.getElementById('lmAnnouncement').addEventListener('tap', function () {
      location.href = '/itb-dist/wap/pages/announcement/announcement.html?__=f033769';
  });
  //document.getElementById('lmScanQr').addEventListener('tap', function () {
  //location.href = __uri('/pages/meetings/signin.html');
  //});
  /*document.getElementById('lmNotice').addEventListener('tap', function () {
      location.href = __uri('/pages/msgBox/msgBox.html');
  });*/
  document.getElementById('lmSignOut').addEventListener('tap', function () {
      var sessionStore = window['sessionStorage'];
      sessionStore.removeItem('iswishlistback');
      location.href = '../login/index.html' + util_1.Store.get('locationsearch');
  });
  var timesta = "";
  var nonce = "";
  var signa = "";
  function initpage() {
      $.ajax({
          type: "POST",
          dataType: "html",
          async: false,
          url: "../../../../WechatAPI/QRcodeApi.aspx",
          data: {
              url: window.location.href.split('#')[0]
          },
          complete: function () { },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              //alert("errorinfo of XMLHttpRequest:" + XMLHttpRequest + "|errorinfo of textStatus:" + textStatus + "|errorinfo of errorThrown:" + errorThrown);
          },
          success: function (data) {
              //alert(JSON.stringify(data));
              //var json = JSON.parseJSON(data);
              //alert(json);
              //eval("(" + data + ")"); //
              var jsons = "[" + data + "]";
              var json = JSON.parse(jsons)[0];
              timesta = json.timestamp;
              nonce = json.nonceStr;
              signa = json.signature;
              //alert(json);
              //alert(json.url);
              // alert(timesta);
              // alert(nonce);
              // alert(signa);
              wx.config({
                  debug: false,
                  appId: 'wx701c4fa884a556e8',
                  timestamp: timesta,
                  nonceStr: nonce,
                  signature: signa,
                  jsApiList: [
                      'scanQRCode'
                  ]
              });
              wx.error(function (res) {
                  //alert(res.errMsg);
              });
          }
      });
  }
  ;
  initpage();
  wx.ready(function () {
  });
  document.getElementById('scanQRCode').addEventListener('click', function () {
      var nowrole = util_1.Store.get('RoleName');
      if (nowrole === 'guest')
          return;
      var userDevice = util_1.Store.get('userDevice');
      //console.log(userDevice);
      if (userDevice === "app") {
          var paramx = {};
          paramx.taskvalue = "dashboard|2|0|0"; //活动类型2，活动编号为0（不看ActivityContentID，只看Subscribe_id），动作类型为0签到
          paramx.barcode = barcode;
          util_1.Store.set('taskvalue', paramx.taskvalue);
          api_1.api.insertRemoteCameraMonitor(paramx, function (data) {
              //no need to do anything,one job to solve the all return value.
          });
      }
      else if (userDevice === "wechat") {
          wx.scanQRCode({
              needResult: 1,
              desc: 'scanQRCode desc',
              success: function (res) {
                  //location.href = 'page/ScanRecord/ScanResult.html?code='+res.resultStr;
                  // let param: any = {
                  //     sourcescore: 1000,
                  //     type: 0, //签到
                  // };
                  //
                  // param.userId = res[0].id;
                  var param = {};
                  param.Type = '2';
                  param.mybarcode = barcode;
                  param.barcode = res.resultStr;
                  param.ActivityContentId = 0;
                  param.Action = '0';
                  api_1.api.signIn(param, function (data) {
                      if (data === 'ok')
                          mui.alert(util_1.Languages.package.signSuccess, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
                      else if (data === 'cannotsign') {
                          mui.alert(util_1.Languages.package.signNotOpen, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
                      }
                      else if (data === 'repeat') {
                          mui.alert(util_1.Languages.package.noRepeat, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
                      }
                      else if (data === 'badwalkin') {
                          mui.alert(util_1.Languages.package.badwalkin, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
                      }
                      else if (data === 'okwalkin') {
                          mui.alert(util_1.Languages.package.okwalkin, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
                      }
                      else {
                          mui.alert(util_1.Languages.package.signError, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
                      }
                  });
              }
          });
      }
      else if (userDevice === "browser") {
          // let param={};
          //
          // param.Type='2';
          // param.mybarcode=barcode;
          // param.barcode='2000223';
          // param.ActivityContentId=0;
          // param.Action='0';
          //
          // api.signIn(param, data => {
          //     if(data === 'ok')
          //         mui.alert(Languages.package.signSuccess , Languages.package['leftMenu'].tipTitle,Languages.package['leftMenu'].okb);
          //     else if(data==='cannotsign') {
          //         mui.alert(Languages.package.signNotOpen , Languages.package['leftMenu'].tipTitle,Languages.package['leftMenu'].okb);
          //     }
          //     else if(data==='repeat') {
          //         mui.alert(Languages.package.noRepeat , Languages.package['leftMenu'].tipTitle,Languages.package['leftMenu'].okb);
          //     }
          //     else if(data==='badwalkin') {
          //         mui.alert(Languages.package.badwalkin , Languages.package['leftMenu'].tipTitle,Languages.package['leftMenu'].okb);
          //     }
          //     else if(data==='okwalkin') {
          //         mui.alert(Languages.package.okwalkin , Languages.package['leftMenu'].tipTitle,Languages.package['leftMenu'].okb);
          //     }
          //     else{
          //         mui.alert(Languages.package.signError , Languages.package['leftMenu'].tipTitle, Languages.package['leftMenu'].okb);
          //     }
          // });
          mui.alert(util_1.Languages.package['leftMenu'].tipMessage2, util_1.Languages.package['leftMenu'].tipTitle, util_1.Languages.package['leftMenu'].okb);
      }
  });
  var appscan = function () {
      if (util_1.Store.get('taskvalue') != "") {
          var param = {};
          param.barcode = barcode;
          param.taskvalue = util_1.Store.get('taskvalue');
          api_1.api.appscan(param, function (data) {
              if (data === 'ok') {
                  var errorMsg = util_1.Languages.package['signSuccess'];
                  mui.alert("" + errorMsg, '', util_1.Languages.package['okb']);
                  util_1.Store.set('taskvalue', '');
              }
              else if (data === 'cannotsign') {
                  var errorMsg = util_1.Languages.package['signNotOpen'];
                  mui.alert("" + errorMsg, '', util_1.Languages.package['okb']);
              }
              else if (data === 'repeat') {
                  var errorMsg = util_1.Languages.package['noRepeat'];
                  mui.alert("" + errorMsg, '', util_1.Languages.package['okb']);
              }
              else if (data === 'badwalkin') {
                  var errorMsg = util_1.Languages.package['badwalkin'];
                  mui.alert("" + errorMsg, '', util_1.Languages.package['okb']);
              }
              else if (data === 'okwalkin') {
                  var errorMsg = util_1.Languages.package['okwalkin'];
                  mui.alert("" + errorMsg, '', util_1.Languages.package['okb']);
              }
              else if (data === 'nothing')
                  ;
              else {
                  var errorMsg = util_1.Languages.package['signError'];
                  mui.alert("" + errorMsg, '', util_1.Languages.package['okb']);
              }
          });
      }
  };
  var userDevice = util_1.Store.get('userDevice');
  if (userDevice === "app") {
      setInterval(appscan, 1500);
  }
  //# sourceMappingURL=/itb-dist/wap/pages/dashboard/index.js.map?__=1552033839575
  

});
