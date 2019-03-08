define('pages/content/activity/GuestManage.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var lng = Languages_1.Languages.package;
  var guestForm = $("<form class=\"guestForm\">\n\t<label>" + lng.guestName + "&nbsp;<input type=\"text\" name=\"name\" style=\"float: right\"></label><br>\n\t<label>" + lng.guestTitle + "&nbsp;<input type=\"text\" name=\"title\" style=\"float: right\"></label><br>\n\t<label>" + lng.guestBrief + "&nbsp;<input type=\"text\" name=\"intro\" style=\"float: right\"></label>\n</form>");
  var GuestManage = /** @class */ (function () {
      function GuestManage(subjectId) {
          var _this = this;
          opg_1.default.api({
              getGuest: 'activity/GetActivityHonoredGuestByActivityContnetId?activityContentId=' + subjectId,
              'addGuest!post': 'activity/AddActivityHonoredGuest',
              'delGuest': 'activity/DelActivityHonoredGuest',
          });
          this.activityId = subjectId;
          var $tb = $('<table></table>');
          $tb.appendTo('body');
          this.tb = opg_1.default($tb).table({
              api: opg_1.default.api.getGuest,
              titleBar: {
                  title: lng.guest,
                  buttons: [
                      { id: 'btnAddGuest', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lng.add },
                  ],
              },
              columns: [
                  {
                      text: lng.guestName, width: 200,
                      src: 'name',
                  },
                  {
                      text: lng.guestTitle, width: 200,
                      src: 'title',
                  },
                  {
                      text: lng.guestBrief,
                      src: 'intro',
                  },
                  {
                      text: lng.process,
                      src: 'id',
                      width: 100,
                      render: function (id) { return "<button data-id=\"" + id + "\" class=\"btn-mini btn-danger btnDel\">" + lng.del + "</button>"; },
                  },
              ],
          });
          //add
          $('#btnAddGuest').click(function () {
              _this.addGuest();
          });
          //delete
          this.tb.tbody.on('click', '.btnDel', function (e) {
              var btn = $(e.target), id = ~~btn.data('id');
              _this.deleteGuest(id);
          });
      }
      GuestManage.prototype.addGuest = function () {
          var that = this;
          guestForm[0].reset();
          var pop = opg_1.default.confirm(guestForm, function () {
              var param = guestForm.fieldsToJson({
                  name: {
                      require: true,
                      type: 'ns',
                      name: lng.guestName,
                  },
              });
              if (param) {
                  param.activityContentId = that.activityId;
                  opg_1.default.api.addGuest(param, function (data) {
                      that.tb.update();
                      pop.close();
                  });
              }
              return true;
          });
      };
      GuestManage.prototype.deleteGuest = function (id) {
          var that = this;
          var pop = opg_1.default.confirm(lng.deleteGuestConfirm, function () {
              opg_1.default.api.delGuest({ id: id }, function (data) {
                  that.tb.update();
                  pop.close();
              });
              return true;
          });
      };
      return GuestManage;
  }());
  exports.default = GuestManage;
  //# sourceMappingURL=/itb-dist/pc/pages/content/activity/GuestManage.js.map?__=1552033897847
  

});
