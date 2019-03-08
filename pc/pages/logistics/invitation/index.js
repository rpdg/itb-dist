define('pages/logistics/invitation/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'getletterlistbyuser!post': 'Operation/Getletterlistbyuser',
      'addLetter!post': 'Operation/AddLetter',
      'createPDF!post': 'Operation/CreatePDF'
  });
  var lpg = Languages_1.Languages.package;
  var form = $('#tbSearch');
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#dateofbirth,#passportvalidity,#starttime,#stoptime').each(function (i, elem) {
      $(elem).datetimepicker({
          timepicker: false,
          //closeOnDateSelect: true,
          format: 'Y-m-d'
      });
  });
  $("#iknow").change(function () {
      if ($("#iknow").is(':checked')) {
          $("#btnSaveMain").removeAttr("disabled");
      }
      else {
          $("#btnSaveMain").attr("disabled", "true");
      }
  });
  $("#btnReset").click(function () {
      location.reload(true);
  });
  $("#btnSaveMain").click(function () {
      var param = $("#tbMain").fieldsToJson();
      if (param) {
          if (param.starttime < '2019-05-12' || param.starttime > '2019-05-18' || param.stoptime < '2019-05-12' || param.stoptime > '2019-05-18' || param.starttime > param.stoptime) {
              opg_ts_1.default.confirm(lpg.errortimeinfo, function () {
              });
          }
          else
              opg_ts_1.default.api.addLetter(param, function (data) {
                  opg_ts_1.default.confirm(lpg.submitinfo, function () {
                      location.reload(true);
                  });
              });
      }
  });
  function refreshtable() {
      var xparam = {};
      xparam.pageIndex = 0;
      xparam.currentlng = clng;
      tb.update(xparam);
  }
  //const permission = store.get('permission');
  var tbButtons = [];
  //tbButtons.push({id: 'btnServiceApply', className: 'btn-warning', html: `${lpg.serviceApply}`});
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getletterlistbyuser,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.countryname, width: 50,
              src: 'countryname',
          },
          {
              text: "" + lpg.username, width: 50,
              src: 'username',
          },
          {
              text: "" + lpg.gender, width: 50,
              src: 'gender',
          },
          {
              text: "" + lpg.dateofbirth, width: 100,
              src: 'dateofbirth',
              render: function (id, index, row) {
                  var html = formatdate(row.dateofbirth);
                  return html;
              }
          },
          {
              text: "" + lpg.position, width: 50,
              src: 'position',
          },
          {
              text: "" + lpg.nationality, width: 100,
              src: 'nationality',
          },
          {
              text: "" + lpg.passportnumber, width: 100,
              src: 'passportnumber',
          },
          {
              text: "" + lpg.passportvalidity, width: 100,
              src: 'passportvalidity',
              render: function (id, index, row) {
                  var html = formatdate(row.passportvalidity);
                  return html;
              }
          },
          {
              text: "" + lpg.employer, width: 100,
              src: 'employer',
          },
          {
              text: "" + lpg.residence, width: 100,
              src: 'strattime',
              render: function (id, index, row) {
                  var html = formatdate(row.starttime) + '--' + formatdate(row.stoptime);
                  return html;
              }
          },
          {
              text: "" + lpg.createtime, width: 100,
              src: 'createtime',
          },
          {
              text: "" + lpg.status, width: 50,
              src: 'status',
              render: function (id, index, row) {
                  var html = "";
                  if (row.status === '0') {
                      html += "<label class=\"apply\">" + lpg.statustype[0] + "</label>";
                  }
                  else if (row.status === '1') {
                      html += "<label class=\"agree\">" + lpg.statustype[1] + "</label>";
                  }
                  else if (row.status === '2') {
                      html += "<label class=\"deny\">" + lpg.statustype[2] + "</label>";
                  }
                  return html;
              },
          },
          {
              text: "" + lpg.operation, width: 100,
              src: 'invitationid',
              render: function (id, index, row) {
                  var html = "";
                  if (row.status === '1')
                      html = "<button data-id=\"" + row.invitationid + "\" data-name=\"" + row.invitationid + "\" class=\"btn-mini btn-info\" >" + lpg.operationbutton + "</button> ";
                  return html;
              },
          }
      ],
      pagination: true,
  });
  refreshtable();
  //const addPage = __uri('/pages/logistics/invitation/letterlist.html');
  tb.tbody.on('click', '.btn-info', function () {
      var btn = $(this), letterid = btn.data('id');
      var param = {};
      param.letterid = letterid;
      opg_ts_1.default.api.createPDF(param, function (data) {
          window.open(data.filename, '_blank');
          tb.update();
      });
  });
  // $("#btnServiceApply").click(function(){
  //
  //     let pop = opg.popTop(`<iframe src="${addPage}"></iframe>` , {
  // 		title: `${lpg.serviceApplylist}`,
  // 		btnMax: false,
  // 		width: 900,
  // 		height: 400,
  //         buttons: {
  //             send: {
  //                 className: 'btn-success',
  //                 text: lpg.sendApply,
  //                 onClick: function (i, ifr) {
  //
  //                     let resource = ifr.getLetterFill();
  //                     if (resource) {
  //                         if(resource.starttime<'2018-05-13' || resource.starttime>'2018-05-19' || resource.stoptime<'2018-05-13' || resource.stoptime>'2018-05-19' || resource.starttime>resource.stoptime) {
  //                             ifr.parent.opg.confirm(lpg.errortimeinfo,function() {
  //
  //                             });
  //                         }
  //                         else
  //                             sendLetter(resource, pop);
  //                     }
  //
  //                     return true;
  //                 }
  //             },
  //             cancel: lpg.cancel
  //         },
  // 		onClose: function () {
  //
  // 		}
  // 	});
  // });
  // function sendLetter(resource, pop: PopUp) {
  // 	opg.api.addLetter(resource, function (data) {
  // 		pop.close();
  //
  // 		refreshtable();
  // 	});
  // }
  function formatdate(mydate) {
      var newdate;
      var data = new Date(mydate);
      var year = data.getFullYear(); //获取年
      var month = data.getMonth() + 1; //获取月
      var day = data.getDate(); //获取日
      if (month < 10) {
          if (day < 10)
              newdate = year + "-0" + month + "-0" + day;
          else
              newdate = year + "-0" + month + "-" + day;
      }
      else {
          if (day < 10)
              newdate = year + "-" + month + "-0" + day;
          else
              newdate = year + "-" + month + "-" + day;
      }
      return newdate;
  }
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/invitation/index.js.map?__=1552033897847
  

});
