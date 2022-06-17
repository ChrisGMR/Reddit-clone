require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require("express/lib/response");
const { set } = require('mongoose');
const { redirect } = require('express/lib/response');
app.set("views", "./views")
app.set("view engine", "pug")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.static('images'))
app.use(bodyParser.json())
app.use(cookieParser())

// how can I make this secure--- so the database password is not shown? 
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
const user = db.collection("users")

// const checkIfSignIn = (req, res, next) =>{
//     if(req.cookies.username){
//         next()
//     }else{
//         res.send('Please Sign Up ya Sinner')
//     }
// }

//routes
//home page
app.get("/", (req,res) => {
    post.find().toArray().then(results => {
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
//take in the username and password. --- done
//find the user name, and compare password. --- done
//take the username and has in function ans add it to the data base 
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
    res.render("homepage") 
    
})
// for images asked to provide image link, the displaying the image in an img tag. 
// when logged out delete the cookie, and redirect to home page. 
// res.clearCookie("username") // this is how to clear a cookie.



//post page
app.get("/post", (req,res)=>{
    if(req.cookies.username){
        res.render('post')
    }else{
        res.send('Please Sign In ya Sinner')
    }
    
})
// sends back to homepage from post
app.post("/post", (req,res) => [
    post.insertOne(req.body).then(result => {
        res.redirect("/")
    })
])




app.listen(3000)