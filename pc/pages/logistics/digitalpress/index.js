define('pages/logistics/digitalpress/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'getdigitalpresslistbyuser!post': 'Operation/Getdigitalpresslistbyuser',
      'adddigitalpress!post': 'Operation/Adddigitalpress',
      'upload!UPLOAD': 'upload/files'
  });
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  $("#btnReset").click(function () {
      location.reload(true);
  });
  $("#btnSaveMain").click(function () {
      var param = $("#tbMain").fieldsToJson();
      var pressfile = "";
      for (var i = 0; i < param.icon.length; i++) {
          if (param.icon[i] != "") {
              pressfile += param.icon[i] + "|";
          }
      }
      param.pressfile = pressfile;
      opg_ts_1.default.api.adddigitalpress(param, function (data) {
          location.reload(true);
      });
  });
  // Combo.makeClearableInput($('#logoPicture'), $({}));
  // let tdLogo = $('#td_logoPicture');
  // $('.ipt-eraser' , '#tdUploadLogo').on('click' , function () {
  //     tdLogo.empty();
  // });
  var uploadForm = $("<form>\n\t\t\t\t\t\t<input name=\"file\" type=\"file\" accept=\"application/pdf\">\n\t\t\t\t</form>");
  $('#btnUploadDialog1,#btnUploadDialog2').click(function () {
      var target = $(this).data('target');
      uploadForm[0].reset();
      var pop = top.opg.confirm(uploadForm, function () {
          var formData = new FormData(uploadForm[0]);
          opg_ts_1.default.api.upload(formData, function (data) {
              var iptCoverPicture = $("#" + target);
              iptCoverPicture.val(data[0].downloadLink);
              var tdCover = $("#td_" + target);
              tdCover.html("<img src=\"" + data[0].downloadLink + "\" class=\"spanimg\" />");
              pop.close();
          });
          return true;
      }, {
          title: "" + lpg.upload,
          width: 200,
          height: 50,
          buttons: {
              ok: "" + lpg.upload,
              cancel: "" + lpg.cancel,
          },
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
  //tbButtons.push({id: 'btnServiceApply', className: 'btn-warning', html: `${lpg.serviceApply}`});
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getdigitalpresslistbyuser,
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
              text: "" + lpg.presstitleen, width: 50,
              src: 'presstitleen'
          },
          {
              text: "" + lpg.presstitlecn, width: 50,
              src: 'presstitlecn',
          },
          {
              text: "" + lpg.pic0, width: 100,
              src: 'pressfile',
              render: function (id, index, row) {
                  var html = "";
                  var f = row.pressfile.split('|');
                  for (var i = 0; i < f.length; i++) {
                      if (i == 0 && f[i] != "")
                          html += "<a href=\"" + f[i] + ("\" target=\"_blank\">" + lpg.pic + "</a>&emsp;&emsp;");
                      else if (i == 1 && f[i] != "")
                          html += "<a href=\"" + f[i] + ("\" target=\"_blank\">" + lpg.pic2 + "</a>");
                  }
                  return html;
              }
          },
          {
              text: "" + lpg.createtime, width: 50,
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
  refreshtable();
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
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/digitalpress/index.js.map?__=1552033897847
  

});
