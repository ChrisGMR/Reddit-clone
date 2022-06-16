require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require("express/lib/response")
app.set("views", "./views")
app.set("view engine", "pug")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.static('images'))
app.use(bodyParser.json())

const uri = `mongodb+srv://cmunoz:Ik7BmRyBIkVCGsyI@cluster0.jkfpm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
client.connect(err => {
    if(err){
        console.log('error')
    }else{
        console.log('Connected to MongoDB')
    }
  });

const db = client.db("reddit-clone")
const post = db.collection("posts")
//routes
app.get("/", (req,res) => {
    post.find().toArray().then(results => {
        res.render('index', {post: results})
    })
})
app.get("/post", (req,res)=>{
    res.render('post')
})
app.post("/post", (req,res) => [
    post.insertOne(req.body).then(result => {
        res.redirect("/")
    })
])




app.listen(3000)