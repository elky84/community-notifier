const open = require('open');
const notifier = require('node-notifier');

let Parser = require('rss-parser');
let parser = new Parser();

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var http        = require('http');

// String
//notifier.notify('Message');

mongoose.Promise = require('bluebird');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");

    pollArticle();
});

function pollArticle() {
    archive.find({read: null}, function(err, archives){
        if(err) return console.log({error: 'database failure'});
        console.log(JSON.stringify(archives));

        archives.forEach(article => {
		    //console.log(article.title + ':' + article.link)
		    notifier.notify({
                title: article.title,
                message: article.link,
                sound: true,
                wait: true
            });
        })
    }).skip(0).limit(1);
}

//https://www.npmjs.com/package/node-notifier 참고
notifier.on('click', function (notifierObject, article) {
    console.log(article.title + ':' + article.message);
    archive.findOne({read: null, "link":article.message}, function(err, dbArticle)  {
        if(err) return console.log({error: 'database failure'});

        dbArticle.read = true;
        var promise = dbArticle.save();
        promise.then(function(doc){
            console.log("read success" + doc);
            open(dbArticle.link);
            pollArticle();
        });
    });
});

var promise = mongoose.connect('mongodb://localhost/test_crawler', {
    useMongoClient: true
});

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

// (async () => {
//     var options = {
//         hostname: 'localhost',
//         port: 8080,
//         path: '/api/archives'
//     };
    
//     function handleResponse(response) {
//     var serverData = '';
//     response.on('data', function (chunk) {
//         serverData += chunk;
//     });
//     response.on('end', function () {
//         console.log("received server data:");
//         console.log(serverData);
//     });
//     }
    
//     http.request(options, function(response){
//     handleResponse(response);
//     }).end();
// })();