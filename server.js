const express = require('express');
const ENV = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient
const MONGOdb = process.env.MONGO

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
        MongoClient.connect(MONGOdb, (err, db) => {
            if (err) throw err;
            db.db("CRUDapp")
                .collection("books")
                .find({}, {projection: {title:1, authors:1}})
                .toArray((err, result) => {
                    if (err) throw err;
                    console.log(result);
                    res.send(result)
                    db.close();
                });
        });
    } else if (req.query.title) {
        let query = {title: req.query.title}

        MongoClient.connect(MONGOdb, (err, db) => {
            if (err) throw err;
            let dbo = db.db("CRUDapp");
            dbo.collection("books")
                .findOne(query, {projection: {_id:0, title:1, authors:1}}, function(err, result) {
                if (err) throw err;
                console.log(result);
                res.send(result)
                db.close();
            });
        });
    }
})

// -----------------------------------------PETICIÓN POST

server.post('/books/create', async (req, res) => {
    let newBook = req.body
    await MongoClient.connect(MONGOdb, (err, db) => {
        if (err) throw err;
        db.db("CRUDapp")
            .collection("books")
            .insertOne(newBook, (err, result) => {
                if (err) throw err;
                // console.log(result);
                res.send("Book was added correctly")
                db.close();
            });
    })
})

// -----------------------------------------PETICIÓN DELETE

server.delete('/books/delete', async (req, res) => {
    let deleted = req.body
    await MongoClient.connect(MONGOdb, (err, db) => {
        if (err) throw err;
        db.db("CRUDapp")
            .collection("books")
            .deleteOne(deleted, (err, result) => {
                if (err) throw err;
                // console.log(result);
                res.send("Book was deleted correctly")
                db.close();
            });
    })
})