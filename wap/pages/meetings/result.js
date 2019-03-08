define('pages/meetings/result.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  var util_2 = require("js/util.ts");
  api_1.api({
      scanResult: 'activity/ScanSignResultList',
      'signIn!post': 'userscore/SignActivityOrMeeting2',
      'insertRemoteCameraMonitor!post': 'AppRemote/InsertRemoteCameraMonitor',
      'appscan!post': 'AppRemote/AppScanActivity'
  });
  var lng = util_2.Languages.package;
  var activityContentId = util_1.request['id'];
  var typeCode = util_1.request['typeCode'];
  api_1.api.appscan.set('onError', function (code, error, callback) {
      ;
  });
  api_1.api.signIn.set('onError', function (code, error, callback) {
      mui.alert(lng.signError, lng.tipTitle, lng.okb);
  });
  util_2.Store.set('taskvalue', '');
  var showresult = function () {
      api_1.api.scanResult({ activityContentId: activityContentId }, function (data) {
          $('#tbd').html(template('tpl', data));
      });
  };
  var appscan = function () {
      if (util_2.Store.get('taskvalue') != "") {
          var param = {};
          param.barcode = util_2.Store.get('barcode');
          param.taskvalue = util_2.Store.get('taskvalue');
          api_1.api.appscan(param, function (data) {
              if (data === 'ok') {
                  mui.alert(lng.signSuccess, lng.tipTitle, lng.okb);
                  util_2.Store.set('taskvalue', '');
              }
              else if (data === 'cannotsign')
                  mui.alert(lng.signNotOpen, lng.tipTitle, lng.okb);
              else if (data === 'nothing')
                  ;
              else
                  mui.alert(lng.signError, lng.tipTitle, lng.okb);
              showresult();
          });
      }
  };
  $("#turnback").click(function () {
      location.href = 'detail.html' + location.search;
  });
  var timesta = "";
  var nonce = "";
  var signa = "";
  function initpage() {
      //alert(window.location.href);
      $.ajax({
          type: "POST",
          dataType: "html",
          async: false,
          url: "../../../../WechatAPI/QRcodeApi.aspx",
          data: {
              url: window.location.href
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
                  alert(res.errMsg);
              });
          }
      });
  }
  ;
  initpage();
  wx.ready(function () {
  });
  $("#imgQR").click(function () {
      var userDevice = util_2.Store.get('userDevice');
      //console.log(userDevice);
      if (userDevice === "app") {
          var paramx = {};
          paramx.taskvalue = "staffsign|" + typeCode + "|" + activityContentId + "|0"; //活动类型，活动id，活动动作
          paramx.barcode = util_2.Store.get('barcode');
          util_2.Store.set('taskvalue', paramx.taskvalue);
          api_1.api.insertRemoteCameraMonitor(paramx, function (data) {
              //no need to do anything,one job to solve the all return value.
          });
      }
      else if (userDevice === "wechat") {
          wx.scanQRCode({
              needResult: 1,
              desc: 'scanQRCode desc',
              success: function (res) {
                  var param = {};
                  param.Type = typeCode;
                  param.barcode = res.resultStr;
                  param.ActivityContentId = activityContentId;
                  param.Action = '0';
                  api_1.api.signIn(param, function (data) {
                      if (data === 'ok')
                          mui.alert(lng.signSuccess, lng.tipTitle, lng.okb);
                      else if (data === 'cannotsign')
                          mui.alert(lng.signNotOpen, lng.tipTitle, lng.okb);
                      else
                          mui.alert(lng.signError, lng.tipTitle, lng.okb);
                      showresult();
                  });
              }
          });
      }
      else if (userDevice === "browser") {
          // let param={};
          //
          // param.Type=typeCode;
          // param.barcode="1111111";
          // param.ActivityContentId=activityContentId;
          // param.Action='0';
          //
          // api.signIn(param, data => {
          //     if(data === 'ok')
          //         mui.alert(lng.signSuccess , lng.tipTitle,lng.okb);
          //     else if(data==='cannotsign')
          //         mui.alert(lng.signNotOpen , lng.tipTitle,lng.okb);
          //     else
          //         mui.alert(lng.signError , lng.tipTitle, lng.okb);
          //
          //     showresult();
          // });
          mui.alert(lng.tipMessage2, lng.tipTitle, lng.okb);
      }
  });
  showresult();
  var userDevice = util_2.Store.get('userDevice');
  if (userDevice === "app") {
      setInterval(appscan, 1500);
  }
  //# sourceMappingURL=/itb-dist/wap/pages/meetings/result.js.map?__=1552030651276
  

});
