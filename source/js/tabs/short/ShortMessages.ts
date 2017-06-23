import {createTab} from '../tabs';
import {actsByIds, actToHtmlShort, actToHtmlDefault} from '../../utils/phraseToHtml';


/**
 * @typedef {[number, string, string, number, object]} Message - сообщения журнала из API
 */

export default class ShortMessages {
	tab = createTab('кратко');

	private $root: JQuery;
	private $list: JQuery;
	private $prevGroup: JQuery|null;

	constructor() {
		this.$root = this.tab.$content;

		this.$list = $(`<ul class="unstyled pgf-log-list"></ul>`).appendTo(this.$root);
		this.$prevGroup = null;
	}

	addMessages(messages: Message[]) {
		for (let i = 0; i < messages.length; i++) {
			const message = messages[i];
			this.addMessage(message);
		}
	}

	addMessage(message: Message) {
		const act = actsByIds[message[MSG.PhraseId]];
		const html = act
			? actToHtmlShort(act, message)
			: actToHtmlDefault(message);

		const type = act && act.type || 'block';

		if (type === 'inline') {
			if (!this.$prevGroup) {
				this.$prevGroup = this.createRecord(html, true);
			} else {
				this.addToRecord(html, this.$prevGroup);
			}
		} else {
			this.createRecord(html, false);
			this.$prevGroup = null;
		}
	}

	clear() {
		this.$list.html('');
	}

	private createRecord(html: string, isShort: boolean) {
		return $(
			`<li class="log-record ${isShort ? 'ext' : ''}">` +
				`<div class="time">↓</div>` +
				`<div class="pgf-message message">` +
					`<span class="submessage">` +
						`${html}` +
					`</span>` +
				`</div>` +
			`</li>`
		).prependTo(this.$list);
	}

	private addToRecord(html: string, $record: JQuery) {
		$record.find('.submessage').prepend(html);
	}
}
