;
(function ($) {

	var validate = {};
	validate.isset = function (string) {
		return !!string;
	};
	validate.empty = function (string) {
		if (!string) return true;
		return String(string).replace(/\s+/g, '').length == 0;
	};
	validate.require = function (str) {
		if (!str) return false;
		return !validate.empty(str);
	};
	validate.email = function (string) {
		return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(string);
	};
	validate.url = function (string) {
		return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i.test(string);
	};
	validate.date = function (string, preutc) {
		string = string.replace(/-/g, '/'); //for IE
		var date = Date.parse(string);
		if (isFinite(date)) {
			return true;
		}
		if (preutc) {
			var now = new Date();
			string = string.replace(/\d{4}/, now.getFullYear());
			date = Date.parse(string);
			return isFinite(date);
		}
		return false;
	};
	validate.time = function (string) {
		var checkValue = new RegExp("^/[0-2]{1}/[0-6]{1}:/[0-5]{1}/[0-9]{1}:/[0-5]{1}/[0-9]{1}");
		return checkValue.test(string);
	};
	validate.time12 = function (str) {
		return /^(1[0-2]|0?[1-9]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(str);
	};
	validate.time24 = function (str) {
		return /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(str);
	};
	validate.zip = function (string, plus4) {
		var pattern = plus4 ? /^\d{5}-\d{4}$/ : /^\d{5}$/;
		return pattern.test(string);
	};
	validate.phone = function (string) {
		return /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(string);
	};
	validate.integer = function (string) {
		return /^\-?\d+$/.test(string);
	};
	validate.numeric = function (string) {
		return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(string);
	};
	validate.ip = function (string) {
		return /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/.test(string);
	};
	validate.alpha = function (string) {
		return /^[a-z]$/i.test(string);
	};
	validate.alphaNumeric = function (string) {
		return /^[a-z0-9]$/i.test(string);
	};
	validate.lowercase = function (string) {
		return string.toLowerCase() == string;
	};
	validate.uppercase = function (string) {
		return string.toUpperCase() == string;
	};
	validate.minlength = function (string, length) {
		return string.length >= length;
	};
	validate.maxlength = function (string, length) {
		return string.length <= length;
	};
	validate.between = function (string, min, max) {
		return string.length >= min && string.length <= max;
	};
	validate.ns = function (str) {
		return (/[`~!@#$%\^&\*\+=\{\};"'<>\?,\.]/gim).test(str);
	};
	validate.password = function (str) {
		var res = '';
		if (str.length < 8 || str.length > 15) {
			res = '密码长度需要8～15位';
		}
		else if (!(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/).test(str)) {
			res = '密码需要由大小写字母与数字混合';
		}

		return res;
	};
	validate.url = function (str) {
		var re = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
		return re.test(str);
	};


	//复选框组作全选全非选的同步checkBox
	$.fn.syncCheckBoxGroup = function (expr, context) {
		var $t = this, $cxt = $(context || document);
		$cxt.on('change', expr, function () {
			var $chks = $(expr, $cxt);
			//console.log($chks, $chks.length, $chks.filter(':checked').length);
			$t.prop("checked", $chks.filter(':checked').length === $chks.length);
		});
		$t.on('change', function () {
			$(expr, $cxt).prop("checked", this.checked);
		});
		return this;
	};

	//复选框组作全选全非选的同步checkBox, 单向
	$.fn.checkBoxAll = function (expr, context) {
		var $t = this, $cxt = $(context || document);
		$cxt.on('change', expr, function () {
			if ($t.prop('checked')) {
				var $chks = $(expr, $cxt);
				//console.log($chks, $chks.length, $chks.filter(':checked').length);
				$t.prop("checked", $chks.filter(':checked').length === $chks.length);
			}
		});
		$t.on('change', function () {
			$(expr, $cxt).prop("checked", this.checked);
		});
		return this;
	};

	$.fn.iptError = function (sets) {
		var self = this, fn = sets;
		this.addClass('error').one('focus', function () {
			self.removeClass('error');
		});

		if (typeof sets === 'string') {
			fn = function (ipt) {
				opg.warn(sets, function () {
					ipt.focus()
				});
			}
		}

		if (typeof fn === 'function') {
			fn.call(this, this);
		}


		return this;
	};

	$.fn.fieldsToJson = function (rules) {
		var objResult = {}, a, form;

		if (this[0].tagName !== "FORM") {
			form = $(':input', this);
		}
		else {
			form = this;
		}
		//a = this.serializeArray() ;
		a = form.serializeArray();

		$.each(a, function () {
			var i = this.name.indexOf("[]"),
				isArr = !(i === -1),
				prop = isArr ? this.name.substr(0, i) : this.name,
				val = $.trim(this.value + "") || '';

			if (form.find('[name="' + this.name + '"]').eq(0).attr('type') === 'number') {
				val = +(val);
			}

			if (objResult[prop]) {
				if (!objResult[prop].push) objResult[prop] = [objResult[prop]];
				objResult[prop].push(val);
			}
			else {
				if (isArr) {
					objResult[prop] = [];
					objResult[prop][0] = val;
				}
				else objResult[prop] = val;
			}
		});

		form = null;

		//validate
		if (rules) {
			for (var ruleName in rules) {
				if (rules.hasOwnProperty(ruleName)) {
					var rule = rules[ruleName];

					if (rule.maxLength && !validate.maxlength(objResult[ruleName], rule.maxLength)) {
						$('[name=' + ruleName + ']', this).iptError(rule.name + '长度不可超过' + rule.maxLength + '字');
						return;
					}

					if (rule.minLength && !validate.minlength(objResult[ruleName], rule.minLength)) {
						$('[name=' + ruleName + ']', this).iptError(rule.name + '长度不可少于' + rule.maxLength + '字');
						return;
					}

					if (rule.require && validate.empty(objResult[ruleName])) {
						$('[name=' + ruleName + ']', this).iptError(rule.name + '不可为空');
						return;
					}

					if (rule.type === 'ns' && validate.ns(objResult[ruleName])) {
						$('[name=' + ruleName + ']', this).iptError(rule.name + '不可含特殊字符');
						return;
					}

					if (rule.type === 'password') {
						var rs = validate.password(objResult[ruleName]);
						if (rs) {
							$('[name=' + ruleName + ']', this).iptError(rs);
							return;
						}
					}
					else if (rule.type === 'int') {
						if (objResult[ruleName]) {
							if (!validate.integer(objResult[ruleName])) {
								$('[name=' + ruleName + ']', this).iptError(rule.name + '应该是整数');
								return;
							}
							objResult[ruleName] = +objResult[ruleName];
						}
					}
					else if (rule.type === 'number') {
						if (objResult[ruleName]) {
							if (!validate.numeric(objResult[ruleName])) {
								$('[name=' + ruleName + ']', this).iptError(rule.name + '应该是数字');
								return;
							}
							objResult[ruleName] = +objResult[ruleName];
						}
					}
					else if (rule.type === 'number[]') {
						if (objResult[ruleName] && objResult[ruleName].length && objResult[ruleName].push) {
							var nArr = objResult[ruleName], l = nArr.length;
							while (l--) {
								nArr[l] = +nArr[l];
							}
						}
					}
					else if (rule.type === 'date') {
						if (objResult[ruleName]) {
							if (!validate.date(objResult[ruleName])) {
								$('[name=' + ruleName + ']', this).iptError(rule.name + '不是合法的日期格式');
								return;
							}
						}
					}
					else if (rule.type === 'time') {
						if (objResult[ruleName]) {
							if (!validate.time24(objResult[ruleName])) {
								$('[name=' + ruleName + ']', this).iptError(rule.name + '不是合法的时间格式');
								return;
							}
						}
					}
					else if (rule.type === 'ip') {
						if (objResult[ruleName]) {
							if (!validate.ip(objResult[ruleName])) {
								$('[name=' + ruleName + ']', this).iptError(rule.name + '不是合法的IP格式');
								return;
							}
						}
					}

					else if (rule.type === 'url') {
						if (objResult[ruleName]) {
							if (!validate.url(objResult[ruleName])) {
								$('[name=' + ruleName + ']', this).iptError(rule.name + '不是合法的url格式');
								return;
							}
						}
					}


				}
			}
		}
		return objResult;
	};

	$.fn.recheckElement = function (_value) {
		var a = $.isArray(_value) ? _value : [_value];
		var element, isSingleSelector, isDroplist;

		if (this.prop("tagName").toLowerCase() == "select") //// select (droplist)
		{
			element = this[0].options;
			isSingleSelector = (this.attr("type") != "select-multiple");
			isDroplist = true;
		}
		else //// radio or checkbox
		{
			element = this;
			isSingleSelector = (this.attr("type") == "radio");
			isDroplist = false;
		}

		var elem, val, b;

		loopElement :
			for (var i = 0, l = element.length; i < l; i++) {
				elem = element[i];
				b = false;
				val = elem.value;

				searchArray :
					for (var j = 0, f = a.length; j < f; j++) {
						if (val == a[j]) {
							if (isSingleSelector) {
								isDroplist ? (elem.selected = true) : (elem.checked = true);
								break loopElement;
							}
							else {
								b = true;
								break searchArray;
							}
						}
					}
				// 用于设定新的选中状态，以及清除原来的选中状态
				isDroplist ? (elem.selected = b) : (elem.checked = b);
			}
		return this;
	};

	$.fn.jsonToFields = function (jsonObject) {
		this.find("input,select,textarea").each(function (index, elem) {

			if (!elem.name) {
				if (elem.id) this.name = this.id;
				else return; //Skip no name no id element
			}

			var elName = elem.name.split('[]')[0];

			var val = jsonObject[elName];

			if (elem.type == "checkbox" || elem.type == "radio") {
				var a = $.isArray(val) ? val : [val];
				for (var i = 0; i < a.length; i++) {
					if (a[i] == elem.value) {
						elem.checked = true;
						break;
					}
				}
			}
			else if (elem.type.indexOf("select-") != -1) {
				$(elem).recheckElement(val + '');
			}
			else if (elem.tagName.toLowerCase() == "textarea") {
				$(elem).val(val);
			}
			else {
				elem.value = val || '';
			}
		});

		return this;
	};


})(window.Zepto||window.jQuery);