//console.log('tables.js')
window.tables = (function(_tables) {
	"use strict";

	function makeSortable($table) {
		var $head = $table.find('thead tr').first();
		var $rows = $table.find('tbody tr');

		$head.children('th')
			.wrapInner('<span class="sort" />')
			.each(function(){

				var $th = $(this);
				var thIndex = $th.index();

				$th.children('.sort').click(function(){
					$th.siblings('th').children('.sort').attr('class', 'sort');
					var inverse = $(this).hasClass('sort-up');
					$(this).attr('class', 'sort sort-' + (inverse ? 'down' : 'up'));
					var arr = [];
					$rows.each(function() {
						var valueText = $.trim($(this).children('td').eq(thIndex).text());
						var value;

						value = (-valueText) || parseDate(valueText) || valueText;


						arr.push({
							$item: this,
							value: value
						})
					});
					arr.sort(function(a,b) {
						if (a.value == b.value) return 0;
						return a.value > b.value ?
							inverse ? 1 : -1
							: inverse ? -1 : 1;
					})
					arr.forEach(function(item) {
						$table.append(item.$item)
					})
				});

			});
	}


	$('.table').each(function() {
		makeSortable($(this))
	});

	$.extend(_tables, {
		makeSortable: makeSortable
	});

	function parseDate(str) { //02.04.2014 10:50
		var p = /(\d{2})\.(\d{2})\.(\d{4})\s(\d{1,2})\:(\d{2})/.exec(str);
		if (!p) return 0;
		return +new Date(p[3],p[2]-1,p[1],p[4],p[5]);
	}

	return _tables;
})({});
