var ext = {};

ext.utils = require('./utils/');

ext.parse = require('./parse/');
ext.trace = require('./trace/');
ext.draw = require('./draw/');
ext.auto = require('./auto/');

window.ext = ext;

require('./tables');


/* todo разнести эту логику */
var utils = ext.utils;
var _draw = ext.draw;
var _trace = ext.trace;
var _log = utils.log;
var _elements = utils.elements;
var _stats = _draw.stats;
var _archive = _draw.archive;

utils.publish('init');
_elements.getTabInner('sets')
	.on('click', '#reset-stats', function() {
		if (confirm('Будет сброшена вся история\nПродолжить?')) {
			_log.set('messagesLog', '');
			_trace.messagesLog.splice(0, _trace.messagesLog.length);
			_log.set('archiveGroups', '');
			_archive.archiveGroups.splice(0, _archive.archiveGroups.length);
			_stats.drawStatsSide();
			_elements.getTabInner('group').html('');
		}
	});

