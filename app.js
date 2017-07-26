// APP CONFIG
const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        methodOverride = require('method-override')

mongoose.connect('mongodb://localhost/blog_app', {useMongoClient: true})
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))


// MONGOOSE/MODEL CONFIG
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
let Blog = mongoose.model('Blog', blogSchema)


// RESTFUL ROUTES
app.get('/', function(req, res){
    res.redirect('/blogs')
})

// INDEX route
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('Error!')
        } else {
            res.render('index', {blogs: blogs})
        }
    })
})

// NEW route
app.get('/blogs/new', function(req, res){
    res.render('new')
})

// CREATE route
app.post('/blogs', function(req, res){
    //Create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new')
        } else {
            // then redirect
            res.redirect('/blogs')
        }
    })
})

// SHOW route
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.render('show', {blog: foundBlog})
        }
    })
})

// EDIT route
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

// UPDATE route
app.put('/blogs/:id', function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs' + req.params.id)
        }
    })
})


// Start Localhost Server
app.listen(3000, function(){
    console.log("Server is running...")
})
