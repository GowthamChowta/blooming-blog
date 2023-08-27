const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Blog  = require('./Schema/blogSchema');
const {body, validationResult} = require('express-validator')


//TODO: Is there a way to put a flag for a blog as isActive instead of just deleting the blog.
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  'mongodb://localhost/mydatabase', 
  { useNewUrlParser: true }
);

app.post('/addBlog', async (req, res) => {
  try {
    const { title, author, date, isActive, content } = req.body;
    const newBlog = new Blog({ title, author, date, isActive, content });
    await newBlog.save();
    res.status(201).json({ message: 'Item added successfully', item: newBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error: error.message });
  }
});

app.put('/updateBlog/:id', 
[
  body('title').notEmpty(),
  body('author').notEmpty(),
  body('date').notEmpty(),
  body('isActive').notEmpty(),
  body('content').notEmpty(),

], async (req, res) => {
  try {

    // Validation check if all fields are satisfied
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(500).json({errors: errors.array()});
    }

    const { id } = req.params;
    const { title, author, date, isActive, content } = req.body;

    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: { title, author, date, isActive, content } },
      { new: true }
    );

    if (!updateBlog) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item updated successfully', item: updateBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

app.get('/getBlog', async (req,res)=> {
      try{
        const getBlogs = await Blog.find();
        res.json(getBlogs);
      }catch(error){
        res.status(500).json({message: 'error fetching items', error: error.message});
      }
})

app.delete('/removeBlog/:id', async (req,res)=> {
  try{
    const {id} = req.params;
    const deleteBlog = await Blog.findByIdAndDelete(
      id
    )
    if (!deleteBlog) {
      return res.status(404).json({message: "item not found"})
    }

    res.json({message: "Item deleted successfully", item: deleteBlog});
  }
  catch(error){
    res.status(500).json({message: "failed to delete", error: error.message})
  }
})

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
 