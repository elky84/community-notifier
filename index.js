const open = require('open');
const notifier = require('node-notifier');

let Parser = require('rss-parser');
let parser = new Parser();

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var http        = require('http');

mongoose.Promise = require('bluebird');

// Timer : https://nodejs.org/ko/docs/guides/timers-in-node/

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");

    // 우선 한번 실행하고
    pollArticle();

    // interval단위 실행
    setInterval(pollArticle, 10000);
});


function pollArticle(count = 1) {
    archive.find({read: null}, function(err, archives){
        if(err) {
            return console.log({error: 'database failure'});
        }

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
    }).skip(0).limit(count);
}

//https://www.npmjs.com/package/node-notifier 참고
notifier.on('click', function (notifierObject, article) {
    console.log(article.title + ':' + article.message);
    archive.findOne({read: null, "link":article.message}, function(err, dbArticle)  {
        if(err) {
            return console.log({error: 'database failure'});
        }

        dbArticle.read = true;
        var promise = dbArticle.save();
        promise.then(function(doc){
            console.log("read success" + doc);
            open(dbArticle.link);
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

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});
