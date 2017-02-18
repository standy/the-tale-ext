import $ from 'jquery';
import log from '../utils/log';
import {publish} from '../utils/pubsub';
import {elements} from '../utils/elements';
import {setsGame} from './sets-game';


export function getSettingInput(key) {
	return $('input[data-name="' + key + '"]');
}

const deps = {};
function checkDependences(key, value, isDisabled) {
	if (deps[key]) {
		deps[key].forEach(function(keyName) {
			if (keyName) {
				getSettingInput(keyName).closest('.input-wrap').toggleClass('disabled', isDisabled || !value);//.prop('disabled', !value);
			}
		});
	}
}

export const settingsValues = log.get('settings') || {};

export function addSets(sets) {
	for (let i = 0; i < sets.length; i++) {
		settingsDefaults(sets[i].fields);
	}

	function settingsDefaults(fields) {
		let childs = [];
		for (let i = 0; i < fields.length; i++) {
			const st = fields[i];
			childs.push(st.name);
//					console.log('defaults', st.name);
			if (typeof settingsValues[st.name] === 'undefined') {
				settingsValues[st.name] = st.value;
			}
			let subsChilds = [];
			if (st.inputs) {
				subsChilds = settingsDefaults(st.inputs).concat(subsChilds);
			}
			if (st.subs) {
				subsChilds = settingsDefaults(st.subs).concat(subsChilds);
			}
			if (st.fields) {
				subsChilds = settingsDefaults(st.fields).concat(subsChilds);
			}

			if (subsChilds.length && st.name) {
				deps[st.name] = subsChilds;
				childs = subsChilds.concat(childs);
			}
		}
		return childs;
	}
}

export function drawSets(sets) {
	const $sets = elements.getTabInner('sets');
	let html = '';
	for (let i = 0; i < sets.length; i++) {
		const st = sets[i];
		html +=
			'<div class="">' +
				'<div class="sets-header">' + (st.title || '') + '</div>' +
				drawSetsGroup(st.fields) +
			'</div>';
	}
	html = '<div class="settings-form form-horizontal">' + html + '</div>';
	$sets.append(html);
	$sets.find('input').each(function() {
		const $input = $(this);
		const name = $input.data('name');
		const value = $input.is('[type="checkbox"]') ? $input.prop('checked') : $input.val();
		const isDisabled = $input.closest('.input-wrap').hasClass('disabled');
		checkDependences(name, !isDisabled && value);
	});
}

export function init() {
	const $sets = elements.getTabInner('sets');

	drawSets(setsGame);

	$sets
		.on('change', 'input', function() {
			const $input = $(this);
			const name = $input.data('name');
			let value = $input.is('[type="checkbox"]') ? $input.prop('checked') : $input.val();
			if ($input.data('type') === 'num') { value = +value; }
			settingsValues[name] = value;
			const isDisabled = $input.closest('.input-wrap').hasClass('disabled');
			checkDependences();
			publish('settingsChange', name, value, isDisabled);
			log.set('settings', settingsValues);
		});
}

function drawSetsGroup(fields) {
//			console.log('drawSetsGroup', sets);
	let html = '';
	for (let i = 0; i < fields.length; i++) {
		const st = fields[i];

		let inputsHtml = '';
		if (st.inputs) {
			inputsHtml = ' ' + st.inputs.map(drawInput).join('');
		}
		const label =
			'<div class="input-wrap ' + (st.isToggle ? 'checkbox' : '') + '">' +
				'<label>' +
					drawInput(st) +
					st.label +
				'</label>' +
				inputsHtml +
			'</div>';


		html +=
			'<div class="sets' + (st.isInline ? ' sets-inline' : '') + '">' +
				'<div class="sets-title">' +
					label +
					(st.note ? '<div class="note-block">' + st.note + '</div>' : '') +
				'</div>' +
				(st.subs ? drawSetsGroup(st.subs) : '') +
			'</div>';
	}
	log.set('settings', settingsValues);

	return html;

	function drawInput(st) {
		if (typeof settingsValues[st.name] === 'undefined') {
			settingsValues[st.name] = st.value;
		}
		let html = '';
		if (st.isToggle || st.type === 'checkbox') {
			html = '<input type="checkbox" data-name="' + st.name + '""' + (settingsValues[st.name] ? ' checked' : '') + '> ';
		} else if (st.type === 'text' || st.type === 'num') {
			html = '<input type="text" class="input-tiny input-tiny-' + st.type + '"' +
				' data-name="' + st.name + '"' +
				(' data-type="' + st.type + '"') +
				(settingsValues[st.name] ? ' value="' + settingsValues[st.name] + '"' : '') + '>';
			if (st.addOn) {
				html = '<div class="input-wrap input-append">' + html + '<span class="add-on">' + st.addOn + '</span></div>';
			} else {
				html = '<div class="input-wrap input-wrap-inline">' + html + '</div>';
			}
		}
		return html;
	}
}
