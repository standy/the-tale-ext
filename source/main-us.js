﻿// ==UserScript==
// @name        {{name}}
// @description {{description}}
// @author      {{author}}
// @version     {{version}}
// @include     http://the-tale.org/game/
// @run-at      document-end
// @license     MIT License
// @icon
// ==/UserScript==

(function (window, undefined) {
	var css = "{{css}}";
	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} else {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			heads[0].appendChild(node);
		} else {
			document.documentElement.appendChild(node);
		}
	}

	var $ = window.$;
	var jQuery = window.$;
	var pgf = window.pgf;

	window.ext = (function (_ext) {
		"use strict";

		//= include ext-core.js

		//= include ext-parser.js

		//= include ext-print.js

		_ext.publish('init');
		return _ext;
	})(window.ext || {});

	//= include tables.js

	injectDone();
})((typeof this.unsafeWindow !== 'undefined') ? this.unsafeWindow : window);