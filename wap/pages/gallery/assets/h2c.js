function drawCanvas(imgSrc) {
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');
	base_image = new Image();
	base_image.src = imgSrc;
	base_image.onload = function () {
		context.drawImage(base_image, base_image.width, base_image.height);
	};

	return canvas;
}


function getCanvasData(canvas) {
	// 图片导出格式
	var type = 'image/jpeg';
	var imgData = canvas.toDataURL(type);


	// 加工image data，替换mime type
	imgData = imgData.replace('image/jpeg', 'image/octet-stream');

	return imgData;
}


/**
 * 在本地进行文件保存
 * @param  {String} data     要保存到本地的图片数据
 * @param  {String} filename 文件名
 */
var saveFile = function (data, filename) {
	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	save_link.href = data;
	save_link.download = filename;

	var event = document.createEvent('MouseEvents');
	event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	save_link.dispatchEvent(event);
};

// 下载后的问题名
var filename = 'ITB_' + (new Date()).getTime() + '.' + type;
// download
saveFile(imgData, filename);