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

// NEW route - form for new post
app.get('/blogs/new', function(req, res){
    res.render('new')
})

// CREATE route - adds new post to DB
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

// SHOW route - more details on a single post
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.render('show', {blog: foundBlog})
        }
    })
})

// EDIT route - edit form prefilled with existing data
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

// UPDATE route - edits and updates existing post on DB
app.put('/blogs/:id', function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

// DELETE route - deletes post from DB
app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs')
        }
    })
})

// Start Localhost Server
app.listen(3000, function(){
    console.log("Server is running...")
})
