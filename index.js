const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const product = require('./models/product');
const { findById } = require('./models/product');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((data) => {
        console.log(data)
        console.log("Well done mongo Connection successful")
    })
    .catch((err) => {
        console.log("Error Signaled!!!!")
        console.log(err);
    });

const categories = ['fruit', 'vegetable', 'dairy', 'baked good', 'fish', 'meat']
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
//app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride('_method'));
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen('8080', () => {
    console.log('listening to port 8080')
})

app.get('/product/new', (req, res) => {
    res.render('product/new', { categories });
})

app.get('/product/:id/edit', async (req, res) => {
    const { id } = req.params;
    const items = await product.findById(id);
    res.render('product/edit', { items, categories });
})
app.put('/product/:id', async (req, res) => {
    const { id } = req.params;
    const items = await product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/product/${items._id}`);

});
app.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    const deleteItem = await product.findByIdAndDelete(id);
    res.redirect('/product')
})

app.get('/product', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const items = await product.find({ category });
        res.render('product/index', { items, category })
    } else {
        const items = await product.find({});
        res.render('product/index', { items, category: 'All' })
    }

})
app.get('/product/:id', async (req, res) => {
    const { id } = req.params
    const items = await product.findById(id);
    console.log(items)
    res.render('product/show', { items })
})

app.post('/product', async (req, res) => {
    const newProduct = new product(req.body)
    await newProduct.save();
    res.redirect('/product')
})

