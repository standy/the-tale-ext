var $ = require('jquery');
var pgf = require('pgf');
var widgets = window.widgets;

var mapData = require('./mapData');

function showMapDialogById(id) {
	var place = mapData.places[id];
	showMapDialog(place.pos.x, place.pos.y);
}

function showMapDialog(x, y) {
	pgf.ui.dialog.Create({
		fromUrl: pgf.urls['game:map:cell_info'](x, y),
		OnOpened: function(dialog) {
			var jQuery = $;
			pgf.base.InitializeTabs('game-map-cell-info', 'map',
				[[jQuery('.pgf-cell-description-button', dialog), 'description'],
					[jQuery('.pgf-cell-persons-button', dialog), 'persons'],
					[jQuery('.pgf-cell-place-parameters-button', dialog), 'place-parameters'],
					[jQuery('.pgf-cell-place-demographics-button', dialog), 'place-demographics'],
					[jQuery('.pgf-cell-place-bills-button', dialog), 'place-bills'],
					[jQuery('.pgf-cell-place-modifiers-button', dialog), 'place-modifiers'],
					[jQuery('.pgf-cell-place-chronicle-button', dialog), 'place-chronicle'],
					[jQuery('.pgf-cell-building-button', dialog), 'building'],
					[jQuery('.pgf-cell-map-button', dialog), 'map'],
					[jQuery('.pgf-cell-debug-button', dialog), 'debug']]);
			jQuery('[rel="tooltip"]', dialog).tooltip(pgf.base.tooltipsArgs);

			if (widgets.abilities) {
				widgets.abilities.UpdateButtons();
				widgets.abilities.RenderAbility(pgf.game.constants.abilities.building_repair);
				jQuery('.angel-ability', dialog).toggleClass('pgf-hidden', false);
			}
		},
		OnClosed: function(dialog) {
			pgf.base.HideTooltips(dialog);
		}
	});
}


module.exports = showMapDialogById;
