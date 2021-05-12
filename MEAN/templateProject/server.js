const express = require("express");
const session = require("express-session");
const app = express();
const mongoose = require('mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(session({secret:'whatisIanupto?'}))
app.use(express.static(__dirname + "/static"));
mongoose.connect('mongodb://localhost/whatev_name_of_db',{useNewUrlParser:true});
//change the name of the db & Schema!!!
const WhatevSchema = new mongoose.Schema({
    whatevkey1: String,
    whatevkey2: Number,
    created_at: {type: Date, default: Date.now},
})    
const Whatev = mongoose.model('Whatev',WhatevSchema)

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

// root route to render
app.get('/', function(req, res) {
    res.render("index");
})

// route for putting user (could be anything) post data into session
app.post('/process_user', function(req, res) {
    // console.log("POST DATA", req.body);
    req.session.whatev = req.body.whatev;
    res.redirect('/aroutetodisplaysomething');
})

//render session data (if not private/sensitive!)
app.get('/aroutetodisplaysomething', function(req,res){
    if(!session.whatev){
        session.whatev="notnowfoo'!"
    }
    res.render("ejsfilename",{
        whatev: req.session.whatev,
        whatev2: req.session.whatev2,
    });
})

//route for adding data to db from post
app.post('/arouteforprocessingdata', function(req,res){
    var whatev = new Whatev();
    whatev.key1 = req.body.form_input_name1;
    whatev.key2 = req.body.form_input_name2;
    whatev.save();
        .then(function (whatevdata){
            console.log('this promise was met and may have code following, especially to redirect', whatevdata);
            res.redirect('/somewhere')
        })
        .catch(function(err){
            console.log('err:',err);
        })
})

// route for rendering db data
app.get('/thatssomeroute', function(req, res) {
    Quote.find()
        .then(function (whatevdata){
            whatev = whatevdata;
            // console.log(whatev);
            res.render('thatejsfile',{
                key1:whatev.blegh1,
                key2:whatev.blegh2,
                key3:whatev.created_at,
        })
        //or .then(function (whatevdata){res.render('thatejsfile',{whatev:whatevdata[0]})
        .catch(function (err){
            console.log(err);
        })
    });
})

//render edit 
app.get('/whatev/edit/:id', function(req, res) {
    Whatev.find({_id:req.params.id})
        .then(function(whatevdata){
            res.render('edit',{whatev:whatevdata[0]});
        })
        .catch(function(err){
            console.log('****errors: ',err)
        })
})

//process edit
app.post('/whatev/:id', function(req,res){
    //update document from post 
    Whatev.updateOne({_id:req.params.id},{$set:{
        whatevkey1: req.body.whatev1,
        whatevkey2: req.body.whatev2,
    }})
        .then(function(whatevdata){
            res.redirect(`/whatev/${req.params.id}`);
        })
        .catch(function(err){
            console.log('****errors: ',err)
        })
})



app.listen(8000, function() {
    console.log("listening to mantis shrimp on port 8000");
});
