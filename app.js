import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid"; // for generating unique IDs for the blog posts

const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware to serve static files from 'public' directory and parse request bodies
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory array to store posts
let posts = [];

// Route for the home page - lists all posts
app.get('/', (req, res) => {
  res.render('pages/home', { posts: posts });
});


// Route to display the form for creating a new post
app.get('/create', (req, res) => {
  res.render('pages/create');
});

// Route to handle the submission of the form for creating a new post
app.post('/create', (req, res) => {
  const newPost = {
    id: uuidv4(), // Unique ID for the post
    title: req.body.title,
    content: req.body.content
  };
  posts.push(newPost); // Add new post to array
  res.redirect('/'); // Redirect to home page to display all posts
});

// Route to display the form to edit an existing post
app.get('/edit/:id', (req, res) => {
  const post = posts.find(post => post.id === req.params.id);
  if (post) {
    res.render('pages/edit', { post: post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Route to handle the submission of the form for editing an existing post
app.post('/edit/:id', (req, res) => {
  const index = posts.findIndex(post => post.id === req.params.id);
  if (index !== -1) {
    posts[index].title = req.body.title;
    posts[index].content = req.body.content;
    res.redirect('/');
  } else {
    res.status(404).send('Post not found');
  }
});

// Route to handle the deletion of a post
app.post('/delete/:id', (req, res) => {
  posts = posts.filter(post => post.id !== req.params.id);
  res.redirect('/');
});


// Start the server
app.listen(port, () => {
  console.log(`Blog app listening at http://localhost:${port}`);
});

