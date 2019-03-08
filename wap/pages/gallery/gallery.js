define('pages/gallery/gallery.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      getTypes: 'phototype/getallphototypes',
      getTags: 'photo/GetAllPhotoTitlesFront',
      'getPhotos!post': 'photo/QueryPhotosByTitleAndTypeId',
      getPhotosByTag: 'photo/QueryPhotosByTitle',
  });
  var typesArr;
  var tagArr = {};
  $.when(api_1.api.getTypes(function (data) {
      //typesArr = data as Array;
      typesArr = data.map(function (v) {
          return {
              value: v.id,
              text: v.name,
              children: v.childPhotoTypes.map(function (sub) {
                  return {
                      value: sub.id,
                      text: sub.name,
                  };
              }),
          };
      });
      console.log(typesArr);
  }), api_1.api.getTags(function (data) {
      for (var key in data) {
          var arr = [];
          for (var i = 0, l = data[key].length; i < l; i++) {
              arr[i] = {
                  value: 0,
                  text: data[key][i],
              };
          }
          tagArr[key] = arr;
      }
  })).then(function () {
      var picker1 = new mui.PopPicker({
          buttons: [util_1.Languages.package.cancel, util_1.Languages.package.ok],
      });
      var sel1 = document.getElementById('sel1');
      var picker2 = new mui.PopPicker({
          buttons: [util_1.Languages.package.cancel, util_1.Languages.package.ok],
      });
      var sel2 = document.getElementById('sel2');
      var picker3 = new mui.PopPicker({
          buttons: [util_1.Languages.package.cancel, util_1.Languages.package.ok],
      });
      var sel3 = document.getElementById('sel3');
      picker1.setData(typesArr);
      sel1.innerText = typesArr[0].text;
      sel1.addEventListener('tap', function (event) {
          picker1.show(function (items) {
              sel1.innerText = items[0].text;
              console.log(items);
              var opts2 = items[0].children || [];
              picker2.setData(opts2);
              sel2.innerText = opts2.length ? opts2[0].text : '';
              if (opts2.length) {
                  var opts3 = tagArr[opts2[0].value] || [];
                  picker3.setData(opts3);
                  var tag = opts3.length ? opts3[0].text : '';
                  sel3.innerText = tag;
                  getPhotos(opts2[0].value, tag);
              }
              else {
                  picker3.setData([]);
                  sel3.innerText = '';
                  getPhotos(items[0].value, '');
              }
              //返回 false 可以阻止选择框的关闭
              //return false;
          });
      }, false);
      picker2.setData(typesArr[0].children);
      sel2.innerText = typesArr[0].children[0].text;
      sel2.addEventListener('tap', function (event) {
          picker2.show(function (items) {
              sel2.innerText = items[0].text;
              var opts3 = tagArr[items[0].value] || [];
              picker3.setData(opts3);
              var tag = opts3.length ? opts3[0].text : '';
              sel3.innerText = tag;
              getPhotos(items[0].value, tag);
          });
      });
      picker3.setData(tagArr[typesArr[0].children[0].value]);
      var sel3Opt0 = tagArr[typesArr[0].children[0].value];
      if (sel3Opt0 && sel3Opt0.length) {
          sel3.innerText = sel3Opt0[0].text;
          getPhotos(typesArr[0].children[0].value, sel3Opt0[0].text);
      }
      else {
          getPhotos(typesArr[0].children[0].value, '');
      }
      sel3.addEventListener('tap', function (event) {
          picker3.show(function (items) {
              var tag = items[0].text;
              sel3.innerText = tag;
              var opt2 = picker2.getSelectedItems()[0];
              getPhotos(opt2.value, tag);
          });
      });
      //sel1.dispatchEvent(new CustomEvent( 'tap'));
  });
  var divTag = document.getElementById('tag');
  var divUl = document.getElementById('wholeWrapper');
  var imgRender = template.compile(document.getElementById('tpl-img').innerHTML);
  var imgRender2 = template.compile(document.getElementById('tpl-img2').innerHTML);
  function getPhotos(typeId, tag) {
      api_1.api.getPhotos({ typeId: typeId, title: tag }, function (data) {
          divTag.innerText = tag;
          divUl.innerHTML = imgRender(data);
      });
  }
  function searchPhoto(title) {
      api_1.api.getPhotosByTag({ title: title }, function (data) {
          divTag.innerText = title;
          var hash = {};
          data.forEach(function (img) {
              if (!hash[img.name]) {
                  hash[img.name] = [];
              }
              hash[img.name].push(img);
          });
          divUl.innerHTML = imgRender2(hash);
      });
  }
  document.getElementById('iptSearch').addEventListener('keypress', function (evt) {
      if (evt.keyCode === 13 && this.value) {
          searchPhoto(this.value);
      }
  }, false);
  //mui('#myScroll').scroll();
  document.getElementById('pDlInfo').innerText = util_1.Languages.package.downloadinfo;
  var fullSizeViewer = document.getElementById('fullSizeViewer');
  var imgFullSize = document.getElementById('imgFullSize');
  $('#wholeWrapper').on('click', 'img', function () {
      //console.log(this.alt);
      imgFullSize.src = this.getAttribute('data-src');
      fullSizeViewer.style.cssText = ';display:block;';
  });
  $('#closer').click(function () {
      fullSizeViewer.style.cssText = ';display:none;';
  });
  $(imgFullSize).on('click', function (e) {
      e.stopPropagation();
      //drawCanvas(imgFullSize.src , getCanvasData);
      // let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLLinkElement;
      // save_link.href = this.src ;
      // save_link.download = this.src.substr(this.src.lastIndexOf('/'));
      //
      // let event = document.createEvent('MouseEvents');
      // event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      // save_link.dispatchEvent(event);
  });
  /*
  function drawCanvas(imgSrc: string , fn:Function): HTMLCanvasElement {
      let canvas = document.createElement('canvas'),
          context = canvas.getContext('2d');
      let base_image = new Image();
      base_image.src = imgSrc;
      base_image.crossOrigin = "Anonymous";
      base_image.onload = function () {
          context.drawImage(base_image, base_image.width, base_image.height);
          fn(canvas);
      };
  
      return canvas;
  }
  
  
  function getCanvasData(canvas : HTMLCanvasElement) {
      // 图片导出格式
      let type = 'image/jpeg';
      let imgData = canvas.toDataURL(type);
  
  
      // 加工image data，替换mime type
      imgData = imgData.replace('image/jpeg', 'image/octet-stream');
  
      saveFile(imgData , 'ITB_' + (new Date()).getTime() + '.' + type);
  }
  
  let saveFile = function (data, filename) {
      let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLLinkElement;
      save_link.href = data;
      save_link.download = filename;
  
      let event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(event);
  };
  */
  //# sourceMappingURL=/itb-dist/wap/pages/gallery/gallery.js.map?__=1552030651276
  

});
