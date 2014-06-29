window.ext = (function(_ext) {
	"use strict";

	//= include ext-core.js
	${ext_core_js}

	//= include ext-parser.js
	${ext_parser_js}

	//= include ext-print.js
	${ext_print_js}

	return _ext;
})(window.ext || {});


//= include tables.js
${tables_js}
