define('ts/ui/Tree.ts', function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });
  var DisplayOject_1 = require("ts/ui/DisplayOject.ts");
  var Combo_1 = require("ts/ui/Combo.ts");
  var store_1 = require("ts/util/store.ts");
  function searchData(data, id) {
      var v;
      for (var i = 0, l = data.length; i < l; i++) {
          var obj = data[i];
          if (obj.id == id) {
              v = obj;
              break;
          }
          else if (obj.childMenus && obj.childMenus.length) {
              v = searchData(obj.childMenus, id);
              if (v) {
                  break;
              }
          }
      }
      return v;
  }
  var Tree = /** @class */ (function (_super) {
      __extends(Tree, _super);
      function Tree(jq, cfg) {
          var _this = this;
          cfg = $.extend({
              text: 'name',
              value: 'id',
              cache: true,
              childSrc: 'children',
          }, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      /*set rootName(name: string) {
       this.jq.find('folder:eq(0)').text(name);
       }*/
      Tree.prototype.init = function (jq, cfg) {
          var _this = this;
          _super.prototype.init.call(this, jq, cfg);
          this.cache = cfg.cache;
          this.treeName = cfg.name;
          this.childSrc = cfg.childSrc;
          this._store = new store_1.LocalStore(false);
          this._cachedExpandedLeaf = {};
          if (!this.treeName) {
              this.treeName = "" + this.guid;
              if (this.cache)
                  this.cache = false;
          }
          this.treeName = "tree_" + this.treeName;
          if (this.cache) {
              this._cachedExpandedLeaf = this._store.get(this.treeName) || {};
          }
          console.log('aaa', this._cachedExpandedLeaf);
          if (!cfg.template) {
              if (cfg.cmd === 'checkAll') {
                  cfg.template = '<label><input id="' + this.treeName + 'Chk_${id}" name="' + this.treeName + 'Chk" type="checkbox" value="${' + cfg.value + '}"> ${' + cfg.text + '}</label>';
              }
              else if (cfg.cmd === 'checkOne') {
                  cfg.template = '<label><input id="' + this.treeName + 'Rd_${id}" name="' + this.treeName + 'Rd" type="radio" value="${' + cfg.value + '}"> ${' + cfg.text + '}</label>';
              }
              else {
                  cfg.template = '${' + cfg.text + '}';
              }
          }
          var self = this;
          this.cmd = cfg.cmd;
          if (cfg.root) {
              this.root = $('<ul></ul>');
              var node = $("<ul class=\"filetree treeview rootUl\"><li class=\"last rootLi\">\n\t\t\t\t\t\t\t<span class=\"folder rootSp\">" + cfg.root + "</span>\n\t\t\t\t\t\t</li></ul>");
              node.find('li').append(this.root);
              node.appendTo(this.jq);
          }
          else {
              this.root = $('<ul class="filetree treeview"></ul>');
              this.jq.append(this.root);
          }
          this.selectedItemId = -1;
          //this.currentData = null;
          this.currentLi = null;
          this.render = cfg.render;
          this.template = '<li id="' + this.treeName + 'Li_${id}" class="${id:=_getLiClass}" data-id="${id}" data-depth="${id:=_getDepth}">${id:=_getDiv}<span id="' + this.treeName + 'Sp_${id}" data-id="${id}" data-depth="${id:=_getDepth}" class="sp ${id:=_getSpClass}">' + cfg.template + '</span>${id:=_getUl}</li>';
          //this.render = {};
          this.root.on('click', '.hitarea', function (e) {
              e.stopImmediatePropagation();
              //
              //
              var $div = $(this);
              $div.toggleClass('collapsable-hitarea expandable-hitarea').siblings('ul').toggle();
              var $li = $div.parent(), leafId = $li.data('id');
              $li.toggleClass('collapsable expandable');
              if (self.cache) {
                  if (leafId in self._cachedExpandedLeaf) {
                      delete self._cachedExpandedLeaf[leafId];
                  }
                  else {
                      self._cachedExpandedLeaf[leafId] = 1;
                  }
                  self._store.set(self.treeName, self._cachedExpandedLeaf);
              }
              if (this.className.indexOf('last') > -1) {
                  $div.toggleClass('lastCollapsable-hitarea lastExpandable-hitarea');
                  $li.toggleClass('lastExpandable lastCollapsable');
              }
          });
          this.jq.on('click', '.sp', function (e) {
              var sp = $(this);
              if (self.selectedItemId != sp.data('id')) {
                  self.prevItemId = self.selectedItemId;
                  self.prevLi = self.currentLi;
                  self.selectedItemId = sp.data('id');
                  self.currentLi = sp.closest('li');
                  if (self.prevLi)
                      self.prevLi.find('.sp').removeClass('selected');
                  sp.addClass('selected');
                  if (typeof self.onSelect === 'function')
                      self.onSelect(e);
              }
          });
          //combo
          if (cfg.combo) {
              var textField = $(cfg.combo.textField);
              textField.after(this.jq);
              this.combo = new Combo_1.Combo(textField, {
                  allowBlank: cfg.combo.allowBlank,
                  target: this.jq.addClass('treeField-combo'),
                  valueField: cfg.combo.valueField,
              });
              this.textSrc = cfg.text;
              this.valueSrc = cfg.value;
              this.jq.on('click', '.sp', function () {
                  _this.syncData(_this.getSelectedData());
              });
              //
              if (cfg.combo.closeOnClick) {
                  this.jq.on('click', function () { return _this.combo.close(); });
              }
          }
      };
      Tree.prototype.getSelectedData = function () {
          //console.log(this.data , this.selectedItemId);
          return searchData(this.data, this.selectedItemId);
      };
      Tree.prototype.bindData = function (data) {
          var json = data, list;
          if ($.isArray(data)) {
              list = data;
          }
          else {
              list = data[this.arrSrc];
          }
          this.add(list, 1);
          this.prevItemId = this.selectedItemId;
          this.selectedItemId = -1;
          this.prevLi = this.currentLi;
          this.currentLi = null;
          this.data = list;
          this.bindHandler(json);
          return this;
      };
      Tree.prototype.add = function (data, addedTimes, parent) {
          var self = this, parentUl;
          console.warn(self._cachedExpandedLeaf);
          if (!parent) {
              parentUl = this.root;
          }
          else {
              parentUl = $('#' + self.treeName + 'Ul_' + parent.id);
          }
          var renders = {
              _getDepth: function () { return addedTimes; },
              _getDiv: function (id, i, row) {
                  if ((row[self.childSrc] && row[self.childSrc].length) || row.hasChildren) {
                      var cls = void 0;
                      if (id in self._cachedExpandedLeaf) {
                          cls = 'hitarea collapsable-hitarea';
                          if ((i + 1) === data.length)
                              cls += ' lastCollapsable-hitarea';
                      }
                      else {
                          cls = 'hitarea expandable-hitarea';
                          if ((i + 1) === data.length)
                              cls += ' lastExpandable-hitarea';
                      }
                      return '<div class="' + cls + '"></div>';
                  }
                  return '';
              },
              _getUl: function (id, i, row) {
                  if ((row[self.childSrc] && row[self.childSrc].length) || row.hasChildren) {
                      var style = (id in self._cachedExpandedLeaf) ? '' : ' style="display: none;"';
                      return "<ul id=\"" + self.treeName + ("Ul_" + id + "\" data-parent=\"" + id + "\" " + style + "></ul>");
                  }
                  return '';
              },
              _getLiClass: function (id, i, row) {
                  var cls = '';
                  if ((row[self.childSrc] && row[self.childSrc].length) || row.hasChildren) {
                      if (id in self._cachedExpandedLeaf) {
                          cls = 'collapsable';
                          if ((i + 1) === data.length)
                              cls += ' lastCollapsable';
                      }
                      else {
                          cls = 'expandable';
                          if ((i + 1) === data.length)
                              cls += ' lastExpandable';
                      }
                  }
                  else {
                      if ((i + 1) === data.length)
                          cls = 'last';
                  }
                  return cls;
              },
              _getSpClass: function (id, i, row) {
                  return ((row[self.childSrc] && row[self.childSrc].length) || row.hasChildren) ? 'folder' : 'file';
              },
          };
          if (self.render) {
              for (var ky in self.render) {
                  if (!(ky in renders)) {
                      renders[ky] = self.render[ky];
                  }
              }
          }
          parentUl.bindList({
              list: data,
              template: self.template,
              itemRender: renders,
              mode: (parent ? 'append' : 'html'),
          });
          addedTimes++;
          for (var i = 0, l = data.length; i < l; i++) {
              var node = data[i];
              if (node[self.childSrc] && node[self.childSrc].length) {
                  this.add(node[self.childSrc], addedTimes, node);
              }
          }
          if (this.cmd === 'checkAll') {
              parentUl.find('.folder').each(function (x, span) {
                  var sp = $(span), ul = sp.siblings('ul');
                  sp.find(':checkbox').checkBoxAll(':checkbox', ul);
              });
          }
      };
      Tree.prototype.findObjectById = function (id) {
          return searchData(this.data, id);
      };
      Tree.prototype.syncData = function (data) {
          console.log(data);
          this.combo.setValue(data[this.textSrc], data[this.valueSrc]);
      };
      return Tree;
  }(DisplayOject_1.AjaxDisplayObject));
  exports.default = Tree;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/Tree.js.map?__=1552033897847
  

});
