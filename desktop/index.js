const open = require('open');
const notifier = require('node-notifier');

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

mongoose.Promise = require('bluebird');

// Timer : https://nodejs.org/ko/docs/guides/timers-in-node/

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");

    // 우선 한번 실행하고
    pollArchive();

    // interval단위 실행
    setInterval(pollArchive, 10000);
});


function pollArchive(count = 1) {
    archiveSchema.find({read: null}, function(err, archives){
        if(err) {
            return console.log({error: 'database failure'});
        }

        console.log(JSON.stringify(archives));

        archives.forEach(archive => {
		    //console.log(archive.title + ':' + archive.link)
		    notifier.notify({
                title: archive.title,
                message: archive.link,
                sound: true,
                wait: true
            });
        })
    }).skip(0).limit(count);
}

//https://www.npmjs.com/package/node-notifier 참고
notifier.on('click', function (notifierObject, archive) {
    console.log(archive.title + ':' + archive.message);
    archiveSchema.findOne({read: null, "link":archive.message}, function(err, dbArchive)  {
        if(err) {
            return console.log({error: 'database failure'});
        }

        dbArchive.read = true;
        var promise = dbArchive.save();
        promise.then(function(doc){
            console.log("read success" + doc);
            open(dbArchive.link);
        });
    });
});

var promise = mongoose.connect('mongodb://localhost/test_crawler', {
    useMongoClient: true
});

// DEFINE MODEL
var archiveSchema = require('./models/archive');
