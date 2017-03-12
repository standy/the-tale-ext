import {createTab} from '../tabs';
import EventEmitter from '../../utils/EventEmitter';
import clientStorage from '../../utils/clientStorage';
import {setsAuto} from './sets-auto';
import {setsGame} from './sets-game';

export default class Settings {
	tab = createTab('<span class="glyphicon glyphicon-cog" title="Настройки &laquo;The Tale Extended&raquo;"></span>');
	$root = this.tab.$content;
	settingsValues = clientStorage.get('settings') || {};
	deps: PlainObject<string[]> = {};

	onSettingsChange = EventEmitter<SettingsData>();

	constructor() {
		this.addSets(setsGame);
		// this.addSets(setsAuto);
	}


	/*initSettingsForAuto() {
		this.addSets(setsAuto);
		this.drawSets(setsAuto);

		this.$root
			.on('click', '[data-auto]', function(e) {
				e.preventDefault();
				const type = $(this).data('auto');
				const types = {
					rest: {
						autohelpIdle: 1,
						autohelpDead: 1,
						autohelpHp: 1,
						autohelpHpBoss: 1,
						autohelpEnergy: 1,
						autohelpEnergyFight: 0,
						autohelpEnergyRest: 0,
						autohelpEnergyWalk: 1,
						autohelpEnergyTradeMed: 1,
					},
					fight: {
						autohelpIdle: 0,
						autohelpDead: 0,
						autohelpHp: 1,
						autohelpHpBoss: 0,
						autohelpEnergy: 1,
						autohelpEnergyFight: 1,
						autohelpEnergyRest: 0,
						autohelpEnergyWalk: 0,
						autohelpEnergyTradeMed: 0,
					},
				};
				const conf = types[type];
				for (const key in conf) {
					if (conf.hasOwnProperty(key)) {
						const value = !!conf[key];
						const $input = getSettingInput(key);
						$input.prop('checked', value).trigger('change');
					}
				}
			});
	}*/



	addSets(sets: Sets[]) {
		let html = '';
		for (let i = 0; i < sets.length; i++) {
			const st = sets[i];

			this.settingsDefaults(st.fields);

			html +=
				`<div class="">
					<div class="sets-header">${st.title || ''}</div>
					${this.drawSetsGroup(st.fields)}
				</div>`;
		}
		const $sets = $(
			`<div class="settings-form form-horizontal">${html}</div>`
		).appendTo(this.$root);

		$sets.find('input')
			.each((i, input) => {
				const $input = $(input);
				const data = Settings.getData($input);
				this.checkDependencies(data);
			})
			.on('change', e => {
				const $input = $(e.target);
				const data = Settings.getData($input);
				this.checkDependencies(data);
				this.settingsValues[data.name] = data.value;
				this.onSettingsChange.emit(data);
				clientStorage.set('settings', this.settingsValues);
				console.log('??', this.settingsValues)
			});


	}

	static getData($input: JQuery): SettingsData {
		const name = $input.data('name');
		const isDisabled = $input.closest('.input-wrap').hasClass('disabled');
		let value;
		if (isDisabled) {
			value = null;
		} if ($input.is('[type="checkbox"]')) {
			value = $input.prop('checked');
		} else if ($input.data('type') === 'num') {
			value = +$input.val();
		} else {
			value = $input.val();
		}

		return {name, value};
	}

	/**
	 * Проставляет дефолтные значения и заполняет зависимости
	 */
	private settingsDefaults(fields?: SetField[] | SetInput[]): string[] {
		if (!fields) return [];
		let childs: string[] = [];
		for (let i = 0; i < fields.length; i++) {
			const st = fields[i];
			if (st.name) {
				childs.push(st.name);
				console.log('>', st.name, st.value)
				this.settingsValues[st.name] = st.value;
			}

			const subsChilds: string[] = [
				...this.settingsDefaults((st as SetField).inputs),
				...this.settingsDefaults((st as SetField).subs),
			];

			if (subsChilds.length && st.name) {
				this.deps[st.name] = subsChilds.filter(x => x);
				childs = subsChilds.concat(childs);
			}
		}
		return childs as string[];
	}


	drawSetsGroup(fields: SetField[]) {
		let html = '';
		for (let i = 0; i < fields.length; i++) {
			const st = fields[i];

			const label =
				`<div class="input-wrap ${st.isToggle ? 'checkbox' : ''}">
					<label>${this.drawInput(st as any as SetInput)}${st.label}</label>
					${st.inputs
						? st.inputs.map(this.drawInput).join('')
						: ''
					}
				</div>`;


			html +=
				`<div class="sets${st.isInline ? ' sets-inline' : ''}">
					<div class="sets-title">
						${label}
						${st.note
							? '<div class="note-block">' + st.note + '</div>'
							: ''
						}
					</div>
					${st.subs ? this.drawSetsGroup(st.subs) : ''}
				</div>`;
		}
		clientStorage.set('settings', this.settingsValues);

		return html;
	}

	drawInput = (st: SetInput) => {
		const settingsValues = this.settingsValues;
		let html = '';
		if ((st as any).isToggle || st.type === 'checkbox') {
			html = `<input type="checkbox" data-name="${st.name}" ${settingsValues[st.name] ? 'checked' : ''}> `;
		} else if (st.type === 'text' || st.type === 'num') {
			html =
				`<input type="text"
				   class="input-tiny input-tiny-${st.type}" 
				   data-name="${st.name}" 
				   data-type="${st.type}"
				   ${settingsValues[st.name]
						? ' value="' + settingsValues[st.name] + '"'
						: ''
					}>`;
			if (st.addOn) {
				html =
					`<div class="input-wrap input-append">${html}<span class="add-on">${st.addOn}</span></div>`;
			} else {
				html = `<div class="input-wrap input-wrap-inline">${html}</div>`;
			}
		}
		return html;
	};

	checkDependencies(settingsData: SettingsData) {
		const key = settingsData.name;
		const value = settingsData.value;
		if (!this.deps[key]) return;
		this.deps[key].forEach(keyName => {
			getSettingInput(keyName).closest('.input-wrap').toggleClass('disabled', !value);//.prop('disabled', !value);
		});
	}

}


function getSettingInput(key: string) {
	return $(`input[data-name="${key}"]`);
}
