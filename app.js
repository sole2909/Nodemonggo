var express = require('express')
var hbs = require('hbs')

var app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'hbs')

var url = 'mongodb://localhost:27017'; // CẦN ĐỊA CHỈ ĐỂ KẾT NỐI
var MongoClient = require('mongodb').MongoClient;

app.post('/update', async (req, res) => {
    let id = req.body.txtId;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let productcodeInput = req.body.txtProductcode;
    let colorInput = req.body.txtColor;
    let newValues = { $set: { name: nameInput, price: priceInput, productcode: productcodeInput, color: colorInput } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("technology");
    await dbo.collection("product").updateOne(condition, newValues);
    res.redirect('/');
})

app.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("technology");
    let productToEdit = await dbo.collection("product").findOne(condition);
    res.render('edit', { product: productToEdit })
})

app.get('/delete', async (req, res) => { //delrte san pham
    let id = req.query.id; // lay id san phan
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("technology");

    await dbo.collection("product").deleteOne(condition);
    res.redirect('/')
})

app.get('/', async (req, res) => { // DÙNG async để đồng bộ
    let client = await MongoClient.connect(url);
    let dbo = client.db("technology");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('index', { model: results })
})

app.post('/search', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("technology");
    let nameInput = req.body.txtName; // dungf để lấy tên 
    let searchCondition = new RegExp(nameInput, 'i')//lấy tên không phân biệt chữ hoa chữ thường
    let results = await dbo.collection("product").find({ name: searchCondition }).toArray();//tìm văn bản
    res.render('index', { model: results })
})

app.get('/insert', (req, res) => {
    res.render('newProduct')
})

app.post('/doInsert', async (req, res) => {
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var productcodeInput = req.body.txtProductcode;
    var colorInput = req.body.txtColor;
    var newProduct = { productName: nameInput, price: priceInput, id: productcodeInput, color: colorInput };

    let client = await MongoClient.connect(url);
    let dbo = client.db("technology");
    await dbo.collection("product").insertOne(newProduct);
    res.redirect('/')
})


const PORT = process.env.PORT || 3000
app.listen(PORT);
console.log('server is running at 3000')

