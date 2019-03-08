define('pages/content/media/addSubject.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var lpg = Languages_1.Languages.package;
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'addSubject!post': 'mediaexhibtion/AddMediaExhibtionInfoContent',
      'updateSubject!post': 'mediaexhibtion/UpMediaExhibtionInfoContent',
      getSubject: 'mediaexhibtion/GetMediaExhibtionInfoContentById',
      'upload!UPLOAD': 'upload/files',
  });
  var mediaExhibtionInfoId = opg_ts_1.default.request['id'];
  var subjectId = opg_ts_1.default.request['subId'];
  var fileName;
  var imgUrl;
  var editor;
  var editorWrap = $("<script type=\"text/plain\" id=\"myEditor1\"></script>");
  var format = {
      0: lpg.pureText,
      1: lpg.picture,
      2: lpg.link,
      3: lpg.richText,
      4: lpg.attachment,
  };
  var formatType;
  var panel = $('#panel');
  var selType = $('#selType').on('change', function () {
      if (editor) {
          editor.destroy();
          editor = null;
          location.reload(true);
      }
      formatType = ~~selType.val();
      switch (formatType) {
          case 0:
              panel.html("<textarea style=\"width: 460px; height: 230px;\"></textarea>");
              break;
          case 1:
              var btn = $("<button class=\"btn-mini btn-warning\">upload</button>");
              var form_1 = $("<form><input name=\"file\" type=\"file\" accept=\"image/jpg,image/jpeg,image/png\"></form>");
              var p_1 = $('<p></p>');
              panel.empty().append(form_1).append(btn).append(p_1);
              btn.one('click', function () {
                  var formData = new FormData(form_1[0]);
                  opg_ts_1.default.api.upload(formData, function (data) {
                      p_1.html("<img src=\"" + data[0].downloadLink + "\" style=\"max-height: 100px;\"/>");
                      imgUrl = data[0].downloadLink;
                  });
              });
              break;
          case 2:
              panel.html("<form>\n\t\t\t\t\t\t<input name=\"text\" type=\"text\" placeholder=\"" + lpg.linkText + "\" style=\"width: 100%;\"/>\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\t<input name=\"url\" type=\"text\" placeholder=\"" + lpg.linkHref + "\" style=\"width: 100%;margin-top: 0.5em;\"/>\n\t\t\t\t</form>");
              break;
          case 3:
              //else{
              panel.empty().append(editorWrap);
              editor = UE.getEditor('myEditor1', {
                  //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
                  toolbars: [['FullScreen', 'Source', 'Undo', 'Redo', 'Bold', 'Italic', 'Underline', '|', 'forecolor', 'backcolor']],
                  //focus时自动清空初始化时的内容
                  autoClearinitialContent: true,
                  //关闭字数统计
                  wordCount: false,
                  //关闭elementPath
                  elementPathEnabled: false,
                  //默认的编辑区域高度
                  initialFrameHeight: 230,
                  lang: Languages_1.Languages.current === 'cn' ? 'zh-cn' : 'en',
              });
              //}
              break;
          case 4:
              var btn2 = $("<button class=\"btn-mini btn-warning\">upload</button>");
              var form2_1 = $("<form><input name=\"file\" type=\"file\" accept=\"*/*\"></form>");
              var p2_1 = $('<p></p>');
              panel.empty().append(form2_1).append(btn2).append(p2_1);
              btn2.one('click', function () {
                  var formData2 = new FormData(form2_1[0]);
                  opg_ts_1.default.api.upload(formData2, function (data) {
                      var fileFullName = form2_1.find('input').val();
                      fileName = fileFullName.substr(fileFullName.lastIndexOf('\\') + 1);
                      imgUrl = data[0].downloadLink;
                      p2_1.html("<a href=\"" + data[0].downloadLink + "\">" + fileName + "</a>");
                  });
              });
              break;
          default:
              panel.empty();
      }
  });
  if (subjectId) {
      opg_ts_1.default.api.getSubject({ id: subjectId }, function (data) {
          //debugger;
          $('#lbFormatType').jsonToFields(data[0]);
          selType.trigger('change').prop('disabled', true);
          formatType = ~~selType.val();
          if (formatType == 0) {
              panel.find('textarea').text(data[0].content);
          }
          else if (formatType == 3) {
              setTimeout(function () {
                  editor.setContent(data[0].content);
              }, 2000);
          }
      });
  }
  window['doSave'] = function (pop, listSubjects) {
      var content;
      switch (formatType) {
          case 0:
              content = panel.find('textarea').eq(0).val();
              break;
          case 1:
              content = "<img src=\"" + imgUrl + "\" style=\"max-height: 100px;\"/>";
              break;
          case 2:
              var txt_1, url_1;
              panel.find('input').each(function (i, ele) {
                  var val = ele.value;
                  if (!val) {
                      return opg_ts_1.default.warn(lpg.nullInputWarn);
                  }
                  if (i === 0)
                      txt_1 = val;
                  else
                      url_1 = val;
              });
              content = "<a href=\"" + url_1 + "\">" + txt_1 + "</a>";
              break;
          case 3:
              content = editor.getContent();
              break;
          case 4:
              content = "<a href=\"" + imgUrl + "\">" + fileName + "</a>";
              break;
          default:
              opg_ts_1.default.warn(lpg.plsSelect);
              return;
      }
      if (!content) {
          opg_ts_1.default.warn(lpg.nullInputWarn);
      }
      else {
          if (subjectId) {
              opg_ts_1.default.api.updateSubject({ content: content, id: subjectId }, function (data) {
                  listSubjects();
                  pop.close();
              });
          }
          else {
              var param = { formatType: formatType, content: content, mediaExhibtionInfoId: mediaExhibtionInfoId };
              console.log(param);
              opg_ts_1.default.api.addSubject(param, function (data) {
                  //ulSubjects.append(`<li>${content}</li>`);
                  listSubjects();
                  pop.close();
              });
          }
      }
      return true;
  };
  //# sourceMappingURL=/itb-dist/pc/pages/content/media/addSubject.js.map?__=1552033897847
  

});
