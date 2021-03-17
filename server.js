const express = require('express');
const ENV = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient
const MONGOdb = process.env.MONGO
const optionsMongo = { useNewUrlParser: true, useUnifiedTopology: true } 

// { useUnifiedTopology: true } ???? 

const server =  express()
const listenPort = process.env.PORT || 8080;

server.use(express.urlencoded({extended:false}));
server.use(express.json());

// -------------------------------------LEVANTAR SERVIDOR

server.listen(listenPort,
    () => console.log(`Server started listening on ${listenPort}`))

// -----------------------------------------PETICIÓN GET

server.get('/books', (req, res) => {
    if (!req.query.title) {
        MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
            if (err) throw err;
            db.db("CRUDapp")
                .collection("books")
                .find({}, {projection: {title:1, authors:1}})
                .toArray((err, result) => {
                    if (err) throw err;
                    res.send(result)
                    db.close();
                });
        });
    } else if (req.query.title) {
        let query = {title: req.query.title}

        MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
            if (err) throw err;
            let dbo = db.db("CRUDapp");
            dbo.collection("books")
                .findOne(query, {projection: {_id:0, title:1, authors:1}}, function(err, result) {
                if (err) throw err;
                res.send(result)
                db.close();
            });
        });
    }
})

// -----------------------------------------PETICIÓN POST

server.post('/books/create', async (req, res) => {
    let newBook = req.body
    await MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
        if (err) throw err;
        db.db("CRUDapp")
            .collection("books")
            .insertOne(newBook, (err, result) => {
                if (err) throw err;
                res.send("Book was added correctly")
                db.close();
            });
    })
})

// -----------------------------------------PETICIÓN DELETE
// ***** NO FUNCIONA CON QUERY PARAMS. SÓLO QUERYSTRINGS

// server.delete('/books/delete/:id', (req, res) => {
//     let deleted = req.params.id
//     console.log(deleted);
//     MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
//         if (err) throw err;
//         db.db("CRUDapp")
//             .collection("books")
//             .deleteOne({_id: deleted}, (err, result) => {
//                 if (err) throw err;
//                 res.send("Book was deleted correctly")
//                 db.close();
//             });
//     })
// })

server.delete('/books/delete', (req, res) => {
    console.log(req.query);
    let deleted = { title: req.query.title }
    console.log(deleted);
    MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
        if (err) throw err;
        db.db("CRUDapp")
            .collection("books")
            .deleteOne(deleted, (err, result) => {
                if (err) throw err;
                res.send("Book was deleted correctly")
                db.close();
            });
    })
})

// -----------------------------------------PETICIÓN EDIT

server.put('/books/edit', (req, res) => {
    console.log(req.query);
    let edited = { title: req.query.title }
    let newVal = {$set: req.body }
    MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
        if (err) throw err;
        db.db("CRUDapp")
            .collection("books")
            .updateOne(edited, newVal, (err, result) => {
                if (err) throw err;
                res.send("Book was edited correctly")
                db.close();
            });
    })
})