define('pages/meetings/list.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      'getMeetingList!POST': 'activity/QueryActivitysByType',
      'getActivityList!POST': 'activity/QueryActivitysByType',
      getSub: 'activity/GetActivityContentsByActivityIdFront'
  });
  var divActivity = document.getElementById('divActivity');
  var divConference = document.getElementById('divConference');
  var render = template.compile(document.getElementById('tpl-activity').innerHTML);
  var renderSub = template.compile(document.getElementById('tpl-sub').innerHTML);
  api_1.api.getMeetingList({ informationType: 0, pageInde: 0, pageSize: 1000 }, function (data) {
      data.results.typeCode = 0;
      divConference.innerHTML = render(data.results);
  });
  api_1.api.getActivityList({ informationType: 1, pageInde: 0, pageSize: 1000 }, function (data) {
      data.results.typeCode = 1;
      divActivity.innerHTML = render(data.results);
  });
  /*$('#whole').on('click', '.bTitle', function () {
      window['getSub'](this);
  });*/
  window['getSub'] = function (id, typeCode) {
      var cont = $("#bCont_" + id);
      if (!cont.html()) {
          api_1.api.getSub({ id: id }, function (data) {
              data.lng = util_1.Languages.package;
              data.typeCode = typeCode;
              cont.html(renderSub(data));
          });
          cont.on('click', '.cont', function () {
              location.href = './detail.html' + this.getAttribute('data-search');
          });
      }
  };
  //# sourceMappingURL=/itb-dist/wap/pages/meetings/list.js.map?__=1552030651276
  

});
