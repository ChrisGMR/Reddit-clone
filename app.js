require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require("express/lib/response");
const { set } = require('mongoose');
const { redirect, get, cookie } = require('express/lib/response');
app.set("views", "./views")
app.set("view engine", "pug")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.static('images'))
app.use(bodyParser.json())
app.use(cookieParser())

 
const uri = (`${process.env.Atlas_URI}`);
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
const user = db.collection("users")

//routes
//home page
app.get("/", (req,res) => {
    post.find().sort({likes: -1}).toArray().then(results => {
        res.render('index', {post: results})
    })
})

//sign up
app.get('/signup', (req,res)=>{
    res.render('signup')
})
app.post('/signup', (req,res) => {
    user[req.body.username] = req.body.password
    res.cookie("username", req.body.username)
    //send a cookie back once signed up
    user.findOne(req.body).then(result => {
        if(result === null){
            user.insertOne(req.body).then(result => {
                res.alert("Thank you for signing up")
                res.render("/")
            })
        }else{
            res.send("user has already been taken")
        }
    })
})


//Log in 
app.get('/login', (req,res)=>{
    res.render('login')
})
app.post('/login', (req, res, next) =>{
    user.findOne(req.body).then(result =>{
        if(result === null){
            res.send("invalid log in Ya Sinner")
        }else{
            res.cookie("username", req.body.username)
            res.redirect("/homepage")
            
        }
    })
})
//log out
app.get("/logout", (req,res)=>{
    res.clearCookie("username",req.body.username)
    res.redirect("/")
})
//homepage route
app.get("/homepage", (req,res) =>{
    
    post.find().sort({likes: -1}).toArray().then(results => {
        res.render('homepage', {post: results})
        
    })
    
})
app.put("/upvote/:title", (req,res) =>{
    post.findOneAndUpdate({ title: req.params.title },
    {
      $inc: {
        "likes": 1,
      }
    },
    {
      upsert: true
    }
  ).then(result => {
    res.redirect("/homepage")
    }).catch(error => console.log(error))
})
app.put("/downvotes/:title", (req,res) =>{
    post.findOneAndUpdate({ title: req.params.title },
    {
      $inc: {
        "likes": -1,
      }
    },
    {
      upsert: true
    }
  ).then(result => {
    res.send(result)}
    ).catch(error => console.log(error))
})


//post page
app.get("/post", (req,res)=>{
    if(req.cookies.username){
        res.render('post')
    }else{
        res.render('Error')
    }
    
})
// sends back to homepage from post
app.post("/post", (req,res) => [
    post.insertOne(req.body).then(result => {
        res.redirect("/")
    })
])



app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Server is running.");
  });