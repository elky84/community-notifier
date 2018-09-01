module.exports = function(app, Archive)
{
    // GET ALL ARCHIVES
    app.get('/api/archives', function(req,res){
        Archive.find(function(err, archives){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(archives);
        })
    });

    // GET SINGLE ARCHIVE
    app.get('/api/archives/:archive_id', function(req, res){
        Archive.findOne({_id: req.params.archive_id}, function(err, archive){
            if(err) return res.status(500).json({error: err});
            if(!archive) return res.status(404).json({error: 'archive not found'});
            res.json(archive);
        })
    });

    // GET ARCHIVE BY AUTHOR
    app.get('/api/archives/author/:author', function(req, res){
        Archive.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, archives){
            if(err) return res.status(500).json({error: err});
            if(archives.length === 0) return res.status(404).json({error: 'archive not found'});
            res.json(archives);
        })
    });

    // CREATE ARCHIVE
    app.post('/api/archives', function(req, res){
        var archive = new Archive();
        archive.title = req.body.title;
        archive.type = req.body.type;
        archive.link = req.body.link;
        archive.count = req.body.count;
        archive.date = new Date(req.body.date);

        archive.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});
        });
    });

    // UPDATE THE ARCHIVE
    app.put('/api/archives/:archive_id', function(req, res){
        Archive.update({ _id: req.params.archive_id }, { $set: req.body }, function(err, output){
            if(err) res.status(500).json({ error: 'database failure' });
            console.log(output);
            if(!output.n) return res.status(404).json({ error: 'archive not found' });
            res.json( { message: 'archive updated' } );
        })
    /* [ ANOTHER WAY TO UPDATE THE ARCHIVE ]
            Archive.findById(req.params.archive_id, function(err, archive){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!archive) return res.status(404).json({ error: 'archive not found' });

            if(req.body.title) archive.title = req.body.title;
            if(req.body.author) archive.author = req.body.author;
            if(req.body.published_date) archive.published_date = req.body.published_date;

            archive.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'archive updated'});
            });

        });
    */
    });

    // DELETE ARCHIVE
    app.delete('/api/archives/:archive_id', function(req, res){
        Archive.remove({ _id: req.params.archive_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "archive not found" });
            res.json({ message: "archive deleted" });
            */

            res.status(204).end();
        })
    });
     
}
