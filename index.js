var express = require ( 'express' )
var http = require('http');
var pg = require('pg');
var jade = require('jade');
var bodyParser = require ( 'body-parser' )
var app = express ( )

app.use(bodyParser.urlencoded({ extended: true }));


app.set ( 'views', '.' )
app.set( 'view engine', 'jade' )

app.get ( '/', function ( request, response ) {
	var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			if (client) {
				done(client);
			}
			return;
		}
		client.query('select * from messages', function (err, result) {
			if (err) {
				done(client);
				return;
			} else {
				done();
			}
			console.log(result.rows)
			response.render ( "board", { 
				messages : result.rows
			} )
		} );
		
	} );
	
} )


app.get ( '/post', function ( request, response ) { 
	response.render ( "post", { 
	} )
} )

app.post ( '/post', function ( request, response ) {
	var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost:5432/bulletinboard';
	var data = {title: request.body.title, body: request.body.body};
	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			if (client) {
				done(client);
			}
			return;
		}
		console.log(request.body)
		client.query('insert into messages (title, body) values ($1, $2)', [data.title, data.body], function (err) {
			if(err) {
				throw err;
			}

			done();
			pg.end();
		} );
		response.redirect ( '/' )
	} )
} )

var server = app.listen ( 3000, function ( ) {
	console.log ( 'User App listening on port: ' + server.address ( ).port );
} )