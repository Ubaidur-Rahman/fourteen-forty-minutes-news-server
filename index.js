const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5055

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send("It's Working")
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqdtk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const articleCollection = client.db("fourteenFortyMinutesNews").collection("articles");
    const adminCollection = client.db("fourteenFortyMinutesNews").collection("admins");
    


    app.post('/addAnArticle', (req, res) => {
        const newArticle = req.body;
        articleCollection.insertOne(newArticle)
            .then(result => {
                res.send(result.acknowledged)
            })
    })


    app.post('/makeAnAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.acknowledged)
            })
    })


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        console.log(email)
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                console.log(admins.length)
                res.send(admins.length > 0);
            })
    })



    app.get('/articleDetails/:id',(req,res)=>{
        articleCollection.find({ _id:ObjectId(req.params.id) })
          .toArray((err, documents) => {
            res.send(documents[0])
            console.log(err, documents)
      })
      
      })


    app.get('/articles', (req, res) => {
        articleCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                console.log(err)
            })
    });

    app.get('/articles/:category', (req, res) => {
        console.log("category", req.params.category);
        articleCollection.find({category: req.params.category})
        .toArray((err, documents) => {
            console.log(documents)
          res.send(documents);
        })
      })
    
});
app.listen(port)