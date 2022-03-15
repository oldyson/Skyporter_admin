export const environment = {
	production: true,
	version: '3.2.44',
	lastUpdate: '13/07',
	appName: 'jpcc',
	adminPass: 'jpcc567!',
	timeZone: 7,
	apiUrl: 'https://skyporter.myjpcc.org/api/',
	// apiUrl: 'https://dev-jpcc-mobile-api.skyporter.id/api/',
	enableDebug: false,
	pusher: {
		key: '2b7a847e874afb5b4aa3',
		cluster: 'ap1'
	}
};

// untuk build
// ng build --prod --aot --vendor-chunk --common-chunk --delete-output-path --buildOptimizer
