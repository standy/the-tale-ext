import EventEmitter from '../utils/EventEmitter';

type Tab = {
	$tab: JQuery;
	$content: JQuery;
	onTabChange: EventEmitter<boolean>;
};


const $root = $('#pgf-diary-container').parent().parent();
const $navTabs = $root.children('.nav-tabs');
const $tabContent = $root.children('.tab-content');


const $tab = $(`<li><a href="#pgf-ext-container" class="pgf-ext-tab-button" data-toggle="tab">e</a></li>`).prependTo($navTabs);
const $container = $(
	`<div class="tab-pane log-block ext-container" id="pgf-ext-container">
		<div class="ext-tabs"></div>
	</div>`
).appendTo($tabContent);
$tab.addClass('active').siblings().removeClass('active');
$container.addClass('active').siblings().removeClass('active');

const $extTabs = $container.find('.ext-tabs');

const tabs: Tab[] = [];

function createTab(title: string) {
	const $tab = $(`<span class="ext-tab">${title}</span>`).appendTo($extTabs);
	const $content = $(`<div class="ext-content"></div>`).appendTo($container);
	const tab: Tab = {
		$tab: $tab,
		$content: $content,
		onTabChange: EventEmitter<boolean>(),
	};

	tabs.push(tab);

	$tab.on('click', () => {
		toggleTab(tab);
	});

	if (tabs.length === 1) toggleTab(tab);

	return tab;
}

function toggleTab(tab: Tab) {
	tabs.forEach(t => {
		const isActive = t === tab;
		t.onTabChange.emit(isActive);
		t.$content.toggleClass('active', isActive);
		t.$tab.toggleClass('active', isActive);
	});
}


export {createTab};
