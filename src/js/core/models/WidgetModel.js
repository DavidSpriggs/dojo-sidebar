define(['dojo/_base/declare', 'dojo/Stateful'], function (declare, Stateful) {
	return declare([Stateful], {
		id: null,
		widget: null,
		type: null,
		placeAt: null,
		className: null,
		tabOptions: {},
		options: {}
	});
});