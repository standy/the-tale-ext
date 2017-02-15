/* global chrome */

;(function(files, styles) {
	function injectStyle(href) {
		var th = document.getElementsByTagName('head')[0];
		var s = document.createElement('link');
		s.setAttribute('rel', 'stylesheet');
		s.setAttribute('href', chrome.extension.getURL(href));
		th.appendChild(s);
	}
	function injectCode(code, callback) {
		var th = document.getElementsByTagName('head')[0];
		var s = document.createElement('script');
		s.textContent = code;
		th.appendChild(s);
		if (callback) {
			s.onreadystatechange = s.onload = callback;
		}
		th.removeChild(s);
	}
	function getFileText(file, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', file, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				if (callback) {
					callback(xhr.responseText);
				}
			}
		};
		xhr.send();
	}

	var filesText = [];
	var count = 0;
	for (var i = 0; i < files.length; i++) {
		getFileText(chrome.extension.getURL(files[i]), (function(index) {
			return function(text) {
				filesText[index] = text;
				count++;
				if (count === files.length) {
					filesText.push('if (window.injectDone) injectDone();window.extPath="' + chrome.extension.getURL('') + '";');
//					filesText.push('console.timeEnd("ext");')
					injectCode(filesText.join(';\n'));
				}
			};
		}(i)));
	}
	for (var j = 0; j < styles.length; j++) {
		injectStyle(styles[j]);
	}
})(['/js/ext.js'], ['/css/main.css']);
