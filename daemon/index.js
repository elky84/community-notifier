var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var axios       = require('axios')
var moment      = require('moment')
var fs          = require('fs');


var config      = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
console.log("config: " + JSON.stringify(config));

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

function pollArticle(count = 10) {
    archiveModel.find({type: "RuliwebHotdeal", notify: null}, function(err, archives){
        if(err) {
            return console.log({error: 'database failure'});
        }

        console.log(JSON.stringify(archives));

        messages = []
        archives.forEach(archive => {
		    archiveModel.findOne({"_id":archive._id}, function(err, dbArchive)  {
                if(err) {
                    return console.log({error: 'database failure'});
                }
        
                dbArchive.notify = true;
                var promise = dbArchive.save();
                promise.then(function(doc){
                    // console.log("notify process success" + doc);
                    messages.push(archive.title + " -> " + archive.link + " -> " + moment(archive.date).format('YYYY-MM-DD HH:mm'));

                    if(messages.length == archives.length) {
                        message = {"text": messages.join("\n")}
                        axios.post(config["hook_url"], message).then((result) => {
                            console.log(result);
                        });    
                    }
                });
            });

        })


    }).skip(0).limit(count);
}

var promise = mongoose.connect('mongodb://localhost/test_crawler', {
    useMongoClient: true
});

// DEFINE MODEL
var archiveModel = require('./models/archive');

