define('pages/meetings/signin.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      qrCode: 'user/GetUserQrCode',
      'signIn!post': 'userscore/SignActivityOrMeeting',
      'evaluate!post': 'activity/EvaluateActivityOrMetting2',
      'getEvaluate!post': 'activity/GetEvaluate'
  });
  api_1.api.evaluate.set('onError', function (code, error, callback) {
      showRateResult(error);
  });
  //alert(api.qrCode.get('url'))
  //$('#qImg').attr('src' , api.qrCode.get('url'));
  var lng = util_1.Languages.package;
  var from = util_1.request['from'];
  var param = {
      activitycontentid: util_1.request['id'],
      sourcescore: util_1.request['score'],
      type: util_1.request['typeCode'],
      userId: 0
  };
  if (from == 'schedule') {
      $("#ttitle").html(lng.pageTitle2);
      if (util_1.Store.get('RoleName') === 'exhibition') {
          $("#ediv").hide();
      }
  }
  api_1.api.qrCode(function (data) {
      $('#qImg').attr('src', 'data:image/png;base64,' + data.qrCodeImg);
      param.userId = data.userId;
      // console.log(param.userId);
      // $('#imgSwitcher').click(function () {
      // 	api.signIn(param , data=>{
      // 		if(data === 'ok')
      // 			mui.alert(Languages.package.signSuccess , Languages.package.tip , Languages.package.okb);
      // 		else{
      // 			mui.alert(Languages.package.signDup , Languages.package.tip , Languages.package.okb);
      // 		}
      // 	});
      // });
  });
  $('#gTime').text(util_1.Languages.package.time + ": " + util_1.request['end']);
  var dateD = 3;
  var pStar = $('#pStar').on('click', 'span', function () {
      dateD = ~~$(this).data('d');
      starts.removeClass('mui-icon-star-filled').filter(":lt(" + dateD + ")").addClass('mui-icon-star-filled');
  });
  var starts = pStar.find('span');
  $('#btnSubmit').click(function () {
      // let op = {
      // 	"activityEvaluate":{
      // 		"activitycontentid": param.activitycontentid,
      // 		"rate": dateD,
      // 		"content": $('#content').val()
      // 	},
      // 	"userScore":{
      // 		"activitycontentid": param.activitycontentid,
      // 		"type": param.type,
      // 		"sourcescore": param.sourcescore
      // 	}
      // };
      var op = {};
      if (from == 'schedule') {
          op.SubscribeId = util_1.request['id'];
          op.activitycontentid = '0';
      }
      else {
          op.activitycontentid = util_1.request['id'];
          op.SubscribeId = '0';
      }
      op.rate = dateD;
      op.content = $('#content').val();
      op.barcode = util_1.Store.get('barcode');
      op.Type = util_1.request['typeCode'];
      op.Action = '1';
      //预约签到
      // if(request['isa']==1){
      // 	delete  op['activityEvaluate'].activitycontentid;
      // 	delete  op['userScore'].activitycontentid;
      // 	op['activityEvaluate']['subscribeid'] = param.activitycontentid;
      // 	op['userScore']['subscribeid'] = param.activitycontentid;
      // }
      //api.evaluate(op , showRateResult);
      api_1.api.evaluate(op, function (data) {
          if (data === 'ok')
              mui.alert(lng.rateSuc, lng.tip, lng.okb);
          else if (data === 'cannotevaluate')
              mui.alert(lng.unsigned, lng.tip, lng.okb);
          else if (data === 'hadevalute')
              mui.alert(lng.evaluated, lng.tip, lng.okb);
          else
              mui.alert(lng.unknownError, lng.tip, lng.okb);
      });
  });
  $('#returnback').click(function (e) {
      if (from == 'schedule') {
          location.href = '../schedule/mine.html';
      }
      else
          location.href = 'detail.html' + location.search;
  });
  var rateRes = {
      ok: util_1.Languages.package.rateSuc,
      unsigned: util_1.Languages.package.unsigned,
      evaluated: util_1.Languages.package.evaluated
  };
  function showRateResult(data) {
      mui.alert(rateRes[data] || util_1.Languages.package.unknownError, util_1.Languages.package.tip, util_1.Languages.package.okb);
  }
  function rebindresult() {
      var getobj = {};
      if (from == 'schedule') {
          getobj.SubscribeId = util_1.request['id'];
          getobj.activitycontentid = '0';
      }
      else {
          getobj.activitycontentid = util_1.request['id'];
          getobj.SubscribeId = '0';
      }
      getobj.barcode = util_1.Store.get('barcode');
      api_1.api.getEvaluate(getobj, function (data) {
          if (data.length > 0) {
              $('#content').val(data[0].content);
              dateD = parseInt(data[0].rate);
              starts.removeClass('mui-icon-star-filled').filter(":lt(" + dateD + ")").addClass('mui-icon-star-filled');
          }
      });
  }
  setTimeout(rebindresult, 1000);
  //# sourceMappingURL=/itb-dist/wap/pages/meetings/signin.js.map?__=1552030651276
  

});
