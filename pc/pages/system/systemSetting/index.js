define('pages/system/systemSetting/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var AddMatchMeeting_1 = require("pages/system/systemSetting/AddMatchMeeting.ts");
  var api_1 = require("ts/util/api.ts");
  opg_ts_1.default.api({
      getMeetings: 'focusonmeetinginfo/GetAllFocusOnMeetingInfo',
      delMeetingById: 'focusonmeetinginfo/DelFocusOnMeetingInfo',
      delMeetingUserById: 'focusonmeetinginfo/DelFocusOnMeetingBuyerByBarCode',
      getBuyersAndExhibitorsByMeetingId: 'focusonmeetinginfo/GetFocusOnMeetingBuyerAndExhibitionsById',
      autoMatchExhibitor: 'focusonmeetinginfo/AutoMatchFocusOnMeetingExhibtions',
      newAutoMatchExhibitor: 'focusonmeetinginfo/NewAutoMatchFocusOnMeetingExhibtions',
      autoMatchSchedule: 'focusonmeetinginfo/AutoMatchScheduleExhibitions',
      'addBuyers!post': 'focusonmeetinginfo/AddFocusOnMeetingInfoBuyers',
  });
  var lng = Languages_1.Languages.package;
  var key = '';
  var focusOnMeetingInfoId = '';
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  var tb = opg_ts_1.default('#tb1').table({
      api: opg_ts_1.default.api.getMeetings,
      titleBar: {
          title: lng.moduleName,
          buttons: [{ id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lng.add }],
      },
      columns: [
          {
              text: lng.serial,
              width: 60,
              src: 'id',
          },
          {
              text: lng.startTime,
              width: 150,
              src: 'begindate',
          },
          {
              text: lng.endTime,
              width: 150,
              src: 'enddate',
          },
          {
              text: lng.meetingName,
              src: 'name',
          },
          {
              text: lng.place,
              src: 'address',
          },
          {
              text: "" + lng.process,
              src: 'id',
              width: 200,
              render: function (id, i, row) {
                  //console.log(arr);
                  return "\n\t\t\t\t\t\t<button class=\"btn-mini btn-info btnSelect\" data-id=\"" + id + "\">" + lng.select + "</button> \n\t\t\t\t\t\t<button class=\"btn-mini btn-danger btnDelete\" data-id=\"" + id + "\">" + lng.del + "</button>\n\t\t\t\t";
              },
          },
      ],
      pagination: false,
  });
  $('#btnAdd').click(function () {
      new AddMatchMeeting_1.default(lng, tb);
  });
  var matchingDiv = $('#matchingDiv');
  tb.tbody.on('click', '.btnSelect', function () {
      tb.tbody.find('.greenTr').removeClass('greenTr');
      var tr = $(this).closest('tr');
      tr.addClass('greenTr');
      focusOnMeetingInfoId = this.getAttribute('data-id');
      matchingDiv.hide();
      api_1.api.getBuyersAndExhibitorsByMeetingId({ focusOnMeetingInfoId: focusOnMeetingInfoId }, function (data) {
          key = '';
          tbBuyer.update(data.buyers);
          tbExhibitor.update(data.exhibtions);
          matchingDiv.show();
      });
  });
  tb.tbody.on('click', '.btnDelete', function () {
      var btn = this;
      opg_ts_1.default.confirm(lng.askDeleteMeeting, function () {
          api_1.api.delMeetingById({ id: btn.getAttribute('data-id') }, function (res) {
              tb.update();
          });
      });
  });
  var tbBuyer = opg_ts_1.default('#tbBuyer').table({
      data: [],
      titleBar: {
          title: lng.buyer,
          buttons: [{ id: 'btnFilterBuyer', className: 'btn-warning', html: "" + lng.filterBuyers }],
      },
      columns: [
          {
              text: "" + lng.roleName,
              src: 'begintime',
              width: 100,
              render: function (a) { return lng.buyer; },
          },
          {
              text: "" + lng.barcode,
              src: 'barcode',
              width: 150,
          },
          {
              text: "" + lng.name,
              src: 'name',
              width: 150,
          },
          {
              text: "" + lng.company,
              src: 'company',
          },
          {
              text: lng.process,
              src: 'barcode',
              width: 90,
              render: function (barcode, index, row) {
                  return "<button data-barcode=\"" + barcode + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-danger btnDelete\">" + lng.del + "</button>  ";
              },
          },
      ],
  });
  tbBuyer.tbody.on('click', '.btnDelete', function (e) {
      var btn = this;
      opg_ts_1.default.confirm(lng.askDeleteMeetingUser, function () {
          api_1.api.delMeetingUserById({ barcode: e.target.getAttribute('data-barcode'), focusOnMeetingInfoId: focusOnMeetingInfoId }, function (res) {
              opg_ts_1.default.ok(lng.processSuccess);
              api_1.api.getBuyersAndExhibitorsByMeetingId({ focusOnMeetingInfoId: focusOnMeetingInfoId }, function (data) {
                  tbBuyer.update(data.buyers);
                  tbExhibitor.update(data.exhibtions);
              });
          });
      });
  });
  var buyerPage = '/itb-dist/pc/pages/system/systemSetting/filterBuyer.html?__=0fe15dc';
  $('#btnFilterBuyer').click(function () {
      var pop = opg_ts_1.default.popTop("<iframe src=\"" + buyerPage + "\">", {
          title: lng.filterBuyers,
          width: 900,
          height: 600,
          buttons: {
              ok: {
                  text: lng.add,
                  className: 'btn-success',
                  onClick: function (i, iframe) {
                      var buyers = iframe.getTbData();
                      if (buyers.length) {
                          api_1.api.addBuyers({ key: key, buyers: buyers }, function (res) {
                              key = res;
                              api_1.api.getBuyersAndExhibitorsByMeetingId({ focusOnMeetingInfoId: focusOnMeetingInfoId }, function (data) {
                                  tbBuyer.update(data.buyers);
                                  tbExhibitor.update(data.exhibtions);
                              });
                              pop.close();
                          });
                      }
                      console.log(buyers);
                      return true;
                  },
              },
              cancel: lng.cancel,
          },
      });
  });
  var tbExhibitor = opg_ts_1.default('#tbExhibitor').table({
      data: [],
      titleBar: {
          title: lng.exhibition,
      },
      columns: [
          {
              text: "" + lng.roleName,
              src: 'begintime',
              width: 100,
              render: function (a) { return lng.exhibition; },
          },
          {
              text: "" + lng.barcode,
              src: 'barcode',
              width: 150,
          },
          {
              text: "" + lng.name,
              src: 'name',
              width: 150,
          },
          {
              text: "" + lng.company,
              src: 'company',
          },
      ],
  });
  $('#btnAutoMatchExhibitor').click(function () {
      if (!key) {
          opg_ts_1.default.warn(lng.warnAddUser);
      }
      else {
          api_1.api.autoMatchExhibitor({ focusOnMeetingInfoId: focusOnMeetingInfoId, key: key }, function (res) {
              opg_ts_1.default.ok(lng.processSuccess);
              api_1.api.getBuyersAndExhibitorsByMeetingId({ focusOnMeetingInfoId: focusOnMeetingInfoId }, function (data) {
                  tbBuyer.update(data.buyers);
                  tbExhibitor.update(data.exhibtions);
              });
          });
      }
  });
  $('#newAutoMatchExhibitor').click(function () {
      if (!key) {
          opg_ts_1.default.warn(lng.warnAddUser);
      }
      else {
          api_1.api.newAutoMatchExhibitor({ focusOnMeetingInfoId: focusOnMeetingInfoId, key: key }, function (res) {
              opg_ts_1.default.ok(lng.processSuccess);
              api_1.api.getBuyersAndExhibitorsByMeetingId({ focusOnMeetingInfoId: focusOnMeetingInfoId }, function (data) {
                  tbBuyer.update(data.buyers);
                  tbExhibitor.update(data.exhibtions);
              });
          });
      }
  });
  $('#btnAutoMatchSchedule').click(function () {
      api_1.api.autoMatchSchedule(function (res) {
          opg_ts_1.default.ok(lng.processSuccess);
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/system/systemSetting/index.js.map?__=1552033897847
  

});
