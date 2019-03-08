define('pages/logistics/applicationForBoothActivity/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'getboothactivitylistbyuser!post': 'Operation/Getboothactivitylistbyuser',
      'addboothactivity!post': 'Operation/Addboothactivity'
  });
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#starttime,#stoptime').each(function (i, elem) {
      $(elem).datetimepicker({
          timepicker: true,
          //closeOnDateSelect: true,
          format: 'Y-m-d H:m:s'
      });
  });
  function refreshtable() {
      var xparam = {};
      xparam.pageIndex = 0;
      xparam.currentlng = clng;
      tb.update(xparam);
  }
  //const permission = store.get('permission');
  var tbButtons = [];
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getboothactivitylistbyuser,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.booth, width: 50,
              src: 'standno',
          },
          {
              text: "" + lpg.exhibitor, width: 50,
              src: 'exhibitor',
          },
          {
              text: "" + lpg.company, width: 50,
              src: 'company',
          },
          {
              text: "" + lpg.eventtype, width: 100,
              src: 'eventtype',
              render: function (id, index, row) {
                  var html = "";
                  if (row.eventtype === '0') {
                      html += "<label>" + lpg.eventtypeoption[0] + "</label>";
                  }
                  else if (row.eventtype === '1') {
                      html += "<label>" + lpg.eventtypeoption[1] + "</label>";
                  }
                  return html;
              },
          },
          {
              text: "" + lpg.starttime, width: 100,
              src: 'starttime'
          },
          {
              text: "" + lpg.stoptime, width: 50,
              src: 'stoptime',
          },
          {
              text: "" + lpg.eventname, width: 100,
              src: 'eventname',
          },
          {
              text: "" + lpg.plannednum, width: 100,
              src: 'plannednum',
          },
          {
              text: "" + lpg.place, width: 100,
              src: 'place'
          },
          {
              text: "" + lpg.chargepeople, width: 100,
              src: 'chargepeople',
          },
          {
              text: "" + lpg.chargetel, width: 100,
              src: 'chargetel'
          },
          {
              text: "" + lpg.chargemail, width: 100,
              src: 'chargemail'
          },
          // {
          //     text: `${lpg.service}`, width: 100,
          //     src: 'service',
          //     render:function (id, index, row) {
          //         let html = ``;
          //         var t=row.service.split(',');
          //         for(var i=0;i<t.length;i++) {
          //             html += `${lpg.serviceoperation[t[i]]}<br/>`;
          //         }
          //
          //         return html;
          //     },
          // },
          // {
          //     text: `${lpg.serviceother}`, width: 100,
          //     src: 'serviceother'
          // },
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
              }
          }
      ],
      pagination: true,
  });
  // tb.tbody.on('click', '.btn-info', function () {
  //     let btn = $(this), letterid = btn.data('id');
  //     let param={};
  //     param.letterid=letterid;
  //     opg.api.createPDF(param, function (data) {
  //         window.open("../../../../../Upload/letter/"+data.filename,"_blank");
  //         tb.update();
  //     });
  // });
  $("#btnReset").click(function () {
      location.reload(true);
  });
  $("#btnSaveMain").click(function () {
      var param = $("#tbMain").fieldsToJson();
      var s = GetCheckBoxCheckedValue("servicecheckbox");
      param.servicecheckbox = s.join(',');
      param.serviceother = "";
      opg_ts_1.default.api.addboothactivity(param, function (data) {
          location.reload(true);
      });
  });
  refreshtable();
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
  //
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
  function GetCheckBoxCheckedValue(name) {
      var arr = new Array;
      $("input[type=checkbox][name=" + name + "]:checked").each(function () {
          arr.push($(this).val());
      });
      return arr;
  }
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/applicationForBoothActivity/index.js.map?__=1552033897847
  

});
