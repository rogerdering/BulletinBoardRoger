var http = require('http');
var pg = require('pg');

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
pg.connect(connectionString, function (err, client, done) {
	client.query('select * from messages', function (err, result) {
		if(err) {
			throw err;
		}
		console.log(result.rows);
		done();
		pg.end(); // the client will idle for another 30 seconds, temporarily preventing the app from closing, unless this function is called
	});
});