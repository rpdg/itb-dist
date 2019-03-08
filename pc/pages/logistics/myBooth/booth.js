define('pages/logistics/myBooth/booth.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Combo_1 = require("ts/ui/Combo.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'getboothdesignlistbyuser!post': 'Operation/Getboothdesignlistbyuser',
      'addboothdesign!post': 'Operation/Addboothdesign',
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
      var designpic = "";
      for (var i = 0; i < param.icon.length; i++) {
          if (param.icon[i] != "") {
              designpic += param.icon[i] + "|";
          }
      }
      param.designpic = designpic;
      opg_ts_1.default.api.addboothdesign(param, function (data) {
          location.reload(true);
      });
  });
  Combo_1.Combo.makeClearableInput($('#logoPicture'), $({}));
  var tdLogo = $('#td_logoPicture');
  $('.ipt-eraser', '#tdUploadLogo').on('click', function () {
      tdLogo.empty();
  });
  var uploadForm = $("<form>\n\t\t\t\t\t\t<input name=\"file\" type=\"file\" accept=\"image/jpg,image/jpeg,image/png,image/tif,image/gif\">\n\t\t\t\t</form>");
  $('#btnUploadDialog1,#btnUploadDialog2,#btnUploadDialog3,#btnUploadDialog4,#btnUploadDialog5,#btnUploadDialog6,#btnUploadDialog7,#btnUploadDialog8').click(function () {
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
  function initForm() {
      var param1 = {};
      param1.pageIndex = 0;
      param1.pageSize = 10;
      param1.currentlng = clng;
      opg_ts_1.default.api.getboothdesignlistbyuser(param1, function (data) {
          if (data.results.length > 0) {
              if (data.results[0].createtime != null && data.results[0].createtime != undefined && data.results[0].createtime != "")
                  $("#applyinfo").html(data.results[0].createtime + "   " + ("" + lpg.statustype[0]));
              if (data.results[0].approvaltime != null && data.results[0].approvaltime != undefined && data.results[0].approvaltime != "") {
                  if (data.results[0].status == "1")
                      $("#approvalinfo").html("<label style='color:green'>" + data.results[0].approvaltime + "   " + ("" + lpg.statustype[1]) + "</label>");
                  else if (data.results[0].status == "2")
                      $("#approvalinfo").html("<label style='color:red'>" + data.results[0].approvaltime + "   " + ("" + lpg.statustype[2]) + "</label>");
              }
              $("#standno").val(data.results[0].standno);
              $("#exhibitor").val(data.results[0].exhibitor);
              $("#company").val(data.results[0].company);
              $("#contactperson").val(data.results[0].contactperson);
              $("#contacttel").val(data.results[0].contacttel);
              $("#designremark").val(data.results[0].designremark);
              var picarray = data.results[0].designpic.split('|');
              for (var j = 0; j < picarray.length; j++) {
                  if (picarray[j] != null && picarray[j] != undefined && picarray[j] != "") {
                      if (j == 0) {
                          $("#logoPicture").val(picarray[j]);
                          $("#td_logoPicture").html("<img src=\"" + picarray[j] + "\" class=\"spanimg\" />");
                      }
                      else {
                          $("#logoPicture" + (j + 1).toString()).val(picarray[j]);
                          $("#td_logoPicture" + (j + 1).toString()).html("<img src=\"" + picarray[j] + "\" class=\"spanimg\" />");
                      }
                  }
              }
              $("#btnSaveMain").attr("disabled", "true");
          }
          else {
              $("#btnSaveMain").removeAttr("disabled");
          }
      });
  }
  initForm();
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
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/myBooth/booth.js.map?__=1552033897847
  

});
