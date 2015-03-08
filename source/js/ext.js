var ext = window.ext = {};

require('./ext-core.js');
require('./ext-parser.js');
require('./ext-print.js');
require('./ext-auto.js');

ext.publish('init');

require('./tables.js');
