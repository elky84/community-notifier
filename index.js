const open = require('open');
const notifier = require('node-notifier');

let Parser = require('rss-parser');
let parser = new Parser();

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

// String
//notifier.notify('Message');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/test_crawler');

// DEFINE MODEL
var archive = require('./models/archive');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]

var port = process.env.PORT || 8080;

// [CONFIGURE ROUTER]
var router = require('./routes')(app, archive);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});

// (async () => {
// 	let feed = await parser.parseURL('https://elky84.github.io/feed.xml');
// 	console.log(feed.title);
// 	feed.items.forEach(item => {
// 		//console.log(item.title + ':' + item.link)
// 		notifier.notify({
// 			title: item.title,
// 			message: item.link,
// 			sound: true,
// 			wait: true
// 		}, function (err, response) {
// 			if (err != null && err != "") {
// 				console.log(err)
// 			} else {
// 				console.log(item.title + ':' + item.link)
// 				open(item.link);
// 			}
// 		});
// 	});
// })();