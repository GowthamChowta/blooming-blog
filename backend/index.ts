const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  'mongodb://localhost/mydatabase',
  { useNewUrlParser: true }
);

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('peoples', itemSchema);

app.post('/add-item', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newItem = new Item({ name, description });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error: error.message });
  }
});

app.put('/update-item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: { name, description } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

app.get('/get', async (req,res)=> {
      try{
        const allitems = await Item.find();
        res.json(allitems);
      }catch(error){
        res.status(500).json({message: 'error fetching items', error: error.message});
      }
})

app.delete('/remove/:id', async (req,res)=> {
  try{
    const {id} = req.params;
    const deleteItem = await Item.findByIdAndDelete(
      id
    )
    if (!deleteItem) {
      return res.status(404).json({message: "item not found"})
    }

    res.json({message: "Item deleted successfully", item: deleteItem});
  }
  catch(error){
    res.status(500).json({message: "failed to delete", error: error.message})
  }
})

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
 