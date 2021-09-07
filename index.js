const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5055

app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send("It's Working")
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqdtk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const articleCollection = client.db("fourteenFortyMinutesNews").collection("articles");
    


    console.log('database connected')

    app.post('/addAnArticle', (req, res) => {
        const newArticle = req.body;
        articleCollection.insertOne(newArticle)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })


    })

    app.get('/articles', (req, res) => {
        articleCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/article', (req, res) => {
        console.log("category", req.query.category);
        articleCollection.find({category: req.query.category})
        .toArray((err, documents) => {
            console.log(documents)
          res.send(documents);
        })
      })
    
});
app.listen(port)