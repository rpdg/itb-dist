define('pages/msgBox/msgBox.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  api_1.api({
      getUnreadList: 'message/GetMessageByCurrentUser',
      getReadList: 'message/GetMessageByCurrentUser',
      setRead: 'message/UpMessageStatusByMsgId?status=1',
  });
  var render = template.compile(document.getElementById('tpl-msg').innerHTML);
  api_1.api.getUnreadList({ status: 0 }, function (data) {
      document.getElementById('ulUnread').innerHTML = render(data);
  });
  api_1.api.getReadList({ status: 1 }, function (data) {
      document.getElementById('ulRead').innerHTML = render(data);
  });
  $('#divUnread').on('tap', '.mui-navigate-right', function () {
      api_1.api.setRead({ msgId: this.getAttribute('data-id') });
  });
  //# sourceMappingURL=/itb-dist/wap/pages/msgBox/msgBox.js.map?__=
  

});
